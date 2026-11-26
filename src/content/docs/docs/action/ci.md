---
title: Branch comparisons and CI reports
description: Compare two Git refs, scan a committed revision, and retain runner reports as artifacts.
---

## Compare branches or scan a revision

Use a separate job with `contents: read` and a checkout. For a branch comparison, use a full checkout and supply the base and head refs. Use a trusted base ref because the Engine reads its review settings there.

```yaml
steps:
  - uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1
    with:
      fetch-depth: 0
      persist-credentials: false
  - uses: code-mortis/mortis-action@0c7188bc2532fa80b34f3e781418186a39ce4f48 # v0.2.1
    id: mortis
    with:
      base: origin/main
      head: origin/my-branch
      provider: openai
      model: ${{ vars.MORTIS_MODEL }}
    env:
      MORTIS_API_KEY: ${{ secrets.MORTIS_API_KEY }}
```

To scan the commit that triggered the workflow, use the same steps with `command: scan` in place of `base` and `head`. To select another checked-out revision, set `ref`. Action v0.2.1 installs checksum-verified Trivy 0.76.2 on Linux X64 and ARM64 runners.

### Scan mode in v0.2.0

**The scan cannot complete with this release.** Action v0.2.0 installs Trivy 0.76.0 on its runner. Engine 0.1.5 checks for exactly 0.76.2 before running the scanner. The mismatch affects `command: scan`, including scheduled and manually dispatched scan jobs. PR reviews and branch comparisons do not invoke Trivy. [Action installer at v0.2.0](https://github.com/code-mortis/mortis-action/blob/v0.2.0/mortis_action/trivy.py) · [Engine scanner at v0.1.5](https://github.com/code-mortis/mortis-engine/blob/v0.1.5/src/mortis_engine/security_scans/scanner.py)

To restore scans, update your workflow to the v0.2.1 commit shown above. You can also [scan a commit with the Engine](/docs/engine/scans/#scan-a-committed-revision) or [scan the default branch from the App](/docs/app/security/#scan-a-repository).

## Read reports

The GitHub Actions job summary shows the result and coverage. The action exposes `status` (`completed`, `partial`, `failed`, or `skipped`), `run-id`, `report-json`, and `report-markdown`. Report paths are local to the runner. Upload them as artifacts from a later step in the same job if you need to keep them. Reports can contain source evidence.

A completed review can exit successfully with findings. Partial results keep their available reports and return exit code 2. A report upload step can run after a partial or failed result with `if: ${{ !cancelled() && steps.mortis.outputs.report-json != '' }}`.
