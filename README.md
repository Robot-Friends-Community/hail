<div align="center">

<img src="assets/hero.png" alt="Hail · Signal Station — voice alerts for Claude Code. Stop watching, start listening." width="100%">

</div>

<div align="center">

**Voice alerts for Claude Code. Your agent finished — you heard it, because you weren't watching.**

[![Claude Code](https://img.shields.io/badge/Claude-Code-blueviolet?style=for-the-badge)](https://claude.ai/code)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)
[![Zero Dependencies](https://img.shields.io/badge/dependencies-0-brightgreen?style=for-the-badge)](#install)
[![Community](https://img.shields.io/badge/Robot%20Friends-Community-orange?style=for-the-badge)](https://github.com/Robot-Friends-Community)

</div>

---

## What is this?

A signal station sits at the mouth of the harbor and does one job: it calls out. Ship's in. Ship's
aground. Come look. You don't stand on the pier all day watching the water — the station hails you
when something happens.

**Hail** is the signal station for your Claude Code session.

You tell your agent to do something. It takes thirty seconds, or four minutes. You alt-tab, check
Slack, refill the coffee — and come back to find it's been sitting on a permission prompt for three
of those minutes. Hail hooks into Claude Code and **plays a sound when something happens**, so you
can actually leave the terminal.

```
  Agent starts working    -->  *chime*
  Agent finishes task     -->  *victory fanfare*
  Agent hits an error     -->  *ominous buzz*
  Agent needs your input  -->  *hey, look here*
  You spam the prompt     -->  *calm down, buddy*
```

It's a desk bell for your AI. Except the bell might be **GLaDOS telling you the task is complete**,
**Master Chief saying "I need a weapon"**, or the **Terminator confirming "Hasta la vista, baby."**
Fourteen voices ship in the box. Your choice. We don't judge.

---

## Who is it for?

| You are… | Hail gives you… |
|---|---|
| **Anyone using Claude Code** | A sound when a long task finishes, so you stop babysitting the terminal |
| **Running multi-step agent work** | Distinct sounds for done / error / needs-you — you know which without looking |
| **A chronic alt-tabber** | The minutes back that you currently lose to a prompt that already finished |
| **A streamer or content creator** | Character. Your agent talks like Duke Nukem. |
| **Onboarding a team onto agents** | New people stop missing permission prompts on day one |

---

## Install

You need **Node.js 18+**, **Claude Code**, and something that makes sound. That's it — Hail has
**zero npm dependencies**, so there's no `npm install`.

```bash
git clone https://github.com/Robot-Friends-Community/hail.git
cd hail
node bin/hail.js install      # registers the hooks in Claude Code
node bin/hail.js test         # you should hear something
```

`install` does three things: registers Hail's event hooks in `~/.claude/settings.json`, copies the
`/hail` skill so you get slash commands inside Claude Code, and writes a default `config.json`.
The hook path is stored as an absolute path to this folder, so put the repo where you want it to
live *before* you run install.

<details>
<summary>Platform audio — what Hail uses on each OS</summary>

| Platform | Uses | Notes |
|---|---|---|
| Windows | PowerShell + WPF MediaPlayer | Built in — nothing to add |
| macOS | `afplay` | Built in on every Mac |
| Linux | `paplay` or `aplay` | PulseAudio on most distros |

</details>

**Updating:** `git pull` in the hail folder. Your `config.json` and any custom packs are kept.
**Leaving:** `node bin/hail.js uninstall` removes the hooks cleanly and touches nothing else.

---

## Your first hail

```bash
node bin/hail.js status       # what's on
node bin/hail.js packs        # who's available
node bin/hail.js use glados   # pick a voice
node bin/hail.js toggle       # meeting mode — instant mute (and back)
```

Inside Claude Code the same things are `/hail`, `/hail use <pack>`, `/hail toggle`. The
`/hail use` switch is intercepted by a hook *before* it reaches the model — zero tokens, instant.

```
Hail: ENABLED
  Pack:    glados
  Volume:  50%
  Mode:    random
  Hooks:   7 events registered
```

> **Pro tip:** put several packs in `pack_rotation` and set `pack_rotation_mode: "random"`.
> One session it's Cortana, the next it's GLaDOS.

---

## What's inside

- **14 voice packs** — clean chimes for the office, iconic characters for everything else
- **Zero dependencies** — pure Node.js 18+
- **Cross-platform** — Windows, macOS, Linux
- **Non-blocking** — audio fires and forgets in ~50 ms; the agent never waits
- **Configurable** — toggle sound categories, set volume, rotate packs per session
- **Extensible** — drop in your own pack: a `manifest.json` and some audio files

### What triggers what

| Claude Code event | Hail category | In plain words |
|---|---|---|
| `SessionStart` | `session.start` | "I'm awake" |
| `SubagentStart` | `task.acknowledge` | "On it" |
| `Stop` | `task.complete` | "Done" (5 s debounce) |
| `Notification` | `task.complete` | "Done" (skips idle pings) |
| `PostToolUseFailure` | `task.error` | "Uh oh" |
| `PermissionRequest` | `input.required` | "Hey, look at me" |
| `UserPromptSubmit` | `user.spam` | "Chill" (3+ prompts in 10 s) |

---

## How it works

Hail registers hooks in Claude Code's `settings.json`. When an event fires, Claude Code pipes JSON
to the hook script. Hail reads it, maps the event to a sound category, picks a random clip (no
repeats), and plays it in a detached process. The whole thing takes ~50 ms and never blocks the agent.

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

## Platform notes and FAQ

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

---

## Regenerating the banner

`assets/prompts.json` holds the prompt; `python assets/generate.py hero` regenerates it (needs
`OPENAI_API_KEY` and `pip install requests`). By design the Frankie404 reference images are **not**
in this repo — they live in the Robot Friends brand kit; drop them into gitignored `assets/_refs/`
first (the script names the four files it expects).

## Lineage

Hail is the **signal station** of the Robot Friends airport-and-harbor universe — the institution
whose whole mandate is to call out when something happens, so you don't have to keep watch.
Same universe as [Airport Authority](https://github.com/Robot-Friends-Community/airport-authority)
(the tower: session continuity), [Baggage Claim](https://github.com/Robot-Friends-Community/baggage-claim)
(the carousel: the two-command handoff), [Customs Authority](https://github.com/Robot-Friends-Community/customs-authority)
(the border: the decision layer) and [DoPA](https://github.com/Robot-Friends-Community/dopa)
(the port: your local dev ports) — institutions with a mandate, so the plumbing is handled and not remembered.

Hail's voice packs began life in the open-source *peon-ping* project; Hail rebuilt the engine
(zero-dependency, cross-platform, hook-native) and added the chimes pack, the `/hail` skill and
the CLI.

## License

MIT © Robot Friends (404NOTFOUND LLC). Character voice packs reference their respective games;
the chimes pack is ours.
