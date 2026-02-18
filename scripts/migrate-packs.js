#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const packsDir = path.join(__dirname, '..', 'packs');

for (const pack of fs.readdirSync(packsDir)) {
  const packDir = path.join(packsDir, pack);
  const openpeonPath = path.join(packDir, 'openpeon.json');
  const manifestPath = path.join(packDir, 'manifest.json');

  if (!fs.existsSync(openpeonPath)) continue;
  if (fs.existsSync(manifestPath)) continue;

  const manifest = JSON.parse(fs.readFileSync(openpeonPath, 'utf8'));

  const hailManifest = {
    hail_version: '1.0',
    name: manifest.name || pack,
    display_name: manifest.display_name || pack,
    description: manifest.description || '',
    version: manifest.version || '1.0.0',
    author: manifest.author || { name: 'community' },
    categories: manifest.categories || {},
  };

  if (manifest.license) hailManifest.license = manifest.license;
  if (manifest.language) hailManifest.language = manifest.language;

  fs.writeFileSync(manifestPath, JSON.stringify(hailManifest, null, 2) + '\n');
  console.log('Created manifest.json for:', pack);
}
