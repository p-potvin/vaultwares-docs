import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

const routerPath = path.join(repoRoot, 'instructions', 'ROUTER.md');
const summariesDir = path.join(repoRoot, 'instructions', 'summaries');
const notesDir = path.join(repoRoot, 'instructions', 'notes');
const outDir = path.join(repoRoot, 'docs-content', 'ai-tools', 'assistant-protocols');

function toSlug(category) {
  return category.trim().toLowerCase().replaceAll('_', '-');
}

function toTitle(category) {
  const small = new Set(['of', 'and', 'to', 'for', 'in', 'on', 'vs']);
  const words = category.trim().toLowerCase().split('_');
  return words
    .map((w, i) => {
      if (i !== 0 && small.has(w)) return w;
      return w ? w[0].toUpperCase() + w.slice(1) : w;
    })
    .join(' ');
}

function stripLeadingHeading(md, category) {
  const normalized = md.replaceAll('\r\n', '\n').replaceAll('\r', '\n');
  const lines = normalized.split('\n');
  if (lines.length === 0) return '';
  const first = lines[0].trim();
  if (first === `# ${category}` || first === `# ${category.trim()}`) {
    return lines.slice(1).join('\n').trimStart();
  }
  return normalized.trimStart();
}

function parseRouterTable(routerMd) {
  const lines = routerMd.replaceAll('\r\n', '\n').replaceAll('\r', '\n').split('\n');
  const headerIndex = lines.findIndex(l => l.trim() === '| Category | Applies when | Summary | Notes | Keywords (non-exclusive) |');
  if (headerIndex === -1) {
    throw new Error('ROUTER.md: protocol table header not found');
  }
  const rows = [];
  for (let i = headerIndex + 2; i < lines.length; i += 1) {
    const line = lines[i];
    if (!line.trim().startsWith('|')) break;
    const cols = line.split('|').slice(1, -1).map(c => c.trim());
    if (cols.length < 5) continue;
    const [category, appliesWhen, summaryPath, notesPath, keywords] = cols;
    if (!category || category === '---') continue;
    rows.push({
      category,
      appliesWhen,
      summaryPath,
      notesPath,
      keywords,
      slug: toSlug(category),
      title: toTitle(category),
    });
  }
  if (rows.length === 0) throw new Error('ROUTER.md: no protocol rows parsed');
  return rows;
}

async function main() {
  await fs.mkdir(outDir, { recursive: true });

  const routerMd = await fs.readFile(routerPath, 'utf8');
  const rows = parseRouterTable(routerMd);

  const indexLines = [];
  indexLines.push('---');
  indexLines.push('title: \"Assistant protocols\"');
  indexLines.push('description: \"Company protocols summaries for assistants\"');
  indexLines.push('---');
  indexLines.push('');
  indexLines.push('# Assistant protocols');
  indexLines.push('');
  indexLines.push('This section mirrors `vaultwares-docs/instructions/summaries/*` for browsing.');
  indexLines.push('Notes are human reference and are read by assistants only when explicitly prompted: `read full notes`.');
  indexLines.push('');
  indexLines.push('## Routines (always)');
  indexLines.push('1) Safety+scope gate: ask clarifying questions when unsure or risky.');
  indexLines.push('2) Routing: scan all protocol categories; select relevant; open summaries in category order.');
  indexLines.push('3) Tools/routines: run MCP routines only if useful.');
  indexLines.push('4) Ledger: record work as the last step before replying.');
  indexLines.push('');
  indexLines.push('## Protocol categories');
  indexLines.push('| Category | Applies when | Summary |');
  indexLines.push('|---|---|---|');

  for (const row of rows) {
    const summaryFile = path.join(summariesDir, `${row.category}.md`);
    const notesFile = path.join(notesDir, `${row.category}.md`);

    const rawSummary = await fs.readFile(summaryFile, 'utf8');
    const summaryBody = stripLeadingHeading(rawSummary, row.category).trimEnd();

    const outPath = path.join(outDir, `${row.slug}.mdx`);
    const pageLines = [];
    pageLines.push('---');
    pageLines.push(`title: \"${row.title}\"`);
    pageLines.push(`description: \"Assistant protocol summary: ${row.title}\"`);
    pageLines.push('---');
    pageLines.push('');
    pageLines.push(`# ${row.title}`);
    pageLines.push('');
    pageLines.push(`- Category ID: \`${row.category}\``);
    pageLines.push(`- Summary source: \`${path.posix.join('instructions', 'summaries', `${row.category}.md`)}\``);
    pageLines.push(`- Notes source: \`${path.posix.join('instructions', 'notes', `${row.category}.md`)}\``);
    pageLines.push('');
    pageLines.push(summaryBody);
    pageLines.push('');
    pageLines.push('## Notes');
    pageLines.push('Assistants read full notes only when explicitly prompted: `read full notes`.');
    pageLines.push(`Notes path: \`${path.posix.join('instructions', 'notes', `${row.category}.md`)}\``);

    await fs.writeFile(outPath, pageLines.join('\n'), 'utf8');

    // add to index table
    indexLines.push(`| \`${row.category}\` | ${row.appliesWhen} | /ai-tools/assistant-protocols/${row.slug} |`);

    // sanity: ensure notes exists (for humans)
    await fs.stat(notesFile);
  }

  await fs.writeFile(path.join(outDir, 'index.mdx'), indexLines.join('\n'), 'utf8');
  // eslint-disable-next-line no-console
  console.log(`[protocol-mirrors] wrote ${rows.length} pages + index to ${outDir}`);
}

main().catch(err => {
  // eslint-disable-next-line no-console
  console.error('[protocol-mirrors] failed', err);
  process.exitCode = 1;
});

