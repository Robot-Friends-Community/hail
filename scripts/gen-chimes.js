/**
 * Generate chime/notification sounds for the "chimes" pack using ffmpeg.
 * Produces clean, minimal tonal cues for each event category.
 */
const { execSync } = require('child_process');
const path = require('path');

const outDir = path.resolve(__dirname, '..', 'packs', 'chimes', 'sounds');

function gen(filename, filterComplex, duration) {
  const out = path.join(outDir, filename);
  const cmd = `ffmpeg -y -f lavfi -i "${filterComplex}" -t ${duration} -af "volume=3.0,afade=t=in:st=0:d=0.01,afade=t=out:st=${duration - 0.08}:d=0.08" -ar 44100 "${out}"`;
  console.log(`  ${filename}`);
  execSync(cmd, { stdio: 'pipe' });
}

// Two-tone approach: generate separate tones, then merge
function genMultiTone(filename, tones, totalDuration) {
  const out = path.join(outDir, filename);
  const inputs = [];
  const filters = [];

  tones.forEach((t, i) => {
    inputs.push(`-f lavfi -i "sine=frequency=${t.freq}:duration=${t.dur}"`);
    filters.push(`[${i}]adelay=${t.delay}|${t.delay},volume=${t.vol || 1.0}[s${i}]`);
  });

  const mixInputs = tones.map((_, i) => `[s${i}]`).join('');
  filters.push(`${mixInputs}amix=inputs=${tones.length}:duration=longest:normalize=0,volume=4.0,afade=t=out:st=${totalDuration - 0.1}:d=0.1`);

  const cmd = `ffmpeg -y ${inputs.join(' ')} -filter_complex "${filters.join(';')}" -t ${totalDuration} -ar 44100 "${out}"`;
  console.log(`  ${filename}`);
  execSync(cmd, { stdio: 'pipe' });
}

console.log('Generating chimes pack sounds...\n');

// === session.start: Bright ascending two-note chime ===
genMultiTone('start-chime.mp3', [
  { freq: 659, dur: 0.2, delay: 0, vol: 0.8 },    // E5
  { freq: 880, dur: 0.3, delay: 200, vol: 1.0 },   // A5
], 0.6);

genMultiTone('welcome-tone.mp3', [
  { freq: 523, dur: 0.15, delay: 0, vol: 0.7 },    // C5
  { freq: 659, dur: 0.15, delay: 150, vol: 0.8 },   // E5
  { freq: 784, dur: 0.25, delay: 300, vol: 1.0 },   // G5
], 0.7);

// === task.acknowledge: Soft single ping ===
gen('ack-ping.mp3', 'sine=frequency=1047:duration=0.12', 0.15);  // C6 quick ping

gen('soft-tap.mp3', 'sine=frequency=880:duration=0.08', 0.12);   // A5 tap

// === task.complete: Satisfying success chime ===
genMultiTone('complete-chime.mp3', [
  { freq: 523, dur: 0.15, delay: 0, vol: 0.6 },     // C5
  { freq: 659, dur: 0.15, delay: 120, vol: 0.7 },    // E5
  { freq: 784, dur: 0.15, delay: 240, vol: 0.8 },    // G5
  { freq: 1047, dur: 0.3, delay: 360, vol: 1.0 },    // C6
], 0.8);

genMultiTone('success-bell.mp3', [
  { freq: 784, dur: 0.2, delay: 0, vol: 0.8 },      // G5
  { freq: 1047, dur: 0.35, delay: 180, vol: 1.0 },   // C6
], 0.6);

// === task.error: Low warning tone ===
genMultiTone('error-buzz.mp3', [
  { freq: 220, dur: 0.2, delay: 0, vol: 1.0 },      // A3
  { freq: 207, dur: 0.2, delay: 220, vol: 0.9 },     // G#3 (slight dissonance)
], 0.5);

genMultiTone('warning-tone.mp3', [
  { freq: 330, dur: 0.15, delay: 0, vol: 0.9 },     // E4
  { freq: 262, dur: 0.25, delay: 180, vol: 1.0 },    // C4 (descending)
], 0.5);

// === input.required: Attention-getting double ding ===
genMultiTone('attention-ding.mp3', [
  { freq: 880, dur: 0.12, delay: 0, vol: 1.0 },     // A5
  { freq: 880, dur: 0.15, delay: 200, vol: 1.0 },    // A5 (repeat)
], 0.45);

genMultiTone('input-chime.mp3', [
  { freq: 698, dur: 0.12, delay: 0, vol: 0.8 },     // F5
  { freq: 880, dur: 0.18, delay: 180, vol: 1.0 },    // A5 (ascending)
], 0.5);

// === resource.limit: Descending alert ===
genMultiTone('limit-alert.mp3', [
  { freq: 659, dur: 0.15, delay: 0, vol: 1.0 },     // E5
  { freq: 440, dur: 0.15, delay: 150, vol: 0.9 },    // A4
  { freq: 330, dur: 0.2, delay: 300, vol: 0.8 },     // E4
], 0.6);

// === user.spam: Quick triple beep (playful warning) ===
genMultiTone('slow-down.mp3', [
  { freq: 587, dur: 0.06, delay: 0, vol: 0.8 },     // D5
  { freq: 587, dur: 0.06, delay: 100, vol: 0.8 },    // D5
  { freq: 587, dur: 0.06, delay: 200, vol: 0.8 },    // D5
], 0.35);

console.log('\nDone! Generated 12 sounds in packs/chimes/sounds/');
