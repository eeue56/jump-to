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

export async function getVisibleJumps(page) {
  return await page.locator(`.--jump:not([style*="display: none;"])`).all();
}
