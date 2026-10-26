# Phase 7 — Cross-browser, responsive, and accessibility automation

## Browser/viewport matrix

The UI suite is configured for all nine combinations:
- Chromium, Firefox, WebKit
- Desktop 1280×720, tablet 768×1024, mobile 375×812

The API contract/critical journey runs once in the dedicated API project to avoid redundant API mutations across UI browser/viewport projects.

## Reliability practices

- Use Page Objects and web-first assertions; no fixed sleeps.
- Keep synthetic data and authorised DEV/QA/UAT targets only.
- Keep browser and viewport in project names so failures are attributable.
- Preserve traces, screenshots, video, HTML, and JUnit on failure.
- A retry-only pass remains a flakiness signal and must be investigated.

## Accessibility practices

The axe scan uses WCAG 2.1 A/AA tags. Raw results are attached to each Playwright test and surfaced in the HTML report. Rule ID, impact, description, help URL, and affected nodes are available for triage. Automated axe checks are only one part of the Consumer Duty evidence pack; manual keyboard/screen-reader and journey checks remain required.

## Current limitations

The actual UI selectors and auth contract must be confirmed against the authorised application. The current mock API has no registration or notification endpoint and the payment endpoint returns a schedule rather than executing a payment. Do not mark the full login-to-notification journey as certified until those capabilities and corresponding test data are available.
