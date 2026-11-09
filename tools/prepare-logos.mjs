// Prepares the "Companies" row logos: official colours kept, whitespace trimmed,
// light/dark pairs written where the brand publishes both (or a plain reverse for
// single-colour wordmarks). Sources in assets/img/logos-src, output in assets/img/logos.
// Usage: node tools/prepare-logos.mjs   (prints width/height ratio per file)
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const { chromium } = createRequire('/Users/marcomahrer/Developer/career-ops/package.json')('playwright');

const here = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(here, '..');
const SRC = path.join(ROOT, 'assets', 'img', 'logos-src');
const OUT = path.join(ROOT, 'assets', 'img', 'logos');
fs.mkdirSync(OUT, { recursive: true });

// [output name, source path, options]
const jobs = [
  ['getyourguide.svg', 'getyourguide.svg', {}],
  ['archlet-black.svg', 'archlet-nav.svg', {}],
  ['archlet-white.svg', 'archlet-nav.svg', { swap: { black: 'white', white: 'black' } }],
  ['caffeine-black.svg', 'caffeine/caffeine-brand-assets/caffeine-logo-black.svg', {}],
  ['caffeine-white.svg', 'caffeine/caffeine-brand-assets/caffeine-logo-white.svg', {}],
  ['wingtra.svg', 'wingtra/Wingtra logo_Web/Wingtra-Logo-96dpi_orange/Wingtra-Logo_orange.svg', {}],
  ['dfinity-color.png', 'dfinity-horizontal-color.png', {}],
  ['dfinity-whitetext.png', 'dfinity-horizontal-whitetext.png', {}],
  ['anybotics-white.png', 'anybotics-ANYbotics_logo_neg_RGB-1-1-1.png', {}],
  ['anybotics-black.png', 'anybotics-ANYbotics_logo_neg_RGB-1-1-1.png', { rgb: [23, 19, 31] }],
  ['appway-grey.svg', 'appway-dark.svg', {}],
  ['appway-white.svg', 'appway-dark.svg', { css: { '#5a5a5a': '#ffffff' } }],
  ['google-color.png', 'google-color.png', {}],
  // Gravis: final frame of their header animation (lottie-web SVG render); crop to the painted shapes only
  ['gravis-white.svg', 'gravis-frame96.svg', { visible: true }],
  ['gravis-dark.svg', 'gravis-frame96.svg', { visible: true, css: { '#ffffff': '#17131F', 'rgb(255,255,255)': '#17131F', 'rgb(0,0,0)': '#F7F3EC', '#000000': '#F7F3EC' } }],
];

const exe = process.env.HOME + '/Library/Caches/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-mac-arm64/chrome-headless-shell';
const browser = await chromium.launch({ executablePath: fs.existsSync(exe) ? exe : undefined });
const page = await browser.newPage();
await page.setContent('<html><body style="margin:0"></body></html>');

