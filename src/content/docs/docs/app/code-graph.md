---
title: Repository code graph
description: Enable indexing and follow dependencies through the source at a specific revision.
---

## Explore a code graph

On a Compose deployment, add `code-graph` to `COMPOSE_PROFILES` in the environment file and run `docker compose up -d --build` again. The profile starts a private parser and a dedicated worker. Turn on **Code graph** in each repository's settings and save to opt in.

After indexing, open the repository's **Code graph** page to explore file dependencies at the indexed revision. Search for a file, focus its neighborhood, and follow an import to the indexed source. The graph describes imports at that commit.

![The code graph focused on reminders.py and its import relationships.](../../../../../assets/details/code-mortis-graph.webp)

The optional diagram on a PR overview groups changes for that pull request. Code Mortis can use related source as PR review context when a matching index is ready. Pull request diffs in **Code** are available independently of indexing. If you back up the graph, keep its `code-graph-data` volume with the matching PostgreSQL backup.
