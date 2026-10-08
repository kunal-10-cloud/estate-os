# Estate OS feature research: seller and listing side

Researched 2026-10-08. Covers the work from the first seller conversation to an accepted offer, then the homeowner relationship after closing: seller portal, valuation and CMA, listing presentation, listing prep, marketing, syndication and visibility rules, showings, feedback, open houses, offers, negotiation and homeowner nurture.

**How this was built.** About 170 vendor help-center, product, regulator and MLS rule pages were read in a headless browser. Brave search was rate-limited partway through, so later discovery used DuckDuckGo. Zillow.com, SkySlope.com, the narrpr.com blog and homes.com sit behind bot checks and were not bypassed, so claims about them come from Zillow's grow.zillow.com and zillow.help, ShowingTime pages, MLS help centers or trade press. Every row cites the page it came from. Rows whose only evidence is a vendor blog or a secondary source are listed again under "Not verified".

**Priority key.** Must = needed at launch to be "not weaker than the leader" for a US listing agent. Should = needed to win against Rechat, Lofty or HomeLight Listing Management (HLM) within the first year. Later = a differentiator or a regional variant.

**The one-record idea.** The leaders each own one slice. Cloud CMA, RPR and MoxiPresent own pricing. Rechat, Luxury Presence and Canva own marketing. ShowingTime, Aligned and BrokerBay own showings. HLM, ShowingTime Offer Manager and SkySlope Offers own offers. Homebot, Fello and Lofty own nurture. No verified vendor keeps one **Listing** record in which the valuation, prep, media, distribution rules, showings, feedback, offers and seller portal all share the same data. That shared record is the Estate OS wedge. HLM (2026) comes closest: it combines disclosures, buyer engagement scoring, offers, net proceeds and messaging, but it has no showings, CMA or syndication control.

---

## 1. Seller portal and seller-side app

**Data:** listing status, days on market (DOM), showings (upcoming and past), feedback, marketing activity, portal and website views, offers, documents, milestones, agent posts. **Actions (seller):** confirm, decline or reschedule a showing; set notification preferences; review offers; message the agent; download documents. **Notifications:** showing requested, confirmed or cancelled, "showing complete", new published feedback, new offer, price or status change, milestone due. **Agent view:** per-event and per-document visibility toggles, publish or hold controls, a log of what the seller has seen. **Seller view:** branded dashboard, activity feed, plain-language explanations. **Compliance:** owner and occupant contact details must never reach requesting agents. Buyer-agent identity is hidden on seller reports by default. Shared documents must respect the seller's disclosure obligations.

| Feature | What it does | Benchmark + source URL | Priority |
|---|---|---|---|
| Branded seller dashboard | One link or login per seller with agent and brokerage logo, colours and profile. Shows DOM, views, open houses, attendees, showings and social posts, updated automatically | Reach seller portal: https://reachforagents.com/features/seller-portal/ ; ListingPulse: https://www.listingpulse.com/ | Must |
| Chronological activity feed | Every booking, reschedule, cancellation, feedback note, marketing send and document view lands on one timeline, newest first | Reach: https://reachforagents.com/features/seller-portal/ ; HLM activity timeline ("Kim Buyer downloaded TDS"): https://www.homelight.com/hlm | Must |
| Per-item visibility toggles | Agent chooses which events and documents the seller can see, so internal notes never leak | Reach: https://reachforagents.com/features/seller-portal/ ; Alto PropertyFile section toggles: https://support.altosoftware.co.uk/hc/en-gb/articles/5048084700703-PropertyFile-Vendor-Portal | Must |
| Seller confirms or declines showings from SMS, email or app | Seller-occupied listings route approval to the seller. One-tap accept, deny, cancel or suggest a new time; calendar sync | BrokerBay seller dashboard: https://www.brokerbay.com/mls/seller-features ; Home by ShowingTime: https://help.home.showingtime.com/knowledgebase/articles/556071-quickstart-guide | Must |
| Household roles | Add seller, spouse, adult children, tenant or assistant, each with "can confirm" or "notify only" and their own notification channel | ShowingTime Listing Setup tab: https://showingtime.uservoice.com/knowledgebase/articles/2005555-listing-setup-tab | Must |
| "Showing complete" alert | Tells the seller when the showing agent has left so they can return home | ShowingTime App Store listing: https://apps.apple.com/us/app/showingtime/id686156346 | Must |
| Private seller to agent messaging on an appointment | Seller messages the agent about a specific past or upcoming showing; the thread stays on the listing | ShowingTime App Store: https://apps.apple.com/us/app/showingtime/id686156346 | Should |
| Seller offer room (read-only) | Seller sees submitted offers and the side-by-side comparison but cannot message buyer agents or invite others | disclosures.io/HLM roles: https://academy.disclosures.io/share-roles | Must |
| Milestones and closing countdown | Key deadlines (inspection, contingencies, escrow) and a closing-day countdown from pre-list to close | ListingPulse: https://www.listingpulse.com/ ; Alto Sales Progression covering both sides of the chain: https://support.altosoftware.co.uk/hc/en-gb/articles/5048084700703-PropertyFile-Vendor-Portal | Should |
| Agent posts and commentary | Agent posts updates, market commentary or links to the listing's social posts into the portal | Reach: https://reachforagents.com/features/seller-portal/ | Should |
| Data-backed recommendations to the seller | Suggestions on price, staging and marketing based on listing performance | ListingPulse: https://www.listingpulse.com/ | Should |
| Vendor-services directory | Agent's trusted inspectors, lenders, painters and plumbers shown inside the seller portal | Reach: https://reachforagents.com/features/seller-portal/ ; Rechat Service Network: https://help.rechat.com/whats-new/seller-report | Later |
| UK-style vendor portal tabs | Marketing (portal statistics and number of details sent), Viewings (with feedback), Offers (with status), Sales Progression | Alto PropertyFile: https://support.altosoftware.co.uk/hc/en-gb/articles/5048084700703-PropertyFile-Vendor-Portal | Should (UK) |
| Post-close "marketing results" keepsake | Final record of the marketing and results, shareable by the seller | ListingPulse: https://www.listingpulse.com/ | Later |

## 2. Valuation, CMA and pricing

**Data:** subject facts (beds, baths, square footage, lot, photo), MLS comps (sold, pending, active, expired), adjustments, an AVM with its range, price per square foot, DOM, absorption rate, price reductions, showing activity on competing listings. **Actions:** fetch comps by radius or polygon; include or exclude comps; adjust; set a suggested price or range; add an estimated net sheet; publish to PDF, a live link or a flipbook. **Notifications:** CMA opened or viewed; a seller requests a CMA (an intent signal). **Agent view:** comp grid and adjustment editor. **Seller view:** a story-led report with pricing guidance. **Compliance:** a CMA is not an appraisal, so the disclaimer must say so. MLS data licence terms limit redistribution. The seller can ask the MLS to turn off AVMs next to the listing on IDX sites (see §5).

