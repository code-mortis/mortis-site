import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { docSections } from "../src/data/doc-sections";
import { movedHeadings, oldGuides, type OldGuide } from "../src/data/doc-bookmarks";

const read = (path: string) =>
  readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("landing, comparison and docs publish the raven and its sharing image", () => {
  for (const route of ["", "comparison/", "docs/", "docs/engine/cli/"]) {
    const page = read(`dist/${route}index.html`);
    const logo = page.match(/src="(\/_astro\/raven-orange\.[^"]+\.svg)"[^>]*>\s*<span[^>]*>Code Mortis<\/span>/);
    assert.ok(logo, `Missing raven logo on /${route}`);
    const svg = read(`dist${logo[1]}`);
    assert.ok(svg.includes("#ff7545"));
    assert.ok(!svg.includes("<rect"), "The raven should have a transparent background");
    assert.ok(page.includes('href="/brand/orange/favicon.svg"'));
    assert.ok(page.includes('href="/brand/orange/apple-touch-icon.png"'));
    assert.ok(page.includes('href="/brand/orange/site.webmanifest"'));
    assert.ok(page.includes('property="og:image" content="https://codemortis.dev/brand/orange/share.png"'));
  }
});

test("docs examples publish syntax tokens for both themes and a matching stylesheet", () => {
  for (const [guide, language] of [["engine/python", "python"], ["engine/cli", "sh"], ["engine/configuration", "toml"], ["action/setup", "yaml"]]) {
    const page = read(`dist/docs/${guide}/index.html`);
    const stylesheet = page.match(/href="(\/_astro\/ec\.[^"]+\.css)"/)?.[1];
    assert.ok(stylesheet, `Missing syntax stylesheet for ${guide}`);
    assert.match(read(`dist${stylesheet}`), /var\(--1,\s*inherit\)/);
    const code = page.match(new RegExp(`<pre data-language="${language}">([\\s\\S]*?)<\\/pre>`))?.[1];
    assert.ok(code, `Missing ${language} block in ${guide}`);
    assert.ok(new Set(code.match(/--0:#[a-f\d]+/gi)).size > 1, `Missing dark token colors in ${guide}`);
    assert.ok(new Set(code.match(/--1:#[a-f\d]+/gi)).size > 1, `Missing light token colors in ${guide}`);
  }
});

test("main navigation opens the standalone comparison", () => {
  const nav = read("dist/index.html").match(/<nav\b[^>]*aria-label="Main navigation"[^>]*>([\s\S]*?)<\/nav>/);
  assert.ok(nav?.[1].includes('href="/comparison/"'));
  const page = read("dist/comparison/index.html");
  assert.match(page, /<nav[^>]*aria-label="Main navigation"[\s\S]*?href="\/comparison\/" aria-current="page"/);
  for (const anchor of ["tour", "setup", "agents"]) {
    assert.ok(page.includes(`href="/#${anchor}"`), `Missing homepage link to #${anchor}`);
  }
  for (const id of ["coderabbit", "qodo", "kodus", "greptile", "pr-agent", "ocr"]) {
    assert.ok(page.includes(`href="#${id}"`), `Missing selector for ${id}`);
    assert.ok(page.includes(`id="${id}"`), `Missing comparison content for ${id}`);
  }
  assert.ok(page.includes('class="workflow-table"'));
  assert.ok(page.includes('data-enlarge'));
  assert.ok(page.includes('Mortis Engine 0.1.5'));
});

test("the public homepage opens Review Desk with its repository tour and setup guides", () => {
  const page = read("dist/index.html");
  assert.match(page, /<h1\b[^>]*>Code review with <em\b[^>]*>receipts\.<\/em><\/h1>/);
  assert.ok(page.includes('aria-label="Explore the repository"'));
  assert.ok(page.includes('id="capture-dialog"'));
  assert.ok(page.includes("uv tool install mortis-engine"));
  assert.ok(page.includes('href="/docs/action/setup/"'));
  assert.doesNotMatch(page, /All mockups|\/mockups\/|noindex/);
  for (const anchor of ["tour", "setup", "agents"]) {
    assert.ok(page.includes(`href="#${anchor}"`));
    assert.ok(page.includes(`id="${anchor}"`));
  }
  for (const bookmark of ["inside-the-engine", "example-finding", "install"]) {
    assert.ok(page.includes(`id="${bookmark}"`), `Missing homepage bookmark #${bookmark}`);
  }
});

test("the homepage links directly to the CLI, Python, Action and deployment guides", () => {
  const page = read("dist/index.html");
  for (const route of ["engine/cli", "engine/python", "action/setup", "app/deployment"]) {
    assert.ok(page.includes(`href="/docs/${route}/"`), route);
  }
  assert.ok(read("dist/docs/engine/cli/index.html").includes("mortis review --preview"));
  assert.ok(read("dist/docs/engine/python/index.html").includes("preview_local"));
});

test("the docs directory, product pages and sidebar expose all three sections and their topics", () => {
  const overview = read("dist/docs/index.html");
  const directory = overview.match(/<div class="product-directory">([\s\S]+?)<\/section>\s*<\/div>/)?.[1];
  assert.ok(directory);
  const sidebar = overview.match(/<nav\b[^>]*aria-label="Main"[^>]*>([\s\S]*?)<\/nav>/)?.[1];
  assert.ok(sidebar);
  for (const { id, label, topics } of docSections) {
    const base = `/docs/${id}/`;
    const product = read(`dist${base}index.html`);
    assert.ok(directory.includes(`href="${base}"`));
    assert.ok(sidebar.includes(`>${label}</span>`));
    const surfaces: string[] = [directory, product, sidebar];
    for (const topic of topics) {
      const href = `${base}${topic}/`;
      for (const surface of surfaces) assert.ok(surface.includes(`href="${href}"`), href);
      const page = read(`dist${href}index.html`);
      assert.match(page, new RegExp(`class="doc-path"[\\s\\S]*?href="${base}">${label}</a>`));
      assert.ok(page.includes('data-open-modal'));
    }
  }
});

test("guide bookmarks resolve to the headings in the reorganized docs", () => {
  const overview = read("dist/docs/index.html");
  for (const id of ["choose-a-guide", "python-library", "command-line-interface", "github-action", "code-mortis-app"]) {
    assert.ok(overview.includes(`id="${id}"`));
  }
  for (const id of Object.keys(oldGuides) as OldGuide[]) {
    const origin = read(`dist/docs/${id}/index.html`);
    for (const [heading, path] of movedHeadings(id)) {
      assert.ok(origin.includes(heading), `/docs/${id}/#${heading}`);
      assert.ok(read(`dist${path}index.html`).includes(`id="${heading}"`), path + "#" + heading);
    }
  }
  assert.ok(read("dist/docs/app/index.html").includes('id="find-work-in-the-workspace"'));
  assert.match(read("dist/docs/action/ci/index.html"), /Trivy 0\.76\.0[\s\S]+?0\.76\.2/);
});
