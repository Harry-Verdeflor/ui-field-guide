# UI Field Guide

A visual glossary of 661 UI/UX terms in 33 categories. Every term is a card with a live, hand-drawn demo. Hit **Play with it** on any card to open a playground where you can restyle and edit that component, then generate a Claude Code prompt to build it for real.

It's a static site: plain HTML, CSS and JavaScript. No build step, no dependencies, no server code.

```
index.html        markup
css/style.css     all styles (light + dark)
js/helpers.js     icons and drawing helpers
js/terms.js       the 661 terms and their demos
js/app.js         rendering, playground, prompt builder, share links
```

## Features

- **Live demos** for every term, in light and dark mode.
- **Playground** for each component: theme knobs, per-part editors, inspect, code view, undo/redo, state simulation and a side-by-side compare with the original.
- **Prompt builder** that writes a full Claude Code prompt for your stack (React, Next.js, Vue, Svelte, SwiftUI, Compose, Flutter or plain HTML).
- **Share links.** *Share link* in the playground copies a URL with your remix compressed into it. Whoever opens it sees your version. Nothing is uploaded anywhere.
- **Term links.** `#t=toggle-switch` jumps to that card.
- **Back up / restore** your saved remixes as a JSON file (in the footer), so you can move them to another browser.
- Press `/` to search.

## Run it locally

Serve the folder over HTTP (opening `index.html` from disk works too, but share links, the clipboard and "Copy as full page" need a server):

```bash
python -m http.server 8000
```

Then open http://localhost:8000.

## Deploy

Any static host works. With GitHub Pages: repo **Settings → Pages → Deploy from a branch → `main` / root**. The site appears at `https://<user>.github.io/ui-field-guide/`.

## Working on it

Open this folder in Claude Code. It reads `CLAUDE.md` for the file map, conventions and the checks to run before finishing a change.
