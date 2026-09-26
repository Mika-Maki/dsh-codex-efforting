<div align="center">

# dsh-codex-efforting

**Turns the model selector in the DeepSeek Harness composer into a card with a reasoning-effort slider.**

[![GitHub](https://img.shields.io/badge/GitHub-Mika--Maki%2Fdsh--codex--efforting-181717?logo=github&logoColor=white)](https://github.com/Mika-Maki/dsh-codex-efforting)
[![version](https://img.shields.io/badge/version-1.0.0-5B50E6)](https://github.com/Mika-Maki/dsh-codex-efforting/releases)
[![license](https://img.shields.io/badge/license-MIT-3083FD)](./LICENSE)
[![platform](https://img.shields.io/badge/platform-DeepSeek%20Harness%20Web-171717)](#)

**English** · [中文](./README.md)

</div>

---

## Introduction

The plugin takes over the composer's model seat and rebuilds it as a two-layer control. Collapsed, it is the small control in the tool row showing `model · tier`; expanded, it is a card with the tier and model name centered, a rail at the bottom divided evenly across the tiers, and a reset key in the top-right corner. Higher tiers sit further right, and while you drag, the card surfaces what the tier under your pointer costs — so you know what you are switching to before you commit.

Tiers are not hard-coded: the plugin reads the model's declared `reasoning.efforts` and lays them out in declaration order, so an adapter adding, removing, or renaming a tier needs no change here.

## Features

- **Tiers come from the model** — the rail is divided automatically from `reasoning.efforts`, with no configuration
- **Obvious direction** — higher is further right: `Off` at the far left, `Max` at the far right
- **Click or drag** — releasing snaps to the nearest stop, and `←` / `→` work on the keyboard
- **Visible cost** — dragging surfaces a hint for the tier under the pointer, covering `off` / `none`, `low` / `minimal`, `medium`, `high`, `xhigh`, `maximum` / `max` / `ultra`
- **Switching models keeps its place** — click the model name to open the list; picking one returns you to the rail, carrying the current tier when the target supports it and otherwise falling back to its default
- **Reset touches the tier only** — the top-right key resets the reasoning tier to the model default and never the model
- **Follows system light/dark** — the card's palette switches with `prefers-color-scheme`
- **Steps aside without thinking** — a model with no `reasoning` gets the seat back, unharmed

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

## License

MIT
