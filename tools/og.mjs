// Renders social preview images: assets/img/og.png for the site and one per post in assets/img/og/.
// Run after adding a post: node tools/og.mjs
import { chromium } from '/Users/marcomahrer/Developer/career-ops/node_modules/playwright/index.mjs';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(here, '..');
const outDir = path.join(ROOT, 'assets', 'img', 'og');
fs.mkdirSync(outDir, { recursive: true });
const slugify = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const posts = fs.readdirSync(path.join(ROOT, '_posts')).filter(f => f.endsWith('.md')).map(f => {
  const src = fs.readFileSync(path.join(ROOT, '_posts', f), 'utf8');
  const title = (src.match(/^title:\s*(.+)$/m) || [])[1]?.replace(/^["']|["']$/g, '') || f;
  const slug = f.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/\.md$/, '');
  return { title, file: slugify('/blog/' + slug + '/') + '.png' };
});
const exe = process.env.HOME + '/Library/Caches/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-mac-arm64/chrome-headless-shell';
const browser = await chromium.launch({ executablePath: fs.existsSync(exe) ? exe : undefined });
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await page.goto('file://' + path.join(here, 'og.html'));
await page.waitForLoadState('networkidle');
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: path.join(ROOT, 'assets', 'img', 'og.png'), type: 'png' });
console.log('wrote assets/img/og.png');
for (const p of posts) {
  const target = path.join(outDir, p.file);
  if (fs.existsSync(target) && !process.argv.includes('--force')) { console.log('skip (exists)', p.file); continue; }
  await page.evaluate(({ title }) => {
    document.getElementById('eyebrow').textContent = 'Blog · Marco Mahrer';
    const h = document.getElementById('title'); h.className = 'post';
    const words = title.split(' '); const last = words.pop();
    h.innerHTML = words.join(' ') + ' <em>' + last + '</em>';
  }, p);
  await page.screenshot({ path: target, type: 'png' });
  console.log('wrote assets/img/og/' + p.file);
}
await browser.close();
