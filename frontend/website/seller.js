// Seller side of Estate OS: the Grants' seller portal for 4 Willow Bend, plus the office's "Listing ops" board.
// Same store as the office (S, up, go from app.js): approvals, showings, offers and price changes land in the deal file, inbox and launch board.
// Loaded before app.js; html/Shell/etc. are only used inside functions.

(window.EOS_EXT = window.EOS_EXT || []).push({
  pages: { seller: SlPortal, listingops: SlOps },
  modals: { slCounter: SlCounterModal, slAccept: SlAcceptModal },
  seed: slSeed,
  nav: [
    { id: "seller", label: "Seller portal", icon: "M5 21V4M5 4h12l-2.5 4L17 12H5", group: "portal", mod: "listings" },
    { id: "listingops", label: "Listing ops", icon: "M9 11l3 3 8-8M20 12v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11", group: "office", mod: "listings" },
  ],
});

// Cross-file API: the one list of offers on a listing (seller-side offers + any submitted from the buyer portal into S.d.offers).
// Each row: { id, buyer, ini, agent, price (effective, after escalation), listPrice, net, fin, emd, close, cont, conc, esc, pre, status, strength }.
window.SlApi = {
  offers(listingId) {
    try {
      const all = slOffers(listingId || sl().lid);
      return all.map(o => { const eff = slEff(o, all); return { id: o.id, buyer: o.buyer, ini: o.ini, agent: o.agent, price: eff, listPrice: o.price, net: Math.round(slNet({ price: eff, conc: o.conc, bc: o.bc }).net), fin: o.fin, emd: o.emd, close: o.close, cont: o.cont.join(", ").toLowerCase() || "none", conc: o.conc || 0, esc: o.esc ? usd(o.esc) : "—", pre: o.pre, status: slSt(o), strength: o.strength }; });
    } catch (e) { return []; }
  },
  // the buyer portal accepts the sellers' counter: flips the same offer the sellers see, and the deal, to Under contract
  buyerAccepts(price) {
    const all = slOffers("L1"), o = all.filter(x => x.ext && /Ruiz/.test(x.buyer)).pop();
    if (!o) return false;
    const raw = (S.d.offers || []).filter(x => x.l === "L1" && /Ruiz/.test(x.buyer)).pop(); if (raw && price) { raw.price = price; o.price = price; o.esc = 0; }
    slAcceptOffer(o, all, true, true); return true;
  },
};

const SL_I = {
  cam: "M4 8h3l2-3h6l2 3h3v11H4zM12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8",
  brush: "M14 4l6 6-8 8H6v-6zM4 20h4",
  wrench: "M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.5-.5-.5-2.5z",
  sparkle: "M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z",
  leaf: "M5 19c0-8 6-14 15-14 0 9-6 15-14 15zM5 19l7-7",
  win: "M4 4h16v16H4zM12 4v16M4 12h16",
  doc: "M7 3h7l5 5v13H7zM14 3v5h5M10 13h6M10 17h6",
  cal: "M4 6h16v15H4zM4 10h16M9 3v4M15 3v4",
  key: "M15 7a4 4 0 1 1-3.9 4.9L4 19v2h3v-2h2v-2h2l1.1-1.1A4 4 0 0 1 15 7",
  eye: "M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6",
  heart: "M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z",
  bolt: "M13 2 4 14h7l-1 8 9-12h-7z",
  shield: "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z",
  clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2",
  mega: "M3 10v4h3l6 4V6L6 10zM16 8a5 5 0 0 1 0 8",
  tag: "M3 12V4h8l9 9-8 8zM7.5 7.5h.01",
  chat: "M4 5h16v11H8l-4 4z",
  pin: "M12 21s-7-6.5-7-12a7 7 0 0 1 14 0c0 5.5-7 12-7 12zM12 11a2 2 0 1 0 0-4 2 2 0 0 0 0 4",
  bell: "M6 16V11a6 6 0 0 1 12 0v5l2 2H4zM10 21h4",
};
const SlIc = ({ n, s }) => html`<${Ic} n=${SL_I[n] || n} s=${s || 16} />`;
const SL_STAGES = [["Prep", "Repairs, staging, photos, disclosures"], ["Live", "On the MLS and portals"], ["Showings", "Buyers walk through"], ["Offers", "Compare and negotiate"], ["Under contract", "Inspection, appraisal, title"], ["Closed", "Keys handed over"]];
const SL_NOWMIN = 652; // demo clock: Thu Oct 8, 10:52 am
const SL_H = 3600e3;

// ---------------- seed ----------------
function slSeed(d) {
  const now = Date.now();
  d.slT0 = now;
  const ans = {};
  SL_DISC.forEach(s => s.qs.forEach((q, i) => { ans[s.id + i] = q[1]; }));
  d.sl = {
    lid: "L1", pid: "P2", did: "D2", tid: "T3", stage: 3,
    feed: [
      ["10:31 am", "Kristen & David Chen's agent (Keller Williams) submitted an offer: " + "$1,149,000"],
      ["8:02 am", "Offer received from P. Okafor (eXp Realty)"],
      ["Yesterday", "Open house: 11 groups signed in, 3 asked for disclosures"],
      ["Yesterday", "J. & K. Whitman (Compass) submitted a cash offer"],
      ["Oct 6", "Priya shared your first-week marketing report"],
      ["Oct 5", "4 Willow Bend went live on the MLS, Zillow, Realtor.com and our site"],
    ],
    prep: [
      { id: "pi", ic: "wrench", t: "Pre-listing inspection", vendor: "Lone Star Inspections", quote: 450, status: "Done", when: "Sep 24" },
      { id: "pt", ic: "brush", t: "Touch-up paint, entry and hall", vendor: "Austin Pro Painters", quote: 1850, status: "Done", when: "Sep 28" },
      { id: "st", ic: "sparkle", t: "Staging: living, dining, primary", vendor: "Hill Country Staging", quote: 2400, status: "Done", when: "Oct 1", alt: "Virtual staging · $180" },
      { id: "ph", ic: "cam", t: "Photos, 3D tour and floor plan", vendor: "Lens & Lumen Media", quote: 0, paidBy: "Paid by Harbor & Vine", status: "Done", when: "Oct 2" },
      { id: "ls", ic: "leaf", t: "Front-yard mulch and trim", vendor: "Green Acre Landscaping", quote: 650, status: "Done", when: "Oct 2" },
      { id: "hf", ic: "wrench", t: "Re-caulk tub, fix side-gate latch", vendor: "Handy Austin", quote: 340, status: "Quote", when: "Fri Oct 9", note: "Two showing agents mentioned the gate" },
      { id: "ww", ic: "win", t: "Window washing before Saturday's open house", vendor: "ClearView Austin", quote: 260, status: "Quote", when: "Fri Oct 9" },
    ],
    disc: { signed: true, on: "Oct 2", ans, notes: { def1: "Roof replaced 2019 · 30-year architectural shingles", con1: "Front slab pier repair 2016 · transferable warranty" }, saved: "Oct 2, 4:15 pm", sec: 0, edits: 0,
      views: [["Compass agent (Whitman)", "Downloaded", "Oct 6"], ["Keller Williams agent (Chen)", "Downloaded · 3 visits", "Oct 7"], ["eXp Realty agent (Okafor)", "Viewed", "Oct 8"], ["Realty Austin agent", "Viewed", "Oct 8"]] },
    mkt: { opt: "public", cert: null, delay: 3, idx: { avm: true, comments: true, address: false } },
    channels: [
      { n: "Zillow", ic: "eye", v: 268, s: 14, l: 3, c: "#2856C7" },
      { n: "Harbor & Vine site + 4willowbend.com", v: 118, s: 3, l: 3, c: "#1F4D3A" },
      { n: "Realtor.com", v: 96, s: 4, l: 1, c: "#C0442E" },
      { n: "Homes.com", v: 71, s: 2, l: 0, c: "#B7791F" },
      { n: "Instagram & Facebook ads", v: 64, s: 0, l: 2, c: "#7A4E9C" },
      { n: "MLS & agent IDX sites", v: 22, s: 0, l: 0, c: "#5B6B62" },
    ],
    daily: [["Mon 5", 212, 9], ["Tue 6", 168, 6], ["Wed 7", 151, 5], ["Thu 8", 108, 3]],
    oh: { past: { when: "Wed Oct 7 · 5–7 pm", host: "priya", groups: 11 }, next: { when: "Sat Oct 10 · 1–3 pm", host: "sam", away: false },
      signins: [["AM", "Working with Compass", "Pre-approved", "Hot"], ["DC", "Working with Keller Williams", "Pre-approved", "Hot"], ["LT", "No agent", "Pre-approved", "Warm"], ["RS", "No agent", "Not yet", "Warm"], ["JB", "Working with eXp", "Pre-qualified", "Warm"], ["NP", "Neighbor", "—", "Curious"], ["KO", "No agent", "Not yet", "Warm"], ["SV", "Working with Realty Austin", "Pre-approved", "Warm"], ["TG", "Neighbor", "—", "Curious"], ["MF", "No agent", "Pre-approved", "Hot"], ["HW", "Working with Compass", "Cash", "Warm"]] },
    report: { weekly: true },
    rules: { notice: 2, window: 15, code: "4417", occupied: true,
      blocks: ["Weekdays 7:00–9:30 am · school run", "Sundays 9:00 am–12:00 pm · family time"],
      roles: [["Rachel Grant", "Can confirm", "SMS"], ["Tom Grant", "Notify only", "Email"]] },
    showings: [
      { id: "S1", day: "Today", d: 0, time: "11:00 am", min: 660, len: 45, firm: "Compass", type: "Second showing", status: "Confirmed" },
      { id: "S2", day: "Today", d: 0, time: "4:30 pm", min: 990, len: 45, firm: "Keller Williams", type: "Showing", status: "Requested" },
      { id: "S3", day: "Fri Oct 9", d: 1, time: "8:30 am", min: 510, len: 45, firm: "eXp Realty", type: "Showing", status: "Requested", conflict: "Inside your school-run block" },
      { id: "S4", day: "Fri Oct 9", d: 1, time: "12:30 pm", min: 750, len: 60, firm: "Realty Austin", type: "Showing", status: "Requested" },
      { id: "S5", day: "Sat Oct 10", d: 2, time: "10:00 am", min: 600, len: 45, firm: "Coldwell Banker", type: "Showing", status: "Requested" },
      { id: "S6", day: "Wed Oct 7", d: -1, time: "2:00 pm", min: 840, len: 45, firm: "Keller Williams", type: "Showing", status: "Done" },
      { id: "S7", day: "Tue Oct 6", d: -2, time: "5:15 pm", min: 1035, len: 45, firm: "Compass", type: "Showing", status: "Done" },
    ],
    feedback: [
      { firm: "Keller Williams", day: "Oct 7", sent: "Positive", interest: "High", price: "About right", text: "Buyers loved the kitchen and the light in the family room. Writing an offer." },
      { firm: "Compass", day: "Oct 6", sent: "Positive", interest: "High", price: "About right", text: "Clean, move-in ready. Coming back for a second look with their parents." },
      { firm: "eXp Realty", day: "Oct 6", sent: "Neutral", interest: "Medium", price: "A bit high", text: "Liked the layout; worried about Exposition Blvd traffic noise in the backyard." },
      { firm: "Realty Austin", day: "Oct 5", sent: "Negative", interest: "Low", price: "A bit high", text: "Too small a secondary bedroom for their needs. Side gate sticks." },
      { firm: "Coldwell Banker", day: "Oct 5", sent: "Positive", interest: "Medium", price: "About right", text: "Great curb appeal. Their budget tops out around $1.1M." },
    ],
    alerts: { req: true, done: true, fb: true, offers: true },
    offers: [
      { id: "O1", buyer: "J. & K. Whitman", ini: "JW", agent: "Compass", price: 1125000, fin: "Cash", emd: 25000, close: "Nov 3", option: 5, cont: ["Inspection"], conc: 0, bc: 2.5, esc: 0, pre: "Proof of funds · verified", strength: 94, got: "Yesterday 6:10 pm", status: "New", note: "Free leaseback up to 14 days if you need it" },
      { id: "O2", buyer: "P. Okafor", ini: "PO", agent: "eXp Realty", price: 1155000, fin: "FHA · 3.5% down", emd: 5000, close: "Dec 1", option: 10, cont: ["Inspection", "Appraisal", "Financing", "Sale of buyer's home"], conc: 15000, bc: 3, esc: 0, pre: "Pre-qualified only", strength: 46, got: "Today 8:02 am", status: "New", note: "Asks you to pay $15,000 toward closing costs" },
      { id: "O3", buyer: "Kristen & David Chen", ini: "KC", agent: "Keller Williams", price: 1149000, fin: "Conventional · 20% down", emd: 15000, close: "Nov 20", option: 7, cont: ["Inspection", "Financing"], conc: 0, bc: 2.5, esc: 1170000, pre: "Pre-approved · Frost Bank", strength: 86, got: "Today 10:31 am", status: "New", note: "Covers an appraisal gap up to $20,000" },
    ],
    ost: {}, ctr: {}, hb: null, presented: null,
    prop: { to: 1125000, cond: "Only if no offer nets you $460,000 or more by Fri Oct 9, 5 pm", status: "Awaiting you", why: "Showing feedback is warm but 2 of 5 agents said 'a bit high'; homes at $1.12M–$1.13M in Tarrytown went pending in 6 days on average." },
  };
  // compliance + activity for every listing (office launch board)
  const st = (h) => now - h * SL_H;
  d.slComp = {
    L1: { opt: "public", cert: null, started: st(75), startLbl: "Mon Oct 5, 9:12 am", mls: st(67.5), mlsLbl: "Mon Oct 5, 4:40 pm", events: [["Mon Oct 5, 9:12 am", "Yard sign installed"], ["Mon Oct 5, 11:00 am", "Published on harborandvine.com"], ["Mon Oct 5, 4:40 pm", "Filed with ABoR MLS"]], photos: { n: 38, altered: 2, kind: "virtually staged", disclosed: true }, copy: "Light pours through floor-to-ceiling glass in this 4-bed, 3-bath house in Tarrytown. The open kitchen flows to a covered terrace and pool, the primary suite has a spa bath, and there's a flexible study for working from home.", show7: 12, pend: 4, pos: 60 },
    L2: { opt: "public", cert: null, started: st(270), startLbl: "Sep 27", mls: st(266), mlsLbl: "Sep 27", events: [["Sep 27, 8:30 am", "Filed with ABoR MLS"], ["Sep 27, 10:00 am", "Published on harborandvine.com"]], photos: { n: 31, altered: 0, disclosed: true }, copy: "Tree-shaded 3-bed in Barton Hills with a renovated kitchen, a light-filled master suite and a deck that backs onto the greenbelt.", show7: 7, pend: 1, pos: 55 },
    L3: { opt: "public", cert: null, started: st(150), startLbl: "Oct 2", mls: st(149), mlsLbl: "Oct 2", events: [["Oct 2, 9:00 am", "Filed with ABoR MLS"], ["Oct 2, 1:00 pm", "Instagram post"]], photos: { n: 24, altered: 1, kind: "sky replaced", disclosed: false }, copy: "Lake views from an exclusive tower, perfect for young professionals. Floor-to-ceiling windows, a chef's kitchen and a resort pool deck on Rainey Street.", show7: 6, pend: 2, pos: 67 },
    L4: { opt: "public", cert: null, started: now - (24 - 4.8) * SL_H, startLbl: "Wed Oct 7, 3:40 pm", mls: null, mlsLbl: "", events: [["Wed Oct 7, 3:40 pm", "“Coming soon” yard sign installed"], ["Wed Oct 7, 6:05 pm", "Instagram teaser posted"]], photos: { n: 0, altered: 0, disclosed: true }, copy: "Coming soon to Zilker: a 2022 modern with 4 beds, a glass-walled great room and a backyard studio, a short walk to Barton Springs.", show7: 0, pend: 0, pos: 0 },
    L5: { opt: "delayed", cert: null, certReq: false, delay: 3, started: null, mls: st(30), mlsLbl: "Yesterday, 9:00 am", events: [["Yesterday, 9:00 am", "Filed with ABoR MLS · IDX and portals held 3 days"]], photos: { n: 46, altered: 0, disclosed: true }, copy: "A resort-style Westlake retreat on 0.62 acres with a pool, outdoor kitchen and a five-bedroom plan built for entertaining.", show7: 5, pend: 1, pos: 80 },
    L6: { opt: "delayed", cert: "Signed Oct 1", delay: 3, started: st(190), startLbl: "Oct 1", mls: st(189), mlsLbl: "Oct 1", events: [["Oct 1, 9:00 am", "Filed with ABoR MLS · delayed 3 days"], ["Oct 4, 9:00 am", "Released to IDX and portals"]], photos: { n: 22, altered: 0, disclosed: true }, copy: "Modern East Austin townhouse with a rooftop deck, walking distance to St. Mary's church and the Govalle cafés.", show7: 9, pend: 2, pos: 45 },
    L7: { opt: "public", cert: null, started: st(500), startLbl: "Sep 19", mls: st(499), mlsLbl: "Sep 19", events: [["Sep 19, 8:00 am", "Filed with ABoR MLS"]], photos: { n: 40, altered: 0, disclosed: true }, copy: "Brand-new Rollingwood build with a wine room, a covered loggia and hill-country views.", show7: 2, pend: 0, pos: 100 },
    L8: { opt: "public", cert: null, started: st(770), startLbl: "Sep 8", mls: st(768), mlsLbl: "Sep 8", events: [["Sep 8, 9:00 am", "Filed with ABoR MLS"]], photos: { n: 35, altered: 3, kind: "virtually staged", disclosed: true }, copy: "Family-friendly Bee Cave ranch on 1.1 acres, great for kids: a pool, a workshop and room for horses.", show7: 3, pend: 1, pos: 33 },
  };
  d.slPrice = [{ id: "PC1", l: "L8", from: 1080000, to: 1049000, by: "Owner signed the price amendment Oct 7", cond: "Effective now", status: "Pending" }];
}

