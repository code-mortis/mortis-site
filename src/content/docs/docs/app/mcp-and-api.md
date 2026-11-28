---
title: MCP and REST API
description: Give your coding agent access to saved evidence or query the workspace from a script.
---

## Connect scripts and agents

### Ask your agent about saved evidence

1. Have an administrator turn on MCP in **Settings → MCP access** and enable the tool groups your agent needs.
2. Open **Installation instructions** and copy the server URL (`https://your-host/mcp`) or the setup prompt. The client needs Streamable HTTP and OAuth with PKCE. The prompt includes setup instructions for Claude Code and Codex CLI. For automatic client registration, leave **Allowed client domains** empty. If you list domains and use Claude Code, include `claude.ai`. The OAuth callback can use a temporary local port.
3. Complete OAuth in the browser. Select permissions and repositories separately for each tool group. To investigate a saved finding, select its repository and grant the corresponding read scope.
4. In your agent, name the repository and the pull request or scan. For example, ask it to explain the highest-severity open finding, cite the saved path and lines, and identify any file the review skipped.

| Tool group | Read scope | What your agent can inspect |
| --- | --- | --- |
| Reviews | `reviews:read` | PRs, saved review runs, finding evidence, assessment decisions, and coverage. |
| Security | `security:read` | Saved scans, findings, observations, remediation, and coverage. |
| Code | `code:read` | Indexed source, definitions, and relationships at a matching revision. Code tools are read-only and require a ready index. |

Grant write or run permissions separately when your agent needs to triage findings or start work. Security issue publication requires the `security:issues` scope and browser approval of the draft. You can select optional Management scopes on the same OAuth consent screen. The `instance:manage` scope applies to the whole instance and requires an administrator role. Review or revoke a grant under **MCP access**.

When upgrading from separate MCP endpoints, remove the old entries from your client. Have an administrator enable MCP again, then authorize the single server URL.

Each API process serves two concurrent MCP transport or OAuth setup requests by default. You can configure the limit with `CM_MCP_MAX_CONCURRENT_REQUESTS`. At capacity, the server returns HTTP 429 with `Retry-After: 2`. OAuth endpoint discovery stays available.

### Use guides and follow a task

Call `get_workflow_guide` to list the read-only guides your grant can access. Pass a guide name to read it. Clients that support MCP Skills on protocol revision `2026-07-28` can also discover the guides directly.

| Guide | Read scope |
| --- | --- |
| `explain-pr-review` | `reviews:read` |
| `prioritize-security-findings` | `security:read` |
| `trace-change-impact` | `code:read` |

Grant both read and run access for the relevant group to follow a task after reconnecting. Clients that support MCP Tasks on protocol revision `2026-07-28` receive a task ID when starting a manual review, a repository scan, or a repository background draft. Only administrators can generate background drafts. If your client returns a run, scan, or job ID, pass it to `reviews_get_run`, `security_get_scan`, or `reviews_get_background_status`, respectively.

On the same protocol revision, clients that support stateless elicitation can ask you to choose a scan connection or give a reason for changing a security finding’s state. For issue publication, the client can open the approval page so you can check the draft. Other clients can supply the fields directly and use the approval link returned by the tool.

### Use the REST API

Create a personal token under **Settings → API tokens**. Select its scopes and repositories, then copy it when shown. Send it as an `Authorization: Bearer` header on supported requests to `/api/v1`. Your instance serves its OpenAPI schema at `/api/openapi.json`. The [Noodle collection](https://github.com/code-mortis/code-mortis/tree/main/collections/code-mortis) includes example requests and a read-only smoke suite.
