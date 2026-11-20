# Hubroot Portfolio

Personal portfolio for Hubroot, AI Automation Engineer. Next.js 15 (App Router) + React 19 + TypeScript, plain CSS with design tokens, Framer Motion for the small number of transitions that explain state.

## Run

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (all pages are statically generated)
npm start          # serve the production build
npm run typecheck
npm run icons      # regenerate brand icons from simple-icons
```

Requires Node 18.18+ (Node 22 LTS recommended).

## Deploy

**Netlify** (recommended, already used in the RecruitTech project): connect the repo; Netlify detects Next.js automatically. Build command `npm run build`, no publish dir needed (the Next.js runtime handles it). `netlify.toml` is included.

**Vercel**: import the repo, no settings needed.

Before deploying, set `site.url` in `src/config/site.ts` to the real domain.

## Where things live

| What | Where |
| --- | --- |
| Email, X, calendar URL, form endpoint | `src/config/site.ts` |
| Projects / case studies | `src/data/projects.ts` |
| Services | `src/data/services.ts` |
| Process steps, FAQ, problem list, reliability principles | `src/data/content.ts` |
| Tool names | `src/data/tools.ts` |
| Design tokens (light + dark + control-room) | `src/styles/tokens.css` |
| Portrait | `public/images/hubroot-portrait.webp` |
| Project screenshots | `public/images/projects/<slug>/` |
| Project videos | `public/videos/projects/<slug>/` |
| Original/unoptimised source images | `assets-source/` (not served) |
| Brand icon SVGs | `public/icons/` (generated) |

## Portrait

Drop a real photo at `public/images/hubroot-portrait.webp` (portrait orientation, ~1200×1500, natural expression, clean background) and rebuild. The placeholder disappears automatically; no code change.

## Add a project

Add an object to the `projects` array in `src/data/projects.ts`. Its page (`/work/<slug>`), card, filters, diagram, exception explorer and integration constellation entries are all generated from it. Set `featured: true` to show it on the homepage (keep it to 5–6). Create `public/images/projects/<slug>/` for its media.

## Add screenshots / video

Put files in `public/images/projects/<slug>/` (or `public/videos/projects/<slug>/`), then add to that project's `media` array:

```ts
media: [
  {
    type: "image",
    src: "/images/projects/whatsapp-appointment-booking/booking-confirmation.webp",
    alt: "WhatsApp chat showing a booking confirmation",
    proves: "A real booking confirmed inside the customer's WhatsApp chat.",
    width: 1200, height: 900,
  },
  { type: "video", src: "/videos/projects/whatsapp-appointment-booking/demo.mp4", poster: "/images/projects/whatsapp-appointment-booking/demo-poster.webp", alt: "Demo of a reschedule", proves: "The reschedule path end to end." },
]
```

Every media item needs `proves`. Videos never autoplay.

## Calendar link later

Set `calendarUrl` in `src/config/site.ts`. A "Book a call" option then appears in every CTA block, the footer and the contact page.

## Contact form

With `formEndpoint: null` the form opens the visitor's email app pre-filled (works with zero backend). To receive submissions directly, set `formEndpoint` to any URL that accepts a JSON POST (Formspree, a Netlify Function, an n8n webhook).
