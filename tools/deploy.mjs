// Pushes the working tree to GitHub via the REST API (no local git needed).
// Usage: node tools/deploy.mjs "commit message"   (add --dry-run to list files only)
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const REPO = 'tap3-rec/marcomahrer.cv';
const BRANCH = 'main';
const SKIP = new Set(['node_modules', '_preview', '_site', '.DS_Store']);
const msg = process.argv.slice(2).filter(a => !a.startsWith('--')).join(' ') || 'Update site';
const dry = process.argv.includes('--dry-run');

function gh(args, input) {
  return JSON.parse(execFileSync('gh', ['api', ...args], { input, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }));
}
function walk(dir, rel = '') {
  const out = [];
  for (const name of fs.readdirSync(dir)) {
    if (SKIP.has(name)) continue;
    const full = path.join(dir, name), r = rel ? rel + '/' + name : name;
    if (fs.statSync(full).isDirectory()) out.push(...walk(full, r)); else out.push(r);
  }
  return out;
}
const files = walk(ROOT).sort();
console.log(files.length + ' files:\n  ' + files.join('\n  '));
if (dry) process.exit(0);

const head = gh([`repos/${REPO}/git/ref/heads/${BRANCH}`]).object.sha;
const baseCommit = gh([`repos/${REPO}/git/commits/${head}`]);
console.log('base commit', head.slice(0, 7), '-', baseCommit.message.split('\n')[0]);

const tree = [];
for (const f of files) {
  const buf = fs.readFileSync(path.join(ROOT, f));
  const body = JSON.stringify({ content: buf.toString('base64'), encoding: 'base64' });
  const blob = gh([`repos/${REPO}/git/blobs`, '--method', 'POST', '--input', '-'], body);
  tree.push({ path: f, mode: '100644', type: 'blob', sha: blob.sha });
  process.stdout.write('.');
}
console.log();
// No base_tree: the new tree is exactly the working tree, so removed files disappear.
const newTree = gh([`repos/${REPO}/git/trees`, '--method', 'POST', '--input', '-'], JSON.stringify({ tree }));
const commit = gh([`repos/${REPO}/git/commits`, '--method', 'POST', '--input', '-'], JSON.stringify({ message: msg, tree: newTree.sha, parents: [head] }));
gh([`repos/${REPO}/git/refs/heads/${BRANCH}`, '--method', 'PATCH', '--input', '-'], JSON.stringify({ sha: commit.sha, force: false }));
console.log('pushed', commit.sha.slice(0, 7), 'to', BRANCH);
