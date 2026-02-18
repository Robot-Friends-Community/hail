# Hail

[![CI](https://github.com/saasysoft/hail/actions/workflows/ci.yml/badge.svg)](https://github.com/saasysoft/hail/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18-brightgreen.svg)](https://nodejs.org)

Cross-platform voice notification system for AI coding agents. Get audio cues when tasks complete, errors occur, or input is needed — so you can step away from the screen.

## Why Hail?

AI coding agents (Claude Code, etc.) run tasks that take seconds to minutes. Instead of watching a terminal, Hail plays sounds when things happen:

- **Task complete** — hear a chime when your agent finishes
- **Input required** — get pinged when a permission prompt is waiting
- **Error** — know immediately when something breaks
- **Session start** — confirmation your session is live

## Quick Start

```bash
# Clone and install hooks
git clone https://github.com/saasysoft/hail.git
cd hail
node bin/hail.js install

# Test it
node bin/hail.js test

# Pick a sound pack
node bin/hail.js packs
node bin/hail.js use chimes
```

**Zero dependencies.** Just Node.js 18+.

## Commands

| Command | Description |
|---|---|
| `hail install` | Register hooks in Claude Code settings |
| `hail uninstall` | Remove hooks |
| `hail status` | Show current configuration |
| `hail test [category]` | Play a test sound |
| `hail packs` | List installed sound packs |
| `hail use <pack>` | Switch active pack |
| `hail volume <0-100>` | Set volume level |
| `hail toggle` | Enable/disable sounds |
| `hail wizard` | Interactive setup |

## Sound Packs

### Included Packs

| Pack | Description |
|---|---|
| `chimes` | Minimal synthesized tones (non-voice) |
| `sc_kerrigan` | Sarah Kerrigan (StarCraft) |
| `peon` | Orc Peon (Warcraft) |
| `glados` | GLaDOS (Portal) |
| `dota2_axe` | Axe (Dota 2) |
| `duke_nukem` | Duke Nukem |
| `hd2_helldiver` | Helldiver (Helldivers 2) |
| `peasant` | Human Peasant (Warcraft) |
| `ra2_kirov` | Kirov Airship (Red Alert 2) |
| `sc_battlecruiser` | Battlecruiser (StarCraft) |
| `tf2_engineer` | Engineer (TF2) |

### Creating a Pack

See [CONTRIBUTING.md](CONTRIBUTING.md#adding-a-sound-pack) for the pack format. Each pack has a `manifest.json` and a `sounds/` directory.

## Event Routing

| Hook Event | Category | When |
|---|---|---|
| SessionStart | `session.start` | New session begins |
| SubagentStart | `task.acknowledge` | Subagent starts working |
| Stop | `task.complete` | Task finishes (5s debounce) |
| Notification | `task.complete` | Task notification (skips permission/idle) |
| PostToolUseFailure | `task.error` | Tool or command fails |
| PermissionRequest | `input.required` | Permission prompt waiting |
| UserPromptSubmit | `user.spam` | 3+ rapid prompts in 10s |

## Platform Support

| Platform | Audio Backend |
|---|---|
| Windows | PowerShell + WPF MediaPlayer |
| macOS | `afplay` |
| Linux | `aplay` (WAV) / `paplay` (other) |

## Architecture

```
hail/
├── bin/hail.js          # CLI entry point
├── src/
│   ├── hook.js          # Main hook handler (stdin JSON -> sound)
│   ├── player.js        # Cross-platform audio playback
│   ├── config.js        # Config read/write/defaults
│   ├── state.js         # Session state, anti-repeat, debounce
│   ├── router.js        # Hook event -> category mapping
│   ├── picker.js        # Sound selection with anti-repeat
│   └── installer.js     # Hook registration into settings.json
├── packs/               # Sound packs
├── scripts/             # Utilities (pack generator, etc.)
├── config.json          # User configuration
└── .state.json          # Runtime state (auto-managed)
```

## License

[MIT](LICENSE)
