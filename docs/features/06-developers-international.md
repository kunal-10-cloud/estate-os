# Estate OS feature research 06: developers, builders, new homes and international brokerage

**Scope.** This file covers developer, builder and new-homes software and international agency CRMs. On the developer side that means project and inventory setup, launch-day booking, channel partners (CPs, India's term for brokers who sell a developer's inventory), site visits, lead management, booking and payment plans, demand letters (the invoices a developer issues as each construction milestone falls due), collections, the customer portal, handover and snags (defects found at handover), warranty, and RERA/DLD compliance and escrow. On the international side it covers agency CRMs in the UK, UAE, Australia and India, plus portal syndication.

**Method.** WebSearch was exhausted, so evidence comes from:
- About 120 vendor and regulator pages, read with a headless browser.
- 9 Brave searches; 2 hit a CAPTCHA, which was not bypassed.
- iTunes Search/Lookup API calls.

Pages blocked by bot protection (ECI's Lasso and BuildTopia pages, NewHomeSource, Livabl, Zoopla/Alto, G2) were not bypassed. Their features come from third-party listings, which are marked in the tables. Every claim is what the vendor says on its own page; none was product-tested. Anything that rests on memory alone is listed under "Not verified" and nowhere else.

**Priority key.**
- **Must:** needed to be credible against Sell.Do + Farvision (India), PropSpace/Goyzer (UAE) or Lasso/Envision (US) on day one.
- **Should:** expected by mid-market buyers within the first year.
- **Later:** a differentiator or something enterprise-only.

**Bottom line.** No single vendor runs the whole chain from launch grid to keys. Sell.Do covers pre-sales, launch, channel partners and the ledger. Farvision adds bank-loan tracking, snag management and contractor routing. US builders stitch together Lasso (CRM), Envision or Higharc (options), Zonda (site maps and listings) and Avid or Hyphen (warranty). In the UAE, CRMs sell syndication and off-plan directories. Estate OS can be the first product where one unit record carries all of it: the price, the hold, the booking, the payment plan, the CP's commission, the snag list and the warranty.

---

## 1. Project, tower, phase and inventory setup

| Feature | What it does | Benchmark + source URL | Priority |
|---|---|---|---|
| Project → tower/phase → floor → unit hierarchy | Model inventory as project, tower (or phase/plot), floor and unit, with configuration (BHK), facing, carpet area and status | Sell.Do Inventory & Negotiations — [sell.do/real-estate-crm/inventory-and-negotiations](https://www.sell.do/real-estate-crm/inventory-and-negotiations); Farvision SFA live unit grid "by project · tower · floor · configuration · facing" — [farvisionerp.com/farvision-module-crm-sfa.html](https://www.farvisionerp.com/farvision-module-crm-sfa.html) | Must |
| Unit status machine | Available → held/blocked → booked → registered (plus sold, lease, TBC), each change atomic and attributable | Sell.Do ("Available, held, blocked, booked — held atomically") — [inventory-and-negotiations](https://www.sell.do/real-estate-crm/inventory-and-negotiations); Bayut DevConnect shows Available/Sold/TBC — [bayut.com DevConnect](https://www.bayut.com/agentportal/announcements/discover-off-plan-opportunities-faster-with-devconnect/) | Must |
| Holds with their own expiry clock | A hold carries an owner and expires automatically (e.g. 11:04 → 13:04) unless the token lands | Sell.Do IRIS — [sell.do/products/iris/inventory-bookings-documentation](https://www.sell.do/products/iris/inventory-bookings-documentation); Farvision "token-based block, time-bound, auto-released" — [crm-sfa](https://www.farvisionerp.com/farvision-module-crm-sfa.html) | Must |
| Concurrency guard / zero double-booking | Two agents open the same unit and only one booking wins; the other gets an instant conflict | Sell.Do IRIS ("Two agents opened B-1204 together. One booking won.") — [inventory-bookings-documentation](https://www.sell.do/products/iris/inventory-bookings-documentation); Goyzer Masterplan "double-booking prevention" — [goyzer.com/crm-features-for-developers](https://www.goyzer.com/crm-features-for-developers) | Must |
| Real-time grid sync to every screen | Availability reaches every rep, CP and kiosk screen within half a second (Sell.Do claims under 500 ms) | Sell.Do IRIS — [sell.do/products/iris](https://www.sell.do/products/iris) | Must |
| Floor-plate grid view | Colour-coded tower × floor × wing grid with filters (project, tower, BHK, price band) and a price column per floor | Farvision Broker Portal — [farvisionerp.com/farvision-broker-portal.html](https://www.farvisionerp.com/farvision-broker-portal.html) | Must |
| Same unit offered for sale or lease | One unit record can be priced for outright sale or lease | Farvision SFA — [crm-sfa](https://www.farvisionerp.com/farvision-module-crm-sfa.html) | Later |
| Parking, storeroom and terrace as inventory | Bays and add-ons are inventory with their own ID, price, hold and allotment, billed with the unit (Sell.Do puts add-ons at 4–6% of revenue) | Sell.Do Parking & Add-ons — [sell.do/.../parking-and-add-ons](https://www.sell.do/real-estate-crm/post-sales-and-collections/parking-and-add-ons) | Should |
| Unit swaps and upgrades | Move a booking to another unit, with the cost sheet and ledger recomputed | Sell.Do ("cancellations, swaps and upgrades update the ledger and cost sheet automatically") — [post-sales-and-collections](https://www.sell.do/real-estate-crm/post-sales-and-collections) | Should |
| Multi-project, multi-entity isolation | Org hierarchy with project isolation and multiple legal entities (SPVs) | Sell.Do for Developers — [sell.do/solutions/developers](https://www.sell.do/solutions/developers) | Must |
| Plot/lot inventory with phases (US/land) | Lot status, phases, lot premiums, floor plans by lot | Zonda Interactive Site Map Bundle — [zondahome.com/.../interactive-site-map-bundle](https://zondahome.com/digital-solutions/interactive-site-map-bundle); Higharc Showroom "lot premiums" — [higharc.com/product/showroom](https://www.higharc.com/product/showroom) | Must (US) |
| Plan portfolio by community | Which plans, elevations, options, standards and prices apply to each community | Higharc Config — [higharc.com/product/config](https://www.higharc.com/product/config); Envision "option logic at the plan and community level" — [envision-for-builders](https://zondahome.com/digital-solutions/envision-for-builders/) | Should (US) |
| Floor plans, brochures and price lists per project | Downloadable sales kit, floor plans, price sheet and RERA documents per project | Farvision Broker Portal project library — [broker-portal](https://www.farvisionerp.com/farvision-broker-portal.html); Sell.Do Broker App catalogue — [sell.do/products/broker-app](https://www.sell.do/products/broker-app) | Must |
| Master plan or kiosk selection | Touch master plan (iPad, kiosk, touch table) that books units directly, with double-booking prevention | Goyzer Masterplan — [crm-features-for-developers](https://www.goyzer.com/crm-features-for-developers); Zonda Kiosks (Salesmaxx, Digital Sales Assistant) — [zondahome.com/digital-solutions/kiosks](https://zondahome.com/digital-solutions/kiosks/) | Should |
| Absorption and ageing reports | Absorption by tower, floor and configuration; "dead stock before it is dead" | Sell.Do Inventory Reports — [inventory-and-negotiations](https://www.sell.do/real-estate-crm/inventory-and-negotiations) | Must |
| Exhaustion forecast | Predicts when a configuration sells out at current velocity ("3 BHK will exhaust in 19 days") | Sell.Do for Developers (Jarvis) — [solutions/developers](https://www.sell.do/solutions/developers) | Later |
| Property match | Matches a buyer's requirement to live inventory automatically | Sell.Do Property Match — [inventory-and-negotiations](https://www.sell.do/real-estate-crm/inventory-and-negotiations); Goyzer View Matches — [crm-features-for-brokers](https://www.goyzer.com/crm-features-for-brokers) | Should |
| Land bank and approvals (pre-launch) | Plot acquisition, owners, liaison, approvals checklist, litigation register | Farvision Business Development — [farvisionerp.com/farvision-module-business-development.html](https://www.farvisionerp.com/farvision-module-business-development.html) | Later |
| Slum rehab / redevelopment inventory | Rehab rents, flats allotted to existing tenants, society in/out | Farvision BD — [module-business-development](https://www.farvisionerp.com/farvision-module-business-development.html) | Later |

## 2. Pricing, cost sheets, offers and negotiation

| Feature | What it does | Benchmark + source URL | Priority |
|---|---|---|---|
| Versioned price list | Base rate per sqft per project, versioned (e.g. "price list v4") so old quotes stay reproducible | Sell.Do cost sheet — [inventory-and-negotiations](https://www.sell.do/real-estate-crm/inventory-and-negotiations) | Must |
| Itemised cost sheet from the unit | Base + floor-rise PLC + corner/park-facing PLC (preferential location charges) + parking + club/corpus + GST + stamp duty − discount = all-in | Sell.Do — [inventory-and-negotiations](https://www.sell.do/real-estate-crm/inventory-and-negotiations) | Must |
| Absorption-linked dynamic price ladder | Price bands step up automatically as % sold rises (0–25%, 25–50%, …), logged and reversible | Sell.Do IRIS Dynamic Pricing — [dynamic-pricing-and-buyer-experience](https://www.sell.do/products/iris/dynamic-pricing-and-buyer-experience) | Should |
| One price of record everywhere | Grid, quote, cost sheet and the buyer's own screen read the same number at the same moment | Sell.Do IRIS — [dynamic-pricing-and-buyer-experience](https://www.sell.do/products/iris/dynamic-pricing-and-buyer-experience) | Must |
| AI price-band simulation | Models what the next escalation does to velocity, based on past launches | Sell.Do Jarvis — [dynamic-pricing-and-buyer-experience](https://www.sell.do/products/iris/dynamic-pricing-and-buyer-experience) | Later |
| Discount approval chain with caps | Rep request → manager within cap → sales head above cap; margin impact and precedent shown | Sell.Do Negotiation Management — [inventory-and-negotiations](https://www.sell.do/real-estate-crm/inventory-and-negotiations); Farvision "RM discount cap" — [crm-sfa](https://www.farvisionerp.com/farvision-module-crm-sfa.html) | Must |
| Schemes and festive offers | Named offers (Diwali scheme, voucher) applied in the pricing engine with expiry | Farvision pricing engine — [crm-sfa](https://www.farvisionerp.com/farvision-module-crm-sfa.html) | Should |
| OTP- or QR-verified offers | The buyer receives the offer and unlocks acceptance with an OTP, or a QR scan on the rep's device | Farvision SFA — [crm-sfa](https://www.farvisionerp.com/farvision-module-crm-sfa.html) | Should |
| Quote PDF to WhatsApp in one tap | Pick unit, payment plan and discount band, then generate a PDF and send it by WhatsApp or email from mobile | Farvision Sales Hub app — [farvisionerp.com/farvision-app-sales-hub.html](https://www.farvisionerp.com/farvision-app-sales-hub.html) | Must |
| AI compliance check on quote | Checks the quote against the price list and state stamp rules and flags affordability gaps | Sell.Do cost sheet AI card — [inventory-and-negotiations](https://www.sell.do/real-estate-crm/inventory-and-negotiations) | Later |
| Options pricing with measured quantities (US) | Variable-quantity options (e.g. flooring) priced by measurement and recalculated as selections change | Zonda Envision Measured Options Module — [envision-for-builders](https://zondahome.com/digital-solutions/envision-for-builders/) | Should (US) |
| ERP-integrated real-time options pricing | The configurator reads live prices and lot premiums from the builder ERP | Higharc Showroom — [product/showroom](https://www.higharc.com/product/showroom); Envision ERP and XML feeds — [envision-for-builders](https://zondahome.com/digital-solutions/envision-for-builders/) | Should (US) |

## 3. Lead capture, marketing and attribution

| Feature | What it does | Benchmark + source URL | Priority |
|---|---|---|---|
| Multi-portal lead capture (India) | Auto-capture from 99acres, MagicBricks, Housing, CommonFloor, Sulekha, Makaan and others (16+ portals) | Sell.Do Integrations catalogue — [sell.do/real-estate-crm/integrations](https://www.sell.do/real-estate-crm/integrations) | Must |
| Meta / Google / LinkedIn lead ads | Lead forms arrive the moment they are submitted | Sell.Do — [integrations](https://www.sell.do/real-estate-crm/integrations); Farvision "Facebook Lead Ads, Google Lead Forms, Instagram" — [crm-sfa](https://www.farvisionerp.com/farvision-module-crm-sfa.html) | Must |
| UAE portal capture | Leads from Property Finder, Bayut and dubizzle | PropSpace — [propspace.com/platform/propspace-broker/features](https://www.propspace.com/platform/propspace-broker/features); Goyzer — [goyzer.com](https://www.goyzer.com/); Sell.Do lists Bayut and Property Finder — [integrations](https://www.sell.do/real-estate-crm/integrations) | Must (UAE) |
| Dedupe before assignment | One lead from two sources keeps a locked source of truth, with CP credit applied per policy | Sell.Do ("deduplicated before a representative is assigned") — [marketing-automation](https://www.sell.do/real-estate-crm/marketing-automation); Farvision — [crm-sfa](https://www.farvisionerp.com/farvision-module-crm-sfa.html); Reapit Sales AU "only CRM that doesn't allow duplicates" — [agentbox.com.au](https://www.agentbox.com.au/) | Must |
| Offline sources: walk-in, missed call, kiosk, expo QR | Gallery iPad walk-ins, missed-call numbers on billboards, expo booth QR/vCard capture with location stamp | Farvision Sales Hub — [app-sales-hub](https://www.farvisionerp.com/farvision-app-sales-hub.html); Sell.Do home ("Saturday walk-ins now auto-created from the gallery iPad") — [sell.do](https://www.sell.do/); Lasso "model home kiosks" (Brave summary of lassocrm.com, not opened) | Must |
| Spend-to-booking attribution | Cost per lead, per site visit, per booking, by source, campaign, rep and product, with ad spend pulled from platforms | Farvision "The funnel, in money" — [crm-sfa](https://www.farvisionerp.com/farvision-module-crm-sfa.html); Sell.Do ROI & Source Tracking — [marketing-automation](https://www.sell.do/real-estate-crm/marketing-automation) | Must |
| Offline-conversion feedback to ad platforms | Bookings pushed back to Meta CAPI or Google Offline Conversions so the algorithm optimises for buyers | Sell.Do — [marketing-automation](https://www.sell.do/real-estate-crm/marketing-automation); [integrations](https://www.sell.do/real-estate-crm/integrations) | Should |
| Audience sync | Dynamic segments synced to Meta and Google for retargeting and lookalikes | Sell.Do Audience Sync — [marketing-automation](https://www.sell.do/real-estate-crm/marketing-automation) | Should |
| AI intent scoring with reasons | Scores each lead from portal engagement, price match, response rate and WhatsApp opens, and re-ranks the queue nightly | Sell.Do Jarvis — [sell.do](https://www.sell.do/); Lasso "custom lead scoring" — [SoftwareOne listing](https://platform.softwareone.com/product/lasso-crm/PCP-1193-2152) | Should |
| AI voice agent speed-to-lead | Calls every new lead within 30 seconds, qualifies, books the site visit and updates the CRM, in Indian languages | Sell.Do AI Voice Agents — [sell.do](https://www.sell.do/) | Later |
| Event-triggered drip journeys | 50+ triggers (visit done but not booked, EMI calculator used, price drop on viewed unit), A/B testing, suppression on booking | Farvision SFA drip — [crm-sfa](https://www.farvisionerp.com/farvision-module-crm-sfa.html); LeadSquared drip via email/SMS/WhatsApp — [leadsquared.com/real-estate-crm](https://www.leadsquared.com/real-estate-crm/); Hyphen CRM campaigns — [hyphen-crm](https://info.hyphensolutions.com/products/hyphen-crm/) | Must |
| Consent, DND and quiet hours across channels | Consent ledger, NDNC scrub, DLT-registered SMS templates, frequency cap and quiet hours enforced per lead before send | Sell.Do Communication Hub — [communication-hub](https://www.sell.do/real-estate-crm/communication-hub); Farvision "DND, DPDP, opt-in/out, consent ledger" — [crm-sfa](https://www.farvisionerp.com/farvision-module-crm-sfa.html) | Must |
| WhatsApp Business API with flows and team inbox | Two-way routed inbox, no-code flow builder, templates, with 20+ BSPs (WhatsApp Business Solution Providers) supported | Sell.Do — [communication-hub](https://www.sell.do/real-estate-crm/communication-hub) | Must |
| RCS with SMS fallback | Branded rich cards that fall back to SMS | Sell.Do — [communication-hub](https://www.sell.do/real-estate-crm/communication-hub) | Later |
| Masked calling and recordings | Cloud telephony with the buyer's number hidden from reps, recordings on the lead, missed calls captured as leads; 25+ Indian telephony providers | Sell.Do — [communication-hub](https://www.sell.do/real-estate-crm/communication-hub); [integrations](https://www.sell.do/real-estate-crm/integrations) | Must |
| Website configurator → CRM lead with configuration (US) | A buyer saves a configured home on the builder site, which creates a Lasso lead plus a pricing record before any call (UBH lead-to-application rose from 10% to 14%) | Higharc × Lasso, United Built Homes — [higharc.com customer story](https://www.higharc.com/customer-stories/how-united-built-homes-connected-their-buyer-experience-and-increased-lead-conversion-by-40) | Should (US) |
| Agent/broker plus buyer on the same opportunity (US) | The new-home CRM tracks both the co-op real estate agent and the homebuyer relationship | Hyphen CRM — [info.hyphensolutions.com/products/hyphen-crm](https://info.hyphensolutions.com/products/hyphen-crm/) | Must (US) |

## 4. Pre-sales, site visits and sales execution

| Feature | What it does | Benchmark + source URL | Priority |
|---|---|---|---|
| Rule-based routing | Routes by project, language, source, score, rep capacity, NRI desk and stickiness, with round-robin | Sell.Do Lead Routing — [sales-and-pre-sales](https://www.sell.do/real-estate-crm/sales-and-pre-sales); Farvision — [crm-sfa](https://www.farvisionerp.com/farvision-module-crm-sfa.html) | Must |
| Working-hours SLA timers and escalation | Unanswered leads escalate, then reassign (Sell.Do shows median first response of 8 min against a 15 min SLA) | Sell.Do — [sales-and-pre-sales](https://www.sell.do/real-estate-crm/sales-and-pre-sales); Goyzer lead escalation and lead pool — [crm-features-for-brokers](https://www.goyzer.com/crm-features-for-brokers) | Must |
| Lead pool and rotation | Stale leads drop into a shared pool with fair rotation rules | PropSpace Lead Pool — [propspace-broker/features](https://www.propspace.com/platform/propspace-broker/features) | Should |
| Site-visit scheduling with WhatsApp confirmation | Book date, slot, project and rep; WhatsApp template confirmation to the buyer | Farvision Sales Hub — [app-sales-hub](https://www.farvisionerp.com/farvision-app-sales-hub.html); Sell.Do Site Visit Management — [sales-and-pre-sales](https://www.sell.do/real-estate-crm/sales-and-pre-sales) | Must |
| Geo-fenced check-in | "Present at site" GPS stamp inside a geo-fence proves the visit happened | Sell.Do ("GPS check-in inside a geo-fence") — [sales-and-pre-sales](https://www.sell.do/real-estate-crm/sales-and-pre-sales); Farvision Sales Hub — [app-sales-hub](https://www.farvisionerp.com/farvision-app-sales-hub.html); LeadSquared geo-fence tasks — [real-estate-crm](https://www.leadsquared.com/real-estate-crm/) | Must |
| OTP-verified site visits for CPs | A CP-sourced visit is confirmed by buyer OTP plus geo-tag, which locks attribution | Sell.Do Broker App — [products/broker-app](https://www.sell.do/products/broker-app) | Must |
| Structured post-visit feedback | Interest level, layout preference, pricing reaction and next step, used to predict close | Farvision Sales Hub — [app-sales-hub](https://www.farvisionerp.com/farvision-app-sales-hub.html); Sell.Do — [sales-and-pre-sales](https://www.sell.do/real-estate-crm/sales-and-pre-sales) | Must |
| Mobile quote → application → booking | Same flow as web in the rep's pocket: quote, auto-filled application with KYC, booking that allots the unit and raises the first demand | Farvision Sales Hub — [app-sales-hub](https://www.farvisionerp.com/farvision-app-sales-hub.html) | Must |
| Call-centre dialer and dispositions | Built-in dialer, auto-dial (InstaConnect), mobile calling app | Sell.Do Call Centre — [sales-and-pre-sales](https://www.sell.do/real-estate-crm/sales-and-pre-sales); [communication-hub](https://www.sell.do/real-estate-crm/communication-hub) | Should |
| AI call analysis and sales audits | Transcription, translation, sentiment and scoring of every call; coaching moments | Sell.Do Jarvis — [sell.do](https://www.sell.do/); Sales Audits — [sales-and-pre-sales](https://www.sell.do/real-estate-crm/sales-and-pre-sales) | Later |
| Pipeline-risk alerts | Flags negotiation-stage deals with no activity for N days, or with competing offers | Sell.Do Jarvis — [sales-and-pre-sales](https://www.sell.do/real-estate-crm/sales-and-pre-sales) | Should |
| Multi-dimensional targets with incentive link | Targets in units, area or value roll up RM → team → city → company and feed HRMS payroll incentives | Farvision Targets — [crm-sfa](https://www.farvisionerp.com/farvision-module-crm-sfa.html) | Should |
| Rep leaderboards and gamified apps | Bookings leaderboard, dials-per-booking coaching | Sell.Do — [sales-and-pre-sales](https://www.sell.do/real-estate-crm/sales-and-pre-sales); Goyzer Leaderboard for TV display — [crm-features-for-brokers](https://www.goyzer.com/crm-features-for-brokers) | Should |
| Self-guided tours with verified ID (US) | Shoppers book a self-tour of model or spec homes via website, Zillow, Realtor.com or NewHomeSource; ID or card plus phone verification; digital locks; AI Q&A during the tour; report to CRM afterwards | Zonda UTour — [zondahome.com/utour](https://zondahome.com/utour/) | Should (US) |
| Immersive tours with per-lead attribution | Unit-level VR/AR tour (day/night, furnished/bare shell); which room the buyer lingered in is logged on the lead | Sell.Do IRIS VR/AR — [vr-ar-buyer-experience](https://www.sell.do/products/iris/vr-ar-buyer-experience); Square Yards PropVR — [squareyards.com](https://www.squareyards.com/); Goyzer virtual tours — [goyzer.com](https://www.goyzer.com/) | Later |

## 5. Launch day: EOI, tokens, queue and allotment

| Feature | What it does | Benchmark + source URL | Priority |
|---|---|---|---|
| Tiered EOI capture online | Developer defines tiers (e.g. Platinum ₹5L with priority allotment and 2% off, Gold ₹2L, Silver ₹50k) with a close date | Sell.Do IRIS EOI & Token — [eoi-token-management](https://www.sell.do/products/iris/eoi-token-management) | Must (IN/UAE) |
| Online token collection with instant receipts | UPI, net banking and card; receipt issued the same second; no cash at the gallery | Sell.Do IRIS — [eoi-token-management](https://www.sell.do/products/iris/eoi-token-management) | Must (IN/UAE) |
| Payment auto-retry and gateway escalations | Failed token payments retried automatically (claimed 0.4% failure); gateway retries surface on the command centre | Sell.Do IRIS — [products/iris](https://www.sell.do/products/iris); [launch-day-command-centre](https://www.sell.do/products/iris/launch-day-command-centre) | Should |
| EOI against a specific unit with auto-block | A CP submits an EOI with a ₹25k token that blocks the unit for 24h, then converts to booking before expiry | Farvision Broker Portal — [broker-portal](https://www.farvisionerp.com/farvision-broker-portal.html) | Must |
| EOI → booking handover | EOI converts on booking with the token adjusted into the ledger | Farvision Broker Portal — [broker-portal](https://www.farvisionerp.com/farvision-broker-portal.html) | Must |
| Provable fair queue | Order set by EOI tier plus a millisecond timestamp, locked and auditable; "no one can be moved up the queue by a phone call" | Sell.Do IRIS Queue — [queue-management](https://www.sell.do/products/iris/queue-management) | Should |
| Buyer-visible queue position and honest wait time | Buyer sees their position and the median wait on their own phone (Sell.Do claims drop-off fell from 22% to 6%) | Sell.Do IRIS — [queue-management](https://www.sell.do/products/iris/queue-management) | Should |
| Walk-in, CP and pre-sales slot allocation | Separate slot pools so CPs and walk-ins are not starved | Sell.Do IRIS — [queue-management](https://www.sell.do/products/iris/queue-management) | Should |
| Desk load balancing | AI steers the next buyers toward the desks clearing fastest | Sell.Do Jarvis — [queue-management](https://www.sell.do/products/iris/queue-management) | Later |
| EOI intent ranking | Ranks EOIs by behaviour (visits, tour engagement, call sentiment), not only by money paid | Sell.Do Jarvis — [eoi-token-management](https://www.sell.do/products/iris/eoi-token-management) | Later |
| Launch command centre | One screen showing units sold of released, queue depth and wait, value booked, agents active, live activity feed, absorption per tower, escalations | Sell.Do IRIS — [launch-day-command-centre](https://www.sell.do/products/iris/launch-day-command-centre) | Should |
| Booking-velocity chart | Units per 15 minutes, with the peak window highlighted | Sell.Do IRIS — [products/iris](https://www.sell.do/products/iris) | Should |
| Live sell-out forecast | Compares the hour-by-hour curve to past launches: "sell out by 4 pm or stall at 70%" | Sell.Do Jarvis — [launch-day-command-centre](https://www.sell.do/products/iris/launch-day-command-centre) | Later |
| Scale proof | Sell.Do cites VTP Realty: 150 units, 350+ EOIs, 10,000+ simultaneous buyers, zero double bookings; "400+ units in 6 hours" | Sell.Do — [sell.do](https://www.sell.do/); [products/iris](https://www.sell.do/products/iris) | Must (load target) |
| Gamified launch offers | Offers and discounts tied to EOI tiers or timing | Sell.Do IRIS — [eoi-token-management](https://www.sell.do/products/iris/eoi-token-management) | Later |

## 6. Booking form, KYC, agreement and documents

| Feature | What it does | Benchmark + source URL | Priority |
|---|---|---|---|
| Digital booking form from the unit record | Booking form, cost sheet, allotment letter and receipt generated from one record so the paperwork cannot contradict the sale | Sell.Do IRIS — [inventory-bookings-documentation](https://www.sell.do/products/iris/inventory-bookings-documentation) | Must |
| Multi-applicant / co-applicant booking | Primary plus co-applicants (spouse, parent), each with separate KYC and signature blocks | Farvision Broker Portal "Convert to Booking V2" — [broker-portal](https://www.farvisionerp.com/farvision-broker-portal.html); Farvision Care co-applicant flow — [crm-care](https://www.farvisionerp.com/farvision-module-crm-care.html) | Must |
| Aadhaar/PAN eKYC, Digilocker pull, bank penny-drop | Identity verified and documents pulled with consent; bank account verified by penny-drop (a ₹1 test deposit); credit-score checks | Sell.Do IRIS eKYC — [ekyc-esign-paperless](https://www.sell.do/products/iris/ekyc-esign-paperless) | Must (IN) |
| e-Sign with Aadhaar OTP, DocuSign or ZohoSign, plus e-stamp | Agreement signed and e-stamped in one sitting (claimed median 9 minutes) | Sell.Do IRIS — [ekyc-esign-paperless](https://www.sell.do/products/iris/ekyc-esign-paperless); Farvision "Aadhaar e-Sign, NSDL, DigiLocker", stamp duty live — [crm-care](https://www.farvisionerp.com/farvision-module-crm-care.html) | Must |
| Locale-aware agreement templates | Agreement for sale pre-filled from the booking; RERA state clauses (India) or DLD-aware (GCC); multi-language | Farvision Customer Care — [crm-care](https://www.farvisionerp.com/farvision-module-crm-care.html); Goyzer sales contract printing with pre-fill and e-signature — [crm-features-for-developers](https://www.goyzer.com/crm-features-for-developers) | Must |
| Tamper-evident audit trail | Every version, edit and signature timestamped; document hash stored | Farvision — [crm-care](https://www.farvisionerp.com/farvision-module-crm-care.html); Sell.Do — [ekyc-esign-paperless](https://www.sell.do/products/iris/ekyc-esign-paperless) | Must |
| Booking lifecycle stages | Booked → agreement → registration → possession, each with dates and an owner | Sell.Do Bookings & Customer Management — [bookings-customer-management](https://www.sell.do/real-estate-crm/post-sales-and-collections/bookings-customer-management) | Must |
| Missing-document chaser | AI knows which KYC page or co-applicant document is outstanding and chases the buyer on WhatsApp | Sell.Do Jarvis — [ekyc-esign-paperless](https://www.sell.do/products/iris/ekyc-esign-paperless) | Should |
| Stalled-booking alerts | "Agreement pending 21 days, registration window closing" | Sell.Do Jarvis — [bookings-customer-management](https://www.sell.do/real-estate-crm/post-sales-and-collections/bookings-customer-management) | Should |
| Document vault | Agreements, KYC and approvals stored per booking; project docs (RERA, NOC) alongside | Sell.Do Document Management — [post-sales-and-collections](https://www.sell.do/real-estate-crm/post-sales-and-collections); Farvision Customer Portal — [customer-portal](https://www.farvisionerp.com/farvision-customer-portal.html) | Must |
| US builder contract, selections and change orders | Contract tied to approved selections and change orders, which drive budgets and PO release | Hyphen HomeFront — [products/hyphen-homefront](https://info.hyphensolutions.com/products/hyphen-homefront/) | Must (US) |

## 7. Payment plans, demand letters, collections, ledger and tax

| Feature | What it does | Benchmark + source URL | Priority |
|---|---|---|---|
| Payment-plan templates per project | Construction-linked (CLP), down-payment, flexi, time-linked (10/20/30/40, 90-90-90), hybrid; unlimited plans per project | Sell.Do Payment Schedules — [payment-schedules-milestones](https://www.sell.do/real-estate-crm/post-sales-and-collections/payment-schedules-milestones); Farvision — [crm-care](https://www.farvisionerp.com/farvision-module-crm-care.html); Goyzer payment plans — [crm-features-for-developers](https://www.goyzer.com/crm-features-for-developers) | Must |
| Off-plan plan details shown to brokers (UAE) | Payment plan, service charge and escrow number shown per project | PropSpace Off-Plan Projects — [propspace-broker/off-plan](https://www.propspace.com/platform/propspace-broker/off-plan) | Must (UAE) |
| Milestone certification triggers demands | When the site engineer marks a slab complete, demands raise for every unit in that tower at the right %, GST and due date | Sell.Do — [payment-schedules-milestones](https://www.sell.do/real-estate-crm/post-sales-and-collections/payment-schedules-milestones); Farvision "demand triggers = site-team certifications" — [crm-care](https://www.farvisionerp.com/farvision-module-crm-care.html) | Must |
| Bulk demand-letter generation and review | Bulk generate, review, then dispatch (e.g. "38 demands ready · ₹15.9 Cr"); AI pre-fills GST/TDS | Sell.Do Post-Sales — [post-sales-and-collections](https://www.sell.do/real-estate-crm/post-sales-and-collections) | Must |
| Multi-channel dispatch tracking | Each demand tracked per channel: email delivered/opened, WhatsApp read, SMS delivered, registered post in transit | Sell.Do Demand Letters — [demand-letters](https://www.sell.do/real-estate-crm/post-sales-and-collections/demand-letters) | Must |
| Demand register | Demand no., customer, milestone, amount, status (draft/sent/paid/overdue) | Sell.Do — [post-sales-and-collections](https://www.sell.do/real-estate-crm/post-sales-and-collections) | Must |
| Pre-due reminders with pay links | T-7/T-3/T-1 reminders by email, SMS, WhatsApp and push, carrying a UPI/gateway link | Farvision Payment follow-up — [crm-care](https://www.farvisionerp.com/farvision-module-crm-care.html) | Must |
| Ageing buckets and tone escalation | 0–30 soft, 30–60 firm, 60–90 formal, 90+ legal with a cancellation flag; DSO trend | Farvision — [crm-care](https://www.farvisionerp.com/farvision-module-crm-care.html); Sell.Do Recovery & Ageing — [post-sales-and-collections](https://www.sell.do/real-estate-crm/post-sales-and-collections) | Must |
| Late-payer prediction | Scores each demand for late-payment risk and nudges early ("12 always pay 3 days after a WhatsApp nudge") | Sell.Do Jarvis — [demand-letters](https://www.sell.do/real-estate-crm/post-sales-and-collections/demand-letters) | Later |
| Interest on overdue per agreement clause | Auto-accrued interest at the agreement rate, GST-correct, visible on the ledger | Sell.Do ledger — [ledger-payments-receipts](https://www.sell.do/real-estate-crm/post-sales-and-collections/ledger-payments-receipts); Farvision — [crm-care](https://www.farvisionerp.com/farvision-module-crm-care.html) | Must |
| Customer ledger like a bank statement | Debit/credit/balance per customer: demands, receipts, loan disbursals, interest, credit notes | Sell.Do — [ledger-payments-receipts](https://www.sell.do/real-estate-crm/post-sales-and-collections/ledger-payments-receipts); Farvision Customer Portal statement of account — [customer-portal](https://www.farvisionerp.com/farvision-customer-portal.html) | Must |
| Receipts with maker-checker approval | Numbered, GST-compliant, immutable receipts issued on realisation, after an approval workflow | Sell.Do — [ledger-payments-receipts](https://www.sell.do/real-estate-crm/post-sales-and-collections/ledger-payments-receipts) | Must |
| Bank-statement auto-reconciliation | Bank feed auto-matched on amount, date and identifiers; AI proposes matches for unclear NEFT narrations with a confidence score | Sell.Do (claims 98% auto-reconciled) — [ledger-payments-receipts](https://www.sell.do/real-estate-crm/post-sales-and-collections/ledger-payments-receipts); Sell.Do "UPI, NEFT, cheque, gateway and loan disbursals matched to demands" — [integrations](https://www.sell.do/real-estate-crm/integrations) | Should |
| Online collection gateways | Razorpay, PayU, Stripe, Cashfree; NEFT/RTGS for large instalments | Sell.Do — [integrations](https://www.sell.do/real-estate-crm/integrations); Farvision — [crm-care](https://www.farvisionerp.com/farvision-module-crm-care.html), [customer-portal](https://www.farvisionerp.com/farvision-customer-portal.html) | Must |
| Credit notes and waivers with approval chain | Credit note names what it reverses, computes the GST reversal and margin impact, and posts only after Sales Head → Finance → CFO sign-off; AI checks the arithmetic | Sell.Do Credit Notes — [credit-notes-adjustments](https://www.sell.do/real-estate-crm/post-sales-and-collections/credit-notes-adjustments) | Must |
| India tax engine | GST 5% on under-construction, TDS 194-IA at 1% above ₹50L, stamp duty and registration by state, versioned rate tables, Form 16B status per buyer, 26AS reconciliation, GSTIN validation | Sell.Do Taxes — [taxes-tds-gst](https://www.sell.do/real-estate-crm/post-sales-and-collections/taxes-tds-gst); Farvision GSTR-1/3B, e-invoicing, TDS/26QB — [farvisionerp.com](https://www.farvisionerp.com/) | Must (IN) |
| GCC tax | VAT 5% returns to the FTA (UAE Federal Tax Authority), e-invoicing phase 2, corporate tax 9% workings | Farvision GCC common rails — [farvisionerp.com](https://www.farvisionerp.com/) | Should (UAE) |
| Escrow split on receipts | Each receipt split to the project escrow (RERA India) or separate account; "RERA escrow computed" | Farvision "Receipt → ledger · GST e-invoice · RERA escrow split" — [crm-care](https://www.farvisionerp.com/farvision-module-crm-care.html); Sell.Do — [integrations](https://www.sell.do/real-estate-crm/integrations) | Must |
| ERP sync without double entry | Bookings, receipts and demands post to SAP or another ERP as they happen, with a declared source of truth per field | Sell.Do — [integrations](https://www.sell.do/real-estate-crm/integrations); Goyzer Oracle Fusion — [goyzer.com](https://www.goyzer.com/) | Should |
| Multi-currency on demands | AED and INR demands in one register (e.g. NRI and GCC buyers) | Sell.Do demand register shows "AED 180k" next to ₹ — [post-sales-and-collections](https://www.sell.do/real-estate-crm/post-sales-and-collections) | Should |

## 8. Home loans, cancellation, transfer and refunds

| Feature | What it does | Benchmark + source URL | Priority |
|---|---|---|---|
| Bank-loan tracker per booking | Application → sanction letter → tripartite NOC (buyer–builder–bank) → loan agreement → per-tranche disbursal; blockers flagged to the team and to the buyer's app | Farvision Customer Care — [crm-care](https://www.farvisionerp.com/farvision-module-crm-care.html) | Must (IN) |
| Disbursement claim prep | CLP milestones auto-prepare bank disbursement requests; NOC auto-generated for the bank | Farvision — [crm-care](https://www.farvisionerp.com/farvision-module-crm-care.html) | Should |
| Bank tie-up panel | Pre-approved lender panel (HDFC, ICICI, SBI, Axis, Kotak) | Farvision — [crm-care](https://www.farvisionerp.com/farvision-module-crm-care.html); Square Yards CredIQ / mortgage partnerships — [squareyards.com](https://www.squareyards.com/) | Later |
| Cancellation workflow | Structured reason capture, forfeit/refund computed per clause (e.g. 10% forfeit + admin + GST adjustment), multi-tranche refund schedule | Farvision Cancellations — [crm-care](https://www.farvisionerp.com/farvision-module-crm-care.html); Farvision SFA "refund schedule built, inventory freed atomically" — [crm-sfa](https://www.farvisionerp.com/farvision-module-crm-sfa.html) | Must |
| Atomic inventory release with re-pricing | The cancelled unit returns to live inventory instantly, with re-price options surfaced | Farvision — [crm-care](https://www.farvisionerp.com/farvision-module-crm-care.html) | Must |
| CP brokerage clawback on cancellation | Paid brokerage recovered automatically per the partner agreement | Farvision — [crm-care](https://www.farvisionerp.com/farvision-module-crm-care.html); Sell.Do referral "clawback on cancellation" — [referral-loyalty](https://www.sell.do/products/iris/referral-loyalty) | Must |
| Cancellation documents and dignified exit | Cancellation deed, refund advice, final statement, refund ETA in the customer app | Farvision — [crm-care](https://www.farvisionerp.com/farvision-module-crm-care.html) | Should |
| Attrition analytics | Cancellation reasons feed product, pricing and process analytics | Farvision — [crm-care](https://www.farvisionerp.com/farvision-module-crm-care.html) | Later |
| Transfer, nomination or assignment of an under-construction unit | Change of allottee or co-applicant, with transfer fee, KYC of the new party and ledger carry-over | Partial evidence only: Sell.Do mentions "nominee changes" as a pain point ([bookings-customer-management](https://www.sell.do/real-estate-crm/post-sales-and-collections/bookings-customer-management)); PropSpace blog title "Off-plan today, resale tomorrow" ([features page](https://www.propspace.com/platform/propspace-broker/features)). No vendor page showed a full transfer workflow, so this row is white space | Should |

## 9. Channel partner (CP/broker) portal and brokerage

| Feature | What it does | Benchmark + source URL | Priority |
|---|---|---|---|
| Self-serve CP onboarding | Mobile-OTP signup, stepwise KYC (PAN, GST, bank, RERA agent no.) with completeness meter, e-signed agreement, maker-checker approval (Sell.Do claims ~26 min instead of 5 days) | Sell.Do Broker App — [products/broker-app](https://www.sell.do/products/broker-app); Sell.Do Channel Partners — [channel-partners](https://www.sell.do/real-estate-crm/channel-partners); Farvision "KYC, agreement, RERA registration, IFSC, GST" — [crm-sfa](https://www.farvisionerp.com/farvision-module-crm-sfa.html) | Must |
| AI document OCR for onboarding and invoices | Photograph a PAN, GST or bank document, or a brokerage invoice; OCR plus an LLM pre-fills the form | Sell.Do Broker App — [products/broker-app](https://www.sell.do/products/broker-app) | Should |
| White-label CP portal on the developer's subdomain | Partners log in under the developer's brand, scoped to their own leads and payouts | Sell.Do Broker App — [products/broker-app](https://www.sell.do/products/broker-app); CP portal mock shows "White-labelled · RERA A52100012345" — [channel-partners](https://www.sell.do/real-estate-crm/channel-partners) | Must |
| Visibility matrix (what partners can and cannot see) | Toggle per field: availability ✓, price band ✓, cost sheet on hold, customer phone ✗, other partners' leads ✗ | Sell.Do Broker App — [products/broker-app](https://www.sell.do/products/broker-app); "Partners see stock, not economics" — [inventory-and-negotiations](https://www.sell.do/real-estate-crm/inventory-and-negotiations) | Must |
| Live inventory for partners and self-booking | Partners block a unit, collect the token online and create the booking without a phone call | Sell.Do — [channel-partners](https://www.sell.do/real-estate-crm/channel-partners); Farvision Broker Portal — [broker-portal](https://www.farvisionerp.com/farvision-broker-portal.html) | Must |
| Lead tagging with exclusivity window | A CP registers or locks a lead (e.g. 7-day exclusivity, extendable 30 days by a booked site visit), auto-released if there is no progress | Farvision — [crm-sfa](https://www.farvisionerp.com/farvision-module-crm-sfa.html); Sell.Do CP portal ("book a site visit to extend validity 30 days") — [channel-partners](https://www.sell.do/real-estate-crm/channel-partners) | Must |
| Conflict and dispute engine | Attribution window plus first verified tag applied identically to every claim; dispute log (Sell.Do claims −82% disputes) | Sell.Do Conflict Management — [channel-partners](https://www.sell.do/real-estate-crm/channel-partners); Farvision — [crm-sfa](https://www.farvisionerp.com/farvision-module-crm-sfa.html) | Must |
| Slab/ladder commission configurator | Layered commission and AOP (annual operating plan) targets, visual slab builder, tier rates, volume accelerators, scheme-specific bumps | Sell.Do Broker App — [products/broker-app](https://www.sell.do/products/broker-app); Farvision ladder rules — [crm-care](https://www.farvisionerp.com/farvision-module-crm-care.html) | Must |
| Collection-linked brokerage release | Brokerage tranches release only when the buyer pays the linked milestone (e.g. 25% at agreement, slab 1, slab 5, possession) | Farvision — [crm-care](https://www.farvisionerp.com/farvision-module-crm-care.html); Sell.Do "collection-gated payout" — [products/broker-app](https://www.sell.do/products/broker-app) | Must |
| CP self-invoicing with tax | Partner raises an invoice on the portal; TDS, GST and net computed; auto-approval rules | Sell.Do — [products/broker-app](https://www.sell.do/products/broker-app); Farvision — [crm-care](https://www.farvisionerp.com/farvision-module-crm-care.html) | Must (IN) |
| Shared payout ledger and passbook | Partner sees the same ledger as the developer: eligible, raised, released, on-hold, with TDS and GST breakdown | Sell.Do ("Disputes fall away when the partner sees the same ledger you do") — [products/broker-app](https://www.sell.do/products/broker-app); Farvision brokerage statement — [broker-portal](https://www.farvisionerp.com/farvision-broker-portal.html) | Must |
| Sub-broker splits | Two-tier networks where a primary broker shares with sub-brokers per internal split | Farvision — [crm-care](https://www.farvisionerp.com/farvision-module-crm-care.html) | Should |
| Partner tiers, badges and health | Gold → Platinum progress, health score, league table by bookings and lead quality | Sell.Do CP portal — [channel-partners](https://www.sell.do/real-estate-crm/channel-partners) | Should |
| Junk-partner detection | Flags partners forwarding recycled portal data before they burn calling hours | Sell.Do — [channel-partners](https://www.sell.do/real-estate-crm/channel-partners) | Later |
| Sourcing field force cockpit | Executive/TL/Manager cockpits with weekly KRAs (key result areas), GPS-tagged partner-office visits, beat plan, dormant-partner re-engagement | Sell.Do Broker App — [products/broker-app](https://www.sell.do/products/broker-app) | Should |
| CP events, broadcasts and co-branded collateral | Events with RSVP and check-in; push/SMS/email/WhatsApp broadcasts with analytics; co-branded brochures | Sell.Do Broker App — [products/broker-app](https://www.sell.do/products/broker-app) | Should |
| Commission Q&A assistant and MCP access | "What's my brokerage if I book 3 units in this scheme?" answered from live rules; brokers query through ChatGPT/Claude via MCP with role-scoped permissions | Sell.Do Broker App — [products/broker-app](https://www.sell.do/products/broker-app) | Later |
| App for the field, portal for the desk | Same login and data: phone for availability and adding prospects, web for full grid, multi-applicant booking and statement download | Farvision Broker Portal vs App — [broker-portal](https://www.farvisionerp.com/farvision-broker-portal.html) | Must |
| Aggregator CP networks (benchmark for distribution) | Square Connect claims 1.5 lakh+ CPs, advance brokerage and differential payouts, a "claim pool" of leads, payouts on loan disbursement; Anarock ACP covers lead mgmt, brokerage workflows and training | [squareyards.com/connect](https://www.squareyards.com/connect); [anarock.com technology](https://www.anarock.com/services/technology-solutions) | Later (marketplace) |
| Salesforce and SAP two-way sync for the CP platform | CP app co-exists with Salesforce (sales truth) and SAP (finance truth): PO → invoice → payment back to the partner | Sell.Do Broker App — [products/broker-app](https://www.sell.do/products/broker-app) | Should (enterprise) |

## 10. Customer portal and post-sales experience

| Feature | What it does | Benchmark + source URL | Priority |
|---|---|---|---|
| White-label buyer portal and app | Portal, microsite and notifications in the developer's brand and domain | Sell.Do CX Hub — [cx-hub](https://www.sell.do/real-estate-crm/cx-hub); Farvision Customer App — [app-customer](https://www.farvisionerp.com/farvision-app-customer.html) | Must |
| My Home dashboard | Booking value, % paid, next payment, construction %, handover date on one card | Sell.Do CX Hub — [cx-hub](https://www.sell.do/real-estate-crm/cx-hub) | Must |
| Pay against the schedule | Buyer picks a milestone or demand and pays by UPI, card or net banking; ledger updates live; instant receipt | Sell.Do — [cx-hub](https://www.sell.do/real-estate-crm/cx-hub); Farvision — [customer-portal](https://www.farvisionerp.com/farvision-customer-portal.html) | Must |
| Statement and receipt print for loan disbursement | Multi-year statement of account, late-fee ledger, invoice/receipt print ("print, stamp at builder office, submit to bank") | Farvision Customer Portal — [customer-portal](https://www.farvisionerp.com/farvision-customer-portal.html) | Must (IN) |
| Construction progress with photos | Milestone updates with site photos pushed to buyers | Sell.Do CX Hub — [cx-hub](https://www.sell.do/real-estate-crm/cx-hub); Farvision Customer Portal "project progress · construction photos · slab status" — [customer-portal](https://www.farvisionerp.com/farvision-customer-portal.html); Hyphen Homeowner Portal "build status updates" — [design-warranty](https://info.hyphensolutions.com/builders/design-warranty/) | Must |
| Desktop parity for NRIs and older buyers | Same features on web for large NEFT/RTGS payments, scanner KYC upload and long queries (Farvision claims 96% buyer reach) | Farvision Customer Portal — [customer-portal](https://www.farvisionerp.com/farvision-customer-portal.html) | Must |
| Phase-aware service requests | Pre-possession requests (demands, documents, customisation, refund) route to CRM/sales; post-possession (lift, plumbing, parking) route to facility management; automatic by unit status | Farvision Customer App — [app-customer](https://www.farvisionerp.com/farvision-app-customer.html) | Should |
| Change and customisation requests | Raised from WhatsApp or the portal, tracked as a ticket with SLA | Sell.Do CX Hub — [cx-hub](https://www.sell.do/real-estate-crm/cx-hub) | Should |
| Omnichannel ticket threading | Email, app ticket, phone (recorded and transcribed), WhatsApp and AI chat stitched into one customer thread | Farvision Customer Support — [farvision-module-crm-support.html](https://www.farvisionerp.com/farvision-module-crm-support.html) | Should |
| AI buyer assistant | "Your next payment of ₹9.5L is due 10 Aug — set reminder / share demand / pay now"; resolves the easy 40% of queries | Sell.Do CX Hub — [cx-hub](https://www.sell.do/real-estate-crm/cx-hub); Farvision AI chat — [crm-support](https://www.farvisionerp.com/farvision-module-crm-support.html) | Should |
| Named relationship officer (CRO) | Every buyer has a named CRO who is always copied while specialist teams work tickets; VIP auto-escalation; language routing | Farvision Support — [crm-support](https://www.farvisionerp.com/farvision-module-crm-support.html) | Should |
| D1–D7 onboarding checklist | Welcome call, app login, KYC, welcome kit, agreement e-sign, loan application, each with an owner and deadline | Farvision Customer Care — [crm-care](https://www.farvisionerp.com/farvision-module-crm-care.html) | Should |
| CSAT and sentiment-aware queue | CSAT at each milestone; angry customers surfaced first; contractor scorecards | Sell.Do CX Hub — [cx-hub](https://www.sell.do/real-estate-crm/cx-hub); Farvision — [crm-support](https://www.farvisionerp.com/farvision-module-crm-support.html); AvidCX surveys across the homebuyer journey — [avidratings.com](https://www.avidratings.com/) | Should |
| Owner referral programme | Each owner gets a link carrying their identity; reward released on booking with clawback on cancellation (Sell.Do claims referral bookings at ₹9.6k vs ₹41.2k blended) | Sell.Do IRIS Referral — [referral-loyalty](https://www.sell.do/products/iris/referral-loyalty); Farvision "Refer Us" — [app-customer](https://www.farvisionerp.com/farvision-app-customer.html) | Should |
| "What's new" cross-sell feed | Other projects inside the buyer app; one-tap enquiry routed to CRM with the referrer attached | Farvision Customer App — [app-customer](https://www.farvisionerp.com/farvision-app-customer.html) | Later |
| Verified reviews syndication (US) | Post-sale reviews shown on listings (TrustBuilder) | Zonda Listings — [zondahome.com/listings](https://zondahome.com/listings/) | Later |

## 11. Possession, handover, snags and warranty

| Feature | What it does | Benchmark + source URL | Priority |
|---|---|---|---|
| Guided handover checklist | Snag reporting, inspection sign-off, document collection and key handover run in the portal | Sell.Do CX Hub — [cx-hub](https://www.sell.do/real-estate-crm/cx-hub) | Must |
| Floor-plan tap-to-snag app | Handover team walks the unit with the actual floor plan, taps a room, shoots photos auto-pinned to that room | Farvision Snag management — [crm-support](https://www.farvisionerp.com/farvision-module-crm-support.html) | Must |
| Defect taxonomy and severity SLAs | 60+ sub-types (civil, plumbing, electrical, finishing, HVAC); critical 48h, major 7d, minor 21d | Farvision — [crm-support](https://www.farvisionerp.com/farvision-module-crm-support.html) | Must |
| Possession hold for critical snags | System blocks key release until critical snags are cleared | Farvision ("keys not released until cleared · system-enforced") — [crm-support](https://www.farvisionerp.com/farvision-module-crm-support.html) | Should |
| Auto work orders to the right contractor | Defect type → contractor roster → work order with photo and access window | Farvision — [crm-support](https://www.farvisionerp.com/farvision-module-crm-support.html) | Must |
| Buyer re-inspect and reopen | Buyer accepts the fix or reopens with their own photos | Farvision — [crm-support](https://www.farvisionerp.com/farvision-module-crm-support.html) | Must |
| Independent pre-completion inspection slot (UK) | Buyer's right to a professional pre-completion snagging inspection | New Homes Quality Code — [Denbury Homes summary](https://www.denburyhomes.co.uk/about/consumer-codes/the-new-homes-quality-code/); NHQB Code PDF (search snippet) | Must (UK) |
| Homeowner warranty portal | Submit warranty requests with photos and notes, schedule appointments, track status | Hyphen Homeowner Portal — [design-warranty](https://info.hyphensolutions.com/builders/design-warranty/); BuildTopia Homeowner Central / warranty — [softwarefinder.com BuildTopia](https://softwarefinder.com/enterprise-resource-planning-software/buildtopia) | Must |
| AI warranty triage | 24/7 AI triage and routing (Avid claims 35% less manual work, 20% faster resolution) | AvidWarranty (now ECI) — [avidratings.com](https://www.avidratings.com/) | Later |
| Digital home manual and maintenance reminders | Home inventory (manuals, care instructions); automated maintenance reminders | Hyphen — [design-warranty](https://info.hyphensolutions.com/builders/design-warranty/); Avid HomeKeep — [avidratings.com](https://www.avidratings.com/) | Should |
| Digital handover pack (O&M, fire files) | Structured O&M manuals, fire and emergency files, asset register at handover (UK high-rise / BTR) | Zutec Digital Handover — [zutec.com](https://zutec.com/) | Later |
| Warranty-period clock | Tracks the defect-liability or warranty window per unit (UK Codes: 2 years after completion) | Consumer Code for Home Builders — [consumercode.co.uk](https://consumercode.co.uk/the-code/what-is-the-code/); NHQC 2 years — [Denbury](https://www.denburyhomes.co.uk/about/consumer-codes/the-new-homes-quality-code/) | Must |

## 12. US new homes: site maps, design centre, options and listings

| Feature | What it does | Benchmark + source URL | Priority |
|---|---|---|---|
| Interactive site map with live lot status | Clickable community map with lots, phases, pricing, plans and elevations; buyers contact sales from a lot | Zonda Interactive Site Map Bundle — [interactive-site-map-bundle](https://zondahome.com/digital-solutions/interactive-site-map-bundle) | Must (US) |
| One map syncs everywhere | Update once, then push to website, NewHomeSource, Google Maps and print PDFs ("3–6 months faster to launch") | Zonda — [interactive-site-map-bundle](https://zondahome.com/digital-solutions/interactive-site-map-bundle) | Should |
| Coming-soon print maps from the same base | Pre-launch branded PDF maps | Zonda — [interactive-site-map-bundle](https://zondahome.com/digital-solutions/interactive-site-map-bundle) | Later |
| Interactive and 3D floor plans | Buyers toggle options, furniture and finishes; JS-API embed (Zonda claims 3× more likely to fill a lead form) | Zonda Floor Plans — [floor-plans](https://zondahome.com/digital-solutions/floor-plans) | Should |
| Online design-centre / options shopping | Buyers browse structural options, elevations, finishes and fixtures online before the design-centre appointment | Zonda Envision — [envision-for-builders](https://zondahome.com/digital-solutions/envision-for-builders/); Hyphen HomeSight — [hyphen-homesight](https://info.hyphensolutions.com/products/hyphen-homesight/); BuildTopia Design Studio Manager — [softwarefinder](https://softwarefinder.com/enterprise-resource-planning-software/buildtopia) | Must (US) |
| Whole-home running total | Shows how choices add up across the home instead of one option at a time (Envision claims +35% options sold) | Zonda Envision — [envision](https://zondahome.com/digital-solutions/envision/) | Should |
| Wish list carries into the contract | Pre-sale wish list becomes a buyer-specific account tied to plan and community after contract | Zonda Envision FAQ — [envision-for-builders](https://zondahome.com/digital-solutions/envision-for-builders/) | Should |
| Designer / options / product managers | Back-office modules: Design Center, Designer Manager, Options Manager, Product Manager | Zonda Envision — [envision-for-builders](https://zondahome.com/digital-solutions/envision-for-builders/) | Later |
| Manufacturer product catalogue | 375K product assets; branded manufacturer content inside the visualizer | Zonda Envision — [envision](https://zondahome.com/digital-solutions/envision/) | Later |
| 3D configurator with lot-specific collateral | Real-time 3D plans, elevations, palettes; auto-generated lot-specific sales sheets | Higharc Showroom — [product/showroom](https://www.higharc.com/product/showroom) | Later |
| Selections → construction documents and takeoffs | Contract selections produce permit-ready CDs and material takeoffs automatically | Higharc — [how-it-works](https://www.higharc.com/how-it-works); [showroom](https://www.higharc.com/product/showroom) | Later |
| Selections drive POs and budgets | Approved contract plus change orders release budgets and POs to trades | Hyphen HomeFront — [hyphen-homefront](https://info.hyphensolutions.com/products/hyphen-homefront/) | Later |
| Sales-centre kiosks | Multi-touch kiosk (master plans) or web-based Digital Sales Assistant | Zonda Kiosks — [kiosks](https://zondahome.com/digital-solutions/kiosks/) | Should |
| New-homes marketplace syndication | List communities on NewHomeSource (US, 20M+ annual shoppers claimed) and Livabl (Canada) with real-time leads | Zonda Listings — [zondahome.com/listings](https://zondahome.com/listings/); Livabl — [listings/livabl](https://zondahome.com/listings/livabl/) | Must (US) |
| Builder CRM basics | Web-form capture, scoring, email campaigns, visual pipeline, forecasting | Lasso CRM (ECI) — [SoftwareOne listing](https://platform.softwareone.com/product/lasso-crm/PCP-1193-2152); Hyphen CRM — [hyphen-crm](https://info.hyphensolutions.com/products/hyphen-crm/) | Must (US) |
| Accounting integrations | QuickBooks, Sage, Acumatica, MS Dynamics BC | BuildTopia — [softwarefinder](https://softwarefinder.com/enterprise-resource-planning-software/buildtopia) | Should (US) |

## 13. Construction and quality linkage (feeds demands and updates)

| Feature | What it does | Benchmark + source URL | Priority |
|---|---|---|---|
| Milestone certification by site engineer | Engineer marks slab/plinth complete, which becomes the trigger for demands and buyer updates | Sell.Do — [payment-schedules-milestones](https://www.sell.do/real-estate-crm/post-sales-and-collections/payment-schedules-milestones); Farvision — [crm-care](https://www.farvisionerp.com/farvision-module-crm-care.html) | Must |
| BOQ-driven QC inspections with photos | Activity-specific checklists from the BOQ (bill of quantities); non-conformances raised and tracked to closure | Farvision Project QC app — [farvision-app-project-qc.html](https://www.farvisionerp.com/farvision-app-project-qc.html) | Later |
| BOQ-to-pay, work orders, procurement | BOQ, subcontracts, work orders, certification, indent → PO → GRN → invoice | Farvision — [farvisionerp.com](https://www.farvisionerp.com/) | Later (partner) |
| Builder–supplier scheduling network (US) | Schedules, POs and payments shared with trades; payments cleared by lien waivers | Hyphen BuildPro / SupplyPro / Wallet — [hyphensolutions.com](https://info.hyphensolutions.com/); [hyphen-homefront](https://info.hyphensolutions.com/products/hyphen-homefront/) | Later (integrate) |
| QA and snag management for housebuilders (UK) | QA inspections, snagging and defects, Part L compliance | Zutec — [zutec.com](https://zutec.com/) | Later |
| Slippage as cash impact | Construction delay shown as delayed collections | Sell.Do — [payment-schedules-milestones](https://www.sell.do/real-estate-crm/post-sales-and-collections/payment-schedules-milestones) | Should |

## 14. International agency CRM (UK, UAE, Australia, India brokers)

| Feature | What it does | Benchmark + source URL | Priority |
|---|---|---|---|
| Listing management (sales and rentals) | Create, edit and publish listings with media, owner history, price, availability | PropSpace — [propspace-broker/features](https://www.propspace.com/platform/propspace-broker/features); Goyzer — [goyzer.com](https://www.goyzer.com/); MRI Vault — [mrisoftware.com/au/products/vault](https://www.mrisoftware.com/au/products/vault/) | Must |
| Applicant ↔ property matching both ways | Match leads to units and units to leads; "reverse buyer matching" to impress vendors | Goyzer View Matches — [crm-features-for-brokers](https://www.goyzer.com/crm-features-for-brokers); Rex — [compare/vaultre-vs-rex](https://www.rexsoftware.com/compare/vaultre-vs-rex); Reapit Sales CRM — [reapit.com/platform/sales-crm](https://www.reapit.com/platform/sales-crm) | Must |
| Single-screen applicant, vendor and property records | Consent, requirements, offers, ID checks and status on one screen per record type | Reapit Sales CRM — [platform/sales-crm](https://www.reapit.com/platform/sales-crm) | Must (UK) |
| Built-in AML and ID checks | Vendor ID checks and AML processes inside the CRM | Reapit (UK) — [platform/sales-crm](https://www.reapit.com/platform/sales-crm); Reapit ANZ nav lists "AML/CTF" — [reapit.com.au](https://www.reapit.com.au/software/sales-crm) | Must (UK/AU) |
| Sales progression | Offer → memorandum of sale → exchange → completion milestones | Reapit "streamline your sales progression" — [reapit.com](https://www.reapit.com/) | Must (UK) |
| Portal-enquiry vetting and self-booked viewings | Vet portal enquiries automatically; applicants self-book viewings into travel-feasible diary slots | Reapit Bookings and AI — [platform/bookings](https://www.reapit.com/platform/bookings); [platform/ai-automation](https://www.reapit.com/platform/ai-automation) | Should |
| Third-party property data pulls | EPC, what3words, UPRN in one click (UK) | Reapit AI — [platform/ai-automation](https://www.reapit.com/platform/ai-automation) | Should (UK) |
| Client accounts / trust accounting | Client money with BACS, direct debit, bank-statement import, arrears (UK); sales trust accounting with commission and settlement workflows (AU); 2-way Xero | Reapit Client Accounts — [platform/client-accounts](https://www.reapit.com/platform/client-accounts); Rex — [full-sales-trust-accounting](https://www.rexsoftware.com/features/full-sales-trust-accounting); Reapit AU — [trust-accounting](https://www.reapit.com.au/software/trust-accounting); MRI Vault — [vault](https://www.mrisoftware.com/au/products/vault/) | Must (UK/AU) |
| Deal wizard with regulator forms (UAE) | Log a deal and auto-generate RERA Forms A, B, F, Form I (agent-to-agent) and Ejari; commission splits | PropSpace — [propspace-broker/features](https://www.propspace.com/platform/propspace-broker/features) | Must (UAE) |
| Off-plan project directory for brokers | 1,000+ (PropSpace) or 1,500+ (Bayut DevConnect) off-plan projects with unit availability, payment plans, escrow number, brochures, "reveal developer contacts", last-updated stamp | PropSpace — [off-plan](https://www.propspace.com/platform/propspace-broker/off-plan); Bayut DevConnect — [devconnect](https://www.bayut.com/agentportal/announcements/discover-off-plan-opportunities-faster-with-devconnect/) | Must (UAE) |
| Agent-to-agent co-broking network | Post buyer requirements, get matched to other agents' listings, share deals | Bayut ProConnect in Profolio — [apps.apple.com Profolio](https://apps.apple.com/ae/app/profolio/id1450925753); Square Yards co-broking — [squareyards.com](https://www.squareyards.com/) | Should |
| Listing verification badge | Agent visits the property and uploads geo-tagged, timestamped photos for a "TruCheck" badge | Bayut Profolio — [App Store](https://apps.apple.com/ae/app/profolio/id1450925753) | Should (UAE) |
| Agency quotas and listing credits | Manage agent profiles, listing quotas, Hot/Signature boosts, portal billing | Bayut Profolio — [bayut.com/agentportal/profolio](https://www.bayut.com/agentportal/profolio/) | Should (UAE) |
| Agent score and transaction claims | Agent Score, SuperAgent progress, claim transactions from the app | PF Expert (4.9★, 282 ratings) — [apps.apple.com PF Expert](https://apps.apple.com/ae/app/pf-expert/id6444062938) | Later |
| Leaderboards for agencies | KPI TV board: deals, viewings, response time, calls, listings | Goyzer — [crm-features-for-brokers](https://www.goyzer.com/crm-features-for-brokers) | Should |
| WhatsApp new-lead alerts to agents | Every new lead from any source pings the assigned agent on WhatsApp | Goyzer — [crm-features-for-brokers](https://www.goyzer.com/crm-features-for-brokers) | Should |
| Open-home kiosk check-in (AU) | Self check-in at open homes; appraisals; feedback | MRI Vault — [vault](https://www.mrisoftware.com/au/products/vault/); Rex "full open-home experience" — [vaultre-vs-rex](https://www.rexsoftware.com/compare/vaultre-vs-rex) | Must (AU) |
| Digital proposals / vendor pitches (AU) | Personalised digital listing proposals in CRM | Reapit Sales (Agentbox) — [agentbox.com.au](https://www.agentbox.com.au/); MRI Agent proposals — [vault](https://www.mrisoftware.com/au/products/vault/) | Should (AU) |
| Commercial stack plans | Stack-plan visualisation of building occupancy and lease expiry | MRI Vault — [vault](https://www.mrisoftware.com/au/products/vault/) | Later |
| Mobile parity | Rex claims 90% of CRM functions on mobile; PropSpace tablet "presentation mode" hides sensitive info | Rex — [vaultre-vs-rex](https://www.rexsoftware.com/compare/vaultre-vs-rex); PropSpace app — [App Store](https://apps.apple.com/ae/app/propspace-real-estate-crm/id1269090934) | Must |
| AI listing descriptions, NL search, price intelligence | Description generator, points of interest, talk-to-your-data, price comparison | Goyzer Spark — [crm-features-for-brokers](https://www.goyzer.com/crm-features-for-brokers); MRI Vault — [vault](https://www.mrisoftware.com/au/products/vault/) | Should |
| Natural-language workflow builder | "Describe a repeatable workflow in plain English" (Rex marks it "coming soon") | Rex AI Automations — [rexsoftware.com](https://www.rexsoftware.com/) | Later |
| Branded valuation reports | Agent-branded property valuation reports to win instructions | Bayut Branded TruEstimate — [bayut.com/agentportal](https://www.bayut.com/agentportal/) | Later |
| Transparent published pricing | PropSpace Broker AED 220/user/month, AED 500/month minimum, PM at AED 8/unit; 10% (1-yr) or 25% (2-yr) prepay discount; 12-month minimum | PropSpace pricing — [propspace.com/pricing](https://www.propspace.com/pricing) | Must (model) |

## 15. Portal syndication and listing compliance

| Feature | What it does | Benchmark + source URL | Priority |
|---|---|---|---|
| One-click syndication to 80+ portals | Publish to Property Finder, Bayut, dubizzle and others with real-time sync and premium-placement controls | PropSpace — [propspace-broker/features](https://www.propspace.com/platform/propspace-broker/features); Goyzer — [goyzer.com](https://www.goyzer.com/) | Must (UAE) |
| Real-time portal sync (AU) | Listings sync to portals in real time | MRI Vault — [vault](https://www.mrisoftware.com/au/products/vault/) | Must (AU) |
| India portals both directions | Enquiries in, inventory and pricing out; sold-out configurations auto-paused on portals | Sell.Do — [integrations](https://www.sell.do/real-estate-crm/integrations) | Should |
| Trakheesi permit number required per listing | Store the DLD advertising permit and agency DED number; block publish without them | Bayut agent guide — [bayut.com Madmoun guide](https://www.bayut.com/agentportal/agents-guide-to-dld-madmoun-service/) | Must (UAE) |
| Madmoun QR on every ad | QR issued with each permit and shown on print, audiovisual and portal ads, mandatory since 24 Apr 2023 | DLD — [dubailand.gov.ae Madmoun](https://dubailand.gov.ae/en/news-media/dubai-land-department-provides-madmoun-service-to-verify-validity-of-real-estate-ads-via-qr-codes) | Must (UAE) |
| Permit status filter | Find listings whose permit is missing, expired or mismatched before they are flagged | Bayut Profolio "Permit Status filter" — [Madmoun guide](https://www.bayut.com/agentportal/agents-guide-to-dld-madmoun-service/) | Must (UAE) |
| Off-plan advertising authorisation | Developer needs written DLD authorisation before advertising off-plan or exhibiting | Dubai Law No. 8 of 2007, Art. 5 — [dlp.dubai.gov.ae](https://dlp.dubai.gov.ae/Legislation%20Reference/2007/Law%20No.%20(8)%20of%202007.html) | Must (UAE dev) |
| RERA registration no. on project and CP materials (India) | Show the project RERA number and agent RERA number on ads, CP portal and documents | Wikipedia RERA Act (agents must quote registration no. in every sale) — [en.wikipedia.org](https://en.wikipedia.org/wiki/Real_Estate_(Regulation_and_Development)_Act,_2016); Sell.Do CP portal shows RERA no. — [channel-partners](https://www.sell.do/real-estate-crm/channel-partners) | Must (IN) |
| Portal lead-quality and spend tracking | Cost per booking by portal, to cut portals that consume budget and produce nothing before renewal | Sell.Do — [marketing-automation](https://www.sell.do/real-estate-crm/marketing-automation) | Should |
| Portal advertising packages (benchmark only) | MagicBricks sells individual, agent and builder ad packages with an RM (2 crore monthly visitors claimed) | [magicbricks.com/advertise-with-us](https://www.magicbricks.com/advertise-with-us) | Later (partner) |

## 16. Analytics, command views and AI

| Feature | What it does | Benchmark + source URL | Priority |
|---|---|---|---|
| Portfolio boardroom view | Leads, visits, bookings, cost per booking and inventory across projects, drillable to the lead | Sell.Do for Developers — [solutions/developers](https://www.sell.do/solutions/developers) | Must |
| Morning AI briefing | "Bookings down 12% this week, driven by fewer site visits from Meta leads in Pune" | Sell.Do Jarvis — [solutions/developers](https://www.sell.do/solutions/developers) | Should |
| Budget reallocation suggestions | "Move ₹6L from Portal A to Social, gain ~4 bookings" | Sell.Do Jarvis — [marketing-automation](https://www.sell.do/real-estate-crm/marketing-automation) | Later |
| Collections and DSO dashboard | Raised, collected, overdue, average days to pay, DSO (days sales outstanding) trend | Sell.Do — [demand-letters](https://www.sell.do/real-estate-crm/post-sales-and-collections/demand-letters); Farvision — [crm-care](https://www.farvisionerp.com/farvision-module-crm-care.html) | Must |
| CP channel analytics | Tagged → conversion %, brokerage MTD, pending payout, partner share of bookings (Sell.Do claims 61%) | Sell.Do — [channel-partners](https://www.sell.do/real-estate-crm/channel-partners) | Must |
| Helpdesk analytics | CSAT, deflection, first response, contractor scorecards | Farvision — [crm-support](https://www.farvisionerp.com/farvision-module-crm-support.html) | Should |
| BI warehouse / Power BI | Data warehouse for external BI tools; Power BI dashboards out of the box | Reapit DataWarehouse — [reapit.com](https://www.reapit.com/); Farvision Power BI — [farvisionerp.com](https://www.farvisionerp.com/) | Should |
| Scheduled custom reports | Report builder with scheduled email delivery and access restrictions | Goyzer — [crm-features-for-developers](https://www.goyzer.com/crm-features-for-developers) | Must |
| Market and pricing data | Market analytics and research for pricing decisions | Zonda Data — [zondahome.com](https://zondahome.com/); Square Yards Data Intelligence — [squareyards.com](https://www.squareyards.com/); Bayut market and competitive insights — [profolio](https://www.bayut.com/agentportal/profolio/) | Later |
| AI agents across the funnel | Voice agents, call analysis, content agents; "AI Agent Army" | Sell.Do — [sell.do](https://www.sell.do/) | Later |

## 17. Platform, integration and security

| Feature | What it does | Benchmark + source URL | Priority |
|---|---|---|---|
| REST API and HMAC-signed webhooks | Documented API and signed webhooks, with idempotent upserts and a reconciliation sweep | Sell.Do — [integrations](https://www.sell.do/real-estate-crm/integrations); [products/broker-app](https://www.sell.do/products/broker-app); Goyzer enterprise API — [crm-features-for-developers](https://www.goyzer.com/crm-features-for-developers) | Must |
| MCP server governed by the same RBAC | AI agents (ChatGPT/Claude) act through MCP with the same permissions as the UI, audit-logged | Sell.Do MCP — [products/broker-app](https://www.sell.do/products/broker-app); [integrations](https://www.sell.do/real-estate-crm/integrations) | Should |
| Integration health monitor | "58 of 60 connectors healthy · token expires in 3 days, 388 leads/month at risk" | Sell.Do — [integrations](https://www.sell.do/real-estate-crm/integrations) | Should |
| Salesforce co-existence | Two-way sync rather than rip-and-replace for enterprise developers | Sell.Do — [integrations](https://www.sell.do/real-estate-crm/integrations); [compare/sell-do-vs-salesforce](https://www.sell.do/compare/sell-do-vs-salesforce) | Should |
| Hash-chained audit, DPDP consent/DSAR | Tamper-evident audit, role-based access, consent and data-subject-request tooling (DPDP is India's data-protection law) | Sell.Do for Developers — [solutions/developers](https://www.sell.do/solutions/developers) | Must |
| Field-level access policies | Fully dynamic user access control; per-user activity tracking | Goyzer — [crm-features-for-developers](https://www.goyzer.com/crm-features-for-developers) | Must |
| Certifications | ISO/IEC 27001:2022 (Sell.Do); ISO 9001 (Farvision) | [sell.do/products/iris](https://www.sell.do/products/iris); [farvisionerp.com](https://www.farvisionerp.com/) | Should |
| Arabic/English and multi-language | Tenant portal UAE-ready in English and Arabic; Indian-language support routing | Farvision — [farvisionerp.com](https://www.farvisionerp.com/); [crm-support](https://www.farvisionerp.com/farvision-module-crm-support.html) | Must (UAE) |
| Fast go-live | Sell.Do "live in as little as 7 days"; Reapit customer "six weeks start to finish" | [sell.do](https://www.sell.do/real-estate-crm/post-sales-and-collections); [reapit.com](https://www.reapit.com/) | Should |
| Mobile apps by persona | Sales hub, broker, customer, QC, stores, cockpit, employee apps (Farvision: 9 apps) | Farvision — [farvisionerp.com](https://www.farvisionerp.com/) | Should |

**Row count: 242 feature rows across 17 tables, plus 30 rows in the regional compliance packs.**

---

## Top 12 differentiators for Estate OS

1. **One unit record from launch to keys.** Grid status, price version, hold, booking, co-applicants, payment plan, demand ledger, CP commission, snag list and warranty clock all hang off one unit. Today this takes Sell.Do plus Farvision (India), or Lasso plus Envision plus BuildTopia plus Avid (US).
2. **Holds that expire by themselves, plus a concurrency guard, shared live with CPs.** Copy Sell.Do's "a hold carries its own expiry" and its zero double-booking guarantee. Show the countdown to the rep, the CP and the buyer.
3. **A provable fair queue.** Order by tier plus millisecond timestamp, with position and median wait on the buyer's phone. Nobody outside India sells this. UAE launches are the obvious second market (Sell.Do already lists Emaar).
4. **Brokerage released only when the buyer pays.** Ladder commission with clawback on cancellation, sub-broker splits, and a ledger shared with the partner. This removes the main CP dispute, a combination only Farvision and Sell.Do approach.
5. **A visibility matrix for partners.** Field-level toggles for what partners see (stock, not margins or customer phones), on the developer's subdomain.
6. **Site certification triggers demands.** One engineer action produces bulk GST/TDS-correct demand letters, per-channel dispatch tracking, a buyer push and a bank disbursement claim.
7. **Snags tapped on the floor plan, with keys held for critical defects.** One defect engine serves handover, buyer post-possession tickets and warranty. US builders split this across Hyphen, BuildTopia and Avid.
8. **A customer app that knows the unit's phase.** Before possession, requests go to CRM and finance. After possession, they go to facility management or warranty. Statement printing for loan disbursement and full desktop parity for NRIs come built in.
9. **Compliance built into the product.** Publishing is blocked without a Trakheesi permit, DED number and Madmoun QR (UAE). RERA numbers appear on every CP asset (India). An NHQC 14-day cooling-off timer and refund deadline apply to UK reservations. NSW disclosure-statement change notices go out at least 21 days before completion. Vic deposits are capped at 10%. No vendor reviewed markets a multi-country rules engine.
10. **A developer-to-broker inventory exchange.** The developer publishes live availability, payment plan and escrow number once, and every agency CRM sees it. PropSpace and Bayut charge or wall this off; Estate OS can make the developer's own grid the source.
11. **Configurator-first lead capture for builders.** A saved configuration plus price creates the CRM opportunity (Higharc→Lasso, UBH +40%). The design-centre wish list then carries into the contract (Envision). India and UAE equivalent: the buyer's VR tour dwell time attaches to the lead.
12. **Published prices and an open agent layer.** Publish prices the way PropSpace does (AED 220/user), not quote-only like Sell.Do, Farvision, Goyzer or Lasso. Add an MCP/API layer under the same RBAC, so developers, CPs and AI agents query the same governed data.

## UX patterns worth copying

- **Hold chip with a live countdown** on every unit tile ("BLOCKED · 6h left", "HOLD 24H"), from [Farvision](https://www.farvisionerp.com/farvision-module-crm-sfa.html) and [Sell.Do IRIS](https://www.sell.do/products/iris/inventory-bookings-documentation).
- **Floor-plate grid** (floors as rows, wings as columns), colour-coded, with a price column, sticky filters and a unit drawer showing base vs all-in price and brokerage % ([Farvision Broker Portal](https://www.farvisionerp.com/farvision-broker-portal.html)).
- **Itemised cost sheet with the approval chain inline** (rep ✓, manager ✓ within cap, sales head ◷) and an AI check card under it ([Sell.Do](https://www.sell.do/real-estate-crm/inventory-and-negotiations)).
- **Price-ladder visual**: bands by % sold, a "next band in 12 units" counter, and the buyer-facing price shown next to it ([Sell.Do IRIS](https://www.sell.do/products/iris/dynamic-pricing-and-buyer-experience)).
- **Launch console**: four KPI tiles (sold/released, queue + wait, value booked, payment failures), a timestamped activity feed, and absorption bars per tower with a one-line recommendation ([Sell.Do IRIS](https://www.sell.do/products/iris/launch-day-command-centre)).
- **EOI tier cards** showing price, perk and count, plus a payment-mix breakdown (UPI/net banking/card) ([Sell.Do](https://www.sell.do/products/iris/eoi-token-management)).
- **"What the partner can and cannot see" checklist**, with ✓ and — per field ([Sell.Do Broker App](https://www.sell.do/products/broker-app)).
- **Expiring-tag nudges** for CPs: "3 tagged leads expire in <48h — book a site visit to extend validity 30 days" ([Sell.Do CP](https://www.sell.do/real-estate-crm/channel-partners)).
- **Demand-letter dispatch tracker** per channel (email opened, WhatsApp read, RPAD in transit) on the letter itself ([Sell.Do](https://www.sell.do/real-estate-crm/post-sales-and-collections/demand-letters)).
- **Ageing buckets that set the tone of the reminder** (soft, firm, formal, legal), with a DSO sparkline ([Farvision](https://www.farvisionerp.com/farvision-module-crm-care.html)).
- **AI suggestions with confidence and one-click confirm** for reconciliation ("NEFT matches PAN, confidence 94% — post?") ([Sell.Do](https://www.sell.do/real-estate-crm/post-sales-and-collections/ledger-payments-receipts)).
- **D1–D7 onboarding timeline** with DONE / IN TRANSIT / QUEUED states ([Farvision](https://www.farvisionerp.com/farvision-module-crm-care.html)).
- **Loan tracker steps with a red "BLOCKING" step** and the escalation owner named ([Farvision](https://www.farvisionerp.com/farvision-module-crm-care.html)).
- **Snag capture**: tap the room on the plan, the camera opens, pick the defect type, severity sets the SLA, "Save & next room" ([Farvision](https://www.farvisionerp.com/farvision-module-crm-support.html)).
- **App for the field, portal for the desk**: the same login, with explicit "best for" guidance ([Farvision](https://www.farvisionerp.com/farvision-broker-portal.html)).
- **"Last updated" timestamp on every off-plan project record**, plus a "Reveal contacts" button ([PropSpace](https://www.propspace.com/platform/propspace-broker/off-plan), [Bayut DevConnect](https://www.bayut.com/agentportal/announcements/discover-off-plan-opportunities-faster-with-devconnect/)).
- **Tablet presentation mode** that hides commission and owner data while showing a listing to a client ([PropSpace app](https://apps.apple.com/ae/app/propspace-real-estate-crm/id1269090934)).
- **Whole-home running total in the options configurator**, so options are not priced one at a time ([Envision](https://zondahome.com/digital-solutions/envision/)).
- **Self-tour flow**: QR on signage, verify ID, digital lock opens, automated text introduces the salesperson, a post-tour report goes to the CRM ([UTour](https://zondahome.com/utour/)).

## Regional compliance packs

### India (RERA, GST/TDS, KYC, messaging)
| Rule / need | Product behaviour | Source |
|---|---|---|
| Project and agent RERA registration; agents quote the registration no. in every sale | RERA no. fields on project and CP; printed on every ad, CP asset and agreement; block CP payout if the agent no. is missing | [Wikipedia RERA Act](https://en.wikipedia.org/wiki/Real_Estate_(Regulation_and_Development)_Act,_2016); [Sell.Do CP portal](https://www.sell.do/real-estate-crm/channel-partners) |
| Carpet-area pricing | Cost sheet keyed to carpet area | [Wikipedia RERA Act](https://en.wikipedia.org/wiki/Real_Estate_(Regulation_and_Development)_Act,_2016) |
| 70% of receipts to a separate project account | Escrow split on every receipt; withdrawal tracking | [Wikipedia](https://en.wikipedia.org/wiki/Real_Estate_(Regulation_and_Development)_Act,_2016) (summary wording); [Farvision "RERA escrow split"](https://www.farvisionerp.com/farvision-module-crm-care.html); [Sell.Do](https://www.sell.do/real-estate-crm/integrations) |
| Quarterly/annual project updates to the state RERA | Progress, bookings and finance pack exported per project per quarter | [MahaRERA promoters corner](https://maharera.maharashtra.gov.in/) |
| GST 5% on under-construction; TDS 194-IA 1% above ₹50L; Form 16B; 26AS; state stamp duty and registration | Versioned tax tables per state; challan tracker per buyer | [Sell.Do Taxes](https://www.sell.do/real-estate-crm/post-sales-and-collections/taxes-tds-gst); [Farvision GST/TDS](https://www.farvisionerp.com/) |
| GSTR-1/3B, e-invoicing and IRN, TDS on brokerage | E-invoice on demands and CP invoices | [Farvision](https://www.farvisionerp.com/); [Sell.Do Broker App](https://www.sell.do/products/broker-app) |
| Aadhaar eKYC, Digilocker, Aadhaar e-sign, e-stamp | Consent capture and audit per document | [Sell.Do IRIS eKYC](https://www.sell.do/products/iris/ekyc-esign-paperless) |
| DLT-registered SMS, NDNC scrub, DPDP consent and DSAR | Pre-send consent and DND gate; consent ledger | [Sell.Do Comms](https://www.sell.do/real-estate-crm/communication-hub); [Farvision drip](https://www.farvisionerp.com/farvision-module-crm-sfa.html); [Sell.Do Developers](https://www.sell.do/solutions/developers) |
| Interest on delayed payment per agreement clause | Clause-driven interest engine | [Sell.Do demand sample "RERA clause 8(a) · 10.5% p.a."](https://www.sell.do/real-estate-crm/post-sales-and-collections/demand-letters) (illustrative UI only) |

### UAE (Dubai DLD/RERA)
| Rule / need | Product behaviour | Source |
|---|---|---|
| Trakheesi advertising permit plus Madmoun QR on all ads (from 24 Apr 2023) | Mandatory permit no. and agency DED no. per listing; QR rendered on brochures and portal ads; permit-status filter; publish blocked if missing | [DLD](https://dubailand.gov.ae/en/news-media/dubai-land-department-provides-madmoun-service-to-verify-validity-of-real-estate-ads-via-qr-codes); [Bayut guide](https://www.bayut.com/agentportal/agents-guide-to-dld-madmoun-service/) |
| Off-plan: developer on DLD register; one escrow account per project; written authorisation before off-plan ads or exhibitions | Project record holds escrow account and agent bank, authorisation reference, separate ledger per project | [Law No. 8 of 2007](https://dlp.dubai.gov.ae/Legislation%20Reference/2007/Law%20No.%20(8)%20of%202007.html) |
| Escrow withdrawals tied to audited progress; retention amount | Track completion % per technical audit and a 5% retention line | [DLD FAQ topics](https://dubailand.gov.ae/en/frequently-asked-questions) (question titles only; answers not read) |
| Oqood (provisional off-plan registration) | Registration status per booking; fees in cost sheet | [PropSpace blog title "What is Oqood?"](https://www.propspace.com/platform/propspace-broker/features); legal basis not verified |
| Broker forms: RERA Forms A/B/F, Form I commission split, Ejari | Deal wizard auto-generates them | [PropSpace](https://www.propspace.com/platform/propspace-broker/features) |
| VAT 5%, corporate tax 9%, e-invoicing phase 2 | GCC tax profile per entity | [Farvision](https://www.farvisionerp.com/) |
| Arabic/English | Bilingual buyer portal and documents | [Farvision](https://www.farvisionerp.com/) |

### UK (new homes and agency)
| Rule / need | Product behaviour | Source |
|---|---|---|
| New Homes Quality Code: reservation agreement with at least 14-day cooling-off; full refund in cooling-off; after that, refund less stated deductions within 14 days (subject to AML) | Reservation object with cooling-off timer, refund-due clock and deduction schedule; no duplicate reservation on the same plot during cooling-off | NHQB Code PDF ([search snippet](https://www.nhqb.org.uk/wp-content/uploads/2026/02/New-Homes-Quality-Code-V2-March-2026.pdf)); [Denbury NHQC summary](https://www.denburyhomes.co.uk/about/consumer-codes/the-new-homes-quality-code/) |
| NHQC: right to independent pre-completion inspection; no high-pressure selling; tenure, ground rent and service charge transparency; vulnerable-customer support; 2-year after-sales; New Homes Ombudsman | Pre-completion inspection booking; mandatory tenure/charges fields on listings; vulnerability flag; warranty clock; complaint log exportable for the ombudsman | [Denbury NHQC](https://www.denburyhomes.co.uk/about/consumer-codes/the-new-homes-quality-code/) |
| Consumer Code for Home Builders (5th ed. for reservations from 1 Jan 2024), covering homes under NHBC, Premier Guarantee, LABC, Checkmate; from reservation to 2 years after completion | Code version stamped on each reservation; warranty provider field | [consumercode.co.uk](https://consumercode.co.uk/the-code/what-is-the-code/) |
| AML / ID checks on vendors and buyers | ID and AML status on the contact; block progression without it | [Reapit Sales CRM](https://www.reapit.com/platform/sales-crm) |
| Client money handling | Client accounts with reconciliation and payment runs | [Reapit Client Accounts](https://www.reapit.com/platform/client-accounts) |
| Property data (EPC, UPRN) | Pull and store on listing | [Reapit AI](https://www.reapit.com/platform/ai-automation) |

### Australia (off-the-plan and agency)
| Rule / need | Product behaviour | Source |
|---|---|---|
| VIC: off-the-plan deposit at most 10%; warning notice in contract; buyer may rescind if the plan of subdivision is not registered by the contract date (default 18 months) | Deposit cap validation; sunset/registration date tracker with rescission alert | [Consumer Affairs Victoria](https://www.consumer.vic.gov.au/housing/buying-and-selling-property/buying-property/buying-off-the-plan) |
| NSW: disclosure statement plus draft plan attached; 10-business-day cooling-off; notice of material changes at least 21 days before completion (rescind or claim up to 2%); deposit held in trust; registered plan 21 days before settlement; vendor sunset rescission needs buyer consent or a court order | Disclosure-statement generator; change-notice workflow with deadlines; trust-held deposit ledger; sunset clock | [NSW Registrar General](https://www.registrargeneral.nsw.gov.au/property-and-conveyancing/off-the-plan); [Elringtons](https://elringtons.com.au/new-rules-for-nsw-off-the-plan-contracts/) |
| Sales trust accounting | Trust ledger, receipting, settlement workflows, statutory reports | [Rex](https://www.rexsoftware.com/features/full-sales-trust-accounting); [Reapit AU](https://www.reapit.com.au/software/trust-accounting) |
| AML/CTF for agents | KYC/CDD (customer due diligence) workflow on vendors and buyers | [Reapit ANZ nav lists AML/CTF](https://www.reapit.com.au/software/sales-crm) (page itself 404'd) |

### US (new homes)
| Rule / need | Product behaviour | Source |
|---|---|---|
| Interstate Land Sales Full Disclosure Act / Reg J: registration, property reports and anti-fraud for non-exempt subdivision lot sales; covers developers and their agents | Property-report delivery and receipt tracking on lot sales; exemption flag per community | [CFPB Reg J](https://www.consumerfinance.gov/rules-policy/regulations/1010/) |
| Lien waivers before trade payments | Payment gated on lien-waiver upload | [Hyphen Wallet](https://info.hyphensolutions.com/products/hyphen-homefront/) |
| Co-op agent relationship on new-home sales | Agent attached to the buyer opportunity with commission terms (post-NAR settlement, see 01-market-research) | [Hyphen CRM](https://info.hyphensolutions.com/products/hyphen-crm/) |
| Self-tour identity verification | ID/card plus phone verification before access | [Zonda UTour](https://zondahome.com/utour/) |

---

## Not verified

- **India RERA section details**: Sec 13 (10% advance cap before the agreement for sale), Sec 14 (5-year structural defect liability), Sec 18 (refund with interest on delay), Sec 4(2)(l)(D) (70% to a separate account withdrawn per certified progress), Sec 11 (quarterly updates). Indiankanoon, IndiaCode and ClearTax did not load. Only the Wikipedia summary (70% wording, carpet area, agent registration) and MahaRERA's "Updates (Quarterly/Annual)" menu were read.
- **UAE**: Oqood's legal basis ("Law No. 13 of 2008" appeared only in a Brave AI summary), escrow release percentages, and the meaning of the 5% retention. Only DLD FAQ question titles were read, not the answers. Off-plan payment-plan norms (60/40, post-handover plans) were not found on any vendor page. Abu Dhabi (ADREC/DARI) was not researched.
- **Property Finder Expert full feature set**: propertyfinder.ae returned 500. Only the App Store text and partner-hub marketing were read. Bayut quotas and pricing, and dubizzle Pro, were not sourced.
- **Lasso CRM and BuildTopia**: ECI pages are behind Cloudflare. Features come from SoftwareOne, SoftwareFinder and a Brave summary; prices are unknown. "Model home kiosks" capture for Lasso is from a Brave summary of lassocrm.com.
- **NewHomeSource and Livabl pages**: blocked by press-and-hold bot checks. Claims come from Zonda's own listings pages.
- **Salesforce for real estate**: three Salesforce URLs returned 404. Its description comes only from Sell.Do's comparison page ("USD 25–330/user/mo", Sell.Do's own note says to verify).
- **Kylas real-estate page (404), LeadSquared developer specifics** beyond its generic real-estate CRM page, **NoBroker builder (404), Housing.com builder, 99acres builder packages (404), PropertyGuru AgentNet (login wall), REA/Domain developer products (404)**.
- **UK**: Material Information rules for listings (the NTSELAT and GOV.UK pages 404'd), HMRC estate-agency AML guidance (404), Rightmove/Zoopla/OnTheMarket developer feed specs (pages 404'd or blocked). Alto (Zoopla) was blocked by bot verification.
- **Australia**: AML/CTF "tranche 2" start date for agents; Reapit's AML page 404'd.
- **Unit transfer/assignment/nomination workflows** (Section 8): no vendor page described a full flow.
- **Vendor metrics** are vendor claims, not verified. Examples: Sell.Do 0.4% payment failures, 4% realisation lift, drop-off from 22% to 6%; Farvision 98.4% on-time demands; Envision +35% options; Avid −35% workload; UTour 3–6 months faster.
- **Market-share claims conflict**: Reapit ANZ says "66% of agencies" while its Agentbox page says "60% market share", and MRI Vault claims more than 1 in 4. These are vendor statements and cannot all be read as share of the same market.
- **App ratings** were checked with the iTunes API (AE store, Oct 2026):
  - PF Expert 4.9 (282)
  - Profolio 4.9 (3,589)
  - PropSpace 4.0 (18)
  - Goyzer CRM 4.3 (6)
  - Sell.Do 4.5 (2) in AE, 3.5 (18) in IN
  - MRI Vault and Rex Pocket show no AE ratings

  These are store aggregates, not review analysis.

## Sources read (summary)
About 120 pages were read, plus 9 searches and 12 iTunes API lookups. The working copies are in the session scratchpad (`dev06/`).
- **Sell.Do**: 27 pages (home, IRIS + 8 sub-pages, Broker App, 9 CRM modules, 8 post-sales sub-pages, pricing, vs Salesforce, developers).
- **Farvision**: 11 pages (home, SFA, Customer Care, Support, Broker Portal, Customer Portal, Customer App, Sales Hub, QC, BD, journey).
- **UAE**: PropSpace (5), Goyzer (3), Bayut (5), Property Finder (2), DLD (2), Dubai Law 8/2007.
- **US builder stack**: Zonda (10), Higharc (5), Hyphen (6), Avid, Zutec, BuildTopia (SoftwareFinder), Lasso (SoftwareOne).
- **Agency CRMs**: Reapit UK (6), Reapit AU (2), Agentbox, Rex (3), MRI Vault, MRI Box+Dice.
- **India**: LeadSquared (2), Square Yards (2), Anarock, MagicBricks, MahaRERA, Wikipedia RERA.
- **UK and AU regulators and guides**: Consumer Code, Denbury NHQC, CAV Victoria, NSW Registrar General, Elringtons.
- **US regulator**: CFPB Reg J.
