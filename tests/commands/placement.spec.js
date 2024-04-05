import { join } from "path";
import { URL } from "url";
import { expect, test } from "../fixture";

/**
 * @typedef {import("playwright").Page} Page
 *
 * @typedef {import("playwright").Locator} Locator
 *
 * @typedef {{ x: number; y: number; width: number; height: number }} Box
 */

/**
 * @param {Page} page
 * @param {Box} box
 * @returns {boolean}
 */
function isWithinViewport(page, box) {
  const viewport = page.viewportSize();

  if (viewport === null) {
    return false;
  }

  const isWithinX = box.x > -1 && box.x + box.width < viewport.width;
  const isWithinY = box.y > -1 && box.y + box.height < viewport.height;

  return isWithinX && isWithinY;
}

test("labelled are within viewport", async ({ page }) => {
  const url = new URL(
    join(__dirname, "../examples/links_on_edges.html"),
    "file://",
  );
  await page.goto(url.toString());

  await page.keyboard.press("k");
  let jumpLinks = await page.locator(".--jump").all();
  expect.soft(jumpLinks).toHaveLength(4);

  let leftLink = await page.locator(".--jump-aa.--jump-link").all();
  expect.soft(leftLink).toHaveLength(1);

  const leftBox = await leftLink[0].boundingBox();

  expect.soft(leftBox).not.toBeNull();
  if (leftBox !== null) {
    expect.soft(isWithinViewport(page, leftBox)).toEqual(true);
  }

  let rightLink = await page.locator(".--jump-ba.--jump-link").all();
  expect.soft(rightLink).toHaveLength(1);

  const rightBox = await leftLink[0].boundingBox();

  expect.soft(rightBox).not.toBeNull();
  if (rightBox !== null) {
    expect.soft(isWithinViewport(page, rightBox)).toEqual(true);
  }
});
