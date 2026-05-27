# Changelog

## v1.0.0-prod — 2026-05-27

Production-readiness hardening on top of v0.1-shipped.

- Verified all CI gates pass on a clean `npm ci`: lint, typecheck, coverage (97.73% statements / 87.15% branches / 95.23% functions / 97.73% lines), build, demo, smoke, `npm audit --audit-level=high` (0 vulnerabilities at high/critical).
- Confirmed AGPL-3.0-or-later licensing, `SECURITY.md`, `CODE_OF_CONDUCT.md`, weekly `dependabot.yml` for `npm` + `github-actions`.
- Confirmed CI workflow runs the Node 20 + 22 matrix and the production-status surfaces (CI / License / Deploy badges + `## Production status` block) are intact in the README.
- Live operator surface running at https://zone.kineticgain.com/ via the GitHub Pages deploy rail with HTTPS enforcement enabled.
- No changes to source, README content, docs, or screenshots — those remain the v0.1-shipped surface from the build lane.

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
