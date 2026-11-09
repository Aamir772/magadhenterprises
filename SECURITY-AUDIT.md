# Magadh Enterprises — Security Audit

**Project:** `F:\AI Project\Magadh`  
**Date:** 2026-10-28  
**Status:** Baseline (NOT TESTED)

## Scope
Review secrets, external scripts/deps, public config, injection risks, headers, privacy/ads, robots/sitemap/public file exposure.

## Findings

| # | Area | Severity | Status | Evidence | Finding | Recommendation |
|---|------|----------|--------|----------|---------|---------------|
| S-001 | Secrets/credentials in tracked files & git history | UNKNOWN | NOT TESTED | `git log --oneline -5`, file scan | Need to scan; do not print values | Scan .git history/files for keys/tokens, ensure none committed |
| S-002 | External scripts & deps | UNKNOWN | NOT TESTED | HTML script tags, fonts | Google Fonts, AdSense present | Review, minimize, document; no unnecessary deps |
| S-003 | Public config & private files exposure | UNKNOWN | NOT TESTED | `.gitignore`, files | Need review | Ensure secrets/private files not in repo/release |
| S-004 | Unsafe redirects/URL handling/injection/DOM | UNKNOWN | NOT TESTED | HTML/JS search | Need review | Avoid unsafe patterns, use safe APIs |
| S-005 | HTTPS/security headers (Netlify) | UNKNOWN | NOT TESTED | `netlify.toml` | Headers present (X-Content-Type-Options, Referrer-Policy, X-Frame-Options) | Verify as deployed; consider HSTS/CSP if needed |
| S-006 | Privacy disclosures (forms/analytics/ads) | UNKNOWN | NOT TESTED | Review pages | Need review | Document as applicable |
| S-007 | AdSense loader config & duplicate-load protection | UNKNOWN | NOT TESTED | `assets/js/ads.js` | Need review | Ensure single load, no duplicate |
| S-008 | robots.txt/sitemap exposure | UNKNOWN | NOT TESTED | `robots.txt`, `sitemap.xml` | robots allows all, sitemap present; sitemap has anchor links (#...) which aren't ideal | Consider canonical page URLs in sitemap |
| S-009 | ads.txt present | UNKNOWN | NOT TESTED | `ads.txt` | Contains `google.com, pub-2608310326412608, DIRECT, f08c47fec0942fa0` | Verify matches AdSense exactly |

## Notes
- No backend services detected. Static site.
- Netlify functions exist (`netlify/functions/tile-visualize.mjs`, `tile-catalog.json`) - review separately for secrets/env.

## Action Items
- [ ] Complete secret scan
- [ ] Review all external script origins
- [ ] Verify release has no private files
- [ ] Document AdSense configuration clearly
- [ ] Improve sitemap to use page URLs vs anchors
