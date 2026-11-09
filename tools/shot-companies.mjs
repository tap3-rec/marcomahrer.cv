// Screenshots of #companies at desktop/phone widths in light and dark. Usage: node tools/shot-companies.mjs <outdir>
import { createRequire } from 'node:module';
import path from 'node:path'; import fs from 'node:fs';
const { chromium } = createRequire('/Users/marcomahrer/Developer/career-ops/package.json')('playwright');
const out = process.argv[2] || '/tmp/shots'; fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch();
const runs = [];
for (const [lang, url] of [['en', 'http://localhost:4747/'], ['de', 'http://localhost:4747/de/']])
  for (const width of [1280, 375]) for (const scheme of ['light', 'dark']) runs.push([lang, url, width, scheme]);
for (const [lang, url, width, scheme] of runs) {
  const page = await browser.newPage({ viewport: { width, height: 900 }, colorScheme: scheme, reducedMotion: 'reduce', deviceScaleFactor: 2 });
  await page.goto(url); await page.waitForLoadState('networkidle');
  await page.evaluate(() => document.querySelectorAll('.reveal').forEach(e => e.classList.add('in')));
  const el = page.locator('#companies'); await el.scrollIntoViewIfNeeded(); await page.waitForTimeout(300);
  await el.screenshot({ path: path.join(out, `companies-${lang}-${width}-${scheme}.png`) });
  await page.close();
}
// toggle path: data-theme="dark" set via localStorage, light OS scheme
const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, colorScheme: 'light', reducedMotion: 'reduce', deviceScaleFactor: 2 });
await page.addInitScript(() => localStorage.setItem('theme', 'dark'));
await page.goto('http://localhost:4747/'); await page.waitForLoadState('networkidle');
await page.evaluate(() => document.querySelectorAll('.reveal').forEach(e => e.classList.add('in')));
await page.locator('#companies').screenshot({ path: path.join(out, 'companies-en-1280-toggle-dark.png') });
console.log('data-theme:', await page.evaluate(() => document.documentElement.dataset.theme));
await browser.close(); console.log('shots ->', out);
