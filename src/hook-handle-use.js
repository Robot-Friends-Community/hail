#!/usr/bin/env node
/**
 * UserPromptSubmit hook for /hail use <pack> command.
 * Intercepts the command before it reaches the LLM, sets the session pack.
 */

const fs = require('fs');
const path = require('path');
const config = require('./config');
const state = require('./state');

function main() {
  let input = '';
  try {
    input = fs.readFileSync(0, 'utf8');
  } catch {
    console.log(JSON.stringify({ continue: true }));
    process.exit(0);
  }

  let event;
  try {
    event = JSON.parse(input);
  } catch {
    console.log(JSON.stringify({ continue: true }));
    process.exit(0);
  }

  const prompt = (event.prompt || '').trim();

  // Match /hail use <pack> command
  const match = prompt.match(/^\s*\/hail\s+use\s+(\S+)/i);
  if (!match) {
    console.log(JSON.stringify({ continue: true }));
    process.exit(0);
  }

  const packName = match[1];

  // Validate pack name charset
  if (!/^[a-zA-Z0-9_-]+$/.test(packName)) {
    console.log(JSON.stringify({
      continue: false,
      user_message: '[X] Invalid pack name (use only letters, numbers, underscores, hyphens)',
    }));
    process.exit(0);
  }

  const packsDir = config.getPacksDir();
  const packDir = path.join(packsDir, packName);

  // Validate pack exists
  if (!fs.existsSync(packDir)) {
    const available = fs.readdirSync(packsDir).filter(d => {
      const soundsDir = path.join(packsDir, d, 'sounds');
      return fs.existsSync(soundsDir);
    });
    console.log(JSON.stringify({
      continue: false,
      user_message: `[X] Pack '${packName}' not found\n\nAvailable packs: ${available.join(', ')}`,
    }));
    process.exit(0);
  }

  // Get session ID
  const sessionId = event.session_id || event.conversation_id || 'default';

  // Update config to agentskill mode
  const cfg = config.load();
  cfg.pack_rotation_mode = 'agentskill';
  if (!cfg.pack_rotation) cfg.pack_rotation = [];
  if (!cfg.pack_rotation.includes(packName)) cfg.pack_rotation.push(packName);
  config.save(cfg);

  // Update state with session-pack mapping
  const stateObj = state.load();
  if (!stateObj.session_packs) stateObj.session_packs = {};
  stateObj.session_packs[sessionId] = {
    pack: packName,
    last_used: Math.floor(Date.now() / 1000),
  };
  state.save(stateObj);

  console.log(JSON.stringify({
    continue: false,
    user_message: `Voice set to ${packName}`,
  }));
  process.exit(0);
}

main();
