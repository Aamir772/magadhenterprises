# Magadh Enterprises — Upgrade Roadmap

**Project:** `F:\AI Project\Magadh`  
**Date:** 2026-10-28  
**Status:** Baseline

## Priorities

### P0 - Critical (Blockers)
| ID | Task | Impact | Evidence | Dependencies | Acceptance Criteria | Risk | Status |
|----|------|--------|----------|--------------|---------------------|------|--------|
| P0-001 | Prevent unstyled/broken-image deployment (ZIP root structure) | Critical | RELEASE-REPORT-v2.0.md documents nested dist/ issue | Release process | ZIP root contains index.html + assets/ directly | High | NOT TESTED |
| P0-002 | Verify all local assets resolve in release/ | Critical | Need check | release/ exists | No 404s for local assets in browser test | High | NOT TESTED |
| P0-003 | Ensure no secrets in repo/release | Critical | Security scan needed | Repo | No credentials/keys found | High | NOT TESTED |

### P1 - High
| ID | Task | Impact | Evidence | Dependencies | Acceptance Criteria | Risk | Status |
|----|------|--------|----------|--------------|---------------------|------|--------|
| P1-001 | Tile Visualizer functional & independent | High | Recent fixes applied | Assets fixed | All interactions work, images load | High | NOT TESTED |
| P1-002 | Navigation all links correct (no dead anchors) | High | Recent fixes (products links) | Nav structure | All links resolve | High | NOT TESTED |
| P1-003 | AdSense loader single-load protection | High | Need review | ads.js | No duplicate script loads | High | NOT TESTED |
| P1-004 | ads.txt correct & present | High | ads.txt exists | - | Matches AdSense record | High | NOT TESTED |
| P1-005 | Asset integrity verification process | High | Need script | All files | Detect missing local refs | High | NOT TESTED |

### P2 - Medium
| ID | Task | Impact | Evidence | Dependencies | Acceptance Criteria | Risk | Status |
|----|------|--------|----------|--------------|---------------------|------|--------|
| P2-001 | Mobile responsiveness across breakpoints | Medium | Need full test | CSS | All breakpoints pass | Medium | NOT TESTED |
| P2-002 | Performance optimization | Medium | Need audit | Images/CSS/JS | Measurable improvements | Medium | NOT TESTED |
| P2-003 | Accessibility improvements | Medium | Need audit | HTML/CSS | WCAG considerations addressed | Medium | NOT TESTED |
| P2-004 | SEO fixes (sitemap anchors → pages) | Medium | Sitemap has # anchors | Routes | Use proper URLs | Medium | NOT TESTED |
| P2-005 | Console errors cleanup | Medium | Need test | All pages | No errors (allow favicon 404s under file://) | Medium | NOT TESTED |

### P3 - Low/Enhancement
| ID | Task | Impact | Evidence | Dependencies | Acceptance Criteria | Risk | Status |
|----|------|--------|----------|--------------|---------------------|------|--------|
| P3-001 | Tile Visualizer footer consistency (SVG icons) | Low | Flagged earlier | Design system | Aligned with others if desired | Low | NOT TESTED |
| P3-002 | Reduce redundant CSS | Low | Large styles.css | Testing | No regressions | Low | NOT TESTED |
| P3-003 | Add QA scripts automation | Low | Need create | Tests dir | Repeatable checks | Low | NOT TESTED |

## Recommended Order
1. P0-001 through P0-003 (blockers)
2. P1 items (core functionality/ads)
3. P2 items (UX/perf/seo/a11y)
4. P3 items (polish)

## Notes
- Do not redesign; incremental fixes only
- Preserve all working features
- Test in release/ folder before deploying
- No auto-deploy
