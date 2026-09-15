// lib/workflowTemplates.ts
//
// A small library of starter workflows users can clone from /build/templates.

import type { Workflow } from './workflow';

export const WORKFLOW_TEMPLATES: Array<Omit<Workflow, 'id' | 'createdAt' | 'updatedAt'>> = [
  {
    name: 'Sentiment + summary',
    description: 'Analyze a piece of text: classify sentiment, count words, then summarize.',
    startNodeId: 'wordcount',
    builtin: true,
    nodes: [
      {
        id: 'wordcount',
        kind: 'tool',
        label: 'Count words',
        config: { tool: 'wordcount', text: '{{input}}' },
        next: ['upper'],
      },
      {
        id: 'upper',
        kind: 'tool',
        label: 'Uppercase',
        config: { tool: 'upper', text: '{{input}}' },
        next: ['done'],
      },
      {
        id: 'done',
        kind: 'code',
        label: 'Pack result',
        config: { expression: '{ wordCount: state.wordcount, upper: state.upper }' },
        next: [],
      },
    ],
  },
  {
    name: 'If-else branching',
    description: 'Demo of the branch node. Sets a flag and routes based on the value.',
    startNodeId: 'set',
    builtin: true,
    nodes: [
      {
        id: 'set',
        kind: 'code',
        label: 'Pick flag',
        config: { expression: '({ flag: true })' },
        next: ['route'],
      },
      {
        id: 'route',
        kind: 'branch',
        label: 'If flag → A else B',
        config: { expression: 'state.set.flag', ifTrue: 'winA', ifFalse: 'winB' },
        next: [],
      },
      {
        id: 'winA',
        kind: 'code',
        label: 'Path A',
        config: { expression: '"Picked A"' },
        next: [],
      },
      {
        id: 'winB',
        kind: 'code',
        label: 'Path B',
        config: { expression: '"Picked B"' },
        next: [],
      },
    ],
  },
  {
    name: 'JSON formatter',
    description: 'Takes a JSON string, parses it, pretty-prints, and reports error if invalid.',
    startNodeId: 'parse',
    builtin: true,
    nodes: [
      {
        id: 'parse',
        kind: 'tool',
        label: 'Parse JSON',
        config: { tool: 'json', input: '{{input}}' },
        next: ['done'],
      },
      {
        id: 'done',
        kind: 'code',
        label: 'Format',
        config: { expression: 'JSON.stringify(state.parse, null, 2)' },
        next: [],
      },
    ],
  },
  {
    name: 'UUID + datetime stamp',
    description: 'Generate a UUID and capture the current UTC timestamp.',
    startNodeId: 'uuid',
    builtin: true,
    nodes: [
      {
        id: 'uuid',
        kind: 'tool',
        label: 'Generate UUID',
        config: { tool: 'uuid' },
        next: ['now'],
      },
      {
        id: 'now',
        kind: 'tool',
        label: 'Datetime',
        config: { tool: 'datetime' },
        next: ['combine'],
      },
      {
        id: 'combine',
        kind: 'code',
        label: 'Combine',
        config: { expression: '{ id: state.uuid, when: state.now.iso }' },
        next: [],
      },
    ],
  },
  {
    name: 'Calculator chain',
    description: 'Two math operations stitched together via the state object.',
    startNodeId: 'add',
    builtin: true,
    nodes: [
      {
        id: 'add',
        kind: 'tool',
        label: 'Add 17 + 25',
        config: { tool: 'calculator', expression: '17 + 25' },
        next: ['mul'],
      },
      {
        id: 'mul',
        kind: 'tool',
        label: 'Multiply by 2',
        config: { tool: 'calculator', expression: '(state.add) * 2' },
        next: [],
      },
    ],
  },
];
