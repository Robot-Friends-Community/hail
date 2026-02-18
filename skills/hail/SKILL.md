# Hail — Voice Notification Control

Voice notification system for AI coding agents. Configure sound packs, volume, and categories without leaving your editor.

## Triggers
- `/hail` or `/hail setup` — guided setup wizard
- `/hail use <pack>` — switch voice pack for current session
- `/hail config` — show/change current settings
- `/hail browse` — list all packs with descriptions

## Commands

### `/hail` or `/hail setup`
Run the interactive setup wizard:
1. Show available packs with descriptions
2. Let user pick a pack
3. Test a sound from the chosen pack
4. Set volume
5. Confirm and apply

Execute setup by running shell commands:
```bash
# List packs
node "C:/Dev/_PROJECTS/_SAASY-LABS/SaaSy_DEV/hail/bin/hail.js" packs

# Test a sound
node "C:/Dev/_PROJECTS/_SAASY-LABS/SaaSy_DEV/hail/bin/hail.js" test session.start
```

Then use AskUserQuestion to let the user pick options interactively.

### `/hail use <pack>`
Switch voice pack for the current session. This sets the pack only for this terminal session — other sessions keep their own pack.

The pack name is the argument after "use". Execute:
```bash
node "C:/Dev/_PROJECTS/_SAASY-LABS/SaaSy_DEV/hail/bin/hail.js" use <pack>
```

### `/hail config`
Show current Hail configuration. Execute:
```bash
node "C:/Dev/_PROJECTS/_SAASY-LABS/SaaSy_DEV/hail/bin/hail.js" status
```

Present results to the user. Offer to change volume, toggle categories, or switch packs.

### `/hail browse`
List all installed packs with their descriptions and sound counts. Execute:
```bash
node "C:/Dev/_PROJECTS/_SAASY-LABS/SaaSy_DEV/hail/bin/hail.js" packs
```

For each pack, show:
- Pack name and display name
- Number of sounds
- Whether it's the active pack

Offer to test sounds from any pack:
```bash
node "C:/Dev/_PROJECTS/_SAASY-LABS/SaaSy_DEV/hail/bin/hail.js" use <pack>
node "C:/Dev/_PROJECTS/_SAASY-LABS/SaaSy_DEV/hail/bin/hail.js" test task.complete
```

### Volume Control
```bash
node "C:/Dev/_PROJECTS/_SAASY-LABS/SaaSy_DEV/hail/bin/hail.js" volume <0-100>
```

### Toggle On/Off
```bash
node "C:/Dev/_PROJECTS/_SAASY-LABS/SaaSy_DEV/hail/bin/hail.js" toggle
```

## Available Categories
- `session.start` — New session begins
- `task.acknowledge` — Subagent starts working
- `task.complete` — Task finishes
- `task.error` — Tool/command fails
- `input.required` — Permission needed
- `resource.limit` — Resource constraint hit
- `user.spam` — Rapid repeated prompts

## Notes
- All commands delegate to the `hail` CLI for actual operations
- Pack changes via `/hail use` are session-scoped (won't affect other terminals)
- Global config changes (volume, toggle) affect all sessions
