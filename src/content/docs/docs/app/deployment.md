---
title: Deployment and setup
description: Start the Docker Compose stack, install your GitHub App, and connect an AI provider.
---

## Deploy with Docker Compose

You need Docker Compose, Python 3.12 or newer to generate the environment file, a GitHub account that can register a GitHub App, and a public HTTPS hostname that GitHub can reach.

Download `compose.yaml` and `manage.py` from the [v0.1.1 GitHub Release](https://github.com/code-mortis/code-mortis/releases/tag/v0.1.1) and save them in one directory. The Compose file pulls `codemortis/code-mortis:0.1.1` from Docker Hub for Linux `amd64` and `arm64`.

```sh
python3 manage.py init-env --owner YOUR_GITHUB_LOGIN --url https://reviews.example.com
docker compose pull
docker compose up -d --wait
```

Point your HTTPS reverse proxy at `127.0.0.1:8080` on the Compose host. Use the exact browser origin in `--url` so GitHub sign-in, installation callbacks, and webhooks reach the instance. Keep the generated `.env` private and preserve `CM_ENCRYPTION_KEY` with your PostgreSQL backups so saved credentials can be decrypted after a restore. For a Git-based Coolify deployment, follow the [Coolify instructions in the app README](https://github.com/code-mortis/code-mortis#deploy-with-coolify).

### Upgrade an existing deployment

Back up PostgreSQL and `CM_ENCRYPTION_KEY`. Replace `compose.yaml` and `manage.py` in the existing project directory and keep its `.env` and volumes. Run `docker compose pull` followed by `docker compose up -d --wait --remove-orphans`. The migration service applies any database upgrades, and `--remove-orphans` removes the retired graph containers from older source deployments. For Coolify, set the shared image anchor in `compose.coolify.yaml` to the published version and redeploy the same resource.

### Configure optional Sentry reporting

Starting with App v0.1.1, set the public `CM_SENTRY_FRONTEND_DSN` in `.env` and recreate the API container to change browser reporting at runtime. In Coolify, set it in the runtime environment and redeploy. Set `CM_SENTRY_DSN` separately for backend reporting. `CM_SENTRY_ENVIRONMENT` and `CM_SENTRY_RELEASE` apply to both.

### Run a local development instance

Use a separate GitHub App and a dedicated [Smee channel](https://smee.io/) to relay GitHub webhooks to localhost. From a checkout of the App repository, run:

```sh
python3 backend/code_mortis/manage.py init-env \
  --output .env.dev --owner YOUR_GITHUB_LOGIN \
  --url http://localhost:5173 --webhook-url https://smee.io/YOUR_CHANNEL
docker compose --env-file .env.dev -f compose.dev.yaml --profile webhooks up -d --build
```

Open `http://localhost:5173` for the same setup flow, using the bootstrap token from `.env.dev`.

## Connect GitHub and an AI provider

1. Open the instance, enter `CM_BOOTSTRAP_TOKEN` from the generated environment file, and choose **Register GitHub App**. Finish registration on GitHub, then use **Continue with GitHub** to sign in.
2. In **Settings → GitHub**, choose **Install on GitHub** and select the repositories the app can access. Connect the installation so Code Mortis can sync them.
3. In **Settings → AI connections**, choose **Add connection** and configure a shared connection for OpenAI-compatible APIs, Anthropic, or Amazon Bedrock. Use **Test connection** to verify that the instance can use the provider.
4. Open a repository. Under **Repository settings → AI defaults**, select the shared connection. Under **Pull request reviews**, turn on **Enable pull request reviews** and save.
