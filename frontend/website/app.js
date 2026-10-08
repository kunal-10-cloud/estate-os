// Estate OS prototype. Preact + htm, no build. One shared store: every screen reads and writes the same people, properties and deals.
const { html, render, useState, useEffect, useRef } = htmPreact;

// ---------- store ----------
// Extension files (loaded before app.js) push { pages, modals, seed(d), nav: [{ id, label, icon, group, mod }] } onto EOS_EXT.
const EXT = window.EOS_EXT || [];
const S = { d: EOS_SEED(), route: parseHash(), persona: "all", toast: null, modal: null, loading: false, tour: null, recent: [],
  ui: { pal: null, pop: null, drawer: false } };
EXT.forEach(x => x.seed && x.seed(S.d));
Object.assign(S.d.agents, {
  nina: { id: "nina", name: "Nina Patel", role: "Transaction coordinator", ini: "NP", color: "#3F6E6A" },
  grace: { id: "grace", name: "Grace Liu", role: "Office manager & accounting", ini: "GL", color: "#8C5A2B" },
  ray: { id: "ray", name: "Ray Alvarez", role: "Maintenance technician", ini: "RA", color: "#5C6B3A" },
  rohan: { id: "rohan", name: "Rohan Mehta", role: "Sales head · The Linden", ini: "RM", color: "#4A4F8C" },
});
let rerender = () => {};
function up(fn) { fn && fn(S); rerender(); }
function go(path) { location.hash = "#/" + path; }
function parseHash() { const p = (location.hash.replace(/^#\/?/, "") || "start").split("/"); return { page: p[0], id: p[1] }; }
// Heavy office pages get a short skeleton when you arrive from another page (simulates the fetch, never on tab or record switches).
const EOS_HEAVY = ["today", "inbox", "people", "pipeline", "listings", "rentals", "projects", "backoffice", "compliance", "commissions", "trust", "routing", "listingops", "settings"];
let eosLoadTimer;
addEventListener("hashchange", () => up(s => {
  const prev = s.route.page; s.route = parseHash();
  s.ui.pal = null; s.ui.pop = null; s.ui.drawer = false;
  if (prev !== s.route.page && EOS_HEAVY.includes(s.route.page) && !isClient()) {
    s.loading = true; clearTimeout(eosLoadTimer); eosLoadTimer = setTimeout(() => up(x => { x.loading = false; }), 180);
  } else s.loading = false;
  document.querySelector(".main")?.scrollTo(0, 0); window.scrollTo(0, 0);
}));
let toastTimer;
function toast(text, action) {
  clearTimeout(toastTimer); eosAudit(text);
  up(s => { s.toast = { text, action, n: (s.toast?.n || 0) + 1 }; });
  toastTimer = setTimeout(() => up(s => { s.toast = null; }), action ? 6500 : 4200);
}

// ---------- helpers ----------
const usd = (n, d = 0) => "$" + Number(n).toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
const short = (n) => n >= 1e6 ? "$" + (n / 1e6).toFixed(n >= 1e7 ? 0 : 2).replace(/\.?0+$/, "") + "M" : "$" + Math.round(n / 1000) + "K";
const L = (id) => S.d.listings.find(x => x.id === id);
const P = (id) => S.d.people.find(x => x.id === id);
const A = (id) => S.d.agents[id];
const img = (n) => `img/${n}.webp`;
function monthly(price, downPct = 20, rate = 6.4, taxPct = 1.8, hoa = 0) {
  const loan = price * (1 - downPct / 100), r = rate / 100 / 12, n = 360;
  const pi = loan * r / (1 - Math.pow(1 + r, -n)), tax = price * taxPct / 100 / 12, ins = price * 0.0035 / 12;
  return { pi, tax, ins, hoa, total: pi + tax + ins + hoa };
}
const I = {
  today: "M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z",
  site: "M3 5h18v14H3zM3 9h18M7 7h.01",
  inbox: "M4 4h16v12H5.17L4 17.17zM8 9h8M8 12h5",
  people: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
  pipeline: "M4 4h4v16H4zM10 4h4v10h-4zM16 4h4v6h-4z",
  listings: "M3 21V9l9-6 9 6v12M9 21v-7h6v7",
  rentals: "M4 21V5a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v16M15 10h4a1 1 0 0 1 1 1v10M8 8h3M8 12h3M8 16h3",
  projects: "M3 21h18M5 21V7l7-4 7 4v14M9 21v-4h6v4M9 10h.01M15 10h.01M9 14h.01M15 14h.01",
  backoffice: "M4 7h16v13H4zM8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M4 12h16",
  bundle: "M12 2 3 7v10l9 5 9-5V7zM3 7l9 5 9-5M12 12v10",
  spark: "M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6",
  check: "M5 12l5 5L20 7",
  arrow: "M5 12h14M13 6l6 6-6 6",
  phone: "M22 16.9v3a2 2 0 0 1-2.2 2A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z",
  search: "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.3-4.3",
  bell: "M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 0 0 3.4 0",
  menu: "M4 6h16M4 12h16M4 18h16",
  lock: "M5 11h14v10H5zM8 11V7a4 4 0 0 1 8 0v4",
  x: "M18 6 6 18M6 6l12 12",
  gear: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z",
  logout: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9",
  swap: "M7 4 3 8l4 4M3 8h14M17 20l4-4-4-4M21 16H7",
  play: "M7 4v16l13-8z",
  user: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8",
  plug: "M9 2v6M15 2v6M6 8h12v4a6 6 0 0 1-12 0zM12 18v4",
  brush: "M9.06 11.9 17.5 3.5a2.12 2.12 0 0 1 3 3l-8.4 8.44M7 14a3 3 0 0 0-3 3c0 1.3-1 2-2 2 1 1.5 3 2 4.5 2a4 4 0 0 0 4-4 3 3 0 0 0-3.5-3z",
  shield: "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z",
  clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2",
  doc: "M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8zM14 3v5h5M9 13h6M9 17h6",
  wrench: "M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4z",
  dollar: "M12 2v20M17 6.5c-.8-1.5-2.6-2.5-5-2.5-3 0-5 1.5-5 3.8 0 5 10 2.6 10 7.6 0 2.3-2.2 4-5 4-2.6 0-4.5-1.1-5.3-2.8",
  compass: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM16 8l-2 6-6 2 2-6z",
  back: "M19 12H5M11 18l-6-6 6-6",
};
const Ic = ({ n, s = 16 }) => html`<svg width=${s} height=${s} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d=${I[n] || n} /></svg>`;
const Av = ({ a, lg }) => html`<span class=${"av" + (lg ? " lg" : "")} style=${"background:" + (a.color || "#1F4D3A")}>${a.ini}</span>`;
const PAv = ({ p, lg }) => html`<span class=${"av" + (lg ? " lg" : "")} style="background:#5B6B62">${p.ini}</span>`;
const stagePill = (s) => html`<span class=${"pill " + ({ "New lead": "b", Touring: "br", Offer: "a", "Under contract": "f", Closed: "g", Listing: "br", Nurture: "", Tenant: "", Booked: "b" }[s] || "")}>${s}</span>`;

// ---------- bundle: personas and modules ----------
const MODULES = [
  { id: "today", name: "Today", desc: "Your morning: what needs you, across every module", leader: "HoneyBook home, FUB dashboard", always: true },
  { id: "site", name: "Website & search", desc: "Branded site, map search, listing pages, tour booking", leader: "Zillow / Redfin listing UX; Real Geeks, Lofty IDX sites" },
  { id: "inbox", name: "Inbox", desc: "SMS, WhatsApp, email, portal and calls in one thread per person, auto-logged", leader: "Follow Up Boss inbox" },
  { id: "people", name: "People", desc: "One record per household across buying, selling, renting and investing", leader: "Follow Up Boss, Lofty" },
  { id: "pipeline", name: "Deals", desc: "Pipeline and one deal file: agreement, pay, dates, docs, e-sign", leader: "SkySlope, dotloop, ListedKit" },
  { id: "listings", name: "Listings & seller tools", desc: "Listing marketing, AI copy, distribution, seller net sheet", leader: "Lofty CMA, Rechat Studio" },
  { id: "rentals", name: "Rentals", desc: "Units, rent roll, leases, maintenance, owner statements", leader: "AppFolio, Buildium, RentRedi" },
  { id: "projects", name: "Projects", desc: "New-build inventory, launch booking, payment plans, channel partners", leader: "Sell.Do + IRIS, Farvision, Zonda" },
  { id: "backoffice", name: "Back office", desc: "Commission plans, splits, caps, CDAs, payouts, accounting export", leader: "BoldTrail BackOffice, Paperless Pipeline" },
];
const PERSONAS = {
  all: { name: "Everything (full bundle)", mods: MODULES.map(m => m.id) },
  agent: { name: "Solo agent", mods: ["today", "site", "inbox", "people", "pipeline", "listings"] },
  brokerage: { name: "Brokerage / team", mods: ["today", "site", "inbox", "people", "pipeline", "listings", "backoffice"] },
  pm: { name: "Property manager", mods: ["today", "site", "inbox", "people", "rentals"] },
  developer: { name: "Developer / builder", mods: ["today", "inbox", "people", "projects", "backoffice"] },
};
const visible = (id) => S.role && S.role.nav ? S.role.nav.includes(id) : PERSONAS[S.persona].mods.includes(id) || id === "bundle";

// ---------- personas: who is signed in ----------
// Each persona is a real seat: who they are, which screens they get, and where they land. nav: null means everything.
const ROLES = [
  { id: "broker", kind: "office", who: "maya", bundle: "all", nav: null, portals: null, home: "today", blurb: "Runs the brokerage. Sees every module, the money and the bundle switch.", sees: ["Today", "Deals", "Back office", "Commissions", "Modules"] },
  { id: "buyer-agent", kind: "office", who: "jordan", bundle: "agent", nav: ["today", "site", "inbox", "people", "pipeline"], portals: ["portal"], home: "today", blurb: "Works buyer leads from the first text to the keys.", sees: ["Inbox", "People", "Deals", "Buyer portal"] },
  { id: "listing-agent", kind: "office", who: "priya", bundle: "agent", nav: ["today", "inbox", "people", "pipeline", "listings", "listingops"], portals: ["seller"], home: "listingops", blurb: "Prices, markets and sells homes, and keeps every listing compliant.", sees: ["Listing ops", "Listings", "Offers", "Seller portal"] },
  { id: "tc", kind: "office", who: "nina", bundle: "brokerage", nav: ["today", "inbox", "pipeline", "compliance", "commissions", "trust"], portals: [], home: "compliance", blurb: "Keeps every file clean from contract to close.", sees: ["Compliance", "Deals", "CDA builder", "Earnest money"] },
  { id: "accounting", kind: "office", who: "grace", bundle: "brokerage", nav: ["people", "backoffice", "commissions", "trust", "routing"], portals: [], home: "commissions", blurb: "Pays agents, balances trust and routes new leads.", sees: ["Commissions", "Trust & EMD", "1099s", "Lead routing"] },
  { id: "pm", kind: "office", who: "leo", bundle: "pm", nav: ["today", "site", "inbox", "people", "rentals", "pmops"], portals: ["tenant", "owner"], home: "today", blurb: "Manages 2 buildings: rent, repairs, renewals and owners.", sees: ["Rentals", "PM ops", "Tenant & owner portals"] },
  { id: "tech", kind: "office", who: "ray", bundle: "pm", nav: ["pmops"], portals: [], home: "pmops/tech", mobile: true, blurb: "Today's jobs on a phone, even with no signal.", sees: ["Job list", "Photos", "Offline sync"] },
  { id: "dev", kind: "office", who: "rohan", bundle: "developer", nav: ["today", "inbox", "people", "projects", "backoffice"], portals: [], home: "projects", blurb: "Sells a 48-unit new build: inventory, holds, bookings and brokers.", sees: ["Projects", "Inventory", "Payment plans"] },
  { id: "visitor", kind: "client", name: "Website visitor", ini: "WV", title: "Browsing harborandvine.com", photo: "h-glass", home: "site", blurb: "The public site: search homes, rentals and new builds, value a home, book a tour.", sees: ["Buy", "Rent", "Sell", "New homes"] },
  { id: "buyer", kind: "client", name: "Elena Ruiz", ini: "ER", title: "Buying her first home", photo: "i-family", home: "portal", blurb: "Budget, search, tours, offer and closing in one place.", sees: ["BuyAbility", "Tours", "Offer", "Closing"] },
  { id: "seller", kind: "client", name: "Rachel & Tom Grant", ini: "RG", title: "Selling 4 Willow Bend", photo: "h-lakeway", home: "seller/home", blurb: "Price, prep, showings and offers, with their net on every one.", sees: ["Net sheet", "Showings", "Offers"] },
  { id: "tenant", kind: "client", name: "Hannah Cole", ini: "HC", title: "Renting 3B, Eastside Lofts", photo: "i-loft", home: "tenant", blurb: "Pay rent with no surprise fees, fix things fast, renew in a tap.", sees: ["Pay rent", "Repairs", "Lease"] },
  { id: "landlord", kind: "client", name: "Brooks Holdings LLC", ini: "BH", title: "Owns Eastside Lofts", photo: "b-eastside", home: "owner", blurb: "Statements, approvals and payouts for the building.", sees: ["Statement", "Approvals", "Payouts"] },
];
const roleById = (id) => ROLES.find(r => r.id === id);
try { const saved = roleById(localStorage.getItem("eos-role")); if (saved) { S.role = saved; S.persona = saved.bundle || "all"; } } catch (e) {}
function eosSetRole(r) {
  S.role = r; S.persona = (r && r.bundle) || "all"; S.modal = null; S.toast = null; S.ui.pop = null; S.ui.pal = null; S.ui.drawer = false;
  try { r ? localStorage.setItem("eos-role", r.id) : localStorage.removeItem("eos-role"); } catch (e) {}
}
function asRole(r) {
  up(() => eosSetRole(r));
  eosAudit("Signed in as " + eosRoleName(r), eosRoleName(r));
  go(r.home);
}
const me = () => (S.role && S.role.who ? A(S.role.who) : A("maya"));
const isClient = () => !!(S.role && S.role.kind === "client");
// Portal pages call these for their "back" button: clients return to the persona picker, staff to their office.
function leavePortal(route) { go(isClient() ? "start" : route); }
const leaveLabel = (label) => isClient() ? "⇄ Switch persona" : label;
const eosRoleName = (r) => !r ? "Demo" : r.kind === "client" ? r.name : A(r.who).name;
const eosRoleTitle = (r) => !r ? "Full bundle" : r.kind === "client" ? r.title : A(r.who).role;
const eosActor = () => S.role ? eosRoleName(S.role) : "Maya Ortiz";

// ================= ACCESS =================
// Which seat may open which screen. Records (person, deal, listing) open from any module that links to them.
const EOS_OFFICE = ["today", "site", "inbox", "people", "person", "pipeline", "deal", "listings", "listing", "rentals", "projects", "backoffice", "bundle", "settings", "portal"];
const EOS_DETAIL = { person: ["people", "inbox", "routing", "rentals", "pipeline"], deal: ["pipeline", "compliance", "commissions", "trust", "backoffice", "listingops"], listing: ["listings", "listingops", "pipeline"] };
const eosGated = () => new Set([...EOS_OFFICE, ...EXT.flatMap(x => x.nav || []).map(n => n.id)]);
function canSee(page, role = S.role) {
  if (!page || !role || !eosGated().has(page)) return true;
  if (role.kind === "client") return page === role.home.split("/")[0] || page === "site";
  if (page === "settings" || page === "site" || role.nav === null) return true;
  if (page === "bundle") return false;
  if (EOS_DETAIL[page]) return EOS_DETAIL[page].some(m => role.nav.includes(m));
  return role.nav.includes(page) || (role.portals || []).includes(page);
}
const canRoute = (route, role) => canSee(String(route || "").split("/")[0], role);

// ================= NOTIFICATIONS =================
// window.notify({ who, text, route, at }): who is an agent id (jordan), a role id (buyer, seller, tenant, landlord, visitor), "staff" or "all".
const EOS_MIN = 60000;
let eosNid = 0;
S.notifs = [];
function notify(item) {
  if (!item || !item.text) return null;
  const n = { id: "N" + (++eosNid), who: item.who || "all", text: item.text, route: item.route || "", at: item.at || Date.now(), read: !!item.read };
  S.notifs.unshift(n); S.notifs.sort((a, b) => eosTime(b.at) - eosTime(a.at));
  rerender(); return n.id;
}
window.notify = notify;
const eosTime = (at) => typeof at === "number" ? at : Date.now();
function eosAgo(at) {
  if (typeof at !== "number") return at || "";
  const m = Math.round((Date.now() - at) / EOS_MIN);
  if (m < 1) return "just now"; if (m < 60) return m + "m ago"; if (m < 1440) return Math.round(m / 60) + "h ago";
  if (m < 2880) return "Yesterday"; return Math.round(m / 1440) + "d ago";
}
function eosForMe(n, role = S.role) {
  role = role || roleById("broker"); // no seat picked: the office runs as Maya
  const w = [].concat(n.who);
  return w.includes("all") || w.includes(role.id) || (role.who && w.includes(role.who)) || (role.kind === "office" && w.includes("staff"));
}
const eosMyNotifs = () => S.notifs.filter(n => eosForMe(n));
const eosUnread = () => eosMyNotifs().filter(n => !n.read).length;
[
  ["maya", "2 CDAs from September closings are waiting for your approval", "commissions", 14],
  ["maya", "Jordan closed 120 Ranch Gate Rd for Olivia Park", "deal/D8", 60 * 26, true],
  ["maya", "Website tour requests are up 18% this week", "site", 60 * 5],
  ["jordan", "Aisha Brooks: “Can we ask for an AC credit after the inspection?”", "inbox/T2", 2],
  ["jordan", "Option period on 515 Ridgeview Ln ends in 2 days", "deal/D1", 45],
  ["jordan", "Marcus Webb viewed 2210 Barton Hills Dr 3 times today", "person/P3", 180, true],
  ["priya", "Offers are due Friday on 4 Willow Bend · 2 in so far", "deal/D2", 25],
  ["priya", "Rachel Grant asked what they'll walk away with", "inbox/T3", 60],
  ["priya", "1806 Kinney Ave goes live on Monday · photos approved", "listing/L4", 60 * 20, true],
  ["nina", "Wire fraud advisory is missing on 515 Ridgeview Ln", "compliance/D1", 8],
  ["nina", "Kenji Watanabe's contract on 3402 Govalle Ave was uploaded", "compliance/D3", 95],
  ["grace", "Earnest money for 515 Ridgeview Ln cleared trust", "trust", 33],
  ["grace", "New Zillow lead is waiting to be routed", "routing", 12],
  ["grace", "September payouts are ready to export to QuickBooks", "commissions", 60 * 22, true],
  ["leo", "Hannah Cole reported a leaking kitchen sink in 3B (urgent)", "rentals", 30],
  ["leo", "Unit 3C renewal decision is due this week", "rentals", 60 * 4],
  ["ray", "New job: 3B kitchen sink leak, Eastside Lofts", "pmops/tech", 28],
  ["ray", "Polar Air confirmed Fri 9–11 am for unit 1B", "pmops/tech", 60 * 18, true],
  ["rohan", "Nair family is ready to book unit 604 at The Linden", "projects", 40],
  ["rohan", "2 holds expire tonight at 11:59 pm", "projects", 60 * 3],
  ["buyer", "Sam saved a new match for you: 1806 Kinney Ave", "portal/find", 50],
  ["buyer", "Your pre-approval checklist has 4 documents to upload", "portal/budget", 60 * 9],
  ["seller", "3 showings are booked for this weekend", "seller/showings", 70],
  ["seller", "A new offer came in on 4 Willow Bend", "seller/offers", 20],
  ["tenant", "A plumber is booked for your sink today, 1–3 pm", "tenant/fix", 25],
  ["tenant", "November rent of $1,750 is due Nov 1", "tenant/pay", 60 * 30, true],
  ["landlord", "Approval needed: sink repair in 3B", "owner/approvals", 35],
  ["landlord", "Your September statement is ready", "owner/statement", 60 * 40, true],
  ["visitor", "Price cut on 2210 Barton Hills Dr: now $895,000", "site/L2", 90],
  ["visitor", "Open house Saturday 1–3 pm at 4 Willow Bend", "site/L1", 60 * 6],
  ["staff", "New: TREC 2026 contract forms are live in e-sign", "settings/integrations", 60 * 50, true],
].forEach(([who, text, route, mins, read]) => notify({ who, text, route, at: Date.now() - mins * EOS_MIN, read }));

// ================= SETTINGS STATE + AUDIT =================
S.set = {
  brand: { name: "Harbor & Vine Realty", color: "#1F4D3A" },
  profiles: {},
  prefs: { lead: [1, 1, 1], msg: [1, 0, 1], offer: [1, 1, 1], dates: [1, 1, 0], comp: [1, 1, 0], money: [1, 1, 0], maint: [1, 0, 1], access: [1, 1, 0] },
  quiet: { on: true, from: "21:00", to: "07:00" }, digest: "daily",
  integrations: {
    mls: { on: true, sync: 6 }, qbo: { on: true, sync: 42 }, twilio: { on: true, sync: 1 }, esign: { on: true, sync: 12 }, stripe: { on: true, sync: 18 }, gcal: { on: false }, zillow: { on: true, sync: 3 },
  },
  requests: [{ id: "R1", role: "tc", page: "listings", at: Date.now() - 60 * 7 * EOS_MIN, status: "pending" }],
  audit: [],
};
function eosAudit(text, who) { if (!S.set) return; S.set.audit.unshift({ at: Date.now(), who: who || eosActor(), text: String(text), where: S.route.page + (S.route.id ? "/" + S.route.id : "") }); if (S.set.audit.length > 200) S.set.audit.pop(); }
[
  ["Grace Liu", "Exported September payouts to QuickBooks · 14 lines", "trust/export", 60 * 20],
  ["Maya Ortiz", "Approved CDA · 120 Ranch Gate Rd", "commissions", 60 * 26],
  ["Nina Patel", "Marked seller's disclosure accepted · 4 Willow Bend", "compliance/D2", 60 * 30],
  ["Jordan Lee", "Sent buyer representation agreement to Marcus Webb", "deal/D4", 60 * 31],
  ["Maya Ortiz", "Changed Sam Carter's plan to 75/25 with a $18,000 cap", "commissions/plans", 60 * 50],
  ["Leo Grant", "Renewed lease · Eastside Lofts 2C", "rentals", 60 * 54],
].forEach(([who, text, where, mins]) => S.set.audit.push({ at: Date.now() - mins * EOS_MIN, who, text, where }));

// ================= SEARCH =================
// window.EOS_SEARCH: other files push providers, functions (q) => [{ label, sub, route, kind }]. The shell filters by query and access.
window.EOS_SEARCH = window.EOS_SEARCH || [];
const EOS_LABELS = { start: "Choose a seat", today: "Today", site: "Website", inbox: "Inbox", people: "People", person: "Person", pipeline: "Deals", deal: "Deal", listings: "Listings", listing: "Listing", rentals: "Rentals", projects: "Projects", backoffice: "Back office", bundle: "Modules", settings: "Settings", portal: "Buyer portal" };
function eosLabel(page) {
  const n = EXT.flatMap(x => x.nav || []).find(n => n.id === page);
  return EOS_LABELS[page] || (n && n.label) || (page ? page[0].toUpperCase() + page.slice(1) : "");
}
function eosIndex() {
  const out = [], push = (kind, label, sub, route, extra) => out.push({ kind, label, sub, route, ...extra });
  const pages = ["today", "site", "inbox", "people", "pipeline", "listings", "rentals", "projects", "backoffice", ...EXT.flatMap(x => x.nav || []).map(n => n.id), "settings"];
  [...new Set(pages)].forEach(p => push("Pages", eosLabel(p), "Go to " + eosLabel(p), p, { icon: I[p] ? p : (EXT.flatMap(x => x.nav || []).find(n => n.id === p) || {}).icon || "arrow" }));
  [["profile", "Profile"], ["notifications", "Notification preferences"], ["team", "Team & permissions"], ["integrations", "Integrations"], ["branding", "Branding"], ["audit", "Audit log"]].forEach(([k, l]) => push("Settings", l, "Settings", "settings/" + k, { icon: "gear" }));
  S.d.people.forEach(p => push("People", p.name, [p.stage, p.roles && p.roles.join(", "), A(p.owner) && A(p.owner).name].filter(Boolean).join(" · "), "person/" + p.id, { ini: p.ini }));
  S.d.deals.forEach(d => { const l = L(d.listing), p = P(d.person); push("Deals", (l ? l.addr : d.id) + (p ? " · " + p.short : ""), d.kind + " · " + d.stage + " · " + usd(d.price), "deal/" + d.id, { icon: "pipeline" }); });
  const staffListing = canSee("listing");
  S.d.listings.forEach(l => push("Listings", l.addr, l.area + " · " + usd(l.price) + " · " + l.status, (staffListing ? "listing/" : "site/") + l.id, { img: l.img }));
  S.d.threads.forEach(t => { const p = P(t.person); push("Inbox", (p ? p.name : "Thread") + " · " + t.subject, t.channel + (t.unread ? " · " + t.unread + " unread" : ""), "inbox/" + t.id, { icon: "inbox" }); });
  const unitRoute = canSee("rentals") ? "rentals" : "pmops";
  S.d.units.forEach(u => { const b = S.d.buildings.find(x => x.id === u.b); push("Units", (b ? b.name + " · " : "") + u.name, (u.tenant || "Vacant") + " · " + usd(u.rent) + "/mo · " + u.status, unitRoute, { icon: "rentals" }); });
  S.d.tickets.forEach(t => { const u = S.d.units.find(x => x.id === t.unit); push("Maintenance", t.title, (u ? "Unit " + u.name + " · " : "") + t.status + " · " + t.priority, canSee("rentals") ? "rentals" : "pmops/tech", { icon: "wrench" }); });
  (window.EOS_SEARCH || []).forEach(fn => { try { const r = typeof fn === "function" ? fn() : fn; (r || []).forEach(x => x && x.label && x.route && out.push({ kind: x.kind || "More", label: x.label, sub: x.sub || "", route: x.route, icon: x.icon || "arrow" })); } catch (e) {} });
  [
    ["Switch persona", "Pick another seat", () => go("start"), "swap"],
    ["Watch the full story", "Guided tour across 7 seats", () => eosTourStart(), "play"],
    ...(S.role ? [["Sign out", "Back to the seat picker", () => eosSignOut(), "logout"]] : []),
  ].forEach(([label, sub, run, icon]) => push("Actions", label, sub, "", { run, icon }));
  return out.filter(x => x.run || canRoute(x.route));
}
function eosScore(x, q) {
  const l = x.label.toLowerCase(), all = l + " " + (x.sub || "").toLowerCase() + " " + x.kind.toLowerCase();
  if (!q.split(/\s+/).every(t => all.includes(t))) return 0;
  return l.startsWith(q) ? 100 : l.split(/[\s·&#,]+/).some(w => w.startsWith(q)) ? 60 : l.includes(q) ? 40 : 10;
}
function eosRecent(item) {
  const key = item.route || item.label;
  S.recent = [{ ...item, run: undefined }, ...S.recent.filter(r => (r.route || r.label) !== key)].slice(0, 6);
  try { localStorage.setItem("eos-recent", JSON.stringify(S.recent)); } catch (e) {}
}
try { S.recent = JSON.parse(localStorage.getItem("eos-recent") || "[]").filter(r => r && r.route); } catch (e) {}
function eosOpenPal(q = "") { if (!S.ui.pal && !document.querySelector(".scrim")) eosPrevFocus = document.activeElement; up(s => { s.ui.pal = { q }; s.ui.pop = null; s.ui.drawer = false; }); }
function eosClosePal() { up(s => { s.ui.pal = null; }); }

function EosPalette() {
  const [q, setQ] = useState(S.ui.pal.q || ""), [sel, setSel] = useState(0);
  const inp = useRef(), list = useRef();
  useEffect(() => { inp.current && inp.current.focus(); }, []);
  useEffect(() => { const el = list.current && list.current.querySelector(".eos-pi.on"); el && el.scrollIntoView({ block: "nearest" }); }, [sel, q]);
  const qq = q.trim().toLowerCase();
  let groups;
  if (!qq) {
    const rec = S.recent.filter(r => canRoute(r.route)).map(r => ({ ...r, kind: "Recent" }));
    const idx = eosIndex();
    groups = [["Recent", rec], ["Jump to", idx.filter(x => x.kind === "Pages").slice(0, 8)], ["Actions", idx.filter(x => x.kind === "Actions")]];
  } else {
    const scored = eosIndex().map(x => [eosScore(x, qq), x]).filter(([s]) => s > 0).sort((a, b) => b[0] - a[0]).map(([, x]) => x);
    const byKind = {}; scored.forEach(x => { (byKind[x.kind] = byKind[x.kind] || []).length < 6 && byKind[x.kind].push(x); });
    groups = Object.entries(byKind);
  }
  groups = groups.filter(([, xs]) => xs.length);
  const flat = groups.flatMap(([, xs]) => xs);
  const pick = (x) => {
    if (!x) return;
    eosRecent(x); up(s => { s.ui.pal = null; });
    if (x.run) x.run(); else go(x.route);
  };
  const onKey = (e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setSel(i => Math.min(flat.length - 1, i + 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setSel(i => Math.max(0, i - 1)); }
    else if (e.key === "Enter") { e.preventDefault(); pick(flat[sel]); }
  };
  let k = -1;
  const scope = S.role ? eosRoleName(S.role) + (S.role.nav === null ? " · full access" : " · " + eosRoleTitle(S.role)) : "Full bundle";
  return html`<div class="scrim eos-pal-scrim" onClick=${e => e.target === e.currentTarget && eosClosePal()}>
    <div class="eos-pal" role="dialog" aria-modal="true" aria-label="Search everything">
      <div class="eos-pal-in"><${Ic} n="search" s=${18} />
        <input ref=${inp} value=${q} placeholder="Search people, homes, deals, units, threads…" aria-label="Search" role="combobox" aria-expanded="true" aria-controls="eos-pal-list"
          onInput=${e => { setQ(e.target.value); setSel(0); }} onKeyDown=${onKey} />
        <kbd>Esc</kbd></div>
      <div class="eos-pal-list" id="eos-pal-list" role="listbox" ref=${list}>
        ${flat.length ? groups.map(([g, xs]) => html`<div class="eos-pg"><div class="eos-pg-h">${g}</div>
          ${xs.map(x => { k++; const i = k; return html`<button class=${"eos-pi" + (i === sel ? " on" : "")} role="option" aria-selected=${i === sel} onMouseMove=${() => sel !== i && setSel(i)} onClick=${() => pick(x)}>
            ${x.img ? html`<img class="eos-pi-img" src=${img(x.img)} alt="" />` : x.ini ? html`<span class="av">${x.ini}</span>` : html`<span class="eos-pi-ic"><${Ic} n=${x.icon || "arrow"} s=${15} /></span>`}
            <span class="eos-pi-t"><b>${x.label}</b>${x.sub && html`<small>${x.sub}</small>`}</span>
            <span class="eos-pi-k">${x.kind === "Recent" ? "Recent" : x.run ? "Action" : g === "Jump to" ? "Page" : x.kind}</span></button>`; })}</div>`)
        : html`<div class="eos-pal-empty"><${Ic} n="search" s=${22} /><b>No results for “${q}”</b><span>Try a name, an address, a unit like “3B” or a page like “Deals”.</span></div>`}
      </div>
      <div class="eos-pal-ft"><span><kbd>↑</kbd><kbd>↓</kbd> move</span><span><kbd>↵</kbd> open</span><span><kbd>Esc</kbd> close</span><span class="sp"></span><span class="muted">Scoped to ${scope}</span></div>
    </div></div>`;
}

// ================= POPOVERS: notifications + profile =================
const eosTogglePop = (k) => up(s => { s.ui.pop = s.ui.pop === k ? null : k; s.ui.pal = null; });
function eosNotifIcon(route) {
  const p = String(route || "").split("/")[0];
  return { inbox: "inbox", deal: "pipeline", pipeline: "pipeline", person: "people", people: "people", listing: "listings", listings: "listings", rentals: "rentals", projects: "projects", compliance: "shield", commissions: "dollar", trust: "dollar", routing: "people", pmops: "wrench", tenant: "wrench", owner: "doc", seller: "listings", portal: "today", site: "site", settings: "gear" }[p] || "bell";
}
function NotifBell({ up: upward }) {
  const n = eosUnread(), open = S.ui.pop === "notif";
  return html`<div class="eos-popwrap">
    <button class=${"eos-ib eos-bell" + (n ? " has" : "")} aria-label=${"Notifications" + (n ? ", " + n + " unread" : "")} title="Notifications" aria-expanded=${open} onClick=${() => eosTogglePop("notif")}>
      <${Ic} n="bell" s=${18} />${n ? html`<i class="eos-badge num">${n > 9 ? "9+" : n}</i>` : ""}</button>
    ${open && html`<${NotifPanel} upward=${upward} />`}</div>`;
}
function NotifPanel({ upward }) {
  const [tab, setTab] = useState("all");
  const all = eosMyNotifs(), list = tab === "unread" ? all.filter(n => !n.read) : all, unread = all.filter(n => !n.read).length;
  const open = (n) => { up(s => { n.read = true; s.ui.pop = null; }); if (n.route) go(n.route); };
  return html`<div class=${"eos-pop eos-notif" + (upward ? " upward" : "")} role="dialog" aria-label="Notifications">
    <div class="eos-pop-hd"><b>Notifications</b>${unread ? html`<span class="pill r">${unread} new</span>` : ""}<span class="sp"></span>
      <button class="btn sm ghost" disabled=${!unread} title=${unread ? "" : "Nothing unread"} onClick=${() => up(() => all.forEach(n => { n.read = true; }))}>Mark all read</button></div>
    <div class="eos-seg" role="tablist">${[["all", "All"], ["unread", "Unread"]].map(([k, l]) => html`<button role="tab" aria-selected=${tab === k} class=${tab === k ? "on" : ""} onClick=${() => setTab(k)}>${l}${k === "unread" && unread ? " · " + unread : ""}</button>`)}</div>
    <div class="eos-nl">${list.length ? list.map(n => html`<button class=${"eos-ni" + (n.read ? "" : " unread")} onClick=${() => open(n)}>
        <span class="eos-ni-ic"><${Ic} n=${eosNotifIcon(n.route)} s=${15} /></span>
        <span class="eos-ni-t"><span>${n.text}</span><small>${eosAgo(n.at)}${n.route ? " · " + eosLabel(n.route.split("/")[0]) : ""}</small></span>
        ${!n.read && html`<i class="eos-ni-dot" aria-label="Unread"></i>`}</button>`)
      : html`<div class="eos-nl-empty"><span class="eos-ni-ic big"><${Ic} n="check" s=${20} /></span><b>You're all caught up</b><span>New tours, offers, payments and repairs land here.</span></div>`}</div>
    ${!isClient() && html`<div class="eos-pop-ft"><button class="btn sm ghost" onClick=${() => go("settings/notifications")}><${Ic} n="gear" s=${14} /> Notification settings</button></div>`}
  </div>`;
}
function eosSignOut() {
  eosAudit("Signed out");
  up(() => { eosSetRole(null); S.tour = null; });
  go("start"); toast("Signed out of the demo workspace");
}
function ProfileButton({ up: upward }) {
  const open = S.ui.pop === "profile", r = S.role, client = isClient();
  const name = client ? r.name : me().name, title = client ? r.title : me().role;
  const avatar = client ? html`<span class="av" style="background:var(--brass)">${r.ini}</span>` : html`<${Av} a=${me()} />`;
  const email = client ? "" : (S.set.profiles[me().id] || {}).email || me().id + "@harborandvine.com";
  return html`<div class="eos-popwrap">
    <button class="eos-avbtn" aria-label=${"Account menu for " + name} title="Account" aria-expanded=${open} aria-haspopup="menu" onClick=${() => eosTogglePop("profile")}>${avatar}</button>
    ${open && html`<div class=${"eos-pop eos-menu" + (upward ? " upward" : "")} role="menu" aria-label="Account">
      <div class="eos-menu-hd">${client ? html`<span class="av lg" style="background:var(--brass)">${r.ini}</span>` : html`<${Av} a=${me()} lg />`}<div><b>${name}</b><small>${title}</small>${email && html`<small class="mono">${email}</small>`}</div></div>
      <button role="menuitem" onClick=${() => go("start")}><${Ic} n="swap" /> Switch persona</button>
      ${!client && html`<button role="menuitem" onClick=${() => go("settings/profile")}><${Ic} n="gear" /> Settings</button>`}
      <button role="menuitem" onClick=${() => { up(s => { s.ui.pop = null; }); eosOpenPal(""); }}><${Ic} n="search" /> Search <kbd>${EOS_MOD}K</kbd></button>
      <button role="menuitem" onClick=${() => { up(s => { s.ui.pop = null; }); eosTourStart(); }}><${Ic} n="play" /> Watch the full story</button>
      <div class="eos-menu-sep"></div>
      <button role="menuitem" class="danger" onClick=${eosSignOut}><${Ic} n="logout" /> Sign out</button>
    </div>`}</div>`;
}
const EOS_MOD = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent) ? "⌘" : "Ctrl ";
const SearchBtn = ({ compact }) => html`<button class=${"search eos-search" + (compact ? " compact" : "")} aria-label="Search (Ctrl or ⌘ K)" title="Search · ⌘K" onClick=${() => eosOpenPal("")}
  onKeyDown=${e => { if (e.key.length === 1 && e.key !== " " && !e.metaKey && !e.ctrlKey) { e.preventDefault(); eosOpenPal(e.key); } }}><${Ic} n="search" /><span>Search people, homes, deals…</span><kbd>${EOS_MOD}K</kbd></button>`;
// Client portals can embed these in their own top bar: html`<${EosChrome.Tools} />` (the floating dock then hides itself).
window.EosChrome = { Bell: NotifBell, Account: ProfileButton, Search: SearchBtn, Tools: () => html`<div class="eos-embed"><${SearchBtn} compact /><${NotifBell} /><${ProfileButton} /></div>` };

// ================= OFFICE SHELL =================
function eosNav() {
  const pg = S.route.page, active = { person: "people", deal: "pipeline", listing: "listings" }[pg] || pg;
  const unread = S.d.threads.reduce((a, t) => a + t.unread, 0);
  const counts = { inbox: unread, rentals: S.d.tickets.filter(t => t.status === "New").length };
  const core = [["today", "Today"], ["site", "Website"], ["inbox", "Inbox"], ["people", "People"], ["pipeline", "Deals"], ["listings", "Listings"], ["rentals", "Rentals"], ["projects", "Projects"], ["backoffice", "Back office"]]
    .filter(([id]) => visible(id)).map(([id, label]) => ({ id, label, icon: id, count: counts[id], on: active === id }));
  const ext = EXT.flatMap(x => x.nav || []).filter(n => n.group === "office" && (S.role && S.role.nav ? S.role.nav.includes(n.id) : visible(n.mod)))
    .map(n => ({ id: n.id, label: n.label, icon: n.icon, on: active === n.id || (n.also || []).includes(pg) }));
  const ports = [{ id: "portal", label: "Buyer portal", icon: "people", mod: "pipeline" }, ...EXT.flatMap(x => x.nav || []).filter(n => n.group === "portal")]
    .filter(n => S.role && S.role.portals ? S.role.portals.includes(n.id) : visible(n.mod)).map(n => ({ ...n, on: active === n.id }));
  return { main: [...core, ...ext], ports, active };
}
const NavBtn = ({ n }) => html`<button class=${"nav" + (n.on ? " on" : "")} aria-current=${n.on ? "page" : null} onClick=${() => go(n.id)}><${Ic} n=${n.icon} /><span>${n.label}</span>${n.count ? html`<i class="ct">${n.count}</i>` : ""}</button>`;
function Shell({ children, title, sub, actions }) {
  const { main, ports, active } = eosNav();
  const brand = S.set.brand, full = !(S.role && S.role.nav);
  const tabs = main.slice(0, 4);
  return html`<div class=${"shell" + (S.ui.drawer ? " eos-drawer-open" : "")}>
    <aside class="side" id="eos-side" aria-label="Main navigation">
      <div class="brand"><span class="mk" style=${"background:" + brand.color}>E</span><div><b>Estate OS</b><small>${brand.name}</small></div>
        <button class="eos-ib eos-drawer-x" aria-label="Close menu" onClick=${() => up(s => { s.ui.drawer = false; })}><${Ic} n="x" /></button></div>
      ${S.role && S.role.who !== "maya" ? html`<button class="rs-seat" onClick=${() => go("start")} title="Switch persona"><span class="lbl">Viewing as</span><b>${me().role}</b><i>Switch ⇄</i></button>` : html`<div class="persona"><label for="persona">Bundle</label>
        <select id="persona" value=${S.persona} onChange=${e => { const v = e.target.value; up(s => { s.persona = v; }); if (!PERSONAS[v].mods.includes(active)) go("today"); toast("Showing the " + PERSONAS[v].name + " bundle"); }}>
          ${Object.entries(PERSONAS).map(([k, p]) => html`<option value=${k}>${p.name}</option>`)}</select></div>`}
      ${main.map(n => html`<${NavBtn} n=${n} />`)}
      ${ports.length ? html`<div class="nav-h">Client portals</div>${ports.map(n => html`<${NavBtn} n=${n} />`)}` : ""}
      <div class="nav-h">Setup</div>
      ${full && html`<button class=${"nav" + (active === "bundle" ? " on" : "")} onClick=${() => go("bundle")}><${Ic} n="bundle" /><span>Modules</span></button>`}
      <button class=${"nav" + (active === "settings" ? " on" : "")} onClick=${() => go("settings")}><${Ic} n="gear" /><span>Settings</span></button>
      <button class="me rs-me" onClick=${() => go("start")} title="Switch persona" aria-label=${"Switch persona (signed in as " + me().name + ")"}><${Av} a=${me()} /><div><b style="font-size:13px">${me().name}</b><div class="muted" style="font-size:11.5px">${me().role} · switch ⇄</div></div></button>
    </aside>
    ${S.ui.drawer && html`<div class="eos-drawer-scrim" onClick=${() => up(s => { s.ui.drawer = false; })}></div>`}
    <main class="main">
      <div class="top">
        <button class="eos-ib eos-ham" aria-label="Open menu" aria-controls="eos-side" aria-expanded=${S.ui.drawer} onClick=${() => up(s => { s.ui.drawer = true; s.ui.pop = null; })}><${Ic} n="menu" s=${20} /></button>
        <div class="eos-ttl"><h1>${title}</h1>${sub && html`<div class="sub">${sub}</div>`}</div><span class="sp"></span>
        ${actions && html`<div class="eos-acts">${actions}</div>`}
        <div class="eos-tools"><${SearchBtn} />
          <button class="eos-ib eos-swap" aria-label="Switch persona" title="Switch persona" onClick=${() => go("start")}><${Ic} n="swap" s=${18} /></button>
          <${NotifBell} /><${ProfileButton} /></div></div>
      ${children}
    </main>
    <nav class="eos-tabbar" aria-label="Quick navigation">
      ${tabs.map(n => html`<button class=${n.on ? "on" : ""} aria-current=${n.on ? "page" : null} onClick=${() => go(n.id)}><span class="eos-tb-ic"><${Ic} n=${n.icon} s=${19} />${n.count ? html`<i>${n.count}</i>` : ""}</span><span>${n.label}</span></button>`)}
      <button class=${tabs.some(t => t.on) ? "" : "on"} onClick=${() => up(s => { s.ui.drawer = true; })} aria-label="More pages"><span class="eos-tb-ic"><${Ic} n="menu" s=${19} /></span><span>More</span></button>
    </nav>
  </div>`;
}

// ================= MODALS =================
// buyer agreement before touring (settlement-native); from the site it creates the person, thread and deal in one go
function openAgreement(person, listingId, deal, when, mode) {
  up(s => { s.modal = { kind: "agreement", person, listingId, deal, when, mode }; });
}
function openSign(deal, docName) { up(s => { s.modal = { kind: "sign", deal, docName }; }); }
function Modal() {
  const m = S.modal; if (!m) return null;
  const close = () => up(s => { s.modal = null; });
  if (m.kind === "eos-confirm") return html`<${EosConfirm} m=${m} close=${close} />`;
  if (m.kind === "agreement") return html`<${AgreementModal} m=${m} close=${close} />`;
  if (m.kind === "sign") return html`<${SignModal} m=${m} close=${close} />`;
  if (m.kind === "offers") return html`<${OffersModal} m=${m} close=${close} />`;
  if (m.kind === "ptour") return html`<${PTourModal} m=${m} close=${close} />`;
  for (const x of EXT) if (x.modals && x.modals[m.kind]) { const C = x.modals[m.kind]; return html`<${C} m=${m} close=${close} />`; }
  return null;
}
// Generic confirm: up(s => { s.modal = { kind: "eos-confirm", title, body, ok, danger, onOk } })
function EosConfirm({ m, close }) {
  return html`<div class="scrim" onClick=${e => e.target === e.currentTarget && close()}><div class="modal eos-confirm" role="alertdialog" aria-modal="true" aria-label=${m.title}>
    <div class="hd"><h3>${m.title}</h3><button class="btn sm ghost" aria-label="Close" onClick=${close}><${Ic} n="x" /></button></div>
    <div class="bd"><p style="margin:0;color:var(--ink-2)">${m.body}</p></div>
    <div class="ft"><button class="btn" onClick=${close}>Cancel</button><button class=${"btn " + (m.danger ? "eos-danger" : "pri")} onClick=${() => { close(); m.onOk && m.onOk(); }}>${m.ok || "Confirm"}</button></div></div></div>`;
}
// Global overlay behaviour: Esc closes the top layer, Tab stays inside an open dialog, focus returns to where it was.
function eosCloseTop() {
  if (S.ui.pal) { eosClosePal(); return true; }
  if (S.ui.pop) { up(s => { s.ui.pop = null; }); return true; }
  if (S.ui.drawer) { up(s => { s.ui.drawer = false; }); return true; }
  if (S.modal) { up(s => { s.modal = null; }); return true; }
  const sc = [...document.querySelectorAll(".scrim")].pop();
  if (sc) { sc.click(); return true; }
  return false;
}
const eosTyping = (el) => el && (/^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName) || el.isContentEditable);
const EOS_FOCUSABLE = 'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
addEventListener("keydown", e => {
  if ((e.metaKey || e.ctrlKey) && !e.altKey && e.key.toLowerCase() === "k") { e.preventDefault(); S.ui.pal ? eosClosePal() : eosOpenPal(""); return; }
  if (e.key === "Escape") { if (!e.defaultPrevented && eosCloseTop()) e.preventDefault(); return; }
  if (e.key === "/" && !eosTyping(e.target) && !S.ui.pal && S.route.page !== "start" && !document.querySelector(".scrim")) { e.preventDefault(); eosOpenPal(""); return; }
  if (e.key === "Tab") {
    const box = [...document.querySelectorAll(".scrim")].pop() || (S.ui.drawer && document.getElementById("eos-side"));
    if (!box) return;
    const f = [...box.querySelectorAll(EOS_FOCUSABLE)].filter(x => x.offsetParent !== null);
    if (!f.length) return;
    const i = f.indexOf(document.activeElement);
    if (e.shiftKey && (i <= 0)) { e.preventDefault(); f[f.length - 1].focus(); }
    else if (!e.shiftKey && (i === -1 || i === f.length - 1)) { e.preventDefault(); f[0].focus(); }
  }
});
addEventListener("mousedown", e => {
  if (S.ui.pop && !e.target.closest(".eos-popwrap")) up(s => { s.ui.pop = null; });
});
let eosScrimSeen = null, eosPrevFocus = null;
function eosFocusWatch() {
  const sc = [...document.querySelectorAll(".scrim")].pop();
  if (sc && sc !== eosScrimSeen) {
    eosScrimSeen = sc;
    if (!sc.contains(document.activeElement)) {
      eosPrevFocus = document.activeElement;
      const t = sc.querySelector("[autofocus]") || sc.querySelector(".modal .bd input:not([type=range]):not([type=checkbox]):not([disabled]), .modal .bd textarea, .modal .bd select") || sc.querySelector(".modal " + "button:not([disabled])") || sc.querySelector(EOS_FOCUSABLE);
      t && t.focus({ preventScroll: true });
    }
  } else if (!sc && eosScrimSeen) {
    eosScrimSeen = null;
    if (eosPrevFocus && eosPrevFocus.isConnected && eosPrevFocus !== document.body) eosPrevFocus.focus({ preventScroll: true });
    eosPrevFocus = null;
  }
}
new MutationObserver(() => requestAnimationFrame(eosFocusWatch)).observe(document.getElementById("app"), { childList: true, subtree: true });

// ================= STATES: skeleton, 404, no access =================
function EosSkeleton() {
  const pg = S.route.page;
  return html`<${Shell} title=${eosLabel(pg)} sub="Loading…"><div class="page eos-sk" aria-busy="true" aria-label="Loading">
    <div class="kpis">${[0, 1, 2, 3].map(() => html`<div class="kpi"><i class="eos-skl" style="width:40%"></i><i class="eos-skl big" style="width:65%"></i></div>`)}</div>
    <div class="split"><div class="card"><div class="bd">${[90, 75, 82, 60, 70].map(w => html`<div class="eos-skrow"><i class="eos-skl dot"></i><i class="eos-skl" style=${"width:" + w + "%"}></i></div>`)}</div></div>
      <div class="card"><div class="bd"><i class="eos-skl block"></i><i class="eos-skl" style="width:80%"></i><i class="eos-skl" style="width:55%"></i></div></div></div>
  </div></${Shell}>`;
}
function EosSolo({ children }) {
  return html`<div class="rs eos-solo"><header class="rs-top"><div class="brand"><span class="mk" style=${"background:" + S.set.brand.color}>E</span><div><b>Estate OS</b><small>${S.set.brand.name}</small></div></div><span class="sp"></span>
    ${S.role && html`<${NotifBell} /><${ProfileButton} />`}</header>${children}</div>`;
}
function eosHomeLabel() { return S.role ? eosLabel(S.role.home.split("/")[0]) : "Today"; }
function EosNotFound() {
  const path = location.hash.replace(/^#\/?/, "") || "";
  const quick = (S.role ? [S.role.home.split("/")[0], ...(S.role.kind === "office" ? (S.role.nav || ["today", "inbox", "people", "pipeline"]) : ["site"])] : ["today", "inbox", "people", "pipeline"]).filter((x, i, a) => a.indexOf(x) === i && canSee(x)).slice(0, 5);
  const body = html`<div class="eos-state">
    <div class="eos-state-ic"><${Ic} n="compass" s=${28} /></div>
    <div class="lbl">404 · Page not found</div>
    <h2>We couldn't find that page</h2>
    <p>Nothing lives at <code class="mono">/${path}</code>. The link may be old, or the record may have moved.</p>
    <div class="eos-state-act"><button class="btn pri" onClick=${() => go(S.role ? S.role.home : "start")}>Go to ${S.role ? eosHomeLabel() : "the seat picker"}</button>
      <button class="btn" onClick=${() => history.length > 1 ? history.back() : go("start")}><${Ic} n="back" s=${14} /> Go back</button>
      <button class="btn ghost" onClick=${() => eosOpenPal("")}><${Ic} n="search" s=${14} /> Search</button></div>
    ${quick.length ? html`<div class="eos-state-quick"><span class="lbl">Or jump to</span>${quick.map(p => html`<button class="chip" onClick=${() => go(p)}>${eosLabel(p)}</button>`)}</div>` : ""}
  </div>`;
  return S.role && S.role.kind === "office" ? html`<${Shell} title="Page not found" sub="Error 404">${body}</${Shell}>` : html`<${EosSolo}>${body}</${EosSolo}>`;
}
function EosDenied({ page }) {
  const r = S.role, label = eosLabel(page);
  const req = S.set.requests.find(x => x.role === r.id && x.page === page && x.status === "pending");
  const who = ROLES.filter(x => x.kind === "office" && canSee(page, x)).slice(0, 5);
  const request = () => {
    up(s => { s.set.requests.unshift({ id: "R" + Date.now(), role: r.id, page, at: Date.now(), status: "pending" }); });
    notify({ who: "maya", text: eosRoleName(r) + " (" + eosRoleTitle(r) + ") asked for access to " + label, route: "settings/team" });
    toast("Request sent to Maya Ortiz · you'll be notified when she decides");
  };
  const body = html`<div class="eos-state">
    <div class="eos-state-ic lock"><${Ic} n="lock" s=${26} /></div>
    <div class="lbl">403 · Restricted</div>
    <h2>You don't have access to ${label}</h2>
    <p>${eosRoleName(r)}'s seat (${eosRoleTitle(r)}) doesn't include ${label}. Ask the broker-owner to add it, or switch to a seat that has it.</p>
    ${who.length ? html`<div class="eos-state-who"><span class="lbl">Seats with access</span>${who.map(x => html`<span class="eos-chipav" title=${A(x.who).name}><${Av} a=${A(x.who)} />${A(x.who).name.split(" ")[0]}</span>`)}</div>` : ""}
    <div class="eos-state-act">
      ${r.kind === "office" ? html`<button class="btn pri" disabled=${!!req} title=${req ? "Already requested" : ""} onClick=${request}>${req ? "Requested ✓" : "Request access"}</button>` : ""}
      <button class=${"btn" + (r.kind === "office" ? "" : " pri")} onClick=${() => go("start")}><${Ic} n="swap" s=${14} /> Switch persona</button>
      <button class="btn ghost" onClick=${() => go(r.home)}>Go to ${eosHomeLabel()}</button></div>
    ${req && html`<p class="eos-state-note">Sent ${eosAgo(req.at)} · Maya will see it in Settings → Team & permissions.</p>`}
  </div>`;
  return r.kind === "office" ? html`<${Shell} title="No access" sub=${label}>${body}</${Shell}>` : html`<${EosSolo}>${body}</${EosSolo}>`;
}

// ================= SETTINGS =================
const EOS_SET_TABS = [["profile", "Profile", "user"], ["notifications", "Notifications", "bell"], ["team", "Team & permissions", "shield"], ["integrations", "Integrations", "plug"], ["branding", "Branding", "brush"], ["audit", "Audit log", "clock"]];
const eosIsAdmin = () => !S.role || S.role.nav === null;
function EosSettings() {
  const tab = EOS_SET_TABS.some(t => t[0] === S.route.id) ? S.route.id : "profile";
  useEffect(() => { const el = document.querySelector(".eos-set-nav .on"); el && el.scrollIntoView && el.scrollIntoView({ block: "nearest", inline: "nearest" }); }, [tab]);
  const V = { profile: EosSetProfile, notifications: EosSetNotif, team: EosSetTeam, integrations: EosSetInteg, branding: EosSetBrand, audit: EosSetAudit }[tab];
  return html`<${Shell} title="Settings" sub=${S.set.brand.name + " · workspace and your account"}>
    <div class="page eos-set"><nav class="eos-set-nav" aria-label="Settings sections">${EOS_SET_TABS.map(([k, l, ic]) => html`<button class=${tab === k ? "on" : ""} aria-current=${tab === k ? "page" : null} onClick=${() => go("settings/" + k)}><${Ic} n=${ic} s=${15} /><span>${l}</span>${k === "team" && eosIsAdmin() && S.set.requests.some(r => r.status === "pending") ? html`<i class="eos-dotr"></i>` : ""}</button>`)}</nav>
      <div class="eos-set-body"><${V} /></div></div></${Shell}>`;
}
const EosSetHd = ({ t, s, children }) => html`<div class="eos-set-hd"><div><h2>${t}</h2><p>${s}</p></div>${children}</div>`;
function EosSetProfile() {
  const a = me(), saved = S.set.profiles[a.id] || {};
  const init = { name: a.name, title: a.role, email: saved.email || a.id + "@harborandvine.com", phone: saved.phone || "(512) 555-01" + (10 + Object.keys(S.d.agents).indexOf(a.id)), tz: saved.tz || "America/Chicago", sig: saved.sig || a.name + "\n" + a.role + " · Harbor & Vine Realty\nTREC #" + (600000 + a.name.length * 4211) };
  const [f, setF] = useState(init), [err, setErr] = useState({}), [busy, setBusy] = useState(false);
  const dirty = JSON.stringify(f) !== JSON.stringify(init);
  const set = (k) => (e) => { setF({ ...f, [k]: e.target.value }); setErr({ ...err, [k]: null }); };
  const save = (e) => {
    e && e.preventDefault();
    const x = {};
    if (!f.name.trim()) x.name = "Your name is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) x.email = "Enter a valid email, like name@harborandvine.com";
    if (f.phone.replace(/\D/g, "").length < 10) x.phone = "Use a 10-digit US number";
    setErr(x); if (Object.keys(x).length) return;
    setBusy(true);
    setTimeout(() => { up(s => { a.name = f.name.trim(); a.role = f.title.trim() || a.role; s.set.profiles[a.id] = { email: f.email, phone: f.phone, tz: f.tz, sig: f.sig }; }); setBusy(false); toast("Profile saved"); }, 450);
  };
  const F = (k, label, props = {}) => html`<label class=${"field" + (err[k] ? " eos-bad" : "")}><span>${label}</span><input value=${f[k]} onInput=${set(k)} aria-invalid=${!!err[k]} ...${props} />${err[k] && html`<em class="eos-err">${err[k]}</em>`}</label>`;
  return html`<form class="card" onSubmit=${save} novalidate>
    <div class="hd"><h3>Profile</h3><span class="sp"></span><span class="muted" style="font-size:12px">Shown to clients on portals, emails and e-sign envelopes</span></div>
    <div class="bd eos-form">
      <div class="eos-prof">${html`<span class="av lg" style=${"background:" + a.color + ";width:64px;height:64px;font-size:20px"}>${a.ini}</span>`}<div><b>${a.name}</b><small>${a.role}</small><small class="muted">Signed in via Harbor & Vine SSO · last active just now</small></div></div>
      <div class="grid2">${F("name", "Full name", { autocomplete: "name" })}${F("title", "Title")}${F("email", "Work email", { type: "email", autocomplete: "email" })}${F("phone", "Mobile (for SMS replies)", { type: "tel" })}</div>
      <label class="field"><span>Time zone</span><select value=${f.tz} onChange=${set("tz")}>${["America/Chicago", "America/Denver", "America/New_York", "America/Los_Angeles"].map(z => html`<option value=${z}>${z.replace("America/", "").replace("_", " ")} (${{ Chicago: "Central", Denver: "Mountain", New_York: "Eastern", Los_Angeles: "Pacific" }[z.split("/")[1]]})</option>`)}</select></label>
      <label class="field"><span>Email signature</span><textarea rows="3" value=${f.sig} onInput=${set("sig")}></textarea></label>
    </div>
    <div class="ft eos-set-ft"><span class="muted" style="font-size:12px">${dirty ? "Unsaved changes" : "All changes saved"}</span><span class="sp"></span>
      <button type="button" class="btn" disabled=${!dirty || busy} onClick=${() => { setF(init); setErr({}); }}>Discard</button>
      <button type="submit" class="btn pri" disabled=${!dirty || busy}>${busy ? "Saving…" : "Save changes"}</button></div></form>`;
}
const EOS_EVENTS = [["lead", "New lead assigned to me", "Website, Zillow and routed leads"], ["msg", "Client messages", "SMS, WhatsApp, email and portal replies"], ["offer", "Offer activity", "New offers, counters and acceptances"], ["dates", "Contract deadlines", "Option period, financing, closing"], ["comp", "Compliance flags", "Missing or rejected documents"], ["money", "Commissions & payouts", "CDAs, disbursements, trust deposits"], ["maint", "Maintenance", "New tickets and vendor updates"], ["access", "Access requests", "Teammates asking for a module"]];
function EosSetNotif() {
  const p = S.set.prefs, ch = ["In-app", "Email", "SMS"];
  const flip = (k, i) => up(s => { s.set.prefs[k][i] = s.set.prefs[k][i] ? 0 : 1; });
  return html`<${EosSetHd} t="Notification preferences" s="Choose where each kind of update reaches you. In-app items also appear under the bell." />
    <div class="card"><div style="overflow-x:auto"><table class="t eos-ntable"><thead><tr><th>Event</th>${ch.map(c => html`<th style="text-align:center">${c}</th>`)}</tr></thead><tbody>
      ${EOS_EVENTS.map(([k, l, s]) => html`<tr><td><b style="font-size:13px">${l}</b><div class="muted" style="font-size:12px">${s}</div></td>${ch.map((c, i) => html`<td style="text-align:center"><button type="button" class=${"eos-sw" + (p[k][i] ? " on" : "")} role="switch" aria-checked=${!!p[k][i]} aria-label=${l + " via " + c} onClick=${() => flip(k, i)}></button></td>`)}</tr>`)}</tbody></table></div></div>
    <div class="grid2">
      <div class="card"><div class="hd"><h3>Quiet hours</h3><span class="sp"></span><button type="button" class=${"eos-sw" + (S.set.quiet.on ? " on" : "")} role="switch" aria-checked=${S.set.quiet.on} aria-label="Quiet hours" onClick=${() => { up(s => { s.set.quiet.on = !s.set.quiet.on; }); toast(S.set.quiet.on ? "Quiet hours on" : "Quiet hours off"); }}></button></div>
        <div class="bd"><p class="muted" style="margin:0 0 10px;font-size:12.5px">SMS and push pause overnight. Urgent maintenance and wire alerts still come through.</p>
          <div class="row"><label class="field" style="flex:1"><span>From</span><input type="time" value=${S.set.quiet.from} disabled=${!S.set.quiet.on} onChange=${e => up(s => { s.set.quiet.from = e.target.value; })} /></label><label class="field" style="flex:1"><span>To</span><input type="time" value=${S.set.quiet.to} disabled=${!S.set.quiet.on} onChange=${e => up(s => { s.set.quiet.to = e.target.value; })} /></label></div></div></div>
      <div class="card"><div class="hd"><h3>Email digest</h3></div><div class="bd"><div class="seg">${[["off", "Off"], ["daily", "Daily 7 am"], ["weekly", "Monday"]].map(([k, l]) => html`<button type="button" class=${S.set.digest === k ? "on" : ""} onClick=${() => { up(s => { s.set.digest = k; }); toast("Digest: " + l); }}>${l}</button>`)}</div>
        <p class="muted" style="margin:10px 0 0;font-size:12.5px">A summary of yesterday's leads, deadlines and payments, sent to ${(S.set.profiles[me().id] || {}).email || me().id + "@harborandvine.com"}.</p></div></div></div>
    <div class="row"><button type="button" class="btn" onClick=${() => { notify({ who: S.role ? (S.role.who || S.role.id) : "all", text: "Test notification: this is how updates will look", route: "settings/notifications" }); toast("Test notification sent · check the bell"); }}><${Ic} n="bell" s=${14} /> Send a test notification</button></div>`;
}
function eosModCols() {
  const core = [["today", "Today"], ["site", "Website"], ["inbox", "Inbox"], ["people", "People"], ["pipeline", "Deals"], ["listings", "Listings"], ["rentals", "Rentals"], ["projects", "Projects"], ["backoffice", "Back office"]];
  const ext = EXT.flatMap(x => x.nav || []).filter(n => n.group === "office").map(n => [n.id, n.label]);
  const ports = [["portal", "Buyer portal"], ...EXT.flatMap(x => x.nav || []).filter(n => n.group === "portal").map(n => [n.id, n.label])];
  return { mods: [...core, ...ext], ports };
}
function eosToggleAccess(r, id, isPort) {
  const key = isPort ? "portals" : "nav";
  const had = (r[key] || []).includes(id);
  const apply = (on) => up(() => { r[key] = r[key] || []; if (on && !r[key].includes(id)) r[key].push(id); if (!on) r[key] = r[key].filter(x => x !== id); });
  apply(!had);
  toast((had ? "Removed " : "Gave ") + A(r.who).name.split(" ")[0] + (had ? " from " : " access to ") + eosLabel(id), ["Undo", () => apply(had)]);
}
function EosSetTeam() {
  const admin = eosIsAdmin(), { mods, ports } = eosModCols(), staff = ROLES.filter(r => r.kind === "office"), clients = ROLES.filter(r => r.kind === "client");
  const pending = S.set.requests.filter(r => r.status === "pending");
  const decide = (q, ok) => {
    const r = roleById(q.role); if (!r) return;
    up(() => { q.status = ok ? "approved" : "declined"; if (ok && r.nav && !r.nav.includes(q.page)) r.nav.push(q.page); });
    notify({ who: r.who, text: "Maya " + (ok ? "approved" : "declined") + " your access to " + eosLabel(q.page), route: ok ? q.page : "" });
    toast((ok ? "Approved: " : "Declined: ") + A(r.who).name + " · " + eosLabel(q.page));
  };
  const Cell = ({ r, id, isPort }) => {
    const on = canSee(id, r), locked = !admin || r.nav === null;
    return html`<td class="eos-mx"><button type="button" class=${"eos-mxb" + (on ? " on" : "")} disabled=${locked} aria-pressed=${on}
      aria-label=${A(r.who).name + ": " + eosLabel(id) + (on ? " allowed" : " not allowed")} title=${r.nav === null ? "Broker-owner always has full access" : !admin ? "Only the broker-owner can change access" : (on ? "Remove access" : "Give access")}
      onClick=${() => eosToggleAccess(r, id, isPort)}>${on ? "✓" : "—"}</button></td>`;
  };
  return html`<${EosSetHd} t="Team & permissions" s=${staff.length + " staff seats and " + clients.length + " client seats. Each seat sees only the modules ticked below."}>
      ${!admin && html`<span class="pill a"><${Ic} n="lock" s=${12} /> View only · ask Maya to change access</span>`}</${EosSetHd}>
    ${admin && html`<div class="card"><div class="hd"><h3>Access requests</h3>${pending.length ? html`<span class="pill r">${pending.length} pending</span>` : ""}</div>
      ${pending.length ? html`<div class="feed">${pending.map(q => { const r = roleById(q.role); return r ? html`<div class="it"><${Av} a=${A(r.who)} /><div style="flex:1;min-width:0"><b>${A(r.who).name}</b> asked for <b>${eosLabel(q.page)}</b><div class="muted" style="font-size:12px">${eosRoleTitle(r)} · ${eosAgo(q.at)}</div></div>
        <button type="button" class="btn sm" onClick=${() => decide(q, false)}>Decline</button><button type="button" class="btn sm pri" onClick=${() => decide(q, true)}>Approve</button></div>` : ""; })}</div>`
      : html`<div class="empty">No pending requests. When someone hits a locked page they can ask from there.</div>`}</div>`}
    <div class="card"><div class="hd"><h3>Staff access by module</h3><span class="sp"></span><span class="muted" style="font-size:12px">${admin ? "Click a cell to change it" : "Read only"}</span></div>
      <div class="eos-mxwrap"><table class="t eos-matrix"><thead><tr><th class="eos-mx-who">Seat</th>${mods.map(([, l]) => html`<th><span>${l}</span></th>`)}${ports.map(([, l]) => html`<th class="port"><span>${l}</span></th>`)}</tr></thead><tbody>
        ${staff.map(r => html`<tr><td class="eos-mx-who"><div class="row" style="gap:8px"><${Av} a=${A(r.who)} /><div style="min-width:0"><b style="font-size:12.5px">${A(r.who).name}</b><div class="muted" style="font-size:11.5px">${A(r.who).role}</div></div></div></td>
          ${mods.map(([id]) => html`<${Cell} r=${r} id=${id} />`)}${ports.map(([id]) => html`<${Cell} r=${r} id=${id} isPort=${true} />`)}</tr>`)}</tbody></table></div></div>
    <div class="card"><div class="hd"><h3>Client seats</h3><span class="sp"></span><span class="muted" style="font-size:12px">Clients only ever see their own portal and the public site</span></div>
      <div class="eos-clients">${clients.map(r => html`<div class="eos-cl"><span class="av" style="background:var(--brass)">${r.ini}</span><div><b>${r.name}</b><small>${r.title}</small></div><span class="pill f">${eosLabel(r.home.split("/")[0])}</span></div>`)}</div></div>`;
}
const EOS_INTEG = [
  ["mls", "Unlock MLS (ACTRIS)", "Listings, status changes and showing feedback sync both ways", "MLS", "#2F5F8F", "Listings"],
  ["qbo", "QuickBooks Online", "Commission payouts, trust deposits and 1099s post as journal entries", "QB", "#2E7D4F", "Accounting"],
  ["twilio", "Twilio SMS & WhatsApp", "Texts and WhatsApp replies log into one thread per person", "TW", "#C0442E", "Messaging"],
  ["esign", "Estate Sign (e-signature)", "Agreements, offers and TREC forms signed in the browser", "ES", "#7A4E9C", "Documents"],
  ["stripe", "Stripe & ACH", "Rent, deposits and owner payouts by ACH with no card surcharge", "ST", "#4A4F8C", "Payments"],
  ["zillow", "Zillow Premier Agent", "Leads arrive in the inbox and are routed in under a minute", "Z", "#2856C7", "Leads"],
  ["gcal", "Google Workspace", "Tours and inspections land on each agent's calendar", "G", "#B8873B", "Calendar"],
];
function EosSetInteg() {
  const can = eosIsAdmin() || (S.role && S.role.id === "accounting");
  const [busy, setBusy] = useState(null);
  const set = (k, on) => up(s => { s.set.integrations[k] = on ? { on: true, sync: 0 } : { on: false }; });
  const flip = (k, name) => {
    const cur = S.set.integrations[k];
    if (cur.on) up(s => { s.modal = { kind: "eos-confirm", title: "Disconnect " + name + "?", body: "Syncing stops right away. Existing records stay in Estate OS, and you can reconnect at any time.", ok: "Disconnect", danger: true,
      onOk: () => { set(k, false); toast(name + " disconnected", ["Undo", () => { up(s => { s.set.integrations[k] = cur; }); toast(name + " reconnected"); }]); } }; });
    else { setBusy(k); setTimeout(() => { set(k, true); setBusy(null); toast(name + " connected · first sync complete"); }, 700); }
  };
  const live = EOS_INTEG.filter(([k]) => S.set.integrations[k].on).length;
  return html`<${EosSetHd} t="Integrations" s=${live + " of " + EOS_INTEG.length + " connected. Data flows into the same people, listings and deals."}>
      ${!can && html`<span class="pill a"><${Ic} n="lock" s=${12} /> Only Maya and Grace can connect apps</span>`}</${EosSetHd}>
    <div class="eos-integ">${EOS_INTEG.map(([k, name, desc, mk, col, cat]) => { const st = S.set.integrations[k], b = busy === k; return html`<div class=${"card eos-ig" + (st.on ? " on" : "")}>
      <div class="eos-ig-top"><span class="eos-ig-mk" style=${"background:" + col}>${mk}</span><div style="min-width:0;flex:1"><b>${name}</b><small>${cat}</small></div>
        <button type="button" class=${"eos-sw" + (st.on ? " on" : "")} role="switch" aria-checked=${st.on} aria-label=${(st.on ? "Disconnect " : "Connect ") + name} disabled=${!can || b} title=${!can ? "Only Maya and Grace can manage integrations" : ""} onClick=${() => flip(k, name)}></button></div>
      <p>${desc}</p>
      <div class="eos-ig-st">${b ? html`<span class="pill b">Connecting…</span>` : st.on ? html`<span class="pill g">● Connected</span><span class="muted">Synced ${st.sync ? st.sync + " min ago" : "just now"}</span>` : html`<span class="pill">Not connected</span>`}</div></div>`; })}</div>`;
}
function EosSetBrand() {
  const admin = eosIsAdmin(), b = S.set.brand;
  const [name, setName] = useState(b.name), [color, setColor] = useState(b.color), [err, setErr] = useState("");
  const dirty = name !== b.name || color !== b.color;
  const save = () => {
    if (!name.trim()) return setErr("Brokerage name is required");
    if (name.trim().length > 40) return setErr("Keep it under 40 characters");
    const old = { ...b };
    up(s => { s.set.brand = { name: name.trim(), color }; }); document.documentElement.style.setProperty("--brand", color);
    toast("Branding updated", ["Undo", () => { up(s => { s.set.brand = old; }); document.documentElement.style.setProperty("--brand", old.color); }]);
  };
  const sw = ["#1F4D3A", "#2F5F8F", "#7A4E9C", "#B5533C", "#8C5A2B", "#16201B"];
  return html`<${EosSetHd} t="Branding" s="Your brokerage name and colour on the website, client portals, emails and e-sign envelopes.">${!admin && html`<span class="pill a"><${Ic} n="lock" s=${12} /> View only</span>`}</${EosSetHd}>
    <div class="split"><div class="card"><div class="bd eos-form">
      <label class=${"field" + (err ? " eos-bad" : "")}><span>Brokerage name</span><input value=${name} disabled=${!admin} maxlength="60" aria-invalid=${!!err} onInput=${e => { setName(e.target.value); setErr(""); }} />${err && html`<em class="eos-err">${err}</em>`}</label>
      <div class="field"><span>Brand colour</span><div class="eos-sws">${sw.map(c => html`<button type="button" class=${"eos-swc" + (color === c ? " on" : "")} style=${"background:" + c} disabled=${!admin} aria-label=${"Use colour " + c} onClick=${() => setColor(c)}></button>`)}
        <label class="eos-swc custom" title="Custom colour"><input type="color" value=${color} disabled=${!admin} onInput=${e => setColor(e.target.value)} aria-label="Custom colour" /></label><code class="mono">${color.toUpperCase()}</code></div></div>
      <div class="row"><span class="sp" style="flex:1"></span><button type="button" class="btn" disabled=${!dirty} onClick=${() => { setName(b.name); setColor(b.color); setErr(""); }}>Reset</button><button type="button" class="btn pri" disabled=${!dirty || !admin} onClick=${save}>Save branding</button></div>
    </div></div>
    <div class="card eos-bprev"><div class="hd"><h3>Preview</h3><span class="sp"></span><span class="pill">Live</span></div>
      <div class="bd"><div class="eos-bp-site"><div class="eos-bp-nav"><b style=${"color:" + color}>${name || "Your brokerage"}</b><span>Buy</span><span>Rent</span><span>Sell</span><i style=${"background:" + color}>Sign in</i></div>
        <div class="eos-bp-hero" style=${"background-image:linear-gradient(90deg," + color + "dd," + color + "33),url(" + img("h-white") + ")"}><b>Find your place in Austin</b><span>${name || "Your brokerage"} · since 2009</span></div></div>
        <div class="eos-bp-mail"><span class="mk" style=${"background:" + color}>${(name || "B")[0]}</span><div><b>Your offer was accepted</b><small>${name || "Your brokerage"} · via Estate Sign</small></div><i style=${"background:" + color}>View</i></div></div></div></div>`;
}
function EosSetAudit() {
  const [q, setQ] = useState(""), [who, setWho] = useState("all");
  const people = [...new Set(S.set.audit.map(x => x.who))];
  const rows = S.set.audit.filter(x => (who === "all" || x.who === who) && (!q || (x.text + " " + x.where).toLowerCase().includes(q.toLowerCase())));
  const exportCsv = () => {
    const csv = "when,who,action,where\n" + rows.map(x => [new Date(x.at).toISOString(), x.who, x.text, x.where].map(v => '"' + String(v).replace(/"/g, '""') + '"').join(",")).join("\n");
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" })); a.download = "estate-os-audit-log.csv"; a.click();
    toast("Exported " + rows.length + " audit entries");
  };
  return html`<${EosSetHd} t="Audit log" s="Every sign-in, approval, payment and change, with who did it and where. Kept for 7 years for TREC and trust account audits."><button type="button" class="btn" disabled=${!rows.length} onClick=${exportCsv}><${Ic} n="doc" s=${14} /> Export CSV</button></${EosSetHd}>
    <div class="card"><div class="hd eos-aud-f"><label class="search eos-aud-q"><${Ic} n="search" /><input placeholder="Filter actions" value=${q} onInput=${e => setQ(e.target.value)} aria-label="Filter audit log" /></label>
      <select class="chip" value=${who} onChange=${e => setWho(e.target.value)} aria-label="Filter by person"><option value="all">Everyone</option>${people.map(p => html`<option>${p}</option>`)}</select><span class="sp"></span><span class="muted num" style="font-size:12px">${rows.length} entries</span></div>
      <div style="overflow-x:auto"><table class="t"><thead><tr><th>When</th><th>Who</th><th>Action</th><th>Where</th></tr></thead><tbody>
        ${rows.length ? rows.slice(0, 60).map(x => html`<tr><td class="num muted" style="white-space:nowrap">${eosAgo(x.at)}</td><td style="white-space:nowrap"><b style="font-size:13px">${x.who}</b></td><td>${x.text}</td>
          <td>${x.where && x.where !== "settings/audit" ? html`<button type="button" class="btn sm ghost mono" onClick=${() => go(x.where)} disabled=${!canRoute(x.where)}>/${x.where}</button>` : html`<span class="muted mono">/${x.where}</span>`}</td></tr>`)
        : html`<tr><td colspan="4"><div class="empty">No entries match. Clear the filter to see everything.</div></td></tr>`}</tbody></table></div></div>`;
}

// ================= GUIDED TOUR =================
const EOS_TOUR = [
  { role: "visitor", route: "site/L1", t: "A visitor books a tour", b: "On harborandvine.com a first-time buyer opens 4 Willow Bend, sees the real monthly cost, and books a Saturday tour. The tour request signs a buyer agreement in the same step.", n: null },
  { role: "buyer-agent", route: "inbox", t: "Jordan's inbox lights up", b: "The request lands as a lead with the conversation, the agreement and the listing attached. Jordan replies from one thread, whether it came in by SMS, WhatsApp or the portal.", n: ["jordan", "New tour request from harborandvine.com: 4 Willow Bend, Sat 1:00 pm", "inbox"] },
  { role: "buyer", route: "portal/offer", t: "Elena writes an offer", b: "In her portal Elena builds the offer with her agent: price, earnest money, contingencies and her cash to close. She signs it on her phone.", n: ["buyer", "Your agent shared an offer draft for 4 Willow Bend", "portal/offer"] },
  { role: "seller", route: "seller/offers", t: "The Grants accept", b: "Rachel and Tom see every offer side by side with their net proceeds, and accept the strongest one. Priya and Nina are notified the moment they sign.", n: ["seller", "Elena Ruiz sent an offer on 4 Willow Bend", "seller/offers"] },
  { role: "tc", route: "compliance", t: "Nina checks the file", b: "The signed contract is read automatically: parties, dates and missing disclosures are flagged before anything goes to title.", n: ["nina", "4 Willow Bend went under contract · file is ready for review", "compliance"] },
  { role: "accounting", route: "commissions", t: "Grace pays the commission", b: "At closing, the CDA is built from each agent's plan (split, cap and fees), approved, and paid by ACH. It posts to QuickBooks with no spreadsheet.", n: ["grace", "4 Willow Bend closed · CDA ready to approve", "commissions"] },
  { role: "buyer", route: "portal/myhome", t: "Elena becomes a homeowner", b: "After closing the same record keeps going: home value, equity and a yearly check-in. Her next move starts with Harbor & Vine.", n: ["buyer", "Welcome home! Your home dashboard is ready", "portal/myhome"] },
];
function eosTourRoute(st) {
  const r = roleById(st.role), pages = eosPages(), p = st.route.split("/")[0];
  return pages[p] && canSee(p, r) ? st.route : r.home;
}
function eosTourGo(i) {
  const st = EOS_TOUR[i], r = roleById(st.role); if (!r) return;
  up(s => { eosSetRole(r); s.tour.i = i; s.tour.min = false; });
  if (st.n && !S.tour.sent[i]) { S.tour.sent[i] = true; notify({ who: st.n[0], text: st.n[1], route: st.n[2] }); }
  go(eosTourRoute(st));
}
function eosTourStart() {
  up(s => { s.tour = { i: 0, prev: s.role ? s.role.id : null, sent: {}, min: false }; });
  eosAudit("Started the guided tour"); eosTourGo(0);
}
function eosTourEnd(done) {
  const prev = S.tour && roleById(S.tour.prev);
  up(s => { s.tour = null; eosSetRole(prev || null); });
  go("start"); toast(done ? "That's the whole story: one record from first click to homeowner" : "Tour closed · pick any seat to explore on your own");
}
function EosTour() {
  const t = S.tour, st = EOS_TOUR[t.i], r = roleById(st.role), last = t.i === EOS_TOUR.length - 1;
  const av = r.kind === "client" ? html`<span class="av" style="background:var(--brass)">${r.ini}</span>` : html`<${Av} a=${A(r.who)} />`;
  if (t.min) return html`<button class="eos-tour-pill" onClick=${() => up(s => { s.tour.min = false; })} aria-label="Show guided tour"><${Ic} n="play" s=${13} /> Tour · ${t.i + 1}/${EOS_TOUR.length}</button>`;
  return html`<section class="eos-tour" role="region" aria-label="Guided tour" aria-live="polite">
    <div class="eos-tour-top"><span class="lbl">The full story · ${t.i + 1} of ${EOS_TOUR.length}</span><span class="sp"></span>
      <button class="eos-ib sm" aria-label="Minimise tour" title="Minimise" onClick=${() => up(s => { s.tour.min = true; })}>–</button>
      <button class="eos-ib sm" aria-label="Exit tour" title="Exit tour" onClick=${() => eosTourEnd(false)}><${Ic} n="x" s=${14} /></button></div>
    <div class="eos-tour-bar">${EOS_TOUR.map((_, i) => html`<i class=${i < t.i ? "done" : i === t.i ? "now" : ""}></i>`)}</div>
    <div class="eos-tour-who">${av}<div><b>${eosRoleName(r)}</b><small>${eosRoleTitle(r)} · ${eosLabel(location.hash.replace(/^#\/?/, "").split("/")[0])}</small></div></div>
    <h3>${st.t}</h3><p>${st.b}</p>
    <div class="eos-tour-act"><button class="btn sm" disabled=${t.i === 0} onClick=${() => eosTourGo(t.i - 1)}>← Previous step</button><span class="sp"></span>
      ${last ? html`<button class="btn sm pri" onClick=${() => eosTourEnd(true)}>Finish tour ✓</button>` : html`<button class="btn sm pri" onClick=${() => eosTourGo(t.i + 1)}>Next step →</button>`}</div>
  </section>`;
}

// ================= PERSONA PICKER =================
function Start() {
  const office = ROLES.filter(r => r.kind === "office"), clients = ROLES.filter(r => r.kind === "client" && r.id !== "visitor"), pub = roleById("visitor");
  const cur = S.role && S.role.id;
  const clientCard = (r) => html`<button class=${"rs-card rs-client" + (cur === r.id ? " on" : "")} onClick=${() => asRole(r)}>
        <div class="rs-ph" style=${"background-image:url(" + img(r.photo) + ")"}><span class="av lg">${r.ini}</span></div>
        <div class="rs-body"><b>${r.name}</b><small>${r.title}</small><p>${r.blurb}</p><div class="rs-sees">${r.sees.map(x => html`<span>${x}</span>`)}</div>
        <span class="rs-go">${cur === r.id ? "Continue" : "Open their portal"} <${Ic} n="arrow" s=${14} /></span></div></button>`;
  return html`<div class="rs">
    <header class="rs-top"><div class="brand"><span class="mk" style=${"background:" + S.set.brand.color}>E</span><div><b>Estate OS</b><small>${S.set.brand.name} · Austin, TX</small></div></div><span class="sp"></span><span class="rs-demo">Demo workspace · sample data</span>
      ${S.role && html`<button class="btn sm ghost" onClick=${eosSignOut}><${Ic} n="logout" s=${14} /> Sign out</button>`}</header>
    <section class="rs-hero"><div class="lbl">One platform · every seat</div><h1>Who are you today?</h1>
      <p>Pick a seat to sign in as that person. Each one gets their own screens, and they all work on the same people, homes and deals, so what a client does shows up for the team right away.</p>
      <div class="eos-hero-act"><button class="btn pri eos-story" onClick=${eosTourStart}><span class="eos-play"><${Ic} n="play" s=${12} /></span> Watch the full story</button>
        <span class="muted">7 steps · about 2 minutes · switches seats for you, from a website visit to a new homeowner</span></div></section>
    <section class="rs-sec"><div class="rs-h"><h2>Run the business</h2><span class="muted">${office.length} staff seats · office app</span></div>
      <div class="rs-grid">${office.map(r => { const a = A(r.who); return html`<button class=${"rs-card" + (cur === r.id ? " on" : "")} onClick=${() => asRole(r)}>
        <div class="rs-id"><span class="av lg" style=${"background:" + a.color}>${a.ini}</span><div><b>${a.name}</b><small>${a.role}</small></div>${r.mobile ? html`<em class="rs-tag">Phone</em>` : r.nav === null ? html`<em class="rs-tag">Full access</em>` : ""}</div>
        <p>${r.blurb}</p>
        <div class="rs-sees">${r.sees.map(x => html`<span>${x}</span>`)}</div>
        <span class="rs-go">${cur === r.id ? "Continue" : "Sign in as " + a.name.split(" ")[0]} <${Ic} n="arrow" s=${14} /></span></button>`; })}</div></section>
    ${pub && html`<section class="rs-sec"><div class="rs-h"><h2>The public</h2><span class="muted">No login · harborandvine.com, where most clients start</span></div>
      <button class=${"rs-card rs-client rs-public" + (cur === pub.id ? " on" : "")} onClick=${() => asRole(pub)}>
        <div class="rs-ph" style=${"background-image:url(" + img(pub.photo) + ")"}><span class="av lg">${pub.ini}</span><span class="rs-url mono">harborandvine.com</span></div>
        <div class="rs-body"><b>${pub.name}</b><small>${pub.title}</small><p>${pub.blurb}</p><div class="rs-sees">${pub.sees.map(x => html`<span>${x}</span>`)}</div>
        <span class="rs-go">${cur === pub.id ? "Continue" : "Browse the website"} <${Ic} n="arrow" s=${14} /></span></div></button></section>`}
    <section class="rs-sec"><div class="rs-h"><h2>Your clients</h2><span class="muted">${clients.length} portals · web and phone, branded as ${S.set.brand.name.replace(/ Realty$/, "")}</span></div>
      <div class="rs-grid rs-cl">${clients.map(clientCard)}</div></section>
    <footer class="rs-foot"><span>Same record end to end: a lead becomes a buyer, then a homeowner, a landlord and an investor, without being re-entered.</span><button class="btn sm" onClick=${() => { asRole(ROLES[0]); go("bundle"); }}>Customise the bundle →</button></footer>
  </div>`;
}

// ================= CLIENT DOCK =================
// Clients' portals have their own top bars; the dock gives them search, notifications and the account menu.
function EosDock() {
  return html`<div class="eos-dock" aria-label="Your account"><${SearchBtn} compact /><${NotifBell} up=${true} /><${ProfileButton} up=${true} /></div>`;
}

// ================= ROOT =================
function eosPages() {
  return { start: Start, today: Today, site: Site, portal: Portal, inbox: Inbox, people: People, person: Person, pipeline: Pipeline, deal: Deal, listings: Listings, listing: Listing, rentals: Rentals, projects: Projects, backoffice: BackOffice, bundle: Bundle, settings: EosSettings, ...Object.assign({}, ...EXT.map(x => x.pages || {})) };
}
function eosTitle() {
  const { page, id } = S.route, pages = eosPages();
  if (!pages[page]) return "Page not found";
  if (!canSee(page)) return "No access";
  let t = eosLabel(page);
  try {
    if (page === "person" && P(id)) t = P(id).name;
    else if (page === "deal") { const d = S.d.deals.find(x => x.id === id); if (d && L(d.listing)) t = L(d.listing).addr + " · Deal"; }
    else if ((page === "listing" || page === "site") && id && L(id)) t = L(id).addr;
    else if (page === "settings") t = "Settings · " + (EOS_SET_TABS.find(x => x[0] === id) || EOS_SET_TABS[0])[1];
    else if (id && page !== "start") t += " · " + id[0].toUpperCase() + id.slice(1);
  } catch (e) {}
  return t;
}
function App() {
  const [, setT] = useState(0);
  rerender = () => setT(t => t + 1);
  const pages = eosPages(), pg = S.route.page;
  useEffect(() => { document.title = eosTitle() + " · Estate OS"; });
  let body;
  if (!pages[pg]) body = html`<${EosNotFound} key="404" />`;
  else if (!canSee(pg)) body = html`<${EosDenied} key=${"403" + pg} page=${pg} />`;
  else if (S.loading) body = html`<${EosSkeleton} key="sk" />`;
  else { const Page = pages[pg]; body = html`<${Page} key=${pg + (S.route.id || "")} />`; }
  const dock = isClient() && pg !== "start" && pages[pg] && canSee(pg) && !S.modal && !(S.tour && !S.tour.min);
  return html`${body}<${Modal} />${S.ui.pal && html`<${EosPalette} />`}${dock && html`<${EosDock} />`}${S.tour && html`<${EosTour} />`}
    ${S.toast && html`<div class=${"toast" + (S.tour && !S.tour.min ? " eos-toast-up" : "")} role="status" aria-live="polite" key=${S.toast.n}><span>${S.toast.text}</span>${S.toast.action && html`<button class="eos-undo" onClick=${() => { const a = S.toast.action; up(s => { s.toast = null; }); a[1](); }}>${S.toast.action[0]}${S.toast.action[0] === "Undo" ? "" : " →"}</button>`}<button class="eos-tx" aria-label="Dismiss" onClick=${() => up(s => { s.toast = null; })}>×</button></div>`}`;
}
document.documentElement.style.setProperty("--brand", S.set.brand.color);
render(html`<${App} />`, document.getElementById("app"));
