---
title: Code Mortis App
description: Self-host GitHub pull request reviews, repository security scans, and code navigation with Code Mortis.
---

The [Code Mortis App](https://github.com/code-mortis/code-mortis) is a self-hosted web workspace for GitHub pull request reviews and repository security scans. It uses Mortis Engine for AI analysis and Trivy for deterministic security checks. Reviews, findings, coverage, and model usage are saved on your instance. The AI provider you select receives eligible source and diffs during analysis.

## Deploy with Docker Compose

You need Docker Compose, Python 3.12 or newer to generate the environment file, a GitHub account that can register a GitHub App, and a public HTTPS hostname that GitHub can reach.

```sh
git clone https://github.com/code-mortis/code-mortis.git
cd code-mortis
python3 backend/code_mortis/manage.py init-env \
  --owner YOUR_GITHUB_LOGIN --url https://reviews.example.com
docker compose up -d --build --wait
```

Point your HTTPS reverse proxy at `127.0.0.1:8080` on the Compose host. Use the exact browser origin in `--url` so GitHub sign-in, installation callbacks, and webhooks reach the instance. Keep the generated `.env` private and preserve `CM_ENCRYPTION_KEY` with your PostgreSQL backups so saved credentials can be decrypted after a restore. For a Git-based Coolify deployment, follow the [Coolify instructions in the app README](https://github.com/code-mortis/code-mortis#deploy-with-coolify).

### Run a local development instance

Use a separate GitHub App and a dedicated [Smee channel](https://smee.io/) to relay GitHub webhooks to localhost. From the same repository checkout, run:

```sh
python3 backend/code_mortis/manage.py init-env \
  --output .env.dev --owner YOUR_GITHUB_LOGIN \
  --url http://localhost:5173 --webhook-url https://smee.io/YOUR_CHANNEL
docker compose --env-file .env.dev -f compose.dev.yaml --profile webhooks up -d --build
```

Open `http://localhost:5173` for the same setup flow, using the bootstrap token from `.env.dev`.

## Connect GitHub and an AI provider

1. Open the instance, enter `CM_BOOTSTRAP_TOKEN` from the generated environment file, and choose **Register GitHub App**. Finish registration on GitHub, then use **Continue with GitHub** to sign in.
2. In **Settings → GitHub**, choose **Install on GitHub** and select the repositories the app can access. Connect the installation so Code Mortis can sync them.
3. In **Settings → AI connections**, choose **Add connection** and configure a shared connection for OpenAI-compatible APIs, Anthropic, or Amazon Bedrock. Use **Test connection** to verify that the instance can use the provider.
4. Open a repository. Under **Repository settings → AI defaults**, select the shared connection. Under **Pull request reviews**, turn on **Enable pull request reviews** and save.

## Review a pull request

Open a pull request and choose **Run review**. Use **Findings** to inspect evidence or resolve and dismiss findings, **Code** to browse the diff, and **Overview** to read the GitHub description and any saved Mortis summary for that revision, including an interactive change diagram when available. **Run history** opens individual reviews, where **Coverage** shows which files were analyzed, reused, or skipped. A finding absent from a later review stays open until it is resolved or dismissed.

Code Mortis posts inline comments through your GitHub App and reports run status in a GitHub check. Inspect the run when the check reports incomplete coverage or a publication failure.

To review new commits on open, non-draft pull requests, turn on **Automatically review new commits** in repository settings. Fork pull requests require a manual start. Enable **Incremental automatic reviews** to reuse validated coverage for unchanged files when a compatible earlier review exists. The Coverage tab links to that review when it reuses coverage. Manual reviews and reviews using code graph context analyze all eligible files within the configured limits.

Use the repository's **Custom rules** page to add project-specific review instructions. Set file paths or globs to limit where a rule applies, or leave both empty to apply it to all files. The **Project context** and **Pull request reviews** sections of repository settings control shared exclusions, review sensitivity, and run limits.

## Scan a repository

Open the repository's **Security** page and choose **Run scan**. Select a shared AI connection and start the scan. It analyzes a pinned commit from the default branch with Mortis Engine and runs Trivy checks for dependency vulnerabilities, exposed secrets, and infrastructure misconfigurations.

Inspect **Findings** to triage confirmed results or create GitHub issues for selected findings. Open **Scan history** to see each scan's coverage and assessment results. The Security page shows the commit that received the saved grade and whether the default branch has moved since then.

## Explore a code graph

On a Compose deployment, add `code-graph` to `COMPOSE_PROFILES` in the environment file and run `docker compose up -d --build` again. The profile starts a private parser and a dedicated worker. Turn on **Code graph** in each repository's settings and save to opt in.

After indexing, open the repository's **Code graph** page to explore file dependencies at the indexed revision. Code Mortis can also use related source as PR review context when a matching index is ready. Pull request diffs in **Code** are available independently of indexing. If you back up the graph, keep its `code-graph-data` volume with the matching PostgreSQL backup.

## Connect scripts and agents

- **REST API.** Create a personal token under **Settings → API tokens**. Choose the scopes and repositories it needs, then copy it when shown. Send it as an `Authorization: Bearer` header on supported requests to `/api/v1`. Your instance serves its OpenAPI schema at `/api/openapi.json`. The [Noodle collection](https://github.com/code-mortis/code-mortis/tree/main/collections/code-mortis) includes example requests and a read-only smoke suite.
- **MCP.** Open **Settings → MCP access** for the installation instructions for `/mcp/reviews`, `/mcp/security`, or `/mcp/code`. Connect through the browser authorization flow and grant only the repositories and scopes the client needs. The Code endpoint is read-only and requires an indexed repository. Publishing a public GitHub issue through MCP requires browser approval of the draft.
