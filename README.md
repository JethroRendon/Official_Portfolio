# Jethro A. Rendon — Developer Portfolio

A React + TypeScript developer portfolio based on the supplied IDE-inspired design. Built with Vinext, Tailwind CSS, Lucide icons, CSS animations, and Cloudflare Workers with a D1 contact inbox.

## Content and navigation

Portfolio identity, photograph, education, projects, experience, certifications, skills, and contact details are based on Jethro Rendon's supplied résumé. `components/portfolio/data.ts` holds the project, skill, and experience data. A downloadable copy is served at `/Jethro_Rendon_Resume.pdf`.

The explorer is always visible: fixed at the left on desktop and tablet, and a compact sticky panel above the content on mobile. No menu icon or opening action is required. Folders expand/collapse; Ctrl/Cmd+K opens file search. URL hash navigation supports back and forward.

Project previews are explanatory component outlines, not original application screenshots or live deployments. No unverified repository, social account, or demo URLs are claimed. The profile avatar is pixel art based on the user-provided beach avatar image.

## Development

Run `npm ci`, then `npm run dev`. Run `npx tsc --noEmit` and `npm run build` before publication. `.openai/hosting.json` retains the existing Site identity and D1 binding.

Contact messages are stored in the private D1 `messages` table, not emailed. Direct email and telephone links use the résumé details. Validation, honeypot protection, origin checks, and repeat-submission rate limiting remain in place. Existing database migrations and production records are preserved.
