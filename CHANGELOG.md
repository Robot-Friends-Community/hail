# Changelog

All notable changes to Hail will be documented in this file.

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
