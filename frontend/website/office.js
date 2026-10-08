// Estate OS office screens: Today, Inbox, People, Person, Deals, Deal, Listings, Listing, Rentals, Projects, Back office, Modules,
// and the office modals (agreement, e-sign, offers, new person/deal/listing, vendor dispatch, unit booking, CP registration).
// Uses the store and helpers from app.js at call time (app.js loads last). Own helpers/classes are prefixed of / .of-.

(window.EOS_EXT = window.EOS_EXT || []).push({
  modals: { ofPerson: OfPersonModal, ofDeal: OfDealModal, ofListing: OfListingModal, ofVendor: OfVendorModal, ofBook: OfBookModal, ofCp: OfCpModal, ofHold: OfHoldModal, ofConfirm: OfConfirmModal, ofDoc: OfDocModal },
  seed: ofSeed,
});

// ================= SEED (office-owned extras; never renames existing fields) =================
function ofSeed(d) {
  const now = Date.now(), H = 36e5, find = (id) => d.people.find(p => p.id === id);
  const C = (SMS, WhatsApp, Email, note) => ({ SMS, WhatsApp, Email, note: note || "" });
  const cons = { P1: C("in", "in", "in", "Website form · one-to-one consent to Harbor & Vine · Aug 30"), P2: C("in", "unknown", "in", "Past client · consent on file since 2019"), P3: C("in", "unknown", "in", "Zillow lead · texted us first Oct 8"), P4: C("in", "unknown", "in", "Instagram lead form · Oct 7, 9:39 pm"), P5: C("in", "in", "in", "Open-house sign-in · Oct 3"), P6: C("in", "unknown", "in", "Lease addendum · May 1"), P7: C("unknown", "in", "in", "WhatsApp opt-in via NRI desk · Sep 18"), P8: C("out", "unknown", "in", "Asked by email to stop texts · Oct 7 (revocation honoured)") };
  d.people.forEach(p => { if (!p.consent) p.consent = cons[p.id] || C("unknown", "unknown", "in", "Added by hand"); if (!p.tags) p.tags = []; });
  // more conversations so every seat has a real inbox
  const addT = (t) => { if (!d.threads.some(x => x.id === t.id)) d.threads.push(t); };
  addT({ id: "T6", person: "P8", channel: "Email", unread: 1, when: "Yesterday", subject: "1806 Kinney launch timing", msgs: [
    { from: "them", text: "Saw the coming-soon sign go up, it looks great. Could we hold the MLS launch until after Thanksgiving? Also, please stop texting me; email is better for me.", at: "Yesterday 6:40 pm", ch: "Email" }] });
  addT({ id: "T7", person: "P5", channel: "Portal", unread: 1, when: "Yesterday", subject: "Offer on 3402 Govalle", msgs: [
    { from: "them", text: "Any word from the sellers on Govalle? We could go to $612k if it helps, but not higher.", at: "Yesterday 8:15 pm", ch: "Portal" }] });
  addT({ id: "T8", person: "P7", channel: "WhatsApp", unread: 1, when: "6:10 am", subject: "2 BR at The Linden", msgs: [
    { from: "them", text: "Namaste Rohan! We'd like to go ahead with a 2 BR on a high floor, lake side. Can you send the payment schedule? We're in Mumbai, 10.5 hours ahead.", at: "6:10 am", ch: "WhatsApp" }] });
  const asg = { T1: "jordan", T2: "jordan", T3: "priya", T4: "jordan", T5: "leo", T6: "priya", T7: "sam", T8: "rohan" };
  d.threads.forEach(t => { if (t.assignee === undefined) t.assignee = asg[t.id] || (find(t.person) || {}).owner || "maya"; if (!t.snooze) t.snooze = null; if (t.closed === undefined) t.closed = false; });
  const T = (id, t, who, due, person, deal, kind) => ({ id, t, who, due, person, deal, kind: kind || "To-do", done: false });
  d.of = {
    tasks: [
      T("K1", "Send Elena the buyer agreement before Saturday's tour", "jordan", "Oct 8", "P4", "D5", "Text"),
      T("K2", "Inspection response to the seller's agent (AC credit)", "jordan", "Oct 9", "P1", "D1", "To-do"),
      T("K3", "Call Marcus: compare Barton Hills vs Govalle schools", "jordan", "Oct 7", "P3", "D4", "Call"),
      T("K4", "Prep offer review for the Grants (3 offers)", "priya", "Oct 9", "P2", "D2", "To-do"),
      T("K5", "Email Olivia a Thanksgiving launch plan for 1806 Kinney", "priya", "Oct 8", "P8", "D6", "Email"),
      T("K6", "Order appraisal for 515 Ridgeview", "nina", "Oct 8", "P1", "D1", "To-do"),
      T("K7", "Collect title commitment from Lone Star Title", "nina", "Oct 12", "P1", "D1", "Email"),
      T("K8", "Follow up on Kenji's counter at $612k", "sam", "Oct 8", "P5", "D3", "Call"),
      T("K9", "Send Brooks Holdings the 2027 budget draft", "leo", "Oct 9", "P1", null, "Email"),
      T("K10", "Payment schedule to the Nairs on WhatsApp", "rohan", "Oct 8", "P7", null, "Text"),
      T("K11", "Quarterly check-in with Olivia (homeowner)", "jordan", "Oct 20", "P8", null, "Call"),
    ],
    notes: [
      { id: "N1", person: "P1", deal: "D1", by: "jordan", at: "Oct 6", text: "Aisha prefers WhatsApp; Daniel signs everything from his work laptop. Lender is Hill Country Mortgage (Ana Ruiz)." },
      { id: "N2", person: "P2", deal: "D2", by: "priya", at: "Oct 2", text: "Grants want to close by mid-November to line up the purchase in Westlake. Net matters more than headline price." },
      { id: "N3", person: "P3", deal: null, by: "jordan", at: "Oct 8", text: "Two kids, 8 and 11. Must be in Eanes or Austin ISD top-rated elementary zone." },
    ],
    tours: [
      { id: "TR1", person: "P3", listing: "L2", agent: "jordan", at: "10:30 am", day: "Today", mode: "In person", status: "Confirmed" },
      { id: "TR2", person: "P3", listing: "L6", agent: "jordan", at: "11:15 am", day: "Today", mode: "In person", status: "Confirmed" },
      { id: "TR3", person: "P4", listing: "L1", agent: "jordan", at: "1:00 pm", day: "Sat Oct 10", mode: "In person", status: "Agreement needed" },
      { id: "TR4", person: "P5", listing: "L3", agent: "sam", at: "4:00 pm", day: "Today", mode: "Video", status: "Confirmed" },
    ],
    parties: {
      D1: [["Seller's agent", "Kate Hayes · Compass", "(512) 555-0301"], ["Title", "Lone Star Title · Dana Pruitt", "(512) 555-0410"], ["Lender", "Hill Country Mortgage · Ana Ruiz", "(512) 555-0477"], ["Inspector", "Lone Star Inspections", "(512) 555-0333"]],
      D2: [["Title", "Heritage Title · Westlake", "(512) 555-0420"]],
      D3: [["Seller's agent", "Mark Owens · Realty Austin", "(512) 555-0360"]],
      D4: [["Seller's agent", "Priya Shah · Harbor & Vine (dual agency notice)", "(512) 555-0129"]],
    },
    vendors: [
      { id: "V-ace", name: "Ace Plumbing", trade: "Plumbing", rating: 4.9, fee: 95, next: ["today 12–2 pm", "today 4–6 pm", "Fri 8–10 am"] },
      { id: "V-pipe", name: "Capital Pipe Co.", trade: "Plumbing", rating: 4.6, fee: 79, next: ["Fri 1–3 pm", "Sat 9–11 am"] },
      { id: "V-polar", name: "Polar Air", trade: "HVAC", rating: 4.8, fee: 110, next: ["Fri 9–11 am", "Mon 1–3 pm"] },
      { id: "V-cool", name: "Cool Breeze HVAC", trade: "HVAC", rating: 4.5, fee: 89, next: ["today 3–5 pm", "Fri 10–12"] },
      { id: "V-home", name: "HomeFix Appliance", trade: "Appliance", rating: 4.7, fee: 85, next: ["Fri 8–10 am", "Mon 10–12"] },
      { id: "V-spark", name: "Spark Electric", trade: "Electrical", rating: 4.8, fee: 120, next: ["today 2–4 pm", "Fri 9–11 am"] },
      { id: "V-ray", name: "Ray Alvarez (in-house)", trade: "General", rating: 5, fee: 0, next: ["today 2–4 pm", "Fri 8–10 am"] },
    ],
    payPlans: { clp: { name: "Construction-linked", rows: d.project.plan, disc: 0 }, sub: { name: "10:90 subvention", rows: [["Booking", 10], ["Possession", 90]], disc: 0 }, dp: { name: "Down payment · 3% off", rows: [["Booking", 10], ["Within 45 days", 85], ["Possession", 5]], disc: 3 } },
    cpRegs: [
      { id: "R1", cp: "Keller CP", buyer: "Ravi Iyer", phone: "(512) 555-0231", pref: "2 BR · lake side", at: "Today 9:05 am", status: "Pending" },
      { id: "R2", cp: "Austin Home Finders", buyer: "Meera Nair", phone: "+91 98200 55012", pref: "2 BR", at: "Yesterday", status: "Pending" },
      { id: "R3", cp: "NRI desk", buyer: "Sanjay Kapoor", phone: "+91 99300 41120", pref: "3 BR · corner", at: "Oct 2", status: "Approved", until: "Dec 31" },
    ],
    queue: [
      { token: "A-011", name: "Lauren & Ben Ortiz", pref: "3 BR · lake", cp: "Direct", eoi: 25000, status: "Booked", unit: "" },
      { token: "A-012", name: "Wei Zhang", pref: "1 BR", cp: "Keller CP", eoi: 10000, status: "No-show", unit: "" },
      { token: "A-013", name: "Hana Suzuki", pref: "2 BR · city", cp: "Direct", eoi: 15000, status: "Called", unit: "" },
      { token: "A-014", name: "Priya & Dev Raman", pref: "3 BR", cp: "NRI desk", eoi: 25000, status: "Waiting", unit: "" },
      { token: "A-015", name: "Carlos Mendes", pref: "2 BR · lake", cp: "Austin Home Finders", eoi: 15000, status: "Waiting", unit: "" },
      { token: "A-016", name: "Amelia Brooks", pref: "1 BR", cp: "Direct", eoi: 10000, status: "Waiting", unit: "" },
    ],
    demands: [], ids: 0,
  };
  // holds expire on a real clock; bookings carry a buyer name and plan
  const held = d.projUnits.filter(u => u.status === "Held");
  held.forEach((u, i) => { if (!u.holdUntil) { u.holdUntil = now + [4.2, 6.6, 29, 40, 52][i % 5] * H; u.holdFor = ["Ravi Iyer · Keller CP", "Sanjay Kapoor · NRI desk", "Hana Suzuki · direct", "Carlos Mendes · AHF", "Walk-in · direct"][i % 5]; } });
  const names = ["G. Patel", "The Hoangs", "M. Alvarez", "R. & T. Cohen", "S. Okoye", "J. Fischer", "L. Romero", "K. Dubois", "A. Haddad", "E. Larsen"];
  let k = 0;
  d.projUnits.forEach(u => { if ((u.status === "Booked" || u.status === "Sold") && !u.buyerName) { u.buyerName = names[k++ % names.length]; u.planId = u.planId || "clp"; } });
  const booked = d.projUnits.filter(u => u.status === "Booked");
  booked.slice(0, 6).forEach((u, i) => d.of.demands.push({ id: "DL" + (i + 1), unit: u.code, buyer: u.buyerName, milestone: "Foundation", pct: 10, amt: u.price * 0.1, due: ["Oct 1", "Oct 15", "Oct 15", "Oct 20", "Oct 20", "Oct 5"][i], status: ["Overdue", "Sent", "Draft", "Draft", "Paid", "Paid"][i] }));
  d.listings.forEach(l => { if (l.dist === undefined) l.dist = l.status === "Coming soon" ? "soon" : "public"; });
}

// ================= HELPERS =================
const OF_NOW = new Date(2026, 9, 8);
const OF_MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
// "Oct 9" -> Date in the demo year (Jan–Jun roll into 2027)
function ofDate(s) {
  const m = /([A-Z][a-z]{2})\w* (\d{1,2})/.exec(s || ""); if (!m) return null;
  const mi = OF_MON.indexOf(m[1]); if (mi < 0) return null;
  return new Date(mi < 6 ? 2027 : 2026, mi, +m[2]);
}
// lease ends are "Mar 27" = March 2027
function ofLease(s) { const m = /([A-Z][a-z]{2}) (\d{2})$/.exec(s || ""); if (!m) return null; return new Date(2000 + +m[2], OF_MON.indexOf(m[1]) + 1, 0); }
const ofDays = (s) => { const x = ofDate(s); return x ? Math.round((x - OF_NOW) / 864e5) : null; };
function ofRel(n) {
  if (n == null) return "";
  if (n === 0) return "today"; if (n === 1) return "tomorrow"; if (n === -1) return "yesterday";
  return n > 0 ? "in " + n + " days" : Math.abs(n) + " days ago";
}
function ofDue(n, done) {
  if (done) return html`<span class="pill g">Done</span>`;
  if (n == null) return "";
  const cls = n < 0 ? "r" : n <= 1 ? "r" : n <= 3 ? "a" : "";
  return html`<span class=${"pill of-due " + cls}>${n < 0 ? "Overdue · " + ofRel(n) : ofRel(n)}</span>`;
}
const ofFmt = (dt) => OF_MON[dt.getMonth()] + " " + dt.getDate();
const ofMe = () => (S.role && S.role.who) || "maya";
const ofFirst = (name) => (name || "").split(/[ &]/)[0];
const ofIni = (name) => (name || "?").split(/\s|&/).filter(Boolean).map(w => w[0]).slice(0, 2).join("").toUpperCase();
function ofNewId(prefix, arr, key = "id") { let n = arr.length + 1; while (arr.some(x => x[key] === prefix + n)) n++; return prefix + n; }
const ofDigits = (s) => String(s || "").replace(/\D/g, "").slice(-10);
const ofEmailOk = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s);
// seats that see everyone's work by default
const ofSeesAll = () => ["maya", "nina", "grace"].includes(ofMe());
function ofNotify(who, text, route) { try { window.notify && window.notify({ who, text, route, at: "now" }); } catch (e) {} }
function ofLog(pid, mod, text) { S.d.activity.push([pid, mod, text, "Oct 8"]); }
function ofThreadFor(pid) { return S.d.threads.find(t => t.person === pid); }
// write a message into a person's thread (creating one if needed), as the office
function ofSay(pid, text, ch, from = "me") {
  let t = ofThreadFor(pid);
  if (!t) { const p = P(pid); t = { id: ofNewId("T", S.d.threads), person: pid, channel: ch || "SMS", unread: 0, when: "now", subject: "Conversation", msgs: [], assignee: p ? p.owner : ofMe(), snooze: null, closed: false }; S.d.threads.push(t); }
  t.msgs.push({ from, text, at: "now", ch: ch || t.channel }); t.when = "now"; t.closed = false;
  return t;
}
const OF_CONS = { in: ["Opted in", "g"], out: ["Opted out", "r"], unknown: ["No consent yet", "a"] };
// channel -> consent key (portal/app channels are replies inside our own product: always allowed)
const ofConsKey = (ch) => ({ SMS: "SMS", WhatsApp: "WhatsApp", Email: "Email" }[ch] || null);
// people created by other modules may not carry consent yet: default it once, lazily
function ofCons(p) { if (p && !p.consent) p.consent = { SMS: "unknown", WhatsApp: "unknown", Email: p.email ? "in" : "unknown", note: "" }; return p && p.consent; }
const ofCan = (page) => typeof canSee === "function" ? canSee(page) : visible(page);
function ofCanSend(p, ch) { ofCons(p); const k = ofConsKey(ch); if (!k || !p.consent) return { ok: true }; const v = p.consent[k]; return v === "out" ? { ok: false, why: ofFirst(p.name) + " opted out of " + ch + (p.consent.note ? " · " + p.consent.note : "") } : { ok: true, warn: v === "unknown" ? "No recorded " + ch + " consent: one-to-one replies only, no automations" : "" }; }

// commission: TxApi when the back office module provides it; same fallback everywhere so numbers match
function ofComm(d) {
  const api = window.TxApi && window.TxApi.commission && (() => { try { return window.TxApi.commission(d.id); } catch (e) { return null; } })();
  if (api) return { ...api, src: "Back office" };
  const gross = d.price * d.comp / 100, own = d.agent === "maya", split = own ? 100 : 70;
  const brokerage = own ? 0 : gross * 0.3, fees = own ? [] : [["Transaction fee", 395]];
  return { gross, splitPct: split, brokerage, fees, net: gross - brokerage - fees.reduce((a, f) => a + f[1], 0), status: S.cda && S.cda[d.id] ? "Approved" : d.stage === "Closed" ? "Ready" : "Pending", capped: false, src: "Default plan" };
}
function ofEmd(d) {
  const api = window.TxApi && window.TxApi.emd && (() => { try { return window.TxApi.emd(d.id); } catch (e) { return null; } })();
  if (api) return api;
  const e = S.d.tx && S.d.tx.emd && S.d.tx.emd.find(x => x.deal === d.id);
  if (e) return { amount: e.amt, status: e.status, method: e.method, note: e.note };
  return d.stage === "Under contract" || d.stage === "Closed" ? { amount: d.price * 0.01, status: "Received", method: "Wire", note: "Lone Star Title · escrow" } : null;
}
function ofOffers(lid) {
  // the seller module owns offers; fall back to the raw seed only if it isn't loaded
  if (window.SlApi && window.SlApi.offers) { try { return window.SlApi.offers(lid) || []; } catch (e) { return []; } }
  const sl = S.d.sl && S.d.sl.lid === lid ? S.d.sl.offers.map(o => ({ ...o, cont: Array.isArray(o.cont) ? o.cont.join(", ") : o.cont, esc: o.esc ? usd(o.esc) : "—" })) : [];
  return [...sl, ...(S.d.offers || []).filter(o => o.l === lid)];
}
// a deal's next open date
function ofNext(d) { const o = (d.dates || []).filter(x => !x[2]).map(x => ({ label: x[0], on: x[1], n: ofDays(x[1]) })).filter(x => x.n != null).sort((a, b) => a.n - b.n); return o[0] || null; }
function ofMoveDeal(d, stage) {
  const p = P(d.person), l = L(d.listing), from = d.stage;
  if (from === stage) return;
  if (d.kind === "Buyer" && !d.agreement.signed && S.d.stages.indexOf(stage) > 0) { toast("Tours are blocked until " + ofFirst(p.name) + " signs a buyer agreement", ["Send agreement", () => openAgreement(p, d.listing, d)]); return false; }
  up(() => {
    d.stage = stage;
    if (stage === "Closed") { d.close = "Oct 8"; d.progress = 1; if (d.kind === "Buyer") { p.stage = "Homeowner"; if (!p.roles.includes("Homeowner")) p.roles.push("Homeowner"); } l.status = "Sold"; ofLog(p.id, "Deals", "Closed on " + l.addr + " · " + usd(d.price)); }
    else { if (p.stage !== "Homeowner" && p.stage !== "Tenant" && p.stage !== "Booked") p.stage = stage; ofLog(p.id, "Deals", "Deal moved from " + from + " to " + stage + " · " + l.addr); }
    if (stage === "Under contract" && l.status === "Active") l.status = "Under contract";
  });
  if (stage === "Under contract") ofNotify("nina", l.addr + " is under contract · open the file", "deal/" + d.id);
  if (stage === "Closed") ofNotify("grace", l.addr + " closed · commission ready for CDA", "backoffice");
  toast(stage === "Closed" ? "Closed! Commission sent to back office · " + p.short + " is now a homeowner on file" : l.addr + " moved to " + stage, stage === "Closed" ? ["Back office", () => go("backoffice")] : ["Open deal", () => go("deal/" + d.id)]);
  return true;
}
function ofUseNarrow(px = 760) {
  const q = "(max-width: " + px + "px)";
  const [n, setN] = useState(() => matchMedia(q).matches);
  useEffect(() => { const m = matchMedia(q), f = () => setN(m.matches); m.addEventListener("change", f); return () => m.removeEventListener("change", f); }, []);
  return n;
}
function ofUseTick(ms = 1000) { const [, setT] = useState(0); useEffect(() => { const i = setInterval(() => setT(t => t + 1), ms); return () => clearInterval(i); }, []); }
function ofLeft(ms) { if (ms <= 0) return "Expired"; const h = Math.floor(ms / 36e5), m = Math.floor(ms % 36e5 / 6e4), s = Math.floor(ms % 6e4 / 1e3); return h >= 1 ? h + "h " + String(m).padStart(2, "0") + "m" : m + "m " + String(s).padStart(2, "0") + "s"; }
const ofOpen = (kind, extra) => up(s => { s.modal = Object.assign({ kind }, extra || {}); });

// ================= SHARED UI =================
const OFI = {
  plus: "M12 5v14M5 12h14", x: "M6 6l12 12M18 6 6 18", back: "M15 18l-6-6 6-6", chev: "M9 18l6-6-6-6", left: "M15 18l-6-6 6-6", right: "M9 18l6-6-6-6",
  clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2", cal: "M4 6h16v15H4zM4 10h16M8 3v4M16 3v4", flag: "M5 21V4h11l-1 4 4 4H5",
  user: "M20 21a8 8 0 0 0-16 0M12 13a5 5 0 1 0 0-10 5 5 0 0 0 0 10", tag: "M3 12V3h9l9 9-9 9zM7.5 7.5h.01", note: "M5 3h10l4 4v14H5zM9 9h6M9 13h6M9 17h4",
  doc: "M7 3h7l5 5v13H7zM14 3v5h5M10 13h6M10 17h6", up: "M12 16V4M7 9l5-5 5 5M4 20h16", pen: "M4 20h4L19 9l-4-4L4 16zM14 6l4 4", mail: "M3 5h18v14H3zM3 6l9 7 9-7",
  snooze: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM9 9h6l-6 6h6", lock: "M6 11h12v10H6zM8 11V7a4 4 0 0 1 8 0v4", wrench: "M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4z",
  coin: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM15 9.5c-.5-1-1.6-1.5-3-1.5-1.7 0-3 .8-3 2s1.3 1.7 3 2 3 .8 3 2-1.3 2-3 2c-1.4 0-2.6-.6-3-1.6M12 6.5v11",
  key: "M15 7a4 4 0 1 1-3.9 4.9L3 20v-3h3v-3h3l1.1-1.1A4 4 0 0 1 15 7z", eye: "M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  grid: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z", rows: "M4 6h16M4 12h16M4 18h16", alert: "M12 3 2 20h20zM12 10v4M12 17h.01", star: "M12 3l2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3 6.5 20.2l1-6.2L3 9.6l6.2-.9z",
  shield: "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z", send: "M22 2 11 13M22 2l-7 20-4-9-9-4z", users: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
};
const OfI = ({ n, s = 15 }) => html`<${Ic} n=${OFI[n] || n} s=${s} />`;
const OfChip = ({ n, tone, s = 15 }) => html`<span class=${"of-chip " + (tone || "")}><${OfI} n=${n} s=${s} /></span>`;
function OfModal({ title, sub, close, children, foot, wide }) {
  const ref = useRef();
  useEffect(() => {
    // Esc, focus trap and focus return are handled globally by the shell (app.js)
    const f = ref.current && ref.current.querySelector(".bd input:not([type=checkbox]):not([type=file]), .bd select, .bd textarea");
    f && f.focus();
  }, []);
  return html`<div class="scrim" onClick=${e => { if (e.target === e.currentTarget) close(); }}><div class=${"modal of-modal" + (wide ? " of-wide" : "")} role="dialog" aria-modal="true" aria-label=${title} ref=${ref}>
    <div class="hd"><div class="of-mh"><h3>${title}</h3>${sub && html`<div class="muted of-msub">${sub}</div>`}</div><button class="btn sm ghost" aria-label="Close" title="Close (Esc)" onClick=${close}>✕</button></div>
    <div class="bd">${children}</div>${foot && html`<div class="ft">${foot}</div>`}</div></div>`;
}
function OfField({ label, err, hint, children, grow }) {
  return html`<label class=${"field of-f" + (err ? " bad" : "")} style=${grow ? "flex:1;min-width:0" : ""}><span>${label}</span>${children}${err ? html`<em class="of-err" role="alert">${err}</em>` : hint ? html`<em class="of-hint">${hint}</em>` : ""}</label>`;
}
function OfBack({ to, label }) { return html`<button class="of-crumb" onClick=${() => go(to)}><${OfI} n="back" s=${14} /> ${label}</button>`; }
function OfEmpty({ icon, title, sub, action }) { return html`<div class="of-empty"><${OfChip} n=${icon || "star"} s=${18} /><b>${title}</b>${sub && html`<span>${sub}</span>`}${action || ""}</div>`; }
function OfSeg({ value, set, opts, label }) { return html`<div class="of-seg" role="group" aria-label=${label || ""}>${opts.map(o => { const [k, v] = Array.isArray(o) ? o : [o, o]; return html`<button class=${value === k ? "on" : ""} aria-pressed=${value === k} onClick=${() => set(k)}>${v}</button>`; })}</div>`; }
// a clickable row that goes to a record
function OfRow({ lead, title, sub, right, onClick, tone }) {
  return html`<button class=${"of-row" + (tone ? " " + tone : "")} onClick=${onClick}>${lead}<div class="of-rt"><b>${title}</b>${sub && html`<span>${sub}</span>`}</div>${right ? html`<div class="of-rr">${right}</div>` : ""}<span class="of-go"><${OfI} n="chev" s=${14} /></span></button>`;
}
function OfCard({ title, icon, tone, count, action, children, cls }) {
  return html`<div class=${"card of-card " + (cls || "")}><div class="hd">${icon && html`<${OfChip} n=${icon} tone=${tone} s=${14} />`}<h3>${title}</h3>${count != null && html`<span class="of-count">${count}</span>`}<span class="sp"></span>${action || ""}</div>${children}</div>`;
}
const ofPeopleOpts = () => S.d.people.map(p => html`<option value=${p.id}>${p.name}</option>`);
const ofAgentOpts = (ids) => (ids || Object.keys(S.d.agents)).map(id => html`<option value=${id}>${A(id).name}</option>`);

// ================= TODAY =================
function OfTasks({ who, title = "My tasks", person, deal, compact }) {
  const [txt, setTxt] = useState(""), [due, setDue] = useState("Oct 8"), [err, setErr] = useState("");
  const all = S.d.of.tasks.filter(t => (who ? t.who === who : true) && (person ? t.person === person : true) && (deal ? t.deal === deal : true));
  const open = all.filter(t => !t.done).sort((a, b) => (ofDays(a.due) || 0) - (ofDays(b.due) || 0)), done = all.filter(t => t.done);
  const groups = [["Overdue", open.filter(t => ofDays(t.due) < 0)], ["Today", open.filter(t => ofDays(t.due) === 0)], ["Upcoming", open.filter(t => ofDays(t.due) > 0)]].filter(g => g[1].length);
  function add() {
    if (!txt.trim()) { setErr("Write what needs doing"); return; }
    up(() => { S.d.of.tasks.push({ id: ofNewId("K", S.d.of.tasks), t: txt.trim(), who: who || ofMe(), due, person: person || null, deal: deal || null, kind: "To-do", done: false }); });
    setTxt(""); setErr(""); toast("Task added for " + (due === "Oct 8" ? "today" : due));
  }
  function tick(t) { up(() => { t.done = !t.done; if (t.done && t.person) ofLog(t.person, "Tasks", "Done: " + t.t); }); if (t.done) toast("Done · " + t.t, ["Undo", () => up(() => { t.done = false; })]); }
  return html`<${OfCard} title=${title} icon="check" count=${open.length} cls="of-tasks">
    <div class="bd">
      ${groups.length ? groups.map(([g, ts]) => html`<div class="of-tg"><div class=${"lbl" + (g === "Overdue" ? " of-red" : "")}>${g}</div>${ts.map(t => html`<div class="of-task"><button class="of-tick" role="checkbox" aria-checked=${t.done} aria-label=${"Complete: " + t.t} onClick=${() => tick(t)}></button><div class="of-rt"><b>${t.t}</b><span>${t.kind} · ${ofRel(ofDays(t.due))}${t.person && !person ? html` · <a onClick=${() => go("person/" + t.person)}>${P(t.person).name}</a>` : ""}${!who ? " · " + A(t.who).name.split(" ")[0] : ""}</span></div></div>`)}</div>`)
        : html`<${OfEmpty} icon="check" title="Nothing due" sub="You're clear. Add a follow-up below." />`}
      ${!compact && done.length ? html`<details class="of-done"><summary>${done.length} completed</summary>${done.map(t => html`<div class="of-task ok"><button class="of-tick on" role="checkbox" aria-checked="true" aria-label=${"Reopen: " + t.t} onClick=${() => tick(t)}>✓</button><div class="of-rt"><b>${t.t}</b></div></div>`)}</details>` : ""}
      <div class="of-add"><input aria-label="New task" placeholder="Add a task…" value=${txt} onInput=${e => { setTxt(e.target.value); setErr(""); }} onKeyDown=${e => { if (e.key === "Enter") add(); }} />
        <select aria-label="Due" value=${due} onChange=${e => setDue(e.target.value)}><option value="Oct 8">Today</option><option value="Oct 9">Tomorrow</option><option value="Oct 12">Mon</option><option value="Oct 15">Next week</option></select>
        <button class="btn sm pri" onClick=${add}>Add</button></div>
      ${err && html`<em class="of-err">${err}</em>`}
    </div></${OfCard}>`;
}
function OfFeed({ items }) {
  return html`<${OfCard} title="Overnight, handled for you" icon="spark" action=${html`<span class="pill f">Assistant</span>`}>
    <div class="feed">${items.map(([t, a, b, to]) => html`<button class="it of-feedit" onClick=${() => go(to)}><span class="dot"></span><div style="flex:1;min-width:0"><div>${a}</div><div class="muted" style="font-size:12px">${b}</div></div><span class="muted num" style="font-size:12px">${t}</span></button>`)}</div></${OfCard}>`;
}
const ofDealRow = (d) => { const l = L(d.listing), p = P(d.person), nx = ofNext(d); return html`<${OfRow} lead=${html`<img class="thumb" src=${img(l.img)} alt="" />`} title=${l.addr} sub=${p.name + " · " + d.kind + " · " + usd(d.price)} right=${html`${stagePill(d.stage)}${nx ? html`<span class="of-sm">${nx.label} ${ofDue(nx.n)}</span>` : ""}`} onClick=${() => go("deal/" + d.id)} />`; };
const ofPersonRow = (p, right) => html`<${OfRow} lead=${html`<${PAv} p=${p} />`} title=${p.name} sub=${p.source + " · last touch " + p.last} right=${right} onClick=${() => go("person/" + p.id)} />`;

