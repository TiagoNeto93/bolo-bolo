@AGENTS.md

# Bolo-Bolo — Bakery Website

## Project
**Bolo-Bolo** — home bakery in Braga, Portugal. Sells custom cakes (cheesecakes, chocolate cakes, carrot cakes with icing), baked at home, delivered locally.
No online payment — customers submit an enquiry, she confirms via WhatsApp.

## Stack
Next.js 16 (App Router) + TypeScript
Tailwind CSS 4 for styling
Sanity CMS for backoffice
Hosted on Vercel

## Brand & Design
- Name: **Bolo-Bolo** (playful, joyful, memorable)
- Fonts: Fredoka (display/logo), Playfair Display (subheadings), DM Sans (body)
- Palette: linen, parchment, espresso, terracotta, honey, dusty-rose, sage
- Tone: warm, personal, first-person, informal "tu" — like a friend inviting you into her kitchen
- All copy in Portuguese

## Routes (Portuguese)
- `/` — Homepage: hero with CTA
- `/produtos` — Catalogue: all cakes, filterable by type
- `/produtos/[slug]` — Cake detail: photos, description, sizes/flavours
- `/contacto` — Order form: cake choice, desired date, notes, contact info
- `/contacto/confirmacao` — Confirmation: "we'll be in touch via WhatsApp"
- `/sobre` — About: her story, kitchen, values
- `/galeria` — Photo gallery
- `/entrega` — Delivery info: zones, lead time, pricing

## Order flow
No payment. Customer fills enquiry form → she reviews → confirms via WhatsApp/email.
Date picker should grey out blocked dates fetched from Sanity.
On submission, send notification email to her (use Resend or Nodemailer via Next.js API route).

## Backoffice (Sanity)
She manages: cake catalogue, photos, prices, blocked dates, homepage content, about text.
She is non-technical — the editing experience must be dead simple.
Sanity Vercel integration enabled — site redeploys on publish.

## Constraints
- Mobile-first (most customers will be on phones)
- Fast load times — lots of cake photos (use next/image)
- SEO matters (local search in Braga)
- Use server components by default, "use client" only when needed

---

## Methodology — Feature Slices

We build in **vertical slices**: each slice delivers a complete, working feature from schema → data → UI → verified. One slice at a time, each one shippable.

### Workflow per slice
1. **Define** — brief description of what the slice does and what "done" looks like
2. **Branch** — create `slice/N-short-name` off `main` before writing any code
3. **Build** — schema → query → page/component → wire up
4. **Verify** — build passes, feature works end-to-end
5. **Commit** — clean commit on the slice branch, descriptive message
6. **Open PR** — push branch and open a PR with `gh pr create`; never merge to `main` directly
7. **Update tracker** — mark slice as done below, move to next

### Rules
- Every slice gets its own branch: `slice/N-short-name` (e.g. `slice/2-produto-catalogue`)
- Never start a new slice until the current one is verified and committed
- Never commit slice work directly to `main` — always branch first
- Never merge a slice branch into `main` — open a PR and let the user merge
- If a slice reveals missing work, add it as a new slice — don't scope-creep the current one
- Each session should start by reading this file and picking up where we left off
- When we discover a reusable pattern or convention during a slice, add it to "Conventions" below

### Slice Tracker

| # | Slice | Status |
|---|-------|--------|
| 0 | Project skeleton + design system | DONE |
| 1 | Sanity Studio + core schemas | DONE |
| 2 | Produto catalogue page | DONE |
| 3 | Produto detail page | DONE |
| 4 | Order enquiry form + email notification | DONE |
| 5 | Blocked dates in date picker | DONE |
| 6 | Sobre + Galeria pages | DONE |
| 7 | Entrega page + homepage featured cakes | DONE |
| 8 | SEO, metadata, OG images, performance polish | DONE |
| 9 | Order management — persist enquiries in Sanity | DONE |
| 10 | Rate limiting + honeypot spam protection | DONE |
| 11 | Vercel Analytics | DONE |
| 12 | Seasonal / featured specials | DONE |
| 13 | Order status lookup | DONE |
| 14 | Availability auto-block | DONE |
| 15 | Customer confirmation email | DONE |
| 16 | CMS-managed copy — homepage hero, footer tagline, confirmation page | DONE |
| 17 | Service simplification — replace Upstash with in-memory rate limiting | DONE |
| 18 | Studio branding — brand theme, custom logo, nav icons | DONE |
| 19 | Resend custom domain — configurable sender via env var | DONE |
| 20 | Order total amount — server-side pricing, stored on encomenda, shown in emails and status page | DONE |

