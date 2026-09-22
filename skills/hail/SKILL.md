---
name: hail
description: "Hail · Signal Station — voice notifications for Claude Code. Configure sound packs, volume, categories and pack rotation from inside a session. Use when user says \"hail\", \"voice pack\", \"sound notifications\", \"toggle sounds\", \"mute\", \"unmute\", or wants to change notification sounds."
user_invocable: true
---

# Hail — voice notifications for Claude Code

Hail plays a sound when the agent starts, finishes, errors, or needs you. This skill is the
in-session remote control for it.

## CLI path

```
node "{{HAIL_DIR}}/bin/hail.js"
```

`{{HAIL_DIR}}` is filled in by `node bin/hail.js install` (it points at wherever the hail repo was
cloned). If you see the literal placeholder, run `install` from the hail folder again. Every
snippet below uses the full command — `hail` is not on PATH.

## Triggers

- `/hail` or `/hail setup` — guided setup
- `/hail use <pack>` — switch voice pack (session-scoped; intercepted by a hook, no tokens spent)
- `/hail browse` — list all packs with descriptions
- `/hail config` — show/change current settings
- `/hail toggle` — mute/unmute (meeting mode)
- `/hail volume <0-100>` — set volume

## Commands

### `/hail` or `/hail setup`
1. List packs: `node "{{HAIL_DIR}}/bin/hail.js" packs`
2. Let the user pick one (AskUserQuestion)
3. Test it: `node "{{HAIL_DIR}}/bin/hail.js" use <pack>` then `… test task.complete`
4. Set volume: `node "{{HAIL_DIR}}/bin/hail.js" volume <0-100>`
5. Confirm with `node "{{HAIL_DIR}}/bin/hail.js" status`

### `/hail use <pack>`
```bash
node "{{HAIL_DIR}}/bin/hail.js" use <pack>
```

### `/hail browse`
```bash
node "{{HAIL_DIR}}/bin/hail.js" packs
```
Offer to test any pack: `node "{{HAIL_DIR}}/bin/hail.js" use <pack>` then `… test task.complete`.

### `/hail config`
```bash
node "{{HAIL_DIR}}/bin/hail.js" status
```
Present the result. To change a value the CLI doesn't cover, edit `{{HAIL_DIR}}/config.json`
with the Edit tool and confirm to the user.

### `/hail toggle`
```bash
node "{{HAIL_DIR}}/bin/hail.js" toggle
```

### `/hail volume <0-100>`
```bash
node "{{HAIL_DIR}}/bin/hail.js" volume <0-100>
```

### `/hail install` / `/hail uninstall`
```bash
node "{{HAIL_DIR}}/bin/hail.js" install      # register hooks in ~/.claude/settings.json (+ refresh this skill)
node "{{HAIL_DIR}}/bin/hail.js" uninstall    # remove the hooks; config and packs untouched
```

## Config reference

File: `{{HAIL_DIR}}/config.json`

| Setting | Type | Default | Description |
|---|---|---|---|
| `enabled` | boolean | `true` | Master on/off switch |
| `active_pack` | string | `"chimes"` | Current sound pack |
| `volume` | number | `50` | Volume 0–100 |
| `pack_rotation` | string[] | `[]` | Packs to rotate through (empty = `active_pack` only) |
| `pack_rotation_mode` | string | `"random"` | `random`, `round-robin`, or `agentskill` (per-session) |
| `annoyed_threshold` | number | `3` | Rapid prompts before `user.spam` fires |
| `annoyed_window_seconds` | number | `10` | Window for the annoyed threshold |
| `session_ttl_days` | number | `7` | Expire stale per-session pack assignments |
| `categories` | object | all `true` | Toggle individual sound categories |

## Sound categories

`session.start` · `task.acknowledge` · `task.complete` · `task.error` · `input.required` ·
`resource.limit` · `user.spam`

## Notes

- Audio is fire-and-forget (async, never blocks the agent).
- `/hail use` changes are session-scoped; volume/toggle are global.
- Node.js ≥ 18 required, no dependencies.
