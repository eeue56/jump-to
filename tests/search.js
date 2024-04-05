import { expect } from "./fixture";
import { getVisibleJumps } from "./getVisibleJumps";

/**
 * @typedef {import("playwright").Page} Page
 *
 * @typedef {import("playwright").BrowserContext} BrowserContext
 */
/** @param {Page} page */

export async function search(page) {
  let jumpLinks = await page.locator(".--jump").all();
  expect.soft(jumpLinks).toHaveLength(382);

  await page.keyboard.press("s");
  jumpLinks = await getVisibleJumps(page);
  expect.soft(jumpLinks).toHaveLength(188);

  await page.keyboard.press("i");
  jumpLinks = await getVisibleJumps(page);
  expect.soft(jumpLinks).toHaveLength(8);

  await page.keyboard.press("n");
  jumpLinks = await getVisibleJumps(page);
  expect.soft(jumpLinks).toHaveLength(4);

  await page.keyboard.press("g");
  jumpLinks = await getVisibleJumps(page);
  expect.soft(jumpLinks).toHaveLength(4);

  await page.keyboard.press("l");
  await expect(page).toHaveURL(/.*user\?id=single_cloud/);
}
/** @param {Page} page */
export async function searchBackspace(page) {
  let jumpLinks = await page.locator(".--jump").all();
  expect.soft(jumpLinks).toHaveLength(382);

  await page.keyboard.press("s");
  jumpLinks = await getVisibleJumps(page);
  expect.soft(jumpLinks).toHaveLength(188);

  await page.keyboard.press("i");
  jumpLinks = await getVisibleJumps(page);
  expect.soft(jumpLinks).toHaveLength(8);

  await page.keyboard.press("n");
  jumpLinks = await getVisibleJumps(page);
  expect.soft(jumpLinks).toHaveLength(4);

  await page.keyboard.press("Backspace");
  jumpLinks = await getVisibleJumps(page);
  expect.soft(jumpLinks).toHaveLength(8);

  await page.keyboard.press("Backspace");
  jumpLinks = await getVisibleJumps(page);
  expect.soft(jumpLinks).toHaveLength(188);

  await page.keyboard.press("Backspace");
  jumpLinks = await getVisibleJumps(page);
  expect.soft(jumpLinks).toHaveLength(382);

  await page.keyboard.press("Backspace");
  jumpLinks = await page.locator(".--jump").all();
  expect.soft(jumpLinks).toHaveLength(0);
}
/** @param {Page} page */
export async function searchEnter(page) {
  let jumpLinks = await page.locator(".--jump").all();
  expect.soft(jumpLinks).toHaveLength(382);

  await page.keyboard.press("s");
  jumpLinks = await getVisibleJumps(page);
  expect.soft(jumpLinks).toHaveLength(188);

  await page.keyboard.press("i");
  jumpLinks = await getVisibleJumps(page);
  expect.soft(jumpLinks).toHaveLength(8);

  await page.keyboard.press("n");
  jumpLinks = await getVisibleJumps(page);
  expect.soft(jumpLinks).toHaveLength(4);

  await page.keyboard.press("Enter");
  jumpLinks = await getVisibleJumps(page);
  expect.soft(jumpLinks).toHaveLength(4);

  await page.keyboard.press("i");
  jumpLinks = await getVisibleJumps(page);
  expect.soft(jumpLinks).toHaveLength(2);

  await page.keyboard.press("b");

  await expect(page).toHaveURL(/.*user\?id=single_cloud/);
}
/**
 * @param {Page} page
 * @param {BrowserContext} context
 */
export async function searchCtrl(page, context) {
  let jumpLinks = await page.locator(".--jump").all();
  expect.soft(jumpLinks).toHaveLength(382);

  await page.keyboard.press("s");
  jumpLinks = await getVisibleJumps(page);
  expect.soft(jumpLinks).toHaveLength(188);

  await page.keyboard.press("i");
  jumpLinks = await getVisibleJumps(page);
  expect.soft(jumpLinks).toHaveLength(8);

  await page.keyboard.press("n");
  jumpLinks = await getVisibleJumps(page);
  expect.soft(jumpLinks).toHaveLength(4);

  await page.keyboard.press("g");
  jumpLinks = await getVisibleJumps(page);
  expect.soft(jumpLinks).toHaveLength(4);

  // wait for a new tab to be created
  const [newPage] = await Promise.all([
    context.waitForEvent("page"),
    page.keyboard.press("l"),
  ]);

  await expect(page).toHaveURL(/.*link_aggregator\.html/);
  await expect(newPage).toHaveURL(/.*user\?id=single_cloud/);
}
/** @param {Page} page */
export async function searchCtrlBackspace(page) {
  let jumpLinks = await page.locator(".--jump").all();
  expect.soft(jumpLinks).toHaveLength(382);

  await page.keyboard.press("s");
  jumpLinks = await getVisibleJumps(page);
  expect.soft(jumpLinks).toHaveLength(188);

  await page.keyboard.press("i");
  jumpLinks = await getVisibleJumps(page);
  expect.soft(jumpLinks).toHaveLength(8);

  await page.keyboard.press("n");
  jumpLinks = await getVisibleJumps(page);
  expect.soft(jumpLinks).toHaveLength(4);

  await page.keyboard.press("Backspace");
  jumpLinks = await getVisibleJumps(page);
  expect.soft(jumpLinks).toHaveLength(8);

  await page.keyboard.press("Backspace");
  jumpLinks = await getVisibleJumps(page);
  expect.soft(jumpLinks).toHaveLength(188);

  await page.keyboard.press("Backspace");
  jumpLinks = await getVisibleJumps(page);
  expect.soft(jumpLinks).toHaveLength(382);

  await page.keyboard.press("Backspace");
  jumpLinks = await page.locator(".--jump").all();
  expect.soft(jumpLinks).toHaveLength(0);
}
/**
 * @param {Page} page
 * @param {BrowserContext} context
 */
export async function searchCtrlEnter(page, context) {
  let jumpLinks = await page.locator(".--jump").all();
  expect.soft(jumpLinks).toHaveLength(382);

  await page.keyboard.press("s");
  jumpLinks = await getVisibleJumps(page);
  expect.soft(jumpLinks).toHaveLength(188);

  await page.keyboard.press("i");
  jumpLinks = await getVisibleJumps(page);
  expect.soft(jumpLinks).toHaveLength(8);

  await page.keyboard.press("n");
  jumpLinks = await getVisibleJumps(page);
  expect.soft(jumpLinks).toHaveLength(4);

  await page.keyboard.press("Enter");
  jumpLinks = await getVisibleJumps(page);
  expect.soft(jumpLinks).toHaveLength(4);

  await page.keyboard.press("i");
  jumpLinks = await getVisibleJumps(page);
  expect.soft(jumpLinks).toHaveLength(2);

  // wait for a new tab to be created
  const [newPage] = await Promise.all([
    context.waitForEvent("page"),
    page.keyboard.press("b"),
  ]);

  await expect(page).toHaveURL(/.*link_aggregator\.html/);
  await expect(newPage).toHaveURL(/.*user\?id=single_cloud/);
}
