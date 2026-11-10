# Zuhaib Ahmad Khan · Portfolio

An Apple-style portfolio built like an App Store "Today" feed. The home screen is a bento of story cards. Each card opens in place as a full-screen sheet and also has its own URL (`/story/<slug>`), so any story can be shared directly. A floating dock and a ⌘K palette keep every story one tap away.

**Live:** https://zuhaibkhan.vercel.app

## What's inside

| Area | How it works |
|---|---|
| **Stories** | 27 typed content files (`src/content`) rendered by one block renderer. Diagrams are responsive HTML/CSS components, with no product screenshots. |
| **Card → sheet** | Next.js parallel route `@modal` plus intercepting route `(.)story/[slug]`. A Motion `layoutId` expands the card into the sheet. The sheet is a Radix Dialog with a focus trap, Esc to close and focus returned to the card. |
| **Résumé** | `/api/resume` counts the download, then redirects to the PDF. You can upload a replacement PDF from the admin. |
| **Private analytics** | First-party events (`/api/t`) are stored in Supabase. Bots are filtered out and visitor ids are anonymous hashes that rotate daily. RLS is on with zero policies, so the public keys can't read anything. Vercel Web Analytics and Speed Insights run alongside it. |
| **Owner dashboard** | `/admin` is password-protected and shows views, visitors, résumé downloads, top stories, referrers, countries, devices and recent activity. |
| **Content editor** | `/admin/content` lets you edit your profile, the headline numbers and each story's title, summary and intro, hide a story or replace the résumé. Saving regenerates the static pages. |

Stack: Next.js 15 (App Router, SSG), React 19, TypeScript, Tailwind CSS v4, Motion, cmdk, Radix, Supabase, Zod, Vitest and Playwright.

## Run locally

```bash
npm install
cp .env.example .env.local   # fill in values (all optional for browsing)
npm run dev
```

Without Supabase variables the site works fully; analytics and the editor just switch off.

## Environment variables

| Name | Purpose |
|---|---|
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only key. It's never sent to the browser. |
| `ADMIN_PASSWORD` | Password for `/admin` |
| `ADMIN_SESSION_SECRET` | Signs the admin and owner cookies (`openssl rand -hex 32`) |
| `VISITOR_SALT_SECRET` | Secret for the daily-rotating visitor hash (`openssl rand -hex 32`) |
| `CRON_SECRET` | Bearer token for the daily `/api/keepalive` cron |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL, e.g. `https://zuhaibkhan.vercel.app` |
| `RESEND_API_KEY` | Optional mail key for the contact form ([resend.com](https://resend.com)). Without it, the live site forwards messages through FormSubmit, which needs one activation click in the recipient's inbox. Messages are always saved and shown in `/admin/messages`. |
| `CONTACT_FORWARD` | Optional. `off` stops the FormSubmit forwarding; `formsubmit` turns it on outside production. |
| `CONTACT_TO` | Optional. Where contact messages go; defaults to the email on the site. |
| `CONTACT_FROM` | Optional. Sender shown on contact emails; defaults to Resend's test sender, which can deliver only to the Resend account's own address. |

## Database setup (one time)

In the Supabase dashboard, open **SQL Editor**. Run `supabase/migrations/0001_analytics.sql`, then `supabase/migrations/0002_site_content.sql`. Contact messages are kept as private files in storage and need no setup; running `supabase/migrations/0003_contact_messages.sql` is optional and moves new ones to a table.

To check that the data is private, query it with the public anon key. Each of these should return a 401 or 404, or an empty result:

```bash
curl "$SUPABASE_URL/rest/v1/events?select=*" -H "apikey: $ANON_KEY"
curl -X POST "$SUPABASE_URL/rest/v1/rpc/analytics_summary" -H "apikey: $ANON_KEY"
```

## Tests

```bash
npm run typecheck && npm run lint
npm test               # Vitest: hashing, bot filter, signed cookies, schemas, content integrity
npm run build && npm run test:e2e   # Playwright: desktop Chrome, iPhone 15 (WebKit), Pixel 7
```

## Privacy

- No cookies are set for visitors and no IP addresses are stored.
- Visitor ids are `sha256(daily secret salt ‖ ip ‖ user agent)`. They change every day, so visits can't be linked across days.
- Your own visits are skipped once you've signed in to `/admin` on that browser.
