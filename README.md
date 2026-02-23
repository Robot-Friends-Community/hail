# Hail

```
  _    _          _____  _
 | |  | |   /\   |_   _|| |
 | |__| |  /  \    | |  | |
 |  __  | / /\ \   | |  | |
 | |  | |/ ____ \ _| |_ | |____
 |_|  |_/_/    \_\_____|______|

 Your AI agent finished. You heard it
 because you weren't watching.
```

[![CI](https://github.com/saasysoft/hail/actions/workflows/ci.yml/badge.svg)](https://github.com/saasysoft/hail/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18-brightgreen.svg)](https://nodejs.org)
[![Zero Dependencies](https://img.shields.io/badge/dependencies-0-brightgreen.svg)](#)

---

## The Problem

You tell your AI coding agent to do something. It takes 30 seconds. Maybe a minute. You alt-tab. You check Slack. You refill your coffee. You come back 4 minutes later to find it's been waiting for a permission prompt for 3 minutes and 47 seconds.

**Sound familiar?**

## The Solution

**Hail** is a voice notification system for AI coding agents. It hooks into [Claude Code](https://docs.anthropic.com/en/docs/claude-code) and plays sounds when stuff happens -- so you can actually leave the terminal.

```
  Agent starts working    -->  *chime*
  Agent finishes task     -->  *victory fanfare*
  Agent hits an error     -->  *ominous buzz*
  Agent needs your input  -->  *hey, look here*
  You spam the prompt     -->  *calm down, buddy*
```

It's like a desk bell for your AI. Except instead of a bell, it might be **GLaDOS telling you the task is complete**, or **Master Chief saying "I need a weapon"**, or the **Terminator confirming "Hasta la vista, baby."**

Your choice. We don't judge.

---

## Quick Start

### Prerequisites

- **Node.js 18+** ([download](https://nodejs.org))
- **Claude Code** installed and configured
- **Audio output** (speakers or headphones -- yes, really)

**Platform-specific audio requirements:**

| Platform | Required     | Notes                                    |
|----------|-------------|------------------------------------------|
| Windows  | PowerShell  | Built-in, uses WPF MediaPlayer           |
| macOS    | `afplay`    | Built-in on all Macs                     |
| Linux    | `paplay`    | PulseAudio (most distros) or `aplay`     |

### Install

```bash
# Clone the repo
git clone https://github.com/saasysoft/hail.git
cd hail

# Register hooks in Claude Code
node bin/hail.js install

# Hear it work
node bin/hail.js test
```

That's it. **Zero npm dependencies.** No `npm install` needed.

The `install` command does three things:
1. Registers event hooks in your Claude Code `~/.claude/settings.json`
2. Copies the `/hail` skill so you can use slash commands inside Claude Code
3. Creates a default `config.json` if one doesn't exist

### Verify

```bash
node bin/hail.js status
```

You should see:

```
Hail: ENABLED
  Pack:    chimes
  Volume:  50%
  Mode:    random
  Hooks:   7 events registered
```

### Uninstall

```bash
node bin/hail.js uninstall
```

Cleanly removes all hooks from `settings.json`. Your sound packs and config stay untouched.

---

## Commands

```
  COMMAND                   WHAT IT DOES
  -------------------------+--------------------------------------
  hail install              Register hooks in Claude Code settings
  hail uninstall            Remove hooks (we'll miss you)
  hail status               Show what's up
  hail test [category]      Play a sample sound
  hail packs                List installed sound packs
  hail use <pack>           Switch your vibe
  hail volume <0-100>       Set volume (0 = stealth mode)
  hail toggle               Enable/disable (meeting mode)
  hail wizard               Interactive setup for new users
```

**Inside Claude Code:**
```
/hail use glados       <-- switch pack for this session only
/hail browse           <-- list all packs
/hail config           <-- show/change settings
/hail toggle           <-- mute/unmute
```

---

## Sound Packs

Pick your personality:

```
  PACK                VIBE
  -------------------+---------------------------------------
  chimes              Clean, minimal tones. The professional.
  peon                "Work work" -- Warcraft Orc Peon
  peasant             "Yes milord" -- Warcraft Human Peasant
  glados              Passive-aggressive AI from Portal
  halo                Master Chief + Cortana
  terminator          "I'll be back" -- T-800
  dota2_axe           AXE IS NOT AXE! -- Dota 2
  duke_nukem          Hail to the king, baby
  hd2_helldiver       For Super Earth! -- Helldivers 2
  ra2_kirov           "Kirov reporting" -- Red Alert 2
  sc_battlecruiser    "Set a course" -- StarCraft
  sc_kerrigan         Queen of Blades -- StarCraft
  tf2_engineer        "Erectin' a dispenser" -- TF2
  informative         Clean status announcements
```

> **Pro tip:** Set `pack_rotation_mode: "random"` in config.json and add packs
> to `pack_rotation`. Hail will surprise you each session. One minute it's
> Cortana, the next it's GLaDOS.

### Creating Your Own Pack

See [CONTRIBUTING.md](CONTRIBUTING.md#adding-a-sound-pack). TL;DR:

1. Create `packs/my-pack/manifest.json`
2. Drop `.mp3` files into `packs/my-pack/sounds/`
3. Map sounds to categories in the manifest
4. Run `hail use my-pack` and test

---

## Configuration

Config file: `config.json` (in the hail root directory)

```json
{
  "enabled": true,
  "active_pack": "chimes",
  "volume": 50,
  "pack_rotation": [],
  "pack_rotation_mode": "random",
  "annoyed_threshold": 3,
  "annoyed_window_seconds": 10,
  "session_ttl_days": 7,
  "categories": {
    "session.start": true,
    "task.acknowledge": true,
    "task.complete": true,
    "task.error": true,
    "input.required": true,
    "resource.limit": true,
    "user.spam": true
  }
}
```

| Setting                   | Type     | Default    | Description                                      |
|---------------------------|----------|------------|--------------------------------------------------|
| `enabled`                 | boolean  | `true`     | Master on/off switch                             |
| `active_pack`             | string   | `"chimes"` | Current sound pack                               |
| `volume`                  | number   | `50`       | Volume 0-100                                     |
| `pack_rotation`           | string[] | `[]`       | Packs to rotate (empty = active_pack only)       |
| `pack_rotation_mode`      | string   | `"random"` | `random`, `round-robin`, or `agentskill`         |
| `annoyed_threshold`       | number   | `3`        | Rapid prompts before user.spam triggers          |
| `annoyed_window_seconds`  | number   | `10`       | Time window for annoyed detection                |
| `session_ttl_days`        | number   | `7`        | Expire stale session pack assignments            |
| `categories`              | object   | all `true` | Toggle individual sound categories on/off        |

### Pack Rotation Modes

- **random** -- picks a random pack from `pack_rotation` each session
- **round-robin** -- cycles through `pack_rotation` in order
- **agentskill** -- per-session assignments via `/hail use <pack>` in Claude Code

---

## How It Works

Hail registers hooks in Claude Code's `settings.json`. When an event fires, Claude Code pipes JSON to stdin of the hook script. Hail reads it, maps the event to a sound category, picks a random clip (no repeats), and plays it. The whole thing takes ~50ms and never blocks the agent.

```
  Claude Code          router           picker          player
  (hook event)
       |                  |                |               |
       |--- stdin JSON -->|                |               |
       |                  |-- category --->|               |
       |                  |                |-- sound path->|
       |                  |                |               |-- play -->
       |                  |                |               |
```

### Event Routing

| Hook Event          | Category           | Translation              |
|---------------------|--------------------|--------------------------|
| `SessionStart`      | `session.start`    | "I'm awake"              |
| `SubagentStart`     | `task.acknowledge` | "On it"                  |
| `Stop`              | `task.complete`    | "Done" (5s debounce)     |
| `Notification`      | `task.complete`    | "Done" (skip idle)       |
| `PostToolUseFailure`| `task.error`       | "Uh oh"                  |
| `PermissionRequest` | `input.required`   | "Hey, look at me"        |
| `UserPromptSubmit`  | `user.spam`        | "Chill" (3+ in 10s)      |

---

## Architecture

```
hail/
  bin/hail.js            CLI -- your remote control
  src/
    hook.js              stdin JSON --> sound (the main event)
    hook-handle-use.js   /hail use <pack> interceptor
    player.js            Cross-platform audio (Win/Mac/Linux)
    config.js            Read/write config.json
    state.js             Anti-repeat, debounce, session tracking
    router.js            Event --> category mapping
    picker.js            Random sound selection (no repeats)
    installer.js         Hook registration into settings.json
  packs/                 Sound packs (swap these out)
  skills/                Claude Code skill definition
  scripts/               Pack generation utilities
  config.json            Your preferences
  .state.json            Runtime state (auto-managed)
```

---

## Platform Support

| Platform  | Audio Backend                  | Status         |
|-----------|-------------------------------|----------------|
| Windows   | PowerShell + WPF MediaPlayer  | Battle-tested  |
| macOS     | `afplay`                      | Supported      |
| Linux     | `aplay` / `paplay`            | Supported      |

> **Windows note:** Getting async audio on Windows was an adventure.
> `detached: true` gets killed on parent exit. `start /b` can't access the
> audio device. The winning combo: `cmd /c start /min` + PowerShell
> `-WindowStyle Hidden` + an external `.ps1` script. If this saves you a
> week of debugging, you're welcome.

---

## Using with Claude Code

Once installed, Hail works automatically in the background. But you also get
a `/hail` slash command inside Claude Code for on-the-fly control:

```
/hail                   Interactive setup wizard
/hail use <pack>        Switch voice pack for this session
/hail browse            List all packs with descriptions
/hail config            Show/change current settings
/hail toggle            Mute/unmute sounds
/hail volume <0-100>    Set volume
```

The `/hail use <pack>` command is intercepted by a `UserPromptSubmit` hook
before it reaches the model -- zero tokens used, instant response.

---

## FAQ

**Q: Will this slow down my agent?**
No. Audio plays fire-and-forget in a detached process. The hook script exits in ~50ms.

**Q: Can I use this with other agents besides Claude Code?**
Currently built for Claude Code hooks, but the architecture is generic. The hook handler reads JSON from stdin -- any system that can pipe event JSON can use it. PRs welcome.

**Q: My sounds aren't playing?**
Run `node bin/hail.js status` -- check that hooks are installed and a pack with sounds is selected. Then `node bin/hail.js test` to verify audio works. On Linux, make sure `paplay` or `aplay` is available.

**Q: I'm in a meeting and it keeps going off.**
`node bin/hail.js toggle` -- instant mute. Or use `/hail toggle` inside Claude Code.

**Q: Can I make my own pack?**
Absolutely. See [CONTRIBUTING.md](CONTRIBUTING.md#adding-a-sound-pack). We generated our voice packs using AI TTS -- go wild.

**Q: How do I update?**
`git pull` in the hail directory. Your config.json and custom packs are preserved.

---

<div align="center">

```
  +--------------------------------------------+
  |                                            |
  |   Stop watching your terminal.             |
  |   Start listening to it.                   |
  |                                            |
  +--------------------------------------------+
```

**Made by [SaaSy Labs](https://github.com/saasysoft)**

[MIT License](LICENSE) | Zero Dependencies | Node 18+

</div>
