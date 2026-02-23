---
name: hail
description: "Voice notification system for AI coding agents. Configure sound packs, volume, categories, pack rotation, and trainer mode. Use when user says \"hail\", \"voice pack\", \"sound notifications\", \"toggle sounds\", \"mute\", \"unmute\", \"exercise\", \"pushups\", \"squats\", \"log reps\", or wants to change notification sounds."
user_invocable: true
---

# Hail — Voice Notification System

Cross-platform voice notification system for AI coding agents. Manage sound packs, volume, categories, rotation modes, and the exercise trainer — all from your editor.

## CLI Path

```
node "C:/Dev/_PROJECTS/_SAASY-LABS/SaaSy_DEV/hail/bin/hail.js"
```

All commands below use this path. Abbreviated as `hail` in examples.

## Triggers

- `/hail` or `/hail setup` — guided setup wizard
- `/hail use <pack>` — switch voice pack
- `/hail config` — show/change current settings
- `/hail browse` — list all packs with descriptions
- `/hail toggle` — mute/unmute sounds
- `/hail volume <0-100>` — set volume
- `/hail log <count> <exercise>` — log exercise reps (trainer)

## Commands

### `/hail` or `/hail setup`
Run the interactive setup wizard:
1. Show available packs with descriptions
2. Let user pick a pack
3. Test a sound from the chosen pack
4. Set volume
5. Confirm and apply

```bash
node "C:/Dev/_PROJECTS/_SAASY-LABS/SaaSy_DEV/hail/bin/hail.js" packs
node "C:/Dev/_PROJECTS/_SAASY-LABS/SaaSy_DEV/hail/bin/hail.js" test session.start
```

Then use AskUserQuestion to let the user pick options interactively.

### `/hail use <pack>`
Switch voice pack. The pack name is the argument after "use".

```bash
node "C:/Dev/_PROJECTS/_SAASY-LABS/SaaSy_DEV/hail/bin/hail.js" use <pack>
```

### `/hail config`
Show current configuration.

```bash
node "C:/Dev/_PROJECTS/_SAASY-LABS/SaaSy_DEV/hail/bin/hail.js" status
```

Present results to the user. Offer to change volume, toggle categories, or switch packs.

To change config values, read and edit the config file directly:
```
C:/Dev/_PROJECTS/_SAASY-LABS/SaaSy_DEV/hail/config.json
```

### `/hail browse`
List all installed packs with their descriptions and sound counts.

```bash
node "C:/Dev/_PROJECTS/_SAASY-LABS/SaaSy_DEV/hail/bin/hail.js" packs
```

Offer to test sounds from any pack:
```bash
node "C:/Dev/_PROJECTS/_SAASY-LABS/SaaSy_DEV/hail/bin/hail.js" use <pack>
node "C:/Dev/_PROJECTS/_SAASY-LABS/SaaSy_DEV/hail/bin/hail.js" test task.complete
```

### `/hail volume <0-100>`
```bash
node "C:/Dev/_PROJECTS/_SAASY-LABS/SaaSy_DEV/hail/bin/hail.js" volume <0-100>
```

### `/hail toggle`
```bash
node "C:/Dev/_PROJECTS/_SAASY-LABS/SaaSy_DEV/hail/bin/hail.js" toggle
```

### `/hail install`
Register Hail hooks in Claude Code settings.json (replaces peon-ping if present):
```bash
node "C:/Dev/_PROJECTS/_SAASY-LABS/SaaSy_DEV/hail/bin/hail.js" install
```

### `/hail uninstall`
Remove Hail hooks from settings.json:
```bash
node "C:/Dev/_PROJECTS/_SAASY-LABS/SaaSy_DEV/hail/bin/hail.js" uninstall
```

## Config Options

Config file: `C:/Dev/_PROJECTS/_SAASY-LABS/SaaSy_DEV/hail/config.json`

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `enabled` | boolean | `true` | Master on/off switch |
| `active_pack` | string | `"peon"` | Current sound pack |
| `volume` | number | `50` | Volume 0-100 |
| `pack_rotation` | string[] | `[]` | Packs to rotate through (empty = use active_pack only) |
| `pack_rotation_mode` | string | `"random"` | `"random"`, `"round-robin"`, or `"agentskill"` (per-session) |
| `annoyed_threshold` | number | `3` | Rapid prompts before user.spam triggers |
| `annoyed_window_seconds` | number | `10` | Time window for annoyed threshold |
| `session_ttl_days` | number | `7` | Expire stale session pack assignments |
| `silent_window_seconds` | number | `0` | Suppress task.complete for tasks shorter than N seconds |
| `desktop_notifications` | boolean | `true` | Toggle desktop notification popups |
| `categories` | object | all `true` | Toggle individual sound categories |

To update config: read the file with Read tool, edit with Edit tool, confirm to user.

## Sound Categories

- `session.start` — New session begins
- `task.acknowledge` — Subagent starts working
- `task.complete` — Task finishes
- `task.error` — Tool/command fails
- `input.required` — Permission needed
- `resource.limit` — Resource constraint hit
- `user.spam` — Rapid repeated prompts

## Pack Rotation Modes

- **random**: Picks a random pack from `pack_rotation` each session
- **round-robin**: Cycles through `pack_rotation` in order
- **agentskill**: Uses per-session assignments (set via `/hail use <pack>` inside Claude Code); falls back to `active_pack` if no assignment

## Exercise Trainer

The trainer tracks exercise reps (pushups, squats) during coding sessions with motivational voice lines.

### `/hail log <count> <exercise>`
Log exercise reps. Run:

```bash
bash "${CLAUDE_CONFIG_DIR:-$HOME/.claude}"/hooks/peon-ping/peon.sh trainer log <count> <exercise>
```

Examples:
```bash
bash ~/.claude/hooks/peon-ping/peon.sh trainer log 25 pushups
bash ~/.claude/hooks/peon-ping/peon.sh trainer log 30 squats
```

### Check trainer status
```bash
bash ~/.claude/hooks/peon-ping/peon.sh trainer status
```

### Enable/disable trainer
```bash
bash ~/.claude/hooks/peon-ping/peon.sh trainer on
bash ~/.claude/hooks/peon-ping/peon.sh trainer off
```

## Notes

- All audio playback is fire-and-forget (async, non-blocking)
- Pack changes via `/hail use` inside Claude Code are session-scoped
- Global config changes (volume, toggle) affect all sessions
- Node.js >= 18.0.0 required
- Trainer uses the legacy peon-ping hook scripts (migration to hail CLI planned)
