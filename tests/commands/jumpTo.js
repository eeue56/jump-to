import { expect } from "../fixture";
import { getVisibleJumps } from "../getVisibleJumps";

/**
 * @typedef {import("playwright").Page} Page
 *
 * @typedef {import("playwright").BrowserContext} BrowserContext
 */
/** @param {Page} page */

export async function jumpTo(page) {
  let jumpLinks = await page.locator(".--jump").all();
  expect.soft(jumpLinks).toHaveLength(382);

  await page.keyboard.press("d");
  jumpLinks = await getVisibleJumps(page);
  expect.soft(jumpLinks).toHaveLength(16);

  await page.keyboard.press("a");
  await expect(page).toHaveURL(/.*newest/);
}
/**
 * @param {Page} page
 * @param {BrowserContext} context
 */

export async function jumpToCtrl(page, context) {
  let jumpLinks = await page.locator(".--jump").all();
  expect.soft(jumpLinks).toHaveLength(382);

  await page.keyboard.press("d");
  jumpLinks = await getVisibleJumps(page);
  expect.soft(jumpLinks).toHaveLength(16);

  await page.keyboard.press("a");

  // wait for a new tab to be created
  const [newPage] = await Promise.all([
    context.waitForEvent("page"),
    page.keyboard.press("b"),
  ]);

  await expect(page).toHaveURL(/.*link_aggregator\.html/);
  await expect(newPage).toHaveURL(/.*newest/);
}
