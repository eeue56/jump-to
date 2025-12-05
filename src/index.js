/**
 * @typedef {object} CustomWindowObject
 * @property {undefined | ((event: KeyboardEvent) => void)} [_jumpToListener]
 * @property {number} [_jumpToListenerCount]
 */

/**
 * @typedef {{ [key: string]: HTMLElement }} LinkJumpMap
 *
 * @typedef {"p"
 *   | "k"
 *   | "K"
 *   | "h"
 *   | "H"
 *   | "/"
 *   | "?"
 *   | "m"
 *   | "M"
 *   | "spike"
 *   | "end spike"} KnownShortcut
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

/**
 * @typedef {Object} StartSpike
 * @property {"StartSpike"} kind
 */

/**
 * @typedef {Object} SpikeEntry
 * @property {"SpikeEntry"} kind
 * @property {string} url
 * @property {string} title
 * @property {number} tab
 */

/**
 * @typedef {Object} AddSpikeEntry
 * @property {"AddSpikeEntry"} kind
 * @property {SpikeEntry} entry
 */

/**
 * @typedef {Object} EndSpike
 * @property {"EndSpike"} kind
 */

/**
 * @typedef {Mute
 *   | MuteOthers
 *   | IsAudioPlaying
 *   | StartSpike
 *   | AddSpikeEntry
 *   | EndSpike} MessageToBackground
 */

/**
 * @typedef {Object} AudioPlayingState
 * @property {"AudioPlayingState"} kind
 * @property {boolean} isPlaying
 * @property {boolean} isMuted
 */

/**
 * @typedef {Object} CurrentSpike
 * @property {"CurrentSpike"} kind
 * @property {SpikeEntry[]} entries
 */

/** @typedef {AudioPlayingState | CurrentSpike} MessageToContentScript */
