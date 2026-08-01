#!/usr/bin/env node
/**
 * PostToolUse hook (matcher Edit|Write): runs `npx prettier --write` on the touched
 * file, ONLY if the project has Prettier configured.
 *
 * ABSOLUTE RULE: a hook must never block the flow. Any failure (invalid stdin,
 * missing file, Prettier absent, timeout) ends with exit 0, silently.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const EXTENSIONS = new Set(['.js', '.jsx', '.ts', '.tsx', '.css', '.html', '.json', '.md']);

const CONFIG_FILES = [
  '.prettierrc',
  '.prettierrc.json',
  '.prettierrc.json5',
  '.prettierrc.yaml',
  '.prettierrc.yml',
  '.prettierrc.toml',
  '.prettierrc.js',
  '.prettierrc.cjs',
  '.prettierrc.mjs',
  '.prettierrc.ts',
  'prettier.config.js',
  'prettier.config.cjs',
  'prettier.config.mjs',
  'prettier.config.ts',
];

// Walks up from `startDir` to the filesystem root looking for a Prettier config:
// a .prettierrc* or prettier.config.* file, or a "prettier" field in package.json.
function hasPrettierConfig(startDir) {
  let dir = startDir;
  for (;;) {
    for (const name of CONFIG_FILES) {
      if (fs.existsSync(path.join(dir, name))) return true;
    }
    const pkgPath = path.join(dir, 'package.json');
    if (fs.existsSync(pkgPath)) {
      try {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
        if (pkg && pkg.prettier !== undefined) return true;
      } catch (_) {
        // invalid package.json: ignore and keep walking up
      }
    }
    const parent = path.dirname(dir);
    if (parent === dir) return false; // reached the filesystem root
    dir = parent;
  }
}

function main() {
  // Reads the JSON payload from stdin; strips any BOM (U+FEFF) before parsing.
  let input = fs.readFileSync(0, 'utf8');
  if (input.charCodeAt(0) === 0xfeff) input = input.slice(1);
  const payload = JSON.parse(input);
  const filePath = payload && payload.tool_input && payload.tool_input.file_path;
  if (!filePath || typeof filePath !== 'string') return;

  const absolute = path.resolve(filePath);
  if (!EXTENSIONS.has(path.extname(absolute).toLowerCase())) return;
  if (!fs.existsSync(absolute)) return;
  if (absolute.split(/[\\/]/).includes('node_modules')) return;
  if (!hasPrettierConfig(path.dirname(absolute))) return;

  if (process.platform === 'win32') {
    // On Windows, npx is npx.cmd and requires a shell; quotes protect spaces in the path.
    spawnSync(`npx prettier --write "${absolute}"`, {
      shell: true,
      stdio: 'ignore',
      timeout: 30000,
    });
  } else {
    spawnSync('npx', ['prettier', '--write', absolute], {
      stdio: 'ignore',
      timeout: 30000,
    });
  }
}

try {
  main();
} catch (_) {
  // silent by design: the hook must never block the edit
}
process.exit(0);
