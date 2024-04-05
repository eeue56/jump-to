/**
 * @typedef {{ [key: string]: HTMLElement }} LinkJumpMap
 *
 * @typedef {"p" | "k" | "K" | "h" | "H" | "/" | "?"} KnownShortcut
 *
 * @typedef {Object} Command
 * @property {KnownShortcut} shortcut - The shortcut to press to enable the
 *   command
 * @property {string} helpText - The help text to show to a user when they hover
 *   over it
 * @property {() => void} run - The callback to trigger when the command is run
 */

/** @typedef {Window & CustomWindowObject} CustomWindow */

/**
 * @param {KnownShortcut} shortcut
 * @param {string} helpText
 * @param {() => void} run
 * @returns {Command}
 */
function Command(shortcut, helpText, run) {
  return {
    shortcut,
    helpText,
    run,
  };
}

// ----------------
// General DOM related helpers not specific to this project
// ----------------

/**
 * Check if the element is visible to the user
 *
 * @param {HTMLElement} element An element in the page
 * @returns {boolean}
 */
function elementIsVisibleInViewport(element) {
  const computed = window.getComputedStyle(element);

  if (
    !element.checkVisibility() ||
    computed.visibility === "hidden" ||
    computed.display === "none"
  ) {
    return false;
  }

  const rect = element.getBoundingClientRect();

  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/** @returns {boolean} */
function isInInput() {
  /** @type {Element | null} */
  const element = document.activeElement;

  if (element === null) {
    return false;
  }

  const tagName = element.tagName.toLowerCase();

  const htmlElement = /** @type {HTMLElement} */ (element);
  if (htmlElement.isContentEditable) {
    return true;
  }

  return tagName == "textarea" || tagName == "input";
}

/**
 * Checks if the element is a link and visible
 *
 * @param {HTMLElement} element
 * @returns {boolean}
 */
function isVisibleLink(element) {
  const style = getComputedStyle(element);

  if (
    !(
      element.tagName === "A" ||
      element.tagName === "BUTTON" ||
      style.cursor === "pointer"
    )
  ) {
    return false;
  }

  return elementIsVisibleInViewport(element);
}

/**
 * Gets a list of all the visible links in the DOM
 *
 * @returns {HTMLElement[]}
 */
function allLinksInViewport() {
  /** @type {NodeListOf<HTMLElement>} */
  const allElements = document.querySelectorAll("body *");
  return [...allElements].filter(isVisibleLink);
}

/**
 * Gets a list of comments in the DOM, if the page is a link aggregator
 *
 * @returns {HTMLElement[]}
 */
function allCommentLinksInViewport() {
  /** @type {NodeListOf<HTMLElement>} */
  return allLinksInViewport().filter((x) => x.innerText.includes("comment"));
}

// ----------------
// DOM helpers for creating the command palette
// ----------------

/**
 * Add the command palette to the page
 *
 * @param {Command[]} commands
 */
function addCommandPalette(commands) {
  const overlay = document.createElement("div");
  overlay.className = "command-palette-overlay";

  const palette = document.createElement("div");
  palette.className = "command-palette";

  const heading = document.createElement("div");
  heading.className = "command-palette-heading";
  heading.innerText = "Palette";

  const input = document.createElement("input");
  input.className = "command-palette-input";

  const list = document.createElement("div");
  list.className = "command-palette-list";

  for (const command of commands) {
    const item = document.createElement("div");
    item.className = "command-palette-item";
    item.innerText = `${command.shortcut}: ${command.helpText}`;
    item.setAttribute("data-shortcut", command.shortcut);

    list.appendChild(item);
  }

  palette.appendChild(heading);
  palette.appendChild(input);
  palette.appendChild(list);
  overlay.appendChild(palette);

  document.body.appendChild(overlay);

  /** @param {string} shortcut */
  function setSelectedItem(shortcut) {
    console.log("setting shortcut to", shortcut);
    /** @type {HTMLElement | null} */
    const item = list.querySelector(`[data-shortcut="${shortcut}"]`);
    item?.classList.add("selected");
    currentSelectedShortcut = shortcut;
  }

  function unselectItems() {
    console.log("unsetting all");
    const items = list.querySelectorAll(`.command-palette-item.selected`);
    items.forEach((item) => item.classList.remove("selected"));
  }

  /** @type {string[]} */
  let searchString = [];

  /** @type {string | null} */
  let currentSelectedShortcut = commands[0].shortcut;

  setSelectedItem(currentSelectedShortcut);

  /**
   * @typedef {Object} DomCommands
   * @property {Command[]} visible
   * @property {Command[]} invisible
   */
  /**
   * Get commands from the DOM which are visible or invisible if they don't
   * match the query
   *
   * @param {string} query
   * @returns {DomCommands}
   */
  function getDomCommands(query) {
    /** @type {Command[]} */
    const visible = [];
    /** @type {Command[]} */
    const invisible = [];

    for (const command of commands) {
      /** @type {HTMLElement | null} */
      const item = list.querySelector(`[data-shortcut="${command.shortcut}"]`);
      if (item === null) continue;

      const matchesQuery = command.shortcut.includes(query);

      if (matchesQuery) {
        visible.push(command);
      } else {
        invisible.push(command);
      }
    }
    return {
      visible,
      invisible,
    };
  }

  input.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      document.body.removeChild(overlay);
      return;
    }

    if (event.ctrlKey || event.metaKey || event.key === "Shift") {
      return;
    }

    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      return;
    }

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const domCommandsPriorToQueryChange = getDomCommands(
        searchString.join(""),
      );
      const selected = list.querySelector(`.command-palette-item.selected`);
      const selectedShortcut = selected?.getAttribute("data-shortcut");

      const currentIndex = domCommandsPriorToQueryChange.visible.findIndex(
        (command) => command.shortcut === selectedShortcut,
      );

      const newIndex =
        event.key === "ArrowDown" ? currentIndex + 1 : currentIndex - 1;
      if (
        newIndex < 0 ||
        domCommandsPriorToQueryChange.visible.length === newIndex
      ) {
        return;
      }

      unselectItems();
      setSelectedItem(domCommandsPriorToQueryChange.visible[newIndex].shortcut);

      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      event.stopImmediatePropagation();
      document.body.removeChild(overlay);
      commands
        .filter((command) => command.shortcut === currentSelectedShortcut)[0]
        .run();
      return;
    }

    if (event.key === "Backspace") {
      if (searchString.length === 0) {
        document.body.removeChild(overlay);
        return;
      } else {
        searchString.pop();
      }
    } else {
      searchString.push(event.key);
    }

    const query = searchString.join("");

    const domCommands = getDomCommands(query);

    // get the currently selected command, if it's visible
    const currentlySelectedCommands = domCommands.visible.filter(
      (command) => command.shortcut === currentSelectedShortcut,
    );

    for (const command of domCommands.visible) {
      /** @type {HTMLElement | null} */
      const item = list.querySelector(`[data-shortcut="${command.shortcut}"]`);
      if (item === null) continue;
      item.style.display = "block";
    }

    for (const command of domCommands.invisible) {
      /** @type {HTMLElement | null} */
      const item = list.querySelector(`[data-shortcut="${command.shortcut}"]`);
      if (item === null) continue;
      item.style.display = "none";
    }

    if (currentlySelectedCommands.length === 0) {
      // the current shortcut is not visible
      currentSelectedShortcut = null;
      unselectItems();
    }

    if (
      currentlySelectedCommands.length === 0 &&
      domCommands.visible.length > 0
    ) {
      // there are other available commands
      currentSelectedShortcut = domCommands.visible[0].shortcut;
      setSelectedItem(currentSelectedShortcut);
    }
  });

  input.focus();
}

