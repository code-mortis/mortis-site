// Each cell pairs a documented workflow with a source that covers that specific claim.
function fact(text: string, label: string, href: string) {
  return { text, label, href };
}

const local = '/docs/cli/';
const app = '/docs/app/';
const action = '/docs/github-action/';
const library = '/docs/library/';
const mortis = {
  preview: fact('Preview the staged files locally, see exclusions, then choose whether to send eligible code to your model for review.', 'Engine scope preview', library + '#preview-a-review'),
  revisions: fact('Review staged changes, the working tree, or two Git refs in a local clone. Python callers can use the same scopes.', 'CLI and Python scopes', library + '#preview-a-review'),
  models: fact('The Engine uses the provider you configure. The App supports shared OpenAI-compatible, Anthropic and Amazon Bedrock connections.', 'App model connections', app + '#connect-github-and-an-ai-provider'),
  hosting: fact('Run the Engine as a CLI or Python library. The GitHub Action runs on a workflow runner. Deploy the App with Docker Compose for a shared GitHub workspace.', 'Mortis setup guides', '/docs/'),
  coverage: fact('A saved review reports completed, reused and waived work alongside findings and errors. A partial run can still contain confirmed findings.', 'Review result contract', library + '#interpret-the-result'),
  graph: fact('Enable indexing per repository to explore imports at a specific revision. A matching index can supply related source to a PR review.', 'App code graph', app + '#explore-a-code-graph'),
  rules: fact('Add repository review rules in the App. Limit a rule to named files or path globs, or apply it across the repository.', 'Repository rules', app + '#review-a-pull-request'),
  pull: fact('The Action publishes a PR summary and inline findings where GitHub can anchor them. An exact, validated replacement can appear as a suggested change.', 'Action review output', action + '#review-and-discuss-a-pull-request'),
  ask: fact('A collaborator with write access can use /mortis ask on an open PR. The Action answers from the diff and cites supporting lines.', 'Action PR commands', action + '#review-and-discuss-a-pull-request'),
  verify: fact('Give the Engine a saved review ID and a later Git ref to check the original finding against the new code. The original report remains available.', 'Verify a saved finding', local + '#revisit-a-saved-run'),
  agent: fact('Give your agent read access to selected repositories through the App’s Reviews or Security MCP endpoint. It can retrieve saved findings and evidence for discussion.', 'App MCP permissions', app + '#connect-scripts-and-agents'),
  indexedAgent: fact('The App’s read-only Code MCP endpoint lets your agent explore an indexed repository. Reviews and Security have separate endpoints for saved results.', 'App MCP endpoints', app + '#connect-scripts-and-agents'),
  scan: fact('The App scans a pinned default-branch commit. Its report combines semantic findings with Trivy checks for dependencies, secrets and infrastructure configuration.', 'App security scans', app + '#scan-a-repository'),
  export: fact('Export a saved Engine run as Markdown or versioned JSON for a person or a script. Export reads the saved report without another model call.', 'Saved reports and exports', local + '#revisit-a-saved-run'),
};

type Fact = ReturnType<typeof fact>;
interface Comparison {
  id: string;
  name: string;
  short: string;
  focus: string;
  rows: [string, Fact, Fact][];
}

