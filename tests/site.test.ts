import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (path: string) =>
  readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("landing, comparison and docs publish the raven and its sharing image", () => {
  for (const route of ["", "comparison/", "docs/", "docs/cli/"]) {
    const page = read(`dist/${route}index.html`);
    const logo = page.match(/\bsrc="(\/_astro\/raven-orange-dark\.[^"]+\.svg)"/);
    assert.ok(logo, `Missing raven logo on /${route}`);
    const svg = read(`dist${logo[1]}`);
    assert.ok(svg.includes("#ff7545"));
    assert.ok(!svg.includes("<rect"), "The wordmark should have a transparent background");
    assert.ok(page.includes('href="/brand/orange/favicon.svg"'));
    assert.ok(page.includes('href="/brand/orange/apple-touch-icon.png"'));
    assert.ok(page.includes('href="/brand/orange/site.webmanifest"'));
    assert.ok(page.includes('property="og:image" content="https://codemortis.dev/brand/orange/share.png"'));
  }
});

test("main navigation opens the standalone comparison", () => {
  const nav = read("dist/index.html").match(/<nav\b[^>]*aria-label="Main navigation"[^>]*>([\s\S]*?)<\/nav>/);
  assert.ok(nav?.[1].includes('href="/comparison/"'));
  const page = read("dist/comparison/index.html");
  for (const tool of ["PR-Agent", "Kodus", "Alibaba Open Code Review", "Qodo"]) {
    assert.ok(page.includes(tool), `Missing ${tool}`);
  }
});

test("the public homepage renders Night Guide without preview controls", () => {
  const page = read("dist/index.html");
  assert.match(page, /<h1>Find the bug\.<br\s*\/?><em>Show the line\.<\/em><\/h1>/);
  assert.ok(page.includes("uv tool install mortis-engine"));
  assert.ok(page.includes('aria-label="Pause crow animation"'));
  assert.doesNotMatch(page, /Landing previews|\/concepts\/|noindex/);
  for (const anchor of ["inside-the-engine", "example-finding", "install"]) {
    assert.ok(page.includes('href="#' + anchor + '"'));
    assert.ok(page.includes('id="' + anchor + '"'));
  }
});

test("the home page and docs index link to both rendered engine guides", () => {
  const landing = read("dist/index.html");
  const overview = read("dist/docs/index.html");
  for (const [guide, example] of [
    ["library", "preview_local"],
    ["cli", "mortis review --preview"],
  ]) {
    const route = `/docs/${guide}/`;
    assert.ok(landing.includes(`href="${route}"`));
    assert.ok(overview.includes(`href="${route}"`));
    assert.ok(read(`dist${route}index.html`).includes(example));
  }
});

test("the docs overview and sidebar link to the self-hosted app guide", () => {
  const overview = read("dist/docs/index.html");
  const sidebar = overview.match(/<nav\b[^>]*aria-label="Main"[^>]*>([\s\S]*?)<\/nav>/);
  assert.ok(sidebar?.[1].includes('href="/docs/app/"'));
  assert.ok(overview.includes('href="/docs/app/">Set up the Code Mortis App</a>'));

  const guide = read("dist/docs/app/index.html");
  for (const section of [
    "deploy-with-docker-compose",
    "connect-github-and-an-ai-provider",
    "review-a-pull-request",
    "scan-a-repository",
    "explore-a-code-graph",
    "connect-scripts-and-agents",
  ]) {
    assert.ok(guide.includes(`id="${section}"`), `Missing app guide section ${section}`);
  }
});
