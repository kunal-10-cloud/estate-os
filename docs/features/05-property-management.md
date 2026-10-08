# Estate OS feature research 05: property management and rentals

**Scope.** Long-term residential rentals, managing on behalf of owners, HOA/community associations, commercial leasing and short-term rentals (STR). The research covers the US and the UK.
**Method (October 2026).** WebSearch was exhausted, and Brave's bot check blocked the headless search helper after the first batch of searches. The check was not bypassed. I collected evidence through other channels instead:
- I found vendor URLs in the vendors' own `sitemap.xml` files.
- I read about 200 vendor, government and legislation pages directly with headless Chrome.
- I pulled about 40 help-center articles through the public Zendesk APIs for Guesty and Hostaway.
- I pulled the 150 most recent App Store reviews for each of 8 resident, owner and manager apps through the iTunes RSS feed.

Every benchmark cell links to the page it came from. Claims I could not confirm on a fetched page are listed under **Not verified** at the end, not in the tables. The tables build on `notes/property_management_rentals.md` and `01-market-research.md`.

**Priority key.** **Must**: needed at launch to replace Buildium, DoorLoop or RentRedi for a 10-500 unit operator. **Should**: needed to compete with AppFolio, Rent Manager or Yardi Breeze in the mid-market. **Later**: enterprise, niche or regional add-ons.

---

## 1. Portfolio, property and unit setup

