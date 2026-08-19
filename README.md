# ITCYBER Technologies Pvt Ltd — Website

Premium marketing site for **ITCYBER Technologies Pvt Ltd** — custom AI agents, intelligent business automation and custom software. Built with React 18, TypeScript, Vite, Tailwind CSS v4, Framer Motion and React Router.

## Run locally

```bash
npm install
npm run dev
```

Open the printed local URL (default `http://localhost:5173`).

## Production build

```bash
npm run build
```

The optimized site is emitted to `dist/`.

## Netlify deployment

1. Push this repository to GitHub / GitLab.
2. In Netlify → **Add new site → Import an existing project**, choose the repo.
3. Build settings (auto-detected from `netlify.toml`):
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Click **Deploy site**. The included `netlify.toml` already handles SPA redirects (`/* → /index.html`) and asset caching.
5. Point your domain (e.g. `www.itcyber.in`) via **Domain settings → Add custom domain** and enable HTTPS.

Manual deploys also work: run `npm run build` and drag the `dist/` folder onto https://app.netlify.com/drop.

## Where content lives

All business content is centralized (admin-ready, no hard-coded strings scattered in components):

| File | Owns |
| --- | --- |
| `src/data/site.ts` | Company name, emails, phone/WhatsApp number, socials, nav structure, CTA labels, legal copy settings |
| `src/data/content.ts` | Services, AI agents, automations, integrations, industries, function solutions, workflow demo scenarios, process, security pillars, jobs, resources |

**To change the WhatsApp number or email, edit `src/data/site.ts` only.**

## Backend / forms

Contact, assessment and job-application forms perform client-side validation and submit through `src/lib/leads.ts`, which currently simulates a request and is pre-wired for Supabase (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` in `.env` — never commit service-role keys). Analytics hooks read optional env IDs (`VITE_GA_ID`, `VITE_META_PIXEL_ID`, `VITE_LINKEDIN_ID`) and stay inert when unset.

## Routes

`/` home · `/services` · `/ai-agents` · `/automations` · `/custom-software` · `/solutions` + `/solutions/:industry` · `/work` · `/about` · `/careers` · `/contact` · `/privacy-policy` · `/terms-of-service` · `/cookie-policy` · `*` → 404.
