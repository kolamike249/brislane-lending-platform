import { expect, type TestInfo } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { BasePage } from "./BasePage";

const DATA_ROOM_URL = "https://alain-sortnext.github.io/brislane-lending-platform/";

export class DataRoomPage extends BasePage {
  async open(): Promise<void> { await this.page.goto(DATA_ROOM_URL); }
  async runWcagAudit(testInfo: TestInfo): Promise<void> {
    const results = await new AxeBuilder({ page: this.page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    await testInfo.attach("axe-accessibility-results.json", {
      body: JSON.stringify({
        url: this.page.url(),
        title: await this.page.title(),
        timestamp: new Date().toISOString(),
        wcagTags: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"],
        violationCount: results.violations.length,
        violations: results.violations.map(v => ({
          id: v.id,
          impact: v.impact,
          description: v.description,
          help: v.help,
          helpUrl: v.helpUrl,
          tags: v.tags,
          nodes: v.nodes.map(n => ({
            target: n.target,
            html: n.html,
            failureSummary: n.failureSummary,
            any: n.any.map(c => ({ id: c.id, message: c.message, data: c.data })),
          })),
        })),
        passes: results.passes.length,
        incomplete: results.incomplete.length,
      }, null, 2),
      contentType: "application/json",
    });
    // The attachment preserves rule IDs, WCAG tags, severity, selectors, and failure summaries.
    expect(results.violations.map(v => ({ id: v.id, impact: v.impact, nodes: v.nodes.length })))
      .toEqual([]);
  }
  async expectKeyboardFocusAvailable(): Promise<void> {
    await this.page.keyboard.press("Tab");
    const tagName = await this.page.evaluate(() => document.activeElement?.tagName ?? "");
    expect(tagName).not.toBe("");
  }
  async expectAllImagesHaveAltText(): Promise<void> {
    const count = await this.page.locator("img").evaluateAll(images =>
      images.filter(image => !(image as HTMLImageElement).hasAttribute("alt")).length);
    expect(count).toBe(0);
  }
  async expectHeadingStructure(): Promise<void> {
    const count = await this.page.locator("h1").count();
    expect(count).toBeGreaterThanOrEqual(1);
  }
  async expectTitle(): Promise<void> { await expect(this.page).toHaveTitle(/Brislane/i); }
  async setViewportAndExpectTitle(width: number, height: number): Promise<void> {
    await this.page.setViewportSize({ width, height });
    await this.open();
    await this.expectTitle();
    const dimensions = await this.page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      document: document.documentElement.scrollWidth,
    }));
    expect(dimensions.document).toBeLessThanOrEqual(dimensions.viewport + 1);
  }
}
