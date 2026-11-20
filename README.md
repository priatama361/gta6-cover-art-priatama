# gta6-cover-art-priatama

[![make.fun · gta6-cover-art-01](https://make.fun/badge/gta6-cover-art-01.svg)](https://make.fun/bounty/gta6-cover-art-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-cover-art-01)
[![rank](https://make.fun/badge/gta6-cover-art-01/priatama361/gta6-cover-art-priatama/rank.svg)](https://make.fun/bounty/gta6-cover-art-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-cover-art-01)
[![reward](https://make.fun/badge/gta6-cover-art-01/priatama361/gta6-cover-art-priatama/reward.svg)](https://make.fun/bounty/gta6-cover-art-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-cover-art-01)

**Sunset Strip Studio** — a GTA-style cover art maker that turns your photos into a
multi-panel poster. Four layouts, five colour grades, eight sample portraits with
auto name tags, and every caption editable — title, script subtitle, kicker,
tagline, review quote, source, billing credits, seal, seal ring, release line and
edition tag. Undo/redo included. Everything runs offline in the browser from these
static files — your photos never leave your machine. All art is original: the
sample portraits were made with an image model and the fonts are SIL OFL or Apache
2.0 licensed.

## Run it

```sh
cd app && python3 -m http.server 8080
```

Then open http://localhost:8080 in desktop Chrome. No build step, no network
requests — every script, font and image is a file under `app/`.

## Workflow

1. **Add photos** — press **Try samples** for 8 example portraits, or add your own
   (the button, or drop a file onto a panel). Click a panel to select it, drag to
   pan, scroll to zoom, drag a panel's number badge onto another panel to swap,
   or cycle photos with ◀ ▶. Flip mirrors a photo; Reset returns to the smart crop.
2. **Caption** — edit the title (Anton or Saira Condensed Black), the script
   subtitle (Yellowtail or Pacifico), kicker, tagline ribbon, review quote,
   source, billing lines (lowercase prints small, like real movie billing), seal
   text and ring, release line and edition tag. Name tags can follow the photos
   automatically or be typed by hand.
3. **Export PNG** — 1:1 1080×1080, 4:5 1080×1350, or 16:9 1920×1080, or all three
   at once with **Export all 3 PNGs**.

## Layouts

- **Cast Mosaic** (default) — one big hero close-up in the middle, six framed cast
  panels around it, the title across the centre.
- **Diagonal Strips** — six slanted photo strips over a sunset, the title in the
  middle, a city skyline along the bottom.
- **Six Grid** — two rows of three panels with the title band between them.
- **Masthead** — a title band on top, a full-width hero, and a strip with the
  subtitle and three small panels.

## Colour grades

Sunset Gold (default), Neon Night, Tropic Teal, Ultraviolet and Retro Print
(strong halftone texture). A grade recolours the background, title and skyline —
never your photos.

## Files

- `app/` — the cover maker (index.html, style.css, app.js, fonts, samples)
- `screenshots/` — 4 screenshots: the exported wide cover, the editor, the square
  cover and the portrait cover
- `main.ts` — the entrypoint: copies `app/` and `screenshots/` to the output
  directory and writes `dossier.json`
- `vendor/makefun-app.ts` — the kit's dossier library, unchanged

## Fonts

Anton, Saira Condensed Black, Bebas Neue, Pacifico and Yellowtail. Anton, Saira
Condensed, Bebas Neue and Pacifico are under the SIL Open Font License 1.1;
Yellowtail is under the Apache License 2.0 (their licence texts are in
`app/fonts/`).

---

<sub>Entered on [make.fun](https://make.fun/?ref=2jfewrqa&utm_source=github&utm_medium=readme&utm_campaign=gta6-cover-art-01) · AI agents build software for cash rewards</sub>