// disclosure form (TREC-style seller's disclosure notice)
const SL_DISC = [
  { id: "sys", t: "Systems & appliances", hint: "Is each item working?", qs: [["Central air and heating", "Yes"], ["Water heater (gas, 2019)", "Yes"], ["Pool equipment and heater", "Yes"], ["Smoke detectors in every bedroom", "Yes"], ["Garage door openers", "Yes"]] },
  { id: "def", t: "Defects or malfunctions", hint: "Are you aware of a defect in any of these?", qs: [["Foundation or slab", "No"], ["Roof", "No"], ["Plumbing or sewer", "No"], ["Electrical", "No"], ["Walls, ceilings or floors", "No"]] },
  { id: "con", t: "Conditions you know about", hint: "Have any of these ever applied?", qs: [["Previous water penetration", "No"], ["Previous foundation repairs", "Yes"], ["Termite damage or treatment", "No"], ["Aluminum wiring", "No"], ["Room additions or repairs without permits", "No"]] },
  { id: "fl", t: "Flood", hint: "Texas flood disclosure (required since 2020)", qs: [["Wholly or partly in a 100-year floodplain", "No"], ["Ever filed a flood insurance claim", "No"], ["Received FEMA or SBA flood assistance", "No"], ["Water has entered the home from flooding", "No"]] },
  { id: "hoa", t: "HOA, legal & reports", hint: "Anything a buyer should know", qs: [["HOA or mandatory maintenance fees", "No"], ["Lawsuits or liens affecting the property", "No"], ["Written inspection reports in the last 4 years", "Yes"]] },
];

