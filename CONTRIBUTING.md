# Contributing to Hail

Thanks for your interest in contributing to Hail!

## Development Setup

```bash
git clone https://github.com/saasysoft/hail.git
cd hail
npm test  # Run tests (no dependencies to install)
```

Hail has **zero npm dependencies** — just Node.js 18+.

## Branch Strategy

This is a solo-maintained repo. Work happens on `main`.

- Create feature branches from `main`
- Open a PR for review before merging
- Keep commits focused and well-described

## Adding a Sound Pack

1. Create a directory under `packs/your-pack-name/`
2. Add a `manifest.json` following the pack format (see existing packs)
3. Add sound files in `packs/your-pack-name/sounds/`
4. Supported formats: `.mp3`, `.wav`, `.ogg`
5. Keep individual sounds under 500KB and under 5 seconds

### manifest.json Format

```json
{
  "hail_version": "1.0",
  "name": "your-pack-name",
  "display_name": "Your Pack Name",
  "description": "Brief description",
  "version": "1.0.0",
  "author": { "name": "your-name" },
  "categories": {
    "session.start": {
      "sounds": [
        { "file": "sounds/start.mp3", "label": "Start sound" }
      ]
    }
  }
}
```

### Categories

| Category | When it plays |
|---|---|
| `session.start` | New session begins |
| `task.acknowledge` | Subagent starts working |
| `task.complete` | Task finishes |
| `task.error` | Tool/command fails |
| `input.required` | Permission needed |
| `resource.limit` | Resource constraint |
| `user.spam` | Rapid repeated prompts |

## Code Style

- No external dependencies unless absolutely necessary
- All audio playback is fire-and-forget (non-blocking)
- Hook handler must exit quickly
- State file operations are best-effort (silent failures OK)
- Test with `npm test` before submitting

## Reporting Bugs

Use the [bug report template](https://github.com/saasysoft/hail/issues/new?template=bug_report.yml). Include:
- Your OS and Node.js version
- Steps to reproduce
- Expected vs actual behavior
