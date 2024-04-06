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

chrome.runtime.onMessage.addListener(
  async (
    /** @type {MessageToBackground} */ request,
    sender,
    /** @type {(response: MessageToContentScript | null) => void} */ send,
  ) => {
    /** @type {MessageToContentScript | null} */
    const response =
      (await (async () => {
        switch (request.kind) {
          case "Mute": {
            const tab = sender.tab;

            if (!tab) return;
            if (!tab.mutedInfo) return;

            await chrome.tabs.update({ muted: !tab.mutedInfo.muted });
            return null;
          }
          case "MuteOthers": {
            const activeTab = sender.tab;

            if (!activeTab || !activeTab.id) return;

            for (const tab of await chrome.tabs.query({})) {
              if (tab.id && tab.id !== activeTab.id && tab.audible) {
                await chrome.tabs.update(tab.id, {
                  muted: !tab.mutedInfo?.muted,
                });
              }
            }

            return null;
          }
          case "IsAudioPlaying": {
            const tab = sender.tab;
            if (!tab) {
              return {
                kind: "AudioPlayingState",
                isPlaying: false,
                isMuted: false,
              };
            }
            return {
              kind: "AudioPlayingState",
              isPlaying: tab.audible || false,
              isMuted: tab.mutedInfo?.muted || false,
            };
          }
        }
      })()) || null;

    send(response);
  },
);