export const comparisons: Comparison[] = [
  {
    id: 'coderabbit', name: 'CodeRabbit', short: 'CodeRabbit',
    focus: 'Both tools review code before a push and hand findings to coding agents. Compare what each sends to the agent and how repository scans fit into the PR workflow.',
    rows: [
      ['Before a push', mortis.preview, fact('The CodeRabbit CLI reviews staged and unstaged changes before a PR exists. It can hand review context to a coding agent.', 'CodeRabbit CLI', 'https://www.coderabbit.ai/cli')],
      ['In the pull request', mortis.pull, fact('CodeRabbit posts review feedback in the PR. Teams can configure pre-merge checks and post-merge actions as part of that workflow.', 'CodeRabbit Review', 'https://www.coderabbit.ai/review')],
      ['Repository security', mortis.scan, fact('CodeRabbit Security offers inline PR scans and repository-wide Deep Scans. Its dashboard brings deep-scan findings and dependency vulnerabilities together.', 'CodeRabbit Security', 'https://www.coderabbit.ai/secure')],
      ['Agent handoff', mortis.agent, fact('CodeRabbit’s agent integrations combine remote MCP tools with an authenticated local CLI. The review skill can retrieve fix prompts for local reviews or GitHub PRs.', 'CodeRabbit review skill', 'https://github.com/coderabbitai/skills/blob/main/skills/code-review/SKILL.md')],
    ],
  },
  {
    id: 'qodo', name: 'Qodo', short: 'Qodo',
    focus: 'For a contract shared by two services, compare Qodo’s cross-repository beta with the import graph Mortis builds for one repository at a specific revision.',
    rows: [
      ['Before a pull request', mortis.revisions, fact('Qodo’s Agentic Toolbox lets a coding agent request an independent review of committed or uncommitted local changes before opening a PR.', 'Qodo Agentic Toolbox', 'https://www.qodo.ai/blog/introducing-qodos-agentic-toolbox/')],
      ['Dependency context', mortis.graph, fact('Qodo’s cross-repository review is in beta. For repositories with an active relationship, it can trace a changed contract into a related repo and link the affected lines in the PR.', 'Cross-repository review', 'https://docs.qodo.ai/governance/cross-repo-code-review')],
      ['Repository rules', mortis.rules, fact('Qodo reads repository-specific guidance from REVIEW.md. Cloud workspaces enable it by default unless opted out. Single-tenant and on-premises deployments can enable it in the portal.', 'Qodo REVIEW.md settings', 'https://docs.qodo.ai/governance/use-review-md')],
      ['Agent handoff', mortis.agent, fact('The Toolbox can bring structured PR review issues into an existing coding session. The agent can consult team standards and repository context while working on a fix.', 'Agentic Toolbox workflow', 'https://www.qodo.ai/blog/introducing-qodos-agentic-toolbox/')],
    ],
  },
  {
    id: 'kodus', name: 'Kodus', short: 'Kodus',
    focus: 'Both support self-hosting and a model key you supply. Kodus can share rules across an organization. Mortis can verify an earlier finding against a Git revision you choose.',
    rows: [
      ['Deployment', mortis.hosting, fact('Use Kodus Cloud or self-host Kodus with your own model key. Its PR integrations include GitHub, GitLab, Bitbucket, Azure DevOps and Forgejo.', 'Kodus deployment and integrations', 'https://github.com/kodustech/kodus-ai')],
      ['Before a push', mortis.preview, fact('The Kodus CLI can review only the staged diff. It also provides structured review output intended for coding agents.', 'Kodus CLI options', 'https://github.com/kodustech/cli')],
      ['Team rules', mortis.rules, fact('Kody Rules are plain-language instructions that can apply across an organization, a repository, or selected paths and review scopes.', 'Kody Rules', 'https://github.com/kodustech/kodus-ai#readme')],
      ['After the PR closes', mortis.verify, fact('Kody Issues carries unimplemented suggestions into an issue list after a PR closes. Kodus can resolve one when a fix appears in a later PR.', 'Kody Issues', 'https://github.com/kodustech/kodus-ai#readme')],
    ],
  },
  {
    id: 'greptile', name: 'Greptile', short: 'Greptile',
    focus: 'Both use repository context and offer MCP. Greptile gives an editor access to PR feedback and coding patterns. Mortis grants separate access to saved reviews, security results, and indexed code.',
    rows: [
      ['Deployment', mortis.hosting, fact('Connect a GitHub or GitLab repository to Greptile Cloud or deploy Greptile on your infrastructure. Its docs cover Docker Compose and Kubernetes.', 'Greptile deployment options', 'https://www.greptile.com/docs/introduction')],
      ['Before a push', mortis.preview, fact('Greptile’s CLI reviews a local branch from the terminal. A coding agent can invoke the same CLI as part of its workflow.', 'Greptile CLI', 'https://www.greptile.com/cli')],
      ['Dependency context', mortis.graph, fact('Greptile indexes the connected repository into a code graph and uses it during PR reviews to follow dependencies beyond the changed files.', 'How Greptile reviews code', 'https://www.greptile.com/docs/introduction')],
      ['Inside the editor', mortis.indexedAgent, fact('Greptile’s MCP server can fetch unaddressed PR comments, search feedback patterns, and manage team coding standards from a connected editor.', 'Greptile MCP tools', 'https://www.greptile.com/docs/mcp/overview')],
    ],
  },
  {
    id: 'pr-agent', name: 'PR-Agent', short: 'PR-Agent',
    focus: 'PR-Agent is the community project originally developed by Qodo. Compare its PR commands and patch compression with the Mortis Action’s inline feedback and the Engine’s coverage record.',
    rows: [
      ['Deployment', mortis.hosting, fact('Run PR-Agent from a CLI, as a GitHub Action, or as a self-hosted webhook service. Its project guide lists integrations for multiple Git providers.', 'PR-Agent project and history', 'https://github.com/The-PR-Agent/pr-agent')],
      ['Large diffs', mortis.coverage, fact('PR-Agent expands context around patches and fits them into the model’s token budget. Files whose patches do not fit can be listed by name.', 'PR-Agent patch compression', 'https://docs.pr-agent.ai/core-abilities/compression_strategy/')],
      ['Questions on the PR', mortis.ask, fact('Use /ask for questions about the whole PR or particular lines. The same commands can run from a PR comment or from the CLI against a PR URL.', 'PR-Agent commands', 'https://docs.pr-agent.ai/commands/')],
      ['Suggested edits', mortis.pull, fact('The /review command can return findings with committable fixes. The current command reference lists /improve as another way to run that review.', 'Review and improvement commands', 'https://docs.pr-agent.ai/commands/')],
    ],
  },
  {
    id: 'ocr', name: 'Alibaba Open Code Review', short: 'Alibaba OCR',
    focus: 'OCR can feed SARIF into code-scanning tools. Mortis exports the original run and can check a finding against a later commit. The distinction matters when your release process needs evidence of a fix.',
    rows: [
      ['Local scope', mortis.revisions, fact('OCR’s workspace mode includes staged, unstaged and untracked changes. It can also review a single commit or a branch range.', 'OCR review modes', 'https://github.com/alibaba/open-code-review#readme')],
      ['Model execution', mortis.models, fact('OCR can run its native pipeline with its configured provider or delegate the review to a coding agent using that agent’s own model.', 'OCR execution modes', 'https://github.com/alibaba/open-code-review#readme')],
      ['Follow-up', mortis.verify, fact('OCR compares saved sessions. With a review manifest, it distinguishes findings missing from reviewed files from those in files the later session did not examine.', 'OCR session comparison', 'https://github.com/alibaba/open-code-review/blob/main/internal/session/compare.go')],
      ['Report formats', mortis.export, fact('OCR’s SARIF 2.1.0 exporter represents findings with source locations and fingerprints, suitable for code-scanning tools.', 'OCR SARIF exporter', 'https://github.com/alibaba/open-code-review/blob/main/cmd/opencodereview/sarif.go')],
    ],
  },
];
