chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setBadgeText({
    text: "ON",
  });
});

/**
 * @param {number | undefined} tabId
 * @returns Void
 */
async function runOnTab(tabId) {
  // no active tab
  if (!tabId) {
    console.log("No tab id");
    return;
  }

  // ignore chrome pages
  if ((await chrome.tabs.get(tabId)).url?.startsWith("chrome://")) {
    return;
  }

  // Retrieve the action badge to check if the extension is 'ON' or 'OFF'
  const prevState = await chrome.action.getBadgeText({ tabId });
  const nextState = prevState === "ON" ? "OFF" : "ON";
  await chrome.action.setBadgeText({
    tabId,
    text: nextState,
  });

  if (nextState === "ON") {
    await chrome.scripting.executeScript({
      target: { tabId },
      files: ["src/main.js"],
    });
  } else {
    await chrome.scripting.executeScript({
      target: { tabId },
      files: ["src/disable_extension.js"],
    });
  }
}

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  await runOnTab(activeInfo.tabId);
});

chrome.action.onClicked.addListener(async (tab) => {
  await runOnTab(tab.id);
});
