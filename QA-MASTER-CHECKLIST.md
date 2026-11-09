# Magadh Enterprises — QA Master Checklist

**Project:** `F:\AI Project\Magadh`  
**Production URL:** https://magadhenterprises.netlify.app/  
**Last Updated:** 2026-10-28  
**Status:** 0 of 71 checks marked complete

> Check items only with evidence. Mark `PASS`/`FAIL`/`NOT TESTED`/`BLOCKED`/`NOT APPLICABLE`. Distinguish automated vs manual browser checks.

## 1. Security, Privacy & Configuration (9 checks)

| # | Check | Status | Evidence/Command | Affected Files/Pages | Finding/Severity | Correction | Retest |
|---|------|--------|-------------------|----------------------|-----------------|-------------|--------|
| 1.1 | Scan for exposed secrets/credentials (no values printed) | NOT TESTED | `git log --oneline -5`, grep for keys/tokens in tracked files | Repo-wide | - | - | - |
| 1.2 | Review external scripts/deps and vulns | NOT TESTED | Check script tags (Google Fonts, AdSense, etc.) | HTML files | - | - | - |
| 1.3 | Check HTTPS/security headers/redirects/public config | NOT TESTED | Review `netlify.toml` | netlify.toml | - | - | - |
| 1.4 | Check forms/inputs for injection/unsafe URL handling | NOT TESTED | Search for form/action/onsubmit | HTML/JS | - | - | - |
| 1.5 | Review third-party tracking/ads and privacy disclosures | NOT TESTED | Review AdSense loader (`assets/js/ads.js`) | ads.js, HTML | - | - | - |
| 1.6 | Confirm no private files/creds/local paths enter release | NOT TESTED | Review `.gitignore`, release contents | .gitignore, release/ | - | - | - |
| 1.7 | Verify AdSense loader config and duplicate-load protection | NOT TESTED | Inspect `assets/js/ads.js` | assets/js/ads.js | - | - | - |
| 1.8 | Review robots/sitemap/canonical/ public file exposure | NOT TESTED | Check `robots.txt`, `sitemap.xml` | robots.txt, sitemap.xml | - | - | - |
| 1.9 | Verify `ads.txt` matches expected record | NOT TESTED | Compare `ads.txt` | ads.txt | - | - | - |

## 2. Functional QA & Regression (10 checks)

| # | Check | Status | Evidence/Command | Affected Files/Pages | Finding/Severity | Correction | Retest |
|---|------|--------|-------------------|----------------------|-----------------|-------------|--------|
| 2.1 | All 10 HTML pages load | NOT TESTED | Browser/puppeteer check | All .html | - | - | - |
| 2.2 | All nav links, anchors, dropdowns | NOT TESTED | Manual browser | Header/nav | - | - | - |
| 2.3 | Approved nav order & mobile hamburger | NOT TESTED | Manual browser | Header/mobile-nav | - | - | - |
| 2.4 | Category/product links correct | NOT TESTED | Manual browser | Product pages | - | - | - |
| 2.5 | Phone/WhatsApp/contact/map links | NOT TESTED | Manual browser | All pages | - | - | - |
| 2.6 | Tile Visualizer interactions & image selection | NOT TESTED | Manual browser + QA | tile-visualizer.html, JS | - | - | - |
| 2.7 | Header/footer shared components consistent | NOT TESTED | Compare across pages | All pages | - | - | - |
| 2.8 | Existing functionality survives changes | NOT TESTED | Regression check | All | - | - | - |
| 2.9 | Internal links valid | NOT TESTED | Link checker | All pages | - | - | - |
| 2.10 | No JS console errors on load | NOT TESTED | Browser console | All pages | - | - | - |

## 3. Branding, UI/UX & Responsiveness (10 checks)

