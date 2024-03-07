/**
 * Check if the element is visible to the user
 * @param {HTMLElement} element An element in the page
 * @returns {boolean} 
 */
function elementIsVisibleInViewport(element) {
  const computed = window.getComputedStyle(element);

  if (!element.checkVisibility() || computed.visibility === "hidden" || computed.display === "none") {
    return false;
  }

  const rect = element.getBoundingClientRect();

  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  ); 
};

/**
 * Checks if the element is a link and visible
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
 * @returns {HTMLElement[]}
 */
function allLinksInViewport() {
  return [...document.querySelectorAll("body *")].filter(isVisibleLink);
}

/**
 * Add a link jump UI element to the page
 * @param {HTMLElement} link 
 * @param {string} letter 
 */
function addLinkJump(link, letter) {
  const rect = link.getBoundingClientRect();
  const height = rect.bottom - rect.top;

  const jump = document.createElement("div");
  
  const str = document.createElement("strong");
  str.innerText = letter;
  str.style.backgroundColor = "white";
  jump.appendChild(str);

  jump.style.position = "absolute";
  jump.style.left = `${rect.left + window.scrollX - 20}px`;
  jump.style.top = `${rect.top + window.scrollY + (height / 2) - 10}px`;
  jump.style.width = '50px';
  jump.style.height = '30px';
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
  border.classList.add("--jump");

  document.body.appendChild(jump);
  document.body.appendChild(border);
}

/**
 * Remove all link jumps from the DOM
 */
function removeLinkJumps() {
  [...document.querySelectorAll(".--jump")].map((x) => x.remove());
}

/**
 * Main function:
 *    - Gets all visibile links in the page
 *    - Adds a listener for a shortcut for each link
 *    - Add a visual indicator for each shortcut for each link
 *    - Removes listener when user hits Esc
 */
function trigger() {
  const links = allLinksInViewport();
  const letters = {};

  let letter = 97;
  let count = 0;

  for (const link of links) {
    // TODO: implement behaviour for when there's more links than available letters
    const char = count === 0 ? String.fromCharCode([letter]): `${String.fromCharCode([letter])}${count}`;
    letters[char] = link;
    addLinkJump(link, char);
    letter++;

    if (97 + 27 === letter) {
      letter = 97;
      count++;
    }
  }

  let keydownListener = (event) => {
    event.preventDefault();

    if (event.key === "Escape") {
      console.log(`Removing listener, got "Esc"`);
      window.removeEventListener("keydown", keydownListener);
      removeLinkJumps();
    }

    if (!String.fromCharCode(event.keyCode).match(/(\w|\s)/g)) {
      return;
    }

    let key = String.fromCharCode(event.keyCode);

    if (event.shiftKey) {
      key = key.toUpperCase();
    } else {
      key = key.toLowerCase();
    }

    if (letters[key]) {
      console.log(`Clicking ${key}...`);
      letters[key].click();
      window.removeEventListener("keydown", keydownListener);
      removeLinkJumps();
    } else {
      console.log(`Removing listener, got "${key}"`);
      window.removeEventListener("keydown", keydownListener);
      removeLinkJumps();
    }
  };

  
  window.addEventListener("keydown", keydownListener);
}