function ofTodayCfg(who) {
  const deals = S.d.deals, open = deals.filter(d => d.stage !== "Closed"), mine = (d) => d.agent === who;
  const myThreads = S.d.threads.filter(t => t.assignee === who), unread = myThreads.filter(t => t.unread).length;
  const tasks = S.d.of.tasks.filter(t => t.who === who && !t.done), overdue = tasks.filter(t => ofDays(t.due) < 0);
  const allDates = open.flatMap(d => (d.dates || []).filter(x => !x[2]).map(x => ({ d, label: x[0], on: x[1], n: ofDays(x[1]) }))).filter(x => x.n != null).sort((a, b) => a.n - b.n);
  const t1 = S.d.threads.find(t => t.id === "T1"), d5 = deals.find(d => d.id === "D5"), d1 = deals.find(d => d.id === "D1");
  const nxD1 = d1 && ofNext(d1);
  const closedQ = deals.filter(d => d.stage === "Closed");
  const feedAll = [
    ["9:41 pm", "Replied to Elena Ruiz (SMS) with live availability and booked a Saturday tour", "Sent · checked Jordan's calendar", "inbox/T1", ["maya", "jordan"]],
    ["11:05 pm", "Logged 3 calls from Jordan's phone to the Brooks file", "Auto-logged", "person/P1", ["maya", "jordan"]],
    ["6:30 am", "Sent the Grants a refreshed net sheet after a comparable sold at $1.16M", "Draft approved by Priya", "listing/L1", ["maya", "priya"]],
    ["6:10 am", "Answered the Nairs on WhatsApp in Hindi and English with the 2 BR price list", "Rohan to send the payment schedule", "inbox/T8", ["rohan"]],
    ["8:12 am", "Triaged a leak report in Eastside Lofts 3B as urgent", "Waiting for you to dispatch", "rentals/M1", ["maya", "leo"]],
  ].filter(f => f[4].includes(who));
  const feed = feedAll.length ? html`<${OfFeed} items=${feedAll} />` : "";
  const step = (ic, t, s, to, tone) => ({ ic, t, s, go: to, tone });
  const taskStep = overdue.length ? step("check", overdue.length + " overdue task" + (overdue.length > 1 ? "s" : ""), overdue[0].t, overdue[0].person ? "person/" + overdue[0].person : "today", "r") : null;

  if (who === "jordan") {
    const myP = S.d.people.filter(p => (p.owner === who || myThreads.some(t => t.person === p.id)) && ["New lead", "Touring", "Offer", "Nurture"].includes(p.stage));
    const hot = myP.slice().sort((a, b) => b.score - a.score);
    const tours = S.d.of.tours.filter(t => t.agent === who), toursToday = tours.filter(t => t.day === "Today");
    const myDeals = open.filter(mine);
    const take = myDeals.reduce((a, d) => a + ofComm(d).net, 0);
    const wk = allDates.filter(x => mine(x.d) && x.n <= 7).length;
    return {
      line: hot.length + " active leads, " + toursToday.length + " tours today and " + wk + " deadline" + (wk === 1 ? "" : "s") + " this week.",
      steps: [
        d5 && !d5.agreement.signed && step("inbox", "Elena wants to tour 4 Willow Bend", "Saturday 1:00 is held · she still needs the buyer agreement", "inbox/T1", "a"),
        nxD1 && step("pipeline", nxD1.label + " " + ofRel(nxD1.n), "515 Ridgeview · Brooks want a $4,500 AC credit", "deal/D1", nxD1.n <= 1 ? "r" : ""),
        toursToday[0] && step("people", "Touring with " + P(toursToday[0].person).name + " at " + toursToday[0].at, toursToday.map(t => L(t.listing).addr).join(" → "), "person/" + toursToday[0].person),
        taskStep,
        S.d.threads.find(t => t.id === "T2" && t.unread) && step("inbox", "Brooks asked about the AC", "WhatsApp · inspection on 515 Ridgeview", "inbox/T2"),
      ].filter(Boolean).slice(0, 4),
      kpis: [["My active deals", myDeals.length, "pipeline"], ["Tours today", toursToday.length, "people"], ["Unread conversations", unread, "inbox"], ["Projected take-home", short(take), "pipeline", "after split & fees"]],
      main: html`<div class="of-col">
        <${OfCard} title="Hot leads" icon="star" tone="br" count=${hot.length} action=${html`<button class="btn sm" onClick=${() => go("people")}>All people</button>`}>
          <div class="of-rows">${hot.length ? hot.map(p => ofPersonRow(p, html`<span class=${"of-score" + (p.score >= 75 ? " hot" : "")}>${p.score || "—"}</span>${stagePill(p.stage)}`)) : html`<${OfEmpty} title="No active leads" />`}</div></${OfCard}>
        <${OfCard} title="My buyer deals" icon="pipeline" count=${myDeals.length} action=${html`<button class="btn sm" onClick=${() => go("pipeline")}>Board</button>`}>
          <div class="of-rows">${myDeals.length ? myDeals.map(ofDealRow) : html`<${OfEmpty} title="No open deals" />`}</div></${OfCard}>
      </div>`,
      side: html`<div class="of-col"><${OfTours} tours=${tours} /><${OfWebLeads} who=${who} />${feed}<${OfTasks} who=${who} compact /></div>`,
    };
  }
  if (who === "priya") {
    const ls = S.d.listings.filter(l => l.agent === who), act = ls.filter(l => l.status === "Active" || l.status === "Coming soon");
    const sh = (S.d.sl && S.d.sl.showings) || [], upc = sh.filter(s => s.status !== "Done" && s.d >= 0), req = sh.filter(s => s.status === "Requested");
    const offers = ofOffers("L1"), d2 = deals.find(d => d.id === "D2"), od = d2 && ofNext(d2);
    const avgDom = Math.round(act.reduce((a, l) => a + l.dom, 0) / (act.length || 1));
    const t6 = S.d.threads.find(t => t.id === "T6");
    return {
      line: act.length + " listings live or launching, " + upc.length + " showings booked and " + offers.length + " offers on 4 Willow Bend.",
      steps: [
        od && step("listings", od.label + " " + ofRel(od.n), offers.length + " offers on 4 Willow Bend · compare nets", "listing/L1", od.n <= 2 ? "a" : ""),
        req.length && step("cal", req.length + " showing requests to confirm", req.map(s => s.firm + " " + s.day.replace("Today", "today")).slice(0, 2).join(" · "), EXT.some(x => x.pages && x.pages.listingops) ? "listingops" : "listing/L1"),
        t6 && t6.unread && step("inbox", "Olivia wants to delay the Kinney launch", "Email · and asked us to stop texting her", "inbox/T6", "a"),
        step("listings", "1806 Kinney is coming soon", "Photos due Fri · description draft ready to edit", "listing/L4"),
        taskStep,
      ].filter(Boolean).slice(0, 4),
      kpis: [["My active listings", act.length, "listings"], ["Showings booked", upc.length, EXT.some(x => x.pages && x.pages.listingops) ? "listingops" : "listings"], ["Offers in", offers.length, "listing/L1"], ["Avg days on market", avgDom, "listings"]],
      main: html`<div class="of-col">
        <${OfCard} title="My listings" icon="listings" count=${ls.length} action=${html`<button class="btn sm" onClick=${() => go("listings")}>All listings</button>`}>
          <div class="of-rows">${ls.map(l => html`<${OfRow} lead=${html`<img class="thumb" src=${img(l.img)} alt="" />`} title=${l.addr} sub=${usd(l.price) + " · " + l.dom + " days · " + l.views + " views"} right=${html`<span class=${"pill " + ({ Active: "g", "Coming soon": "br", "Under contract": "f", Sold: "" }[l.status] || "")}>${l.status}</span>${ofOffers(l.id).length ? html`<span class="of-sm">${ofOffers(l.id).length} offers</span>` : ""}`} onClick=${() => go("listing/" + l.id)} />`)}</div></${OfCard}>
        <${OfCard} title="Offers on 4 Willow Bend" icon="coin" tone="br" count=${offers.length} action=${html`<button class="btn sm pri" onClick=${() => ofOpen("offers", { l: "L1" })}>Compare side by side</button>`}>
          <div class="of-rows">${offers.map(o => html`<${OfRow} lead=${html`<span class="av" style="background:#8C5A2B">${ofIni(o.buyer)}</span>`} title=${o.buyer} sub=${o.agent + " · " + o.fin} right=${html`<b class="num">${usd(o.price)}</b>`} onClick=${() => ofOpen("offers", { l: "L1" })} />`)}</div></${OfCard}>
      </div>`,
      side: html`<div class="of-col">
        <${OfCard} title="Showings" icon="cal" count=${upc.length}><div class="of-rows">${upc.length ? upc.map(s => html`<${OfRow} lead=${html`<span class="of-time">${s.time.replace(" ", "")}</span>`} title=${s.firm + " · " + s.type} sub=${s.day + " · 4 Willow Bend" + (s.conflict ? " · " + s.conflict : "")} right=${html`<span class=${"pill " + (s.status === "Confirmed" ? "g" : "a")}>${s.status}</span>`} onClick=${() => go(EXT.some(x => x.pages && x.pages.listingops) ? "listingops" : "listing/L1")} />`) : html`<${OfEmpty} title="No showings booked" />`}</div></${OfCard}>
        <${OfWebLeads} who=${who} />${feed}<${OfTasks} who=${who} compact /></div>`,
    };
  }
  if (who === "nina") {
    const files = open.filter(d => d.stage === "Under contract" || d.stage === "Offer");
    const docsOut = files.reduce((a, d) => a + (d.docs || []).filter(x => x[1] === "Draft" || x[1] === "Sent" || x[1] === "Sent for signature").length, 0);
    const missing = files.reduce((a, d) => a + (d.checklist || []).filter(c => !c[1]).length, 0);
    const wk = allDates.filter(x => x.n <= 7);
    const comp = EXT.some(x => x.pages && x.pages.compliance);
    return {
      line: wk.length + " deadlines in the next 7 days across " + files.length + " open files. " + (docsOut ? docsOut + " documents still need signatures." : "Every document is signed."),
      steps: [...allDates.slice(0, 2).map(x => step("cal", x.label + " " + ofRel(x.n), L(x.d.listing).addr + " · " + P(x.d.person).name, "deal/" + x.d.id, x.n <= 1 ? "r" : x.n <= 3 ? "a" : "")),
        docsOut && step("doc", docsOut + " document" + (docsOut > 1 ? "s" : "") + " awaiting signature", "Send reminders from the deal file", "deal/" + (files.find(d => (d.docs || []).some(x => x[1] === "Draft")) || files[0]).id),
        comp && step("shield", "Broker review queue", "Files waiting on compliance", "compliance"), taskStep].filter(Boolean).slice(0, 4),
      kpis: [["Open files", files.length, "pipeline"], ["Deadlines · 7 days", wk.length, "pipeline"], ["Docs to sign", docsOut, "pipeline"], ["Checklist gaps", missing, "pipeline"]],
      main: html`<div class="of-col">
        <${OfCard} title="Deadlines" icon="clock" tone="r" count=${allDates.length}><div class="of-rows">${allDates.length ? allDates.map(x => html`<${OfRow} lead=${html`<span class="of-date"><b>${x.on.split(" ")[1]}</b>${x.on.split(" ")[0]}</span>`} title=${x.label} sub=${L(x.d.listing).addr + " · " + P(x.d.person).name} right=${ofDue(x.n)} onClick=${() => go("deal/" + x.d.id)} />`) : html`<${OfEmpty} title="No open deadlines" />`}</div></${OfCard}>
        <${OfCard} title="Files to review" icon="doc" count=${files.length}><div class="of-rows">${files.map(d => { const c = d.checklist || [], ok = c.filter(x => x[1]).length; return html`<${OfRow} lead=${html`<img class="thumb" src=${img(L(d.listing).img)} alt="" />`} title=${L(d.listing).addr} sub=${d.kind + " · " + A(d.agent).name + " · " + (c.length ? ok + "/" + c.length + " checklist" : "checklist not started")} right=${html`<div class="bar of-mini"><i style=${"width:" + (c.length ? ok / c.length * 100 : 0) + "%"}></i></div>${comp ? html`<span class="of-sm">Review →</span>` : ""}`} onClick=${() => go(comp ? "compliance/" + d.id : "deal/" + d.id)} />`; })}</div></${OfCard}>
      </div>`,
      side: html`<div class="of-col"><${OfTasks} who=${who} /></div>`,
    };
  }
  if (who === "grace") {
    const closed = deals.filter(d => d.stage === "Closed"), pending = closed.filter(d => !/approved|paid|processed/i.test(ofComm(d).status || ""));
    const tx = S.d.tx, rec = tx && tx.recon, variance = rec ? rec.bank - rec.book : 0, emdV = tx ? tx.emd.filter(e => e.status === "Verify") : [];
    const ytd = tx ? tx.stubs.reduce((a, s) => a + s.net, 0) : closed.reduce((a, d) => a + ofComm(d).net, 0);
    const hasTx = EXT.some(x => x.pages && x.pages.commissions);
    return {
      line: pending.length + " payout" + (pending.length === 1 ? "" : "s") + " to approve" + (rec ? ", " + rec.month + " reconciliation " + (rec.signed.broker ? "filed" : "open") : "") + (emdV.length ? " and " + emdV.length + " earnest-money wire to verify." : "."),
      steps: [pending.length && step("coin", pending.length + " commission payouts ready", "CDAs from " + pending.map(d => L(d.listing).addr).join(", "), "backoffice"),
        emdV.length && step("shield", "Verify a wire before crediting it", usd(emdV[0].amt) + " · " + L(deals.find(d => d.id === emdV[0].deal).listing).addr, "trust", "a"),
        rec && !rec.signed.broker && step("doc", rec.month + " three-way reconciliation", "Bank " + usd(rec.bank) + " vs book " + usd(rec.book), "trust"), taskStep].filter(Boolean),
      kpis: [["Payouts to approve", pending.length, "backoffice"], ["Paid to agents YTD", short(ytd), hasTx ? "commissions" : "backoffice"], ["Trust variance", rec ? usd(Math.abs(variance)) : "$0", hasTx ? "trust" : "backoffice"], ["Wires to verify", emdV.length, hasTx ? "trust" : "backoffice"]],
      main: html`<div class="of-col"><${OfCard} title="Payouts" icon="coin" tone="br" count=${closed.length}><div class="of-rows">${closed.map(d => { const c = ofComm(d); return html`<${OfRow} lead=${html`<${Av} a=${A(d.agent)} />`} title=${L(d.listing).addr} sub=${A(d.agent).name + " · gross " + usd(c.gross) + " · " + c.splitPct + "/" + (100 - c.splitPct)} right=${html`<b class="num">${usd(c.net)}</b><span class=${"pill " + (/approved|paid|processed/i.test(c.status) ? "g" : "a")}>${c.status}</span>`} onClick=${() => go("backoffice")} />`; })}</div></${OfCard}>
        ${emdV.length || (tx && tx.emd.length) ? html`<${OfCard} title="Earnest money" icon="shield" count=${tx.emd.length}><div class="of-rows">${tx.emd.map(e => { const d = deals.find(x => x.id === e.deal); return html`<${OfRow} lead=${html`<${OfChip} n="coin" tone=${e.status === "Verify" ? "a" : ""} />`} title=${usd(e.amt) + " · " + (d ? L(d.listing).addr : "")} sub=${e.method + " · " + e.note} right=${html`<span class=${"pill " + (e.status === "Verify" ? "a" : e.status === "Received" ? "g" : "")}>${e.status}</span>`} onClick=${() => go(hasTx ? "trust" : "backoffice")} />`; })}</div></${OfCard}>` : ""}</div>`,
      side: html`<div class="of-col">${rec ? html`<${OfCard} title=${"Reconciliation · " + rec.month} icon="shield"><div class="bd sheet"><div class="ln"><span>Bank statement</span><span>${usd(rec.bank)}</span></div><div class="ln"><span>Book balance</span><span>${usd(rec.book)}</span></div><div class="ln tot"><span>Variance</span><span>${usd(variance)}</span></div><div class="row" style="margin-top:10px"><span class="muted" style="font-size:12px;flex:1">${rec.items.length - Object.keys(rec.done || {}).length} items to match · ${rec.signed.broker ? "filed" : "needs broker sign-off"}</span><button class="btn sm pri" onClick=${() => go(hasTx ? "trust" : "backoffice")}>Reconcile</button></div></div></${OfCard}>` : ""}<${OfTasks} who=${who} /></div>`,
    };
  }
  if (who === "leo") {
    const units = S.d.units, late = units.filter(u => u.status === "Late"), vac = units.filter(u => u.status === "Vacant");
    const due = units.filter(u => u.tenant).reduce((a, u) => a + u.rent, 0), got = units.filter(u => u.status === "Paid" || u.status === "Renewal").reduce((a, u) => a + u.rent, 0);
    const tks = S.d.tickets.filter(t => t.status !== "Done").sort((a, b) => ["Urgent", "High", "Normal"].indexOf(a.priority) - ["Urgent", "High", "Normal"].indexOf(b.priority));
    const ren = ofRenewals();
    const bn = (u) => S.d.buildings.find(b => b.id === u.b).name;
    return {
      line: "Collected " + usd(got) + " of " + usd(due) + " October rent. " + tks.length + " open work orders, " + ren.length + " leases up for renewal.",
      steps: [...tks.filter(t => t.status === "New").slice(0, 1).map(t => step("wrench", (t.priority === "Urgent" ? "Urgent: " : "") + t.title, bn(units.find(u => u.id === t.unit)) + " · " + units.find(u => u.id === t.unit).name + " · needs a vendor", "rentals/" + t.id, t.priority === "Urgent" ? "r" : "")),
        late.length && step("coin", late.length + " units late on rent", late.map(u => u.name + " " + u.tenant.split(" ")[0]).join(" · "), "rentals/late", "a"),
        tks.find(t => t.status === "Awaiting owner") && step("users", "Owner approval pending", tks.find(t => t.status === "Awaiting owner").title, "rentals/" + tks.find(t => t.status === "Awaiting owner").id),
        ren.length && step("key", ren.length + " renewals to send", ren.slice(0, 2).map(u => u.name + " · " + u.end).join(" · "), "rentals/renewals"), taskStep].filter(Boolean).slice(0, 4),
      kpis: [["Collected · Oct", usd(got), "rentals", "of " + usd(due)], ["Late", late.length + " units", "rentals/late"], ["Open work orders", tks.length, "rentals/maintenance"], ["Vacant", vac.length + " units", "rentals/vacant"]],
      main: html`<div class="of-col">
        <${OfCard} title="Work orders" icon="wrench" tone="r" count=${tks.length}><div class="of-rows">${tks.map(t => { const u = units.find(x => x.id === t.unit); return html`<${OfRow} lead=${html`<${OfChip} n="wrench" tone=${t.priority === "Urgent" ? "r" : t.priority === "High" ? "a" : ""} />`} title=${t.title} sub=${bn(u) + " · " + u.name + " · " + (t.vendor || "no vendor yet")} right=${html`<span class=${"pill " + (t.status === "New" ? "b" : t.status === "Awaiting owner" ? "a" : "")}>${t.status}</span>`} onClick=${() => go("rentals/" + t.id)} />`; })}</div></${OfCard}>
        <${OfCard} title="Late rent" icon="coin" tone="a" count=${late.length}><div class="of-rows">${late.length ? late.map(u => html`<${OfRow} lead=${html`<span class="av" style="background:#B5533C">${ofIni(u.tenant)}</span>`} title=${u.tenant + " · " + bn(u) + " · " + u.name} sub=${"Lease ends " + u.end} right=${html`<b class="num">${usd(u.rent)}</b>`} onClick=${() => go("rentals/" + u.id)} />`) : html`<${OfEmpty} icon="check" title="Everyone has paid" />`}</div></${OfCard}>
      </div>`,
      side: html`<div class="of-col"><${OfCard} title="Renewals" icon="key" count=${ren.length}><div class="of-rows">${ren.length ? ren.map(u => html`<${OfRow} lead=${html`<span class="of-date"><b>${u.end.split(" ")[0]}</b>'${u.end.split(" ")[1]}</span>`} title=${u.tenant + " · " + u.name} sub=${bn(u) + " · " + usd(u.rent) + "/mo"} right=${u.renewal ? html`<span class="pill g">${u.renewal.status}</span>` : html`<span class="pill a">To send</span>`} onClick=${() => go("rentals/renewals")} />`) : html`<${OfEmpty} title="No renewals due" />`}</div></${OfCard}>${feed}<${OfTasks} who=${who} compact /></div>`,
    };
  }
  if (who === "rohan") {
    ofNormHolds();
    const pu = S.d.projUnits, now = Date.now();
    const holds = pu.filter(u => u.status === "Held").sort((a, b) => a.holdUntil - b.holdUntil), soon = holds.filter(u => u.holdUntil - now < 12 * 36e5);
    const sold = pu.filter(u => u.status === "Sold" || u.status === "Booked").length, avail = pu.filter(u => u.status === "Available").length;
    const regs = S.d.of.cpRegs.filter(r => r.status === "Pending"), od = S.d.of.demands.filter(x => x.status === "Overdue");
    const recent = pu.filter(u => u.status === "Booked").slice(-4).reverse();
    return {
      line: sold + " of 48 units sold or booked. " + soon.length + " holds expire in the next 12 hours" + (regs.length ? " and " + regs.length + " broker registrations need a decision." : "."),
      steps: [soon[0] && step("clock", soon.length + " holds expiring", "Unit " + soon.map(u => u.code).join(", ") + " · convert or release", "projects/" + soon[0].code, "r"),
        S.d.threads.find(t => t.id === "T8" && t.unread) && step("inbox", "The Nairs want a lake-side 2 BR", "WhatsApp from Mumbai · send the payment schedule", "inbox/T8", "a"),
        regs.length && step("users", regs.length + " broker registrations to review", regs.map(r => r.buyer + " · " + r.cp).join(" · "), "projects/partners"),
        od.length && step("coin", od.length + " demand letter overdue", od.map(x => "Unit " + x.unit + " · " + usd(x.amt)).join(" · "), "projects/collections", "a"), taskStep].filter(Boolean).slice(0, 4),
      kpis: [["Sold or booked", sold + " / 48", "projects"], ["Available", avail, "projects"], ["Holds < 12h", soon.length, "projects/holds"], ["Collections overdue", usd(od.reduce((a, x) => a + x.amt, 0)), "projects/collections"]],
      main: html`<div class="of-col"><${OfHoldList} holds=${holds} />
        <${OfCard} title="Latest bookings" icon="key" count=${recent.length}><div class="of-rows">${recent.map(u => html`<${OfRow} lead=${html`<span class="of-unit Booked">${u.code}</span>`} title=${u.buyerName + " · " + u.type} sub=${(S.d.of.payPlans[u.planId] || S.d.of.payPlans.clp).name + " · " + (u.cp || "Direct")} right=${html`<b class="num">${usd(u.price)}</b>`} onClick=${() => go("projects/" + u.code)} />`)}</div></${OfCard}></div>`,
      side: html`<div class="of-col"><${OfCard} title="Broker registrations" icon="users" count=${regs.length} action=${html`<button class="btn sm" onClick=${() => go("projects/partners")}>Open</button>`}><div class="of-rows">${regs.length ? regs.map(r => html`<${OfRow} lead=${html`<span class="av" style="background:#4A4F8C">${ofIni(r.buyer)}</span>`} title=${r.buyer} sub=${r.cp + " · " + r.pref + " · " + r.at} right=${html`<span class="pill a">Pending</span>`} onClick=${() => go("projects/partners")} />`) : html`<${OfEmpty} icon="check" title="All registrations decided" />`}</div></${OfCard}><${OfInterests} />${feed}<${OfTasks} who=${who} compact /></div>`,
    };
  }
  // Maya (broker-owner) and anyone else: the whole brokerage
  const pipeVal = open.reduce((a, d) => a + d.price, 0);
  const approvals = [
    ...closedQ.filter(d => !/approved|paid|processed/i.test(ofComm(d).status || "")).map(d => ({ ic: "coin", t: "Approve CDA · " + L(d.listing).addr, s: A(d.agent).name + " · agent nets " + usd(ofComm(d).net), to: "backoffice" })),
    ...((S.d.slPrice || []).filter(x => x.status === "Pending").map(x => ({ ic: "listings", t: "Price change · " + L(x.l).addr, s: usd(x.from) + " → " + usd(x.to) + " · " + x.by, to: "listing/" + x.l }))),
    ...open.filter(d => (d.docs || []).some(x => x[1] === "Draft")).map(d => ({ ic: "doc", t: "Unsigned draft · " + L(d.listing).addr, s: (d.docs.find(x => x[1] === "Draft") || [])[0], to: "deal/" + d.id })),
    ...S.d.of.cpRegs.filter(r => r.status === "Pending" && ofCpConflict(r)).map(r => ({ ic: "users", t: "Broker conflict · " + r.buyer, s: r.cp + " vs existing client", to: "projects/partners" })),
  ];
  const team = Object.values(S.d.agents);
  const vis = (m) => visible(m);
  return {
    line: open.length + " deals in motion worth " + short(pipeVal) + ". " + approvals.length + " approvals are waiting on you.",
    steps: [
      vis("inbox") && d5 && !d5.agreement.signed && step("inbox", "Elena asked for a tour at 9:41 pm", "The assistant held Sat 1:00 · she needs the buyer agreement", "inbox/T1"),
      vis("pipeline") && nxD1 && step("pipeline", nxD1.label + " " + ofRel(nxD1.n), "515 Ridgeview · Brooks want an AC credit", "deal/D1", nxD1.n <= 1 ? "r" : ""),
      vis("listings") && step("listings", "Offers due Friday on 4 Willow Bend", ofOffers("L1").length + " offers in · net sheet ready", "listing/L1"),
      vis("rentals") && S.d.tickets.find(t => t.id === "M1" && t.status === "New") && step("rentals", "Urgent: leak in Eastside Lofts 3B", "AI triage suggests Ace Plumbing, on call today", "rentals/M1", "r"),
      vis("projects") && step("projects", S.d.projUnits.filter(u => u.status === "Available").length + " units left at The Linden", S.d.projUnits.filter(u => u.status === "Held" && u.holdUntil - Date.now() < 12 * 36e5).length + " holds expire tonight", "projects/holds"),
      vis("backoffice") && approvals.length && step("backoffice", approvals.length + " approvals waiting", approvals[0].t, approvals[0].to, "a"),
    ].filter(Boolean).slice(0, 4),
    kpis: [["Pipeline value", short(pipeVal), "pipeline"], ["Active deals", open.length, "pipeline"], ["Closed this quarter", short(closedQ.reduce((a, d) => a + d.price, 0)), "pipeline", closedQ.length + " sides"], ["Approvals waiting", approvals.length, "backoffice"]],
    main: html`<div class="of-col">
      <${OfCard} title="Approvals" icon="shield" tone="br" count=${approvals.length}><div class="of-rows">${approvals.length ? approvals.map(a => html`<${OfRow} lead=${html`<${OfChip} n=${a.ic} />`} title=${a.t} sub=${a.s} right=${html`<span class="of-sm">Review</span>`} onClick=${() => go(a.to)} />`) : html`<${OfEmpty} icon="check" title="Nothing waiting on you" />`}</div></${OfCard}>
      <${OfWebLeads} who=${null} />${feed}</div>`,
    side: html`<div class="of-col"><${OfCard} title="Team today" icon="users"><div class="of-rows">${team.map(a => { const od = open.filter(d => d.agent === a.id).length, ur = S.d.threads.filter(t => t.assignee === a.id && t.unread).length, tt = S.d.of.tours.filter(t => t.agent === a.id && t.day === "Today").length; return html`<${OfRow} lead=${html`<${Av} a=${a} />`} title=${a.name} sub=${a.role} right=${html`<span class="of-sm">${[od && od + " deals", tt && tt + " tours", ur && ur + " unread"].filter(Boolean).join(" · ") || "—"}</span>`} onClick=${() => { S.ofAgent = a.id; go("pipeline"); }} />`; })}</div></${OfCard}>
      <${OfTasks} who=${who} compact /></div>`,
  };
}
function OfTours({ tours }) {
  return html`<${OfCard} title="Tours" icon="key" count=${tours.filter(t => t.status !== "Done").length}><div class="of-rows">${tours.length ? tours.map(t => { const l = L(t.listing), p = P(t.person); return html`<div class="of-tour"><span class="of-time">${t.at.replace(" ", "")}<small>${t.day}</small></span><div class="of-rt"><b><a onClick=${() => go("person/" + p.id)}>${p.name}</a></b><span><a onClick=${() => go("listing/" + l.id)}>${l.addr}</a> · ${t.mode}</span></div>
    ${t.status === "Done" ? html`<span class="pill g">Done</span>` : t.status === "Agreement needed" ? html`<button class="btn sm" onClick=${() => { const d = S.d.deals.find(x => x.person === p.id && x.listing === l.id) || S.d.deals.find(x => x.person === p.id); openAgreement(p, l.id, d); }}>Send agreement</button>` : html`<button class="btn sm" onClick=${() => { up(() => { t.status = "Done"; ofLog(p.id, "Tours", "Toured " + l.addr + " with " + A(t.agent).name); }); toast("Tour logged on " + ofFirst(p.name) + "'s timeline", ["Add feedback", () => go("person/" + p.id)]); }}>Mark toured</button>`}</div>`; }) : html`<${OfEmpty} title="No tours booked" />`}</div></${OfCard}>`;
}
function OfHoldList({ holds }) {
  ofUseTick(1000);
  const now = Date.now();
  return html`<${OfCard} title="Holds expiring" icon="clock" tone="r" count=${holds.length}><div class="of-rows">${holds.length ? holds.map(u => { const left = u.holdUntil - now; return html`<${OfRow} lead=${html`<span class="of-unit Held">${u.code}</span>`} title=${u.holdFor || "Hold"} sub=${u.type + " · " + u.facing + " · " + usd(u.price)} right=${html`<span class=${"of-timer" + (left < 6 * 36e5 ? " hot" : "")}>${ofLeft(left)}</span>`} onClick=${() => go("projects/" + u.code)} />`; }) : html`<${OfEmpty} title="No units on hold" />`}</div></${OfCard}>`;
}
function Today() {
  const who = ofMe(), cfg = ofTodayCfg(who);
  return html`<${Shell} title="Today" sub=${S.d.today + " · " + me().role}>
    <div class="page of-today">
      <div class="hello"><h2>Good morning, ${ofFirst(me().name)}.</h2><p>${cfg.line}</p></div>
      ${cfg.steps.length ? html`<div class="steps of-steps">${cfg.steps.map(s => html`<button class=${"step " + (s.tone ? "of-t-" + s.tone : "")} onClick=${() => go(s.go)}><span class="ic"><${OfI} n=${OFI[s.ic] ? s.ic : I[s.ic] ? s.ic : "star"} /></span><b>${s.t}</b><span>${s.s}</span><em class="of-open">Open <${OfI} n="chev" s=${12} /></em></button>`)}</div>` : ""}
      <div class="kpis of-kpis">${cfg.kpis.map(([k, v, to, sub]) => html`<button class="kpi" onClick=${() => go(to)}><span>${k}</span><b class="num">${v}</b>${sub ? html`<small class="muted">${sub}</small>` : ""}</button>`)}</div>
      <div class="split of-split">${cfg.main}${cfg.side}</div>
    </div></${Shell}>`;
}

