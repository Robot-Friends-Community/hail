#!/usr/bin/env node
/**
 * TTS Pack Generator for Hail.
 * Generates voice clips for a pack using ElevenLabs or Kie.ai TTS.
 *
 * Usage:
 *   node scripts/generate-pack.js --pack informative --provider elevenlabs --voice <voice_id>
 *   node scripts/generate-pack.js --pack informative --provider kie
 *
 * Reads the manifest.json from the pack directory and generates audio files
 * for any sounds that don't already exist.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const args = process.argv.slice(2);
const packName = getArg('--pack') || 'informative';
const provider = getArg('--provider') || 'elevenlabs';
const voiceId = getArg('--voice') || 'EXAVITQu4vr4xnSDxMaL'; // ElevenLabs default (Sarah)
const apiKey = getArg('--api-key') || process.env.ELEVENLABS_API_KEY;

function getArg(name) {
  const idx = args.indexOf(name);
  return idx >= 0 && args[idx + 1] ? args[idx + 1] : null;
}

async function main() {
  const packDir = path.join(__dirname, '..', 'packs', packName);
  const manifestPath = path.join(packDir, 'manifest.json');

  if (!fs.existsSync(manifestPath)) {
    console.error(`Manifest not found: ${manifestPath}`);
    process.exit(1);
  }

  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const soundsDir = path.join(packDir, 'sounds');
  if (!fs.existsSync(soundsDir)) fs.mkdirSync(soundsDir, { recursive: true });

  let generated = 0;
  let skipped = 0;

  for (const [category, data] of Object.entries(manifest.categories)) {
    if (!data.sounds) continue;

    for (const sound of data.sounds) {
      const soundPath = path.join(packDir, sound.file);

      if (fs.existsSync(soundPath)) {
        console.log(`  Skip (exists): ${sound.file}`);
        skipped++;
        continue;
      }

      const text = sound.label;
      if (!text) {
        console.log(`  Skip (no label): ${sound.file}`);
        skipped++;
        continue;
      }

      console.log(`  Generating: ${sound.file} — "${text}"`);

      try {
        if (provider === 'elevenlabs') {
          await generateElevenLabs(text, soundPath, voiceId, apiKey);
        } else {
          console.log(`    Provider '${provider}' not yet implemented. Add your TTS API here.`);
          continue;
        }
        generated++;
      } catch (err) {
        console.error(`    Error: ${err.message}`);
      }

      // Rate limit: wait between requests
      await new Promise(r => setTimeout(r, 500));
    }
  }

  console.log(`\nDone! Generated: ${generated}, Skipped: ${skipped}`);
}

function generateElevenLabs(text, outputPath, voice, key) {
  if (!key) {
    return Promise.reject(new Error('ELEVENLABS_API_KEY not set. Use --api-key or set env var.'));
  }

  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      text,
      model_id: 'eleven_monolingual_v1',
      voice_settings: { stability: 0.75, similarity_boost: 0.75 },
    });

    const options = {
      hostname: 'api.elevenlabs.io',
      path: `/v1/text-to-speech/${voice}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': key,
        'Accept': 'audio/mpeg',
      },
    };

    const req = https.request(options, (res) => {
      if (res.statusCode !== 200) {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => reject(new Error(`ElevenLabs API ${res.statusCode}: ${data}`)));
        return;
      }

      const file = fs.createWriteStream(outputPath);
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
      file.on('error', reject);
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

main().catch(err => {
  console.error('Fatal:', err.message);
  process.exit(1);
});
