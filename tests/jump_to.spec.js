import { join } from "path";
import { URL } from "url";
import { expect, test } from "./fixture";
import { jumpTo, jumpToCtrl } from "./jumpTo";

test("jump-to (k)", async ({ page }) => {
  const url = new URL(
    join(__dirname, "examples/link_aggregator.html"),
    "file://",
  );
  await page.goto(url.toString());

  await page.keyboard.down("k");

  await jumpTo(page);
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

  await jumpToCtrl(page, context);
});
