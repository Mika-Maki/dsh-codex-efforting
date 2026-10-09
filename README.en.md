<div align="center">

# dsh-codex-efforting

**Turns the model selector in the DeepSeek Harness composer into a card with a reasoning-effort slider.**

[![GitHub](https://img.shields.io/badge/GitHub-Mika--Maki%2Fdsh--codex--efforting-181717?logo=github&logoColor=white)](https://github.com/Mika-Maki/dsh-codex-efforting)
[![version](https://img.shields.io/badge/version-1.1.0-5B50E6)](https://github.com/Mika-Maki/dsh-codex-efforting/releases)
[![license](https://img.shields.io/badge/license-MIT-3083FD)](./LICENSE)
[![platform](https://img.shields.io/badge/platform-DeepSeek%20Harness%20Web-171717)](#)

**English** · [中文](./README.md)

</div>

---

## Introduction

The plugin takes over the composer's model seat and rebuilds it as a two-layer control. Collapsed, it is the small control in the tool row showing `model · tier`; expanded, it is a card with the tier and model name centered, a rail at the bottom divided evenly across the tiers, and a reset key in the top-right corner. Higher tiers sit further right, and while you drag, the card surfaces what the tier under your pointer costs — so you know what you are switching to before you commit.

Tiers are not hard-coded: the plugin reads the model's declared `reasoning.efforts` and derives strength from **position**. An adapter renaming, reordering, adding, or removing a tier needs no change here.

## Features

- **Tiers come from the model** — the rail is divided automatically from `reasoning.efforts`, with no configuration
- **Strength is position, nothing else** — the first effort is always the still end and the last always the hottest, with the middle ones spread between them: a two-effort model reads as still-to-hottest, a four-effort model fills the ladder exactly, and a longer list repeats the middle rungs
- **Obvious direction** — higher is further right: `Off` at the far left, `Max` at the far right
- **Click or drag** — releasing snaps to the nearest stop, and `←` / `→` work on the keyboard
- **Visible cost** — dragging surfaces a hint for the tier under the pointer. It recognises `off` / `none`, `low` / `minimal`, `medium`, `high`, `xhigh`, `maximum` / `max` / `ultra`, and an unrecognised adapter falls back to wording for its rung
- **Motion rises with the tier** — `Off` is still, `Low` a flat bar, `High` erupts sparsely, and `Max` erupts densely over a static violet gradient. Particles are seeded so they scatter rather than march in step
- **The composer follows the tier** — the rung colour is painted onto the input field as a full-cover wash plus an outer ring
- **Switching models keeps its place** — click the model name to open the list; picking one returns you to the rail, carrying the current tier when the target supports it and otherwise falling back to its default
- **Reset touches the tier only** — the top-right key resets the reasoning tier to the model default and never the model
- **Follows system light/dark** — the card's palette switches with `prefers-color-scheme`
- **Steps aside without thinking** — a model with no `reasoning` gets the seat back, unharmed
- **Each overlay switches off on its own** — the field particles, the centre wash and the edge ring each have a switch; see Settings below

## Installation

```sh
dsh plugin --profile web add github:Mika-Maki/dsh-codex-efforting
```

Restart the profile to activate it.

## Usage

| Action | Result |
| --- | --- |
| Click the control in the composer | Opens the card |
| Click or drag the rail | Switches the reasoning tier, snapping to the nearest stop; ← / → work too |
| While dragging | The card surfaces the cost hint for that tier |
| Click the model name in the middle | Opens the model list; picking one returns to the tier rail |
| Click the reset key (top right) | Resets the reasoning tier to the model default — **never the model** |

## Settings

Three independent switches, all under **Settings > General**:

| Switch | When it is off |
| --- | --- |
| **Field particles** | No particles erupt across the input field |
| **Centre glow** | The full-cover wash on the input field is gone |
| **Edge glow** | The outer ring and bloom around the input field are gone |

They govern the input field's overlays only; the card's own motion is not affected by them.

> Preferences are stored in the browser (`localStorage`), so they are **per-browser**: they do not travel with the profile, and clearing site data returns them to their all-on defaults.

## License

MIT
