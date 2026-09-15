'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Workflow as WorkflowIcon, Sparkles, Trash2 } from 'lucide-react';
import { useToast } from '@/components/Toast';
import {
  loadWorkflows,
  saveWorkflows,
  newWorkflowId,
  type Workflow,
} from '@/lib/workflow';
import { WORKFLOW_TEMPLATES } from '@/lib/workflowTemplates';

const STORAGE_KEY = 'nimbus-workflows';

function installTemplates(): void {
  if (typeof window === 'undefined') return;
  const existing = loadWorkflows();
  const existingIds = new Set(existing.filter((w) => w.builtin).map((w) => w.name));
  const merged = [...existing];
  const now = Date.now();
  for (const tpl of WORKFLOW_TEMPLATES) {
    if (existingIds.has(tpl.name)) continue;
    merged.push({
      ...tpl,
      id: newWorkflowId(),
      createdAt: now,
      updatedAt: now,
    });
  }
  saveWorkflows(merged);
}

function WorkflowList() {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [input, setInput] = useState('');
  const toast = useToast();

  useEffect(() => {
    installTemplates();
    setWorkflows(loadWorkflows());
  }, []);

  const persist = (next: Workflow[]) => {
    setWorkflows(next);
    saveWorkflows(next);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const name = (input || 'Untitled workflow').trim().slice(0, 64);
    if (!name) return;
    const id = newWorkflowId();
    const wf: Workflow = {
      id,
      name,
      description: 'Custom workflow.',
      startNodeId: 'start',
      builtin: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      nodes: [
        {
          id: 'start',
          kind: 'code',
          label: 'Start',
          config: { expression: '({ started: true })' },
          next: [],
        },
      ],
    };
    persist([wf, ...workflows]);
    setInput('');
    window.location.href = `/build/${id}`;
  };

  const handleDelete = (id: string) => {
    const target = workflows.find((w) => w.id === id);
    if (target?.builtin) {
      toast.show('info', 'Built-in templates cannot be deleted');
      return;
    }
    if (!confirm(`Delete "${target?.name}"?`)) return;
    persist(workflows.filter((w) => w.id !== id));
  };

  const builtins = workflows.filter((w) => w.builtin);
  const user = workflows.filter((w) => !w.builtin);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="max-w-5xl mx-auto px-4 py-8">
        <header className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-semibold flex items-center gap-2">
              <WorkflowIcon className="w-7 h-7 opacity-70" />
              Nimbus Build
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Compose tools, prompts, and code into a workflow. Run it with one click.
            </p>
          </div>
          <Link
            href="/build/templates"
            className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg border border-border hover:bg-accent transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            Templates
          </Link>
        </header>

        <form
          onSubmit={handleCreate}
          className="flex items-center gap-2 bg-card border border-border rounded-lg p-3 mb-6"
        >
          <WorkflowIcon className="w-4 h-4 opacity-60 shrink-0" />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="New workflow name…"
            maxLength={64}
            className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground/60"
          />
          <button
            type="submit"
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg
              bg-blue-500 hover:bg-blue-600 text-white font-medium transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Create
          </button>
        </form>

        {user.length > 0 && (
          <section className="mb-8">
            <h2 className="text-sm uppercase tracking-wider text-muted-foreground mb-3">
              Your workflows ({user.length})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {user.map((w) => (
                <WorkflowCard key={w.id} wf={w} onDelete={handleDelete} />
              ))}
            </div>
          </section>
        )}

        <section>
          <h2 className="text-sm uppercase tracking-wider text-muted-foreground mb-3">
            Built-in templates ({builtins.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {builtins.map((w) => (
              <WorkflowCard key={w.id} wf={w} onDelete={() => {}} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function WorkflowCard({ wf, onDelete }: { wf: Workflow; onDelete: (id: string) => void }) {
  const isBuiltin = wf.builtin;
  return (
    <div className="group bg-card border border-border rounded-xl p-4 hover:bg-accent/30 transition-colors">
      <Link href={`/build/${wf.id}`} className="block">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white shrink-0">
            <WorkflowIcon className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-base truncate">{wf.name}</h3>
              {isBuiltin && (
                <span className="px-1.5 py-0.5 text-[10px] rounded bg-blue-500/20 text-blue-500 font-medium">
                  TEMPLATE
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {wf.description}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              {wf.nodes.length} node{wf.nodes.length === 1 ? '' : 's'}
            </p>
          </div>
        </div>
      </Link>
      {!isBuiltin && (
        <button
          type="button"
          onClick={() => onDelete(wf.id)}
          className="mt-3 p-1.5 rounded-md opacity-0 group-hover:opacity-100 hover:bg-destructive/20 text-destructive transition-all"
          aria-label={`Delete ${wf.name}`}
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}

export default function BuildPage() {
  return <WorkflowList />;
}
