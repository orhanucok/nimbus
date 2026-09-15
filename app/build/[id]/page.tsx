'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Play, Save, Workflow as WorkflowIcon } from 'lucide-react';
import { useToast } from '@/components/Toast';
import {
  type Workflow,
  type ExecResult,
  loadWorkflows,
  saveWorkflows,
  runWorkflow,
  validateWorkflow,
  AVAILABLE_TOOLS,
} from '@/lib/workflow';

const NODE_KINDS = ['prompt', 'tool', 'http', 'branch', 'code'] as const;

export default function BuildDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const toast = useToast();
  const id = typeof params.id === 'string' ? params.id : '';

  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [draft, setDraft] = useState<Workflow | null>(null);
  const [result, setResult] = useState<ExecResult | null>(null);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    setWorkflows(loadWorkflows());
  }, []);

  const original = useMemo(() => workflows.find((w) => w.id === id), [workflows, id]);

  useEffect(() => {
    if (original) setDraft(JSON.parse(JSON.stringify(original)) as Workflow);
  }, [original]);

  if (!original) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <WorkflowIcon className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <h1 className="text-lg font-semibold mb-1">Workflow not found</h1>
          <p className="text-sm text-muted-foreground mb-4">
            It may have been deleted or moved between browsers.
          </p>
          <Link
            href="/build"
            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to list
          </Link>
        </div>
      </div>
    );
  }

  if (!draft) return null;

  const updateNode = (nodeId: string, patch: Partial<Workflow['nodes'][number]>) => {
    setDraft({
      ...draft,
      nodes: draft.nodes.map((n) => (n.id === nodeId ? { ...n, ...patch } : n)),
    });
  };

  const updateMeta = (patch: Partial<Pick<Workflow, 'name' | 'description' | 'startNodeId'>>) => {
    setDraft({ ...draft, ...patch });
  };

  const handleSave = () => {
    const err = validateWorkflow(draft);
    if (err) {
      toast.show('error', err);
      return;
    }
    const next = workflows.map((w) => (w.id === draft.id ? { ...draft, updatedAt: Date.now() } : w));
    setWorkflows(next);
    saveWorkflows(next);
    toast.show('success', 'Workflow saved');
  };

  const handleDelete = () => {
    if (original.builtin) {
      toast.show('info', 'Templates cannot be deleted');
      return;
    }
    if (!confirm(`Delete "${original.name}"?`)) return;
    const next = workflows.filter((w) => w.id !== id);
    saveWorkflows(next);
    router.push('/build');
  };

  const handleRun = async () => {
    const err = validateWorkflow(draft);
    if (err) {
      toast.show('error', err);
      return;
    }
    setRunning(true);
    setResult(null);
    try {
      const res = await runWorkflow(draft);
      setResult(res);
      if (!res.ok) toast.show('error', 'Workflow halted');
      else toast.show('success', 'Workflow complete');
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="max-w-5xl mx-auto px-4 py-8">
        <Link
          href="/build"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to workflows
        </Link>

        <header className="flex items-start justify-between gap-4 mb-6">
          <div className="flex-1 min-w-0">
            <input
              type="text"
              value={draft.name}
              onChange={(e) => updateMeta({ name: e.target.value })}
              className="w-full text-2xl font-semibold bg-transparent outline-none border-b border-transparent focus:border-blue-500 transition-colors"
            />
            <input
              type="text"
              value={draft.description}
              onChange={(e) => updateMeta({ description: e.target.value })}
              placeholder="Short description…"
              className="w-full text-sm text-muted-foreground bg-transparent outline-none mt-1"
            />
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleRun}
              disabled={running}
              className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-lg
                bg-green-500 hover:bg-green-600 text-white font-medium transition-colors disabled:opacity-50"
            >
              <Play className="w-4 h-4" />
              {running ? 'Running…' : 'Run'}
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-lg
                bg-blue-500 hover:bg-blue-600 text-white font-medium transition-colors"
            >
              <Save className="w-4 h-4" />
              Save
            </button>
            {!original.builtin && (
              <button
                type="button"
                onClick={handleDelete}
                className="px-3 py-2 text-sm rounded-lg hover:bg-destructive/20 text-destructive transition-colors"
              >
                Delete
              </button>
            )}
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Nodes */}
          <section>
            <h2 className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
              Nodes ({draft.nodes.length})
            </h2>
            <div className="space-y-2">
              <div className="bg-card border border-border rounded-lg p-3 text-sm flex items-center gap-2">
                <span className="text-muted-foreground">Start:</span>
                <select
                  value={draft.startNodeId}
                  onChange={(e) => updateMeta({ startNodeId: e.target.value })}
                  className="bg-background border border-border rounded px-2 py-1 text-sm"
                >
                  {draft.nodes.map((n) => (
                    <option key={n.id} value={n.id}>
                      {n.label || n.id}
                    </option>
                  ))}
                </select>
              </div>

              {draft.nodes.map((node) => (
                <div
                  key={node.id}
                  className="bg-card border border-border rounded-lg p-3 space-y-2"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={node.label}
                      onChange={(e) => updateNode(node.id, { label: e.target.value })}
                      className="flex-1 font-medium bg-transparent outline-none text-sm"
                    />
                    <select
                      value={node.kind}
                      onChange={(e) =>
                        updateNode(node.id, { kind: e.target.value as Workflow['nodes'][number]['kind'] })
                      }
                      className="bg-background border border-border rounded px-2 py-1 text-xs"
                      disabled={original.builtin}
                    >
                      {NODE_KINDS.map((k) => (
                        <option key={k} value={k}>
                          {k}
                        </option>
                      ))}
                    </select>
                  </div>
                  <NodeConfig node={node} onChange={(cfg) => updateNode(node.id, { config: cfg })} />
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-muted-foreground">Next:</span>
                    <input
                      type="text"
                      value={node.next.join(',')}
                      onChange={(e) =>
                        updateNode(node.id, {
                          next: e.target.value
                            .split(',')
                            .map((s) => s.trim())
                            .filter(Boolean),
                        })
                      }
                      placeholder="node-id,node-id"
                      className="flex-1 bg-background border border-border rounded px-2 py-1 font-mono"
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Result */}
          <section>
            <h2 className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
              Run log
            </h2>
            <div className="bg-card border border-border rounded-lg p-3 min-h-[280px]">
              {!result && !running && (
                <p className="text-sm text-muted-foreground">
                  Press <strong>Run</strong> to execute this workflow.
                </p>
              )}
              {running && (
                <p className="text-sm text-muted-foreground">Executing…</p>
              )}
              {result && (
                <div className="space-y-3">
                  <p className="text-xs">
                    <span className={result.ok ? 'text-green-500' : 'text-red-500'}>
                      {result.ok ? 'OK' : 'Halted'}
                    </span>
                    {' · '}
                    {result.log.length} step{result.log.length === 1 ? '' : 's'}
                  </p>
                  <ol className="space-y-2 text-xs">
                    {result.log.map((entry, i) => (
                      <li key={i} className="border-l-2 border-blue-500/40 pl-2">
                        <div className="flex items-center gap-2">
                          <span className={`w-1.5 h-1.5 rounded-full ${entry.ok ? 'bg-green-500' : 'bg-red-500'}`} />
                          <span className="font-medium">{entry.label}</span>
                          <span className="text-muted-foreground">({entry.kind})</span>
                          <span className="text-muted-foreground ml-auto">{entry.durationMs}ms</span>
                        </div>
                        <pre className="mt-1 font-mono text-[11px] whitespace-pre-wrap break-all">
                          {JSON.stringify(entry.result, null, 2)}
                        </pre>
                      </li>
                    ))}
                  </ol>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground mt-3">
                      Final state
                    </p>
                    <pre className="mt-1 font-mono text-[11px] whitespace-pre-wrap break-all">
                      {JSON.stringify(result.state, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

function NodeConfig({
  node,
  onChange,
}: {
  node: Workflow['nodes'][number];
  onChange: (cfg: Record<string, unknown>) => void;
}) {
  const json = JSON.stringify(node.config, null, 2);
  if (node.kind === 'tool') {
    return (
      <div className="flex items-center gap-2 text-xs">
        <span className="text-muted-foreground">Tool:</span>
        <select
          value={String(node.config.tool ?? '')}
          onChange={(e) => onChange({ ...node.config, tool: e.target.value })}
          className="bg-background border border-border rounded px-2 py-1 font-mono"
        >
          <option value="">— pick —</option>
          {AVAILABLE_TOOLS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <span className="text-muted-foreground ml-2">Args (JSON):</span>
        <textarea
          value={json}
          onChange={(e) => {
            try {
              onChange(JSON.parse(e.target.value));
            } catch {
              // ignore parse errors until valid
            }
          }}
          rows={2}
          className="flex-1 bg-background border border-border rounded px-2 py-1 font-mono text-[11px] resize-none"
        />
      </div>
    );
  }
  return (
    <textarea
      value={json}
      onChange={(e) => {
        try {
          onChange(JSON.parse(e.target.value));
        } catch {
          // ignore parse errors until valid
        }
      }}
      rows={3}
      className="w-full bg-background border border-border rounded px-2 py-1 font-mono text-[11px] resize-none"
    />
  );
}
