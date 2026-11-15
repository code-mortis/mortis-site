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

test("landing includes CLI and library PyPI installs and upcoming products", () => {
  const page = read("dist/index.html");
  for (const text of [
    "uv tool install mortis-engine",
    "pip install mortis-engine",
    "uv add mortis-engine",
    "preview_local",
    "The App",
    "GitHub Action",
  ]) {
    assert.ok(page.includes(text), `Missing ${text}`);
  }
  assert.equal((page.match(/Coming soon/g) || []).length, 2);
  assert.ok(page.includes('href="/docs/"'));
  assert.ok(!page.includes("publication is pending"));
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