// ================= INBOX =================
const OF_TPL = [
  ["Tour confirmation", "Hi {first}, you're confirmed for {listing} at {time}. I'll meet you out front. Reply here if anything changes. – {agent}"],
  ["Agreement reminder", "Hi {first}, quick reminder: Texas asks buyers to sign a short buyer agreement before we tour. Here's the link; it takes about a minute on your phone."],
  ["Check-in", "Hi {first}, just checking in. Anything you'd like me to look into this week? – {agent}"],
  ["Showing feedback", "Thanks for touring {listing}, {first}! What did you think of the layout and the price?"],
  ["Maintenance update", "Hi {first}, a technician is booked for your request. You'll get a text when they're on the way."],
];
const OF_DRAFTS = {
  T1: "Here's the buyer agreement for Saturday's tour: it takes a minute to sign on your phone. You can set the agent pay you're comfortable with; 2.5% is typical here. See you at 1:00!",
  T2: "Good catch. A 14-year-old condenser is near end of life, so I'd ask for a $4,500 credit at closing instead of a repair: it's cleaner and the seller avoids scheduling work. I'll draft the amendment now and send it for your signatures.",
  T3: "Hi Rachel, Tom: at $1,149,000 you'd net about $467,200 after your payoff, commissions and closing costs. I've shared the live net sheet; drag the price to see other scenarios.",
  T4: "Friday works. I've booked video tours of 2210 Barton Hills (11:00) and 1806 Kinney Ave (11:45). Links will arrive by text.",
  T5: "Thanks Hannah, sorry about this! Please turn the valve under the sink to the right to stop the water. A plumber from Ace Plumbing is booked for today between 12 and 2 pm.",
  T6: "Hi Olivia, absolutely: we'll keep 1806 Kinney as coming soon and go live on the MLS the Monday after Thanksgiving. I've also switched you to email only. I'll send the launch plan by Friday.",
  T7: "Hi Kenji, the sellers came back at $618,000. Since $612k is your ceiling, I'd suggest we counter at $611,500 with a 7-day close-ready inspection. Want me to send it?",
  T8: "Namaste Arjun and Meera! Unit 603 (2 BR, lake side, 6th floor) is open. The construction-linked plan is 10% at booking, then 10/15/15/20/30% at each milestone. Shall I hold it for 48 hours while you review?",
};
const OF_CH = ["All channels", "SMS", "WhatsApp", "Email", "Portal"];
const ofPortalCh = (c) => !["SMS", "WhatsApp", "Email"].includes(c);
function ofMerge(text, t, p) {
  const d = S.d.deals.find(x => x.person === p.id && x.stage !== "Closed"), l = d ? L(d.listing) : null, tour = S.d.of.tours.find(x => x.person === p.id && x.status !== "Done");
  return text.replace(/\{first\}/g, ofFirst(p.name)).replace(/\{agent\}/g, me().name.split(" ")[0]).replace(/\{listing\}/g, l ? l.addr : "the home").replace(/\{time\}/g, tour ? tour.day.replace("Today", "today") + " at " + tour.at : "our tour time");
}
function Inbox() {
  const narrow = ofUseNarrow(760);
  const who = ofMe(), mineDefault = !ofSeesAll() && S.d.threads.some(t => t.assignee === who);
  const [box, setBox] = useState(S["ofBox_" + who] || (mineDefault ? "mine" : "all")), [ch, setCh] = useState("All channels"), [q, setQ] = useState("");
  const setBoxP = (v) => { S["ofBox_" + who] = v; setBox(v); };
  const list = S.d.threads.filter(t => {
    if (box === "mine" && t.assignee !== who) return false;
    if (box === "unread" && !t.unread) return false;
    if (box === "snoozed") return !!t.snooze;
    if (box === "closed") return t.closed;
    if (t.closed || t.snooze) return false;
    if (ch !== "All channels" && (ch === "Portal" ? !ofPortalCh(t.channel) : t.channel !== ch)) return false;
    if (q) { const p = P(t.person), s = (p.name + " " + t.subject + " " + t.msgs.map(m => m.text).join(" ")).toLowerCase(); if (!s.includes(q.toLowerCase())) return false; }
    return true;
  });
  const routeId = S.route.id, t = S.d.threads.find(x => x.id === routeId) || (!narrow && list[0]) || null;
  const counts = { all: S.d.threads.filter(x => !x.closed && !x.snooze).length, mine: S.d.threads.filter(x => x.assignee === who && !x.closed && !x.snooze).length, unread: S.d.threads.filter(x => x.unread).length, snoozed: S.d.threads.filter(x => x.snooze).length, closed: S.d.threads.filter(x => x.closed).length };
  const showList = !narrow || !routeId, showConv = !!t && (!narrow || !!routeId);
  return html`<${Shell} title="Inbox" sub=${(box === "mine" ? "Assigned to you" : "Every conversation") + " · SMS, WhatsApp, email and portals in one thread per person"}>
    <div class=${"inbox of-inbox" + (narrow ? " of-narrow" : "")}>
      ${showList && html`<div class="list of-list">
        <div class="of-lhd">
          <label class="of-q"><${Ic} n="search" s=${14} /><input aria-label="Search conversations" placeholder="Search conversations" value=${q} onInput=${e => setQ(e.target.value)} /></label>
          <div class="of-tabs2" role="tablist">${[["mine", "Mine"], ["all", "All"], ["unread", "Unread"], ["snoozed", "Snoozed"], ["closed", "Closed"]].map(([k, v]) => html`<button role="tab" aria-selected=${box === k} class=${box === k ? "on" : ""} onClick=${() => setBoxP(k)}>${v}${counts[k] ? html`<i>${counts[k]}</i>` : ""}</button>`)}</div>
          <select class="of-sel" aria-label="Channel" value=${ch} onChange=${e => setCh(e.target.value)}>${OF_CH.map(c => html`<option value=${c}>${c}</option>`)}</select>
        </div>
        ${list.length ? list.map(x => { const p = P(x.person), last = x.msgs[x.msgs.length - 1] || { text: "" }; return html`
          <button class=${"th" + (t && x.id === t.id ? " on" : "") + (x.unread ? " of-unread" : "")} onClick=${() => go("inbox/" + x.id)}><${PAv} p=${p} />
            <div class="tx"><div class="row" style="gap:6px"><b>${p.name}</b><span style="flex:1"></span><span class="muted" style="font-size:11.5px">${x.when}</span></div>
              <div class="row" style="gap:6px;margin-top:3px;flex-wrap:wrap"><span class=${"ch " + x.channel}>${x.channel}</span>${x.unread ? html`<span class="pill r">${x.unread} new</span>` : ""}${x.snooze ? html`<span class="pill">Snoozed · ${x.snooze}</span>` : ""}${x.assignee && x.assignee !== who ? html`<span class="of-asg" title=${"Assigned to " + A(x.assignee).name}>${A(x.assignee).ini}</span>` : ""}</div>
              <p>${last.from === "me" ? "You: " : last.from === "ai" ? "Assistant: " : ""}${last.text}</p></div></button>`; })
          : html`<${OfEmpty} icon="inbox" title=${box === "mine" ? "Nothing assigned to you here" : "No conversations match"} sub=${box === "mine" ? "Switch to All to see the team's threads." : "Try another channel or clear the search."} action=${box !== "all" ? html`<button class="btn sm" onClick=${() => { setBoxP("all"); setCh("All channels"); setQ(""); }}>Show all</button>` : ""} />`}
      </div>`}
      ${showConv ? html`<${OfConv} key=${t.id} t=${t} narrow=${narrow} />` : !showList ? "" : !narrow ? html`<div class="conv"><${OfEmpty} icon="inbox" title="Pick a conversation" /></div>` : ""}
    </div></${Shell}>`;
}
function OfConv({ t, narrow }) {
  const p = P(t.person); ofCons(p);
  const [draft, setDraft] = useState(""), [ai, setAi] = useState(null), [aiLoad, setAiLoad] = useState(false), [ch, setCh] = useState(t.channel), [ctx, setCtx] = useState(false), [menu, setMenu] = useState("");
  const boxRef = useRef();
  useEffect(() => { if (!menu) return; const f = e => { if (!e.target.closest(".of-menu")) setMenu(""); }; addEventListener("mousedown", f); return () => removeEventListener("mousedown", f); }, [menu]);
  useEffect(() => { if (t.unread) up(() => { t.unread = 0; }); }, []);
  useEffect(() => { if (boxRef.current) boxRef.current.scrollTop = 9e9; });
  const can = ofCanSend(p, ch);
  const deal = (t.deal && S.d.deals.find(d => d.id === t.deal)) || S.d.deals.find(d => d.person === p.id && d.stage !== "Closed");
  const chans = ofPortalCh(t.channel) ? [t.channel, "SMS", "WhatsApp", "Email"] : ["SMS", "WhatsApp", "Email"];
  function send(text) {
    const body = (text != null ? text : draft).trim();
    if (!body) return;
    if (!can.ok) { toast("Not sent: " + can.why); return; }
    up(() => { t.msgs.push({ from: "me", text: body, at: "now", ch, by: ofMe() }); t.unread = 0; t.when = "now"; t.closed = false; t.snooze = null; p.last = "now"; });
    setDraft(""); setAi(null);
    toast("Sent by " + ch + " · logged to " + ofFirst(p.name) + "'s record", ["Open record", () => go("person/" + p.id)]);
  }
  function draftAi() {
    setAiLoad(true); setAi(null);
    setTimeout(() => { setAiLoad(false); setAi(true); setDraft(ofMerge(OF_DRAFTS[t.id] || "Hi {first}, thanks for your message. Let me check and get right back to you today. – {agent}", t, p) + (ch === "SMS" && !t.msgs.some(m => m.from === "ai") ? " Reply STOP to opt out." : "")); }, 550);
  }
  const assign = (a) => { up(() => { t.assignee = a; }); setMenu(""); ofNotify(a, "Conversation with " + p.name + " assigned to you", "inbox/" + t.id); toast("Assigned to " + A(a).name + (a === ofMe() ? " (you)" : "")); };
  const snooze = (v) => { up(() => { t.snooze = v; }); setMenu(""); toast("Snoozed until " + v + " · it comes back to the top then", ["Undo", () => up(() => { t.snooze = null; })]); if (narrow) go("inbox"); };
  const closeT = () => { up(() => { t.closed = !t.closed; t.snooze = null; }); toast(t.closed ? "Closed · it reopens by itself if " + ofFirst(p.name) + " replies" : "Reopened"); };
  const call = () => { up(() => { t.msgs.push({ from: "me", text: "Call · 3m 12s · recorded with consent", at: "now", ch: "Call", call: true }); t.when = "now"; p.last = "now"; ofLog(p.id, "Inbox", "Call from " + me().name + " · 3m 12s"); }); toast("Call logged to the thread · transcript and summary attached"); };
  const recordOut = (k) => { up(() => { p.consent[k] = "out"; p.consent.note = "Marked opted out of " + k + " by " + me().name + " · Oct 8"; ofLog(p.id, "Consent", "Opted out of " + k); }); if (ch === k) setCh("Email"); toast(ofFirst(p.name) + " is opted out of " + k + " · automations and texts stop on every number"); };
  const askIn = (k) => { up(() => { t.msgs.push({ from: "me", text: "Would you like updates by " + k + " again? Reply YES to opt back in. You can opt out any time.", at: "now", ch: "Email" }); t.when = "now"; }); toast("Opt-in request sent by email · " + k + " stays off until " + ofFirst(p.name) + " says yes"); };
  const ctxPanel = html`<div class=${"ctx of-ctx" + (ctx ? " open" : "")}>
    <div class="row"><${PAv} p=${p} lg /><div style="min-width:0"><b><a class="of-link" onClick=${() => go("person/" + p.id)}>${p.name}</a></b><div class="muted" style="font-size:12px">${p.phone}</div><div class="muted" style="font-size:12px;overflow-wrap:anywhere">${p.email}</div></div></div>
    <div class="row" style="flex-wrap:wrap;gap:5px">${p.tags.map(x => html`<span class="pill">${x}</span>`)}</div>
    <div><div class="lbl">Consent</div><div class="of-cons">${["SMS", "WhatsApp", "Email"].map(k => { const v = p.consent[k], [lab, tone] = OF_CONS[v]; return html`<div class="row"><span style="width:76px">${k}</span><span class=${"pill " + tone}>${lab}</span><span style="flex:1"></span>${v === "in" ? html`<button class="btn sm ghost" onClick=${() => recordOut(k)}>Opt out</button>` : v === "out" && k !== "Email" ? html`<button class="btn sm ghost" onClick=${() => askIn(k)} disabled=${p.consent.Email === "out"}>Ask by email</button>` : ""}</div>`; })}</div>${p.consent.note ? html`<div class="muted" style="font-size:11.5px;margin-top:6px">${p.consent.note}</div>` : ""}</div>
    <div><div class="lbl">Contact owner</div><div class="row" style="margin-top:6px"><${Av} a=${A(p.owner)} /><span>${A(p.owner).name}</span></div></div>
    ${deal ? html`<button class="card of-dealcard" onClick=${() => go("deal/" + deal.id)}><div class="bd"><div class="lbl">${deal.kind} deal · linked</div><b style="display:block;margin-top:4px">${L(deal.listing).addr}</b><div class="row" style="margin-top:6px">${stagePill(deal.stage)}<span class="muted num">${usd(deal.price)}</span></div></div></button>`
      : html`<label class="field"><span>Link to a deal</span><select onChange=${e => { const v = e.target.value; if (v) { up(() => { t.deal = v; }); toast("Linked · messages now show on the deal file"); } }}><option value="">Choose a deal…</option>${S.d.deals.map(d => html`<option value=${d.id}>${L(d.listing).addr} · ${P(d.person).short}</option>`)}</select></label>`}
    ${t.id === "T1" && deal && !deal.agreement.signed ? html`<button class="btn pri" onClick=${() => openAgreement(p, "L1", deal)}>Send buyer agreement</button>` : ""}
    ${t.id === "T5" ? html`<button class="btn pri" onClick=${() => go("rentals/M1")}>Open work order</button>` : ""}
    ${t.id === "T8" ? html`<button class="btn pri" onClick=${() => go("projects/603")}>Open unit 603</button>` : ""}
    ${t.id === "T3" ? html`<button class="btn pri" onClick=${() => go("listing/L1")}>Open net sheet</button>` : ""}
    <button class="btn" onClick=${() => go("person/" + p.id)}>Full record <${OfI} n="chev" s=${13} /></button>
  </div>`;
  return html`<div class="conv of-conv">
    <div class="of-chd">
      ${narrow ? html`<button class="btn sm ghost" aria-label="Back to conversations" onClick=${() => go("inbox")}><${OfI} n="back" /></button>` : ""}
      <div class="of-who"><b><a class="of-link" onClick=${() => go("person/" + p.id)}>${p.name}</a></b><span class="row" style="gap:6px"><span class=${"ch " + t.channel}>${t.channel}</span><span class="muted of-subj">${t.subject}</span></span></div>
      <span style="flex:1"></span>
      <div class="of-acts">
        <div class="of-menu"><button class="btn sm" aria-haspopup="true" aria-expanded=${menu === "a"} title="Assign" onClick=${() => setMenu(menu === "a" ? "" : "a")}><${OfI} n="user" s=${13} /><span class="of-hide-s">${t.assignee ? A(t.assignee).name.split(" ")[0] : "Assign"}</span></button>
          ${menu === "a" && html`<div class="of-pop" role="menu">${Object.values(S.d.agents).map(a => html`<button role="menuitem" onClick=${() => assign(a.id)}><${Av} a=${a} />${a.name}${t.assignee === a.id ? " ✓" : ""}</button>`)}</div>`}</div>
        <div class="of-menu"><button class="btn sm" aria-haspopup="true" aria-expanded=${menu === "s"} title="Snooze" aria-label="Snooze" onClick=${() => setMenu(menu === "s" ? "" : "s")}><${OfI} n="snooze" s=${13} /><span class="of-hide-s">Snooze</span></button>
          ${menu === "s" && html`<div class="of-pop" role="menu">${["3 pm today", "Tomorrow 8 am", "Monday 8 am", "Next week"].map(v => html`<button role="menuitem" onClick=${() => snooze(v)}>${v}</button>`)}</div>`}</div>
        <button class="btn sm" title=${t.closed ? "Reopen" : "Close conversation"} onClick=${closeT}><${OfI} n=${t.closed ? "up" : "check"} s=${13} /><span class="of-hide-s">${t.closed ? "Reopen" : "Close"}</span></button>
        <button class="btn sm" title=${"Call " + p.phone} aria-label=${"Call " + p.phone} onClick=${call}><${Ic} n="phone" s=${13} /><span class="of-hide-s">Call</span></button>
        <button class="btn sm of-ctxbtn" aria-label="Contact details" title="Contact details" aria-expanded=${ctx} onClick=${() => setCtx(!ctx)}><${OfI} n="user" s=${13} /> Details</button>
      </div>
    </div>
    ${t.snooze || t.closed ? html`<div class="of-banner">${t.closed ? "Closed conversation. Replying reopens it." : "Snoozed until " + t.snooze + "."} <button class="btn sm ghost" onClick=${() => up(() => { t.closed = false; t.snooze = null; })}>Move back to inbox</button></div>` : ""}
    <div class="of-cbody">
      <div class="of-cmain">
        <div class="msgs" ref=${boxRef}>${t.msgs.map(m => html`<div class=${"msg " + m.from + (m.call ? " of-call" : "")}>${m.text}${m.photo ? html`<div class="ph"></div>` : ""}<small>${m.ch} · ${m.at}${m.from === "ai" ? " · assistant" : m.from === "me" && m.by ? " · " + A(m.by).name.split(" ")[0] : ""}</small>${m.note ? html`<span class="why">${m.note}</span>` : ""}</div>`)}</div>
        <div class="composer of-composer">
          ${aiLoad ? html`<div class="ai of-aid"><div class="lbl">Assistant is drafting…</div><div class="of-skel"></div><div class="of-skel" style="width:70%"></div></div>` : ""}
          ${ai ? html`<div class="ai of-aid of-aibar"><span class="lbl">AI draft</span><span class="muted" style="font-size:12px;flex:1">Edit it below like any message. Nothing goes out until you approve.</span><button class="btn sm pri" disabled=${!can.ok || !draft.trim()} onClick=${() => send()}>Approve & send</button><button class="btn sm ghost" onClick=${() => { setAi(null); setDraft(""); }}>Discard</button></div>` : ""}
          ${!can.ok ? html`<div class="of-block" role="alert"><${OfI} n="lock" s=${14} /><span>${can.why}. Texts to this number are blocked.</span>${p.consent.Email !== "out" ? html`<button class="btn sm" onClick=${() => setCh("Email")}>Reply by email</button>` : ""}</div>` : can.warn ? html`<div class="of-warn">${can.warn}</div>` : ""}
          <textarea aria-label="Message" placeholder=${can.ok ? "Reply by " + ch + "… (Enter to send, Shift+Enter for a new line)" : "Pick another channel to reply"} disabled=${!can.ok} value=${draft} onInput=${e => { setDraft(e.target.value); if (!e.target.value) setAi(null); }} onKeyDown=${e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}></textarea>
          <div class="row of-crow">
            <select class="of-sel" aria-label="Send as" value=${ch} onChange=${e => setCh(e.target.value)}>${chans.map(c => { const k = ofConsKey(c), out = k && p.consent[k] === "out"; return html`<option value=${c}>${c}${out ? " · opted out" : ""}</option>`; })}</select>
            <select class="of-sel" aria-label="Insert template" value="" onChange=${e => { const tp = OF_TPL.find(x => x[0] === e.target.value); if (tp) setDraft(ofMerge(tp[1], t, p)); e.target.value = ""; }}><option value="">Templates…</option>${OF_TPL.map(x => html`<option value=${x[0]}>${x[0]}</option>`)}</select>
            <button class="btn sm" onClick=${draftAi} disabled=${aiLoad}><${Ic} n="spark" s=${13} /> Draft with AI</button>
            <span style="flex:1"></span>
            <button class="btn pri sm" onClick=${() => send()} disabled=${!draft.trim() || !can.ok} title=${!can.ok ? can.why : !draft.trim() ? "Write a message first" : "Send"}><${OfI} n="send" s=${13} /> Send</button>
          </div>
        </div>
      </div>
      ${ctxPanel}
    </div>
  </div>`;
}

// ================= PEOPLE =================
const OF_LISTS = [
  ["all", "Everyone", () => true],
  ["mine", "My contacts", (p) => p.owner === ofMe()],
  ["hot", "Hot leads · score 70+", (p) => p.score >= 70 && !["Homeowner", "Tenant"].includes(p.stage)],
  ["noba", "Buyer agreement not signed", (p) => p.roles.includes("Buyer") && S.d.deals.some(d => d.person === p.id && d.kind === "Buyer" && d.stage !== "Closed" && !d.agreement.signed)],
  ["past", "Past clients & homeowners", (p) => p.roles.includes("Homeowner") || /past client/i.test(p.source)],
  ["optout", "Opted out of texts", (p) => !!(p.consent && p.consent.SMS === "out")],
  ["followup", "Has a task due", (p) => S.d.of.tasks.some(t => t.person === p.id && !t.done && ofDays(t.due) <= 0)],
];
function People() {
  const [list, setList] = useState(S["ofList_" + ofMe()] || (ofSeesAll() ? "all" : "mine")), [role, setRole] = useState("All"), [q, setQ] = useState(""), [sort, setSort] = useState("last");
  const [sel, setSel] = useState({}), [tag, setTag] = useState(""), [tagErr, setTagErr] = useState("");
  const roles = ["All", "Buyer", "Seller", "Landlord", "Tenant", "Investor", "Homeowner"];
  const lf = (OF_LISTS.find(x => x[0] === list) || OF_LISTS[0])[2];
  const lastRank = (s) => s === "now" ? 0 : /m$/.test(s) ? parseInt(s) : /h$/.test(s) ? parseInt(s) * 60 : /pm|am/.test(s) ? 600 : s === "Today" ? 700 : s === "Yesterday" ? 1440 : /w$/.test(s) ? parseInt(s) * 10080 : 99999;
  const rows = S.d.people.filter(p => lf(p) && (role === "All" || p.roles.includes(role)) && (!q || (p.name + " " + p.email + " " + p.phone + " " + p.tags.join(" ") + " " + p.source).toLowerCase().includes(q.toLowerCase())))
    .sort((a, b) => sort === "name" ? a.name.localeCompare(b.name) : sort === "score" ? b.score - a.score : lastRank(a.last) - lastRank(b.last));
  const ids = Object.keys(sel).filter(k => sel[k]);
  const allOn = rows.length && rows.every(p => sel[p.id]);
  const setListP = (v) => { S["ofList_" + ofMe()] = v; setList(v); };
  function bulkTag() { const v = tag.trim(); if (!v) { setTagErr("Type a tag"); return; } up(() => ids.forEach(id => { const p = P(id); if (!p.tags.includes(v)) p.tags.push(v); })); toast("Tagged " + ids.length + " " + (ids.length > 1 ? "people" : "person") + " “" + v + "”"); setTag(""); setTagErr(""); }
  function bulkAssign(a) { if (!a) return; up(() => ids.forEach(id => { P(id).owner = a; })); ofNotify(a, ids.length + " contacts assigned to you", "people"); toast(ids.length + " contacts now owned by " + A(a).name); setSel({}); }
  return html`<${Shell} title="People" sub="One record per household, whatever they're buying, selling, renting or investing in" actions=${html`<button class="btn pri" onClick=${() => ofOpen("ofPerson")}><${OfI} n="plus" s=${14} /> Add person</button>`}>
    <div class="page of-people">
      <div class="of-lists" role="tablist" aria-label="Smart lists">${OF_LISTS.map(([k, v, f]) => html`<button role="tab" aria-selected=${list === k} class=${"of-sl" + (list === k ? " on" : "")} onClick=${() => setListP(k)}><span>${v}</span><b class="num">${S.d.people.filter(f).length}</b></button>`)}</div>
      <div class="of-toolbar">
        <label class="of-q grow"><${Ic} n="search" s=${14} /><input aria-label="Search people" placeholder="Search name, phone, email, tag" value=${q} onInput=${e => setQ(e.target.value)} /></label>
        <select class="of-sel" aria-label="Role" value=${role} onChange=${e => setRole(e.target.value)}>${roles.map(r => html`<option value=${r}>${r === "All" ? "All roles" : r + "s"}</option>`)}</select>
        <select class="of-sel" aria-label="Sort" value=${sort} onChange=${e => setSort(e.target.value)}><option value="last">Recent activity</option><option value="score">Intent score</option><option value="name">Name A–Z</option></select>
      </div>
      ${ids.length ? html`<div class="of-bulk" role="region" aria-label="Bulk actions"><b>${ids.length} selected</b>
        <div class="row" style="gap:6px"><input aria-label="Tag to add" placeholder="Add tag" value=${tag} onInput=${e => { setTag(e.target.value); setTagErr(""); }} onKeyDown=${e => e.key === "Enter" && bulkTag()} /><button class="btn sm" onClick=${bulkTag}><${OfI} n="tag" s=${12} /> Tag</button></div>
        <select class="of-sel" aria-label="Assign to" value="" onChange=${e => bulkAssign(e.target.value)}><option value="">Assign to…</option>${ofAgentOpts(["maya", "jordan", "priya", "sam", "leo", "rohan"])}</select>
        <button class="btn sm ghost" onClick=${() => setSel({})}>Clear</button>${tagErr && html`<em class="of-err">${tagErr}</em>`}</div>` : ""}
      <div class="card of-tablecard"><div class="of-scroll"><table class="t of-ptable"><thead><tr><th style="width:36px"><input type="checkbox" aria-label="Select all" checked=${!!allOn} onChange=${e => { const on = e.target.checked; setSel(on ? Object.fromEntries(rows.map(p => [p.id, true])) : {}); }} /></th><th>Name</th><th class="of-hm">Roles across the bundle</th><th>Stage</th><th class="of-hm">Owner</th><th class="of-hm">Score</th><th class="of-hm">Last touch</th></tr></thead><tbody>
        ${rows.map(p => html`<tr class=${"click" + (sel[p.id] ? " of-selrow" : "")} onClick=${() => go("person/" + p.id)}><td onClick=${e => e.stopPropagation()}><input type="checkbox" aria-label=${"Select " + p.name} checked=${!!sel[p.id]} onChange=${e => setSel({ ...sel, [p.id]: e.target.checked })} /></td>
          <td><div class="row"><${PAv} p=${p} /><div style="min-width:0"><b>${p.name}</b><div class="muted of-sm2">${p.source}${p.consent && p.consent.SMS === "out" ? " · no texts" : ""}</div></div></div></td>
          <td class="of-hm"><div class="row" style="gap:4px;flex-wrap:wrap">${p.roles.map(r => html`<span class="pill">${r}</span>`)}</div></td><td>${stagePill(p.stage)}</td>
          <td class="of-hm"><div class="row" style="gap:6px"><${Av} a=${A(p.owner)} /><span>${A(p.owner).name.split(" ")[0]}</span></div></td><td class="of-hm num">${p.score ? html`<span class=${"of-score" + (p.score >= 75 ? " hot" : "")}>${p.score}</span>` : "—"}</td><td class="of-hm muted">${p.last}</td></tr>`)}
      </tbody></table></div>${!rows.length ? html`<${OfEmpty} icon="users" title="No one matches" sub="Change the list, role or search." action=${html`<button class="btn sm" onClick=${() => { setListP("all"); setRole("All"); setQ(""); }}>Reset filters</button>`} />` : ""}</div>
      <div class="muted" style="font-size:12px">${rows.length} of ${S.d.people.length} people · lists update live as people change stage, tags or consent</div>
    </div></${Shell}>`;
}

function OfPersonModal({ m, close }) {
  const [f, setF] = useState({ name: m.name || "", phone: "", email: "", role: m.role || "Buyer", source: "Added by hand", owner: ofMe() === "grace" || ofMe() === "nina" ? "jordan" : ofMe(), sms: true }), [err, setErr] = useState({}), [force, setForce] = useState(false);
  const set = (k, v) => { setF({ ...f, [k]: v }); setErr({ ...err, [k]: "" }); setForce(false); };
  const dupes = S.d.people.filter(p => (f.phone && ofDigits(p.phone) === ofDigits(f.phone) && ofDigits(f.phone).length >= 7) || (f.email && p.email.toLowerCase() === f.email.trim().toLowerCase()) || (f.name.trim().length > 3 && p.name.toLowerCase().includes(f.name.trim().toLowerCase().split(" ").pop()) && f.name.trim().split(" ").length > 1 && p.name.toLowerCase().split(/\s|&/).includes(f.name.trim().toLowerCase().split(" ")[0])));
  function save() {
    const e = {};
    if (!f.name.trim()) e.name = "Name is required";
    if (!f.phone.trim() && !f.email.trim()) e.phone = "Add a phone or an email so we can reach them";
    if (f.phone.trim() && ofDigits(f.phone).length < 10) e.phone = "Phone needs 10 digits, e.g. (512) 555-0123";
    if (f.email.trim() && !ofEmailOk(f.email.trim())) e.email = "That email doesn't look right";
    setErr(e); if (Object.keys(e).length) return;
    if (dupes.length && !force) { setForce(true); return; }
    const id = ofNewId("P", S.d.people), name = f.name.trim();
    up(s => {
      s.d.people.unshift({ id, name, short: name.split(" ").pop(), ini: ofIni(name), phone: f.phone.trim(), email: f.email.trim(), owner: f.owner, source: f.source, stage: f.role === "Tenant" ? "Tenant" : f.role === "Seller" ? "Listing" : "New lead", tags: [f.role], roles: [f.role], score: 50, last: "now", consent: { SMS: f.sms && f.phone ? "in" : "unknown", WhatsApp: "unknown", Email: f.email ? "in" : "unknown", note: f.sms && f.phone ? "One-to-one consent recorded by " + me().name + " · Oct 8" : "" } });
      s.d.activity.push([id, "CRM", "Added by " + me().name + " · " + f.source, "Oct 8"]);
      s.modal = null;
    });
    if (f.owner !== ofMe()) ofNotify(f.owner, "New contact assigned: " + name, "person/" + id);
    toast(name + " added · owned by " + A(f.owner).name, ["Create a deal", () => ofOpen("ofDeal", { person: id })]);
    go("person/" + id);
  }
  return html`<${OfModal} title="Add a person" sub="One record per household. We check for duplicates before saving." close=${close}
    foot=${html`<button class="btn" onClick=${close}>Cancel</button><button class="btn pri" onClick=${save}>${force ? "Create anyway" : "Save person"}</button>`}>
    <${OfField} label="Name or household" err=${err.name}><input value=${f.name} onInput=${e => set("name", e.target.value)} placeholder="e.g. Chris & Dana Morgan" onKeyDown=${e => e.key === "Enter" && save()} /></${OfField}>
    <div class="row of-frow"><${OfField} grow label="Mobile" err=${err.phone}><input inputmode="tel" value=${f.phone} onInput=${e => set("phone", e.target.value)} placeholder="(512) 555-0123" onKeyDown=${e => e.key === "Enter" && save()} /></${OfField}>
      <${OfField} grow label="Email" err=${err.email}><input type="email" value=${f.email} onInput=${e => set("email", e.target.value)} placeholder="name@example.com" onKeyDown=${e => e.key === "Enter" && save()} /></${OfField}></div>
    <div class="row of-frow"><${OfField} grow label="They are a"><select value=${f.role} onChange=${e => set("role", e.target.value)}>${["Buyer", "Seller", "Tenant", "Landlord", "Investor", "Homeowner"].map(r => html`<option value=${r}>${r}</option>`)}</select></${OfField}>
      <${OfField} grow label="Source"><select value=${f.source} onChange=${e => set("source", e.target.value)}>${["Added by hand", "Referral", "Open house", "Website", "Zillow", "Sign call", "Instagram ad"].map(r => html`<option value=${r}>${r}</option>`)}</select></${OfField}>
      <${OfField} grow label="Owner"><select value=${f.owner} onChange=${e => set("owner", e.target.value)}>${ofAgentOpts(["maya", "jordan", "priya", "sam", "leo", "rohan"])}</select></${OfField}></div>
    <label class="of-check"><input type="checkbox" checked=${f.sms} onChange=${e => set("sms", e.target.checked)} /><span>They agreed to texts from Harbor & Vine Realty (one-to-one consent). Leave unticked if you're not sure: you can still reply when they text you.</span></label>
    ${dupes.length ? html`<div class=${"of-dupe" + (force ? " hot" : "")} role="alert"><b>${force ? "Possible duplicate. Open the existing record, or create anyway." : "Looks like someone we already know"}</b>${dupes.map(p => html`<div class="row"><${PAv} p=${p} /><div style="flex:1;min-width:0"><b>${p.name}</b><div class="muted" style="font-size:12px">${p.phone} · ${p.email} · ${A(p.owner).name}</div></div><button class="btn sm" onClick=${() => { close(); go("person/" + p.id); }}>Open</button></div>`)}</div>` : ""}
  </${OfModal}>`;
}