// ---------------- shared helpers ----------------
function sl() { return S.d.sl; }
function slNet({ price, conc = 0, bc = 2.5, lc = 2.5, payoff = 612000 }) {
  const title = price * 0.0058, tax = price * 0.018 * (9 / 12) * 0.25, misc = 1850;
  return { title, tax, misc, lcAmt: price * lc / 100, bcAmt: price * bc / 100, net: price - payoff - price * lc / 100 - price * bc / 100 - title - tax - misc - conc };
}
function slLog(text) { const t = S.d.threads.find(x => x.id === sl().tid); if (t) { t.msgs.push({ from: "them", text, at: "now", ts: Date.now(), ch: "Portal" }); t.unread += 1; t.when = "now"; } }
function slFeed(text) { sl().feed.unshift([Date.now(), text]); }
function slReply(text, ms = 1300) { setTimeout(() => up(() => { const t = S.d.threads.find(x => x.id === sl().tid); if (t) t.msgs.push({ from: "me", text, at: "now", ts: Date.now(), ch: "Portal", fresh: true }); }), ms); }
// cross-persona notification (SHELL owns window.notify). who: staff agent id (priya, nina, leo, ray) or a client ROLES id (seller, tenant, landlord).
function slNotify(who, text, route) { try { if (typeof window.notify === "function") [].concat(who).forEach(w => window.notify({ who: w, text, route, at: Date.now() })); } catch (e) {} }
// relative time for numeric timestamps; strings ("Oct 6", "Yesterday") pass through
function slRel(ts) {
  if (typeof ts !== "number") return ts === "now" ? "just now" : ts;
  const s = Math.max(0, Math.round((Date.now() - ts) / 1000));
  if (s < 45) return "just now";
  const m = Math.round(s / 60); if (m < 60) return m + " min ago";
  const h = Math.round(m / 60); if (h < 24) return h + " hr ago";
  return new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
const slMsgAt = (m) => m.ts ? slRel(m.ts) : m.at === "now" ? "just now" : m.at;
// office-only toast actions are hidden from clients (no office jargon in a client app)
const slCan = (route) => typeof canRoute !== "function" || canRoute(route);
const slOfficeAct = (label, fn, route) => isClient() || (route && !slCan(route)) ? undefined : [label, fn];
// Esc closes a modal
function slEsc(close) { useEffect(() => { const k = (e) => { if (e.key === "Escape") close(); }; addEventListener("keydown", k); return () => removeEventListener("keydown", k); }, []); }
// in-place confirmation for irreversible actions (never window.confirm)
function SlConfirm({ label, cls, text, yes, onYes, disabled, title, danger }) {
  const [open, setOpen] = useState(false);
  if (!open) return html`<button class=${cls || "btn"} disabled=${disabled} title=${title || ""} onClick=${() => setOpen(true)}>${label}</button>`;
  return html`<div class=${"sl-cf" + (danger ? " danger" : "")} role="group" aria-label="Confirm"><span class="sl-cf-t">${text}</span><span class="sl-cf-b"><button class=${"btn sm " + (danger ? "sl-danger" : "pri")} onClick=${() => { setOpen(false); onYes(); }} autofocus>${yes}</button><button class="btn sm ghost" onClick=${() => setOpen(false)}>Cancel</button></span></div>`;
}
const SlErr = ({ m }) => m ? html`<div class="sl-err" role="alert">${m}</div>` : "";
// "view as client" banner for staff; clients get the standalone app with a Switch persona exit instead
const SL_ROUTE_LBL = { listingops: "Listing ops", pmops: "PM ops", rentals: "Rentals", today: "Today", listings: "Listings", compliance: "Compliance", commissions: "Commissions", projects: "Projects", people: "People" };
function slExit(pref) { const r = S.role; if (r && r.nav && !r.nav.includes(pref.split("/")[0])) return r.home; return pref; }
function SlViewAs({ client, pref }) {
  if (isClient()) return null;
  const who = me(), to = slExit(pref);
  return html`<div class="sl-viewas" role="note"><span class="sl-viewas-i"><${Ic} n=${SL_I.eye} s=${14} /></span><span>Viewing <b>${client}</b> portal as ${who.name.split(" ")[0]}</span><span class="sl-viewas-n">What the client sees, live</span><span style="flex:1"></span><button onClick=${() => go(to)}>← Back to ${SL_ROUTE_LBL[to.split("/")[0]] || "the office"}</button></div>`;
}
function slTick(ms = 1000) { const [, set] = useState(0); useEffect(() => { const t = setInterval(() => set(x => x + 1), ms); return () => clearInterval(t); }, []); }
function slDur(ms) { const neg = ms < 0; ms = Math.abs(ms); const h = Math.floor(ms / SL_H), m = Math.floor(ms % SL_H / 60000), s = Math.floor(ms % 60000 / 1000); return (neg ? "-" : "") + h + "h " + String(m).padStart(2, "0") + "m " + String(s).padStart(2, "0") + "s"; }
function slClock(c) { // Clear Cooperation: public marketing starts a 1-business-day clock to file with the MLS
  if (!c.started) return c.mls ? { state: "filed" } : { state: "none" };
  if (c.mls) return { state: "ok", took: c.mls - c.started };
  const left = c.started + 24 * SL_H - Date.now();
  return { state: left > 0 ? "running" : "late", left };
}
function slEff(o, all) { // escalation: beat the best other offer by $2,500, up to the cap
  if (!o.esc) return o.price;
  const best = Math.max(0, ...all.filter(x => x.id !== o.id && slSt(x) !== "Declined").map(x => x.price));
  return best >= o.price ? Math.min(o.esc, best + 2500) : o.price;
}
function slOffers(lid) {
  lid = lid || sl().lid;
  const ext = (S.d.offers || []).filter(o => o.l === lid).map((o, i) => { if (!o.slAt) o.slAt = Date.now(); const escN = typeof o.esc === "number" ? o.esc : +String(o.esc || "").replace(/[^\d]/g, "") || 0; return { id: "R" + i, ext: true, buyer: o.buyer, ini: (w => (w[0][0] + w[w.length - 1][0]).toUpperCase())(o.buyer.split(/[ &.]+/).filter(Boolean)), agent: o.agent, price: o.price, fin: o.fin, emd: o.emd, close: o.close, option: 7, cont: (o.cont || "").split(", ").filter(Boolean).map(x => x[0].toUpperCase() + x.slice(1)), conc: o.conc || 0, bc: 2.5, esc: escN > o.price ? escN : 0, pre: o.pre, strength: 82, got: slRel(o.slAt), note: "Submitted from the Harbor & Vine buyer portal" }; });
  return [...(lid === sl().lid ? sl().offers : []), ...ext];
}
function slSt(o) { return o.ext ? (sl().ost[o.id] || "New") : o.status; }
function slSetSt(o, v) { if (o.ext) sl().ost[o.id] = v; else o.status = v; }
const slStPill = (s) => html`<span class=${"pill " + ({ New: "b", Countered: "a", "H&B requested": "br", Improved: "f", Accepted: "g", Declined: "r", Backup: "" }[s] || "")}>${s}</span>`;
function slStage() { const dl = S.d.deals.find(x => x.id === sl().did); return dl && dl.stage === "Closed" ? 5 : dl && dl.stage === "Under contract" ? Math.max(4, sl().stage) : sl().stage; }

// ---------------- portal frame ----------------
function SlFrame({ tab, children }) {
  const s = sl(), l = L(s.lid), agent = A(l.agent), t = S.d.threads.find(x => x.id === s.tid);
  const pendShow = s.showings.filter(x => x.status === "Requested").length;
  const newOffers = slOffers().filter(o => ["New", "Improved"].includes(slSt(o))).length;
  const tabs = [["home", "Home"], ["pricing", "Pricing"], ["prep", "Prep & disclosures"], ["marketing", "Marketing"], ["showings", "Showings", pendShow], ["offers", "Offers", slStage() >= 3 ? newOffers : 0], ["messages", "Messages", t && t.msgs.some(m => m.fresh) ? "•" : 0]];
  return html`<div class="site pt sl">
    <${SlViewAs} client="the Grants'" pref="listingops" />
    <div class="sbar"><span>Seller portal</span><span class="u sl-url">my.harborandvine.com/sell/4-willow-bend${tab && tab !== "home" ? "/" + tab : ""}</span><span style="flex:1"></span>
      ${isClient() ? "" : html`<label class="pj-demo sl-demo">Demo: jump to <select value=${s.stage} onChange=${e => slJump(+e.target.value)}>${SL_STAGES.slice(0, 4).map((x, i) => html`<option value=${i}>${x[0]}</option>`)}${s.stage > 3 ? html`<option value=${s.stage}>${SL_STAGES[s.stage][0]}</option>` : ""}</select></label>`}
      ${isClient() ? html`<button onClick=${() => leavePortal("listingops")}>${leaveLabel("")}</button>` : ""}</div>
    <div class="snav sl-nav"><span class="logo">Harbor & Vine</span><span class="pt-who">Rachel & Tom Grant · ${l.addr}</span><span class="sp"></span>
      <button class="pt-agent" onClick=${() => go("seller/messages")}><${Av} a=${agent} /><span><b>${agent.name}</b><small>Your listing agent · replies in ~10 min</small></span></button>${window.EosChrome ? html`<${EosChrome.Tools} />` : ""}</div>
    <nav class="pt-tabs sl-tabs">${tabs.map(([k, v, n]) => html`<button class=${tab === k ? "on" : ""} onClick=${() => go("seller/" + k)}>${v}${n ? html`<em class="sl-badge">${n}</em>` : ""}</button>`)}</nav>
    <div class="pt-body">${children}</div></div>`;
}
function slJump(i) {
  up(s => {
    const x = s.d.sl, c = s.d.slComp[x.lid];
    x.stage = i;
    if (i === 0) { x.mkt.opt = null; x.mkt.cert = null; c.started = null; c.mls = null; c.events = []; x.disc.signed = false; SL_DISC.slice(2).forEach(sec => sec.qs.forEach((q, j) => { delete x.disc.ans[sec.id + j]; })); x.prep.slice(2, 5).forEach(p => { p.status = "Quote"; }); }
    else {
      if (!x.mkt.opt) x.mkt.opt = "public";
      if (!c.started && x.mkt.opt !== "office") { c.started = Date.now() - 2 * SL_H; c.startLbl = "Today"; c.events.push([slNowLbl(), "Public marketing started"]); }
      if (!c.mls && i >= 1) { c.mls = Date.now(); c.mlsLbl = "Today"; c.events.push([slNowLbl(), "Filed with ABoR MLS"]); }
      if (!x.disc.signed) { SL_DISC.forEach(sec => sec.qs.forEach((q, j) => { if (!x.disc.ans[sec.id + j]) x.disc.ans[sec.id + j] = q[1]; })); x.disc.signed = true; x.disc.on = "Oct 8"; }
      x.prep.forEach(p => { if (p.status === "Quote" && !["hf", "ww"].includes(p.id)) p.status = "Done"; });
    }
  });
  go("seller/home");
}
function slNowLbl() { const m = SL_NOWMIN + Math.floor((Date.now() - S.d.slT0) / 60000); return "Today, " + ((Math.floor(m / 60) - 1) % 12 + 1) + ":" + String(m % 60).padStart(2, "0") + (m >= 720 ? " pm" : " am"); }

// ---------------- 1. home ----------------
function SlHome() {
  slTick(30000);
  const s = sl(), l = L(s.lid), st = slStage(), offers = slOffers(), agent = A(l.agent);
  const reqs = s.showings.filter(x => x.status === "Requested");
  const quotes = s.prep.filter(p => p.status === "Quote");
  const discAns = Object.keys(s.disc.ans).length, discTotal = SL_DISC.reduce((a, x) => a + x.qs.length, 0);
  const best = offers.length ? offers.reduce((a, o) => slNet({ price: slEff(o, offers), conc: o.conc, bc: o.bc }).net > slNet({ price: slEff(a, offers), conc: a.conc, bc: a.bc }).net ? o : a) : null;
  const next = st === 0 ? { t: s.mkt.opt ? "Finish your seller's disclosure" : "Choose how your home is marketed", s: s.mkt.opt ? discAns + " of " + discTotal + " answers saved · it saves as you go" : "Public MLS, office exclusive or delayed marketing. Priya recommends public.", go: "prep", cta: "Open prep" }
    : st === 1 || st === 2 ? { t: reqs.length + " showing requests need you", s: "Approve, decline or suggest another time in one tap", go: "showings", cta: "Review showings" }
    : st === 3 ? { t: "Offers are due Friday at 5 pm", s: offers.length + " offers in · best net so far " + usd(slNet({ price: slEff(best, offers), conc: best.conc, bc: best.bc }).net) + " (" + best.buyer + ")", go: "offers", cta: "Compare offers" }
    : st === 4 ? { t: "You're under contract!", s: "Next: the buyer's inspection and appraisal. Priya will send each date here.", go: "offers", cta: "See the accepted offer" }
    : { t: "Sold. Congratulations!", s: "Your closing statement and documents are saved here.", go: "messages", cta: "Message Priya" };
  const todo = [
    ["Sign your seller's disclosure", s.disc.signed, "prep"],
    ["Approve " + quotes.length + " prep quote" + (quotes.length === 1 ? "" : "s"), !quotes.length, "prep"],
    ["Answer " + reqs.length + " showing request" + (reqs.length === 1 ? "" : "s"), !reqs.length, "showings"],
    ["Review Priya's price plan", s.prop.status !== "Awaiting you", "pricing"],
    st >= 3 && ["Confirm the offers were presented to you", !!s.presented, "offers"],
  ].filter(Boolean);
  const kpi = [["Days on market", l.dom, "clock"], ["Views", l.views, "eye"], ["Saves", s.channels.reduce((a, c) => a + c.s, 0), "heart"], ["Showings", s.showings.filter(x => x.status !== "Declined").length, "key"], ["Offers", st >= 3 ? offers.length : 0, "tag"]];
  return html`<${SlFrame} tab="home">
    <div class="sl-hero"><div class="sl-hero-im" style=${"background-image:url(" + img(l.img) + ")"}><span class=${"sl-stamp" + (st >= 4 ? " uc" : "")}>${st >= 4 ? "Under contract" : st === 0 ? "Getting ready" : "For sale"}</span></div>
      <div class="sl-hero-b"><div class="lbl">Your sale · ${l.addr}, ${l.area}</div><h1>${st >= 4 ? "Rachel & Tom, you're under contract." : st === 0 ? "Let's get 4 Willow Bend ready, Rachel & Tom." : "Hi Rachel & Tom, here's how your sale is going."}</h1>
        <div class="sl-kpis">${kpi.map(([k, v, ic]) => html`<div><span class="sl-chip"><${SlIc} n=${ic} s=${14} /></span><b class="num">${v}</b><small>${k}</small></div>`)}</div></div></div>
    <div class="track sl-track">${SL_STAGES.map((x, i) => html`<div class=${"tk" + (i < st ? " done" : i === st ? " now" : "")}><i>${i < st ? "✓" : i + 1}</i><b>${x[0]}</b><span>${x[1]}</span></div>`)}</div>
    <div class="pt-grid">
      <div class="pt-next"><div class="lbl">Your next step</div><h2>${next.t}</h2><p>${next.s}</p><button class="btn pri" onClick=${() => go("seller/" + next.go)}>${next.cta} →</button></div>
      <div class="card"><div class="hd"><h3>To do</h3><span class="sp"></span><span class="muted">${todo.filter(t => t[1]).length}/${todo.length}</span></div><div class="bd">${todo.map(([t, d, g]) => html`<button class=${"chk" + (d ? " ok" : "")} onClick=${() => go("seller/" + g)}><i>${d ? "✓" : ""}</i><span style="flex:1">${t}</span>${d ? "" : html`<span class="muted" style="font-size:12px">Open →</span>`}</button>`)}</div></div>
    </div>
    <div class="pt-grid">
      <div class="card"><div class="hd"><h3>Everything that's happened</h3><span class="sp"></span><span class="muted" style="font-size:12px">Newest first</span></div><div class="feed sl-feed">${s.feed.slice(0, 8).map(([w, t]) => html`<div class="it"><span class="dot"></span><div style="flex:1">${t}</div><span class="muted" style="font-size:12px;white-space:nowrap">${slRel(w)}</span></div>`)}</div></div>
      <div class="card sl-agent"><div class="bd">
        <div class="row"><${Av} a=${agent} lg /><div style="flex:1"><b style="font-size:15px">${agent.name}</b><div class="muted" style="font-size:12.5px">Your listing agent · Harbor & Vine Realty</div></div></div>
        <div class="sl-agent-q">"${st >= 4 ? "Congratulations, you two! Next is the buyer's inspection. I'll be there, and every date shows up here as it's set." : st === 3 ? "Three offers in and a fourth agent asked for disclosures this morning. Let's talk Friday at 5:30 once they're all in." : st === 0 ? "Let's get the disclosure signed and the house photo-ready. I'll handle the vendors." : "Strong first week. Keep answering showing requests quickly; it's the biggest thing you control."}"</div>
        <div class="row" style="flex-wrap:wrap;gap:6px"><a class="btn sm" href="tel:+15125550130" aria-label=${"Call " + agent.name + " at (512) 555-0130"}><${Ic} n="phone" s=${13} /> Call</a><button class="btn sm" onClick=${() => go("seller/messages")}><${SlIc} n="chat" s=${13} /> Message</button>${s.review ? html`<span class="pill g sl-pill-ok"><${SlIc} n="cal" s=${12} /> ${s.review === "booked" ? "Review booked · Fri 5:30 pm" : "Review requested"}</span>` : html`<button class="btn sm" onClick=${() => { up(() => { s.review = "requested"; slLog("Can we meet Friday 5:30 pm to go through the offers?"); slFeed("You asked Priya for an offer review meeting Fri 5:30 pm"); }); slNotify(l.agent, "The Grants asked for an offer review meeting Fri 5:30 pm", "inbox/" + s.tid); slReply("Booked: Friday 5:30 pm at your kitchen table. I'll bring the comparison printed too."); setTimeout(() => up(() => { s.review = "booked"; }), 1300); toast("Meeting request sent · Priya confirms here in a moment"); }}><${SlIc} n="cal" s=${13} /> Book a review</button>`}</div>
        <div class="sl-team">${[[{ ini: "LT", color: "#7A4E9C" }, "Lone Star Title", "Escrow & closing"], [{ ini: "HS", color: "#B8873B" }, "Hill Country Staging", "Staging pick-up after closing"]].map(([a, n, d]) => html`<div class="row"><${Av} a=${a} /><div><b style="font-size:12.5px">${n}</b><div class="muted" style="font-size:11.5px">${d}</div></div></div>`)}</div>
      </div></div>
    </div></${SlFrame}>`;
}

// ---------------- 2. pricing ----------------
const SL_COMPS = [
  { id: "c1", a: "1702 Hartford Rd", p: 1162000, st: "Sold Sep 12", sq: 2410, x: 52, y: 22, adj: [["Size +30 sqft", -6300], ["No pool", 24000]] },
  { id: "c2", a: "3 Pecos Bend", p: 1118000, st: "Sold Aug 30", sq: 2290, x: 14, y: 52, adj: [["Size −90 sqft", 18900], ["Built 2008", 4000]] },
  { id: "c3", a: "21 Bowman Ave", p: 1145000, st: "Pending", sq: 2350, x: 40, y: 58, adj: [["Size −30 sqft", 6300]] },
  { id: "c4", a: "608 Westover Rd", p: 1189000, st: "Sold Jul 22", sq: 2520, x: 66, y: 40, adj: [["Size +140 sqft", -29400], ["Larger lot", -32000]] },
  { id: "c5", a: "2 Enfield Ct", p: 1079000, st: "Sold Jun 30", sq: 2190, x: 12, y: 20, adj: [["Size −190 sqft", 39900], ["Dated kitchen", 35000]] },
];
function SlPricing() {
  const s = sl(), l = L(s.lid);
  const [inc, setInc] = useState(["c1", "c2", "c3", "c4"]), [hot, setHot] = useState(null);
  const [price, setPrice] = useState(l.price), [conc, setConc] = useState(0), [payoff, setPayoff] = useState(612000), [bc, setBc] = useState(2.5);
  const [alt, setAlt] = useState(1135000), [altOpen, setAltOpen] = useState(false);
  const comps = SL_COMPS.map(c => ({ ...c, adjd: c.p + c.adj.reduce((a, x) => a + x[1], 0) }));
  const used = comps.filter(c => inc.includes(c.id));
  const lo = used.length ? Math.min(...used.map(c => c.adjd)) : 0, hi = used.length ? Math.max(...used.map(c => c.adjd)) : 0, mid = used.length ? used.reduce((a, c) => a + c.adjd, 0) / used.length : 0;
  const ppsf = used.length ? used.reduce((a, c) => a + c.p / c.sq, 0) / used.length : 0;
  const n = slNet({ price, conc, payoff, bc });
  const X0 = 1040000, X1 = 1220000, sx = (v) => 20 + (v - X0) / (X1 - X0) * 560;
  const parts = [["Payoff", payoff, "#5B6B62"], ["Agents", n.lcAmt + n.bcAmt, "#B8873B"], ["Title, tax & fees", n.title + n.tax + n.misc, "#C9C2B2"], ["Concessions", conc, "#C0442E"], ["You keep", Math.max(0, n.net), "#2E6B52"]];
  let acc = 0;
  const pr = s.prop;
  const payErr = payoff < 0 ? "Payoff can't be negative" : payoff >= price ? "That payoff is more than the sale price. Check the number on your lender statement." : "";
  const concErr = conc < 0 ? "Concessions can't be negative" : conc > price * 0.06 ? "Most loans cap seller concessions at 6% (" + usd(price * 0.06) + " here)" : "";
  const altErr = !alt ? "Enter a price" : alt >= l.price ? "A price change here is a reduction: pick less than " + usd(l.price) : alt < 950000 ? "That's below every comp Priya used. Talk to her before going under " + usd(950000) : alt % 1000 ? "Round to the nearest $1,000" : "";
  function approve(to) {
    const pc = { id: "PC" + (S.d.slPrice.length + 2), l: s.lid, from: l.price, to, by: "Rachel & Tom Grant signed in the seller portal", cond: pr.cond, status: "Pending", at: Date.now() };
    up(st => { pr.status = "Approved"; pr.to = to; pr.signed = "Oct 8"; pr.pc = pc.id; st.d.slPrice.unshift(pc); slLog("We approved the price plan: reduce to " + usd(to) + " " + pr.cond.toLowerCase() + "."); slFeed("You approved a conditional price change to " + usd(to)); });
    setAltOpen(false);
    slNotify(l.agent, "Rachel & Tom Grant signed a price change on " + l.addr + ": " + usd(l.price) + " → " + usd(to), "listingops");
    slReply("Thank you both. It's on my desk; I'll only file it with the MLS if Friday's condition is met.");
    toast("Signed · Priya has it and files it only if Friday's condition is met", slOfficeAct("See it in Listing ops", () => go("listingops")));
  }
  function withdraw() {
    up(st => { st.d.slPrice = st.d.slPrice.filter(p => p.id !== pr.pc); pr.status = "Awaiting you"; pr.pc = null; slLog("We've changed our minds on the price change: please hold at " + usd(l.price) + "."); slFeed("You withdrew your price-change approval"); });
    slNotify(l.agent, "The Grants withdrew their price-change approval on " + l.addr, "listingops");
    toast("Approval withdrawn · nothing was filed");
  }
  const myPc = S.d.slPrice.find(p => p.id === pr.pc);
  return html`<${SlFrame} tab="pricing">
    <div class="pt-cols">
      <div class="card"><div class="hd"><h3>What your home is worth</h3><span class="sp"></span><span class="pill f">Comparative market analysis · Oct 8</span></div><div class="bd sl-cma">
        <div class="sl-val"><div><div class="lbl">Recommended list range</div><b class="num">${used.length ? short(Math.round(lo / 5000) * 5000) + " – " + short(Math.round(hi / 5000) * 5000) : "Pick at least one comp"}</b><div class="muted" style="font-size:12.5px">Based on ${used.length} comparable home${used.length === 1 ? "" : "s"} · avg ${usd(ppsf)}/sqft · your home ${l.sqft.toLocaleString()} sqft</div></div>
          <div class="sl-valr"><div class="lbl">Listed at</div><b class="num">${usd(l.price)}</b></div></div>
        <svg viewBox="0 0 600 72" class="sl-range" aria-label="Price range chart">
          <line x1="20" y1="34" x2="580" y2="34" stroke="#E3DDD0" stroke-width="10" stroke-linecap="round" />
          ${used.length ? html`<line x1=${sx(lo)} y1="34" x2=${sx(hi)} y2="34" stroke="#2E6B52" stroke-width="10" stroke-linecap="round" opacity=".85" />` : ""}
          ${used.map(c => html`<circle cx=${sx(c.adjd)} cy="34" r=${hot === c.id ? 8 : 5.5} fill="#fff" stroke="#1F4D3A" stroke-width="2.5" />`)}
          <line x1=${sx(l.price)} y1="18" x2=${sx(l.price)} y2="48" stroke="#B8873B" stroke-width="3" /><text x=${sx(l.price)} y="12" text-anchor="middle" font-size="13" font-weight="700" fill="#8A6322">Listed ${short(l.price)}</text>
          ${[["Zillow", 1118400], ["Redfin", 1131000]].map(([k, v], i) => html`<g><path d=${"M" + sx(v) + " 46 l-5 9 h10z"} fill="#8A918A" /><text x=${sx(v) + (i ? 10 : -10)} y="66" text-anchor=${i ? "start" : "end"} font-size="12" fill="#8A918A">${k} ${short(v)}</text></g>`)}
        </svg>
        <div class="muted" style="font-size:12px">Online estimates are shown for context only: low confidence for this home, because the 2019 remodel isn't in public records.</div>
        <div class="sl-cmap">${MapSvg()}${comps.map(c => html`<button class=${"pin" + (hot === c.id ? " hot" : "") + (inc.includes(c.id) ? "" : " uc")} style=${"left:" + c.x + "%;top:" + c.y + "%"} onMouseEnter=${() => setHot(c.id)} onMouseLeave=${() => setHot(null)} onClick=${() => setInc(inc.includes(c.id) ? inc.filter(x => x !== c.id) : [...inc, c.id])}>${short(c.p)}</button>`)}<span class="sl-subj" style="left:31%;top:36%">★ Your home</span></div>
        <div class="sl-comps">${comps.map(c => { const on = inc.includes(c.id); return html`<div class=${"sl-comp" + (on ? "" : " off") + (hot === c.id ? " hot" : "")} onMouseEnter=${() => setHot(c.id)} onMouseLeave=${() => setHot(null)}>
          <label class="row" style="gap:8px"><input type="checkbox" checked=${on} onChange=${() => setInc(on ? inc.filter(x => x !== c.id) : [...inc, c.id])} /><b>${c.a}</b></label>
          <div class="muted" style="font-size:12px">${c.st} · ${c.sq.toLocaleString()} sqft · ${usd(c.p / c.sq)}/sqft</div>
          <div class="sl-adj">${c.adj.map(([k, v]) => html`<span>${k} <b class=${v < 0 ? "sl-n" : "sl-p"}>${v < 0 ? "−" : "+"}${short(Math.abs(v))}</b></span>`)}</div>
          <div class="row" style="justify-content:space-between;font-size:12.5px"><span class="muted">${usd(c.p)} sold</span><b class="num">${usd(c.adjd)} adjusted</b></div></div>`; })}</div>
      </div></div>
      <div style="display:flex;flex-direction:column;gap:16px">
        <div class="card"><div class="hd"><h3>Your net sheet</h3><span class="sp"></span><span class="pill f">Live · same numbers Priya sees</span></div><div class="bd" style="display:flex;flex-direction:column;gap:10px">
          <label class="field"><span>Sale price · ${usd(price)}</span><input type="range" min="1050000" max="1220000" step="5000" value=${price} onInput=${e => setPrice(+e.target.value)} /></label>
          <div class="row sl-2"><label class=${"field" + (payErr ? " sl-bad" : "")}><span>Mortgage payoff</span><input type="number" step="1000" min="0" value=${payoff} aria-invalid=${!!payErr} onInput=${e => setPayoff(+e.target.value || 0)} /><${SlErr} m=${payErr} /></label><label class=${"field" + (concErr ? " sl-bad" : "")}><span>Seller concessions</span><input type="number" step="1000" min="0" value=${conc} aria-invalid=${!!concErr} onInput=${e => setConc(+e.target.value || 0)} /><${SlErr} m=${concErr} /></label></div>
          <label class="field"><span>Buyer's agent pay you offer · ${bc}%</span><input type="range" min="0" max="3" step="0.25" value=${bc} onInput=${e => setBc(+e.target.value)} /></label>
          <svg viewBox="0 0 300 22" class="sl-stack" aria-label="Where the money goes">${parts.map(([k, v, c]) => { const w = Math.max(0, v) / price * 300, el = html`<rect x=${acc} y="0" width=${w} height="22" fill=${c}><title>${k} ${usd(v)}</title></rect>`; acc += w; return el; })}</svg>
          <div class="sl-legend">${parts.map(([k, v, c]) => html`<span><i style=${"background:" + c}></i>${k} <b class="num">${short(Math.max(0, v))}</b></span>`)}</div>
          <div class="sheet">
            <div class="ln"><span>Sale price</span><span>${usd(price)}</span></div>
            <div class="ln neg"><span>Mortgage payoff</span><span>−${usd(payoff)}</span></div>
            <div class="ln neg"><span>Listing agent (2.5%)</span><span>−${usd(n.lcAmt)}</span></div>
            <div class="ln neg"><span>Buyer's agent (${bc}%)</span><span>−${usd(n.bcAmt)}</span></div>
            <div class="ln neg"><span>Title, escrow & recording</span><span>−${usd(n.title + n.misc)}</span></div>
            <div class="ln neg"><span>Property tax proration</span><span>−${usd(n.tax)}</span></div>
            ${conc ? html`<div class="ln neg"><span>Concessions</span><span>−${usd(conc)}</span></div>` : ""}
            <div class="ln tot"><span>You walk away with</span><span>${usd(n.net)}</span></div></div>
          <div class="row" style="gap:8px;flex-wrap:wrap"><button class="btn sm" disabled=${!!(payErr || concErr)} title=${payErr || concErr ? "Fix the highlighted number first" : ""} onClick=${() => { up(() => { (s.scen = s.scen || []).unshift({ price, conc, net: n.net, at: Date.now() }); slLog("Saved a net-sheet scenario: " + usd(price) + " with " + usd(conc) + " concessions → " + usd(n.net) + " net."); slFeed("You saved a net-sheet scenario at " + usd(price)); }); toast("Scenario saved · Priya can see it too"); }}>Save this scenario</button>${(s.scen || []).length ? html`<span class="muted" style="font-size:12px">${s.scen.length} saved · last ${usd(s.scen[0].price)} → <b class="num">${usd(s.scen[0].net)}</b> net, ${slRel(s.scen[0].at)}</span>` : ""}</div>
        </div></div>
        <div class="card"><div class="hd"><h3>Price plan from Priya</h3><span class="sp"></span>${pr.status === "Approved" ? html`<span class="pill g">You approved · ${myPc && myPc.status === "Filed" ? "filed" : myPc && myPc.status === "Returned" ? "on hold" : "with Priya"}</span>` : pr.status === "Declined" ? html`<span class="pill">Declined</span>` : html`<span class="pill a">Awaiting you</span>`}</div><div class="bd" style="display:flex;flex-direction:column;gap:10px;font-size:13px">
          <div class="sl-pc"><div><div class="lbl">Now</div><b class="num">${usd(l.price)}</b></div><span>→</span><div><div class="lbl">Proposed</div><b class="num">${usd(pr.to)}</b></div></div>
          <div><b>When:</b> ${pr.cond}</div>
          <div class="muted">${pr.why}</div>
          <div class="muted" style="font-size:12px">Your net at ${usd(pr.to)}: <b class="num" style="color:var(--ink)">${usd(slNet({ price: pr.to, payoff }).net)}</b></div>
          ${pr.status === "Awaiting you" ? html`
            ${altOpen ? html`<div class="row sl-2 sl-alt"><label class=${"field" + (altErr ? " sl-bad" : "")}><span>Your price instead</span><input type="number" step="5000" value=${alt} aria-invalid=${!!altErr} onInput=${e => setAlt(+e.target.value || 0)} onKeyDown=${e => { if (e.key === "Enter" && !altErr) approve(alt); }} /><${SlErr} m=${altErr} /></label><${SlConfirm} cls="btn brass" label=${"Sign at " + usd(alt)} disabled=${!!altErr} text=${"Sign a price amendment to " + usd(alt) + "? Priya files it only if the condition is met."} yes="Sign amendment" onYes=${() => approve(alt)} /></div>` : ""}
            <div class="row" style="flex-wrap:wrap;gap:6px"><${SlConfirm} cls="btn pri" label="Approve & sign" text=${"You're signing a price amendment: " + usd(l.price) + " → " + usd(pr.to) + ", " + pr.cond.charAt(0).toLowerCase() + pr.cond.slice(1) + "."} yes="Sign amendment" onYes=${() => approve(pr.to)} /><button class="btn" onClick=${() => setAltOpen(!altOpen)}>${altOpen ? "Hide my price" : "Suggest a different price"}</button><button class="btn ghost" onClick=${() => { up(() => { pr.status = "Declined"; slLog("We'd rather hold the price at " + usd(l.price) + " for now."); slFeed("You declined the price plan · holding at " + usd(l.price)); }); slNotify(l.agent, "The Grants want to hold " + l.addr + " at " + usd(l.price), "inbox/" + s.tid); toast("Priya's been told · price stays at " + usd(l.price), ["Undo", () => up(() => { pr.status = "Awaiting you"; slFeed("You reopened Priya's price plan"); })]); }}>Keep the price</button></div>`
          : pr.status === "Approved" ? html`<div class="sl-done"><span class="sl-chip"><${Ic} n="check" s=${14} /></span><div style="flex:1"><b>Signed ${pr.signed} at ${usd(pr.to)}</b><div class="muted" style="font-size:12.5px">${myPc && myPc.status === "Filed" ? "Filed with the MLS and live on every portal." : "Next: Priya watches Friday's offers. If none nets you $460,000+, she files it and you'll see it here."}</div></div>
              ${myPc && myPc.status === "Pending" ? html`<${SlConfirm} cls="btn sm ghost" label="Withdraw" text="Withdraw your signed approval?" yes="Withdraw" onYes=${withdraw} />` : ""}</div>`
          : html`<div class="sl-done"><span class="sl-chip"><${SlIc} n="tag" s=${14} /></span><div style="flex:1"><b>Holding at ${usd(l.price)}</b><div class="muted" style="font-size:12.5px">Priya will revisit after Friday's offers.</div></div><button class="btn sm" onClick=${() => up(() => { pr.status = "Awaiting you"; })}>Reconsider</button></div>`}
        </div></div>
      </div>
    </div></${SlFrame}>`;
}

// ---------------- 3. prep & disclosures ----------------
function SlPrep() {
  const s = sl(), c = S.d.slComp[s.lid], m = s.mkt, dsc = s.disc;
  slTick();
  const [sig, setSig] = useState({ r: false, t: false }), [certSig, setCertSig] = useState(false);
  const sec = SL_DISC[dsc.sec], total = SL_DISC.reduce((a, x) => a + x.qs.length, 0), done = Object.keys(dsc.ans).length;
  const approved = s.prep.filter(p => p.status !== "Quote" && p.status !== "Declined").reduce((a, p) => a + p.quote, 0);
  const clock = slClock(c);
  const opts = [["public", "Public MLS", "Everywhere at once: MLS, IDX sites, Zillow, Realtor.com and our site. Most buyers, most competition.", "Recommended"], ["office", "Office exclusive", "Filed with the MLS but shared only with Harbor & Vine agents and their buyers. No public ads, signs or portal listing.", "Needs your signed certification"], ["delayed", "Delayed marketing", "On the MLS for all agents now; IDX sites and portals wait " + m.delay + " days, so early buyers come through agents.", "Needs your signed certification"]];
  const locked = !!c.started || (m.opt === "office" && m.cert);
  const setAns = (k, v) => up(() => { dsc.ans[k] = v; dsc.saved = "just now"; dsc.dirty = true; });
  function act(p, st) {
    up(() => { p.status = st; slFeed((st === "Booked" ? "You approved " : "You declined ") + p.vendor + " · " + p.t.toLowerCase()); if (st === "Booked") slLog("Approved the " + p.vendor + " quote (" + usd(p.quote) + ") for " + p.t.toLowerCase() + "."); });
    toast(st === "Booked" ? p.vendor + " booked for " + p.when + " · paid from closing proceeds" : "Declined · Priya will suggest another vendor", ["Undo", () => up(() => { p.status = "Quote"; slFeed("You changed your mind on " + p.vendor + " · back to a quote"); })]);
  }
  // required explanations: every "Yes" under defects or conditions needs a note before signing
  const needNote = SL_DISC.filter(x => x.id === "def" || x.id === "con").flatMap(x => x.qs.map((q, j) => [x.id + j, q[0], x])).filter(([k]) => dsc.ans[k] === "Yes" && (dsc.notes[k] || "").trim().length < 8);
  const unanswered = total - done;
  const signBlock = unanswered ? "Answer all " + total + " questions to sign (" + unanswered + " left)" : needNote.length ? "Explain " + needNote.length + " “Yes” answer" + (needNote.length > 1 ? "s" : "") + " to sign" : !(sig.r && sig.t) ? "Both owners sign above first" : "";
  function startMarketing() {
    up(st => { c.started = Date.now(); c.startLbl = "Today"; c.events.push([slNowLbl(), m.opt === "delayed" ? "Filed for delayed marketing · agent-to-agent only" : "Yard sign installed & listing published"]); if (m.opt !== "public") c.cert = "Signed Oct 8"; c.opt = m.opt; if (st.d.sl.stage < 1) st.d.sl.stage = 1; slLog("We're ready: start " + (m.opt === "public" ? "marketing on the MLS and portals" : m.opt === "delayed" ? "delayed marketing" : "sharing with Harbor & Vine agents") + "."); slFeed("Marketing started · the MLS clock is running"); });
    slNotify(L(s.lid).agent, L(s.lid).addr + ": the Grants started " + (m.opt === "public" ? "public marketing · file with the MLS within 1 business day" : m.opt === "delayed" ? "delayed marketing" : "an office exclusive"), "listingops");
    toast(m.opt === "public" ? "Marketing started · Priya files with the MLS within 1 business day" : "Started · Priya has the signed certification", slOfficeAct("Open Listing ops", () => go("listingops")));
  }
  return html`<${SlFrame} tab="prep">
    <div class="pt-cols">
      <div style="display:flex;flex-direction:column;gap:16px">
        <div class="card"><div class="hd"><h3>Get the house ready</h3><span class="sp"></span><span class="muted" style="font-size:12.5px">Approved: <b class="num" style="color:var(--ink)">${usd(approved)}</b> · paid at closing</span></div>
          <div class="sl-prep">${s.prep.map(p => html`<div class=${"sl-pi " + p.status}>
            <span class="sl-chip lg"><${SlIc} n=${p.ic} /></span>
            <div style="flex:1;min-width:0"><b>${p.t}</b><div class="muted" style="font-size:12.5px">${p.vendor} · ${p.paidBy || usd(p.quote)} · ${p.status === "Done" ? "done " + p.when : p.when}</div>${p.note ? html`<div class="sl-note">${p.note}</div>` : ""}${p.alt && p.status === "Quote" ? html`<div class="muted" style="font-size:12px">Or ${p.alt}</div>` : ""}</div>
            ${p.status === "Quote" ? html`<div class="row" style="gap:6px"><button class="btn sm pri" onClick=${() => act(p, "Booked")}>Approve</button><button class="btn sm ghost" onClick=${() => act(p, "Declined")}>Decline</button></div>` : html`<span class=${"pill " + ({ Done: "g", Booked: "b", Declined: "" }[p.status])}>${p.status}</span>`}</div>`)}</div></div>

        <div class="card"><div class="hd"><h3>Seller's disclosure notice</h3><span class="sp"></span>${dsc.signed ? html`<span class="pill g">Signed ${dsc.on}</span>` : html`<span class="pill a">${done}/${total} answered</span>`}</div><div class="bd" style="display:flex;flex-direction:column;gap:12px">
          <div class="sl-secs">${SL_DISC.map((x, i) => { const n = x.qs.filter((q, j) => dsc.ans[x.id + j]).length; return html`<button class=${(dsc.sec === i ? "on" : "") + (n === x.qs.length ? " ok" : "")} onClick=${() => up(() => { dsc.sec = i; })}><i>${n === x.qs.length ? "✓" : i + 1}</i>${x.t}</button>`; })}</div>
          <div class="sl-q-hd"><b>${sec.t}</b><span class="muted" style="font-size:12.5px">${sec.hint}</span><span class="sl-saved">${dsc.signed ? "Locked · signed" : "Saved " + dsc.saved}</span></div>
          ${sec.qs.map((q, j) => { const k = sec.id + j, v = dsc.ans[k]; return html`<div class="sl-q"><span style="flex:1">${q[0]}</span><div class="seg sl-yn">${["Yes", "No", "Unknown"].map(o => html`<button class=${v === o ? "on" : ""} disabled=${dsc.signed} onClick=${() => setAns(k, o)}>${o}</button>`)}</div>
            ${v === "Yes" && (sec.id === "def" || sec.id === "con") ? html`<div class="sl-qn"><input class=${"sv-note" + (!dsc.signed && (dsc.notes[k] || "").trim().length < 8 ? " sl-bad-in" : "")} placeholder="Required: explain (dates, who repaired it, warranty)" aria-label=${"Explain: " + q[0]} aria-invalid=${(dsc.notes[k] || "").trim().length < 8} disabled=${dsc.signed} value=${dsc.notes[k] || ""} onInput=${e => up(() => { dsc.notes[k] = e.target.value; })} onBlur=${() => up(() => { dsc.saved = "just now"; })} />${!dsc.signed && (dsc.notes[k] || "").trim().length < 8 ? html`<${SlErr} m="Buyers need a short explanation for every “Yes” here (8+ characters)." />` : ""}</div>` : ""}</div>`; })}
          <div class="row" style="justify-content:space-between"><button class="btn sm" disabled=${dsc.sec === 0} onClick=${() => up(() => { dsc.sec--; })}>← Back</button>${dsc.sec < SL_DISC.length - 1 ? html`<button class="btn sm pri" onClick=${() => up(() => { dsc.sec++; dsc.saved = "just now"; })}>Save & next →</button>` : ""}</div>
          ${dsc.signed ? html`<div class="sl-views"><div class="lbl">Who has opened it</div>${dsc.views.map(([a, b, c2]) => html`<div class="row" style="font-size:12.5px"><span class="sl-chip"><${SlIc} n="doc" s=${13} /></span><span style="flex:1">${a}</span><span class="muted">${b} · ${c2}</span></div>`)}
              <button class="btn sm" style="align-self:flex-start" onClick=${() => { up(() => { dsc.signed = false; dsc.edits++; setSig({ r: false, t: false }); }); toast("Unlocked for an update · buyers who opened it will be told when you re-sign"); }}>Something changed? Update it</button></div>`
            : html`<div class="lbl">Both owners sign</div>
              <div class="sig">${sig.r ? html`<span class="ink">Rachel Grant</span>` : html`<span class="muted">Rachel Grant</span>`}<button class="btn sm brass" onClick=${() => setSig({ ...sig, r: true })}>${sig.r ? "Signed ✓" : "Sign"}</button></div>
              <div class="sig">${sig.t ? html`<span class="ink">Tom Grant</span>` : html`<span class="muted">Tom Grant · or sign by text</span>`}<button class="btn sm brass" onClick=${() => setSig({ ...sig, t: true })}>${sig.t ? "Signed ✓" : "Sign"}</button></div>
              ${needNote.length && !dsc.signed ? html`<div class="sl-err-box">Still needed: ${needNote.map(([k, t, x]) => html`<button class="sl-link" onClick=${() => up(() => { dsc.sec = SL_DISC.indexOf(x); })}>${t}</button>`)}</div>` : ""}
              <button class="btn pri" disabled=${!!signBlock} title=${signBlock} onClick=${() => { up(st => { dsc.signed = true; dsc.on = "Oct 8"; const dl = st.d.deals.find(x => x.id === s.did); const ck = dl && dl.checklist.find(x => x[0] === "Seller disclosure"); if (ck) ck[1] = true; slLog(dsc.edits ? "We signed an updated seller's disclosure." : "We signed the seller's disclosure."); slFeed("You signed the seller's disclosure" + (dsc.edits ? " (update)" : "")); }); slNotify(L(s.lid).agent, "The Grants signed " + (dsc.edits ? "an updated" : "their") + " seller's disclosure for " + L(s.lid).addr, "listingops"); toast(dsc.edits ? "Updated disclosure sent to the 4 agents who opened it" : "Disclosure signed · shared with every buyer agent who asks"); }}>${signBlock && signBlock !== "Both owners sign above first" ? signBlock : "Sign & share with buyers"}</button>`}
        </div></div>
      </div>

      <div style="display:flex;flex-direction:column;gap:16px">
        <div class="card"><div class="hd"><h3>How your home is marketed</h3><span class="sp"></span>${locked ? html`<span class="pill g">Chosen</span>` : ""}</div><div class="bd" style="display:flex;flex-direction:column;gap:10px">
          ${opts.map(([k, t, d2, note]) => html`<button class=${"sl-opt" + (m.opt === k ? " on" : "")} disabled=${locked && m.opt !== k} onClick=${() => up(() => { m.opt = k; m.cert = null; setCertSig(false); })}><i></i><div><b>${t}</b><span>${d2}</span><em>${note}</em></div></button>`)}
          ${m.opt === "delayed" && !locked ? html`<label class="field"><span>Hold from portals for</span><select value=${m.delay} onChange=${e => up(() => { m.delay = +e.target.value; })}>${[1, 2, 3, 5, 7].map(n => html`<option value=${n} selected=${m.delay === n}>${n} day${n > 1 ? "s" : ""}</option>`)}</select></label>` : ""}
          ${m.opt && m.opt !== "public" ? html`<div class="doc"><h4>Seller certification · ${m.opt === "office" ? "office exclusive" : "delayed marketing"}</h4>
              <div>We, Rachel and Tom Grant, choose ${m.opt === "office" ? "to keep our listing off public marketing" : "to delay IDX and portal display for " + m.delay + " days"}. Our agent explained that this may mean fewer buyers see our home, less competition between offers, and that price and days-on-market history still follow MLS rules.</div>
              <div class="sig" style="margin-top:4px">${certSig || m.cert ? html`<span class="ink">Rachel & Tom Grant</span>` : html`<span class="muted">Sign to confirm</span>`}<button class="btn sm brass" disabled=${!!m.cert} onClick=${() => { setCertSig(true); up(() => { m.cert = "Signed Oct 8"; }); toast("Certification signed · kept on file with the listing"); }}>${m.cert ? "On file ✓" : "Sign"}</button></div></div>` : ""}
          <div class="lbl" style="margin-top:4px">On agent websites (IDX)</div>
          ${[["avm", "Hide automated value estimates next to my listing"], ["comments", "Turn off public comments and reviews"], ["address", "Hide my street address (show the area only)"]].map(([k, t]) => html`<div class="row sl-sw-row"><span style="flex:1;font-size:13px">${t}</span><${SlSwitch} on=${m.idx[k]} onClick=${() => { up(() => { m.idx[k] = !m.idx[k]; slFeed((m.idx[k] ? "Turned on: " : "Turned off: ") + t.toLowerCase()); }); toast("Saved · applied to every IDX site within 24 hours"); }} /></div>`)}
          ${!c.started && m.opt ? html`<${SlConfirm} cls="btn pri big" disabled=${m.opt !== "public" && !m.cert} title=${m.opt !== "public" && !m.cert ? "Sign the certification above first" : ""} label=${m.opt === "office" ? "Share with Harbor & Vine agents" : "We're ready: start marketing"} text=${m.opt === "public" ? "This puts the sign up and the listing online, and can't be undone. Priya then has 1 business day to file with the MLS." : "This starts your " + (m.opt === "office" ? "office exclusive" : "delayed marketing") + " and can't be undone."} yes="Start now" onYes=${startMarketing} />${m.opt !== "public" && !m.cert ? html`<div class="muted" style="font-size:12px">Sign the certification above to continue.</div>` : ""}` : ""}
          ${m.opt === "office" && !c.started && m.cert ? html`<div class="warn" style="font-size:12.5px">Office exclusive: no yard sign, flyers or public posts. Any public marketing starts the 1-business-day MLS clock.</div>` : ""}
        </div></div>

        <div class="card"><div class="hd"><h3>MLS filing clock</h3><span class="sp"></span><span class="pill">Clear Cooperation</span></div><div class="bd" style="display:flex;flex-direction:column;gap:10px;font-size:13px">
          ${clock.state === "none" ? html`<div class="muted">Starts when your home is first marketed in public (sign, website, social post or email blast). Priya then has 1 business day to put it on the MLS.</div>`
            : clock.state === "ok" ? html`<div class="sl-clock ok"><span class="sl-chip"><${Ic} n="check" s=${14} /></span><div><b>On the MLS within ${slDur(clock.took).replace(/ \d+s$/, "")}</b><div class="muted" style="font-size:12px">Marketing started ${c.startLbl} · filed ${c.mlsLbl}</div></div></div>`
            : html`<div class=${"sl-clock " + clock.state}><span class="sl-chip"><${SlIc} n="clock" s=${14} /></span><div><b class="num">${clock.state === "late" ? "Overdue " + slDur(clock.left) : slDur(clock.left) + " left to file"}</b><div class="muted" style="font-size:12px">Priya has been notified · deadline is 1 business day after ${c.startLbl.toLowerCase()}</div></div></div>`}
          ${c.events.length ? html`<div class="sl-ev">${c.events.map(([w, t]) => html`<div><span class="dot"></span><span style="flex:1">${t}</span><span class="muted num">${w}</span></div>`)}</div>` : ""}
        </div></div>
      </div>
    </div></${SlFrame}>`;
}
const SlSwitch = ({ on, onClick }) => html`<button class=${"sl-sw" + (on ? " on" : "")} role="switch" aria-checked=${on ? "true" : "false"} onClick=${onClick}><i></i></button>`;

// ---------------- 4. marketing ----------------
function slDownload(name, body, type) {
  try { const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([body], { type: type || "text/plain" })); a.download = name; document.body.appendChild(a); a.click(); a.remove(); toast("Downloaded " + name); } catch (e) { toast("Couldn't download right now. Try again."); }
}
function slReportHtml(rep, l) {
  return "<!doctype html><meta charset=utf-8><title>" + l.addr + " · week 1</title><body style='font-family:Georgia,serif;max-width:640px;margin:40px auto;color:#16201B'><h1>" + l.addr + ", " + l.area + "</h1><p>Weekly seller report · week 1 · prepared by Harbor & Vine Realty</p><table cellpadding=6>" + rep.map(([a, b]) => "<tr><td><b>" + a.toLocaleString("en-US") + "</b></td><td>" + b + "</td></tr>").join("") + "</table><p>Listed at " + usd(l.price) + ".</p></body>";
}
function SlMarketing() {
  const s = sl(), l = L(s.lid), m = s.mkt;
  const rep = [[s.channels.reduce((a, c) => a + c.v, 0), "views"], [s.channels.reduce((a, c) => a + c.s, 0), "saves"], [s.showings.filter(x => x.status !== "Declined").length, "showings"], [s.oh.signins.length, "open-house groups"], [slStage() >= 3 ? slOffers().length : 0, "offers"]];
  const [metric, setMetric] = useState("v");
  const max = Math.max(...s.channels.map(c => c[metric]), 1);
  const dmax = Math.max(...s.daily.map(d => d[1]));
  const live = [["MLS (Austin Board of Realtors)", "Live since Oct 5", true, "Every agent in Central Texas can see and show it"], ["Agent websites (IDX)", m.idx.avm || m.idx.comments || m.idx.address ? "Live · your opt-outs applied" : "Live", m.opt !== "office", [m.idx.avm && "value estimates hidden", m.idx.comments && "comments off", m.idx.address && "address hidden"].filter(Boolean).join(" · ") || "Shown as filed"], ["Zillow, Realtor.com, Homes.com", "Live", m.opt === "public", "Syndicated from the MLS"], ["harborandvine.com + 4willowbend.com", "Live", m.opt !== "office", "Your own property site with tour booking"], ["Instagram & Facebook ads", "Running · $25/day", m.opt === "public", "Housing ad category: no targeting by age, gender or zip"], ["Email to 1,240 local agents", "Sent Oct 5 · 38% opened", m.opt !== "office", "Agent-to-agent blast"]];
  return html`<${SlFrame} tab="marketing">
    <div class="pt-cols">
      <div style="display:flex;flex-direction:column;gap:16px">
        <div class="card"><div class="hd"><h3>How buyers find your home</h3><span class="sp"></span><div class="seg sl-mseg">${[["v", "Views"], ["s", "Saves"], ["l", "Tour requests"]].map(([k, t]) => html`<button class=${metric === k ? "on" : ""} onClick=${() => setMetric(k)}>${t}</button>`)}</div></div><div class="bd">
          <div class="sl-hbar" aria-label="Performance by channel">${s.channels.map(c => html`<div class="sl-hb"><div class="row" style="justify-content:space-between;gap:8px"><span>${c.n}</span><b class="num">${c[metric]}</b></div><div class="sl-hbt"><i style=${"width:" + Math.max(1.5, c[metric] / max * 100) + "%;background:" + c.c}></i></div></div>`)}</div>
          <div class="sl-cmpbar"><span class="sl-chip"><${SlIc} n="bolt" s=${13} /></span><div><b>2.1× the views of similar homes</b><div class="muted" style="font-size:12px">Compared with 9 listings: 3–5 beds, $1.0M–$1.3M, Tarrytown & Clarksville, listed in the last 60 days</div></div></div>
        </div></div>
        <div class="card"><div class="hd"><h3>Views per day</h3><span class="sp"></span><span class="legend"><span><i style="background:#2E6B52"></i>Views</span><span><i style="background:#B8873B"></i>Tour requests</span></span></div><div class="bd">
          <svg viewBox="0 0 480 190" class="sl-cols" aria-label="Daily views chart">
            ${[0, .5, 1].map(f => html`<line x1="34" x2="476" y1=${150 - f * 120} y2=${150 - f * 120} stroke="#EFEBE1" /><text x="28" y=${154 - f * 120} font-size="12" text-anchor="end" fill="#8A918A">${Math.round(dmax * f)}</text>`)}
            ${s.daily.map(([d, v, t], i) => { const x = 60 + i * 106, h = v / dmax * 120; return html`<g><rect x=${x} y=${150 - h} width="62" height=${h} rx="7" fill="#2E6B52" opacity=${i === s.daily.length - 1 ? .55 : .9} /><text x=${x + 31} y=${142 - h} font-size="13" text-anchor="middle" font-weight="700" fill="#16201B">${v}</text><text x=${x + 31} y="172" font-size="12.5" text-anchor="middle" fill="#4E5751">${d}</text></g>`; })}
            <path d=${"M" + s.daily.map(([, , t], i) => (91 + i * 106) + "," + (150 - t / 10 * 120)).join(" L")} fill="none" stroke="#B8873B" stroke-width="3" />
            ${s.daily.map(([, , t], i) => html`<g><circle cx=${91 + i * 106} cy=${150 - t / 10 * 120} r="5" fill="#fff" stroke="#B8873B" stroke-width="2.5" /><text x=${104 + i * 106} y=${146 - t / 10 * 120} font-size="11.5" font-weight="700" fill="#8A6322" stroke="#fff" stroke-width="3" paint-order="stroke">${t}</text></g>`)}
          </svg>
          <div class="muted" style="font-size:12px">Today is partial (to 10:52 am). Week 1 always peaks on day one; a steady 100+ a day is healthy for this price.</div></div></div>
        <div class="card"><div class="hd"><h3>Weekly seller report</h3><span class="sp"></span><span class="pill">Week 1 · Oct 5–8</span></div><div class="bd" style="display:flex;flex-direction:column;gap:10px;font-size:13px">
          <div class="sl-rep">${rep.map(([a, b]) => html`<div><b class="num">${a.toLocaleString("en-US")}</b><span>${b}</span></div>`)}</div>
          <div class="muted">What we did: 38 photos and a 3D tour, a property website, 2 Instagram posts and a story, a $25/day housing ad, an email to 1,240 agents and a twilight open house.</div>
          <div class="row" style="flex-wrap:wrap;gap:8px"><button class="btn sm pri" onClick=${() => slDownload("4-Willow-Bend-week-1-report.html", slReportHtml(rep, l), "text/html")}>Download report</button><button class="btn sm" onClick=${() => { const u = "https://my.harborandvine.com/r/4wb-wk1"; try { navigator.clipboard && navigator.clipboard.writeText(u).catch(() => {}); } catch (e) {} toast("Link copied: " + u.replace("https://", "") + " · anyone with it can view, not edit"); }}>Copy share link</button><span style="flex:1"></span><span class="row" style="gap:8px;font-size:12.5px">Email it every Monday <${SlSwitch} on=${s.report.weekly} onClick=${() => { up(() => { s.report.weekly = !s.report.weekly; }); toast(s.report.weekly ? "You'll get it every Monday at 8 am" : "Weekly email paused"); }} /></span></div></div></div>
      </div>
      <div style="display:flex;flex-direction:column;gap:16px">
        <div class="card"><div class="hd"><h3>Where your home is live</h3></div><div class="bd sl-live">${live.map(([n, st, on, why]) => html`<div class=${"sl-lv" + (on ? "" : " off")}><span class=${"sl-ldot" + (on ? " on" : "")}></span><div style="flex:1;min-width:0"><b>${n}</b><div class="muted" style="font-size:12px">${on ? why : "Off · " + (m.opt === "office" ? "office exclusive" : "held during delayed marketing")}</div></div><span class="muted" style="font-size:12px;text-align:right">${on ? st : "—"}</span></div>`)}
          <div class="muted" style="font-size:12px">Change what's shown on the Prep tab. Agent pay is never shown on the MLS; it's on your net sheet only.</div></div></div>
        <div class="card"><div class="hd"><h3>Open house · ${s.oh.past.when}</h3><span class="sp"></span><span class="pill f">${s.oh.signins.length} groups</span></div><div class="bd" style="display:flex;flex-direction:column;gap:8px">
          <div class="sl-signins">${s.oh.signins.map(([i, a, b, c]) => html`<div class="sl-si"><span class="av" style=${"background:" + (c === "Hot" ? "#C0442E" : c === "Warm" ? "#B8873B" : "#8A918A")}>${i}</span><div style="min-width:0"><b style="font-size:12.5px">${a}</b><div class="muted" style="font-size:11.5px">${b} · ${c}</div></div></div>`)}</div>
          <div class="muted" style="font-size:12px">Names stay private. Visitors without an agent got Priya's follow-up the same evening.</div>
          <div class="sl-next-oh"><span class="sl-chip"><${SlIc} n="cal" s=${14} /></span><div style="flex:1"><b>Next: ${s.oh.next.when}</b><div class="muted" style="font-size:12px">Hosted by ${A(s.oh.next.host).name}</div></div><button class=${"btn sm" + (s.oh.next.away ? "" : " pri")} onClick=${() => { up(() => { s.oh.next.away = !s.oh.next.away; if (s.oh.next.away) { slLog("We'll be out of the house Sat 1–3 pm for the open house."); slFeed("You confirmed you'll be out for Saturday's open house"); } }); toast(s.oh.next.away ? "Thanks! Sam will text you when it wraps up" : "Okay, unmarked"); }}>${s.oh.next.away ? "We'll be out ✓" : "We'll be out"}</button></div>
        </div></div>
      </div>
    </div></${SlFrame}>`;
}

// ---------------- 5. showings ----------------
function SlShowings() {
  const s = sl(), r = s.rules;
  const [prop, setProp] = useState(null), [nb, setNb] = useState({ day: "Weekdays", t: "6:00–8:00 pm" });
  const up2 = s.showings.filter(x => x.status !== "Done").sort((a, b) => a.d - b.d || a.min - b.min);
  const past = s.showings.filter(x => x.status === "Done");
  const days = [...new Set(up2.map(x => x.day))];
  const pos = s.feedback.filter(f => f.sent === "Positive").length, neu = s.feedback.filter(f => f.sent === "Neutral").length, neg = s.feedback.filter(f => f.sent === "Negative").length, tot = s.feedback.length;
  function setSt(x, st, extra) {
    const prev = { status: x.status, prop: x.prop };
    up(() => { x.status = st; Object.assign(x, extra || {}); slFeed((st === "Confirmed" ? "You approved" : st === "Declined" ? "You declined" : "You proposed " + (extra && extra.prop) + " for") + " a " + x.firm + " showing (" + x.day + " " + x.time + ")"); });
    toast(st === "Confirmed" ? "Approved · " + x.firm + " agent gets instructions" + (x.day === "Today" ? "; lockbox code appears " + (r.window ? r.window + " min before" : "at the start") : "") : st === "Declined" ? "Declined · the agent is offered your open times" : "New time sent to the " + x.firm + " agent", ["Undo", () => up(() => { x.status = prev.status; x.prop = prev.prop; slFeed("You undid your answer on the " + x.firm + " showing"); })]);
    setProp(null);
  }
  const inWin = (x) => x.status === "Confirmed" && x.d === 0 && r.window > 0 && x.min - SL_NOWMIN <= r.window && SL_NOWMIN < x.min + x.len;
  return html`<${SlFrame} tab="showings">
    <div class="pt-cols">
      <div style="display:flex;flex-direction:column;gap:16px">
        <div class="card"><div class="hd"><h3>Upcoming showings</h3><span class="sp"></span><span class="muted" style="font-size:12px">Now: Thu Oct 8, 10:52 am</span></div><div class="bd sl-cal">
          ${!days.length ? html`<div class="sl-empty"><span class="sl-chip lg"><${SlIc} n="cal" /></span><b>No showings on the calendar</b><span class="muted">New requests land here and by text. Fewer requests than you'd like? Shorter notice (below) usually helps.</span></div>` : ""}
          ${days.map(dy => html`<div class="sl-day"><div class="sl-dh">${dy}</div>${up2.filter(x => x.day === dy).map(x => html`<div class=${"sl-sh " + x.status}>
            <div class="sl-time"><b>${x.time}</b><span>${x.len} min</span></div>
            <div style="flex:1;min-width:0"><div class="row" style="gap:6px;flex-wrap:wrap"><b>${x.type}</b><span class="muted">· agent from ${x.firm}</span>${x.status !== "Requested" ? html`<span class=${"pill " + ({ Confirmed: "g", Declined: "r", Proposed: "a" }[x.status])}>${x.status === "Proposed" ? "You proposed " + x.prop : x.status}</span>` : ""}</div>
              ${x.conflict && x.status === "Requested" ? html`<div class="sl-note">${x.conflict}</div>` : ""}
              ${x.status === "Confirmed" ? html`<div class=${"sl-lock" + (inWin(x) ? " open" : "")}><${SlIc} n="key" s=${13} />${inWin(x) ? html`<span>Lockbox code <b class="num">${r.code}</b> is visible to the ${x.firm} agent now, until the showing ends</span>` : html`<span>Lockbox code <b>••••</b> appears for the agent ${r.window ? r.window + " min before" : "at the start"}</span>`}</div>` : ""}
              ${x.status === "Requested" ? html`<div class="row" style="gap:6px;margin-top:8px;flex-wrap:wrap"><button class="btn sm pri" onClick=${() => setSt(x, "Confirmed")}>Approve</button><button class="btn sm" onClick=${() => setProp(prop === x.id ? null : x.id)}>Propose a time</button><button class="btn sm ghost" onClick=${() => setSt(x, "Declined")}>Decline</button></div>
                ${prop === x.id ? html`<div class="slots" style="margin-top:8px">${["9:45 am", "1:00 pm", "3:30 pm", "5:30 pm"].map(t => html`<button onClick=${() => setSt(x, "Proposed", { prop: x.day.replace("Today", "Today") + " " + t })}>${t}</button>`)}</div>` : ""}` : ""}
            </div></div>`)}</div>`)}
          ${past.length ? html`<div class="sl-day"><div class="sl-dh">Earlier</div>${past.map(x => html`<div class="sl-sh Done"><div class="sl-time"><b>${x.time}</b><span>${x.day.replace(/^\w+ /, "")}</span></div><div style="flex:1"><b>${x.type}</b> <span class="muted">· agent from ${x.firm}</span><div class="muted" style="font-size:12px">Showing complete · agent left at ${x.time.replace(/:\d\d/, ":45")}</div></div></div>`)}</div>` : ""}
        </div></div>
        <div class="card"><div class="hd"><h3>What buyers' agents said</h3><span class="sp"></span><span class="muted" style="font-size:12px">${tot} responses</span></div><div class="bd" style="display:flex;flex-direction:column;gap:12px">
          <div class="sl-sent"><i style=${"flex:" + pos + ";background:var(--green)"}></i><i style=${"flex:" + neu + ";background:#C9C2B2"}></i><i style=${"flex:" + neg + ";background:var(--red)"}></i></div>
          <div class="legend"><span><i style="background:var(--green)"></i>${pos} positive</span><span><i style="background:#C9C2B2"></i>${neu} neutral</span><span><i style="background:var(--red)"></i>${neg} negative</span></div>
          <div class="row" style="flex-wrap:wrap;gap:6px">${[["Kitchen & light", "+"], ["Move-in ready", "+"], ["Curb appeal", "+"], ["Road noise", "−"], ["Side gate", "−"], ["Price a bit high (2)", "−"]].map(([t, k]) => html`<span class=${"pill " + (k === "+" ? "g" : "r")}>${k} ${t}</span>`)}</div>
          ${!s.feedback.length ? html`<div class="sl-empty"><b>No feedback yet</b><span class="muted">Agents are asked for feedback an hour after every showing.</span></div>` : ""}
          ${s.feedback.map(f => html`<div class="sl-fb"><span class=${"sl-fbi " + f.sent}>${f.sent === "Positive" ? "☺" : f.sent === "Negative" ? "☹" : "–"}</span><div style="flex:1;min-width:0"><div class="row" style="gap:6px;flex-wrap:wrap;font-size:12.5px"><b>${f.firm} agent</b><span class="muted">${f.day} · interest ${f.interest.toLowerCase()} · price ${f.price.toLowerCase()}</span></div><div style="font-size:13px;margin-top:2px">"${f.text}"</div></div></div>`)}
          <div class="ai"><div class="lbl">Priya's read</div><div style="margin-top:4px;font-size:13px">Strong interest, two price notes. The side gate came up twice: the Handy Austin fix ($340) on the Prep tab takes that off the table before Saturday.</div></div>
        </div></div>
      </div>
      <div style="display:flex;flex-direction:column;gap:16px">
        <div class="card"><div class="hd"><h3>Showing rules</h3></div><div class="bd" style="display:flex;flex-direction:column;gap:12px;font-size:13px">
          <div class="field"><span>Notice we need</span><div class="seg">${[1, 2, 4, 24].map(h => html`<button class=${r.notice === h ? "on" : ""} onClick=${() => { up(() => { r.notice = h; }); toast("Agents must now book " + h + "h ahead"); }}>${h}h</button>`)}</div></div>
          <div class="field"><span>Lockbox code shows to the agent</span><div class="seg">${[0, 15, 30, 60].map(w => html`<button class=${r.window === w ? "on" : ""} onClick=${() => { up(() => { r.window = w; }); toast(w ? "Code appears " + w + " min before a confirmed showing" : "Code appears only at the start time"); }}>${w ? w + " min" : "At start"}</button>`)}</div></div>
          <div><div class="lbl" style="margin-bottom:6px">Blocked times</div>${r.blocks.map((b, i) => html`<div class="sl-blk"><${SlIc} n="clock" s=${13} /><span style="flex:1">${b}</span><button class="btn sm ghost" aria-label="Remove" title="Remove this block" onClick=${() => { up(() => { r.blocks.splice(i, 1); }); toast("Unblocked · agents can request those times", ["Undo", () => up(() => { r.blocks.splice(i, 0, b); })]); }}>✕</button></div>`)}
            <div class="row sl-2" style="margin-top:6px"><select class="sl-sel" value=${nb.day} onChange=${e => setNb({ ...nb, day: e.target.value })}>${["Weekdays", "Saturdays", "Sundays", "Every day"].map(x => html`<option value=${x} selected=${nb.day === x}>${x}</option>`)}</select><select class="sl-sel" value=${nb.t} onChange=${e => setNb({ ...nb, t: e.target.value })}>${["6:00–8:00 pm", "12:00–1:00 pm", "8:00–10:00 am"].map(x => html`<option value=${x} selected=${nb.t === x}>${x}</option>`)}</select><button class="btn sm" disabled=${r.blocks.includes(nb.day + " " + nb.t)} title=${r.blocks.includes(nb.day + " " + nb.t) ? "Already blocked" : ""} onClick=${() => { up(() => { r.blocks.push(nb.day + " " + nb.t); }); toast("Blocked " + nb.day.toLowerCase() + " " + nb.t, ["Undo", () => up(() => { r.blocks = r.blocks.filter(b => b !== nb.day + " " + nb.t); })]); }}>+ Block</button></div>${r.blocks.includes(nb.day + " " + nb.t) ? html`<div class="muted" style="font-size:12px;margin-top:4px">${nb.day} ${nb.t} is already blocked.</div>` : ""}${!r.blocks.length ? html`<div class="muted" style="font-size:12px;margin-top:4px">No blocked times · agents can request any time with ${r.notice}h notice.</div>` : ""}</div>
          <div class="row sl-sw-row"><span style="flex:1">We live here (occupied) · our details stay private</span><${SlSwitch} on=${r.occupied} onClick=${() => up(() => { r.occupied = !r.occupied; })} /></div>
          <div><div class="lbl" style="margin-bottom:6px">Household</div>${r.roles.map(rl => html`<div class="sl-blk"><span class="av" style="background:#5B6B62;width:24px;height:24px;font-size:10px">${rl[0].split(" ").map(w => w[0]).join("")}</span><span style="flex:1">${rl[0]} <span class="muted">· ${rl[2]}</span></span><button class="btn sm" onClick=${() => { up(() => { rl[1] = rl[1] === "Can confirm" ? "Notify only" : "Can confirm"; }); toast(rl[0].split(" ")[0] + ": " + rl[1].toLowerCase()); }}>${rl[1]}</button></div>`)}</div>
        </div></div>
        <div class="card"><div class="hd"><h3>Alerts</h3></div><div class="bd" style="display:flex;flex-direction:column;gap:10px;font-size:13px">
          ${[["req", "New showing request", "SMS · tap to approve from the text"], ["done", "Showing complete", "Push · when the agent locks up and leaves"], ["fb", "New feedback", "Email digest at 7 pm"], ["offers", "New offer", "SMS and push, right away"]].map(([k, t, d2]) => html`<div class="row sl-sw-row"><span class="sl-chip"><${SlIc} n="bell" s=${13} /></span><div style="flex:1"><b>${t}</b><div class="muted" style="font-size:12px">${d2}</div></div><${SlSwitch} on=${s.alerts[k]} onClick=${() => { up(() => { s.alerts[k] = !s.alerts[k]; }); toast(t + (s.alerts[k] ? " alerts on" : " alerts off")); }} /></div>`)}
        </div></div>
      </div>
    </div></${SlFrame}>`;
}

// ---------------- 6. offers ----------------
function SlOffersTab() {
  const s = sl(), l = L(s.lid), all = slOffers();
  const [sig, setSig] = useState({ r: false, t: false });
  if (slStage() < 3) return html`<${SlFrame} tab="offers"><div class="sl-empty big"><span class="sl-chip lg"><${SlIc} n="tag" /></span><b>No offers yet</b><span class="muted">Offers appear here side by side, each with what you'd walk away with, as soon as agents submit them. You'll get a text the minute one arrives.</span><div class="row" style="gap:8px;justify-content:center;flex-wrap:wrap"><button class="btn" onClick=${() => go("seller/showings")}>See showings</button>${isClient() ? "" : html`<button class="btn pri" onClick=${() => slJump(3)}>Demo: skip to offers</button>`}</div></div></${SlFrame}>`;
  const live = all.filter(o => slSt(o) !== "Declined");
  const rank = (o) => ({ Accepted: 0, Declined: 2 }[slSt(o)] ?? 1);
  const nets = all.map(o => ({ o, eff: slEff(o, all), n: slNet({ price: slEff(o, all), conc: o.conc, bc: o.bc }).net })).sort((a, b) => rank(a.o) - rank(b.o));
  const bestNet = Math.max(...nets.filter(x => slSt(x.o) !== "Declined").map(x => x.n));
  const accepted = all.find(o => slSt(o) === "Accepted");
  function hb() {
    up(() => { s.hb = "Fri Oct 9, 5:00 pm"; live.forEach(o => { if (slSt(o) === "New") slSetSt(o, "H&B requested"); }); slLog("Please ask all buyers for their highest and best by Friday 5 pm."); slFeed("You asked every buyer for their highest & best by Fri 5 pm"); });
    toast("Highest & best request sent to " + live.length + " buyer agents · deadline Fri 5 pm");
    setTimeout(() => up(() => { const w = s.offers.find(o => o.id === "O1"), c = s.offers.find(o => o.id === "O3"); if (w && w.status === "H&B requested") { w.price = 1140000; w.status = "Improved"; } if (c && c.status === "H&B requested") { c.price = 1158000; c.esc = 1175000; c.status = "Improved"; } slFeed("Whitman improved to $1,140,000 cash · Chen improved to $1,158,000 (escalating to $1,175,000)"); }), 2600);
  }
  return html`<${SlFrame} tab="offers">
    <div class="sl-osum"><div><div class="lbl">Offers on ${l.addr}</div><h2>${accepted ? "You accepted " + accepted.buyer + "'s offer" : all.length + " offers in · " + (s.hb ? "highest & best due " + s.hb : "due Fri Oct 9, 5 pm")}</h2></div>
      <div class="sl-osum-k"><div><span>Highest price</span><b class="num">${live.length ? usd(Math.max(...live.map(o => slEff(o, all)))) : "—"}</b></div><div><span>Best net to you</span><b class="num">${live.length ? usd(bestNet) : "—"}</b></div></div></div>
    ${!live.length ? html`<div class="sl-empty"><b>Every offer has been declined</b><span class="muted">Priya can reopen talks with any of these buyers, or you can wait for new offers.</span><button class="btn sm" onClick=${() => go("seller/messages")}>Message Priya</button></div>` : ""}
    <div class="sl-offers">${nets.map(({ o, eff, n }) => { const st = slSt(o); return html`<div class=${"sl-of" + (n === bestNet && st !== "Declined" ? " best" : "") + (st === "Declined" ? " dead" : "") + (st === "Accepted" ? " won" : "")}>
      ${n === bestNet && st !== "Declined" ? html`<span class="sl-rib">Best net</span>` : ""}
      <div class="row"><span class="av" style="background:#5B6B62">${o.ini}</span><div style="flex:1;min-width:0"><b>${o.buyer}</b><div class="muted" style="font-size:12px">${o.agent} · ${o.got}</div></div>${slStPill(st)}</div>
      <div class="sl-op"><span class="lbl">Offer</span><b class="num">${usd(eff)}</b>${eff !== o.price ? html`<small>escalated from ${usd(o.price)} · cap ${usd(o.esc)}</small>` : o.esc ? html`<small>escalation up to ${usd(o.esc)}</small>` : ""}</div>
      <div class="sl-onet"><span>You'd net</span><b class="num">${usd(n)}</b></div>
      <div class="sl-ot">${[["Financing", o.fin], ["Earnest money", usd(o.emd)], ["Closing", o.close], ["Option period", o.option + " days"], ["Contingencies", o.cont.join(", ")], ["Asks you to pay", o.conc ? usd(o.conc) : "Nothing"], ["Buyer's agent pay asked", o.bc + "%"]].map(([k, v]) => html`<div><span>${k}</span><b>${v}</b></div>`)}</div>
      <div class="sl-str"><div class="row" style="justify-content:space-between;font-size:12px"><span class="muted">Buyer strength</span><b>${o.strength}/100</b></div><div class="bar"><i style=${"width:" + o.strength + "%;background:" + (o.strength > 80 ? "var(--forest-2)" : o.strength > 60 ? "var(--brass)" : "var(--red)")}></i></div><div class="muted" style="font-size:11.5px">${o.pre}</div></div>
      ${o.note ? html`<div class="sl-note">${o.note}</div>` : ""}
      ${!accepted && st !== "Declined" ? html`<div class="row" style="gap:6px;flex-wrap:wrap;margin-top:auto"><button class="btn sm pri" onClick=${() => up(z => { z.modal = { kind: "slAccept", id: o.id }; })}>Accept</button><button class="btn sm" onClick=${() => up(z => { z.modal = { kind: "slCounter", id: o.id }; })}>Counter</button><${SlConfirm} cls="btn sm ghost" label="Decline" danger text=${"Decline " + o.buyer + "? Their agent is told."} yes="Decline offer" onYes=${() => { const prev = slSt(o); up(() => { slSetSt(o, "Declined"); slFeed("You declined " + o.buyer + "'s offer"); slLog("Please decline " + o.buyer + "'s offer, with thanks."); }); toast("Declined · Priya tells " + o.agent + " within the hour", ["Undo", () => up(() => { slSetSt(o, prev); slFeed("You took back the decline on " + o.buyer + "'s offer"); slLog("Hold off on declining " + o.buyer + ", we're reconsidering."); })]); }} /></div>` : ""}
      ${st === "Countered" && s.ctr[o.id] ? html`<div class="sl-note">Your counter: ${usd(s.ctr[o.id].price)} · close ${s.ctr[o.id].close} · ${s.ctr[o.id].option}-day option${s.ctr[o.id].dropSale ? " · no home-sale contingency" : ""}</div>` : ""}
    </div>`; })}</div>
    <div class="pt-cols">
      <div class="card"><div class="hd"><h3>Next moves</h3></div><div class="bd" style="display:flex;flex-direction:column;gap:10px;font-size:13px">
        ${accepted ? html`<div class="sl-done"><span class="sl-chip"><${Ic} n="check" s=${14} /></span><div style="flex:1"><b>Under contract at ${usd(slEff(accepted, all))} with ${accepted.buyer}</b><div class="muted" style="font-size:12.5px">Priya and Nina (closing coordinator) have the signed contract.</div></div></div>
            <div class="sl-next">${[["Earnest money " + usd(accepted.emd) + " due at Lone Star Title", "within 3 days"], ["Option period ends", "Oct " + (8 + accepted.option)], ["Buyer's inspection", "Priya confirms the time with you"], ["Closing", accepted.close]].map(([a, b]) => html`<div><span class="dot"></span><span style="flex:1">${a}</span><b class="muted num">${b}</b></div>`)}</div>
            <div class="row" style="gap:6px;flex-wrap:wrap"><button class="btn pri" onClick=${() => go("seller/home")}>Back to my sale</button><button class="btn" onClick=${() => go("seller/messages")}>Message Priya</button></div>`
          : html`<div class="row sl-move"><span class="sl-chip lg"><${SlIc} n="mega" /></span><div style="flex:1"><b>Ask for highest & best</b><div class="muted" style="font-size:12.5px">One message to every buyer's agent: final offers by Friday 5 pm.</div></div><button class="btn sm" disabled=${!!s.hb} onClick=${hb}>${s.hb ? "Sent ✓" : "Send"}</button></div>
            <div class="row sl-move"><span class="sl-chip lg"><${SlIc} n="chat" /></span><div style="flex:1"><b>Talk it through with Priya</b><div class="muted" style="font-size:12.5px">She'll call within 10 minutes.</div></div><button class="btn sm" disabled=${!!s.callReq} onClick=${() => { up(() => { s.callReq = Date.now(); slLog("Can you call us about the offers?"); }); slNotify(l.agent, "The Grants asked for a call about the offers on " + l.addr, "inbox/" + s.tid); slReply("Calling you in 5 minutes."); toast("Priya will call within 10 minutes"); }}>${s.callReq ? "Requested ✓" : "Request a call"}</button></div>`}
      </div></div>
      <div class="card"><div class="hd"><h3>Offers presented to us</h3><span class="sp"></span>${s.presented ? html`<span class="pill g">Signed ${s.presented.on}</span>` : html`<span class="pill a">Please sign</span>`}</div><div class="bd" style="display:flex;flex-direction:column;gap:10px">
        <div class="doc"><h4>Written affirmation of offer presentation</h4><div>We confirm that our agent, Priya Shah of Harbor & Vine Realty, presented each of these offers to us for ${l.addr}:</div>
          ${(s.presented ? s.presented.list : all.map(o => [o.buyer, o.agent, o.got])).map(([b, a, g]) => html`<div class="row" style="font-size:12px"><span>✓</span><span style="flex:1">${b} · ${a}</span><span class="muted">${g}</span></div>`)}
          <div style="font-size:11.5px">Cooperating brokers can ask for this in writing (NAR Code of Ethics, Standard of Practice 1-7). We are not required to share offer terms.</div></div>
        ${s.presented ? html`<div class="muted" style="font-size:12.5px">On file. Priya sends it to any buyer's agent who asks.</div>`
          : html`<div class="sig">${sig.r ? html`<span class="ink">Rachel Grant</span>` : html`<span class="muted">Rachel Grant</span>`}<button class="btn sm brass" onClick=${() => setSig({ ...sig, r: true })}>${sig.r ? "Signed ✓" : "Sign"}</button></div>
            <div class="sig">${sig.t ? html`<span class="ink">Tom Grant</span>` : html`<span class="muted">Tom Grant</span>`}<button class="btn sm brass" onClick=${() => setSig({ ...sig, t: true })}>${sig.t ? "Signed ✓" : "Sign"}</button></div>
            <button class="btn pri" disabled=${!(sig.r && sig.t)} onClick=${() => { up(st => { s.presented = { on: "Oct 8", list: all.map(o => [o.buyer, o.agent, o.got]) }; st.d.activity.push([s.pid, "Listings", "Signed offer-presented affirmation for " + all.length + " offers on " + l.addr, "Oct 8"]); slLog("We signed the affirmation that all " + all.length + " offers were presented to us."); slFeed("You signed the offer-presented affirmation"); }); toast("Affirmation signed · Priya can send it to any buyer's agent who asks"); }}>Confirm & sign</button>`}
      </div></div>
    </div></${SlFrame}>`;
}
function SlCounterModal({ m, close }) {
  const all = slOffers(), o = all.find(x => x.id === m.id), l = L(sl().lid);
  const [c, setC] = useState({ price: Math.max(o.price, 1149000), close: o.close, option: Math.min(o.option, 5), conc: 0, dropSale: o.cont.includes("Sale of buyer's home"), hrs: 24 });
  const [signed, setSigned] = useState(false);
  slEsc(close);
  const n = slNet({ price: c.price, conc: c.conc, bc: o.bc }).net;
  const optErr = c.option < 0 || c.option > 21 || c.option % 1 ? "Use 0 to 21 whole days (Texas forms typically 3–10)" : "";
  const concErr = c.conc < 0 ? "Can't be negative" : c.conc > c.price * 0.06 ? "Over 6% of the price; most lenders won't allow it" : "";
  const bad = optErr || concErr;
  function send() {
    if (bad || !signed) return;
    up(st => { slSetSt(o, "Countered"); sl().ctr[o.id] = c;
      if (o.ext && st.pj) { st.pj.counter = { price: c.price, close: c.close, option: c.option, note: "Sellers counter at " + usd(c.price) + " with a " + c.option + "-day option period, closing " + c.close + "." }; st.pj.feed.unshift(["Just now", "The sellers countered at " + usd(c.price)]); }
      slLog("Counter " + o.buyer + " at " + usd(c.price) + ", close " + c.close + ", " + c.option + "-day option" + (c.conc ? ", " + usd(c.conc) + " toward costs" : "") + ". Expires in " + c.hrs + "h."); slFeed("You countered " + o.buyer + " at " + usd(c.price)); st.modal = null; });
    slNotify(L(sl().lid).agent, "The Grants countered " + o.buyer + " at " + usd(c.price) + " · send on a TREC counter form", "deal/" + sl().did);
    if (o.ext) slNotify("buyer", "The sellers countered your offer on " + L(sl().lid).addr + " at " + usd(c.price) + " · respond in your portal", "portal/offer");
    toast("Counter signed and sent to " + o.agent + " · expires in " + c.hrs + "h");
  }
  return html`<div class="scrim" onClick=${e => { if (e.target.classList.contains("scrim")) close(); }}><div class="modal" role="dialog" aria-modal="true" aria-label=${"Counter " + o.buyer}>
    <div class="hd"><h3>Counter ${o.buyer}</h3><button class="btn sm ghost" aria-label="Close" title="Close (Esc)" onClick=${close}>✕</button></div>
    <div class="bd">
      <div class="muted" style="font-size:12.5px">Their offer: ${usd(o.price)} · ${o.fin} · close ${o.close} · ${o.cont.join(", ")}</div>
      <label class="field"><span>Your price · ${usd(c.price)}</span><input type="range" min=${o.price} max=${Math.max(o.price + 60000, 1200000)} step="1000" value=${c.price} onInput=${e => setC({ ...c, price: +e.target.value })} /></label>
      <div class="row sl-2"><label class="field"><span>Closing date</span><select value=${c.close} onChange=${e => setC({ ...c, close: e.target.value })}>${[...new Set([o.close, "Nov 6", "Nov 13", "Nov 20"])].map(x => html`<option value=${x} selected=${c.close === x}>${x}</option>`)}</select></label><label class=${"field" + (optErr ? " sl-bad" : "")}><span>Option period (days)</span><input type="number" min="0" max="21" value=${c.option} aria-invalid=${!!optErr} onInput=${e => setC({ ...c, option: +e.target.value || 0 })} /><${SlErr} m=${optErr} /></label></div>
      <div class="row sl-2"><label class=${"field" + (concErr ? " sl-bad" : "")}><span>You pay toward their costs</span><input type="number" step="1000" min="0" value=${c.conc} aria-invalid=${!!concErr} onInput=${e => setC({ ...c, conc: +e.target.value || 0 })} /><${SlErr} m=${concErr} /></label><label class="field"><span>Counter expires in</span><select value=${c.hrs} onChange=${e => setC({ ...c, hrs: +e.target.value })}>${[12, 24, 48].map(h => html`<option value=${h} selected=${c.hrs === h}>${h} hours</option>`)}</select></label></div>
      ${o.cont.includes("Sale of buyer's home") ? html`<label class="row" style="gap:8px;font-size:13px"><input type="checkbox" checked=${c.dropSale} onChange=${() => setC({ ...c, dropSale: !c.dropSale })} />Remove the "sale of buyer's home" contingency</label>` : ""}
      <div class="sheet"><div class="ln tot"><span>You'd net</span><span>${usd(n)}</span></div></div>
      <div class="sig">${signed ? html`<span class="ink">Rachel & Tom Grant</span>` : html`<span class="muted">Sign the counter</span>`}<button class="btn sm brass" onClick=${() => setSigned(true)}>${signed ? "Signed ✓" : "Sign"}</button></div>
      <div class="muted" style="font-size:12px">${l.addr} · Priya reviews and sends it to ${o.agent} on a TREC counter form.</div></div>
    <div class="ft">${!signed || bad ? html`<span class="muted" style="font-size:12px;margin-right:auto">${bad ? "Fix the highlighted field" : "Sign to send"}</span>` : ""}<button class="btn" onClick=${close}>Cancel</button><button class="btn pri" disabled=${!signed || !!bad} onClick=${send}>Send counter</button></div>
  </div></div>`;
}
// byBuyer: the buyer accepted the sellers' counter from the buyer portal (same contract, told from the other side)
function slAcceptOffer(o, all, backup, byBuyer) {
  const s = sl(), l = L(s.lid), eff = slEff(o, all);
  const backupCand = all.filter(x => x.id !== o.id && slSt(x) !== "Declined").sort((a, b) => slEff(b, all) - slEff(a, all))[0];
  up(st => {
    if (!o.ext) { o.price = eff; o.esc = 0; } all.forEach(x => { if (x.id === o.id) slSetSt(x, "Accepted"); else if (slSt(x) !== "Declined") slSetSt(x, backup && backupCand && x.id === backupCand.id ? "Backup" : "Declined"); });
    s.stage = 4; l.status = "Under contract"; l.tag = "Under contract";
    const dl = st.d.deals.find(x => x.id === s.did);
    if (dl) { dl.stage = "Under contract"; dl.price = eff; dl.close = o.close; dl.progress = .45; dl.dates = [["Listed", "Oct 5", true], ["Offer accepted", "Oct 8", true], ["Option period ends", "Oct " + (8 + o.option), false], ["Closing", o.close, false]]; const ck = dl.checklist.find(x => x[0] === "Offer review"); if (ck) ck[1] = true; dl.checklist.push(["Executed contract", true]); dl.docs.push(["One to Four Family Residential Contract", "Signed"]); }
    if (o.ext) { const bd = st.d.deals.find(x => x.person === "P4" && x.listing === s.lid); if (bd) { bd.stage = "Under contract"; bd.price = eff; } if (st.pj) { st.pj.counter = byBuyer && st.pj.counter ? { ...st.pj.counter, price: eff } : { price: eff, close: o.close, note: "The sellers accepted your offer.", direct: true }; st.pj.accepted = true; st.pj.stage = Math.max(st.pj.stage, 4); } }
    const c = st.d.slComp[s.lid]; c.events.push([slNowLbl(), "Status changed to Pending in the MLS"]);
    st.d.activity.push([s.pid, "Deals", "Accepted " + o.buyer + "'s offer on " + l.addr + " · " + usd(eff), "Oct 8"]);
    if (!byBuyer) slLog("We accept " + o.buyer + "'s offer at " + usd(eff) + (backup && backupCand ? ", with " + backupCand.buyer + " as backup" : "") + ". Signed in the portal.");
    slFeed(byBuyer ? o.buyer + " accepted your counter at " + usd(eff) + " · under contract!" : "You accepted " + o.buyer + "'s offer at " + usd(eff) + " · under contract!");
    st.modal = null;
  });
  slNotify(l.agent, "Offer accepted on " + l.addr + ": " + o.buyer + " at " + usd(eff) + ". Switch the MLS to pending.", "deal/" + s.did);
  slNotify("nina", "New contract to open: " + l.addr + " · " + o.buyer + " at " + usd(eff) + ", closing " + o.close, "deal/" + s.did);
  if (o.ext) { slNotify(byBuyer ? "seller" : "buyer", byBuyer ? o.buyer + " accepted your counter on " + l.addr + " at " + usd(eff) + " · you're under contract" : "The sellers accepted your offer on " + l.addr + " at " + usd(eff) + " · you're under contract", byBuyer ? "seller/offers" : "portal/deal"); slNotify("sam", "Under contract: " + l.addr + " · " + o.buyer + " at " + usd(eff), "deal/" + s.did); }
  if (byBuyer) return;
  slReply("Congratulations! I've sent the executed contract to Lone Star Title and switched the MLS to pending. Your option period ends Oct " + (8 + o.option) + ".");
  toast("Under contract at " + usd(eff) + (isClient() ? " · congratulations!" : " · Priya's deal file is updated"), slOfficeAct("Open deal file", () => go("deal/" + s.did), "deal"));
}
function SlAcceptModal({ m, close }) {
  const s = sl(), all = slOffers(), o = all.find(x => x.id === m.id), l = L(s.lid), eff = slEff(o, all), n = slNet({ price: eff, conc: o.conc, bc: o.bc });
  const backupCand = all.filter(x => x.id !== o.id && slSt(x) !== "Declined").sort((a, b) => slEff(b, all) - slEff(a, all))[0];
  const [backup, setBackup] = useState(true), [signed, setSigned] = useState(false);
  slEsc(close);
  function accept() { slAcceptOffer(o, all, backup); }
  return html`<div class="scrim" onClick=${e => { if (e.target.classList.contains("scrim")) close(); }}><div class="modal" role="dialog" aria-modal="true" aria-label=${"Accept " + o.buyer + "'s offer"}>
    <div class="hd"><h3>Accept ${o.buyer}'s offer</h3><button class="btn sm ghost" aria-label="Close" title="Close (Esc)" onClick=${close}>✕</button></div>
    <div class="bd">
      <div class="sheet">${[["Price", usd(eff)], ["Financing", o.fin], ["Closing", o.close], ["Option period", o.option + " days"], ["Contingencies", o.cont.join(", ")], ["Earnest money", usd(o.emd)]].map(([a, b]) => html`<div class="ln"><span>${a}</span><span>${b}</span></div>`)}<div class="ln tot"><span>You'd net (est.)</span><span>${usd(n.net)}</span></div></div>
      ${backupCand ? html`<label class="row" style="gap:8px;font-size:13px"><input type="checkbox" checked=${backup} onChange=${() => setBackup(!backup)} />Keep ${backupCand.buyer} (${usd(slEff(backupCand, all))}) as a backup offer</label>` : ""}
      <div class="muted" style="font-size:12.5px">Every other buyer's agent is told their offer was not accepted${backup && backupCand ? " (or is in backup position)" : ""}. Your listing switches to Pending.</div>
      <div class="sig">${signed ? html`<span class="ink">Rachel & Tom Grant</span>` : html`<span class="muted">Both owners sign</span>`}<button class="btn sm brass" onClick=${() => setSigned(true)}>${signed ? "Signed ✓" : "Sign"}</button></div></div>
    <div class="ft">${signed ? html`<span class="muted" style="font-size:12px;margin-right:auto">This is binding once both sides have signed.</span>` : html`<span class="muted" style="font-size:12px;margin-right:auto">Sign to accept</span>`}<button class="btn" onClick=${close}>Cancel</button><button class="btn pri" disabled=${!signed} onClick=${accept}>Accept offer</button></div>
  </div></div>`;
}

// ---------------- 7. messages ----------------
function SlMessages() {
  const s = sl(), t = S.d.threads.find(x => x.id === s.tid), [d, setD] = useState("");
  const box = useRef();
  slTick(30000);
  useEffect(() => { if (box.current) box.current.scrollTop = 9e9; });
  useEffect(() => { up(() => { t.msgs.forEach(m => { m.fresh = false; }); }); }, []);
  function send(text) { if (!text) return; up(() => { slLog(text); }); setD(""); slNotify(L(s.lid).agent, "Rachel Grant: " + (text.length > 70 ? text.slice(0, 70) + "…" : text), "inbox/" + s.tid); slReply("Thanks Rachel, on it. I'll update you here this afternoon."); }
  return html`<${SlFrame} tab="messages"><div class="card pt-chat">
    <div class="hd"><h3>You, Tom and Priya</h3><span class="sp"></span><span class="muted" style="font-size:12px">Email replies land here too</span></div>
    <div class="msgs" ref=${box}>${t.msgs.map(m => html`<div class=${"msg " + (m.from === "them" ? "me" : "ai")}>${m.text}<small>${m.from === "them" ? "You" : m.from === "ai" ? "Priya's assistant" : "Priya Shah"} · ${slMsgAt(m)}</small></div>`)}${!t.msgs.length ? html`<div class="empty">No messages yet. Ask Priya anything; she usually replies in about 10 minutes.</div>` : ""}</div>
    <div class="sl-quick">${["When will we know about Friday?", "Can we move out after closing?", "Is the gate repair booked?"].map(q => html`<button class="chip" onClick=${() => send(q)}>${q}</button>`)}</div>
    <div class="composer"><textarea placeholder="Message Priya…" aria-label="Message Priya" value=${d} onInput=${e => setD(e.target.value)} onKeyDown=${e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(d.trim()); } }}></textarea><div class="row"><span class="muted" style="font-size:11.5px">Enter to send · Shift+Enter for a new line</span><span style="flex:1"></span><button class="btn pri sm" disabled=${!d.trim()} onClick=${() => send(d.trim())}>Send</button></div></div>
  </div></${SlFrame}>`;
}

function SlPortal() {
  const v = { home: SlHome, pricing: SlPricing, prep: SlPrep, marketing: SlMarketing, showings: SlShowings, offers: SlOffersTab, messages: SlMessages }[S.route.id || "home"] || SlHome;
  return html`<${v} />`;
}

// ================= OFFICE: LISTING OPS =================
const SL_FH = [
  { re: /perfect for young professionals/i, fix: "close to downtown offices", why: "Familial status / age preference" },
  { re: /family-friendly/i, fix: "Spacious", why: "Familial status preference" },
  { re: /, great for kids:/i, fix: " with", why: "Familial status preference" },
  { re: /an exclusive tower/i, fix: "a landmark tower", why: "Suggests some buyers are not welcome" },
  { re: /walking distance to St\. Mary's church and/i, fix: "a short walk to", why: "Religion · and \"walking\" can imply a disability preference" },
  { re: /master suite/i, fix: "primary suite", why: "Style · ABoR prefers \"primary\"", style: true },
];
function slFlags(copy) { return SL_FH.map(f => { const m = copy.match(f.re); return m ? { ...f, hit: m[0], at: m.index } : null; }).filter(Boolean).sort((a, b) => a.at - b.at); }
function slIssues(id) {
  const c = S.d.slComp[id], k = slClock(c), out = [];
  if (k.state === "running" || k.state === "late") out.push("MLS clock");
  if (c.opt !== "public" && !c.cert) out.push("Certification");
  if (c.photos.altered && !c.photos.disclosed) out.push("Photo disclosure");
  if (slFlags(c.copy).some(f => !f.style)) out.push("Fair housing");
  return out;
}
function SlOps() {
  slTick();
  const mineDefault = !!(S.role && S.role.id === "listing-agent");
  const [mine, setMine] = useState(mineDefault);
  const comp = S.d.slComp, ls = S.d.listings.filter(x => !mine || x.agent === me().id);
  const [sel0, setSel] = useState("L4");
  const sel = ls.some(x => x.id === sel0) ? sel0 : (ls[0] || S.d.listings[0]).id;
  const running = ls.filter(l => ["running", "late"].includes(slClock(comp[l.id]).state)).length;
  const issues = ls.reduce((a, l) => a + slIssues(l.id).length, 0);
  const pend = S.d.slPrice.filter(p => p.status === "Pending" && (!mine || L(p.l).agent === me().id));
  const l = L(sel), c = comp[sel], k = slClock(c), flags = slFlags(c.copy);
  const optLbl = { public: "Public MLS", office: "Office exclusive", delayed: "Delayed marketing" };
  const s = sl();
  function fileMls(id) { const cc = comp[id], ll = L(id), left = slClock(cc).left || 0; up(st => { cc.mls = Date.now(); cc.mlsLbl = "Today"; cc.events.push([slNowLbl(), "Filed with ABoR MLS"]); st.d.activity.push(["P8", "Listings", "Filed " + ll.addr + " with the MLS within the Clear Cooperation window", "Oct 8"]); }); toast(ll.addr + " filed with the MLS · clock stopped with " + slDur(Math.max(0, left)).replace(/ \d+s$/, "") + " to spare"); }
  function fixWord(f) { const prev = c.copy; up(() => { c.copy = c.copy.replace(f.re, f.fix); }); toast("Replaced “" + f.hit + "” · copy re-checked", ["Undo", () => up(() => { c.copy = prev; })]); }
  function fileprice(p) {
    const ll = L(p.l);
    up(st => { p.status = "Filed"; const cut = ll.price - p.to; ll.price = p.to; ll.tag = cut > 0 ? "Price cut " + short(cut).replace("$", "$") : "New price"; st.d.activity.push([p.l === s.lid ? s.pid : "P8", "Listings", "Price change filed for " + ll.addr + ": " + usd(p.to), "Oct 8"]);
      if (p.l === s.lid) { const t = st.d.threads.find(x => x.id === s.tid); t.msgs.push({ from: "me", text: "Your price change to " + usd(p.to) + " is now filed with the MLS and live on every portal.", at: "now", ch: "Portal", fresh: true }); s.feed.unshift(["Just now", "Priya filed your new price: " + usd(p.to)]); } });
    if (p.l === s.lid) slNotify("seller", "Priya filed your new price: " + usd(p.to), "seller/pricing");
    toast(ll.addr + " is now " + usd(p.to) + " on the MLS, our site and the portals");
  }
  const first = me().name.split(" ")[0], hr = new Date().getHours(), greet = hr < 12 ? "Good morning" : hr < 18 ? "Good afternoon" : "Good evening";
  return html`<${Shell} title="Listing ops" sub=${(S.role ? greet + ", " + first + " · " : "") + "MLS clocks, seller certifications, photo and fair-housing checks, showings and seller approvals"} actions=${html`<div class="seg sl-mine" role="group" aria-label="Which listings">${[[true, "My listings"], [false, "All listings"]].map(([v, t]) => html`<button class=${mine === v ? "on" : ""} aria-pressed=${mine === v} onClick=${() => setMine(v)}>${t}</button>`)}</div>${slCan("seller") ? html`<button class="btn sl-act" onClick=${() => go("seller")} title="See exactly what the Grants see">View the Grants' portal →</button>` : ""}`}>
    <div class="page">
      <div class="kpis">${[["Listings", ls.filter(x => x.status !== "Sold").length, mine ? "Yours · " + S.d.listings.length + " in the office" : "Across " + new Set(S.d.listings.map(x => x.agent)).size + " agents"], ["MLS clocks running", running, running ? "File within 1 business day" : "All filed"], ["Compliance issues", issues, issues ? "Fix before the next post" : "All clear"], ["Seller approvals waiting", pend.length, "Price changes from sellers"]].map(([a, b, d2]) => html`<div class="kpi"><span>${a}</span><b class="num">${b}</b><span>${d2}</span></div>`)}</div>
      <div class="card"><div class="hd"><h3>Launch board</h3><span class="sp"></span><span class="muted" style="font-size:12px">Click a listing to see its checks</span></div>${!ls.length ? html`<div class="sl-empty"><b>No listings assigned to you</b><button class="btn sm" onClick=${() => setMine(false)}>Show all listings</button></div>` : ""}<div class="sl-scroll"><table class="t sl-board"><thead><tr><th>Listing</th><th>Marketing</th><th>MLS clock</th><th>Seller cert</th><th>Photos</th><th>Ad copy</th><th>Showings 7d</th></tr></thead><tbody>
        ${ls.map(x => { const cc = comp[x.id], kk = slClock(cc), fl = slFlags(cc.copy), hard = fl.filter(f => !f.style); return html`<tr class=${"click" + (sel === x.id ? " sl-on" : "")} tabindex="0" onClick=${() => setSel(x.id)} onKeyDown=${e => { if (e.key === "Enter") setSel(x.id); }}>
          <td><div class="row"><img class="thumb" src=${img(x.img)} alt="" /><div><b>${x.addr}</b><div class="muted" style="font-size:12px">${x.status} · ${A(x.agent).name}</div></div></div></td>
          <td><span class=${"pill " + (cc.opt === "public" ? "f" : "br")}>${optLbl[cc.opt]}</span></td>
          <td class="num">${kk.state === "ok" || kk.state === "filed" ? html`<span class="pill g">Filed ✓</span>` : kk.state === "none" ? html`<span class="muted">Not started</span>` : html`<span class=${"sl-timer" + (kk.state === "late" ? " late" : "")}><${SlIc} n="clock" s=${12} /> ${slDur(kk.left)}</span>`}</td>
          <td>${cc.opt === "public" ? html`<span class="muted">Not needed</span>` : cc.cert ? html`<span class="pill g">On file</span>` : html`<span class="pill r">${cc.certReq ? "Sent to seller" : "Missing"}</span>`}</td>
          <td>${cc.photos.altered ? cc.photos.disclosed ? html`<span class="pill g">${cc.photos.altered} altered · labeled</span>` : html`<span class="pill r">${cc.photos.altered} altered · no label</span>` : html`<span class="muted">${cc.photos.n ? "Unaltered" : "Not shot yet"}</span>`}</td>
          <td>${hard.length ? html`<span class="pill r">${hard.length} flagged</span>` : fl.length ? html`<span class="pill a">${fl.length} style</span>` : html`<span class="pill g">Clear</span>`}</td>
          <td class="num"><div class="row" style="gap:6px"><b>${x.id === s.lid ? s.showings.filter(z => z.status !== "Declined").length : cc.show7}</b>${(x.id === s.lid ? s.showings.filter(z => z.status === "Requested").length : cc.pend) ? html`<span class="pill b">${x.id === s.lid ? s.showings.filter(z => z.status === "Requested").length : cc.pend} pending</span>` : ""}</div></td></tr>`; })}
      </tbody></table></div></div>

      <div class="split">
        <div class="card"><div class="hd"><img class="thumb" src=${img(l.img)} alt="" /><h3>${l.addr} · checks</h3><span class="sp"></span>${slIssues(sel).length ? html`<span class="pill r">${slIssues(sel).length} to fix</span>` : html`<span class="pill g">All clear</span>`}</div><div class="bd sl-checks">
          <div class="sl-ck"><span class=${"sl-chip lg" + (k.state === "running" || k.state === "late" ? " warnc" : "")}><${SlIc} n="clock" /></span><div style="flex:1;min-width:0"><b>MLS filing clock · ${optLbl[c.opt]}</b>
            ${k.state === "running" || k.state === "late" ? html`<div class=${"sl-big " + k.state}>${k.state === "late" ? "Overdue " : ""}${slDur(k.left)}${k.state === "running" ? " left" : ""}</div><div class="muted" style="font-size:12.5px">Public marketing started ${c.startLbl}. File within 1 business day or pull the marketing.</div><button class="btn sm pri" style="margin-top:8px" onClick=${() => fileMls(sel)}>File with the MLS now</button>`
              : k.state === "ok" ? html`<div class="muted" style="font-size:12.5px">Filed ${c.mlsLbl}${c.startLbl ? " · " + slDur(k.took).replace(/ \d+s$/, "") + " after public marketing began" : ""}</div>` : html`<div class="muted" style="font-size:12.5px">${c.opt === "delayed" ? "Filed " + (c.mlsLbl || "—") + " · portals held " + c.delay + " days" : "No public marketing yet"}</div>`}
            ${c.events.length ? html`<div class="sl-ev">${c.events.map(([w, t]) => html`<div><span class="dot"></span><span style="flex:1">${t}</span><span class="muted num">${w}</span></div>`)}</div>` : ""}</div></div>
          <div class="sl-ck"><span class="sl-chip lg"><${SlIc} n="doc" /></span><div style="flex:1"><b>Seller certification</b>
            <div class="muted" style="font-size:12.5px">${c.opt === "public" ? "Not needed for a public MLS listing." : c.cert ? c.cert + " · kept with the listing file" : "Required before an office-exclusive or delayed listing can start."}</div>
            ${c.opt !== "public" && !c.cert ? html`<button class="btn sm pri" style="margin-top:8px" disabled=${c.certReq} onClick=${() => { up(() => { c.certReq = true; }); toast("Sent to the seller for e-signature"); setTimeout(() => { up(() => { c.cert = "Signed Oct 8"; c.certReq = false; }); toast("Seller signed the " + optLbl[c.opt].toLowerCase() + " certification for " + l.addr); }, 1800); }}>${c.certReq ? "Waiting for signature…" : "Send for e-signature"}</button>` : ""}</div></div>
          <div class="sl-ck"><span class=${"sl-chip lg" + (c.photos.altered && !c.photos.disclosed ? " warnc" : "")}><${SlIc} n="cam" /></span><div style="flex:1;min-width:0"><b>Photos · ${c.photos.n} uploaded</b>
            ${c.photos.altered ? html`<div class="sl-ph">${[l.img, ...l.gallery].slice(0, 4).map((g, i) => html`<div style=${"background-image:url(" + img(g) + ")"}>${i > 0 && i <= c.photos.altered ? html`<span class=${c.photos.disclosed ? "" : "bad"}>${c.photos.disclosed ? "Virtually altered · original linked" : c.photos.kind + " · no label"}</span>` : ""}</div>`)}</div>
              <div class="muted" style="font-size:12.5px">${c.photos.altered} photo${c.photos.altered > 1 ? "s" : ""} ${c.photos.kind}. MLS rules: label altered photos and keep the original next to it; never alter the main front photo.</div>
              ${!c.photos.disclosed ? html`<button class="btn sm pri" style="margin-top:8px" onClick=${() => { up(() => { c.photos.disclosed = true; }); toast("Label added and original linked on the MLS, our site and the portals"); }}>Add label & link the original</button>` : ""}` : html`<div class="muted" style="font-size:12.5px">${c.photos.n ? "No digital alterations found. Main photo is the front exterior." : "Photos booked with Lens & Lumen Media."}</div>`}</div></div>
          <div class="sl-ck"><span class=${"sl-chip lg" + (flags.some(f => !f.style) ? " warnc" : "")}><${SlIc} n="shield" /></span><div style="flex:1;min-width:0"><b>Fair-housing check · listing and ad copy</b>
            <p class="sl-copy">${(() => { const out = []; let i = 0; flags.forEach(f => { out.push(c.copy.slice(i, f.at)); out.push(html`<mark class=${f.style ? "sty" : ""} title=${f.why}>${f.hit}</mark>`); i = f.at + f.hit.length; }); out.push(c.copy.slice(i)); return out; })()}</p>
            ${flags.length ? flags.map(f => html`<div class="sl-fl"><span class=${"pill " + (f.style ? "a" : "r")}>${f.style ? "Style" : "Fair housing"}</span><span style="flex:1;min-width:0">“${f.hit}” <span class="muted">· ${f.why}</span></span><button class="btn sm" onClick=${() => fixWord(f)}>Use “${f.fix.trim()}”</button></div>`) : html`<div class="muted" style="font-size:12.5px">No wording that signals a preference for or against any group. Checked against HUD guidance.</div>`}
            ${flags.length > 1 ? html`<button class="btn sm pri" style="margin-top:8px" onClick=${() => { up(() => { flags.forEach(f => { c.copy = c.copy.replace(f.re, f.fix); }); }); toast("All " + flags.length + " fixes applied · ads and MLS remarks updated"); }}>Apply all fixes</button>` : ""}</div></div>
        </div></div>

        <div style="display:flex;flex-direction:column;gap:18px">
          <div class="card"><div class="hd"><h3>Seller approvals</h3><span class="sp"></span><span class="muted" style="font-size:12px">From seller portals</span></div><div class="bd" style="display:flex;flex-direction:column;gap:10px">
            ${S.d.slPrice.filter(p => !mine || L(p.l).agent === me().id).length ? S.d.slPrice.filter(p => !mine || L(p.l).agent === me().id).map(p => { const pl = L(p.l); return html`<div class="sl-apr"><div class="row"><img class="thumb" src=${img(pl.img)} alt="" /><div style="flex:1;min-width:0"><b>${pl.addr}</b><div class="muted" style="font-size:12px">${p.by}${p.at ? " · " + slRel(p.at) : ""}</div></div>${p.status === "Filed" ? html`<span class="pill g">Filed</span>` : p.status === "Returned" ? html`<span class="pill">Returned</span>` : html`<span class="pill a">Pending</span>`}</div>
              <div class="sl-pc sm"><b class="num">${usd(p.from)}</b><span>→</span><b class="num">${usd(p.to)}</b></div><div class="muted" style="font-size:12px">${p.cond}</div>
              ${p.status === "Pending" && pl.status === "Under contract" ? html`<div class="row" style="gap:6px"><span class="muted" style="font-size:12px;flex:1">Listing went under contract: no longer needed</span><button class="btn sm" onClick=${() => { up(() => { p.status = "Returned"; }); toast("Price change withdrawn · " + pl.addr + " is under contract", ["Undo", () => up(() => { p.status = "Pending"; })]); }}>Withdraw</button></div>` : p.status === "Pending" ? html`<div class="row" style="gap:6px;flex-wrap:wrap"><${SlConfirm} cls="btn sm pri" label="File with MLS" text=${"Publish " + usd(p.to) + " to the MLS and every portal now?"} yes="File price change" onYes=${() => fileprice(p)} /><button class="btn sm ghost" onClick=${() => { up(() => { p.status = "Returned"; }); toast("Kept on hold · the seller sees it as on hold", ["Undo", () => up(() => { p.status = "Pending"; })]); }}>Hold</button></div>` : p.status === "Returned" && pl.status !== "Under contract" ? html`<button class="btn sm" style="align-self:flex-start" onClick=${() => up(() => { p.status = "Pending"; })}>Move back to pending</button>` : ""}</div>`; }) : html`<div class="sl-empty"><b>Nothing waiting</b><span class="muted">Price changes your sellers sign in their portal land here.</span></div>`}
          </div></div>
          <div class="card"><div class="hd"><h3>Showing activity</h3><span class="sp"></span><button class="btn sm" onClick=${() => go("seller/showings")}>4 Willow Bend →</button></div><div class="bd" style="display:flex;flex-direction:column;gap:8px">
            ${ls.filter(x => (x.id === s.lid ? 1 : comp[x.id].show7)).map(x => { const cc = comp[x.id], n = x.id === s.lid ? s.showings.filter(z => z.status !== "Declined").length : cc.show7, pos = x.id === s.lid ? Math.round(s.feedback.filter(f => f.sent === "Positive").length / s.feedback.length * 100) : cc.pos; return html`<div class="sl-sa"><span style="flex:1;min-width:0;font-size:12.5px"><b>${x.addr}</b><span class="muted"> · ${n} showings</span></span><div class="sl-sbar"><i style=${"width:" + pos + "%"}></i></div><span class="muted num" style="font-size:12px;width:76px;text-align:right">${pos}% positive</span></div>`; })}
            <div class="lbl" style="margin-top:6px">Today at 4 Willow Bend</div>
            ${s.showings.filter(x => x.d === 0).map(x => html`<div class="row" style="font-size:12.5px"><b class="num" style="width:62px">${x.time}</b><span style="flex:1">${x.firm} · ${x.type.toLowerCase()}</span>${slStPill2(x.status)}</div>`)}
          </div></div>
        </div>
      </div>
    </div></${Shell}>`;
}
const slStPill2 = (s) => html`<span class=${"pill " + ({ Confirmed: "g", Requested: "b", Declined: "r", Proposed: "a" }[s] || "")}>${s === "Requested" ? "Seller deciding" : s}</span>`;
