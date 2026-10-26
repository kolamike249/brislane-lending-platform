# Brislane Keystone — Accessibility Audit Report

**Purpose:** Release-board evidence for the Consumer Duty accessibility review.  
**Standard in automated scope:** WCAG 2.1 Level A and AA, via @axe-core/playwright.  
**Status:** **Pending execution against an authorised non-production environment.**  
**Report generated:** 2026-10-26  
**Evidence policy:** Do not represent a planned test, TypeScript check, or an unexecuted axe scan as an accessibility pass.

## Scope and coverage

The Playwright accessibility suite audits the configured UI entry page with axe-core tags wcag2a, wcag2aa, wcag21a, and wcag21aa. It also runs keyboard-focus, image alternative-text, and heading-structure checks. UI projects are configured for Chromium, Firefox, and WebKit at 1280×720 (desktop), 768×1024 (tablet), and 375×812 (mobile).

Each axe test attaches the full axe result JSON to the Playwright test result. The HTML report includes the rule ID, impact, description, help URL, affected nodes, and failure summary for each violation. CI uploads the HTML and JUnit reports as run artifacts.

## Results

| Measure | Result |
|---|---|
| Live axe scan executed | **No — pending authorised environment run** |
| WCAG violations confirmed | **None recorded yet; this is not a pass** |
| Critical / serious / moderate / minor counts | **Not measured** |
| Browser and viewport combinations completed | **0 / 9 until a run is completed** |
| Evidence artifact | Playwright HTML report and attached axe JSON from the manual E2E workflow |

No violation IDs or severity counts are stated here because no live axe output has been supplied or executed. Populate this report from the resulting HTML/JSON artifacts after the authorised run; do not infer results from static source or TypeScript success.

## Severity classification

Axe impact values are recorded as:
- **Critical** — blocks core use or creates a severe barrier; remediate before release.
- **Serious** — substantial accessibility barrier; remediate before release unless a documented, approved exception exists.
- **Moderate** — meaningful barrier; fix before release where feasible and document any accepted residual risk.
- **Minor** — lower-impact issue; record and prioritise with an owner and due date.

These are triage categories for the audit, not substitutes for WCAG conformance assessment or manual testing.

## Release-board exit criteria

1. Execute the manual GitHub Actions workflow against an authorised DEV environment first, then QA/UAT as approved; use synthetic data only.
2. Review axe results for every browser/viewport project. Record rule ID, WCAG tags, impact, affected component, owner, remediation, and retest evidence.
3. Require zero unresolved critical or serious axe violations for release, or a formally approved exception with rationale and compensating controls.
4. Supplement automated checks with keyboard-only, screen-reader, zoom/reflow, focus order/visibility, error identification, and meaningful user-journey testing. Axe alone cannot prove WCAG conformance.
5. Attach the HTML report and relevant axe JSON evidence to the release record. Avoid sharing traces/screenshots containing customer or credential data.

## Known scope gaps to resolve

The currently documented API mock exposes login, customer listing, loan application creation/submission, and payment schedule retrieval. It does **not** expose a registration endpoint or a notifications endpoint. The current application UI selectors and auth/storage contract also require confirmation against the actual authorised test environment. Therefore this change automates the supported API critical path and prepares the cross-browser responsive/accessibility gate, but does not claim that registration, payment execution, or notification delivery is covered end-to-end.

## Execution commands

Set TEST_ENV, the matching BASE_URL and API_BASE_URL, and synthetic test credentials as environment variables before running npm test. Prefer GitHub Environment variables/secrets; never commit credentials. Trigger the Playwright quality gate with an authorised target environment to generate CI artifacts.
