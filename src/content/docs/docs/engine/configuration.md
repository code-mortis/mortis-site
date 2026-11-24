---
title: Repository configuration
description: Set review and scan policy in mortis.toml and override limits for an individual run.
---

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

To generate repository background, run `mortis background --ref HEAD` with your AI connection, read the proposal, and save the context you want under `[review].background`. The review policy can also include path-specific rules, exclusions, summary diagrams, and agent fix prompts. [Repository settings and examples](https://github.com/code-mortis/mortis-engine/tree/v0.1.5#configure-a-branch-review)
