/**
 * Hook registration installer for Hail.
 * Manages hooks in Claude Code settings.json.
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

const HOOK_EVENTS = [
  'SessionStart', 'Stop', 'Notification',
  'PermissionRequest', 'UserPromptSubmit',
  'PostToolUseFailure', 'SubagentStart',
];

function getSettingsPath() {
  return path.join(os.homedir(), '.claude', 'settings.json');
}

function getHookCommand() {
  const hookJs = path.join(path.resolve(__dirname, '..'), 'src', 'hook.js').replace(/\\/g, '/');
  return `node "${hookJs}"`;
}

function getUseHookCommand() {
  const useJs = path.join(path.resolve(__dirname, '..'), 'src', 'hook-handle-use.js').replace(/\\/g, '/');
  return `node "${useJs}"`;
}

function loadSettings() {
  const settingsPath = getSettingsPath();
  try {
    let raw = fs.readFileSync(settingsPath, 'utf8');
    // Strip BOM if present (PowerShell often writes UTF-8 BOM)
    if (raw.charCodeAt(0) === 0xFEFF) raw = raw.slice(1);
    const parsed = JSON.parse(raw);
    // Sanity check: if the parsed result is missing expected keys, something went wrong
    if (typeof parsed !== 'object' || parsed === null) return {};
    return parsed;
  } catch (err) {
    // If file exists but failed to parse, don't silently return empty — throw
    if (fs.existsSync(settingsPath)) {
      throw new Error(`Failed to parse settings.json: ${err.message}. Refusing to overwrite.`);
    }
    return {};
  }
}

function saveSettings(settings) {
  const settingsPath = getSettingsPath();
  fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 4) + '\n', 'utf8');
}

/**
 * Check if a hook entry is a peon-ping hook (for replacement).
 */
function isPeonPingHook(hookEntry) {
  if (!hookEntry || !hookEntry.hooks) return false;
  return hookEntry.hooks.some(h =>
    h.command && (h.command.includes('peon-ping') || h.command.includes('peon.ps1'))
  );
}

/**
 * Check if a hook entry is a Hail hook.
 */
function isHailHook(hookEntry) {
  if (!hookEntry || !hookEntry.hooks) return false;
  return hookEntry.hooks.some(h =>
    h.command && h.command.includes('hail')
  );
}

function makeHookEntry(command, timeout = 10) {
  return {
    matcher: '',
    hooks: [{
      type: 'command',
      command,
      timeout,
    }],
  };
}

/**
 * Install Hail hooks into settings.json.
 * Replaces peon-ping hooks and adds Hail hooks.
 * @param {object} options - { replacePeonPing: boolean, skipSkill: boolean }
 * @returns {{ installed: string[], replaced: string[] }}
 */
function install(options = {}) {
  const { replacePeonPing = true } = options;
  const settings = loadSettings();

  if (!settings.hooks) settings.hooks = {};

  const installed = [];
  const replaced = [];
  const hookCmd = getHookCommand();
  const useCmd = getUseHookCommand();

  for (const event of HOOK_EVENTS) {
    if (!settings.hooks[event]) settings.hooks[event] = [];

    const entries = settings.hooks[event];

    // Remove existing Hail hooks (idempotent reinstall)
    settings.hooks[event] = entries.filter(e => !isHailHook(e));

    // Remove peon-ping hooks if replacing
    if (replacePeonPing) {
      const before = settings.hooks[event].length;
      settings.hooks[event] = settings.hooks[event].filter(e => !isPeonPingHook(e));
      if (settings.hooks[event].length < before) replaced.push(event);
    }

    // Add Hail hook
    settings.hooks[event].push(makeHookEntry(hookCmd, 10));
    installed.push(event);
  }

  // Add UserPromptSubmit hook-handle-use for /hail use command interception
  if (!settings.hooks['UserPromptSubmit']) settings.hooks['UserPromptSubmit'] = [];
  // Remove existing use handler
  settings.hooks['UserPromptSubmit'] = settings.hooks['UserPromptSubmit'].filter(
    e => !(e.hooks && e.hooks.some(h => h.command && h.command.includes('hook-handle-use')))
  );
  settings.hooks['UserPromptSubmit'].push(makeHookEntry(useCmd, 5));

  saveSettings(settings);

  return { installed, replaced };
}

/**
 * Uninstall Hail hooks from settings.json.
 * @returns {string[]} removed event names
 */
function uninstall() {
  const settings = loadSettings();
  if (!settings.hooks) return [];

  const removed = [];

  for (const event of Object.keys(settings.hooks)) {
    const before = settings.hooks[event].length;
    settings.hooks[event] = settings.hooks[event].filter(e => !isHailHook(e));

    // Also remove hook-handle-use entries
    settings.hooks[event] = settings.hooks[event].filter(
      e => !(e.hooks && e.hooks.some(h => h.command && h.command.includes('hook-handle-use') && h.command.includes('hail')))
    );

    if (settings.hooks[event].length < before) removed.push(event);

    // Clean up empty arrays
    if (settings.hooks[event].length === 0) delete settings.hooks[event];
  }

  saveSettings(settings);
  return removed;
}

/**
 * Check if Hail hooks are installed.
 * @returns {{ installed: boolean, events: string[], hasPeonPing: boolean }}
 */
function status() {
  const settings = loadSettings();
  if (!settings.hooks) return { installed: false, events: [], hasPeonPing: false };

  const events = [];
  let hasPeonPing = false;

  for (const event of HOOK_EVENTS) {
    const entries = settings.hooks[event] || [];
    if (entries.some(e => isHailHook(e))) events.push(event);
    if (entries.some(e => isPeonPingHook(e))) hasPeonPing = true;
  }

  return { installed: events.length > 0, events, hasPeonPing };
}

/**
 * Install the Hail skill into Claude Code skills directory.
 */
function installSkill() {
  const skillSrc = path.join(path.resolve(__dirname, '..'), 'skills', 'hail', 'SKILL.md');
  const skillDest = path.join(os.homedir(), '.claude', 'skills', 'hail', 'SKILL.md');

  if (!fs.existsSync(skillSrc)) return false;

  const destDir = path.dirname(skillDest);
  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

  // The skill is written with a {{HAIL_DIR}} placeholder; fill in where THIS clone lives
  // (forward slashes so the path works in bash snippets on every platform).
  const hailDir = path.resolve(__dirname, '..').replace(/\\/g, '/');
  const skill = fs.readFileSync(skillSrc, 'utf8').replace(/\{\{HAIL_DIR\}\}/g, hailDir);
  fs.writeFileSync(skillDest, skill, 'utf8');
  return true;
}

module.exports = { install, uninstall, status, installSkill, getSettingsPath };
