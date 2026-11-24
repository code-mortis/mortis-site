// Old incoming links include fragments from the original single-page guides.
export const oldGuides = {
  'cli': {
    start: '/docs/engine/cli/',
    topics: {
      '/docs/engine/cli/': ['install-and-preview', 'connect-a-provider', 'use-with-coding-agents'],
      '/docs/engine/reviews/': ['run-a-review', 'read-the-evidence', 'ask-about-or-describe-a-branch-comparison', 'review-subsequent-commits'],
      '/docs/engine/configuration/': ['configure-the-repository'],
      '/docs/engine/scans/': ['scan-a-committed-revision'],
      '/docs/engine/saved-runs/': ['use-reports-in-scripts', 'revisit-a-saved-run'],
    },
  },
  'library': {
    start: '/docs/engine/python/',
    topics: {
      '/docs/engine/python/': ['preview-a-review', 'run-a-review-from-python', 'interpret-the-result', 'scan-a-commit-or-follow-up-on-a-review', 'recover-one-failed-assessment'],
    },
  },
  'github-action': {
    start: '/docs/action/',
    topics: {
      '/docs/action/setup/': ['set-up-pull-request-reviews'],
      '/docs/action/pull-requests/': ['review-and-discuss-a-pull-request', 'enable-incremental-pr-reviews'],
      '/docs/action/ci/': ['compare-branches-or-scan-a-revision', 'scan-mode-in-v020', 'read-reports'],
    },
  },
  'app': {
    start: null,
    topics: {
      '/docs/app/deployment/': ['deploy-with-docker-compose', 'run-a-local-development-instance', 'connect-github-and-an-ai-provider'],
      '/docs/app/reviews/': ['review-a-pull-request', 'follow-a-finding-through-the-next-commit'],
      '/docs/app/security/': ['scan-a-repository'],
      '/docs/app/code-graph/': ['explore-a-code-graph'],
      '/docs/app/mcp-and-api/': ['connect-scripts-and-agents', 'ask-your-agent-about-saved-evidence', 'use-the-rest-api'],
    },
  },
} as const;

export type OldGuide = keyof typeof oldGuides;

export function movedHeadings(guide: OldGuide) {
  const topics: Record<string, readonly string[]> = oldGuides[guide].topics;
  return Object.entries(topics).flatMap(([path, headings]) =>
    headings.map(heading => [heading, path] as const)
  );
}
