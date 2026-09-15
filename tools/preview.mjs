// Local preview for the Jekyll site. Renders the small Liquid subset the templates use.
// Usage: node tools/preview.mjs            -> builds to _preview/ and serves on :4747
//        node tools/preview.mjs --build    -> build only
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { fileURLToPath } from 'node:url';
import { marked } from 'marked';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, '_preview');
const PORT = 4747;

function parseYamlish(s) {
  const o = {};
  let listKey = null;
  for (const raw of s.split('\n')) {
    const line = raw.replace(/\s+$/, '');
    if (!line || line.startsWith('#')) continue;
    const item = line.match(/^\s+-\s+(.*)$/);
    if (item && listKey) { o[listKey].push(item[1].trim()); continue; }
    const m = line.match(/^([\w-]+):\s*(.*)$/);
    if (!m) continue;
    let v = m[2].trim();
    if (v === '') { o[m[1]] = []; listKey = m[1]; continue; }
    listKey = null;
    if (v.startsWith('[')) v = v.slice(1, -1).split(',').map(x => x.trim()).filter(Boolean);
    else v = v.replace(/^["']|["']$/g, '');
    o[m[1]] = v;
  }
  return o;
}
function frontMatter(src) {
  const m = src.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  return m ? { data: parseYamlish(m[1]), body: m[2] } : { data: {}, body: src };
}

const config = parseYamlish(fs.readFileSync(path.join(ROOT, '_config.yml'), 'utf8'));
const posts = fs.readdirSync(path.join(ROOT, '_posts')).filter(f => f.endsWith('.md')).map(f => {
  const { data, body } = frontMatter(fs.readFileSync(path.join(ROOT, '_posts', f), 'utf8'));
  const m = f.match(/^(\d{4}-\d{2}-\d{2})-(.+)\.md$/);
  if (!m) throw new Error('post filename must be YYYY-MM-DD-slug.md: ' + f);
  return { ...data, date: new Date(m[1] + 'T12:00:00Z'), url: `/writing/${m[2]}/`, body };
}).sort((a, b) => b.date - a.date);
const site = { ...config, posts, time: new Date() };

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
function fmtDate(d, f) {
  d = d instanceof Date ? d : new Date(d);
  return f.replace(/%(-?)([a-zA-Z])/g, (all, flag, c) => {
    switch (c) {
      case 'Y': return String(d.getUTCFullYear());
      case 'B': return MONTHS[d.getUTCMonth()];
      case 'b': return MONTHS[d.getUTCMonth()].slice(0, 3);
      case 'd': return flag ? String(d.getUTCDate()) : String(d.getUTCDate()).padStart(2, '0');
      case 'm': return String(d.getUTCMonth() + 1).padStart(2, '0');
      default: return all;
    }
  });
}
function get(ctx, p) { return p.split('.').reduce((o, k) => (o == null ? undefined : o[k]), ctx); }
function literal(tok, ctx) {
  tok = tok.trim();
  if (/^".*"$|^'.*'$/.test(tok)) return tok.slice(1, -1);
  if (/^-?\d+$/.test(tok)) return Number(tok);
  if (tok === 'true') return true;
  if (tok === 'false') return false;
  if (tok === 'nil' || tok === 'null') return null;
  return get(ctx, tok);
}
function evalExpr(expr, ctx) {
  const parts = expr.split(/\s\|\s|\|(?=\s*\w+:?)/).map(s => s.trim()).filter(Boolean);
  let v = literal(parts[0], ctx);
  for (const f of parts.slice(1)) {
    const [name, argRaw] = f.split(/:(.*)/s);
    const args = ((argRaw || '').match(/"[^"]*"|'[^']*'|[^,\s][^,]*/g) || []).map(a => literal(a, ctx));
    switch (name.trim()) {
      case 'date': v = fmtDate(v, args[0]); break;
      case 'default': v = (v == null || v === '' || v === false) ? args[0] : v; break;
      case 'number_of_words': v = String(v).replace(/<[^>]*>/g, ' ').trim().split(/\s+/).length; break;
      case 'divided_by': v = Math.floor(v / args[0]); break;
      case 'plus': v = v + args[0]; break;
      case 'escape': v = String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;'); break;
      case 'strip_html': v = String(v).replace(/<[^>]*>/g, ''); break;
      case 'truncate': v = String(v).slice(0, args[0]); break;
      case 'absolute_url': v = site.url + v; break;
      case 'relative_url': break;
      case 'slugify': v = String(v).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); break;
      case 'url_encode': v = encodeURIComponent(String(v)).replace(/%20/g, '+'); break;
      default: throw new Error('preview: unsupported Liquid filter "' + name + '"');
    }
  }
  return v;
}
function truthy(cond, ctx) {
  const m = cond.match(/^(.+?)\s*(==|!=)\s*(.+)$/);
  if (m) { const a = literal(m[1], ctx), b = literal(m[3], ctx); return m[2] === '==' ? a == b : a != b; }
  const v = literal(cond, ctx);
  return v !== undefined && v !== null && v !== false && v !== '';
}
function render(tpl, ctx) {
  tpl = tpl.replace(/\{%-?\s*include ([\w.\/-]+)\s*-?%\}/g, (_, f) => render(fs.readFileSync(path.join(ROOT, '_includes', f), 'utf8'), ctx));
  tpl = tpl.replace(/\{%-?\s*for (\w+) in ([\w.]+)(?:\s+limit:\s*(\d+))?\s*-?%\}([\s\S]*?)\{%-?\s*endfor\s*-?%\}/g, (_, v, arr, lim, body) => {
    let list = get(ctx, arr) || [];
    if (lim) list = list.slice(0, Number(lim));
    return list.map((item, i) => render(body, { ...ctx, [v]: item, forloop: { index: i + 1, first: i === 0, last: i === list.length - 1 } })).join('');
  });
  tpl = tpl.replace(/\{%-?\s*if (.+?)\s*-?%\}([\s\S]*?)(?:\{%-?\s*else\s*-?%\}([\s\S]*?))?\{%-?\s*endif\s*-?%\}/g, (_, cond, a, b = '') => truthy(cond, ctx) ? render(a, ctx) : render(b, ctx));
  tpl = tpl.replace(/\{\{-?\s*(.+?)\s*-?\}\}/g, (_, e) => { const v = evalExpr(e, ctx); return v == null ? '' : String(v); });
  return tpl;
}
function applyLayout(name, content, page) {
  const { data, body } = frontMatter(fs.readFileSync(path.join(ROOT, '_layouts', name + '.html'), 'utf8'));
  let out = render(body, { site, page, content });
  if (data.layout) out = applyLayout(data.layout, out, page);
  return out;
}
function write(rel, html) {
  const p = path.join(OUT, rel);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, html);
}
function buildPage(srcRel, outRel) {
  const { data, body } = frontMatter(fs.readFileSync(path.join(ROOT, srcRel), 'utf8'));
  const url = data.permalink || '/' + outRel.replace(/index\.html$/, '');
  const page = { ...data, url };
  let html = render(body, { site, page });
  if (srcRel.endsWith('.md')) html = marked.parse(html);
  if (data.layout) html = applyLayout(data.layout, html, page);
  write(outRel, html);
}

fs.rmSync(OUT, { recursive: true, force: true });
buildPage('index.html', 'index.html');
buildPage('writing/index.html', 'writing/index.html');
buildPage('404.html', '404.html');
for (const post of posts) {
  const content = marked.parse(post.body);
  write(post.url.slice(1) + 'index.html', applyLayout(post.layout || 'post', content, post));
}
fs.cpSync(path.join(ROOT, 'assets'), path.join(OUT, 'assets'), { recursive: true });
console.log(`built ${3 + posts.length} pages -> _preview/`);

if (!process.argv.includes('--build')) {
  const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.pdf': 'application/pdf', '.xml': 'application/xml' };
  http.createServer((req, res) => {
    let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    if (p.endsWith('/')) p += 'index.html';
    let file = path.join(OUT, p);
    if (!fs.existsSync(file)) { file = path.join(OUT, '404.html'); res.statusCode = 404; }
    res.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream');
    fs.createReadStream(file).pipe(res);
  }).listen(PORT, () => console.log(`preview: http://localhost:${PORT}`));
}
