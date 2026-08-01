#!/usr/bin/env node
/**
 * Stop hook: reminds to run /review (and /design-review if UI) when the repository
 * has changed code — at MOST once per session.
 *
 * Flow:
 * 1. Reads the JSON payload from stdin (session_id, stop_hook_active, cwd).
 * 2. stop_hook_active=true -> immediate exit 0 (anti-loop).
 * 3. No .git in the directory -> exit 0 (nothing to review via git).
 * 4. `git status --porcelain` filtered by code files (js/jsx/ts/tsx/css/html/py).
 * 5. If there are changes AND the marker file os.tmpdir()/template-review-reminder-<session_id>
 *    does not exist: creates the marker and prints {"systemMessage": "..."} to stdout.
 * 6. Any other case (or ANY error): silent exit 0.
 *
 * ABSOLUTE RULE: a hook must never block the flow. Failure = exit 0, silently.
 */
'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const CODE_EXTENSIONS = new Set(['.js', '.jsx', '.ts', '.tsx', '.css', '.html', '.py']);

// Extracts the path from a `git status --porcelain` line ("XY path"; renames
// come as "XY old -> new"; paths with spaces come wrapped in quotes).
function pathFromLine(line) {
  if (line.length < 4) return null;
  let file = line.slice(3);
  const arrow = file.lastIndexOf(' -> ');
  if (arrow !== -1) file = file.slice(arrow + 4);
  return file.replace(/^"|"$/g, '');
}

function main() {
  // Payload from stdin; strip any BOM before parsing.
  let input = fs.readFileSync(0, 'utf8');
  if (input.charCodeAt(0) === 0xfeff) input = input.slice(1);
  const payload = JSON.parse(input);

  // Anti-loop: if this Stop already comes from a hook-caused continuation, say nothing.
  if (payload && payload.stop_hook_active === true) return;

  const sessionId =
    payload && typeof payload.session_id === 'string'
      ? payload.session_id.replace(/[^A-Za-z0-9_-]/g, '')
      : '';
  if (!sessionId) return; // without an id we can't guarantee "1 reminder per session"

  const dir =
    payload && typeof payload.cwd === 'string' && payload.cwd
      ? payload.cwd
      : process.cwd();
  if (!fs.existsSync(path.join(dir, '.git'))) return;

  const git = spawnSync('git', ['status', '--porcelain'], {
    cwd: dir,
    encoding: 'utf8',
    timeout: 10000,
    windowsHide: true,
  });
  if (git.status !== 0 || typeof git.stdout !== 'string') return;

  const hasChangedCode = git.stdout.split(/\r?\n/).some((line) => {
    const file = pathFromLine(line);
    return file !== null && CODE_EXTENSIONS.has(path.extname(file).toLowerCase());
  });
  if (!hasChangedCode) return;

  // A marker in tmpdir guarantees at most 1 reminder per session.
  const marker = path.join(os.tmpdir(), 'template-review-reminder-' + sessionId);
  if (fs.existsSync(marker)) return;
  fs.writeFileSync(marker, new Date().toISOString());

  process.stdout.write(
    JSON.stringify({
      systemMessage:
        '⚠ Code changed without review this session. Before shipping: /review (and /design-review if UI changed).',
    })
  );
}

try {
  main();
} catch (_) {
  // silent by design: a Stop hook must never block shutdown
}
process.exit(0);
