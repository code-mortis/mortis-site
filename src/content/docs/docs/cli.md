---
title: Command-line interface
description: Install the Mortis CLI, choose a review scope, connect a provider, and export reports.
---

## Install and preview

Install the `mortis` command as a standalone tool with uv. Mortis Engine requires Git and Python 3.13–3.15.

```sh
uv tool install mortis-engine
mortis --version
```

From a local Git repository with at least one commit, preview the next review. Add a change first if the working tree is clean.

```sh
mortis review --preview
```

The preview lists selected files, exclusions and their reasons, and planned batches. It runs locally without a provider connection or a saved run. Add `--format json` to inspect the plan from a script.

## Use with coding agents

With Mortis Engine 0.1.1 or later, install the bundled skill after installing the CLI.

```sh
mortis agent install
```

The command installs the skill in `~/.agents/skills/` and registers it with detected Claude Code, Codex, Cursor and OpenCode installations. Installation runs locally. Rerun it after upgrading Mortis to refresh managed copies. Use `mortis agent install --force` to replace a manually installed skill.

Ask your agent to preview the review scope without contacting a provider. For a review or scan, give the agent the saved connection to use if you have more than one.

## Connect a provider

```sh
mortis connect work
```

Choose your provider and model at the prompts, then enter the key at the hidden prompt. Mortis makes two small model requests to check tool calling. After the test succeeds, it saves the profile and stores the key in your OS credential vault. Analysis sends eligible source and diffs to this provider.

For CI or a terminal without a credential vault, set `MORTIS_API_KEY` through your secret manager and `MORTIS_MODEL` to a supported model ID. This command saves an OpenAI profile that reads its key from the environment.

```sh
mortis connect work --provider openai --model "$MORTIS_MODEL" \
  --api-key-env MORTIS_API_KEY --non-interactive
```

Keep the key available in the environment for later runs. Profiles live in `$XDG_CONFIG_HOME/mortis/config.toml` (default `~/.config/mortis/config.toml`). Use `mortis connect --list-providers` to see the available presets and `mortis connect work --test` to retest a saved profile.

