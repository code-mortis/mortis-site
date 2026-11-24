---
title: GitHub Action
description: Set up Mortis Action for pull request reviews, branch comparisons, and security scans in GitHub Actions.
---

[Mortis Review and Scan](https://github.com/marketplace/actions/mortis-review-and-scan) runs Mortis Engine in GitHub Actions. It can review pull requests as commits arrive, compare two Git refs, or scan a committed revision. [Mortis Action v0.2.0](https://github.com/code-mortis/mortis-action/releases/tag/v0.2.0) installs Mortis Engine 0.1.5 on a Linux runner. The Engine sends eligible source and diffs to your configured AI provider.

## Set up pull request reviews

1. Under **Settings → Secrets and variables → Actions**, add a repository secret named `MORTIS_API_KEY` with your provider API key.
2. Add a repository variable named `MORTIS_MODEL` with a model ID supported by your provider, or set `model` under `[review]` in the target branch's `mortis.toml`. The committed model takes precedence.
3. Save this workflow as `.github/workflows/mortis-review.yml` on the default branch. Set `provider` to your [Mortis Engine provider preset](https://pypi.org/project/mortis-engine/0.1.5/#connect-with-environment-variables). Use `protocol` and `base-url` if your connection needs overrides.

```yaml
name: Mortis PR review
on:
  pull_request_target:
    types: [opened, reopened, synchronize, ready_for_review]
  issue_comment:
    types: [created]

permissions: {}

jobs:
  review:
    if: ${{ github.event.sender.type != 'Bot' }}
    runs-on: ubuntu-latest
    timeout-minutes: 30
    permissions:
      actions: read
      contents: read
      pull-requests: write
    concurrency:
      group: mortis-review-${{ github.event.pull_request.number || github.event.issue.number }}
      queue: max
    steps:
      - uses: code-mortis/mortis-action@483f17a82d2187ec23d93d26962a3f08e127362b # v0.2.0
        id: mortis
        with:
          provider: openai
          model: ${{ vars.MORTIS_MODEL }}
        env:
          MORTIS_API_KEY: ${{ secrets.MORTIS_API_KEY }}
          MORTIS_STATE_KEY: ${{ secrets.MORTIS_STATE_KEY }}
```

The action fetches the PR commits into a temporary bare repository and reads them as data. It reviews the diff from the merge base to the exact PR head and loads `mortis.toml` from the target commit. Keep this job dedicated to review and run PR builds or tests in a separate `pull_request` workflow. If your repository has an Actions event policy, check that it allows `pull_request_target`. [GitHub's guide to the event](https://docs.github.com/en/actions/reference/security/securely-using-pull_request_target)

Same-repository PRs are reviewed automatically. Set `automatic = false` under `[review]` to rely on manual reviews. The action skips drafts and Dependabot PRs. Other bot PRs require `include_bot_prs = true`. To opt into automatic fork reviews, add `review-forks: "true"` under the action's `with` block. Fork activity can then trigger provider calls.

## Review and discuss a pull request

Mortis updates a summary comment with coverage and confirmed findings. It posts inline findings when GitHub can anchor them to added lines. When the Engine can verify an exact replacement, the inline comment may include a GitHub suggestion.

People with repository write access can post these commands as new comments on an open PR, including fork PRs.

| Comment | What Mortis does |
| --- | --- |
| `/mortis review` | Reviews the current PR head. |
| `/mortis ask Why does this change the default?` | Answers from the current diff and links to supporting lines. |
| `/mortis describe` | Updates the PR title and Mortis summary block while preserving the rest of the description. |

For inline questions on same-repository PRs, add `pull_request_review_comment` with `types: [created]` under `on`. Post `/mortis ask ...` in **Files changed** to get a reply in that thread. On fork PRs, post the question in **Conversation** and paste a review comment URL on the last line to point to a specific location.

## Enable incremental PR reviews

Set these options in the target branch's `mortis.toml`.

```toml
[review]
incremental = true
skip_unchanged = true
```

Generate a key with `openssl rand -base64 32` and save it as the `MORTIS_STATE_KEY` repository secret. The example workflow passes the key, grants `actions: read` to restore previous artifacts, and queues reviews per PR. Keep the key stable between runs.

The first review covers the full PR. Subsequent reviews analyze files changed since the last compatible, fully covered review and reuse coverage for the other files. The optional `skip_unchanged` setting skips review analysis when a compatible run already covered an identical head tree. Mortis stores finalized history as an encrypted artifact per PR for your repository's artifact retention period. Missing, expired, or incompatible history triggers a full review.

The job summary and PR comment list reviewed and reused files. The PR comment keeps earlier open findings from the saved history. With `auto_resolve = true` under `[review]`, Mortis can resolve a matching inline thread after the Engine verifies the fix at the current PR head.

## Compare branches or scan a revision

Use a separate job with `contents: read` and a checkout. For a branch comparison, use a full checkout and supply the base and head refs. Use a trusted base ref because the Engine reads its review settings there.

```yaml
steps:
  - uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1
    with:
      fetch-depth: 0
      persist-credentials: false
  - uses: code-mortis/mortis-action@483f17a82d2187ec23d93d26962a3f08e127362b # v0.2.0
    id: mortis
    with:
      base: origin/main
      head: origin/my-branch
      provider: openai
      model: ${{ vars.MORTIS_MODEL }}
    env:
      MORTIS_API_KEY: ${{ secrets.MORTIS_API_KEY }}
```

For a scan, replace `base` and `head` with `command: scan`. Set `ref` to choose another committed revision, or omit it to scan the commit that triggered the workflow. The action installs Trivy for scans and reads `[scan]` configuration from the scanned commit. [Complete branch and scan workflows](https://github.com/code-mortis/mortis-action/tree/v0.2.0#compare-branches)

## Read reports

The GitHub Actions job summary shows the result and coverage. The action exposes `status` (`completed`, `partial`, `failed`, or `skipped`), `run-id`, `report-json`, and `report-markdown`. Report paths are local to the runner. Upload them as artifacts from a later step in the same job if you need to keep them. Reports can contain source evidence.

A completed review can exit successfully with findings. Partial results keep their available reports and return exit code 2. A report upload step can run after a partial or failed result with `if: ${{ !cancelled() && steps.mortis.outputs.report-json != '' }}`.