const trimSvg = (src, swap, css, visible) => page.evaluate(({ src, swap, css, visible }) => {
  if (css) for (const [from, to] of Object.entries(css)) src = src.split(from).join(to);
  const doc = new DOMParser().parseFromString(src, 'image/svg+xml');
  const live = document.importNode(doc.documentElement, true);
  live.setAttribute('width', '1000'); live.removeAttribute('height');
  document.body.appendChild(live);
  live.querySelectorAll('metadata, title, desc, script').forEach(n => n.remove());
  [...live.childNodes].forEach(n => { if (n.nodeType === 8) n.remove(); });
  if (swap) live.querySelectorAll('[fill]').forEach(n => { const f = n.getAttribute('fill').toLowerCase(); if (swap[f]) n.setAttribute('fill', swap[f]); });
  live.removeAttribute('style');
  let b = live.getBBox();
  if (visible) {
    // union of the on-screen boxes of painted shapes, mapped back to user units
    const vb0 = live.viewBox.baseVal; const r0 = live.getBoundingClientRect(); const k = vb0.width / r0.width;
    let x1 = Infinity, y1 = Infinity, x2 = -Infinity, y2 = -Infinity;
    live.querySelectorAll('path, rect, circle, ellipse, polygon').forEach(e => {
      let n = e; while (n && n !== live) { const cs = getComputedStyle(n); if (cs.opacity === '0' || cs.visibility === 'hidden' || cs.display === 'none') return; n = n.parentElement; }
      const r = e.getBoundingClientRect(); if (!r.width || !r.height) return;
      x1 = Math.min(x1, r.x); y1 = Math.min(y1, r.y); x2 = Math.max(x2, r.right); y2 = Math.max(y2, r.bottom);
    });
    b = { x: vb0.x + (x1 - r0.x) * k, y: vb0.y + (y1 - r0.y) * k, width: (x2 - x1) * k, height: (y2 - y1) * k };
  }
  const pad = 0.5;
  const vb = [b.x - pad, b.y - pad, b.width + pad * 2, b.height + pad * 2].map(v => +v.toFixed(3));
  live.setAttribute('viewBox', vb.join(' ')); live.removeAttribute('width'); live.removeAttribute('height'); live.removeAttribute('id');
  ['xmlns:i', 'xmlns:x', 'xmlns:graph'].forEach(a => live.removeAttribute(a));
  const out = live.outerHTML.replace(/\s*\n\s*/g, ' '); live.remove();
  return { out, ar: +(vb[2] / vb[3]).toFixed(3) };
}, { src, swap, css, visible });

const trimPng = (b64, rgb) => page.evaluate(async ({ b64, rgb }) => {
  const img = new Image(); img.src = 'data:image/png;base64,' + b64; await img.decode();
  const c = document.createElement('canvas'); c.width = img.naturalWidth; c.height = img.naturalHeight;
  const ctx = c.getContext('2d'); ctx.drawImage(img, 0, 0);
  const d = ctx.getImageData(0, 0, c.width, c.height); const p = d.data;
  let minX = c.width, minY = c.height, maxX = -1, maxY = -1;
  for (let y = 0; y < c.height; y++) for (let x = 0; x < c.width; x++) {
    const i = (y * c.width + x) * 4;
    if (rgb) { p[i] = rgb[0]; p[i + 1] = rgb[1]; p[i + 2] = rgb[2]; }
    if (p[i + 3] > 8) { if (x < minX) minX = x; if (x > maxX) maxX = x; if (y < minY) minY = y; if (y > maxY) maxY = y; }
  }
  ctx.putImageData(d, 0, 0);
  const w = maxX - minX + 1, h = maxY - minY + 1;
  const t = document.createElement('canvas'); const scale = Math.min(1, 240 / h); t.width = Math.round(w * scale); t.height = Math.round(h * scale);
  const tc = t.getContext('2d'); tc.imageSmoothingQuality = 'high'; tc.drawImage(c, minX, minY, w, h, 0, 0, t.width, t.height);
  return { out: t.toDataURL('image/png').split(',')[1], ar: +(w / h).toFixed(3), w: t.width, h: t.height };
}, { b64, rgb });

for (const [name, srcRel, opt] of jobs) {
  const src = path.join(SRC, srcRel);
  if (name.endsWith('.svg')) {
    const { out, ar } = await trimSvg(fs.readFileSync(src, 'utf8'), opt.swap, opt.css, opt.visible);
    fs.writeFileSync(path.join(OUT, name), out);
    console.log(`${name}\tar ${ar}\t${out.length} B`);
  } else {
    const { out, ar, w, h } = await trimPng(fs.readFileSync(src).toString('base64'), opt.rgb);
    fs.writeFileSync(path.join(OUT, name), Buffer.from(out, 'base64'));
    console.log(`${name}\tar ${ar}\t${w}x${h}`);
  }
}
await browser.close();
