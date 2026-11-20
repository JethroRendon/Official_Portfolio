# Jethro A. Rendon | Developer Portfolio

A personal portfolio presenting my work in web and mobile development, artificial intelligence, and community leadership. The interface draws inspiration from a code editor, bringing projects, technical skills, experience, and personal interests into one responsive workspace.

**[View Portfolio](https://supremo-rnj.vivaciousdeer3.chatgpt.site)** · **[GitHub Profile](https://github.com/JethroRendon)**

## Overview

I am a Bachelor of Science in Computer Science student majoring in Artificial Intelligence at West Visayas State University, Main Campus. My work focuses on practical software applications, thoughtful interfaces, and technology that supports communities. I also serve as Sangguniang Kabataan Chairperson of Barangay Poblacion, Anini-y, Antique.

## Features

- **Editor-inspired navigation:** Expandable folders, file search with `Ctrl/Cmd + K`, browser history support, and a collapsible menu on smaller screens.
- **Project gallery:** All featured projects in one view, with screenshot carousels, enlarged previews, technology logos, and links to websites, source code, or design files.
- **About and experience:** Interactive profile cards and dedicated sections for education, community service, and internship interests.
- **Technical toolkit:** Animated technology rows with individual hover-to-pause behavior and grouped skill categories.
- **Sidequest gallery:** Consistently sized portrait photographs with automatic movement, hover pause, dragging, and heart reactions.
- **Appearance and accessibility:** A single light/dark theme toggle, saved theme preference, keyboard controls, and reduced-motion support.
- **Interactive details:** A brief multilingual welcome screen, temporary color mixing in the headline, and a pixel dog with feeding and rest interactions.
- **Professional resources:** In-browser résumé preview and a contact section with an optional database-backed message form.

## Featured Projects

| Project | Focus | Destination |
| --- | --- | --- |
| VEC-PRO | AI-assisted mosquito surveillance through AEDIFY Web and AEDEX Mobile | [Visit Website](https://vecprolanding.vercel.app/) |
| StraySpot | Animal shelter management, pet discovery, and adoption interface design | [Visit Figma](https://www.figma.com/design/0Yo7UbsM4zDt6y2m3Wcxtq/SOFTENG---STRAYSAFE--CS2B-?node-id=0-1) |
| Amogus / SYNT-ASK | Real-time multiplayer gameplay with NLP-based impostor detection | [Visit Website](https://amogus-nlp.vercel.app/) |
| Groupify | Student group collaboration, task management, and file sharing | [View GitHub](https://github.com/JethroRendon/Groupify---CC-206-Final-Project) |

The technologies listed on individual project cards describe those projects. The table below describes the portfolio application itself.

## Technology Stack

| Area | Technology |
| --- | --- |
| Application framework | Next.js 16, React 19 |
| Language | TypeScript |
| Styling and animation | CSS Modules, global CSS, Tailwind CSS 4 tooling, CSS animations |
| Interface icons | Lucide React and locally bundled technology logos |
| Contact endpoint | Next.js Route Handler in the Node.js runtime |
| Optional message storage | Cloudflare D1 through a server-side HTTPS adapter |
| Deployment | Vercel |

## Local Development

### Requirements

- Node.js 22.13 or later, using a release supported by the configured Next.js version.
- npm and the committed `package-lock.json`.

From the project root, install dependencies and start the development server:

```sh
npm ci
npm run dev
```

Open the local address printed in the terminal. Database credentials are optional for viewing and building the portfolio.

### Available Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run typecheck` | Check TypeScript types |
| `npm test` | Run contact database adapter tests |
| `npm run build` | Generate the production build |
| `npm start` | Serve the production build locally |

Run the following before deploying application changes:

```sh
npm run typecheck
npm test
npm run build
```

## Contact Form Configuration

The contact endpoint stores messages in Cloudflare D1; it does not send email notifications. To enable submissions:

1. Create a Cloudflare D1 database under your account.
2. Apply [`db/schema.sql`](db/schema.sql) once using the database SQL console.
3. Copy `.env.example` to `.env.local` for local development, or configure the variables in the deployment environment.
4. Provide the following server-side values:

| Variable | Purpose |
| --- | --- |
| `CLOUDFLARE_ACCOUNT_ID` | Account containing the D1 database |
| `CLOUDFLARE_D1_DATABASE_ID` | Database receiving contact messages |
| `CLOUDFLARE_API_TOKEN` | Account-scoped token with D1 edit permission |

Keep credentials out of version control and do not prefix these variables with `NEXT_PUBLIC_`. Without this configuration, the portfolio remains available, while form submissions return an unavailable response. The adapter uses the Cloudflare API and is subject to its rate limits.

The endpoint validates input, checks request origins, includes a honeypot field, and limits repeat submissions from the same email address. Submitted messages and production credentials are not included in this repository.

## Deployment to Vercel

1. Push the project files to your GitHub repository and import the repository into Vercel.
2. Select **Next.js** as the framework preset.
3. Set the root directory to the folder containing `package.json`.
4. Use `npm ci` for installation and `npm run build` for the build command. These settings are also declared in `vercel.json`.
5. Leave the output directory at the framework default and select a supported Node.js runtime that meets the requirements above.
6. Add the contact form environment variables if message storage is required, then deploy.

The contact database is configured separately from the website deployment. An existing hosted portfolio database is not automatically copied to a new deployment.

## Project Organization

| Location | Purpose |
| --- | --- |
| `app/` | Application entry point, metadata, shared styles, and contact API route |
| `components/portfolio/` | Portfolio sections and reusable interface components |
| `components/portfolio/data.ts` | Project descriptions, technology stacks, skills, and experience |
| `components/portfolio/projectMedia.ts` | Project destinations, preview images, and captions |
| `public/` | Profile image, résumé, fonts, technology logos, and gallery assets |
| `db/` | Contact inbox database access and schema |
| `docs/` | Feature notes and asset attribution references |

## Content Maintenance

Update portfolio content in `components/portfolio/data.ts` and project links or screenshots in `components/portfolio/projectMedia.ts`. Maintain gallery photographs in `public/` and their entries in `components/portfolio/SidequestSnapshots.tsx`.

The current profile image is `public/jethro-profile.webp`. When replacing it, update the matching favicon, PNG icon, and Apple touch icon, then revise the icon version values in `app/layout.tsx`. Replace `public/Jethro_Rendon_Resume.pdf` when publishing a new résumé and update its version in `components/portfolio/data.ts`.

Set the deployment origin in `app/layout.tsx` when moving the application to a different domain.

## Author and Attribution

**Jethro A. Rendon**

Computer Science Student · Web and Mobile Development · Artificial Intelligence

Technology logo sources are documented in [Project Brand Logos](docs/project-brand-logos.md). Third-party brands and project assets remain subject to their respective owners' terms.
