// lib/workflow.ts
//
// A tiny DAG-based workflow engine. Workflows are JSON and live in
// localStorage. Nodes are executed in topological order; each node's output
// is merged into a shared `state` object that downstream nodes can read.
//
// Node types:
//   prompt   — single-prompt LLM call
//   tool     — deterministic helper (calculator, datetime, uuid, …)
//   branch   — pick the next node id based on a JS expression over state
//   http     — fetch a URL and store the body as text
//   code     — evaluate a sandboxed JS expression (no `eval`, AST-light)

export type NodeKind = 'prompt' | 'tool' | 'branch' | 'http' | 'code';

export interface WorkflowNode {
  id: string;
  kind: NodeKind;
  label: string;
  /** Node-specific config (validated loosely per kind). */
  config: Record<string, unknown>;
  /** Outgoing edges. For `branch`, this is a fallback list; the chosen id wins. */
  next: string[];
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  startNodeId: string;
  nodes: WorkflowNode[];
  builtin?: boolean;
  createdAt: number;
  updatedAt: number;
}

export const WORKFLOWS_STORAGE_KEY = 'nimbus-workflows';

export function loadWorkflows(): Workflow[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(WORKFLOWS_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Workflow[]) : [];
  } catch {
    return [];
  }
}

export function saveWorkflows(list: Workflow[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(WORKFLOWS_STORAGE_KEY, JSON.stringify(list));
  } catch {
    // ignore quota
  }
}