function Person() {
  const p = P(S.route.id);
  const [tab, setTab] = useState("timeline"), [note, setNote] = useState(""), [tagIn, setTagIn] = useState(""), [noteErr, setNoteErr] = useState("");
  if (!p) return html`<${Shell} title="Person not found"><div class="page"><${OfEmpty} icon="users" title="This record doesn't exist" sub="It may have been merged into another one." action=${html`<button class="btn pri" onClick=${() => go("people")}>Back to people</button>`} /></div></${Shell}>`;
  ofCons(p);
  const deals = S.d.deals.filter(d => d.person === p.id);
  const owned = S.d.buildings.filter(b => b.ownerPerson === p.id);
  const tenancy = S.d.units.filter(u => u.tenant && p.name.startsWith(u.tenant));
  const booked = S.d.projUnits.filter(u => u.buyer === p.id);
  const listingsSold = deals.filter(d => d.kind === "Listing");
  const life = ["Lead", "Buyer", "Under contract", "Homeowner", "Landlord", "Investor"];
  const reached = new Set(["Lead"]);
  p.roles.forEach(r => reached.add(r === "Seller" ? "Homeowner" : r));
  if (deals.some(d => d.kind === "Buyer" && (d.stage === "Under contract" || d.stage === "Closed"))) reached.add("Under contract");
  const t = ofThreadFor(p.id);
  const notes = S.d.of.notes.filter(n => n.person === p.id).slice().reverse();
  const acts = S.d.activity.filter(a => a[0] === p.id);
  const timeline = [
    ...acts.map(a => ({ at: a[3], text: a[2], tag: a[1], kind: "act" })),
    ...notes.map(n => ({ at: n.at, text: n.text, tag: "Note · " + A(n.by).name.split(" ")[0], kind: "note" })),
    ...(t ? t.msgs.slice(-4).map(m => ({ at: m.at, text: (m.from === "them" ? "" : m.from === "ai" ? "Assistant: " : "You: ") + m.text, tag: m.ch, kind: "msg" })) : []),
  ];
  const smart = OF_LISTS.filter(l => l[0] !== "all" && l[2](p)).map(l => l[1]);
  function addNote() { if (!note.trim()) { setNoteErr("Write a note first"); return; } up(() => { S.d.of.notes.push({ id: ofNewId("N", S.d.of.notes), person: p.id, deal: null, by: ofMe(), at: "Oct 8", text: note.trim() }); }); setNote(""); setNoteErr(""); toast("Note saved to " + ofFirst(p.name) + "'s timeline"); }
  function addTag() { const v = tagIn.trim(); if (!v || p.tags.includes(v)) return; up(() => { p.tags.push(v); }); setTagIn(""); }
  function message() { const th = ofThreadFor(p.id); if (th) go("inbox/" + th.id); else { let id; up(() => { id = ofSay(p.id, "Started a conversation", p.consent.SMS === "out" ? "Email" : "SMS").id; const nt = S.d.threads.find(x => x.id === id); nt.msgs = []; nt.subject = "New conversation"; nt.assignee = ofMe(); }); go("inbox/" + id); } }
  return html`<${Shell} title=${p.name} sub=${p.source + " · owner " + A(p.owner).name}
    actions=${html`<div class="row of-hact"><button class="btn" onClick=${() => { up(() => { ofLog(p.id, "Inbox", "Call from " + me().name + " · 2m 05s"); p.last = "now"; }); toast("Calling " + p.phone + " · logged to the timeline"); }} aria-label=${"Call " + p.name}><${Ic} n="phone" s=${14} /><span class="of-hide-s">Call</span></button><button class="btn" onClick=${message}><${OfI} n="mail" s=${14} /> Message</button><button class="btn pri" onClick=${() => ofOpen("ofDeal", { person: p.id })}><${OfI} n="plus" s=${14} /> Deal</button></div>`}>
    <div class="page">
      <${OfBack} to="people" label="People" />
      <div class="card of-phead"><div class="bd">
        <div class="row of-pid"><${PAv} p=${p} lg /><div style="flex:1;min-width:0"><b style="font-size:17px">${p.name}</b><div class="muted of-wrap">${p.phone}${p.email ? " · " + p.email : ""}</div></div>
          ${p.score ? html`<div class="of-intent"><div class="lbl">Intent</div><b>${p.score}</b><span>${p.score >= 75 ? "High" : p.score >= 55 ? "Medium" : "Low"}</span></div>` : ""}</div>
        <div class="of-pgrid">
          <label class="field"><span>Stage</span><select value=${p.stage} onChange=${e => { const v = e.target.value; up(() => { ofLog(p.id, "CRM", "Stage " + p.stage + " → " + v); p.stage = v; }); toast("Stage set to " + v); }}>${["New lead", "Touring", "Offer", "Under contract", "Closed", "Listing", "Nurture", "Homeowner", "Tenant", "Booked"].map(s => html`<option value=${s}>${s}</option>`)}</select></label>
          <label class="field"><span>Owner</span><select value=${p.owner} onChange=${e => { const v = e.target.value; up(() => { p.owner = v; ofLog(p.id, "CRM", "Reassigned to " + A(v).name); }); ofNotify(v, p.name + " is now your contact", "person/" + p.id); toast("Now owned by " + A(v).name); }}>${ofAgentOpts(["maya", "jordan", "priya", "sam", "leo", "rohan"])}</select></label>
          <div class="field"><span>Tags</span><div class="of-tags">${p.tags.map(x => html`<span class="pill">${x}<button aria-label=${"Remove tag " + x} title="Remove" onClick=${() => up(() => { p.tags = p.tags.filter(y => y !== x); })}>×</button></span>`)}<input aria-label="Add tag" placeholder="+ tag" value=${tagIn} onInput=${e => setTagIn(e.target.value)} onKeyDown=${e => e.key === "Enter" && addTag()} /></div></div>
        </div>
        <div class="lbl" style="margin-top:12px">Lifecycle: one record, every stage</div>
        <div class="lifecycle of-life">${life.map(s => html`<span class=${reached.has(s) ? "on" : ""}>${s}</span>`)}</div>
        ${smart.length ? html`<div class="row of-wrap" style="gap:6px;margin-top:10px"><span class="lbl">In smart lists</span>${smart.map(s => html`<span class="pill f">${s}</span>`)}</div>` : ""}
      </div></div>
      <div class="split">
        <div class="of-col">
          <div class="tabs" role="tablist">${[["timeline", "Timeline"], ["tasks", "Tasks"], ["notes", "Notes"]].map(([k, v]) => html`<button role="tab" aria-selected=${tab === k} class=${tab === k ? "on" : ""} onClick=${() => setTab(k)}>${v}${k === "tasks" ? " · " + S.d.of.tasks.filter(x => x.person === p.id && !x.done).length : k === "notes" ? " · " + notes.length : ""}</button>`)}</div>
          ${tab === "timeline" && html`<div class="card"><div class="bd tl">${timeline.length ? timeline.map(a => html`<div class="it"><span class="muted num" style="font-size:12px">${a.at}</span><span class=${"dot" + (a.kind === "note" ? " of-dn" : a.kind === "msg" ? " of-dm" : "")}></span><div>${a.text.length > 160 ? a.text.slice(0, 160) + "…" : a.text}</div><span class=${a.kind === "msg" ? "ch " + a.tag : "pill"}>${a.tag}</span></div>`) : html`<${OfEmpty} title="No activity yet" />`}
            ${t ? html`<button class="btn sm" style="margin-top:10px" onClick=${() => go("inbox/" + t.id)}>Open the conversation →</button>` : ""}</div></div>`}
          ${tab === "tasks" && html`<${OfTasks} title="Tasks" person=${p.id} who=${null} />`}
          ${tab === "notes" && html`<div class="card"><div class="bd of-notes">
            <textarea aria-label="New note" placeholder=${"Note about " + ofFirst(p.name) + " (visible to the team)"} value=${note} onInput=${e => { setNote(e.target.value); setNoteErr(""); }}></textarea>${noteErr && html`<em class="of-err">${noteErr}</em>`}
            <div class="row"><span class="muted" style="font-size:12px;flex:1">Notes show on the timeline and any linked deal.</span><button class="btn sm pri" onClick=${addNote}>Save note</button></div>
            ${notes.map(n => html`<div class="of-note"><div class="row"><${Av} a=${A(n.by)} /><b style="font-size:13px">${A(n.by).name}</b><span class="muted" style="font-size:12px">${n.at}</span></div><p>${n.text}</p></div>`)}</div></div>`}
        </div>
        <div class="of-col">
          <${OfWebLeads} pid=${p.id} />
          ${deals.length ? html`<${OfCard} title="Deals" icon="pipeline" count=${deals.length}><div class="of-rows">${deals.map(ofDealRow)}</div></${OfCard}>` : html`<${OfCard} title="Deals" icon="pipeline"><${OfEmpty} title="No deals yet" action=${html`<button class="btn sm pri" onClick=${() => ofOpen("ofDeal", { person: p.id })}>Create a deal</button>`} /></${OfCard}>`}
          ${listingsSold.length ? html`<${OfCard} title="Their homes" icon="listings"><div class="of-rows">${listingsSold.map(d => { const l = L(d.listing); return html`<${OfRow} lead=${html`<img class="thumb" src=${img(l.img)} alt="" />`} title=${l.addr} sub=${l.status + " · " + usd(l.price)} onClick=${() => go("listing/" + l.id)} />`; })}</div></${OfCard}>` : ""}
          ${owned.length || tenancy.length ? html`<${OfCard} title="Rentals" icon="rentals"><div class="of-rows">${owned.map(b => html`<${OfRow} lead=${html`<img class="thumb" src=${img(b.img)} alt="" />`} title=${b.name} sub=${"Owner · " + b.units + " units managed by Leo"} right=${html`<span class="pill f">Landlord</span>`} onClick=${() => go("rentals")} />`)}${tenancy.map(u => html`<${OfRow} lead=${html`<span class="of-unit">${u.name}</span>`} title=${S.d.buildings.find(b => b.id === u.b).name + " " + u.name} sub=${"Tenant · " + usd(u.rent) + "/mo · ends " + u.end} right=${html`<span class=${"pill " + (u.status === "Late" ? "r" : "g")}>${u.status}</span>`} onClick=${() => go("rentals/" + u.id)} />`)}</div></${OfCard}>` : ""}
          ${booked.length || p.id === "P1" || p.id === "P7" ? html`<${OfCard} title="The Linden" icon="projects"><div class="of-rows">${booked.length ? booked.map(u => html`<${OfRow} lead=${html`<span class="of-unit Booked">${u.code}</span>`} title=${"Unit " + u.code + " · " + u.type} sub=${usd(u.price) + " · " + (S.d.of.payPlans[u.planId] || S.d.of.payPlans.clp).name} onClick=${() => go("projects/" + u.code)} />`) : html`<${OfRow} lead=${html`<img class="thumb" src=${img("b-tower")} alt="" />`} title="Interested in 2 BR units" sub="The Linden at Mueller" onClick=${() => go("projects")} />`}</div></${OfCard}>` : ""}
          <${OfCard} title="Consent" icon="shield"><div class="bd of-cons">${["SMS", "WhatsApp", "Email"].map(k => { const [lab, tone] = OF_CONS[p.consent[k]]; return html`<div class="row"><span style="width:84px">${k}</span><span class=${"pill " + tone}>${lab}</span><span style="flex:1"></span>${p.consent[k] !== "out" ? html`<button class="btn sm ghost" onClick=${() => { up(() => { p.consent[k] = "out"; p.consent.note = "Marked opted out of " + k + " by " + me().name + " · Oct 8"; ofLog(p.id, "Consent", "Opted out of " + k); }); toast(k + " off for " + ofFirst(p.name)); }}>Opt out</button>` : ""}</div>`; })}${p.consent.note ? html`<div class="muted" style="font-size:11.5px">${p.consent.note}</div>` : ""}</div></${OfCard}>
          <${OfCard} title="Household & data" icon="users"><div class="bd of-kv">
            <div><span>Household</span><b>${p.name}</b></div><div><span>Roles</span><b>${p.roles.join(", ")}</b></div>
            <div><span>Contact owner</span><b>${A(p.owner).name}</b></div><div><span>Portability</span><b>Agent's own contacts leave with them; brokerage leads stay</b></div></div></${OfCard}>
        </div>
      </div>
    </div></${Shell}>`;
}

// ================= PIPELINE + DEAL FILE =================
const OF_PROB = { "New lead": 0.1, Touring: 0.25, Offer: 0.5, "Under contract": 0.85, Closed: 1 };
function Pipeline() {
  const narrow = ofUseNarrow(900), who = ofMe();
  const hasMine = S.d.deals.some(d => d.agent === who);
  const [scope, setScope] = useState(() => { const a = S.ofAgent; S.ofAgent = null; return a || (ofSeesAll() || !hasMine ? "all" : "mine"); });
  const [kind, setKind] = useState("All"), [q, setQ] = useState(""), [over, setOver] = useState(""), [stageTab, setStageTab] = useState("Touring");
  const ds = S.d.deals.filter(d => (scope === "all" ? true : scope === "mine" ? d.agent === who : d.agent === scope) && (kind === "All" || d.kind === kind) && (!q || (L(d.listing).addr + " " + P(d.person).name).toLowerCase().includes(q.toLowerCase())));
  const open = ds.filter(d => d.stage !== "Closed");
  const weighted = open.reduce((a, d) => a + d.price * d.comp / 100 * OF_PROB[d.stage], 0);
  const stages = S.d.stages;
  const move = (d, dir) => { const i = stages.indexOf(d.stage) + dir; if (i >= 0 && i < stages.length) ofMoveDeal(d, stages[i]); };
  const card = (d) => { const l = L(d.listing), p = P(d.person), i = stages.indexOf(d.stage), nx = ofNext(d); return html`<div class="dc of-dc" draggable="true" onDragStart=${e => { e.dataTransfer.setData("text/plain", d.id); e.dataTransfer.effectAllowed = "move"; }}>
    <button class="of-dcmain" onClick=${() => go("deal/" + d.id)} aria-label=${"Open deal " + l.addr}><div class="im" style=${"background-image:url(" + img(l.img) + ")"}></div><b>${l.addr}</b><div class="m"><span>${p.short} · ${d.kind}</span><span class="num">${short(d.price)}</span></div></button>
    <div class="row" style="gap:6px;flex-wrap:wrap"><${Av} a=${A(d.agent)} />${d.kind === "Buyer" ? d.agreement.signed ? html`<span class="pill g">Agreement ✓</span>` : html`<span class="pill r">No agreement</span>` : html`<span class="pill br">Listing</span>`}${nx ? ofDue(nx.n) : ""}</div>
    <div class="of-mv"><button class="btn sm ghost" disabled=${i === 0} aria-label=${"Move back to " + (stages[i - 1] || "")} title=${i ? "Move back to " + stages[i - 1] : "First stage"} onClick=${() => move(d, -1)}><${OfI} n="left" s=${13} /></button><span class="muted">${d.stage}</span><button class="btn sm ghost" disabled=${i === stages.length - 1} aria-label=${"Move to " + (stages[i + 1] || "")} title=${stages[i + 1] ? "Move to " + stages[i + 1] : "Closed"} onClick=${() => move(d, 1)}><${OfI} n="right" s=${13} /></button></div>
  </div>`; };
  const scopes = [["mine", "Mine"], ["all", "All deals"]].concat(scope !== "mine" && scope !== "all" ? [[scope, A(scope).name.split(" ")[0] + "'s"]] : []);
  return html`<${Shell} title="Deals" sub=${scope === "mine" ? "Your buyer and listing deals, one file each from first tour to close" : scope === "all" ? "Every deal in the brokerage" : A(scope).name + "'s deals"} actions=${html`<button class="btn pri" onClick=${() => ofOpen("ofDeal")}><${OfI} n="plus" s=${14} /> New deal</button>`}>
    <div class="page of-pipe">
      <div class="of-toolbar">
        ${hasMine || scope !== "mine" ? html`<${OfSeg} label="Whose deals" value=${scope} set=${setScope} opts=${scopes} />` : ""}
        <${OfSeg} label="Kind" value=${kind} set=${setKind} opts=${["All", "Buyer", "Listing"]} />
        <label class="of-q grow"><${Ic} n="search" s=${14} /><input aria-label="Search deals" placeholder="Search address or client" value=${q} onInput=${e => setQ(e.target.value)} /></label>
      </div>
      <div class="of-forecast"><div><span>Open deals</span><b class="num">${open.length}</b></div><div><span>Pipeline value</span><b class="num">${short(open.reduce((a, d) => a + d.price, 0))}</b></div><div><span>Weighted commission</span><b class="num">${usd(weighted)}</b></div><div><span>Closed</span><b class="num">${ds.filter(d => d.stage === "Closed").length}</b></div></div>
      ${narrow ? html`<div class="of-stabs" role="tablist">${stages.map(st => html`<button role="tab" aria-selected=${stageTab === st} class=${stageTab === st ? "on" : ""} onClick=${() => setStageTab(st)}>${st}<i>${ds.filter(d => d.stage === st).length}</i></button>`)}</div>
        <div class="of-col">${ds.filter(d => d.stage === stageTab).map(card)}${!ds.some(d => d.stage === stageTab) ? html`<${OfEmpty} icon="pipeline" title=${"Nothing in " + stageTab} />` : ""}</div>`
      : html`<div class="board of-board">${stages.map(st => { const col = ds.filter(d => d.stage === st); return html`
        <div class=${"col" + (over === st ? " of-over" : "")} onDragOver=${e => { e.preventDefault(); if (over !== st) setOver(st); }} onDragLeave=${e => { if (!e.currentTarget.contains(e.relatedTarget)) setOver(""); }} onDrop=${e => { e.preventDefault(); setOver(""); const d = S.d.deals.find(x => x.id === e.dataTransfer.getData("text/plain")); if (d) ofMoveDeal(d, st); }}>
          <h4>${st}<span>${col.length} · ${short(col.reduce((a, d) => a + d.price, 0) || 0)}</span></h4>
          ${col.map(card)}${!col.length ? html`<div class="of-drop">Drop a deal here</div>` : ""}
        </div>`; })}</div>`}
      ${!ds.length ? html`<${OfEmpty} icon="pipeline" title="No deals match" sub=${scope === "mine" ? "You have no deals with these filters." : ""} action=${html`<button class="btn sm" onClick=${() => { setScope("all"); setKind("All"); setQ(""); }}>Show all deals</button>`} />` : ""}
    </div></${Shell}>`;
}

function ofSigners(p) { const parts = p.name.split(" & "), last = parts[parts.length - 1].split(" ").slice(1).join(" "); return parts.map(x => x.includes(" ") ? x : x + " " + last); }
function Deal() {
  const d = S.d.deals.find(x => x.id === S.route.id);
  const [tab, setTab] = useState("file"), [nd, setNd] = useState({ label: "", on: "" }), [ndErr, setNdErr] = useState(""), [ck, setCk] = useState(""), [note, setNote] = useState(""), [pty, setPty] = useState({ role: "Lender", name: "", phone: "" }), [ptyErr, setPtyErr] = useState("");
  const fileRef = useRef();
  if (!d) return html`<${Shell} title="Deal not found"><div class="page"><${OfEmpty} icon="pipeline" title="This deal doesn't exist" action=${html`<button class="btn pri" onClick=${() => go("pipeline")}>Back to deals</button>`} /></div></${Shell}>`;
  const l = L(d.listing), p = P(d.person), idx = S.d.stages.indexOf(d.stage), nx = ofNext(d), c = ofComm(d), emd = ofEmd(d);
  const recalc = () => { d.progress = d.checklist.length ? d.checklist.filter(x => x[1]).length / d.checklist.length : d.progress; };
  const parties = [["Client", p.name, p.phone, "person/" + p.id], ["Our agent", A(d.agent).name, A(d.agent).role], ...((S.d.of.parties[d.id]) || [])];
  const dnotes = S.d.of.notes.filter(n => n.deal === d.id).slice().reverse();
  const hasTx = EXT.some(x => x.pages && x.pages.commissions);
  function addDate() {
    if (!nd.label.trim()) { setNdErr("Name the date, e.g. Survey due"); return; }
    if (!nd.on) { setNdErr("Pick a date"); return; }
    const dt = new Date(nd.on + "T12:00:00"); if (isNaN(dt)) { setNdErr("Pick a valid date"); return; }
    up(() => { d.dates.push([nd.label.trim(), ofFmt(dt), false]); d.dates.sort((a, b) => (ofDate(a[1]) || 0) - (ofDate(b[1]) || 0)); }); setNd({ label: "", on: "" }); setNdErr(""); toast("Date added · reminders go to " + A(d.agent).name + " and Nina");
  }
  function upload(e) {
    const files = [...(e.target.files || [])]; if (!files.length) return;
    up(() => files.forEach(f => d.docs.push([f.name.replace(/\.[^.]+$/, ""), "Uploaded"]))); e.target.value = "";
    toast(files.length + " document" + (files.length > 1 ? "s" : "") + " added · dates and parties are read automatically", ["Request e-sign", () => openSign(d, d.docs[d.docs.length - 1][0])]);
  }
  const docPill = (s) => s === "Signed" ? html`<span class="pill g">Signed</span>` : s === "Draft" ? html`<span class="pill a">Draft</span>` : /Sent/.test(s) ? html`<span class="pill b">Out for signature</span>` : html`<span class="pill">${s}</span>`;
  const docs = d.docs.length ? d.docs : [];
  return html`<${Shell} title=${l.addr} sub=${d.kind + " deal · " + p.name + " · " + A(d.agent).name}
    actions=${html`<div class="row of-hact"><select class="of-sel" aria-label="Stage" value=${d.stage} onChange=${e => ofMoveDeal(d, e.target.value)}>${S.d.stages.map(s => html`<option value=${s}>${s}</option>`)}</select><button class="btn pri" onClick=${() => ofMoveDeal(d, S.d.stages[idx + 1])} disabled=${d.stage === "Closed"}>${d.stage === "Closed" ? "Closed" : "Move to " + S.d.stages[idx + 1]}</button></div>`}>
    <div class="page">
      <${OfBack} to="pipeline" label="Deals" />
      <div class="card hero of-hero"><div class="pic" style=${"background-image:url(" + img(l.img) + ")"}></div><div class="info">
        <div class="row" style="flex-wrap:wrap">${stagePill(d.stage)}<span class="muted">Closing ${d.close}</span>${nx ? html`<span class="of-cd"><${OfI} n="clock" s=${13} /> ${nx.label} <b>${ofRel(nx.n)}</b></span>` : ""}</div>
        <h2 class="num">${usd(d.price)} <span class="muted" style="font-size:15px;font-family:var(--f-ui)">· ${l.beds} bd · ${l.baths} ba · ${l.sqft.toLocaleString()} sqft</span></h2>
        <div class="row" style="flex-wrap:wrap"><${PAv} p=${p} /><a class="of-link" onClick=${() => go("person/" + p.id)}>${p.name}</a><span class="muted">·</span><${Av} a=${A(d.agent)} /><span>${A(d.agent).name}</span><span class="muted">·</span><a class="of-link" onClick=${() => go("listing/" + l.id)}>Listing</a></div>
        <div class="bar"><i style=${"width:" + Math.round(d.progress * 100) + "%"}></i></div>
        <div class="muted" style="font-size:12px">${d.stage === "Closed" ? "Closed" : Math.round(d.progress * 100) + "% of the way to closing"}</div>
      </div></div>
      <div class="tabs of-tabs" role="tablist">${[["file", "Deal file"], ["docs", "Documents & e-sign"], ["money", "Pay & commission"], ["activity", "Activity"]].map(([k, v]) => html`<button role="tab" aria-selected=${tab === k} class=${tab === k ? "on" : ""} onClick=${() => setTab(k)}>${v}</button>`)}</div>
      ${tab === "file" && html`<div class="split">
        <div class="of-col">
          <div class="card"><div class="hd"><h3>${d.kind === "Listing" ? "Listing agreement" : "Buyer agreement"}</h3><span class="sp"></span>${d.agreement.signed ? html`<span class="pill g">Signed ${d.agreement.on}</span>` : html`<span class="pill r">Not signed</span>`}</div>
            <div class="bd of-kv">${d.agreement.signed ? html`<div><span>Agent pay (negotiated)</span><b>${d.agreement.comp}</b></div><div><span>Term</span><b>${d.agreement.term}</b></div><div class="muted" style="font-size:12px">${d.kind === "Buyer" ? "Required before touring since the Aug 2024 NAR settlement. " : ""}Stored on the deal and used as the ceiling for the CDA.</div>`
              : html`<div>Tours are blocked until ${ofFirst(p.name)} signs.</div><button class="btn pri sm" style="align-self:flex-start" onClick=${() => openAgreement(p, d.listing, d)}>Send agreement</button>`}</div></div>
          <div class="card"><div class="hd"><h3>Checklist</h3><span class="sp"></span><span class="muted num">${d.checklist.filter(x => x[1]).length}/${d.checklist.length}</span></div><div class="bd">
            ${d.checklist.length ? d.checklist.map(x => html`<button class=${"chk" + (x[1] ? " ok" : "")} role="checkbox" aria-checked=${x[1]} onClick=${() => { up(() => { x[1] = !x[1]; recalc(); }); }}><i>${x[1] ? "✓" : ""}</i><span>${x[0]}</span></button>`) : html`<div class="muted" style="font-size:13px">No items yet. Add the first one below.</div>`}
            <div class="of-add"><input aria-label="New checklist item" placeholder="Add a checklist item" value=${ck} onInput=${e => setCk(e.target.value)} onKeyDown=${e => { if (e.key === "Enter" && ck.trim()) { up(() => { d.checklist.push([ck.trim(), false]); recalc(); }); setCk(""); } }} /><button class="btn sm" disabled=${!ck.trim()} onClick=${() => { up(() => { d.checklist.push([ck.trim(), false]); recalc(); }); setCk(""); }}>Add</button></div></div></div>
          <div class="card"><div class="hd"><h3>Parties</h3></div><div class="of-rows">${parties.map(([r, n, ph, to]) => html`<div class="of-party"><span class="lbl">${r}</span><div class="of-rt"><b>${to ? html`<a class="of-link" onClick=${() => go(to)}>${n}</a>` : n}</b><span>${ph || ""}</span></div></div>`)}</div>
            <div class="bd"><div class="row of-frow"><select class="of-sel" aria-label="Party role" value=${pty.role} onChange=${e => setPty({ ...pty, role: e.target.value })}>${["Lender", "Title", "Inspector", "Seller's agent", "Buyer's agent", "Attorney", "Co-buyer"].map(r => html`<option value=${r}>${r}</option>`)}</select><input class="of-in" aria-label="Party name" placeholder="Name · company" value=${pty.name} onInput=${e => { setPty({ ...pty, name: e.target.value }); setPtyErr(""); }} /><button class="btn sm" onClick=${() => { if (!pty.name.trim()) { setPtyErr("Add a name"); return; } up(() => { (S.d.of.parties[d.id] = S.d.of.parties[d.id] || []).push([pty.role, pty.name.trim(), ""]); }); setPty({ ...pty, name: "" }); toast(pty.role + " added to the file · they get their own portal view"); }}>Add party</button></div>${ptyErr && html`<em class="of-err">${ptyErr}</em>`}</div></div>
        </div>
        <div class="of-col">
          <div class="card"><div class="hd"><h3>Key dates</h3><span class="sp"></span>${nx ? ofDue(nx.n) : ""}</div><div class="bd dates">${d.dates.length ? d.dates.map(x => { const n = ofDays(x[1]); return html`<button class=${"d of-d" + (x[2] ? " ok" : "")} role="checkbox" aria-checked=${x[2]} onClick=${() => { up(() => { x[2] = !x[2]; }); if (x[2]) toast(x[0] + " marked done"); }}><i>${x[2] ? "✓" : ""}</i><span style="flex:1;text-align:left">${x[0]}</span><span class="muted num">${x[1]}</span>${!x[2] ? ofDue(n) : ""}</button>`; }) : html`<div class="muted" style="font-size:13px">No dates yet. Upload the contract or add them here.</div>`}
            <div class="of-add of-wrap"><input aria-label="Date name" placeholder="e.g. Survey due" value=${nd.label} onInput=${e => { setNd({ ...nd, label: e.target.value }); setNdErr(""); }} /><input type="date" aria-label="Date" min="2026-09-01" max="2027-06-30" value=${nd.on} onInput=${e => { setNd({ ...nd, on: e.target.value }); setNdErr(""); }} /><button class="btn sm" onClick=${addDate}>Add date</button></div>${ndErr && html`<em class="of-err">${ndErr}</em>`}</div></div>
          ${d.id === "D1" && !(d.docs.find(x => /Amendment/.test(x[0])) || [])[1]?.startsWith("Signed") ? html`<div class="ai"><div class="lbl">Assistant · from the Brooks WhatsApp thread</div><p style="margin:6px 0 10px">The buyers want a credit for a 14-year-old AC condenser. Draft a repair amendment asking for a <b>$4,500 credit</b> at closing?</p>
            <div class="row" style="flex-wrap:wrap"><button class="btn pri sm" onClick=${() => openSign(d, "Amendment: repairs / credit")}>Draft & send for signature</button><button class="btn sm ghost" onClick=${() => { up(() => { S.d.of.notes.push({ id: ofNewId("N", S.d.of.notes), person: p.id, deal: d.id, by: ofMe(), at: "Oct 8", text: "Assistant suggested a $4,500 AC credit amendment · parked for now." }); }); toast("Kept as a note on the file · nothing sent"); }}>Not now</button></div></div>` : ""}
          <div class="card"><div class="hd"><h3>Notes</h3><span class="sp"></span><span class="muted">${dnotes.length}</span></div><div class="bd of-notes">
            <textarea aria-label="Deal note" placeholder="Add a note for the file" value=${note} onInput=${e => setNote(e.target.value)}></textarea>
            <div class="row"><span style="flex:1"></span><button class="btn sm pri" disabled=${!note.trim()} onClick=${() => { up(() => { S.d.of.notes.push({ id: ofNewId("N", S.d.of.notes), person: p.id, deal: d.id, by: ofMe(), at: "Oct 8", text: note.trim() }); }); setNote(""); toast("Note added to the file"); }}>Save note</button></div>
            ${dnotes.map(n => html`<div class="of-note"><div class="row"><${Av} a=${A(n.by)} /><b style="font-size:13px">${A(n.by).name}</b><span class="muted" style="font-size:12px">${n.at}</span></div><p>${n.text}</p></div>`)}</div></div>
        </div></div>`}
      ${tab === "docs" && html`<div class="card"><div class="hd"><h3>Documents</h3><span class="sp"></span><input type="file" multiple ref=${fileRef} style="display:none" onChange=${upload} accept=".pdf,.doc,.docx,.jpg,.png" /><button class="btn sm pri" onClick=${() => fileRef.current.click()}><${OfI} n="up" s=${13} /> Upload</button></div>
        <div class="of-scroll"><table class="t"><thead><tr><th>Document</th><th>Status</th><th></th></tr></thead><tbody>
        ${docs.length ? docs.map(x => html`<tr><td><div class="row"><${OfChip} n="doc" /><span>${x[0]}</span></div></td><td>${docPill(x[1])}</td><td style="text-align:right"><div class="row" style="justify-content:flex-end;gap:6px">
          ${x[1] === "Signed" || x[1] === "Received" ? html`<button class="btn sm" onClick=${() => ofOpen("ofDoc", { deal: d.id, doc: x[0] })}>View</button>`
            : /Sent/.test(x[1]) ? html`<button class="btn sm" onClick=${() => { up(() => { const t = ofSay(p.id, "Reminder: “" + x[0] + "” is waiting for your signature. It takes a minute on your phone.", (ofThreadFor(p.id) || {}).channel); t.unread = t.unread; }); toast("Reminder sent to " + ofFirst(p.name)); }}>Remind</button><button class="btn sm ghost" title="Demo: simulates the client signing" onClick=${() => { up(() => { x[1] = "Signed"; }); toast(x[0] + " signed by " + ofFirst(p.name)); }}>Demo: client signs</button>`
            : html`<button class="btn sm pri" onClick=${() => openSign(d, x[0])}>Request e-sign</button>`}</div></td></tr>`)
          : html`<tr><td colspan="3"><${OfEmpty} icon="doc" title="No documents yet" sub="Upload the contract and we'll read the dates and parties from it." /></td></tr>`}
      </tbody></table></div></div>`}
      ${tab === "money" && html`<div class="grid2 of-g2"><div class="card"><div class="hd"><h3>Commission</h3><span class="sp"></span><span class=${"pill " + (/approved|paid|processed/i.test(c.status) ? "g" : "a")}>${c.status}</span></div><div class="bd sheet">
        <div class="ln"><span>Sale price</span><span>${usd(d.price)}</span></div><div class="ln"><span>Agent pay (${d.comp}%, per agreement)</span><span>${usd(c.gross)}</span></div>
        ${c.brokerage ? html`<div class="ln neg"><span>Brokerage split (${100 - c.splitPct}%)</span><span>−${usd(c.brokerage)}</span></div>` : html`<div class="ln"><span>Brokerage split</span><span>${c.splitPct}/${100 - c.splitPct}</span></div>`}
        ${(c.fees || []).map(([k, v]) => html`<div class="ln neg"><span>${k}</span><span>−${usd(v)}</span></div>`)}
        <div class="ln tot"><span>${A(d.agent).name} takes home</span><span>${usd(c.net)}</span></div>
        <div class="muted" style="font-size:12px;margin-top:8px">${c.capped ? "Agent has capped: post-cap fees only. " : ""}${c.src === "Back office" ? "From the agent's commission plan in Back office." : "Default 70/30 plan with a $395 transaction fee."}</div></div>
        ${(() => { const links = [hasTx && ofCan("compliance") && ["Compliance review", "compliance/" + d.id], hasTx && ofCan("commissions") && ["CDA builder", "commissions/cda"], hasTx && ofCan("trust") && ["Earnest money ledger", "trust"]].filter(Boolean); return links.length ? html`<div class="bd row" style="gap:8px;flex-wrap:wrap;border-top:1px solid var(--line)">${links.map(([t, r]) => html`<button class="btn sm" onClick=${() => go(r)}>${t} →</button>`)}</div>` : ""; })()}</div>
        <div class="card"><div class="hd"><h3>Earnest money</h3>${emd ? html`<span class="sp"></span><span class=${"pill " + (emd.status === "Received" || emd.status === "Released" ? "g" : "a")}>${emd.status}</span>` : ""}</div><div class="bd of-kv">${emd ? html`<div><span>Amount</span><b class="num">${usd(emd.amount)}</b></div><div><span>Method</span><b>${emd.method}</b></div><div><span>Note</span><b>${emd.note || "—"}</b></div>` : html`<div class="muted">No earnest money yet. It's due within 3 days of an executed contract.</div>`}</div></div></div>`}
      ${tab === "activity" && html`<div class="card"><div class="bd tl">${(() => { const acts = S.d.activity.filter(a => a[0] === p.id && (a[2].includes(l.addr) || a[1] === "Deals")).map(a => [a[3], a[2], a[1]]).concat(dnotes.map(n => [n.at, n.text, "Note"])); return acts.length ? acts.map(a => html`<div class="it"><span class="muted num" style="font-size:12px">${a[0]}</span><span class="dot"></span><div>${a[1]}</div><span class="pill">${a[2]}</span></div>`) : html`<${OfEmpty} title="No activity on this file yet" />`; })()}</div></div>`}
    </div></${Shell}>`;
}

