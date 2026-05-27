# Security Policy

`azure-landing-zone-drift-radar` ships both an offline analyzer and a synthetic public dashboard surface. It reads JSON exports from Azure landing-zone baselines (or synthetic data) and emits structured findings, route JSON, and prerendered HTML. No live Azure credential storage, no remote fetch of tenant data, and no execution of user-supplied code is included.

## Reporting a Vulnerability

Please use:

- [Open a security advisory](https://github.com/mizcausevic-dev/azure-landing-zone-drift-radar/security/advisories/new)
- or a private security contact route if one is listed in the repository profile

If you report an issue, include:

- affected file(s)
- proof-of-concept input
- expected impact
- steps to reproduce

## Supported scope

This repo is intentionally offline-first:

- the CLI parses local JSON exports
- the public dashboard is a static proof surface
- there is no live bridge into a production Azure tenant

That means the main security concerns are:

- malformed input handling
- accidental data leakage in sample fixtures
- unsafe HTML rendering of parsed values
- dependency issues in the Node/TypeScript toolchain

## Data posture

- Synthetic sample data only
- No tenant IDs, secrets, tokens, customer objects, or production exports should be committed
- Review screenshots and README examples before release to avoid metadata leakage
