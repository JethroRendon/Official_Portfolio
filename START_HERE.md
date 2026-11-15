# Deploy this folder to Vercel

This is the corrected **Next.js version for Vercel**.

Replace your repository contents with the files in this folder, then commit and push. Make sure `package.json` is in Vercel's configured Root Directory.

Vercel settings:

- Framework Preset: **Next.js**
- Build Command: **npm run build**
- Install Command: **npm ci**
- Output Directory: **Next.js default (.next)**
- Node.js: **22.x or 24.x**

Redeploy once with the existing Build Cache disabled.

See `README.md` for local commands and optional contact database setup. The portfolio builds without secrets; contact inbox submissions require the three D1 environment variables in `.env.example`. Your direct email and telephone links remain available.
