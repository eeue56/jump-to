import { join } from "path";
import { URL } from "url";
import { expect, test } from "./fixture";

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
