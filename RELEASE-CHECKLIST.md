# Magadh Enterprises — Release Checklist

**Project:** `F:\AI Project\Magadh`  
**Release Version:** TBD  
**Target:** Netlify Drop/manual upload  
**Status:** NOT READY

> A release is ready ONLY when all required items pass with evidence.

## Pre-Build
- [ ] **GIT-001** Git status inspected, uncommitted changes reviewed/preserved - Evidence: _____
- [ ] **GIT-002** Correct branch confirmed (master) - Evidence: _____
- [ ] **GIT-003** Recent commits reviewed - Evidence: _____

## Build/Structure
- [ ] **BLD-001** Clean release/ directory prepared - Evidence: _____
- [ ] **BLD-002** `index.html` at release/ root - Evidence: _____
- [ ] **BLD-003** All 10 HTML pages present in release/ root - Evidence: _____
- [ ] **BLD-004** `assets/css/styles.css` present - Evidence: _____
- [ ] **BLD-005** All JS files present in `assets/js/` - Evidence: _____
- [ ] **BLD-006** All images/fonts/assets present - Evidence: _____
- [ ] **BLD-007** `netlify.toml` present (if needed) - Evidence: _____
- [ ] **BLD-008** `ads.txt` present - Evidence: _____
- [ ] **BLD-009** `robots.txt`, `sitemap.xml`, `manifest.webmanifest` present - Evidence: _____
- [ ] **BLD-010** Favicons/icons present - Evidence: _____
- [ ] **BLD-011** No dev files/secrets in release/ - Evidence: _____

## Asset Integrity
- [ ] **AST-001** All local asset paths resolve (no missing files) - Evidence: _____
- [ ] **AST-002** CSS loads correctly - Evidence: _____
- [ ] **AST-003** Images load (no broken images) - Evidence: _____
- [ ] **AST-004** JS loads without errors - Evidence: _____
- [ ] **AST-005** No path issues (case sensitivity) - Evidence: _____

## Functional Testing (release/)
- [ ] **FUN-001** All 10 pages load from local server - Evidence: _____
- [ ] **FUN-002** Navigation works - Evidence: _____
- [ ] **FUN-003** Mobile hamburger works - Evidence: _____
- [ ] **FUN-004** Tile Visualizer works (picker, images, interactions) - Evidence: _____
- [ ] **FUN-005** Phone/WhatsApp links work - Evidence: _____
- [ ] **FUN-006** No console errors (document expected file:// favicon 404s) - Evidence: _____

## Responsive Testing
- [ ] **RES-001** Tested 320,360,390,414,768,1024,1280,1440 - Evidence: _____
- [ ] **RES-002** No horizontal scroll - Evidence: _____
- [ ] **RES-003** No overlap/clipping - Evidence: _____
- [ ] **RES-004** Footer readable/address wraps - Evidence: _____

## SEO/Ads
- [ ] **SEO-001** Meta tags present - Evidence: _____
- [ ] **SEO-002** Canonicals present - Evidence: _____
- [ ] **ADS-001** AdSense script configured correctly - Evidence: _____
- [ ] **ADS-002** ads.txt correct - Evidence: _____
- [ ] **ADS-003** No duplicate AdSense loads - Evidence: _____

## ZIP Validation
- [ ] **ZIP-001** ZIP created with contents at root (not nested folder) - Evidence: _____
- [ ] **ZIP-002** Extract ZIP to temp dir, verify structure - Evidence: _____
- [ ] **ZIP-003** Test extracted files - Evidence: _____
- [ ] **ZIP-004** File count matches expectations - Evidence: _____

## Final Gate
- [ ] **GATE-001** All P0/P1 blockers resolved - Evidence: _____
- [ ] **GATE-002** Test evidence documented in RELEASE-REPORT.md - Evidence: _____
- [ ] **GATE-003** Deployment steps documented - Evidence: _____
- [ ] **GATE-004** Rollback procedure documented - Evidence: _____
- [ ] **GATE-005** Release approved - Evidence: _____

**Deployment Method:** Netlify Drop / Netlify UI manual upload  
**Rollback:** Previous ZIP/deployment available  
**Notes:** Do NOT auto-deploy. Test release/ first.
