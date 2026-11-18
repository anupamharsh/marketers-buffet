# Marketers Buffet

Personal marketing site of Anupam Harsh: blogs, automations, AI-in-marketing examples, templates (free and paid), a fortnightly newsletter, call booking and user accounts.

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · General Sans (self-hosted) · Supabase (Postgres, Storage, Auth) · Brevo · Razorpay · Cal ID · Cloudflare Turnstile. Hosted on Netlify.

## Run locally

```bash
npm install
cp .env.example .env.local   # fill in the values
npm run db:migrate           # creates/updates tables in the "mb" schema (safe to re-run)
npm run dev
```

Production check: `npx next build`, then `npx next start` (only after the build has finished).

## Where things live

| Path | What |
| --- | --- |
| `src/content/` | All content as typed files (`blog.ts`, `automations.ts`, `ai-edge.ts`, `templates.ts`, `site.ts`). Bodies are lists of blocks (`types.ts`). |
| `src/app/` | Pages: home, blog, automations, AI edge, templates, newsletter, book a call, about, sign in, account, admin, legal, 404. |
| `src/app/api/` | Server routes: newsletter, comments, template downloads, Razorpay checkout and webhook, Cal ID webhook, account (`/api/me`), comment admin, cron keep-alive. |
| `src/lib/server/` | Database, rate limiting + Turnstile, storage links, Brevo, Razorpay, auth. Server-only. |
| `src/components/` | Shared card, block renderer, filters, share bar, comments, layout chrome. |
| `scripts/schema.sql` | Database schema. |

## Rules the code follows

- Motion: only the navbar capsule change (280ms), colour hovers (160ms) and fades (240ms). Reduced motion is respected.
- Every comment waits for approval at `/admin` (emails listed in `ADMIN_EMAILS`).
- Forms: Turnstile + 5 submissions per form per hour per IP hash and per browser ID. IPs are stored only as salted hashes.
- Tables live in the `mb` schema, which the public Supabase API can't reach. Only server routes touch the database.
- Dates are always DD/MM/YY.
- Icons come only from licensed sets in the asset pack (tabler, ionicons MIT; dashboard-icons Apache 2.0; simple-icons CC0). `canva.svg` is from the unlicensed tech-stack set: replace it before launch.
