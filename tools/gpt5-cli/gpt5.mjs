#!/usr/bin/env node
import 'dotenv/config';
import minimist from 'minimist';
import { globby } from 'globby';
import fs from 'fs';
import path from 'path';
import { isText } from 'istextorbinary';
import OpenAI from 'openai';

const argv = minimist(process.argv.slice(2), {
  boolean: ['all_files', 'debug'],
  string: ['p', 'model'],
  alias: { p: 'prompt' },
  default: { model: process.env.GPT5_MODEL || 'gpt-5' }
});

if (!process.env.OPENAI_API_KEY) {
  console.error('ERROR: OPENAI_API_KEY missing. Put it in .env');
  process.exit(1);
}

const MAX_BYTES = parseInt(process.env.GPT5_MAX_BYTES || '1500000', 10); // ~1.5MB
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Parse the prompt string, collect @paths, and return:
 * - userText: the non-@ portion that is the actual question/instruction
 * - includes: array of relative paths (files/dirs) found after '@'
 */
function parseAtSyntax(p) {
  if (!p) return { userText: '', includes: [] };
  const tokens = p.split(/\s+/);
  const includes = [];
  const rest = [];

  for (const t of tokens) {
    if (t.startsWith('@')) {
      includes.push(t.slice(1)); // drop '@'
    } else {
      rest.push(t);
    }
  }
  return { userText: rest.join(' ').trim(), includes };
}

/** Expand directories to file lists; ignore binary & huge files */
async function expandPaths(relPaths) {
  const patterns = [];
  for (const rel of relPaths) {
    if (rel.endsWith('/')) {
      // directory: include everything under it
      patterns.push(`${rel}/**/*`);
    } else {
      // could be file or dir; include both patterns
      patterns.push(rel);
      patterns.push(`${rel}/**/*`);
    }
  }
  // De-dup files and keep only existing text files
  const files = await globby(patterns, {
    dot: false,
    gitignore: true,
    onlyFiles: true,
    followSymbolicLinks: true
  });

  // Filter out binary files
  const textFiles = [];
  for (const f of files) {
    try {
      const buf = fs.readFileSync(f);
      if (isText(undefined, buf)) textFiles.push(f);
    } catch (_) { /* ignore */ }
  }
  // Keep unique and sorted
  return Array.from(new Set(textFiles)).sort();
}

/** Read and concatenate files with headers until MAX_BYTES */
function concatenateWithHeaders(files) {
  let total = 0;
  const parts = [];

  for (const file of files) {
    const header = `\n--- ${file} ---\n`;
    const content = safeRead(file);
    const addBytes = Buffer.byteLength(header) + Buffer.byteLength(content);

    if (total + addBytes > MAX_BYTES) {
      parts.push(`\n[... Truncated: size limit ${MAX_BYTES} bytes reached ...]\n`);
      break;
    }
    parts.push(header, content);
    total += addBytes;
  }
  return parts.join('');
}

function safeRead(pth) {
  try {
    return fs.readFileSync(pth, 'utf8');
  } catch (e) {
    return `[[ERROR READING FILE: ${pth} -> ${e.message}]]`;
  }
}

async function run() {
  // Support: gpt5 --all_files -p "Prompt text"
  // Or:     gpt5 -p "@src/ @tests/ What about X?"
  const rawPrompt = argv.p || argv.prompt;
  if (!rawPrompt) {
    console.error('Usage: gpt5 -p "@src/ @tests/ Your question" [--all_files] [--model gpt-5]');
    process.exit(2);
  }

  let includes = [];
  let userText = rawPrompt;

  if (argv.all_files) {
    includes = ['.'];
  } else {
    const parsed = parseAtSyntax(rawPrompt);
    includes = parsed.includes;
    userText = parsed.userText;
  }

  const files = includes.length ? await expandPaths(includes) : [];
  if (argv.debug) {
    console.error(`DEBUG includes: ${includes.length} -> ${files.length} text files`);
  }

  const corpus = files.length ? concatenateWithHeaders(files) : '';
  const systemMsg = process.env.GPT5_SYSTEM || 'You are a senior codebase analyst. Be concise but complete. When you cite, include the file paths shown in headers.';

  // Build messages. If corpus is big, put it in the system or first user?
  // We’ll put corpus in the first user message as "Context".
  const messages = [
    { role: 'system', content: systemMsg },
    ...(corpus
      ? [{ role: 'user', content: `Context files:\n${corpus}` }]
      : []),
    { role: 'user', content: userText || 'Analyze the provided files.' }
  ];

  if (argv.debug) {
    console.error(`DEBUG model: ${argv.model}, bytes: ~${Buffer.byteLength(corpus)}\nUser text: ${userText}`);
  }

  try {
    const res = await client.chat.completions.create({
      model: argv.model,
      messages,
      temperature: 1
    });
    const out = res.choices?.[0]?.message?.content?.trim() || '(no content)';
    console.log(out);
  } catch (e) {
    console.error('OpenAI API error:', e?.response?.data || e.message);
    process.exit(3);
  }
}

run();
