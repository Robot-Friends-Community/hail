#!/usr/bin/env node
/**
 * Hail CLI — Voice notification control panel.
 *
 * Usage:
 *   hail install          Register hooks in settings.json
 *   hail uninstall        Remove hooks from settings.json
 *   hail status           Show enabled/disabled, active pack, volume
 *   hail packs            List installed packs with sound counts
 *   hail use <pack>       Switch active pack
 *   hail volume <0-100>   Set volume
 *   hail toggle           Enable/disable
 *   hail test [category]  Play a sample sound
 *   hail wizard           Interactive setup
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const config = require('../src/config');
const picker = require('../src/picker');
const player = require('../src/player');
const installer = require('../src/installer');

const args = process.argv.slice(2);
const command = args[0] || 'status';

const CATEGORIES = [
  'session.start', 'task.acknowledge', 'task.complete',
  'task.error', 'input.required', 'resource.limit', 'user.spam',
];

async function main() {
  switch (command) {
    case 'install': return cmdInstall();
    case 'uninstall': return cmdUninstall();
    case 'status': return cmdStatus();
    case 'packs': return cmdPacks();
    case 'use': return cmdUse();
    case 'volume': case 'vol': return cmdVolume();
    case 'toggle': return cmdToggle();
    case 'test': return cmdTest();
    case 'wizard': case 'setup': return cmdWizard();
    case 'help': case '--help': case '-h': return cmdHelp();
    default:
      console.log(`Unknown command: ${command}`);
      cmdHelp();
      process.exit(1);
  }
}

function cmdInstall() {
  const { installed, replaced } = installer.install({ replacePeonPing: true });
  console.log(`Hail hooks installed for: ${installed.join(', ')}`);
  if (replaced.length > 0) {
    console.log(`Replaced peon-ping hooks on: ${replaced.join(', ')}`);
  }

  // Install skill
  const skillInstalled = installer.installSkill();
  if (skillInstalled) {
    console.log('Hail skill installed (/hail command available in Claude Code)');
  }

  // Create default config if missing
  if (!fs.existsSync(config.CONFIG_PATH)) {
    config.save(config.DEFAULTS);
    console.log('Created default config.json');
  }

  console.log('\nReady! Try: hail test task.complete');
}

function cmdUninstall() {
  const removed = installer.uninstall();
  if (removed.length > 0) {
    console.log(`Hail hooks removed from: ${removed.join(', ')}`);
  } else {
    console.log('No Hail hooks found to remove.');
  }
}

function cmdStatus() {
  const cfg = config.load();
  const hookStatus = installer.status();

  const state = cfg.enabled ? 'ENABLED' : 'PAUSED';
  console.log(`Hail: ${state}`);
  console.log(`  Pack:    ${cfg.active_pack}`);
  console.log(`  Volume:  ${cfg.volume}%`);
  console.log(`  Mode:    ${cfg.pack_rotation_mode}`);

  if (hookStatus.installed) {
    console.log(`  Hooks:   ${hookStatus.events.length} events registered`);
  } else {
    console.log('  Hooks:   NOT installed (run: hail install)');
  }

  if (hookStatus.hasPeonPing) {
    console.log('  Warning: peon-ping hooks still present (run: hail install to replace)');
  }

  // Show category toggles
  const disabled = CATEGORIES.filter(c => cfg.categories && cfg.categories[c] === false);
  if (disabled.length > 0) {
    console.log(`  Disabled: ${disabled.join(', ')}`);
  }
}

function cmdPacks() {
  const cfg = config.load();
  const packsDir = config.getPacksDir();

  if (!fs.existsSync(packsDir)) {
    console.log('No packs directory found.');
    return;
  }

  const packs = fs.readdirSync(packsDir).filter(d => {
    return fs.statSync(path.join(packsDir, d)).isDirectory();
  });

  console.log('Installed packs:');
  for (const pack of packs.sort()) {
    const packDir = path.join(packsDir, pack);
    const manifest = picker.loadManifest(packDir);
    const soundsDir = path.join(packDir, 'sounds');

    let soundCount = 0;
    if (fs.existsSync(soundsDir)) {
      soundCount = fs.readdirSync(soundsDir).filter(f => !f.startsWith('.')).length;
    }

    if (soundCount === 0) continue;

    const displayName = manifest ? manifest.display_name || manifest.name : pack;
    const active = pack === cfg.active_pack ? ' <-- active' : '';
    console.log(`  ${pack} — ${displayName} (${soundCount} sounds)${active}`);
  }
}

function cmdUse() {
  const packName = args[1];
  if (!packName) {
    // Cycle to next pack
    const cfg = config.load();
    const packsDir = config.getPacksDir();
    const available = fs.readdirSync(packsDir).filter(d => {
      const soundsDir = path.join(packsDir, d, 'sounds');
      return fs.existsSync(soundsDir) && fs.readdirSync(soundsDir).length > 0;
    }).sort();

    if (available.length === 0) {
      console.log('No packs available.');
      return;
    }

    const idx = available.indexOf(cfg.active_pack);
    const next = available[(idx + 1) % available.length];
    config.update({ active_pack: next });
    console.log(`Switched to: ${next}`);
    return;
  }

  const packsDir = config.getPacksDir();
  const packDir = path.join(packsDir, packName);

  if (!fs.existsSync(packDir)) {
    console.log(`Pack '${packName}' not found.`);
    console.log('Run: hail packs');
    return;
  }

  const sessionOnly = args.includes('--session');
  if (sessionOnly) {
    // Session override would be handled by the hook-handle-use.js
    console.log(`Use '/hail use ${packName}' inside Claude Code for session-only override.`);
    return;
  }

  config.update({ active_pack: packName });
  console.log(`Active pack: ${packName}`);
}

function cmdVolume() {
  const volStr = args[1];
  if (!volStr) {
    const cfg = config.load();
    console.log(`Volume: ${cfg.volume}%`);
    return;
  }

  const vol = parseInt(volStr, 10);
  if (isNaN(vol) || vol < 0 || vol > 100) {
    console.log('Volume must be 0-100');
    return;
  }

  config.update({ volume: vol });
  console.log(`Volume: ${vol}%`);
}

function cmdToggle() {
  const cfg = config.load();
  const newState = !cfg.enabled;
  config.update({ enabled: newState });
  console.log(`Hail: ${newState ? 'ENABLED' : 'PAUSED'}`);
}

async function cmdTest() {
  const category = args[1] || 'task.complete';

  if (!CATEGORIES.includes(category)) {
    console.log(`Unknown category: ${category}`);
    console.log(`Available: ${CATEGORIES.join(', ')}`);
    return;
  }

  const cfg = config.load();
  const packsDir = config.getPacksDir();
  const packDir = path.join(packsDir, cfg.active_pack);

  const stateObj = {};
  const sound = picker.pick(packDir, category, stateObj);

  if (!sound) {
    console.log(`No sounds found for ${category} in pack ${cfg.active_pack}`);
    return;
  }

  const volume = config.volumeToFloat(cfg.volume);
  console.log(`Playing: ${sound.label || sound.soundFile} (${cfg.active_pack}/${category})`);
  await player.playSync(sound.soundPath, volume);
}

async function cmdWizard() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const ask = (q) => new Promise(resolve => rl.question(q, resolve));

  console.log('\n  Hail Setup Wizard\n');

  // Step 1: Pick a pack
  const packsDir = config.getPacksDir();
  const available = fs.readdirSync(packsDir).filter(d => {
    const soundsDir = path.join(packsDir, d, 'sounds');
    return fs.existsSync(soundsDir) && fs.readdirSync(soundsDir).length > 0;
  }).sort();

  console.log('Available packs:');
  available.forEach((p, i) => {
    const manifest = picker.loadManifest(path.join(packsDir, p));
    const name = manifest ? manifest.display_name || p : p;
    console.log(`  ${i + 1}. ${p} — ${name}`);
  });

  const packChoice = await ask(`\nChoose a pack [1-${available.length}]: `);
  const packIdx = parseInt(packChoice, 10) - 1;
  const selectedPack = available[packIdx] || available[0];
  console.log(`Selected: ${selectedPack}`);

  // Step 2: Volume
  const volChoice = await ask('Volume (0-100) [50]: ');
  const volume = parseInt(volChoice, 10) || 50;

  // Step 3: Test
  const testChoice = await ask('Play a test sound? (y/n) [y]: ');
  if (testChoice.toLowerCase() !== 'n') {
    const packDir = path.join(packsDir, selectedPack);
    const sound = picker.pick(packDir, 'session.start', {});
    if (sound) {
      console.log(`Playing: ${sound.label || sound.soundFile}`);
      await player.playSync(sound.soundPath, config.volumeToFloat(volume));
    }
  }

  // Step 4: Install hooks
  const installChoice = await ask('Install hooks in Claude Code? (y/n) [y]: ');
  if (installChoice.toLowerCase() !== 'n') {
    const { installed, replaced } = installer.install({ replacePeonPing: true });
    console.log(`Hooks installed for: ${installed.length} events`);
    if (replaced.length > 0) {
      console.log(`Replaced peon-ping hooks on: ${replaced.length} events`);
    }
    installer.installSkill();
  }

  // Save config
  config.update({ active_pack: selectedPack, volume, enabled: true });
  console.log(`\nHail configured! Pack: ${selectedPack}, Volume: ${volume}%`);
  console.log('Run "hail status" to verify.\n');

  rl.close();
}

function cmdHelp() {
  console.log(`
Hail — Voice Notification System for AI Coding Agents

Commands:
  hail install          Register hooks in Claude Code settings.json
  hail uninstall        Remove hooks from settings.json
  hail status           Show current configuration
  hail packs            List installed sound packs
  hail use <pack>       Switch active pack (or cycle if no name given)
  hail volume <0-100>   Set volume (0-100)
  hail toggle           Enable/disable sounds
  hail test [category]  Play a sample sound
  hail wizard           Interactive setup

Categories:
  session.start, task.acknowledge, task.complete,
  task.error, input.required, resource.limit, user.spam

In Claude Code:
  /hail use <pack>      Switch pack for current session
`);
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
