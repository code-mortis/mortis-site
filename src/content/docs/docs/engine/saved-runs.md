---
title: Reports and saved runs
description: Export a report, verify a fix at a later revision, or resume work from local history.
---

## Use reports in scripts

```sh
mortis review --staged --progress --format json --output reports/review.md
```

This writes the versioned review JSON to stdout, sends progress to stderr, and saves a Markdown copy from the same run. Repeat `--output` with a fresh `.json` or `.md` filename to save additional copies. Mortis creates missing parent directories and rejects existing destinations. Ignore the reports directory in Git if you keep exports inside the repository.

| Review exit code | Meaning for automation |
| --- | --- |
| `0` | Review completed, there were no eligible changes, or an unchanged comparison was skipped. Inspect `findings`, `coverage.reused` and the prior run in `comparison` when present. |
| `2` | Partial coverage or files waived by the configured limit. Inspect `coverage`, `errors`, and `affected_callers` when present. |
| `1` | Review failed. Inspect the error output. |

## Revisit a saved run

Run `mortis runs` in the same repository to find its run IDs. Substitute an ID for `RUN_ID` below. Local history under `$XDG_STATE_HOME/mortis` (default `~/.local/state/mortis`) can contain reviewed source.

| Task | Command |
| --- | --- |
| Inspect the original result | `mortis runs RUN_ID` |
| Export a saved review or scan without making another model request | `mortis report --run RUN_ID --output reports/saved.md` |
| Continue an interrupted review with its saved inputs and limits | `mortis review --resume RUN_ID --progress` |
| Continue an interrupted scan at its saved revision | `mortis scan --resume RUN_ID --progress` |
| Verify review findings after committing a fix | `mortis verify --run RUN_ID --ref HEAD` |
| Generate a fresh summary of a saved review | `mortis summary --run RUN_ID` |
| Inspect current findings and decision history | `mortis findings --run RUN_ID --history` |
| List failed candidates and their retry eligibility | `mortis assessments --run RUN_ID` |
| Retry an eligible candidate | `mortis assess --run RUN_ID --candidate CANDIDATE_ID` |

Resumed reviews and scans use their saved limits, concurrency, and assessment policy. Resumed reviews keep their saved caller scope and line numbering. Older runs keep their batched assessment behavior. A dispatched request with unknown usage keeps its token reservation.

The Engine 0.1.9 candidate starts a new scan with observations from scans and confirmed assessment retries that finished in the same scope before it began. This includes observations from overlapping scans. Resume keeps the original scan history and analysis policy. If Trivy drops a check that the scan already used, the resumed report lists the affected path and withholds the grade.

In Engine 0.1.7, each review candidate has its own assessment attempt, even when candidates have identical content. To continue an interrupted retry, run `mortis assess --resume RETRY_RUN_ID` with the retry's own run ID. Mortis reuses its saved response when available.

Use `mortis triage` to record a decision about a finding. Supply the ID and current version from `mortis findings`, together with a reason. Review findings accept `dismissed` and `open`. Security findings accept `false_positive`, `accepted_risk`, and `open`. The original report stays available by run ID.

For all commands, run `mortis --help`. For provider-specific configuration and detailed options, see the [Mortis Engine README](https://github.com/code-mortis/mortis-engine#readme).
