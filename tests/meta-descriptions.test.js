import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

const MIN_LENGTH = 150;
const MAX_LENGTH = 160;

const ASTRO_PAGES = [
  'src/pages/index.astro',
  'src/pages/about.astro',
  'src/pages/404.astro',
];

function extractFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;

  const frontmatter = {};
  const lines = match[1].split('\n');

  for (const line of lines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) continue;

    const key = line.slice(0, colonIndex).trim();
    let value = line.slice(colonIndex + 1).trim();

    // Remove quotes if present
    if ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    frontmatter[key] = value;
  }

  return frontmatter;
}

function getAllContentFiles() {
  const files = [];

  function walk(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.name.endsWith('.md') || entry.name.endsWith('.mdx')) {
        files.push(fullPath);
      }
    }
  }

  const contentDir = path.join(process.cwd(), 'src/content');
  walk(contentDir);

  return files;
}

function loadConsts() {
  const content = fs.readFileSync(path.join(process.cwd(), 'src/consts.ts'), 'utf-8');
  const consts = {};
  for (const match of content.matchAll(/export\s+const\s+(\w+)\s*=\s*'([^']*)'/g)) {
    consts[match[1]] = match[2];
  }
  for (const match of content.matchAll(/export\s+const\s+(\w+)\s*=\s*"([^"]*)"/g)) {
    consts[match[1]] = match[2];
  }
  return consts;
}

function extractAstroDescription(filePath, consts) {
  const content = fs.readFileSync(filePath, 'utf-8');

  const literalMatch = content.match(/description="([^"]*)"/);
  if (literalMatch) return literalMatch[1];

  const refMatch = content.match(/description=\{(\w+)\}/);
  if (refMatch && consts[refMatch[1]]) return consts[refMatch[1]];

  return null;
}

test('all meta descriptions are between 150-160 characters', (t) => {
  const files = getAllContentFiles();
  const consts = loadConsts();
  const failures = [];
  let checked = 0;

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf-8');
    const frontmatter = extractFrontmatter(content);

    if (!frontmatter || !frontmatter.description) {
      continue;
    }

    const description = frontmatter.description;
    const length = description.length;
    const relativePath = path.relative(process.cwd(), file);
    checked++;

    if (length < MIN_LENGTH || length > MAX_LENGTH) {
      failures.push({
        file: relativePath,
        length,
        description,
        issue: length < MIN_LENGTH ? 'too short' : 'too long'
      });
    } else {
      t.diagnostic(`✔ ${relativePath}: ${length} chars`);
    }
  }

  for (const page of ASTRO_PAGES) {
    const description = extractAstroDescription(path.join(process.cwd(), page), consts);
    if (!description) continue;

    const length = description.length;
    checked++;

    if (length < MIN_LENGTH || length > MAX_LENGTH) {
      failures.push({
        file: page,
        length,
        description,
        issue: length < MIN_LENGTH ? 'too short' : 'too long'
      });
    } else {
      t.diagnostic(`✔ ${page}: ${length} chars`);
    }
  }

  if (failures.length > 0) {
    const message = failures.map(f =>
      `${f.file}: ${f.length} chars (${f.issue})\n  "${f.description}"`
    ).join('\n\n');

    assert.fail(`Found ${failures.length} description(s) outside ${MIN_LENGTH}-${MAX_LENGTH} char range:\n\n${message}`);
  }

  t.diagnostic(`${checked} file(s) checked`);
});

test('all content files have descriptions', (t) => {
  const files = getAllContentFiles();
  const consts = loadConsts();
  const missing = [];
  let total = 0;

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf-8');
    const frontmatter = extractFrontmatter(content);
    const relativePath = path.relative(process.cwd(), file);
    total++;

    if (!frontmatter || !frontmatter.description) {
      missing.push(relativePath);
    } else {
      t.diagnostic(`✔ ${relativePath}: has description`);
    }
  }

  for (const page of ASTRO_PAGES) {
    const description = extractAstroDescription(path.join(process.cwd(), page), consts);
    total++;

    if (!description) {
      missing.push(page);
    } else {
      t.diagnostic(`✔ ${page}: has description`);
    }
  }

  if (missing.length > 0) {
    assert.fail(`Found ${missing.length} file(s) without descriptions:\n\n${missing.join('\n')}`);
  }

  t.diagnostic(`${total} file(s) checked`);
});