function OfDealModal({ m, close }) {
  const who = ofMe();
  const [f, setF] = useState({ kind: m.dealKind || "Buyer", person: m.person || "", listing: m.listing || "", price: m.listing ? L(m.listing).price : "", agent: ["jordan", "priya", "sam", "maya"].includes(who) ? who : "jordan", stage: "New lead", comp: "2.5", close: "", signed: false });
  const [err, setErr] = useState({});
  const set = (k, v) => { const n = { ...f, [k]: v }; if (k === "listing" && v) n.price = L(v).price; setF(n); setErr({ ...err, [k]: "" }); };
  const dup = f.person && f.listing && S.d.deals.find(d => d.person === f.person && d.listing === f.listing && d.kind === f.kind && d.stage !== "Closed");
  function save() {
    const e = {}, price = +String(f.price).replace(/[^\d.]/g, ""), comp = +f.comp;
    if (!f.person) e.person = "Choose who this deal is for";
    if (!f.listing) e.listing = "Choose the property";
    if (!price || price < 10000) e.price = "Enter a price, e.g. 895000";
    if (isNaN(comp) || comp < 0 || comp > 6) e.comp = "Between 0% and 6%";
    if ((f.stage === "Under contract") && !f.close) e.close = "Under-contract deals need a closing date";
    if (f.kind === "Buyer" && f.stage !== "New lead" && !f.signed) e.stage = "Buyers need a signed agreement before touring";
    if (dup) e.listing = "There's already an open deal for this person and home";
    setErr(e); if (Object.keys(e).length) return;
    const id = ofNewId("D", S.d.deals), cl = f.close ? ofFmt(new Date(f.close + "T12:00:00")) : "—";
    const checklist = f.kind === "Buyer" ? [["Buyer agreement signed", f.signed], ["Pre-approval letter", false], ["Executed contract", f.stage === "Under contract"], ["Earnest money receipt", false], ["Inspection report", false], ["Appraisal", false], ["Title commitment", false], ["Closing disclosure", false]] : [["Listing agreement", true], ["Seller disclosure", false], ["Photos & 3D tour", false], ["Net sheet shared", false], ["Offer review", false]];
    up(s => {
      s.d.deals.push({ id, kind: f.kind, person: f.person, listing: f.listing, stage: f.stage, price, agent: f.agent, comp, close: cl, progress: checklist.filter(x => x[1]).length / checklist.length,
        agreement: f.kind === "Listing" || f.signed ? { signed: true, on: "Oct 8", comp: comp + "%", term: f.kind === "Listing" ? "6 months" : "90 days" } : { signed: false },
        dates: cl !== "—" ? [["Closing", cl, false]] : [], checklist, docs: f.kind === "Buyer" ? [["Buyer representation agreement", f.signed ? "Signed" : "Draft"]] : [["Listing agreement", "Signed"]] });
      const p = s.d.people.find(x => x.id === f.person); if (p && !p.roles.includes(f.kind === "Buyer" ? "Buyer" : "Seller")) p.roles.push(f.kind === "Buyer" ? "Buyer" : "Seller");
      s.d.activity.push([f.person, "Deals", "New " + f.kind.toLowerCase() + " deal on " + L(f.listing).addr + " · " + f.stage, "Oct 8"]);
      s.modal = null;
    });
    if (f.agent !== who) ofNotify(f.agent, "New deal assigned: " + L(f.listing).addr, "deal/" + id);
    toast("Deal created · " + L(f.listing).addr, ["Open board", () => go("pipeline")]);
    go("deal/" + id);
  }
  return html`<${OfModal} title="New deal" sub="One file from first tour to close: agreement, dates, docs and pay." close=${close}
    foot=${html`<button class="btn" onClick=${close}>Cancel</button><button class="btn pri" onClick=${save}>Create deal</button>`}>
    <${OfSeg} label="Deal type" value=${f.kind} set=${v => set("kind", v)} opts=${[["Buyer", "Buyer side"], ["Listing", "Listing side"]]} />
    <div class="row of-frow"><${OfField} grow label=${f.kind === "Buyer" ? "Buyer" : "Seller"} err=${err.person}><select value=${f.person} onChange=${e => { if (e.target.value === "__new") { ofOpen("ofPerson", { role: f.kind === "Buyer" ? "Buyer" : "Seller" }); return; } set("person", e.target.value); }}><option value="">Choose a person…</option>${ofPeopleOpts()}<option value="__new">+ Add a new person</option></select></${OfField}>
      <${OfField} grow label="Property" err=${err.listing}><select value=${f.listing} onChange=${e => set("listing", e.target.value)}><option value="">Choose a home…</option>${S.d.listings.map(l => html`<option value=${l.id}>${l.addr} · ${short(l.price)}</option>`)}</select></${OfField}></div>
    <div class="row of-frow"><${OfField} grow label="Price" err=${err.price}><input inputmode="numeric" value=${f.price} onInput=${e => set("price", e.target.value)} /></${OfField}>
      <${OfField} grow label="Agent pay %" err=${err.comp}><input inputmode="decimal" value=${f.comp} onInput=${e => set("comp", e.target.value)} /></${OfField}>
      <${OfField} grow label="Agent"><select value=${f.agent} onChange=${e => set("agent", e.target.value)}>${ofAgentOpts(["maya", "jordan", "priya", "sam"])}</select></${OfField}></div>
    <div class="row of-frow"><${OfField} grow label="Stage" err=${err.stage}><select value=${f.stage} onChange=${e => set("stage", e.target.value)}>${S.d.stages.filter(s => s !== "Closed").map(s => html`<option value=${s}>${s}</option>`)}</select></${OfField}>
      <${OfField} grow label="Expected closing" err=${err.close} hint="Optional until under contract"><input type="date" min="2026-10-08" value=${f.close} onInput=${e => set("close", e.target.value)} /></${OfField}></div>
    ${f.kind === "Buyer" ? html`<label class="of-check"><input type="checkbox" checked=${f.signed} onChange=${e => set("signed", e.target.checked)} /><span>Buyer agreement already signed (otherwise we'll draft one and block tours until it's signed)</span></label>` : ""}
  </${OfModal}>`;
}

