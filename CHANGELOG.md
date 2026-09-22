# Changelog

All notable changes to Hail will be documented in this file.

## [1.1.0] - 2026-09-22

### Changed
- **Hail · Signal Station** — the institution gets promoted. Repo, CLI and commands stay `hail`; the README now opens with the signal-station framing that the seal already carried, restructured in the same plain-language pattern as DoPA / Airport Authority / Customs Authority (what is this → who is it for → install → your first hail → what's inside → how it works), with a lineage section placing Hail in the Robot Friends universe.
- New hero banner: Frankie404 on-model (brand-kit refs via gpt-image-2), evergreen — no URL, commands or versions baked into the image. `assets/prompts.json` + `assets/generate.py` regenerate it.
- README de-duplicated (Quickstart and Installation merged; Real-World Use Cases folded into Who is it for).

## [1.0.0] - 2026-02-17

### Added
- Core hook system: routes Claude Code events to sound categories
- Cross-platform audio playback (Windows, macOS, Linux)
- 10 voice packs migrated from peon-ping (Dota 2 Axe, Duke Nukem, GLaDOS, Helldivers 2, Peasant, Peon, RA2 Kirov, SC Battlecruiser, SC Kerrigan, TF2 Engineer)
- Chimes pack: 12 synthesized notification tones (non-voice alternative)
- CLI control panel: install, uninstall, status, packs, use, volume, toggle, test, wizard, help
- Anti-repeat sound selection
- Session-scoped pack switching via `/hail use <pack>`
- Stop event debouncing (5s)
- User spam detection (3+ prompts in 10s)
- BOM-safe settings.json parsing

### Fixed
- Windows async audio: use `cmd start /min` + `.ps1` script for reliable fire-and-forget playback
- PowerShell path passing: embed paths directly instead of using `$args`
