/**
 * Session state management for Hail.
 * Tracks anti-repeat, debounce, session packs, and prompt timestamps.
 */

const fs = require('fs');
const path = require('path');

const STATE_PATH = path.join(path.resolve(__dirname, '..'), '.state.json');

function load() {
  try {
    return JSON.parse(fs.readFileSync(STATE_PATH, 'utf8'));
  } catch {
    return {};
  }
}

function save(state) {
  try {
    fs.writeFileSync(STATE_PATH, JSON.stringify(state, null, 2) + '\n', 'utf8');
  } catch {
    // Silently fail — state is best-effort
  }
}

/**
 * Clean up expired sessions from state.
 * @param {object} state
 * @param {number} ttlDays
 * @returns {boolean} Whether state was modified
 */
function cleanExpiredSessions(state, ttlDays = 7) {
  const now = Math.floor(Date.now() / 1000);
  const cutoff = now - (ttlDays * 86400);
  const sessionPacks = state.session_packs || {};
  let modified = false;

  for (const [sid, data] of Object.entries(sessionPacks)) {
    if (typeof data === 'object' && data !== null) {
      if ((data.last_used || 0) < cutoff) {
        delete sessionPacks[sid];
        modified = true;
      }
    }
  }

  state.session_packs = sessionPacks;
  return modified;
}

/**
 * Get the active pack for a session (supports per-session overrides).
 * @param {object} state
 * @param {string} sessionId
 * @param {string} defaultPack
 * @param {string} packsDir - for pack existence validation
 * @returns {string} pack name
 */
function getSessionPack(state, sessionId, defaultPack, packsDir) {
  const sessionPacks = state.session_packs || {};

  // Check explicit session assignment
  const assignment = sessionPacks[sessionId];
  if (assignment) {
    const packName = typeof assignment === 'object' ? assignment.pack : assignment;
    if (packName && fs.existsSync(path.join(packsDir, packName))) {
      // Update timestamp
      sessionPacks[sessionId] = { pack: packName, last_used: Math.floor(Date.now() / 1000) };
      state.session_packs = sessionPacks;
      return packName;
    }
    // Pack missing, clean up
    delete sessionPacks[sessionId];
    state.session_packs = sessionPacks;
  }

  // Check default assignment (for Cursor without conversation_id)
  const defaultAssignment = sessionPacks['default'];
  if (defaultAssignment) {
    const packName = typeof defaultAssignment === 'object' ? defaultAssignment.pack : defaultAssignment;
    if (packName && fs.existsSync(path.join(packsDir, packName))) {
      return packName;
    }
  }

  return defaultPack;
}

/**
 * Track prompt timestamps for spam detection.
 * @returns {number} count of recent prompts within the window
 */
function trackPrompt(state, sessionId, windowSeconds) {
  const now = Math.floor(Date.now() / 1000);
  const allPrompts = state.prompt_timestamps || {};
  let recent = (allPrompts[sessionId] || []).filter(t => (now - t) < windowSeconds);
  recent.push(now);
  allPrompts[sessionId] = recent;
  state.prompt_timestamps = allPrompts;
  return recent.length;
}

/**
 * Check and update stop debounce.
 * @returns {boolean} true if this stop should be suppressed (within cooldown)
 */
function checkStopDebounce(state, cooldownSeconds = 5) {
  const now = Math.floor(Date.now() / 1000);
  const lastStop = state.last_stop_time || 0;
  state.last_stop_time = now;
  return (now - lastStop) < cooldownSeconds;
}

/**
 * Get and set anti-repeat tracking for a category.
 */
function getLastPlayed(state, category) {
  return state[`last_${category}`] || '';
}

function setLastPlayed(state, category, soundFile) {
  state[`last_${category}`] = soundFile;
}

module.exports = {
  load, save, cleanExpiredSessions, getSessionPack,
  trackPrompt, checkStopDebounce, getLastPlayed, setLastPlayed,
  STATE_PATH,
};
