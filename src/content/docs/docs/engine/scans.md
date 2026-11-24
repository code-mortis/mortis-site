---
title: Security scans
description: Scan a committed revision and read the grade alongside coverage, findings, and unresolved problems.
---

## Scan a committed revision

Install Trivy 0.76.2 on `PATH` before running a security scan. Mortis uses Trivy to check dependencies, configuration and secrets, and the selected model to analyze source and assess findings.

```sh
mortis scan --ref HEAD --connection work --progress
```

The report includes findings, coverage, and a grade when available. If required supporting evidence is unavailable, Mortis keeps validated results and reports a partial scan without a grade. Inspect the reported problems and completed-file count before interpreting the findings.

After rotating or revoking a credential, pass `--acknowledge-rotation FINDING_ID` on the next scan of the same scope. Use the finding ID from the original scan so Mortis can check removal. Accepted risks still count toward the security rating. Marking a false positive excludes it from future ratings.