| # | Check | Status | Evidence/Command | Affected Files/Pages | Finding/Severity | Correction | Retest |
|---|------|--------|-------------------|----------------------|-----------------|-------------|--------|
| 3.1 | Approved ME logo consistent | NOT TESTED | Visual check | All pages | - | - | - |
| 3.2 | Crystal Ceramics/Exxaro/Vura correct logos | NOT TESTED | Visual check | Relevant pages | - | - | - |
| 3.3 | Typography/colors/alignment/spacing/widths | NOT TESTED | Visual check | styles.css | - | - | - |
| 3.4 | Header height/logo/nav/dropdown clipping | NOT TESTED | Visual check | styles.css | - | - | - |
| 3.5 | Footer readability/address wrap/excessive height | NOT TESTED | Visual check | styles.css, footer | - | - | - |
| 3.6 | Product cards/gallery/overlap check | NOT TESTED | Visual check | Product pages | - | - | - |
| 3.7 | Viewports 320,360,390,414,768,1024,1280,1440 | NOT TESTED | Puppeteer/responsive | All pages | - | - | - |
| 3.8 | Keyboard focus/readable text/contrast/touch targets | NOT TESTED | Manual + a11y check | All | - | - | - |
| 3.9 | No horizontal scroll at tested widths | NOT TESTED | Puppeteer audit | All pages | - | - | - |
| 3.10 | No overlapping elements/clipping | NOT TESTED | Puppeteer audit | All pages | - | - | - |

## 4. Performance & Reliability (8 checks)

| # | Check | Status | Evidence/Command | Affected Files/Pages | Finding/Severity | Correction | Retest |
|---|------|--------|-------------------|----------------------|-----------------|-------------|--------|
| 4.1 | Image paths/dimensions/formats/lazy loading | NOT TESTED | Code review + network | assets/images | - | - | - |
| 4.2 | CSS/JS/fonts/image requests reasonable | NOT TESTED | DevTools Network | All | - | - | - |
| 4.3 | No duplicate payloads/unnecessary scripts | NOT TESTED | Network review | All | - | - | - |
| 4.4 | Console errors/failed requests/JS exceptions | NOT TESTED | Browser console | All | - | - | - |
| 4.5 | Performance (Lighthouse/available tools) | NOT TESTED | Lighthouse | key pages | - | - | - |
| 4.6 | Layout shifts/oversized assets/slow sections | NOT TESTED | Lighthouse/DevTools | key pages | - | - | - |
| 4.7 | Graceful fallback if external services/ads unavailable | NOT TESTED | Network block test | AdSense | - | - | - |
| 4.8 | Caching/compression (Netlify headers) | NOT TESTED | Review netlify.toml | netlify.toml | - | - | - |

## 5. SEO & Content Quality (8 checks)

| # | Check | Status | Evidence/Command | Affected Files/Pages | Finding/Severity | Correction | Retest |
|---|------|--------|-------------------|----------------------|-----------------|-------------|--------|
| 5.1 | Unique titles & useful meta descriptions | NOT TESTED | Inspect <head> | All pages | - | - | - |
| 5.2 | Canonical URLs & indexability | NOT TESTED | Inspect <head> | All pages | - | - | - |
| 5.3 | robots.txt & sitemap.xml valid | NOT TESTED | Review files | robots.txt, sitemap.xml | - | - | - |
| 5.4 | Heading hierarchy/alt text/descriptive links | NOT TESTED | Audit | All pages | - | - | - |
| 5.5 | Open Graph/social metadata | NOT TESTED | Inspect <head> | All pages | - | - | - |
| 5.6 | Internal links & broken destinations | NOT TESTED | Link checker | All pages | - | - | - |
| 5.7 | Mobile usability & search readiness | NOT TESTED | Lighthouse/DevTools | All | - | - | - |
| 5.8 | Local business info consistent | NOT TESTED | Review content | All pages | - | - | - |

## 6. Accessibility (7 checks)

| # | Check | Status | Evidence/Command | Affected Files/Pages | Finding/Severity | Correction | Retest |
|---|------|--------|-------------------|----------------------|-----------------|-------------|--------|
| 6.1 | Semantic HTML & landmarks | NOT TESTED | Audit | All pages | - | - | - |
| 6.2 | Keyboard navigation & visible focus | NOT TESTED | Manual test | All | - | - | - |
| 6.3 | Image alt text & decorative handling | NOT TESTED | Audit | All pages | - | - | - |
| 6.4 | Color contrast & text scaling | NOT TESTED | Contrast checker | styles.css | - | - | - |
| 6.5 | Form labels & accessible validation | NOT TESTED | Audit | Any forms | - | - | - |
| 6.6 | Reduced motion support | NOT TESTED | CSS review + test | styles.css | - | - | - |
| 6.7 | Automated + manual a11y checks documented | NOT TESTED | axe/Lighthouse | All | - | - | - |

## 7. Products, Assets & Business Info (7 checks)

