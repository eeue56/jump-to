import { join } from "path";
import { URL } from "url";
import { expect, test } from "./fixture";
import { getVisibleJumps } from "./getVisibleJumps";

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

test("search ctrl-click (?)", async ({ context, page }) => {
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

  await page.keyboard.down("?");
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

  // wait for a new tab to be created
  const [newPage] = await Promise.all([
    context.waitForEvent("page"),
    page.keyboard.press("l"),
  ]);

  await expect(page).toHaveURL(/.*link_aggregator\.html/);
  await expect(newPage).toHaveURL(/.*user\?id=single_cloud/);
});

test("search ctrl-click (?) => Backspace", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  const url = new URL(
    join(__dirname, "examples/link_aggregator.html"),
    "file://",
  );
  await page.goto(url.toString());

  await page.keyboard.down("?");
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

test("search ctrl-click (?) => Enter", async ({ context, page }) => {
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

  await page.keyboard.down("?");
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

  // wait for a new tab to be created
  const [newPage] = await Promise.all([
    context.waitForEvent("page"),
    page.keyboard.press("b"),
  ]);

  await expect(page).toHaveURL(/.*link_aggregator\.html/);
  await expect(newPage).toHaveURL(/.*user\?id=single_cloud/);
});
