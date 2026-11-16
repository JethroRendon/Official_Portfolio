# Jethro A. Rendon — Vercel portfolio

This version uses standard Next.js on Vercel. It keeps the portfolio design, always-visible explorer, résumé content, selected profile image, animations, and project navigation. Includes the latest bold home layout, multilingual loading screen, sidequest section, animated AI/Build pointers, and a small golden pixel dog with movable-bone feeding, heart reactions, and idle sleep.

## Vercel deployment

1. Replace the contents of your Vercel-linked repository with the contents of this folder. Keep `package.json`, `package-lock.json`, `next.config.ts`, and `vercel.json` together at the project root.
2. Commit and push the files.
3. In Vercel, choose **Next.js** as the Framework Preset.
4. Use **npm run build** as the Build Command and **npm ci** as the Install Command.
5. Reset any custom Output Directory to the Next.js default (`.next`). Do not use `dist`, `out`, or `dist/server`.
6. Use Node.js 22.x or 24.x. Set Root Directory to the folder containing this `package.json`; leave it empty if these files are at your repository root.
7. Redeploy. Disable “Use existing Build Cache” for the first deployment after replacing the old project.

You do not need Cloudflare credentials to build or view the portfolio.

## Contact inbox on Vercel

The old archive depended on a Cloudflare Worker-only database binding. Vercel does not supply that binding. This version accesses D1 over HTTPS from the server instead, without the `cloudflare:workers` module.

To enable contact submissions, configure a Cloudflare D1 database you control, apply `db/schema.sql` once in its SQL console, then set these Vercel environment variables and redeploy:

- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_D1_DATABASE_ID`
- `CLOUDFLARE_API_TOKEN` with permission to edit D1 in that account

If you already control the original D1 database, the same messages schema is compatible. The database managed by the separate ChatGPT-hosted Site is not automatically transferred to Vercel. This ZIP contains no production records or database credentials.

Keep the token server-only: never prefix these variables with `NEXT_PUBLIC_`. Without this configuration, the portfolio still builds and the email/telephone links work; the contact form returns an honest unavailable response instead of pretending the message was saved.

For a low-traffic portfolio inbox, this adapter uses Cloudflare's D1 API. Cloudflare's API rate limits apply.

## Local development

Requires Node.js 22.13+ and npm:

```sh
npm ci
npm run dev
```

Open the URL printed by Next.js. For a production check:

```sh
npm run build
npm start
```

For the optional inbox, copy `.env.example` to `.env.local` and fill in your own values. Build and navigation do not require those values.

## Editing

- `components/portfolio/data.ts`: projects, skills, experience.
- `components/portfolio/Workspace.tsx`: page sections and navigation.
- `components/portfolio/Explorer.tsx`: file explorer.
- `components/portfolio/Contact.tsx`: form and contact links.
- `app/api/contact/route.ts`: input validation and submission handling.
- `db/index.ts`: server-only D1 HTTPS adapter.
- `app/globals.css`: responsive layout and animations.
- `public/jethro-night-avatar.jpg`: selected profile avatar.
- `public/Jethro_Rendon_Resume.pdf`: downloadable résumé.

## Validation

```sh
npm run typecheck
npm test
npm run build
```

The Cloudflare/Vinext build files and unused starter dependencies have been removed from this Vercel version. This archive does not change the separate ChatGPT-hosted Site.

## Sidebar reference update

The sidebar now uses `components/portfolio/Explorer.module.css`: a 440px desktop column, 55px profile avatar, 16px identity name, 12px portfolio caption, 14px explorer text, 39px root rows, and 37.5px nested rows. Tablet width is 320px; mobile keeps the explorer visible in a scrollable sticky panel. The selected profile image is the user-provided night-time pixel avatar.

## Latest interactive updates

- `components/portfolio/HomeHero.tsx` and `HomeHero.module.css`: bold minimalist hero and anchored cursor labels.
- `components/portfolio/WelcomeScreen.tsx` and `WelcomeScreen.module.css`: sans-serif multilingual greeting with the subtle grid.
- `components/portfolio/CursorDog.tsx` and `CursorDog.module.css`: 42 × 35 px dog; follows the pointer, carries/chases dropped bones, chews, shows a heart, and sleeps when idle.
- Click the bone to pick it up, then move and click to drop it; dragging also works. Escape cancels. Keyboard Enter on the bone feeds the dog directly.

The source ZIP includes all application files, public assets, lockfile, Vercel configuration, optional contact inbox schema, and setup instructions. Dependency folders and generated build output are excluded; `npm ci` restores dependencies.

## Clean source package

Only assets used by this portfolio are included: the current profile image, résumé PDF, favicon, JetBrains Mono font, and Barlow Bold font. Earlier avatar variants, the design-reference screenshot, unused fonts, demo widgets, and obsolete CSS have been removed. The README is the setup guide.

The AI and Build cursor labels float independently while staying anchored to the headline. Their movement follows the visitor’s reduced-motion preference.
