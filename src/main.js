/**
 * @typedef {object} CustomWindowObject
 * @property {(event: KeyboardEvent) => void} [_jumpToListener]
 */

/** @typedef {Window & CustomWindowObject} CustomWindow */

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

/**
 * Checks if the element is a link and visible
 *
 * @param {HTMLElement} element
 * @returns {boolean}
 */
function isVisibleLink(element) {
  if (!(element.tagName === "A" || element.tagName === "BUTTON")) {
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
 * Add a link jump UI element to the page
 *
 * @param {HTMLElement} link
 * @param {string} letter
 */
function addLinkJump(link, letter) {
  const rect = link.getBoundingClientRect();
  const height = rect.bottom - rect.top;

  const jump = document.createElement("div");

  const str = document.createElement("strong");
  str.innerText = letter;
  str.style.color = "black";
  str.style.backgroundColor = "#ffff6e";
  str.style.paddingLeft = "3px";
  str.style.paddingRight = "3px";
  jump.appendChild(str);

  jump.style.position = "absolute";
  jump.style.left = `${rect.left + window.scrollX - 20}px`;
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
 * Remove all link jumps not starting with `char` from the DOM
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

/** Unhide all link jumps */
function unhideAllLinkJumps() {
  /** @type {NodeListOf<HTMLElement>} */
  const allElements = document.querySelectorAll(`.--jump`);
  [...allElements].map((x) => (x.style.display = "block"));
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
 * Main function:
 *
 * - Gets all visibile links in the page
 * - Adds a listener for a shortcut for each link
 * - Add a visual indicator for each shortcut for each link (two letters)
 * - Removes irrelevant labels when other chars are pressed
 * - Removes listener when user hits Esc
 */
function trigger() {
  const links = allLinksInViewport();
  /** @type {{ [key: string]: HTMLElement }} */
  const letters = {};

  // start at aa, then to ba..za, then move to ab, bb..zb and so on
  let letter = 97;
  let secondLetter = 97;

  for (const link of links) {
    const char = String.fromCharCode(letter, secondLetter);
    letters[char] = link;
    addLinkJump(link, char);

    letter++;
    if (97 + 27 === letter) {
      letter = 97;
      secondLetter++;
    }

    // we can only handle aa..zz
    if (97 + 27 === secondLetter) {
      break;
    }
  }

  /** @type {string[]} */
  const lettersPressedSoFar = [];

  const scrollListener = () => {
    // because the viewport might've been moved, reposition the
    // link jumps
    for (const char of Object.keys(letters)) {
      const link = letters[char];
      resizeLinkJump(link, char);
    }
  };

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
      letters[currentString].click();
    } else {
      console.log(`Removing listener, got "${key}"`);
    }
    reset();
  };

  window.addEventListener("scroll", scrollListener);
  window.addEventListener("keydown", keydownListener);
}

/** @returns {boolean} */
function isInInput() {
  /** @type {Element | null} */
  const element = document.activeElement;

  if (element === null) {
    return false;
  }

  const tagName = element.tagName.toLowerCase();

  return tagName == "textarea" || tagName == "input";
}

function addExtensionListener() {
  const customWindow = /** @type {CustomWindow} */ (window);

  customWindow._jumpToListener = (event) => {
    if (isInInput()) {
      return;
    }

    if (event.key === "k") {
      trigger();
    }
  };

  window.addEventListener("keydown", customWindow._jumpToListener);
}

addExtensionListener();
