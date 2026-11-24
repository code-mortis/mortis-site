---
title: MCP and REST API
description: Give your coding agent access to saved evidence or query the workspace from a script.
---

## Connect scripts and agents

### Ask your agent about saved evidence

1. Have an administrator enable the endpoint in **Settings → MCP access**. Choose **Reviews**, **Security**, or **Code** according to the evidence you want.
2. Copy the endpoint’s setup instructions into your compatible MCP client. Complete browser authorization, select the repository, and grant the read scope listed below.
3. In your agent, name the repository and the PR or scan. For example, ask it to explain the highest-severity open finding on your PR, cite the saved path and lines, and identify any file the review skipped.

| Endpoint | Read scope | What your agent can inspect |
| --- | --- | --- |
| `/mcp/reviews` | `reviews:read` | PRs, saved review runs, finding evidence, assessment decisions, and coverage. |
| `/mcp/security` | `security:read` | Saved scans, findings, observations, remediation, and coverage. |
| `/mcp/code` | `code:read` | Indexed source, definitions, and relationships at a matching revision. This endpoint is read-only and needs a ready index. |

Grant a write or run scope separately when your agent needs to triage findings or start work. Publishing a public GitHub issue through Security MCP requires browser approval of the draft. Review or revoke an existing grant under **MCP access**.

### Use the REST API

Create a personal token under **Settings → API tokens**. Select its scopes and repositories, then copy it when shown. Send it as an `Authorization: Bearer` header on supported requests to `/api/v1`. Your instance serves its OpenAPI schema at `/api/openapi.json`. The [Noodle collection](https://github.com/code-mortis/code-mortis/tree/main/collections/code-mortis) includes example requests and a read-only smoke suite.
