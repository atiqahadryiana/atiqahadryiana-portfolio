# Atiqah Adryiana — Portfolio

A responsive personal portfolio for Atiqah Adryiana, a software engineering
student at Universiti Tun Hussein Onn Malaysia with a computer-networking
foundation. The site presents her background, technical interests, project
concepts, credentials, and contact details through an original digital-fieldnotes
design in plum and lavender.

## What the portfolio shows

- A ten-second welcome sequence featuring twelve animated AA pixel-character
  poses. It opens the homepage automatically and supports `Esc` to skip.
- A personal introduction describing Atiqah's software-engineering studies,
  networking background, interest in UI/UX, and approach to learning by building.
- Education in Software Engineering at UTHM and a Diploma in Computer Networking.
- A past work-experience section reserved for confirmed jobs, internships,
  contract work, or freelance roles. It currently shows an honest empty state.
- Technical skills grouped into Frontend, Backend, Mobile, Database, AI/ML, and
  Tools & Networking, with recognizable technology logos. Unconfirmed skill
  ratings are labelled `Exploring` instead of claiming proficiency.
- Concept and portfolio projects including SmartBunda, BakauBase, ScamShield AI,
  and Task Manager. Each entry can open a detailed case-study page and clearly
  identifies unconfirmed implementation details.
- PCEP Python and Cisco networking training entries, with awards hidden until
  verified information is supplied.
- GitHub, LinkedIn, and email contact links. The validated contact form prepares
  an email draft addressed to `adryianawork@gmail.com`.
- A light and dark theme, responsive navigation, keyboard controls, reduced-motion
  support, accessible form feedback, and layouts tested from mobile to desktop.
- A development-only, password-protected admin workspace opened with `Ctrl+M` for
  updating the profile and resume link and adding or editing portfolio projects.

The AA logo, pixel-character sequence, typography, artwork, navigation, and page
composition form a distinct visual identity. Visible content is centralized and
editable, while placeholders and unsupported claims remain hidden or clearly
labelled.

## Features

- Ten-second AA welcome intro before the homepage, with an actual countdown,
  twelve supplied pixel-character actions and Escape to skip. Direct project,
  section, and admin links open immediately. Reduced motion removes animation.

- Responsive home with about, education, skill tabs, project filters,
  past work experience, certifications, awards, and contact.
- Individual `/projects/:slug` case studies, next-project navigation, and 404s.
- Light/dark theme with system preference and local persistence; no external
  font requests (Sora and DM Sans are bundled through Fontsource).
- Keyboard skill tabs, accessible menu with Escape/focus return, skip link,
  reduced motion, section navigation, and back-to-top controls.
- Conditional social, proof, demo, source, image, and resume links. A build/dev
  asset manifest verifies local resume files; public PDF URLs are also supported.
- Validated contact form: actual Formspree POST, email draft fallback, or an
  honest disabled state. No fake sending or locally persisted messages.
- Firebase and Vercel SPA rewrites; ESLint, Prettier, Vitest/RTL, and browser QA.
- Password-protected local admin at `/admin` for adding/editing projects,
  updating profile details, and changing the resume link, with persistent saves.

## Run locally

Use Node **22.12 or newer** (Node 24 is supported) and npm. From this folder:

```powershell
npm install
npm run dev
```

Open the Local URL printed by Vite. To build and serve the production output:

```powershell
npm run build
npm run preview
```

`dist/` is the deployable output; opening `index.html` directly from the file
system does not support SPA routing. The preview server does.

## Scripts and checks

| Command                | Purpose                                           |
| ---------------------- | ------------------------------------------------- |
| `npm run dev`          | Local development with hot reload                 |
| `npm run build`        | Production assets in dist                         |
| `npm run preview`      | Serve the built application locally               |
| `npm run lint`         | JavaScript, React hooks, JSX accessibility        |
| `npm test`             | Component and interaction tests (one run)         |
| `npm run test:watch`   | Watch unit tests                                  |
| `npm run test:browser` | Chromium responsive, route, theme, and axe checks |
| `npm run format`       | Apply Prettier                                    |
| `npm run format:check` | Verify formatting                                 |

For browser checks, first run `npx playwright install chromium` and
`npm run build`. Playwright starts and stops its own preview server. Tests
cover 360, 390, 768, 1024, and 1440px widths. Automated accessibility scans
complement keyboard/manual review; they are not WCAG certification.

## Customize

Edit `src/data/portfolio.js` first:

1. Review `profile.name` and public contact/social details. The supplied name
   and profile URLs are configured. `YOUR_NAME` still activates the generic hero.
2. Verify project status, actual technologies, role, features, and case studies.
   Existing technologies are explicitly proposed or examples.
