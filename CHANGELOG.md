# Changelog

## 0.1.0 - 2026-05-26

### Added
- Initial release: operator surface for Azure landing-zone baseline drift and platform-governance posture.
- Added a public dashboard surface with overview, zone-lane, guardrail-risks, drift-posture, verification, and docs routes.
- Added prerendered GitHub Pages packaging for `zone.kineticgain.com` with `CNAME`, `robots.txt`, `sitemap.xml`, and OG/meta injection at deploy time.
- Added synthetic landing-zone snapshots and drift packets covering public ingress, owner-role drift, missing deny assignments, disabled Defender, diagnostics gaps, and route bypass posture.
- Added `docs/KINETIC_GAIN_EMBEDDED.md` tying Azure platform governance to the embedded operator-surface lane.

### Validation
- CI: `lint`, `typecheck`, `coverage`, `build`, `demo`, `smoke`, `prerender`, `npm audit`
- CLI: `azure-landing-zone-drift <export.json>` with `--format json|markdown|summary`, `--now <iso>`, `--stale-drift-after-hours N`, `--fail-on-high`, `--out FILE`.
- Wave 11 — opens the Azure landing-zone and platform-governance track next to the Microsoft tenant, AWS, and GCP admin portfolio.
