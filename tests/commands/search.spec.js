import { join } from "path";
import { URL } from "url";
import { expect, test } from "../fixture";
import {
  search,
  searchBackspace,
  searchCtrl,
  searchCtrlBackspace,
  searchCtrlEnter,
  searchEnter,
} from "./search";

test("search (/)", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });

  const url = new URL(
    join(__dirname, "../examples/link_aggregator.html"),
    "file://",
  );
  await page.goto(url.toString());

  await page.keyboard.down("/");
  await search(page);
});

test("search (/) => Backspace", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  const url = new URL(
    join(__dirname, "../examples/link_aggregator.html"),
    "file://",
  );
  await page.goto(url.toString());

  await page.keyboard.down("/");
  await searchBackspace(page);
});

test("search (/) => Enter", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  const url = new URL(
    join(__dirname, "../examples/link_aggregator.html"),
    "file://",
  );
  await page.goto(url.toString());

  await page.keyboard.down("/");
  await searchEnter(page);
});

test("search ctrl-click (?)", async ({ context, page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });

  const url = new URL(
    join(__dirname, "../examples/link_aggregator.html"),
    "file://",
  );
  await page.goto(url.toString());

  // for some reason playwright doesn't use the existing tab
  // so there's two (one "new tab", the second being what we goto)
  const allPages = context.pages();
  expect(allPages).toHaveLength(2);

  await page.keyboard.down("?");
  await searchCtrl(page, context);
});

test("search ctrl-click (?) => Backspace", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  const url = new URL(
    join(__dirname, "../examples/link_aggregator.html"),
    "file://",
  );
  await page.goto(url.toString());

  await page.keyboard.down("?");
  await searchCtrlBackspace(page);
});

test("search ctrl-click (?) => Enter", async ({ context, page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  const url = new URL(
    join(__dirname, "../examples/link_aggregator.html"),
    "file://",
  );
  await page.goto(url.toString());

  // for some reason playwright doesn't use the existing tab
  // so there's two (one "new tab", the second being what we goto)
  const allPages = context.pages();
  expect(allPages).toHaveLength(2);

  await page.keyboard.down("?");
  await searchCtrlEnter(page, context);
});
