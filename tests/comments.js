import { expect } from "./fixture";
import { getVisibleJumps } from "./getVisibleJumps";

/**
 * @typedef {import("playwright").Page} Page
 *
 * @typedef {import("playwright").BrowserContext} BrowserContext
 */

/** @param {Page} page */
export async function comments(page) {
  let jumpLinks = await page.locator(".--jump").all();
  expect.soft(jumpLinks).toHaveLength(38);

  await page.keyboard.press("c");
  jumpLinks = await getVisibleJumps(page);
  expect.soft(jumpLinks).toHaveLength(2);

  await page.keyboard.press("a");
  await expect(page).toHaveURL(/.*item\?id=39726156/);
}

/** @param {Page} page */
export async function commentsBackspace(page) {
  let jumpLinks = await page.locator(".--jump").all();
  expect.soft(jumpLinks).toHaveLength(38);

  await page.keyboard.press("c");
  jumpLinks = await getVisibleJumps(page);
  expect.soft(jumpLinks).toHaveLength(2);

  await page.keyboard.press("Backspace");
  jumpLinks = await getVisibleJumps(page);
  expect.soft(jumpLinks).toHaveLength(38);

  await comments(page);
}

/**
 * @param {Page} page
 * @param {BrowserContext} context
 */
export async function commentsCtrl(page, context) {
  let jumpLinks = await page.locator(".--jump").all();
  expect.soft(jumpLinks).toHaveLength(38);

  await page.keyboard.press("c");
  jumpLinks = await getVisibleJumps(page);
  expect.soft(jumpLinks).toHaveLength(2);

  await page.keyboard.press("a");

  // wait for a new tab to be created
  const [newPage] = await Promise.all([
    context.waitForEvent("page"),
    page.keyboard.press("b"),
  ]);

  await expect(page).toHaveURL(/.*link_aggregator\.html/);
  await expect(newPage).toHaveURL(/.*item\?id=39726156/);
}

/**
 * @param {Page} page
 * @param {BrowserContext} context
 */
export async function commentsCtrlBackspace(page, context) {
  let jumpLinks = await page.locator(".--jump").all();
  expect.soft(jumpLinks).toHaveLength(38);

  await page.keyboard.press("c");
  jumpLinks = await getVisibleJumps(page);
  expect.soft(jumpLinks).toHaveLength(2);

  await page.keyboard.press("Backspace");
  jumpLinks = await getVisibleJumps(page);
  expect.soft(jumpLinks).toHaveLength(38);

  await commentsCtrl(page, context);
}
