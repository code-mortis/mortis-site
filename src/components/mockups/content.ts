export const directions = [
  { slug: 'field-notes', name: 'Field Notes', angle: 'Finding first', description: 'A vermilion cover and an engraved raven open a hands-on review of a missed invoice reminder.', interaction: 'Try the last-day test' },
  { slug: 'review-desk', name: 'Review Desk', angle: 'App first', description: 'An open, light page leads straight into the App. Read the suggested change, then move between reviews, graph, and activity.', interaction: 'Explore the repository' },
  { slug: 'workbench', name: 'Workbench', angle: 'Setup first', description: 'An exploded engine anchors a dark technical guide. Switch between the terminal, GitHub workflow, and self-hosted workspace.', interaction: 'Choose a setup' },
] as const;

export const captures = {
  overview: ['Repository overview', 'See recent reviews and security results together before choosing a run to investigate.', 1280, 963],
  activity: ['Activity calendar', 'Select a day in the App to see which reviews and scans ran. Here the team ran five reviews and two security scans.', 916, 518],
  review: ['Pull request findings', 'Open PR #42 to see which findings are still open and the file and line each one affects.', 1280, 645],
  'review-finding': ['Review evidence', 'The evidence drawer shows the exclusive date comparison, the missed reminder and a suggested replacement.', 672, 680],
  'pull-overview': ['Pull request overview', 'Read the saved PR description, then use the change diagram and grouped files to decide which diff to read first.', 1280, 1133],
  scans: ['Scan history', 'Compare saved grades and revisions. A partial scan remains visible alongside completed scans.', 1280, 760],
  'scan-report': ['Scan report', 'Read the coverage for commit fc902bd before interpreting its grade or opening one of its three findings.', 1280, 784],
  'scan-finding': ['Security evidence', 'Open the response-caching finding to inspect the saved lines, remediation and verification guidance.', 672, 1080],
  graph: ['Code graph', 'Follow indexed imports around reminders.py at commit fc902bd to see which files depend on one another.', 1280, 720],
} as const;
export type Capture = keyof typeof captures;
const urls = import.meta.glob<string>('../../../assets/code-mortis-*.svg', { eager: true, query: '?url', import: 'default' });
export const captureUrl = (key: Capture) => urls[`../../../assets/code-mortis-${key}.svg`];

export const setups = [
  { key: 'engine', label: 'Engine', context: 'Terminal & Python', title: 'Review before you push.', body: 'Preview the files Mortis would analyze without contacting a provider. When you are ready, connect your model and review the same staged changes. The CLI keeps run history locally.', file: 'Terminal · in a Git repository', code: 'uv tool install mortis-engine\nmortis review --staged --preview', href: '/docs/engine/cli/', link: 'Open the CLI guide', extra: 'Use the Python library', extraHref: '/docs/engine/python/' },
  { key: 'action', label: 'Action', context: 'GitHub Actions', title: 'Meet the reviewer in the PR.', body: 'Add the workflow and configure your provider on the runner. Authors get a summary and inline findings where GitHub can anchor them. Collaborators with write access can ask about the diff.', file: 'Pull request comment · after setup', code: '/mortis ask Why does this change the last reminder date?', href: '/docs/action/setup/', link: 'Get the GitHub workflow', extra: 'View the Action', extraHref: 'https://github.com/code-mortis/mortis-action' },
  { key: 'app', label: 'App', context: 'Self-hosted workspace', title: 'Give the team a shared record.', body: 'Deploy with Docker Compose, register your GitHub App and connect repositories. The workspace holds findings, coverage, triage decisions and model usage across runs.', file: 'Terminal · get the App source', code: 'git clone https://github.com/code-mortis/code-mortis.git\ncd code-mortis', href: '/docs/app/deployment/', link: 'Follow the deployment guide', extra: 'Connect an agent', extraHref: '/docs/app/mcp-and-api/#connect-scripts-and-agents' },
] as const;
export const agents = [
  { key: 'reviews', name: 'Review findings', q: 'Why would this change skip an invoice reminder?', a: 'The saved finding points to reminders.py, lines 48–49. A due date equal to the period end fails the strict comparison. Test an invoice due on the last day before changing the condition.', source: 'Review evidence · PR #42', endpoint: '/mcp/reviews' },
  { key: 'security', name: 'Security findings', q: 'What should I verify on the invoice report?', a: 'The saved scan identifies a response that intermediaries can cache. Check the headers on an authenticated invoice report after the fix and confirm they include private, no-store.', source: 'Saved scan evidence · src/web/reports.py', endpoint: '/mcp/security' },
  { key: 'code', name: 'Indexed code', q: 'Where should I look for files related to the reminder change?', a: 'Start at reminders.py in the index for fc902bd. Follow the import relationships and open the related source at that revision before deciding which files need a closer look.', source: 'Repository code graph · fc902bd', endpoint: '/mcp/code' },
] as const;
