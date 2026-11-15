---
title: Why choose Code Mortis?
description: Compare how Code Mortis, PR-Agent, Kodus, Alibaba Open Code Review, and Qodo handle review evidence, incomplete coverage, and fixes.
---

<section aria-labelledby="inside-a-mortis-review">

## Inside a Mortis review

### Trace a bug to the branch

A division by zero can happen on a line the branch never touched. One Mortis test changes a caller from `inverse(1)` to `inverse(0)` while the division itself stays unchanged. The assessment can request the caller at the branch's common ancestor and at its head, then cite the change that made the failure reachable. A companion test changes only a comment and checks that an existing division bug can be rejected as unrelated. These tests exercise the evidence workflow with controlled model responses. [Branch attribution tests](https://github.com/code-mortis/mortis-engine/blob/v0.1.0/tests/review/test_attribution.py#L26-L70)

### Check the evidence for a fix

Mortis validates each cited quote against its file and line range. To accept a fix, the verifier requires supporting evidence from **both the original and current revisions**, a diff, and an explanation of what changed. If the model proposes “fixed” with evidence from only one revision, the verifier records “uncertain.” A reviewer can inspect the original report and the later verdict separately. [Fix verification implementation](https://github.com/code-mortis/mortis-engine/blob/v0.1.0/src/mortis_engine/review/verification.py#L83-L118)

### Inspect incomplete coverage

A report can contain a real finding even when another part of the same file failed analysis. Mortis preserves the finding, the failed units, and the partial status. Its CLI returns exit code `2` for partial coverage or a file-limit skip. Your CI can enforce coverage and finding severity independently. If a candidate assessment fails, retry just that candidate against the saved inputs, even after the working tree has changed. [Partial review test](https://github.com/code-mortis/mortis-engine/blob/v0.1.0/tests/review/test_recorded_review.py#L30-L55) · [Targeted retry test](https://github.com/code-mortis/mortis-engine/blob/v0.1.0/tests/test_assessments.py#L81-L115) · [CLI exit codes](/docs/cli/#use-reports-in-scripts)

</section>

<section aria-labelledby="try-mortis-on-your-branch">

## Try Mortis on your branch

Start by previewing the staged changes. The preview shows file selection, exclusions, and planned batches before you spend provider tokens. With a connection configured, review a branch, commit a fix, then verify the original finding against the new revision. [CLI guide](/docs/cli/)

```sh
mortis review --staged --preview
mortis review --base main --head HEAD

# After committing the fix, use the run ID printed by the review.
mortis verify --run RUN_ID --ref HEAD
```

For a release-wide security check, `mortis scan --ref HEAD` combines Trivy's dependency, configuration, and secret checks with model-assisted source analysis. Incomplete scans preserve findings and coverage and leave the security grade unset. [Security scan results](https://github.com/code-mortis/mortis-engine/blob/v0.1.0/src/mortis_engine/security_scans/service.py#L458-L469)

*Compared November 15, 2026 using Mortis Engine 0.1.0, public repository sources, and official product documentation. Accuracy, speed, and cost would require a head-to-head benchmark.*

</section>