// ----------------
// DOM helpers for adding, removing, or modifying link jumps
// ----------------

/**
 * Add a link jump UI element to the page
 *
 * @param {HTMLElement} link
 * @param {string} letter
 */
function addLinkJump(link, letter) {
  const rect = link.getBoundingClientRect();
  const height = rect.bottom - rect.top;

  const offsetX = 20;
  const wouldBeOffTheLeftScreen = rect.x - offsetX < 0;

  const jump = document.createElement("div");

  const str = document.createElement("strong");
  str.innerText = letter;
  str.style.color = "black";
  str.style.backgroundColor = "#ffff6e";
  str.style.paddingLeft = "3px";
  str.style.paddingRight = "3px";
  jump.appendChild(str);

  jump.style.position = "absolute";
  jump.style.left = wouldBeOffTheLeftScreen
    ? `${rect.right + window.scrollX}px`
    : `${rect.left + window.scrollX - offsetX}px`;
  jump.style.top = `${rect.bottom + window.scrollY}px`;
  jump.style.width = "50px";
  jump.style.height = "30px";
  jump.style.fontSize = "20px";
  jump.style.zIndex = link.style.zIndex + 1;

  const border = document.createElement("div");
  border.style.border = "3px solid black";
  border.style.position = "absolute";
  border.style.padding = "2px";
  border.style.left = `${rect.left + window.scrollX}px`;
  border.style.top = `${rect.top + window.scrollY}px`;
  border.style.width = `${rect.right - rect.left}px`;
  border.style.height = `${height}px`;
  border.style.zIndex = link.style.zIndex + 1;

  jump.classList.add("--jump");
  jump.classList.add(`--jump-${letter}`);
  jump.classList.add("--jump-link");
  border.classList.add("--jump");
  border.classList.add(`--jump-${letter}`);

  document.body.appendChild(jump);
  document.body.appendChild(border);
}

