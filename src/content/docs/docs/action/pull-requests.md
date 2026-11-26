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

With the v0.2.2 example, for inline questions on same-repository PRs, add `pull_request_review_comment` with `types: [created]` under `on`. Post `/mortis ask ...` in **Files changed** to get a reply in that thread. On fork PRs, post the question in **Conversation** and paste a review comment URL on the last line to point to a specific location.

The v0.2.3 release candidate adds these options for PR workflows.

- Post `/mortis preview` in **Conversation** for the review scope and exclusions without a provider call. Use `/mortis review --full` to review all eligible changes within the configured limits. A maintainer can also request a review of a ready Dependabot PR.
- To ask about a thread, post `/mortis ask` with your question and the review comment permalink on its own final line in **Conversation**. Mortis uses available replies from the thread.
- Set `auto-describe` to fill the PR description from the opening review. Use `check-linked-issues` to assess linked issue requirements with your provider.
- Use `inline-min-severity` to send lower-severity findings to the summary. Set `publish-check` for an advisory check or `fail-on-severity` to enforce a threshold on the PR head. For direct merges, select the check matching the branch and threshold, such as **Mortis Review (high) / main**. Keep the check advisory on branches using a merge queue.

## Enable incremental PR reviews

Set these options in the target branch's `mortis.toml`.

```toml
[review]
incremental = true
skip_unchanged = true
```

Generate a key with `openssl rand -base64 32` and save it as the `MORTIS_STATE_KEY` repository secret. The [review workflow](/docs/action/setup/#set-up-pull-request-reviews) passes the key, grants `actions: read` to restore previous artifacts, and queues reviews per PR. Keep the key stable between runs.

The first review and the first review after an Engine upgrade cover the full PR. Subsequent reviews can reuse coverage for unchanged files from the last compatible, fully covered review. Since v0.2.1, deleting or renaming an eligible file triggers a full review so Mortis can check surviving callers. The optional `skip_unchanged` setting skips review analysis when a compatible run already covered an identical head tree. Mortis stores finalized history as an encrypted artifact per PR for your repository's artifact retention period. Missing, expired, or incompatible history triggers a full review.

Action v0.2.2 also rechecks previously reviewed Python importers when a module-level function changes its required parameters or starts or stops accepting `*args` or `**kwargs`. Fully reverting a reviewed file change triggers a fresh review of the remaining PR diff when Mortis would otherwise reuse coverage. [Engine 0.1.7 incremental review behavior](/docs/engine/reviews/#review-subsequent-commits)

In the v0.2.3 candidate, if the latest retained history is unreadable, Mortis reviews the diff and preserves the history for retry. An enforced severity policy reports `unevaluated` until it can evaluate earlier findings.

The job summary and PR comment list reviewed and reused files. The PR comment keeps earlier open findings from the saved history. With `auto_resolve = true` under `[review]`, Mortis can resolve a matching inline thread after the Engine verifies the fix at the current PR head.
