# Tailwind CSS & Netlify Deployment

This project uses a **production Tailwind CSS build** instead of the Tailwind Play CDN. CSS is compiled locally and on every Netlify deploy.

## How it works

| File | Purpose |
|------|---------|
| `assets/css/tailwind.input.css` | Tailwind source — tells the CLI which files to scan for class names |
| `assets/css/tailwind.css` | Generated output (minified in production). **Not committed** — built on install/deploy |
| `assets/css/main.css` | Custom project styles (text shadows, theme transitions, etc.) |
| `index.html` | Loads `tailwind.css` then `main.css` |

The input file scans:

- `index.html`
- All files in `assets/js/**/*.js` (including dynamically assigned classes in `uiService.js`, `apiService.js`, etc.)

## npm scripts

```bash
npm install          # Installs deps and builds CSS once (via prepare)
npm run build:css    # Production build — minified output
npm run dev:css      # Watch mode — rebuilds when you change HTML/JS classes
```

## Local development

1. Run `npm install` once after cloning (generates `assets/css/tailwind.css`).
2. While editing Tailwind classes, run `npm run dev:css` in a separate terminal so changes are picked up automatically.
3. Open the site with a local server (e.g. `netlify dev` or any static file server).

If styles look missing, run `npm run build:css` and refresh.

## Deploy to Netlify via GitHub

### Netlify build settings

Configured in `netlify.toml`:

```toml
[build]
  command = "npm run build:css"
  functions = "netlify/functions"
  publish = "."
```

On each deploy Netlify runs:

1. `npm install` (which also runs `prepare` → `build:css`)
2. `npm run build:css` (explicit build command)
3. Publishes the repo root, including the generated `assets/css/tailwind.css`

### First-time setup

1. Push this repo to GitHub.
2. In [Netlify](https://app.netlify.com): **Add new site → Import an existing project → GitHub**.
3. Select the repository. Netlify should detect settings from `netlify.toml`.
4. Deploy. Subsequent pushes to the connected branch trigger automatic deploys.

### Files to commit

- `package.json`, `package-lock.json`
- `assets/css/tailwind.input.css`
- `index.html`, `netlify.toml`, `.gitignore`

Do **not** commit `assets/css/tailwind.css` — it is listed in `.gitignore` and generated during build.

## Why not the CDN?

The Tailwind Play CDN (`cdn.tailwindcss.com`) compiles CSS in the browser and ships the full library. The CLI build:

- Includes only classes you actually use
- Produces a small minified file
- Avoids a runtime JavaScript dependency for styling
- Is the approach [recommended by Tailwind for production](https://tailwindcss.com/docs/installation)