/** Remove all link jumps from the DOM */
function removeLinkJumps() {
  [...document.querySelectorAll(".--jump")].map((x) => x.remove());
}

/**
 * Hide all link jumps with id `letter` from the DOM
 *
 * @param {string} letter The letter id
 */
function hideLinkJumpWithLetter(letter) {
  /** @type {NodeListOf<HTMLElement>} */
  const elementsToHide = document.querySelectorAll(`.--jump-${letter}`);
  [...elementsToHide].map((x) => (x.style.display = "none"));
}

/**
 * Hide all link jumps not starting with `char` from the DOM
 *
 * @param {string} char The char which has been pressed so far
 */
function hideLinkJumpsNotStartingWith(char) {
  /** @type {NodeListOf<HTMLElement>} */
  const elementsToHide = document.querySelectorAll(
    `.--jump:not([class*="--jump-${char}"])`,
  );
  [...elementsToHide].map((x) => (x.style.display = "none"));
}

/**
 * @param {string} text
 * @returns {string}
 */
function simplifyText(text) {
  return text.replace("–", "-");
}

/**
 * Hide all link jumps not containing `search` from the DOM
 *
 * @param {LinkJumpMap} letters
 * @param {string} search The search string to find
 */
function hideLinkJumpsNotContaining(letters, search) {
  for (const letter of Object.keys(letters)) {
    const link = letters[letter];

    if (!simplifyText(link.innerText.toLowerCase()).includes(search)) {
      hideLinkJumpWithLetter(letter);
    }
  }
}

/** Unhide all link jumps */
function unhideAllLinkJumps() {
  /** @type {NodeListOf<HTMLElement>} */
  const allElements = document.querySelectorAll(`.--jump`);
  [...allElements].map((x) => (x.style.display = "block"));
}

/**
 * Unhide a specific link jumps
 *
 * @param {string} letter
 */
function unhideLinkJumpWithLetter(letter) {
  /** @type {NodeListOf<HTMLElement>} */
  const allElements = document.querySelectorAll(`.--jump-${letter}`);
  [...allElements].map((x) => (x.style.display = "block"));
}

