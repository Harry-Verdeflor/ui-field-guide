# UI Field Guide

A static, single-page visual glossary of 661 UI/UX terms in 33 categories. Each term is a card with a live, hand-drawn demo. Every card opens a playground where the user can edit that component, and the playground can generate a Claude Code prompt to build it for real.

## How to run
- No build step and no dependencies. Plain HTML, CSS and JS files.
- Serve it locally: `python -m http.server 8000` (or `npx serve .`). Opening `index.html` straight from disk mostly works, but share links, clipboard and "Copy as full page" need a server.
- Fonts load from Google Fonts (Archivo, Fraunces, Courier Prime); everything else is local.

## Visual style (keep it consistent)
- Black ink on cream paper, thick 2.5px outlines, pill buttons, 4-point sparkle accents, subtle grain overlay, hard offset shadows.
- Fraunces 900 with `'SOFT' 100` for display text, Archivo for UI text and uppercase labels, Courier Prime for small mono labels.
- Colors only through CSS variables on `:root`: `--bg --paper --ink --mute --soft --danger --ok`, plus `--bw` (demo border width). Light is always the default. Dark mode redefines them only under `:root[data-theme="dark"]`, set by the smiley button (`setTheme()` in `app.js`, saved as localStorage `ufg-theme`, applied by a tiny inline script in `<head>` before paint). Don't add `prefers-color-scheme: dark` rules.
- Scrollbars and dropdowns are drawn too: see the scrollbar and dropdown blocks at the end of `css/style.css`. The page scrollbar is styled with `body::-webkit-scrollbar` (Chromium takes the viewport's scrollbar from `body`). Dropdowns use `appearance: base-select` inside `@supports`; Escape in an open dropdown closes only the dropdown, not the playground.

## File map
The scripts are classic (not modules) and share globals, so they must load in this order: `helpers.js` → `terms.js` → `app.js`.

1. `css/style.css`: page chrome, then demo primitives (`.box .inp .btn .chip .tg .chk .rad .frame .phone .lbx .ln …`), animation classes (`.mv .e-* .a-*`), then the playground CSS.
2. `index.html`: markup only. Sticky top bar, hero, sidebar nav + search, `#sections` (rendered by JS), footer, the category bottom sheet `#sheetNav`, and the playground modal `#pgm`.
3. `js/helpers.js` — **Icons and helpers**: `P` (icon paths), `I(name, cls)` makes an icon SVG with `data-ic`, `SP` sparkle, `L()` text line, `B()` button, `IN()` input, `CB()` round button, `SV()` SVG wrapper, plus chart helpers `BAR`, `LINE`, `PIE`, `QR`, `TYPO`, `FXD`, `MV`, `CAL`, `MINI`, `SCR`.
4. `js/terms.js` — **Content**: `S(id, title, icon, blurb, items)` calls, one per category. Each item is `[name, aliases, definition, demoHTML]`.
5. `js/app.js`, in order:
   - **Render**: builds the cards, nav, counts; `ALL` is the flat list of every term; `REM` holds saved remixes (localStorage key `ufg-remix`). Every remix passes through `cleanRemix()` (field validation) and `cleanFrag()` (HTML sanitizer) on load, import and share. Keep it that way: share links and backups are untrusted input.
   - **Interactions**: one delegated click handler for `data-tg` (toggle), `data-rg` + `data-group` (single choice), `data-css` (sets a style on `[data-tgt]` inside `[data-demo]`), `data-step`, `data-star`, `data-tgp` (toggle parent). A delegated input handler covers `.rg`, `.knobr` and `data-var`.
   - **Playground**: theme knobs, undo/redo history, tools (Interact / Select / Type), state simulation, zoom, canvas, compare.
     - `RECIPES`: each entry `{t, q | find, max?, name?, b(el) => controls[]}` produces the per-component editor sections in the Component tab. Controls come from the kit `C.text / C.range / C.color / C.select / C.toggle / C.btns / C.note`; call `changed({rebuild})` after DOM edits.
     - `motionSec()` (curve editor) and `textSec()` cover animation and leftover text; `buildProps()` is the Inspect panel.
   - **Prompt tab**: `KNOW` (behavior, a11y, props, states and tests per recipe type), `FW` (stack presets), `buildPrompt()`.
   - **Share links**: `routeHash()` handles `#t=<slug>` (jump to a card) and `#remix=<payload>` (open a shared remix). The payload is `{v,t,s}` JSON, deflate-raw compressed, base64url, prefixed `z` (or `j` when uncompressed). `packShare` / `unpackShare` encode and decode it.
   - **Remix backup**: footer `.remt` exports and imports `{app,v,remixes}` JSON; `remCount()` keeps the footer text current.

## Common tasks
- **Add a term**: append `["Name","Aliases","One or two plain sentences.", demoHTML]` to the right `S(...)` call in `js/terms.js`. Keep demos within about 190×130px (the card stage is 156px tall with 12px padding). Reuse the primitives and helpers.
- **Add a category**: add a new `S('id','Title','iconKey','Blurb',[...])`; the nav, counts and search update automatically. Add the icon to `P` in `js/helpers.js` if needed.
- **Make a new kind of part editable**: add a recipe to `RECIPES` in `js/app.js`. If it should shape generated prompts, add a matching `KNOW['Recipe title']` entry.
- **Definitions**: plain language, accurate, no filler. Interaction hints like "Try it." go at the end of the definition (the prompt builder strips them).

## Checks before finishing a change
- The page loads with no console errors.
- No demo overflows its card stage. Quick test in the console:
  `[...document.querySelectorAll('.card')].filter(c=>{const s=c.querySelector('.st');return s.scrollWidth>s.clientWidth+2||s.scrollHeight>s.clientHeight+2}).map(c=>c.querySelector('h3').textContent)` should return `[]`.
- Every playground opens: `ALL.forEach((_,i)=>openPG(i,null))` runs without throwing.
- Check both light and dark mode (smiley button in the top bar), and a narrow mobile width.
- Live site: https://ui-field-guide.github.io/ (GitHub Pages from `main` of `ui-field-guide/ui-field-guide.github.io`). README screenshots live in `docs/screenshots/`; retake them when the UI changes.