| # | Check | Status | Evidence/Command | Affected Files/Pages | Finding/Severity | Correction | Retest |
|---|------|--------|-------------------|----------------------|-----------------|-------------|--------|
| 7.1 | Every product/category page has intended content | NOT TESTED | Review pages | Product pages | - | - | - |
| 7.2 | Product/showroom images match descriptions | NOT TESTED | Visual check | Product pages | - | - | - |
| 7.3 | Logos not stretched/cropped/substituted | NOT TESTED | Visual check | All pages | - | - | - |
| 7.4 | All local assets exist at exact referenced paths | NOT TESTED | Path verification script | All files | - | - | - |
| 7.5 | Phone/address/opening/map correct | NOT TESTED | Review content | All pages | - | - | - |
| 7.6 | Tile Visualizer independent & functional | NOT TESTED | Test | tile-visualizer.html | - | - | - |
| 7.7 | Brand-neutral styling, no single-supplier emphasis | NOT TESTED | Review | All pages | - | - | - |

## 8. AdSense & Monetization (9 checks)

| # | Check | Status | Evidence/Command | Affected Files/Pages | Finding/Severity | Correction | Retest |
|---|------|--------|-------------------|----------------------|-----------------|-------------|--------|
| 8.1 | Publisher ID ca-pub-2608310326412608 configured | NOT TESTED | Check HTML/JS | All pages, ads.js | - | - | - |
| 8.2 | Auto ads config retained | NOT TESTED | Review AdSense loader | assets/js/ads.js | - | - | - |
| 8.3 | AdSense script loaded once per page | NOT TESTED | Check for duplicates | All pages | - | - | - |
| 8.4 | Manual ad units only with real slot IDs | NOT TESTED | Review code | HTML/JS | - | - | - |
| 8.5 | Ads don't obscure nav/contact/important info | NOT TESTED | Visual check | All pages | - | - | - |
| 8.6 | Inactive/unfilled ad slots collapse safely | NOT TESTED | Visual check | All pages | - | - | - |
| 8.7 | ads.txt matches exact AdSense record | NOT TESTED | Compare ads.txt | ads.txt | - | - | - |
| 8.8 | Distinguish install/verification/review/live serving | NOT TESTED | Review status | Documentation | - | - | - |
| 8.9 | Privacy/consent requirements evaluated | NOT TESTED | Review config | Documentation | - | - | - |

## 9. Build, ZIP & Netlify Release (13 checks)

| # | Check | Status | Evidence/Command | Affected Files/Pages | Finding/Severity | Correction | Retest |
|---|------|--------|-------------------|----------------------|-----------------|-------------|--------|
| 9.1 | Git status inspected, uncommitted changes preserved | NOT TESTED | `git status --short` | Repo | - | - | - |
| 9.2 | Correct production build/static-copy identified | NOT TESTED | Review process | Docs | - | - | - |
| 9.3 | Clean release/ with index.html at root | NOT TESTED | Check structure | release/ | - | - | - |
| 9.4 | All HTML/CSS/JS/fonts/images included | NOT TESTED | Count files | release/ | - | - | - |
| 9.5 | Automated checks run against release/ not source | NOT TESTED | Run QA on release/ | release/ | - | - | - |
| 9.6 | Serve release locally & test rendered output | NOT TESTED | Local server test | release/ | - | - | - |
| 9.7 | Create ZIP with deployable contents at archive root | NOT TESTED | Check ZIP structure | *.zip | - | - | - |
| 9.8 | Extract ZIP and verify paths/count/assets | NOT TESTED | Extract & verify | temp dir | - | - | - |
| 9.9 | Document test evidence/known issues/deploy/rollback | NOT TESTED | Update RELEASE-REPORT | RELEASE-REPORT.md | - | - | - |
| 9.10 | No CSS/images fail to load in release test | NOT TESTED | Browser test on release/ | release/ | - | - | - |
| 9.11 | Netlify config preserved if applicable | NOT TESTED | Check netlify.toml in release/ | release/netlify.toml | - | - | - |
| 9.12 | SEO/AdSense files present in release | NOT TESTED | Check files | release/ | - | - | - |
| 9.13 | Copy checklist with status saved | NOT TESTED | Save updated checklist | QA-MASTER-CHECKLIST.md | - | - | - |

**Total:** 71 checks. 0 complete.  
**Reset:** Update status as evidence collected.