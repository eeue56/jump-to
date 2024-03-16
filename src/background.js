chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setBadgeText({
    text: "OFF",
  });
});

chrome.action.onClicked.addListener(async (tab) => {
  // Retrieve the action badge to check if the extension is 'ON' or 'OFF'
  const prevState = await chrome.action.getBadgeText({ tabId: tab.id });
  const nextState = prevState === "ON" ? "OFF" : "ON";
  await chrome.action.setBadgeText({
    tabId: tab.id,
    text: nextState,
  });

  // no active tab
  if (!tab.id) {
    console.log("No tab id");
    return;
  }

  if (nextState === "ON") {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["src/main.js"],
    });
  } else {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["src/disable_extension.js"],
    });
  }
});