| Feature | What it does | Benchmark + source | Priority |
|---|---|---|---|
| Property → building → unit → room hierarchy | Models single-family homes, multifamily buildings, HMOs (shared houses) and by-the-room lets, with data shared across the tenants of a multi-tenant property | Arthur: "rooms, units, or buildings… particularly useful for HMOs" ([Arthur PMS](https://www.arthuronline.co.uk/features/property-management-system)) | Must |
| By-the-bed leasing and ledgers | Student housing with a separate lease and tenant ledger per bed | AppFolio: "separate leases and tenant ledgers by-the-bed" ([AppFolio M&L](https://www.appfolio.com/property-manager/marketing-leasing)); Buildium portfolios: by-the-bed leasing and roommate matching ([Buildium](https://www.buildium.com/portfolios/)) | Should |
| Mixed asset types in one account | Residential, commercial, association, affordable, self-storage and manufactured housing in one system | Yardi Breeze covers all six ([Breeze](https://www.yardibreeze.com/features/)); Buildium handles "rental, commercial, and community association units in one platform" ([Buildium](https://www.buildium.com/portfolios/)) | Must (resi + HOA), Should (commercial) |
| Multi-entity portfolio | Many owning entities or companies managed from one screen | Arthur "multiple entities… from just one screen" ([Arthur PMS](https://www.arthuronline.co.uk/features/property-management-system)); Baselane gives each entity and property its own bank account ([Baselane](https://www.baselane.com/)) | Must |
| Owner ↔ property mapping with automatic grouping | Properties held by the same owner roll up into one financial picture | AppFolio: "Properties group under the same owner automatically" ([AppFolio accounting](https://www.appfolio.com/property-manager/accounting-reporting)) | Must |
| Custom fields | User-defined fields on properties, units and people | AppFolio Plus tier ([pricing](https://www.appfolio.com/pricing)); Rentvine "unlimited custom fields" ([Rentvine](https://www.rentvine.com/)) | Should |
| Data migration service | Imports from Excel or a competitor's system, run by the vendor | DoorLoop "dedicated migration team… Go live in days" ([DoorLoop features](https://www.doorloop.com/features)) | Must |
| Bulk move-in and move-out | Moves out many residents at once with dates, charges and work orders | AppFolio bulk move-out ([AppFolio M&L](https://www.appfolio.com/property-manager/marketing-leasing)) | Should |
| Bulk tenant charges | Uploads recurring or one-off charges in bulk | AppFolio "upload bulk tenant charges" ([AppFolio accounting](https://www.appfolio.com/property-manager/accounting-reporting)) | Must |
| Identical-unit marketing (floorplans) | Markets many identical units at once in multifamily and student housing | AppFolio ([AppFolio M&L](https://www.appfolio.com/property-manager/marketing-leasing)) | Should |
| Settings import and duplication | Copies one property's configuration to another | Guesty JSON import and duplicate-property ([Guesty help](https://help.guesty.com/hc/en-gb/articles/9370045895837-Importing-settings-to-an-existing-property)) | Should |
| Key and lockbox inventory | Tracks physical keys and lockbox codes per unit | Arthur Enterprise "key management" ([Arthur pricing](https://www.arthuronline.co.uk/pricing/)); Hemlane digital lockbox codes for vendors, with every entry logged ([Hemlane](https://www.hemlane.com/features/self-guided-tours/)) | Should |

## 2. Marketing, listings and syndication

| Feature | What it does | Benchmark + source | Priority |
|---|---|---|---|
| One-click listing syndication | Publishes vacancies to the main listing sites (ILSs) from one record | Buildium: Apartments.com, Apartment List, the Zillow Rental Network, Zumper, Craigslist ([Buildium](https://www.buildium.com/features/rental-listing-syndication/)); TurboTenant and Avail each reach "19 of the top rental sites" ([TurboTenant](https://www.turbotenant.com/features/), [Avail](https://www.avail.com/landlords/features)) | Must |
| Two-way listing sync | Edits made in the PMS update every listing site | DoorLoop: "Edit listings… see your changes synced across every listing site" ([DoorLoop](https://www.doorloop.com/features/advertise-listings)) | Must |
| UK portal syndication | Pushes listings to Rightmove, Zoopla, OnTheMarket and StuRents, and routes enquiries back into the PMS inbox | Arthur ([Arthur PMS](https://www.arthuronline.co.uk/features/property-management-system)) | Must (UK) |
| Pay-per-verified-lead featured placement | Featured placement on paid ILSs, charging only for verified leads | AppFolio ([AppFolio M&L](https://www.appfolio.com/property-manager/marketing-leasing)) | Later |
| Hosted company website | Branded, mobile, SSL site with listings, apply button and portal login, on a custom domain | DoorLoop ([websites](https://www.doorloop.com/features/websites)); Rentec free website ([Rentec ops](https://www.rentecdirect.com/operations-features)) | Must |
| AI listing description writer | Generates listing copy with a chosen tone | TenantCloud "Cloudia" ([TenantCloud AI](https://www.tenantcloud.com/ai-assistant)); DoorLoop ([leasing](https://www.doorloop.com/features/leasing)) | Must |
| Vacancy and listing-status dashboard | Listed, unlisted and upcoming vacancies in one live view, with leasing agents assigned per unit | Buildium ([syndication](https://www.buildium.com/features/rental-listing-syndication/)); AppFolio vacancy dashboard ([AppFolio M&L](https://www.appfolio.com/property-manager/marketing-leasing)) | Must |
| 3D tours and maps on the listing site | Embedded 3D tours, plus a map of the unit relative to amenities and parking | AppFolio ([AppFolio M&L](https://www.appfolio.com/property-manager/marketing-leasing)) | Later |
| Leasing CRM and guest cards | One guest card per lead across the portfolio, prioritized to-dos, pipeline view | AppFolio Leasing CRM (Max tier) ([AppFolio M&L](https://www.appfolio.com/property-manager/marketing-leasing)); DoorLoop CRM ([DoorLoop CRM](https://www.doorloop.com/features/crm)) | Must (basic), Should (CRM) |
| Lead-to-vacancy matching and waitlists | Matches prospects to available units automatically; keeps waitlists for units not yet ready | Rentec lead matching ([Rentec leasing](https://www.rentecdirect.com/leasing-features)); Tenant Turner waitlists ([Tenant Turner](https://tenantturner.com/)) | Should |
| Rent pricing recommendations | Suggests rents from public comparables and occupancy goals; adjustable weights; the customer's data is not pooled with other customers' | AppFolio Leasing Signals ([AppFolio M&L](https://www.appfolio.com/property-manager/marketing-leasing)); Entrata Revenue Intelligence lets users remove competitor inputs ([Entrata](https://www.entrata.com/products/revenue-intelligence)); Apartments.com rent comparable report ([Apartments.com](https://www.apartments.com/rental-manager)) | Should |
| Reputation management | Pulls Google, Yelp and ApartmentRatings reviews into one queue, with AI drafts of responses | Entrata ReputationAdvisor ([Entrata](https://www.entrata.com/products/reputationadvisor)) | Later |

## 3. Showings and tours

| Feature | What it does | Benchmark + source | Priority |
|---|---|---|---|
| Self-scheduling against agent availability | Prospects book a slot from the listing; slot locking prevents double bookings | DoorLoop ([showings](https://www.doorloop.com/features/showings)) | Must |
| Auto-invite from ILS inquiries | A Zillow or ILS inquiry instantly triggers a self-schedule invite | DoorLoop ([showings](https://www.doorloop.com/features/showings)) | Must |
| Reminders and no-show tracking | Reminders 24 h and 2 h before the tour; no-shows marked on the calendar | DoorLoop ([showings](https://www.doorloop.com/features/showings)); Tenant Turner cites "no-shows by 75%" ([Tenant Turner](https://tenantturner.com/)) | Must |
| Pre-qualification gate | Only leads who meet set criteria can book a showing | Tenant Turner ([Tenant Turner](https://tenantturner.com/)); Buildium Showings Coordinator ([Buildium](https://www.buildium.com/features/showings-coordinator/)) | Should |
| Self-guided tours with smart lockbox | One-time code issued after ID and biometric checks; every entry logged | Hemlane (Codebox, ID-to-face match) ([Hemlane](https://www.hemlane.com/features/self-guided-tours/)); AppFolio identity check before scheduling ([AppFolio M&L](https://www.appfolio.com/property-manager/marketing-leasing)); Rently ([Rently](https://use.rently.com/)) | Should |
| Live virtual tours | Agent-led video tours run inside the platform | AppFolio ([AppFolio M&L](https://www.appfolio.com/property-manager/marketing-leasing)) | Later |
| Post-tour feedback capture | Collects each attendee's feedback and sends it to the owner or manager | Hemlane ([self-guided tours](https://www.hemlane.com/features/self-guided-tours/)) | Should |
| 24/7 live answer for leasing calls | Human or AI answering for scheduling and self-access problems | Tenant Turner Live Answer ([Tenant Turner](https://tenantturner.com/)); Latchel AI call center ([Latchel](https://latchel.com/)) | Later |
| Showing reports for owners | Shows owners the status of listings, showings and prospects | Buildium Showings Coordinator ([Buildium](https://www.buildium.com/features/showings-coordinator/)) | Should |

## 4. Applications and screening (credit, criminal, eviction, income, fraud)

| Feature | What it does | Benchmark + source | Priority |
|---|---|---|---|
| Configurable online application | Add, reorder and create sections; brand imagery; apply from the listing; paper fallback | Buildium ([applications](https://www.buildium.com/features/online-rental-applications/)) | Must |
| Save and resume | Applicants don't need to finish in one sitting | DoorLoop FAQ ([applications](https://www.doorloop.com/features/rental-applications)) | Must |
| Application fees, paid online | Fees collected at submission, with an option to pass the screening cost to the applicant | Buildium $17, or $35 applicant-paid ([Buildium screening](https://www.buildium.com/features/tenant-background-checks/)); RentRedi $39.99 ([pricing](https://rentredi.com/pricing/)) | Must |
| Credit, criminal and eviction checks | Bureau-backed report bundle that complies with FCRA (the US Fair Credit Reporting Act) | RentRedi/TransUnion: ResidentScore, 370M+ criminal records, 27M eviction records ([RentRedi](https://rentredi.com/tenant-screening/)); DoorLoop ([screening](https://www.doorloop.com/features/tenant-screening)) | Must |
| Applicant completes the screening in their own app | Landlord triggers the request; tenant consents and completes it on their phone | RentRedi ([RentRedi](https://rentredi.com/tenant-screening/)) | Must |
| Per-property screening criteria and recommendation | Credit thresholds per property produce an approve, conditional or deny recommendation | Buildium ([screening](https://www.buildium.com/features/tenant-background-checks/)); Entrata ResidentVerify ([Entrata](https://www.entrata.com/products/residentverify)) | Must |
| Income verification via bank or payroll | Pulls verified income from Plaid or payroll connections instead of trusting uploaded pay stubs | RentRedi/Plaid (+$10) ([pricing](https://rentredi.com/pricing/)); Entrata VOI ([Entrata](https://www.entrata.com/products/verification-of-income)); DoorLoop ([screening](https://www.doorloop.com/features/tenant-screening)) | Must |
| Document fraud detection | Checks pay-stub and bank-statement metadata for tampering | Snappt: rulings in 10 minutes or less, SOC 2 Type II ([Snappt](https://snappt.com/)); Entrata AI document fraud ([Entrata](https://www.entrata.com/products/residentverify)) | Should |
| ID verification, liveness and synthetic-identity checks | ID scan with 30+ checks, biometric match, synthetic-identity detection | Snappt ([Snappt](https://snappt.com/)); Entrata PreciseID: 140+ rules, 250M records, "70% of applicants are verified" automatically ([Entrata](https://www.entrata.com/products/preciseid)) | Should |
| Rental-history verification | Confirms past rent payments | Snappt ([Snappt](https://snappt.com/)) | Should |
| International credit | Credit files for applicants without US history | Entrata Credit Passport: 16 countries ([Entrata](https://www.entrata.com/products/residentverify)) | Later |
| Applicant review checklist and dashboard | Shows every application's status, with a custom review checklist | Buildium ([applications](https://www.buildium.com/features/online-rental-applications/)) | Must |
| FCRA adverse-action notice generator | Produces the notice whenever a report influenced a denial, a higher deposit or a co-signer requirement. Must name the CRA (consumer reporting agency) and its contact details, and the applicant's dispute rights | FTC landlord guidance ([FTC](https://www.ftc.gov/business-guidance/resources/using-consumer-reports-what-landlords-need-know)) | Must |
| UK referencing, Right to Rent, AML and sanctions | Tenant referencing, Right to Rent document checks on every adult within the legal window, and AML/sanctions checks on landlords | Goodlord: 70% of references back within a day; sanctions checks ([Goodlord](https://www.goodlord.com/lettings-agent-solutions-goodlord)); GOV.UK Right to Rent ([GOV.UK](https://www.gov.uk/check-tenant-right-to-rent-documents)); Arthur with Advanced Tenant Referencing ([Arthur](https://www.arthuronline.co.uk/features/occupancy-management)) | Must (UK) |
| Guarantor and lease-guarantee products | Third-party guarantor where the applicant falls short | TheGuarantors ([TheGuarantors](https://www.theguarantors.com/)); Goodlord rent guarantor ([Goodlord tenants](https://www.goodlord.com/tenant-solutions)) | Should |
| AI application progression | Agents chase missing documents, explain screening status and re-engage stalled applications | Entrata Autonomous Lease Progression ([Entrata](https://www.entrata.com/products/autonomous-lease-progression)) | Should |

## 5. Leasing, e-sign, renewals and notices

| Feature | What it does | Benchmark + source | Priority |
|---|---|---|---|
| Lease templates with merge fields | Reusable templates filled from tenancy data; upload your own lease | Buildium ([leasing](https://www.buildium.com/features/property-lease-management/)); DoorLoop ([applications](https://www.doorloop.com/features/rental-applications)) | Must |
| State-specific, lawyer-reviewed leases | Templates kept current with each state's law | TurboTenant ([features](https://www.turbotenant.com/features/)); Avail ([features](https://www.avail.com/landlords/features)) | Must |
| UK contracts that update with legislation | Templates and How to Rent documents updated automatically when the law changes | Goodlord ([core](https://www.goodlord.com/product/core-lettings-software)) | Must (UK) |
| Built-in e-signature | Signing on any device; included on top tiers, metered on lower ones | Buildium/Dropbox Sign: $5, $1, or unlimited by tier ([pricing](https://www.buildium.com/pricing/)); DoorLoop: $3 per document, free on Premium ([pricing](https://www.doorloop.com/pricing)) | Must |
| Offer letter sent from the viewing | Creates the tenancy and sends a pre-filled offer on the spot | Goodlord ([core](https://www.goodlord.com/product/core-lettings-software)) | Should |
| Approve-to-lease in minutes | Approval triggers the lease email | Buildium customer: "emailed out in 5 minutes" ([Buildium leasing](https://www.buildium.com/features/property-lease-management/)) | Must |
| Bulk renewal offers with resident choice | Sends renewals in bulk; residents pick from preset offers and terms | AppFolio ([AppFolio M&L](https://www.appfolio.com/property-manager/marketing-leasing)) | Must |
| Default renewal offer and auto-roll | A default offer updates lease dates, rent and status at expiry | AppFolio ([AppFolio M&L](https://www.appfolio.com/property-manager/marketing-leasing)) | Should |
| Renewal likelihood prediction | Predicts renewals 90 days ahead and segments residents by intent | Entrata Renewals AI ([Entrata](https://www.entrata.com/products/renewals-ai)); Entrata Revenue Intelligence "likelihood to renew" ([Entrata](https://www.entrata.com/products/revenue-intelligence)) | Later |
| Renewal workflow automation | Templated renewal flows | AppFolio Flows: customers report "20% average increase in renewal rates" ([Flows](https://www.appfolio.com/product-demos/realm-x-flows)) | Should |
| UK Section 13 rent-increase workflow | Annual Section 13 notice, negotiation and tribunal record. Rent-review clauses are no longer valid | GOV.UK RRA guide ([GOV.UK](https://www.gov.uk/government/publications/guide-to-the-renters-rights-act/guide-to-the-renters-rights-act)); Goodlord Section 13 notices ([Goodlord](https://www.goodlord.com/lettings-agent-solutions-goodlord)); Arthur rent review management ([pricing](https://www.arthuronline.co.uk/pricing/)) | Must (UK) |
| UK periodic tenancy and tenant-notice handling | Every tenancy is periodic; tenants give 2 months' notice through the app | GOV.UK RRA ([GOV.UK](https://www.gov.uk/government/publications/guide-to-the-renters-rights-act/guide-to-the-renters-rights-act)); Arthur "Tenants can notify about ending periodic tenancies via the app" ([Arthur](https://www.arthuronline.co.uk/features/occupancy-management)) | Must (UK) |
| Notice library (rent increase, entry, termination) | Generates and serves notices with proof of delivery | TenantCloud notice-of-rent-increase and 24-hour entry templates (sitemap pages [1](https://www.tenantcloud.com/rent-collection/notice-of-rent-increase), [2](https://www.tenantcloud.com/property-management/24-hour-notice-to-enter)); Buildium EZMail print-and-mail ([violations](https://www.buildium.com/features/violations-tracking/)) | Must |
| Lease abstraction and lease-vs-ledger audit | AI turns lease PDFs into structured terms and flags missing or excess charges | Entrata Lease File Audit ([Entrata](https://www.entrata.com/products/lease-file-audit)); VTS lease extraction with citations ([VTS](https://www.vts.com/)) | Should |
| Rent-control compliance | Caps rent increases where rent regulation applies | Entrata Rent Control workflow ([Entrata](https://www.entrata.com/products/revenue-intelligence)) | Should (US CA/NY/OR) |
| UK possession-grounds tracker | Logs the Section 8 ground, its notice period and the evidence. The 2-to-3-month arrears threshold and 4-week notice are built in | GOV.UK grounds table ([GOV.UK](https://www.gov.uk/government/publications/guide-to-the-renters-rights-act/guide-to-the-renters-rights-act)) | Must (UK) |

## 6. Move-in onboarding and move-out

| Feature | What it does | Benchmark + source | Priority |
|---|---|---|---|
| Guided move-in checklist (resident) | Lease signing, deposit, insurance and utilities in one guided flow on the phone | AppFolio Resident Onboarding ([AppFolio](https://www.appfolio.com/product-demos/resident-onboarding)); Entrata Homebody checklist ([Entrata](https://www.entrata.com/products/homebody-app)) | Must |
| Move-in status widget (manager) | Live view of each resident's progress: lease signed, insurance uploaded, utilities confirmed | AppFolio ([AppFolio](https://www.appfolio.com/product-demos/resident-onboarding)) | Must |
| Autopay set up before move-in | The payment method and autopay are captured during onboarding | RentRedi ([features](https://rentredi.com/features/)) | Must |
| Utility and internet concierge | Human concierge sets up utilities and sells internet | AppFolio Resident Concierge (free) ([AppFolio](https://www.appfolio.com/product-demos/resident-onboarding)); Goodlord bills bundle ([Goodlord tenants](https://www.goodlord.com/tenant-solutions)) | Should |
| Resident benefits package (RBP) and personalized onboarding | Bundles benefits such as credit building and filter delivery into the lease; personalized by property | Second Nature: "64 point credit score boost" claim ([Second Nature](https://www.secondnature.com/)) | Later |
| UK move-in monies and holding deposit | Collects holding deposits and move-in monies, with calculators that enforce legal caps | Goodlord ([tenant payments](https://www.goodlord.com/letting-agent-solutions/tenant-payments)) | Must (UK) |
| UK compliance pack served at move-in | Sends the How to Rent guide (or the RRA information sheet), EPC and gas safety certificate, all pre-filled | Goodlord ([core](https://www.goodlord.com/product/core-lettings-software)) | Must (UK) |
| Move-out workflow | Notice → pre-inspection offer → inspection → itemized deposit disposition → final account | CA requires a written offer of a pre-move-out inspection ([CA Courts](https://selfhelp.courts.ca.gov/guide-security-deposits-california)); RealPage OneSite move-out and final statements ([RealPage](https://www.realpage.com/property-management-software/)) | Must |
| End-of-tenancy utility reallocation | Moves bills to the right payer automatically | Goodlord ([Goodlord](https://www.goodlord.com/lettings-agent-solutions-goodlord)); Conservice automated move-ins and move-outs ([Conservice](https://www.conservice.com/solutions/expense-recovery/)) | Should |
| Unit turn (make-ready) board | Tracks every turn task to minimize vacant days | AppFolio Unit Turn Board ([maintenance](https://www.appfolio.com/property-manager/maintenance)); Rent Manager Make Ready Boards ([Rent Manager](https://www.rentmanager.com/)); Buildium "unit turnovers… 66% faster" ([automation](https://www.buildium.com/features/property-management-automation-software/)) | Must |

## 7. Inspections

| Feature | What it does | Benchmark + source | Priority |
|---|---|---|---|
| Move-in and move-out inspections on mobile | Room-by-room templates, photos, notes and e-signature | TenantCloud ([inspections](https://www.tenantcloud.com/inspections)); Buildium with HappyCo ([Buildium](https://www.buildium.com/features/mobile-property-inspection-app/)) | Must |
| Side-by-side move-in vs move-out comparison | Highlights changes in condition to settle deposit disputes | TenantCloud ([inspections](https://www.tenantcloud.com/inspections)) | Must |
| Damage → work order automatically | A flagged item creates a maintenance request | TenantCloud ([inspections](https://www.tenantcloud.com/inspections)) | Must |
| Resident self-inspection | Resident completes a guided inspection on their phone and signs it | zInspector ([zInspector](https://www.zinspector.com/)); TenantCloud lets tenants flag issues ([inspections](https://www.tenantcloud.com/inspections)) | Should |
| Offline inspection mode | Captures data offline and syncs later | Buildium/HappyCo ([Buildium](https://www.buildium.com/features/mobile-property-inspection-app/)); AppFolio app reviews complain about bad-signal photo uploads ([App Store](https://apps.apple.com/us/app/id1057763031)) | Must |
| Voice-to-report AI inspection | Inspector walks and talks; AI builds the report in any language | zInspector zAssistant ([zInspector](https://www.zinspector.com/)); DoorLoop AI Inspections (Pro) ([DoorLoop AI](https://www.doorloop.com/features/ai)) | Should |
| Video inspections | Video walkthroughs | Rent Manager Premium ([pricing](https://www.rentmanager.com/pricing/)) | Later |
| Periodic and safety inspections with a schedule | Recurring inspections with reminders | Arthur safety-inspection reminders ([Arthur](https://www.arthuronline.co.uk/features/stakeholder-management)) | Must |
| Due diligence and site-visit audits | Acquisition walks, rent-roll validation, site-visit scoring | HappyCo ([asset evaluation](https://happy.co/platform/asset-evaluation)) | Later |

## 8. Tenant portal and app

| Feature | What it does | Benchmark + source | Priority |
|---|---|---|---|
| One portal: pay, request, documents, messages | 24/7 self-service on web and native apps | Buildium Resident Center: 4.78★ from 156.6k ratings ([Buildium](https://www.buildium.com/features/resident-center/)); Rentec Resident Connect ([Rentec](https://www.rentecdirect.com/details/tenant-portal)) | Must |
| White-label branding | Manager's logo, colors and app name | Buildium ([Resident Center](https://www.buildium.com/features/resident-center/)); Entrata Homebody white-label ([Entrata](https://www.entrata.com/products/homebody-app)); Arthur white-label occupier app ([Arthur](https://www.arthuronline.co.uk/features/occupancy-management)) | Should |
| Clear "paid / owed" ledger view | Separates totals from itemized lines | FolioSpace review: "really hard to tell if you've already paid your rent" ([App Store reviews](https://apps.apple.com/us/app/id1376350358)); Rentec app review praises a history view that "hides the background details" ([Rentec](https://www.rentecdirect.com/details/tenant-portal)) | Must |
| Bring your own insurance proof | Upload a third-party renters policy as an alternative to buying in-app | FolioSpace 1★ reviews: charged for insurance despite their own policy, "not giving us space to put it in" ([App Store](https://apps.apple.com/us/app/id1376350358)); Rentec supports both options ([Rentec](https://www.rentecdirect.com/details/tenant-portal)) | Must |
| Choice of maintenance intake (form or AI) | Lets residents skip the AI chat | FolioSpace reviews: "Stop AI… give me the choice" ([App Store](https://apps.apple.com/us/app/id1376350358)) | Must |
| Community board and resident directory | Message board, events, marketplace | Entrata ResidentPortal "community wall" ([Entrata](https://www.entrata.com/products/residentportal)); Buildium HOA directory and board ([Buildium](https://www.buildium.com/features/homeowner-and-board-communications/)); Homebody 1★ "No Community Messaging Option" ([App Store](https://apps.apple.com/us/app/id6451412538)) | Should |
| Login-time announcements | Banners shown when residents log in | Entrata ([ResidentPortal](https://www.entrata.com/products/residentportal)); DoorLoop expiring portal messages ([DoorLoop](https://www.doorloop.com/features/communication-tools)) | Must |
| Resident loyalty rewards | Points for on-time payment, autopay and renewals | Entrata Homebody rewards, plus $300/yr of service credits ([Entrata](https://www.entrata.com/products/homebody-app)); Bilt Rewards app 4.85★ from 232k ratings ([App Store](https://apps.apple.com/us/app/id1565576987)) | Later |
| Roommate accounts | Each roommate has a login and can pay their share or the whole invoice | TenantCloud ([roommates](https://www.tenantcloud.com/roommates)) | Must |
| Resident sentiment and surveys | Automated surveys; AI sentiment dashboard | AppFolio surveys ([comms](https://www.appfolio.com/property-manager/communication-service)); Entrata Resident Pulse ([Entrata](https://www.entrata.com/products/homebody-app)) | Should |
| Portal-only messaging to the manager with tracked threads | A logged conversation, especially for payment disputes | rmResident 1★ review: "no option to message the company… zero option to have a tracked conversation" ([App Store](https://apps.apple.com/us/app/id1540124885)) | Must |
| Stable authentication | Passkeys, 2FA, persistent sessions | Recent reviews of FolioSpace, AppFolio PM, Resident Center and Owners by Guesty all complain of logouts and broken passkeys ([AppFolio PM](https://apps.apple.com/us/app/id1057763031), [Owners by Guesty](https://apps.apple.com/us/app/id6749070952)) | Must |
| Keep a web portal (don't force the app) | Web and app stay at parity | Resident Center 1★: "Disabling the website to force the app on people" ([App Store](https://apps.apple.com/us/app/id1466854902)) | Must |
| Multilingual resident communication | Automatic translation of outgoing messages | AppFolio Realm-X: 60+ languages ([Assistant](https://www.appfolio.com/product-demos/realm-x-assistant)); Entrata Leasing AI: 30+ languages ([Entrata](https://www.entrata.com/products/leasing-ai)) | Should |

## 9. Rent collection and payments (autopay, partial, split, cash, fees)

| Feature | What it does | Benchmark + source | Priority |
|---|---|---|---|
| ACH, card and debit rent payments | Online rent through a PCI-compliant processor | DoorLoop via Stripe ([RapidRent](https://www.doorloop.com/features/rapid-rent)); Buildium cards at 2.99% ([pricing](https://www.buildium.com/pricing/)) | Must |
| Autopay and scheduled payments | Recurring payments set up by tenant or manager, weekly or monthly | Rentec EasyPay ([FAQ](https://www.rentecdirect.com/details/easypay-faq)); Buildium ([payments](https://www.buildium.com/features/online-rent-payments/)) | Must |
| Free or low-cost ACH as a tier lever | Fees on incoming ACH | Buildium EFT: $2.35, $1.35, or $0.60 by tier ([pricing](https://www.buildium.com/pricing/)); Rentec: one ACH per unit per month free ([FAQ](https://www.rentecdirect.com/details/easypay-faq)) | Must |
| Transparent convenience fees | Shows who pays which fee, before payment | Recent 1★ reviews across rmResident, Resident Center, FolioSpace and Homebody are dominated by "$10 fee", "$6 per $100" and similar ([rmResident](https://apps.apple.com/us/app/id1540124885), [Resident Center](https://apps.apple.com/us/app/id1466854902)) | Must |
| Retail cash payments | Barcode or slip payable at stores, posted automatically, no reversal risk | Buildium/PayNearMe: 20,000+ locations, funds within 5 days ([Buildium](https://www.buildium.com/features/retail-cash-payments/)); RentRedi 90,000+ locations ([RentRedi](https://rentredi.com/automate-rent-collection/)); Entrata MoneyGram 35,000+ ([ResidentPay](https://www.entrata.com/products/residentpay)) | Must |
| Partial-payment policy controls | Allow, block, or set a minimum for partial payments per lease | RentRedi "block payments" ([RentRedi](https://rentredi.com/automate-rent-collection/)); rmResident 1★ "can't pay unless it's the full amount" ([App Store](https://apps.apple.com/us/app/id1540124885)) | Must |
| Split rent between roommates | Each roommate pays a portion | TenantCloud ([roommates](https://www.tenantcloud.com/roommates)) | Must |
| Flexible rent / pay-in-installments | Resident splits rent across the month while the owner gets paid in full on time | Buildium/Livble ([Resident Center](https://www.buildium.com/features/resident-center/)); Flex ([Flex](https://getflex.com/)) | Should |
| Apple Pay, digital wallets, pay-by-text | Wallet and text-link payment | Entrata ResidentPay ([Entrata](https://www.entrata.com/products/residentpay)); Vantaca Pay Apple/Google Pay ([Vantaca](https://www.vantaca.com/hoa-payment-solutions-vantaca)) | Should |
| Check scanning and lockbox | Remote deposit capture and a lockbox service for paper checks | Entrata check scanning ([ResidentPay](https://www.entrata.com/products/residentpay)); Vantaca Lockbox: same-day posting, Positive Pay ([Vantaca](https://www.vantaca.com/vantaca-lockbox)) | Should |
| Instant ledger posting and fast settlement | Payment posts immediately; funds settle in 1-3 days | Entrata: posts instantly, settles within 72 h ([ResidentPay](https://www.entrata.com/products/residentpay)); Rentec next-day, with same-day ACH for a fee ([FAQ](https://www.rentecdirect.com/details/easypay-faq)); Apartments.com Express Pay ([Apartments.com](https://www.apartments.com/rental-manager)) | Must |
| NSF / returned-payment handling | Automatic fee and notice when a payment fails | Buildium "Apply fees and trigger notices automatically when payments fail" ([automation](https://www.buildium.com/features/property-management-automation-software/)); Rentec NSF notice within 48 h ([FAQ](https://www.rentecdirect.com/details/easypay-faq)) | Must |
| Unique payer reference (UK) | Unique account numbers so 100% of bank transfers match the right tenancy | Goodlord ([core](https://www.goodlord.com/product/core-lettings-software)) | Must (UK) |
| Rent reminders | Pre-due and overdue reminders by email, SMS and push | Arthur ([accounting](https://www.arthuronline.co.uk/features/accounting)); TenantCloud ([rent collection](https://www.tenantcloud.com/rent-collection)) | Must |
| Credit-building rent reporting | Positive rent payments reported to bureaus, opt-in | Rentec ([features](https://www.rentecdirect.com/features)); TenantCloud ([rent reporting](https://www.tenantcloud.com/rent-reporting)); Esusu ([Esusu](https://www.esusurent.com/)) | Must (CA law, see §21) |
| Multiple deposit accounts per property or owner | Routes funds to different trust or operating accounts | Rentec multiple merchant accounts ([FAQ](https://www.rentecdirect.com/details/easypay-faq)); Baselane per-property accounts ([Baselane](https://www.baselane.com/)) | Must |
| Payment plans | Tracks deferred rent or dues under a plan | AppFolio ([comms](https://www.appfolio.com/property-manager/communication-service)); Entrata Payments AI negotiates plans ([Entrata](https://www.entrata.com/products/payments-ai)) | Must |

## 10. Late fees, delinquency and collections

| Feature | What it does | Benchmark + source | Priority |
|---|---|---|---|
| Automatic late fees | Flat or daily rules applied automatically, with tenant notification | TurboTenant one-time or daily rules ([features](https://www.turbotenant.com/features/)); RentRedi ([features](https://rentredi.com/features/)); TenantCloud ([rent collection](https://www.tenantcloud.com/rent-collection)) | Must |
| Bulk and case-by-case waivers | Waive or adjust late fees in bulk or one by one | AppFolio ([accounting](https://www.appfolio.com/property-manager/accounting-reporting)) | Must |
| Fees assessed per lease terms | Fee rules come from the lease | AppFolio "fees are assessed accurately… according to your lease agreements" ([accounting](https://www.appfolio.com/property-manager/accounting-reporting)) | Must |
| Delinquency dashboard and alerts | Flags overdue accounts automatically | DoorLoop ([RapidRent](https://www.doorloop.com/features/rapid-rent)) | Must |
| AI collections outreach | Empathetic agent handles balance questions, late notices and plans | Entrata Payments AI (customer story: "Boosted Rent Collections by 40%") ([Entrata](https://www.entrata.com/products/payments-ai)); AppFolio Flows delinquency templates ([Flows](https://www.appfolio.com/product-demos/realm-x-flows)) | Should |
| Debt recovery and collections hand-off | Sends past-due former residents to a collections partner | AppFolio debt recovery ([accounting](https://www.appfolio.com/property-manager/accounting-reporting)) | Should |
| Pre-eviction mediation service | Outsourced tenant mediation, notice serving and an attorney network | Hemlane Eviction Shield ($475 flat pre-eviction fee if cancelled within 6 months) ([Hemlane](https://www.hemlane.com/features/eviction-services/)) | Later |
| UK arrears ground tracking | Tracks arrears against the 3-month mandatory threshold and the 4-week notice | GOV.UK RRA ([GOV.UK](https://www.gov.uk/government/publications/guide-to-the-renters-rights-act/guide-to-the-renters-rights-act)) | Must (UK) |
| UK rent protection insurance | Covers rent arrears and legal costs during court delays; AI chases the claims | Goodlord: up to £100k legal costs, no 12-15 month cap, agent earns up to £120/landlord/yr ([Goodlord](https://www.goodlord.com/letting-agent-solutions/rent-protection-insurance)) | Should (UK) |

## 11. Security deposits, deposit alternatives and deposit protection

| Feature | What it does | Benchmark + source | Priority |
|---|---|---|---|
| Deposit ledger, separate from rent | Tracks deposits held, interest and liability | Buildium "Collect and view every fee, deposit, and refund" ([accounting](https://www.buildium.com/features/property-management-accounting/)) | Must |
| Applicant deposits refunded from escrow | Handles multiple applicants and refunds deposits from escrow | AppFolio ([accounting](https://www.appfolio.com/property-manager/accounting-reporting)) | Must |
| Itemized deposit disposition letter | Itemized deductions, receipts attached above a threshold, statutory deadline timer | CA: 21 days; receipts required above $125; DIY labor must show hourly rate ([CA Courts](https://selfhelp.courts.ca.gov/guide-security-deposits-california)) | Must |
| State-rule engine for deposits | Caps, interest, return deadlines and the required pre-move-out inspection offer, by jurisdiction | CA Civil Code 1950.5 referenced ([CA Courts](https://selfhelp.courts.ca.gov/guide-security-deposits-california)) | Must |
| UK deposit protection registration | Registers with DPS, MyDeposits or TDS within 30 days, issues prescribed information, returns within 10 days | GOV.UK ([deposit protection](https://www.gov.uk/tenancy-deposit-protection)); without protection the landlord can't get possession under the RRA ([RRA guide](https://www.gov.uk/government/publications/guide-to-the-renters-rights-act/guide-to-the-renters-rights-act)) | Must (UK) |
| Deposit cap calculator (UK) | Enforces the legal caps on holding and tenancy deposits | Goodlord "Built-in calculators tell you exactly how much deposits should be" ([Goodlord](https://www.goodlord.com/letting-agent-solutions/tenant-payments)) | Must (UK) |
| Deposit alternatives | No deposit, a reduced deposit, installments, or an interest-bearing full deposit | Obligo: four options, full deposit earns up to 2% APY ([Obligo](https://www.obligo.com/)); LeaseLock Zero Deposit ([LeaseLock](https://leaselock.com/)); Entrata: "50% more coverage than a traditional security deposit" ([Entrata](https://www.entrata.com/products/deposit-alternative)) | Should |
| Digital move-out charge flow | Move-out charges and refunds paid electronically, no paper checks | Obligo ([Obligo](https://www.obligo.com/)) | Should |
| STR security holds | Authorization hold vs a damage deposit, max 7 days (5 on Visa), auto-release | Guesty ([help](https://help.guesty.com/hc/en-gb/articles/9363850717085-What-is-the-difference-between-an-authorization-hold-and-a-security-deposit), [automated deposits](https://help.guesty.com/hc/en-gb/articles/31845297472797-Managing-automated-security-deposits)) | Must (STR) |

## 12. Accounting: general ledger, trust accounting and bank reconciliation

| Feature | What it does | Benchmark + source | Priority |
|---|---|---|---|
| Property-specific chart of accounts and GL | Double-entry ledger per property, tenant, owner and bank account | Rentec "Full general ledger accounting for properties, tenants, and owners" ([Rentec acct](https://www.rentecdirect.com/accounting-features)) | Must |
| One payment posts to many ledgers | A single rent receipt posts to the tenant, property, owner and bank ledgers | Rentec ([Rentec acct](https://www.rentecdirect.com/accounting-features)) | Must |
| Cash and accrual at the same time | Reports in either basis | Rent Manager ([Rent Manager](https://www.rentmanager.com/)) | Must |
| Trust accounting meeting state real-estate board rules | Segregated trust funds with an audit-ready trail | Rentec "trust account certified" ([features](https://www.rentecdirect.com/features)); Rentvine "leader in trust accounting" ([Rentvine](https://www.rentvine.com/)) | Must |
| Three-way reconciliation | Trial balance vs bank rec vs ledger balances | Rentec ([Rentec acct](https://www.rentecdirect.com/accounting-features)) | Must |
| Bank feeds and auto-matching | Plaid feeds with auto-categorization and matching | DoorLoop ([bank sync](https://www.doorloop.com/features/bank-sync)); AppFolio Plaid matching ([accounting](https://www.appfolio.com/property-manager/accounting-reporting)); TenantCloud via Stripe ([reconciliation](https://www.tenantcloud.com/reconciliation)) | Must |
| Automated bank reconciliation | Reconciles statements against checks and deposits | Buildium ([accounting](https://www.buildium.com/features/property-management-accounting/)); AppFolio ([platform](https://www.appfolio.com/performance-platform)) | Must |
| Corporate (management company) books in the same system | Company P&L, cash and undeposited funds alongside client books | Buildium Company Financials ([Buildium](https://www.buildium.com/features/company-financials/)); AppFolio merged chart ([accounting](https://www.appfolio.com/property-manager/accounting-reporting)) | Should |
| Reimbursable expense flagging | Flags rebillable costs at entry and bills them back without a month-end scramble | AppFolio ([accounting](https://www.appfolio.com/property-manager/accounting-reporting)) | Should |
| Credit card transactions and receipt capture | Each card swipe recorded as its own transaction; mobile receipt capture | AppFolio Mobile Receipt Capture ([accounting](https://www.appfolio.com/property-manager/accounting-reporting)) | Should |
| AI bill entry | Email or upload invoices; AI drafts the bill with payee, property and GL | Buildium AI Bill Scan ([Lumina](https://www.buildium.com/features/ai-property-management-software/)); AppFolio: 15 h/month saved, 99% field accuracy ([accounting](https://www.appfolio.com/property-manager/accounting-reporting)); Entrata: 94% accuracy ([P2P](https://www.entrata.com/products/procure-to-pay)) | Should |
| AI month-end close | Automates routine close steps | AppFolio Accounting Performer: "Automates 5 of 8 standard month-end close steps" ([accounting](https://www.appfolio.com/property-manager/accounting-reporting)); RealPage "83% reduction in staff time… month-end close" ([RealPage](https://www.realpage.com/property-management-software/)) | Later |
| Loans payable tracking | Tracks mortgages and loans, creating transactions automatically | AppFolio ([accounting](https://www.appfolio.com/property-manager/accounting-reporting)) | Should |
| Accounting integrations | QuickBooks and Xero sync | DoorLoop QuickBooks ([accounting](https://www.doorloop.com/features/accounting)); Arthur two-way Xero ([Arthur](https://www.arthuronline.co.uk/features/accounting)); Rentec QuickBooks export ([more](https://www.rentecdirect.com/more-features)) | Must |
| Check printing | Prints owner and vendor checks; remote check printing add-on | DoorLoop FAQ ([accounting](https://www.doorloop.com/features/accounting)); Buildium add-on ([pricing](https://www.buildium.com/pricing/)) | Should |
| Data export / warehouse | Exports reports and data to files or a data warehouse | AppFolio ([workflow](https://www.appfolio.com/property-manager/workflow-automation)) | Should |

## 13. Owner management: distributions, owner portal and statements

| Feature | What it does | Benchmark + source | Priority |
|---|---|---|---|
| Owner distributions wizard | Calculates income minus expenses minus reserve and pays by ACH, updating ledgers | Rentec "owner payments wizard… Click SEND" ([Rentec](https://www.rentecdirect.com/details/owner-payments)) | Must |
| Pay bills from the owner's full balance | Pays against the owner's total available funds across properties, with an automatic true-up | AppFolio ([accounting](https://www.appfolio.com/property-manager/accounting-reporting)) | Should |
| Automated management fees | Recurring fee calculation per property | Rentec "fully automated management fees" ([more](https://www.rentecdirect.com/more-features)) | Must |
| Owner statements (scheduled, branded) | Monthly statements as drafts, or auto-published and emailed; bulk actions; PDF/CSV | Hostaway: six-section statement, scheduled auto-statements ([owner portal](https://www.hostaway.com/features/owner-portal/), [statements](https://www.hostaway.com/features/owner-statement/)); Guesty auto-generation and regeneration ([help](https://help.guesty.com/hc/en-gb/articles/9370454795165-Regenerating-owner-statements)) | Must |
| Business-model / revenue-share formulas | Defines net income, commission base and whether channel fees are included | Guesty business models ([help](https://help.guesty.com/hc/en-gb/articles/11298495425181-Revenue-share-in-owner-statements)) | Must (STR), Should (LTR) |
| Owner portal (web and app) | Branded portal with financials, documents, work-order history, vacancies and balances | Buildium ([owner portal](https://www.buildium.com/features/property-owner-portal/)); DoorLoop ([owners](https://www.doorloop.com/features/owners)) | Must |
| Per-owner module permissions | Each module off by default and switched on per owner (full financials vs calendar only) | Hostaway Owner Experience ([owner portal](https://www.hostaway.com/features/owner-portal/)) | Should |
| Owner contribution requests | Owner funds a shortfall from the portal | Buildium FAQ ([owner portal](https://www.buildium.com/features/property-owner-portal/)) | Must |
| Owner approval of invoices and quotes | Owners approve maintenance quotes and invoices | Buildium ([owner portal](https://www.buildium.com/features/property-owner-portal/)); Arthur Owner App ([Arthur](https://www.arthuronline.co.uk/features/stakeholder-management)) | Must |
| Owners create tasks or requests | Owner raises an issue that the team picks up | Buildium customer quote ([owner portal](https://www.buildium.com/features/property-owner-portal/)) | Should |
| Owner stays and blocks (STR) | Owner books personal stays; no charges, but turnover tasks still generated | Hostaway ([help](https://support.hostaway.com/hc/en-us/articles/1260804707449-Reservations-Create-Owner-Stays)) | Must (STR) |
| AI answers owner questions | Owner asks the AI instead of calling the manager | Hostaway CoHost for owners ([statements](https://www.hostaway.com/features/owner-statement/)) | Later |
| Scheduled owner reports | Reports set up once that then send themselves | Buildium ([automation](https://www.buildium.com/features/property-management-automation-software/)) | Must |

## 14. Budgets, CAM, 1099s and tax

| Feature | What it does | Benchmark + source | Priority |
|---|---|---|---|
| Property budgets with variance | Budget vs actual per property | DoorLoop Pro budgeting ([pricing](https://www.doorloop.com/pricing)) | Should |
| Collaborative budgeting with approvals | Browser budgets with comments, version history and approval routing; per-unit and per-sq-ft metrics | Entrata Advanced Budgeting ([Entrata](https://www.entrata.com/products/budgeting)) | Later |
| Multi-year pro forma from the live GL | 2-10 year forecast for refinances and dispositions | Entrata ([budgeting](https://www.entrata.com/products/budgeting)) | Later |
| AI budget drafting | AI proposes the budget | AppFolio Accounting Performer: more accurate on "nearly 2 of 3 line items" ([accounting](https://www.appfolio.com/property-manager/accounting-reporting)); CINC Budget Skill: 5-10 h cut to about 1 min ([CINC](https://cincsystems.com/)) | Later |
| 1099-MISC/NEC e-filing | Tracks owner and vendor payments, flags missing TINs early, files and mails | Buildium: $50 batch + $4.50/form ([1099](https://www.buildium.com/features/1099-efiling/), [pricing](https://www.buildium.com/pricing/)) | Must (US) |
| W-9 / TIN collection from vendors | Vendors upload a W-9 once | HappyCo Vault ([Vendor Connect](https://happy.co/platform/sourcing/vendor-connect)); Vantaca vendor self-verification ([vendor](https://www.vantaca.com/vendor)) | Must (US) |
| Tax-ready landlord reports | Schedule E-style categorized income and expenses | RentRedi ([features](https://rentredi.com/features/)); Baselane tax packages ([Baselane](https://www.baselane.com/)) | Must |
| UK MTD for Income Tax quarterly submissions | Quarterly digital updates through HMRC-recognized software | GOV.UK: mandatory above £50k from Apr 2026, £30k from Apr 2027, £20k from Apr 2028 ([GOV.UK](https://www.gov.uk/guidance/find-out-if-and-when-you-need-to-use-making-tax-digital-for-income-tax)); Landlord Studio ([HMRC](https://www.landlordstudio.com/uk/features/hmrc-reporting)) | Must (UK) |
| Job costing | Budgets, supplier contracts, payments and retention per project | Yardi Breeze Premier ([commercial](https://www.yardibreeze.com/property-types/commercial/)); Entrata job-costing product (listed in sitemap, page not read: [link](https://www.entrata.com/products/job-costing)) | Later |

## 15. Maintenance: requests, AI triage, dispatch and work orders

| Feature | What it does | Benchmark + source | Priority |
|---|---|---|---|
| Resident request with photo and video | Submitted in the app or portal with media; status tracked | RentRedi ([maintenance](https://rentredi.com/maintenance/)); Arthur ([workflow](https://www.arthuronline.co.uk/features/workflow-management)) | Must |
| Picture-based issue picker in 40+ languages | Resident taps an illustrated issue tree instead of free text | Fixflo: "reduce callouts by 20%" ([Fixflo](https://www.fixflo.com/features/reactive-repair-reporting)) | Should |
| AI troubleshooting before dispatch | AI walks the resident through simple fixes using photos and make/model | Fixflo Aidenn, trained on 75k+ repairs, 200+ languages ([Fixflo](https://www.fixflo.com/solutions/aidenn-ai-repairs-maintenance)); AppFolio Maintenance Performer ([Performers](https://www.appfolio.com/product-demos/realm-x-performers)); Latchel "cut dispatches by ~20%" ([Latchel](https://latchel.com/)) | Should |
| Emergency classification by rules | Emergencies defined by the customer's rules; after-hours escalation | AppFolio Performer: rules for issue type, severity, time of day, on-call ([Performers](https://www.appfolio.com/product-demos/realm-x-performers)) | Must (rules), Should (AI) |
| Duplicate ticket suppression | Prevents duplicate and unnecessary tickets | Entrata Maintenance AI ([Entrata](https://www.entrata.com/products/maintenance-ai)) | Should |
| SMS intake without login | Residents text the AI to report issues | Entrata Maintenance AI ([Entrata](https://www.entrata.com/products/maintenance-ai)) | Should |
| Video call for emergencies | Escalates to a live expert video call | Latchel ([Latchel](https://latchel.com/)); Fixflo video calling ([Fixflo](https://www.fixflo.com/features/reactive-repair-reporting)) | Later |
| 24/7 maintenance contact center | Human or AI after-hours call handling that creates work orders | Buildium Maintenance Contact Center by RealPage ([Buildium](https://www.buildium.com/features/property-management-maintenance-software/)); Latchel "deflect 50% of after-hours calls" ([Latchel](https://latchel.com/)) | Should |
| Auto-route to a vendor by category | Rules route the request to the right vendor and notify the tenant | DoorLoop ([work orders](https://www.doorloop.com/features/work-orders)); AppFolio texts the vendor from the work order ([Performers](https://www.appfolio.com/product-demos/realm-x-performers)) | Must |
| Fallback vendor network | Dispatches to a marketplace when in-house technicians are unavailable | AppFolio via Lula Vendor Network ([maintenance](https://www.appfolio.com/property-manager/maintenance)); Fixflo Contractor Marketplace ([Fixflo](https://www.fixflo.com/features/planned-preventative-maintenance)); TenantCloud + Thumbtack ([TenantCloud](https://www.tenantcloud.com/maintenance)) | Should |
| Approval thresholds | Quotes above the owner's threshold wait for approval | Hemlane price threshold ([Hemlane](https://www.hemlane.com/features/repair-coordination/)); Buildium "preferred approvers" (Growth+) ([pricing](https://www.buildium.com/pricing/)) | Must |
| Drag-and-drop technician scheduling | In-house technician calendar | AppFolio ([maintenance](https://www.appfolio.com/property-manager/maintenance)); Rent Manager service tech mapping ([pricing](https://www.rentmanager.com/pricing/)) | Should |
| Vendor ↔ tenant direct scheduling | Vendor arranges access with the tenant without the manager in the middle | DoorLoop customer quote ([work orders](https://www.doorloop.com/features/work-orders)); Rentvine ([Rentvine](https://www.rentvine.com/)) | Must |
| Recurring and preventive work orders | Scheduled lawn care, seasonal inspections, filter changes | Buildium ([maintenance](https://www.buildium.com/features/property-management-maintenance-software/)); Entrata ([facility](https://www.entrata.com/products/facility-management)) | Must |
| Planned compliance maintenance (PPM) | Automatically instructs certified contractors for gas safety, EICR and similar, with an audit trail | Fixflo PPM ([Fixflo](https://www.fixflo.com/features/planned-preventative-maintenance)); Arthur Contractor Marketplace "up to 90% of their planned maintenance" automated ([Arthur](https://www.arthuronline.co.uk/features/workflow-management)) | Must (UK) |
| Time, materials and cost on the work order | Tracks labor, parts and cost; bills the resident or owner | Entrata ([facility](https://www.entrata.com/products/facility-management)); DoorLoop ([work orders](https://www.doorloop.com/features/work-orders)) | Must |
| Work order → bill → owner invoice | Converts a work order into a bill and marks it up per rules | Buildium "Change work orders into bills" ([accounting](https://www.buildium.com/features/property-management-accounting/)); AppFolio automated owner invoices ([maintenance](https://www.appfolio.com/property-manager/maintenance)) | Must |
| Purchase orders and mobile approvals | Approves POs and bills from the phone | AppFolio ([maintenance](https://www.appfolio.com/property-manager/maintenance)); Entrata VendorAccess POs ([P2P](https://www.entrata.com/products/procure-to-pay)) | Should |
| Inventory | Parts inventory linked to work orders | HappyCo ([maintenance ops](https://happy.co/platform/maintenance-operations)); RealPage real-time inventory ([RealPage](https://www.realpage.com/property-management-software/)) | Later |
| Resident SMS status updates and completion survey | Automatic SMS on each status change; satisfaction survey at close | HappyCo ([maintenance ops](https://happy.co/platform/maintenance-operations)); AppFolio automated surveys ([maintenance](https://www.appfolio.com/property-manager/maintenance)) | Must |
| AI work-order summaries and follow-up | Summarizes work orders, monitors vendor progress, closes the loop | Buildium Lumina Maintenance Agent ([Buildium](https://www.buildium.com/features/property-management-maintenance-software/)) | Should |
| Multi-trip bundling | Bundles nearby jobs into one technician trip | Latchel "bundles trips & reuses context" ([Latchel](https://latchel.com/)) | Later |
| UK Section 20 major works (leasehold) | Five-stage consultation workflow that locks steps in order, links to issues, tracks fees | Fixflo ([Section 20](https://www.fixflo.com/features/section-20-major-works-in-fixflo)) | Later (UK block) |
| Awaab's Law hazard timers | Repair deadlines for damp, mould and other hazards (social housing since 27 Oct 2025; applied to the private rented sector (PRS) by the RRA) | GOV.UK ([Awaab's Law](https://www.gov.uk/government/publications/awaabs-law-guidance-for-social-landlords), [RRA](https://www.gov.uk/government/publications/guide-to-the-renters-rights-act/guide-to-the-renters-rights-act)) | Must (UK) |

## 16. Vendor management and vendor portal

| Feature | What it does | Benchmark + source | Priority |
|---|---|---|---|
| Vendor portal and app | Vendors view work orders, accept or decline, add photos, notes and invoices, mark complete | AppFolio Vendor Portal ([comms](https://www.appfolio.com/property-manager/communication-service)); Arthur Contractor App ([Arthur](https://www.arthuronline.co.uk/features/stakeholder-management)) | Must |
| Vendor ACH payments | Pays vendors electronically from the work order or bill | Rentec vendor ACH ([features](https://www.rentecdirect.com/features)); DoorLoop ([work orders](https://www.doorloop.com/features/work-orders)) | Must |
| Virtual card, ACH and check bill-pay | Vendors set their own payment preference | Entrata Bill Pay ([P2P](https://www.entrata.com/products/procure-to-pay)) | Should |
| Vendor payment status visibility | Vendors see where their payment stands without calling | Vantaca vendor portal ([vendor](https://www.vantaca.com/vendor)) | Should |
| Vendor compliance (COI, licenses, W-9) | Stores insurance and licenses with expiry alerts; blocks non-compliant vendors | Entrata + NetVendor credentialing ([P2P](https://www.entrata.com/products/procure-to-pay)); HappyCo Vault with expiry reminders ([Vendor Connect](https://happy.co/platform/sourcing/vendor-connect)); Fixflo contractor certifications ([Fixflo](https://www.fixflo.com/features/planned-preventative-maintenance)) | Must |
| Competitive quotes and bidding | Requests multiple quotes; posts jobs to the public contractor marketplace | Arthur ([workflow](https://www.arthuronline.co.uk/features/workflow-management)); HappyCo Vendor Connect bids ([HappyCo](https://happy.co/platform/sourcing/vendor-connect)) | Should |
| SLAs and KPI dashboards for contractors | Tracks response and completion SLAs | Fixflo dashboards ([Fixflo](https://www.fixflo.com/features/planned-preventative-maintenance)) | Should |
| Vendor self-onboarding of bank details | Vendors verify identity and bank details in the portal | Vantaca ([vendor](https://www.vantaca.com/vendor)) | Should |
| Outsourced maintenance coordination | Third party runs intake, vendors, scheduling and billing | Lula ([Lula](https://lula.life/)); Hemlane ([Hemlane](https://www.hemlane.com/features/repair-coordination/)) | Later |

## 17. Communications

| Feature | What it does | Benchmark + source | Priority |
|---|---|---|---|
| Unified inbox (SMS, email, portal) | One inbox for residents, owners and vendors, with filters | AppFolio Realm-X Messages ([comms](https://www.appfolio.com/property-manager/communication-service)); DoorLoop ([comms](https://www.doorloop.com/features/communication-tools)) | Must |
| Two-way SMS with templates | Individual or mass texts, reply notifications | AppFolio ([comms](https://www.appfolio.com/property-manager/communication-service)); Buildium all plans ([pricing](https://www.buildium.com/pricing/)) | Must |
| Read receipts | Shows who viewed a message and when | DoorLoop ([comms](https://www.doorloop.com/features/communication-tools)) | Must |
| Bulk announcements and email campaigns | Segmented blasts with tracking | DoorLoop ([comms](https://www.doorloop.com/features/communication-tools)); Rent Manager phone broadcast ([Rent Manager](https://www.rentmanager.com/)) | Must |
| Suggested replies and actions | AI drafts responses and proposes next steps from context | AppFolio Messages ([comms](https://www.appfolio.com/property-manager/communication-service)); TownSq "up to three tailored answers" ([TownSq](https://www.townsq.io/)) | Should |
| AI writing (tone and length) | Rewrites notices, e.g. shortened to 140 characters | Buildium Write with AI ([Lumina](https://www.buildium.com/features/ai-property-management-software/)) | Should |
| Telephony integration with caller insights | Screen-pop of the caller's account via Zoom, RingCentral or Teams; AI call summaries | Vantaca ([comms](https://www.vantaca.com/vantaca-communication-tools)); Rent Manager AI call summaries ([Rent Manager](https://www.rentmanager.com/)) | Should |
| AI voice agent | Answers calls in under 3 s, identifies the resident, takes action; same number for texts | Vantaca HOAi Voice ([Vantaca](https://www.vantaca.com/hoai-voice)); Entrata Leasing AI over voice ([Entrata](https://www.entrata.com/products/leasing-ai)) | Later |
| Physical mail automation | Print-and-mail letters automatically | Buildium EZMail ([violations](https://www.buildium.com/features/violations-tracking/)); Rentec automated mail ([features](https://www.rentecdirect.com/features)) | Should |
| Searchable message log per stakeholder | Every email and SMS logged against the record | Arthur ([stakeholder](https://www.arthuronline.co.uk/features/stakeholder-management)) | Must |
| WhatsApp channel | WhatsApp messaging and templates in the inbox | Hostaway ([communication](https://www.hostaway.com/features/communication/)); Guesty ([inbox](https://www.guesty.com/features/unified-inbox/)) | Must (UK/EU/India), Should (US) |
| Outsourced tenant-communication assistant | Third-party team handles noise complaints, HOA violations and lease questions under rules the owner sets | Hemlane Rental Assistant ([Hemlane](https://www.hemlane.com/features/rental-assistant/)) | Later |

## 18. AI and workflow automation layer

| Feature | What it does | Benchmark + source | Priority |
|---|---|---|---|
| Natural-language data assistant | Ask questions across leasing, maintenance and financials; get charts, PDFs and bulk actions | AppFolio Realm-X Assistant ([Assistant](https://www.appfolio.com/product-demos/realm-x-assistant)); Hostaway AI CoHost, which also executes changes on approval ([CoHost](https://www.hostaway.com/features/ai-cohost/)) | Should |
| Bulk segment → personalized message | AI finds the qualifying residents, drafts a personal message for each, and sends | AppFolio ([Assistant](https://www.appfolio.com/product-demos/realm-x-assistant)) | Should |
| No-code workflow builder with triggers | Triggers on events, relative dates or a schedule; tracks status, reassigns steps; template library | AppFolio Flows: templates for applications, collections, renewals, unit turns, listing ([Flows](https://www.appfolio.com/product-demos/realm-x-flows), [workflow](https://www.appfolio.com/property-manager/workflow-automation)); DoorLoop Workflows: "3.5 hours monthly per 100 units" ([DoorLoop](https://www.doorloop.com/features/workflows)); Buildium Workflow Automations ([Buildium](https://www.buildium.com/features/property-management-automation-software/)) | Must |
| Interrupt logic and human hand-off | A flow pauses when a lead replies or a condition is met, and passes full context to staff | AppFolio Flows ([Flows](https://www.appfolio.com/product-demos/realm-x-flows)); Entrata context-rich tasks in OXP Studio ([Entrata](https://www.entrata.com/products/autonomous-lease-progression)) | Must |
| Agents embedded as workflow steps | AI performers run individual steps (pre-qualification, scheduling, intake) under supervision | AppFolio Performers inside Flows ([Flows](https://www.appfolio.com/product-demos/realm-x-flows)) | Should |
| AI leasing agent | 24/7 multichannel lead response and tour booking; activity logged | Entrata Leasing AI ([Entrata](https://www.entrata.com/products/leasing-ai)); AppFolio Leasing Performer ([M&L](https://www.appfolio.com/property-manager/marketing-leasing)); Flows lead nurture "73% increase in lead-to-showing" ([Flows](https://www.appfolio.com/product-demos/realm-x-flows)) | Should |
| AI tenant-question deflection | Answers common tenant questions and creates the work order when needed | DoorLoop AI Assistant "up to 80% of tenant requests" ([DoorLoop AI](https://www.doorloop.com/features/ai)) | Should |
| Knowledge base per property for AI | Facts per listing or community ground the AI's answers | Hostaway AI Replies knowledge base ([Hostaway AI](https://www.hostaway.com/features/hostaway-ai/)); TownSq answers from community documents ([TownSq](https://www.townsq.io/)) | Must (if shipping AI) |
| AI audit and explainability | Every AI action logged with who, what and why | Vantaca HOAi Fleet "see exactly what was done, who did it, and why" ([HOAi](https://www.vantaca.com/hoai)); Entrata explainable rate suggestions ([Entrata](https://www.entrata.com/products/revenue-intelligence)) | Must (if shipping AI) |
| Open API / MCP for external agents | Customer's own agents act on PMS data | Rentvine open API + MCP server ([Rentvine](https://www.rentvine.com/)); Hospitable MCP ([Hospitable](https://hospitable.com/)) | Should |
| Agents that live in Teams or Slack | AI workers operate inside the team's chat tool | Vantaca HOAi Fleet in Microsoft Teams ([HOAi](https://www.vantaca.com/hoai)) | Later |
| Stale-task detector | Read-only agent flags automated tasks that are frequently created but rarely completed | Guesty ([help](https://help.guesty.com/hc/en-gb/articles/38656803075485-Understanding-the-Stale-task-detector-agent)) | Later |

## 19. Utilities, RUBS and sub-metering

| Feature | What it does | Benchmark + source | Priority |
|---|---|---|---|
| RUBS (ratio utility billing) | Splits a master utility bill by occupants or square footage and posts charges to tenant ledgers | Rentec CAM/RUBS included ([more](https://www.rentecdirect.com/more-features)); Yardi Breeze utility billing add-on ([pricing](https://www.yardibreeze.com/pricing/)) | Should |
| Sub-meter billing | Bills residents for metered consumption | Conservice: RUBS, sub-metered, direct, custom ([Conservice](https://www.conservice.com/solutions/expense-recovery/)) | Later |
| Meter management service | Equipment, reads and regulatory tracking for sub-meters | Conservice: "up to 38%" water reduction claim ([Conservice](https://www.conservice.com/solutions/meter-management/)) | Later |
| Consolidated rent + utility invoice | One bill and e-invoice in the resident portal | Entrata ResidentUtility ([Entrata](https://www.entrata.com/products/residentutility)) | Should |
| Utility setup at move-in | Residents connect or transfer utilities in the portal | Buildium ([Resident Center](https://www.buildium.com/features/resident-center/)); AppFolio concierge ([onboarding](https://www.appfolio.com/product-demos/resident-onboarding)) | Should |
| Final bills and regulatory compliance | Automated final bills at move-out; billing configured to local rules | Conservice ([expense recovery](https://www.conservice.com/solutions/expense-recovery/)); Entrata ([ResidentUtility](https://www.entrata.com/products/residentutility)) | Later |

## 20. Insurance

| Feature | What it does | Benchmark + source | Priority |
|---|---|---|---|
| Renters insurance purchase in the portal | Sold in-app, with participation tracking | Buildium/MSI from $12/mo ([pricing](https://www.buildium.com/pricing/), [leasing](https://www.buildium.com/features/property-lease-management/)) | Must |
| Third-party policy verification | Verifies outside policies against requirements; tracks cancellations and non-payment | Entrata Insurance Verification, with gap coverage ([Entrata](https://www.entrata.com/products/insurance-verification)) | Should |
| Master policy / force-placed coverage | Covers every unit automatically; charges through the lease | Entrata Master Policy ([Entrata](https://www.entrata.com/products/master-policy)) | Later |
| Landlord insurance quotes | Pre-filled quote from property data; renewal tracking | TenantCloud ([insurance](https://www.tenantcloud.com/insurance)); Rentec ([ops](https://www.rentecdirect.com/operations-features)) | Should |
| Rent guarantee / lease guarantee | Coverage for default, vacancy and damages | TheGuarantors ([TheGuarantors](https://www.theguarantors.com/)); Goodlord ([rent protection](https://www.goodlord.com/letting-agent-solutions/rent-protection-insurance)) | Should |
| STR damage protection | $0-deductible damage cover per booking; claims within 30 days of checkout, minimum $25, up to 50 files | Guesty Damage Protection, US and MX ([setup](https://help.guesty.com/hc/en-gb/articles/9366306207005-Setting-up-Guesty-Damage-Protection), [claims](https://help.guesty.com/hc/en-gb/articles/9362185966237-Managing-a-Guesty-Damage-Protection-claim)); Truvi pay-per-booking ([Truvi](https://truvi.com/)) | Should (STR) |
| Revenue share on insurance | Manager earns ancillary income | Entrata Deposit Alternative revenue share ([Entrata](https://www.entrata.com/products/deposit-alternative)); Goodlord up to £120/landlord/yr ([Goodlord](https://www.goodlord.com/letting-agent-solutions/rent-protection-insurance)) | Should |

## 21. Compliance (fair housing, US state and local rules, UK)

| Feature | What it does | Benchmark + source | Priority |
|---|---|---|---|
| FCRA adverse-action workflow | Notice includes CRA details and dispute rights; extra credit-score disclosure when a score was used | FTC ([FTC](https://www.ftc.gov/business-guidance/resources/using-consumer-reports-what-landlords-need-know)); CFPB Reg V ([CFPB](https://www.consumerfinance.gov/rules-policy/regulations/1022/)) | Must (US) |
| Consistent screening criteria | Written criteria applied uniformly to reduce fair-housing exposure | Entrata ResidentVerify "applies your criteria consistently" ([Entrata](https://www.entrata.com/products/residentverify)); Snappt "applicant-agnostic view" ([Snappt](https://snappt.com/)); TenantCloud "sort by date to ensure legal compliance" ([TenantCloud](https://www.tenantcloud.com/rental-application)) | Must |
| Fair-housing-safe listing copy checks | Flags discriminatory wording in ads | Rentec "committed to fair housing" page ([features](https://www.rentecdirect.com/features)); TenantCloud fair-housing page (sitemap [link](https://www.tenantcloud.com/fair-housing)). No vendor page confirmed an automated checker | Should |
| CA AB 2747 rent-reporting offer | Since Apr 2025, CA landlords must offer positive rent reporting at lease signing and yearly. Opt-out blocks re-entry for 6 months; written election form | CA leginfo, Civil Code 1954.07 ([AB 2747](https://leginfo.legislature.ca.gov/faces/billNavClient.xhtml?bill_id=202320240AB2747)) | Must (CA) |
| Deposit rules engine | Per-state caps, return deadlines, itemization and receipt thresholds | CA 21 days / $125 receipts ([CA Courts](https://selfhelp.courts.ca.gov/guide-security-deposits-california)) | Must |
| Affordable housing compliance | LIHTC, HUD 50059, RD, HOME eligibility calculations and certifications | Yardi Breeze ([Breeze affordable](https://www.yardibreeze.com/blog/2019/09/affordable-housing-compliance-made-easy/)); DoorLoop Premium affordable reporting ([pricing](https://www.doorloop.com/pricing)) | Later |
| STR registration and verification | Host registration number on listings (NYC Local Law 18; platforms block unverified listings; 30+ day stays exempt) | NYC OSE ([NYC](https://www.nyc.gov/site/specialenforcement/registration-law/registration.page)) | Must (STR) |
| STR guest registration and authority reporting | Guest ID collection and reporting to police or tourism bodies; tourist taxes | Guesty + Chekin (ES, IT, PT, FR, UK and more) ([help](https://help.guesty.com/hc/en-gb/articles/9366304842397-Chekin-Authority-Reporting)); Guesty AutoComply statuses ([help](https://help.guesty.com/hc/en-gb/articles/37743915489053-Tracking-AutoComply-statuses-and-partial-guest-registrations)) | Should (EU) |
| UK: RRA periodic-tenancy model | Assured shorthold tenancies (ASTs) replaced by assured periodic tenancies (APTs) on 1 May 2026; no Section 21; written terms required; government information sheet for existing tenancies | GOV.UK ([RRA guide](https://www.gov.uk/government/publications/guide-to-the-renters-rights-act/guide-to-the-renters-rights-act), [deposit page](https://www.gov.uk/tenancy-deposit-protection)) | Must (UK) |
| UK: no rental bidding; published asking rent | Offers above the advertised rent cannot be accepted | GOV.UK RRA ([guide](https://www.gov.uk/government/publications/guide-to-the-renters-rights-act/guide-to-the-renters-rights-act)) | Must (UK) |
| UK: anti-discrimination (benefits, children) | Blocks "No DSS" / no-children filters | GOV.UK RRA ([guide](https://www.gov.uk/government/publications/guide-to-the-renters-rights-act/guide-to-the-renters-rights-act)) | Must (UK) |
| UK: pet request workflow | Tenant requests a pet; landlord must consider it and record the reasons | GOV.UK RRA ([guide](https://www.gov.uk/government/publications/guide-to-the-renters-rights-act/guide-to-the-renters-rights-act)) | Must (UK) |
| UK: PRS database and ombudsman registration | Tracks landlord and property registration status, since possession is blocked if the property isn't registered | GOV.UK RRA ([guide](https://www.gov.uk/government/publications/guide-to-the-renters-rights-act/guide-to-the-renters-rights-act)) | Must (UK) |
| UK: safety certificate tracker | Gas safety (annual, copy within 28 days), EICR, EPC, smoke and CO alarms, HMO fire; expiry alerts | GOV.UK ([safety](https://www.gov.uk/private-renting/your-landlords-safety-responsibilities)); Landlord Studio per-tenancy checklist ([compliance](https://www.landlordstudio.com/uk/features/landlord-compliance)); Arthur expiring-document alerts ([Arthur](https://www.arthuronline.co.uk/features/property-management-system)) | Must (UK) |
| UK: Right to Rent checks | Checks every adult; repeat checks within 28 days for time-limited status | GOV.UK ([Right to Rent](https://www.gov.uk/check-tenant-right-to-rent-documents)) | Must (UK) |
| UK: Decent Homes and Awaab's Law in the PRS | Hazard response timers and evidence | GOV.UK RRA ([guide](https://www.gov.uk/government/publications/guide-to-the-renters-rights-act/guide-to-the-renters-rights-act)) | Must (UK) |
| Audit logs | Itemized history of edits by user, filterable, with revert | AppFolio ([workflow](https://www.appfolio.com/property-manager/workflow-automation)); DoorLoop Premium ([pricing](https://www.doorloop.com/pricing)) | Must |

## 22. Reporting and analytics

| Feature | What it does | Benchmark + source | Priority |
|---|---|---|---|
| Standard report library | Rent roll, P&L, balance sheet, trial balance, owner statement, vacancy | DoorLoop 100+ reports ([reports](https://www.doorloop.com/features/reports)); Arthur 100+ templates ([Arthur](https://www.arthuronline.co.uk/features/accounting)); Rent Manager 450+ ([Rent Manager](https://www.rentmanager.com/)) | Must |
| Custom report builder and export | Excel, PDF, CSV and QuickBooks export; save and schedule | DoorLoop ([reports](https://www.doorloop.com/features/reports)); Rentvine save and schedule ([Rentvine](https://www.rentvine.com/)) | Must |
| Drill-down financials | Click from a statement line to the transactions | Yardi Breeze ([features](https://www.yardibreeze.com/features/)) | Must |
| Benchmarks against peers | Compares KPIs to localized industry benchmarks | Buildium analytics (Growth+) ([analytics](https://www.buildium.com/features/property-management-analytics/)) | Later |
| Custom dashboards | Role-based dashboards | DoorLoop Premium ([pricing](https://www.doorloop.com/pricing)); RealPage role dashboards ([RealPage](https://www.realpage.com/property-management-software/)) | Should |
| Leasing funnel analytics | Lead → tour → application → lease, by source and agent | AppFolio CRM pipeline ([M&L](https://www.appfolio.com/property-manager/marketing-leasing)); Tenant Turner listing performance ([Tenant Turner](https://tenantturner.com/)) | Should |
| Maintenance KPIs | Response and completion times, SLA breaches, cost per unit | Fixflo dashboards ([Fixflo](https://www.fixflo.com/features/planned-preventative-maintenance)); HappyCo live dashboards ([HappyCo](https://happy.co/platform/maintenance-operations)) | Should |
| STR revenue analytics | ADR, occupancy, revenue by listing over time | Hostaway CoHost ([CoHost](https://www.hostaway.com/features/ai-cohost/)) | Must (STR) |

## 23. Short-term rentals (channel manager, calendars, guest messaging, cleaning)

| Feature | What it does | Benchmark + source | Priority |
|---|---|---|---|
| Channel manager with direct two-way APIs | Real-time sync of availability, rates and reservations with Airbnb, Vrbo, Booking.com, Expedia and Google | Hostaway ([channel manager](https://www.hostaway.com/features/channel-manager/)); Guesty 60+ channels on Pro ([pricing](https://www.guesty.com/pricing/)) | Must (STR) |
| Per-channel content and pricing overrides | Different price or content per OTA (online travel agency) | Hostaway ([channel manager](https://www.hostaway.com/features/channel-manager/)) | Should |
| Multi-calendar (multi, monthly, yearly views) | Color-coded reservation statuses | Hostaway ([help](https://support.hostaway.com/hc/en-us/articles/360002573193-Calendar-Views-Colors-and-Indicators)); Guesty app reviews beg to "bring back old calendar" ([App Store](https://apps.apple.com/us/app/id1344816619)) | Must (STR) |
| Unified guest inbox | Airbnb, Vrbo, Booking, email, SMS and WhatsApp in one inbox; assign, notes, SLAs, one-click translation | Hostaway ([communication](https://www.hostaway.com/features/communication/)); Guesty ([inbox](https://www.guesty.com/features/unified-inbox/)) | Must (STR) |
| Scheduled guest messages | Triggers at booking, before arrival, during the stay and at checkout | Hostaway automates "70%" of about 2,500 messages/month ([automation](https://www.hostaway.com/features/automation/)) | Must (STR) |
| AI auto-reply with per-message review control | Auto-sends or drafts; the manager chooses which message types need review | Hostaway AI Replies ([communication](https://www.hostaway.com/features/communication/)); Guesty ReplyAI and Autopilot ([inbox](https://www.guesty.com/features/unified-inbox/)) | Should |
| Message → task in one click | AI turns a guest message into an assignable task | Guesty AI Task Creation ([inbox](https://www.guesty.com/features/unified-inbox/)); Breezeway Concierge ([Breezeway](https://www.breezeway.io/)) | Should |
| Negative-sentiment escalation | Surfaces unhappy conversations early | Hostaway ([AI](https://www.hostaway.com/features/hostaway-ai/)) | Should |
| Reservation-driven auto tasks | Cleaning and inspection tasks created from bookings; rescheduled or cancelled automatically when the booking changes | Hostaway ([task FAQ](https://support.hostaway.com/hc/en-us/articles/360036505773-Tasks-FAQs)) | Must (STR) |
| Checklist templates on tasks | Sub-steps ticked off individually | Hostaway ([checklists](https://support.hostaway.com/hc/en-us/articles/360002564054-Tasks-Checklist-Templates)) | Must (STR) |
| Cleaner users, groups and dirty/clean status | Property marked "Dirty" at check-in; cleaners notified | Guesty ([cleaning ops](https://help.guesty.com/hc/en-gb/articles/20187928852637-Managing-your-cleaning-operations-in-Guesty)) | Must (STR) |
| Field ops app for cleaners and maintenance | Mobile tasks, photos, AI daily operations feed | Breezeway: 350k+ properties in 90 countries ([Breezeway](https://www.breezeway.io/)); Hostaway mobile tasks ([help](https://support.hostaway.com/hc/en-us/articles/360002564074-Tasks-Dashboard-Mobile-App)) | Must (STR) |
| Dynamic pricing | Daily auto-adjusted rates with min/max guardrails and date overrides | Hostaway "25.1% more revenue per listing" claim ([pricing](https://www.hostaway.com/features/dynamic-pricing/)); PriceLabs syncs with 160+ PMSs ([PriceLabs](https://hello.pricelabs.co/)) | Should |
| Gap-night filling and upsells | Discounts orphan nights; custom fees and upsells in the guest portal and booking engine | Hospitable ([Hospitable](https://hospitable.com/)); Hostaway custom fees ([help](https://support.hostaway.com/hc/en-us/articles/19918681033755-Listings-Manage-Custom-Fees-and-Upsells)) | Should |
| Direct booking website | No-code templates with AI-generated SEO copy | Hostaway Booking Website Pro ([direct booking](https://www.hostaway.com/features/direct-booking/)); Guesty all plans ([pricing](https://www.guesty.com/pricing/)) | Should |
| Guest app / portal | Door codes, Wi-Fi, house rules and check-in form, synced from the property | Guesty Guest App ([help](https://help.guesty.com/hc/en-gb/articles/30877176788765-Sharing-property-information-in-the-Guest-App)) | Should |
| Smart lock automation | Codes generated per booking after payment; battery and network monitoring; many-to-many lock mapping | Hostaway ([smart locks](https://www.hostaway.com/features/smart-locks/)); Guesty review: "Door codes don't set half the time" ([App Store](https://apps.apple.com/us/app/id1344816619)) | Should |
| Guest screening and verification | ID verification from the guest app; avoids known bad actors | Guesty GuestVerify ([help](https://help.guesty.com/hc/en-gb/articles/22313235781277-Setting-up-GuestVerify)); Truvi ([Truvi](https://truvi.com/)) | Should |
| Guest payments, split and installments | Split across cards, guests or installments; post-checkout balance agent | Guesty ([split](https://help.guesty.com/hc/en-gb/articles/20548335510173-Splitting-a-payment), [checkout agent](https://help.guesty.com/hc/en-gb/articles/37301712390813-Understanding-the-Checkout-balance-collection-agent)); Hostaway Stripe wallets and buy-now-pay-later (BNPL) ([help](https://support.hostaway.com/hc/en-us/articles/47174049104923-Stripe-Integration-Configuring-Payment-Methods-APMs)) | Must (STR) |
| Rental agreements for stays | E-sign short-stay contracts | Hostaway ([operations](https://www.hostaway.com/features/operations/)) | Should |
| Tax setup and channel tax sync | VAT, local and occupancy taxes, with per-channel sync limits | Guesty ([help](https://help.guesty.com/hc/en-gb/articles/9364740068637-How-taxes-sync-with-booking-channels)) | Must (STR) |
| Reviews: auto host reviews, replies, show on booking site | Auto-reviews guests; replies to Vrbo reviews; displays reviews on the booking engine | Hostaway ([auto-reviews](https://support.hostaway.com/hc/en-us/articles/360060848813-Host-Reviews-Auto-reviews), [booking engine](https://support.hostaway.com/hc/en-us/articles/13949494929051-Guest-Reviews-Displaying-reviews-in-the-Booking-Engine)) | Should |
| Owner experience in the same app | Owner signs in to the same app: earnings, occupancy, ADR, statements, own stays | Hostaway ([help](https://support.hostaway.com/hc/en-us/articles/52642635886875-Mobile-App-Owner-Experience-for-Property-Managers)); Owners by Guesty averages 1.08★ in recent reviews ([App Store](https://apps.apple.com/us/app/id6749070952)) | Must (STR) |
| Mid-term and long-term stays in the same PMS | Handles 30+ night stays with a lease-like flow | NYC exempts 30+ days ([NYC](https://www.nyc.gov/site/specialenforcement/registration-law/registration.page)). No STR vendor page confirmed a native lease flow | Should |

## 24. HOA and community associations

| Feature | What it does | Benchmark + source | Priority |
|---|---|---|---|
| Assessments and dues billing | Recurring assessments posted to homeowner ledgers; online payments | Buildium "association fees" ([payments](https://www.buildium.com/features/online-rent-payments/)); Vantaca Pay: auto-draft, e-check, card, Apple/Google Pay ([Vantaca](https://www.vantaca.com/hoa-payment-solutions-vantaca)) | Must (HOA) |
| Violations tracking with photos and stages | Preset categories and escalation stages; letters printed and mailed automatically; homeowner sees it in the portal | Buildium ([violations](https://www.buildium.com/features/violations-tracking/)) | Must (HOA) |
| GPS community-map violation drive-bys | Adds and follows up violations from a map in the field | AppFolio ([maintenance](https://www.appfolio.com/property-manager/maintenance)) | Should |
| Architectural review requests | Submission → board vote → completion | AppFolio ([comms](https://www.appfolio.com/property-manager/communication-service)) | Must (HOA) |
| Board portal: invoice approval and check signing | Board members approve invoices and e-sign checks | AppFolio ([comms](https://www.appfolio.com/property-manager/communication-service)) | Must (HOA) |
| Board document and financials access | By-laws, minutes, statements on demand ("a daily board meeting") | Buildium ([HOA comms](https://www.buildium.com/features/homeowner-and-board-communications/)) | Must (HOA) |
| Board discussions and voting | Secure discussions, document sharing, voting tools | Vantaca ([comms](https://www.vantaca.com/vantaca-communication-tools)) | Should |
| Resident directory and message board | Homeowner community features | Buildium ([HOA comms](https://www.buildium.com/features/homeowner-and-board-communications/)) | Should |
| Lockbox check processing | Dedicated PO boxes, same-day posting, Positive Pay; a two-step review resolves up to 80% of exceptions | Vantaca Lockbox ([Vantaca](https://www.vantaca.com/vantaca-lockbox)) | Should |
| Fee and admin billing per action | Each service action bills its fee automatically, so no revenue is lost | Vantaca ([platform](https://www.vantaca.com/platform)) | Should |
| Resale and estoppel processing | Prepares resale certificates; can be outsourced | TownSq resale services ([TownSq](https://www.townsq.io/)) | Later |
| Visitor access and gate control | Guest passes and security in the same app | FRONTSTEPS ([FRONTSTEPS](https://frontsteps.com/?nab=1)) | Later |
| AI homeowner assistant and voice | Answers homeowner calls and texts; broadcast SMS whose replies become work orders | Vantaca HOAi Voice ([Vantaca](https://www.vantaca.com/hoai-voice)); FRONTSTEPS ALLi ([FRONTSTEPS](https://frontsteps.com/?nab=1)) | Later |
| Managed (outsourced) association accounting | Assessment posting, ownership transfers, delinquency notices by humans plus AI | Vantaca Managed Accounting ([Vantaca](https://www.vantaca.com/managed-accounting)) | Later |
| UK block management | Leaseholder communications, communal repairs, building-safety document tagging | Fixflo ([block](https://www.fixflo.com/solutions/block-management-software)) | Later (UK) |

## 25. Commercial leasing

| Feature | What it does | Benchmark + source | Priority |
|---|---|---|---|
| NNN, gross and hybrid lease types | Lease structures for retail, office and industrial | Yardi Breeze ([commercial](https://www.yardibreeze.com/property-types/commercial/)) | Should |
| CAM schedules, expense pools, caps and allocations | Assigns pools by percentage, with caps | Yardi Breeze ([commercial](https://www.yardibreeze.com/property-types/commercial/)) | Should |
| Estimated CAM billing and annual reconciliation | Posts estimates monthly or quarterly; reconciles and issues tenant recovery letters | Yardi Breeze ([features](https://www.yardibreeze.com/features/), [commercial](https://www.yardibreeze.com/property-types/commercial/)); AppFolio CAM ([accounting](https://www.appfolio.com/property-manager/accounting-reporting)); DoorLoop Premium CAM ([pricing](https://www.doorloop.com/pricing)) | Should |
| Rent escalations | Scheduled steps and CPI escalations posted when due | Yardi Breeze ([commercial](https://www.yardibreeze.com/property-types/commercial/)); Buildium "lease escalations" ([portfolios](https://www.buildium.com/portfolios/)) | Should |
| Retail sales tracking (percentage rent) | Records tenant sales for percentage-rent leases | Yardi Breeze "Track sales information for retail leases" ([commercial](https://www.yardibreeze.com/property-types/commercial/)) | Later |
| Fixed or percentage CAM charges for small landlords | Simple CAM invoices | Rentec ([more](https://www.rentecdirect.com/more-features)) | Should |
| Lease abstraction and critical dates | AI extracts financial terms, rights and key dates with citations | VTS ([VTS](https://www.vts.com/)) | Later |
| Lease roll and vacancy exposure | Portfolio-level renewal risk vs market demand | VTS ([VTS](https://www.vts.com/)) | Later |

## 26. Platform: roles, mobile, security, ecosystem

| Feature | What it does | Benchmark + source | Priority |
|---|---|---|---|
| Full-parity manager mobile app | Every feature on mobile, including photo, video and receipt upload | DoorLoop "mirrors your full DoorLoop dashboard" ([mobile](https://www.doorloop.com/features/mobile-apps)) | Must |
| Technician-grade mobile (crash-free, offline photos) | Works in the field with weak signal | AppFolio PM app recent reviews: crashes after photos, logouts during emergencies ([App Store](https://apps.apple.com/us/app/id1057763031)) | Must |
| Multi-company login | One user signed in to several management companies | AppFolio PM 1★ "can only stay log into one account at a time" ([App Store](https://apps.apple.com/us/app/id1057763031)) | Should |
| Custom user roles and property-level permissions | Restricts data by property and role (e.g. maintenance staff) | Yardi Breeze ([commercial](https://www.yardibreeze.com/property-types/commercial/)); AppFolio custom roles ([workflow](https://www.appfolio.com/property-manager/workflow-automation)); TenantCloud team roles ([team](https://www.tenantcloud.com/team-management)) | Must |
| 2FA and encryption at rest | Account security | AppFolio 2FA ([workflow](https://www.appfolio.com/property-manager/workflow-automation)); Buildium RDS encryption ([Resident Center](https://www.buildium.com/features/resident-center/)) | Must |
| Open API, webhooks, Zapier | Integration surface | Buildium Open API (Premium) ([leasing](https://www.buildium.com/features/property-lease-management/)); Rentec Open API ([features](https://www.rentecdirect.com/features)); DoorLoop Zapier + API (Premium) ([pricing](https://www.doorloop.com/pricing)); Hostaway webhooks ([automation](https://www.hostaway.com/features/automation/)) | Should |
| Integration marketplace | Certified partner apps | AppFolio Stack ([workflow](https://www.appfolio.com/property-manager/workflow-automation)); Buildium Marketplace ([portfolios](https://www.buildium.com/portfolios/)); Rent Manager 200+ integrations ([pricing](https://www.rentmanager.com/pricing/)) | Should |
| Document storage | Encrypted file library shared with owners and tenants | Rentec ([more](https://www.rentecdirect.com/more-features)) | Must |
| Banking built in | Free operating and trust accounts | Buildium Premium: 100 free bank accounts ([pricing](https://www.buildium.com/pricing/)); Baselane ([Baselane](https://www.baselane.com/)) | Later |

---

## Evidence: what residents, owners and technicians complain about (App Store, 150 most recent reviews each, pulled Oct 2026)

All-time ratings look excellent: Resident Center 4.78★ from 156.6k ratings, FolioSpace 4.82★ from 8.7k. The recent written reviews tell a different story. Treat these as complaint themes, not satisfaction scores, because people who write reviews skew negative.

| App | Recent avg (n) | Dominant complaint themes |
|---|---|---|
| AppFolio FolioSpace (resident) | 1.82 (150) | Hidden or admin fees; forced AI chat for maintenance ("give me the choice"); can't upload own renters insurance and still charged; hard to tell if rent is paid; 2FA and logout problems after rebrand ([App Store](https://apps.apple.com/us/app/id1376350358)) |
| Buildium Resident Center | 2.47 (150) | $10 payment fees; website disabled to force the app; work orders marked complete when not done; password resets; upsold credit reporting ([App Store](https://apps.apple.com/us/app/id1466854902)) |
| Rent Manager rmResident | 2.42 (150) | Fees ("$6 per $100"); cannot pay partial amounts; no way to message the manager or dispute; outages at month end ([App Store](https://apps.apple.com/us/app/id1540124885)) |
| Entrata Homebody | 1.18 (33) | Login failures; duplicate charges with no support; forced card fees because ACH could not be added; no community messaging ([App Store](https://apps.apple.com/us/app/id6451412538)) |
| AppFolio Property Manager (staff/tech) | 2.37 (137) | Crashes after taking photos; logged out mid-emergency; can't stay logged in to two companies; slow photo uploads on weak signal ([App Store](https://apps.apple.com/us/app/id1057763031)) |
| Owners by Guesty (owner) | 1.08 (13) | Can't see upcoming reservations, statements, cleanings or maintenance; constant logouts ([App Store](https://apps.apple.com/us/app/id6749070952)) |
| Guesty (manager) | 1.86 (78) | Redesigned calendar unusable at 10+ units; actions missing from mobile; AI-only support; door codes not setting ([App Store](https://apps.apple.com/us/app/id1344816619)) |
| Hostaway (manager) | 4.55 (150) | Mostly positive. Negatives cover support escalation, onboarding errors in financial formulas, and billing after cancellation ([App Store](https://apps.apple.com/us/app/id1237641501)) |

---

## Top 12 differentiators for Estate OS

1. **One ledger, many lenses.** A single double-entry ledger that is trust-compliant (three-way reconciliation, per-owner sub-ledgers) and serves LTR, STR, HOA and commercial. Today a manager running both STR and LTR has to buy Guesty or Hostaway alongside AppFolio or Buildium. Hostaway's owner statements and AppFolio's owner true-up show both halves exist, but never in the same product ([Hostaway](https://www.hostaway.com/features/owner-portal/), [AppFolio](https://www.appfolio.com/property-manager/accounting-reporting)).
2. **Radically transparent payment fees.** Show who pays what before the pay button and offer one genuinely free ACH path. Fee anger is the top 1★ theme across every resident app sampled. Rentec already proves the model with one free ACH per unit per month ([Rentec FAQ](https://www.rentecdirect.com/details/easypay-faq)).
3. **AI that is optional and auditable.** Every AI intake has a "use the form instead" escape hatch. Every agent action is logged with who, what and why (the Vantaca pattern), and the customer's rules decide emergencies and dispatch (the AppFolio pattern). FolioSpace reviews show what happens when AI is forced on residents ([App Store](https://apps.apple.com/us/app/id1376350358), [Vantaca HOAi](https://www.vantaca.com/hoai), [AppFolio Performers](https://www.appfolio.com/product-demos/realm-x-performers)).
4. **Built-in jurisdiction rule packs.** Deposits (CA 21 days, $125 receipt rule), CA AB 2747 rent-reporting offer, FCRA adverse action, and the UK RRA (periodic tenancies, Section 13, possession grounds, PRS database, pets, no bidding, Awaab's Law). Each pack produces tasks, notices and deadline timers rather than PDFs. Only Goodlord markets "rules built into the workflow", and only for UK lettings ([Goodlord](https://www.goodlord.com/lettings-agent-solutions-goodlord)).
5. **Technician app that survives the field.** Offline-first capture, a crash-free camera, persistent sessions and multi-company login. These are the exact failures in AppFolio's staff-app reviews ([App Store](https://apps.apple.com/us/app/id1057763031)).
6. **Owner app people actually use.** Monthly statement, cash and occupancy snapshot, approvals for quotes and invoices, the owner's own maintenance history, and owner stays, with modules toggled per owner ([Hostaway](https://www.hostaway.com/features/owner-portal/)). Owners by Guesty at 1.08★ shows how low the bar is.
7. **Maintenance that resolves before it dispatches.** Picture-based intake in 40+ languages (Fixflo), AI make-safe troubleshooting (Aidenn and Latchel report about 20% fewer dispatches), customer-defined emergency rules, and a fallback vendor marketplace when in-house staff are busy ([Fixflo](https://www.fixflo.com/features/reactive-repair-reporting), [Latchel](https://latchel.com/), [AppFolio](https://www.appfolio.com/property-manager/maintenance)).
8. **Fraud-first screening in one flow.** Bureau report, bank or payroll income, document-tamper detection, ID liveness and consistent criteria, with an adverse-action letter generated automatically. Today buyers assemble TransUnion + Plaid + Snappt + PreciseID themselves ([Snappt](https://snappt.com/), [Entrata](https://www.entrata.com/products/preciseid), [FTC](https://www.ftc.gov/business-guidance/resources/using-consumer-reports-what-landlords-need-know)).
9. **Unified inbox with WhatsApp for every stakeholder type.** STR tools already have WhatsApp and SLAs; LTR tools mostly stop at SMS and email. Bringing tenants, owners, vendors, HOA boards and guests into one assignable, SLA-tracked inbox is the Hostaway inbox applied to the whole of property management ([Hostaway](https://www.hostaway.com/features/communication/)).
10. **Workflow builder with interrupt logic, plus embedded agents, from the entry tier.** AppFolio gates Flows to Plus and DoorLoop gates Workflows to Pro. Shipping trigger → steps → human hand-off on every tier is a clear wedge ([AppFolio pricing](https://www.appfolio.com/pricing), [DoorLoop pricing](https://www.doorloop.com/pricing)).
11. **Resident choice architecture.** Partial-payment rules, rent split with roommates, flexible installments, cash at retail, deposit alternatives, and bring-your-own insurance, each configurable per property with defaults that comply with the law. Incumbents bolt these on as separate partner add-ons ([Obligo](https://www.obligo.com/), [Buildium Resident Center](https://www.buildium.com/features/resident-center/)).
12. **Open data and an MCP endpoint.** A read/write API and MCP server on every paid tier, so customers' own agents can act on their data. Rentvine and Hospitable already market this, while incumbents keep read/write API for their top tier (AppFolio Max) ([Rentvine](https://www.rentvine.com/), [Hospitable](https://hospitable.com/), [AppFolio pricing](https://www.appfolio.com/pricing)).

---

## UX patterns worth copying

### Tenant / resident / guest view
- **Guided move-in checklist** with a progress bar for lease, deposit, insurance, utilities and autopay. The same steps feed the manager's widget ([AppFolio](https://www.appfolio.com/product-demos/resident-onboarding)).
- **A "Paid ✓ / Due $X on date" hero card** above the itemized ledger. This fixes the most common confusion complaint ([FolioSpace reviews](https://apps.apple.com/us/app/id1376350358)).
- **Fee shown before the pay button**, with the free method listed first (Rentec pattern: free ACH, 2.95% card) ([Rentec](https://www.rentecdirect.com/details/tenant-portal)).
- **Picture-tree issue picker**, then optional AI troubleshooting, then a request with photos and video and a live status timeline ([Fixflo](https://www.fixflo.com/features/reactive-repair-reporting)).
- **"Upload my own policy" next to "Buy insurance"** ([Rentec](https://www.rentecdirect.com/details/tenant-portal)).
- **Roommate split**: each roommate has a login and pays their share or the whole ([TenantCloud](https://www.tenantcloud.com/roommates)).
- **Guest app**: door code, Wi-Fi and house rules appear when relevant; upsells sit in the same place ([Guesty](https://help.guesty.com/hc/en-gb/articles/30877176788765-Sharing-property-information-in-the-Guest-App), [Hostaway](https://support.hostaway.com/hc/en-us/articles/19918681033755-Listings-Manage-Custom-Fees-and-Upsells)).
- **UK tenant app**: give notice to end a periodic tenancy in-app ([Arthur](https://www.arthuronline.co.uk/features/occupancy-management)).

### Owner view
- **Snapshot home screen**: earnings this month, occupancy, average rate, latest statement with download ([Hostaway owner app](https://support.hostaway.com/hc/en-us/articles/52642635886875-Mobile-App-Owner-Experience-for-Property-Managers)).
- **Statement anatomy**: headline totals with the formula behind each figure → income per reservation or lease → expenses → attached receipts → payouts ([Hostaway](https://www.hostaway.com/features/owner-portal/)).
- **Approval inbox** for quotes over threshold, invoices and contribution requests ([Buildium](https://www.buildium.com/features/property-owner-portal/), [Hemlane](https://www.hemlane.com/features/repair-coordination/)).
- **Modules off by default, toggled per owner** (hands-off vs detail-focused owners) ([Hostaway](https://www.hostaway.com/features/owner-portal/)).
- **Own-use blocking** (owner stays) with no charges but auto-generated turnover tasks ([Hostaway help](https://support.hostaway.com/hc/en-us/articles/1260804707449-Reservations-Create-Owner-Stays)).

### Manager / office view
- **Prioritized action inbox**: guest cards, messages and AI-suggested actions ranked by urgency ([AppFolio M&L](https://www.appfolio.com/property-manager/marketing-leasing), [comms](https://www.appfolio.com/property-manager/communication-service)).
- **Ask-anything bar**: prompt → chart, PDF or bulk message with preview, then send ([AppFolio Assistant](https://www.appfolio.com/product-demos/realm-x-assistant)); "approve the next step" confirmation for AI changes ([Hostaway CoHost](https://www.hostaway.com/features/ai-cohost/)).
- **Flow status board**: in-progress or behind-schedule flows, reassign a step in two clicks ([AppFolio workflow](https://www.appfolio.com/property-manager/workflow-automation)).
- **Unit turn board / make-ready Kanban** ([AppFolio](https://www.appfolio.com/property-manager/maintenance), [Rent Manager](https://www.rentmanager.com/)).
- **Owner distribution wizard**: income − expenses − reserve → Send ([Rentec](https://www.rentecdirect.com/details/owner-payments)).
- **Compliance checklist per tenancy**: green, amber or red for gas safety, EICR, EPC, How to Rent and deposit ([Landlord Studio](https://www.landlordstudio.com/uk/features/landlord-compliance)).
- **Section 20 / multi-stage legal workflows** whose steps lock in order, each date-stamped and attributed ([Fixflo](https://www.fixflo.com/features/section-20-major-works-in-fixflo)).
- **Calendar that scales**: multi-property view usable at 10+ units on a phone. This is the anti-pattern behind Guesty's redesign backlash ([App Store](https://apps.apple.com/us/app/id1344816619)).

### Technician / vendor / cleaner view
- **Today list** of assignments with step-by-step checklists, photo capture and an SMS update to the resident on each status change ([HappyCo](https://happy.co/platform/maintenance-operations)).
- **Accept or decline the job**, then progress photos, then upload the invoice, then mark complete, all in one vendor app ([Arthur](https://www.arthuronline.co.uk/features/workflow-management), [AppFolio vendor portal](https://www.appfolio.com/property-manager/communication-service)).
- **Talk-to-report inspections** that build the report while the inspector walks ([zInspector](https://www.zinspector.com/)).
- **Offline-first sync** with an explicit "queued uploads" indicator ([Buildium/HappyCo](https://www.buildium.com/features/mobile-property-inspection-app/)).
- **Vendor compliance vault**: upload the COI and W-9 once; they auto-attach to bids; expiry reminders ([HappyCo Vendor Connect](https://happy.co/platform/sourcing/vendor-connect)).
- **Payment status tracker** for vendors ([Vantaca](https://www.vantaca.com/vendor)).
- **Cleaner task auto-reschedules** when the reservation changes ([Hostaway](https://support.hostaway.com/hc/en-us/articles/360036505773-Tasks-FAQs)).

---

## Not verified (claims excluded from the tables or flagged)

- **AppFolio per-unit pricing**, Rent Manager, Entrata, RealPage, Hostaway, Vantaca and Fixflo prices: quote-only; nothing fetched.
- **AppFolio help-center (help.appfolio.com) and Buildium help-center (help.buildium.com) articles.** Both need a login or JS that the reader couldn't render, so the exact late-fee settings (grace period, caps, daily max) and the partial-payment toggles were not confirmed on help pages. The late-fee rows rely on marketing pages (AppFolio, TurboTenant, TenantCloud, RentRedi).
- **Blocking ACH or checks after NSF ("certified funds only")**: common in PM software but not confirmed on any fetched page; removed from the tables.
- **Automated fair-housing ad-copy checker**: no vendor page confirmed one. The fair-housing pages fetched were policy statements only.
- **HUD 2024 screening and advertising guidance and its 2025 withdrawal**: the HUD PDF URL returned an error page.
- **Other US state deposit rules** beyond California (NY, TX and others): the NY AG and Texas pages were blocked or empty, and the Rentec state-law blog sat behind bot protection (not bypassed).
- **RRA dates after 1 May 2026** (PRS database launch, ombudsman start, Decent Homes timing, Awaab's Law in the PRS): the GOV.UK roadmap and landlord-guidance URLs returned "page not found" or only a landing page. The RRA guide confirms these are in the Act, but not their start dates.
- **Tenant Fees Act deposit caps** (5 weeks' rent under £50k annual rent; 1 week holding deposit): the guidance page fetched was the archived index. Caps were not quoted from source.
- **Vantaca board voting and elections** beyond "voting tools", and HOA reserve-study features: not seen on fetched pages.
- **Rently, Turno, Rentcheck, PayYourRent and Bilt feature details**: pages rendered too little text (JS or redirect) to cite specific features.
- **Statistics in the tables are vendor marketing claims**: AppFolio's 73%, 20% and 2.8% NOI; DoorLoop's 80% and 3.5 h; Hostaway's 25.1% and 70%; Entrata's 40% and 350% ROI; Latchel's ~20% and 50%; Second Nature's 64-point boost. None is independently audited.
- **App Store recency samples** (n ≤ 150) skew negative and are not representative of overall satisfaction. All-time averages are 4.3-4.8★ for the same apps.