### Slice 9 detail — Order management

**Goal:** Every enquiry submitted via `/contacto` is persisted as an `encomenda` document in Sanity, giving the baker a full order history she can view and manage in the Studio.

**Schema — `encomenda` document:**
- `referencia` (string, read-only) — auto-generated reference number, format `BB-YYYYMMDD-XXXX` (e.g. `BB-20260322-4F2A`). Generated server-side on submission, stored and shown to the customer on the confirmation page and in the baker's notification email.
- `estado` (string, dropdown) — `pendente` (default) | `confirmada` | `em_preparacao` | `entregue` | `cancelada`
- `nome`, `contacto` (string) — customer name and email/phone
- `data` (date) — requested delivery date
- `items` (array of objects) — `{ produto: string, tamanho: string }` — mirrors the form submission
- `notas` (text) — special requests
- `criadoEm` (datetime) — set automatically on creation (`_createdAt` can serve this)

**API route changes (`/api/encomenda`):**
- Generate `referencia` before sending email
- Write the `encomenda` document to Sanity using the Editor API token (`SANITY_API_TOKEN` env var, already configured for Slice 1) via `client.create()`
- Include `referencia` in the baker's notification email subject and body
- Return `referencia` in the API response

**Confirmation page:**
- Display the `referencia` to the customer: "A tua referência é BB-20260322-4F2A — guarda-a para qualquer questão."

**Studio UX:**
- Add `encomenda` to `sanity.config.ts` structure, listed under a new "Encomendas" section above the divider
- Default sort: most recent first
- Preview shows: referencia + estado + nome + data
- The baker cannot create encomendas manually — only the API creates them (`__experimental_actions: ["update", "publish"]`)

**Constraints:**
- The Sanity write must not block the email — if Sanity write fails, log the error but still send the email and return success to the user
- Do not expose customer data beyond what is already in the email

### Slice 11 detail — Vercel Analytics

**Goal:** Enable Vercel Analytics to track page views and understand traffic (especially local search in Braga).

- Install `@vercel/analytics` package
- Add `<Analytics />` component to root layout (`src/app/layout.tsx`)
- Enable in Vercel project dashboard if not already active
- No configuration needed beyond that — Vercel handles the rest

### Slice 12 detail — Seasonal / featured specials

**Goal:** Baker can mark any produto as a seasonal special in Sanity; these appear on the homepage with a badge (e.g. "Especial de Páscoa").

**Schema changes (`produto`):**
- Add `destaque` (boolean, default false) — marks as featured/special
- Add `etiqueta` (string, optional) — badge label, e.g. "Especial de Páscoa", "Edição Limitada"

**Homepage:**
- Query products where `destaque == true`
- Render a "Especiais da Época" section above or alongside the existing featured cakes
- Show the `etiqueta` as a badge on the card (styled in terracotta or honey)
- Section only renders if at least one destaque product exists (no empty section)

**Constraints:**
- Baker controls this entirely from Studio — no code changes needed to add/remove specials
- Badge label is optional; if absent, show a generic "Destaque" badge

### Slice 13 detail — Order status lookup

**Goal:** Customer can enter their `referencia` (e.g. `BB-20260322-4F2A`) on a public page and see the current `estado` of their order — no auth needed.

**New page `/encomenda/[referencia]`:**
- Input form on `/encomenda` — customer types their referencia, submits
- Redirects to `/encomenda/[referencia]` which queries Sanity for the matching `encomenda` document
- Display: referencia, estado (as a human-readable label + visual indicator), data, nome
- Do NOT display: contacto, notas, items detail — keep it minimal
- If not found: friendly error message ("Não encontrámos nenhuma encomenda com essa referência.")

**Estado labels (PT):**
- `pendente` → "A aguardar confirmação"
- `confirmada` → "Confirmada"
- `em_preparacao` → "Em preparação"
- `entregue` → "Entregue"
- `cancelada` → "Cancelada"

**Constraints:**
- Query uses the public (read-only) Sanity client — no API token needed
- Reference the confirmation page copy to prompt customers to use this page

### Slice 14 detail — Availability auto-block

**Goal:** When an `encomenda` is created, automatically block the delivery date if the number of confirmed orders for that date reaches a configurable maximum — preventing overbooking without manual intervention.

**New Sanity field (`deliveryInfo` singleton):**
- `maxEncomendas` (number, default 2) — baker-configurable max orders per day

