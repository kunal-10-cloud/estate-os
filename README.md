# Estate OS

One real estate platform for every seat in a brokerage: agents, the broker, transaction coordination, accounting, property management, field technicians and new-home sales, plus portals for buyers, sellers, tenants and owners, and the brokerage's public website. Everything runs on one shared record, so what a client does in their portal shows up for the team straight away.

The demo tenant is **Harbor & Vine Realty** (Austin, TX). All data is sample data seeded in the browser; nothing is sent anywhere.

## Run it locally

Requirements: Python 3 (for the static server). No npm install is needed for the app itself.

```bash
cd frontend
yarn start          # or: npm start, or: python3 -m http.server 3000 --directory website
```

Open http://localhost:3000. The app opens on the persona picker ("Who are you today?").

State lives in memory, so a refresh resets the demo. The browser remembers only the last persona you picked.

## Personas

| Seat | Person | Lands on |
|---|---|---|
| Broker-owner (full access) | Maya Ortiz | Today |
| Buyer's agent | Jordan Lee | Today |
| Listing agent | Priya Shah | Listing ops |
| Transaction coordinator | Nina Patel | Compliance |
| Office manager & accounting | Grace Liu | Commissions |
| Property manager | Leo Grant | Today (rentals) |
| Maintenance technician (phone app) | Ray Alvarez | Job list |
| Developer sales head | Rohan Mehta | Projects (The Linden at Mueller) |
| Website visitor | Public | harborandvine.com site |
| Buyer | Elena Ruiz | Buyer portal |
| Sellers | Rachel & Tom Grant | Seller portal |
| Tenant | Hannah Cole | Tenant portal |
| Owner | Brooks Holdings LLC | Owner portal |

Switch at any time from the avatar menu → **Switch persona**. The picker also has **Watch the full story**, a guided tour that follows one deal across personas.

## Set it up on an Emergent job

The repo follows the standard Emergent layout:

```
frontend/   static app; `yarn start` serves on :3000, `yarn build` copies website/ to build/
backend/    minimal FastAPI app (GET /api/health) on :8001, ready for real persistence later
```

1. Create an Emergent job from this repository (or clone it into `/app`).
2. Keep the code at `frontend/website/`. Don't move `website/` to the repo root; the deploy build copies `frontend/` and runs `yarn build`.
3. The frontend needs no dependencies. If the pod's supervisor runs `yarn start` in `/app/frontend`, it serves the site on port 3000. The backend runs with `uvicorn server:app --host 0.0.0.0 --port 8001` from `/app/backend` after `pip install -r requirements.txt`.
4. After a deploy, check that `frontend/build/` matches `frontend/website/` (`diff -rq website build`).

## How the code is organised

No build step: Preact + htm (vendored in `website/vendor/`) and plain ES scripts that share one global scope. Load order matters and is set in `index.html`:

| File | What it owns |
|---|---|
| `data.js` | Seed data: agents, listings, people, threads, deals, buildings, units, tickets, The Linden project |
| `portal.js` | Buyer portal: budget, find, saved, tours, offer builder, under contract, closing, My home |
| `seller.js` / `.css` | Seller portal and Listing ops (CMA, net sheet, disclosures, Clear Cooperation clock, showings, offers) |
| `residents.js` / `.css` | Tenant portal, owner portal, PM ops, and Ray's phone app |
| `txn.js` / `.css` | Compliance review, commissions and CDAs, trust and earnest money, lead routing |
| `site.js` / `.css` | Public website: buy, rent, sell valuation, new homes, agents, sign in |
| `office.js` / `.css` | Office screens: Today, Inbox, People, Deals, Listings, Rentals, Projects, Back office, Modules |
| `app.js` / `styles.css` | Shell: persona picker, router, sidebar, ⌘K search, notifications, settings, access control, guided tour |

Feature files register with the shell through `window.EOS_EXT` (pages, modals, seed data, nav items). They talk to each other through a few small APIs:

- `window.notify({ who, text, route })`: cross-persona notifications in the bell.
- `window.EOS_SEARCH`: search providers for the ⌘K palette.
- `window.TxApi.commission(dealId)` / `.emd(dealId)`: the single source for commission and earnest-money numbers.
- `window.SlApi.offers(listingId)`: the single source for offers on a listing.
- `canSee(page, role)` / `canRoute(route)`: permission checks.

## Tests

End-to-end suites built on Playwright, using your installed Google Chrome.

```bash
cd frontend && yarn start            # in one terminal
cd tests && npm install && ./run-all.sh
```

Set `EOS_URL` to test another address (default `http://localhost:3000/index.html`). `journey.mjs` is the main one: a single session that walks a visitor's tour request through to closing, payout and homeowner, plus the rental and new-homes stories. It checks notifications and that the numbers match across screens. `deadends.mjs` clicks every visible button on each persona's main screens.

## Docs

`docs/03-product-spec.md` is the full product spec: 1,554 benchmarked features across 13 modules, country compliance packs, data model and release plan. `docs/features/` holds the eight research files behind it; `docs/01-market-research.md` and the Mobbin UI teardowns cover the market and design references.

## Known gaps

- After Leo approves a rental applicant, the unit stays "Vacant" until a lease-signing step is built.
- On phones, the status column in the CDA and disbursement tables scrolls inside its table.
- Data is in-memory only. The backend is a placeholder for real persistence.
