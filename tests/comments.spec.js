import { join } from "path";
import { URL } from "url";
import {
  comments,
  commentsBackspace,
  commentsCtrl,
  commentsCtrlBackspace,
} from "./comments";
import { expect, test } from "./fixture";

test("comments (h)", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  const url = new URL(
    join(__dirname, "examples/link_aggregator.html"),
    "file://",
  );
  await page.goto(url.toString());

  await page.keyboard.down("h");

  await comments(page);
});

test("comments (h) => Backspace", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  const url = new URL(
    join(__dirname, "examples/link_aggregator.html"),
    "file://",
  );
  await page.goto(url.toString());

  await page.keyboard.down("h");

  await commentsBackspace(page);
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

  await commentsCtrl(page, context);
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

  await commentsCtrlBackspace(page, context);
});
