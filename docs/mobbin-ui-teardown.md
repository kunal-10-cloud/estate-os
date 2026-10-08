# Real estate UI teardown (Mobbin, 2026-10-08)

52 screens pulled via the Mobbin API from Zillow (web + Zillow Rentals manager), Redfin, Realtor.com and Opendoor (iOS), plus CRM/back-office references (Pipedrive, HubSpot, Attio, Twenty, folk, HoneyBook), e-sign (DocuSign, PandaDoc, HoneyBook) and scheduling (Calendly). Contact sheets: scratchpad `mobbin-re/*.jpg` (not committed).

## Consumer side: what every portal now does

- **Search = split view.** Map with price pins on the left, 2-up photo cards on the right (Zillow web); full-bleed map with a bottom sheet of cards on mobile (Redfin, Opendoor). Filter chips across the top (For sale, Price, Beds & baths, Home type, More), plus "Save search".
- **Price pins** on the map show short prices ("$1.4M", "$935K"); clusters with counts at low zoom.
- **Listing detail = photo mosaic** (1 large + 4 small, "See all 38 photos", 3D tour and floor-plan buttons), then price, beds/baths/sqft, address, and a **monthly-cost line ("Est. $11,609/mo — Get pre-qualified")** directly under the price.
- **Primary CTA is a tour, not a contact form**: "Request a tour – as early as today at 11:00 am" (Zillow), red "Request showing – Next available: Tomorrow at 11 AM" (Redfin), time-slot chips "11am · 12pm · 1pm · More", and "Tour in person / Tour via video chat".
- **Monthly cost breakdown** is a first-class block: donut or stacked bar of principal & interest, taxes, insurance, HOA, with editable home price / down payment / rate (Realtor.com, Redfin, Opendoor "Estimated cost" with "Pay when you close").
- **Affordability tool** (Zillow BuyAbility): target payment + down payment → "Today's target price $3.2M", feeding search.
- **Urgency/social proof chips**: "Popular home · 639 views", "Hot market: 38% of homes accept an offer within 2 weeks", "Listed today", "31 hours on Redfin".
- **Opendoor "Buy now"**: direct buyer-info + finance-info form (loan type, down payment), i.e. offer starts inside the app.

## Operator side

- **Zillow Rentals manager** (the closest real-estate back office on Mobbin): left nav Properties / Leads / Messages / Payments / Alerts. Property page tabs Overview · Listing · Applications · Leases · Payments · Maintenance; cards for "Basic listing (active for 9 seconds)", "Upcoming tours" date strip, Tenants, and a **"Next steps" checklist** (create condition report, set up rent payments). Leads table has **screening criteria** (income ≥2.5× rent, min credit 665, pet policy) and a "screening match" column. Lease builder + e-sign ("15 required fields remaining", Sign here tags).
- **Modern CRMs** (Attio, Twenty, folk, Pipedrive, HubSpot): light, dense, record-centric. Kanban pipelines with stage totals; record page with timeline, tasks, emails, notes tabs; side panel of attributes. Attio/Twenty feel the most current: thin borders, small type, no heavy cards.
- **HoneyBook**: "Good morning, Alex" home with counters (new leads, unread messages, tasks, bookings $), automations panel; projects pipeline; contract + signature in one flow. Good reference for an all-in-one solo-business tool.
- **Airbnb host Today**: greeting, "Your next steps" cards with illustrations, Today / Calendar / Listings / Messages nav — the reference for onboarding checklists.
- **E-sign**: DocuSign/PandaDoc pattern of yellow tag "Sign here", left page-thumbnail rail, "N fields remaining", adopt signature modal (type/draw/upload).
- **Scheduling**: Calendly/HoneyBook two-pane picker (calendar + time slots), round-robin host pools.

## What to take

1. Public site: Zillow split map/list search, photo mosaic detail, monthly cost under price, tour-first CTA with next-available slots, affordability.
2. Back office: Attio/Twenty density + HoneyBook "today" home + Zillow Rentals property tabs and "next steps" checklist.
3. One record per property and per person, with tabs, rather than separate apps.
4. E-sign and scheduling inline (not hand-offs to other products).

## Gaps on Mobbin

No agent CRMs (Follow Up Boss, Lofty, kvCORE), no transaction tools (SkySlope, dotloop), no AppFolio/Buildium, no Indian/MENA developer tools are curated. Their UI has to be inferred from vendor sites; the market's operator UIs are generally dated, which is itself an opening.
