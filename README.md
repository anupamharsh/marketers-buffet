# Marketers Buffet

Scroll-animated marketing site built on the Marketers Buffet brand book.

**Stack:** Next.js 16 (App Router, static) · React 19 · TypeScript · Tailwind CSS 4 · GSAP 3.15 (ScrollTrigger, SplitText, Flip) · Lenis smooth scroll.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm start
```

Copy `.env.example` to `.env.local` and fill in values.

## Where things live

| Path | What |
| --- | --- |
| `src/content/` | All content: posts, templates, library, newsletter issues, site config. Field names mirror the brief's CMS spec. |
| `src/app/` | Pages: home, blog, blog post, templates, template detail, library, newsletter, about, book a call, legal, 404 |
| `src/components/home/` | Homepage hero + three scroll stories |
| `src/components/motion/` | Reusable motion: line-mask text reveal, fade-up, hand-drawn scribbles, magnetic buttons, smooth scroll |
| `src/components/ui/` | Brand UI kit: notification, search bar, good-vs-bad cards, phone frame, generated cover art |
| `src/lib/analytics.ts` | `track()` helper with the brief's 8 events → GTM dataLayer |
| `src/app/globals.css` | Design tokens (colours, type, textures, grain, glows) |

Inline content markup: `_words_` → Instrument Serif Italic, `==words==` → serif + mint highlighter, `**bold**`, `[link](url)`.

## Motion and accessibility

- All motion runs through `gsap.matchMedia()`. Reduced-motion visitors get a complete static layout; mobile gets lighter, unpinned versions of the scroll stories.
- Skip link, visible focus rings, Esc closes menus/dialogs, Ctrl/⌘+K search, labelled fields, errors in words, 44px tap targets.

## Not wired yet (open decisions in the brief)

- **CMS / admin**: content is typed files in `src/content/`, ready to move to a headless CMS.
- **Email provider**: `src/app/api/newsletter/route.ts` validates and returns OK.
- **Comments storage + moderation**: `src/app/api/comments/route.ts`.
- **Payments**: `TemplateAction.tsx`, `BookingWidget.tsx` (paid sessions).
- **Booking tool**: `BookingWidget.tsx` uses placeholder slots.
- **Template files**: file URLs are empty in `src/content/templates.ts`.
- Add rate limiting / bot protection to the public API routes before launch.
- Legal pages are drafts and need a lawyer's review.
