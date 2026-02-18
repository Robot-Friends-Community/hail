#!/usr/bin/env node
/**
 * Hail — Main hook handler.
 * Reads hook event JSON from stdin, routes to a category, picks a sound, and plays it.
 * Called by Claude Code hooks system.
 */

const path = require('path');
const config = require('./config');
const state = require('./state');
const router = require('./router');
const picker = require('./picker');
const player = require('./player');

function main() {
  // Read config
  const cfg = config.load();
  if (!cfg.enabled) process.exit(0);

  // Read stdin
  let input = '';
  try {
    input = require('fs').readFileSync(0, 'utf8');
  } catch {
    process.exit(0);
  }

  if (!input) process.exit(0);

  let event;
  try {
    event = JSON.parse(input);
  } catch {
    process.exit(0);
  }

  // Load state
  const stateObj = state.load();

  // Clean expired sessions
  state.cleanExpiredSessions(stateObj, cfg.session_ttl_days || 7);

  // Route event to category
  const category = router.route(event, stateObj, cfg);
  if (!category) {
    state.save(stateObj);
    process.exit(0);
  }

  // Check if category is enabled
  if (cfg.categories && cfg.categories[category] === false) {
    state.save(stateObj);
    process.exit(0);
  }

  // Resolve active pack
  const sessionId = event.session_id || event.conversation_id || 'default';
  const packsDir = config.getPacksDir();
  const activePack = picker.resolvePack(cfg, stateObj, sessionId, packsDir);
  const packDir = path.join(packsDir, activePack);

  // Pick a sound
  const sound = picker.pick(packDir, category, stateObj);
  if (!sound) {
    state.save(stateObj);
    process.exit(0);
  }

  // Save state
  state.save(stateObj);

  // Play sound (async, fire-and-forget)
  const volume = config.volumeToFloat(cfg.volume);
  player.play(sound.soundPath, volume);

  // Give the detached process time to spawn before Node exits
  setTimeout(() => process.exit(0), 200);
}

main();