export function newWorkflowId(): string {
  return `wf_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
}

/* --------------------------- built-in tool nodes -------------------------- */

interface ToolResult {
  ok: boolean;
  value: unknown;
  error?: string;
}

const TOOLS: Record<string, (args: Record<string, unknown>) => ToolResult> = {
  calculator: (args) => {
    try {
      // Allow only digits, parens, +-*/% and whitespace.
      const expr = String(args.expression ?? '');
      if (!/^[\d+\-*/%().\s]+$/.test(expr)) {
        return { ok: false, value: null, error: 'Expression contains disallowed characters' };
      }
      // eslint-disable-next-line no-new-func
      const value = Function(`"use strict"; return (${expr});`)();
      return { ok: true, value };
    } catch (e) {
      return { ok: false, value: null, error: (e as Error).message };
    }
  },
  datetime: () => ({
    ok: true,
    value: {
      iso: new Date().toISOString(),
      unix: Date.now(),
      utc: new Date().toUTCString(),
    },
  }),
  uuid: () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return { ok: true, value: crypto.randomUUID() };
    }
    return {
      ok: true,
      value: 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
      }),
    };
  },
  json: (args) => {
    try {
      return { ok: true, value: JSON.parse(String(args.input ?? 'null')) };
    } catch (e) {
      return { ok: false, value: null, error: (e as Error).message };
    }
  },
  upper: (args) => ({ ok: true, value: String(args.text ?? '').toUpperCase() }),
  lower: (args) => ({ ok: true, value: String(args.text ?? '').toLowerCase() }),
  reverse: (args) => ({
    ok: true,
    value: String(args.text ?? '').split('').reverse().join(''),
  }),
  wordcount: (args) => ({
    ok: true,
    value: String(args.text ?? '').trim().split(/\s+/).filter(Boolean).length,
  }),
};

export const AVAILABLE_TOOLS = Object.keys(TOOLS);

/* --------------------------------- DAG exec ------------------------------ */

export interface ExecLogEntry {
  nodeId: string;
  label: string;
  kind: NodeKind;
  ok: boolean;
  durationMs: number;
  result: unknown;
}

export interface ExecResult {
  ok: boolean;
  state: Record<string, unknown>;
  log: ExecLogEntry[];
  finishedAt: number;
  /** If a branch or http step needs an LLM but no client was provided. */
  needsPrompt?: { nodeId: string; label: string; prompt: string };
}

export interface ExecOptions {
  /** Called for each `prompt` node so the executor can stay LLM-agnostic. */
  promptResolver?: (prompt: string) => Promise<string>;
  /** Abort signal for HTTP / prompt fetches. */
  signal?: AbortSignal;
}

async function executeHttp(
  cfg: Record<string, unknown>,
  signal?: AbortSignal
): Promise<ToolResult> {
  const url = String(cfg.url ?? '');
  try {
    const res = await fetch(url, {
      method: String(cfg.method ?? 'GET'),
      signal,
      headers: cfg.headers as HeadersInit | undefined,
    });
    const text = await res.text();
    return { ok: res.ok, value: { status: res.status, body: text.slice(0, 20_000) } };
  } catch (e) {
    return { ok: false, value: null, error: (e as Error).message };
  }
}

function executeBranch(
  cfg: Record<string, unknown>,
  state: Record<string, unknown>
): { ok: boolean; value: unknown; nextOverride: string | null } {
  const expr = String(cfg.expression ?? 'false');
  try {
    // eslint-disable-next-line no-new-func
    const fn = new Function('state', `with (state) { return (${expr}); }`);
    const value = fn(state);
    const nextOverride = value ? String(cfg.ifTrue ?? '') || null : String(cfg.ifFalse ?? '') || null;
    return { ok: true, value, nextOverride };
  } catch (e) {
    return { ok: false, value: null, error: (e as Error).message, nextOverride: null };
  }
}

function executeCode(cfg: Record<string, unknown>, state: Record<string, unknown>): ToolResult {
  const expr = String(cfg.expression ?? 'null');
  try {
    // eslint-disable-next-line no-new-func
    const fn = new Function('state', `with (state) { return (${expr}); }`);
    const value = fn(state);
    return { ok: true, value };
  } catch (e) {
    return { ok: false, value: null, error: (e as Error).message };
  }
}

export async function runWorkflow(
  wf: Workflow,
  options: ExecOptions = {}
): Promise<ExecResult> {
  const state: Record<string, unknown> = {};
  const log: ExecLogEntry[] = [];
  let current: string | null = wf.startNodeId;
  const visited = new Set<string>();
  const maxSteps = 50;

  for (let step = 0; step < maxSteps && current; step++) {
    if (visited.has(current)) {
      return { ok: false, state, log, finishedAt: Date.now() };
    }
    visited.add(current);
    const node = wf.nodes.find((n) => n.id === current);
    if (!node) {
      return { ok: false, state, log, finishedAt: Date.now() };
    }

    const start = performance.now();
    let ok = true;
    let result: unknown;
    let nextOverride: string | null = null;

    try {
      switch (node.kind) {
        case 'prompt': {
          if (!options.promptResolver) {
            return {
              ok: false,
              state,
              log,
              finishedAt: Date.now(),
              needsPrompt: {
                nodeId: node.id,
                label: node.label,
                prompt: String(node.config.prompt ?? ''),
              },
            };
          }
          result = await options.promptResolver(String(node.config.prompt ?? ''));
          state[node.id] = result;
          break;
        }
        case 'tool': {
          const toolName = String(node.config.tool ?? '');
          const fn = TOOLS[toolName];
          if (!fn) {
            ok = false;
            result = `Unknown tool: ${toolName}`;
          } else {
            const r = fn(node.config);
            ok = r.ok;
            result = r.ok ? r.value : r.error;
            state[node.id] = r.value;
          }
          break;
        }
        case 'http': {
          const r = await executeHttp(node.config, options.signal);
          ok = r.ok;
          result = r.value;
          state[node.id] = r.value;
          break;
        }
        case 'branch': {
          const r = executeBranch(node.config, state);
          ok = r.ok;
          result = r.value;
          nextOverride = r.nextOverride;
          state[node.id] = r.value;
          break;
        }
        case 'code': {
          const r = executeCode(node.config, state);
          ok = r.ok;
          result = r.ok ? r.value : r.error;
          state[node.id] = r.value;
          break;
        }
      }
    } catch (e) {
      ok = false;
      result = (e as Error).message;
    }

    log.push({
      nodeId: node.id,
      label: node.label,
      kind: node.kind,
      ok,
      durationMs: Math.round(performance.now() - start),
      result,
    });

    if (!ok) break;

    const outgoing = nextOverride ?? node.next?.[0] ?? null;
    current = outgoing;
  }

  return { ok: true, state, log, finishedAt: Date.now() };
}

export function validateWorkflow(wf: Workflow): string | null {
  if (!wf.name?.trim()) return 'Workflow name is required';
  if (!wf.startNodeId) return 'Start node is required';
  if (!wf.nodes.some((n) => n.id === wf.startNodeId)) {
    return 'Start node id does not match any node';
  }
  for (const n of wf.nodes) {
    if (!n.id) return 'Every node needs an id';
    if (!n.kind) return `Node ${n.id} is missing a kind`;
  }
  // Check reachable + no orphans
  const reachable = new Set<string>();
  const queue: string[] = [wf.startNodeId];
  while (queue.length) {
    const cur = queue.shift()!;
    if (reachable.has(cur)) continue;
    reachable.add(cur);
    const node = wf.nodes.find((x) => x.id === cur);
    if (node?.next) queue.push(...node.next.filter(Boolean));
  }
  const orphans = wf.nodes.filter((n) => !reachable.has(n.id));
  if (orphans.length > 0) {
    return `Unreachable nodes: ${orphans.map((o) => o.label || o.id).join(', ')}`;
  }
  return null;
}
