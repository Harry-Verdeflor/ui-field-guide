# UI Field Guide

A single-page visual glossary of 661 UI/UX terms in 33 categories. Each term is a card with a live, hand-drawn demo. Every card opens a playground where the user can edit that component, and the playground can generate a Claude Code prompt to build it for real.

## How to run
- Open `index.html` directly in a browser. There is no build step and no dependencies.
- For a local server (needed for clipboard in some browsers): `npx serve .` or `python -m http.server 8000`.
- Fonts load from Google Fonts (Archivo, Fraunces, Courier Prime); everything else is inline.

## Visual style (keep it consistent)
- Black ink on cream paper, thick 2.5px outlines, pill buttons, 4-point sparkle accents, subtle grain overlay, hard offset shadows.
- Fraunces 900 with `'SOFT' 100` for display text, Archivo for UI text and uppercase labels, Courier Prime for small mono labels.
- Colors only through CSS variables on `:root`: `--bg --paper --ink --mute --soft --danger --ok`, plus `--bw` (demo border width). Dark mode redefines them under `prefers-color-scheme: dark` and `:root[data-theme="dark"]`.

## File map (`index.html`)
1. `<style>`: page chrome, then demo primitives (`.box .inp .btn .chip .tg .chk .rad .frame .phone .lbx .ln …`), animation classes (`.mv .e-* .a-*`), then the playground CSS.
2. Markup: sticky top bar, hero, sidebar nav + search, `#sections` (rendered by JS), footer, the category bottom sheet `#sheetNav`, and the playground modal `#pgm`.
3. `<script>`, in order:
   - **Icons and helpers**: `P` (icon paths), `I(name, cls)` makes an icon SVG with `data-ic`, `SP` sparkle, `L()` text line, `B()` button, `IN()` input, `CB()` round button, `SV()` SVG wrapper, plus chart helpers `BAR`, `LINE`, `PIE`, `QR`, `TYPO`, `FXD`, `MV`, `CAL`, `MINI`, `SCR`.
   - **Content**: `S(id, title, icon, blurb, items)` calls, one per category. Each item is `[name, aliases, definition, demoHTML]`.
   - **Render**: builds the cards, nav, counts; `ALL` is the flat list of every term; `REM` holds saved remixes (localStorage key `ufg-remix`). Every remix passes through `cleanRemix()` (field validation) and `cleanFrag()` (HTML sanitizer) on load, import and share. Keep it that way: share links and backups are untrusted input.
   - **Interactions**: one delegated click handler for `data-tg` (toggle), `data-rg` + `data-group` (single choice), `data-css` (sets a style on `[data-tgt]` inside `[data-demo]`), `data-step`, `data-star`, `data-tgp` (toggle parent). A delegated input handler covers `.rg`, `.knobr` and `data-var`.
   - **Playground**: theme knobs, undo/redo history, tools (Interact / Select / Type), state simulation, zoom, canvas, compare.
     - `RECIPES`: each entry `{t, q | find, max?, name?, b(el) => controls[]}` produces the per-component editor sections in the Component tab. Controls come from the kit `C.text / C.range / C.color / C.select / C.toggle / C.btns / C.note`; call `changed({rebuild})` after DOM edits.
     - `motionSec()` (curve editor) and `textSec()` cover animation and leftover text; `buildProps()` is the Inspect panel.
   - **Prompt tab**: `KNOW` (behavior, a11y, props, states and tests per recipe type), `FW` (stack presets), `buildPrompt()`.
   - **Share links**: `routeHash()` handles `#t=<slug>` (jump to a card) and `#remix=<payload>` (open a shared remix). The payload is `{v,t,s}` JSON, deflate-raw compressed, base64url, prefixed `z` (or `j` when uncompressed). `packShare` / `unpackShare` encode and decode it.
   - **Remix backup**: footer `.remt` exports and imports `{app,v,remixes}` JSON; `remCount()` keeps the footer text current.

## Common tasks
- **Add a term**: append `["Name","Aliases","One or two plain sentences.", demoHTML]` to the right `S(...)` call. Keep demos within about 190×130px (the card stage is 156px tall with 12px padding). Reuse the primitives and helpers.
- **Add a category**: add a new `S('id','Title','iconKey','Blurb',[...])`; the nav, counts and search update automatically. Add the icon to `P` if needed.
- **Make a new kind of part editable**: add a recipe to `RECIPES`. If it should shape generated prompts, add a matching `KNOW['Recipe title']` entry.
- **Definitions**: plain language, accurate, no filler. Interaction hints like "Try it." go at the end of the definition (the prompt builder strips them).

## Checks before finishing a change
- The page loads with no console errors.
- No demo overflows its card stage. Quick test in the console:
  `[...document.querySelectorAll('.card')].filter(c=>{const s=c.querySelector('.st');return s.scrollWidth>s.clientWidth+2||s.scrollHeight>s.clientHeight+2}).map(c=>c.querySelector('h3').textContent)` should return `[]`.
- Every playground opens: `ALL.forEach((_,i)=>openPG(i,null))` runs without throwing.
- Check both light and dark mode (smiley button in the top bar), and a narrow mobile width.
