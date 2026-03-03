<!--
╔═[ HAIL  //  ROBOT FRIENDS COMMUNITY EDITION ]══════════════════════════════╗
║                                                                            ║
║                        ██╗  ██╗ █████╗ ██╗██╗                              ║
║                        ██║  ██║██╔══██╗██║██║                              ║
║                        ███████║███████║██║██║                              ║
║                        ██╔══██║██╔══██║██║██║                              ║
║                        ██║  ██║██║  ██║██║███████╗                         ║
║                        ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝╚══════╝                         ║
║                                                                            ║
║               ██╗     ██╗███████╗████████╗███████╗███╗   ██╗               ║
║               ██║     ██║██╔════╝╚══██╔══╝██╔════╝████╗  ██║               ║
║               ██║     ██║███████╗   ██║   █████╗  ██╔██╗ ██║               ║
║               ██║     ██║╚════██║   ██║   ██╔══╝  ██║╚██╗██║               ║
║               ███████╗██║███████║   ██║   ███████╗██║ ╚████║               ║
║               ╚══════╝╚═╝╚══════╝   ╚═╝   ╚══════╝╚═╝  ╚═══╝               ║
║                                                                            ║
╚═[ HAIL  //  ROBOT FRIENDS COMMUNITY EDITION ]══════════════════════════════╝
-->

```
╔═[ HAIL  //  ROBOT FRIENDS COMMUNITY EDITION ]══════════════════════════════╗
║                                                                            ║
║                        ██╗  ██╗ █████╗ ██╗██╗                              ║
║                        ██║  ██║██╔══██╗██║██║                              ║
║                        ███████║███████║██║██║                              ║
║                        ██╔══██║██╔══██║██║██║                              ║
║                        ██║  ██║██║  ██║██║███████╗                         ║
║                        ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝╚══════╝                         ║
║                                                                            ║
║               ██╗     ██╗███████╗████████╗███████╗███╗   ██╗               ║
║               ██║     ██║██╔════╝╚══██╔══╝██╔════╝████╗  ██║               ║
║               ██║     ██║███████╗   ██║   █████╗  ██╔██╗ ██║               ║
║               ██║     ██║╚════██║   ██║   ██╔══╝  ██║╚██╗██║               ║
║               ███████╗██║███████║   ██║   ███████╗██║ ╚████║               ║
║               ╚══════╝╚═╝╚══════╝   ╚═╝   ╚══════╝╚═╝  ╚═══╝               ║
║                                                                            ║
╚═[ HAIL  //  ROBOT FRIENDS COMMUNITY EDITION ]══════════════════════════════╝
```

---

<div align="center">

**Your AI agent finished. You heard it because you weren't watching.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18-brightgreen.svg)](https://nodejs.org)
[![Zero Dependencies](https://img.shields.io/badge/dependencies-0-brightgreen.svg)](#)
[![Community](https://img.shields.io/badge/Robot%20Friends-Community-orange?style=flat)](https://github.com/Robot-Friends-Community)

</div>

---

## What Is This?

You tell your AI coding agent to do something. It takes 30 seconds. Maybe a minute. You alt-tab. You check Slack. You refill your coffee. You come back 4 minutes later to find it's been waiting for a permission prompt for 3 minutes and 47 seconds.

**Sound familiar?**

**Hail** is a voice notification system for AI coding agents. It hooks into [Claude Code](https://docs.anthropic.com/en/docs/claude-code) and plays sounds when stuff happens — so you can actually leave the terminal.

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

## Who Is This For?

| Audience | Use Case |
|----------|----------|
| Developers using Claude Code | Get notified when long tasks complete without watching the terminal |
| Power users running multi-step agent workflows | Know exactly when the agent finishes, errors, or needs input |
| Anyone who context-switches while their AI works | Stop losing time waiting at a terminal that already finished |
| Streamers / content creators | Add character to your AI coding sessions with iconic voice packs |
| Teams onboarding with AI agents | Reduce friction for new users who keep missing agent prompts |

---

## Quickstart (2 minutes)

### Prerequisites

- **Node.js 18+** ([download](https://nodejs.org))
- **Claude Code** installed and configured
- **Audio output** (speakers or headphones — yes, really)

**Platform-specific audio requirements:**

| Platform | Required     | Notes                                    |
|----------|-------------|------------------------------------------|
| Windows  | PowerShell  | Built-in, uses WPF MediaPlayer           |
| macOS    | `afplay`    | Built-in on all Macs                     |
| Linux    | `paplay`    | PulseAudio (most distros) or `aplay`     |

### Install

```bash
# Clone the repo
git clone https://github.com/Robot-Friends-Community/hail.git
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

## What's Inside

Hail ships with **14 voice packs** covering everything from clean professional chimes to iconic characters from Portal, StarCraft, Halo, TF2, and more.

- **Zero dependencies** — pure Node.js 18+, no `npm install` required
- **Cross-platform** — Windows, macOS, Linux all supported
- **Non-blocking** — audio plays fire-and-forget in ~50ms, never stalls the agent
- **Configurable** — toggle individual sound categories, set volume, rotate packs per session
- **Extensible** — drop in your own pack with a `manifest.json` and some audio files

---

## Real-World Use Cases

**1. Long refactors while you grab coffee**
You kick off a 200-file codebase refactor. Instead of watching a progress bar, you walk away. Halo's Cortana says "I'll do what I can" when the agent starts, and plays a mission-complete fanfare when it finishes. You come back exactly when needed.

**2. Permission prompts you keep missing**
Claude Code needs to run a shell command but requires your approval. Without Hail, you miss it for 5 minutes. With Hail and the GLaDOS pack, a passive-aggressive AI voice immediately gets your attention.

**3. Multi-agent workflows**
Running several parallel Claude Code sessions across different terminals? Each session gets a random voice pack assigned at startup (via rotation mode). You know which session is calling for you without looking at the screen.

**4. Spam detection during rapid iterations**
You're iterating fast, sending 5 prompts in 10 seconds. The `user.spam` category triggers — TF2 Engineer says something appropriately unimpressed. Built-in rate limiting that's actually fun.

**5. Meeting mode**
You're in a standup but have a long agent task running. `node bin/hail.js toggle` mutes everything instantly. One command back to unmute when you're free.

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

## Installation

### Step 1: Clone

```bash
git clone https://github.com/Robot-Friends-Community/hail.git
cd hail
```

### Step 2: Install hooks

```bash
node bin/hail.js install
```

This writes hook entries into `~/.claude/settings.json`. The hook script path is stored as an absolute path to your cloned repo location — so keep the repo wherever you want it long-term before running install.

### Step 3: Test audio

```bash
node bin/hail.js test
```

Plays a sound from the active pack. If you hear it, you're done.

### Step 4: Pick a voice

```bash
node bin/hail.js packs        # see what's available
node bin/hail.js use glados   # pick your personality
```

### Updating

```bash
git pull
```

Your `config.json` and any custom packs are preserved.

---

## Deep Reference

### Full CLI Command Reference

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

### Slash Commands Inside Claude Code

```
/hail                   Interactive setup wizard
/hail use <pack>        Switch voice pack for this session
/hail browse            List all packs with descriptions
/hail config            Show/change current settings
/hail toggle            Mute/unmute sounds
/hail volume <0-100>    Set volume
```

The `/hail use <pack>` command is intercepted by a `UserPromptSubmit` hook before it reaches the model — zero tokens used, instant response.

### Configuration Reference

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

- **random** — picks a random pack from `pack_rotation` each session
- **round-robin** — cycles through `pack_rotation` in order
- **agentskill** — per-session assignments via `/hail use <pack>` in Claude Code

---

## Voice Packs

Pick your personality. All 14 packs ship with the repo.

| Pack | Vibe |
|------|------|
| `chimes` | Clean tones. No personality, no friction. The one you use at work. |
| `informative` | Calm, clear callouts. Like a good PA system — heard but not annoying. |
| `peon` | *"Work work."* The Orc grunt who just wants to be left alone. Same, honestly. |
| `peasant` | *"Yes, milord."* Eager. Obedient. Will do absolutely anything you ask. |
| `glados` | Passive-aggressive AI. Task complete. You're not doing great, by the way. |
| `halo` | Master Chief. Mission-ready. Every notification feels like a briefing. |
| `terminator` | Cold. Efficient. *"I'll be back."* It will be back. |
| `dota2_axe` | AXE IS HERE. AXE COMPLETES TASK. AXE DOES NOT WHISPER. |
| `duke_nukem` | Hail to the king, baby. Turns every task completion into a victory lap. |
| `hd2_helldiver` | *For Super Earth!* Democracy-approved audio. Managed democracy. |
| `ra2_kirov` | *"Kirov reporting."* The Soviet airship has arrived. It is punctual. |
| `sc_battlecruiser` | *"Battlecruiser operational."* You feel powerful. You should. |
| `sc_kerrigan` | Queen of Blades. Cerebral, commanding, not here for your feelings. |
| `tf2_engineer` | *"Erectin' a dispenser."* Southern charm. Hard hat. Gets the job done. |

> **Pro tip:** Set `pack_rotation_mode: "random"` in config.json and add multiple packs
> to `pack_rotation`. Hail will surprise you each session. One minute it's
> Cortana, the next it's GLaDOS.

### Creating Your Own Pack

See [CONTRIBUTING.md](CONTRIBUTING.md#adding-a-sound-pack). TL;DR:

1. Create `packs/my-pack/manifest.json`
2. Drop `.mp3` files into `packs/my-pack/sounds/`
3. Map sounds to categories in the manifest
4. Run `hail use my-pack` and test

---

## Hooks and Integration

Hail integrates with Claude Code via its hooks system — no modifications to Claude Code itself required.

### How hooks are registered

Running `node bin/hail.js install` writes entries to `~/.claude/settings.json` in this format:

```json
{
  "hooks": {
    "SessionStart": [{ "command": "node /path/to/hail/src/hook.js" }],
    "Stop": [{ "command": "node /path/to/hail/src/hook.js" }],
    "PermissionRequest": [{ "command": "node /path/to/hail/src/hook.js" }]
  }
}
```

Each hook receives a JSON payload on stdin describing the event. Hail reads it, routes to the correct sound category, plays audio, and exits. The entire hook lifecycle is non-blocking — Claude Code does not wait for audio to finish.

### The /hail slash command

The `install` command also copies the Hail skill into `~/.claude/skills/`. This enables `/hail` commands inside Claude Code sessions.

The `/hail use <pack>` command is special: it's intercepted via a `UserPromptSubmit` hook *before* the message reaches the model. Pack switches happen instantly with zero token cost.

### Removing hooks

```bash
node bin/hail.js uninstall
```

Cleanly removes all Hail entries from `settings.json`. Your config.json and packs directory are untouched.

---

## Contributing

We welcome new voice packs, bug fixes, and feature contributions.

1. Fork the repo
2. Create a branch: `git checkout -b feature/my-voice-pack`
3. Make your changes
4. Open a pull request against `dev`

See [CONTRIBUTING.md](CONTRIBUTING.md) for the full guide, including the voice pack format spec.

**Voice pack submissions are especially welcome.** If you have a character idea, drop it in the issues with the `new voice pack` label.

---

## Repo Structure

```
hail/
  bin/hail.js            CLI — your remote control
  src/
    hook.js              stdin JSON --> sound (the main event)
    hook-handle-use.js   /hail use <pack> interceptor
    player.js            Cross-platform audio (Win/Mac/Linux)
    config.js            Read/write config.json
    state.js             Anti-repeat, debounce, session tracking
    router.js            Event --> category mapping
    picker.js            Random sound selection (no repeats)
    installer.js         Hook registration into settings.json
  packs/                 Sound packs (14 included, add your own)
  skills/                Claude Code skill definition
  scripts/               Pack generation utilities
  config.json            Your preferences
  .state.json            Runtime state (auto-managed)
```

---

## Ecosystem and License

**Platform Support**

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

**FAQ**

**Q: Will this slow down my agent?**
No. Audio plays fire-and-forget in a detached process. The hook script exits in ~50ms.

**Q: Can I use this with other agents besides Claude Code?**
Currently built for Claude Code hooks, but the architecture is generic. The hook handler reads JSON from stdin — any system that can pipe event JSON can use it. PRs welcome.

**Q: My sounds aren't playing?**
Run `node bin/hail.js status` — check that hooks are installed and a pack with sounds is selected. Then `node bin/hail.js test` to verify audio works. On Linux, make sure `paplay` or `aplay` is available.

**Q: I'm in a meeting and it keeps going off.**
`node bin/hail.js toggle` — instant mute. Or use `/hail toggle` inside Claude Code.

**Q: Can I make my own pack?**
Absolutely. See [CONTRIBUTING.md](CONTRIBUTING.md#adding-a-sound-pack). We generated our voice packs using AI TTS — go wild.

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

**[Robot Friends Community](https://github.com/Robot-Friends-Community)**

[MIT License](LICENSE) | Zero Dependencies | Node 18+

</div>
