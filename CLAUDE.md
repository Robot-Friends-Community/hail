# Hail — Voice Notification System

Cross-platform voice notification system for AI coding agents. Replacement for peon-ping.

## Architecture

```
hail/
├── bin/hail.js          # CLI entry point
├── src/
│   ├── hook.js          # Main hook handler (stdin JSON → sound)
│   ├── hook-handle-use.js  # /hail use <pack> command interceptor
│   ├── player.js        # Cross-platform audio playback
│   ├── config.js        # Config read/write/defaults
│   ├── state.js         # Session state, anti-repeat, debounce
│   ├── router.js        # Hook event → category mapping
│   ├── picker.js        # Sound selection with anti-repeat
│   └── installer.js     # Hook registration into settings.json
├── packs/               # Sound packs (each has manifest.json + sounds/)
├── config.json          # User configuration
└── .state.json          # Runtime state (auto-managed)
```

## Key Commands

```bash
node bin/hail.js install      # Register hooks
node bin/hail.js status       # Check config
node bin/hail.js test         # Play test sound
node bin/hail.js packs        # List packs
node bin/hail.js use <pack>   # Switch pack
node bin/hail.js volume <0-100>
```

## Event Routing

| Hook Event | → Category |
|---|---|
| SessionStart | session.start |
| Stop | task.complete (5s debounce) |
| Notification | task.complete (skip permission/idle) |
| PermissionRequest | input.required |
| UserPromptSubmit | user.spam (3+ in 10s) |
| PostToolUseFailure | task.error |
| SubagentStart | task.acknowledge |

## Pack Format

Packs use `manifest.json` (or `openpeon.json` for backward compat). Each category has an array of sounds with `file` and `label` fields.

## Volume

Config uses 0-100 scale. Internally converted to 0.0-1.0 for audio APIs.

## Rules

- All audio playback is fire-and-forget (async, non-blocking)
- Hook handler reads stdin JSON, must exit quickly
- State file is best-effort (silent failures OK)
- Pack name validation: alphanumeric, underscore, hyphen only
