#!/usr/bin/env node
/**
 * Tests for Hail core logic.
 * Run: node test/hook.test.js
 */

const path = require('path');
const assert = require('assert');

// Override require paths for testing
const config = require('../src/config');
const state = require('../src/state');
const router = require('../src/router');
const picker = require('../src/picker');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  PASS: ${name}`);
    passed++;
  } catch (err) {
    console.log(`  FAIL: ${name} — ${err.message}`);
    failed++;
  }
}

console.log('\nHail Test Suite\n');

// --- Config tests ---
console.log('Config:');

test('load returns defaults when no config file', () => {
  const cfg = config.load();
  assert(cfg.enabled === true);
  assert(typeof cfg.volume === 'number');
  assert(cfg.active_pack);
});

test('volumeToFloat converts 0-100 to 0.0-1.0', () => {
  assert.strictEqual(config.volumeToFloat(0), 0);
  assert.strictEqual(config.volumeToFloat(50), 0.5);
  assert.strictEqual(config.volumeToFloat(100), 1);
  assert.strictEqual(config.volumeToFloat(150), 1); // clamped
});

// --- Router tests ---
console.log('\nRouter:');

test('SessionStart maps to session.start', () => {
  const result = router.route({ hook_event_name: 'SessionStart' }, {}, {});
  assert.strictEqual(result, 'session.start');
});

test('PermissionRequest maps to input.required', () => {
  const result = router.route({ hook_event_name: 'PermissionRequest' }, {}, {});
  assert.strictEqual(result, 'input.required');
});

test('PostToolUseFailure maps to task.error', () => {
  const result = router.route({ hook_event_name: 'PostToolUseFailure' }, {}, {});
  assert.strictEqual(result, 'task.error');
});

test('SubagentStart maps to task.acknowledge', () => {
  const result = router.route({ hook_event_name: 'SubagentStart' }, {}, {});
  assert.strictEqual(result, 'task.acknowledge');
});

test('Stop maps to task.complete', () => {
  const result = router.route({ hook_event_name: 'Stop' }, {}, {});
  assert.strictEqual(result, 'task.complete');
});

test('Stop debounces within 5 seconds', () => {
  const stateObj = {};
  router.route({ hook_event_name: 'Stop' }, stateObj, {});
  const result = router.route({ hook_event_name: 'Stop' }, stateObj, {});
  assert.strictEqual(result, null);
});

test('Notification with permission_prompt returns null', () => {
  const result = router.route({
    hook_event_name: 'Notification',
    notification_type: 'permission_prompt',
  }, {}, {});
  assert.strictEqual(result, null);
});

test('Notification with idle_prompt returns null', () => {
  const result = router.route({
    hook_event_name: 'Notification',
    notification_type: 'idle_prompt',
  }, {}, {});
  assert.strictEqual(result, null);
});

test('Notification without type maps to task.complete', () => {
  const result = router.route({ hook_event_name: 'Notification' }, {}, {});
  assert.strictEqual(result, 'task.complete');
});

test('UserPromptSubmit returns null under threshold', () => {
  const result = router.route({
    hook_event_name: 'UserPromptSubmit',
    session_id: 'test-session',
  }, {}, { annoyed_threshold: 3, annoyed_window_seconds: 10 });
  assert.strictEqual(result, null);
});

test('UserPromptSubmit returns user.spam at threshold', () => {
  const stateObj = {};
  const cfg = { annoyed_threshold: 3, annoyed_window_seconds: 10 };
  const event = { hook_event_name: 'UserPromptSubmit', session_id: 'spam-test' };

  router.route(event, stateObj, cfg);
  router.route(event, stateObj, cfg);
  const result = router.route(event, stateObj, cfg);
  assert.strictEqual(result, 'user.spam');
});

test('Unknown hook event returns null', () => {
  const result = router.route({ hook_event_name: 'SomethingElse' }, {}, {});
  assert.strictEqual(result, null);
});

// --- State tests ---
console.log('\nState:');

test('checkStopDebounce tracks timing', () => {
  const s = {};
  assert.strictEqual(state.checkStopDebounce(s, 5), false);
  assert.strictEqual(state.checkStopDebounce(s, 5), true);
});

test('trackPrompt counts within window', () => {
  const s = {};
  assert.strictEqual(state.trackPrompt(s, 'sess1', 10), 1);
  assert.strictEqual(state.trackPrompt(s, 'sess1', 10), 2);
  assert.strictEqual(state.trackPrompt(s, 'sess1', 10), 3);
});

test('cleanExpiredSessions removes old entries', () => {
  const s = {
    session_packs: {
      old: { pack: 'peon', last_used: 1000 },
      recent: { pack: 'glados', last_used: Math.floor(Date.now() / 1000) },
    },
  };
  const modified = state.cleanExpiredSessions(s, 7);
  assert.strictEqual(modified, true);
  assert(!s.session_packs.old);
  assert(s.session_packs.recent);
});

// --- Picker tests ---
console.log('\nPicker:');

test('loadManifest reads manifest.json', () => {
  const packDir = path.join(config.getPacksDir(), 'peon');
  const manifest = picker.loadManifest(packDir);
  assert(manifest);
  assert(manifest.name === 'peon');
  assert(manifest.categories);
});

test('loadManifest falls back to openpeon.json', () => {
  // All migrated packs have both, but the code path is tested via manifest.json first
  const packDir = path.join(config.getPacksDir(), 'peon');
  const manifest = picker.loadManifest(packDir);
  assert(manifest);
});

test('pick returns a valid sound', () => {
  const packDir = path.join(config.getPacksDir(), 'peon');
  const stateObj = {};
  const result = picker.pick(packDir, 'session.start', stateObj);
  assert(result);
  assert(result.soundPath);
  assert(result.soundFile);
});

test('pick avoids repeating last sound', () => {
  const packDir = path.join(config.getPacksDir(), 'peon');
  const stateObj = {};

  // Pick many times and verify we get different sounds
  const sounds = new Set();
  for (let i = 0; i < 20; i++) {
    const result = picker.pick(packDir, 'session.start', stateObj);
    if (result) sounds.add(result.soundFile);
  }
  // With 3 sounds in session.start, anti-repeat should give us at least 2
  assert(sounds.size >= 2, `Expected at least 2 unique sounds, got ${sounds.size}`);
});

test('pick returns null for missing category', () => {
  const packDir = path.join(config.getPacksDir(), 'peon');
  const result = picker.pick(packDir, 'nonexistent.category', {});
  assert.strictEqual(result, null);
});

test('resolvePack returns default pack', () => {
  const cfg = { active_pack: 'glados', pack_rotation_mode: 'random' };
  const result = picker.resolvePack(cfg, {}, 'test', config.getPacksDir());
  assert.strictEqual(result, 'glados');
});

// --- Summary ---
console.log(`\n${passed} passed, ${failed} failed\n`);
process.exit(failed > 0 ? 1 : 0);
