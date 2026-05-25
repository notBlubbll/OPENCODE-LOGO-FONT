# Unicode Block Font Studio

A real-time, browser-based glyph editor and multi-format exporter for creating ASCII/Unicode block art logos. Design custom 4×4 block fonts, preview them instantly, and export as SVG, JavaScript arrays, or plain Unicode text.

<img width="1383" height="711" alt="image" src="https://github.com/user-attachments/assets/a1e8eb6d-b0af-49a6-b23a-10f6c4a3cb17" />


![Preview](https://img.shields.io/badge/version-4.0%20Pro-blue) ![License](https://img.shields.io/badge/license-MIT-green)

## Features

- **Real-Time Rendering Engine** — Type in the input box and watch your text instantly rendered as 4×4 Unicode block art in a retro terminal viewport.
- **Interactive Glyph Editor** — Click any character in the Font-Book grid to open a 4×4 paint matrix. Select block types from a rich palette (full, half, quadrant, shade, etc.) and paint each cell.
- **Persistent Custom Fonts** — Edited glyphs are saved to `localStorage` and automatically reload on your next visit.
- **Export Formats**:
  - **SVG Vector** — High-quality scalable output with theme colors and optional background.
  - **JavaScript Array** — Copy-ready code with ANSI color tokens (`${S}`, `${C}`, `${B}`, `${R}` etc.).
  - **Raw Unicode Text** — Plain block art for pasting into terminals, Discord, Slack, or README files.
- **Color Modes**:
  - **Monochrome Terminal** — Classic single-color output.
  - **Dual-Tone SVG** — Alternating primary/accent colors mapped per character.
  - **ANSI Colorized** — Multi-color JS arrays with bold and reset toggles.
- **5 Aesthetic Themes**: Cyan Glow, Amber Retro, Toxic Green, Cherry Shadow, Clean Silver.
- **CRT Scanline Overlay** — Toggle authentic retro monitor scanlines on the preview terminal.
- **Dark / Light Mode** — Full light-mode redesign with automatic OS preference detection.
- **Responsive Layout** — Works on desktop, tablet, and mobile with adaptive grids and panels.

## Quick Start

No build step required. Just open the HTML file in a modern browser.

```bash
cd LOGO
# Option 1: Open directly
open index.html

# Option 2: Serve locally (recommended for localStorage persistence)
npx serve .
# or
python -m http.server 8080
```

Then navigate to `http://localhost:8080` (or just double-click `index.html`).

## File Structure

```
LOGO/
├── index.html       # Main UI — layout, controls, terminal preview, font book, editor modal
├── index.css        # Full design system — glassmorphism, CRT effects, responsive grids, themes
├── generator.js     # Core engine — renderer, glyph editor, exporters, theme manager
└── README.md        # This file
```

## How It Works

### Glyph Design
Each character is defined as a 4×4 matrix of Unicode block elements:

| Block | Char | Description |
|-------|------|-------------|
| Full block | `█` | Solid fill |
| Upper half | `▀` | Top half of cell |
| Lower half | `▄` | Bottom half of cell |
| Left half | `▌` | Left half of cell |
| Right half | `▐` | Right half of cell |
| Light shade | `░` | Dither/shading fill |

Characters are stored as 4 strings (one per row), 4 columns wide. For example, the letter `t`:

```javascript
't': ['', '▀██▀', ' ██', ' ▀▀']
```

Rendered:
```
     
▀██▀
 ██ 
 ▀▀ 
```

### Editing a Glyph
1. Scroll down to the **Interactive Font-Book**.
2. Click any character card to open the **Matrix Editor** modal.
3. Select a block type from the palette on the right.
4. Click cells in the 4×4 grid to paint them.
5. Press **Save & Apply** — your change is persisted to `localStorage` and the live preview updates immediately.
6. Press **Reset to Default Font** to restore all glyphs to factory defaults.

### Exporting
- **Copy Raw Text** — Gets plain Unicode art (respects spacing and row-trim settings).
- **Copy JS Array** — Generates a copy-pasteable `const LOGO = [ ... ]` array with embedded ANSI tokens.
- **Download SVG** — Produces a clean vector file named `{input}_block_logo.svg` with your active theme colors.

## Supported Characters

The default font covers:
- **Lowercase letters** `a–z`
- **Digits** `0–9`
- **Punctuation** ` ` (space), `.`, `-`, `_`

All glyphs are editable. Add new characters by extending the `DEFAULT_BLOCKS` object in `generator.js`.

## ANSI Color Tokens

When using **ANSI Colorized JS Array** mode, the following color tokens are supported in the comma-separated palette input:

| Token | Color | Hex Approx. |
|-------|-------|-------------|
| `S` | Silver | `#cfcecd` |
| `C` | Cyan | `#00f0ff` |
| `W` | White | `#ffffff` |
| `Y` | Yellow | `#eab308` |
| `G` | Green | `#22c55e` |
| `M` | Magenta | `#ff007f` |
| `B` | Bold | *(font-weight modifier)* |
| `R` | Reset | *(ANSI reset)* |

Example palette input: `S, C, W`

## Themes

Switch themes instantly via the circular color picker in the Generator Options panel:

| Theme | Primary | Accent | Vibe |
|-------|---------|--------|------|
| **Cyan Glow** | `#00f0ff` | `#3b82f6` | Cyberpunk terminal |
| **Amber Retro** | `#ffb700` | `#f97316` | Vintage amber CRT |
| **Toxic Green** | `#39ff14` | `#10b981` | Hacker/phosphor green |
| **Cherry Shadow** | `#ff007f` | `#c084fc` | Neon pink/purple |
| **Clean Silver** | `#cfcecd` | `#f3f4f6` | Minimal monochrome |

## Browser Support

- Chrome / Edge (recommended)
- Firefox
- Safari
- Any browser with ES6 + CSS Grid + `localStorage` support

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Escape` | Close the glyph editor modal |

## Data Persistence

Custom glyphs are stored in browser `localStorage` under the key `unicode_blocks_custom_v6`. Themes and dark/light mode are also persisted. **Clearing site data will reset your custom font.**

## Tips

- Use **Trim empty top** to remove blank ascender rows and tighten logo height.
- Enable **Char Bottom Shading** to add `░░` texture to the 3rd row of wide glyphs for extra depth.
- Set **Letter Spacing** to `0` for tight-packed logos or `2–4` for airy, readable headlines.
- For clean SVGs, disable **CRT Effect** before exporting if you don't want scanlines baked into the preview.

## License

MIT — use it, hack it, ship it.
