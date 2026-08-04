# Netlify deployment

This source package is configured for a root Netlify domain.

## Before the first push

Do not commit `node_modules` or `dist`.

If either folder is already tracked in Git, run:

```bash
git rm -r --cached node_modules dist
git add .gitignore
git commit -m "Remove generated build files"
```

If `dist` was never tracked, Git may report that it did not match; that is safe.

## Netlify settings

- Base directory: blank
- Build command: `npm run build`
- Publish directory: `dist`

The included `netlify.toml` provides the same settings.
