---
title: Python library
description: Preview Git changes, run a review, and use Mortis findings in a Python application.
---

Install Mortis Engine in your project's Python 3.13–3.15 environment. Git must be on `PATH`.

```sh
python -m pip install mortis-engine
```

For a uv-managed project, use `uv add mortis-engine`. Run the examples from a Git repository with at least one commit. The first argument to each function is the repository path.

## Preview a review

Use `preview_local` to see what the engine would send for analysis. This example inspects the committed tree at `HEAD` and works without credentials or a saved run.

```python
from mortis_engine.review import preview_local

plan = preview_local(".", mode="all")
print(plan["totals"])
for file in plan["excluded_files"]:
    print(file["path"], file["reason"])
```

The `mortis.review-preview/v1` dictionary also contains the selected files, units of source assigned to analysis, and planned batches. The batch count estimates initial analysis work. Assessment and summary generation can make additional requests.

`preview_local` and `review_local` accept the same scopes.

| To inspect | Arguments |
| --- | --- |
| Staged, unstaged, and eligible untracked changes against `HEAD` | `mode="worktree"` (default) |
| Only what is staged for the next commit | `mode="staged"` |
| Changes from the common ancestor of two commits to the head revision | `mode="commits", base="main", head="HEAD"` |
| Every eligible tracked file in a commit | `mode="all", head="HEAD"` |

## Run a review from Python

For this OpenAI example, set `OPENAI_API_KEY` in the process environment and `MORTIS_MODEL` to a model ID available to your account that supports tool calls. Build the connection once and pass a function that retrieves its credentials when the engine needs them. Eligible source and diffs go to the selected provider.

```python
import os

from mortis_engine import config
from mortis_engine.review import review_local

settings = {
    "provider": "openai",
    "protocol": "openai",
    "base_url": "https://api.openai.com/v1",
    "model": os.environ["MORTIS_MODEL"],
    "api_key_env": "OPENAI_API_KEY",
}
connection = config.connection("work", settings)

def get_credentials():
    return config.credentials(settings)

report = review_local(".", connection=connection, get_credentials=get_credentials)
print(report["run_id"], report["status"])
print(report["coverage"])
for finding in report["findings"]:
    print(finding["path"], finding["start_line"], finding["content"])
```

If you already saved a profile with `mortis connect work`, use `settings = config.profile("work")` in place of the settings dictionary. The same credential callback resolves the profile's environment or vault references. [Configure a profile in the CLI guide](/docs/cli/#connect-a-provider)

To review a feature branch from Python, reuse the connection and callback above. Check out the feature branch and pass the name of its local base branch.

```python
from mortis_engine.review import review_commits

branch_report = review_commits(
    ".", base="main", head="HEAD",
    connection=connection, get_credentials=get_credentials,
)
print(branch_report["merge_base"], branch_report["head_sha"])
```

## Interpret the result

A review returns a `mortis.review/v1` dictionary. Keep the `run_id` for follow-up work. Read `findings` alongside `status`, `coverage`, and `errors` before deciding whether a change passed your checks. A partial review can return confirmed findings. A skipped review can mean there were no eligible changes or that the file limit waived coverage. Inspect `coverage["waived"]` to distinguish those cases. Candidate assessments and token usage are available in `candidates` and `usage`.

Review functions are synchronous. In an application with a running asyncio event loop, await the call through `asyncio.to_thread`. Reviews retain their snapshots and results under `$XDG_STATE_HOME/mortis` (default `~/.local/state/mortis`). This history can contain reviewed source.

## Scan a commit or follow up on a review

Use `mortis_engine.operations.run` with the same connection and credential callback. A security scan also needs Trivy 0.76.0 on `PATH`.

```python
from mortis_engine.operations import run

scan = run(
    ".", kind="scan", ref="HEAD",
    connection=connection, get_credentials=get_credentials,
)
print(scan["run_id"], scan["status"], scan["grade"])
```

The `mortis.security/v1` result includes findings, coverage, and problems. A partial scan has no grade. Use the following operations for review follow-ups and repository context.

| `kind` | Inputs | Result |
| --- | --- | --- |
| `"verify"` | `finding_run=report["run_id"], ref="HEAD"` | Verdicts for saved review findings against the target revision |
| `"summary"` | `finding_run=report["run_id"]` | A new summary of the saved review |
| `"background"` | `ref="HEAD"` | Proposed project background for the repository configuration |

To read decisions made after a report was saved, use the same repository path and run ID. This lookup uses local history and requires no provider.

```python
from mortis_engine.operations import list_findings

current = list_findings(".", run_id=report["run_id"], include_history=True)
print(current["findings"])
```

The operations module also exports `triage` to record a decision and `list_assessments` and `retry_assessment` to inspect and retry failed candidates. [Mortis Engine 0.1.0 source](https://github.com/code-mortis/mortis-engine/tree/v0.1.0/src/mortis_engine)
