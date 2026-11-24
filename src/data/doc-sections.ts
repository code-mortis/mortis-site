export const docSections = [
  { id: 'engine', label: 'Engine', topics: ['cli', 'reviews', 'configuration', 'scans', 'saved-runs', 'python'] },
  { id: 'app', label: 'App', topics: ['deployment', 'reviews', 'security', 'code-graph', 'mcp-and-api'] },
  { id: 'action', label: 'Action', topics: ['setup', 'pull-requests', 'ci'] },
] as const;

export type ProductId = typeof docSections[number]['id'];
