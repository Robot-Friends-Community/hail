# Hail

```
 █████   █████  █████████  █████ █████
░░███   ░░███  ███░░░░░███░░███ ░░███
 ░███    ░███ ░███    ░███ ░███  ░███
 ░███████████ ░███████████ ░███  ░███
 ░███░░░░░███ ░███░░░░░███ ░███  ░███
 ░███    ░███ ░███    ░███ ░███  ░███
 █████   █████░███    ░███ █████ █████████
░░░░░   ░░░░░ ░░░    ░░░ ░░░░░ ░░░░░░░░░

 ╔═══════════════════════════════════════╗
 ║  Your AI agent finished. You heard it ║
 ║  because you weren't watching.  🔊    ║
 ╚═══════════════════════════════════════╝
```

[![CI](https://github.com/saasysoft/hail/actions/workflows/ci.yml/badge.svg)](https://github.com/saasysoft/hail/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18-brightgreen.svg)](https://nodejs.org)

---

## 🤔 The Problem

You tell your AI coding agent to do something. It takes 30 seconds. Maybe a minute. You alt-tab. You check Slack. You refill your coffee. You come back 4 minutes later to find it's been waiting for a permission prompt for 3 minutes and 47 seconds.

**Sound familiar?**

## 🔊 The Solution

**Hail** is a voice notification system for AI coding agents. It hooks into [Claude Code](https://claude.ai/claude-code) and plays sounds when stuff happens — so you can actually leave the terminal.

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│   Agent starts working    →  🔔 *chime*             │
│   Agent finishes task     →  🎉 *victory fanfare*   │
│   Agent hits an error     →  💥 *ominous buzz*      │
│   Agent needs your input  →  👋 *hey, look here*    │
│   You spam the prompt     →  🤨 *calm down, buddy*  │
│                                                     │
└─────────────────────────────────────────────────────┘
```

It's like a desk bell for your AI. Except instead of a bell, it might be **GLaDOS telling you the task is complete**, or **Master Chief saying "I need a weapon"**, or the **Terminator confirming "Hasta la vista, baby."**

Your choice. We don't judge.

## ⚡ Quick Start

```bash
git clone https://github.com/saasysoft/hail.git
cd hail
node bin/hail.js install    # hooks into Claude Code
node bin/hail.js test       # hear it work
```

That's it. Zero dependencies. Just Node.js 18+.

```
┌──────────────────────────┐
│ $ hail status            │
│                          │
│ Hail: ENABLED            │
│   Pack:    chimes        │
│   Volume:  75%           │
│   Mode:    random        │
│   Hooks:   7 events      │
│                          │
│ You're good to go. 🚀    │
└──────────────────────────┘
```

## 🎮 Commands

```
 ╔══════════════════════════════════════════════════════════════╗
 ║ COMMAND                 │ WHAT IT DOES                      ║
 ╠══════════════════════════════════════════════════════════════╣
 ║ hail install            │ Hook into Claude Code settings    ║
 ║ hail uninstall          │ Unhook (we'll miss you)           ║
 ║ hail status             │ Show what's up                    ║
 ║ hail test [category]    │ Play a sample sound               ║
 ║ hail packs              │ List installed sound packs        ║
 ║ hail use <pack>         │ Switch your vibe                  ║
 ║ hail volume <0-100>     │ Louder. LOUDER. Ok too loud.      ║
 ║ hail toggle             │ On/off (meeting mode)             ║
 ║ hail wizard             │ Interactive setup for new users   ║
 ╚══════════════════════════════════════════════════════════════╝
```

**Inside Claude Code:**
```
/hail use glados     ← switch pack for this session only
```

## 🎵 Sound Packs

This is where it gets fun. Pick your personality:

```
 ┌─────────────────────────────────────────────────────────────┐
 │  PACK               │ VIBE                                  │
 ├─────────────────────┼───────────────────────────────────────┤
 │  🔔 chimes          │ Clean, minimal tones. The professional│
 │  👹 peon            │ "Work work" — Warcraft Orc Peon       │
 │  🏰 peasant         │ "Yes milord" — Warcraft Human Peasant │
 │  🤖 glados          │ Passive-aggressive AI from Portal     │
 │  🪖 halo            │ Master Chief + Cortana                │
 │  🦾 terminator      │ "I'll be back" — T-800                │
 │  🪓 dota2_axe       │ AXE IS NOT AXE! — Dota 2             │
 │  💪 duke_nukem      │ Hail to the king, baby                │
 │  🪂 hd2_helldiver   │ For Super Earth! — Helldivers 2       │
 │  🚀 ra2_kirov       │ "Kirov reporting" — Red Alert 2       │
 │  👾 sc_battlecruiser │ "Set a course" — StarCraft           │
 │  🕷️ sc_kerrigan     │ Queen of Blades — StarCraft           │
 │  🔧 tf2_engineer    │ "Erectin' a dispenser" — TF2          │
 └─────────────────────┴───────────────────────────────────────┘
```

> **Pro tip:** Set `pack_rotation_mode: "random"` in config.json and Hail will
> surprise you. One minute it's Cortana, the next it's GLaDOS. Keeps you on
> your toes.

### Creating Your Own Pack

See [CONTRIBUTING.md](CONTRIBUTING.md#adding-a-sound-pack). TL;DR: make a folder, add a `manifest.json`, drop in some `.mp3` files. Done.

## 🧠 How It Works

Hail registers hooks in Claude Code's `settings.json`. When an event fires, Claude Code runs our hook script, which reads the event from stdin, maps it to a sound category, picks a random clip, and plays it. The whole thing takes ~50ms and never blocks the agent.

```
 ┌──────────────┐    stdin     ┌──────────┐   category   ┌──────────┐
 │  Claude Code ├─────JSON────▸│  router  ├────────────▸│  picker  │
 │  (hook event)│              └──────────┘              └────┬─────┘
 └──────────────┘                                             │
                                                         sound path
                                                              │
                                                         ┌────▼─────┐
                                                         │  player  │
                                                         │  🔊 🎵   │
                                                         └──────────┘
```

### Event Routing

| Hook Event | → Category | Translation |
|---|---|---|
| `SessionStart` | `session.start` | "I'm awake" |
| `SubagentStart` | `task.acknowledge` | "On it" |
| `Stop` | `task.complete` | "Done" (5s debounce) |
| `Notification` | `task.complete` | "Done" (skips idle/permission) |
| `PostToolUseFailure` | `task.error` | "Uh oh" |
| `PermissionRequest` | `input.required` | "Hey, look at me" |
| `UserPromptSubmit` | `user.spam` | "Chill" (3+ in 10s) |

## 📁 Architecture

```
hail/
├── bin/hail.js          # CLI — your remote control
├── src/
│   ├── hook.js          # stdin JSON → sound (the main event)
│   ├── hook-handle-use.js  # /hail use <pack> interceptor
│   ├── player.js        # Cross-platform audio (Win/Mac/Linux)
│   ├── config.js        # Read/write config.json
│   ├── state.js         # Anti-repeat, debounce, session tracking
│   ├── router.js        # Event → category mapping
│   ├── picker.js        # Random sound selection (no repeats)
│   └── installer.js     # Hook registration into settings.json
├── packs/               # Sound packs (swap these out!)
├── scripts/             # Generation utilities
├── config.json          # Your preferences
└── .state.json          # Runtime state (don't touch)
```

## 🖥️ Platform Support

| Platform | Audio Backend | Status |
|---|---|---|
| 🪟 Windows | PowerShell + WPF MediaPlayer | ✅ Battle-tested |
| 🍎 macOS | `afplay` | ✅ Supported |
| 🐧 Linux | `aplay` / `paplay` | ✅ Supported |

> **Windows war story:** Getting async audio on Windows was... an adventure.
> `detached: true` gets killed on parent exit. `start /b` can't access the
> audio device. The winning combo: `cmd /c start /min` + PowerShell
> `-WindowStyle Hidden` + an external `.ps1` script. If this saves you
> a week of debugging, you're welcome. ☕

## ❓ FAQ

**Q: Will this slow down my agent?**
No. Audio plays fire-and-forget in a detached process. The hook script exits in ~50ms.

**Q: Can I use this with other agents besides Claude Code?**
Currently built for Claude Code hooks, but the architecture is generic. PRs welcome for other agent systems.

**Q: My sounds aren't playing?**
Run `hail status` — check that hooks are installed and a pack with sounds is selected. Then `hail test` to verify audio works.

**Q: I'm in a meeting and it keeps going off.**
`hail toggle` — instant mute. Or `hail volume 0` if you want to feel sneaky about it.

**Q: Can I make my own pack?**
Absolutely. Manifest + sounds folder. See [CONTRIBUTING.md](CONTRIBUTING.md#adding-a-sound-pack). We generated our voice packs using ElevenLabs — go wild.

---

<div align="center">

```
 ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
 ░                                     ░
 ░   Stop watching the terminal.       ░
 ░   Start listening.             🔊   ░
 ░                                     ░
 ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
```

**Made with 🔊 by [SaaSy Labs](https://github.com/saasysoft)**

[MIT License](LICENSE) • Zero Dependencies • Node 18+

</div>
