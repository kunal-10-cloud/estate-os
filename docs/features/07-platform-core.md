# 07 · Platform core and enterprise readiness

Scope: everything under the modules that a brokerage, franchise, property manager or developer checks before signing. That covers org structure, roles, identity, audit, data ownership, MLS data and display rules, syndication, APIs and the marketplace, imports, reporting, recruiting intelligence, training, the intranet, brand control, websites, billing, mobile, notifications, search, AI governance, security and compliance, uptime and white-label.

Research date: 8 Oct 2026. Builds on `../01-market-research.md` (Module 0) and `../02-plan.md`. Evidence comes from about 110 page fetches (roughly 75 usable) of vendor docs, regulator pages and trade press. Brave search started returning bot checks partway through, so some topics have no source (see **Not verified**). Priorities: **Must** means needed for the first brokerage or enterprise sale. **Should** means it is expected within about 12 months. **Later** means it is a differentiator or serves a niche segment.

## What the evidence says, in five points

1. **MLS data is now one standard reached through several pipes.** RESO certifies Web API Core 2.0.0 and Data Dictionary 2.0. "At least 90%" of MLSs have certified Web API services, there are 484 US MLS systems, and RETS certification ended in 2018 ([RESO certification](https://www.reso.org/certification/)). Aggregators (Bridge, Trestle, Spark, MLS Grid) normalize to the Data Dictionary but differ on rate limits, deletes and licensing. Estate OS should build one RESO-shaped ingestion layer with an adapter per aggregator, not one integration per MLS.
2. **Display rules have become a moving compliance target.** Since 2025 these have changed: NAR's *Multiple Listing Options for Sellers* (office-exclusive and delayed-marketing exempt listings, with seller disclosure), Zillow's *Listing Access Standards* (48 listings banned and 1,202 violation notices sent to 24 brokerages by Nov 2025), MRED's "Some listings have been excluded from this website" rule, and the Zillow v. Compass/MRED litigation (preliminary injunction denied on 15 Sep 2026). The platform needs a rules engine on each listing and each display surface, not hard-coded logic.
3. **Incumbents are shipping APIs and MCP together.** BoldTrail's developer hub leads with MCP ([developerhub.boldtrail.com](https://developerhub.boldtrail.com/)). Rechat launched an MCP server on 3 Aug 2026 and it keeps the user's own permissions ([Rechat help](https://help.rechat.com/appendix/integrations/connect-rechat-to-your-ai-assistant)). Lofty publishes 94 endpoints, AI endpoints and documented webhook retry rules ([Lofty dev](https://developer.lofty.com/)). Zapier now exposes FUB and kvCORE actions through Zapier MCP ([Zapier FUB](https://zapier.com/apps/follow-up-boss/integrations)). The minimum to compete is a public REST API, signed webhooks, an MCP server and Zapier.
4. **Brokerage intelligence is moving from reports to AI recommendations.** Lone Wolf's *Talent* in BrokerMetrics ships Recruit, Pitch, Retain, Answer, Social Research and Mapping on nightly MLS data used by "more than 10,000 brokerages". It debuts "Aspen", Lone Wolf's AI teammate, and cites a survey finding that 44% of brokerages track no flight-risk signals ([GlobeNewswire, 28 Jul 2026](https://www.globenewswire.com/news-release/2026/07/28/3334647/0/en/lone-wolf-launches-talent-in-brokermetrics-an-ai-powered-solution-for-agent-recruiting-and-retention.html)).
5. **Compliance deadlines in 2026–2027 favor a platform built with consent and audit from day one.** These include India's DPDP Rules (operational duties from about 13 May 2027), the Colorado AI Act (pushed to 30 Jun 2026), HUD's 2024 guidance on AI ad targeting, TCPA revocation "in any reasonable manner", 10DLC registration, and CAN-SPAM penalties of $53,088 per email.

---

## 1. Org structure, tenancy and franchise hierarchy

| Feature | What it does | Benchmark + source | Priority |
|---|---|---|---|
| Arbitrary-depth org tree (Enterprise → Brand → Region → Office → Team → Agent) | One tenant models franchisor, franchisees, regions, offices and teams. Rules, settings and branding inherit down the tree and can be overridden at each level | Paperless Pipeline lets you "spin up locations with their own admins, checklists, and settings. Each office sees only what it needs while leadership keeps a clean, company-wide view" ([Paperless](https://www.paperlesspipeline.com/transaction-software-features)); Lone Wolf serves "agents, brokers, franchises, MLSs, and associations" ([GlobeNewswire](https://www.globenewswire.com/news-release/2026/07/28/3334647/0/en/lone-wolf-launches-talent-in-brokermetrics-an-ai-powered-solution-for-agent-recruiting-and-retention.html)) | Must |
| Office-level admins with a "primary admin" per office | Agents always know who approves their files. Office admins can't see sibling offices | "A primary admin per office, so agents always know who to reply to" ([Paperless](https://www.paperlesspipeline.com/transaction-software-features)) | Must |
| Team switcher / multi-membership | One user can belong to several teams or offices, or work as a TC across brokerages, and switch context without logging out | Rechat "hierarchy permissions, privacy controls, and a team switcher" ([Rechat](https://rechat.ai/)); AppFolio and Yardi logout complaints in Module 0 of `01-market-research.md` | Must |
| Legal entity per office (state licence, broker of record, designated broker) | Stores the licensed entity, the DB/RB name and the licence number for each state. These feed ad disclaimers, IDX attribution and state compliance text | Real Brokerage lists separate licensed entities and designated brokers per state and province ([onereal.com](https://onereal.com/)) | Must |
| Separate tenants for property management, developer and brokerage, linked by graph | A PM company, a builder and a brokerage under one parent share people and properties but keep separate ledgers and permission trees | Sell.Do "Ten connected modules", role-based views for Marketing, Sales Heads and CXOs ([Sell.Do](https://www.sell.do/)) | Should |
| Franchise roll-up reporting with franchisee data walls | The franchisor sees aggregate production and royalties. Franchisee contact data stays private unless shared | Inferred from Paperless "company-wide view" plus the data-ownership complaint in `01` (kvCORE billing after a brokerage switch) | Should |
| Cross-org sharing grants (co-listing, referral partner, lender, TC firm) | Time-boxed, scoped access for an outside organization to one deal or contact | FUB Lender role and Collaborators ([FUB roles](https://help.followupboss.com/hc/en-us/articles/4402370636567-Users-Roles-Permissions), [FUB collaborators](https://help.followupboss.com/hc/en-us/articles/4402372130327-Collaborators)) | Must |
| Org merge / acquisition tooling | Moves offices, agents and records between tenants with an audit trail, for brokerage M&A | **Not verified**; inferred | Later |

## 2. Roles and permissions

| Feature | What it does | Benchmark + source | Priority |
|---|---|---|---|
| Standard role catalogue | Owner, Admin, Broker/Managing Broker, Office Admin, Team Lead, Agent, ISA, TC, Lender/Partner, Marketing, Accounting, PM, Property Owner, Tenant, Vendor, Channel Partner, Read-only Auditor | FUB has five roles (Owner, Admin, Agent, Lender, ISA/Account Team Lead) plus Team Lead ([FUB glossary/roles](https://help.followupboss.com/hc/en-us/articles/4402370636567-Users-Roles-Permissions)); Lone Wolf "dedicated roles for every team member" ([lwolf.com](https://www.lwolf.com/)) | Must |
| Record-scope permissions per object: All / Team's / Office's / Own / None, plus an "include unassigned" option | Separate view, edit, create and delete scopes for each object (contacts, deals, listings, leases, units) | HubSpot "All / Their team's / Their [Objects]" with an Unassigned checkbox, edit including merge ([HubSpot](https://knowledge.hubspot.com/user-management/hubspot-user-permissions-guide)); FUB scopes deals as all / team / personal | Must |
| Collaborator sharing at record level | Gives an ISA, team lead or partner access to one record without raising their role. Can be bulk-added and automated through action plans | FUB Collaborators ([FUB](https://help.followupboss.com/hc/en-us/articles/4402372130327-Collaborators)) | Must |
| Ponds / shared queues | Leads sit in a shared pool that only assigned members can see and claim | FUB "View lead ponds they are assigned to" ([FUB roles](https://help.followupboss.com/hc/en-us/articles/4402370636567-Users-Roles-Permissions)) | Must |
| Sensitive-action permissions | Export, delete, import, port phone numbers, billing, API keys, webhook creation, AI-agent enablement. Each is a separate grant | FUB: only the owner manages billing and porting, and "An owner will be notified of any export done on their account"; only the owner creates webhooks ([FUB roles](https://help.followupboss.com/hc/en-us/articles/4402370636567-Users-Roles-Permissions), [FUB webhooks](https://docs.followupboss.com/reference/webhooks-guide)) | Must |
| Custom roles / permission sets layered on base roles | Enterprises clone and adjust roles. Permission sets add capabilities without new roles | HubSpot customizable permissions ([HubSpot](https://knowledge.hubspot.com/user-management/hubspot-user-permissions-guide)); Salesforce role hierarchy + permission sets (pattern) | Should |
| Field-level security | Hides commission, SSN/PAN/Aadhaar, bank details, tenant screening results and DOB from roles that don't need them | HubSpot "limit edit access to properties" ([HubSpot](https://knowledge.hubspot.com/user-management/hubspot-user-permissions-guide)); Salesforce Shield encryption per field ([Shield](https://www.salesforce.com/platform/shield/)) | Must |
| External portals as roles (owner, tenant, buyer/seller client, CP) | The same permission engine powers client portals, so a CP sees only inventory and bookings it is allowed to see | Sisu client portal ([sisu.co](https://sisu.co/)); Sell.Do CP inventory (`01`) | Must |
| Permission simulator ("view as") | An admin previews exactly what a user or role sees before saving | **Not verified** in RE vendors; standard in Salesforce | Should |
| AI and integrations inherit the user's permissions | MCP, Zapier and API tokens can never exceed the granting user's scope | Rechat: "Your permissions still apply: Your AI assistant can only access the Rechat information and tools available to the Rechat account you use" ([Rechat help](https://help.rechat.com/appendix/integrations/connect-rechat-to-your-ai-assistant)); Zapier MCP "you control which actions your AI can touch" ([Zapier](https://zapier.com/apps/follow-up-boss/integrations)) | Must |

## 3. Identity: SSO, MFA, provisioning, sessions

| Feature | What it does | Benchmark + source | Priority |
|---|---|---|---|
| Email/password + passkeys + TOTP/SMS 2-step verification, "remember this device" | Baseline account security without the repeated logouts users complain about | BoldTrail 2-Step Verification (2SV) (help center snippet via [help.insiderealestate.com](https://help.insiderealestate.com/en)); AppFolio and Yardi logout complaints (`01`) | Must |
| Enforced MFA policy per org | Admins can require MFA for all users or for privileged roles | Pattern; Salesforce Shield blocks risky logins ([Shield](https://www.salesforce.com/platform/shield/)) | Must |
| SAML 2.0 / OIDC SSO with the enterprise IdP (Okta, Entra, Google) | Large brokerages and franchises require IdP login | Spark API prefers OpenID Connect ([Spark auth](https://www.sparkplatform.com/docs/authentication/authentication)); MoxiWorks Authentication service issues OAuth client credentials ([MoxiWorks platform](https://moxiworks-platform.github.io/)) | Must (enterprise tier) |
| SCIM 2.0 user provisioning and deprovisioning | Adds and removes agents automatically from HR/roster and IdP. Agent turnover is constant | SCIM standard ([scim.cloud](https://scim.cloud/)) | Should |
| MLS-dashboard SSO ("launch from MLS") | Agents arrive already logged in from the MLS SSO dashboard, which is how many MLS-provided tools are launched | Clareity is the common MLS SSO vendor; page failed TLS, so **not verified** | Should |
| Roster sync from MLS Member/Office resources + ULI | New licensees auto-create; departed agents are flagged; one licensee is de-duplicated across MLSs | RESO Member/Office resources ([RESO DD](https://www.reso.org/data-dictionary/)); RESO ULI "de-duplicate licensees across markets" ([RESO IDs](https://www.reso.org/reso-unique-identifiers/)) | Should |
| Session and device management | Lists active sessions and devices, with remote sign-out and wipe of offline caches on a lost phone | Pattern; ties to mobile offline (section 18) | Must |
| Delegated / impersonation login with audit | Support or an admin "logs in as" a user with consent, and the session is fully logged | Pattern (Salesforce "login as"); **not verified** in RE vendors | Should |

## 4. Audit logs and data governance

| Feature | What it does | Benchmark + source | Priority |
|---|---|---|---|
| Immutable audit log (who, what, when, before/after, IP, device, via UI/API/AI) | Covers every create, update, delete, export, permission change, login and AI action | Paperless "complete activity history"; reviews are "logged, dated and attributed in the transaction history" ([Paperless](https://www.paperlesspipeline.com/transaction-software-features)); DoorLoop audit logs (`01`) | Must |
| Field history on regulated fields (price, commission, trust ledger, consent, listing status) | Field-level history kept for 7–10 years for regulator and DRE audits | Salesforce Field Audit Trail ([Shield](https://www.salesforce.com/platform/shield/)) | Must |
| Export alerts and bulk-action guardrails | Notifies the owner on export and can block or flag large exports by departing agents | FUB owner notified of any export ([FUB roles](https://help.followupboss.com/hc/en-us/articles/4402370636567-Users-Roles-Permissions)); Shield "block … bulk exports" ([Shield](https://www.salesforce.com/platform/shield/)) | Must |
| Audit log API + SIEM streaming | Enterprises send logs to Splunk or Datadog | Salesforce Event Monitoring ([Shield](https://www.salesforce.com/platform/shield/)) | Should |
| Sensitive-data discovery | Scans notes and files for SSNs, bank numbers, Aadhaar and PAN, then flags or redacts them | Salesforce Data Detect ([Shield](https://www.salesforce.com/platform/shield/)) | Later |
| Retention policies + legal hold | Retention configurable by record type and jurisdiction (e.g., state transaction-file retention), with legal hold overriding deletion | Paperless "free monthly backups… When the auditor calls, you're already done" ([Paperless](https://www.paperlesspipeline.com/transaction-software-features)) | Must |
| Customer-accessible backups | Monthly downloadable full backup per tenant | Paperless free monthly backups (above) | Should |

## 5. Data ownership and portability

| Feature | What it does | Benchmark + source | Priority |
|---|---|---|---|
| Ownership class on every record: `agent_owned`, `team_owned`, `brokerage_owned`, `shared` | Decides what an agent takes when they leave and what stays. Shown in the UI and the contract | White space; kvCORE lead service kept billing after a brokerage switch (`01`, [App Store](https://apps.apple.com/us/app/id1304578287)) | Must |
| One-click "agent departure" workflow | Re-assigns brokerage-owned leads, hands the agent a portable export of agent-owned contacts, stops seat billing and revokes tokens in one step | White space; FUB "Switching from Lender to Agent Role" requires delete and recreate, which shows the pain ([FUB help](https://help.followupboss.com/hc/en-us/articles/8579623423639-Switching-from-Lender-to-Agent-Role)) | Must |
| Agent-carry-over account ("bring your book") | The agent's personal workspace survives a brokerage change. The new brokerage is attached as a new org membership | White space | Should |
| Full tenant export in open formats (CSV/JSON + files), plus RESO Common Format for listings, members and offices | Machine-readable export, for GDPR Art. 20 portability and as the anti-lock-in pitch | GDPR Art. 20 "structured, commonly used and machine-readable format… transmit… directly from one controller to another" ([gdpr-info](https://gdpr-info.eu/art-20-gdpr/)); RESO RCF lets "a brokerage and its website vendor, CRM company, lead gen portal and back office tools… talk to each other" ([RCF](https://www.reso.org/reso-common-format/)) | Must |
| Data subject request (DSR) console | Access, delete, correct, opt-out of sale/share, limit sensitive PI, with SLA timers per law | CCPA rights incl. GPC opt-out, correct, limit sensitive PI ([CA AG](https://oag.ca.gov/privacy/ccpa)) | Must |
| Delete semantics that cascade visibly | Deleting a person removes linked notes, calls and texts. Emit events for all of them (FUB does not) | FUB: "When a person is deleted all associated data is deleted… There will not be any delete events triggered for these resources" ([FUB webhooks](https://docs.followupboss.com/reference/webhooks-guide)) | Should |

## 6. MLS / IDX / VOW data ingestion

| Feature | What it does | Benchmark + source | Priority |
|---|---|---|---|
| RESO Web API (OData) client with Data Dictionary 2.0 canonical schema | One internal listing schema (Property, Member, Office, Media, OpenHouse, Rooms, UnitTypes). Local fields are kept as extensions | RESO DD 2.0 "largest-ever leap forward in data consistency"; resources = Property, Member, Office, Media ([RESO DD](https://www.reso.org/data-dictionary/)); Web API Core 2.0.0 ([RESO Web API](https://www.reso.org/reso-web-api/)) | Must |
| Aggregator adapters: Bridge, Trestle, Spark/FBS, MLS Grid, plus direct MLS Web API, plus legacy RETS fallback | Covers most US/CA MLSs through 4–5 pipes | Bridge: RESO Web API + RETS + Bridge Web API ([Bridge](https://bridgedataoutput.com/docs/platform/)); Trestle: DD 2.0 certified, WebAPI + RETS ([Trestle](https://trestle-documentation.corelogic.com/)); Spark: Listings, Contacts, Market Stats ([Spark](https://sparkplatform.com/docs/overview/api)); MLS Grid ([docs](https://docs.mlsgrid.com/)) | Must |
| Replication engine with rate-limit governors per source | Incremental sync on `ModificationTimestamp`, nextLink paging, per-source throttles (MLS Grid: 2 RPS and 4 GB/hour; Bridge: hourly + burst headers; 200-record pages) | MLS Grid "No more than 2 request per second… No more than 4 GB downloaded in any given hour" ([MLS Grid](https://docs.mlsgrid.com/)); Bridge `Application-RateLimit-*`, `Burst-RateLimit-*`, max result set 200 ([Bridge](https://bridgedataoutput.com/docs/platform/)); MLS Grid 5,000 records/request, 1,000 with `$expand` ([MLS Grid API v2](https://docs.mlsgrid.com/api-documentation/api-version-2.0.md)) | Must |
| Delete / off-market handling | Honours source delete flags (e.g. `MlgCanView=false`) and purge rules within the required window | MLS Grid `MlgCanView` "indicates whether the record should be kept in your database" ([MLS Grid](https://docs.mlsgrid.com/)) | Must |
| Media pipeline | Diff by `PhotosChangeTimestamp`/`MediaKey`, re-download only changed media, host on our CDN, regenerate derivatives | MLS Grid media replication steps ([API v2](https://docs.mlsgrid.com/api-documentation/api-version-2.0.md)) | Must |
| Feed-type tagging on every record (IDX / VOW / BBO / Agent-Office) | Every listing carries the licences it came under, so the display engine applies the right rules | Bridge `FeedTypes` field "indicates which feed type(s) the record is sourced from - and therefore what license rules would be applicable" ([Bridge](https://bridgedataoutput.com/docs/platform/)); separate applications for IDX vs VOW feeds ([Bridge](https://bridgedataoutput.com/docs/platform/)) | Must |
| Dual-auth role model (developer + MLS member) | Each request identifies the developer, the app, the end user and the MLS, plus the agent for VOW | Spark: "Each request to the API requires two forms of authorization… identify the software developer, the developer's application, the end user, and the MLS, and in the case of the VOW role, the agent" ([Spark](https://sparkplatform.com/docs/overview/api)) | Must |
| Data licence workflow | Tracks per-MLS licence requests, approvals, fees, renewal and the broker/agent each licence is for, with in-app status | MLS Grid broker/agent data licence requests, data-use disclosure ([MLS Grid guide](https://docs.mlsgrid.com/data-consumer-guides/how-to-add-broker-agent-data-license-requests.md)); Bridge invitations and agreements ([Bridge](https://bridgedataoutput.com/docs/platform/)) | Must |
| Multi-MLS de-duplication | Merges the same property from overlapping MLSs using UPI/parcel + address + ListingKey, choosing the source of record by rule | RESO UPI "accurately identify the parcel number and subcomponents"; UOI "records the source of data" ([RESO IDs](https://www.reso.org/reso-unique-identifiers/)) | Should |
| Feed health dashboard | Shows lag from MLS change to our DB per source, error rates, last-sync time, and alerting | MLS Grid publishes "MLS Import Status" and per-MLS performance metrics; it checks for changes every minute ([MLS Grid](https://docs.mlsgrid.com/)) | Must |
| Non-MLS sources: developer inventory, rentals, off-market, pocket/exempt listings, portal XML (Property Finder/Bayut), CREA DDF | One Listing object for all sources, each with its own provenance and rules | Sell.Do inventory engine ([Sell.Do](https://www.sell.do/)); MENA portals (`01`) | Should |
| Global locales | Multi-language metadata and lookups for international markets | RESO "standard for delivering multi-language metadata" ([RESO DD](https://www.reso.org/data-dictionary/)) | Later |

## 7. Display rules, attribution and listing-policy compliance

| Feature | What it does | Benchmark + source | Priority |
|---|---|---|---|
| Display rules engine (per MLS × feed type × surface) | Declarative rules: required fields (listing brokerage, agent, MLS logo/disclaimer, "data last updated"), hidden fields, sold-data rules, photo count, refresh SLA, map/AVM restrictions | MLS Grid "ONE set of rules and display guidelines" and quarterly compliance audits ([mlsgrid.com](https://www.mlsgrid.com/)); IDX vs VOW access differences ([Spark](https://sparkplatform.com/docs/overview/api)) | Must |
| VOW registration gate | VOW data shows only after the consumer registers, accepts the terms of use and is linked to an agent | Spark: VOW "requires the consumer to identify themselves and login… they can see more information (including sold information)" ([Spark](https://sparkplatform.com/docs/overview/api)) | Must |
| Objective-criteria exclusion + mandated disclosure | Brokers can exclude listings by price, type or geo only, never by brokerage identity. The rule auto-inserts "Some listings have been excluded from this website." | MRED/MLS Grid rule change, 29 Oct 2025 ([MLS Grid](https://docs.mlsgrid.com/recent-releases/mred-idx-and-vow-rules-changes.md)) | Must |
| Exempt-listing states (Office Exclusive, Delayed Marketing) with seller-disclosure capture | The listing object holds exempt type, MLS-set delay period, signed seller disclosure and timers. The system blocks IDX and syndication until the delay ends | NAR *Multiple Listing Options for Sellers*, effective 25 Mar 2025, implemented by 30 Sep 2025 ([NAR](https://www.nar.realtor/about-nar/policies/multiple-listing-options-for-sellers)) | Must |
| Clear Cooperation timer and "public marketing" detector | Flags multi-brokerage or public marketing of an exempt listing, which triggers the one-business-day MLS submission | NAR: one-to-one broker-to-broker communications don't trigger CCP; multi-brokerage communications do ([NAR](https://www.nar.realtor/about-nar/policies/multiple-listing-options-for-sellers)); OneKey MLS summary (search snippet) | Must |
| Portal-policy guard (Zillow Listing Access Standards) | Warns before an action would make a listing "publicly marketed but not broadly accessible", the condition that triggers Zillow bans | Zillow LAS updated 17 Mar 2026: "If listings are publicly marketed, they should be broadly accessible" ([Zillow](https://www.zillow.com/news/updating-zillows-listing-access-standards-for-todays-market/)); 48 bans and 1,202 violations by Nov 2025 ([Mike DelPrete](https://www.mikedp.com/articles/2025/11/25/zillows-listing-ban-and-violation-metrics)); Compass "See It First" and the 15 Sep 2026 ruling ([Real Estate News](https://www.realestatenews.com/2026/09/22/the-future-of-zillow-and-compass-as-see-it-first-goes-live)) | Must |
| Private-listing network (brokerage-internal inventory) | Office-exclusive inventory is visible only inside the brokerage, or across a franchise network, as policy allows | Compass Private Exclusives, Howard Hanna private network ([Mike DelPrete](https://www.mikedp.com/articles/2025/11/25/zillows-listing-ban-and-violation-metrics)) | Should |
| Compliance audit export | A snapshot of every public page that showed MLS data, with rules version, for MLS audits | MLS Grid quarterly audits ([mlsgrid.com](https://www.mlsgrid.com/)) | Should |

## 8. Listing syndication

| Feature | What it does | Benchmark + source | Priority |
|---|---|---|---|
| Syndication hub with per-listing, per-portal controls | One place to push and pull listings to Zillow, Realtor.com, Homes.com and others, and to international portals; each target can be toggled per listing | ListHub model: brokers opt in per publisher; MLS default limited to 20 portals (2015 search snippets from MLS help pages; not fetched); MENA portal syndication (`01`) | Should |
| Syndication respects exempt and delayed status | Blocks syndication automatically during delayed marketing | NAR policy ([NAR](https://www.nar.realtor/about-nar/policies/multiple-listing-options-for-sellers)) | Must |
| Lead routing back from portals | Portal leads come back to the broker-designated address or agent and are deduped into the Person graph | ListHub publisher terms: "Publisher must route any consumer leads to the email address designated by the broker" (Southland RAR snippet) | Must |
| Listing performance metrics from portals | Pulls views and saves back from publishers | ListHub reporting (historic); **current status not verified** | Later |
| Rental and new-home syndication | Rentals to Zillow Rentals, Apartments.com and others; projects to NewHomeSource; India to 99acres/MagicBricks; UAE to PF/Bayut | AppFolio Stack Zillow Listing Spotlight ([AppFolio Stack](https://www.appfolio.com/stack)); `01` | Should |

## 9. Public API, webhooks, MCP and integrations marketplace

| Feature | What it does | Benchmark + source | Priority |
|---|---|---|---|
| Versioned REST API (read/write) covering all core objects | OAuth 2.0 for apps, scoped API keys for the org, cursor pagination, 64-bit-safe IDs | Lofty: 94 endpoints, OAuth 2.0 or API key, 64-bit ID warning ([Lofty dev](https://developer.lofty.com/)); Buildium scoped API keys chosen per data area ([Buildium](https://developer.buildium.com/)); MoxiWorks Platform ID + secret, separate QA creds ([MoxiWorks](https://moxiworks-platform.github.io/)) | Must |
| Registered-system identification | Every integration registers and sends system headers, so tenants see which app made which change | FUB `X-System` + `X-System-Key` required for vendors ([FUB identification](https://docs.followupboss.com/reference/identification)) | Must |
| Transparent rate limits | Per-credential and per-IP limits, `Retry-After`, limit headers, and a self-serve usage endpoint | FUB sliding 10-second window, per-context limits, `GET /v1/rateLimit/usage` ([FUB](https://docs.followupboss.com/reference/rate-limiting)); Lofty 1,500/min per IP and 500/min per credential (100 in dev) ([Lofty](https://developer.lofty.com/authentication/rate-limits.md)); Buildium 10 rps then 429 ([Buildium](https://developer.buildium.com/)) | Must |
| Webhooks with signed payloads, event IDs, retries and auto-recovery | Event catalogue (person, deal, listing, lease, payment, stage, custom-field config). Retries with jitter, dead-letter queue, replay | FUB event list with `eventId` ([FUB](https://docs.followupboss.com/reference/webhooks-guide)); Lofty retries "up to 9 total attempts within 48 hours" with ±20% jitter and health probes ([Lofty webhooks](https://developer.lofty.com/concepts/webhooks.md)) | Must |
| Real-time event stream (firehose) for enterprise data teams | A Kafka-style or SSE stream, for brokerages with their own warehouse | MoxiWorks Realtime Stream ([MoxiWorks](https://moxiworks-platform.github.io/)) | Should |
| MCP server (remote, OAuth, permission-inherited) | Claude, ChatGPT and Gemini can search people, listings and deals and take actions as the user | Rechat MCP at `mcp.cluster.rechat.com/mcp`, launched 3 Aug 2026 ([Rechat help](https://help.rechat.com/appendix/integrations/connect-rechat-to-your-ai-assistant)); BoldTrail "native MCP orchestration" ([dev hub](https://developerhub.boldtrail.com/)) | Must |
| Zapier app + Make/n8n | Triggers (new contact, stage change, new deal, appointment, tag) and actions (create/update). Covers the long tail | Zapier FUB triggers ([Zapier](https://zapier.com/apps/follow-up-boss/integrations)); kvCORE new-lead trigger "may be delayed about 15 minutes" ([Zapier kvCORE](https://zapier.com/apps/kvcore/integrations)), so make ours instant; FUB "3,000+ apps" via Zapier ([FUB](https://www.followupboss.com/integrations)) | Must |
| In-app integrations marketplace | Partner listings, one-click OAuth connect, per-org enable or disable by admin, partner revenue share | AppFolio Stack "in-app Marketplace" ([AppFolio](https://www.appfolio.com/stack)); Inside Real Estate Marketplace ([help](https://help.insiderealestate.com/en)); MoxiCloud 150 vendors and MRI Vault 1,000+ (`01`) | Should |
| Developer portal | Sandbox tenant with seeded data, API explorer, `llms.txt`, CLI, changelog, status | MLS Grid and Lofty publish `llms.txt` ([MLS Grid](https://docs.mlsgrid.com/llms.txt), [Lofty](https://developer.lofty.com/llms.txt)); Lofty CLI webhooks; Bridge auto-approved test dataset ([Bridge](https://bridgedataoutput.com/docs/platform/)) | Should |
| Native integrations, first wave | Gmail/Outlook + calendar, QuickBooks/Xero, DocuSign, Twilio, Meta/Google lead ads, Zillow/Realtor leads, ShowingTime, Stripe | FUB/Lofty integration pages; BoldTrail QuickBooks (`01`) | Must |
| Outbound status pushes | A deal status change pushes data to CRM and accounting automatically | Paperless "A status change… pushes your transaction data out automatically" ([Paperless](https://www.paperlesspipeline.com/transaction-software-features)) | Must |

## 10. Import and migration tools

| Feature | What it does | Benchmark + source | Priority |
|---|---|---|---|
| CSV/XLSX import with mapping, dedupe preview, dry run and rollback | Imports contacts, deals, listings, leases, units and ledgers. Mappings are saved. An import can be undone as a batch | FUB import permissions by role (owner and admin see all imports) ([FUB roles](https://help.followupboss.com/hc/en-us/articles/4402370636567-Users-Roles-Permissions)) | Must |
| Named migrators for incumbents (FUB, kvCORE/BoldTrail, Lofty, Sierra, BoomTown, Wise Agent, SkySlope, dotloop, Brokermint, Lone Wolf, Paperless, AppFolio, Buildium, Sell.Do) | Pulls through the vendor API where one exists (FUB, Lofty, Buildium Premium, BoldTrail); otherwise uses export templates | APIs confirmed: FUB, Lofty, Buildium, BoldTrail dev hub, MoxiWorks | Must |
| Migration concierge + parallel-run mode | Two-way sync during cutover so agents can switch gradually | Sisu "one-on-one onboarding with a dedicated expert" ([Sisu](https://sisu.co/)); Lofty "Since migrating to Lofty…" testimonial ([Lofty pricing](https://lofty.com/price-packages)) | Should |
| Document bulk import with auto-filing | Zipped transaction folders are OCR-classified into deals and checklists | Inferred; ListedKit AI reads contracts (`01`) | Should |
| Opening balances / ledger import with reconciliation report | For PM trust and brokerage accounting | AppFolio accounting partners ([Stack](https://www.appfolio.com/stack)) | Should |

## 11. Reporting, BI and dashboards

| Feature | What it does | Benchmark + source | Priority |
|---|---|---|---|
| Role-aware dashboards (agent, team lead, office, enterprise) | Default dashboards per role. Permissions filter the data automatically | BoldTrail Recruit "dashboards featuring market stats and key metrics" ([Recruit](https://boldtrail.com/recruit/)); HubSpot reports respect "Their [Objects]" ([HubSpot](https://knowledge.hubspot.com/user-management/hubspot-user-permissions-guide)) | Must |
| Custom report builder + saved views + scheduled email/PDF | Filter, group and pivot any object. Results can be exported | Paperless "Build custom views, export anything" ([Paperless](https://www.paperlesspipeline.com/transaction-software-features)); DoorLoop custom dashboards (`01`) | Must |
| Goals, pacing and leaderboards | Annual GCI, units and appointments goals with pacing and team leaderboards | Sisu "performance and accountability platform… over 9K teams" ([Sisu](https://sisu.co/)) | Must |
| Lead source ROI and attribution (first-click → closed GCI or booking) | Consolidates ad, portal and offline spend against outcomes | Sell.Do "consolidated and attributed from first click to final booking" ([Sell.Do](https://www.sell.do/)) | Must |
| Natural-language analytics ("Ask") | Answers plain-English questions over the tenant's data, with the query shown | Lone Wolf Aspen "Answer fields questions in plain English" ([GlobeNewswire](https://www.globenewswire.com/news-release/2026/07/28/3334647/0/en/lone-wolf-launches-talent-in-brokermetrics-an-ai-powered-solution-for-agent-recruiting-and-retention.html)); SkySlope SkySight weekly briefings (`01`) | Should |
| Warehouse connectors (Snowflake/BigQuery share, nightly Parquet) | Enterprise BI outside the app | Pattern; MoxiWorks Realtime Stream ([MoxiWorks](https://moxiworks-platform.github.io/)) | Should |
| Embedded market stats (MLS-licensed) | Market-share and absorption charts per area | Spark Market Stats ([Spark](https://sparkplatform.com/docs/overview/api)); IDX Broker monthly market overviews ([IDX Broker](https://www.idxbroker.com/)) | Should |

## 12. Brokerage intelligence, recruiting and retention

| Feature | What it does | Benchmark + source | Priority |
|---|---|---|---|
| Agent production database from MLS sold data | Volume and units per agent and office, trend, market share, movement history | BrokerMetrics on licensed MLS data refreshed nightly, 10,000+ brokerages ([GlobeNewswire](https://www.globenewswire.com/news-release/2026/07/28/3334647/0/en/lone-wolf-launches-talent-in-brokermetrics-an-ai-powered-solution-for-agent-recruiting-and-retention.html)) | Should |
| Agent-movement alerts | Daily alerts when market agents change brokerage or hit milestones | Brokerkit "Agent Alerts that notify you daily when agents make market moves" ([Brokerkit](https://getbrokerkit.com/home/)) | Should |
| Recruiting CRM (candidate pipeline, campaigns, daily call list) | Recruits are Persons with a candidate role and their own pipeline | Brokerkit; BoldTrail Recruit hot list ([Recruit](https://boldtrail.com/recruit/)) | Must (brokerage tier) |
| AI recruit-fit, pitch builder and territory mapping | Scores fit, drafts the value case ("net income at our plan vs current"), draw-a-territory map | Lone Wolf Talent: Recruit, Pitch, Mapping, Social Research ([GlobeNewswire](https://www.globenewswire.com/news-release/2026/07/28/3334647/0/en/lone-wolf-launches-talent-in-brokermetrics-an-ai-powered-solution-for-agent-recruiting-and-retention.html)); BoldTrail net-income valuation tool (`01`) | Should |
| Retention / flight-risk scoring on internal data | Combines falling production, login drop-off, unanswered leads and cap timing into a risk flag with a suggested action | Lone Wolf Retain; "44% track no flight-risk signals" (same source). Our edge: we hold first-party activity data, not just MLS | Should |
| Onboarding checklist for new agents | Licence transfer, MLS/board joins, W-9, E&O, IdP account, website and brand kit, all auto-provisioned | Brokerkit onboarding ([Brokerkit](https://getbrokerkit.com/home/)); BoldTrail Agent Onboarding (`01`) | Must |
| Revenue-share / attraction tree (cloud brokerages) | Sponsor tree and rev-share calculation | eXp / Real model; **feature detail not verified** | Later |

## 13. Agent onboarding, training and LMS

| Feature | What it does | Benchmark + source | Priority |
|---|---|---|---|
| Course builder (video, docs, quizzes) + learning paths by role | Brokerage training: new-agent bootcamp, systems, scripts | Knolyx LMS: courses, learning paths, certificates, CEU tracking, iOS/Android ([Knolyx](https://knolyx.com/)) | Should |
| Compliance training with attestations | Fair housing, harassment, wire-fraud, TCPA/DNC and AI-use policy. Completion and expiry are tracked per agent | ProProfs: "Automate certification tracking and audit trails for fair housing, harassment prevention, and licensing requirements" (search snippet, [ProProfs](https://www.proprofstraining.com/)) | Must |
| Licence and CE tracking | State licence expiry, CE hours, E&O expiry, with reminders. Expiry blocks new listings | Knolyx CEU tracking ([Knolyx](https://knolyx.com/)) | Should |
| AI role-play coaching | Practice calls with scoring | Sisu AI coaching ([Sisu](https://sisu.co/)); Shilo in FUB marketplace ([FUB](https://www.followupboss.com/integrations)); Sell.Do call scoring ([Sell.Do](https://www.sell.do/)) | Later |
| In-product guided tours tied to adoption metrics | Adoption is the stated buying criterion ("100% adoption") | Rechat testimonials ([Rechat](https://rechat.ai/)) | Should |

## 14. Intranet and document library

| Feature | What it does | Benchmark + source | Priority |
|---|---|---|---|
| Company document library (forms, policies, brand assets, vendor lists) with permissions by office/role | Single source for the policy manual and approved forms | Brokerkit "centralized hub for seamless document management" ([Brokerkit](https://getbrokerkit.com/home/)) | Must |
| Announcements / news feed with read receipts | Office-wide notices that require acknowledgement (policy changes) | Lone Wolf "Foster teamwork and streamline communication" ([lwolf.com](https://www.lwolf.com/)) | Should |
| Agent directory + profiles (feeds websites) | One profile drives the intranet, website roster and email signature | IDX Broker agent rosters and bio pages ([IDX Broker](https://www.idxbroker.com/)) | Must |
| Vendor / preferred-partner directory | Lenders, inspectors, title. Ties to referral tracking and RESPA notes | Inferred | Later |
| Search across library + AI Q&A over policies | "What's our policy on dual agency?" answered with a citation | Inferred from AI assistant trend (Lofty, Rechat Lucy) | Should |

## 15. Marketing brand management

| Feature | What it does | Benchmark + source | Priority |
|---|---|---|---|
| Brand kits per org level (logos, fonts, colors, disclaimers) with locks | Franchise and brand rules inherit. Agents can't break locked elements | Marq "Lock logos, fonts, colors, and more to maintain a consistent look" ([Marq](https://www.marq.com/pages/create/industries/real-estate/)) | Must |
| Template library with data-merge from listing, agent and office | One-click listing flyers, social posts and emails from MLS data | Marq "data mapping… populate templates directly from any data source" ([Marq](https://www.marq.com/pages/create/industries/real-estate/)); Rechat Studio ([Rechat](https://rechat.ai/)); BoldTrail DesignCenter ([help](https://help.insiderealestate.com/en)) | Must |
| Bundled listing kits from one trigger | "Just listed" creates the social set, flyer, email and site page | Marq "Create entire listing packages… from a single trigger" ([Marq](https://www.marq.com/pages/create/industries/real-estate/)) | Should |
| Approval workflow + print ordering | Marketing team approves non-template pieces. Print fulfillment | Marq "request design approval, order professional prints" ([Marq](https://www.marq.com/pages/create/industries/real-estate/)) | Should |
| Compliance auto-insert | Brokerage name, licence numbers, Equal Housing logo and MLS disclaimer injected by jurisdiction | Fair housing ad rules ([24 CFR 100.75](https://www.ecfr.gov/current/title-24/subtitle-B/chapter-I/subchapter-A/part-100/subpart-B/section-100.75)); Real's per-state licence text ([onereal.com](https://onereal.com/)) | Must |
| Central marketing team acting for agents | Marketing staff create and send on behalf of agents, as the agent | Rechat: "Marketing teams can upload assets, create campaigns, and manage content on behalf of agents" ([Rechat](https://rechat.ai/)) | Should |

## 16. Websites and SEO

| Feature | What it does | Benchmark + source | Priority |
|---|---|---|---|
| Brokerage site + agent subsites + listing single-property sites, from one CMS | Roster, bios and office pages come from the org graph. IDX search is native | IDX Broker rosters, bio pages, lead routing ([IDX Broker](https://www.idxbroker.com/)); Rechat Lucy builds listing sites "within seconds" ([Rechat](https://rechat.ai/)) | Must |
| AI site builder with approve-before-publish | AI drafts and edits from chat. Nothing goes live without approval | Placester: "AI builds your complete… website in under 4 minutes… Nothing goes live until you say so" ([Placester](https://placester.com/)); Luxury Presence "You approve what goes live" ([Luxury Presence](https://www.luxurypresence.com/)) | Should |
| Structured data + AI-search readiness | `RealEstateListing`/`Offer`/`Place` schema, sitemaps, llms.txt, fast Core Web Vitals | schema.org `RealEstateListing` ([schema.org](https://schema.org/RealEstateListing)); Placester "Structured data, schema and AI-readable signals are built in" ([Placester](https://placester.com/)) | Must |
| Community / neighbourhood pages with market stats | SEO landing pages | IDX Broker community pages, WordPress plugin ([IDX Broker](https://www.idxbroker.com/)) | Should |
| Custom domains, SSL, redirects from old vendor URLs | Keeps SEO equity when migrating off the old vendor | Inferred | Must |
| WCAG 2.2 AA templates + accessibility checker | ADA demand-letter risk in US real estate; WCAG 2.1 AA is the DOJ Title II benchmark | DOJ Title II rule (WCAG 2.1 AA), compliance dates extended to 26 Apr 2027/2028 ([ADA.gov](https://www.ada.gov/resources/2024-03-08-web-rule/)). Applies to governments; private brokerages face Title III litigation (not sourced) | Must |

## 17. Billing, subscriptions and usage metering

| Feature | What it does | Benchmark + source | Priority |
|---|---|---|---|
| Plans × modules × seats × units entitlements | One entitlement service gates features per org, office and user. Mixes seats (agents), units (PM), files (TC) and projects (developer) | `01` packaging: per seat (FUB), per unit (Breeze $1/unit with a $100 minimum), per file (ListedKit) | Must |
| Usage meters (SMS, voice minutes, AI actions, e-sign envelopes, screening, storage) with live balance | Meters are shown openly, with prepaid credits and alerts at thresholds | Stripe usage-based billing; Metronome "now part of Stripe… real-time metering… prepaid credits, enterprise contracts" ([Stripe](https://docs.stripe.com/billing/subscriptions/usage-based)); Sell.Do metered comms (`01`) | Must |
| Who pays: brokerage-paid, agent-paid or split | The brokerage can sponsor core seats while agents add premium modules on their own card. Billing can follow the agent | FUB owner-only billing ([FUB](https://help.followupboss.com/hc/en-us/articles/4402370636567-Users-Roles-Permissions)); kvCORE billing-after-switch complaint (`01`) | Must |
| Agent billing by the brokerage (desk, tech and E&O fees) | The brokerage bills its own agents recurring fees through the platform | BoldTrail Agent Billings (`01`) | Should |
| Self-serve cancel, month-to-month, prorated seat changes | Answers the churn complaints | Wise Agent "month-to-month with no contracts" ([Wise Agent](https://wiseagent.com/pricing.asp)) | Must |
| Enterprise contracts (commit + overage, PO invoicing, multi-entity billing) | Franchise and enterprise deals | Metronome enterprise contracts ([Stripe](https://docs.stripe.com/billing/subscriptions/usage-based)) | Should |
| Multi-currency + GST/VAT invoices (INR, AED, AUD, CAD) | International packs | Inferred from `01` regions | Later |

## 18. Mobile apps and offline

| Feature | What it does | Benchmark + source | Priority |
|---|---|---|---|
| Native iOS/Android with desktop parity incl. iPad layout | Every task can be finished on the phone | Market's main pain: BoldTrail 1.46★, Lofty no iPad layout (`01`); BoldTrail's new app pitches "high-intent signals to agents' phones" ([BoldTrail](https://boldtrail.com/)) | Must |
| Offline-first capture with background sync and conflict resolution | Notes, photos, inspections, signatures and open-house sign-ins work with no signal | AppFolio and Yardi upload failures (`01`); Brokerkit mobile call notes ([Brokerkit](https://getbrokerkit.com/home/)) | Must |
| Encrypted local cache + remote wipe | Lost-phone protection for client PII | Pattern (ties to section 3) | Must |
| Brokerage-branded app (white-label) | Store-listed app in the brokerage's brand, with its own push sender | Wise Agent Enterprise white-label; Arthur (`01`); BoldTrail branded app (not verified) | Later |
| Mobile SSO + biometrics | Face ID unlock that keeps sessions persistent | `01` logout complaints | Must |

## 19. Notifications

| Feature | What it does | Benchmark + source | Priority |
|---|---|---|---|
| Unified notification center that deep-links to the exact record or message | Fixes BoldTrail's blank notification screens | `01` ([App Store BoldTrail](https://apps.apple.com/us/app/id6502782766)) | Must |
| Per-user channel preferences (push, email, SMS, in-app, digest) with quiet hours | Agents control the noise. Admins can mark some notifications mandatory (compliance rejections) | Paperless "Reject with a reason - the agent gets a precise re-upload prompt" ([Paperless](https://www.paperlesspipeline.com/transaction-software-features)) | Must |
| Event-driven rules ("notify office admin when a file misses a doc 3 days before close") | Admin-configurable triggers on any webhook event | FUB/Zapier triggers ([Zapier](https://zapier.com/apps/follow-up-boss/integrations)); Paperless custom notifications | Should |
| Daily AI brief | Morning summary of hot leads, deadlines and at-risk deals | SkySlope SkySight weekly briefings (`01`); BoldTrail signals | Should |

## 20. Search

| Feature | What it does | Benchmark + source | Priority |
|---|---|---|---|
| Global omni-search across people, properties, listings, deals, leases, documents and messages | One box, permission-filtered, typo-tolerant, phone and address normalized | FUB related-contact search broken on mobile (`01`) | Must |
| Consumer listing search (map, polygon, commute, saved searches, alerts) | IDX front end | IDX Broker interactive maps ([IDX Broker](https://www.idxbroker.com/)); BoldTrail "most engaging home search" ([BoldTrail](https://boldtrail.com/)) | Must |
| Natural-language search ("3-bed near Lincoln Elementary under 800k with a yard") | LLM-to-filter translation with a fair-housing guard (no steering terms) | Lofty and Rechat AI assistants ([Lofty](https://lofty.com/), [Rechat](https://rechat.ai/)); HUD guidance (section 22) | Should |
| Semantic search over documents and calls | Finds clauses in contracts and statements made on calls | Sell.Do call transcription and tagging ([Sell.Do](https://www.sell.do/)) | Later |

## 21. AI governance

| Feature | What it does | Benchmark + source | Priority |
|---|---|---|---|
| AI action ledger | Every AI-initiated read, write or send is logged with the prompt, tool calls, model, user and approval | Rechat MCP "Review requested actions carefully before approving" ([Rechat help](https://help.rechat.com/appendix/integrations/connect-rechat-to-your-ai-assistant)) | Must |
| Autonomy levels per agent and per action (suggest → draft → act with approval → autonomous) | Admins set what AI may do alone, such as auto-texting leads or changing prices. Defaults are conservative | Lofty Cowork "looping you in when judgment matters" ([Lofty](https://lofty.com/)); Placester and Luxury Presence approve-before-publish | Must |
| Fair-housing guardrails on generated copy, ad targeting and search | Blocks protected-class terms and steering. Ad audiences limited to non-discriminatory targeting | HUD 2 May 2024 guidance on FHA and AI ad targeting ([HUD PDF](https://archives.hud.gov/news/2024/FHEO_Guidance_on_Advertising_through_Digital_Platforms.pdf), via search snippet); 24 CFR 100.75(c)(3) "Selecting media or locations for advertising… which deny particular segments" ([eCFR](https://www.ecfr.gov/current/title-24/subtitle-B/chapter-I/subchapter-A/part-100/subpart-B/section-100.75)) | Must |
| High-risk AI impact assessments (tenant screening, pricing, lead scoring) | Risk policy, impact assessment, consumer notice and adverse-action explanation | Colorado SB24-205 developer and deployer duties ([CO leg](https://leg.colorado.gov/bills/sb24-205)), effective date moved to 30 Jun 2026 by SB25B-004 ([CO leg](https://leg.colorado.gov/bills/sb25b-004)) | Should |
| AI voice/text disclosure + TCPA consent check before any AI outreach | AI voice counts as "artificial voice"; outreach needs prior express consent | BoldTrail's own consent text names "AI-generated voice technology" ([BoldTrail](https://boldtrail.com/)) | Must |
| Data boundary controls | Per-tenant opt-out from model training, choice of model region, PII redaction before LLM calls | Inferred; Salesforce Shield for Agentforce ([Shield](https://www.salesforce.com/platform/shield/)) | Must |
| Model and prompt versioning + evals | Regression tests on contract extraction and copy compliance | Inferred | Should |

## 22. Security and compliance

| Feature | What it does | Benchmark + source | Priority |
|---|---|---|---|
| SOC 2 Type II (Security, Availability, Confidentiality; add Privacy later) | Required for enterprise and franchise RFPs | BoldTrail claims SOC 2 Type II ([dev hub snippet](https://developerhub.boldtrail.com/)); Entrata SOC 1/2 + PCI (`01`); AICPA SOC suite ([AICPA](https://www.aicpa-cima.com/resources/landing/system-and-organization-controls-soc-suite-of-services)) | Must (within 12 mo) |
| PCI-DSS scope minimization | Card and ACH via a processor's tokenized fields only | Entrata PCI-DSS (`01`) | Must |
| Encryption at rest + field-level encryption for sensitive PII | SSN/Aadhaar/PAN, bank and screening data | Salesforce Platform Encryption ([Shield](https://www.salesforce.com/platform/shield/)) | Must |
| Consent ledger (TCPA/DNC) | Stores consent per phone and channel with source, text shown, timestamp and IP. Revocation is honoured "in any reasonable manner" | FCC: "You may opt out… at any time and in any reasonable manner" ([FCC](https://www.fcc.gov/consumers/guides/stop-unwanted-robocalls-and-texts)); one-to-one consent rule vacated 24 Jan 2025 ([Wiley](https://wiley.law/alert-UPDATE-11th-Circuit-Vacates-FCCs-One-to-One-TCPA-Consent-Rule)) | Must |
| 10DLC brand and campaign registration built into onboarding | Each brokerage or agent is registered through TCR. Unregistered traffic gets filtered and fined | Twilio: "Anyone sending SMS/MMS messages over a 10DLC number from an application to the US must register" ([Twilio](https://www.twilio.com/docs/messaging/compliance/a2p-10dlc)); The Campaign Registry ([TCR](https://www.campaignregistry.com/)); CTIA Messaging Principles ([CTIA](https://www.ctia.org/the-wireless-industry/industry-commitments/messaging-interoperability-sms-mms)) | Must |
| CAN-SPAM by default | Physical address, opt-out and accurate headers enforced in every template | FTC: penalties "up to $53,088" per email; physical postal address and opt-out required ([FTC](https://www.ftc.gov/business-guidance/resources/can-spam-act-compliance-guide-business)) | Must |
| CCPA/CPRA + GPC | Honours Global Privacy Control, "Do Not Sell or Share" link, limit-sensitive-PI | [CA AG](https://oag.ca.gov/privacy/ccpa); BoldTrail and Compass show "Do Not Sell or Share" links ([BoldTrail](https://boldtrail.com/), [Compass](https://www.compass.com/technology/)) | Must |
| GDPR (UK/EU expansions) | Lawful basis, DPA, Art. 20 portability, sub-processor list | [GDPR Art. 20](https://gdpr-info.eu/art-20-gdpr/) | Later |
| India DPDP Act + Rules 2025 | Notice + itemized consent, consent-manager interop, breach notice, children's data, data-fiduciary duties | Rules notified Nov 2025; Consent Manager rule in force after 1 year; most operational rules after 18 months, about 13 May 2027 ([MeitY](https://www.meity.gov.in/documents/act-and-policies/digital-personal-data-protection-rules-2025-gDOxUjMtQWa), via search snippets incl. DLA Piper) | Should (Must for India developer pack) |
| Fair housing ad compliance | Equal Housing logo/statement, banned-words linting, audience-targeting rules | [24 CFR 100.75](https://www.ecfr.gov/current/title-24/subtitle-B/chapter-I/subchapter-A/part-100/subpart-B/section-100.75); HUD 2024 guidance | Must |
| Wire-fraud protections | Verified payee changes, out-of-band confirmation, banner on any message containing wire instructions | Qualia wire-fraud detection (`01`) | Should |
| Pen tests, bug bounty, responsible disclosure page | Standard trust signals | Compass "Responsible Disclosure" link ([Compass](https://www.compass.com/technology/)) | Should |
| Trust center (status, SOC report on NDA, sub-processors, DPA) | Self-serve security review | Pattern | Should |

## 23. Uptime, SLA and data residency

| Feature | What it does | Benchmark + source | Priority |
|---|---|---|---|
| 99.9% contractual SLA (99.95% enterprise) with service credits; public status page | Enterprise expectation; BoldTrail markets "99.98% Actual Uptime" | [BoldTrail dev hub snippet](https://developerhub.boldtrail.com/) | Must |
| Per-component status (MLS feeds, SMS, e-sign, payments) | Most incidents come from third parties, so we show them | MLS Grid import-status page ([MLS Grid](https://docs.mlsgrid.com/)) | Should |
| RPO ≤ 15 min, RTO ≤ 4 h, multi-AZ, tested restores | Basis for the backup promise | Paperless monthly backups as baseline ([Paperless](https://www.paperlesspipeline.com/transaction-software-features)) | Must |
| Data residency regions (US, Canada, India, EU/UK, UAE, AU) | Tenant pinned to a region; India DPDP cross-border rules; Canadian brokerages often ask for CA hosting | Salesforce Hyperforce (regional residency pattern; page fetch returned no text) | Later (India: Should) |

## 24. White-label

| Feature | What it does | Benchmark + source | Priority |
|---|---|---|---|
| Custom domain + branded login + email sending domain (SPF/DKIM/DMARC) | The brokerage's brand everywhere agents and clients see the product | Wise Agent Enterprise white-label; Arthur Professional (`01`) | Should |
| Branded client portals (buyer/seller, owner, tenant, CP) | Client-facing surfaces never show Estate OS branding on top tiers | Sisu client portal ([Sisu](https://sisu.co/)) | Should |
| Branded mobile app | See section 18 | — | Later |
| Reseller / MLS-provided edition | MLSs and associations offer the product as a member benefit, as Lone Wolf does for "MLSs, and associations" | [Lone Wolf](https://www.lwolf.com/) | Later |

---

## Proposed core data model (platform layer)

Module objects (Person, Household, Property, Unit, Listing, Deal, Lease, Project, Ledger, Conversation) are defined in `01`/`02`. Below is the platform layer they all depend on.

### Tenancy, org and identity

| Object | Key fields | Relationships |
|---|---|---|
| **Tenant** | id, name, plan_id, region (data residency), status, created_at, branding_id | has many OrgUnit, User, Subscription |
| **OrgUnit** | id, tenant_id, parent_id, type (`enterprise/brand/franchisee/region/office/team/pm_company/developer/cp_firm/vendor`), legal_entity_name, uoi (RESO), licence_numbers{state:no}, broker_of_record_user_id, settings_json (inherit+override), brand_kit_id | tree via `parent_id` + closure table `org_unit_paths(ancestor, descendant, depth)` |
| **User** | id, tenant_id (home), email, phone, auth methods (passkey, totp), idp_subject, status, uli (RESO Unique Licensee Identifier), mls_member_keys[] | has many Membership, Session, Device |
| **Licence** | id, user_id, jurisdiction, number, type (salesperson/broker), expires_at, ce_hours_due, eo_policy_expiry | blocks capabilities on expiry |
| **Membership** | id, user_id, org_unit_id, role_id, permission_set_ids[], is_primary_admin, started_at, ended_at, billing_payer (`org/user`) | many-to-many User↔OrgUnit (multi-team, TC across firms) |
| **Role / PermissionSet** | id, tenant_id, key, grants[{object, action, scope: own/team/office/org/all, include_unassigned, field_masks[]}], sensitive_grants[export, delete, api_keys, billing, ai_autonomy] | assigned via Membership |
| **ShareGrant** | id, subject_type/id (record), grantee (user/org_unit/external), permissions, reason (`collaborator/co-list/referral/lender/tc`), expires_at | record-level ACL, covers FUB-style collaborators and cross-org deals |
| **Session / Device** | id, user_id, device fingerprint, platform, last_seen, offline_cache_key, revoked_at | remote wipe |

### Ownership, consent, governance

| Object | Key fields | Relationships |
|---|---|---|
| **OwnershipStamp** (embedded on every business record) | owner_user_id, owner_org_unit_id, ownership_class (`agent/team/brokerage/shared`), source, portability (`agent_takes/brokerage_keeps/copy_both`) | drives the departure workflow and exports |
| **ConsentRecord** | id, person_id, channel (sms/voice/email/whatsapp/ai_voice), purpose (marketing/transactional), legal_basis (TCPA PEC/PEWC, DPDP consent, GDPR), captured_text, source_url/form_id, ip, captured_at, revoked_at, revoked_via, consent_manager_ref (DPDP) | checked before every outbound send and every AI action |
| **SuppressionEntry** | channel, value (phone/email), reason (DNC, opt-out, bounce), scope (tenant/global) | — |
| **AuditEvent** (append-only) | id, tenant_id, actor (user/api_client/ai_agent/system), on_behalf_of_user_id, action, object_type/id, diff_before/after (hash for sensitive fields), ip, device_id, request_id, at | streamed to SIEM; retention by policy |
| **RetentionPolicy / LegalHold** | object_type, jurisdiction, keep_for, action_after (archive/delete); hold: scope, reason, set_by | — |
| **DataSubjectRequest** | id, person_id, law (CCPA/GDPR/DPDP), type (access/delete/correct/opt_out/limit), due_at, status, export_file_id | — |

### MLS, listings data and display compliance

| Object | Key fields | Relationships |
|---|---|---|
| **DataSource** | id, kind (`reso_webapi/bridge/trestle/spark/mlsgrid/rets/portal_xml/developer/manual`), originating_system_name, uoi, credentials_ref, rate_limit_profile (rps, bytes/hour, burst), last_mod_ts_by_resource, health metrics | has many DataLicence, ListingRecord |
| **DataLicence** | id, source_id, licensee (org_unit or user), feed_type (`IDX/VOW/BBO/AgentOffice`), status, signed_at, fee, renewal_at, data_use_disclosure | — |
| **ListingRecord** (RESO DD 2.0 shaped) | listing_key, listing_id, source_id, upi, property_id (graph), standard fields + `local_fields_json`, feed_types[], standard_status, exempt_type (`none/office_exclusive/delayed_marketing`), delay_until, seller_disclosure_doc_id, can_view (delete flag), modification_ts, photos_change_ts | Media[], OpenHouse[], Room[], Member/Office refs; many ListingRecords → one Property (multi-MLS dedupe) |
| **DisplayRuleSet** | id, source_id, feed_type, version, rules_json (required attribution fields, hidden fields, sold rules, refresh max age, exclusion disclosure text, logo), effective_from | evaluated by every Surface |
| **Surface** | id, kind (website/app/email/print/portal_syndication/AI_answer), org_unit_id, rule_set_ids[], exclusion_criteria (objective only) | — |
| **SyndicationTarget / SyndicationJob** | target (portal), credentials, default_on; job: listing_id, action, status, blocked_reason (exempt, LAS risk), last_pushed_at, metrics | — |

### Integration, extensibility

| Object | Key fields | Relationships |
|---|---|---|
| **ApiClient (App)** | id, owner (tenant or partner), name, system_key (FUB-style identification), oauth_client_id, status (`development/production`), scopes[], rate_limit_tier, marketplace_listing_id | issues OAuthGrant / ApiKey |
| **OAuthGrant / ApiKey** | id, client_id, user_id (grantor), scopes ⊆ grantor permissions, created_at, last_used_at, revoked_at | every call audited |
| **WebhookSubscription / WebhookDelivery** | sub: url, events[], secret, status, health; delivery: event_id, attempt_no, status, next_attempt_at (exp backoff + jitter, 9 attempts / 48h), response_code | — |
| **McpSession** | id, user_id, client (Claude/ChatGPT/Gemini), tools_allowed[], autonomy_level | writes AiAction |
| **ImportJob / FieldMapping** | source_vendor, file/api, mapping_json, dry_run_report, records_created/updated/skipped, rollback_token | — |
| **CustomField / CustomObject** | object_type, key, type, permissions, validation | exposed in API and webhooks (config-change events) |

### Analytics, people development, content

| Object | Key fields | Relationships |
|---|---|---|
| **MetricDefinition / Dashboard / Report** | metric sql/semantic def, owner scope; dashboard widgets; schedules | permission-filtered |
| **Goal** | user/team, period, metric, target, pacing | — |
| **AgentProductionSnapshot** | uli, office uoi, period, units, volume, sides (list/buy), market_share, source (MLS/internal) | powers recruiting and retention |
| **RecruitCandidate** (Person role) | person_id, current_office_uoi, production snapshot ids, stage, fit_score, flight_risk_score (for own agents), owner_recruiter | — |
| **Course / LearningPath / Enrollment / Attestation** | content, required_for roles, due_at, completed_at, score, expires_at, ce_credits | gates (e.g., fair housing attestation before AI ads) |
| **LibraryItem / Folder** | file, version, audience (org_unit/role), requires_ack, ack records | — |
| **Announcement** | body, audience, requires_ack, read receipts | — |
| **BrandKit / Template / Asset / ApprovalRequest** | kit locks; template merge fields (listing, agent, office); approval state | inherit down OrgUnit tree |
| **Site / Page / Domain** | org_unit or user, theme, pages, structured_data, domain, ssl, redirects, a11y score | IDX widgets use Surface rules |

### Billing and platform ops

| Object | Key fields | Relationships |
|---|---|---|
| **Plan / Entitlement** | modules[], limits (seats, units, files, projects), feature flags | — |
| **Subscription** | tenant/org_unit/user (payer), plan_id, seat_count, unit_count, term (`monthly`), status, cancel_at | — |
| **UsageMeter / UsageEvent / CreditBalance** | meter key (sms_segment, voice_min, ai_action, esign_envelope, screening, storage_gb), qty, unit_price, payer, idempotency_key | billed via Stripe/Metronome |
| **AgentCharge** | brokerage→agent recurring fees (desk, tech, E&O), schedule, ledger link | back-office module |
| **Notification / NotificationPreference** | event, recipient, channels, deep_link (object_type/id), mandatory flag, digest grouping | — |
| **AiAgent / AiAction / AiPolicy** | agent type, autonomy level by action, model, prompt version; action: inputs, tool calls, outputs, approval_by, consent_check_id, fair_housing_check result | logged to AuditEvent |

Key relationship rules:
- Every business record has exactly one `OwnershipStamp`. Visibility = Role scope ∪ ShareGrants ∪ Surface rules (for public listing data).
- Org settings, brand kits, display rules and retention resolve by walking up the `OrgUnit` tree, closest override wins.
- Consent and suppression checks are a gate in the send pipeline, shared by humans, automations, AI and API.
- AI, API and MCP actors always carry `on_behalf_of_user_id`, and their effective permissions are capped by that user.

---

## Top 10 differentiators

1. **Portable-by-design data ownership.** Every record has an ownership stamp, and a one-click agent-departure flow re-assigns leads, exports the agent's book and stops billing. This answers the "my CRM belonged to my old brokerage / kept billing me" complaint at the schema level. No verified competitor offers it.
2. **Listing-policy compliance engine.** Exempt-listing states, seller-disclosure capture, delayed-marketing timers, MRED-style exclusion disclosures and a Zillow-LAS risk check before any marketing action. In 2025–26 compliance became a live risk: 1,202 violation notices and 48 bans. Incumbents handle it in MLS rules, not in the agent's workflow.
3. **One RESO-native data spine across MLS, rentals, new-build and portal inventory.** DD 2.0 schema, UPI/ULI/UOI identifiers, and adapters for Bridge, Trestle, Spark and MLS Grid with per-source governors and feed-health dashboards. Listings, sold data and roster all hang off the same Property and Person graph.
4. **Permission-inherited AI everywhere (MCP + in-app + API).** One permission model for humans, automations, Zapier, MCP clients and our own AI agents. Autonomy levels are set per action and every AI action is ledgered. Rechat and BoldTrail have MCP; neither has published a per-action autonomy and audit model.
5. **A consent ledger built into the core.** TCPA, 10DLC, CAN-SPAM, CCPA/GPC and DPDP consent plus revocation in one gate shared by SMS, voice, AI voice, email and WhatsApp. It sells to compliance-sensitive enterprises and to India developers ahead of the May 2027 DPDP deadline.
6. **First-party flight-risk and recruiting intelligence.** BrokerMetrics-style MLS production, plus the in-app activity signals that only the operating system holds: lead response time, logins, pipeline drop and cap timing. Lone Wolf has only MLS data and is starting to add AI, so this is a defensible advantage.
7. **Transparent metering and agent-or-broker payer split.** Seats, units, files and AI/SMS meters with live balances. Billing can follow the agent, month-to-month, cancel in-app. This directly counters the contract-trap churn driver.
8. **Franchise-grade org tree with inheritance.** Brand kits, display rules, retention, checklists and AI policy inherit from enterprise down to team, with local overrides and a "view as" simulator. Competitors offer multi-office, but not inheritance across all of these policy types.
9. **Integration quality bar published up front.** Instant Zapier triggers (vs kvCORE's ~15-minute delay), signed webhooks with documented retries, a real-time stream, `llms.txt`, a sandbox and self-serve rate-limit usage. Developer experience becomes a sales asset for the marketplace.
10. **Accessibility and AI-search-ready sites by default.** WCAG 2.2 AA templates, schema.org `RealEstateListing`, approve-before-publish AI site editing, and compliance auto-insertion (licences, Equal Housing, MLS attribution) on every surface: web, print, email, social and AI answers.

---

## Not verified

Each item below came up in research but could not be confirmed from a primary source during this run (Brave search hit bot checks; several vendor sites blocked or 404'd). Treat them as hypotheses.

- **Clareity SSO** capabilities, pricing and MLS coverage (site failed TLS). The MLS-dashboard SSO row is a hypothesis.
- **ListHub's current status** (2025–26). Only 2015–2024 snippets were found; the syndication-hub row relies on that historic model.
- **"Real Estate Exchange"** (named in the brief): could not identify which entity or product is meant; nothing sourced.
- **Aspen** is verified only as Lone Wolf's AI teammate in BrokerMetrics Talent. If the brief meant a separate "Aspen" analytics product, that is unverified.
- **Compass platform** feature set (Compass One/AI tools), **eXp** tooling, and **Real reZEN** features: pages 404'd or returned only legal footers. The rev-share tree row is inferred.
- **SkySlope** security and certifications (site blocked); **dotloop** features (blocked); **Lone Wolf BrokerMetrics/Back Office** product pages (404) beyond the press release.
- **BoldTrail SOC 2 Type II, "99.98% Actual Uptime", "100M+ API calls/month"** come from a search-result snippet of developerhub.boldtrail.com. The fetched page text did not show those figures.
- **BoldTrail brokerage-branded mobile app / white-label** is unconfirmed.
- **Zillow Listing Access Standards 2026 text**: the Zillow page did not render. Content is from search snippets (17 Mar 2026 update) plus Real Estate News and Mike DelPrete.
- **HUD 2024 AI advertising guidance**: PDF fetch timed out, so details come from search snippets. HUD's 2025–26 stance on this guidance (possible withdrawal) is unverified.
- **TCPA revocation rule** specifics (10-business-day processing; partial delay of the "revoke all" provision to 2026): only the FCC's "any reasonable manner" consumer page was verified.
- **Colorado AI Act**: the delay to 30 Jun 2026 is verified (SB25B-004). Any further 2026-session amendment or delay is unverified.
- **India DPDP Rules** dates come from search snippets (PIB, DLA Piper, MeitY listing). The primary PDF did not load. Cross-border transfer restrictions are unverified.
- **ADA Title III** (private-business website) obligations: only the DOJ Title II rule for governments was verified. WCAG 2.2 spec page did not render; the 2.2 target is a recommendation.
- **NAR IDX policy statement 7.58** and **VOW policy** pages failed to load. Exact required display elements (attribution placement, refresh intervals) vary by MLS and are not enumerated here.
- **Salesforce Hyperforce** residency specifics (page returned no text); Salesforce/HubSpot admin patterns are cited from HubSpot docs and Shield only.
- **Trestle and Spark rate limits** and **RESO UPI construction details** were not retrieved.
- **Brokerkit, Sisu, Knolyx pricing**, and whether Lone Wolf or BoldTrail ship a native LMS: unverified.
- **AppFolio Open API and Entrata API** specifics beyond `01`; **MoxiWorks Realtime Stream** event schema (only named in docs).
- A possible **Lone Wolf–MoxiWorks combination** (still unverified, as in `01`).
