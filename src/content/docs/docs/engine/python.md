---
title: Python library
description: Call the same Engine from Python to plan reviews, scan a commit, and read saved evidence as versioned dictionaries.
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

The `mortis.review-preview/v1` dictionary also contains the selected files, units of source assigned to analysis, and planned batches. The batch count estimates initial analysis work. Assessment and summary generation can make additional requests. Check `errors` as well as `excluded_files` for source that could not be read. An unreadable file can retain its change status and original rename path when Git metadata is available. When an eligible deletion or rename triggers caller discovery, read `plan.get("affected_callers")` for caller ranges and discovery limits.

`preview_local` and `review_local` accept the same scopes. Preview shows the full scope and rejects `incremental` and `skip_unchanged` overrides.

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

If you already saved a profile with `mortis connect work`, use `settings = config.profile("work")` in place of the settings dictionary. The same credential callback resolves the profile's environment or vault references. [Configure a profile in the CLI guide](/docs/engine/cli/#connect-a-provider)

To review a feature branch from Python, reuse the connection and callback above. Check out the feature branch and pass the name of its local base branch.

```python
from mortis_engine.review import review_commits

branch_report = review_commits(
    ".", base="main", head="HEAD",
    connection=connection, get_credentials=get_credentials,
    overrides={"incremental": True, "skip_unchanged": True},
)
print(branch_report["merge_base"], branch_report["head_sha"])
print(branch_report.get("comparison"), branch_report["coverage"]["reused"])
```

Both comparison options default to `False`. Pass the same `overrides` to `review_local` with `mode="commits"`. Keep the same branch refs across runs so the engine can locate prior coverage. See [when a comparison falls back to a full review](/docs/engine/reviews/#review-subsequent-commits). Resume keeps the saved selection.

To ask a question about the diff or draft a description of the changes, use [`mortis ask` and `mortis describe`](/docs/engine/reviews/#ask-about-or-describe-a-branch-comparison).

Pass `review_local` the keyword argument `overrides={"max_output_tokens": 0, "token_budget": 0}` to let the provider determine the per-response allowance for analysis. For Bedrock, this uses the Converse default. Anthropic Messages looks up the selected model's output capacity. The [CLI guide](/docs/engine/configuration/#configure-the-repository) explains what changes when a token budget is finite.

## Interpret the result

A review returns a `mortis.review/v1` dictionary. Keep the `run_id` for follow-up work. Read `findings` alongside `status`, `coverage`, and `errors` before deciding whether a change passed your checks. A partial review can return confirmed findings. A skipped review can mean there were no eligible changes, the file limit waived coverage, or a compatible review already covered the same tree. Inspect `coverage["waived"]` and `comparison` to distinguish those outcomes. `coverage["completed"]` lists files analyzed in the current run, and `coverage["reused"]` lists prior coverage. An unchanged comparison records zero model calls and links to the earlier run. Candidate assessments and token usage are available in `candidates` and `usage`.

When present, `report["affected_callers"]` gives the outcome of each [caller range](/docs/engine/reviews/#review-callers-of-deleted-or-renamed-files) separately from file coverage. Check it alongside `status` and `errors` before using the report as a gate.

For graph-enabled reviews in Engine 0.1.7, `report.get("code_graph", {}).get("discovery_omissions", [])` gives the `path`, `reason`, and `unit_keys` for optional graph context omitted from discovery. Older reports may omit this field.

Review functions are synchronous. In an application with a running asyncio event loop, await the call through `asyncio.to_thread`. Reviews retain their snapshots and results under `$XDG_STATE_HOME/mortis` (default `~/.local/state/mortis`). This history can contain reviewed source.

## Scan a commit or follow up on a review

Use `mortis_engine.operations.run` with the same connection and credential callback. A security scan also needs Trivy 0.76.2 on `PATH`.

```python
from mortis_engine.operations import run

scan = run(
    ".", kind="scan", ref="HEAD",
    connection=connection, get_credentials=get_credentials,
)
print(scan["run_id"], scan["status"], scan["grade"])
```

The `mortis.security/v1` result includes findings, coverage, and problems. A partial scan returns `scan["grade"] is None` and can contain findings. In the Engine 0.1.9 candidate, read `scan["problems"]` for missing dependency inventory or supporting source. `scan["coverage"]["completed_files"]` counts completed semantic file analyses. Use the following operations for review follow-ups and repository context.

| `kind` | Inputs | Result |
| --- | --- | --- |
| `"verify"` | `finding_run=report["run_id"], ref="HEAD"` | Verdicts for saved review findings against the target revision |
| `"summary"` | `finding_run=report["run_id"]` | A new summary of the saved review |
| `"background"` | `ref="HEAD"` | Proposed project background for the repository configuration |

Verification checks the original and current paths for saved findings. Standalone verification uses the review concurrency configured at the target revision. It checks independent findings concurrently and returns verdicts in report order.

To read decisions made after a report was saved, use the same repository path and run ID. This lookup uses local history and requires no provider.

```python
from mortis_engine.operations import list_findings

current = list_findings(".", run_id=report["run_id"], include_history=True)
print(current["findings"])
```

### Recover one failed assessment

Call `list_assessments(".", run_id=report["run_id"])` from `mortis_engine.operations` to inspect candidate IDs, retry eligibility, and reasons a retry may be blocked. For an eligible candidate, call `retry_assessment` with `run_id`, `candidate_id`, the matching `connection`, and its `get_credentials` callback. It uses the saved evidence and records a separate result. The original report, coverage, and grade remain available.

To record a human decision, use `triage` with the finding ID, current version, state, and reason. Read back the decision with `list_findings(..., include_history=True)`. These lookups and decisions use local history. [CLI examples for saved runs](/docs/engine/saved-runs/#revisit-a-saved-run) · [Mortis Engine source](https://github.com/code-mortis/mortis-engine/tree/main/src/mortis_engine)
