import { describe, it, expect } from 'vitest';
import {
  runWorkflow,
  validateWorkflow,
  newWorkflowId,
  type Workflow,
} from '@/lib/workflow';

function wf(nodes: Workflow['nodes'], startNodeId: string, name = 't'): Workflow {
  return {
    id: newWorkflowId(),
    name,
    description: '',
    startNodeId,
    nodes,
    createdAt: 0,
    updatedAt: 0,
  };
}

describe('runWorkflow: tool nodes', () => {
  it('runs the calculator tool', async () => {
    const w = wf(
      [
        {
          id: 'a',
          kind: 'tool',
          label: '7 * 6',
          config: { tool: 'calculator', expression: '7 * 6' },
          next: [],
        },
      ],
      'a'
    );
    const res = await runWorkflow(w);
    expect(res.ok).toBe(true);
    expect(res.state.a).toBe(42);
  });

  it('rejects disallowed calculator expressions', async () => {
    const w = wf(
      [
        {
          id: 'a',
          kind: 'tool',
          label: 'malicious',
          config: { tool: 'calculator', expression: 'process.exit(1)' },
          next: [],
        },
      ],
      'a'
    );
    const res = await runWorkflow(w);
    expect(res.ok).toBe(false);
    expect(res.log[0]?.ok).toBe(false);
  });

  it('counts words', async () => {
    const w = wf(
      [
        {
          id: 'a',
          kind: 'tool',
          label: 'count',
          config: { tool: 'wordcount', text: 'hello world foo' },
          next: [],
        },
      ],
      'a'
    );
    const res = await runWorkflow(w);
    expect(res.state.a).toBe(3);
  });

  it('uppercases and reverses', async () => {
    const w = wf(
      [
        {
          id: 'u',
          kind: 'tool',
          label: 'u',
          config: { tool: 'upper', text: 'hi' },
          next: ['r'],
        },
        {
          id: 'r',
          kind: 'tool',
          label: 'r',
          config: { tool: 'reverse', text: 'STATE' },
          next: [],
        },
      ],
      'u'
    );
    // The second node reads `text: 'STATE'` literally, so we expect 'ETATS'.
    const res = await runWorkflow(w);
    expect(res.state.u).toBe('HI');
    expect(res.state.r).toBe('ETATS');
  });
});

describe('runWorkflow: code and branch nodes', () => {
  it('evaluates a code expression with state', async () => {
    const w = wf(
      [
        {
          id: 'c',
          kind: 'code',
          label: 'c',
          config: { expression: '({ x: 1 + 2 })' },
          next: [],
        },
      ],
      'c'
    );
    const res = await runWorkflow(w);
    expect(res.state.c).toEqual({ x: 3 });
  });

  it('branches on an expression', async () => {
    const w = wf(
      [
        {
          id: 'flag',
          kind: 'code',
          label: 'flag',
          config: { expression: '({ goRight: true })' },
          next: ['choose'],
        },
        {
          id: 'choose',
          kind: 'branch',
          label: 'branch',
          config: {
            expression: 'state.flag.goRight',
            ifTrue: 'win',
            ifFalse: 'lose',
          },
          next: [],
        },
        {
          id: 'win',
          kind: 'code',
          label: 'win',
          config: { expression: '"WON"' },
          next: [],
        },
        {
          id: 'lose',
          kind: 'code',
          label: 'lose',
          config: { expression: '"LOST"' },
          next: [],
        },
      ],
      'flag'
    );
    const res = await runWorkflow(w);
    expect(res.state.win).toBe('WON');
    expect(res.state.lose).toBeUndefined();
  });
});

describe('runWorkflow: error paths', () => {
  it('reports an unknown tool without throwing', async () => {
    const w = wf(
      [
        {
          id: 'a',
          kind: 'tool',
          label: 'bad',
          config: { tool: 'no-such-tool' },
          next: [],
        },
      ],
      'a'
    );
    const res = await runWorkflow(w);
    expect(res.ok).toBe(false);
    expect(res.log[0]?.ok).toBe(false);
  });

  it('flags a cycle and returns ok=false', async () => {
    const w = wf(
      [
        { id: 'a', kind: 'code', label: 'a', config: { expression: '1' }, next: ['b'] },
        { id: 'b', kind: 'code', label: 'b', config: { expression: '2' }, next: ['a'] },
      ],
      'a'
    );
    const res = await runWorkflow(w);
    expect(res.ok).toBe(false);
  });
});

describe('validateWorkflow', () => {
  it('rejects an empty name', () => {
    const err = validateWorkflow(wf([], 'x'));
    expect(err).toMatch(/name is required/);
  });

  it('rejects when the start node is not in nodes', () => {
    const err = validateWorkflow(
      wf([{ id: 'a', kind: 'code', label: 'a', config: {}, next: [] }], 'missing')
    );
    expect(err).toMatch(/start node/i);
  });

  it('rejects unreachable nodes', () => {
    const err = validateWorkflow(
      wf(
        [
          { id: 'a', kind: 'code', label: 'a', config: {}, next: [] },
          { id: 'orphan', kind: 'code', label: 'orphan', config: {}, next: [] },
        ],
        'a'
      )
    );
    expect(err).toMatch(/unreachable/i);
  });

  it('passes a clean workflow', () => {
    const err = validateWorkflow(
      wf(
        [
          { id: 'a', kind: 'code', label: 'a', config: { expression: '1' }, next: ['b'] },
          { id: 'b', kind: 'code', label: 'b', config: { expression: '2' }, next: [] },
        ],
        'a'
      )
    );
    expect(err).toBeNull();
  });
});
