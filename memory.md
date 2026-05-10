# daninverno.com — project notes

## What this is
**wynterCG/website** on GitHub — Daniel Inverno's portfolio at https://daninverno.com/. App is in [website/](website/) (nested folder).

## Stack
- React 19 + Vite 7 + Tailwind 3 + framer-motion + lucide-react
- Single-page app, all sections in [website/src/App.jsx](website/src/App.jsx)
- Section theme tokens in [website/src/index.css](website/src/index.css)
- Blog is a static jsonfeed at [website/public/blog/feed.json](website/public/blog/feed.json) + per-post static HTML files

## Build & deploy
- Local dev: `cd website && npm run dev` — Vite at `http://localhost:5173`, network-exposed via `--host`
- Build: `cd website && npm run build` (outputs to `website/dist/`)
- Deploy: `cd website && npm run deploy` — runs build, then `gh-pages -d dist`. Publishes to the `gh-pages` branch.
- Custom domain **daninverno.com** is preserved via [website/public/CNAME](website/public/CNAME). Vite copies `public/` verbatim into `dist/`, so the CNAME ships with every deploy.
  - Before 2026-05-09, the gh-pages branch alternated "Updates" and "Create CNAME" commits because each deploy wiped the domain. The `public/CNAME` file fixes that — no more manual restoration.

## Source-vs-deployed risk
The repo had a history of source-vs-deployed drift: edits made on `gh-pages` directly (or local builds without git commits) would land live but never make it back to `main`, so any future `npm run deploy` from `main` would silently regress.
- **Always commit source changes to `main`** before running `npm run deploy`.
- If something looks better on the live site than in `main`, fetch `gh-pages` and reconcile before any new deploy.

## Mobile testing on Samsung A52
The user has a Samsung A52 dev device at **192.168.1.77**. To screenshot the live or local dev site on it:
1. On the phone: **Settings → Developer options → Wireless debugging → tap into the entry → "IP address & Port"**. Samsung's "Wireless debugging" assigns a fresh random port every session, so the port changes any time the phone sleeps/reboots/toggles the setting.
2. From PC: `adb connect 192.168.1.77:<port>` then `adb devices` to confirm.
3. Use the `mcp__mobile-control__*` MCP tools — `mobile_open_url` to navigate, `mobile_take_screenshot` to capture.
4. For local dev testing, point the phone at `http://192.168.1.91:5173/` (or whatever the PC's LAN IP shows).

## Content gotchas
- The hero `<video>` element plays `archviz.mp4` (real portfolio reel). The legacy `hero-reel.mp4` (renamed from the placeholder `your-video-filename.mp4`) is still in `public/` but unused.
- Section colors use `oklch()` for the bg but solid hex (white) for titles. The previous `background-clip: text` + `color-mix(in oklch, ...)` chain looked nice on Chrome but rendered invisible on Samsung Internet — keep titles solid.
- Form inputs use `bg-white/10` (transparent dark) instead of `bg-gray-200` because Samsung's auto-dark-mode inverts light backgrounds and made them unreadable.
- Lightbox media uses `key={index}` so React unmounts the element on every swipe — gives a black flash during load instead of holding the previous frame.

## Blog post template
[`website/public/blog/catIddleGamePrototype.html`](website/public/blog/catIddleGamePrototype.html) is a self-contained long-form post with TL;DR card, TOC, sub-cards per concept. **It's the strongest design on the entire site** — replicate this pattern when converting portfolio projects into case studies.
- Filename `catIddleGamePrototype.html` is kept (canonical URL preservation), but the body uses correct spelling "idle".

## Open improvements
- Hero H1 still says generic "3D Artist & Indie Game Dev" — content pass not yet done.
- Per-project blurbs still mostly say "Materials, lighting & rendering." — need real one-sentence stories.
- Project `link` fields are mostly `#` — wire to ArtStation or remove field.
- Mochis card poster reads as a webpage screenshot, not 3D art — pick a different first frame or label the project as a fake-tokenomics mockup.