**API route changes (`/api/encomenda`):**
- After writing the new encomenda, query Sanity for how many non-cancelled encomendas exist for that date
- If count >= `maxEncomendas`, add the date to `datasBloqueadas` in the `deliveryInfo` singleton via `client.patch().setIfMissing().insert()`
- This write is best-effort — log errors but do not fail the request

**Constraints:**
- Only count `estado != "cancelada"` orders when checking capacity
- Do not unblock dates automatically when an order is cancelled — baker handles that manually in Studio (avoids complexity)
- `maxEncomendas` must be visible and editable in Studio under the Entrega section

### Slice 15 detail — Customer confirmation email

**Goal:** Send the customer a confirmation email after a successful enquiry, containing their reference number and a direct link to check their order status — so they don't need to remember to copy the reference on the spot.

**Context:** Currently only the baker receives a notification email (slice 4). The customer only sees the reference on the `/contacto/confirmacao` page — if they close that tab, it's gone.

**API route changes (`/api/encomenda`):**
- After generating `referencia` and writing to Sanity, send a second email to the customer's email/phone field (only if it looks like an email — skip if it's a phone number)
- Use the same Resend/Nodemailer setup already in place for the baker notification
- Customer email content:
  - Subject: `Encomenda recebida — ${referencia}`
  - Body: thank you message, the reference number prominent, a direct link to `/encomenda/${referencia}`, reminder that she'll be in touch via WhatsApp to confirm
- Keep the baker notification email unchanged

**Confirmation page (`/contacto/confirmacao`):**
- Re-add the "Ver estado da encomenda →" link that was lost in a revert (links to `/encomenda/${ref}`)

**Constraints:**
- Customer email must not block or fail the request — wrap in try/catch, log errors silently
- Do not send a customer email if the contacto field is a phone number (no `@`)
- All copy in Portuguese, informal "tu"

---

## Backlog (future slices, not yet scheduled)

| Feature | Notes |
|---------|-------|
| Testimonials section | Baker adds quotes in Sanity; displayed on homepage. Simple schema + component. |
| FAQ page (`/faq`) | Allergens, lead time, delivery, payment questions. Sanity-managed. Reduces WhatsApp noise. |

---

## Future Architecture Notes

Decisions deferred intentionally. Read before adding new infrastructure.

### Order management beyond Sanity

Orders are currently stored in Sanity (Slice 9). This is fine for the current scale (home bakery, enquiry-based, confirmed via WhatsApp).

**Migrate to Supabase (PostgreSQL) if any of these become true:**
- Online payments are added — Stripe requires reliable transactional records linked to payment intents; Sanity is not built for this
- Customer accounts are needed — login, order history, reorder — requires proper auth + relational DB
- Reporting/analytics become important — revenue trends, orders per month, best-selling products — GROQ is not a reporting engine
- Order volume grows to dozens per day — Sanity mutation rate limits could become a constraint

**Why Supabase specifically:** free tier is generous, PostgreSQL is battle-tested, has built-in auth (if customer accounts are ever needed), and integrates cleanly with Next.js via `@supabase/ssr`. A migration would mean: new `orders` table in Supabase, update `/api/encomenda` to write there instead of (or in addition to) Sanity, and build a simple order dashboard (could stay in the Next.js app rather than Studio).

### Rate limiting upgrade path

Rate limiting is currently handled **in-memory** (`ipRequests` Map in `src/app/api/encomenda/route.ts`) — 3 requests per IP per hour, resets on cold start. This is sufficient for a low-traffic home bakery, especially combined with the honeypot field.

**Upgrade to Vercel KV if any of these become true:**
- Abuse or spam bypasses the honeypot and overwhelms the form
- Traffic grows and cold-start resets make in-memory limits unreliable

**How to upgrade:** Vercel dashboard → Storage → Create KV Database → env vars (`KV_REST_API_URL`, `KV_REST_API_TOKEN`) are auto-injected into the project. Vercel KV is powered by Upstash under the hood, so the old `Ratelimit.slidingWindow()` pattern from the git history works unchanged — just swap in the new env vars.

---

## Conventions

Code patterns and decisions we've committed to. Grows as we build.

### Sanity Studio theming
- Studio theme lives in `src/lib/sanity/studio-theme.ts` — uses `buildTheme` from `@sanity/ui/theme` with a warm gray palette (linen light end, espresso dark end) and terracotta replacing the default blue hue for primary states
- Custom logo component at `src/lib/sanity/StudioLogo.tsx` — uses `color: inherit` so it adapts to light/dark mode
- Global heading CSS in `globals.css` (`h1–h6 { color: var(--color-espresso) }`) bleeds into the Studio in dark mode, making document headings nearly invisible. A `[data-sanity-core]` reset was attempted but did not take effect. **Known issue — dark mode document headings render in espresso against a dark background.** If revisiting, inspect the Studio's root DOM element to find the correct isolation selector, or scope the global heading rule to a site-only wrapper class.

