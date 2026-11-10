#!/usr/bin/env node
/**
 * validate-release.mjs
 * Read-only release integrity validator for Magadh Enterprises (Netlify static site).
 * - Node built-ins only. No npm dependencies. No source modifications.
 * - Detects publish/functions dirs from netlify.toml (best-effort).
 * - Checks local HTML/CSS/JS/image/font refs, nav links/fragments, required files,
 *   Netlify functions, sitemap structure (no fragments in <loc>).
 * Exit: 1 if genuine release-blocking errors, else 0.
 */
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");

const errors = [];
const warnings = [];
const info = [];

function addErr(msg, file, line) {
  errors.push(fmt(msg, file, line));
}
function addWarn(msg, file, line) {
  warnings.push(fmt(msg, file, line));
}
function addInfo(msg) {
  info.push(msg);
}
function fmt(msg, file, line) {
  let loc = "";
  if (file) {
    const rel = path.relative(ROOT, file).replace(/\\/g, "/");
    loc = line ? `${rel}:${line}: ` : `${rel}: `;
  }
  return `${loc}${msg}`;
}

function readText(p) {
  try {
    return fs.readFileSync(p, "utf8");
  } catch (e) {
    return null;
  }
}
function exists(p) {
  try {
    fs.accessSync(p, fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
}
function isFile(p) {
  try {
    return fs.statSync(p).isFile();
  } catch {
    return false;
  }
}

function parseNetlifyToml(tomlPath) {
  const raw = readText(tomlPath);
  const result = { publish: ".", functionsDir: "netlify/functions", parsed: false, notes: [] };
  if (raw == null) {
    result.notes.push("netlify.toml not found; using defaults (publish='.', functions='netlify/functions').");
    return result;
  }
  result.parsed = true;
  // Best-effort: match publish/directory assignments. Avoid complex TOML parsing.
  const buildPub = raw.match(/^\s*publish\s*=\s*"([^"]+)"/m);
  if (buildPub) result.publish = buildPub[1].trim();
  const funcDir = raw.match(/^\s*directory\s*=\s*"([^"]+)"/m);
  // directory appears in [functions]; accept first such match as functions dir.
  if (funcDir) result.functionsDir = funcDir[1].trim();
  // Check for [build] publish more specifically if present
  const buildBlock = raw.match(/\[build\][\s\S]*?(?=\n\[|$)/);
  if (buildBlock) {
    const p = buildBlock[0].match(/^\s*publish\s*=\s*"([^"]+)"/m);
    if (p) result.publish = p[1].trim();
  }
  const funcBlock = raw.match(/\[functions\][\s\S]*?(?=\n\[|$)/);
  if (funcBlock) {
    const d = funcBlock[0].match(/^\s*directory\s*=\s*"([^"]+)"/m);
    if (d) result.functionsDir = d[1].trim();
  }
  if (!buildPub && !buildBlock?.[0].match(/publish/)) {
    result.notes.push("No [build].publish found in netlify.toml; assuming publish directory is repository root ('.').");
  }
  result.notes.push("TOML parsed with best-effort regex (no dependency). Complex configs may need manual review.");
  return result;
}

function listHtmlFiles(dir) {
  const out = [];
  let entries = [];
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch (e) {
    addErr(`Cannot read publish directory: ${e.message}`, dir);
    return out;
  }
  for (const e of entries) {
    if (e.isFile() && e.name.toLowerCase().endsWith(".html")) {
      out.push(path.join(dir, e.name));
    }
  }
  return out.sort();
}

