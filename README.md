# Instability Watch v7

## Editable local dev workflow (Vite + hot reload)

This repository is now set up to run as a normal React app with Vite.

### Install

```bash
npm install
```

### Run locally (hot reload)

```bash
npm run dev
```

Vite will print the local URL (typically `http://127.0.0.1:5173/`).

### Project wiring

- `instability-platform-v7.jsx` is the source-of-truth app component.
- `src/main.jsx` mounts that component into `#root`.
- `index.html` is now the Vite entry page.

## Static bundle fallback

The previous CDN/static page is preserved as `index.static-cdn.html` and still
works with `bundle.js` if needed for a quick static serve.

## Notes

- All data is mock, calibrated to reported point-in-time values (12 Jul 2026).
- Not investment advice.
