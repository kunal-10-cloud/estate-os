# Estate OS: the real estate bundle (plan)

Built from `01-market-research.md` (market map, 16-module feature checklist, churn evidence) and `mobbin-ui-teardown.md` (how Zillow, Redfin, Realtor.com, Opendoor, Attio, HoneyBook and Zillow Rentals look today).

## The pitch in one line

Every real estate business, one record. Agents, teams, brokerages, property managers, landlords and developers buy the modules they need, and every module is at least as good as the segment leader, because they all read and write the same person, property and deal.

## Why now (what the research says)

- **The market is five silos.** Agent CRMs (Follow Up Boss, Lofty, kvCORE/BoldTrail), transaction tools (SkySlope, dotloop), back office (Paperless Pipeline, Brokermint), property management (AppFolio, Buildium, DoorLoop) and developer tools (Sell.Do, Farvision) don't share data. A buyer who becomes a homeowner, then a landlord, then an investor in a new project crosses four vendors.
- **Users don't leave for missing features, they leave for broken basics.** Recent App Store reviews: BoldTrail 1.46, Lofty 1.45, SkySlope 1.54, Buildium 1.48. The complaints are mobile apps that can't do what desktop does, lock-in contracts, upsells, and AI chatbots that block a simple form.
- **The one vendor that went wide (BoldTrail) went shallow.** So "all-in-one" only sells if no module is weaker than the leader.
- **New rules created new workflow.** Since Aug 2024 (NAR settlement) a buyer agreement comes before touring and buyer-agent pay is negotiated per deal. Nobody verified ships a seller net sheet or settlement-native deal file.

## Who buys what (packaging)

| Persona | Turns on | Leader we must match |
|---|---|---|
| Solo agent | Website & search, CRM, inbox, AI copilot, deals lite | Follow Up Boss Grow |
| Team | + lead routing, AI ISA, leaderboards, offers | FUB Pro, Lofty, Ylopo |
| Brokerage | + transactions & compliance, back office, recruiting | BoldTrail + SkySlope + Paperless Pipeline |
| Property manager / landlord | Rentals: units, leases, rent, maintenance, owner statements | AppFolio, Buildium, RentRedi (lite) |
| Developer / builder | Projects: live unit grid, launch booking, payment plans, channel partners, RERA | Sell.Do + IRIS, Farvision, Zonda |

Published prices, month-to-month, cancel without a call, and agent data that leaves with the agent: a direct answer to the lock-in complaints. (Our pricing is not the focus of the demo.)

## Modules (the superset)

0. **Core:** one graph of Person/Household, Property/Unit, Listing, Deal, Lease, Project, Ledger, Conversation; roles; audit; mobile parity.
1. **Website & search:** branded site, IDX-style search with map + price pins, listing pages with photo mosaic, monthly cost, tour-first CTA with next-available slots, saved searches, affordability, home valuation page.
2. **Lead gen:** portal/ads/site leads with source and cost, routing (round robin, ponds), speed-to-lead.
3. **CRM:** people and households, smart lists, action plans, tasks, timeline across every deal and lease.
4. **Inbox:** SMS, WhatsApp, email, portal and calls in one thread per person, auto-logged; dial any number.
5. **AI (acts, never blocks):** drafts replies, after-hours text/voice ISA with handoff, listing descriptions, contract-to-timeline, maintenance triage, always with the manual path visible.
6. **Seller tools:** CMA, **seller net sheet**, listing presentation, marketing studio, distribution controls (public / office exclusive / coming soon).
7. **Showings & offers:** tour scheduling (buyer agreement gate), feedback, offer comparison.
8. **Deals:** one file per deal: buyer agreement, negotiated compensation, key dates, checklist, documents, e-sign on phone, compliance review.
9. **Back office:** commission plans, splits, caps, CDAs, agent billing, trust/earnest money, QuickBooks export.
10. **Recruiting & insights:** agent production, pipeline, leaderboards.
11. **Homeowner nurture:** closed deal → homeowner record, equity updates, referral asks.
12. **Rentals:** listings & syndication, applications & screening criteria, leases & e-sign, rent & autopay with fees shown upfront, owner portal & statements, maintenance with vendor dispatch and photos, inspections, renewals.
13. **Other assets:** short-let calendar, commercial, HOA (later).
14. **Projects (developer):** towers/phases, live unit availability grid shared with channel partners, launch-day EOI and token, booking, payment plans and demand letters, CP commissions, handover.
15. **Compliance packs:** US settlement fields and fair housing; UK deposit protection and Renters' Rights Act; India RERA/GST; UAE permits.

## The seven bets (what makes it different)

1. Full mobile parity, persistent sessions, offline capture.
2. One inbox that logs everything, including the agent's own phone and WhatsApp.
3. One record per household, property and deal across every module (lifecycle: lead → buyer → homeowner → landlord → investor).
4. Settlement-native deal file and seller net sheet.
5. Trust-first commercials: published prices, month-to-month, portable data, every fee shown to tenants before they pay.
6. AI that acts but never blocks a manual path.
7. One inventory engine for launch booking, builder site maps, rental vacancy and short-let calendars.

## Prototype scope (this build)

A clickable, working demo for the sales call, seeded with one realistic business:

- **Harbor & Vine Realty** (Austin, TX): a brokerage with a team, a rentals book and a new-build partner project.
- **Bundle switcher:** pick a persona (Agent, Brokerage, Property manager, Developer) and the sidebar shows just those modules, proving "buy only what you need".
- **Screens:** public website (search map + listing + tour request), Today, Inbox with AI draft, People (household record and lifecycle timeline), Pipeline and deal file (buyer agreement, compensation, timeline, e-sign), Listing with seller net sheet, Rentals (units, rent roll, maintenance), Projects (live unit grid, booking, payment plan), Back office (commissions).
- **Demo story:** a tour request on the website lands in the inbox, becomes a buyer deal with an agreement, an offer, a net sheet for the seller, close, then the buyer shows up later as a landlord in Rentals and a buyer in the new project: one person, one record.

UI direction (from Mobbin): Zillow-style split search and listing page for the public site; Attio/Twenty density and HoneyBook's "today" home for the back office; Zillow Rentals property tabs and next-steps checklist for rentals.
