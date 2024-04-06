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
 * @typedef {Object} Mute
 * @property {"Mute"} kind
 */

/**
 * @typedef {Object} MuteOthers
 * @property {"MuteOthers"} kind
 */

/**
 * @typedef {Object} IsAudioPlaying
 * @property {"IsAudioPlaying"} kind
 */

/** @typedef {Mute | MuteOthers | IsAudioPlaying} MessageToBackground */

/**
 * @typedef {Object} AudioPlayingState
 * @property {"AudioPlayingState"} kind
 * @property {boolean} isPlaying
 * @property {boolean} isMuted
 */

/** @typedef {AudioPlayingState} MessageToContentScript */
