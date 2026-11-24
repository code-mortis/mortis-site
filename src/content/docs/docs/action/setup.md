---
title: Workflow setup
description: Configure the GitHub events, permissions, and provider credentials for automatic reviews.
---

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

Same-repository PRs are reviewed automatically. Set `automatic = false` under `[review]` to rely on manual reviews. The action skips drafts and Dependabot PRs. For other bots, `include_bot_prs = true` allows bot-authored PRs. The example job also filters out bot-triggered events with its `if` condition. To opt into automatic fork reviews, add `review-forks: "true"` under the action's `with` block. Fork activity can then trigger provider calls.
