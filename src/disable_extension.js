/**
 * Adds a listener count in the DOM for reading from Playwright
 *
 * @returns {HTMLElement}
 */
function createHiddenCount() {
  const node = document.createElement("div");
  node.id = "_jumpToListenerCount";
  node.style.display = "none";
  node.setAttribute("data-count", "0");

  document.body.appendChild(node);

  return node;
}

/**
 * Updates the listener count in the DOM for reading from Playwright
 *
 * @returns {void}
 */
function updateListenerCountInDom() {
  const customWindow = /** @type {CustomWindow} */ (window);

  // if we've already run the script and added a listener, don't re-add it.
  if (!customWindow._jumpToListenerCount) {
    return;
  }

  const hiddenCount =
    document.getElementById("_jumpToListenerCount") || createHiddenCount();

  hiddenCount.setAttribute(
    "data-count",
    `${customWindow._jumpToListenerCount}`,
  );
}

function removeListener() {
  const customWindow = /** @type {CustomWindow} */ (window);

  if (customWindow._jumpToListener) {
    window.removeEventListener("keydown", customWindow._jumpToListener);

    if (customWindow._jumpToListenerCount) {
      customWindow._jumpToListenerCount--;
      updateListenerCountInDom();
    }
    customWindow._jumpToListener = undefined;
  }
}

removeListener();
