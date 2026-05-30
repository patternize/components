// Copies the component catalog into dist so it can be published and consumed
// at '@patternize/components/catalog.json' (e.g. by an LLM tool layer).
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = join(root, 'catalog.json');
const outDir = join(root, 'dist');

const catalog = JSON.parse(readFileSync(src, 'utf8'));

// Light validation so a malformed catalog fails the build loudly.
if (!Array.isArray(catalog.components) || catalog.components.length === 0) {
  throw new Error('catalog.json: "components" must be a non-empty array');
}
for (const c of catalog.components) {
  if (!c.id || !c.category || !c.description) {
    throw new Error(`catalog.json: component "${c.id ?? '?'}" is missing id/category/description`);
  }
}

mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, 'catalog.json'), JSON.stringify(catalog, null, 2));
console.log(
  `catalog.json -> dist/ (${catalog.components.length} components)`
);
