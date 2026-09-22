/**
 * Config management for Hail.
 * Reads/writes hail config JSON with sensible defaults.
 */

const fs = require('fs');
const path = require('path');

const HAIL_DIR = path.resolve(__dirname, '..');

const CONFIG_PATH = path.join(HAIL_DIR, 'config.json');

const DEFAULTS = {
  enabled: true,
  active_pack: 'chimes',
  volume: 50,
  pack_rotation: [],
  pack_rotation_mode: 'random',
  annoyed_threshold: 3,
  annoyed_window_seconds: 10,
  session_ttl_days: 7,
  categories: {
    'session.start': true,
    'task.acknowledge': true,
    'task.complete': true,
    'task.error': true,
    'input.required': true,
    'resource.limit': true,
    'user.spam': true,
  },
};

function load() {
  try {
    const raw = fs.readFileSync(CONFIG_PATH, 'utf8');
    const cfg = JSON.parse(raw);
    return { ...DEFAULTS, ...cfg, categories: { ...DEFAULTS.categories, ...cfg.categories } };
  } catch {
    return { ...DEFAULTS };
  }
}

function save(cfg) {
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(cfg, null, 2) + '\n', 'utf8');
}

function update(partial) {
  const cfg = load();
  Object.assign(cfg, partial);
  save(cfg);
  return cfg;
}

function getPacksDir() {
  return path.join(HAIL_DIR, 'packs');
}

function getHailDir() {
  return HAIL_DIR;
}

/** Convert volume 0-100 to 0.0-1.0 for audio playback */
function volumeToFloat(vol) {
  return Math.max(0, Math.min(1, vol / 100));
}

module.exports = { load, save, update, getPacksDir, getHailDir, volumeToFloat, CONFIG_PATH, DEFAULTS, HAIL_DIR };