/**
 * Make sure visiblty of link jumps matches what it should
 *
 * @param {LinkJumpMap} letters
 * @param {string} search The search string that is active
 */
function syncHiddenStateOfLinkJumpsBySearch(letters, search) {
  for (const letter of Object.keys(letters)) {
    const link = letters[letter];

    if (link.innerText.toLowerCase().includes(search)) {
      unhideLinkJumpWithLetter(letter);
    } else {
      hideLinkJumpWithLetter(letter);
    }
  }
}

/** Remove a specific link jump */
/** @param {string} letter */
function removeLinkJump(letter) {
  [...document.querySelectorAll(`.--jump-${letter}`)].map((x) => x.remove());
}

/**
 * Resize a link jump, by first removing it, then readding it
 *
 * @param {HTMLElement} link
 * @param {string} letter
 */
function resizeLinkJump(link, letter) {
  removeLinkJump(letter);
  addLinkJump(link, letter);
}

/**
 * Get the visible link jump elements
 *
 * @returns {HTMLElement[]}
 */
function getVisibleLinkJumps() {
  /** @type {NodeListOf<HTMLElement>} */
  const elements = document.querySelectorAll(`.--jump-link`);

  return [...elements].filter((element) => element.style.display !== "none");
}

/**
 * @param {HTMLElement} link
 * @returns {string}
 */
function getLinkJumpLetter(link) {
  return link.className.split(" ")[1].split("--jump-")[1];
}

// ----------------
// Helpers for doing user-input type stuff
// ----------------

/**
 * Create a letter map from visible elements and add the link jumps to the DOM
 *
 * @param {HTMLElement[]} links
 * @returns {LinkJumpMap}
 */
function makeLetterMap(links) {
  /** @type {LinkJumpMap} */
  const letters = {};

  // start at aa, then to ba..za, then move to ab, bb..zb and so on
  let letter = 97;
  let secondLetter = 97;

  for (const link of links) {
    const char = String.fromCharCode(letter, secondLetter);
    letters[char] = link;
    addLinkJump(link, char);

    letter++;
    if (97 + 26 === letter) {
      letter = 97;
      secondLetter++;
    }

    // we can only handle aa..zz
    if (97 + 26 === secondLetter) {
      break;
    }
  }

  return letters;
}

/**
 * Create a listener that updates link jumps visually as the user scrolls
 *
 * @param {LinkJumpMap} letters
 * @returns {() => void}
 */
function makeScrollVisualUpdater(letters) {
  return () => {
    // because the viewport might've been moved, reposition the
    // link jumps
    for (const char of Object.keys(letters)) {
      const link = letters[char];
      resizeLinkJump(link, char);
    }
  };
}

/** @typedef {"same-tab" | "new-tab"} OpenLinkMode */

/**
 * Click on a link, based on openMode.
 *
 * @param {HTMLElement} link
 * @param {OpenLinkMode} openMode
 * @returns {null} Just return null to enforce switch coverage
 */
function clickOnLink(link, openMode) {
  switch (openMode) {
    case "new-tab": {
      link.dispatchEvent(new MouseEvent("click", { ctrlKey: true }));
      return null;
    }
    case "same-tab": {
      link.click();
      return null;
    }
  }
}

// ----------------
// Our functions that get called from the root listener
// ----------------

/**
 * Runs the regular flow with a given link jump map
 *
 * @param {LinkJumpMap} letters
 * @param {OpenLinkMode} openMode
 */
