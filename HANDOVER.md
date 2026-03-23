# Ownership Handover Guide

Steps to transfer full ownership of the project to a new owner, with the previous owner remaining as a contributor. Do these in order to avoid downtime.

---

## 1. GitHub

**Goal:** New owner holds the repository; previous owner becomes a collaborator.

1. Go to the repo → **Settings → Danger Zone → Transfer repository**
2. Enter the new owner's GitHub username and confirm
3. New owner accepts the transfer invite
4. New owner goes to **Settings → Collaborators → Add people** and adds the previous owner with **Write** access

The full git history, branches, PRs, and issues transfer with the repo. No code changes needed.

---

## 2. Vercel

**Goal:** New owner hosts the site from their own Vercel account.

1. New owner creates a Vercel account at vercel.com
2. **New Project → Import Git Repository** → select the transferred GitHub repo
3. Re-enter all environment variables from `.env.local.example`:
   - `NEXT_PUBLIC_SANITY_PROJECT_ID`
   - `NEXT_PUBLIC_SANITY_DATASET`
   - `SANITY_API_TOKEN`
   - `RESEND_API_KEY`
   - `BAKER_EMAIL`
   - `NEXT_PUBLIC_SITE_URL`
4. Deploy — the site rebuilds automatically

If using a custom domain, update the DNS records to point to the new Vercel deployment.

---

## 3. Sanity

**Goal:** New owner administers the CMS project (same project ID, no data lost).

1. Previous owner goes to [sanity.io/manage](https://sanity.io/manage) → project → **Members → Invite**
2. Enter new owner's email, role: **Administrator**
3. New owner accepts the invite
4. New owner can optionally remove the previous owner from the project later

The Sanity project ID stays the same — no config changes, no data migration.

---

## 4. Resend

**Goal:** New owner controls email sending.

1. New owner creates an account at resend.com
2. **API Keys → Create API Key** → copy the key
3. Update `RESEND_API_KEY` in the Vercel environment variables
4. Trigger a redeploy so the new key takes effect

---

## 5. After handover

- Previous owner's Vercel project can be deleted once the new deployment is confirmed working
- Previous owner's Resend API key (if any) can be revoked
- Previous owner remains a GitHub collaborator for ongoing contributions
