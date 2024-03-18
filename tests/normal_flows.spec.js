import { join } from "path";
import { URL } from "url";
import { expect, test } from "./fixture";

/**
 * @typedef {import("playwright").Page} Page
 *
 * @typedef {import("playwright").Locator} Locator
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