Mortis uses [Bedrock Converse](https://docs.aws.amazon.com/bedrock/latest/APIReference/API_runtime_Converse.html) for Bedrock connections. Select a model or inference profile that supports the tool and structured-output features your workflow uses. See the [connection options](https://github.com/code-mortis/mortis-engine#connect-with-environment-variables) for ambient AWS credentials and API keys.

Public endpoints require HTTPS unless you explicitly trust the hostname with `CM_TRUSTED_ENDPOINT_HOSTS`. With `CM_ALLOW_PRIVATE_ENDPOINTS=true`, HTTP is allowed only when every resolved address is private or loopback.

Custom `extra_body` options cannot replace engine-managed inputs, output formats or authentication. Configure supported nested properties individually. See the [provider options](https://github.com/code-mortis/mortis-engine#connect-with-environment-variables) for details.

## Run a review

```sh
mortis review --connection work --progress
```

Mortis takes a snapshot of your changes, reviews eligible files, and checks candidates against the pinned source before reporting findings. The output includes a run ID and coverage. With one saved profile, you can omit `--connection`.

| Command | What it reviews |
| --- | --- |
| `mortis review` | Staged, unstaged, and eligible untracked changes against `HEAD` |
| `mortis review --staged` | The Git index against `HEAD` |
| `mortis review --base main --head HEAD` | Changes from the common ancestor with local `main` to the current commit |
| `mortis review --all` | Every eligible tracked file in the current commit |
| `mortis review --all --head main` | Every eligible tracked file at the tip of local `main` |

Add `--preview` to any of these scopes to check your selection. Use `--repo PATH` to select another local clone. For optional code graph context, build the parser image with `mortis graph build` (requires Docker), then pass `--graph` to the review. After upgrading from 0.1.2 or earlier, rerun `mortis graph build` before using graph context. A review can use available graph facts when graph coverage is incomplete.

Working-tree reviews read files without following symlinks or running Git filters. If the platform cannot provide safe no-follow file access, use `--staged` for the changes you intend to review. Files over 20 MB or otherwise unreadable are reported as coverage gaps when the snapshot can still be built.

## Review subsequent commits

```sh
mortis review --base main --incremental --skip-unchanged
```

`--incremental` analyzes files changed since the last compatible, fully covered review of the same branch. Each selected file uses its cumulative diff from the common ancestor. The summary and `max_files` still cover the full branch comparison. Use a branch name or its checked-out `HEAD` to keep a consistent history scope. Missing or incomplete history, a changed base or configuration, and unavailable ancestry trigger a full comparison. `--graph` and `--second-pass` also use the full comparison.

`--skip-unchanged` skips model calls when a compatible review already covered the same Git tree, including after an empty commit. The report records `status: skipped`, reuses the prior coverage, and links to the earlier run. Both options default to `false`. Set `incremental` and `skip_unchanged` under `[review]` on the base branch to enable them independently. Use `--no-incremental` and `--no-skip-unchanged` to override those defaults for one run.

A preview shows the full scope without reading saved reviews. Run `mortis review --base main --preview` separately from the comparison flags. `--resume` uses the saved selection.

## Configure the repository

Commit a `mortis.toml` at the root of the repository to share defaults. A branch comparison reads settings from the base commit. Staged and working-tree reviews use settings committed at `HEAD`.

```toml
[review]
effort = "medium"
max_files = 40
concurrency = 2

[scan]
effort = "high"
concurrency = 4
```

Check the effective review settings for a branch comparison with `mortis config show --base main`. Override one run with flags such as `--effort high`, `--max-files 80`, or `--concurrency 4`. Concurrency accepts 1–8. See `mortis review --help` for timeout and token budgets, including per-response and assessment limits.

Eligible analysis, assessment, and AI fix checks start as slots open. Related candidates are assessed in order, and verification returns verdicts in report order. Requests release their execution slot while waiting to retry or for tokens to become available. Waiting still counts toward the run deadline.

`--max-output-tokens 0` lets the provider determine the output allowance when the total token budget is unlimited. OpenAI and Bedrock use their service defaults, and Anthropic Messages looks up the selected model's capacity. With a finite token budget, Mortis derives the cap from the remaining budget. Use a positive limit within the model's capacity to fit multiple requests in a finite budget, or when the provider rejects the derived cap or cannot report its capacity.

## Scan a committed revision

Install Trivy 0.76.2 on `PATH` before running a security scan. Mortis uses Trivy to check dependencies, configuration and secrets, and the selected model to analyze source and assess findings.

```sh
mortis scan --ref HEAD --connection work --progress
```

The report includes findings, coverage, and a grade when available. If required supporting evidence is unavailable, Mortis keeps validated results and reports a partial scan without a grade. Inspect the reported problems and completed-file count before interpreting the findings.

## Use reports in scripts

```sh
mortis review --staged --progress --format json --output reports/review.md
```

This writes the versioned review JSON to stdout, sends progress to stderr, and saves a Markdown copy from the same run. Repeat `--output` with a fresh `.json` or `.md` filename to save additional copies. Mortis creates missing parent directories and rejects existing destinations. Ignore the reports directory in Git if you keep exports inside the repository.

| Review exit code | Meaning for automation |
| --- | --- |
| `0` | Review completed, there were no eligible changes, or an unchanged comparison was skipped. Inspect `findings`, `coverage.reused` and the prior run in `comparison` when present. |
| `2` | Partial coverage or files waived by the configured limit. Inspect `coverage` and `errors`. |
| `1` | Review failed. Inspect the error output. |

## Revisit a saved run

Run `mortis runs` in the same repository to find its run IDs. Substitute an ID for `RUN_ID` below. Local history under `$XDG_STATE_HOME/mortis` (default `~/.local/state/mortis`) can contain reviewed source.

| Task | Command |
| --- | --- |
| Inspect the original result | `mortis runs RUN_ID` |
| Export a saved review or scan without making another model request | `mortis report --run RUN_ID --output reports/saved.md` |
| Continue an interrupted review with its saved inputs and limits | `mortis review --resume RUN_ID --progress` |
| Verify review findings after committing a fix | `mortis verify --run RUN_ID --ref HEAD` |
| Generate a fresh summary of a saved review | `mortis summary --run RUN_ID` |
| Inspect current findings and decision history | `mortis findings --run RUN_ID --history` |
| List failed candidates and their retry eligibility | `mortis assessments --run RUN_ID` |
| Retry an eligible candidate | `mortis assess --run RUN_ID --candidate CANDIDATE_ID` |

Resumed reviews and scans use their saved limits, concurrency, and assessment policy. Older runs keep their batched assessment behavior. A dispatched request with unknown usage keeps its token reservation.

Use `mortis triage` to record a decision about a finding. Supply the ID and current version from `mortis findings`, together with a reason. Review findings accept `dismissed` and `open`. Security findings accept `false_positive`, `accepted_risk`, and `open`. The original report stays available by run ID.

For all commands, run `mortis --help`. For provider-specific configuration and detailed options, see the [Mortis Engine README](https://github.com/code-mortis/mortis-engine#readme).
