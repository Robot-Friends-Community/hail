/**
 * Cross-platform audio playback for Hail.
 * Async, fire-and-forget — never blocks the hook.
 */

const { spawn, execSync } = require('child_process');
const path = require('path');

const platform = process.platform;

/** Path to the Windows playback script */
const WIN_PLAY_SCRIPT = path.join(__dirname, '..', 'scripts', 'win-play.ps1');

/**
 * Play a sound file asynchronously.
 * @param {string} soundPath - Absolute path to the sound file
 * @param {number} volume - Volume 0.0 to 1.0
 */
function play(soundPath, volume = 0.5) {
  try {
    if (platform === 'win32') {
      playWindows(soundPath, volume);
    } else if (platform === 'darwin') {
      playMac(soundPath, volume);
    } else {
      playLinux(soundPath, volume);
    }
  } catch {
    // Silently fail — audio is best-effort
  }
}

function playWindows(soundPath, volume) {
  // Use "cmd /c start /min" to launch an independent minimized PowerShell process.
  // - Node's spawn with detached:true gets killed when parent exits
  // - "start /b" (fully hidden) prevents WPF MediaPlayer from accessing audio device
  // - "start /min" + "-WindowStyle Hidden" = minimized + invisible, audio works
  execSync(
    `cmd /c start /min powershell.exe -NoProfile -WindowStyle Hidden -ExecutionPolicy Bypass -File "${WIN_PLAY_SCRIPT}" -path "${soundPath}" -vol ${volume}`,
    { stdio: 'ignore', timeout: 5000, windowsHide: true }
  );
}

function playMac(soundPath, volume) {
  const child = spawn('afplay', ['-v', String(volume), soundPath], {
    detached: true,
    stdio: 'ignore',
  });
  child.unref();
}

function playLinux(soundPath, volume) {
  const ext = path.extname(soundPath).toLowerCase();

  if (ext === '.wav') {
    const child = spawn('aplay', [soundPath], {
      detached: true,
      stdio: 'ignore',
    });
    child.unref();
  } else {
    const paVolume = Math.round(volume * 65536);
    const child = spawn('paplay', [`--volume=${paVolume}`, soundPath], {
      detached: true,
      stdio: 'ignore',
    });
    child.unref();
  }
}

/**
 * Play a sound and wait for it to finish (for CLI test command).
 * @param {string} soundPath
 * @param {number} volume - 0.0 to 1.0
 * @returns {Promise<void>}
 */
function playSync(soundPath, volume = 0.5) {
  return new Promise((resolve) => {
    if (platform === 'win32') {
      const child = spawn('powershell.exe', [
        '-NoProfile', '-NonInteractive', '-ExecutionPolicy', 'Bypass',
        '-File', WIN_PLAY_SCRIPT, '-path', soundPath, '-vol', String(volume),
      ], { windowsHide: true, stdio: 'ignore' });
      child.on('close', resolve);
      child.on('error', resolve);
    } else if (platform === 'darwin') {
      const child = spawn('afplay', ['-v', String(volume), soundPath], { stdio: 'ignore' });
      child.on('close', resolve);
      child.on('error', resolve);
    } else {
      const child = spawn('aplay', [soundPath], { stdio: 'ignore' });
      child.on('close', resolve);
      child.on('error', resolve);
    }
  });
}

module.exports = { play, playSync };