function regularFlow(letters, openMode) {
  /** @type {string[]} */
  const lettersPressedSoFar = [];
  const scrollListener = makeScrollVisualUpdater(letters);

  /** @type {(event: KeyboardEvent) => boolean | void} */
  const keydownListener = (event) => {
    if (event.ctrlKey) {
      // because the viewport might've been resized, resize the
      // link jumps
      setTimeout(() => {
        for (const char of Object.keys(letters)) {
          const link = letters[char];
          resizeLinkJump(link, char);
        }
      }, 50);

      return true;
    }

    event.preventDefault();

    /** Used to turn the page back to normal, before the extension was activated */
    function reset() {
      window.removeEventListener("keydown", keydownListener);
      window.removeEventListener("scroll", scrollListener);
      removeLinkJumps();
    }

    if (event.key === "Escape") {
      console.log(`Removing listener, got "Esc"`);
      reset();
    }

    if (event.key === "Backspace") {
      if (lettersPressedSoFar.length === 0) {
        reset();
        return;
      }
      unhideAllLinkJumps();
      lettersPressedSoFar.pop();
      return;
    }

    // ignore modifier keys
    if (!String.fromCharCode(event.keyCode).match(/(\w|\s)/g)) {
      return;
    }

    let key = String.fromCharCode(event.keyCode);

    if (event.shiftKey) {
      key = key.toUpperCase();
    } else {
      key = key.toLowerCase();
    }

    lettersPressedSoFar.push(key);
    const currentString = lettersPressedSoFar.join("");

    // don't trigger til we get both
    if (lettersPressedSoFar.length < 2) {
      // but ensure to remove non-relevant shortcuts
      hideLinkJumpsNotStartingWith(currentString);
      return;
    }

    if (letters[currentString]) {
      console.log(`Clicking ${currentString}...`);
      clickOnLink(letters[currentString], openMode);
    } else {
      console.log(`Removing listener, got "${key}"`);
    }
    reset();
  };

  window.addEventListener("scroll", scrollListener);
  window.addEventListener("keydown", keydownListener);
}

/**
 * - Gets all visibile links in the page
 * - Adds a listener for a shortcut for each link
 * - Add a visual indicator for each shortcut for each link (two letters)
 * - Removes irrelevant labels when other chars are pressed
 * - Removes listener when user hits Esc
 *
 * @param {OpenLinkMode} openMode
 */
function triggerRegularFlow(openMode) {
  const links = allLinksInViewport();
  const letters = makeLetterMap(links);
  regularFlow(letters, openMode);
}

/** @param {OpenLinkMode} openMode */
function triggerLinkAggregatorFlow(openMode) {
  const links = allCommentLinksInViewport();
  const letters = makeLetterMap(links);
  regularFlow(letters, openMode);
}

/**
 * - Gets all visibile links in the page
 * - Adds a listener for a shortcut for each link
 * - Add a visual indicator for each shortcut for each link (two letters)
 * - Allows the user to type a search string to search the innerText of elements
 *   for
 * - Removes irrelevant labels when other chars are pressed
 * - Removes listener when user hits Esc
 *
 * @param {OpenLinkMode} openMode
 */
function triggerSearchByInnerText(openMode) {
  const links = allLinksInViewport();
  const letters = makeLetterMap(links);

  /** @type {string[]} */
  const searchString = [];

  const scrollListener = makeScrollVisualUpdater(letters);

  /** @type {(event: KeyboardEvent) => boolean | void} */
  const keydownListener = (event) => {
    if (event.ctrlKey) {
      // because the viewport might've been resized, resize the
      // link jumps
      setTimeout(() => {
        for (const char of Object.keys(letters)) {
          const link = letters[char];
          resizeLinkJump(link, char);
        }
      }, 50);

      return true;
    }

    event.preventDefault();

    /** Used to turn the page back to normal, before the extension was activated */
    function reset() {
      window.removeEventListener("keydown", keydownListener);
      window.removeEventListener("scroll", scrollListener);
      removeLinkJumps();
    }

    if (event.key === "Escape") {
      console.log(`Removing listener, got "Esc"`);
      reset();
    }

    if (event.key === "Backspace") {
      if (searchString.length === 0) {
        reset();
        return;
      }
      searchString.pop();
      const currentString = searchString.join("");
      syncHiddenStateOfLinkJumpsBySearch(letters, currentString);
      return;
    }

    // switch over to regular link-selection mode
    if (event.key === "Enter") {
      window.removeEventListener("keydown", keydownListener);
      window.removeEventListener("scroll", scrollListener);
      regularFlow(letters, openMode);
      return;
    }

    // ignore modifier keys
    if (event.ctrlKey || event.metaKey || event.shiftKey) {
      return;
    }

    let key = event.key.toLowerCase();

    searchString.push(key);
    const currentString = searchString.join("");

    // ensure to remove non-relevant shortcuts
    hideLinkJumpsNotContaining(letters, currentString);

    const visibileLinkJumps = getVisibleLinkJumps();

    if (visibileLinkJumps.length === 0) {
      console.log(
        `Couldn't find anything matching ${currentString}, exiting...`,
      );
      reset();
    } else if (visibileLinkJumps.length === 1) {
      // we only have 1 left, so we know it's what we want
      console.log(`Clicking ${currentString}...`);
      const letter = getLinkJumpLetter(visibileLinkJumps[0]);
      clickOnLink(letters[letter], openMode);
      reset();
    }
  };

  window.addEventListener("scroll", scrollListener);
  window.addEventListener("keydown", keydownListener);
}

