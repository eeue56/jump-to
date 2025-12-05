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

chrome.tabs.onActivated.addListener(async (activeInfo) => {});

chrome.action.onClicked.addListener(async (tab) => {
  await runOnTab(tab.id);
});

chrome.tabs.onCreated.addListener(async (tab) => {
  if (await isSpikeActive()) {
    if (!tab.url || !tab.title || !tab.id) {
      return;
    }
    await addOrUpdateSpikeEntry({
      kind: "SpikeEntry",
      tab: tab.id,
      url: tab.url,
      title: tab.title,
    });
  }
});

chrome.tabs.onUpdated.addListener(async (id, change, tab) => {
  if (await isSpikeActive()) {
    if (!tab.url || !tab.title) {
      return;
    }
    await addOrUpdateSpikeEntry({
      kind: "SpikeEntry",
      tab: id,
      url: tab.url,
      title: tab.title,
    });
  }
});

/** @returns {Promise<boolean>} */
async function isSpikeActive() {
  /** @type {SpikeEntry[]} */
  const currentSpike = (await chrome.storage.local.get("currentSpike"))
    .currentSpike;

  if (!currentSpike) {
    return false;
  }
  return true;
}

/** @param {SpikeEntry} entry */
async function addOrUpdateSpikeEntry(entry) {
  /** @type {SpikeEntry[]} */
  const currentSpike = (await chrome.storage.local.get("currentSpike"))
    .currentSpike;

  const maybeStoredEntry = currentSpike.findIndex(
    (storedEntry) =>
      storedEntry.tab === entry.tab && storedEntry.url === entry.url,
  );

  if (maybeStoredEntry === -1) {
    currentSpike.push(entry);
  } else {
    currentSpike[maybeStoredEntry] = entry;
  }
  console.log(currentSpike);
  await chrome.storage.local.set({
    currentSpike: currentSpike,
  });
}

chrome.runtime.onMessage.addListener(
  (
    /** @type {MessageToBackground} */ request,
    sender,
    /** @type {(response: MessageToContentScript | null) => void} */ send,
  ) => {
    /** @type {() => Promise<null>} */
    async function fn() {
      switch (request.kind) {
        case "Mute": {
          const tab = sender.tab;

          if (!tab) return null;
          if (!tab.mutedInfo) return null;

          await chrome.tabs.update({ muted: !tab.mutedInfo.muted });
          return null;
        }
        case "MuteOthers": {
          const activeTab = sender.tab;

          if (!activeTab || !activeTab.id) return null;

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
            send({
              kind: "AudioPlayingState",
              isPlaying: false,
              isMuted: false,
            });
            return null;
          }
          send({
            kind: "AudioPlayingState",
            isPlaying: tab.audible || false,
            isMuted: tab.mutedInfo?.muted || false,
          });
          return null;
        }
        case "StartSpike": {
          await chrome.storage.local.set({
            currentSpike: [],
          });
          return null;
        }
        case "AddSpikeEntry": {
          addOrUpdateSpikeEntry(request.entry);
          return null;
        }
        case "EndSpike": {
          /** @type {SpikeEntry[]} */
          let currentSpike = (await chrome.storage.local.get("currentSpike"))
            .currentSpike;
          await chrome.storage.local.remove("currentSpike");

          if (!currentSpike) {
            currentSpike = [];
          }

          send({
            kind: "CurrentSpike",
            entries: currentSpike,
          });
          return null;
        }
      }
    }

    fn();

    return true;
  },
);
