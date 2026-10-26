import { test } from "@playwright/test";
import { DataRoomPage } from "../../src/pages/DataRoomPage";

test.describe("Brislane data room accessibility", () => {
  test("homepage has no axe-core WCAG 2.1 A/AA violations", async ({ page }, testInfo) => {
    const dataRoom = new DataRoomPage(page);
    await dataRoom.open();
    await dataRoom.runWcagAudit(testInfo);
  });

  test("homepage supports keyboard focus", async ({ page }) => {
    const dataRoom = new DataRoomPage(page);
    await dataRoom.open();
    await dataRoom.expectKeyboardFocusAvailable();
  });

  test("images expose an alt attribute", async ({ page }) => {
    const dataRoom = new DataRoomPage(page);
    await dataRoom.open();
    await dataRoom.expectAllImagesHaveAltText();
  });

  test("homepage contains a level-one heading", async ({ page }) => {
    const dataRoom = new DataRoomPage(page);
    await dataRoom.open();
    await dataRoom.expectHeadingStructure();
  });

  test("responsive layout renders without horizontal overflow at target breakpoints", async ({ page }) => {
    const dataRoom = new DataRoomPage(page);
    for (const viewport of [
      { width: 1280, height: 720 },
      { width: 768, height: 1024 },
      { width: 375, height: 812 },
    ]) {
      await dataRoom.setViewportAndExpectTitle(viewport.width, viewport.height);
    }
  });
});
