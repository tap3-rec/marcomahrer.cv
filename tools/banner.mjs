// LinkedIn banner variants (1584x396, rendered at 2x) -> assets/img/banner/*.png
import { chromium } from '/Users/marcomahrer/Developer/career-ops/node_modules/playwright/index.mjs';
import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url));
const out = path.resolve(here, '..', 'assets', 'img', 'banner'); fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1584, height: 396 }, deviceScaleFactor: 2 });
await page.goto('file://' + path.join(here, 'banner.html'));
await page.waitForLoadState('networkidle'); await page.evaluate(() => document.fonts.ready);
const variants = [
  ['1-headline-light', 'light'],
  ['2-headline-dark', 'dark'],
  ['3-numbers-dark', 'dark stats-variant'],
];
for (const [name, cls] of variants) {
  await page.evaluate((cls) => { document.body.className = cls; document.getElementById('stats').hidden = !cls.includes('stats'); }, cls);
  await page.screenshot({ path: path.join(out, `linkedin-banner-${name}.png`), type: 'png' });
  console.log('wrote', name);
}
await browser.close();
