import { join } from "path";
import { URL } from "url";
import { expect, test } from "./fixture";

/**
 * @typedef {import("playwright").Page} Page
 *
 * @typedef {import("playwright").Locator} Locator
 *
 * @typedef {{ x: number; y: number; width: number; height: number }} Box
 */

test("only one instance of the extension is loaded", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });

  const url = new URL(
    join(__dirname, "examples/link_aggregator.html"),
    "file://",
  );
  await page.goto(url.toString());

  let jumpToListenerCount = await page
    .locator("#_jumpToListenerCount")
    .first()
    .getAttribute("data-count");

  expect(jumpToListenerCount).toBe("1");
});

test("opening a new tab still has the extension active", async ({
  page,
  context,
}) => {
  await page.setViewportSize({ width: 1280, height: 720 });

  const url = new URL(join(__dirname, "examples/homepage.html"), "file://");
  await page.goto(url.toString());

  const link = page.locator("#link");
  link.click({ modifiers: ["Control"] });

  const [newPage] = await Promise.all([context.waitForEvent("page")]);

  let jumpToListenerCount = await newPage
    .locator("#_jumpToListenerCount")
    .first()
    .getAttribute("data-count");

  expect(jumpToListenerCount).toBe("1");
});
