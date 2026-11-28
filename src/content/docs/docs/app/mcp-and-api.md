---
title: MCP and REST API
description: Give your coding agent access to saved evidence or query the workspace from a script.
---

## Connect scripts and agents

### Ask your agent about saved evidence

1. Have an administrator turn on MCP in **Settings → MCP access** and enable the tool groups your agent needs.
2. Open **Installation instructions** and copy the server URL (`https://your-host/mcp`) or the setup prompt. The client needs Streamable HTTP and OAuth with PKCE. The prompt includes setup instructions for Claude Code and Codex CLI.
3. Complete OAuth in the browser. Select permissions and repositories separately for each tool group. To investigate a saved finding, select its repository and grant the corresponding read scope.
4. In your agent, name the repository and the pull request or scan. For example, ask it to explain the highest-severity open finding, cite the saved path and lines, and identify any file the review skipped.

| Tool group | Read scope | What your agent can inspect |
| --- | --- | --- |
| Reviews | `reviews:read` | PRs, saved review runs, finding evidence, assessment decisions, and coverage. |
| Security | `security:read` | Saved scans, findings, observations, remediation, and coverage. |
| Code | `code:read` | Indexed source, definitions, and relationships at a matching revision. Code tools are read-only and require a ready index. |

Grant write or run permissions separately when your agent needs to triage findings or start work. Security issue publication requires the `security:issues` scope and browser approval of the draft. You can select optional Management scopes on the same OAuth consent screen. The `instance:manage` scope applies to the whole instance and requires an administrator role. Review or revoke a grant under **MCP access**.

When upgrading from separate MCP endpoints, remove the old entries from your client. Have an administrator enable MCP again, then authorize the single server URL.

Each API process serves two concurrent MCP transport or OAuth setup requests by default. You can configure the limit with `CM_MCP_MAX_CONCURRENT_REQUESTS`. At capacity, the server returns HTTP 429 with `Retry-After: 2`.

### Use the REST API

Create a personal token under **Settings → API tokens**. Select its scopes and repositories, then copy it when shown. Send it as an `Authorization: Bearer` header on supported requests to `/api/v1`. Your instance serves its OpenAPI schema at `/api/openapi.json`. The [Noodle collection](https://github.com/code-mortis/code-mortis/tree/main/collections/code-mortis) includes example requests and a read-only smoke suite.
