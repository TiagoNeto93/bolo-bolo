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
| 5 | Blocked dates in date picker | TODO |
| 6 | Sobre + Galeria pages | TODO |
| 7 | Entrega page + homepage featured cakes | TODO |
| 8 | SEO, metadata, OG images, performance polish | TODO |
| 9 | Order management — persist enquiries in Sanity | TODO |

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

---

## Conventions

Code patterns and decisions we've committed to. Grows as we build.

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

### Copy
- All UI text in Portuguese, informal "tu" register
- First person singular ("eu", "mim") not plural ("nos")
