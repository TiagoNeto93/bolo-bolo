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
2. **Build** — schema → query → page/component → wire up
3. **Verify** — build passes, feature works end-to-end
4. **Commit** — clean commit per slice, descriptive message
5. **Update tracker** — mark slice as done below, move to next

### Rules
- Never start a new slice until the current one is verified and committed
- If a slice reveals missing work, add it as a new slice — don't scope-creep the current one
- Each session should start by reading this file and picking up where we left off
- When we discover a reusable pattern or convention during a slice, add it to "Conventions" below

### Slice Tracker

| # | Slice | Status |
|---|-------|--------|
| 0 | Project skeleton + design system | DONE |
| 1 | Sanity Studio + core schemas | TODO |
| 2 | Produto catalogue page | TODO |
| 3 | Produto detail page | TODO |
| 4 | Order enquiry form + email notification | TODO |
| 5 | Blocked dates in date picker | TODO |
| 6 | Sobre + Galeria pages | TODO |
| 7 | Entrega page + homepage featured cakes | TODO |
| 8 | SEO, metadata, OG images, performance polish | TODO |

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

### Copy
- All UI text in Portuguese, informal "tu" register
- First person singular ("eu", "mim") not plural ("nos")
