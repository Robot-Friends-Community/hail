/**
 * Cross-platform audio playback for Hail.
 * Async, fire-and-forget — never blocks the hook.
 */

const { spawn } = require('child_process');
const path = require('path');

const platform = process.platform;

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
  // Use WPF MediaPlayer via inline PowerShell (same approach as peon-ping's win-play.ps1)
  const ps1 = `
Add-Type -AssemblyName PresentationCore
$p = New-Object System.Windows.Media.MediaPlayer
$p.Open([Uri]::new("file:///$($args[0] -replace '\\\\','/')"))
$p.Volume = ${volume}
Start-Sleep -Milliseconds 150
$p.Play()
$t = 50
while ($t -gt 0 -and $p.Position.TotalMilliseconds -eq 0) {
  Start-Sleep -Milliseconds 100
  $t--
}
if ($p.NaturalDuration.HasTimeSpan) {
  $r = $p.NaturalDuration.TimeSpan.TotalMilliseconds - $p.Position.TotalMilliseconds
  if ($r -gt 0 -and $r -lt 5000) { Start-Sleep -Milliseconds ([int]$r + 100) }
} else {
  Start-Sleep -Seconds 2
}
$p.Close()`.trim();

  const child = spawn('powershell.exe', [
    '-NoProfile', '-NonInteractive', '-ExecutionPolicy', 'Bypass',
    '-Command', ps1, soundPath,
  ], {
    detached: true,
    stdio: 'ignore',
    windowsHide: true,
  });
  child.unref();
}

function playMac(soundPath, volume) {
  // afplay volume: 0.0 to 1.0 maps to -v flag (0 to 1 linear)
  const child = spawn('afplay', ['-v', String(volume), soundPath], {
    detached: true,
    stdio: 'ignore',
  });
  child.unref();
}

function playLinux(soundPath, volume) {
  // Try paplay (PulseAudio) first, then aplay (ALSA) as fallback
  const ext = path.extname(soundPath).toLowerCase();

  if (ext === '.wav') {
    // aplay handles wav natively
    const child = spawn('aplay', [soundPath], {
      detached: true,
      stdio: 'ignore',
    });
    child.unref();
  } else {
    // paplay for other formats (mp3 via PulseAudio)
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
      const ps1 = `
Add-Type -AssemblyName PresentationCore
$p = New-Object System.Windows.Media.MediaPlayer
$p.Open([Uri]::new("file:///$($args[0] -replace '\\\\','/')"))
$p.Volume = ${volume}
Start-Sleep -Milliseconds 150
$p.Play()
$t = 50
while ($t -gt 0 -and $p.Position.TotalMilliseconds -eq 0) {
  Start-Sleep -Milliseconds 100
  $t--
}
if ($p.NaturalDuration.HasTimeSpan) {
  $r = $p.NaturalDuration.TimeSpan.TotalMilliseconds - $p.Position.TotalMilliseconds
  if ($r -gt 0 -and $r -lt 5000) { Start-Sleep -Milliseconds ([int]$r + 100) }
} else {
  Start-Sleep -Seconds 2
}
$p.Close()`.trim();
      const child = spawn('powershell.exe', [
        '-NoProfile', '-NonInteractive', '-ExecutionPolicy', 'Bypass',
        '-Command', ps1, soundPath,
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
