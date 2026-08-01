#!/usr/bin/env node
/**
 * SessionStart hook: automatically injects ABOUT.md into the session context.
 *
 * Behavior:
 * - ABOUT.md filled in  -> prints the full content to stdout (becomes context)
 *   and, if "Active pack:" != none, appends the reminder to read the PACK.md of EACH pack.
 *   Line 2 accepts ONE pack or a LIST separated by " + " (e.g. "nextjs + node-api").
 * - "Language:" line (line 4) set to a language other than en AND
 *   .claude/locales/<language>.md exists -> appends a reminder to read the locale
 *   file before client-facing work.
 * - ABOUT.md missing or placeholder-only -> instructs to open wizard.html or run /new-project.
 * - Output capped at ~5000 characters (truncates with a notice).
 *
 * ABSOLUTE RULE: a hook must never block the flow. Any failure ends with exit 0.
 * Deliberately does not read stdin (avoids hanging when run manually without a pipe).
 */
'use strict';

const fs = require('fs');
const path = require('path');

const OUTPUT_LIMIT = 5000;
const VALID_PACKS = new Set(['nextjs', 'static', 'node-api', 'python']);
const NOT_FILLED_MSG =
  'ABOUT.md not filled in yet — open wizard.html in a browser or run /new-project';

// Extracts the pack list from the "Active pack: <a> + <b>" line (separators + or ,), or [].
function activePacks(content) {
  const m = content.match(/^\s*active pack:\s*(.+?)\s*$/im);
  if (!m) return [];
  return m[1]
    .toLowerCase()
    .split(/[+,]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

// Extracts the project language from the "Language: <lang>" line, or ''.
// First token only, restricted to safe filename characters (e.g. "pt-BR", "es").
function projectLanguage(content) {
  const m = content.match(/^\s*language:\s*(.+?)\s*$/im);
  if (!m) return '';
  const lang = m[1].split(/\s/)[0].trim();
  return /^[A-Za-z0-9_-]+$/.test(lang) ? lang : '';
}

// The 3 tone-of-voice presets ship literally in the canonical template (the user
// deletes two when filling it in) — on their own, they don't count as real content.
const TEMPLATE_LINES = ['sober institutional', 'persuasive e-commerce', 'conversion landing'];

// Considered filled in if: some pack != none (already actionable information),
// OR at least one line of real content exists. These do NOT count as content:
// empty line, heading (#), the "Active pack:" and "Language:" lines (the skeleton
// ships them with values), instruction blockquote (>), italic instruction (_..._),
// lines with a [PLACEHOLDER] and the literal lines of the canonical template
// (tone-of-voice presets).
function isFilledIn(content, packs) {
  if (packs.length > 0 && packs.some((p) => p !== 'none')) return true;
  for (const raw of content.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line) continue;
    if (line.startsWith('#')) continue;
    if (line.startsWith('>')) continue;
    if (/^active pack:/i.test(line)) continue;
    if (/^language:/i.test(line)) continue;
    if (/^_.*_$/.test(line)) continue;
    if (/\[[^\]]*\]/.test(line)) continue;
    const unbulleted = line.replace(/^[-*]\s*/, '').toLowerCase();
    if (TEMPLATE_LINES.some((t) => unbulleted.startsWith(t))) continue;
    return true;
  }
  return false;
}

function main() {
  const file = path.join(process.cwd(), 'ABOUT.md');
  if (!fs.existsSync(file)) {
    console.log(NOT_FILLED_MSG);
    return;
  }

  let content = fs.readFileSync(file, 'utf8');
  if (content.charCodeAt(0) === 0xfeff) content = content.slice(1);

  const packs = activePacks(content);
  if (!isFilledIn(content, packs)) {
    console.log(NOT_FILLED_MSG);
    return;
  }

  // Reminders are appended AFTER truncation, so they can never be cut off.
  const active = packs.filter((p) => p !== 'none');
  const valid = active.filter((p) => VALID_PACKS.has(p));
  const invalid = active.filter((p) => !VALID_PACKS.has(p));
  let extra = '';
  if (valid.length > 0) {
    const readings = valid.map((p) => '.claude/packs/' + p + '/PACK.md').join(' and ');
    extra =
      '\n\nREMINDER: read ' + readings + ' before the first task; ' +
      'the ' + valid.join(' + ') + ' pack agent(s) are enabled';
  }
  if (invalid.length > 0) {
    extra +=
      '\n\nWARNING: unrecognized pack(s) on line 2 of ABOUT.md: "' + invalid.join('", "') +
      '" (valid: none, nextjs, static, node-api, python — list with " + ") — fix line 2';
  }

  // Locale reminder: project language other than en with an existing locale file.
  const lang = projectLanguage(content);
  if (lang && lang.toLowerCase() !== 'en') {
    const localeFile = path.join(process.cwd(), '.claude', 'locales', lang + '.md');
    if (fs.existsSync(localeFile)) {
      extra += '\n\nREMINDER: read .claude/locales/' + lang + '.md before client-facing work';
    }
  }

  const truncationNotice =
    '\n[NOTICE: ABOUT.md truncated at the ~5000-character limit — read the full file if needed]';
  let body = content.trimEnd();
  const budget = OUTPUT_LIMIT - extra.length - truncationNotice.length;
  if (body.length > budget) {
    body = body.slice(0, budget) + truncationNotice;
  }

  console.log(body + extra);
}

try {
  main();
} catch (_) {
  // silent by design: SessionStart must never prevent the session from opening
}
process.exit(0);
