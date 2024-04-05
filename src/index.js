/**
 * @typedef {object} CustomWindowObject
 * @property {undefined | ((event: KeyboardEvent) => void)} [_jumpToListener]
 * @property {number} [_jumpToListenerCount]
 */

/**
 * @typedef {{ [key: string]: HTMLElement }} LinkJumpMap
 *
 * @typedef {"p" | "k" | "K" | "h" | "H" | "/" | "?" | "m" | "M"} KnownShortcut
 *
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
 * @typedef {Object} MessageToBackground
 * @property {"Mute" | "MuteOthers"} kind
 */