function isExternal(u) {
  return /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(u);
}
function isIgnorableRef(u) {
  if (!u) return true;
  const t = u.trim();
  if (!t) return true;
  if (t.startsWith("#")) return "fragment";
  if (/^(?:mailto:|tel:|sms:|javascript:|data:|blob:)/i.test(t)) return true;
  if (/^https?:\/\//i.test(t) || t.startsWith("//")) return true;
  return false;
}

function splitSrcset(v) {
  return v.split(",").map((s) => s.trim().split(/\s+/)[0]).filter(Boolean);
}

function resolveLocalRef(ref, fromFile, publishDir) {
  const clean = ref.split("#")[0].split("?")[0].trim();
  if (!clean) return null;
  let decoded = clean;
  try {
    decoded = decodeURIComponent(clean);
  } catch {
    decoded = clean;
  }
  if (decoded.startsWith("/")) {
    // Root-relative to publish dir
    return path.resolve(publishDir, "." + decoded.replace(/\//g, path.sep));
  }
  return path.resolve(path.dirname(fromFile), decoded.replace(/\//g, path.sep));
}

function collectIds(html) {
  const ids = new Set();
  const re = /\bid\s*=\s*["']([^"']+)["']/gi;
  let m;
  while ((m = re.exec(html))) ids.add(m[1]);
  return ids;
}

function checkHtmlFile(file, publishDir, allHtmlByBase) {
  const raw = readText(file);
  if (raw == null) {
    addErr("Cannot read HTML file", file);
    return;
  }
  const ids = collectIds(raw);
  const lines = raw.split(/\r?\n/);

  // src/href attributes (simple; avoids full parser dependency)
  const attrRe = /\b(src|href|poster|data-src)\s*=\s*["']([^"']+)["']/gi;
  let m;
  while ((m = attrRe.exec(raw))) {
    const attr = m[1].toLowerCase();
    const val = m[2].trim();
    const line = raw.slice(0, m.index).split(/\r?\n/).length;
    const ign = isIgnorableRef(val);
    if (ign === "fragment") {
      const frag = val.slice(1);
      if (frag && !ids.has(frag) && !frag.startsWith("!")) {
        addWarn(`Fragment '#${frag}' target not found in same page (may be dynamic)`, file, line);
      }
      continue;
    }
    if (ign) continue;
    // srcset handled separately
    const target = resolveLocalRef(val, file, publishDir);
    if (!target) continue;
    // If points to a directory-like or known route, be careful
    const relFromPublish = path.relative(publishDir, target).replace(/\\/g, "/");
    if (relFromPublish.startsWith("..")) {
      addWarn(`Reference resolves outside publish directory: ${val}`, file, line);
      continue;
    }
    // Skip Netlify function/API paths
    if (val.startsWith("/api/") || val.startsWith("/.netlify/")) continue;
    if (!exists(target)) {
      // Try with .html if it's an extensionless internal link
      if (!path.extname(target) && exists(target + ".html")) continue;
      // Check if it's a redirect target that maps to existing file (tile-visualizer)
      if (val === "/tile-visualizer" || val === "/tile-visualizer/") continue;
      addErr(`Missing local reference: ${val}`, file, line);
    } else if (!isFile(target) && !fs.statSync(target).isDirectory()) {
      addErr(`Reference is not a file: ${val}`, file, line);
    }
  }

  // srcset
  const srcsetRe = /\bsrcset\s*=\s*["']([^"']+)["']/gi;
  while ((m = srcsetRe.exec(raw))) {
    const line = raw.slice(0, m.index).split(/\r?\n/).length;
    for (const part of splitSrcset(m[1])) {
      if (isIgnorableRef(part) || isIgnorableRef(part) === "fragment") continue;
      if (/^(?:https?:)?\/\//i.test(part) || /^(?:data:|blob:)/i.test(part)) continue;
      const target = resolveLocalRef(part, file, publishDir);
      if (!target) continue;
      const relFromPublish = path.relative(publishDir, target).replace(/\\/g, "/");
      if (relFromPublish.startsWith("..")) continue;
      if (!exists(target)) addErr(`Missing local srcset reference: ${part}`, file, line);
    }
  }

  // meta/images in content (og:image/twitter:image often absolute - external ok)
}

function checkCssFile(file, publishDir) {
  const raw = readText(file);
  if (raw == null) return;
  // url(...) references
  const urlRe = /url\(\s*["']?([^"')#?\s]+[^"')]*)["']?\s*\)/gi;
  let m;
  while ((m = urlRe.exec(raw))) {
    const val = m[1].trim();
    const line = raw.slice(0, m.index).split(/\r?\n/).length;
    if (/^(?:data:|https?:|\/\/)/i.test(val)) continue;
    if (val.startsWith("#")) continue;
    const clean = val.split("#")[0].split("?")[0];
    const target = resolveLocalRef(clean, file, publishDir);
    if (!target) continue;
    const relFromPublish = path.relative(publishDir, target).replace(/\\/g, "/");
    if (relFromPublish.startsWith("..")) continue;
    if (!exists(target)) addErr(`Missing CSS asset reference: ${val}`, file, line);
  }
}

function walkCssFiles(dir, out = []) {
  let entries = [];
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walkCssFiles(p, out);
    else if (e.isFile() && e.name.toLowerCase().endsWith(".css")) out.push(p);
  }
  return out;
}

function checkSitemap(file, publishDir) {
  const raw = readText(file);
  if (raw == null) {
    addErr("sitemap.xml cannot be read", file);
    return;
  }
  // Basic XML well-formedness checks (no full parser dependency)
  if (!raw.includes("<urlset")) addErr("sitemap.xml missing <urlset>", file);
  if (!raw.includes("</urlset>")) addErr("sitemap.xml missing </urlset>", file);
  const locRe = /<loc>\s*([^<]+?)\s*<\/loc>/gi;
  let m;
  const locs = [];
  while ((m = locRe.exec(raw))) {
    const line = raw.slice(0, m.index).split(/\r?\n/).length;
    const loc = m[1].trim();
    locs.push(loc);
    if (loc.includes("#")) {
      addErr(`Sitemap <loc> contains fragment (disallowed): ${loc}`, file, line);
    }
    if (/\?/.test(loc)) {
      addWarn(`Sitemap <loc> contains query string (review): ${loc}`, file, line);
    }
  }
  addInfo(`Sitemap URLs found: ${locs.length}`);
  // Check that sitemap-referenced local pages likely exist (best-effort)
  for (const loc of locs) {
    try {
      const u = new URL(loc);
      let p = u.pathname.replace(/\/+$/, "") || "/";
      if (p === "/") continue; // index
      if (p.startsWith("/")) p = p.slice(1);
      // map common routes
      const candidates = [
        path.join(publishDir, p),
        path.join(publishDir, p + ".html"),
        path.join(publishDir, p, "index.html"),
      ];
      // tile-visualizer redirect
      if (p === "tile-visualizer") continue;
      if (!candidates.some((c) => exists(c))) {
        addWarn(`Sitemap URL path may not resolve to a publish file: ${loc}`, file);
      }
    } catch {
      addWarn(`Sitemap <loc> is not a valid absolute URL: ${loc}`, file);
    }
  }
}

﻿function isGitIgnored(relPath) {
  try {
    execFileSync('git', ['check-ignore', '-q', relPath], { cwd: ROOT, stdio: 'pipe' });
    return true;
  } catch (e) {
    return false;
  }
}

function collectReferencedImageAssets(publishDir) {
  const assets = new Set();
  const htmlFiles = exists(publishDir) ? listHtmlFiles(publishDir) : [];
  for (const h of htmlFiles) {
    const raw = readText(h);
    if (!raw) continue;
    const attrRe = /\b(?:src|href|poster|data-src)\s*=\s*["']([^"']+)["']/gi;
    let m;
    while ((m = attrRe.exec(raw))) {
      const v = m[1].trim();
      if (!v || /^(?:https?:|\/\/|data:|blob:|mailto:|tel:|javascript:)/i.test(v)) continue;
      const clean = v.split('#')[0].split('?')[0];
      if (!clean) continue;
      let decoded = clean;
      try { decoded = decodeURIComponent(clean); } catch {}
      const target = decoded.startsWith('/')
        ? path.resolve(publishDir, '.' + decoded.replace(/\//g, path.sep))
        : path.resolve(path.dirname(h), decoded.replace(/\//g, path.sep));
      const rel = path.relative(ROOT, target).replace(/\\/g, '/');
      if (rel.startsWith('assets/images/') && (/\.(png|jpe?g|webp|avif|gif|svg|ico)$/i.test(rel))) {
        assets.add(rel);
      }
    }
    const srcsetRe = /\bsrcset\s*=\s*["']([^"']+)["']/gi;
    while ((m = srcsetRe.exec(raw))) {
      for (const part of m[1].split(',')) {
        const v = part.trim().split(/\s+/)[0];
        if (!v || /^(?:https?:|\/\/|data:|blob:)/i.test(v)) continue;
        const clean = v.split('#')[0].split('?')[0];
        if (!clean) continue;
        let decoded = clean;
        try { decoded = decodeURIComponent(clean); } catch {}
        const target = decoded.startsWith('/')
          ? path.resolve(publishDir, '.' + decoded.replace(/\//g, path.sep))
          : path.resolve(path.dirname(h), decoded.replace(/\//g, path.sep));
        const rel = path.relative(ROOT, target).replace(/\\/g, '/');
        if (rel.startsWith('assets/images/') && (/\.(png|jpe?g|webp|avif|gif|svg|ico)$/i.test(rel))) {
          assets.add(rel);
        }
      }
    }
  }
  const cssFiles = exists(publishDir) ? walkCssFiles(publishDir) : [];
  for (const cf of cssFiles) {
    const raw = readText(cf);
    if (!raw) continue;
    const urlRe = /url\(\s*["']?([^"')]+)["']?\s*\)/gi;
    let m;
    while ((m = urlRe.exec(raw))) {
      const v = m[1].trim();
      if (/^(?:data:|https?:|\/\/)/i.test(v)) continue;
      const clean = v.split('#')[0].split('?')[0];
      if (!clean) continue;
      const target = path.resolve(path.dirname(cf), clean.replace(/\//g, path.sep));
      const rel = path.relative(ROOT, target).replace(/\\/g, '/');
      if (rel.startsWith('assets/images/') && (/\.(png|jpe?g|webp|avif|gif|svg|ico)$/i.test(rel))) {
        assets.add(rel);
      }
    }
  }
  return assets;
}

function main() {
  addInfo(`Project root: ${ROOT}`);
  const netlifyPath = path.join(ROOT, "netlify.toml");
  const net = parseNetlifyToml(netlifyPath);
  for (const n of net.notes) addInfo(`netlify.toml: ${n}`);
  if (!net.parsed) addWarn("netlify.toml could not be read; publish/functions detection is defaulted and may be unreliable.", netlifyPath);

  const publishDir = path.resolve(ROOT, net.publish);
  const functionsDir = path.resolve(ROOT, net.functionsDir);
  addInfo(`Publish directory (resolved): ${path.relative(ROOT, publishDir).replace(/\\/g, "/") || "."}`);
  addInfo(`Functions directory (resolved): ${path.relative(ROOT, functionsDir).replace(/\\/g, "/")}`);

  if (!exists(publishDir)) {
    addErr("Publish directory does not exist", publishDir);
  }
  if (!exists(functionsDir)) {
    addErr("Functions directory does not exist", functionsDir);
  } else {
    const funcFiles = ["tile-catalog.json", "tile-visualize.mjs"];
    for (const f of funcFiles) {
      const p = path.join(functionsDir, f);
      if (!isFile(p)) addErr(`Required Netlify function file missing: ${path.relative(ROOT, p).replace(/\\/g, "/")}`, p);
      else addInfo(`Function file OK: ${path.relative(ROOT, p).replace(/\\/g, "/")}`);
    }
  }

  // Required release files (relative to publish dir)
  const required = [
    "index.html",
    "ads.txt",
    "robots.txt",
    "sitemap.xml",
    "manifest.webmanifest",
    "favicon.ico",
    "icon-192.png",
    "icon-512.png",
    "googlef91b2596941dc0c0.html",
  ];
  for (const r of required) {
    const p = path.join(publishDir, r);
    if (!isFile(p)) addErr(`Required release file missing: ${r}`, p);
    else addInfo(`Required file OK: ${r}`);
  }
  // netlify.toml: config usually lives at repo root; warn if missing from publish when publish!=root
  const netlifyInPublish = path.join(publishDir, "netlify.toml");
  if (path.resolve(publishDir) !== path.resolve(ROOT)) {
    if (!isFile(netlifyInPublish) && !isFile(netlifyPath)) addErr("netlify.toml missing (needed for Netlify config)", netlifyPath);
    else if (!isFile(netlifyInPublish)) addWarn("netlify.toml not in publish dir (often kept at repo root; verify deploy settings)", netlifyPath);
  }

  const htmlFiles = exists(publishDir) ? listHtmlFiles(publishDir) : [];
  addInfo(`HTML pages found in publish dir: ${htmlFiles.length}`);
  for (const h of htmlFiles) addInfo(`  - ${path.relative(publishDir, h).replace(/\\/g, "/")}`);
  if (htmlFiles.length === 0) addErr("No HTML pages found in publish directory", publishDir);
  if (!htmlFiles.some((h) => path.basename(h).toLowerCase() === "index.html")) {
    addErr("index.html missing from publish directory (release root requirement)", publishDir);
  }

  for (const h of htmlFiles) checkHtmlFile(h, publishDir, htmlFiles);

  // Check CSS files under publish/assets (and any .css in publish)
  const cssFiles = exists(publishDir) ? walkCssFiles(publishDir) : [];
  addInfo(`CSS files scanned: ${cssFiles.length}`);
  for (const c of cssFiles) checkCssFile(c, publishDir);

  const sitemapPath = path.join(publishDir, "sitemap.xml");
  if (isFile(sitemapPath)) checkSitemap(sitemapPath, publishDir);

﻿  // Git-ignore check for referenced image assets (deployment availability)
  const referencedAssets = collectReferencedImageAssets(publishDir);
  let ignoredCount = 0;
  for (const asset of referencedAssets) {
    if (isGitIgnored(asset)) {
      ignoredCount++;
      addWarn('Referenced asset is Git-ignored (may be missing in Git-based deployments): ' + asset, path.join(ROOT, asset));
    }
  }
  if (ignoredCount === 0 && referencedAssets.size > 0) {
    addInfo('Git-ignore check: all ' + referencedAssets.size + ' referenced image assets are trackable.');
  } else if (ignoredCount > 0) {
    addInfo('Git-ignore check: ' + ignoredCount + ' of ' + referencedAssets.size + ' referenced image assets are Git-ignored.');
  }

  // Summary
  console.log("=== Magadh Release Validator ===");
  for (const l of info) console.log(`INFO: ${l}`);
  console.log("");
  for (const w of warnings) console.log(`WARN: ${w}`);
  for (const e of errors) console.log(`ERROR: ${e}`);
  console.log("");
  const status = errors.length > 0 ? "FAIL" : warnings.length > 0 ? "PASS (with warnings)" : "PASS";
  console.log(`SUMMARY: ${status} | ${errors.length} error(s), ${warnings.length} warning(s)`);
  process.exit(errors.length > 0 ? 1 : 0);
}

main();