function AgreementModal({ m, close }) {
  const l = L(m.listingId), fromSite = !m.person;
  const [name, setName] = useState(fromSite ? "Chris & Dana Morgan" : m.person.name), [phone, setPhone] = useState(fromSite ? "(512) 555-0199" : m.person.phone), [comp, setComp] = useState("2.5"), [signed, setSigned] = useState(false), [err, setErr] = useState({});
  function done() {
    const e = {}; if (!name.trim()) e.name = "Enter your name"; if (ofDigits(phone).length < 10) e.phone = "Enter a 10-digit mobile"; if (!(+comp >= 0 && +comp <= 6)) e.comp = "0–6%";
    setErr(e); if (Object.keys(e).length) return;
    if (fromSite) {
      let tid;
      up(s => {
        const id = ofNewId("P", s.d.people), agent = l.agent === "maya" ? "jordan" : l.agent;
        tid = ofNewId("T", s.d.threads);
        s.d.people.unshift({ id, name, short: name.split(" ").pop(), ini: ofIni(name), phone, email: "", owner: agent, source: "Website · tour request", stage: "Touring", tags: ["Buyer", "Agreement signed"], roles: ["Buyer"], score: 71, last: "now", consent: { SMS: "in", WhatsApp: "unknown", Email: "unknown", note: "Website tour form · one-to-one consent to Harbor & Vine · Oct 8" } });
        s.d.threads.unshift({ id: tid, person: id, channel: "SMS", unread: 1, when: "now", subject: l.addr, assignee: agent, snooze: null, closed: false, msgs: [{ from: "them", text: "Requested a tour of " + l.addr + " · " + m.when + (m.mode === "video" ? " (video)" : ""), at: "now", ch: "Website" }, { from: "ai", text: "You're booked for " + m.when + " with " + A(l.agent).name + ". Your signed buyer agreement is in your client portal.", at: "now", ch: "SMS", note: "Sent automatically · tour added to the agent's calendar" }] });
        s.d.deals.push({ id: ofNewId("D", s.d.deals), kind: "Buyer", person: id, listing: l.id, stage: "Touring", price: l.price, agent: l.agent, comp: +comp, close: "—", progress: 0.1, agreement: { signed: true, on: "Oct 8", comp: comp + "%", term: "90 days" }, dates: [["Tour", m.when, false]], checklist: [["Buyer agreement signed", true], ["Pre-approval letter", false]], docs: [["Buyer representation agreement", "Signed"]] });
        s.d.of.tours.push({ id: ofNewId("TR", s.d.of.tours), person: id, listing: l.id, agent, at: (m.when || "").split(" · ").pop() || "TBD", day: (m.when || "").split(" · ")[0] || "Soon", mode: m.mode === "video" ? "Video" : "In person", status: "Confirmed" });
        s.modal = null;
      });
      ofNotify(l.agent === "maya" ? "jordan" : l.agent, name + " booked a tour of " + l.addr, "inbox/" + tid);
      toast("Tour booked · " + ofFirst(name) + " is now a lead, a deal and an inbox thread", ["Open inbox", () => go("inbox/" + tid)]);
    } else {
      up(s => {
        if (m.deal) { m.deal.agreement = { signed: true, on: "Oct 8", comp: comp + "%", term: "90 days" }; if (m.deal.stage === "New lead") m.deal.stage = "Touring"; const c = m.deal.checklist.find(x => /agreement/i.test(x[0])); if (c) c[1] = true; const dc = m.deal.docs.find(x => /representation/i.test(x[0])); if (dc) dc[1] = "Signed"; else m.deal.docs.push(["Buyer representation agreement", "Signed"]); }
        const t = ofThreadFor(m.person.id); if (t) t.msgs.push({ from: "me", text: "Buyer agreement signed · " + comp + "% · see you at the tour!", at: "now", ch: t.channel });
        S.d.of.tours.filter(x => x.person === m.person.id && x.status === "Agreement needed").forEach(x => { x.status = "Confirmed"; });
        S.d.of.tasks.filter(x => x.person === m.person.id && /agreement/i.test(x.t)).forEach(x => { x.done = true; });
        s.d.activity.push([m.person.id, "CRM", "Signed buyer agreement · " + comp + "%", "Oct 8"]);
        s.modal = null;
      });
      toast("Agreement sent and signed on " + ofFirst(m.person.name) + "'s phone · tour confirmed", m.deal ? ["Open deal", () => go("deal/" + m.deal.id)] : null);
    }
  }
  return html`<${OfModal} title=${fromSite ? "Before your tour" : "Buyer agreement"} close=${close}
    foot=${html`<button class="btn" onClick=${close}>Cancel</button><button class="btn pri" disabled=${!signed} title=${signed ? "" : "Sign first"} onClick=${done}>${fromSite ? "Book my tour" : "Send & confirm"}</button>`}>
      ${fromSite && html`<div style="font-size:13px;color:var(--ink-2)">Texas requires a short buyer agreement before touring. It takes a minute, and you set how your agent is paid.</div>`}
      <div class="row of-frow"><${OfField} grow label="Your name" err=${err.name}><input value=${name} onInput=${e => setName(e.target.value)} /></${OfField}><${OfField} grow label="Mobile" err=${err.phone}><input value=${phone} onInput=${e => setPhone(e.target.value)} /></${OfField}></div>
      <div class="doc"><h4>Buyer representation agreement</h4><div>${name} appoints Harbor & Vine Realty (${A(l.agent === "maya" ? "jordan" : l.agent).name}) to represent them in buying a home in Austin, TX, for <b>90 days</b>.</div>
        <div class="row" style="flex-wrap:wrap"><span>Agent pay:</span><input aria-label="Agent pay percent" style="width:64px;border:1px solid var(--line-2);border-radius:6px;padding:4px 6px" value=${comp} onInput=${e => setComp(e.target.value)} /><span>% of the price, paid from the seller's offer first, then by you.</span>${err.comp && html`<em class="of-err">${err.comp}</em>`}</div>
        <div style="font-size:11.5px">You can tour, ask questions and cancel any time with 7 days' notice.</div></div>
      <div class="sig">${signed ? html`<span class="ink">${name.split(" & ")[0]}</span>` : html`<span class="muted">Tap to sign</span>`}<button class="btn sm brass" onClick=${() => setSigned(true)}>${signed ? "Signed ✓" : "Sign here"}</button></div>
      ${fromSite && html`<div style="font-size:12.5px"><b>${l.addr}</b> · ${m.when}${m.mode === "video" ? " · video" : ""}</div>`}
  </${OfModal}>`;
}
function SignModal({ m, close }) {
  const d = m.deal, p = P(d.person), l = L(d.listing), signers = ofSigners(p), amend = /Amendment/.test(m.docName);
  const [sig, setSig] = useState({}), [mode, setMode] = useState("now");
  const all = signers.every(s => sig[s]);
  function done() {
    up(s => {
      const doc = d.docs.find(x => x[0] === m.docName), st = mode === "now" ? "Signed" : "Sent for signature";
      if (doc) doc[1] = st; else d.docs.push([m.docName, st]);
      if (mode === "now" && amend) { const c = d.checklist.find(x => x[0] === "Repair amendment"); if (c) c[1] = true; const dt = d.dates.find(x => x[0] === "Inspection response"); if (dt) dt[2] = true; }
      d.progress = d.checklist.filter(x => x[1]).length / (d.checklist.length || 1);
      const t = ofThreadFor(p.id);
      if (t) t.msgs.push({ from: "me", text: mode === "now" ? (amend ? "Done: the amendment asking for a $4,500 credit is signed by both of you and sent to the seller's agent." : "Done: “" + m.docName + "” is signed. A copy is in your portal.") : "Please sign “" + m.docName + "” for " + l.addr + ". It takes a minute on your phone.", at: "now", ch: t.channel });
      s.d.activity.push([p.id, "Deals", (mode === "now" ? "Signed: " : "Sent for e-sign: ") + m.docName + " · " + l.addr, "Oct 8"]);
      s.modal = null;
    });
    if (mode === "now" && amend) ofNotify("nina", "Repair amendment signed on " + l.addr, "deal/" + d.id);
    toast(mode === "now" ? "Signed by " + signers.length + " · " + (amend ? "sent to the seller's agent · checklist updated" : "filed on the deal") : "Sent to " + signers.join(" and ") + " for e-signature", ["Open documents", () => go("deal/" + d.id)]);
  }
  return html`<${OfModal} title=${m.docName} sub=${l.addr + " · " + p.name} close=${close}
    foot=${html`<button class="btn" onClick=${close}>Cancel</button><button class="btn pri" disabled=${mode === "now" && !all} title=${mode === "now" && !all ? "Every signer must sign" : ""} onClick=${done}>${mode === "now" ? "Complete & send" : "Send for e-sign"}</button>`}>
    <div class="doc"><h4>${amend ? "Amendment to contract" : m.docName}</h4><div>${amend ? html`Property: ${l.addr}. Seller to credit Buyer <b>$4,500</b> at closing in lieu of repairs to the HVAC condenser. All other terms unchanged.` : html`Property: ${l.addr}. ${p.name} and Harbor & Vine Realty (${A(d.agent).name}). Please review every page; initials are requested where marked.`}</div><div style="font-size:11.5px">${amend ? "Drafted by the assistant from the inspection report and the buyers' WhatsApp message; reviewed by " + A(d.agent).name + "." : "Prepared by " + A(d.agent).name + " from the deal file."}</div></div>
    <${OfSeg} label="How to sign" value=${mode} set=${setMode} opts=${[["now", "Sign together now"], ["send", "Send to their phones"]]} />
    ${mode === "now" ? html`<div class="lbl">Signers</div>${signers.map(s => html`<div class="sig">${sig[s] ? html`<span class="ink">${s}</span>` : html`<span class="muted">${s}</span>`}<button class="btn sm brass" onClick=${() => setSig({ ...sig, [s]: true })}>${sig[s] ? "Signed ✓" : "Sign"}</button></div>`)}`
      : html`<div class="of-kv">${signers.map(s => html`<div><span>${s}</span><b>${p.phone} · ${p.consent && p.consent.SMS === "out" ? "by email" : "by text"}</b></div>`)}</div><div class="muted" style="font-size:12px">They get a secure link; you'll see it flip to signed on the file.</div>`}
  </${OfModal}>`;
}
function OfDocModal({ m, close }) {
  const d = S.d.deals.find(x => x.id === m.deal), l = L(d.listing), p = P(d.person);
  return html`<${OfModal} title=${m.doc} sub=${l.addr + " · " + p.name} close=${close} foot=${html`<button class="btn" onClick=${() => { toast("Copy emailed to " + (p.email || "the client")); }}>Email a copy</button><button class="btn pri" onClick=${close}>Close</button>`}>
    <div class="doc of-docview"><h4>${m.doc}</h4><div>Parties: ${p.name} · Harbor & Vine Realty (${A(d.agent).name})</div><div>Property: ${l.addr}, Austin, TX · ${usd(d.price)}</div><div class="of-lines">${[1, 2, 3, 4, 5, 6].map(i => html`<i style=${"width:" + (60 + (i * 17) % 38) + "%"}></i>`)}</div><div style="font-size:11.5px">Signed electronically · audit trail with IP and timestamps on file.</div></div>
  </${OfModal}>`;
}

// ================= LISTINGS + LISTING =================
const OF_LSTATUS = ["Coming soon", "Active", "Under contract", "Sold", "Withdrawn"];
const ofLPill = (s) => html`<span class=${"pill " + ({ Active: "g", "Coming soon": "br", "Under contract": "f", Sold: "", Withdrawn: "r" }[s] || "")}>${s}</span>`;
const OF_FH = [["family-friendly", "great for gatherings"], ["perfect for young professionals", "close to downtown offices"], ["master", "primary"], ["bachelor", "studio"], ["safe neighborhood", "quiet street"], ["no kids", "(remove)"], ["exclusive community", "gated community"], ["christian", "(remove)"]];
const ofFhFlags = (txt) => OF_FH.filter(([w]) => new RegExp("\\b" + w + "\\b", "i").test(txt || ""));
function Listings() {
  const who = ofMe(), hasMine = S.d.listings.some(l => l.agent === who);
  const [scope, setScope] = useState(hasMine && !ofSeesAll() ? "mine" : "all"), [st, setSt] = useState("All"), [q, setQ] = useState(""), [view, setView] = useState(S.ofLView || "grid"), [sort, setSort] = useState("new");
  const rows = S.d.listings.filter(l => (scope === "all" || l.agent === who) && (st === "All" || l.status === st) && (!q || (l.addr + " " + l.area + " " + l.type).toLowerCase().includes(q.toLowerCase())))
    .sort((a, b) => sort === "price" ? b.price - a.price : sort === "dom" ? b.dom - a.dom : sort === "views" ? b.views - a.views : a.dom - b.dom);
  const setV = (v) => { S.ofLView = v; setView(v); };
  return html`<${Shell} title="Listings" sub=${scope === "mine" ? "Your listings, their marketing and where they're shown" : "Every listing in the brokerage"} actions=${html`<div class="row of-hact"><button class="btn" onClick=${() => go("site")}><span class="of-hide-s">View public site</span><span class="of-show-s">Site</span></button><button class="btn pri" onClick=${() => ofOpen("ofListing")}><${OfI} n="plus" s=${14} /> New listing</button></div>`}>
    <div class="page">
      <div class="of-toolbar">
        ${hasMine ? html`<${OfSeg} label="Whose listings" value=${scope} set=${setScope} opts=${[["mine", "Mine"], ["all", "All"]]} />` : ""}
        <select class="of-sel" aria-label="Status" value=${st} onChange=${e => setSt(e.target.value)}><option value="All">All statuses</option>${OF_LSTATUS.map(s => html`<option value=${s}>${s}</option>`)}</select>
        <select class="of-sel" aria-label="Sort" value=${sort} onChange=${e => setSort(e.target.value)}><option value="new">Newest</option><option value="price">Price</option><option value="dom">Days on market</option><option value="views">Views</option></select>
        <label class="of-q grow"><${Ic} n="search" s=${14} /><input aria-label="Search listings" placeholder="Search address, area, type" value=${q} onInput=${e => setQ(e.target.value)} /></label>
        <${OfSeg} label="View" value=${view} set=${setV} opts=${[["grid", html`<${OfI} n="grid" s=${14} /><span class="sr">Grid</span>`], ["table", html`<${OfI} n="rows" s=${14} /><span class="sr">Table</span>`]]} />
      </div>
      ${!rows.length ? html`<${OfEmpty} icon="listings" title="No listings match" action=${html`<button class="btn sm" onClick=${() => { setSt("All"); setQ(""); setScope("all"); }}>Clear filters</button>`} />`
      : view === "grid" ? html`<div class="of-lgrid">${rows.map(l => html`<button class="of-lcard" onClick=${() => go("listing/" + l.id)}><div class="of-lim" style=${"background-image:url(" + img(l.img) + ")"}>${ofLPill(l.status)}${ofOffers(l.id).length ? html`<span class="of-badge">${ofOffers(l.id).length} offers</span>` : ""}</div>
          <div class="of-lbd"><b class="num">${usd(l.price)}</b><span>${l.beds} bd · ${l.baths} ba · ${l.sqft.toLocaleString()} sqft</span><span class="muted">${l.addr} · ${l.area}</span>
          <div class="row of-lmeta"><${Av} a=${A(l.agent)} /><span class="muted">${l.dom} days · ${l.views} views</span></div></div></button>`)}</div>`
      : html`<div class="card"><div class="of-scroll"><table class="t"><thead><tr><th></th><th>Address</th><th>Price</th><th>Status</th><th>Days</th><th>Views</th><th>Agent</th><th>Shown on</th></tr></thead><tbody>
        ${rows.map(l => html`<tr class="click" onClick=${() => go("listing/" + l.id)}><td><img class="thumb" src=${img(l.img)} alt="" /></td><td><b>${l.addr}</b><div class="muted" style="font-size:12px">${l.area} · ${l.beds} bd · ${l.baths} ba</div></td><td class="num">${usd(l.price)}</td><td>${ofLPill(l.status)}</td><td class="num">${l.dom}</td><td class="num">${l.views}</td><td>${A(l.agent).name}</td><td class="muted" style="font-size:12px">${{ office: "Office only", soon: "Our site (teaser)", public: "Site · MLS · portals" }[l.dist] || "Site · MLS · portals"}</td></tr>`)}
      </tbody></table></div></div>`}
    </div></${Shell}>`;
}

function Listing() {
  const l = L(S.route.id);
  const [edit, setEdit] = useState(false), [f, setF] = useState({}), [err, setErr] = useState({});
  const [price, setPrice] = useState(l ? l.price : 0), [payoff, setPayoff] = useState(612000), [lc, setLc] = useState(2.5), [bc, setBc] = useState(2.5), [conc, setConc] = useState(0);
  const [copy, setCopy] = useState(l ? l.desc || "" : ""), [gen, setGen] = useState(false);
  const fileRef = useRef();
  if (!l) return html`<${Shell} title="Listing not found"><div class="page"><${OfEmpty} icon="listings" title="This listing doesn't exist" action=${html`<button class="btn pri" onClick=${() => go("listings")}>Back to listings</button>`} /></div></${Shell}>`;
  const seller = S.d.deals.find(d => d.listing === l.id && d.kind === "Listing" && d.stage !== "Closed");
  const sp = seller && P(seller.person);
  const offers = ofOffers(l.id);
  const title = price * 0.0058, tax = price * 0.018 * (9 / 12) * 0.25, misc = 1850;
  const net = price - payoff - price * lc / 100 - price * bc / 100 - title - tax - misc - conc;
  const desc = `Light pours through floor-to-ceiling glass in this ${l.beds}-bed, ${l.baths}-bath ${l.type.toLowerCase()} in ${l.area}. The open kitchen flows to a covered terrace, the primary suite has a spa bath, and there's a flexible study for working from home. ${l.lot !== "—" ? "On a " + l.lot + " lot, " : ""}minutes from Lady Bird Lake and some of Austin's most sought-after schools.`;
  const flags = ofFhFlags(copy);
  const media = [l.img, ...l.gallery], hidden = l.hiddenPhotos || [];
  function startEdit() { setF({ price: String(l.price), beds: String(l.beds), baths: String(l.baths), sqft: String(l.sqft), year: String(l.year), hoa: String(l.hoa), tag: l.tag }); setErr({}); setEdit(true); }
  function save() {
    const n = (k) => +String(f[k]).replace(/[^\d.]/g, ""), e = {};
    if (!(n("price") >= 50000)) e.price = "Enter a price of at least $50,000";
    if (!(Number.isInteger(n("beds")) && n("beds") >= 0 && n("beds") <= 12)) e.beds = "0–12 bedrooms";
    if (!(n("baths") >= 1 && n("baths") <= 12 && n("baths") * 2 % 1 === 0)) e.baths = "1–12, in halves";
    if (!(n("sqft") >= 300 && n("sqft") <= 20000)) e.sqft = "300–20,000 sqft";
    if (!(n("year") >= 1850 && n("year") <= 2027)) e.year = "1850–2027";
    if (!(n("hoa") >= 0 && String(f.hoa).trim() !== "")) e.hoa = "0 or more";
    if (!f.tag.trim()) e.tag = "Add a short card tag";
    setErr(e); if (Object.keys(e).length) return;
    const old = l.price;
    up(() => { l.price = n("price"); l.beds = n("beds"); l.baths = n("baths"); l.sqft = n("sqft"); l.year = n("year"); l.hoa = n("hoa"); l.tag = f.tag.trim();
      if (old !== l.price) { S.d.deals.filter(d => d.listing === l.id && (d.stage === "New lead" || d.stage === "Touring" || d.kind === "Listing") && d.stage !== "Closed" && d.stage !== "Under contract").forEach(d => { d.price = l.price; }); if (sp) ofLog(sp.id, "Listings", "Price " + (l.price < old ? "reduced" : "raised") + " on " + l.addr + ": " + usd(old) + " → " + usd(l.price)); } });
    setEdit(false); setPrice(l.price);
    toast(old !== l.price ? "Saved · new price " + usd(l.price) + " is live on the site, MLS and portals" : "Listing saved · syndicated in about 5 minutes");
  }
  function setStatus(v) {
    const doIt = () => { up(() => { l.status = v; if (v === "Active" && l.dist === "soon") l.dist = "public"; if (v === "Withdrawn") l.dist = "office"; if (sp) ofLog(sp.id, "Listings", l.addr + " is now " + v); }); toast(l.addr + " is now " + v + (v === "Active" ? " · live on the site, MLS and portals" : "")); };
    if (v === "Sold" || v === "Withdrawn") ofOpen("ofConfirm", { title: (v === "Sold" ? "Mark as sold?" : "Withdraw this listing?"), body: v === "Sold" ? "It comes off the public site and moves to recent sales. The listing deal stays open until you close it." : "It's removed from the site, MLS and portals. Showings are cancelled and the sellers are notified.", okLabel: v === "Sold" ? "Mark sold" : "Withdraw", danger: v === "Withdrawn", onOk: doIt });
    else doIt();
  }
  function genAi() { setGen(true); setTimeout(() => { setGen(false); setCopy(desc); }, 550); }
  function saveCopy(publish) {
    if (!copy.trim()) { toast("Write or generate a description first"); return; }
    if (publish && flags.length) { toast("Fix the flagged phrases before publishing"); return; }
    up(() => { l.desc = copy.trim(); if (publish) l.descLive = true; if (S.d.slComp && S.d.slComp[l.id]) S.d.slComp[l.id].copy = l.desc; });
    toast(publish ? "Description published to the site, MLS and portals" : "Draft saved");
  }
  function addPhotos(e) { const fs = [...(e.target.files || [])]; if (!fs.length) return; up(() => { l.uploads = (l.uploads || []).concat(fs.map(x => ({ name: x.name, url: URL.createObjectURL(x) }))); }); e.target.value = ""; toast(fs.length + " photo" + (fs.length > 1 ? "s" : "") + " uploaded · resized for MLS (2048px) and checked for alterations"); }
  return html`<${Shell} title=${l.addr} sub=${l.area + " · listed by " + A(l.agent).name}
    actions=${html`<div class="row of-hact"><select class="of-sel" aria-label="Listing status" value=${l.status} onChange=${e => setStatus(e.target.value)}>${OF_LSTATUS.map(s => html`<option value=${s}>${s}</option>`)}</select><button class="btn" onClick=${() => go("site/" + l.id)}><span class="of-hide-s">See it on the site</span><span class="of-show-s">Site</span></button></div>`}>
    <div class="page">
      <${OfBack} to="listings" label="Listings" />
      <div class="split">
        <div class="of-col">
          <div class="card of-media"><div class="hd"><h3>Photos</h3><span class="muted">${media.length - hidden.length} shown · ${(l.uploads || []).length} new</span><span class="sp"></span><input type="file" accept="image/*" multiple ref=${fileRef} style="display:none" onChange=${addPhotos} /><button class="btn sm" onClick=${() => fileRef.current.click()}><${OfI} n="up" s=${13} /> Add photos</button></div>
            <div class="bd of-mgrid">${media.map((n, i) => html`<div class=${"of-ph" + (i === 0 ? " cover" : "") + (hidden.includes(n) ? " off" : "")}><img src=${img(n)} alt=${"Photo " + (i + 1) + " of " + l.addr} />${i === 0 ? html`<span class="of-cover">Cover</span>` : ""}
              <div class="of-phact">${i > 0 ? html`<button class="btn sm" title="Make this the cover photo" onClick=${() => up(() => { const gi = i - 1, c = l.img; l.img = l.gallery[gi]; l.gallery[gi] = c; })}>Make cover</button>` : ""}${i > 0 ? html`<button class="btn sm" title=${hidden.includes(n) ? "Show on site and MLS" : "Hide from site and MLS"} onClick=${() => up(() => { l.hiddenPhotos = hidden.includes(n) ? hidden.filter(x => x !== n) : hidden.concat(n); })}>${hidden.includes(n) ? "Show" : "Hide"}</button>` : ""}</div></div>`)}
              ${(l.uploads || []).map(u => html`<div class="of-ph"><img src=${u.url} alt=${u.name} /><span class="of-cover pend">Processing</span><div class="of-phact"><button class="btn sm" onClick=${() => up(() => { l.uploads = l.uploads.filter(x => x !== u); })}>Remove</button></div></div>`)}</div></div>
          <div class="card"><div class="hd"><h3>Details</h3><span class="sp"></span>${edit ? html`<button class="btn sm" onClick=${() => setEdit(false)}>Cancel</button><button class="btn sm pri" onClick=${save}>Save</button>` : html`<button class="btn sm" onClick=${startEdit}><${OfI} n="pen" s=${12} /> Edit</button>`}</div>
            <div class="bd">${edit ? html`<div class="of-fgrid" onKeyDown=${e => { if (e.key === "Enter") save(); if (e.key === "Escape") setEdit(false); }}>
                ${[["price", "List price"], ["beds", "Bedrooms"], ["baths", "Bathrooms"], ["sqft", "Living area (sqft)"], ["year", "Year built"], ["hoa", "HOA / month"]].map(([k, lab]) => html`<${OfField} label=${lab} err=${err[k]}><input inputmode="decimal" value=${f[k]} onInput=${e => { setF({ ...f, [k]: e.target.value }); setErr({ ...err, [k]: "" }); }} /></${OfField}>`)}
                <${OfField} label="Card tag" err=${err.tag}><input value=${f.tag} maxlength="32" onInput=${e => { setF({ ...f, tag: e.target.value }); setErr({ ...err, tag: "" }); }} /></${OfField}></div>`
              : html`<div class="of-facts">${[["List price", usd(l.price)], ["Beds", l.beds], ["Baths", l.baths], ["Sqft", l.sqft.toLocaleString()], ["Lot", l.lot], ["Year", l.year], ["HOA", l.hoa ? usd(l.hoa) + "/mo" : "None"], ["Type", l.type], ["Tag", l.tag]].map(([k, v]) => html`<div><span>${k}</span><b class="num">${v}</b></div>`)}</div>`}</div></div>
          <div class="card"><div class="hd"><h3>Listing description</h3><span class="sp"></span>${l.descLive ? html`<span class="pill g">Published</span>` : l.desc ? html`<span class="pill a">Draft</span>` : ""}<button class="btn sm" disabled=${gen} onClick=${genAi}><${Ic} n="spark" s=${13} /> ${copy ? "Rewrite with AI" : "Write with AI"}</button></div><div class="bd of-notes">
            ${gen ? html`<div class="of-skel"></div><div class="of-skel"></div><div class="of-skel" style="width:60%"></div>` : html`<textarea aria-label="Listing description" style="min-height:120px" placeholder="Write it yourself, or let the assistant draft it from the photos and facts" value=${copy} onInput=${e => setCopy(e.target.value)}></textarea>`}
            ${flags.length ? html`<div class="of-warn" role="alert"><b>Fair-housing check:</b> ${flags.map(([w, s]) => html`<span class="of-flag">“${w}” <button class="btn sm ghost" onClick=${() => setCopy(copy.replace(new RegExp("\\b" + w + "\\b", "ig"), s === "(remove)" ? "" : s))}>${s === "(remove)" ? "Remove" : "Use “" + s + "”"}</button></span>`)}</div>` : copy ? html`<div class="muted" style="font-size:12px">✓ Passed the fair-housing check · ${copy.trim().split(/\s+/).length} words</div>` : ""}
            <div class="row"><span style="flex:1"></span><button class="btn sm" onClick=${() => saveCopy(false)}>Save draft</button><button class="btn sm pri" disabled=${!!flags.length || !copy.trim()} title=${flags.length ? "Fix flagged phrases first" : ""} onClick=${() => saveCopy(true)}>Publish</button></div></div></div>
          ${seller ? html`<div class="card"><div class="hd"><h3>Seller net sheet</h3><span class="sp"></span><span class="pill f">Shared live with ${sp.short === "Grant" ? "the Grants" : sp.name}</span></div><div class="bd of-net">
            <div class="of-col" style="gap:10px">
              <label class="field"><span>Sale price · ${usd(price)}</span><input type="range" min=${Math.round(l.price * .9)} max=${Math.round(l.price * 1.1)} step="5000" value=${price} onInput=${e => setPrice(+e.target.value)} /></label>
              <label class="field"><span>Mortgage payoff</span><input type="number" value=${payoff} onInput=${e => setPayoff(+e.target.value || 0)} /></label>
              <div class="row"><label class="field" style="flex:1"><span>Listing agent %</span><input type="number" step="0.25" value=${lc} onInput=${e => setLc(+e.target.value || 0)} /></label><label class="field" style="flex:1"><span>Buyer agent %</span><input type="number" step="0.25" value=${bc} onInput=${e => setBc(+e.target.value || 0)} /></label></div>
              <label class="field"><span>Seller concessions</span><input type="number" step="500" value=${conc} onInput=${e => setConc(+e.target.value || 0)} /></label>
              <div class="muted" style="font-size:12px">Since 2024, buyer-agent pay is negotiated per deal. Set it to 0 to see a no-offer scenario.</div></div>
            <div class="sheet">
              <div class="ln"><span>Sale price</span><span>${usd(price)}</span></div><div class="ln neg"><span>Mortgage payoff</span><span>−${usd(payoff)}</span></div>
              <div class="ln neg"><span>Listing agent (${lc}%)</span><span>−${usd(price * lc / 100)}</span></div><div class="ln neg"><span>Buyer agent (${bc}%)</span><span>−${usd(price * bc / 100)}</span></div>
              <div class="ln neg"><span>Title & escrow</span><span>−${usd(title)}</span></div><div class="ln neg"><span>Property tax proration</span><span>−${usd(tax)}</span></div><div class="ln neg"><span>Recording, HOA & misc.</span><span>−${usd(misc)}</span></div>
              ${conc ? html`<div class="ln neg"><span>Concessions</span><span>−${usd(conc)}</span></div>` : ""}<div class="ln tot"><span>Estimated net</span><span>${usd(net)}</span></div>
              <button class="btn sm" style="margin-top:10px" onClick=${() => { up(() => { ofSay(sp.id, "Updated net sheet: at " + usd(price) + " you'd net about " + usd(net) + " after payoff, commissions and closing costs.", "Email"); }); toast("Net sheet sent to " + sp.name); }}>Send this scenario to ${sp.short === "Grant" ? "the Grants" : ofFirst(sp.name)}</button></div></div></div>` : ""}
        </div>
        <div class="of-col">
          <div class="card" style="overflow:hidden"><img src=${img(l.img)} alt="" style="width:100%;display:block;aspect-ratio:3/2;object-fit:cover" /><div class="bd"><div class="row">${ofLPill(l.status)}<b style="font-size:18px" class="num">${usd(l.price)}</b></div><div class="muted">${l.beds} bd · ${l.baths} ba · ${l.sqft.toLocaleString()} sqft · ${l.dom} days · ${l.views} views</div>${sp ? html`<div class="row" style="margin-top:8px"><${PAv} p=${sp} /><a class="of-link" onClick=${() => go("person/" + sp.id)}>${sp.name}</a><span class="muted">· sellers</span></div>` : ""}</div></div>
          <div class="card"><div class="hd"><h3>Offers</h3><span class="sp"></span><span class="of-count">${offers.length}</span></div><div class="bd of-col" style="gap:8px">
            ${offers.length ? html`${offers.slice().sort((a, b) => b.price - a.price).slice(0, 3).map(o => html`<div class="row"><span class="av" style="background:#8C5A2B">${ofIni(o.buyer)}</span><div style="flex:1;min-width:0"><b style="font-size:13px">${o.buyer}</b><div class="muted" style="font-size:12px">${o.fin}</div></div><b class="num">${usd(o.price)}</b></div>`)}<button class="btn sm pri" style="align-self:flex-start" onClick=${() => ofOpen("offers", { l: l.id })}>Compare offers (${offers.length})</button>` : html`<div class="muted" style="font-size:13px">No offers yet. ${l.views} views and ${Math.round(l.views / 30)} saves so far.</div>`}</div></div>
          <div class="card"><div class="hd"><h3>Where it's shown</h3></div><div class="bd" style="display:flex;flex-direction:column;gap:8px">
            ${[["office", "Office exclusive", "Only our agents and their clients"], ["soon", "Coming soon", "Teaser on our site; no showings yet"], ["public", "Public", "Our site, the MLS and all portals"]].map(([k, t, s]) => html`<button class=${"chk" + (l.dist === k ? " ok" : "")} role="radio" aria-checked=${l.dist === k} style="text-decoration:none" onClick=${() => { if (k === "public" && l.status === "Coming soon") { toast("Set the status to Active before going public", ["Make active", () => setStatus("Active")]); return; } up(() => { l.dist = k; }); toast("Distribution set to " + t); }}><i>${l.dist === k ? "✓" : ""}</i><div style="text-align:left"><b style="font-size:13px">${t}</b><div class="muted" style="font-size:12px">${s}</div></div></button>`)}
            <div class="muted" style="font-size:11.5px">Clear Cooperation: once marketed publicly, it must hit the MLS within 1 business day.</div></div></div>
        </div>
      </div>
    </div></${Shell}>`;
}

function OfListingModal({ m, close }) {
  const who = ofMe();
  const [f, setF] = useState({ addr: m.addr || "", area: m.area || "", price: "", beds: "3", baths: "2", sqft: "", type: "House", agent: ["priya", "maya", "sam", "jordan"].includes(who) ? who : "priya", seller: "", status: "Coming soon" }), [err, setErr] = useState({});
  const set = (k, v) => { setF({ ...f, [k]: v }); setErr({ ...err, [k]: "" }); };
  function save() {
    const n = (k) => +String(f[k]).replace(/[^\d.]/g, ""), e = {};
    if (f.addr.trim().length < 5) e.addr = "Enter the street address";
    else if (S.d.listings.some(l => l.addr.toLowerCase() === f.addr.trim().toLowerCase())) e.addr = "This address is already listed";
    if (!f.area.trim()) e.area = "Neighborhood, e.g. Mueller";
    if (!(n("price") >= 50000)) e.price = "At least $50,000";
    if (!(n("beds") >= 0 && n("beds") <= 12)) e.beds = "0–12";
    if (!(n("baths") >= 1 && n("baths") <= 12)) e.baths = "1–12";
    if (!(n("sqft") >= 300)) e.sqft = "Living area in sqft";
    setErr(e); if (Object.keys(e).length) return;
    const id = ofNewId("L", S.d.listings), pic = { House: "h-classic", Condo: "b-tower", Townhouse: "b-row" }[f.type] || "h-white";
    up(s => {
      s.d.listings.push({ id, addr: f.addr.trim(), area: f.area.trim(), price: n("price"), beds: n("beds"), baths: n("baths"), sqft: n("sqft"), lot: "—", year: 2026, type: f.type, img: pic, gallery: ["i-living", "i-bed", "i-sofa", "i-bright"], x: 30 + Math.round(Math.random() * 40), y: 30 + Math.round(Math.random() * 30), status: f.status, dom: 0, views: 0, agent: f.agent, hoa: 0, tax: 1.9, tag: f.status === "Coming soon" ? "Coming soon" : "New listing", dist: f.status === "Coming soon" ? "soon" : "public" });
      if (f.seller) { s.d.deals.push({ id: ofNewId("D", s.d.deals), kind: "Listing", person: f.seller, listing: id, stage: "New lead", price: n("price"), agent: f.agent, comp: 2.75, close: "—", progress: 0.2, agreement: { signed: true, on: "Oct 8", comp: "5% total", term: "6 months" }, dates: [], checklist: [["Listing agreement", true], ["Seller disclosure", false], ["Photos & 3D tour", false], ["Net sheet shared", false], ["Offer review", false]], docs: [["Listing agreement", "Signed"]] }); const p = s.d.people.find(x => x.id === f.seller); if (p && !p.roles.includes("Seller")) p.roles.push("Seller"); }
      s.modal = null;
    });
    toast(f.addr.trim() + " created as " + f.status + " · add photos and a description next");
    go("listing/" + id);
  }
  return html`<${OfModal} title="New listing" sub="Starts as coming soon; go public when photos are in." close=${close} foot=${html`<button class="btn" onClick=${close}>Cancel</button><button class="btn pri" onClick=${save}>Create listing</button>`}>
    <div class="row of-frow"><${OfField} grow label="Street address" err=${err.addr}><input value=${f.addr} placeholder="e.g. 4410 Mueller Blvd" onInput=${e => set("addr", e.target.value)} /></${OfField}><${OfField} grow label="Neighborhood" err=${err.area}><input value=${f.area} placeholder="Mueller" onInput=${e => set("area", e.target.value)} /></${OfField}></div>
    <div class="row of-frow"><${OfField} grow label="List price" err=${err.price}><input inputmode="numeric" value=${f.price} placeholder="749000" onInput=${e => set("price", e.target.value)} /></${OfField}><${OfField} grow label="Type"><select value=${f.type} onChange=${e => set("type", e.target.value)}>${["House", "Condo", "Townhouse"].map(x => html`<option value=${x}>${x}</option>`)}</select></${OfField}></div>
    <div class="row of-frow"><${OfField} grow label="Beds" err=${err.beds}><input inputmode="numeric" value=${f.beds} onInput=${e => set("beds", e.target.value)} /></${OfField}><${OfField} grow label="Baths" err=${err.baths}><input inputmode="decimal" value=${f.baths} onInput=${e => set("baths", e.target.value)} /></${OfField}><${OfField} grow label="Sqft" err=${err.sqft}><input inputmode="numeric" value=${f.sqft} onInput=${e => set("sqft", e.target.value)} /></${OfField}></div>
    <div class="row of-frow"><${OfField} grow label="Listing agent"><select value=${f.agent} onChange=${e => set("agent", e.target.value)}>${ofAgentOpts(["priya", "maya", "sam", "jordan"])}</select></${OfField}><${OfField} grow label="Sellers (optional)"><select value=${f.seller} onChange=${e => set("seller", e.target.value)}><option value="">Not linked yet</option>${ofPeopleOpts()}</select></${OfField}><${OfField} grow label="Status"><select value=${f.status} onChange=${e => set("status", e.target.value)}><option>Coming soon</option><option>Active</option></select></${OfField}></div>
  </${OfModal}>`;
}

function OffersModal({ m, close }) {
  const l = L(m.l), all = ofOffers(l.id);
  const seller = S.d.deals.find(d => d.listing === l.id && d.kind === "Listing"), sp = seller && P(seller.person);
  S.d.of.hb = S.d.of.hb || {};
  const net = (o) => o.net != null ? o.net : o.price - (o.conc || 0) - o.price * 0.05;
  const best = all.length ? all.reduce((a, o) => net(o) > net(a) ? o : a, all[0]) : null;
  const rows = [["Price", o => usd(o.price)], ["Seller nets (est.)", o => html`<b>${usd(net(o))}</b>`], ["Financing", o => o.fin], ["Earnest money", o => usd(o.emd || 0)], ["Closing", o => o.close], ["Contingencies", o => o.cont], ["Seller concessions", o => usd(o.conc || 0)], ["Escalation", o => o.esc || "—"], ["Buyer strength", o => o.pre]];
  const hb = S.d.of.hb[l.id];
  return html`<${OfModal} wide title=${"Offers on " + l.addr} sub=${all.length + " offers · net to seller estimated after commissions and concessions"} close=${close}
    foot=${html`${sp ? html`<button class="btn" onClick=${() => { up(() => { ofSay(sp.id, "I've shared a side-by-side of all " + all.length + " offers on " + l.addr + ", with your estimated net on each. Best net right now: " + (best ? usd(net(best)) + " from " + best.buyer : "—") + ".", "Email"); }); toast("Side-by-side shared with " + sp.name); }}>Share with sellers</button>` : ""}<button class="btn" disabled=${!!hb || all.length < 2} title=${hb ? "Already requested" : all.length < 2 ? "Needs at least 2 offers" : ""} onClick=${() => { up(() => { S.d.of.hb[l.id] = "Oct 8"; if (sp) ofLog(sp.id, "Listings", "Highest & best requested from " + all.length + " buyer agents on " + l.addr); }); toast("Highest-and-best request sent to all " + all.length + " buyer agents · due Fri 5 pm"); }}>${hb ? "Highest & best requested ✓" : "Ask for highest & best"}</button><button class="btn pri" onClick=${close}>Done</button>`}>
    ${all.length ? html`<div class="of-scroll"><table class="t of-otable"><thead><tr><th></th>${all.map(o => html`<th class=${o === best ? "of-best" : ""}>${o.buyer}<div class="muted" style="text-transform:none;letter-spacing:0">${o.agent}</div>${o === best ? html`<span class="pill g">Best net</span>` : ""}</th>`)}</tr></thead><tbody>${rows.map(([k, fn]) => html`<tr><td class="muted">${k}</td>${all.map(o => html`<td class=${"num" + (o === best ? " of-best" : "")}>${fn(o)}</td>`)}</tr>`)}</tbody></table></div>` : html`<${OfEmpty} title="No offers yet" />`}
    <div class="muted" style="font-size:12px">${sp ? "Sellers see the same side-by-side in their portal." : "Offers are logged on the listing."}</div>
  </${OfModal}>`;
}
function OfConfirmModal({ m, close }) {
  return html`<${OfModal} title=${m.title} close=${close} foot=${html`<button class="btn" onClick=${close}>Cancel</button><button class=${"btn " + (m.danger ? "of-danger" : "pri")} onClick=${() => { close(); m.onOk && m.onOk(); }}>${m.okLabel || "Confirm"}</button>`}><p style="margin:0">${m.body}</p></${OfModal}>`;
}

// ================= RENTALS =================
function ofRenewals() { return S.d.units.filter(u => u.tenant && (u.status === "Renewal" || u.renewal || (() => { const e = ofLease(u.end); return e && (e - OF_NOW) / 864e5 <= 120; })())); }
function ofTrade(t) { const s = t.title || ""; return /leak|sink|plumb|water heater|drain|toilet|faucet|pipe/i.test(s) ? "Plumbing" : /\bAC\b|cool|heat|hvac|furnace|thermostat/i.test(s) ? "HVAC" : /dishwasher|fridge|washer|dryer|oven|appliance|disposal/i.test(s) ? "Appliance" : /outlet|electric|breaker|light|power/i.test(s) ? "Electrical" : "General"; }
const ofUnitName = (u) => S.d.buildings.find(b => b.id === u.b).name + " · " + u.name;
const ofTenantP = (u) => S.d.people.find(p => u.tenant && p.name === u.tenant);
const ofOwnerApproval = (u) => S.d.rz && S.d.rz.owner && S.d.rz.owner.approvals.find(a => a.unit === u.id && a.status === "pending");
function Rentals() {
  const rid = S.route.id || "";
  const recT = S.d.tickets.find(t => t.id === rid), recU = S.d.units.find(u => u.id === rid) || (recT && S.d.units.find(u => u.id === recT.unit));
  const [b, setB] = useState(recU ? recU.b : "B1");
  const [tab, setTab] = useState(recT || rid === "maintenance" ? "maint" : rid === "renewals" ? "renew" : rid === "applications" ? "apps" : "roll");
  const [rf, setRf] = useState(rid === "late" ? "Late" : rid === "vacant" ? "Vacant" : "All"), [sel, setSel] = useState(recU && !recT ? recU.id : null), [tsel, setTsel] = useState(recT ? recT.id : null), [tf, setTf] = useState("Open");
  const panel = useRef(), narrow = ofUseNarrow(1100);
  useEffect(() => { if (narrow && (sel || tsel) && panel.current) panel.current.scrollIntoView({ behavior: "smooth", block: "start" }); }, [sel, tsel]);
  const bld = S.d.buildings.find(x => x.id === b), units = S.d.units.filter(u => u.b === b);
  const rent = units.filter(u => u.tenant).reduce((a, u) => a + u.rent, 0), paid = units.filter(u => u.status === "Paid" || u.status === "Renewal").reduce((a, u) => a + u.rent, 0);
  const tks = S.d.tickets.filter(t => { const u = S.d.units.find(x => x.id === t.unit); return u && u.b === b; });
  const repairs = 640 + tks.filter(t => t.status === "Done" && t.cost).reduce((a, t) => a + t.cost, 0);
  const shown = units.filter(u => rf === "All" || u.status === rf);
  const u = sel && S.d.units.find(x => x.id === sel), t = tsel && S.d.tickets.find(x => x.id === tsel);
  const openTk = S.d.tickets.filter(x => x.status !== "Done").length;
  const owner = P(bld.ownerPerson);
  function pay(u, method) {
    up(() => { u.status = "Paid"; if (S.d.rz && S.d.rz.unit === u.id) { const bal = S.d.rz.ledger.reduce((a, x) => a + x.amt, 0); if (bal > 0) S.d.rz.ledger.push({ d: "Oct 8", t: "Payment · " + method + " recorded by " + me().name, amt: -bal, pay: true }); } const tp = ofTenantP(u); if (tp) ofLog(tp.id, "Rentals", "Rent paid · " + usd(u.rent) + " by " + method); });
    toast("Recorded " + usd(u.rent) + " from " + u.tenant + " (" + method + ") · receipt sent", ["Undo", () => up(() => { u.status = "Late"; })]);
  }
  function remind(u) { const tp = ofTenantP(u); up(() => { u.reminded = "Oct 8"; if (tp) { const th = ofSay(tp.id, "Hi " + ofFirst(u.tenant) + ", a friendly reminder that October rent of " + usd(u.rent) + " is past due. You can pay in the app by bank transfer at no fee.", "Tenant app"); th.unread = th.unread; } }); toast("Reminder sent to " + u.tenant + (tp ? " in the tenant app" : " by text")); }
  const unitPanel = u && html`<div class="card of-panel" ref=${panel}><div class="hd"><span class=${"of-unit " + u.status}>${u.name}</span><h3>${ofUnitName(u)}</h3><span class="sp"></span><button class="btn sm ghost" aria-label="Close unit" onClick=${() => setSel(null)}>✕</button></div><div class="bd of-col" style="gap:10px">
    <div class="of-kv"><div><span>Tenant</span><b>${u.tenant ? (ofTenantP(u) ? html`<a class="of-link" onClick=${() => go("person/" + ofTenantP(u).id)}>${u.tenant}</a>` : u.tenant) : "Vacant"}</b></div><div><span>Rent</span><b class="num">${usd(u.rent)}/mo · ${u.beds} bd</b></div><div><span>Lease ends</span><b>${u.end || "—"}</b></div><div><span>Status</span><b>${u.status}${u.reminded ? " · reminded " + u.reminded : ""}</b></div></div>
    ${u.status === "Late" ? html`<div class="row of-wrap"><button class="btn sm pri" onClick=${() => pay(u, "ACH")}>Record ACH payment</button><button class="btn sm" onClick=${() => pay(u, "check")}>Record check</button><button class="btn sm" disabled=${u.reminded === "Oct 8"} title=${u.reminded ? "Already reminded today" : ""} onClick=${() => remind(u)}>${u.reminded ? "Reminded today" : "Send reminder"}</button></div>`
      : u.status === "Vacant" ? html`<div class="row of-wrap"><button class="btn sm pri" disabled=${u.listed} onClick=${() => { up(() => { u.listed = true; }); toast(u.name + " listed at " + usd(u.rent) + "/mo on our site, Zillow Rentals and Apartments.com"); }}>${u.listed ? "Listed ✓" : "List this vacancy"}</button><button class="btn sm" onClick=${() => setTab("apps")}>Applications (${((S.d.rz && S.d.rz.applicants) || []).filter(a => a.unit === u.id).length})</button></div>`
      : u.status === "Renewal" || u.renewal ? html`<button class="btn sm pri" style="align-self:flex-start" onClick=${() => setTab("renew")}>Renewal: ${u.renewal ? u.renewal.status : "send offer"} →</button>`
      : html`<div class="row of-wrap">${ofTenantP(u) ? html`<button class="btn sm" onClick=${() => go("inbox/" + (ofThreadFor(ofTenantP(u).id) || {}).id)}>Message tenant</button>` : html`<button class="btn sm" onClick=${() => toast("Texted " + u.tenant + " from the Eastside Lofts number")}>Text tenant</button>`}<button class="btn sm" onClick=${() => { setTab("maint"); }}>Work orders (${S.d.tickets.filter(x => x.unit === u.id).length})</button></div>`}
  </div></div>`;
  const stPill = (s) => html`<span class=${"pill " + ({ New: "b", Done: "g", "Awaiting owner": "a", "On hold": "r", Scheduled: "f", "In progress": "br" }[s] || "")}>${s}</span>`;
  const tkPanel = t && (() => { const tu = S.d.units.find(x => x.id === t.unit), tr = ofTrade(t), by = t.by && P(t.by), ow = P(S.d.buildings.find(x => x.id === tu.b).ownerPerson); return html`<div class="card of-panel" ref=${panel}><div class="hd"><${OfChip} n="wrench" tone=${t.priority === "Urgent" ? "r" : t.priority === "High" ? "a" : ""} /><h3>${t.title}</h3><span class="sp"></span><button class="btn sm ghost" aria-label="Close work order" onClick=${() => { setTsel(null); }}>✕</button></div><div class="bd of-col" style="gap:10px">
    <div class="row of-wrap">${stPill(t.status)}<span class=${"pill " + (t.priority === "Urgent" ? "r" : t.priority === "High" ? "a" : "")}>${t.priority}</span><span class="pill">${tr}</span></div>
    <div class="of-kv"><div><span>Unit</span><b>${ofUnitName(tu)}${tu.tenant ? " · " + tu.tenant : ""}</b></div><div><span>Reported</span><b>${t.when}${by ? " · by " + by.name + " in the tenant app" : ""}</b></div><div><span>Vendor</span><b>${t.vendor || "Not assigned"}</b></div>${t.cost ? html`<div><span>Cost</span><b class="num">${usd(t.cost)}</b></div>` : ""}</div>
    ${t.photo ? html`<div class="msg them" style="max-width:100%"><div class="ph"></div><small>Photo from the tenant</small></div>` : ""}
    ${t.ai && t.status === "New" ? html`<div class="ai"><span class="lbl">AI triage</span><div style="font-size:13px;margin-top:4px">${t.ai}</div></div>` : ""}
    ${t.status === "New" || t.status === "On hold" ? html`<div class="row of-wrap"><button class="btn sm pri" onClick=${() => ofOpen("ofVendor", { ticket: t.id })}>Assign vendor</button><button class="btn sm" onClick=${() => { up(() => { t.priority = t.priority === "Urgent" ? "High" : "Urgent"; }); }}>${t.priority === "Urgent" ? "Lower to high" : "Mark urgent"}</button></div>`
      : t.status === "Awaiting owner" ? html`<div class="of-warn">Quote ${t.quote ? usd(t.quote) : ""} is over ${ow ? ow.name.split(" ")[0] + "'s" : "the owner's"} ${usd((S.d.rz && S.d.rz.owner.limit) || 500)} approval limit. The owner decides in the owner portal.</div><div class="row of-wrap"><button class="btn sm" disabled=${t.nudged} onClick=${() => { up(() => { t.nudged = true; if (ow) ofSay(ow.id, "Quick nudge: the " + t.title.toLowerCase() + " quote (" + usd(t.quote || 0) + ") is waiting for your approval in the owner portal.", "Email"); }); toast("Owner nudged by email"); }}>${t.nudged ? "Owner nudged ✓" : "Nudge owner"}</button>${EXT.some(x => x.pages && x.pages.owner) ? html`<button class="btn sm ghost" onClick=${() => go("owner")}>See owner portal</button>` : ""}</div>`
      : t.status === "Scheduled" ? html`<div class="row of-wrap"><button class="btn sm pri" onClick=${() => { up(() => { t.status = "In progress"; }); toast("Marked in progress · tenant sees 'on the way'"); }}>Start work</button><button class="btn sm" onClick=${() => ofOpen("ofVendor", { ticket: t.id })}>Reschedule</button></div>`
      : t.status === "In progress" ? html`<${OfDone} t=${t} />` : html`<div class="muted" style="font-size:13px">Completed${t.cost ? " · " + usd(t.cost) + " billed to the owner statement" : ""}.</div>`}
  </div></div>`; })();
  const tlist = S.d.tickets.filter(x => tf === "All" || (tf === "Open" ? x.status !== "Done" : x.status === tf));
  const ren = ofRenewals();
  const apps = (S.d.rz && S.d.rz.applicants) || [];
  return html`<${Shell} title="Rentals" sub=${S.d.units.length + " units across " + S.d.buildings.length + " buildings · managed by Leo Grant"} actions=${html`${EXT.some(x => x.pages && x.pages.pmops) ? html`<button class="btn" onClick=${() => go("pmops")}>PM ops</button>` : ""}`}>
    <div class="page">
      <div class="grid2 of-g2">${S.d.buildings.map(x => html`<button class=${"card bcard of-bcard" + (x.id === b ? " on" : "")} aria-pressed=${x.id === b} onClick=${() => { setB(x.id); setSel(null); }}><div class="pic" style=${"background-image:url(" + img(x.img) + ")"}></div><div class="bd"><b>${x.name}</b><div class="muted" style="font-size:12px">${x.addr} · ${S.d.units.filter(u => u.b === x.id).length} units</div><div style="margin-top:8px;font-size:12.5px">Owner: <a class="of-link" onClick=${e => { e.stopPropagation(); go("person/" + x.ownerPerson); }}>${x.owner}</a></div></div></button>`)}</div>
      ${(() => { const all = S.d.units, due = all.filter(x => x.tenant).reduce((a, x) => a + x.rent, 0), got = all.filter(x => x.status === "Paid" || x.status === "Renewal").reduce((a, x) => a + x.rent, 0), k = (s) => all.filter(x => x.status === s).length; return html`<div class="kpis of-kpis"><button class="kpi" onClick=${() => { setTab("roll"); setRf("All"); }}><span>Rent due · Oct · all buildings</span><b class="num">${usd(due)}</b></button><button class="kpi" onClick=${() => { setTab("roll"); setRf("Paid"); }}><span>Collected</span><b class="num">${usd(got)}</b><small class="muted">${Math.round(got / (due || 1) * 100)}% of rent due</small></button><button class="kpi" onClick=${() => { setTab("roll"); setRf("Late"); }}><span>Late</span><b>${k("Late")} units</b><small class="muted">${units.filter(x => x.status === "Late").length} in ${bld.name}</small></button><button class="kpi" onClick=${() => { setTab("roll"); setRf("Vacant"); }}><span>Vacant</span><b>${k("Vacant")} units</b><small class="muted">${units.filter(x => x.status === "Vacant").length} in ${bld.name}</small></button></div>`; })()}
      <div class="tabs of-tabs">${[["roll", "Rent roll"], ["maint", "Maintenance · " + openTk], ["renew", "Renewals · " + ren.length], ["apps", "Applications · " + (apps.length + (S.d.applications || []).length)]].map(([k, v]) => html`<button aria-pressed=${tab === k} class=${tab === k ? "on" : ""} onClick=${() => setTab(k)}>${v}</button>`)}</div>
      ${tab === "roll" && (() => { const urgent = S.d.tickets.filter(x => x.status === "New" && x.priority === "Urgent"); return urgent.map(x => { const sug = ((x.ai || "").match(/Suggest ([A-Z][\w&' ]*?)(?= \(|\.|,|$)/) || [])[1], v = sug && S.d.of.vendors.find(y => y.name === sug), xu = S.d.units.find(y => y.id === x.unit); return html`<div class="of-alert"><${OfChip} n="wrench" tone="r" /><div class="of-rt"><b>Urgent: ${x.title}</b><span>${ofUnitName(xu)} · ${x.when}${sug ? " · AI suggests " + sug + " (" + v.next[0] + ")" : ""}</span></div><div class="row of-wrap">${v ? html`<button class="btn sm pri" onClick=${() => { up(() => { x.status = "Scheduled"; x.vendor = v.name + " · " + v.next[0]; x.assigned = v.id; const by = x.by && ofThreadFor(x.by); if (by) by.msgs.push({ from: "me", text: v.name + " is booked for " + v.next[0] + (x.id === "M1" ? ". Please turn the valve under the sink to the right to stop the water." : ". You'll get a text when they're on the way."), at: "now", ch: "Tenant app" }); }); toast(v.name + " dispatched for " + v.next[0] + (x.by ? " · " + ofFirst(P(x.by).name) + " notified in the tenant app" : ""), ["Open work order", () => { setTab("maint"); setTsel(x.id); }]); }}>Dispatch ${sug.split(" ")[0]}</button>` : ""}<button class="btn sm" onClick=${() => ofOpen("ofVendor", { ticket: x.id })}>Choose vendor</button></div></div>`; }); })()}
      ${tab === "roll" && html`<div class="split">
        <div class="card"><div class="hd"><h3>Rent roll · ${bld.name}</h3><span class="sp"></span><select class="of-sel" aria-label="Filter units" value=${rf} onChange=${e => setRf(e.target.value)}>${["All", "Paid", "Late", "Renewal", "Vacant"].map(s => html`<option value=${s}>${s === "All" ? "All units" : s} (${s === "All" ? units.length : units.filter(x => x.status === s).length})</option>`)}</select></div><div class="bd">
          ${shown.length ? html`<div class="ugrid of-ugrid">${shown.map(x => html`<button class=${"u " + x.status + (sel === x.id ? " of-usel" : "")} aria-pressed=${sel === x.id} onClick=${() => setSel(x.id)}><b>${x.name}</b><span class="of-ut">${x.tenant || "Vacant"}</span><div class="muted num">${usd(x.rent)}</div></button>`)}</div>` : html`<${OfEmpty} icon="check" title=${"No " + rf.toLowerCase() + " units in " + bld.name} />`}
          <div class="legend" style="margin-top:12px;flex-wrap:wrap"><span><i style="background:var(--green)"></i>Paid</span><span><i style="background:var(--red)"></i>Late</span><span><i style="background:var(--amber)"></i>Renewal due</span><span><i style="background:var(--line-2)"></i>Vacant</span></div></div></div>
        <div class="of-col">${unitPanel || html`<div class="card"><div class="hd"><h3>Owner statement · ${bld.name}</h3></div><div class="bd sheet" style="font-size:13px"><div class="ln"><span>Rent collected</span><span>${usd(paid)}</span></div><div class="ln neg"><span>Management fee (8%)</span><span>−${usd(paid * .08)}</span></div><div class="ln neg"><span>Repairs</span><span>−${usd(repairs)}</span></div><div class="ln tot"><span>To ${bld.owner}</span><span>${usd(paid * .92 - repairs)}</span></div>${owner ? html`<button class="btn sm" style="margin-top:10px" onClick=${() => { up(() => { ofSay(owner.id, "Your October statement for " + bld.name + " is ready: " + usd(paid * .92 - repairs) + " net, paid by ACH on the 10th.", "Email"); }); toast("Statement emailed to " + bld.owner); }}>Email statement to owner</button>` : ""}</div></div>
          <div class="card"><div class="hd"><h3>What tenants pay</h3><span class="sp"></span><span class="pill g">Shown before they pay</span></div><div class="bd of-kv"><div><span>Bank transfer (ACH)</span><b>Free</b></div><div><span>Debit card</span><b>$2.95</b></div><div><span>Credit card</span><b>2.9%</b></div><div><span>Split rent with roommates</span><b>Included</b></div></div></div>`}</div>
      </div>`}
      ${tab === "maint" && html`<div class="split">
        <div class="card"><div class="hd"><h3>Work orders</h3><span class="sp"></span><select class="of-sel" aria-label="Status" value=${tf} onChange=${e => setTf(e.target.value)}>${["Open", "New", "Scheduled", "In progress", "Awaiting owner", "Done", "All"].map(s => html`<option value=${s}>${s}</option>`)}</select></div>
          <div class="of-rows">${tlist.length ? tlist.map(x => { const xu = S.d.units.find(y => y.id === x.unit); return html`<${OfRow} tone=${tsel === x.id ? "on" : ""} lead=${html`<${OfChip} n="wrench" tone=${x.priority === "Urgent" ? "r" : x.priority === "High" ? "a" : ""} />`} title=${x.title} sub=${ofUnitName(xu) + " · " + x.when + " · " + (x.vendor || "no vendor")} right=${stPill(x.status)} onClick=${() => setTsel(x.id)} />`; }) : html`<${OfEmpty} icon="check" title="No work orders here" />`}</div></div>
        <div class="of-col">${tkPanel || html`<${OfEmpty} icon="wrench" title="Pick a work order" sub="Assign a vendor, schedule it and close it out here. Ray sees jobs on his phone." />`}</div></div>`}
      ${tab === "renew" && html`<${OfRenewals} list=${ren} />`}
      ${tab === "apps" && html`<${OfWebApps} />`}
      ${tab === "apps" && html`<div class="card"><div class="hd"><h3>Screened applicants</h3><span class="sp"></span>${EXT.some(x => x.pages && x.pages.pmops) ? html`<button class="btn sm" onClick=${() => go("pmops")}>Screening & notices in PM ops →</button>` : ""}</div>
        ${apps.length ? html`<div class="of-scroll"><table class="t"><thead><tr><th>Applicant</th><th>Unit</th><th>Income</th><th>Credit</th><th>Decision</th><th></th></tr></thead><tbody>${apps.map(a => { const au = S.d.units.find(x => x.id === a.unit); return html`<tr><td><b>${a.name}</b><div class="muted" style="font-size:12px">${a.reason}</div></td><td>${au ? ofUnitName(au) : a.unit}</td><td class="num">${a.income}× rent</td><td class="num">${a.credit}</td><td><span class=${"pill " + (a.decision === "Approved" ? "g" : a.decision === "Declined" ? "r" : "a")}>${a.decision}</span></td>
          <td style="text-align:right">${a.decision === "Declined" ? html`<button class="btn sm" onClick=${() => go("pmops")}>Adverse-action notice</button>` : a.leaseSent ? html`<span class="pill f">Lease sent</span>` : html`<button class="btn sm pri" onClick=${() => { up(() => { a.leaseSent = true; }); toast("Lease for " + (au ? ofUnitName(au) : a.unit) + " sent to " + a.name + " for e-signature"); }}>Send lease</button>`}</td></tr>`; })}</tbody></table></div>` : html`<${OfEmpty} title="No applications yet" sub="List a vacancy to start receiving applications." />`}</div>`}
    </div></${Shell}>`;
}
function OfDone({ t }) {
  const [cost, setCost] = useState(""), [err, setErr] = useState("");
  return html`<div class="of-col" style="gap:6px"><div class="row of-wrap"><input class="of-in" style="width:140px" inputmode="decimal" aria-label="Final cost" placeholder="Final cost $" value=${cost} onInput=${e => { setCost(e.target.value); setErr(""); }} /><button class="btn sm pri" onClick=${() => { const c = +cost.replace(/[^\d.]/g, ""); if (!(c >= 0) || cost.trim() === "") { setErr("Enter the final cost (0 if none)"); return; } up(() => { t.status = "Done"; t.cost = c; const th = t.by && ofThreadFor(t.by); if (th) th.msgs.push({ from: "me", text: "Your request “" + t.title + "” is fixed. Please confirm in the app if everything's working.", at: "now", ch: "Tenant app" }); }); toast("Work order closed · " + usd(c) + " added to the owner statement"); }}>Mark done</button></div>${err && html`<em class="of-err">${err}</em>`}</div>`;
}
function OfRenewals({ list }) {
  const [pr, setPr] = useState({}), [err, setErr] = useState({});
  return html`<div class="card"><div class="hd"><h3>Lease renewals</h3><span class="sp"></span><span class="muted" style="font-size:12px">Leases ending in the next 120 days</span></div>
    ${list.length ? html`<div class="of-scroll"><table class="t"><thead><tr><th>Unit</th><th>Tenant</th><th>Ends</th><th>Rent</th><th>Offer</th><th>Status</th><th></th></tr></thead><tbody>${list.map(u => { const ap = ofOwnerApproval(u), def = ap ? ap.amt : Math.round(u.rent * 1.03 / 5) * 5, v = pr[u.id] != null ? pr[u.id] : String(def), tp = ofTenantP(u); return html`<tr><td><b>${ofUnitName(u)}</b></td><td>${tp ? html`<a class="of-link" onClick=${() => go("person/" + tp.id)}>${u.tenant}</a>` : u.tenant}</td><td>${u.end}</td><td class="num">${usd(u.rent)}</td>
      <td>${u.renewal ? html`<b class="num">${usd(u.renewal.rent)}</b>` : html`<input class="of-in num" style="width:96px" aria-label=${"Renewal rent for " + u.name} value=${v} onInput=${e => { setPr({ ...pr, [u.id]: e.target.value }); setErr({ ...err, [u.id]: "" }); }} />${err[u.id] && html`<em class="of-err">${err[u.id]}</em>`}`}</td>
      <td>${u.renewal ? html`<span class=${"pill " + (u.renewal.status === "Signed" ? "g" : "b")}>${u.renewal.status}</span>` : ap ? html`<span class="pill a">Owner approving</span>` : html`<span class="pill">Not sent</span>`}</td>
      <td style="text-align:right">${u.renewal ? u.renewal.status === "Sent" ? html`<button class="btn sm ghost" title="Demo: simulates the tenant signing" onClick=${() => { up(() => { u.renewal.status = "Signed"; u.rent = u.renewal.rent; if (u.status === "Renewal") u.status = "Paid"; const y = u.end.split(" "); u.end = y[0] + " " + (+y[1] + 1); }); toast(u.tenant + " signed · new lease ends " + u.end); }}>Demo: tenant signs</button>` : html`<span class="muted" style="font-size:12px">Through ${u.end}</span>`
        : ap ? html`<button class="btn sm" disabled title="The owner must approve this renewal first">Waiting on owner</button>`
        : html`<button class="btn sm pri" onClick=${() => { const n = +String(v).replace(/[^\d.]/g, ""); if (!(n >= u.rent * 0.9 && n <= u.rent * 1.15)) { setErr({ ...err, [u.id]: "Within −10% and +15% of current rent" }); return; } up(() => { u.renewal = { rent: n, status: "Sent", on: "Oct 8" }; if (tp) ofSay(tp.id, "Your renewal offer is ready: 12 months at " + usd(n) + "/mo. Review and sign in the app.", "Tenant app"); }); toast("Renewal offer sent to " + u.tenant + " at " + usd(n) + "/mo"); }}>Send offer</button>`}</td></tr>`; })}</tbody></table></div>` : html`<${OfEmpty} icon="key" title="No leases up for renewal" />`}</div>`;
}
function OfVendorModal({ m, close }) {
  const t = S.d.tickets.find(x => x.id === m.ticket), tr = ofTrade(t), u = S.d.units.find(x => x.id === t.unit), by = t.by && P(t.by);
  const fit = S.d.of.vendors.filter(v => v.trade === tr || v.trade === "General").sort((a, b) => (a.trade === tr ? 0 : 1) - (b.trade === tr ? 0 : 1) || b.rating - a.rating);
  const others = S.d.of.vendors.filter(v => !fit.includes(v));
  const sug = ((t.ai || "").match(/Suggest ([A-Z][\w&' ]*?)(?= \(|\.|,|$)/) || [])[1];
  const first = fit.find(v => v.name === sug) || fit[0];
  const [vid, setVid] = useState(first.id), [slot, setSlot] = useState(first.next[0]), [tell, setTell] = useState(true), [all, setAll] = useState(false);
  const v = S.d.of.vendors.find(x => x.id === vid);
  function ok() {
    up(() => { t.status = "Scheduled"; t.vendor = v.name.replace(" (in-house)", "") + " · " + slot; t.assigned = v.id;
      if (tell && by) { const th = ofThreadFor(by.id); if (th) th.msgs.push({ from: "me", text: v.name.replace(" (in-house)", "") + " is booked for " + slot + (t.id === "M1" ? ". Please turn the valve under the sink to the right to stop the water." : ". You'll get a text when they're on the way."), at: "now", ch: "Tenant app" }); }
      S.d.activity.push([by ? by.id : S.d.buildings.find(b => b.id === u.b).ownerPerson, "Rentals", "Work order “" + t.title + "” assigned to " + v.name + " · " + slot, "Oct 8"]);
      S.modal = null; });
    toast(v.name + " dispatched for " + slot + (tell && by ? " · " + ofFirst(by.name) + " notified in the tenant app" : ""));
  }
  const list = all ? fit.concat(others) : fit;
  return html`<${OfModal} title="Assign a vendor" sub=${t.title + " · " + ofUnitName(u)} close=${close} foot=${html`<button class="btn" onClick=${close}>Cancel</button><button class="btn pri" onClick=${ok}>Dispatch ${v.name.split(" ")[0]}</button>`}>
    <div class="row of-wrap"><span class="pill">${tr}</span>${sug ? html`<span class="pill f">AI suggests ${sug}</span>` : ""}<span class="muted" style="font-size:12px">Vendors that fit this job, best rated first. The suggestion never blocks your choice.</span></div>
    <div class="of-vlist" role="radiogroup" aria-label="Vendor">${list.map(x => html`<button role="radio" aria-checked=${vid === x.id} class=${"of-vend" + (vid === x.id ? " on" : "")} onClick=${() => { setVid(x.id); setSlot(x.next[0]); }}><span class="of-radio"></span><div class="of-rt"><b>${x.name}</b><span>${x.trade} · ${x.rating}★ · ${x.fee ? "$" + x.fee + " call-out" : "no call-out"}</span></div><span class="muted" style="font-size:12px">next: ${x.next[0]}</span></button>`)}</div>
    ${!all && others.length ? html`<button class="btn sm ghost" style="align-self:flex-start" onClick=${() => setAll(true)}>Show all vendors (${others.length} more)</button>` : ""}
    <div class="lbl">Time window</div><div class="slots">${v.next.map(s => html`<button class=${slot === s ? "on" : ""} aria-pressed=${slot === s} onClick=${() => setSlot(s)}>${s}</button>`)}</div>
    ${by ? html`<label class="of-check"><input type="checkbox" checked=${tell} onChange=${e => setTell(e.target.checked)} /><span>Tell ${by.name} in the tenant app</span></label>` : ""}
  </${OfModal}>`;
}

// ================= PROJECTS (developer) =================
function ofCpConflict(r) {
  const dg = ofDigits(r.phone);
  const p = S.d.people.find(x => ofDigits(x.phone) === dg);
  if (p) return p.name + " is already a client (" + (p.source.split("·")[1] || p.source).trim() + ", " + A(p.owner).name + ")";
  const o = S.d.of.cpRegs.find(x => x !== r && ofDigits(x.phone) === dg && x.status === "Approved");
  return o ? "Already registered by " + o.cp + " on " + o.at : "";
}
const ofPlanOf = (u) => S.d.of.payPlans[u.planId] || S.d.of.payPlans.clp;
function Projects() {
  ofUseTick(1000);
  const pr = S.d.project, units = S.d.projUnits, rid = S.route.id || "";
  const recU = units.find(x => x.code === rid);
  const [tab, setTab] = useState(["holds", "partners", "queue", "collections"].includes(rid) ? rid : "inv");
  const [sel, setSel] = useState(recU ? recU.code : null), [fs, setFs] = useState("All"), [ft, setFt] = useState("All"), [ff, setFf] = useState("All");
  const panel = useRef(), narrow = ofUseNarrow(1100);
  useEffect(() => { if (narrow && sel && panel.current) panel.current.scrollIntoView({ behavior: "smooth", block: "start" }); }, [sel]);
  const u = sel && units.find(x => x.code === sel), now = Date.now();
  // expire holds whose timer ran out
  ofNormHolds();
  units.forEach(x => { if (x.status === "Held" && x.holdUntil && x.holdUntil < now) { if (x.hold) { x.hold = null; (S.d.holds || []).filter(h => h.code === x.code && h.status === "Active").forEach(h => { h.status = "Expired"; }); } x.status = "Available"; x.expired = true; x.holdFor = ""; } });
  const cnt = (s) => units.filter(x => x.status === s).length;
  const match = (x) => (fs === "All" || x.status === fs) && (ft === "All" || x.type === ft) && (ff === "All" || x.facing === ff);
  const regs = S.d.of.cpRegs, q = S.d.of.queue, dem = S.d.of.demands;
  function release(x) { ofOpen("ofConfirm", { title: "Release the hold on " + x.code + "?", body: "It goes back on the live grid for every channel partner right away.", okLabel: "Release", onOk: () => { up(() => { x.status = "Available"; x.holdFor = ""; x.holdUntil = 0; if (x.hold) { x.hold = null; (S.d.holds || []).filter(h => h.code === x.code && h.status === "Active").forEach(h => { h.status = "Released"; }); } }); toast("Unit " + x.code + " is available again"); } }); }
  function cancelB(x) { ofOpen("ofConfirm", { title: "Cancel the booking on " + x.code + "?", body: "The unit returns to inventory. The token (" + usd(x.token || 25000) + ") is refunded less the 2% cancellation charge per the booking form.", okLabel: "Cancel booking", danger: true, onOk: () => { const who = x.buyerName; up(() => { x.status = "Available"; S.d.of.demands = S.d.of.demands.filter(dl => dl.unit !== x.code || dl.status === "Paid"); if (x.buyer) { const p = P(x.buyer); ofLog(p.id, "Projects", "Booking cancelled on unit " + x.code); } x.buyer = null; x.buyerName = ""; x.cp = ""; }); toast("Booking for " + who + " cancelled · refund queued in back office"); } }); }
  function sendDemand(x, ms) {
    const plan = ofPlanOf(x), row = plan.rows.find(r => r[0] === ms);
    up(() => { S.d.of.demands.push({ id: ofNewId("DL", S.d.of.demands), unit: x.code, buyer: x.buyerName, milestone: ms, pct: row[1], amt: x.price * (1 - plan.disc / 100) * row[1] / 100, due: "Oct 22", status: "Sent" }); if (x.buyer) ofSay(x.buyer, "Demand letter for unit " + x.code + ": " + ms + " milestone, " + usd(x.price * (1 - plan.disc / 100) * row[1] / 100) + " due Oct 22. Pay by wire or NRE transfer; details attached.", "WhatsApp"); });
    toast("Demand letter for " + ms + " sent to " + x.buyerName);
  }
  const drawer = u && (() => { const plan = ofPlanOf(u), price = u.price * (1 - plan.disc / 100), mine = dem.filter(x => x.unit === u.code), left = u.holdUntil - now; return html`<div class="card of-panel" ref=${panel}><div class="hd"><span class=${"of-unit " + u.status}>${u.code}</span><h3>Unit ${u.code}</h3><span class="sp"></span><span class=${"pill " + { Available: "g", Held: "a", Booked: "b", Sold: "" }[u.status]}>${u.status}</span><button class="btn sm ghost" aria-label="Close unit" onClick=${() => setSel(null)}>✕</button></div><div class="bd of-col" style="gap:10px">
    <div class="of-kv"><div><span>Type</span><b>${u.type} · ${u.sqft} sqft · ${u.facing} view · floor ${u.floor}</b></div><div><span>Price</span><b class="num">${usd(u.price)}${plan.disc && u.status !== "Available" ? " · " + usd(price) + " after " + plan.disc + "%" : ""}</b></div>
      ${u.buyerName ? html`<div><span>Buyer</span><b>${u.buyer ? html`<a class="of-link" onClick=${() => go("person/" + u.buyer)}>${u.buyerName}</a>` : u.buyerName}</b></div>` : ""}${u.cp ? html`<div><span>Channel partner</span><b>${u.cp}</b></div>` : ""}${u.status === "Held" ? html`<div><span>Held for</span><b>${u.holdFor}</b></div>` : ""}${u.expired && u.status === "Available" ? html`<div><span>Note</span><b>Last hold expired</b></div>` : ""}</div>
    ${u.status === "Held" ? html`<div class=${"of-holdbar" + (left < 6 * 36e5 ? " hot" : "")}><${OfI} n="clock" s=${14} /><span>Hold expires in</span><b class="num">${ofLeft(left)}</b></div>` : ""}
    <div class="lbl">${plan.name} plan</div>
    <div class="plan">${plan.rows.map(([ms, pc]) => { const dl = mine.find(x => x.milestone === ms); return html`<div class="ln of-pl"><span>${ms}</span><span class="muted num">${pc}%</span><span class="num" style="text-align:right">${usd(price * pc / 100)}</span>${u.status === "Booked" || u.status === "Sold" ? html`<span>${dl ? html`<span class=${"pill " + (dl.status === "Paid" ? "g" : dl.status === "Overdue" ? "r" : "b")}>${dl.status}</span>` : ms === "Booking" ? html`<span class="pill g">Paid</span>` : u.status === "Booked" ? html`<button class="btn sm ghost" onClick=${() => sendDemand(u, ms)}>Send demand</button>` : html`<span class="pill g">Paid</span>`}</span>` : html`<span></span>`}</div>`; })}</div>
    ${u.status === "Available" ? html`<div class="row of-wrap"><button class="btn" onClick=${() => ofOpen("ofHold", { code: u.code })}><${OfI} n="clock" s=${14} /> Hold</button><button class="btn pri" onClick=${() => ofOpen("ofBook", { code: u.code })}>Book this unit</button></div>`
      : u.status === "Held" ? html`<div class="row of-wrap"><button class="btn pri" onClick=${() => ofOpen("ofBook", { code: u.code, buyerName: (u.holdFor || "").split(" · ")[0] })}>Collect token & book</button><button class="btn sm" disabled=${u.extended} title=${u.extended ? "Holds can be extended once" : ""} onClick=${() => { up(() => { u.holdUntil += 24 * 36e5; u.extended = true; }); toast("Hold on " + u.code + " extended by 24 hours"); }}>${u.extended ? "Extended" : "+24h"}</button><button class="btn sm ghost" onClick=${() => release(u)}>Release</button></div>`
      : u.status === "Booked" ? html`<div class="row of-wrap"><button class="btn sm" onClick=${() => { up(() => { u.status = "Sold"; }); toast("Unit " + u.code + " moved to sold · agreement for sale registered"); }}>Mark agreement registered</button><button class="btn sm ghost of-dangertext" onClick=${() => cancelB(u)}>Cancel booking</button></div>`
      : html`<div class="muted" style="font-size:12.5px">Sold · agreement registered. Collections follow the plan above.</div>`}
  </div></div>`; })();
  const inv = html`<div class="split">
    <div class="card"><div class="hd of-wrap"><h3>Live inventory</h3><span class="sp"></span>
      <select class="of-sel" aria-label="Status" value=${fs} onChange=${e => setFs(e.target.value)}>${["All", "Available", "Held", "Booked", "Sold"].map(s => html`<option value=${s}>${s === "All" ? "All statuses" : s + " (" + cnt(s) + ")"}</option>`)}</select>
      <select class="of-sel" aria-label="Type" value=${ft} onChange=${e => setFt(e.target.value)}>${["All", "1 BR", "2 BR", "3 BR"].map(s => html`<option value=${s}>${s === "All" ? "All types" : s}</option>`)}</select>
      <select class="of-sel" aria-label="Facing" value=${ff} onChange=${e => setFf(e.target.value)}>${["All", "Lake", "City"].map(s => html`<option value=${s}>${s === "All" ? "Any view" : s + " view"}</option>`)}</select></div><div class="bd">
      <div class="tower of-tower">${[6, 5, 4, 3, 2, 1].map(f => html`<div class="floor"><span>F${f}</span>${units.filter(x => x.floor === f).map(x => html`<button class=${"pu " + x.status + (x.code === sel ? " sel" : "") + (match(x) ? "" : " of-dim")} aria-label=${"Unit " + x.code + ", " + x.type + ", " + x.status} aria-pressed=${x.code === sel} onClick=${() => setSel(x.code)}><b>${x.code}</b><span class="of-pt">${x.type}</span><div class="of-pp">${short(x.price)}</div>${x.status === "Held" && x.holdUntil - now < 12 * 36e5 ? html`<i class="of-hot" title="Hold expiring"></i>` : ""}</button>`)}</div>`)}</div>
      <div class="legend" style="margin-top:12px;flex-wrap:wrap"><span><i style="background:#BFD9C7"></i>Available ${cnt("Available")}</span><span><i style="background:#EBCF95"></i>Held ${cnt("Held")}</span><span><i style="background:#BBD0E6"></i>Booked ${cnt("Booked")}</span><span><i style="background:#D9D5CB"></i>Sold ${cnt("Sold")}</span><span class="muted">Lake-facing: units 1–4</span></div></div></div>
    <div class="of-col">${drawer || html`<${OfEmpty} icon="projects" title="Pick a unit" sub="Hold it, book it with a payment plan or send a demand letter." />`}
      <div class="card"><div class="hd"><h3>Payment plans</h3></div><div class="of-rows">${Object.entries(S.d.of.payPlans).map(([k, p]) => html`<div class="of-party"><span class="lbl">${p.disc ? p.disc + "% off" : "Standard"}</span><div class="of-rt"><b>${p.name}</b><span>${p.rows.map(r => r[1] + "%").join(" · ")}</span></div></div>`)}</div></div></div>
  </div>`;
  const holdsBook = html`<div class="of-col"><div class="split"><${OfHoldList} holds=${units.filter(x => x.status === "Held").sort((a, b) => a.holdUntil - b.holdUntil)} />
    <${OfCard} title="Bookings" icon="key" count=${cnt("Booked")}><div class="of-rows">${units.filter(x => x.status === "Booked").map(x => html`<${OfRow} lead=${html`<span class="of-unit Booked">${x.code}</span>`} title=${x.buyerName + " · " + x.type} sub=${ofPlanOf(x).name + " · " + (x.cp || "Direct")} right=${html`<b class="num">${short(x.price)}</b>`} onClick=${() => { setTab("inv"); setSel(x.code); }} />`)}</div></${OfCard}></div><${OfInterests} /></div>`;
  const partners = html`<div class="split">
    <div class="card"><div class="hd"><h3>Broker registrations</h3><span class="sp"></span><button class="btn sm pri" onClick=${() => ofOpen("ofCp")}><${OfI} n="plus" s=${13} /> Register a buyer</button></div>
      <div class="of-scroll"><table class="t"><thead><tr><th>Buyer</th><th>Partner</th><th>Wants</th><th>Status</th><th></th></tr></thead><tbody>${regs.map(r => { const c = r.status === "Pending" ? ofCpConflict(r) : ""; return html`<tr><td><b>${r.buyer}</b><div class="muted" style="font-size:12px">${r.phone} · ${r.at}</div>${c ? html`<div class="of-err" style="font-style:normal">⚠ ${c}</div>` : ""}</td><td>${r.cp}</td><td>${r.pref}</td><td><span class=${"pill " + (r.status === "Approved" ? "g" : r.status === "Rejected" ? "r" : "a")}>${r.status}${r.until ? " · until " + r.until : ""}</span></td>
        <td style="text-align:right">${r.status === "Pending" ? html`<div class="row" style="justify-content:flex-end;gap:6px"><button class="btn sm pri" disabled=${!!c} title=${c ? "Resolve the conflict first: the earlier registration wins" : "Lock this buyer to " + r.cp + " for 90 days"} onClick=${() => { up(() => { r.status = "Approved"; r.until = "Jan 6"; }); toast(r.buyer + " registered to " + r.cp + " for 90 days · they earn commission if this buyer books"); }}>Approve</button><button class="btn sm" onClick=${() => { up(() => { r.status = "Rejected"; r.why = c || "Rejected by " + me().name; }); toast("Registration rejected · " + r.cp + " is told why"); }}>Reject</button></div>` : ""}</td></tr>`; })}</tbody></table></div></div>
    <div class="card"><div class="hd"><h3>Channel partners</h3></div><div class="of-scroll"><table class="t"><thead><tr><th>Partner</th><th>Units</th><th>Rate</th><th>Earned</th></tr></thead><tbody>${pr.cps.map(c => { const sold = units.filter(x => x.cp === c[0] && (x.status === "Booked" || x.status === "Sold")); return html`<tr><td>${c[0]}</td><td class="num">${sold.length || c[1]}</td><td class="num">${c[2]}%</td><td class="num">${short(sold.reduce((a, x) => a + x.price * c[2] / 100, 0))}</td></tr>`; })}</tbody></table></div></div></div>`;
  const nextQ = q.find(x => x.status === "Waiting"), called = q.filter(x => x.status === "Called");
  const queue = html`<div class="card"><div class="hd of-wrap"><h3>Launch queue · EOI holders in token order</h3><span class="sp"></span><span class="muted" style="font-size:12px">${q.filter(x => x.status === "Waiting").length} waiting · ${cnt("Available")} units open</span><button class="btn sm pri" disabled=${!nextQ || called.length > 0} title=${called.length ? "Finish with " + called[0].name + " first" : !nextQ ? "Queue is empty" : ""} onClick=${() => { up(() => { nextQ.status = "Called"; }); toast("Token " + nextQ.token + " called · " + nextQ.name + " to the sales desk"); }}>Call next</button></div>
    <div class="of-rows">${q.map(x => html`<div class=${"of-qrow" + (x.status === "Called" ? " on" : "")}><span class="of-token">${x.token}</span><div class="of-rt"><b>${x.name}</b><span>${x.pref} · ${x.cp} · EOI ${usd(x.eoi)}</span></div><span class=${"pill " + ({ Booked: "g", Called: "b", "No-show": "r", Waiting: "" }[x.status])}>${x.status}${x.unit ? " · " + x.unit : ""}</span>
      ${x.status === "Called" ? html`<div class="row" style="gap:6px"><button class="btn sm pri" onClick=${() => { const want = x.pref.split(" · ")[0], pick = units.find(y => y.status === "Available" && y.type === want) || units.find(y => y.status === "Available"); if (!pick) { toast("No units left to offer"); return; } ofOpen("ofBook", { code: pick.code, buyerName: x.name, token: x.token, cp: x.cp }); }}>Book a unit</button><button class="btn sm" onClick=${() => { up(() => { x.status = "No-show"; }); toast(x.token + " marked no-show · EOI refundable on request"); }}>No-show</button></div>` : html`<span></span>`}</div>`)}</div></div>`;
  const billed = dem.reduce((a, x) => a + x.amt, 0), got = dem.filter(x => x.status === "Paid").reduce((a, x) => a + x.amt, 0), od = dem.filter(x => x.status === "Overdue").reduce((a, x) => a + x.amt, 0);
  const coll = html`<div class="of-col"><div class="of-forecast"><div><span>Billed</span><b class="num">${short(billed)}</b></div><div><span>Collected</span><b class="num">${short(got)}</b></div><div><span>Overdue</span><b class="num of-red">${usd(od)}</b></div><div><span>Letters</span><b class="num">${dem.length}</b></div></div>
    <div class="card"><div class="hd"><h3>Demand letters</h3></div><div class="of-scroll"><table class="t"><thead><tr><th>Unit</th><th>Buyer</th><th>Milestone</th><th>Amount</th><th>Due</th><th>Status</th><th></th></tr></thead><tbody>${dem.map(x => html`<tr><td><button class="of-unit Booked" onClick=${() => { setTab("inv"); setSel(x.unit); }}>${x.unit}</button></td><td>${x.buyer}</td><td>${x.milestone} · ${x.pct}%</td><td class="num">${usd(x.amt)}</td><td>${x.due}</td><td><span class=${"pill " + ({ Paid: "g", Overdue: "r", Sent: "b", Draft: "" }[x.status])}>${x.status}</span></td>
      <td style="text-align:right">${x.status === "Draft" ? html`<button class="btn sm pri" onClick=${() => { up(() => { x.status = "Sent"; }); toast("Demand letter sent to " + x.buyer + " by WhatsApp and email"); }}>Send</button>` : x.status !== "Paid" ? html`<div class="row" style="justify-content:flex-end;gap:6px">${x.status === "Overdue" ? html`<button class="btn sm" disabled=${x.reminded} onClick=${() => { up(() => { x.reminded = true; }); toast("Reminder sent · 1.5% monthly interest applies after 15 days per the agreement"); }}>${x.reminded ? "Reminded" : "Remind"}</button>` : ""}<button class="btn sm pri" onClick=${() => { up(() => { x.status = "Paid"; }); toast(usd(x.amt) + " received from " + x.buyer + " · receipt issued"); }}>Record payment</button></div>` : html`<span class="muted" style="font-size:12px">Receipt issued</span>`}</td></tr>`)}</tbody></table></div></div></div>`;
  return html`<${Shell} title=${pr.name} sub=${pr.dev + " · " + pr.launch + " · possession " + pr.possession} actions=${html`<button class="btn" onClick=${() => { try { navigator.clipboard && navigator.clipboard.writeText(location.origin + location.pathname + "#/projects"); } catch (e) {} toast("Live availability link copied · channel partners see the same grid, with prices"); }}><span class="of-hide-s">Share live grid</span><span class="of-show-s">Share</span></button>`}>
    <div class="page">
      <div class="kpis of-kpis"><button class="kpi" onClick=${() => { setTab("inv"); setFs("Sold"); }}><span>Sold</span><b>${cnt("Sold")}</b></button><button class="kpi" onClick=${() => { setTab("inv"); setFs("Booked"); }}><span>Booked (token paid)</span><b>${cnt("Booked")}</b></button><button class="kpi" onClick=${() => setTab("holds")}><span>On hold</span><b>${cnt("Held")}</b></button><button class="kpi" onClick=${() => { setTab("inv"); setFs("Available"); }}><span>Available</span><b>${cnt("Available")}</b><small class="muted">of ${units.length}</small></button></div>
      ${(() => { const nair = P("P7"), t8 = S.d.threads.find(t => t.id === "T8"), u603 = units.find(x => x.code === "603"); return nair && u603 && u603.status === "Available" && !units.some(x => x.buyer === "P7") ? html`<div class="of-alert br"><${PAv} p=${nair} /><div class="of-rt"><b>The Nairs want a lake-side 2 BR on a high floor</b><span>WhatsApp from Mumbai${t8 ? " · " + t8.when : ""} · unit 603 matches (${usd(u603.price)}, lake view, floor 6)</span></div><div class="row of-wrap"><button class="btn sm" onClick=${() => { setTab("inv"); setSel("603"); }}>See unit 603</button><button class="btn sm pri" onClick=${() => ofOpen("ofBook", { code: "603", buyerName: nair.name })}>Book for Nair family</button></div></div>` : ""; })()}
      <div class="tabs of-tabs" role="tablist">${[["inv", "Inventory"], ["holds", "Holds & bookings"], ["partners", "Brokers · " + regs.filter(r => r.status === "Pending").length], ["queue", "Launch queue"], ["collections", "Collections"]].map(([k, v]) => html`<button role="tab" aria-selected=${tab === k} class=${tab === k ? "on" : ""} onClick=${() => setTab(k)}>${v}</button>`)}</div>
      ${tab === "inv" ? inv : tab === "holds" ? holdsBook : tab === "partners" ? partners : tab === "queue" ? queue : coll}
    </div></${Shell}>`;
}
function OfHoldModal({ m, close }) {
  const u = S.d.projUnits.find(x => x.code === m.code);
  const opts = [...S.d.of.cpRegs.filter(r => r.status === "Approved").map(r => r.buyer + " · " + r.cp), ...S.d.of.queue.filter(x => x.status === "Waiting" || x.status === "Called").map(x => x.name + " · token " + x.token), ...S.d.people.filter(p => p.roles.includes("Investor")).map(p => p.name + " · direct")];
  const [who, setWho] = useState(opts[0] || ""), [other, setOther] = useState(""), [hrs, setHrs] = useState(48), [err, setErr] = useState("");
  function ok() {
    const w = who === "__other" ? other.trim() : who; if (!w) { setErr("Who is this hold for?"); return; }
    up(() => { u.status = "Held"; u.holdFor = w; u.holdUntil = Date.now() + hrs * 36e5; u.extended = false; u.expired = false; S.modal = null; });
    toast("Unit " + u.code + " held for " + w.split(" · ")[0] + " · " + hrs + " hours · partners see it as held");
  }
  return html`<${OfModal} title=${"Hold unit " + u.code} sub=${u.type + " · " + u.facing + " view · " + usd(u.price)} close=${close} foot=${html`<button class="btn" onClick=${close}>Cancel</button><button class="btn pri" onClick=${ok}>Hold for ${hrs}h</button>`}>
    <${OfField} label="Hold for" err=${err}><select value=${who} onChange=${e => { setWho(e.target.value); setErr(""); }}>${opts.map(o => html`<option value=${o}>${o}</option>`)}<option value="__other">Someone else…</option></select></${OfField}>
    ${who === "__other" ? html`<${OfField} label="Name"><input value=${other} onInput=${e => { setOther(e.target.value); setErr(""); }} placeholder="Walk-in buyer name" onKeyDown=${e => e.key === "Enter" && ok()} /></${OfField}>` : ""}
    <div class="lbl">Duration</div><${OfSeg} label="Duration" value=${hrs} set=${setHrs} opts=${[[24, "24 hours"], [48, "48 hours"], [72, "72 hours"]]} />
    <div class="muted" style="font-size:12px">The hold releases itself when the timer runs out. One 24-hour extension is allowed.</div>
  </${OfModal}>`;
}
function OfBookModal({ m, close }) {
  const u = S.d.projUnits.find(x => x.code === m.code), plans = S.d.of.payPlans;
  const pre = m.buyerName ? S.d.people.find(p => p.name === m.buyerName || p.name.startsWith(m.buyerName)) : null;
  const [f, setF] = useState({ name: pre ? pre.name : m.buyerName || (m.code === "603" ? "Arjun & Meera Nair" : ""), phone: pre ? pre.phone : m.code === "603" ? "+91 98200 55012" : "", plan: "clp", cp: m.cp || (pre && /NRI/.test(pre.source) ? "NRI desk" : "Direct"), token: "25000", kyc: false }), [err, setErr] = useState({});
  const set = (k, v) => { setF({ ...f, [k]: v }); setErr({ ...err, [k]: "" }); };
  const plan = plans[f.plan], price = u.price * (1 - plan.disc / 100);
  function ok() {
    const e = {}, tok = +String(f.token).replace(/[^\d.]/g, "");
    if (!f.name.trim()) e.name = "Buyer name is required";
    if (ofDigits(f.phone).length < 10) e.phone = "Enter a full phone number";
    if (!(tok >= 10000)) e.token = "Token is at least $10,000";
    if (!f.kyc) e.kyc = "Collect ID and address proof before booking";
    setErr(e); if (Object.keys(e).length) return;
    const p = S.d.people.find(x => x.name === f.name.trim() || ofDigits(x.phone) === ofDigits(f.phone));
    up(s => {
      if (u.hold) { (s.d.holds || []).filter(h => h.code === u.code && h.status === "Active").forEach(h => { h.status = "Converted"; }); u.hold = null; } u.status = "Booked"; u.buyerName = f.name.trim(); u.buyer = p ? p.id : null; u.planId = f.plan; u.cp = f.cp === "Direct" ? "Direct" : f.cp; u.token = tok; u.holdFor = ""; u.holdUntil = 0;
      s.d.of.demands.push({ id: ofNewId("DL", s.d.of.demands), unit: u.code, buyer: u.buyerName, milestone: plan.rows[0][0], pct: plan.rows[0][1], amt: price * plan.rows[0][1] / 100, due: "Oct 15", status: "Sent" });
      if (m.token) { const qe = s.d.of.queue.find(x => x.token === m.token); if (qe) { qe.status = "Booked"; qe.unit = u.code; } }
      if (p) { p.stage = "Booked"; if (!p.roles.includes("Investor")) p.roles.push("Investor"); ofLog(p.id, "Projects", "Booked unit " + u.code + " at The Linden · " + usd(price) + " · " + plan.name); const t = ofThreadFor(p.id); if (t) t.msgs.push({ from: "me", text: "Congratulations! Unit " + u.code + " is booked for you. Your " + plan.name.toLowerCase() + " schedule and the first demand letter (" + usd(price * plan.rows[0][1] / 100) + ") are attached.", at: "now", ch: t.channel }); }
      s.modal = null;
    });
    const cpFee = f.cp !== "Direct" && f.cp !== "Website";
    ofNotify("grace", "Booking on The Linden " + u.code + " · token " + usd(tok) + (cpFee ? " · CP commission to " + f.cp : f.cp === "Website" ? " · website hold converted" : ""), "projects/" + u.code);
    toast("Unit " + u.code + " booked for " + f.name.trim().split(" ")[0] + " · demand letter sent" + (cpFee ? " · " + f.cp + " commission queued" : ""), p ? ["Open buyer", () => go("person/" + p.id)] : null);
  }
  return html`<${OfModal} title=${"Book unit " + u.code} sub=${u.type + " · " + u.sqft + " sqft · " + u.facing + " view"} close=${close} foot=${html`<button class="btn" onClick=${close}>Cancel</button><button class="btn pri" onClick=${ok}>Collect ${usd(+String(f.token).replace(/[^\d.]/g, "") || 0)} & book</button>`}>
    <div class="row of-frow"><${OfField} grow label="Buyer" err=${err.name}><input list="of-buyers" value=${f.name} onInput=${e => { const v = e.target.value, p = S.d.people.find(x => x.name === v); setF({ ...f, name: v, phone: p ? p.phone : f.phone }); setErr({ ...err, name: "" }); }} /><datalist id="of-buyers">${S.d.people.map(p => html`<option value=${p.name} />`)}</datalist></${OfField}>
      <${OfField} grow label="Phone" err=${err.phone}><input value=${f.phone} onInput=${e => set("phone", e.target.value)} /></${OfField}></div>
    <div class="row of-frow"><${OfField} grow label="Channel partner"><select value=${f.cp} onChange=${e => set("cp", e.target.value)}><option>Direct</option>${f.cp === "Website" || m.cp === "Website" ? html`<option value="Website">Website · direct, no CP fee</option>` : ""}${S.d.project.cps.map(c => html`<option value=${c[0]}>${c[0]} · ${c[2]}%</option>`)}</select></${OfField}>
      <${OfField} grow label="Token amount" err=${err.token}><input inputmode="numeric" value=${f.token} onInput=${e => set("token", e.target.value)} /></${OfField}></div>
    <div class="lbl">Payment plan</div><${OfSeg} label="Payment plan" value=${f.plan} set=${v => set("plan", v)} opts=${Object.entries(plans).map(([k, p]) => [k, p.name])} />
    <div class="plan">${plan.rows.map(([ms, pc]) => html`<div class="ln"><span>${ms}</span><span class="muted num">${pc}%</span><span class="num" style="text-align:right">${usd(price * pc / 100)}</span></div>`)}<div class="ln" style="font-weight:700"><span>Total</span><span></span><span class="num" style="text-align:right">${usd(price)}</span></div></div>
    <label class="of-check"><input type="checkbox" checked=${f.kyc} onChange=${e => set("kyc", e.target.checked)} /><span>ID and address proof collected (KYC)${err.kyc ? html` <em class="of-err">${err.kyc}</em>` : ""}</span></label>
  </${OfModal}>`;
}
function OfCpModal({ m, close }) {
  const [f, setF] = useState({ cp: S.d.project.cps[0][0], buyer: "", phone: "", pref: "2 BR" }), [err, setErr] = useState({});
  const set = (k, v) => { setF({ ...f, [k]: v }); setErr({ ...err, [k]: "" }); };
  const probe = { phone: f.phone }, c = ofDigits(f.phone).length >= 10 ? ofCpConflict(probe) : "";
  function ok() {
    const e = {}; if (!f.buyer.trim()) e.buyer = "Buyer name is required"; if (ofDigits(f.phone).length < 10) e.phone = "Enter a full phone number";
    setErr(e); if (Object.keys(e).length) return;
    up(s => { s.d.of.cpRegs.unshift({ id: ofNewId("R", s.d.of.cpRegs), cp: f.cp, buyer: f.buyer.trim(), phone: f.phone.trim(), pref: f.pref, at: "Just now", status: "Pending" }); s.modal = null; });
    toast(c ? "Registered with a conflict flag · the earlier registration wins unless you override" : "Registration received · approve it to lock the buyer to " + f.cp);
  }
  return html`<${OfModal} title="Register a buyer" sub="What a channel partner submits from their portal. First valid registration wins." close=${close} foot=${html`<button class="btn" onClick=${close}>Cancel</button><button class="btn pri" onClick=${ok}>Submit registration</button>`}>
    <${OfField} label="Channel partner"><select value=${f.cp} onChange=${e => set("cp", e.target.value)}>${S.d.project.cps.map(x => html`<option value=${x[0]}>${x[0]}</option>`)}</select></${OfField}>
    <div class="row of-frow"><${OfField} grow label="Buyer name" err=${err.buyer}><input value=${f.buyer} onInput=${e => set("buyer", e.target.value)} /></${OfField}><${OfField} grow label="Buyer phone" err=${err.phone}><input value=${f.phone} onInput=${e => set("phone", e.target.value)} placeholder="+1 512 555 0100" /></${OfField}></div>
    <${OfField} label="Looking for"><select value=${f.pref} onChange=${e => set("pref", e.target.value)}>${["1 BR", "2 BR", "2 BR · lake side", "3 BR", "3 BR · corner"].map(x => html`<option value=${x}>${x}</option>`)}</select></${OfField}>
    ${c ? html`<div class="of-dupe hot" role="alert"><b>Possible conflict</b><div>${c}</div></div>` : ""}
  </${OfModal}>`;
}

// ================= BACK OFFICE =================
function BackOffice() {
  if (!S.cda) S.cda = {};
  const api = !!(window.TxApi && window.TxApi.commission), hasTx = EXT.some(x => x.pages && x.pages.commissions) && ofCan("commissions");
  const closed = S.d.deals.filter(d => d.stage === "Closed"), uc = S.d.deals.filter(d => d.stage === "Under contract");
  const rows = closed.map(d => ({ d, c: ofComm(d) })), proj = uc.map(d => ({ d, c: ofComm(d) }));
  const done = (c) => /approved|paid|processed/i.test(c.status || "");
  const plans = S.d.tx && S.d.tx.plans;
  const caps = ["jordan", "priya", "sam"].map(a => plans && plans[a] ? [a, plans[a].paid, plans[a].cap] : [a, { jordan: 14200, priya: 9800, sam: 6100 }[a], 20000]);
  const fees = (c) => (c.fees || []).reduce((a, f) => a + f[1], 0);
  function approve(d) { up(s => { s.cda[d.id] = 1; }); ofNotify(d.agent, "Your commission on " + L(d.listing).addr + " is approved", "backoffice"); toast("CDA sent to title · payout scheduled at funding", ["Undo", () => up(s => { delete s.cda[d.id]; })]); }
  return html`<${Shell} title="Back office" sub="Commission plans, caps and payouts, straight from the deal file"
    actions=${html`<div class="row of-hact">${hasTx ? html`<button class="btn" onClick=${() => go("commissions")}>Commissions</button>` : ""}<button class="btn" onClick=${() => { S.ofExported = new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }); up(); toast("Exported " + rows.length + " payouts and " + uc.length + " pending deposits to QuickBooks"); }}>${S.ofExported ? "Exported " + S.ofExported + " ✓" : "Export to QuickBooks"}</button></div>`}>
    <div class="page">
      <div class="kpis of-kpis">
        <div class="kpi"><span>Closed volume</span><b class="num">${short(closed.reduce((a, d) => a + d.price, 0))}</b><small class="muted">${closed.length} sides</small></div>
        <div class="kpi"><span>Company dollar</span><b class="num">${usd(rows.reduce((a, r) => a + r.c.brokerage + fees(r.c), 0))}</b></div>
        <div class="kpi"><span>Paid / due to agents</span><b class="num">${usd(rows.reduce((a, r) => a + r.c.net, 0))}</b></div>
        <div class="kpi"><span>Awaiting approval</span><b class="num">${rows.filter(r => !done(r.c)).length}</b></div></div>
      <div class="card"><div class="hd"><h3>Payouts</h3><span class="sp"></span><span class="muted" style="font-size:12px">${api ? "Live from each agent's commission plan" : "Default plan: 70/30 split, $395 transaction fee"}</span></div><div class="of-scroll"><table class="t"><thead><tr><th>Deal</th><th>Agent</th><th>Price</th><th>Gross pay</th><th>Split</th><th>Fees</th><th>Agent nets</th><th></th></tr></thead><tbody>
        ${rows.map(({ d, c }) => html`<tr><td><a class="of-link" onClick=${() => go("deal/" + d.id)}><b>${L(d.listing).addr}</b></a><div class="muted" style="font-size:12px">${d.kind} · closed ${d.close}</div></td><td><div class="row"><${Av} a=${A(d.agent)} />${A(d.agent).name}</div></td><td class="num">${usd(d.price)}</td><td class="num">${usd(c.gross)}</td><td class="num">${c.splitPct}/${100 - c.splitPct}${c.capped ? html` <span class="pill g">Capped</span>` : ""}</td><td class="num">${fees(c) ? "−" + usd(fees(c)) : "—"}</td><td class="num"><b>${usd(c.net)}</b></td>
          <td style="text-align:right">${done(c) ? html`<span class="pill g">${api ? c.status : "CDA approved"}</span>` : api && hasTx ? html`<button class="btn sm pri" onClick=${() => go("commissions")}>Review in Commissions</button>` : html`<button class="btn sm pri" onClick=${() => approve(d)}>Approve CDA</button>`}</td></tr>`)}
        ${!rows.length ? html`<tr><td colspan="8"><${OfEmpty} title="No closed deals yet" /></td></tr>` : ""}
      </tbody></table></div></div>
      <div class="split">
        <div class="card"><div class="hd"><h3>Coming up · under contract</h3><span class="sp"></span><span class="muted num">${usd(proj.reduce((a, r) => a + r.c.gross, 0))} gross</span></div><div class="of-rows">${proj.length ? proj.map(({ d, c }) => html`<${OfRow} lead=${html`<img class="thumb" src=${img(L(d.listing).img)} alt="" />`} title=${L(d.listing).addr} sub=${A(d.agent).name + " · closing " + d.close + " · agent nets " + usd(c.net)} right=${html`<b class="num">${usd(c.gross)}</b>`} onClick=${() => go("deal/" + d.id)} />`) : html`<${OfEmpty} title="Nothing under contract" />`}</div></div>
        <div class="card"><div class="hd"><h3>Caps this year</h3>${hasTx ? html`<span class="sp"></span><button class="btn sm" onClick=${() => go("commissions/plans")}>Plans</button>` : ""}</div><div class="bd of-col" style="gap:12px">${caps.map(([a, paid, cap]) => html`<div class="of-cap"><span class="row" style="gap:8px"><${Av} a=${A(a)} />${A(a).name}</span><div class="bar"><i style=${"width:" + Math.min(100, paid / cap * 100) + "%"}></i></div><span class="muted num">${usd(paid)} of ${usd(cap)}</span></div>`)}</div></div>
      </div>
    </div></${Shell}>`;
}

// ================= MODULES =================
const OF_MOD = { site: ["Public site, map search, listing pages, tour booking", 49], inbox: ["Inbox with AI drafts, templates and consent", 39], people: ["People, smart lists, tasks and lead routing", 29], pipeline: ["Deals board, deal files, e-sign, compliance", 59], listings: ["Listings, AI copy, distribution, net sheets, offers", 39], rentals: ["Rentals, rent roll, work orders, owner & tenant portals", 89], projects: ["Project inventory, holds, bookings, brokers", 149], backoffice: ["Commissions, CDAs, trust accounting, 1099s", 69], today: ["Your morning across every module", 0] };
function Bundle() {
  const locked = !!(S.role && S.role.nav);
  const on = PERSONAS[S.persona].mods;
  const price = on.reduce((a, id) => a + ((OF_MOD[id] || [])[1] || 0), 0);
  function toggle(m) {
    if (m.always) { toast("Today is always on: it's the home screen"); return; }
    if (locked) { toast("Only the broker-owner can change modules"); return; }
    const was = on.includes(m.id);
    up(s => { const mods = PERSONAS[s.persona].mods; if (s.persona !== "custom") { PERSONAS.custom = { name: "Custom", mods: [...mods] }; s.persona = "custom"; } const c = PERSONAS.custom.mods; const i = c.indexOf(m.id); i >= 0 ? c.splice(i, 1) : c.push(m.id); });
    toast(was ? m.name + " turned off · removed from the sidebar. Its records stay on every person, deal and home." : m.name + " turned on · it's in the sidebar now, already filled with your data.");
  }
  return html`<${Shell} title="Modules" sub="Buy only what your business needs. Every module shares the same people, homes and deals.">
    <div class="page">
      ${locked ? html`<div class="of-banner">You're signed in as ${me().name}. Your seat shows ${S.role.nav.length} screens; only the broker-owner can change the bundle.</div>` : ""}
      <div class="of-toolbar"><${OfSeg} label="Bundle" value=${S.persona} set=${k => { if (locked) { toast("Only the broker-owner can change modules"); return; } up(s => { s.persona = k; }); toast("Showing the " + PERSONAS[k].name + " bundle"); }} opts=${Object.entries(PERSONAS).map(([k, p]) => [k, p.name])} />
        <span class="sp" style="flex:1"></span><div class="of-price"><span>Monthly</span><b class="num">${usd(price)}</b><small>${on.length} modules · per office</small></div></div>
      <div class="mods">${MODULES.map(m => { const isOn = on.includes(m.id); return html`<button class=${"mod" + (isOn ? " on" : "") + (locked && !m.always ? " of-locked" : "")} role="switch" aria-checked=${isOn} onClick=${() => toggle(m)}><span class="sw"></span><b>${m.name}</b><span>${m.desc}</span><em>Matches: ${m.leader}</em><small class="of-modp">${m.always ? "Included" : "$" + ((OF_MOD[m.id] || [])[1] || 0) + "/mo"}${isOn && !m.always ? html` · <a class="of-link" onClick=${e => { e.stopPropagation(); go(m.id); }}>Open</a>` : ""}</small></button>`; })}</div>
      <div class="card"><div class="hd"><h3>What your team sees</h3></div><div class="bd of-col" style="gap:8px">
        <div class="row of-wrap">${MODULES.filter(m => on.includes(m.id)).map(m => html`<span class="pill f">${m.name}</span>`)}${MODULES.filter(m => !on.includes(m.id)).map(m => html`<span class="pill" style="text-decoration:line-through">${m.name}</span>`)}</div>
        <div class="muted" style="font-size:12.5px">Turning a module off hides its screens; nothing is deleted. Conversations stay on timelines, deals keep their files, and turning it back on restores everything.</div></div></div>
      <div class="card"><div class="bd" style="display:flex;gap:28px;flex-wrap:wrap;font-size:13px">
        <div><div class="lbl">Pricing</div><div style="margin-top:4px">Published prices · month-to-month · cancel online</div></div>
        <div><div class="lbl">Your data</div><div style="margin-top:4px">Agents' contacts leave with them; brokerage records stay</div></div>
        <div><div class="lbl">Mobile</div><div style="margin-top:4px">Every module works fully on a phone</div></div>
        <div><div class="lbl">AI</div><div style="margin-top:4px">Drafts and suggests; you always have the manual path</div></div></div></div>
    </div></${Shell}>`;
}

// ================= GLOBAL SEARCH PROVIDER =================
// The shell already indexes people, deals, listings, threads, units and tickets; office adds project units, broker registrations and open tasks.
(window.EOS_SEARCH = window.EOS_SEARCH || []).push(function ofSearch() {
  if (typeof S === "undefined" || !S.d || !S.d.of) return [];
  const out = [];
  S.d.projUnits.forEach(u => out.push({ label: "The Linden · unit " + u.code, sub: u.type + " · " + u.facing + " · " + u.status + (u.buyerName ? " · " + u.buyerName : ""), route: "projects/" + u.code, kind: "Project units", icon: "projects" }));
  S.d.of.cpRegs.forEach(r => out.push({ label: r.buyer + " · " + r.cp, sub: "Broker registration · " + r.status, route: "projects/partners", kind: "Broker registrations", icon: "people" }));
  S.d.of.tasks.filter(t => !t.done).forEach(t => out.push({ label: t.t, sub: "Task · " + A(t.who).name + " · due " + t.due, route: t.person ? "person/" + t.person : "today", kind: "Tasks", icon: "check" }));
  return out;
});

// ================= WEBSITE DATA (site.js) IN OFFICE VIEWS =================
// Website holds carry a text "until"; give them a real expiry so they tick and auto-release like every other hold.
function ofNormHolds() {
  (S.d.projUnits || []).forEach(u => {
    if (u.status === "Held" && u.hold && !u.holdUntil) {
      const n = ofDays(u.hold.until); u.holdUntil = Date.now() + Math.max(1, (n == null ? 3 : n)) * 864e5 + 5 * 36e5;
      u.holdFor = u.hold.by + " · Website · " + usd(u.hold.amount || 0) + " refundable";
    }
  });
}
function OfWebLeads({ who, pid }) {
  const tours = (S.d.siteTours || []).filter(t => pid ? t.pid === pid : (!who || t.agent === who));
  const vals = (S.d.valuations || []).filter(v => pid ? v.pid === pid : (!who || (P(v.pid) || {}).owner === who));
  if (!tours.length && !vals.length) return pid ? "" : html`<${OfCard} title="From the website" icon="site"><${OfEmpty} icon="site" title="No new website leads" sub="Tour requests and home-value requests land here." /></${OfCard}>`;
  return html`<${OfCard} title="From the website" icon="site" tone="b" count=${tours.length + vals.length}><div class="of-rows">
    ${tours.map(t => { const p = P(t.pid), l = L(t.l); return p && l ? html`<${OfRow} lead=${html`<${OfChip} n="key" tone="b" />`} title=${"Tour request · " + l.addr} sub=${(pid ? "" : p.name + " · ") + t.when + " · " + (t.mode === "video" ? "video" : "in person") + " · with " + A(t.agent).name.split(" ")[0] + (p.tags.includes("Touring agreement") ? " · touring agreement signed" : "")} right=${html`<span class=${"pill " + (t.status === "Confirmed" ? "g" : "a")}>${t.status}</span>${t.status === "Requested" ? html`<button class="btn sm" onClick=${e => { e.stopPropagation(); up(() => { t.status = "Confirmed"; ofSay(p.id, "You're confirmed for " + l.addr + " · " + t.when + ". See you there! – " + A(t.agent).name.split(" ")[0], (ofThreadFor(p.id) || {}).channel || "SMS"); ofLog(p.id, "Website", "Tour confirmed · " + l.addr + " · " + t.when); }); toast("Tour confirmed · " + ofFirst(p.name) + " notified"); }}>Confirm</button>` : ""}`} onClick=${() => go("person/" + p.id)} />` : ""; })}
    ${vals.map(v => { const p = P(v.pid); return p ? html`<${OfRow} lead=${html`<${OfChip} n="listings" tone="br" />`} title=${"Home value · " + v.addr} sub=${(pid ? "" : p.name + " · ") + usd(v.low) + "–" + usd(v.high) + (v.consult ? " · consult " + v.consult.when : " · no consult booked yet")} right=${html`<span class=${"pill " + (v.consult ? "g" : "a")}>${v.consult ? "Consult booked" : "New"}</span>${!v.consult ? html`<button class="btn sm" onClick=${e => { e.stopPropagation(); ofOpen("ofListing", { addr: v.addr, area: v.area || "" }); }}>Start listing</button>` : ""}`} onClick=${() => go("person/" + p.id)} />` : ""; })}
  </div></${OfCard}>`;
}
const OF_APP_ST = { Submitted: "b", "In review": "a", Approved: "g", Declined: "r" };
function OfWebApps() {
  const apps = S.d.applications || [];
  const [why, setWhy] = useState({}), [err, setErr] = useState({});
  const set = (a, st, extra) => { up(() => { a.status = st; Object.assign(a, extra || {}); if (a.pid) { ofLog(a.pid, "Rentals", "Application " + a.id + " · " + st); ofSay(a.pid, st === "Approved" ? "Good news: your application for " + ofUnitName(S.d.units.find(u => u.id === a.unit)) + " is approved. The lease is on its way." : st === "Declined" ? "Thanks for applying. We can't approve this application; you'll get a written notice with the reasons and your rights by email." : "We've started reviewing your application. Screening usually takes one business day.", "Email"); } }); toast("Application " + a.id + " · " + st); };
  return html`<div class="card"><div class="hd"><h3>Website applications</h3><span class="sp"></span><span class="of-count">${apps.length}</span></div>
    ${apps.length ? html`<div class="of-scroll"><table class="t"><thead><tr><th>Applicant</th><th>Unit</th><th>Income</th><th>Fee</th><th>Consent</th><th>Status</th><th></th></tr></thead><tbody>${apps.map(a => { const u = S.d.units.find(x => x.id === a.unit); return html`<tr><td><b>${a.pid ? html`<a class="of-link" onClick=${() => go("person/" + a.pid)}>${a.name}</a>` : a.name}</b><div class="muted" style="font-size:12px">${a.id} · ${a.at} · move-in ${a.moveIn || "—"}</div></td><td>${u ? ofUnitName(u) : a.unit}</td><td class="num">${a.ratio}× rent${a.ratio < 2.5 ? html` <span class="pill a">Below 2.5×</span>` : ""}</td><td class="num">${a.fee ? usd(a.fee) + " paid" : "—"}</td><td>${a.consent ? html`<span class="pill g">Screening ✓</span>` : html`<span class="pill r">Missing</span>`}</td><td><span class=${"pill " + (OF_APP_ST[a.status] || "")}>${a.status}</span>${a.reason ? html`<div class="muted" style="font-size:11.5px">${a.reason}</div>` : ""}</td>
      <td style="text-align:right">${a.status === "Submitted" ? html`<button class="btn sm pri" onClick=${() => set(a, "In review")}>Start review</button>`
        : a.status === "In review" ? html`<div class="of-col" style="gap:4px;align-items:flex-end"><div class="row" style="gap:6px"><button class="btn sm pri" disabled=${!a.consent} title=${a.consent ? "" : "Screening consent missing"} onClick=${() => set(a, "Approved")}>Approve</button><button class="btn sm" onClick=${() => { if (!(why[a.id] || "").trim()) { setErr({ ...err, [a.id]: "Give the reason (it goes in the notice)" }); return; } set(a, "Declined", { reason: why[a.id].trim() }); }}>Decline</button></div><input class="of-in" style="width:200px" aria-label=${"Decline reason for " + a.name} placeholder="Reason if declining" value=${why[a.id] || ""} onInput=${e => { setWhy({ ...why, [a.id]: e.target.value }); setErr({ ...err, [a.id]: "" }); }} />${err[a.id] && html`<em class="of-err">${err[a.id]}</em>`}</div>`
        : a.status === "Declined" ? html`<button class="btn sm" onClick=${() => go(ofCan("pmops") ? "pmops" : "rentals/applications")}>Adverse-action notice</button>`
        : a.leaseSent ? html`<span class="pill f">Lease sent</span>` : html`<button class="btn sm pri" onClick=${() => { up(() => { a.leaseSent = true; }); toast("Lease sent to " + a.name + " for e-signature"); }}>Send lease</button>`}</td></tr>`; })}</tbody></table></div>` : html`<${OfEmpty} icon="rentals" title="No website applications yet" sub="Applications from harborandvine.com/rent land here with fee and screening consent." />`}</div>`;
}
function OfInterests() {
  const list = S.d.interests || [];
  return html`<${OfCard} title="Registered interest · website" icon="star" tone="br" count=${list.length}><div class="of-rows">${list.length ? list.map(i => { const p = P(i.pid); return p ? html`<${OfRow} lead=${html`<${PAv} p=${p} />`} title=${p.name} sub=${[i.type, i.code && "unit " + i.code, i.budget, i.when].filter(Boolean).join(" · ") + " · " + i.at} right=${i.code && (S.d.projUnits.find(u => u.code === i.code) || {}).status === "Available" ? html`<button class="btn sm" onClick=${e => { e.stopPropagation(); ofOpen("ofHold", { code: i.code }); }}>Hold ${i.code}</button>` : html`<span class="pill">${i.code ? (S.d.projUnits.find(u => u.code === i.code) || {}).status : "Any unit"}</span>`} onClick=${() => go("person/" + p.id)} />` : ""; }) : html`<${OfEmpty} icon="star" title="No registrations yet" sub="Buyers who register interest on the website appear here." />`}</div></${OfCard}>`;
}
