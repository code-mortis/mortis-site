---
title: PR commands and incremental reviews
description: Ask about a diff in GitHub, review a new head, and reuse coverage as commits arrive.
---

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

Generate a key with `openssl rand -base64 32` and save it as the `MORTIS_STATE_KEY` repository secret. The [review workflow](/docs/action/setup/#set-up-pull-request-reviews) passes the key, grants `actions: read` to restore previous artifacts, and queues reviews per PR. Keep the key stable between runs.

The first review covers the full PR. Subsequent reviews analyze files changed since the last compatible, fully covered review and reuse coverage for the other files. The optional `skip_unchanged` setting skips review analysis when a compatible run already covered an identical head tree. Mortis stores finalized history as an encrypted artifact per PR for your repository's artifact retention period. Missing, expired, or incompatible history triggers a full review.

The job summary and PR comment list reviewed and reused files. The PR comment keeps earlier open findings from the saved history. With `auto_resolve = true` under `[review]`, Mortis can resolve a matching inline thread after the Engine verifies the fix at the current PR head.