3. Add real GitHub/demo URLs. Blank or `ADD_` values stay hidden.
4. Set `profile.resume` to your public PDF URL, or add a real resume to
   `public/resume.pdf` and use `/resume.pdf`. The hero's “View resume” button
   opens it in a new tab. Missing local files and placeholders stay hidden.
   Rebuild after changing the configuration.
5. Add real images to `public/images/` or certificates to
   `public/certificates/`; configure their root-relative paths in the data.
6. Confirm credential names, dates, verification links, and exact event roles.
   Awards remain empty until supported facts are supplied.

Additional content guidance and case-study templates are kept in the local
project documentation and intentionally excluded from the public repository.

## Manage your portfolio

Run `npm run dev` and press **Ctrl+M** from the portfolio to open `/admin`,
or enter `/admin` on the local URL printed by Vite. The shortcut leaves text
fields alone while you are typing and is enabled only in local development.
Sign in with your local admin account. On a fresh checkout, run
`npm run admin:setup` to generate the `atiqah` account and a random password.
The command displays the password once; keep it in your password manager.
It preserves an existing account unless you explicitly pass `--reset`.

- **Projects:** choose New project and enter its title, unique URL slug,
  category, description, status, and filter categories. Add technologies,
  source/demo/image URLs, and optional case study details. Existing entries
  have Edit and View actions. New entries get a project page and a labeled
  fallback illustration.
- **Profile:** update your name, identity, headline, introduction, About
  paragraphs, location, public email, and GitHub/LinkedIn URLs.
- **Resume:** paste a public HTTPS PDF link and save. The link must open without
  signing in. Leave blank and save to hide the portfolio's resume button.

Saves update `src/data/portfolio.js`, persist after a server restart, and refresh
the local portfolio. Rebuild and redeploy to update the published website.
There is no browser-only content override or automatic publication.

To generate a replacement password, run `npm run admin:setup -- --reset`.
Choose another username with `--username your-name`. Resetting the account
invalidates existing sessions. Sign out when you finish editing.

Only a salted scrypt password hash is stored in the ignored server-only
`.env.admin.local` file, which Vite blocks from public access. Never place
credentials in `VITE_` variables or public assets. Sessions use HttpOnly,
SameSite=Strict cookies and expire after four hours or a server restart.
Sign-out revokes the session. Saves require a session token, the same origin,
validated fields, and the latest content revision. Stale edits are rejected;
repeated failed sign-ins are temporarily rate limited.

This editor runs only on your computer through the development server. It is
absent from production and preview builds; the hosted `/admin` route returns
the normal 404 page. The admin API accepts only loopback requests. It cannot
publish the website or upload PDF/image files. Online administration would
require a deployed server and persistent storage.

## Contact configuration

Create `.env.local` and set `VITE_FORMSPREE_ENDPOINT` to the HTTPS `/f/…`
endpoint of a Formspree form you control. Restart Vite or rebuild
after changing environment variables. Client validation checks required fields
and email shape; Formspree is responsible for delivery and spam controls.
Only `https://formspree.io/f/<id>` is accepted by the current implementation.
No endpoint has been supplied or live submission tested by default.

If the endpoint is unset but `profile.email` is real, the validated form opens
an email draft. The visitor must send it in their mail client; the website
does not claim delivery. Without either value, the explanatory form remains
visible and submission is disabled. Drafts exist only in component memory.

`VITE_` values are embedded in browser assets. They must never contain secrets.
Use a public alias if you do not want to expose a personal email address.

## Structure

```text
public/                 Supplied AA logo, original SVG art, robots, optional real assets
src/components/         Reusable navigation, cards, form, tabs, timeline
src/sections/           Home page sections
src/pages/              Home, project details, local admin, 404
src/components/admin/   Workspace editors and shared form controls
tools/                  Server-only authentication, setup, and content saves
src/data/portfolio.js   Central portfolio content
src/hooks/useTheme.js   Theme selection and persistence
src/utils/content.js    URL, email, public asset, endpoint guards
src/styles/globals.css Theme tokens, responsive styles, Tailwind entry
tests/                  Vitest/RTL and Playwright browser checks
docs/                   Design, content, case studies, deployment
.ui-craft/              Durable design brief and token decisions
```

## Deployment and accessibility

The included Firebase and Vercel configuration supports SPA route fallbacks. No
hosted deployment is performed by this local project. Before publishing, replace the fallback
SVG social image with a PNG/JPEG at an absolute hosted URL; SVG previews are
not supported by every sharing service. Add an absolute `og:url` only after
you know the production domain. Do not invent a canonical URL.

Animations never conceal page content, fonts have system fallbacks, and the
theme initializes before React to reduce flashes. JavaScript is required for
the application; a noscript explanation is included. No analytics or external
widget is included. The authenticated admin API runs only in local development
and is excluded from production builds.