### Design system
- Use `font-display` (Fredoka) for the Bolo-Bolo brand name and display text
- Use `font-heading` (Playfair Display) for page headings (h1, h2) on inner pages
- Use Tailwind classes for font-family, not global CSS rules (avoids specificity conflicts)
- Brand name always renders as: `Bolo<span className="text-terracotta">-</span>Bolo`
- Use `.btn-primary` for CTAs, `.card-warm` for product cards, `.link-warm` for nav links
- Use `.stagger-children` for entrance animations on grouped elements

### Components
- Shared layout components live in `src/app/_components/`
- Header is a client component (mobile menu state); keep other components as server components unless interactivity is needed
- Sanity client + queries live in `src/lib/sanity/`
- Site pages live in `src/app/(site)/` route group — gets Header + Footer via `(site)/layout.tsx`
- Studio lives in `src/app/studio/[[...tool]]/` — separate from site layout, no Header/Footer
- Root layout (`src/app/layout.tsx`) only provides fonts and global CSS, no nav

### Sanity
- Schemas use plain objects (not `defineType`/`defineField`) — TypeScript `prepare()` functions must use `Record<string, any>` parameter type to satisfy Sanity's `PreviewValue` signature
- Singletons (homepage, about, deliveryInfo) use `__experimental_actions` to prevent creating multiple documents
- Studio structure manually organized in `sanity.config.ts` via `structureTool({ structure })` for clean baker UX
- `studioViewport` from `next-sanity` needs `as Viewport` cast for Next.js 16 compatibility
- Queries always resolve slug as a string: `"slug": slug.current`
- Blocked dates query returns a flat array of date strings: `[...].date`
- `@sanity/image-url`: use named export `import { createImageUrlBuilder as imageUrlBuilder } from "@sanity/image-url"` — the default export is deprecated and logs a warning
- `cdn.sanity.io` must be listed in `next.config.ts` under `images.remotePatterns` — `next/image` will block remote images otherwise
- Pages that read frequently-changing Sanity data (e.g. blocked dates, delivery zones) must opt out of static generation: `export const dynamic = "force-dynamic"` at the top of the page file
- Array items written via the API must include a `_key` property (unique string, e.g. `Math.random().toString(36).slice(2, 10)`) — Sanity Studio shows a "Missing keys" error otherwise
- `canHandleIntent((intent) => intent !== "create")` on a `documentTypeList` hides the Create button for non-admin users; project owners always retain full access regardless

### Dates & date picker
- Parse Sanity date strings (`YYYY-MM-DD`) manually to avoid UTC timezone day-shift: `const [y, m, d] = str.split("-").map(Number); new Date(y, m - 1, d)`
- `react-datepicker` CSS must be imported in `globals.css` (`@import "react-datepicker/dist/react-datepicker.css"`), NOT inside a client component — Turbopack does not process CSS imports in client components at dev time, causing the calendar popup to appear unstyled/invisible
- `minDate` passed to `react-datepicker` must be normalised to midnight before adding lead days: `minDate.setHours(0, 0, 0, 0); minDate.setDate(minDate.getDate() + leadDays)` — skipping the midnight normalisation allows selecting today or even past times depending on when the page loads
- Numeric `leadTime` fields in Sanity should be `type: "number"`, not `type: "string"`, so they can be used directly in date arithmetic

### OG images & SEO
- OG image files (`opengraph-image.tsx`) in dynamic routes that fetch from Sanity must NOT use `export const runtime = "edge"` — the Sanity client requires the Node.js runtime; remove the export or set it to `"nodejs"`
- The direct URL `/route/opengraph-image` does NOT work for dynamic routes — Next.js serves OG images at an internal hashed URL. The `og:image` meta tag in the page `<head>` is correctly populated; verify with `curl -s <page-url> | grep og:image` rather than visiting the image URL directly
- `NEXT_PUBLIC_SITE_URL` must be set in Vercel environment variables to the production domain (e.g. `https://bolo-bolo.pt`) for canonical URLs, sitemap, robots, and OG `metadataBase` to resolve correctly

### Copy
- All UI text in Portuguese, informal "tu" register
- First person singular ("eu", "mim") not plural ("nos")
