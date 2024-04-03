import { join } from "path";
import { URL } from "url";
import { expect, test } from "../fixture";

test("palette (p)", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  const url = new URL(
    join(__dirname, "../examples/link_aggregator.html"),
    "file://",
  );
  await page.goto(url.toString());

  await page.keyboard.down("p");
  const palette = page.locator(".command-palette-overlay").first();
  await expect(palette).toBeVisible();

  const paletteInput = page.locator(".command-palette-input").first();
  await expect(paletteInput).toBeVisible();
  await expect(paletteInput).toBeFocused();

  const options = await page.locator(".command-palette-item:visible").all();
  await expect(options).toHaveLength(7);

  await expect(options[0]).toHaveClass(/selected/);

  await page.keyboard.down("Escape");
  await expect(palette).not.toBeVisible();
});

test("palette (p) => filter", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  const url = new URL(
    join(__dirname, "../examples/link_aggregator.html"),
    "file://",
  );
  await page.goto(url.toString());

  await page.keyboard.down("p");

  const paletteInput = page.locator(".command-palette-input").first();
  await expect(paletteInput).toBeVisible();
  await expect(paletteInput).toBeFocused();

  let options = await page.locator(".command-palette-item:visible").all();
  await expect(options).toHaveLength(7);
  expect(options[0]).toHaveClass(/selected/);

  await page.keyboard.down("k");

  options = await page.locator(".command-palette-item:visible").all();
  await expect(options[0]).toHaveClass(/selected/);
  await expect(options).toHaveLength(1);

  const palette = page.locator(".command-palette-overlay").first();
  await page.keyboard.down("Escape");
  await expect(palette).not.toBeVisible();
});

test("palette (p) => up and down", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  const url = new URL(
    join(__dirname, "../examples/link_aggregator.html"),
    "file://",
  );
  await page.goto(url.toString());

  await page.keyboard.down("p");

  const paletteInput = page.locator(".command-palette-input").first();
  await expect(paletteInput).toBeVisible();
  await expect(paletteInput).toBeFocused();

  let options = await page.locator(".command-palette-item:visible").all();

  /** @param {number} index */
  async function noOtherOptionsHaveSelected(index) {
    await Promise.all(
      options.map((option, i) =>
        i === index
          ? new Promise((resolve) => resolve(null))
          : expect(option).not.toHaveClass(/selected/),
      ),
    );
  }

  await expect(options).toHaveLength(7);

  await expect(options[0]).toHaveClass(/selected/);
  await noOtherOptionsHaveSelected(0);

  await page.keyboard.down("ArrowDown");
  options = await page.locator(".command-palette-item:visible").all();
  await expect(options).toHaveLength(7);
  await expect(options[1]).toHaveClass(/selected/);
  await noOtherOptionsHaveSelected(1);

  await page.keyboard.down("ArrowUp");
  options = await page.locator(".command-palette-item:visible").all();
  await expect(options).toHaveLength(7);
  await expect(options[0]).toHaveClass(/selected/);
  await noOtherOptionsHaveSelected(0);

  // go down all the way
  for (let x = 0; x < options.length - 1; x++) {
    await page.keyboard.down("ArrowDown");

    await expect(options[x + 1]).toHaveClass(/selected/);
    await noOtherOptionsHaveSelected(x + 1);
  }

  // try to go past the bottom
  await page.keyboard.down("ArrowDown");
  await expect(options[options.length - 1]).toHaveClass(/selected/);
  await noOtherOptionsHaveSelected(options.length - 1);

  // go up all the way
  for (let x = options.length - 1; x > 0; x--) {
    await page.keyboard.down("ArrowUp");

    await expect(options[x - 1]).toHaveClass(/selected/);
    await noOtherOptionsHaveSelected(x - 1);
  }

  // try to go past the top
  await page.keyboard.down("ArrowUp");
  await expect(options[0]).toHaveClass(/selected/);
  await noOtherOptionsHaveSelected(0);

  const palette = page.locator(".command-palette-overlay").first();
  await page.keyboard.down("Escape");
  await expect(palette).not.toBeVisible();
});
