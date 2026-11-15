import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (path: string) =>
  readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

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

test("documentation route exists with an empty content body", () => {
  assert.ok(read("dist/docs/index.html").includes("Documentation"));
  assert.equal(
    read("src/content/docs/docs/index.mdx").split("---")[2].trim(),
    "",
  );
});
