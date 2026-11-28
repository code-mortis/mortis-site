---
title: Local and branch reviews
description: Choose the Git changes to review, inspect finding evidence, or ask a question about a branch.
---

## Run a review

```sh
mortis review --connection work --progress
```

Mortis takes a snapshot of your changes, reviews eligible files, and checks candidates against the pinned source before reporting findings. The output includes a run ID and coverage. With one saved profile, you can omit `--connection`.

| Command | What it reviews |
| --- | --- |
| `mortis review` | Staged, unstaged, and eligible untracked changes against `HEAD` |
| `mortis review --staged` | The Git index against `HEAD` |
| `mortis review --base main --head HEAD` | Changes from the common ancestor with local `main` to the current commit |
| `mortis review --all` | Every eligible tracked file in the current commit |
| `mortis review --all --head main` | Every eligible tracked file at the tip of local `main` |

Add `--preview` to any of these scopes to check your selection. Use `--repo PATH` to select another local clone. For optional code graph context, build the parser image with `mortis graph build` (requires Docker), then pass `--graph` to the review. After upgrading to Engine 0.1.6, rerun `mortis graph build` before using graph context. The new image uses Python 3.15, Tree-sitter 0.27 and updated C# and PHP grammars. A review can use available graph facts when graph coverage is incomplete.

In Engine 0.1.7, the terminal lists paths where optional graph context was dropped to fit a discovery request. The JSON report lists the affected review units in `code_graph.discovery_omissions`. Read `coverage` for the outcome of the source review.

Working-tree reviews read files without following symlinks or running Git filters. If the platform cannot provide safe no-follow file access, use `--staged` for the changes you intend to review. Files over 20 MB or otherwise unreadable are reported as coverage gaps when the snapshot can still be built.

In Engine 0.1.8, a working-tree review can follow an unstaged replacement of a file with a directory or a directory with a file. A file marked only with `git add -N` appears in working-tree scope and enters staged scope once its contents are staged. For files marked `text=auto`, the snapshot applies Git’s line-ending rules.

### Read the evidence

A confirmed finding cites the reviewed path and lines at the pinned revision. New reviews in Engine 0.1.7 count lines the same way Git does, including in files with bare carriage returns or Unicode line separators. Mortis can read supporting source from unchanged files and look up literal symbols without Docker. When a proposed line replacement is supported by the evidence, the report can include a suggestion. Inspect coverage and errors even when a review returns findings.

For an experimental second pass, add `--second-pass` to a review. It uses the same analysis budget and sends new candidates through assessment. It is off by default. If it fails, the report retains validated first-pass results and records incomplete coverage.

### Review callers of deleted or renamed files

Starting with Engine 0.1.6, branch, staged, and working-tree reviews look for surviving references to eligible deleted or renamed files. For example, deleting a shell script can bring an unchanged Python line that invokes it into review. Discovery uses the review's file policy and runs without Docker. In Engine 0.1.7, it also recognizes absolute imports of Python modules under `src/`. For example, moving `src/billing/tax.py` can bring an unchanged `from billing.tax import rate` into review.

```sh
mortis review --base main --preview --format json
```

Look for `affected_callers` in the preview and report. It lists the triggering changes, caller ranges, and discovery limits. An examined range counts only toward caller coverage for that range. When a discovery limit leaves coverage incomplete, the CLI exits with code `2` and the review retains validated findings. Dynamically constructed references can escape discovery.

Engine 0.1.8 also recognizes package-relative Python imports, including multiline imports and aliases. Calls through an imported alias can be reviewed even when they are several lines from the import. A shell caller such as `sh ./scripts/rebuild\ cache.sh` can be selected when that script is deleted. The assessor receives the deletion or rename verified against the merge base and head, then checks its effect on the caller.

## Ask about or describe a branch comparison

Mortis Engine 0.1.5 adds two commands for comparing the common ancestor of a local base and head with the head commit. Both use the base commit's review settings and send eligible diff context to the selected connection. Use `--connection NAME` to select a saved profile.

```sh
mortis ask --base main --head HEAD --question-file question.txt --format json
mortis ask --base main --head HEAD --question-file question.txt --path app.py --line 4:6 --side right --format json
mortis describe --base main --head HEAD --format json
```

`ask` takes a nonempty UTF-8 question file of at most 8,000 characters. Use `--path`, `--line START[:END]`, and `--side` together to focus the question. A range can overlap multiple hunks on the `left` (merge base) or `right` (head) side. Each answer citation gives the path, exact commit, and line range of a supporting hunk.

`describe` drafts a title, narrative, and groups of changes that you can review before using in a pull request.

JSON uses `mortis.ask/v1` or `mortis.describe/v1`. Both `completed` and `insufficient_context` exit with code 0. Check `status` before reading `result`. If `limited_context` is true, the context budget left out some hunks. Use `mortis runs RUN_ID` to read a saved result when the output includes a `run_id`. Each command starts a fresh comparison.

## Review subsequent commits

```sh
mortis review --base main --incremental --skip-unchanged
```

`--incremental` analyzes files changed since the last compatible, fully covered review of the same branch. Each selected file uses its cumulative diff from the common ancestor. The summary and `max_files` still cover the full branch comparison. Use a branch name or its checked-out `HEAD` to keep a consistent history scope. Missing or incomplete history, a changed Engine version, base or configuration, and unavailable ancestry trigger a full comparison. A changed head tree with an eligible deletion or rename also gets a full comparison so callers are checked again. `--graph` and `--second-pass` use the full comparison.

Mortis rechecks previously reviewed Python importers when a module-level function changes its required parameters or its acceptance of `*args` or `**kwargs`. Engine 0.1.8 also rechecks importers when the function is removed, switches between `def` and `async def`, loses an optional keyword, or changes which parameter receives an existing argument. Examples include reordering positional-only parameters and adding a named parameter that captures a keyword previously passed through `**kwargs`. Compatible optional additions and body-only changes still allow reuse.

The first comparison after upgrading establishes a fresh baseline. If the bounded inspection cannot finish, Mortis reviews the full comparison. Fully reverting a reviewed file change also triggers a full review of the remaining branch diff when it would otherwise reuse coverage.

`--skip-unchanged` skips model calls when a compatible review already covered the same Git tree, including after an empty commit. The report records `status: skipped`, reuses the prior coverage, including any complete caller coverage, and links to the earlier run. Both options default to `false`. Set `incremental` and `skip_unchanged` under `[review]` on the base branch to enable them independently. Use `--no-incremental` and `--no-skip-unchanged` to override those defaults for one run.

A preview shows the full scope without reading saved reviews. Run `mortis review --base main --preview` separately from the comparison flags. `--resume` uses the saved selection.
