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

/**
 * @param {Page} page
 * @returns {Promise<Locator[]>}
 */
async function getVisibleJumps(page) {
  return await page.locator(`.--jump:not([style*="display: none;"])`).all();
}

test("search (/)", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });

  const url = new URL(
    join(__dirname, "examples/link_aggregator.html"),
    "file://",
  );
  await page.goto(url.toString());

  await page.keyboard.down("/");
  let jumpLinks = await page.locator(".--jump").all();
  expect.soft(jumpLinks).toHaveLength(300);

  await page.keyboard.press("s");
  jumpLinks = await getVisibleJumps(page);
  expect.soft(jumpLinks).toHaveLength(170);

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
});

test("search (/) => Backspace", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  const url = new URL(
    join(__dirname, "examples/link_aggregator.html"),
    "file://",
  );
  await page.goto(url.toString());

  await page.keyboard.down("/");
  let jumpLinks = await page.locator(".--jump").all();
  expect.soft(jumpLinks).toHaveLength(300);

  await page.keyboard.press("s");
  jumpLinks = await getVisibleJumps(page);
  expect.soft(jumpLinks).toHaveLength(170);

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
  expect.soft(jumpLinks).toHaveLength(170);

  await page.keyboard.press("Backspace");
  jumpLinks = await getVisibleJumps(page);
  expect.soft(jumpLinks).toHaveLength(300);

  await page.keyboard.press("Backspace");
  jumpLinks = await page.locator(".--jump").all();
  expect.soft(jumpLinks).toHaveLength(0);
});

test("search (/) => Enter", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  const url = new URL(
    join(__dirname, "examples/link_aggregator.html"),
    "file://",
  );
  await page.goto(url.toString());

  await page.keyboard.down("/");
  let jumpLinks = await page.locator(".--jump").all();
  expect.soft(jumpLinks).toHaveLength(300);

  await page.keyboard.press("s");
  jumpLinks = await getVisibleJumps(page);
  expect.soft(jumpLinks).toHaveLength(170);

  await page.keyboard.press("i");
  jumpLinks = await getVisibleJumps(page);
  expect.soft(jumpLinks).toHaveLength(8);

  await page.keyboard.press("n");
  jumpLinks = await getVisibleJumps(page);
  expect.soft(jumpLinks).toHaveLength(4);

  await page.keyboard.press("Enter");
  jumpLinks = await getVisibleJumps(page);
  expect.soft(jumpLinks).toHaveLength(4);

  await page.keyboard.press("b");
  jumpLinks = await getVisibleJumps(page);
  expect.soft(jumpLinks).toHaveLength(2);

  await page.keyboard.press("b");

  await expect(page).toHaveURL(/.*user\?id=single_cloud/);
});

test("comments (h)", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  const url = new URL(
    join(__dirname, "examples/link_aggregator.html"),
    "file://",
  );
  await page.goto(url.toString());

  await page.keyboard.down("h");
  let jumpLinks = await page.locator(".--jump").all();
  expect.soft(jumpLinks).toHaveLength(38);

  await page.keyboard.press("c");
  jumpLinks = await getVisibleJumps(page);
  expect.soft(jumpLinks).toHaveLength(2);

  await page.keyboard.press("a");
  await expect(page).toHaveURL(/.*item\?id=39726156/);
});

test("comments (h) => Backspace", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  const url = new URL(
    join(__dirname, "examples/link_aggregator.html"),
    "file://",
  );
  await page.goto(url.toString());

  await page.keyboard.down("h");
  let jumpLinks = await page.locator(".--jump").all();
  expect.soft(jumpLinks).toHaveLength(38);

  await page.keyboard.press("c");
  jumpLinks = await getVisibleJumps(page);
  expect.soft(jumpLinks).toHaveLength(2);

  await page.keyboard.press("Backspace");
  jumpLinks = await getVisibleJumps(page);
  expect.soft(jumpLinks).toHaveLength(38);

  await page.keyboard.press("c");
  jumpLinks = await getVisibleJumps(page);
  expect.soft(jumpLinks).toHaveLength(2);

  await page.keyboard.press("a");
  await expect(page).toHaveURL(/.*item\?id=39726156/);
});

test("jump-to (k)", async ({ page }) => {
  const url = new URL(
    join(__dirname, "examples/link_aggregator.html"),
    "file://",
  );
  await page.goto(url.toString());

  await page.keyboard.down("k");
  let jumpLinks = await page.locator(".--jump").all();
  expect.soft(jumpLinks).toHaveLength(300);

  await page.keyboard.press("c");
  jumpLinks = await getVisibleJumps(page);
  expect.soft(jumpLinks).toHaveLength(12);

  await page.keyboard.press("a");
  await expect(page).toHaveURL(/.*newest/);
});

test("ctrl-h still works", async ({ page }) => {
  const url = new URL(
    join(__dirname, "examples/link_aggregator.html"),
    "file://",
  );
  await page.goto(url.toString());

  await page.keyboard.press("Control+h");

  let jumpLinks = await page.locator(".--jump").all();
  expect.soft(jumpLinks).toHaveLength(0);
});

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
    join(__dirname, "examples/links_on_edges.html"),
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
