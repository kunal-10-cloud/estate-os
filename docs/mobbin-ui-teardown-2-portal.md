# Mobbin teardown 2: customer portal and operator patterns (2026-10-08)

501 screens from 30 searches (Opendoor, Zillow app + web, Redfin, Realtor.com, plus cross-industry patterns for timelines, checklists, document upload, loan tracking, payments, inboxes, kanban, settings). Contact sheets in scratchpad `mobbin2/sheets/` (not committed).

## Buyer journey patterns (real estate apps)

| Moment | Best pattern seen | Source |
|---|---|---|
| Budget | **BuyAbility card**: "Today's target price $516,141" with a gradient range bar, target monthly payment, down payment, credit band; feeds search and every listing ("Within BuyAbility" badge). Payment breakdown as a stacked bar (P&I, tax, insurance, HOA). | Zillow app #4, #8, #15 |
| Plan tab | "Plan → Overview / Buying": mortgage rates cards (30-yr fixed, FHA, VA), "More home buying next steps" checklist (pre-qualify, down-payment assistance, build credit, understand the process). | Zillow app #8, #10, #17 |
| Saved homes | Favorites split into **Personal** and **Shared** boards; **invite a co-shopper** by link; checkbox to **Compare** 2–5 homes; hidden homes list; per-home tags ("Share your thoughts: price, layout, kitchen, location, commute, schools"). | Zillow web #3–#8, app #13 |
| Saved searches | Updates tab with new matches per saved search, edit filters, email/push toggle per search. | Zillow app #2, #19–#22 |
| Tour | Date strip (Wed 11 / Thu 12 / Fri 13), **In person / Video chat** toggle, "Request showing · it's free, cancel anytime", "Start an offer" as the secondary action; tour confirmation "We'll get back by 8 pm tonight"; **pre-tour documents** checkbox ("Working with Redfin" agreement required before the first tour); reschedule / cancel with reason; Appointments & documents tabs (Upcoming / Past / Documents). | Redfin #0–#12 |
| Agent | "Your Redfin Lead Agent" card with rating, text/call/email; "Ask Redfin" chat with quick replies ("I'd like more home details", "Is this home still available?"). | Redfin #0, #10, #19 |
| Listing facts | Key facts grid, sale & tax history, schools with ratings, walk/bike score, flood risk and noise level, local market trends, "Notify me when the price changes". | Realtor.com #17–#21, Redfin #15–#17 |
| Offer | **Opendoor contract flow**: 3-step vertical stepper (Provide details → Share how you plan to buy & pre-approval → Review and sign); "How to buy this home: Buy directly / Make an offer with your agent"; buyer info, finance info (loan type, down payment %, close of escrow); "What you'll pay" breakdown (price, agent commissions $0, est. closing costs, total, pay when you close); co-buyer; working-with-agent question; must-sell-first question. | Opendoor #0–#18 |
| After signing | "Closing guide" home: "Please sign your contract", offer amount, close of escrow date, inspection period, progress bar (Sign contract → Opendoor signs), **To do** list, Support card with a named associate. | Opendoor #0 |
| Homeowner | Owner dashboard: estimate (Redfin vs Owner estimate toggle), value chart with range and projection, comparable homes, **proceeds calculator** (estimate − mortgage − selling costs − repairs = proceeds), edit home facts/photos, schedule a selling consultation, refinance nudges. | Redfin #0, #13; Realtor.com #14; Opendoor #1 |

## Cross-industry patterns to borrow

- **Milestone tracker** (Amazon, Etsy, Apple, Selfridges, Employment Hero): horizontal 4–5 step track with the current step bold, latest-update feed underneath with timestamps, and a table of steps with owner + status (Completed / In progress / Not started).
- **Setup checklist** (Shopify, Plum, Origin, monday.com, Revolut): ring or "2/5" progress, expandable steps, done steps struck through, one primary CTA per open step.
- **Secure money movement** (Wise, Airwallex, Gusto): transaction details with step list ("You set up your transfer → We received your funds → Paid out"), verified recipient badge.
- **Operator UI** (Front, Intercom, Plain for inbox; Trello/ClickUp/HoneyBook kanban; Stripe/Midday dashboards; Vanta/WorkOS/Gusto settings): dense lists, right-hand context panels, role tables with permission toggles.

## What to build (customer portal)

1. **Journey home**: a 6-stage tracker (Get ready → Find → Tour → Offer → Under contract → Close) with "your next step" and a To-do list owned by the buyer, plus the agent card.
2. **BuyAbility-style budget** that badges every home ("Within budget") and powers the offer.
3. **Shared board** with co-buyer, reactions/tags, compare up to 4.
4. **Tour booking** gated by the buyer agreement, with in person/video and reschedule.
5. **Offer builder** (stepper, terms, "what you'll pay"), seller counter and accept, all logged to the agent's deal file.
6. **Under-contract tracker**: milestones, tasks by party, document requests, e-sign, verified earnest-money wiring, loan tracker, inspection & repair requests.
7. **Closing**: closing disclosure review, wire with verification, appointment, keys.
8. **My home**: estimate, equity, proceeds calculator, refinance and referral prompts.