// ----------------
// Extension-specific code
// ----------------

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

/** @returns {Command[]} */
function getCommands() {
  /** @type {Command[]} */
  const commands = [
    Command("k", "Create typeable shortcuts that will click on a link", () =>
      triggerRegularFlow("same-tab"),
    ),
    Command("/", "Create search shortcuts that will click on a link", () =>
      triggerSearchByInnerText("same-tab"),
    ),
    Command(
      "h",
      "Create typeable shortcuts for comments that will click on a link",
      () => triggerLinkAggregatorFlow("same-tab"),
    ),
    Command(
      "K",
      "Create typeable shortcuts that will ctrl-click on a link",
      () => triggerRegularFlow("new-tab"),
    ),
    Command("?", "Create search shortcuts that will ctrl-click on a link", () =>
      triggerSearchByInnerText("new-tab"),
    ),
    Command(
      "H",
      "Create typeable shortcuts for comments that will ctrl-click on a link",
      () => triggerLinkAggregatorFlow("new-tab"),
    ),
    Command("p", "Open the command palette", () => addCommandPalette(commands)),
  ];
  return commands;
}

/**
 * Adds a listener that responds to:
 *
 * - `k`, to click links by a random id generated
 * - `h`, to click links to comments (e.g on HN/Reddit/Lobsters) by a random id
 *   generated
 * - `/`, to allow users to search the text of links for a certain string then
 *   click it
 * - `K`, to ctrl-click links by a random id generated
 * - `H`, to ctrl-click links to comments (e.g on HN/Reddit/Lobsters) by a random
 *   id generated
 * - `?`, to allow users to search the text of links for a certain string then
 *   ctrl-click it
 */
function addExtensionListener() {
  const customWindow = /** @type {CustomWindow} */ (window);

  // if we've already run the script and added a listener, don't re-add it.
  if (customWindow._jumpToListener) {
    return;
  }

  /** @type {Command[]} */
  const commands = getCommands();

  /**
   * @param {KeyboardEvent} event
   * @returns {void}
   */
  customWindow._jumpToListener = (event) => {
    if (isInInput()) {
      return;
    }

    if (event.ctrlKey || event.metaKey) {
      return;
    }

    const matchingCommands = commands.filter(
      (command) => command.shortcut === event.key,
    );

    if (matchingCommands.length > 0) {
      event.preventDefault();
      const command = matchingCommands[0];
      command.run();
    }
  };

  customWindow._jumpToListenerCount =
    typeof customWindow._jumpToListenerCount === "undefined"
      ? 1
      : customWindow._jumpToListenerCount + 1;
  updateListenerCountInDom();

  window.addEventListener("keydown", customWindow._jumpToListener);
}

if (typeof window !== "undefined" && window.location.protocol !== "chrome:") {
  addExtensionListener();
} else {
  module.exports = {
    getCommands,
  };
}
