import { join } from "path";
import { URL } from "url";
import { expect, test } from "./fixture";
import { getVisibleJumps } from "./getVisibleJumps";

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

test("jump-to ctrl-click (K)", async ({ context, page }) => {
  const url = new URL(
    join(__dirname, "examples/link_aggregator.html"),
    "file://",
  );
  await page.goto(url.toString());

  // for some reason playwright doesn't use the existing tab
  // so there's two (one "new tab", the second being what we goto)
  const allPages = context.pages();
  expect(allPages).toHaveLength(2);

  await page.keyboard.down("K");
  let jumpLinks = await page.locator(".--jump").all();
  expect.soft(jumpLinks).toHaveLength(300);

  await page.keyboard.press("c");
  jumpLinks = await getVisibleJumps(page);
  expect.soft(jumpLinks).toHaveLength(12);

  await page.keyboard.press("a");

  // wait for a new tab to be created
  const [newPage] = await Promise.all([
    context.waitForEvent("page"),
    page.keyboard.press("b"),
  ]);

  await expect(page).toHaveURL(/.*link_aggregator\.html/);
  await expect(newPage).toHaveURL(/.*newest/);
});
