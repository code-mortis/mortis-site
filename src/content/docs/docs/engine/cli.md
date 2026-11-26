---
title: CLI setup
description: Install Mortis, inspect your first review plan, and connect a model or coding agent.
---

## Install and preview

Install the `mortis` command as a standalone tool with uv. Mortis Engine requires Git and Python 3.13–3.15.

```sh
uv tool install mortis-engine
mortis --version
```

From a local Git repository with at least one commit, preview the next review. Add a change first if the working tree is clean.

```sh
mortis review --preview
```

The preview lists selected files, exclusions and their reasons, and planned batches. It runs locally without a provider connection or a saved run. Add `--format json` to inspect the plan from a script. For staged, working-tree, or branch scopes, the preview can also list [affected caller ranges](/docs/engine/reviews/#review-callers-of-deleted-or-renamed-files).

## Connect a provider

```sh
mortis connect work
```

Choose your provider and model at the prompts, then enter the key at the hidden prompt. Mortis makes two small model requests to check tool calling. After the test succeeds, it saves the profile and stores the key in your OS credential vault. Analysis sends eligible source and diffs to this provider.

For CI or a terminal without a credential vault, set `MORTIS_API_KEY` through your secret manager and `MORTIS_MODEL` to a supported model ID. This command saves an OpenAI profile that reads its key from the environment.

```sh
mortis connect work --provider openai --model "$MORTIS_MODEL" \
  --api-key-env MORTIS_API_KEY --non-interactive
```

Keep the key available in the environment for later runs. Profiles live in `$XDG_CONFIG_HOME/mortis/config.toml` (default `~/.config/mortis/config.toml`). Use `mortis connect --list-providers` to see the available presets and `mortis connect work --test` to retest a saved profile. Where the provider supports discovery, `mortis connect work --list-models` lists its available models. For Bedrock, enter the model or inference profile ID directly.

Mortis uses [Bedrock Converse](https://docs.aws.amazon.com/bedrock/latest/APIReference/API_runtime_Converse.html) for Bedrock connections. Select a model or inference profile that supports the tool and structured-output features your workflow uses. See the [connection options](https://github.com/code-mortis/mortis-engine#connect-with-environment-variables) for ambient AWS credentials and API keys.

Public endpoints require HTTPS unless you explicitly trust the hostname with `CM_TRUSTED_ENDPOINT_HOSTS`. With `CM_ALLOW_PRIVATE_ENDPOINTS=true`, HTTP is allowed only when every resolved address is private or loopback. Inference in Engine 0.1.7 reports DNS lookup failures separately from endpoint policy rejections. A temporary DNS failure can be retried. A request that stops during DNS resolution releases its token reservation.

Custom `extra_body` options cannot replace engine-managed inputs, output formats or authentication. Configure supported nested properties individually. See the [provider options](https://github.com/code-mortis/mortis-engine#connect-with-environment-variables) for details.

## Use with coding agents

After installing the CLI, register its bundled coding-agent skill.

```sh
mortis agent install
```

The command installs the skill in `~/.agents/skills/` and registers it with detected Claude Code, Codex, Cursor and OpenCode installations. Installation runs locally. Rerun it after upgrading Mortis to refresh managed copies. Use `mortis agent install --force` to replace a manually installed skill.

In a new session in your checkout, ask your agent to “preview my staged changes with Mortis and explain which files are excluded.” This uses the installed CLI. To ask about runs saved on a shared instance, [connect the App’s MCP endpoint](/docs/app/mcp-and-api/#connect-scripts-and-agents). For a review or scan, give the agent the saved connection to use if you have more than one.
