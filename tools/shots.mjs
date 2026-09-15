// Section screenshots of the local preview for visual verification. Usage: node tools/shots.mjs <outdir>
import { chromium } from '/Users/marcomahrer/Developer/career-ops/node_modules/playwright/index.mjs';
import path from 'node:path'; import fs from 'node:fs';
const out = process.argv[2] || '/tmp/shots'; fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch();
const shots = [
  ['en-desktop', 'http://localhost:4747/', 1280, ['#approach', '#work', '#projects', '#skills']],
  ['de-desktop', 'http://localhost:4747/de/', 1280, ['#approach', '#skills']],
  ['en-mobile', 'http://localhost:4747/', 375, ['#skills']],
  ['en-tablet', 'http://localhost:4747/', 900, ['#projects', '#skills']],
];
for (const [name, url, width, sels] of shots) {
  const page = await browser.newPage({ viewport: { width, height: 900 }, colorScheme: 'light', reducedMotion: 'reduce' });
  await page.goto(url); await page.waitForLoadState('networkidle');
  await page.evaluate(() => { document.querySelectorAll('.reveal').forEach(e => e.classList.add('in')); const d = document.querySelector('.tenures details'); if (d) d.open = true; });
  for (const sel of sels) {
    const el = page.locator(sel); await el.scrollIntoViewIfNeeded();
    await el.screenshot({ path: path.join(out, `${name}-${sel.slice(1)}.png`) });
  }
  await page.close();
}
await browser.close(); console.log('shots ->', out);
