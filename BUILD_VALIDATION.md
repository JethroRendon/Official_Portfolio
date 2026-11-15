# Build validation

The Vercel-compatible source was verified in this workspace with Node.js 24.22.1:

- `npm ci --no-audit --no-fund`: passed using the included lockfile.
- `npm run build`: passed using native Next.js 16.3.4.
- `npm run typecheck`: passed.
- `npm test`: four contact adapter tests passed.
- Compiled production POST handler: invalid input returned 400; disallowed origin returned 403; honeypot submission was handled; missing database configuration returned 503 without reporting a saved message.

Build output includes `/`, `/_not-found`, and the dynamic `/api/contact` route. The source contains no runtime import of `cloudflare:workers`, no Vinext build script, and no Cloudflare Vite adapter.

This validates the downloaded source, not a remote Vercel deployment. The connected Vercel account and team returned no projects or deployments during inspection, so no existing remote app was changed. Live contact database access was not tested because no database credentials were provided.
