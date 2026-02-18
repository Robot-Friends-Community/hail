/**
 * Sound selection for Hail.
 * Picks a random sound from a category with anti-repeat logic.
 */

const fs = require('fs');
const path = require('path');
const state = require('./state');

/**
 * Load a pack manifest (supports both manifest.json and openpeon.json).
 * @param {string} packDir - Path to the pack directory
 * @returns {object|null} parsed manifest or null
 */
function loadManifest(packDir) {
  // Prefer manifest.json, fall back to openpeon.json
  for (const name of ['manifest.json', 'openpeon.json']) {
    const manifestPath = path.join(packDir, name);
    try {
      return JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    } catch {
      continue;
    }
  }
  return null;
}

/**
 * Pick a sound for a given category from a pack.
 * Uses anti-repeat to avoid playing the same sound twice in a row.
 *
 * @param {string} packDir - Path to the pack directory
 * @param {string} category - CESP category name
 * @param {object} stateObj - State object for anti-repeat tracking
 * @returns {{ soundPath: string, label: string, soundFile: string } | null}
 */
function pick(packDir, category, stateObj) {
  const manifest = loadManifest(packDir);
  if (!manifest) return null;

  const catData = manifest.categories && manifest.categories[category];
  if (!catData || !catData.sounds || catData.sounds.length === 0) return null;

  const sounds = catData.sounds;
  const lastPlayed = state.getLastPlayed(stateObj, category);

  // Filter out last played sound for anti-repeat
  let candidates = sounds.filter(s => path.basename(s.file) !== lastPlayed);
  if (candidates.length === 0) candidates = sounds;

  // Random selection
  const chosen = candidates[Math.floor(Math.random() * candidates.length)];
  const soundFile = path.basename(chosen.file);
  const soundPath = path.join(packDir, 'sounds', soundFile);

  if (!fs.existsSync(soundPath)) return null;

  // Update anti-repeat state
  state.setLastPlayed(stateObj, category, soundFile);

  return { soundPath, label: chosen.label || '', soundFile };
}

/**
 * Resolve the active pack name considering rotation mode and session overrides.
 * @param {object} config
 * @param {object} stateObj
 * @param {string} sessionId
 * @param {string} packsDir
 * @returns {string} pack name
 */
function resolvePack(config, stateObj, sessionId, packsDir) {
  const rotationMode = config.pack_rotation_mode || 'random';

  if (rotationMode === 'agentskill') {
    return state.getSessionPack(stateObj, sessionId, config.active_pack || 'peon', packsDir);
  }

  // Automatic rotation from pack_rotation array
  if (config.pack_rotation && config.pack_rotation.length > 0) {
    return config.pack_rotation[Math.floor(Math.random() * config.pack_rotation.length)];
  }

  return config.active_pack || 'peon';
}

module.exports = { pick, resolvePack, loadManifest };