| Feature | What it does | Benchmark + source URL | Priority |
|---|---|---|---|
| CMA builder from MLS comps | Enter the subject (sq ft, beds, baths, photo), fetch listings, reorder or exclude comps, add off-MLS comps, edit remarks | Cloud CMA workflow: https://supporthub.realtracs.com/cma-using-the-cloud-cma-tool | Must |
| Comp search by filters, radius or drawn polygon, with a cap | Lofty caps a CMA at 30 comps | Lofty Present: https://help.lofty.com/hc/en-us/articles/26265328610075-How-to-Create-a-CMA-and-Listing-Presentation | Must |
| Line-item adjustments per comp | Dollar adjustments for differences between comp and subject | Cloud CMA "add adjustments if needed": https://supporthub.realtracs.com/cma-using-the-cloud-cma-tool | Must |
| Suggested list price and range page | Dedicated pages for comps, average DOM, price per sq ft, online-valuation context and suggested list price | Cloud CMA: https://www.lwolf.com/engage/cma | Must |
| Valuation-model starting point with refinement | Proprietary model (RPR's Realtor Valuation Model, RVM) plus a value-refinement tool the agent tunes for upgrades and condition | RPR via MLSListings: https://support.mlslistings.com/s/article/RPR-Realtors-Property-Resource | Must |
| AI-generated CMA on mobile | AI picks comps and drafts the pricing narrative in the app | RPR AI CMA (Nov 2025): https://www.nar.realtor/realtors-property-resource-rpr | Should |
| Live data refresh | Presentation re-pulls MLS data; Moxi sweeps the MLS every 15 minutes | MoxiPresent: https://support.moxiworks.com/hc/en-us/articles/205183385-Introducing-Moxi-Present | Should |
| Edit live during the meeting | Change suggested price, net sheet and notes while presenting | Cloud CMA LiveCMA (search snippet; page needs login): https://community.lwolf.com/s/article/CCMA-Edit-Your-Report-in-LiveCMA | Should |
| Estimated costs and net sheet inside the CMA | Editable estimated costs of selling, with custom fields | Lofty Present: https://help.lofty.com/hc/en-us/articles/26265328610075-How-to-Create-a-CMA-and-Listing-Presentation ; RPR Seller's Net Sheet: https://support.mlslistings.com/s/article/RPR-Realtors-Property-Resource | Must |
| Branded title-company net sheet | Net-to-seller with the title company's real fee schedule (recording, transfer, payoff, tax proration, HOA). Compares multiple offers side by side; co-branded with the agent | TitleTap: https://www.titletap.com/netsheet-calculator-mobile-app/ ; TitleCapture: https://titlecapture.com/ ; TitleSmart: https://title-smart.com/resources/calculators/sellers-net-sheet-calculator/ | Must |
| Net sheet with concessions line | Seller credit or concession and buyer-broker compensation lines, now that the MLS no longer carries compensation fields (removed about Aug 8 2024) | OneKey comp-field removal: https://support.onekeymls.com/hc/en-us/articles/28842130579988-NAR-Settlement-Compensation-Fields-to-be-Removed-from-the-MLS ; HLM sample offer "Seller to credit buyer 1%": https://www.homelight.com/hlm | Must |
| Competitive pricing benchmark during the listing | Compares the listing's price, showing activity, DOM and reductions with active competitors under adjustable "similar" filters; needs at least 3 actives | ShowingTime Pricing Benchmark Report: https://showingtimemls.uservoice.com/knowledgebase/articles/1945264-pricing-benchmark-report | Should |
| Portal performance vs similar listings | Average daily views vs the previous period and vs similar listings (±1 bed, ±10% price); a listing-health score flags a missing floor plan or few photos | Rightmove Property Performance Report: https://customerfaq.rightmove.co.uk/support/solutions/articles/7000098732-property-performance-report | Should |
| Listing performance vs nearby homes | Agent dashboard compares the listing's activity with nearby homes on the market | Homes.com Pro: https://www.miamirealtors.com/services/products-and-services/homesnappro/ ; Zillow Showcase Performance tab: https://grow.zillow.com/agents/updated-showcase-experience-has-arrived | Should |
| Online valuation request with agent reply | Homeowner submits details and photos online; agent replies with a range on a branded page that pulls in recently sold homes. AI drafting; instant SMS alert to the agent; 83% click-through in trials | Rightmove Online Agent Valuation: https://www.rightmove.co.uk/press-centre/rightmove-launches-online-agent-valuation-to-help-agents-connect-with-more-vendors/ | Should |
| Home-valuation lead page | Website page captures address and contact details and emails an automated value report. Lofty's value comes from Zillow's Bridge API and cannot be edited; for addresses with no AVM (Canada), the lead goes to the agent | Lofty: https://help.lofty.com/hc/en-us/articles/360038509091-Home-Valuation-Page | Must |
| Shareable market-trend charts and area reports | One-click hyperlocal charts; monthly area reports from Local Logic that show "N/A" when data is thin | RPR: https://support.mlslistings.com/s/article/RPR-Realtors-Property-Resource ; Rechat Market Reports: https://help.rechat.com/guides/marketing/marketing-center/market-reports | Should |
| AVM confidence and "not enough data" honesty | Hide or flag metrics that miss confidence thresholds instead of guessing | Rechat/Local Logic N/A rule: https://help.rechat.com/guides/marketing/marketing-center/market-reports | Must |

## 3. Listing presentation

**Data:** CMA, agent and brokerage story, marketing plan, testimonials, net sheet, timeline, fee disclosure. **Actions:** choose a template, reorder pages, present on screen or over Zoom, share as PDF, live link or flipbook. **Notifications:** presentation opened or re-opened by the seller. **Agent and broker view:** brokerage-locked templates, a usage log. **Seller view:** interactive deck. **Compliance:** fee and compensation are negotiable and must not appear as fixed; brokerage disclosures (affiliated-business disclosures, agency) go in a required page.

| Feature | What it does | Benchmark + source URL | Priority |
|---|---|---|---|
| Template library (seller, buyer, agent) | Lofty ships 4 seller, 1 buyer and 1 agent template, and agents can create more. Pages can be added, removed or rearranged | Lofty Present: https://help.lofty.com/hc/en-us/articles/26265328610075-How-to-Create-a-CMA-and-Listing-Presentation | Must |
| Brokerage-controlled brand kit and templates | Broker sets approved logos, colours, layouts and templates, manages access by office or team, and pushes updates in real time | Cloud CMA Admin Tools: https://www.lwolf.com/engage/cma ; MoxiPresent "templates pre-set for the brokerage": https://moxiworks.com/solutions/real-estate-cma/ | Must |
| Three delivery modes | Print view, digital view and an animated flipbook link, with no third-party flipbook vendor | Rechat Flipbook: https://rechat.ai/listing-presentation/ | Must |
| Present live over video | Live view for Zoom with a "telestrator" marker that draws on the screen | Cloud CMA Live: https://cloudcma.com/real-estate-agents | Should |
| Edit on the fly mid-meeting | Change comps or pricing while presenting | MoxiPresent: https://support.moxiworks.com/hc/en-us/articles/205183385-Introducing-Moxi-Present | Should |
| Presentation linked to the contact record | Each deck attached to a client and an agent; shows estimated price and last-updated date; CRM tracks presentation activity | Lofty AOS: https://help.lofty.com/hc/en-us/articles/53175401367067-Creating-a-CMA-or-Listing-Presentation-Lofty-AOS ; Moxi: https://moxiworks.com/solutions/real-estate-cma/ | Must |
| Client comments on presentations | Buyers and sellers leave comments and feedback inside the deck | MoxiPresent: https://moxiworks.com/solutions/real-estate-cma/ | Should |
| Password-protected reports | Report links can require a password | Cloud CMA account settings: https://supporthub.realtracs.com/cma-using-the-cloud-cma-tool | Should |
| Value-add offer slides | Slides for partner programmes such as pay-at-close renovation and cash offers | Curbio Agent Marketing Toolkit: https://curbio.com/agents/ ; Opendoor "walk into every client meeting with a cash offer": https://www.opendoor.com/agents | Should |
| Buyer-consultation presentation (for buyer agreements) | Pre-built templates that frame buyer expectations and agent value | Cloud CMA Buyer Presentations: https://www.lwolf.com/engage/cma | Later (buyer module) |
| Annual property review deck | Yearly "property review" for past clients; Moxi claims more sold listings when agents send them | MoxiPresent: https://moxiworks.com/solutions/real-estate-cma/ | Should |

## 4. Listing prep: renovation, staging, media, disclosures

**Data:** prep checklist, vendor bids, repair estimate, inspection report, media order, disclosure package, signatures. **Actions:** order photos, 3D tour, floor plan or staging; approve vendor work; fill and send disclosures; track buyer-side downloads. **Notifications:** media delivered, vendor milestone, disclosure viewed or downloaded. **Seller view:** prep plan, cost-to-close-out, signing tasks. **Compliance:** state seller disclosure forms; pre-1978 lead paint disclosure (federal; not re-verified here); affiliated-business disclosures for bundled financing or escrow; virtual staging rules (§5).

| Feature | What it does | Benchmark + source URL | Priority |
|---|---|---|---|
| Pre-sale improvements paid at closing | Staging, flooring, painting and 100+ services fronted with nothing due until sale, termination or 12 months. Loans made by a licensed lender; affiliated-business disclosure required | Compass Concierge: https://www.compass.com/concierge/ | Later (partner) |
| Managed pre-list renovation marketplace | Fixed-price contracts; project manager; instant estimate in an app at the kitchen table; inspection report turned into repair pricing in 24h; real-time project updates | Curbio: https://curbio.com/ | Should (integration) |
| Prep phases tied to staged launch | Private exclusive while work is under way, then coming soon, then MLS (see §6 rules) | Compass Concierge flow: https://www.compass.com/concierge/ | Should |
| Media ordering with photographer marketplace | Order from preferred or approved local photographers; one login across media, transaction and showing tools | Zillow Showcase update: https://grow.zillow.com/agents/updated-showcase-experience-has-arrived | Should |
| Media delivery hub | Full-resolution plus automatic MLS-sized copies; video; 3D (Matterport, iGuide, Zillow 3D Home) as branded or unbranded; floor plans synced from CubiCasa; scheduled delivery email | Aryeo on zillow.help: https://www.zillow.help/article/uploading-and-delivering-media ; https://www.aryeo.com/ | Must |
| Interactive floor plan linked to photos | Rooms on the floor plan link to their photos. Zillow reports 79% more saves for listings with one | ShowingTime+ Showcase launch: https://showingtime.com/resources/blog/new-immersive-listing-experience | Should |
| 3D digital twin with tags and measurement | Dollhouse view, walkthrough, tags (appliances, amenities), measure tool, privacy blur, floor plans as PNG, PDF or SVG in 2 business days | Matterport: https://matterport.com/digital-twin-features ; https://matterport.com/learn/digital-twin/real-estate | Should (integration) |
| Human photo editing and virtual staging service | 24h edits and 48h virtual staging, item removal, day-to-dusk, floor-plan redraw, renders; pay as you go with free reworks | BoxBrownie: https://www.boxbrownie.com/ | Should (integration) |
| AI virtual staging with an original-plus-staged pair | Export the staged image together with the original so either can be published, as some MLSs and California require (see §5) | StageMLS (vendor): https://stagemls.com/mls-virtual-staging-rules ; Aryeo AI staging: https://www.aryeo.com/ | Should |
| Disclosure package with tracked access | Fill seller forms, e-sign (DocuSign), share one secure link. Tracks each view, download and return visit by each buyer party | HLM: https://www.homelight.com/hlm | Must |
| AI disclosure summary cited to the page | Summarises the disclosure package and cites the page for each point, so the agent can answer buyer questions | HLM: https://www.homelight.com/hlm | Should |
| Buyer engagement scoring | Ranks buyer parties by how closely they are reading (for example 37 of 37 documents, 9 visits) to predict who will write an offer | HLM: https://www.homelight.com/hlm | Should |
| Documents auto-sent with showing requests | Attach disclosures or HOA documents (PDF, JPG, GIF, PNG, 20 MB max) that email automatically to agents who request a showing | ShowingTime Listing Setup: https://showingtime.uservoice.com/knowledgebase/articles/2005555-listing-setup-tab | Must |
| On-demand helpers for prep tasks | Licensed agents for phone photography and condition reports, lockbox and sign placement | Showami: https://www.showami.com/ | Later |

## 5. Listing input, MLS compliance and visibility rules

**Data:** listing status, exempt-listing type, seller certifications, opt-out forms, photo metadata (altered or not), public marketing events, distribution flags per channel. **Actions:** choose a marketing option; record seller consent; enforce the 1-business-day clock; flag or block non-compliant media or copy. **Notifications:** CCP clock warnings, missing-photo deadline, Zillow LAS strike risk, opt-out form missing. **Agent and broker view:** compliance panel and audit trail. **Seller view:** a plain-language explainer for each choice with e-sign. **Compliance:** this sub-area is the compliance layer.

| Feature | What it does | Benchmark + source URL | Priority |
|---|---|---|---|
| Marketing-option chooser with seller certification | Full MLS, office exclusive (filed but not disseminated) or delayed marketing (IDX and syndication held for the MLS-set period). Each exempt option needs a seller-signed disclosure acknowledging the benefits waived | NAR Multiple Listing Options for Sellers: https://www.nar.realtor/about-nar/policies/multiple-listing-options-for-sellers | Must |
| Clear Cooperation 1-business-day clock | Any public marketing (window flyer, yard sign, public site, IDX/VOW, email blast, multi-brokerage network, public app) starts a 1-business-day deadline to submit to the MLS. Opting out is not allowed | NAR CCP: https://www.nar.realtor/about-nar/policies/mls-clear-cooperation-policy ; Northstar FAQ: https://resources.northstarmls.com/hc/en-us/articles/54550198335771-Clear-Cooperation-Policy | Must |
| "Public marketing" event log | Every flyer, post, sign order, email blast or website publish for the property is logged with a timestamp and checked against the clock. One-to-one broker messages are exempt; multi-brokerage messages count as public | NAR MLOS (1:1 vs multi-brokerage): https://www.nar.realtor/about-nar/policies/multiple-listing-options-for-sellers | Must |
| Zillow Listing Access Standards guardrail | Zillow's 2026 standard requires listings to be "broadly accessible"; registration-walled or gated pre-marketing is not shown on Zillow. The original 2025 version required MLS entry within 1 business day; later reports describe warnings and blocks | RealEstateNews Mar 2026: https://www.realestatenews.com/2026/03/19/zillows-simplified-listing-standards-make-the-mls-optional ; strike detail (secondary): https://www.open-homes.com/blog/zillows-listing-access-standards-what-every-agent-should-learn-from-the-48-banned-listings/ | Must |
| Safe-teaser checker | Blocks a "coming soon" social post that contains address, price or a call to action before the listing is live | Open-homes summary of Zillow guidance (secondary): https://www.open-homes.com/blog/zillows-listing-access-standards-what-every-agent-should-learn-from-the-48-banned-listings/ | Should |
| Delayed-marketing DOM and price-history handling | Store the MLS-specific DOM and price-history rules that apply during a delay | NAR MLOS FAQ items 9–11: https://www.nar.realtor/about-nar/policies/multiple-listing-options-for-sellers | Must |
| Seller internet opt-outs | Seller can withhold the listing or just the address from internet display; signed opt-out form uploaded to the MLS and kept at least 1 year | OneKey: https://support.onekeymls.com/hc/en-us/articles/43309998351124-Seller-Opt-Out-Provisions | Must |
| AVM and comments switch-off on IDX | At the seller's request, AVMs and third-party comments next to the listing must be disabled on all participants' IDX sites | CVR MLS 11.2.8 (NAR model rule): https://resourcecenter.cvrmls.com/article-11-internet-data-exchange-idx/section-11-2-8-comments-and-automated-valuation-models-avm/ | Must |
| Photo rule linter | Primary photo must be the front exterior and unaltered; deadlines (48h or 2 business days, with escalating fines); no branding, watermarks, agent photos, QR codes, people or signs | MLS Now: https://support.mlsnow.com/hc/en-us/articles/24915189546907-Listing-Photo-Rules-and-Requirements ; NorthstarMLS: https://resources.northstarmls.com/hc/en-us/articles/54550054122267-MLS-Photo-Rules | Must |
| Digital-alteration disclosure engine | Per-MLS rules: Stellar remarks text plus a ban on overlays; CRMLS original placed next to the altered photo; ARMLS "Digitally Altered" stamp ($200 fines from Dec 2026). California AB 723 (since Jan 1 2026) requires a disclosure plus a link or QR code to the original at a public URL. Structural changes and hidden defects are banned | StageMLS rule table (vendor, Aug 2026): https://stagemls.com/mls-virtual-staging-rules ; MLS Now Rule 3.3: https://support.mlsnow.com/hc/en-us/articles/24915189546907-Listing-Photo-Rules-and-Requirements | Must |
| No compensation in MLS fields | Strip compensation from MLS-bound data and history; keep it on the deal record and the seller's net sheet only | OneKey: https://support.onekeymls.com/hc/en-us/articles/28842130579988-NAR-Settlement-Compensation-Fields-to-be-Removed-from-the-MLS | Must |
| Fair-housing copy and image check | Flags wording, photos or symbols that signal a preference by race, colour, religion, sex, handicap, familial status or national origin, across ads, flyers, signs and remarks | 24 CFR 100.75: https://www.law.cornell.edu/cfr/text/24/100.75 ; checker tools exist, for example https://www.quicklistingai.com/tools/listing-compliance-checker | Must |
| Truthful-advertising review of AI copy | All MLS-populated marketing is reviewed before publishing (Rechat's explicit warning); NAR Code of Ethics Article 12 "true picture" | Rechat: https://help.rechat.com/guides/marketing/listing-marketing ; https://www.roomstage.ai/guides/mls-compliance | Must |
| Listing data reuse permissions | Posting another agent's listing requires their permission; brokerage policy governs boosting others' listings | Lofty video note: https://help.lofty.com/hc/en-us/articles/23376210406555-Auto-Generated-Listing-Videos ; PropertyBoost FAQ: https://help.insiderealestate.com/en/articles/15024296-marketplace-propertyboost-faq | Must |
| Co-lister and team access mapping | Rechat cannot give listing dashboards to team or co-listers unless the MLS assigns them. Estate OS should map them explicitly | Rechat availability notes: https://help.rechat.com/guides/marketing/listing-marketing | Should |
| UK material information fields | Part A (council tax, price, tenure), Part B (type, construction, rooms, utilities, parking), Part C (flood risk, covenants, if applicable); empty fields flagged on portals | National Trading Standards: https://www.nationaltradingstandards.uk/news/full-material-information-guidance-published/ | Later (UK) |
| Victoria Property Price Statement | From 1 Oct 2026: price statement linked next to the advertised price, QR on print, reserve disclosed 7 days before auction, final price published once unconditional | Consumer Affairs Victoria: https://www.consumer.vic.gov.au/licensing-and-registration/estate-agents/running-your-business/underquoting-information-for-real-estate-agents | Later (AU) |
| Dubai ad permit and QR on every ad | Trakheesi e-permit per listing ad; QR code system for ads | DLD: https://dubailand.gov.ae/en/eservices/real-estate-ad-permit/ | Later (UAE) |

## 6. Syndication, distribution and staged launch

**Data:** channel matrix (MLS, IDX, syndication, portals, brokerage site, network), per-channel status and timer, engagement per channel. **Actions:** schedule a phase change; opt a channel in or out; push to portals; pause. **Notifications:** phase changed; portal rejected; data mismatch. **Seller view:** "where is my home visible right now" map plus the consents signed. **Compliance:** §5 rules gate every transition.

| Feature | What it does | Benchmark + source URL | Priority |
|---|---|---|---|
| Distribution matrix per listing | One screen shows where the listing is visible (MLS-only, IDX, syndication, brokerage site, network) and why; the seller sees a read-only version | Rechat "MLS Listing Data Visibility Matrix" doc title: https://help.rechat.com/guides/marketing/listing-marketing ; market gap noted in 01-market-research | Must |
| Staged launch: private, then coming soon, then MLS | Private exclusive to an agent network; public coming soon on owned portals with no DOM or price-drop history; then MLS. Seller can opt out of a syndication partner | Compass Private Exclusives: https://www.compass.com/private-exclusives/ ; Coming Soon: https://www.compass.com/coming-soon/ | Should (rules-gated) |
| Pre-market engagement insights | Views, comments and shares from network agents while private or coming soon, fed back into pricing | Compass: https://www.compass.com/private-exclusives/ | Should |
| Portal pre-market slot | Zillow Preview shows pre-market listings on Zillow and brokerage sites when MLS rules are met | RealEstateNews: https://www.realestatenews.com/2026/03/19/zillows-simplified-listing-standards-make-the-mls-optional | Later |
| Premium portal listing format | Zillow Showcase: AI hero image, room-by-room organisation, interactive floor plan, exclusive agent branding, sold by subscription in limited seats | ShowingTime+: https://showingtime.com/resources/blog/new-immersive-listing-experience ; https://grow.zillow.com/agents/showcase-getting-started-guide | Later (integration) |
| Multi-portal push from one screen | Push to Rightmove, Zoopla, OnTheMarket and Homeflow with no double entry, kept in sync | Street.co.uk: https://street.co.uk/product/sales | Later (UK/intl) |
| Agent-to-agent e-blast by radius | Find agents in the listing's market area and send a trackable listing e-blast | Rechat Agent Network: https://help.rechat.com/guides/marketing/listing-marketing | Should |
| Real-time showing availability on consumer sites | Open showing slots published to websites so buyers request only available times | ShowingTime Listing Setup: https://showingtime.uservoice.com/knowledgebase/articles/2005555-listing-setup-tab | Should |
| Status-change marketing triggers | MLS status changes trigger a "Listing Marketing Package" email with the right templates; Social Studio auto-posts by status | Rechat: https://help.rechat.com/guides/marketing/listing-marketing ; Lofty Social Studio: https://help.lofty.com/hc/en-us/articles/4416954832795-Social-Studio | Must |

## 7. Listing marketing: property sites, social, print, video, ads, email

**Data:** templates, brand kit, MLS data, photos, campaign results (opens, clicks, impressions, leads), spend. **Actions:** generate, edit, schedule and publish; buy ad boosts; send e-blasts. **Notifications:** leads, campaign results, report sent to seller. **Seller view:** seller report (what was done, with results). **Compliance:** Meta's housing Special Ad Category; fair-housing copy (§5); CCP clock on every public asset; brokerage name and licence disclosures on ads.

| Feature | What it does | Benchmark + source URL | Priority |
|---|---|---|---|
| Listing marketing dashboard by lifecycle need | Templates grouped by need: Coming Soon, Just Listed, Open House, New Price, Under Contract, Just Sold, As Seen In, auto-filled from MLS | Rechat: https://help.rechat.com/guides/marketing/listing-marketing/promoting-listings | Must |
| One-click single-property website | Standalone site with a free subdomain (123-main-st.…) or custom domain via nameservers or DNS; unlimited; SEO; works as an ad landing page; CRM sync; can be duplicated | Luxury Presence: https://help.luxurypresence.com/s/article/How-to-Create-a-One-Click-Property-Website ; https://training.luxurypresence.com/blog/understanding-the-presencetm-platform-one-click-property-websites-101 | Must |
| Multiple sites per listing | Several sites for one listing, for example per language or campaign | Rechat: https://help.rechat.com/guides/marketing/listing-marketing | Later |
| Brand templates auto-filled from MLS | Canva Listings fills brand templates with live MLS data, photos and agent info for web and print; integrates MLS, CRM, DAM and print vendors | Canva for real estate: https://www.canva.com/solutions/real-estate/ | Must |
| Canva round-trip | Design in Canva and export straight into the platform | Rechat what's new: https://help.rechat.com/whats-new/seller-report | Should |
| Print collateral and window cards | Flyers, postcards, brochures, window cards, branded with no vendor logo | Rechat: https://help.rechat.com/guides/marketing/listing-marketing ; Street.co.uk brochures: https://street.co.uk/product/sales | Must |
| Interactive QR codes | QR on print and signs that links to the site, sign-in or price statement and tracks scans | Rechat interactive QR: https://help.rechat.com/whats-new/seller-report ; LP sharing via QR: https://training.luxurypresence.com/blog/understanding-the-presencetm-platform-one-click-property-websites-101 | Must |
| Social posting with per-channel adaptation | Connect FB, IG, LinkedIn and Google. AI adapts length, tone and hashtags per channel; auto-post on status; Instagram Stories | Lofty Social Studio: https://help.lofty.com/hc/en-us/articles/4416954832795-Social-Studio ; Rechat IG Story: https://help.rechat.com/whats-new/seller-report | Must |
| AI listing video from MLS photos | Fully automated short video; runs in the background; notifies when done; credit refunded on failure; listing must meet quality rules | Lofty AI Listing Videos: https://help.lofty.com/hc/en-us/articles/53135211487387-Generate-AI-Listing-Videos-with-Social-Agent | Should |
| Daily quick-video allowance | Up to 10 auto listing videos a day; watermark removed on the paid tier | Lofty: https://help.lofty.com/hc/en-us/articles/23376210406555-Auto-Generated-Listing-Videos | Later |
| Listing ad boost (image and motion) | FB/IG lead-gen ad within 15 miles; New Listing or Open House templates; 3/7/21/28-day runs; leads to CRM; compliance text field; no refund if the listing goes off market | BoldTrail PropertyBoost: https://help.insiderealestate.com/en/articles/3574352-marketplace-propertyboost-overview ; Motion: https://help.insiderealestate.com/en/articles/11634425-marketplace-propertyboost-motion-overview | Should |
| Lifecycle ad | One 4-week ad that updates with MLS status (Just Listed, Open House, Sold) | PropertyBoost FAQ: https://help.insiderealestate.com/en/articles/15024296-marketplace-propertyboost-faq | Later |
| Automatic ad report to agent and seller | Traffic report emailed to both the agent and the seller | PropertyBoost: https://help.insiderealestate.com/en/articles/3574352-marketplace-propertyboost-overview | Should |
| MLS-triggered ad automation and self-serve builder | Google, Meta and display ads triggered by MLS events; location audiences; real-time reporting; native Meta lead forms | MoxiWorks: https://moxiworks.com/ ; Rechat Digital Ads: https://help.rechat.com/whats-new/digital-ads | Should |
| Housing Special Ad Category enforcement | Every US housing ad declares the Meta housing category, which restricts targeting (no age, gender or zip; 15-mile minimum radius per secondary source); rejected otherwise | Meta: https://www.facebook.com/business/help/1198401317374558/ ; details (secondary): https://walledgardenhq.com/blog/special-ad-category-real-estate | Must |
| Ad-media fairness under HUD | Choosing media or locations that deny some groups information is itself discriminatory, so audience tools must not allow proxy exclusions | 24 CFR 100.75(c)(3): https://www.law.cornell.edu/cfr/text/24/100.75 | Must |
| Email e-blasts with engagement | Trackable listing emails to sphere or agents; engagement on the contact history | Rechat: https://help.rechat.com/guides/marketing/listing-marketing ; https://help.rechat.com/whats-new/seller-report | Must |
| Seller marketing report | Emails (opens, clicks), social posts, ads and print on a timeline, shared as PDF or flipbook | Rechat Seller Report: https://help.rechat.com/guides/marketing/listing-marketing/seller-report | Must |
| Vendor activity report (AU/UK pattern) | Branded report auto-filled with photos, inspection feedback and campaign statistics; period selector; clone the previous report; colours set per brokerage | Reapit AU: https://help.reapit.com.au/s/article/Vendor-Landlord-Activity-Report ; https://www.reapit.com.au/software/sales-crm/vendor-management | Should |
| AI listing copy with compliance pass | Description, social and email copy written from MLS facts, then run through the §5 fair-housing and truthfulness checks | RPR AI writer: https://support.mlslistings.com/s/article/RPR-Realtors-Property-Resource ; Rechat Lucy: https://rechat.com/ | Must |
| Listing studio inside the disclosure and offer tool | Website, flyers and scheduled social posts generated from the listing record's photos and data | HLM Listing Studio ("coming soon"): https://www.homelight.com/hlm | Should |
| Done-for-you marketing with approval gate | Vendor runs marketing; "you approve what goes live" | Luxury Presence: https://www.luxurypresence.com/ | Later |

## 8. Showing management

**Data:** appointment type, availability rules, lead time, length limits, buffer, overlap policy, access type and codes, access window, occupants, appointment purposes. **Actions:** request, confirm, decline, reschedule, cancel; route tours; unlock lockbox; mark complete. **Notifications:** request, confirm, cancel, arrival, complete, price reduced or back on market (to past showers). **Agent view:** calendar plus listing activity report. **Seller view:** approve and decline, upcoming list. **Compliance:** buyer-agreement-before-tour reminder (NAR settlement); owner and occupant privacy; access codes visible only during the window; agent safety.

| Feature | What it does | Benchmark + source URL | Priority |
|---|---|---|---|
| Appointment types | Auto Confirm (Go & Show), Confirmation Required (any contact), Confirmation Required (all contacts), View Instructions Only | ShowingTime Listing Setup: https://showingtime.uservoice.com/knowledgebase/articles/2005555-listing-setup-tab | Must |
| Data-led setup coaching | Auto-confirm listings get about 30% more requested showings; first-week showings correlate with shorter DOM and a higher percentage of list price | ShowingTime: https://showingtimemls.uservoice.com/knowledgebase/articles/499193-listing-configuration-settings | Should |
| Availability rules and blackouts | Named rules by date and time, one-off or recurring, that block slots or change the confirmation path | ShowingTime: https://showingtime.uservoice.com/knowledgebase/articles/2005555-listing-setup-tab ; Aligned Showings restrictions: https://support.mlslistings.com/s/article/Aligned-Showings-Getting-Started-as-a-Listing-Agent | Must |
| Lead time, minimum and maximum length, buffer, no-overlap | Notice so the seller can prepare; buffer to re-stage; one agent in the home at a time | ShowingTime: https://showingtime.uservoice.com/knowledgebase/articles/2005555-listing-setup-tab | Must |
| Occupied or vacant flag; occupant privacy | Occupant details never shared with requesting agents; buyer-agent details shared with the seller only by choice | ShowingTime: https://showingtime.uservoice.com/knowledgebase/articles/2005555-listing-setup-tab | Must |
| Approval delegation | Team members, assistants or showing coordinators approve on the listing agent's behalf | Aligned "Office Involvement": https://support.mlslistings.com/s/article/Aligned-Showings-Getting-Started-as-a-Listing-Agent | Must |
| Listing-agent-accompanied showings | Agent must confirm before the owner, or must attend | ShowingTime: https://showingtimemls.uservoice.com/knowledgebase/articles/499193-listing-configuration-settings | Should |
| Appointment purposes beyond showings | Inspections (roof, septic, radon drop-off and pick-up, mold, pest and more), appraisal, walk-through, broker price opinion (BPO), photography, measurements | ShowingTime FAQ: https://showingtimemls.uservoice.com/knowledgebase/articles/1162078-appointments-scheduling-faq | Must |
| Status-aware restrictions | Once pending, only inspections, walk-throughs and appraisals are allowed automatically | ShowingTime: https://showingtime.uservoice.com/knowledgebase/articles/2005555-listing-setup-tab | Must |
| Virtual showings | In-person only, virtual only or mixed, with an in-app video call | ShowingTime: https://showingtime.uservoice.com/knowledgebase/articles/2005555-listing-setup-tab | Later |
| Time-boxed secure access | Lockbox, alarm and gate codes visible only in the app during a 0–60 minute window around a confirmed appointment; Bluetooth unlock works offline | ShowingTime Secure Access: https://showingtime.com/solutions/showings-and-offers/secure-access ; window values: https://showings.smartmls.com/hc/en-us/articles/13120092568859-ShowingTime-s-Secure-Access-setting | Must |
| Geofenced arrival push | "It looks like you've arrived" push that opens the access code | ShowingTime: https://showingtimemls.uservoice.com/knowledgebase/articles/1884559-access-information-for-confirmed-showings | Should |
| Lockbox ecosystem integration | Master Lock and Supra electronic lockbox access tied to confirmed appointments | ShowingTime lockbox: https://www.zillow.help/article/Add-or-move-a-Master-Lock-lockbox-to-your-ShowingTime-listing ; BrokerBay/Supra: https://www.brokerbay.com/ | Should |
| Buyer-agreement reminder before instructions | Showing agent must acknowledge the written buyer-agreement requirement before receiving instructions; no upload needed | OneKey + ShowingTime (since Sep 4 2024): https://support.onekeymls.com/hc/en-us/articles/30035793244564-Buyer-s-agent-notice-when-scheduling-a-showing-with-ShowingTime-for-the-MLS-FAQ | Must |
| Real-time chat between listing and showing agent | "Running late" messages without phone tag | Aligned Showings: https://www.alignedshowings.net/features | Must |
| Broadcast to showing agents with exclusions | Message all past and future showing agents, leaving some out | Aligned (Metro MLS): https://metromls.com/aligned-showings-updates-to-feedback-survey-broadcast-message-more/ | Should |
| Back-on-market and price-reduced alerts to past showers | Automatic email to agents who showed the home when it returns to Active or drops in price | Aligned (Metro MLS): https://metromls.com/aligned-showings-updates-to-feedback-survey-broadcast-message-more/ | Should |
| Listing-agent edit of past appointment status | Fix a no-show or a change made by text, with no notifications sent, so reports stay accurate | Aligned (Metro MLS): https://metromls.com/aligned-showings-updates-to-feedback-survey-broadcast-message-more/ | Should |
| Tour cart and smart route | Buyer agents build a multi-stop tour with optimised routing and email it to the buyer | ShowingTime ShowingCart: https://showingtimemls.uservoice.com/knowledgebase/articles/1162078-appointments-scheduling-faq ; Aligned route optimisation: https://www.alignedshowings.net/features | Should |
| 24/7 human appointment desk (optional) | Live specialists take calls and requests; included in ShowingTime Appointment Center at $15/month | ShowingTime Appointment Center: https://showingtime.com/solutions/showings-and-offers/appointment-center | Later (partner) |
| On-demand showing agents | Licensed agents pick up showings or open houses in under 3 minutes, pay per showing | Showami: https://www.showami.com/ | Later |
| Agent safety timer | Check-in timer during showings | Homesnap Pro Agent Safety Timer: https://firstmls.com/technology/homesnap-pro/ | Should |
| Offline mode for agents | Instructions available with no signal | ShowingTime app: https://apps.apple.com/us/app/showingtime/id686156346 | Should |

## 9. Showing feedback

| Feature | What it does | Benchmark + source URL | Priority |
|---|---|---|---|
| Automatic feedback request after each showing | Sent to the showing agent with configurable frequency; also sent for past appointments added within 7 days | ShowingTime FAQ: https://showingtimemls.uservoice.com/knowledgebase/articles/1162072-feedback-faq | Must |
| Custom survey vs default | Default form plus custom multiple-choice and free-text questions; a general comments box | ShowingTime Enhanced Feedback: https://showingtimemls.uservoice.com/knowledgebase/articles/496662-feedback ; Aligned custom surveys: https://armls.com/new-feedback-features-in-aligned-showings | Must |
| Hold-for-review vs auto-publish to seller | Agent approves each response or auto-publishes; owner must be a configured contact | ShowingTime: https://showingtime.com/resources/blog/3-ways-to-easily-share-feedback-with-sellers ; https://apptcenter.uservoice.com/knowledgebase/articles/1858690-can-i-have-feedback-sent-directly-to-my-sellers-wh | Must |
| Buyer-agent identity hidden on seller reports by default | Protects cooperating agents; can be switched on per listing | ShowingTime FAQ: https://showingtimemls.uservoice.com/knowledgebase/articles/1162072-feedback-faq | Must |
| Manual entry of off-platform feedback | Log feedback that came by phone or email | ShowingTime blog: https://showingtime.com/resources/blog/3-ways-to-easily-share-feedback-with-sellers | Must |
| AI sentiment on feedback | Marks each survey as favourable or not | Aligned + ChatGPT: https://armls.com/new-feedback-features-in-aligned-showings | Should |
| Feedback trend charts | Graphs across all showings (price perception, interest) for pricing talks | ShowingTime Enhanced: https://showingtimemls.uservoice.com/knowledgebase/articles/496662-feedback | Should |
| Opt-out visibility | Showing agents can opt out of requests, and the listing agent sees who declined | ShowingTime FAQ: https://showingtimemls.uservoice.com/knowledgebase/articles/1162072-feedback-faq | Should |
| Mobile feedback straight after a viewing | Agent logs feedback and follow-up tasks on the phone at the door (UK pattern) | Reapit: https://www.reapit.com/ | Should |

## 10. Open houses

| Feature | What it does | Benchmark + source URL | Priority |
|---|---|---|---|
| Auto-created sign-in page from the MLS open-house schedule | Appears on the agent's Today page on the event day; manual create for another agent's open house or off-market homes | Rechat: https://help.rechat.com/guides/open-house-registrations/create-and-use-an-open-house-registration-page | Must |
| Kiosk plus QR self sign-in | Shared tablet or visitor's own phone via QR; branded with property details | Rechat (above) ; Curb Hero: https://curbhe.ro/ | Must |
| "Working with an agent?" field | Captures representation status, which matters for buyer-agreement and solicitation rules | Rechat Realtor field (above) ; comparison: https://openhousesheet.com/blog/best-open-house-sign-in-apps | Must |
| Required-field enforcement | Stops "complete" with no name or phone, a stated Curb Hero-vs-Spacio complaint | Curb Hero testimonial: https://curbhe.ro/ | Must |
| Instant text with listing link after sign-in | Visitor gets the listing by SMS immediately | Curb Hero: https://curbhe.ro/ | Should |
| Contact verification and social enrichment | Verifies contact details and pulls social profiles to prioritise visitors | Spacio: https://www.lwolf.com/engage/open-house | Later |
| Auto follow-up sequences | Branded follow-ups and broadcasts; attendee added to CRM with an event-stamped timeline; bulk add to a drip | Spacio: https://www.lwolf.com/engage/open-house ; Rechat follow-up: https://help.rechat.com/guides/open-house-registrations/manage-and-follow-up-with-open-house-attendees | Must |
| Seller-ready open-house report | Post-event summary of traffic and interest sent to the seller | Spacio: https://www.lwolf.com/engage/open-house | Must |
| Offline mode | Basements and new builds often have no Wi-Fi | Comparison: https://openhousesheet.com/blog/best-open-house-sign-in-apps | Should |
| Team defaults | Brokerage sets default questions and branding for every open house | Spacio: https://www.lwolf.com/engage/open-house | Should |
| Open-house ad and post kit | One click from open-house need to social posts, flyer, agent e-blast and sign-in page | Rechat flow: https://help.rechat.com/guides/marketing/listing-marketing ; PropertyBoost OH type: https://help.insiderealestate.com/en/articles/15024296-marketplace-propertyboost-faq | Should |
| Host-for-hire | Licensed agents hired to host an open house | Showami: https://www.showami.com/ | Later |

## 11. Offer intake and comparison

**Data:** offer terms (price, financing, down payment, earnest money, contingencies, close date, concessions, escalation, appraisal gap, rent-back), buyer agent, documents, completeness, status. **Actions:** set offer instructions and deadline; receive; acknowledge; flag; shortlist; compare; share with seller; counter or accept. **Notifications:** new offer (email, SMS, app), read receipt to the buyer agent, status updates, mass "highest and best". **Seller view:** side-by-side comparison with net proceeds. **Compliance:** present all offers objectively and as quickly as possible until closing unless waived in writing; on request, written affirmation that the offer was presented (NAR Code of Ethics SoP 1-6 and 1-7). Never reveal one buyer's offer to another unless the seller directs it where allowed (Ontario TRESA). Recommend legal counsel before accepting a backup offer.

| Feature | What it does | Benchmark + source URL | Priority |
|---|---|---|---|
| Public offer link and per-buyer offer rooms | A link published in the MLS; each submission opens its own folder named for the buyer agent; buyer agents never see other offers | dotloop Easy Offer: https://support.dotloop.com/s/article/Easy-Offer-Best-Practices ; HLM: https://help.homelight.com/hlm-offers-overview | Must |
| Offer instructions and settings | Offer date and time (or "any time"), whether pre-emptive "bully" offers are accepted, delivery method, deposit rules, required documents, notes; preview as a co-operating agent | BrokerBay (Corcoran KB): https://info.regoteam.com/knowledge/change-offer-presentation-date-settings-in-brokerbay ; ShowingTime offer instructions: https://showingtime.com/solutions/showings-and-offers/appointment-center/offer-manager | Must |
| Offer registration before deadline | Buyer agents register intent so the listing agent knows how many offers to expect and can broadcast changes | BrokerBay: https://info.regoteam.com/knowledge/change-offer-presentation-date-settings-in-brokerbay | Should |
| Automatic read receipt | Buyer agent is notified the moment the listing agent opens the offer | ShowingTime Offer Manager: https://showingtime.com/solutions/showings-and-offers/appointment-center/offer-manager | Must |
| New-offer alerts on every channel | Email, SMS and app push on submission or update | Offer Manager (above) ; HLM: https://help.homelight.com/hlm-offers-overview | Must |
| Structured terms extraction | Terms captured in fields, not just a PDF, so they can be compared | Offer Manager "no re-typing into spreadsheets": https://showingtimemls.uservoice.com/knowledgebase/articles/1995967-quick-look-offer-manager-side-by-side-comparisons | Must |
| Completeness and risk check | Flags missing documents, compares contingencies and highlights risks | HLM offer intelligence: https://www.homelight.com/hlm | Should |
| Side-by-side comparison for the seller | Pick which offers to include, exclude stale ones, add notes; send as branded PDF or Excel in about 30 seconds | ShowingTime: https://showingtimemls.uservoice.com/knowledgebase/articles/1995967-quick-look-offer-manager-side-by-side-comparisons | Must |
| Net-to-seller per offer | Each offer shows estimated net from title and escrow fees and concessions | HLM: https://www.homelight.com/hlm ; TitleTap multi-offer compare: https://www.titletap.com/netsheet-calculator-mobile-app/ | Must |
| Shareable offer dashboard for the seller | Seller sees the comparison read-only (HLM: a Pro feature) | HLM: https://help.homelight.com/hlm-offers-overview ; https://academy.disclosures.io/share-roles | Must |
| Accept and counter in one place | Compare, accept, counter and share with sellers in one click | SkySlope Offers: https://support.skyslope.com/support/solutions/articles/156000366326 | Must |
| Broker oversight of offers | Broker statistics on offer activity | SkySlope Offers Broker Stats: https://support.skyslope.com/support/solutions/articles/156000366326 ; ShowingTime Offer Manager admin overview: https://showingtimemls.uservoice.com/knowledgebase/topics/150455-offer-manager | Should |
| Offer-presented affirmation on request | One click sends a written affirmation that an offer was presented, or a notice that the seller waived presentation, after an MLS (OneKey) dropped its own acknowledgment form in 2026 | OneKey rule change: https://support.onekeymls.com/hc/en-us/articles/47507969337492-Offer-Presentation-and-Acknowledgment-Rules-Update-and-Guidance ; NAR CoE 2026: https://www.nar.realtor/about-nar/governing-documents/code-of-ethics/2026-code-of-ethics-standards-of-practice | Must |
| Seller waiver capture | Seller's written waiver of presentation (for example "only offers above X") stored with the listing | NAR SoP 1-7 (above) | Should |

## 12. Negotiation and acceptance

| Feature | What it does | Benchmark + source URL | Priority |
|---|---|---|---|
| One-touch buyer-agent contact | Call, text or email any offering agent from the offer list | ShowingTime Offer Manager: https://showingtime.com/solutions/showings-and-offers/appointment-center/offer-manager | Must |
| Mass "highest and best" message | Sends the same message to every offering agent, or to everyone who showed the home | Offer Manager (above) | Must |
| Offer status notifications | Tells each buyer agent the status of their offer (received, countered, declined, accepted, backup) | Offer Manager (above) ; HLM leaves acceptance notices to the agent: https://help.homelight.com/hlm-offers-overview | Must |
| Virtual transaction room after the offer | Both sides amend terms, upload documents and send for e-signature in the offer thread | HLM: https://help.homelight.com/hlm-offers-overview | Should |
| Seller-directed offer-content sharing (Ontario) | With the seller's written direction, share chosen offer contents with all offerors, never identifying parties | RECO TRESA FAQ: https://www.reco.on.ca/agents-and-brokerages/tresa-explained/tresa-faqs/ | Later (CA) |
| Backup offer and counsel prompt | When a backup offer is accepted, prompt the agent to recommend legal counsel | NAR SoP 1-7: https://www.nar.realtor/about-nar/governing-documents/code-of-ethics/2026-code-of-ethics-standards-of-practice | Should |
| Disable public offer link on acceptance | Close intake so no new parties enter | dotloop: https://support.dotloop.com/s/article/Easy-Offer-Best-Practices | Must |
| Hand-off to transaction file | Accepted offer becomes the contract file with dates; seller portal switches to milestones | Alto Sales Progression: https://support.altosoftware.co.uk/hc/en-gb/articles/5048084700703-PropertyFile-Vendor-Portal ; ListingPulse: https://www.listingpulse.com/ | Must |
| AI deal summary | AI reads every note and surfaces offer status, timeline and blockers | Street.co.uk AI sale summary: https://street.co.uk/product/sales | Should |

## 13. Cash and alternative offers

| Feature | What it does | Benchmark + source URL | Priority |
|---|---|---|---|
| Cash offer next to the listing plan | Agent requests an iBuyer offer from the address; Cash Offer plus "Cash Now, More Later" (cash up front plus a second payment after the renovated home resells, with the same agent listing). Agent gets a 1–2% bonus; client picks the close date (as few as 21 days) | Opendoor: https://www.opendoor.com/agents ; https://help.opendoor.com/agents-partners/working-with-opendoor/agent-overview | Should (partner) |
| Cash offer to beat | No-obligation cash offer in 48 hours, then an agent tries to beat it | HomeLight Simple Sale: https://www.homelight.com/simple | Later |
| Buy before you sell | Equity unlocked up to 90% CLTV so the buyer can drop the home-sale contingency; old mortgage left out of debt-to-income | HomeLight BBYS: https://www.homelight.com/buy-before-you-sell | Later |
| Cash-offer card in homeowner reports | Promotional "Cash Offer Cards" inside nurture reports | Lofty Homeowner Agent: https://help.lofty.com/hc/en-us/articles/45507362712219-Homeowner-Agent | Later |
| Compare cash vs list net | Side-by-side net of cash offer vs a listed sale | HomeLight BBYS purchase-power compare: https://www.homelight.com/buy-before-you-sell | Should |

## 14. Homeowner nurture (post-close and pre-list)

**Data:** property, AVM, equity estimate, loan, ownership tenure, engagement, likely-to-sell score. **Actions:** enrol, send reports, hand off to the agent. **Notifications:** intent signals (CMA request, high engagement), score crosses a threshold. **Homeowner view:** dashboard on the agent's domain. **Compliance:** email and SMS consent; truthful valuation framing; lender co-branding rules (RESPA; not verified here).

| Feature | What it does | Benchmark + source URL | Priority |
|---|---|---|---|
| Homeowner dashboard on the agent's domain | Value, equity, comps and neighbourhood activity for one or more properties; monthly emails bring the owner back | Luxury Presence: https://www.luxurypresence.com/blogs/product-update-homeowner-dashboard-home-value-alerts/ | Must |
| Monthly home digest plus market update | Welcome email; monthly Home Digest; separate Market Update about 2 weeks later with market temperature and trajectory | Homebot: https://help.homebotapp.com/en/articles/8346469-the-home-digest-and-home-search-monthly-emails | Must |
| "Should you sell" panel | Appreciation band, equity after 6% selling costs (at least $10k), tenure, market temperature; one-click message to the agent | Homebot: https://help.homebotapp.com/en/articles/5112483-module-overview-should-you-sell-panel | Should |
| Likely-to-sell score | ML score for listing within 9 months, updated daily; owners scoring 80+ go to an opportunity list; needs 1+ year of ownership | Homebot: https://help.homebotapp.com/en/articles/9641674-likely-to-sell-scores ; 89% accuracy claim: https://homebot.ai/real-estate-agents | Should |
| Scheduled live CMA (not AVM) | Automatic comp-based mini-CMA on a monthly-to-annual schedule; the link always shows current data | Cloud CMA Homebeat: https://cloudagentsuite.com/homebeat | Must |
| AI homeowner agent with nurture stages | Warming Up, Long-Term, Engaged, Hand-Off; segments Likely Seller (10+ years and at least 50% equity), Absentee, Pre-foreclosure; email, postcard, Facebook and text; campaigns stop at hand-off | Lofty Homeowner Agent: https://help.lofty.com/hc/en-us/articles/45507362712219-Homeowner-Agent | Should |
| AI follow-up teammate with warm transfer | Runs 1:1 email, text and calls across the database and hands off ready contacts | Fello: https://fello.ai/knowledge/knowledge/understanding-the-home-dashboard-in-fello ; https://hifello.com/ | Later |
| "Sold without you" detection | Flags database contacts who sold with another agent | Fello: https://hifello.com/ | Should |
| Database wins and attribution | Closed deals traced to nurture with the contact's journey and estimated GCI; shareable win card | Fello Wins: https://fello.ai/knowledge/knowledge/understanding-the-home-dashboard-in-fello | Later |
| Lender co-sponsorship | Loan officer co-brands reports and shares cost | Homebot: https://homebot.ai/real-estate-agents ; Lofty lenders: https://help.lofty.com/hc/en-us/articles/53175251355035-About-the-Homeowner-Agent-Lofty-AOS | Later |
| Weekly call list | Ranked list of who to call this week from engagement | Homebot help index: https://help.homebotapp.com/en/articles/8319381-what-does-the-homeowner-s-digest-include | Should |

Row count: **189 rows** across 14 sub-areas.

---

## Top 12 differentiators for Estate OS

1. **One Listing record for the whole seller journey.** The CMA, prep, media, distribution consents, showings, feedback, offers, net sheets and seller portal all read and write the same object. Today an agent works across Cloud CMA, Canva, ShowingTime, HLM and Homebot; no verified vendor spans all five.
2. **Compliance engine as a first-class feature.** It runs a CCP 1-business-day clock fed by a public-marketing event log, stores the seller certifications for office-exclusive and delayed-marketing listings (NAR MLOS), checks Zillow "broadly accessible" rules, applies per-MLS photo and alteration rules (including California AB 723's link to the original), handles IDX AVM and comment opt-outs, scans fair-housing copy and images, and strips compensation from MLS-bound data. Each check leaves an audit trail.
3. **Seller-visible distribution map.** A "where is my home visible, and why" page backed by signed consents. Rechat only documents a visibility matrix, and Compass explains its phases in marketing copy.
4. **Net-to-seller everywhere.** The same title-accurate net sheet (including concessions and buyer-broker fee lines after the settlement) appears in the CMA, the listing presentation, each offer and cash-offer comparisons. HLM shows net per offer, and title apps keep net sheets separate.
5. **Offer desk that also covers the Code of Ethics.** Offer rooms, read receipts, completeness and risk checks, side-by-side comparison, mass highest-and-best, and a one-click written affirmation that an offer was presented (SoP 1-7). OneKey dropped its own acknowledgment form in 2026, so agents need a tool for this.
6. **Showing-to-pricing loop.** Feedback sentiment, showing counts, portal views vs similar listings (the Rightmove pattern) and the pricing benchmark roll into one "pricing health" card with a suggested action. That data currently sits in three different tools.
7. **Buyer-interest intelligence before offers arrive.** Disclosure downloads, site visits, repeat showings and feedback combine into an engagement score per buyer agent. This extends HLM's engagement scoring with showing data, which HLM does not have.
8. **Seller portal with publish controls.** Per-item visibility, hold-for-review feedback, a marketing-proof timeline (the Rechat seller report pattern) and milestones after the offer is accepted, in one branded portal.
9. **Lifecycle marketing autopilot with guardrails.** An MLS status change drafts the post, ad, e-blast and print set. Everything passes the safe-teaser and fair-housing checks, and Meta housing ads use the Special Ad Category by default. Ad results flow into the seller report automatically.
10. **Time-boxed secure access and safety built in.** Access codes appear only during the confirmed window, with a geofenced arrival push, a safety timer and the buyer-agreement acknowledgment before instructions are released. Each of these exists separately in ShowingTime or Homesnap; none of them is in a CRM.
11. **Homeowner nurture that reuses the closing data.** Day-one homeowner dashboard, a scheduled live CMA (comps, not an AVM), a likely-to-sell score and a "sold without you" alert, all built from the closed Listing record, with no re-import into Homebot or Fello.
12. **Regional rule packs.** The same Listing record supports UK material information (Parts A–C), the Victoria Property Price Statement (1 Oct 2026), Ontario seller-directed offer disclosure and Dubai ad permits with QR codes. The verified US tools handle none of these, and Reapit and Alto cover only parts of the UK and AU rules.

## UX patterns worth copying

- **Lifecycle "marketing need" picker** (Rechat): the agent picks "Open House" and gets posts, flyer, agent e-blast and sign-in page in one flow, already filled from MLS data.
- **"Today" page surfacing event-day tools** (Rechat): the sign-in page appears on the morning of the open house, along with a prompt to run a test registration.
- **Three presentation modes from one build** (Rechat Print, Digital and Flipbook): no export-and-upload step.
- **Hold-for-review vs auto-publish toggle** on seller-facing data (ShowingTime feedback): the agent stays in control and can still automate.
- **Access-window slider** (0/5/10/15/30/45/60 minutes) with codes shown only inside the window, plus an arrival push that opens the code (ShowingTime).
- **Downloadable "listing setup" PDF** for the seller to sign off on showing rules (ShowingTime).
- **Health column with orange alerts** next to performance numbers (Rightmove), telling the agent exactly what to fix (for example a missing floor plan) before suggesting a price cut.
- **Comparison against "similar listings" with the filter rule stated** (Rightmove ±1 bed and ±10% price; ShowingTime adjustable filters with a minimum of 3 comps).
- **Engagement-ranked buyer list** ("37 of 37 docs · 9 visits") next to the offers summary ("3 offers in · 3 awaiting reply · highest $1,825,000") (HLM).
- **AI summary with page citations** for disclosures (HLM), which builds trust and lets the agent check it.
- **Background generation with a notification and an automatic credit refund on failure** for AI video (Lofty).
- **Per-channel AI adaptation** of one social post, so Twitter/X is shortened without shortening the other channels (Lofty Social Agent).
- **Seller one-tap actions from SMS or email** (accept, deny, suggest a new time) with no login (BrokerBay).
- **Silent housekeeping edits** that do not trigger notifications (Aligned, editing a past appointment's status).
- **"Preview as cooperating agent"** before publishing offer instructions (BrokerBay KB).
- **Branded celebration card** for wins (Fello), for agent social proof.
- **Original plus staged pair always exported** (StageMLS), so the compliant variant is always available.

## Not verified

- **Zillow LAS enforcement detail.** The three-strike system, 48 banned listings (43 from Compass), 1,200+ notices and the violation-type percentages come only from a vendor blog (open-homes.com). zillow.com pages were bot-blocked. The 2026 revision ("broadly accessible", MLS optional, Zillow Preview) is from RealEstateNews, not read from Zillow directly.
- **Virtual-staging rules per MLS** (Stellar, CRMLS, ARMLS) and the California AB 723 requirements come from vendor guides (stagemls.com, roomstage.ai), not the boards' rule pages or the statute text. MLS Now Rule 3.3 was read first-hand.
- **Meta Special Ad Category specifics** (15-mile minimum radius, no age, gender or zip targeting, Variance Reduction System) come from a secondary blog. Meta's own page only confirms the category is mandatory and restricts targeting.
- **Fello pricing** ($165–$799/month, 12-month contracts) is from a Luxury Presence blog, not Fello.
- **Cloud CMA LiveCMA** (editing price and net sheet live) is from a search snippet; the community page needs a login.
- **RPR Refine Value and Seller's Report internals.** The narrpr.com blog was bot-protected, so the claims come from the MLSListings and NAR summaries.
- **SkySlope Offers** beyond "compare, accept, counter, share with sellers, broker stats". skyslope.com was bot-protected.
- **Zillow Showcase capture requirements** (HDR, Zillow 3D Home, approved photographer, 10 or more photos) come from a photographer's blog. Performance claims (79% more views and so on) are Zillow's own marketing.
- **Homebot's 89% likely-to-sell accuracy** and **MoxiPresent's 3.5x sold listings** are vendor claims.
- **Open-house app pricing and features** (Curb Hero offline mode and 6,000+ integrations, Spacio from about $25/month) come from a competitor's comparison page (openhousesheet.com).
- **HomeLight Listing Management "Listing Studio"** is marked "coming soon" on its page.
- **Lone Wolf offer management**: no Lone Wolf offer-comparison product was found; Lone Wolf's offer coverage here is via Cloud CMA and dotloop-style flows only. **Canva** template-lock specifics for brokerages were not read in help docs.
- **Escalation-clause calculators, appraisal-gap fields and multiple-counteroffer workflows**: no verified vendor page documents them; they are recommended from domain knowledge.
- **Federal lead-based paint disclosure, state seller disclosure forms, RESPA limits on lender co-marketing, and TCPA consent for SMS nurture** are included as compliance needs but were not re-read for this pass.
- **Dubai QR circular content** loaded only as a title; the permit e-service steps were verified.
