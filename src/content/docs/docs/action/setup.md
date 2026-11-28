---
title: Workflow setup
description: Configure the GitHub events, permissions, and provider credentials for automatic reviews.
---

## Set up pull request reviews

1. Under **Settings → Secrets and variables → Actions**, add a repository secret named `MORTIS_API_KEY` with your provider API key.
2. Add a repository variable named `MORTIS_MODEL` with a model ID supported by your provider, or set `model` under `[review]` in the target branch's `mortis.toml`. The committed model takes precedence.
3. Save this workflow as `.github/workflows/mortis-review.yml` on the default branch. Set `provider` to your [Mortis Engine provider preset](https://pypi.org/project/mortis-engine/0.1.8/#connect-with-environment-variables). Use `protocol` and `base-url` if your connection needs overrides.

```yaml
name: Mortis PR review
on:
  pull_request_target:
    types: [opened, reopened, synchronize, ready_for_review, edited]
  issue_comment:
    types: [created]

permissions: {}

jobs:
  review:
    if: >-
      (github.event_name == 'pull_request_target' &&
       !github.event.pull_request.draft &&
       github.event.pull_request.user.login != 'dependabot[bot]' &&
       github.event.sender.login != 'dependabot[bot]' &&
       (github.event.action != 'edited' || github.event.changes.base)) ||
      (github.event_name == 'issue_comment' && github.event.issue.pull_request &&
       github.event.comment.user.type == 'User' && contains(github.event.comment.body, '/mortis '))
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
      - uses: code-mortis/mortis-action@1c726fd12f14bee0170ff1a41ac13d90ba27db6f # v0.2.4
        id: mortis
        with:
          provider: openai
          model: ${{ vars.MORTIS_MODEL }}
        env:
          MORTIS_API_KEY: ${{ secrets.MORTIS_API_KEY }}
          MORTIS_STATE_KEY: ${{ secrets.MORTIS_STATE_KEY }}
```

The action fetches the PR commits into a temporary bare repository and reads them as data. It reviews the diff from the merge base to the exact PR head and loads `mortis.toml` from the target commit. Keep this job dedicated to review and run PR builds or tests in a separate `pull_request` workflow. [GitHub's guide to the event](https://docs.github.com/en/actions/reference/security/securely-using-pull_request_target)

The workflow reviews PRs after a target branch change and filters unrelated comments before starting a runner. Grant `issues: read` for `check-linked-issues` and `checks: write` for `publish-check` or `fail-on-severity`.

### Public repository event policy

Starting December 2, 2026, public repositories using the workflow above on GitHub.com need an Actions event policy that explicitly allows `pull_request_target`. GitHub enforces the default block before the Mortis job starts. [GitHub's enforcement announcement](https://github.blog/changelog/2026-11-02-pull_request_target-blocked-by-default-december-2/)

For automatic reviews, open **Settings → Actions → Policies** and scope the allowance to `.github/workflows/mortis-review.yml`. Include `issue_comment` in the allowed events for this workflow if you use manual commands. **Policy insights** shows runs affected by an event rule. [GitHub's workflow execution policy guide](https://docs.github.com/en/actions/how-tos/administer/control-workflow-execution)

For manual reviews under the default policy, remove the `pull_request_target` trigger and keep `issue_comment` on the default branch. A user with write access can post `/mortis review` on an open PR, including a fork PR.

### Automatic review settings

Same-repository PRs are reviewed automatically. Set `automatic = false` under `[review]` to rely on manual reviews. The action skips drafts and automatic reviews of Dependabot PRs. A maintainer can request a review of a ready Dependabot PR with `/mortis review`. For other bots, `include_bot_prs = true` allows bot-authored PRs. To opt into automatic fork reviews, add `review-forks: "true"` under the action's `with` block. Fork activity can then trigger provider calls.
