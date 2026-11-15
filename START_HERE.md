# Jethro A. Rendon — Portfolio files

This folder contains the complete editable website source, all assets, the selected profile image, and the downloadable résumé. The floating character has been removed.

## Run locally

Use Node.js 22.13 or newer and npm. Extract the ZIP, open a terminal in this folder, then run:

```sh
npm ci
npm run dev
```

Open the local URL printed by the development server. This React/TypeScript project needs a development server; it is not a double-click HTML export.

## Contact form database

The hosted site stores contact messages privately in Cloudflare D1. A downloaded copy does not contain production messages or credentials. To enable submissions in your local preview, build once and apply the included schema migration:

```sh
npm run build
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_oval_pyro.sql
npm run dev
```

Email and telephone links work independently of the database.

## Edit your portfolio

- `components/portfolio/data.ts`: projects, experience, skills.
- `components/portfolio/Workspace.tsx`: home, about, community, and content panels.
- `components/portfolio/Explorer.tsx`: always-visible file navigation.
- `components/portfolio/Contact.tsx`: contact form and contact details.
- `app/globals.css`: layout, typography, responsive behavior, and animations.
- `public/jethro-profile-avatar.jpg`: your selected profile image.
- `public/Jethro_Rendon_Resume.pdf`: your downloadable résumé.

Run `npm run build` to create a production build. Deployment uses a Cloudflare-compatible server and the declared D1 binding; the source ZIP is not a static-only hosting export. `.openai/hosting.json` preserves the existing hosted Site identity. Remove that project ID before creating a separate new Site.

The archive excludes installed dependencies, Git history, local database records, build caches, and authentication credentials. Install dependencies with `npm ci` after extraction.
