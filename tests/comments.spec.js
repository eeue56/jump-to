import { join } from "path";
import { URL } from "url";
import { expect, test } from "./fixture";
import { getVisibleJumps } from "./getVisibleJumps";

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
test("comments ctrl-click (H)", async ({ context, page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  const url = new URL(
    join(__dirname, "examples/link_aggregator.html"),
    "file://",
  );
  await page.goto(url.toString());

  // for some reason playwright doesn't use the existing tab
  // so there's two (one "new tab", the second being what we goto)
  const allPages = context.pages();
  expect(allPages).toHaveLength(2);

  await page.keyboard.down("H");
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
});
test("comments click-click (H) => Backspace", async ({ context, page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  const url = new URL(
    join(__dirname, "examples/link_aggregator.html"),
    "file://",
  );
  await page.goto(url.toString());

  // for some reason playwright doesn't use the existing tab
  // so there's two (one "new tab", the second being what we goto)
  const allPages = context.pages();
  expect(allPages).toHaveLength(2);

  await page.keyboard.down("H");
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

  // wait for a new tab to be created
  const [newPage] = await Promise.all([
    context.waitForEvent("page"),
    page.keyboard.press("b"),
  ]);

  await expect(page).toHaveURL(/.*link_aggregator\.html/);
  await expect(newPage).toHaveURL(/.*item\?id=39726156/);
});
