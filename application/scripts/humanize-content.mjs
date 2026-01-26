import { readFile, writeFile, stat, readdir } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

import { humanizeString } from 'humanize-ai-lib';

const DEFAULT_ROOT = path.resolve(process.cwd(), 'src');

// IMPORTANT:
// We intentionally scope transformations to content-like files only.
// Normalizing curly quotes (e.g. ’ -> ') inside JS/TS/Astro frontmatter can
// break single-quoted string literals and create syntax errors.
// For .astro, we protect tags and script/style blocks to avoid touching code.
const TEXT_EXTENSIONS = new Set(['.md', '.mdx', '.astro']);

const IGNORE_DIRS = new Set([
  'node_modules',
  'dist',
  'build',
  '.git',
  '.astro',
  '.vercel',
  '.netlify',
  'vendor',
  'public',
  'assets',
]);

function parseArgs(argv) {
  const args = {
    root: DEFAULT_ROOT,
    mode: 'check', // 'check' | 'write'
    verbose: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === '--check') {
      args.mode = 'check';
      continue;
    }

    if (arg === '--write') {
      args.mode = 'write';
      continue;
    }

    if (arg === '--root') {
      const root = argv[index + 1];
      if (!root) throw new Error('Missing value for --root');
      args.root = path.resolve(process.cwd(), root);
      index += 1;
      continue;
    }

    if (arg === '--verbose') {
      args.verbose = true;
      continue;
    }

    if (arg === '--help' || arg === '-h') {
      return { ...args, help: true };
    }

    throw new Error(`Unknown argument: ${arg}`);
  }

  return args;
}

function printHelp() {
  // Keep it simple: this is meant to be a safe batch-cleaner, not a full CLI.
  console.log(`Usage: node ./scripts/humanize-content.mjs [--check|--write] [--root <path>] [--verbose]\n\n`);
  console.log(`Defaults:`);
  console.log(`  --check           (default) report changes without writing`);
  console.log(`  --root src        scan under application/src`);
}

async function* walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (IGNORE_DIRS.has(entry.name)) continue;
      yield* walk(path.join(dir, entry.name));
      continue;
    }

    if (!entry.isFile()) continue;

    const ext = path.extname(entry.name).toLowerCase();
    if (!TEXT_EXTENSIONS.has(ext)) continue;

    yield path.join(dir, entry.name);
  }
}

function splitMarkdownFrontmatter(text) {
  // Astro/MDX frontmatter lives at the very beginning of the file.
  // Preserve it verbatim and only humanize the body.
  const match = text.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n/);
  if (!match) return { frontmatter: '', body: text };
  return { frontmatter: match[0], body: text.slice(match[0].length) };
}

function protectBlocks(text, pattern, prefix) {
  const blocks = [];
  const result = text.replace(pattern, (match) => {
    const token = `${prefix}${blocks.length}__`;
    blocks.push(match);
    return token;
  });
  return { text: result, blocks };
}

function restoreBlocks(text, blocks, prefix) {
  return blocks.reduce((acc, block, index) => acc.replace(`${prefix}${index}__`, block), text);
}

function protectTags(text) {
  const tags = [];
  const result = text.replace(/<[^>]*>/g, (match) => {
    const token = `__HK_TAG_${tags.length}__`;
    tags.push(match);
    return token;
  });
  return { text: result, tags };
}

function restoreTags(text, tags) {
  return tags.reduce((acc, tag, index) => acc.replace(`__HK_TAG_${index}__`, tag), text);
}

function shouldSkipFile(filePath) {
  // Skip known binary-ish text files where changing whitespace could be risky.
  // (We keep this intentionally conservative.)
  const base = path.basename(filePath);
  if (base === 'package-lock.json') return true;
  return false;
}

async function humanizeFile(filePath) {
  const original = await readFile(filePath, 'utf8');

  const { frontmatter, body } = splitMarkdownFrontmatter(original);

  const ext = path.extname(filePath).toLowerCase();
  let safeBody = body;
  let protectedBlocks = null;
  let protectedTags = null;

  if (ext === '.astro') {
    const scriptBlocks = protectBlocks(safeBody, /<script\b[^>]*>[\s\S]*?<\/script(?:\s[^>]*)?>/gi, '__HK_SCRIPT_');
    const styleBlocks = protectBlocks(
      scriptBlocks.text,
      /<style\b[^>]*>[\s\S]*?<\/style(?:\s[^>]*)?>/gi,
      '__HK_STYLE_'
    );
    protectedBlocks = {
      script: scriptBlocks.blocks,
      style: styleBlocks.blocks,
    };
    const tagProtection = protectTags(styleBlocks.text);
    protectedTags = tagProtection.tags;
    safeBody = tagProtection.text;
  }

  const result = humanizeString(safeBody, {
    transformHidden: true,
    transformTrailingWhitespace: true,
    transformNbs: true,
    transformDashes: true,
    transformQuotes: true,
    transformOther: true,
    keyboardOnly: false,
  });

  let finalBody = result.text;
  if (ext === '.astro' && protectedTags && protectedBlocks) {
    finalBody = restoreTags(finalBody, protectedTags);
    finalBody = restoreBlocks(finalBody, protectedBlocks.style, '__HK_STYLE_');
    finalBody = restoreBlocks(finalBody, protectedBlocks.script, '__HK_SCRIPT_');
  }

  const transformed = `${frontmatter}${finalBody}`;
  const changed = transformed !== original;

  return {
    changed,
    changedSymbols: result.count ?? 0,
    transformed,
    original,
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.help) {
    printHelp();
    process.exit(0);
  }

  const rootStats = await stat(args.root).catch(() => null);
  if (!rootStats || !rootStats.isDirectory()) {
    throw new Error(`Root does not exist or is not a directory: ${args.root}`);
  }

  let filesScanned = 0;
  let filesChanged = 0;
  let totalChangedSymbols = 0;

  for await (const filePath of walk(args.root)) {
    if (shouldSkipFile(filePath)) continue;

    filesScanned += 1;

    const { changed, changedSymbols, transformed } = await humanizeFile(filePath);

    if (!changed) continue;

    filesChanged += 1;
    totalChangedSymbols += changedSymbols;

    if (args.verbose) {
      const rel = path.relative(process.cwd(), filePath);
      console.log(`${args.mode === 'write' ? 'WRITE' : 'CHECK'} ${rel} (+${changedSymbols})`);
    }

    if (args.mode === 'write') {
      await writeFile(filePath, transformed, 'utf8');
    }
  }

  const summary = `Humanize summary: scanned=${filesScanned}, changed=${filesChanged}, changedSymbols=${totalChangedSymbols}`;

  if (args.mode === 'check') {
    if (filesChanged > 0) {
      console.error(summary);
      process.exit(1);
    }

    console.log(summary);
    process.exit(0);
  }

  console.log(summary);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
