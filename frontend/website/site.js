// Estate OS public website: harborandvine.com, the "Website visitor" persona's home and the front door to every portal.
// Routes: site, site/buy, site/home/L1, site/saved, site/sell, site/rent, site/unit/U3, site/apply/U3, site/new-homes,
//         site/agents, site/agent/jordan, site/legal/iabs|cpn|fair-housing|privacy|accessibility. Legacy site/L1 still works.
// Uses the store and helpers from app.js at call time (app.js loads last). Prefix: sx / Sx / .sx-
// Everything a visitor does lands on real records: people, threads (office Inbox), deals, units, projUnits, and window.notify.

(window.EOS_EXT = window.EOS_EXT || []).push({
  seed(d) {
    const kw = { L1: "pool study terrace light open kitchen yard trees", L2: "yard greenbelt trails updated kitchen garage", L3: "lake views pool gym balcony concierge walkable", L4: "modern study rooftop deck walkable zilker park", L5: "pool acre views wine cellar gated media room", L6: "rooftop deck walkable garage new construction", L7: "views pool study guest suite", L8: "acre horses barn workshop quiet" };
    d.listings.forEach(l => { if (!l.kw) l.kw = kw[l.id] || ""; });
    d.savedSearches = d.savedSearches || [];
    d.applications = d.applications || [];
    d.siteTours = d.siteTours || [];
    d.valuations = d.valuations || [];
    d.holds = d.holds || [];
    d.interests = d.interests || [];
    d.siteSaved = d.siteSaved || {};
  },
  modals: {
    sxAuth: (p) => SxAuthModal(p), sxTour: (p) => SxTourModal(p), sxGallery: (p) => SxGalleryModal(p),
    sxSaveSearch: (p) => SxSaveSearchModal(p), sxAsk: (p) => SxAskModal(p), sxHold: (p) => SxHoldModal(p), sxInterest: (p) => SxInterestModal(p),
  },
});

// ---------- constants ----------
const SX_TODAY = "Oct 8";
const SX_BROKER = { name: "Harbor & Vine Realty LLC", lic: "9012345", addr: "1100 S Congress Ave, Suite 200, Austin, TX 78704", phone: "(512) 555-0123", email: "hello@harborandvine.com", broker: "Maya Ortiz", brokerLic: "612345" };
const SX_BIO = {
  maya: { lic: "612345", since: 2009, langs: ["English", "Spanish"], areas: ["Westlake", "Rollingwood", "Tarrytown"], bio: "Maya founded Harbor & Vine in 2009 after a decade selling West Austin homes. She still takes a handful of clients a year, mostly families moving up or downsizing, and runs the brokerage's pricing reviews.", focus: "Luxury & relocation" },
  jordan: { lic: "701234", since: 2016, langs: ["English", "Korean"], areas: ["Bee Cave", "Barton Hills", "East Austin"], bio: "Jordan works with buyers from the first text to the keys: first-timers, relocations and investors. Expect same-day tour slots, honest comps and a plan for your offer before you fall in love with a house.", focus: "Buyers & first-time buyers" },
  priya: { lic: "688812", since: 2014, langs: ["English", "Hindi", "Gujarati"], areas: ["Tarrytown", "Zilker", "Barton Hills"], bio: "Priya prices, prepares and markets homes. Her sellers get a live net sheet, a prep plan with vetted vendors and weekly feedback from every showing.", focus: "Sellers & pricing" },
  sam: { lic: "723456", since: 2019, langs: ["English"], areas: ["Downtown", "East Austin", "Mueller"], bio: "Sam specialises in condos, townhomes and new construction close to downtown. He knows every HOA budget on Rainey Street by heart.", focus: "Condos & townhomes" },
  leo: { lic: "654321", since: 2012, langs: ["English", "Spanish"], areas: ["Eastside Lofts", "Govalle Row"], bio: "Leo runs Harbor & Vine's rentals: leasing, maintenance and owner reporting for 18 homes across two buildings. Applications get an answer within one business day.", focus: "Rentals & property management" },
  rohan: { lic: "", since: 2021, langs: ["English", "Hindi", "Marathi"], areas: ["Mueller"], bio: "Rohan leads sales for The Linden at Mueller for Cedar Ridge Homes. He can walk you through floor plans, the payment schedule and the finish packages, in person or on video.", focus: "New homes · The Linden", partner: true },
};
const SX_DIR = ["maya", "jordan", "priya", "sam", "leo"];
const SX_COPY = {
  L1: "A 2019 build on a quiet, tree-lined Tarrytown street. Floor-to-ceiling glass pulls light into an open kitchen with a 12-foot island, the covered terrace looks over a pool and mature live oaks, and the study works as a fifth bedroom.",
  L2: "Classic Barton Hills on a quarter acre backing onto the greenbelt. Updated kitchen with quartz and a gas range, refinished oak floors and a two-car garage, ten minutes from downtown and steps from the trails.",
  L3: "Corner residence on the 14th floor with lake views from every room. Floor-to-ceiling windows, a chef's kitchen, two en-suite bedrooms and a resort pool, gym and 24-hour concierge downstairs.",
  L4: "A new modern build in Zilker with a rooftop deck facing downtown. Four bedrooms plus a study, white oak throughout and a two-minute walk to Zilker Park. Coming soon: showings open Monday.",
  L5: "Gated Westlake estate on 0.62 acres with hill-country views, a resort pool and spa, a wine room and a media room. Eanes ISD.",
  L6: "Three-storey townhome in East Austin with a private rooftop deck, attached garage and low HOA. Walk to coffee, Govalle Park and the hike-and-bike trail.",
  L7: "Contemporary Rollingwood home with a guest suite, study and pool. Under contract: ask us about backup offers.",
  L8: "Single-storey ranch on 1.1 acres in Bee Cave with a detached workshop, mature trees and room for horses. Lake Travis ISD.",
};
const SX_SCHOOLS = { L1: [["Casis Elementary", "9/10", "0.6 mi"], ["O. Henry Middle", "8/10", "1.4 mi"], ["Austin High", "8/10", "2.1 mi"]], L2: [["Barton Hills Elementary", "8/10", "0.4 mi"], ["O. Henry Middle", "8/10", "3.0 mi"], ["Austin High", "8/10", "2.6 mi"]], L3: [["Mathews Elementary", "8/10", "1.2 mi"], ["O. Henry Middle", "8/10", "1.9 mi"], ["Austin High", "8/10", "1.5 mi"]], L4: [["Zilker Elementary", "8/10", "0.3 mi"], ["O. Henry Middle", "8/10", "1.6 mi"], ["Austin High", "8/10", "1.2 mi"]], L5: [["Forest Trail Elementary", "10/10", "1.1 mi"], ["West Ridge Middle", "10/10", "2.4 mi"], ["Westlake High", "10/10", "2.0 mi"]], L6: [["Govalle Elementary", "6/10", "0.5 mi"], ["Martin Middle", "6/10", "1.3 mi"], ["Eastside Early College", "7/10", "1.8 mi"]], L7: [["Eanes Elementary", "9/10", "1.0 mi"], ["Hill Country Middle", "9/10", "1.7 mi"], ["Westlake High", "10/10", "2.2 mi"]], L8: [["Bee Cave Elementary", "9/10", "1.8 mi"], ["Lake Travis Middle", "8/10", "3.4 mi"], ["Lake Travis High", "9/10", "4.0 mi"]] };
const SX_COMMUTE = { L1: 14, L2: 12, L3: 4, L4: 9, L5: 22, L6: 11, L7: 18, L8: 28 };
const SX_QUOTES = { D7: "Priya and Maya priced it right the first time. Four offers in a weekend and we knew our net down to the dollar before we signed anything.", D8: "Jordan found our place before it hit the portals and talked us out of two houses that weren't right. Closing was boringly smooth, in the best way." };
const SX_DAYS = [["Fri", 9], ["Sat", 10], ["Sun", 11], ["Mon", 12], ["Tue", 13]];
const SX_SLOTS = ["10:30 am", "1:00 pm", "3:30 pm", "5:00 pm"];
const SXI = {
  heart: "M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z",
  share: "M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13",
  map: "M9 4 3 6v14l6-2 6 2 6-2V4l-6 2zM9 4v14M15 6v14",
  list: "M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01",
  filter: "M3 5h18M6 12h12M10 19h4",
  cal: "M3 5h18v16H3zM16 3v4M8 3v4M3 10h18",
  video: "M15 10l5-3v10l-5-3zM3 7h12v10H3z",
  chat: "M4 4h16v12H8l-4 4z",
  user: "M20 21a8 8 0 1 0-16 0M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8",
  menu: "M3 6h18M3 12h18M3 18h18",
  x: "M6 6l12 12M18 6 6 18",
  left: "M15 18l-6-6 6-6", right: "M9 18l6-6-6-6",
  pin: "M12 21s-7-6.2-7-11a7 7 0 1 1 14 0c0 4.8-7 11-7 11zM12 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4",
  key: "M15 7a4 4 0 1 1-3.5 6L4 20.5V17h3v-3h3l1.5-1.5A4 4 0 0 1 15 7z",
  shield: "M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z",
  school: "M2 9l10-5 10 5-10 5zM6 11v5c3 2 9 2 12 0v-5",
  car: "M5 16h14l-1.5-6h-11zM7 16v3M17 16v3M7.5 13h.01M16.5 13h.01",
  star: "M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.5 2.9 1-6.1L3.1 9.5l6.1-.9z",
  tag: "M3 12V3h9l9 9-9 9zM7.5 7.5h.01",
  bolt: "M13 2 4 14h7l-1 8 9-12h-7z",
  home: "M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z",
  doc: "M6 2h9l5 5v15H6zM14 2v6h6M9 13h6M9 17h6",
  card: "M2 6h20v12H2zM2 10h20",
};
const SxI = ({ n, s = 16 }) => html`<${Ic} n=${SXI[n] || n} s=${s} />`;

// ---------- state ----------
let sxBusyT;
function sx() {
  if (!S.site) S.site = { user: null, f: sxBlankF(), rf: { beds: 0, max: 0 }, view: "list", menu: false, umenu: false, fOpen: false, consent: sxReadConsent(), consentEdit: false, val: null };
  return S.site;
}
const sxBlankF = () => ({ q: "", min: 0, max: 0, beds: 0, baths: 0, type: "Any", area: "Any", status: "sale", sort: "new" });
function sxReadConsent() { try { const v = localStorage.getItem("hv-consent"); return v ? JSON.parse(v) : null; } catch (e) { return null; } }
function sxSaveConsent(c) { up(() => { sx().consent = c; sx().consentEdit = false; }); try { localStorage.setItem("hv-consent", JSON.stringify(c)); } catch (e) {} }
const SX_ROLE_PID = { buyer: "P4", seller: "P2", tenant: "P6", landlord: "P1" };
const SX_PID_ROLE = { P4: "buyer", P2: "seller", P6: "tenant", P1: "landlord" };
function sxUser() {
  const r = S.role && SX_ROLE_PID[S.role.id];
  if (r) return P(r);
  const id = S.site && S.site.user;
  return id ? P(id) : null;
}
const sxFirst = (p) => p ? (p.id === "P4" ? "Elena" : p.name.split(/\s|&/)[0]) : "";
function sxSaved(u = sxUser()) {
  if (!u) return {};
  if (u.id === "P4" && typeof pj === "function") return pj().saved;
  S.d.siteSaved = S.d.siteSaved || {};
  return (S.d.siteSaved[u.id] = S.d.siteSaved[u.id] || {});
}
function sxSignInAs(pid) {
  const rid = SX_PID_ROLE[pid], r = rid && typeof roleById === "function" ? roleById(rid) : null;
  up(s => { sx().user = pid; sx().umenu = false; if (r) { s.role = r; s.persona = r.bundle || "all"; } });
  if (r) try { localStorage.setItem("eos-role", r.id); } catch (e) {}
}
function sxSignOut() {
  const n = sxFirst(sxUser());
  up(s => { sx().user = null; sx().umenu = false; if (S.role && SX_ROLE_PID[S.role.id]) { s.role = roleById("visitor"); } });
  try { if (S.role && S.role.id === "visitor") localStorage.setItem("eos-role", "visitor"); } catch (e) {}
  toast("Signed out" + (n ? " · see you soon, " + n : ""));
}
// gate: anything that needs an account (save, save search, pre-qualify) opens sign-in, then continues
function sxGate(reason, then, mode) { up(s => { s.modal = { kind: "sxAuth", mode: mode || "create", reason, then }; }); }

// ---------- records ----------
function sxNextId(arr, pre) { return pre + (arr.reduce((m, x) => Math.max(m, +String(x.id).replace(/\D/g, "") || 0), 0) + 1); }
const sxIni = (name) => name.split(/\s|&/).filter(Boolean).map(w => w[0]).slice(0, 2).join("").toUpperCase();
function sxUpsertPerson({ name, email, phone, owner, source, stage, tags = [], roles = [] }) {
  const d = S.d, em = (email || "").trim().toLowerCase(), ph = (phone || "").replace(/\D/g, "").slice(-10);
  let p = d.people.find(x => (em && x.email && x.email.toLowerCase() === em) || (ph.length === 10 && x.phone && x.phone.replace(/\D/g, "").slice(-10) === ph));
  const isNew = !p;
  if (!p) {
    p = { id: sxNextId(d.people, "P"), name: name.trim(), short: name.trim().split(" ").pop(), ini: sxIni(name), phone: phone || "", email: (email || "").trim(), owner: owner || "jordan", source: source || "Website", stage: stage || "New lead", tags: [], roles: [], score: 55, last: "now" };
    d.people.unshift(p);
  } else { if (!p.email && email) p.email = email.trim(); if (!p.phone && phone) p.phone = phone; p.last = "now"; }
  tags.forEach(t => p.tags.includes(t) || p.tags.push(t));
  roles.forEach(t => p.roles.includes(t) || p.roles.push(t));
  return { p, isNew };
}
function sxLog(p, text, o = {}) {
  const d = S.d; let t = d.threads.find(x => x.person === p.id);
  if (!t) { t = { id: sxNextId(d.threads, "T"), person: p.id, channel: o.channel || "Website", unread: 0, when: "now", subject: o.subject || "Website enquiry", msgs: [] }; d.threads.unshift(t); }
  t.msgs.push({ from: "them", text, at: "now", ch: "Website" });
  if (o.auto) t.msgs.push({ from: "ai", text: o.auto, at: "now", ch: o.autoCh || "SMS", note: o.note || "Sent automatically by the website assistant" });
  t.unread += 1; t.when = "now";
  if (d.activity) d.activity.push([p.id, o.mod || "Website", text, SX_TODAY]);
  return t;
}
function sxNotify(who, text, route) { try { window.notify && window.notify({ who, text, route, at: "now" }); } catch (e) {} }

// ---------- validation ----------
const sxV = {
  name: v => String(v).trim().length < 2 ? "Enter your full name" : "",
  email: v => !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(v).trim()) ? "Enter a valid email, like you@example.com" : "",
  phone: v => String(v).replace(/\D/g, "").length < 10 ? "Enter a 10-digit phone number" : "",
  phoneOpt: v => v && String(v).replace(/\D/g, "").length < 10 ? "Enter a 10-digit phone number or leave it blank" : "",
  req: v => String(v).trim() ? "" : "Required",
  tick: v => v ? "" : "Please confirm to continue",
};
function sxCheck(v, rules) { const e = {}; for (const k in rules) { const m = rules[k](v[k] == null ? "" : v[k], v); if (m) e[k] = m; } return e; }
const sxBad = (e) => Object.values(e).some(Boolean);
function sxFmtPhone(v) { const d = String(v).replace(/\D/g, "").slice(-10); return d.length === 10 ? "(" + d.slice(0, 3) + ") " + d.slice(3, 6) + "-" + d.slice(6) : v; }
function sxForm(init) {
  const [v, setV] = useState(init), [err, setErr] = useState({});
  const set = (k) => (e) => { const t = e.target, val = t.type === "checkbox" ? t.checked : t.value; setV(o => ({ ...o, [k]: val })); setErr(o => (o[k] ? { ...o, [k]: "" } : o)); };
  const put = (k, val) => { setV(o => ({ ...o, [k]: val })); setErr(o => (o[k] ? { ...o, [k]: "" } : o)); };
  const check = (rules) => { const e = sxCheck(v, rules); setErr(e); if (sxBad(e)) { setTimeout(() => { const el = document.querySelector(".sx-f.bad input, .sx-f.bad select, .sx-ck.bad input"); el && el.focus(); }, 30); return false; } return true; };
  return { v, set, put, err, setErr, check, setV };
}
const SxF = ({ label, err, hint, children, cls }) => html`<label class=${"field sx-f" + (err ? " bad" : "") + (cls ? " " + cls : "")}><span>${label}</span>${children}${err ? html`<em class="sx-err" role="alert">${err}</em>` : hint ? html`<small class="sx-hint">${hint}</small>` : ""}</label>`;
const SxCk = ({ checked, onChange, err, children }) => html`<label class=${"sx-ck" + (err ? " bad" : "")}><input type="checkbox" checked=${checked} onChange=${onChange} /><span>${children}${err ? html`<em class="sx-err" role="alert">${err}</em>` : ""}</span></label>`;
function SxContact({ f, sms = true, smsText }) {
  const { v, set, err, put } = f;
  return html`<div class="sx-grid2">
    <${SxF} label="Full name" err=${err.name} cls="sx-span2"><input autocomplete="name" value=${v.name} onInput=${set("name")} placeholder="First and last name" /></${SxF}>
    <${SxF} label="Email" err=${err.email}><input type="email" autocomplete="email" value=${v.email} onInput=${set("email")} placeholder="you@example.com" /></${SxF}>
    <${SxF} label="Mobile" err=${err.phone}><input type="tel" autocomplete="tel" value=${v.phone} onInput=${set("phone")} onBlur=${() => put("phone", sxFmtPhone(v.phone))} placeholder="(512) 555-0100" /></${SxF}>
    ${sms ? html`<div class="sx-span2"><${SxCk} checked=${v.sms} onChange=${set("sms")}>${smsText || "Text me updates about this request. Msg & data rates may apply; reply STOP to opt out. Not required to buy anything."}</${SxCk}></div>` : ""}
  </div>`;
}
// modal chrome: Esc closes, Enter in a field runs the primary action, first field gets focus
function SxModal({ title, sub, close, children, foot, cls, onEnter }) {
  const ref = useRef();
  useEffect(() => {
    const k = e => { if (e.key === "Escape") close(); };
    addEventListener("keydown", k);
    const f = ref.current && ref.current.querySelector(".bd input:not([type=checkbox]):not([type=range]), .bd select");
    f && f.focus();
    return () => removeEventListener("keydown", k);
  }, []);
  return html`<div class="scrim" onClick=${e => { if (e.target === e.currentTarget) close(); }}><div ref=${ref} class=${"modal sx-modal " + (cls || "")} role="dialog" aria-modal="true" aria-label=${title}
      onKeyDown=${e => { if (e.key === "Enter" && onEnter && e.target.tagName === "INPUT" && e.target.type !== "checkbox") { e.preventDefault(); onEnter(); } }}>
    <div class="hd"><div class="sx-mt"><h3>${title}</h3>${sub ? html`<div class="sx-msub">${sub}</div>` : ""}</div><button class="btn sm ghost" aria-label="Close" title="Close (Esc)" onClick=${close}><${SxI} n="x" s=${14} /></button></div>
    <div class="bd">${children}</div>${foot ? html`<div class="ft">${foot}</div>` : ""}</div></div>`;
}
function SxSteps({ steps, i }) {
  return html`<div class="stepper sx-stepper">${steps.map((s, k) => html`<div class=${"st" + (k < i ? " done" : k === i ? " now" : "")}><i>${k < i ? "✓" : k + 1}</i><span>${s}</span></div>`)}</div>`;
}
function SxDone({ title, sub, next, children }) {
  return html`<div class="sx-done"><div class="sx-tick"><${SxI} n="check" s=${26} /></div><h3>${title}</h3>${sub ? html`<p>${sub}</p>` : ""}
    ${next ? html`<ol class="sx-next">${next.map((t, i) => html`<li><i>${i + 1}</i><span>${t}</span></li>`)}</ol>` : ""}${children}</div>`;
}
const SxSpin = () => html`<span class="sx-spin" aria-hidden="true"></span>`;

// ---------- shared bits ----------
const sxMls = (l) => "HV-" + (24100 + (+l.id.replace(/\D/g, "")) * 37);
const sxStCls = (st) => ({ Active: "g", "Coming soon": "b", "Under contract": "a", Sold: "" }[st] || "");
const sxMed = (a) => { const s = [...a].sort((x, y) => x - y); return s.length ? s[Math.floor(s.length / 2)] : 0; };
const sxAreas = () => [...new Set(S.d.listings.map(l => l.area))];
const sxForSale = () => S.d.listings.filter(l => l.status === "Active" || l.status === "Coming soon");
const sxVacant = () => S.d.units.filter(u => u.status === "Vacant" || !u.tenant);
const sxAvail = () => S.d.projUnits.filter(u => u.status === "Available");
const sxSeg = () => location.hash.replace(/^#\/?/, "").split("/").slice(1).filter(Boolean);
function sxUnitInfo(u) {
  const b = S.d.buildings.find(x => x.id === u.b);
  return { b, baths: u.beds >= 3 ? 2.5 : u.beds === 2 ? 2 : 1, sqft: u.beds >= 3 ? 1420 : u.beds === 2 ? 1060 : 720, photos: u.b === "B1" ? [b.img, "i-loft", "i-lounge", "i-bed"] : [b.img, "i-sofa", "i-chair", "i-bed"], apps: S.d.applications.filter(a => a.unit === u.id).length + ((S.d.rz && S.d.rz.applicants) || []).filter(a => a.unit === u.id).length };
}
const sxAgentOf = (l) => A(l.agent);
const sxOwnerFor = (u) => (u && u.owner) || "jordan";

function SxCard({ l, onHover, hot }) {
  const sv = !!sxSaved()[l.id], m = monthly(l.price, 20, 6.4, l.tax, l.hoa);
  const open = () => go("site/home/" + l.id);
  return html`<article class=${"lc sx-lc" + (hot ? " hot" : "")} tabindex="0" role="link" aria-label=${l.addr + ", " + usd(l.price)} onMouseEnter=${() => onHover && onHover(l.id)} onMouseLeave=${() => onHover && onHover(null)} onClick=${open} onKeyDown=${e => { if (e.key === "Enter" && e.target === e.currentTarget) open(); }}>
    <div class="im" style=${"background-image:url(" + img(l.img) + ")"}><span class="tg">${l.tag}</span>
      <button class=${"heart" + (sv ? " on" : "")} aria-label=${sv ? "Remove " + l.addr + " from saved" : "Save " + l.addr} title=${sv ? "Saved" : "Save"} onClick=${e => { e.stopPropagation(); sxToggleSave(l.id); }}>♥</button>
      ${l.status !== "Active" && l.tag !== l.status ? html`<span class=${"sx-st pill " + sxStCls(l.status)}>${l.status}</span>` : ""}</div>
    <div class="bd"><div class="pr num">${usd(l.price)}</div><div class="sp2"><b>${l.beds}</b> bd · <b>${l.baths}</b> ba · <b class="num">${l.sqft.toLocaleString()}</b> sqft · ${l.type}</div><div class="ad">${l.addr}, ${l.area}</div><div class="mo">Est. <span class="num">${usd(m.total)}</span>/mo</div>
      <div class="sx-court">Harbor & Vine Realty · MLS# ${sxMls(l)}</div></div></article>`;
}
function sxToggleSave(lid) {
  const u = sxUser();
  if (!u) return sxGate("Create a free account to save homes and get price-drop alerts.", () => sxToggleSave(lid));
  const map = sxSaved(u), on = !!map[lid], l = L(lid);
  up(() => {
    if (on) delete map[lid]; else { map[lid] = { by: sxFirst(u), react: "", note: "" }; const t = S.d.threads.find(x => x.person === u.id); if (t) { t.msgs.push({ from: "them", text: "Saved " + l.addr + " on the website", at: "now", ch: "Website" }); t.when = "now"; } }
    if (u.id === "P4" && typeof pj === "function" && !on) pj().feed.unshift(["Just now", "You saved " + l.addr + " on harborandvine.com"]);
  });
  toast(on ? "Removed " + l.addr + " from saved homes" : "Saved · " + (u.id === "P4" ? "it's on your board with Marco and Sam" : "we'll text you if the price changes"), on ? null : ["View saved", () => go("site/saved")]);
}

// ---------- frame ----------
function SxFrame({ children, active, path }) {
  const s = sx(), u = sxUser(), savedN = Object.keys(sxSaved(u)).length, rid = u && SX_PID_ROLE[u.id];
  const staff = S.role && S.role.kind === "office";
  const nav = [["buy", "Buy", "site/buy"], ["rent", "Rent", "site/rent"], ["sell", "Sell", "site/sell"], ["new", "New homes", "site/new-homes"], ["agents", "Agents", "site/agents"]];
  const nav2 = (to) => { up(() => { s.menu = false; s.umenu = false; }); go(to); };
  return html`<div class="site sx">
    <div class="sbar"><span>${staff ? "Customer view" : "Public website"}</span><span class="u">harborandvine.com${path ? "/" + path : ""}</span><span style="flex:1"></span>
      <button onClick=${() => leavePortal(S.role && S.role.home && !isClient() ? S.role.home : "today")}>${leaveLabel("← Back to the office")}</button></div>
    <header class="sx-hdr">
      <button class="sx-burger" aria-label=${s.menu ? "Close menu" : "Open menu"} aria-expanded=${s.menu} onClick=${() => up(() => { s.menu = !s.menu; s.umenu = false; })}><${SxI} n=${s.menu ? "x" : "menu"} s=${20} /></button>
      <a class="sx-logo" href="#/site" aria-label="Harbor & Vine Realty home"><span class="mk">H</span><span><b>Harbor & Vine</b><small>Realty · Austin</small></span></a>
      <nav class=${"sx-nav" + (s.menu ? " open" : "")} aria-label="Main">${nav.map(([k, t, to]) => html`<a href=${"#/" + to} class=${active === k ? "on" : ""} aria-current=${active === k ? "page" : null} onClick=${e => { e.preventDefault(); nav2(to); }}>${t}</a>`)}
        <a href="#/site/saved" class=${"sx-navsaved" + (active === "saved" ? " on" : "")} onClick=${e => { e.preventDefault(); nav2("site/saved"); }}>Saved homes${savedN ? " · " + savedN : ""}</a></nav>
      <span class="sp"></span>
      <button class=${"sx-saved" + (active === "saved" ? " on" : "")} onClick=${() => nav2("site/saved")} aria-label=${"Saved homes" + (savedN ? ", " + savedN : "")} title="Saved homes"><span class="h">♥</span><span class="t">Saved</span>${savedN ? html`<i class="num">${savedN}</i>` : ""}</button>
      ${window.EosChrome ? html`<span class="sx-tools"><${EosChrome.Tools} /></span>` : ""}
      ${u ? html`<div class="sx-um"><button class="sx-me" aria-haspopup="menu" aria-expanded=${s.umenu} onClick=${() => up(() => { s.umenu = !s.umenu; s.menu = false; })}><span class="av" style="background:var(--forest)">${u.ini}</span><span class="t">${sxFirst(u)}</span></button>
          ${s.umenu ? html`<div class="sx-drop" role="menu"><div class="sx-dh"><b>${u.name}</b><small>${u.email || u.phone}</small></div>
            ${rid && (typeof canRoute !== "function" || canRoute(roleById(rid).home)) ? html`<button role="menuitem" onClick=${() => nav2(roleById(rid).home)}><${SxI} n="key" s=${15} />My ${{ buyer: "buyer", seller: "seller", tenant: "tenant", landlord: "owner" }[rid]} portal</button>` : ""}
            <button role="menuitem" onClick=${() => nav2("site/saved")}><${SxI} n="heart" s=${15} />Saved homes & searches</button>
            <button role="menuitem" onClick=${sxSignOut}><${SxI} n="x" s=${15} />Sign out</button></div>` : ""}</div>`
        : html`<button class="btn sm pri sx-signin" onClick=${() => up(st => { s.menu = false; st.modal = { kind: "sxAuth", mode: "portal" }; })}>Sign in</button>`}
    </header>
    <main class="sx-main">${children}</main>
    <${SxFooter} />
    <${SxConsent} />
  </div>`;
}
function SxEho({ s = 30 }) {
  return html`<svg class="sx-eho" viewBox="0 0 32 32" width=${s} height=${s} role="img" aria-label="Equal Housing Opportunity"><path d="M16 3 2 13h4v15h20V13h4z" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round" /><path d="M10 17h12M10 22h12" stroke="currentColor" stroke-width="2.6" /></svg>`;
}
function SxFooter() {
  const s = sx(), L2 = (to, t) => html`<a href=${"#/" + to} onClick=${e => { e.preventDefault(); go(to); }}>${t}</a>`;
  return html`<footer class="sx-foot">
    <div class="sx-fgrid">
      <div class="sx-fb"><div class="sx-logo lt"><span class="mk">H</span><span><b>Harbor & Vine</b><small>Realty · Austin</small></span></div>
        <p>${SX_BROKER.addr}<br /><a href=${"tel:" + SX_BROKER.phone.replace(/\D/g, "")}>${SX_BROKER.phone}</a> · <a href=${"mailto:" + SX_BROKER.email}>${SX_BROKER.email}</a></p>
        <p class="sx-lic">${SX_BROKER.name} · TREC broker license #${SX_BROKER.lic}<br />Designated broker: ${SX_BROKER.broker}, license #${SX_BROKER.brokerLic}</p></div>
      <div><h4>Homes</h4>${L2("site/buy", "Homes for sale")}${L2("site/rent", "Apartments for rent")}${L2("site/new-homes", "New homes · The Linden")}${L2("site/sell", "What's my home worth?")}</div>
      <div><h4>Company</h4>${L2("site/agents", "Our agents")}${L2("site/saved", "Saved homes")}<a href="#/site" onClick=${e => { e.preventDefault(); up(st => { st.modal = { kind: "sxAuth", mode: "portal" }; }); }}>Client portals</a></div>
      <div><h4>Texas notices</h4>${L2("site/legal/iabs", "Information About Brokerage Services")}${L2("site/legal/cpn", "TREC Consumer Protection Notice")}${L2("site/legal/fair-housing", "Fair housing")}${L2("site/legal/privacy", "Privacy policy")}${L2("site/legal/accessibility", "Accessibility")}
        <a href="#/site" onClick=${e => { e.preventDefault(); up(() => { s.consentEdit = true; }); }}>Cookie settings · Your privacy choices</a></div>
    </div>
    <div class="sx-fair"><${SxEho} s=${34} /><p><b>Equal Housing Opportunity.</b> Harbor & Vine Realty is committed to the Fair Housing Act and the Texas Fair Housing Act. We do not discriminate on the basis of race, color, religion, sex, disability, familial status or national origin, and we welcome every buyer, seller and renter.</p></div>
    <p class="sx-mlsnote">Listing information is provided by Unlock MLS for consumers' personal, non-commercial use and is deemed reliable but not guaranteed. Some listings may have been excluded from this site at the seller's request. Data updated ${SX_TODAY}, 2026 at 9:00 am. School and commute details are samples; verify with the school district. This demo site uses sample data.</p>
    <div class="sx-fbot"><span>© 2026 ${SX_BROKER.name}</span><span>Austin, Texas</span></div>
  </footer>`;
}
function SxConsent() {
  const s = sx(), [edit, setEdit] = useState(false), gpc = typeof navigator !== "undefined" && navigator.globalPrivacyControl;
  const [a, setA] = useState(s.consent ? s.consent.analytics : false), [mk, setMk] = useState(s.consent ? s.consent.marketing : false);
  if (s.consent && !s.consentEdit) return null;
  const open = edit || s.consentEdit;
  return html`<div class="sx-cookie" role="dialog" aria-label="Cookie preferences">
    <b>Cookies on harborandvine.com</b>
    <p>We use essential cookies to run the site and keep you signed in. With your OK we'd also use analytics and marketing cookies. Non-essential cookies stay off unless you turn them on.${gpc ? " We detected Global Privacy Control and treat it as an opt-out." : ""}</p>
    ${open ? html`<div class="sx-ckrows">
      <label class="sx-tg"><span><b>Essential</b><small>Sign-in, saved homes, security. Always on.</small></span><input type="checkbox" checked disabled /></label>
      <label class="sx-tg"><span><b>Analytics</b><small>How pages are used, so we can improve them.</small></span><input type="checkbox" checked=${a} onChange=${e => setA(e.target.checked)} /></label>
      <label class="sx-tg"><span><b>Marketing</b><small>Ads on other sites. We never sell your data.</small></span><input type="checkbox" checked=${mk} onChange=${e => setMk(e.target.checked)} /></label></div>
      <div class="sx-ckbtns"><button class="btn sm" onClick=${() => sxSaveConsent({ analytics: false, marketing: false, at: SX_TODAY })}>Reject non-essential</button><button class="btn sm pri" onClick=${() => { sxSaveConsent({ analytics: a, marketing: mk, at: SX_TODAY }); toast("Cookie choices saved"); }}>Save my choices</button></div>`
      : html`<div class="sx-ckbtns"><button class="btn sm ghost" onClick=${() => setEdit(true)}>Customize</button><button class="btn sm" onClick=${() => sxSaveConsent({ analytics: false, marketing: false, at: SX_TODAY })}>Reject non-essential</button><button class="btn sm pri" onClick=${() => sxSaveConsent({ analytics: true, marketing: true, at: SX_TODAY })}>Accept all</button></div>`}
  </div>`;
}

// ---------- home ----------
function SxHome() {
  const s = sx(), [tab, setTab] = useState("buy"), [q, setQ] = useState(""), [max, setMax] = useState(0), [beds, setBeds] = useState(0), [addr, setAddr] = useState(""), [aErr, setAErr] = useState("");
  const forSale = sxForSale(), feat = [...forSale].filter(l => l.status === "Active").sort((a, b) => b.views - a.views).slice(0, 4);
  const areas = sxAreas().map(a => { const ls = S.d.listings.filter(l => l.area === a); return { a, n: ls.filter(l => l.status !== "Under contract").length, med: sxMed(ls.map(l => l.price)), img: ls[0].img }; }).sort((x, y) => y.n - x.n).slice(0, 6);
  const vac = sxVacant(), av = sxAvail(), pr = S.d.project, from = av.length ? Math.min(...av.map(u => u.price)) : 0;
  const reviews = S.d.deals.filter(d => d.stage === "Closed").slice(0, 3);
  function search() {
    if (tab === "buy") { up(() => { Object.assign(s.f, sxBlankF(), { q: q.trim(), max, beds }); }); go("site/buy"); }
    else if (tab === "rent") { up(() => { s.rf = { beds, max: 0 }; }); go("site/rent"); }
    else if (tab === "sell") { if (addr.trim().length < 5 || !/\d/.test(addr)) return setAErr("Enter a street address, like 1204 Elm St"); up(() => { s.val = { step: 1, v: sxValBlank({ addr: addr.trim() }) }; }); go("site/sell"); }
    else go("site/new-homes");
  }
  return html`<div class="sx-home">
    <section class="sx-hero"><div class="sx-hin">
      <div class="lbl">Harbor & Vine Realty · Austin since 2009</div>
      <h1>Find your place in Austin.</h1>
      <p>Homes for sale, apartments and new builds from a local brokerage that answers in minutes, not days.</p>
      <div class="sx-qbox">
        <div class="sx-qtabs" role="tablist">${[["buy", "Buy"], ["rent", "Rent"], ["sell", "Sell"], ["new", "New homes"]].map(([k, t]) => html`<button role="tab" aria-selected=${tab === k} class=${tab === k ? "on" : ""} onClick=${() => setTab(k)}>${t}</button>`)}</div>
        <form class="sx-q" onSubmit=${e => { e.preventDefault(); search(); }}>
          ${tab === "buy" ? html`<label class="sx-qf grow"><small>Where</small><input aria-label="Neighborhood, address or keyword" placeholder="Neighborhood, address or keyword (try “pool”)" value=${q} onInput=${e => setQ(e.target.value)} /></label>
            <label class="sx-qf"><small>Price</small><select value=${max} onChange=${e => setMax(+e.target.value)}>${[[0, "Any price"], [700000, "Up to $700K"], [1000000, "Up to $1M"], [1500000, "Up to $1.5M"], [2000000, "Up to $2M"]].map(([v, t]) => html`<option value=${v}>${t}</option>`)}</select></label>
            <label class="sx-qf"><small>Beds</small><select value=${beds} onChange=${e => setBeds(+e.target.value)}>${[0, 2, 3, 4, 5].map(b => html`<option value=${b}>${b ? b + "+ beds" : "Any"}</option>`)}</select></label>`
          : tab === "rent" ? html`<label class="sx-qf grow"><small>Rentals</small><span class="sx-qtxt">${vac.length} apartments & townhomes available now</span></label><label class="sx-qf"><small>Beds</small><select value=${beds} onChange=${e => setBeds(+e.target.value)}>${[0, 1, 2, 3].map(b => html`<option value=${b}>${b ? b + "+ beds" : "Any"}</option>`)}</select></label>`
          : tab === "sell" ? html`<label class=${"sx-qf grow" + (aErr ? " bad" : "")}><small>Your address</small><input aria-label="Your home's street address" placeholder="Street address, e.g. 1204 Elm St" value=${addr} onInput=${e => { setAddr(e.target.value); setAErr(""); }} />${aErr ? html`<em class="sx-err">${aErr}</em>` : ""}</label>`
          : html`<label class="sx-qf grow"><small>New homes</small><span class="sx-qtxt">${pr.name} · ${av.length} residences from ${short(from)}</span></label>`}
          <button class="sx-qgo" type="submit"><${SxI} n="search" s=${17} /><span>${tab === "sell" ? "Get my estimate" : tab === "new" ? "Explore" : "Search"}</span></button>
        </form>
      </div>
    </div></section>

    <section class="sx-trust">${[["home", forSale.length + " homes for sale", "Updated from the MLS every 15 minutes"], ["chat", "5-minute replies", "Median first response, 8 am to 8 pm"], ["key", vac.length + " rentals ready", "Apply online, answer in one business day"], ["shield", "TREC licensed", "Broker license #" + SX_BROKER.lic]].map(([i, b, t]) => html`<div><span class="sx-ic"><${SxI} n=${i} s=${18} /></span><span><b>${b}</b><small>${t}</small></span></div>`)}</section>

    <section class="sx-sec"><div class="sx-sh"><div><div class="lbl">Featured</div><h2>Homes people are touring this week</h2></div><a class="sx-more" href="#/site/buy" onClick=${e => { e.preventDefault(); up(() => { s.f = sxBlankF(); }); go("site/buy"); }}>See all ${forSale.length} homes →</a></div>
      <div class="sx-cards4">${feat.map(l => html`<${SxCard} l=${l} />`)}</div></section>

    <section class="sx-sec"><div class="sx-sh"><div><div class="lbl">Neighborhoods</div><h2>Explore Austin by neighborhood</h2></div></div>
      <div class="sx-hoods">${areas.map(a => html`<button class="sx-hood" style=${"background-image:url(" + img(a.img) + ")"} onClick=${() => { up(() => { Object.assign(s.f, sxBlankF(), { area: a.a }); }); go("site/buy"); }}><span><b>${a.a}</b><small>${a.n} for sale · median ${short(a.med)}</small></span></button>`)}</div></section>

    <section class="sx-sec sx-tri">
      <a class="sx-pane sell" href="#/site/sell" onClick=${e => { e.preventDefault(); go("site/sell"); }}><div class="lbl">Selling?</div><h3>What's my home worth?</h3><p>An instant range from nearby sales, then a free pricing consult with ${A("priya").name}.</p><span class="sx-go">Get my estimate →</span></a>
      <a class="sx-pane rent" href="#/site/rent" style=${"--bg:url(" + img("b-eastside") + ")"} onClick=${e => { e.preventDefault(); go("site/rent"); }}><div class="lbl">Renting</div><h3>${vac.length} homes available now</h3><p>Eastside Lofts and Govalle Row. Every fee shown up front, apply in 10 minutes.</p><span class="sx-go">See rentals →</span></a>
      <a class="sx-pane new" href="#/site/new-homes" style=${"--bg:url(" + img(pr.img) + ")"} onClick=${e => { e.preventDefault(); go("site/new-homes"); }}><div class="lbl">New homes</div><h3>${pr.name}</h3><p>${av.length} residences left from ${short(from)} · possession ${pr.possession}.</p><span class="sx-go">See floor plans →</span></a>
    </section>

    <section class="sx-sec"><div class="sx-sh"><div><div class="lbl">Our team</div><h2>Local agents who pick up the phone</h2></div><a class="sx-more" href="#/site/agents" onClick=${e => { e.preventDefault(); go("site/agents"); }}>Meet everyone →</a></div>
      <div class="sx-agrow">${SX_DIR.map(id => { const a = A(id); return html`<a class="sx-achip" href=${"#/site/agent/" + id} onClick=${e => { e.preventDefault(); go("site/agent/" + id); }}><span class="av lg sx-av" style=${"background:" + a.color}>${a.ini}</span><span><b>${a.name}</b><small>${SX_BIO[id].focus}</small></span></a>`; })}</div></section>

    ${reviews.length ? html`<section class="sx-sec"><div class="sx-sh"><div><div class="lbl">Clients</div><h2>In their words</h2></div></div>
      <div class="sx-quotes">${reviews.map(d => { const p = P(d.person), l = L(d.listing); return html`<figure class="sx-quote"><div class="sx-stars" aria-label="5 out of 5">★★★★★</div><blockquote>${SX_QUOTES[d.id] || "From the first call to the closing table, Harbor & Vine made every step clear. We'd do it all again with them."}</blockquote><figcaption><span class="av" style="background:#5B6B62">${p.ini}</span><span><b>${p.name}</b><small>${d.kind === "Buyer" ? "Bought" : "Sold"} in ${l.area} · with ${A(d.agent).name}</small></span></figcaption></figure>`; })}</div></section>` : ""}
  </div>`;
}

// ---------- buy: map + list search ----------
function sxFilter(f) {
  const q = f.q.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const r = S.d.listings.filter(l => (f.status === "all" || l.status === "Active" || l.status === "Coming soon")
    && (!f.min || l.price >= f.min) && (!f.max || l.price <= f.max) && l.beds >= f.beds && l.baths >= f.baths
    && (f.type === "Any" || l.type === f.type) && (f.area === "Any" || l.area === f.area)
    && q.every(w => (l.addr + " " + l.area + " " + l.type + " " + l.tag + " " + (l.kw || "")).toLowerCase().includes(w)));
  const so = { new: (a, b) => a.dom - b.dom, low: (a, b) => a.price - b.price, high: (a, b) => b.price - a.price, size: (a, b) => b.sqft - a.sqft, ppsf: (a, b) => a.price / a.sqft - b.price / b.sqft }[f.sort] || ((a, b) => a.dom - b.dom);
  return r.sort(so);
}
function sxFilterChips(f) {
  const c = [];
  if (f.q) c.push(["“" + f.q + "”", "q", ""]);
  if (f.min) c.push(["From " + short(f.min), "min", 0]);
  if (f.max) c.push(["Up to " + short(f.max), "max", 0]);
  if (f.beds) c.push([f.beds + "+ beds", "beds", 0]);
  if (f.baths) c.push([f.baths + "+ baths", "baths", 0]);
  if (f.type !== "Any") c.push([f.type, "type", "Any"]);
  if (f.area !== "Any") c.push([f.area, "area", "Any"]);
  if (f.status === "all") c.push(["Incl. under contract", "status", "sale"]);
  return c;
}
const sxSearchName = (f) => { const c = sxFilterChips(f).map(x => x[0]); return c.length ? c.join(" · ") : "All homes for sale in Austin"; };
function SxBuy() {
  const s = sx(), f = s.f;
  const [hot, setHot] = useState(null), [pick, setPick] = useState(null), [busy, setBusy] = useState(false), [q, setQ] = useState(f.q);
  const setF = (k, v) => { up(() => { f[k] = v; }); setBusy(true); clearTimeout(sxBusyT); sxBusyT = setTimeout(() => setBusy(false), 300); };
  const list = sxFilter(f), chips = sxFilterChips(f), pl = pick && L(pick);
  const sel = (label, k, opts) => html`<label class="sx-fsel"><span>${label}</span><select value=${f[k]} onChange=${e => setF(k, isNaN(+e.target.value) ? e.target.value : +e.target.value)}>${opts.map(([v, t]) => html`<option value=${v}>${t}</option>`)}</select></label>`;
  const nOpen = chips.filter(c => c[1] !== "q").length;
  return html`<div class="sx-buy">
    <div class="sx-fbar">
      <form class="sx-kw" onSubmit=${e => { e.preventDefault(); setF("q", q.trim()); }}><${SxI} n="search" s=${16} /><input aria-label="Search by neighborhood, address or keyword" placeholder="Neighborhood, address or keyword" value=${q} onInput=${e => setQ(e.target.value)} onBlur=${() => q.trim() !== f.q && setF("q", q.trim())} /></form>
      <button class="btn sm sx-fbtn" aria-expanded=${s.fOpen} onClick=${() => up(() => { s.fOpen = !s.fOpen; })}><${SxI} n="filter" s=${14} />Filters${nOpen ? " · " + nOpen : ""}</button>
      <div class=${"sx-fmore" + (s.fOpen ? " open" : "")}>
        ${sel("Min price", "min", [[0, "No min"], [500000, "$500K"], [700000, "$700K"], [1000000, "$1M"], [1500000, "$1.5M"]])}
        ${sel("Max price", "max", [[0, "No max"], [700000, "$700K"], [1000000, "$1M"], [1250000, "$1.25M"], [1500000, "$1.5M"], [2000000, "$2M"]])}
        ${sel("Beds", "beds", [[0, "Any"], [2, "2+"], [3, "3+"], [4, "4+"], [5, "5+"]])}
        ${sel("Baths", "baths", [[0, "Any"], [2, "2+"], [3, "3+"], [4, "4+"]])}
        ${sel("Home type", "type", [["Any", "Any type"], ["House", "House"], ["Condo", "Condo"], ["Townhouse", "Townhouse"]])}
        ${sel("Area", "area", [["Any", "All Austin"], ...sxAreas().map(a => [a, a])])}
        <label class="sx-fsel sx-fck"><input type="checkbox" checked=${f.status === "all"} onChange=${e => setF("status", e.target.checked ? "all" : "sale")} /><span>Show under contract</span></label>
      </div>
    </div>
    <div class=${"sx-res sx-v-" + s.view}>
      <div class="sx-map" aria-label="Map of results">${MapSvg()}
        ${list.map(l => html`<button class=${"pin" + (hot === l.id || pick === l.id ? " hot" : "") + (l.status === "Under contract" ? " uc" : "")} style=${"left:" + l.x + "%;top:" + l.y + "%"} aria-label=${l.addr + ", " + usd(l.price)} onMouseEnter=${() => setHot(l.id)} onMouseLeave=${() => setHot(null)} onClick=${() => setPick(l.id)}>${short(l.price)}</button>`)}
        ${pl ? html`<div class="sx-mapcard"><img src=${img(pl.img)} alt="" /><div><b class="num">${usd(pl.price)}</b><small>${pl.beds} bd · ${pl.baths} ba · ${pl.sqft.toLocaleString()} sqft</small><small>${pl.addr}, ${pl.area}</small><div class="row" style="gap:6px;margin-top:6px"><button class="btn sm pri" onClick=${() => go("site/home/" + pl.id)}>View home</button><button class="btn sm ghost" aria-label="Close preview" onClick=${() => setPick(null)}>✕</button></div></div></div>` : ""}
        ${!list.length ? html`<div class="sx-mapempty">No homes in this view</div>` : ""}
        <span class="sx-mapnote">Map is illustrative</span>
      </div>
      <div class="sx-list">
        <div class="sx-lhd"><div><h1>Homes for sale in ${f.area !== "Any" ? f.area + ", " : ""}Austin, TX</h1><div class="muted"><b class="num">${list.length}</b> ${list.length === 1 ? "home" : "homes"}${busy ? " · updating…" : ""}</div></div>
          <span class="sp"></span>
          <label class="sx-sort"><span>Sort</span><select value=${f.sort} onChange=${e => setF("sort", e.target.value)}>${[["new", "Newest"], ["low", "Price (low to high)"], ["high", "Price (high to low)"], ["size", "Square feet"], ["ppsf", "Price per sqft"]].map(([v, t]) => html`<option value=${v}>${t}</option>`)}</select></label>
          <button class="btn sm" onClick=${() => sxSaveSearch()}><${SxI} n="heart" s=${14} />Save search</button></div>
        ${chips.length ? html`<div class="sx-chips">${chips.map(([t, k, v]) => html`<button class="sx-chip" aria-label=${"Remove filter " + t} onClick=${() => { if (k === "q") setQ(""); setF(k, v); }}>${t} <span aria-hidden="true">✕</span></button>`)}<button class="sx-clear" onClick=${() => { setQ(""); up(() => { s.f = sxBlankF(); }); }}>Clear all</button></div>` : ""}
        ${busy ? html`<div class="sx-cards2">${[0, 1, 2, 3].map(() => html`<div class="sx-skel"><i></i><b></b><b class="s"></b></div>`)}</div>`
          : list.length ? html`<div class="sx-cards2">${list.map(l => html`<${SxCard} l=${l} hot=${hot === l.id} onHover=${setHot} />`)}</div>`
          : html`<div class="sx-empty"><span class="sx-ic lg"><${SxI} n="search" s=${22} /></span><h3>No homes match all of that</h3><p>Try removing a filter, or save this search and we'll text you the moment one lists.</p><div class="row" style="gap:8px;justify-content:center"><button class="btn pri" onClick=${() => { setQ(""); up(() => { s.f = sxBlankF(); }); }}>Clear filters</button><button class="btn" onClick=${() => sxSaveSearch()}>Save this search</button></div></div>`}
        <p class="sx-idx">Listings courtesy of Unlock MLS participants. Information deemed reliable but not guaranteed. Updated ${SX_TODAY}, 9:00 am.</p>
      </div>
    </div>
    <div class="sx-vt" role="group" aria-label="Results view"><button class=${s.view === "list" ? "on" : ""} onClick=${() => up(() => { s.view = "list"; })}><${SxI} n="list" s=${15} />List</button><button class=${s.view === "map" ? "on" : ""} onClick=${() => up(() => { s.view = "map"; })}><${SxI} n="map" s=${15} />Map</button></div>
  </div>`;
}
function sxSaveSearch(f) {
  const u = sxUser(), cur = f || { ...sx().f };
  if (!u) return sxGate("Create a free account to save this search. We'll send new matches the same day.", () => sxSaveSearch(cur));
  up(s => { s.modal = { kind: "sxSaveSearch", f: cur }; });
}
function SxSaveSearchModal({ m, close }) {
  const u = sxUser(), n = sxFilter(m.f).length;
  const [name, setName] = useState(sxSearchName(m.f)), [freq, setFreq] = useState("Daily"), [ch, setCh] = useState({ Email: true, Text: false }), [err, setErr] = useState("");
  function save() {
    if (!name.trim()) return setErr("Give your search a name");
    if (!ch.Email && !ch.Text) return setErr("Pick email, text or both");
    up(s => {
      s.d.savedSearches.push({ id: sxNextId(s.d.savedSearches, "SS"), pid: u.id, name: name.trim(), f: { ...m.f }, freq, ch: Object.keys(ch).filter(k => ch[k]), matches: n, at: SX_TODAY });
      const t = sxLog(u, "Saved a search on the website: " + name.trim() + " (" + freq.toLowerCase() + ")", { subject: "Saved search" }); t.unread = Math.max(0, t.unread - 1);
      s.modal = null;
    });
    toast("Search saved · " + n + " matches today, new ones " + (freq === "Instantly" ? "the minute they list" : freq.toLowerCase()), ["View saved", () => go("site/saved")]);
  }
  return html`<${SxModal} title="Save this search" sub=${n + " homes match today"} close=${close} onEnter=${save} foot=${html`<button class="btn" onClick=${close}>Cancel</button><button class="btn pri" onClick=${save}>Save search</button>`}>
    <${SxF} label="Name" err=${err && !name.trim() ? err : ""}><input value=${name} onInput=${e => { setName(e.target.value); setErr(""); }} /></${SxF}>
    <div class="field"><span>How often should we send new matches?</span><div class="seg">${["Instantly", "Daily", "Weekly"].map(x => html`<button class=${freq === x ? "on" : ""} onClick=${() => setFreq(x)}>${x}</button>`)}</div></div>
    <div class="field"><span>Send to</span><div class="row" style="gap:14px">${["Email", "Text"].map(k => html`<label class="sx-ck"><input type="checkbox" checked=${ch[k]} onChange=${e => { setCh({ ...ch, [k]: e.target.checked }); setErr(""); }} /><span>${k}${k === "Email" ? " · " + (u.email || "add an email") : " · " + (u.phone || "add a phone")}</span></label>`)}</div>
      ${err && name.trim() ? html`<em class="sx-err" role="alert">${err}</em>` : ""}</div>
    <div class="sx-note">You can pause or delete alerts any time from Saved. We never share your search with other brokerages.</div>
  </${SxModal}>`;
}

// ---------- listing detail ----------
function SxListing({ id }) {
  const l = L(id);
  if (!l) return html`<${SxNotFound} what="That home" />`;
  const coming = l.status === "Coming soon", sold = l.status === "Sold", uc = l.status === "Under contract" || sold;
  const days = coming ? SX_DAYS.slice(3) : SX_DAYS.slice(0, 4);
  const [down, setDown] = useState(20), [rate, setRate] = useState("6.4"), [mode, setMode] = useState("person"), [day, setDay] = useState(coming ? 0 : 1), [slot, setSlot] = useState("1:00 pm");
  const r = +rate, rateBad = !(r >= 2 && r <= 12);
  const m = monthly(l.price, down, rateBad ? 6.4 : r, l.tax, l.hoa), seg = [["Principal & interest", m.pi, "#1F4D3A"], ["Property tax", m.tax, "#B8873B"], ["Home insurance", m.ins, "#7A9C8A"], ["HOA dues", m.hoa, "#C9C2B2"]];
  let acc = 0; const C = 2 * Math.PI * 42;
  const ag = sxAgentOf(l), u = sxUser(), sv = !!sxSaved(u)[l.id], photos = [l.img, ...l.gallery];
  const sim = S.d.listings.filter(x => x.id !== l.id && x.status !== "Under contract" && x.status !== "Sold").sort((a, b) => Math.abs(a.price - l.price) - Math.abs(b.price - l.price)).slice(0, 3);
  const when = days[day][0] + " " + days[day][1] + " Oct, " + slot;
  const myTour = S.d.siteTours.find(t => t.l === l.id && u && t.pid === u.id);
  const gal = (i) => up(s => { s.modal = { kind: "sxGallery", photos, i, title: l.addr }; });
  return html`<div class="sx-det">
    <nav class="sx-crumbs" aria-label="Breadcrumb"><a href="#/site" onClick=${e => { e.preventDefault(); go("site"); }}>Home</a><span>›</span><a href="#/site/buy" onClick=${e => { e.preventDefault(); go("site/buy"); }}>Homes for sale</a><span>›</span><a href="#/site/buy" onClick=${e => { e.preventDefault(); up(() => { Object.assign(sx().f, sxBlankF(), { area: l.area }); }); go("site/buy"); }}>${l.area}</a><span>›</span><b>${l.addr}</b></nav>
    <div class="mosaic sx-mosaic">${photos.map((g, i) => html`<button aria-label=${"Open photo " + (i + 1)} style=${"background-image:url(" + img(g) + ")"} onClick=${() => gal(i)}></button>`)}<button class="all" onClick=${() => gal(0)}>See all ${photos.length} photos</button></div>
    <div class="lbody sx-lbody">
      <div class="sx-dmain">
        <div class="row sx-dtop"><span class=${"pill " + sxStCls(l.status)}>${l.status === "Active" ? "For sale" : l.status}</span>${l.views > 500 ? html`<span class="pill br">Popular · ${l.views} views this week</span>` : ""}<span class="sp" style="flex:1"></span>
          <button class=${"btn sm" + (sv ? " sx-on" : "")} onClick=${() => sxToggleSave(l.id)} aria-pressed=${sv}><span class=${"sx-hrt" + (sv ? " on" : "")}>♥</span>${sv ? "Saved" : "Save"}</button>
          <button class="btn sm" onClick=${() => { try { navigator.clipboard && navigator.clipboard.writeText(location.href).catch(() => {}); } catch (e) {} toast("Link copied · share it with anyone"); }}><${SxI} n="share" s=${14} />Share</button></div>
        <div class="pr num">${usd(l.price)}</div>
        <div class="facts"><div><b>${l.beds}</b><span>beds</span></div><div><b>${l.baths}</b><span>baths</span></div><div><b class="num">${l.sqft.toLocaleString()}</b><span>sqft</span></div><div><b class="num">${usd(l.price / l.sqft)}</b><span>per sqft</span></div></div>
        <div class="sx-addr">${l.addr}, ${l.area}, Austin, TX</div>
        <div class="est sx-est">Est. <b class="num">${usd(m.total)}</b>/mo · <button class="sx-link" onClick=${() => sxPrequal()}>Get pre-qualified</button></div>
        <div class="chips2"><span>${l.type}</span><span>Built ${l.year}</span><span>Lot ${l.lot}</span><span>${l.hoa ? "$" + l.hoa + "/mo HOA" : "No HOA"}</span><span>${l.dom ? l.dom + " days on Harbor & Vine" : "New today"}</span></div>
        <h2 class="sx-h2">About this home</h2>
        <p class="sx-copy">${SX_COPY[l.id] || "A well-kept " + l.beds + "-bedroom " + l.type.toLowerCase() + " in " + l.area + "."}</p>

        <h2 class="sx-h2">Monthly cost</h2>
        <div class="costbox"><svg viewBox="0 0 100 100" width="150" height="150" role="img" aria-label=${"Estimated " + usd(m.total) + " per month"}><circle cx="50" cy="50" r="42" fill="none" stroke="#F4F2EC" stroke-width="12" />${seg.filter(x => x[1] > 0).map(([, v, c]) => { const len = v / m.total * C, el = html`<circle cx="50" cy="50" r="42" fill="none" stroke=${c} stroke-width="12" stroke-dasharray=${len + " " + (C - len)} stroke-dashoffset=${-acc} transform="rotate(-90 50 50)" />`; acc += len; return el; })}<text x="50" y="48" text-anchor="middle" font-size="11" font-weight="700" fill="#1B1F1D">${usd(m.total)}</text><text x="50" y="60" text-anchor="middle" font-size="6" fill="#6B726D">per month</text></svg>
          <div>${seg.map(([k, v, c]) => html`<div class="ln"><span><i style=${"background:" + c}></i>${k}</span><b class="num">${usd(v)}</b></div>`)}
            <div class="sx-grid2" style="margin-top:10px">
              <label class="field"><span>Down payment · ${down}% (<span class="num">${usd(l.price * down / 100)}</span>)</span><input type="range" min="3" max="50" value=${down} onInput=${e => setDown(+e.target.value)} /></label>
              <${SxF} label="Interest rate %" err=${rateBad ? "Enter a rate between 2 and 12" : ""}><input type="number" step="0.05" min="2" max="12" value=${rate} onInput=${e => setRate(e.target.value)} /></${SxF}></div>
            <div class="sx-note">30-year fixed. Estimate only, not a loan offer. Taxes at ${l.tax}% of price.</div></div></div>

        <h2 class="sx-h2">Facts & features</h2>
        <div class="sx-facts">${[["Type", l.type], ["Year built", l.year], ["Lot", l.lot], ["HOA", l.hoa ? usd(l.hoa) + "/mo" : "None"], ["Property tax rate", l.tax + "%"], ["Price per sqft", usd(l.price / l.sqft)], ["Days listed", l.dom], ["MLS #", sxMls(l)]].map(([k, v]) => html`<div><span>${k}</span><b class="num">${v}</b></div>`)}</div>

        <div class="sx-two">
          <div class="sx-box"><div class="sx-bh"><span class="sx-ic"><${SxI} n="school" s=${16} /></span><h3>Nearby schools</h3><span class="pill">Sample data</span></div>
            ${(SX_SCHOOLS[l.id] || []).map(([n, r, d]) => html`<div class="sx-row"><span>${n}</span><span class="muted">${d}</span><b class="num">${r}</b></div>`)}
            <div class="sx-note">School ratings and boundaries are samples. Attendance zones change; verify enrollment with the district.</div></div>
          <div class="sx-box"><div class="sx-bh"><span class="sx-ic"><${SxI} n="car" s=${16} /></span><h3>Commute</h3><span class="pill">Sample data</span></div>
            ${[["Downtown Austin", SX_COMMUTE[l.id] || 15], ["The Domain", (SX_COMMUTE[l.id] || 15) + 11], ["Austin–Bergstrom Airport", (SX_COMMUTE[l.id] || 15) + 9]].map(([n, mi]) => html`<div class="sx-row"><span>${n}</span><span class="muted">8 am drive</span><b class="num">${mi} min</b></div>`)}
            <div class="sx-note">Typical weekday drive times, for illustration.</div></div>
        </div>

        <div class="sx-attr"><span class="av" style=${"background:" + ag.color}>${ag.ini}</span><div>Listed by <a href=${"#/site/agent/" + ag.id} onClick=${e => { e.preventDefault(); go("site/agent/" + ag.id); }}>${ag.name}</a>, ${SX_BROKER.name} · TREC #${(SX_BIO[ag.id] || {}).lic || SX_BROKER.lic}<br /><small>Listing courtesy of ${SX_BROKER.name}. Source: Unlock MLS. Information deemed reliable but not guaranteed.</small></div></div>

        <h2 class="sx-h2">Similar homes</h2>
        <div class="sx-cards3">${sim.map(x => html`<${SxCard} l=${x} />`)}</div>
      </div>

      <aside class="tourbox sx-tour" aria-label="Tour this home">
        ${uc ? html`<h4>${sold ? "This home has sold" : "This home is under contract"}</h4><p class="sx-note" style="margin:0">${sold ? "It closed recently. Ask us about similar homes, or what yours might be worth." : "The sellers accepted an offer. You can still ask about backup offers, or we'll alert you if it comes back."}</p>
            <button class="btn pri big" onClick=${() => sxAsk({ agent: l.agent === "maya" ? "jordan" : l.agent, about: l.addr, lid: l.id, text: sold ? "Hi, I saw " + l.addr + " sold. Could you send me similar homes?" : "Hi, I'd like to know about submitting a backup offer on " + l.addr + "." })}>${sold ? "Ask about similar homes" : "Ask about a backup offer"}</button>
            <button class="btn big" onClick=${() => go("site/buy")}>See similar homes</button>`
        : html`<h4>Tour this home</h4>
          ${coming ? html`<div class="sx-note">Coming soon: showings start Mon, Oct 12. Request a slot now and you'll be first in.</div>` : ""}
          ${myTour ? html`<div class="sx-booked"><${SxI} n="check" s=${15} /><span>You requested <b>${myTour.when}</b>. ${A(myTour.agent).name} will confirm shortly.</span></div>` : ""}
          <div class="seg" role="group" aria-label="Tour type"><button class=${mode === "person" ? "on" : ""} onClick=${() => setMode("person")}>In person</button><button class=${mode === "video" ? "on" : ""} onClick=${() => setMode("video")}>Video chat</button></div>
          <div class="days" style=${"grid-template-columns:repeat(" + days.length + ",minmax(0,1fr))"}>${days.map(([d, n], i) => html`<button class=${day === i ? "on" : ""} aria-pressed=${day === i} onClick=${() => setDay(i)}>${d}<b>${n}</b>Oct</button>`)}</div>
          <div class="slots">${SX_SLOTS.map(x => html`<button class=${slot === x ? "on" : ""} aria-pressed=${slot === x} onClick=${() => setSlot(x)}>${x}</button>`)}</div>
          <button class="btn pri big" onClick=${() => up(s => { s.modal = { kind: "sxTour", lid: l.id, when, mode }; })}>Request a tour</button>
          <div class="sx-note" style="text-align:center">Free, no obligation · Texas asks for a short touring agreement first</div>
          <button class="btn big" onClick=${() => sxAsk({ agent: l.agent === "maya" ? "jordan" : l.agent, about: l.addr, lid: l.id, text: "Hi, is " + l.addr + " still available? I'd like to know more." })}>Ask a question</button>`}
        <div class="agentcard"><${Av} a=${ag} /><div><b>${ag.name}</b><div style="color:#6B726D">${ag.role} · replies in ~5 min</div></div></div>
      </aside>
    </div>
  </div>`;
}
function sxPrequal() {
  const u = sxUser();
  if (u && u.id === "P4") return go("portal/budget");
  if (!u) return sxGate("Create an account to get pre-qualified. Elena's demo account opens the buyer portal's budget tool.", () => sxPrequal());
  up(() => { sxLog(u, "Asked to get pre-qualified from the website", { auto: "Thanks " + sxFirst(u) + "! Kim Alvarez at Lone Star Lending will call you today to pre-qualify you. It takes about 10 minutes and won't affect your credit score." }); });
  sxNotify(sxOwnerFor(u), sxFirst(u) + " asked to get pre-qualified", "person/" + u.id);
  toast("Request sent · Kim at Lone Star Lending will call you today");
}
function SxGalleryModal({ m, close }) {
  const [i, setI] = useState(m.i || 0), n = m.photos.length;
  useEffect(() => { const k = e => { if (e.key === "ArrowRight") setI(x => (x + 1) % n); if (e.key === "ArrowLeft") setI(x => (x - 1 + n) % n); }; addEventListener("keydown", k); return () => removeEventListener("keydown", k); }, []);
  return html`<${SxModal} title=${m.title} sub=${"Photo " + (i + 1) + " of " + n} close=${close} cls="sx-gal">
    <div class="sx-galimg" style=${"background-image:url(" + img(m.photos[i]) + ")"}><button class="sx-gnav l" aria-label="Previous photo" onClick=${() => setI((i - 1 + n) % n)}><${SxI} n="left" s=${20} /></button><button class="sx-gnav r" aria-label="Next photo" onClick=${() => setI((i + 1) % n)}><${SxI} n="right" s=${20} /></button></div>
    <div class="sx-thumbs">${m.photos.map((p, k) => html`<button class=${k === i ? "on" : ""} aria-label=${"Photo " + (k + 1)} style=${"background-image:url(" + img(p) + ")"} onClick=${() => setI(k)}></button>`)}</div>
  </${SxModal}>`;
}

// ---------- tour request (gated by a touring agreement) ----------
function sxCovered(u) { return !!(u && S.d.deals.some(d => d.person === u.id && d.kind === "Buyer" && d.stage !== "Closed" && d.agreement && d.agreement.signed && !d.agreement.touring)); }
function SxTourModal({ m, close }) {
  const l = L(m.lid), u = sxUser(), covered = sxCovered(u), agent = A(u ? sxOwnerFor(u) : "jordan");
  const steps = [!u && "contact", !covered && "agree", "review"].filter(Boolean), labels = { contact: "Your details", agree: "Touring agreement", review: "Confirm" };
  const [i, setI] = useState(0), [busy, setBusy] = useState(false), [done, setDone] = useState(null);
  const f = sxForm({ name: u ? u.name : "", email: u ? u.email : "", phone: u ? u.phone : "", sms: true, comp: "2.5", iabs: false, sig: "" });
  const { v, set, err } = f, cur = steps[i];
  function next() {
    if (cur === "contact" && !f.check({ name: sxV.name, email: sxV.email, phone: sxV.phone })) return;
    if (cur === "agree" && !f.check({ comp: c => c === "" || isNaN(+c) || +c < 0 || +c > 6 ? "Enter a percentage between 0 and 6" : "", iabs: sxV.tick, sig: (sg, all) => sg.trim().toLowerCase() !== all.name.trim().toLowerCase() ? "Type your name exactly as “" + all.name.trim() + "” to sign" : "" })) return;
    if (i < steps.length - 1) return setI(i + 1);
    setBusy(true);
    setTimeout(() => { let res; up(() => { res = sxBookTour(l, m.when, m.mode, v, steps.includes("agree")); }); setBusy(false); setDone(res); }, 500);
  }
  if (done) {
    const elena = done.p.id === "P4";
    return html`<${SxModal} title="Tour requested" close=${close} foot=${html`<button class="btn" onClick=${close}>Keep browsing</button><button class="btn pri" onClick=${() => { asRole(roleById("buyer")); go("portal/tours"); }}>Continue in your portal →</button>`}>
      <${SxDone} title=${l.addr + " · " + m.when} sub=${(m.mode === "video" ? "Video tour" : "In-person tour") + " with " + A(done.agent).name + ". We sent a confirmation to " + (done.p.email || done.p.phone) + "."}
        next=${[A(done.agent).name.split(" ")[0] + " confirms your time within 30 minutes (8 am to 8 pm)", "You get a calendar invite and a text reminder 2 hours before", "Bring a photo ID. Your signed agreement is saved in your account"]}>
        ${!elena ? html`<div class="sx-note">Demo: the buyer portal opens Elena Ruiz's sample account, so you can see the full journey from here.</div>` : ""}</${SxDone}>
    </${SxModal}>`;
  }
  return html`<${SxModal} title=${cur === "agree" ? "Before your tour" : "Tour " + l.addr} sub=${m.when + " · " + (m.mode === "video" ? "video chat" : "in person")} close=${close} onEnter=${next}
    foot=${html`<button class="btn" onClick=${() => (i ? setI(i - 1) : close())}>${i ? "Back" : "Cancel"}</button><button class="btn pri" disabled=${busy} onClick=${next}>${busy ? html`<${SxSpin} />Booking…` : cur === "review" ? "Request tour" : cur === "agree" ? "Sign & continue" : "Continue"}</button>`}>
    ${steps.length > 1 ? html`<${SxSteps} steps=${steps.map(s => labels[s])} i=${i} />` : ""}
    ${cur === "contact" ? html`<div class="sx-note">We'll create a free account so you can track this tour. No spam, ever.</div><${SxContact} f=${f} smsText="Text me tour confirmations and reminders. Msg & data rates may apply; reply STOP to opt out." />` : ""}
    ${cur === "agree" ? html`<div class="sx-note">Texas and national rules now ask buyers to sign a written agreement before touring with an agent. This one is short: it covers this home only and you can walk away any time.</div>
      <div class="doc sx-doc"><h4>Touring agreement · ${SX_BROKER.name}</h4>
        <div class="sx-terms">${[["Who", (v.name || "You") + " and " + SX_BROKER.name + " (agent: " + agent.name + ")"], ["Covers", l.addr + " only"], ["Term", "14 days, non-exclusive: you can work with other agents"], ["Cost to you", "Nothing to tour. If you buy this home with us, broker pay comes from the seller's offer first"]].map(([k, t]) => html`<div><span>${k}</span><b>${t}</b></div>`)}</div>
        <div class="sx-compr"><label for="sx-comp">Broker compensation if you buy this home</label><span><input id="sx-comp" class=${err.comp ? "bad" : ""} inputmode="decimal" value=${v.comp} onInput=${set("comp")} />% of the price</span></div>
        ${err.comp ? html`<em class="sx-err" role="alert">${err.comp}</em>` : ""}
        <div class="sx-small">Broker fees are not set by law and are fully negotiable. We won't accept more than this amount from any source.</div></div>
      <${SxCk} checked=${v.iabs} onChange=${set("iabs")} err=${err.iabs}>I've read the <a href="#/site/legal/iabs" target="_blank" onClick=${e => e.stopPropagation()}>Information About Brokerage Services</a> notice.</${SxCk}>
      <${SxF} label=${"Type your full name to sign (" + (v.name || "your name") + ")"} err=${err.sig}><input class="sx-sigin" value=${v.sig} onInput=${set("sig")} placeholder=${v.name} autocomplete="off" /></${SxF}>` : ""}
    ${cur === "review" ? html`<div class="sx-rev"><img src=${img(l.img)} alt="" /><div><b>${l.addr}</b><small>${l.area} · ${usd(l.price)}</small><small>${m.when} · ${m.mode === "video" ? "Video chat" : "In person"}</small><small>With ${agent.name}, ${agent.role}</small></div></div>
      ${covered ? html`<div class="sx-booked"><${SxI} n="check" s=${15} /><span>Your buyer agreement with ${agent.name.split(" ")[0]} already covers tours.</span></div>` : html`<div class="sx-booked"><${SxI} n="doc" s=${15} /><span>Touring agreement signed as <b>${v.sig}</b> · ${v.comp}% if you buy this home with us</span></div>`}
      <div class="sx-note">Need to change it later? Reschedule or cancel from your account or by replying to the text.</div>` : ""}
  </${SxModal}>`;
}
function sxBookTour(l, when, mode, v, signed) {
  const d = S.d;
  let u = sxUser(), isNew = false;
  if (!u) { const r = sxUpsertPerson({ name: v.name, email: v.email, phone: v.phone, owner: "jordan", source: "Website · tour request", stage: "Touring", tags: ["Buyer"], roles: ["Buyer"] }); u = r.p; isNew = r.isNew; sx().user = u.id; }
  const agent = sxOwnerFor(u);
  if (["New lead", "Nurture"].includes(u.stage)) u.stage = "Touring";
  if (signed && !u.tags.includes("Touring agreement")) u.tags.push("Touring agreement");
  let deal = d.deals.find(x => x.person === u.id && x.kind === "Buyer" && x.stage !== "Closed");
  if (!deal) {
    deal = { id: sxNextId(d.deals, "D"), kind: "Buyer", person: u.id, listing: l.id, stage: "Touring", price: l.price, agent, comp: +v.comp || 0, close: "—", progress: 0.1, agreement: signed ? { signed: true, on: SX_TODAY, comp: v.comp + "%", term: "14 days · " + l.addr + " only", touring: true } : { signed: false }, dates: [], checklist: [["Touring agreement signed", !!signed], ["Pre-approval letter", false]], docs: [] };
    d.deals.push(deal);
  } else if (["New lead"].includes(deal.stage)) deal.stage = "Touring";
  (deal.dates = deal.dates || []).push(["Tour · " + l.addr, when, false]);
  if (signed) (deal.docs = deal.docs || []).push(["Touring agreement · " + l.addr, "Signed"]);
  d.siteTours.push({ id: sxNextId(d.siteTours, "ST"), pid: u.id, l: l.id, when, mode, agent, status: "Requested", at: SX_TODAY });
  if (u.id === "P4" && typeof pj === "function") { const p = pj(); p.tours.push({ l: l.id, when, mode: mode === "video" ? "Video chat" : "In person", src: "site", status: "Requested" }); p.feed.unshift(["Just now", "Tour requested on the website: " + l.addr + " · " + when]); }
  const t = sxLog(u, "Requested a tour of " + l.addr + " · " + when + (mode === "video" ? " (video)" : " (in person)") + (signed ? " · touring agreement signed at " + v.comp + "%" : ""), { subject: l.addr, auto: "Thanks " + sxFirst(u) + "! " + A(agent).name + " will confirm your tour of " + l.addr + " for " + when + " within 30 minutes. Your signed agreement is saved in your account.", note: "Sent automatically · tour added to " + A(agent).name.split(" ")[0] + "'s calendar as pending" });
  sxNotify(agent, (isNew ? "New website lead · " : "") + u.name + " requested a tour of " + l.addr + " · " + when, "inbox/" + t.id);
  if (l.agent !== agent) sxNotify(l.agent, "Showing request for " + l.addr + " · " + when + " (buyer's agent " + A(agent).name + ")", "listing/" + l.id);
  return { p: u, agent, t };
}

// ---------- ask a question ----------
function sxAsk(o) { up(s => { s.modal = { kind: "sxAsk", ...o }; }); }
function SxAskModal({ m, close }) {
  const u = sxUser(), a = A(m.agent);
  const f = sxForm({ name: u ? u.name : "", email: u ? u.email : "", phone: u ? u.phone : "", sms: false, msg: m.text || "" });
  const [busy, setBusy] = useState(false);
  function send() {
    const rules = { msg: x => String(x).trim().length < 5 ? "Write a short message" : "" };
    if (!u) Object.assign(rules, { name: sxV.name, email: sxV.email, phone: sxV.phoneOpt });
    if (!f.check(rules)) return;
    setBusy(true);
    setTimeout(() => {
      let t;
      up(s => {
        let p = u;
        if (!p) { p = sxUpsertPerson({ name: f.v.name, email: f.v.email, phone: f.v.phone, owner: m.agent, source: "Website · " + (m.src || "question"), stage: "New lead", tags: m.tags || ["Website"], roles: m.roles || [] }).p; sx().user = p.id; }
        t = sxLog(p, (m.about ? "Re " + m.about + ": " : "") + f.v.msg.trim(), { subject: m.about || "Question", auto: "Thanks! " + a.name + " usually replies within 5 minutes between 8 am and 8 pm.", note: "Auto-reply from the website" });
        s.modal = null;
      });
      sxNotify(m.agent, "New question" + (m.about ? " about " + m.about : "") + " from the website", "inbox/" + t.id);
      toast("Message sent to " + a.name + " · usually replies in 5 minutes");
    }, 400);
  }
  return html`<${SxModal} title=${"Message " + a.name} sub=${m.about ? "About " + m.about : a.role} close=${close} onEnter=${send}
    foot=${html`<button class="btn" onClick=${close}>Cancel</button><button class="btn pri" disabled=${busy} onClick=${send}>${busy ? html`<${SxSpin} />Sending…` : "Send message"}</button>`}>
    ${u ? html`<div class="sx-note">Sending as <b>${u.name}</b> · ${u.email || u.phone}</div>` : html`<${SxContact} f=${f} />`}
    <${SxF} label="Message" err=${f.err.msg}><textarea rows="4" value=${f.v.msg} onInput=${f.set("msg")}></textarea></${SxF}>
  </${SxModal}>`;
}

// ---------- sign in / create account ----------
function SxAuthModal({ m, close }) {
  const [tab, setTab] = useState(m.mode === "portal" ? "portal" : m.mode === "signin" ? "signin" : "create");
  const f = sxForm({ name: "", email: "", phone: "", pw: "", terms: false, sms: false });
  const g = sxForm({ email: "", pw: "" });
  const [busy, setBusy] = useState(false), [reset, setReset] = useState("");
  const portals = [["buyer", "Buyer portal", "Elena Ruiz"], ["seller", "Seller portal", "Rachel & Tom Grant"], ["tenant", "Tenant portal", "Hannah Cole"], ["landlord", "Owner portal", "Brooks Holdings LLC"]].filter(([id]) => roleById(id));
  const finish = (pid, msg) => { sxSignInAs(pid); up(s => { s.modal = null; }); toast(msg); m.then && setTimeout(m.then, 50); };
  function signin() {
    if (!g.check({ email: sxV.email, pw: x => String(x).length < 6 ? "Enter your password (6+ characters)" : "" })) return;
    const p = S.d.people.find(x => x.email && x.email.toLowerCase() === g.v.email.trim().toLowerCase());
    if (!p) return g.setErr({ email: "No account uses that email. Check it, or create an account." });
    setBusy(true); setTimeout(() => { setBusy(false); finish(p.id, "Welcome back, " + sxFirst(p)); }, 400);
  }
  function create() {
    if (!f.check({ name: sxV.name, email: sxV.email, phone: sxV.phoneOpt, pw: x => String(x).length < 8 ? "Use at least 8 characters" : "", terms: sxV.tick })) return;
    const ex = S.d.people.find(x => x.email && x.email.toLowerCase() === f.v.email.trim().toLowerCase());
    if (ex) { g.setV({ email: f.v.email.trim(), pw: "" }); setTab("signin"); g.setErr({ pw: "You already have an account. Sign in with your password." }); return; }
    setBusy(true);
    setTimeout(() => {
      let p, t;
      up(() => { p = sxUpsertPerson({ name: f.v.name, email: f.v.email, phone: f.v.phone, owner: "jordan", source: "Website · account", stage: "New lead", tags: ["Buyer", "Website account"], roles: ["Buyer"] }).p;
        t = sxLog(p, "Created an account on harborandvine.com" + (m.reason ? " (" + m.reason.replace(/\.$/, "").toLowerCase() + ")" : ""), { subject: "New website account", auto: "Welcome to Harbor & Vine, " + sxFirst(p) + "! I'm Jordan Lee's assistant. Save homes and searches any time; Jordan will text you to say hi." + (f.v.sms ? "" : " (We'll only email you.)"), autoCh: f.v.sms ? "SMS" : "Email" }); });
      sxNotify("jordan", "New website lead: " + p.name + " created an account", "inbox/" + t.id);
      setBusy(false); finish(p.id, "Account created · Jordan Lee is your Harbor & Vine contact");
    }, 450);
  }
  const demo = () => { g.setV({ email: "elena.ruiz@example.com", pw: "demo1234" }); g.setErr({}); };
  return html`<${SxModal} title=${tab === "create" ? "Create your free account" : tab === "signin" ? "Sign in" : "Sign in to Harbor & Vine"} sub=${m.reason || (tab === "portal" ? "Choose your portal, or sign in with email" : "")} close=${close} onEnter=${tab === "create" ? create : tab === "signin" ? signin : null}
    foot=${tab === "portal" ? html`<button class="btn" onClick=${() => setTab("create")}>Create account</button><button class="btn pri" onClick=${() => setTab("signin")}>Sign in with email</button>`
      : html`<button class="btn ghost" onClick=${() => setTab(tab === "create" ? "signin" : "create")}>${tab === "create" ? "I have an account" : "Create an account"}</button><span style="flex:1"></span><button class="btn pri" disabled=${busy} onClick=${tab === "create" ? create : signin}>${busy ? html`<${SxSpin} />One moment…` : tab === "create" ? "Create account" : "Sign in"}</button>`}>
    ${tab === "portal" ? html`<div class="sx-ports">${portals.map(([id, t, who]) => { const r = roleById(id); return html`<button class="sx-port" onClick=${() => { up(s => { s.modal = null; sx().user = SX_ROLE_PID[id]; }); asRole(r); }}><span class="sx-pph" style=${"background-image:url(" + img(r.photo) + ")"}></span><span><b>${t}</b><small>${who}</small></span><${SxI} n="right" s=${16} /></button>`; })}</div>
      <div class="sx-note">Demo: pick a client account to open their portal. No password needed.</div>` : ""}
    ${tab === "signin" ? html`<${SxF} label="Email" err=${g.err.email}><input type="email" autocomplete="email" value=${g.v.email} onInput=${g.set("email")} /></${SxF}>
      <${SxF} label="Password" err=${g.err.pw}><input type="password" autocomplete="current-password" value=${g.v.pw} onInput=${g.set("pw")} /></${SxF}>
      <div class="row" style="justify-content:space-between;gap:8px;flex-wrap:wrap"><button class="sx-link" onClick=${() => { if (sxV.email(g.v.email)) return g.setErr({ email: "Enter your email first, then we'll send a reset link" }); setReset(g.v.email.trim()); }}>Forgot password?</button><button class="sx-link" onClick=${demo}>Use the demo buyer account (Elena)</button></div>
      ${reset ? html`<div class="sx-booked"><${SxI} n="check" s=${15} /><span>If ${reset} has an account, a reset link is on its way. It expires in 30 minutes.</span></div>` : ""}` : ""}
    ${tab === "create" ? html`<div class="sx-grid2">
      <${SxF} label="Full name" err=${f.err.name} cls="sx-span2"><input autocomplete="name" value=${f.v.name} onInput=${f.set("name")} /></${SxF}>
      <${SxF} label="Email" err=${f.err.email}><input type="email" autocomplete="email" value=${f.v.email} onInput=${f.set("email")} /></${SxF}>
      <${SxF} label="Mobile (optional)" err=${f.err.phone}><input type="tel" autocomplete="tel" value=${f.v.phone} onInput=${f.set("phone")} onBlur=${() => f.put("phone", sxFmtPhone(f.v.phone))} /></${SxF}>
      <${SxF} label="Password" err=${f.err.pw} hint="At least 8 characters" cls="sx-span2"><input type="password" autocomplete="new-password" value=${f.v.pw} onInput=${f.set("pw")} /></${SxF}></div>
      <${SxCk} checked=${f.v.terms} onChange=${f.set("terms")} err=${f.err.terms}>I agree to the <a href="#/site/legal/privacy" target="_blank" onClick=${e => e.stopPropagation()}>privacy policy</a> and terms of use.</${SxCk}>
      <${SxCk} checked=${f.v.sms} onChange=${f.set("sms")}>Text me new matches and replies from my agent. Msg & data rates may apply; reply STOP to opt out. Optional.</${SxCk}>` : ""}
  </${SxModal}>`;
}

// ---------- saved ----------
function SxSaved() {
  const u = sxUser();
  if (!u) return html`<div class="sx-page"><div class="sx-empty big"><span class="sx-ic lg"><${SxI} n="heart" s=${22} /></span><h1>Your saved homes</h1><p>Sign in to see homes and searches you've saved, on any device.</p><div class="row" style="gap:8px;justify-content:center"><button class="btn pri" onClick=${() => sxGate("Sign in to see your saved homes.", null, "signin")}>Sign in</button><button class="btn" onClick=${() => sxGate("Create a free account to save homes and searches.")}>Create account</button></div></div></div>`;
  const map = sxSaved(u), ids = Object.keys(map).filter(L), ss = S.d.savedSearches.filter(x => x.pid === u.id), elena = u.id === "P4";
  return html`<div class="sx-page">
    <div class="sx-ph"><div><div class="lbl">${u.name}</div><h1>Saved homes & searches</h1>${elena ? html`<div class="muted">Synced with your buyer portal board, shared with Marco and Sam.</div>` : ""}</div><span class="sp"></span>${elena ? html`<button class="btn" onClick=${() => go("portal/saved")}>Open in my portal →</button>` : ""}</div>
    <h2 class="sx-h2">Homes · ${ids.length}</h2>
    ${ids.length ? html`<div class="sx-cards4">${ids.map(id => html`<${SxCard} l=${L(id)} />`)}</div>` : html`<div class="sx-empty"><p>No saved homes yet. Tap ♥ on any home to keep it here.</p><button class="btn pri" onClick=${() => go("site/buy")}>Browse homes</button></div>`}
    <h2 class="sx-h2">Searches · ${ss.length}</h2>
    ${ss.length ? html`<div class="sx-sslist">${ss.map(x => { const n = sxFilter(x.f).length; return html`<div class="sx-ss"><span class="sx-ic"><${SxI} n="search" s=${16} /></span><div class="sx-ssb"><b>${x.name}</b><small>${n} matching now · ${x.freq.toLowerCase()} by ${(x.ch || ["Email"]).join(" & ").toLowerCase()} · saved ${x.at}</small></div>
        <button class="btn sm" onClick=${() => { up(() => { sx().f = { ...sxBlankF(), ...x.f }; }); go("site/buy"); }}>View results</button>
        <button class="btn sm ghost" aria-label=${"Delete saved search " + x.name} onClick=${() => { up(s => { s.d.savedSearches = s.d.savedSearches.filter(y => y !== x); }); toast("Saved search deleted", ["Undo", () => up(s => { s.d.savedSearches.push(x); })]); }}>Delete</button></div>`; })}</div>`
      : html`<div class="sx-empty"><p>No saved searches. Set your filters, then “Save search” to get new matches the same day.</p><button class="btn" onClick=${() => go("site/buy")}>Start a search</button></div>`}
  </div>`;
}

// ---------- sell: instant valuation ----------
const sxValBlank = (o = {}) => ({ addr: "", area: "Tarrytown", beds: 3, baths: 2, sqft: "2000", year: "2005", cond: "Updated", when: "1–3 months", name: "", email: "", phone: "", sms: false, ...o });
function sxValue(v) {
  const pool = S.d.listings.filter(l => l.area === v.area), use = pool.length ? pool : S.d.listings;
  const ppsf = sxMed(use.map(l => l.price / l.sqft));
  const cond = { "Needs work": 0.88, Average: 0.96, Updated: 1.02, Renovated: 1.08 }[v.cond] || 1;
  const ageF = 1 - Math.min(0.1, Math.max(0, 2026 - +v.year) * 0.002), bedF = 1 + (+v.beds - 3) * 0.015;
  const mid = Math.round(+v.sqft * ppsf * cond * ageF * bedF / 1000) * 1000;
  const comps = [...S.d.listings].sort((a, b) => (a.area === v.area ? 0 : 1) - (b.area === v.area ? 0 : 1) || Math.abs(a.sqft - v.sqft) - Math.abs(b.sqft - v.sqft)).slice(0, 3);
  return { mid, low: Math.round(mid * 0.94 / 1000) * 1000, high: Math.round(mid * 1.06 / 1000) * 1000, ppsf, comps, n: use.length * 27 + 41 };
}
function SxSell() {
  const s = sx();
  if (!s.val) s.val = { step: 0, v: sxValBlank() };
  const st = s.val, u = sxUser();
  if (u && !st.v.name) Object.assign(st.v, { name: u.name, email: u.email || "", phone: u.phone || "" });
  const f = sxForm(st.v);
  const [busy, setBusy] = useState(false), [day, setDay] = useState(1), [slot, setSlot] = useState("10:30 am"), [mode, setMode] = useState("In person");
  const go2 = (n) => up(() => { st.v = { ...f.v }; st.step = n; });
  const steps = ["Address", "Home details", "Where to send it", "Your estimate"];
  const priya = A("priya"), myL = S.d.listings.filter(l => l.agent === "priya");
  function next() {
    const v = f.v;
    if (st.step === 0 && !f.check({ addr: x => String(x).trim().length < 5 || !/\d/.test(x) ? "Enter a street address, like 1204 Elm St" : "" })) return;
    if (st.step === 1 && !f.check({ sqft: x => !(+x >= 400 && +x <= 15000) ? "Enter living area between 400 and 15,000 sqft" : "", year: x => !(+x >= 1880 && +x <= 2026) ? "Enter a year between 1880 and 2026" : "" })) return;
    if (st.step === 2) {
      if (!f.check({ name: sxV.name, email: sxV.email, phone: sxV.phone })) return;
      setBusy(true);
      setTimeout(() => {
        const res = sxValue(v);
        let t;
        up(sd => {
          const { p } = sxUpsertPerson({ name: v.name, email: v.email, phone: v.phone, owner: "priya", source: "Website · home valuation", stage: "New lead", tags: ["Seller", "Valuation"], roles: ["Homeowner", "Seller"] });
          if (!sxUser()) sx().user = p.id;
          const rec = { id: sxNextId(sd.d.valuations, "V"), pid: p.id, addr: v.addr.trim(), area: v.area, details: { beds: +v.beds, baths: +v.baths, sqft: +v.sqft, year: +v.year, cond: v.cond, when: v.when }, low: res.low, mid: res.mid, high: res.high, at: SX_TODAY, consult: null, monthly: false };
          sd.d.valuations.push(rec);
          t = sxLog(p, "Requested a home value estimate for " + rec.addr + " (" + v.area + ") · " + usd(res.low) + "–" + usd(res.high) + " · selling " + v.when, { subject: "Home value · " + rec.addr, mod: "Website", auto: "Hi " + sxFirst(p) + ", your estimate for " + rec.addr + " is ready. Priya Shah can tighten it to a list price in a 30-minute consult.", autoCh: "Email" });
          st.v = { ...v }; st.step = 3; st.rec = rec.id;
        });
        sxNotify("priya", "New seller lead: " + v.name + " valued " + v.addr.trim() + " (" + usd(res.mid) + ")", "inbox/" + t.id);
        setBusy(false);
      }, 600);
      return;
    }
    go2(st.step + 1);
  }
  const rec = st.rec && S.d.valuations.find(x => x.id === st.rec);
  function book() {
    const when = SX_DAYS[day][0] + " " + SX_DAYS[day][1] + " Oct, " + slot;
    let t;
    up(sd => {
      rec.consult = { when, mode };
      const p = P(rec.pid); if (p && p.stage === "New lead") p.stage = "Listing consult";
      t = sxLog(p, "Booked a listing consultation for " + rec.addr + " · " + when + " (" + mode.toLowerCase() + ")", { subject: "Home value · " + rec.addr, auto: "You're booked with Priya Shah on " + when + ". She'll bring a pricing review and a net sheet for " + rec.addr + ".", note: "Added to Priya's calendar" });
      st.step = 4;
    });
    sxNotify("priya", "Listing consult booked: " + rec.addr + " · " + when, "inbox/" + t.id);
    toast("Consultation booked with Priya · " + when);
  }
  return html`<div class="sx-sell">
    <section class="sx-shero"><div><div class="lbl">Sell with Harbor & Vine</div><h1>What's my home worth?</h1><p>An instant range from nearby sales and active listings, then a free pricing consult with a local listing agent. No obligation.</p></div></section>
    <div class="sx-sellgrid">
      <div class="card sx-flow">
        ${st.step < 4 ? html`<${SxSteps} steps=${steps} i=${Math.min(st.step, 3)} />` : ""}
        ${st.step === 0 ? html`<${SxF} label="Street address" err=${f.err.addr} hint="We only use it to find comparable sales"><input autocomplete="street-address" placeholder="e.g. 1204 Elm St" value=${f.v.addr} onInput=${f.set("addr")} onKeyDown=${e => e.key === "Enter" && next()} /></${SxF}>
          <${SxF} label="Neighborhood"><select value=${f.v.area} onChange=${f.set("area")}>${[...sxAreas(), "Other Austin area"].map(a => html`<option value=${a}>${a}</option>`)}</select></${SxF}>` : ""}
        ${st.step === 1 ? html`<div class="sx-grid2">
          <${SxF} label="Bedrooms"><select value=${f.v.beds} onChange=${f.set("beds")}>${[1, 2, 3, 4, 5, 6].map(n => html`<option value=${n}>${n}</option>`)}</select></${SxF}>
          <${SxF} label="Bathrooms"><select value=${f.v.baths} onChange=${f.set("baths")}>${[1, 1.5, 2, 2.5, 3, 3.5, 4, 5].map(n => html`<option value=${n}>${n}</option>`)}</select></${SxF}>
          <${SxF} label="Living area (sqft)" err=${f.err.sqft}><input inputmode="numeric" value=${f.v.sqft} onInput=${f.set("sqft")} /></${SxF}>
          <${SxF} label="Year built" err=${f.err.year}><input inputmode="numeric" value=${f.v.year} onInput=${f.set("year")} /></${SxF}></div>
          <div class="field"><span>Condition</span><div class="seg sx-segw">${["Needs work", "Average", "Updated", "Renovated"].map(c => html`<button class=${f.v.cond === c ? "on" : ""} onClick=${() => f.put("cond", c)}>${c}</button>`)}</div></div>
          <div class="field"><span>When are you thinking of selling?</span><div class="seg sx-segw">${["ASAP", "1–3 months", "3–6 months", "Just curious"].map(c => html`<button class=${f.v.when === c ? "on" : ""} onClick=${() => f.put("when", c)}>${c}</button>`)}</div></div>` : ""}
        ${st.step === 2 ? html`<div class="sx-note">Where should we send your estimate? You'll see it on the next screen too.</div><${SxContact} f=${f} smsText="Text me about my home's value. Msg & data rates may apply; reply STOP to opt out." />` : ""}
        ${st.step === 2 && busy ? html`<div class="sx-crunch"><${SxSpin} />Comparing ${f.v.area} sales and active listings…</div>` : ""}
        ${st.step >= 3 && rec ? html`<div class="sx-val">
            <div class="lbl">Estimated value · ${rec.addr}</div>
            <b class="num">${usd(rec.mid)}</b>
            <div class="sx-range"><i style="left:6%;right:6%"></i><span class="num">${usd(rec.low)}</span><span class="num">${usd(rec.high)}</span></div>
            <div class="muted">${rec.details.beds} bd · ${rec.details.baths} ba · <span class="num">${(+rec.details.sqft).toLocaleString()}</span> sqft · built ${rec.details.year} · ${rec.details.cond.toLowerCase()} · confidence: medium</div>
            <div class="sx-note">An automated estimate from public records and nearby listings, not an appraisal. A walk-through usually moves it by 3–5%.</div></div>
          <h3 class="sx-h3">Homes we compared</h3>
          <div class="sx-comps">${sxValue(rec.details && { ...rec.details, area: rec.area }).comps.map(c => html`<a class="sx-comp" href=${"#/site/home/" + c.id} onClick=${e => { e.preventDefault(); go("site/home/" + c.id); }}><img src=${img(c.img)} alt="" /><span><b class="num">${usd(c.price)}</b><small>${c.addr} · ${c.status}</small><small class="num">${c.sqft.toLocaleString()} sqft · ${usd(c.price / c.sqft)}/sqft</small></span></a>`)}</div>` : ""}
        ${st.step === 3 && rec ? html`<div class="sx-consult"><h3 class="sx-h3">Book a free listing consultation</h3><p class="muted" style="margin:0">30 minutes with ${priya.name}. You'll leave with a list-price range, a prep plan and a net sheet.</p>
            <div class="seg">${["In person", "Video"].map(x => html`<button class=${mode === x ? "on" : ""} onClick=${() => setMode(x)}>${x}</button>`)}</div>
            <div class="days" style="grid-template-columns:repeat(5,minmax(0,1fr))">${SX_DAYS.map(([d, n], i) => html`<button class=${day === i ? "on" : ""} onClick=${() => setDay(i)}>${d}<b>${n}</b>Oct</button>`)}</div>
            <div class="slots">${SX_SLOTS.map(x => html`<button class=${slot === x ? "on" : ""} onClick=${() => setSlot(x)}>${x}</button>`)}</div>
            <div class="row" style="gap:8px;flex-wrap:wrap"><button class="btn pri" onClick=${book}>Book consultation</button><button class="btn" onClick=${() => { up(() => { rec.monthly = !rec.monthly; }); toast(rec.monthly ? "You'll get a value update on the 1st of each month" : "Monthly updates turned off"); }}>${rec.monthly ? "✓ Monthly updates on" : "Not yet: email me monthly updates"}</button></div></div>` : ""}
        ${st.step === 4 && rec ? html`<${SxDone} title=${"You're booked with " + priya.name.split(" ")[0]} sub=${rec.consult.when + " · " + rec.consult.mode.toLowerCase() + " · " + rec.addr}
            next=${["Priya reviews your estimate and pulls closed sales from the last 90 days", "She calls ahead to confirm and asks about upgrades", "You leave with a price range, a prep plan and a net sheet"]}>
            <div class="row" style="gap:8px;justify-content:center;flex-wrap:wrap"><button class="btn" onClick=${() => { up(() => { s.val = { step: 0, v: sxValBlank({ name: f.v.name, email: f.v.email, phone: f.v.phone }) }; }); }}>Value another home</button><button class="btn pri" onClick=${() => go("site/buy")}>Browse homes for sale</button></div></${SxDone}>` : ""}
        ${st.step < 3 ? html`<div class="row sx-flowft"><button class="btn" disabled=${st.step === 0 || busy} onClick=${() => go2(st.step - 1)}>Back</button><span style="flex:1"></span><button class="btn pri" disabled=${busy} onClick=${next}>${busy ? html`<${SxSpin} />Estimating…` : st.step === 2 ? "See my estimate" : "Continue"}</button></div>` : ""}
      </div>
      <aside class="sx-sellside">
        <div class="card sx-agcard"><div class="row" style="gap:12px"><span class="av lg sx-av" style=${"background:" + priya.color}>${priya.ini}</span><div><b>${priya.name}</b><small class="muted" style="display:block">${priya.role} · TREC #${SX_BIO.priya.lic}</small></div></div>
          <div class="sx-stats"><div><b class="num">${myL.length}</b><small>active listings</small></div><div><b class="num">${Math.round(myL.reduce((a, l) => a + l.dom, 0) / (myL.length || 1))}</b><small>avg days listed</small></div><div><b class="num">${myL.reduce((a, l) => a + l.views, 0).toLocaleString()}</b><small>views this week</small></div></div>
          <button class="btn sm" onClick=${() => go("site/agent/priya")}>See Priya's profile</button></div>
        <div class="card sx-how"><h3>How selling works with us</h3>${["Free pricing consult and a live net sheet", "Prep plan with vetted vendors", "Pro photos, 3D tour and the MLS in one week", "Every offer side by side, with your net"].map((t, i) => html`<div class="sx-row2"><i>${i + 1}</i><span>${t}</span></div>`)}</div>
      </aside>
    </div>
  </div>`;
}

// ---------- rent ----------
function SxRent() {
  const s = sx(), rf = s.rf;
  const setR = (k, v) => up(() => { rf[k] = v; });
  const list = sxVacant().filter(u => u.beds >= rf.beds && (!rf.max || u.rent <= rf.max));
  return html`<div class="sx-page">
    <div class="sx-ph"><div><div class="lbl">Rentals · managed by Harbor & Vine</div><h1>Homes for rent in Austin</h1><div class="muted">Every fee shown up front · apply online in about 10 minutes · answer within one business day</div></div></div>
    <div class="sx-rentf"><label class="sx-fsel"><span>Beds</span><select value=${rf.beds} onChange=${e => setR("beds", +e.target.value)}>${[0, 1, 2, 3].map(b => html`<option value=${b}>${b ? b + "+ beds" : "Any"}</option>`)}</select></label>
      <label class="sx-fsel"><span>Max rent</span><select value=${rf.max} onChange=${e => setR("max", +e.target.value)}>${[[0, "Any"], [1800, "$1,800"], [2400, "$2,400"], [3200, "$3,200"]].map(([v, t]) => html`<option value=${v}>${t}</option>`)}</select></label>
      <span class="muted"><b class="num">${list.length}</b> available</span></div>
    ${list.length ? html`<div class="sx-cards3">${list.map(u => { const x = sxUnitInfo(u); return html`<article class="lc sx-lc" tabindex="0" role="link" aria-label=${x.b.name + " " + u.name} onClick=${() => go("site/unit/" + u.id)} onKeyDown=${e => e.key === "Enter" && go("site/unit/" + u.id)}>
        <div class="im" style=${"background-image:url(" + img(x.photos[0]) + ")"}><span class="tg">Available now</span></div>
        <div class="bd"><div class="pr num">${usd(u.rent)}<small class="sx-per">/mo</small></div><div class="sp2"><b>${u.beds}</b> bd · <b>${x.baths}</b> ba · <b class="num">${x.sqft.toLocaleString()}</b> sqft</div><div class="ad">${x.b.name} · Unit ${u.name} · ${x.b.addr}</div>
          <div class="mo">${x.apps ? x.apps + " application" + (x.apps > 1 ? "s" : "") + " in review" : "Be the first to apply"}</div></div></article>`; })}</div>`
      : html`<div class="sx-empty"><p>Nothing matches right now. Most units turn over in spring; ask Leo to tell you first.</p><div class="row" style="gap:8px;justify-content:center"><button class="btn pri" onClick=${() => up(() => { s.rf = { beds: 0, max: 0 }; })}>Clear filters</button><button class="btn" onClick=${() => sxAsk({ agent: "leo", about: "Upcoming rentals", text: "Hi Leo, please let me know when a " + (rf.beds || 1) + "+ bedroom opens up.", tags: ["Renter"], roles: ["Tenant"], src: "rentals" })}>Get notified</button></div></div>`}
    <div class="sx-box" style="margin-top:22px"><div class="sx-bh"><span class="sx-ic"><${SxI} n="shield" s=${16} /></span><h3>Tenant selection criteria</h3></div><p class="sx-small" style="margin:0">Texas Property Code §92.3515. Income at least 2.5× the rent · credit 620+ (or a guarantor) · no evictions in the last 5 years · criminal history reviewed individually, never a blanket ban · applications reviewed in the order received. The same criteria apply to every applicant.</p></div>
  </div>`;
}
function SxUnit({ id }) {
  const u = S.d.units.find(x => x.id === id);
  if (!u) return html`<${SxNotFound} what="That rental" />`;
  const x = sxUnitInfo(u), vacant = u.status === "Vacant" || !u.tenant, leo = A("leo");
  const fees = [["Application fee", "$55 per adult", "Non-refundable · covers credit & background screening"], ["Security deposit", usd(u.rent), "Refundable · one month's rent"], ["Admin fee", "$150", "Only if approved · due at lease signing"], ["Pet deposit", "$300 per pet", "Refundable · plus $35/mo pet rent"], ["Utilities", "Tenant pays", "Electric (Austin Energy), internet. Water & trash $65/mo"]];
  return html`<div class="sx-det">
    <nav class="sx-crumbs" aria-label="Breadcrumb"><a href="#/site" onClick=${e => { e.preventDefault(); go("site"); }}>Home</a><span>›</span><a href="#/site/rent" onClick=${e => { e.preventDefault(); go("site/rent"); }}>Rentals</a><span>›</span><b>${x.b.name} · ${u.name}</b></nav>
    <div class="mosaic sx-mosaic">${x.photos.map((g, i) => html`<button aria-label=${"Open photo " + (i + 1)} style=${"background-image:url(" + img(g) + ")"} onClick=${() => up(s => { s.modal = { kind: "sxGallery", photos: x.photos, i, title: x.b.name + " " + u.name }; })}></button>`)}</div>
    <div class="lbody sx-lbody"><div class="sx-dmain">
      <span class=${"pill " + (vacant ? "g" : "")}>${vacant ? "Available now" : "Leased"}</span>
      <div class="pr num" style="margin-top:8px">${usd(u.rent)}<small class="sx-per">/month</small></div>
      <div class="facts"><div><b>${u.beds}</b><span>beds</span></div><div><b>${x.baths}</b><span>baths</span></div><div><b class="num">${x.sqft.toLocaleString()}</b><span>sqft</span></div></div>
      <div class="sx-addr">${x.b.name}, Unit ${u.name} · ${x.b.addr}, Austin, TX</div>
      <div class="chips2"><span>12-month lease</span><span>In-unit laundry</span><span>Central AC</span><span>Pets welcome (2 max)</span><span>${u.b === "B1" ? "Elevator · bike room" : "Private garage"}</span></div>
      <h2 class="sx-h2">Fees, up front</h2>
      <div class="sx-feetbl" role="table">${fees.map(([a, b, c]) => html`<div role="row"><span role="cell"><b>${a}</b><small>${c}</small></span><b role="cell" class="num">${b}</b></div>`)}</div>
      <div class="sx-feetot"><span>To move in (1 adult, no pets)</span><b class="num">${usd(u.rent * 2 + 55 + 150)}</b><small>First month + deposit + application + admin</small></div>
      <h2 class="sx-h2">Who we approve</h2>
      <p class="sx-copy">Income at least 2.5× the rent (${usd(u.rent * 2.5)}/mo for this home) · credit 620+ or a guarantor · no evictions in 5 years · criminal history reviewed individually. Applications are reviewed in the order received; same criteria for everyone.</p>
    </div>
    <aside class="tourbox sx-tour">
      <h4>${vacant ? "Apply for " + x.b.name + " " + u.name : "This home is leased"}</h4>
      ${vacant ? html`<div class="sx-note">About 10 minutes. You'll see every fee before you pay, and get a decision within one business day.</div>
        <button class="btn pri big" onClick=${() => go("site/apply/" + u.id)}>Apply now</button>` : ""}
      <button class="btn big" onClick=${() => sxAsk({ agent: "leo", about: x.b.name + " " + u.name, text: "Hi Leo, could I see " + x.b.name + " " + u.name + " this week?", tags: ["Renter"], roles: ["Tenant"], src: "rentals" })}>Ask to see it</button>
      ${x.apps ? html`<div class="sx-note" style="text-align:center">${x.apps} application${x.apps > 1 ? "s" : ""} in review for this unit</div>` : ""}
      <div class="agentcard"><${Av} a=${leo} /><div><b>${leo.name}</b><div style="color:#6B726D">${leo.role} · replies same day</div></div></div>
    </aside></div>
  </div>`;
}
function SxApply({ id }) {
  const u = S.d.units.find(x => x.id === id);
  if (!u) return html`<${SxNotFound} what="That rental" />`;
  const x = sxUnitInfo(u), me = sxUser();
  const f = sxForm({ name: me ? me.name : "", email: me ? me.email : "", phone: me ? me.phone : "", sms: false, moveIn: "Nov 1", adults: "1", pets: "0", employer: "", income: "", cur: "", evict: "No", consent: false, criteria: false, sig: "", card: "", exp: "", zip: "" });
  const { v, set, err } = f;
  const [step, setStep] = useState(0), [busy, setBusy] = useState(false), [done, setDone] = useState(null);
  const steps = ["About you", "Income & history", "Consent", "Fee & submit"];
  const fee = 55 * (+v.adults || 1), ratio = +v.income ? +v.income / u.rent : 0;
  const leave = () => go("site/unit/" + u.id);
  function next() {
    if (step === 0 && !f.check({ name: sxV.name, email: sxV.email, phone: sxV.phone })) return;
    if (step === 1 && !f.check({ employer: sxV.req, income: s => !(+s >= 100) ? "Enter your gross monthly income in dollars" : "", cur: s => String(s).trim().length < 5 ? "Enter your current address" : "" })) return;
    if (step === 2 && !f.check({ consent: sxV.tick, criteria: sxV.tick, sig: (s, all) => s.trim().toLowerCase() !== all.name.trim().toLowerCase() ? "Type your name exactly as “" + all.name.trim() + "”" : "" })) return;
    if (step === 3) {
      if (!f.check({ card: s => !/^\d{15,16}$/.test(String(s).replace(/\s/g, "")) ? "Enter a 15 or 16-digit card number" : "", exp: s => !/^(0[1-9]|1[0-2])\/\d\d$/.test(String(s).trim()) ? "Use MM/YY" : "", zip: s => !/^\d{5}$/.test(String(s).trim()) ? "5-digit ZIP" : "" })) return;
      setBusy(true);
      setTimeout(() => {
        let rec, t;
        up(s => {
          const { p } = sxUpsertPerson({ name: v.name, email: v.email, phone: v.phone, owner: "leo", source: "Rentals site · application", stage: "Applicant", tags: ["Applicant", x.b.name + " " + u.name], roles: ["Tenant"] });
          if (!sxUser()) sx().user = p.id;
          rec = { id: "APP-" + (1041 + s.d.applications.length), pid: p.id, unit: u.id, b: u.b, name: v.name.trim(), email: v.email.trim(), phone: v.phone, moveIn: v.moveIn, adults: +v.adults, pets: +v.pets, employer: v.employer.trim(), income: +v.income, ratio: Math.round(ratio * 10) / 10, evict: v.evict, fee, status: "Submitted", at: SX_TODAY, criteria: true, consent: true };
          s.d.applications.push(rec);
          t = sxLog(p, "Applied for " + x.b.name + " " + u.name + " (" + usd(u.rent) + "/mo) · move-in " + v.moveIn + " · income " + rec.ratio + "× rent · " + rec.id, { subject: "Application · " + x.b.name + " " + u.name, mod: "Rentals", auto: "Application " + rec.id + " received. Leo Grant reviews it within one business day; screening runs once your fee clears.", autoCh: "Email" });
        });
        sxNotify("leo", "New rental application " + rec.id + ": " + rec.name + " for " + x.b.name + " " + u.name + " (" + rec.ratio + "× rent)", "inbox/" + t.id);
        setBusy(false); setDone(rec);
      }, 600);
      return;
    }
    setStep(step + 1);
  }
  if (done) return html`<div class="sx-page sx-narrow"><div class="card sx-flow"><${SxDone} title=${"Application " + done.id + " submitted"} sub=${x.b.name + " · Unit " + u.name + " · " + usd(u.rent) + "/mo · " + usd(done.fee) + " application fee paid"}
      next=${["Screening (credit, eviction and background) runs today with your consent", "Leo Grant reviews in the order received and decides within one business day", "If approved, you sign the lease online and pay the deposit to hold " + u.name]}>
      <div class="row" style="gap:8px;justify-content:center;flex-wrap:wrap"><button class="btn" onClick=${() => go("site/rent")}>See other rentals</button><button class="btn pri" onClick=${() => go("site")}>Back to home</button></div></${SxDone}></div></div>`;
  return html`<div class="sx-page sx-narrow">
    <nav class="sx-crumbs" aria-label="Breadcrumb"><a href="#/site/rent" onClick=${e => { e.preventDefault(); go("site/rent"); }}>Rentals</a><span>›</span><a href=${"#/site/unit/" + u.id} onClick=${e => { e.preventDefault(); leave(); }}>${x.b.name} ${u.name}</a><span>›</span><b>Application</b></nav>
    <div class="sx-ph"><div><h1>Apply for ${x.b.name} · ${u.name}</h1><div class="muted"><span class="num">${usd(u.rent)}</span>/mo · ${u.beds} bd · application fee <b class="num">$55</b> per adult, shown before you pay</div></div></div>
    <div class="card sx-flow">
      <${SxSteps} steps=${steps} i=${step} />
      ${step === 0 ? html`<${SxContact} f=${f} sms=${false} />
        <div class="sx-grid3"><${SxF} label="Move-in date"><select value=${v.moveIn} onChange=${set("moveIn")}>${["Oct 15", "Nov 1", "Nov 15", "Dec 1"].map(d => html`<option>${d}</option>`)}</select></${SxF}>
          <${SxF} label="Adults (18+)"><select value=${v.adults} onChange=${set("adults")}>${["1", "2", "3", "4"].map(d => html`<option>${d}</option>`)}</select></${SxF}>
          <${SxF} label="Pets"><select value=${v.pets} onChange=${set("pets")}>${["0", "1", "2"].map(d => html`<option>${d}</option>`)}</select></${SxF}></div>
        <div class="sx-note">Each adult who will live here applies separately; we'll email the others a link.</div>` : ""}
      ${step === 1 ? html`<div class="sx-grid2"><${SxF} label="Employer" err=${err.employer}><input value=${v.employer} onInput=${set("employer")} /></${SxF}>
          <${SxF} label="Gross monthly income ($)" err=${err.income}><input inputmode="numeric" value=${v.income} onInput=${set("income")} placeholder="e.g. 6200" /></${SxF}>
          <${SxF} label="Current address" err=${err.cur} cls="sx-span2"><input autocomplete="street-address" value=${v.cur} onInput=${set("cur")} /></${SxF}>
          <${SxF} label="Any evictions in the last 5 years?"><select value=${v.evict} onChange=${set("evict")}><option>No</option><option>Yes</option></select></${SxF}></div>
        ${ratio ? html`<div class=${"sx-ratio " + (ratio >= 2.5 ? "ok" : "lo")}><b class="num">${ratio.toFixed(1)}×</b><span>${ratio >= 2.5 ? "of the rent: meets the 2.5× income guideline" : "of the rent: below 2.5×. You can still apply; a guarantor or extra deposit may be offered."}</span></div>` : ""}` : ""}
      ${step === 2 ? html`<div class="doc sx-doc"><h4>Screening & tenant selection criteria</h4>
          <div>We'll check credit, rental and eviction history and criminal background through our screening partner. If we decline or add conditions based on the report, we'll send you an adverse-action notice naming the agency and your right to a free copy.</div>
          <div>Criteria: income 2.5× rent · credit 620+ or a guarantor · no evictions in 5 years · criminal history reviewed individually. Applications are reviewed in the order received.</div>
          <div class="sx-small">Harbor & Vine follows the Fair Housing Act. We do not discriminate on race, color, religion, sex, disability, familial status or national origin.</div></div>
        <${SxCk} checked=${v.consent} onChange=${set("consent")} err=${err.consent}>I authorize Harbor & Vine Realty to obtain consumer reports to evaluate this application.</${SxCk}>
        <${SxCk} checked=${v.criteria} onChange=${set("criteria")} err=${err.criteria}>I received and read the tenant selection criteria (Texas Property Code §92.3515).</${SxCk}>
        <${SxF} label=${"Sign by typing your full name (" + v.name + ")"} err=${err.sig}><input class="sx-sigin" value=${v.sig} onInput=${set("sig")} autocomplete="off" /></${SxF}>` : ""}
      ${step === 3 ? html`<div class="sx-feetbl">${[["Application fee", "$55 × " + v.adults + " adult" + (+v.adults > 1 ? "s" : ""), usd(fee)], ["Charged today", "Non-refundable once screening starts", usd(fee)], ["Only if approved", "Admin fee $150 + security deposit " + usd(u.rent), "Later"]].map(([a, b, c]) => html`<div><span><b>${a}</b><small>${b}</small></span><b class="num">${c}</b></div>`)}</div>
        <div class="sx-grid3"><${SxF} label="Card number" err=${err.card} cls="sx-span3"><input inputmode="numeric" autocomplete="cc-number" placeholder="4242 4242 4242 4242" value=${v.card} onInput=${set("card")} /></${SxF}>
          <${SxF} label="Expiry" err=${err.exp}><input autocomplete="cc-exp" placeholder="MM/YY" value=${v.exp} onInput=${set("exp")} /></${SxF}>
          <${SxF} label="Billing ZIP" err=${err.zip}><input inputmode="numeric" autocomplete="postal-code" value=${v.zip} onInput=${set("zip")} /></${SxF}></div>
        <div class="sx-note">Demo: no card is charged. Payments are processed by our PCI-compliant partner; we never store card numbers.</div>` : ""}
      <div class="row sx-flowft"><button class="btn" disabled=${busy} onClick=${() => (step ? setStep(step - 1) : leave())}>${step ? "Back" : "Cancel"}</button><span style="flex:1"></span><button class="btn pri" disabled=${busy} onClick=${next}>${busy ? html`<${SxSpin} />Submitting…` : step === 3 ? "Pay " + usd(fee) + " & submit" : "Continue"}</button></div>
    </div>
  </div>`;
}

// ---------- new homes: The Linden ----------
function SxPlanSvg({ type }) {
  const R = (x, y, w, h, t) => html`<rect x=${x} y=${y} width=${w} height=${h} fill="#FBF9F4" stroke="#1F4D3A" stroke-width="1.2" /><text x=${x + w / 2} y=${y + h / 2 + 2} text-anchor="middle" font-size="6" fill="#4E5751">${t}</text>`;
  const rooms = type === "1 BR" ? [[0, 0, 70, 46, "Living"], [70, 0, 50, 28, "Kitchen"], [70, 28, 50, 18, "Bath"], [0, 46, 70, 34, "Bedroom"], [70, 46, 50, 34, "Balcony"]]
    : type === "2 BR" ? [[0, 0, 64, 44, "Living"], [64, 0, 56, 26, "Kitchen"], [64, 26, 28, 18, "Bath"], [92, 26, 28, 18, "Bath"], [0, 44, 60, 36, "Primary"], [60, 44, 60, 36, "Bedroom 2"]]
    : [[0, 0, 60, 44, "Living"], [60, 0, 60, 24, "Kitchen"], [60, 24, 30, 20, "Bath"], [90, 24, 30, 20, "Bath"], [0, 44, 44, 36, "Primary"], [44, 44, 38, 36, "Bed 2"], [82, 44, 38, 36, "Bed 3"]];
  return html`<svg viewBox="-2 -2 124 84" class="sx-plan" role="img" aria-label=${type + " floor plan"}>${rooms.map(r => R(...r))}</svg>`;
}
function SxNew() {
  const pr = S.d.project, units = S.d.projUnits, types = ["1 BR", "2 BR", "3 BR"];
  const [type, setType] = useState("All"), [face, setFace] = useState("All"), [sel, setSel] = useState(null);
  const av = units.filter(u => u.status === "Available"), ro = A("rohan");
  const shown = (u) => (type === "All" || u.type === type) && (face === "All" || u.facing === face);
  const su = sel && units.find(u => u.code === sel);
  const floors = [...new Set(units.map(u => u.floor))].sort((a, b) => b - a);
  const sold = units.filter(u => u.status === "Sold" || u.status === "Booked").length;
  return html`<div class="sx-newh">
    <section class="sx-nhero" style=${"background-image:url(" + img(pr.img) + ")"}><div><div class="lbl">New homes · by ${pr.dev}</div><h1>${pr.name}</h1><p>${units.length} residences on six floors beside Mueller Lake Park. ${pr.launch} · possession ${pr.possession}.</p>
      <div class="sx-nstats"><span><b class="num">${av.length}</b>available</span><span><b class="num">${Math.round(sold / units.length * 100)}%</b>sold or booked</span><span><b class="num">${short(Math.min(...units.map(u => u.price)))}</b>from</span></div>
      <div class="row" style="gap:8px;flex-wrap:wrap"><button class="btn brass" onClick=${() => document.getElementById("sx-inv") && document.getElementById("sx-inv").scrollIntoView({ behavior: "smooth" })}>See available homes</button><button class="btn" onClick=${() => up(s => { s.modal = { kind: "sxInterest" }; })}>Register interest</button></div></div></section>
    <div class="sx-page">
      <h2 class="sx-h2">Floor plans</h2>
      <div class="sx-plans">${types.map(t => { const us = units.filter(u => u.type === t), a = us.filter(u => u.status === "Available"); return html`<button class=${"sx-plancard" + (type === t ? " on" : "")} aria-pressed=${type === t} onClick=${() => { setType(type === t ? "All" : t); setSel(null); }}>
          <${SxPlanSvg} type=${t} /><b>${t === "1 BR" ? "The Elm · 1 bed" : t === "2 BR" ? "The Oak · 2 bed" : "The Linden · 3 bed"}</b><small class="num">${us[0].sqft.toLocaleString()} sqft · from ${short(Math.min(...us.map(u => u.price)))}</small><span class=${"pill " + (a.length ? "g" : "")}>${a.length ? a.length + " available" : "Sold out · join waitlist"}</span></button>`; })}</div>
      <div class="sx-sh" id="sx-inv"><div><h2 class="sx-h2" style="margin:0">Availability</h2><div class="muted">Live from the sales office · tap an open home to reserve it</div></div><span class="sp"></span>
        <div class="row" style="gap:6px;flex-wrap:wrap">${["All", ...types].map(t => html`<button class=${"chip" + (type === t ? " on" : "")} onClick=${() => setType(t)}>${t === "All" ? "All plans" : t}</button>`)}<select class="chip" aria-label="Facing" value=${face} onChange=${e => setFace(e.target.value)}>${["All", "Lake", "City"].map(x => html`<option value=${x}>${x === "All" ? "Any view" : x + " view"}</option>`)}</select></div></div>
      <div class="sx-stack">
        <div class="sx-legend">${[["Available", "u-ok"], ["Held", "u-hd"], ["Booked / sold", "u-sd"]].map(([t, c]) => html`<span><i class=${c}></i>${t}</span>`)}</div>
        ${floors.map(fl => html`<div class="sx-floor"><span class="sx-fl">Floor ${fl}</span><div class="sx-units">${units.filter(u => u.floor === fl).map(u => { const ok = u.status === "Available", c = ok ? "u-ok" : u.status === "Held" ? "u-hd" : "u-sd"; return html`<button class=${"sx-u " + c + (shown(u) ? "" : " dim") + (sel === u.code ? " on" : "")} disabled=${!ok && u.status !== "Held"} aria-label=${"Unit " + u.code + ", " + u.type + ", " + u.status} title=${u.code + " · " + u.type + " · " + u.facing + " · " + usd(u.price)} onClick=${() => setSel(u.code)}><b>${u.code}</b><small>${u.type}</small></button>`; })}</div></div>`)}
      </div>
      ${su ? html`<div class="card sx-usel" aria-live="polite"><div class="sx-uselh"><div><div class="lbl">Residence ${su.code} · floor ${su.floor}</div><h3>${su.type} · <span class="num">${su.sqft.toLocaleString()}</span> sqft · ${su.facing} view</h3><b class="num sx-up">${usd(su.price)}</b></div><span class="sp"></span><span class=${"pill " + (su.status === "Available" ? "g" : "a")}>${su.status}</span></div>
          ${su.status === "Held" ? html`<div class="sx-note">${su.hold ? "Held for " + su.hold.by + " until " + su.hold.until + "." : "Someone is holding this home."} Holds expire after 72 hours; register interest and Rohan will tell you if it frees up.</div>` : ""}
          <div class="sx-pay"><div class="lbl">Payment schedule</div>${pr.plan.map(([k, p]) => html`<div class="sx-row"><span>${k}</span><span class="muted">${p}%</span><b class="num">${usd(su.price * p / 100)}</b></div>`)}</div>
          <div class="row" style="gap:8px;flex-wrap:wrap">${su.status === "Available" ? html`<button class="btn pri" onClick=${() => up(s => { s.modal = { kind: "sxHold", code: su.code }; })}>Reserve with a $2,500 hold</button>` : ""}<button class="btn" onClick=${() => up(s => { s.modal = { kind: "sxInterest", code: su.code, type: su.type }; })}>Register interest</button><button class="btn ghost" onClick=${() => setSel(null)}>Close</button></div></div>` : ""}
      <div class="sx-two" style="margin-top:22px">
        <div class="sx-box"><div class="sx-bh"><span class="sx-ic"><${SxI} n="pin" s=${16} /></span><h3>The neighborhood</h3></div><p class="sx-small" style="margin:0">Mueller: 140 acres of parks, the lake loop, Thinkery and the Sunday farmers market. 10 minutes to downtown, 12 to the airport.</p></div>
        <div class="sx-box"><div class="sx-bh"><span class="av" style=${"background:" + ro.color}>${ro.ini}</span><h3>${ro.name}</h3></div><p class="sx-small" style="margin:0">${ro.role} for ${pr.dev}. Represented by Harbor & Vine Realty as a cooperating brokerage. Your own agent is welcome.</p><button class="btn sm" style="margin-top:8px" onClick=${() => go("site/agent/rohan")}>Profile & contact</button></div>
      </div>
      <p class="sx-idx">Prices, plans and availability are subject to change without notice. Square footage is approximate. Renderings are illustrative. Seller: ${pr.dev}.</p>
    </div>
  </div>`;
}
function SxHoldModal({ m, close }) {
  const su = S.d.projUnits.find(u => u.code === m.code), me = sxUser(), pr = S.d.project;
  const steps = [!me && "Your details", "Hold terms", "Payment"].filter(Boolean);
  const [i, setI] = useState(0), [busy, setBusy] = useState(false), [done, setDone] = useState(null);
  const f = sxForm({ name: me ? me.name : "", email: me ? me.email : "", phone: me ? me.phone : "", sms: true, agree: false, card: "", exp: "", zip: "" });
  const cur = steps[i];
  function next() {
    if (cur === "Your details" && !f.check({ name: sxV.name, email: sxV.email, phone: sxV.phone })) return;
    if (cur === "Hold terms" && !f.check({ agree: sxV.tick })) return;
    if (cur === "Payment") {
      if (!f.check({ card: s => !/^\d{15,16}$/.test(String(s).replace(/\s/g, "")) ? "Enter a 15 or 16-digit card number" : "", exp: s => !/^(0[1-9]|1[0-2])\/\d\d$/.test(String(s).trim()) ? "Use MM/YY" : "", zip: s => !/^\d{5}$/.test(String(s).trim()) ? "5-digit ZIP" : "" })) return;
      if (su.status !== "Available") return f.setErr({ card: "Sorry, someone just reserved " + su.code + ". Pick another home." });
      setBusy(true);
      setTimeout(() => {
        let t, p;
        up(s => {
          p = me || sxUpsertPerson({ name: f.v.name, email: f.v.email, phone: f.v.phone, owner: "rohan", source: "Website · The Linden", stage: "New lead", tags: ["New homes"], roles: ["Buyer"] }).p;
          if (!sxUser()) sx().user = p.id;
          if (!p.tags.includes("Hold " + su.code)) p.tags.push("Hold " + su.code);
          su.status = "Held"; su.cp = "Website"; su.hold = { by: p.name, pid: p.id, until: "Sun Oct 11, 5:00 pm", amount: 2500 };
          s.d.holds.push({ id: sxNextId(s.d.holds, "H"), code: su.code, pid: p.id, amount: 2500, until: "Sun Oct 11, 5:00 pm", status: "Active", at: SX_TODAY });
          t = sxLog(p, "Reserved The Linden " + su.code + " (" + su.type + ", " + usd(su.price) + ") with a $2,500 refundable hold until Sun Oct 11, 5 pm", { subject: "The Linden · " + su.code, mod: "Projects", auto: "Your hold on " + su.code + " is confirmed. Rohan Mehta will call within the hour to walk you through the purchase agreement.", autoCh: "Email" });
        });
        sxNotify("rohan", "Website hold on " + su.code + " · " + p.name + " · expires Sun 5 pm", "projects");
        setBusy(false); setDone(p);
      }, 600);
      return;
    }
    setI(i + 1);
  }
  if (done) return html`<${SxModal} title="Home reserved" close=${close} foot=${html`<button class="btn pri" onClick=${close}>Done</button>`}>
    <${SxDone} title=${"Residence " + su.code + " is held for you"} sub=${su.type + " · " + usd(su.price) + " · $2,500 refundable hold until Sun Oct 11, 5:00 pm"}
      next=${["Rohan Mehta calls within the hour to answer questions", "Sign the purchase agreement and pay the 10% booking amount to lock it in", "Changed your mind? Cancel before the hold ends for a full refund"]} /></${SxModal}>`;
  return html`<${SxModal} title=${"Reserve residence " + su.code} sub=${su.type + " · " + su.sqft.toLocaleString() + " sqft · " + su.facing + " view · " + usd(su.price)} close=${close} onEnter=${next}
    foot=${html`<button class="btn" onClick=${() => (i ? setI(i - 1) : close())}>${i ? "Back" : "Cancel"}</button><button class="btn pri" disabled=${busy} onClick=${next}>${busy ? html`<${SxSpin} />Reserving…` : cur === "Payment" ? "Pay $2,500 hold" : "Continue"}</button>`}>
    ${steps.length > 1 ? html`<${SxSteps} steps=${steps} i=${i} />` : ""}
    ${cur === "Your details" ? html`<${SxContact} f=${f} />` : ""}
    ${cur === "Hold terms" ? html`<div class="doc sx-doc"><h4>Reservation hold · ${pr.name}</h4><div class="sx-terms">${[["Amount", "$2,500, fully refundable"], ["Holds", "Residence " + su.code + " for 72 hours"], ["Then", "Sign the purchase agreement and pay 10% (" + usd(su.price * 0.1) + ") to book"], ["Seller", pr.dev]].map(([k, t]) => html`<div><span>${k}</span><b>${t}</b></div>`)}</div>
        <div class="sx-small">A hold is not a contract and does not obligate you to buy. If you don't proceed, the $2,500 is refunded to your card within 5 business days.</div></div>
      <${SxCk} checked=${f.v.agree} onChange=${f.set("agree")} err=${f.err.agree}>I understand the hold terms.</${SxCk}>` : ""}
    ${cur === "Payment" ? html`<div class="sx-grid3"><${SxF} label="Card number" err=${f.err.card} cls="sx-span3"><input inputmode="numeric" autocomplete="cc-number" placeholder="4242 4242 4242 4242" value=${f.v.card} onInput=${f.set("card")} /></${SxF}>
        <${SxF} label="Expiry" err=${f.err.exp}><input placeholder="MM/YY" autocomplete="cc-exp" value=${f.v.exp} onInput=${f.set("exp")} /></${SxF}><${SxF} label="Billing ZIP" err=${f.err.zip}><input inputmode="numeric" value=${f.v.zip} onInput=${f.set("zip")} /></${SxF}></div>
      <div class="sx-note">Demo: no card is charged.</div>` : ""}
  </${SxModal}>`;
}
function SxInterestModal({ m, close }) {
  const me = sxUser();
  const f = sxForm({ name: me ? me.name : "", email: me ? me.email : "", phone: me ? me.phone : "", sms: false, type: m.type || "2 BR", when: "Within 6 months", budget: "$800K–$1M" });
  const [busy, setBusy] = useState(false);
  function send() {
    if (!me && !f.check({ name: sxV.name, email: sxV.email, phone: sxV.phoneOpt })) return;
    setBusy(true);
    setTimeout(() => {
      let t, p;
      up(s => {
        p = me || sxUpsertPerson({ name: f.v.name, email: f.v.email, phone: f.v.phone, owner: "rohan", source: "Website · The Linden", stage: "New lead", tags: ["New homes"], roles: ["Buyer"] }).p;
        if (!sxUser()) sx().user = p.id;
        s.d.interests.push({ id: sxNextId(s.d.interests, "I"), pid: p.id, type: f.v.type, code: m.code || "", when: f.v.when, budget: f.v.budget, at: SX_TODAY });
        t = sxLog(p, "Registered interest in The Linden: " + f.v.type + (m.code ? " (" + m.code + ")" : "") + " · " + f.v.budget + " · " + f.v.when.toLowerCase(), { subject: "The Linden · interest", mod: "Projects", auto: "Thanks! You're on the list for " + f.v.type + " homes at The Linden. Rohan will send floor plans and the price sheet today.", autoCh: "Email" });
        s.modal = null;
      });
      sxNotify("rohan", "New Linden enquiry: " + p.name + " · " + f.v.type, "inbox/" + t.id);
      toast("You're on the list · Rohan will send plans and prices today");
    }, 400);
  }
  return html`<${SxModal} title="Register interest · The Linden" sub="Get floor plans, the price sheet and first call on new releases" close=${close} onEnter=${send}
    foot=${html`<button class="btn" onClick=${close}>Cancel</button><button class="btn pri" disabled=${busy} onClick=${send}>${busy ? html`<${SxSpin} />Sending…` : "Register interest"}</button>`}>
    ${me ? html`<div class="sx-note">Registering as <b>${me.name}</b></div>` : html`<${SxContact} f=${f} />`}
    <div class="sx-grid3"><${SxF} label="Plan"><select value=${f.v.type} onChange=${f.set("type")}>${["1 BR", "2 BR", "3 BR"].map(x => html`<option>${x}</option>`)}</select></${SxF}>
      <${SxF} label="Budget"><select value=${f.v.budget} onChange=${f.set("budget")}>${["Under $650K", "$650K–$800K", "$800K–$1M", "$1M+"].map(x => html`<option>${x}</option>`)}</select></${SxF}>
      <${SxF} label="Timing"><select value=${f.v.when} onChange=${f.set("when")}>${["Ready now", "Within 6 months", "Just exploring"].map(x => html`<option>${x}</option>`)}</select></${SxF}></div>
  </${SxModal}>`;
}

// ---------- agents ----------
function SxAgents() {
  const ro = A("rohan");
  return html`<div class="sx-page">
    <div class="sx-ph"><div><div class="lbl">Our team</div><h1>Agents at Harbor & Vine</h1><div class="muted">Licensed by the Texas Real Estate Commission · one brokerage, one record, no hand-offs</div></div></div>
    <div class="sx-agrid">${SX_DIR.map(id => html`<${SxAgentCard} id=${id} />`)}</div>
    <h2 class="sx-h2">New homes partner</h2>
    <div class="sx-agrid"><${SxAgentCard} id="rohan" /></div>
  </div>`;
}
function sxAgentStats(id) {
  const act = S.d.listings.filter(l => l.agent === id && l.status !== "Under contract" && l.status !== "Sold").length;
  const closed = S.d.deals.filter(d => d.agent === id && d.stage === "Closed");
  return { act, closed: closed.length, vol: closed.reduce((a, d) => a + d.price, 0) };
}
function SxAgentCard({ id }) {
  const a = A(id), b = SX_BIO[id], st = sxAgentStats(id);
  return html`<a class="sx-acard" href=${"#/site/agent/" + id} onClick=${e => { e.preventDefault(); go("site/agent/" + id); }}>
    <span class="av lg sx-av" style=${"background:" + a.color}>${a.ini}</span>
    <b>${a.name}</b><small>${a.role}${b.lic ? " · TREC #" + b.lic : ""}</small><span class="pill br">${b.focus}</span>
    <div class="sx-astats"><span><b class="num">${st.act}</b>for sale</span><span><b class="num">${st.closed}</b>closed '26</span><span><b class="num">${new Date().getFullYear() - b.since}</b>yrs</span></div>
    <small class="muted">${b.langs.join(" · ")}</small></a>`;
}
function SxAgent({ id }) {
  const a = A(id), b = SX_BIO[id];
  if (!a || !b) return html`<${SxNotFound} what="That agent" />`;
  const st = sxAgentStats(id), ls = S.d.listings.filter(l => l.agent === id), closed = S.d.deals.filter(d => d.agent === id && d.stage === "Closed");
  const me = sxUser();
  const f = sxForm({ name: me ? me.name : "", email: me ? me.email : "", phone: me ? me.phone : "", sms: false, msg: "", topic: id === "leo" ? "Renting" : id === "priya" ? "Selling" : id === "rohan" ? "New homes" : "Buying" });
  const [busy, setBusy] = useState(false), [sent, setSent] = useState(false);
  function send() {
    const rules = { msg: x => String(x).trim().length < 5 ? "Write a short message" : "" };
    if (!me) Object.assign(rules, { name: sxV.name, email: sxV.email, phone: sxV.phoneOpt });
    if (!f.check(rules)) return;
    setBusy(true);
    setTimeout(() => {
      let t;
      up(() => { const p = me || sxUpsertPerson({ name: f.v.name, email: f.v.email, phone: f.v.phone, owner: id, source: "Website · agent profile", stage: "New lead", tags: [f.v.topic === "Selling" ? "Seller" : f.v.topic === "Renting" ? "Renter" : "Buyer"], roles: [] }).p; if (!sxUser()) sx().user = p.id; t = sxLog(p, "[" + f.v.topic + "] " + f.v.msg.trim(), { subject: "Message for " + a.name.split(" ")[0], auto: "Thanks! " + a.name + " will reply shortly.", note: "Auto-reply from the website" }); });
      sxNotify(id, "Message from your website profile (" + f.v.topic.toLowerCase() + ")", "inbox/" + t.id);
      setBusy(false); setSent(true); toast("Message sent to " + a.name);
    }, 400);
  }
  return html`<div class="sx-page">
    <nav class="sx-crumbs" aria-label="Breadcrumb"><a href="#/site/agents" onClick=${e => { e.preventDefault(); go("site/agents"); }}>Agents</a><span>›</span><b>${a.name}</b></nav>
    <div class="sx-aprof">
      <div class="sx-ahead"><span class="av sx-avxl" style=${"background:" + a.color}>${a.ini}</span><div><h1>${a.name}</h1><div class="muted">${a.role}${b.partner ? " · " + S.d.project.dev : " · " + SX_BROKER.name}${b.lic ? " · TREC #" + b.lic : ""}</div>
        <div class="row" style="gap:6px;margin-top:8px;flex-wrap:wrap"><span class="pill br">${b.focus}</span>${b.areas.map(x => html`<span class="pill">${x}</span>`)}</div></div></div>
      <div class="sx-astats lg"><span><b class="num">${st.act}</b>homes for sale</span><span><b class="num">${st.closed}</b>closed this year</span><span><b class="num">${st.vol ? short(st.vol) : "—"}</b>closed volume</span><span><b class="num">${new Date().getFullYear() - b.since}</b>years licensed</span></div>
    </div>
    <div class="sx-agentgrid">
      <div>
        <h2 class="sx-h2">About ${a.name.split(" ")[0]}</h2><p class="sx-copy">${b.bio}</p><div class="muted" style="font-size:13px">Speaks ${b.langs.join(", ")}</div>
        ${id === "rohan" ? html`<h2 class="sx-h2">Selling now</h2><button class="sx-pane new sx-panebtn" style=${"--bg:url(" + img(S.d.project.img) + ")"} onClick=${() => go("site/new-homes")}><div class="lbl">New homes</div><h3>${S.d.project.name}</h3><span class="sx-go">See availability →</span></button>` : ""}
        ${ls.length ? html`<h2 class="sx-h2">${a.name.split(" ")[0]}'s listings</h2><div class="sx-cards2">${ls.map(l => html`<${SxCard} l=${l} />`)}</div>` : ""}
        ${closed.length ? html`<h2 class="sx-h2">Recently closed</h2>${closed.map(d => { const l = L(d.listing); return html`<div class="sx-row sx-sold"><img src=${img(l.img)} alt="" /><span><b>${l.addr}</b><small>${l.area} · ${d.kind === "Buyer" ? "represented the buyer" : "represented the seller"}</small></span><span class="muted">${d.close}</span><b class="num">${usd(d.price)}</b></div>`; })}` : ""}
      </div>
      <aside class="tourbox sx-tour"><h4>Contact ${a.name.split(" ")[0]}</h4>
        ${sent ? html`<${SxDone} title="Message sent" sub=${a.name + " usually replies within 5 minutes, 8 am to 8 pm."}><button class="btn sm" onClick=${() => { setSent(false); f.put("msg", ""); }}>Send another</button></${SxDone}>` : html`
          <div class="field"><span>I'm interested in</span><div class="seg">${["Buying", "Selling", "Renting", "New homes"].map(x => html`<button class=${f.v.topic === x ? "on" : ""} onClick=${() => f.put("topic", x)}>${x}</button>`)}</div></div>
          ${me ? html`<div class="sx-note">Sending as <b>${me.name}</b></div>` : html`<${SxContact} f=${f} />`}
          <${SxF} label="Message" err=${f.err.msg}><textarea rows="4" value=${f.v.msg} onInput=${f.set("msg")} placeholder=${"Hi " + a.name.split(" ")[0] + ", …"}></textarea></${SxF}>
          <button class="btn pri big" disabled=${busy} onClick=${send}>${busy ? html`<${SxSpin} />Sending…` : "Send message"}</button>`}
      </aside>
    </div>
  </div>`;
}

// ---------- legal & notices ----------
const SX_LEGAL = {
  iabs: ["Information About Brokerage Services", "Texas law requires all real estate license holders to give this information to prospective buyers, tenants, sellers and landlords.", [
    ["Types of real estate license holders", "A broker is responsible for all brokerage activities, including acts performed by sales agents sponsored by the broker. A sales agent must be sponsored by a broker and works with clients on behalf of the broker."],
    ["A broker's minimum duties required by law", "Put the interests of the client above all others, including the broker's own interests; inform the client of any material information about the property or transaction received by the broker; answer the client's questions and present any offer to or counter-offer from the client; and treat all parties honestly and fairly."],
    ["A license holder can represent a party in a real estate transaction", "As agent for the owner (seller/landlord), as agent for the buyer/tenant, or as an intermediary for both parties with written consent. When acting as an intermediary the broker must treat both parties fairly, may appoint different agents to each party, and must not disclose confidential information such as the lowest price a seller will accept or the highest price a buyer will pay unless authorized."],
    ["To avoid disputes", "All agreements between you and a broker should be in writing and clearly establish the broker's duties to you and your obligations, including how the broker will be paid."],
    ["License holder contact information", SX_BROKER.name + " · license #" + SX_BROKER.lic + " · " + SX_BROKER.email + " · " + SX_BROKER.phone + ". Designated broker: " + SX_BROKER.broker + " · license #" + SX_BROKER.brokerLic + ". Regulated by the Texas Real Estate Commission. Form IABS 1-1 (summary shown; the official TREC form is available on request and in your account)."]]],
  cpn: ["Texas Real Estate Commission Consumer Protection Notice", "TREC administers two recovery funds which may be used to satisfy a civil court judgment against a broker, sales agent, real estate inspector or easement or right-of-way agent, if certain requirements are met.", [
    ["Who regulates us", "The Texas Real Estate Commission (TREC) regulates real estate brokers and sales agents, real estate inspectors, home warranty companies, easement and right-of-way agents and timeshare interest providers."],
    ["How to file a complaint", "If you have a complaint or questions, contact TREC at P.O. Box 12188, Austin, Texas 78711-2188, (512) 936-3000, or visit trec.texas.gov."],
    ["Brokerage", SX_BROKER.name + ", " + SX_BROKER.addr + " · TREC license #" + SX_BROKER.lic + "."]]],
  "fair-housing": ["Fair housing", "We are pledged to the letter and spirit of U.S. policy for the achievement of equal housing opportunity throughout the nation.", [
    ["Our commitment", "Harbor & Vine Realty complies with the federal Fair Housing Act and the Texas Fair Housing Act. We do not discriminate on the basis of race, color, religion, sex (including sexual orientation and gender identity), disability, familial status or national origin."],
    ["In our listings and search", "Listing descriptions describe the home, not the people who should live in it. Neighborhood information on this site is limited to facts like schools, commute and amenities; we don't steer anyone toward or away from any area."],
    ["Reasonable accommodations", "If you have a disability and need an accommodation to use this site, tour a home or apply for a rental, call " + SX_BROKER.phone + " or email " + SX_BROKER.email + "."],
    ["Report discrimination", "Contact HUD at 1-800-669-9777 or the Texas Workforce Commission Civil Rights Division."]]],
  privacy: ["Privacy policy", "How Harbor & Vine Realty collects, uses and protects your information. Effective Oct 1, 2026.", [
    ["What we collect", "Details you give us (name, email, phone, home preferences, applications) and, only if you allow it, analytics and marketing cookies. Rental screening data is handled by our screening partner under the Fair Credit Reporting Act."],
    ["How we use it", "To answer you, arrange tours and consultations, process applications and send alerts you ask for. Texts are sent only with your consent; reply STOP to opt out."],
    ["Your choices", "Non-essential cookies are off unless you turn them on, and we honor Global Privacy Control. You can access, correct or delete your data under the Texas Data Privacy and Security Act by emailing " + SX_BROKER.email + ". We do not sell personal data."],
    ["Security", "Data is encrypted in transit and at rest. Card payments go to a PCI-compliant processor; we never store card numbers."]]],
  accessibility: ["Accessibility", "We want everyone to be able to find a home with us.", [
    ["Our standard", "This site aims to meet WCAG 2.2 level AA: keyboard navigation, visible focus, text alternatives and sufficient contrast."],
    ["Need help?", "If anything is hard to use, call " + SX_BROKER.phone + " and we'll help you directly and fix the issue."]]],
};
function SxLegal({ id }) {
  const d = SX_LEGAL[id];
  if (!d) return html`<${SxNotFound} what="That page" />`;
  return html`<div class="sx-page sx-narrow sx-legal">
    <nav class="sx-crumbs" aria-label="Breadcrumb"><a href="#/site" onClick=${e => { e.preventDefault(); go("site"); }}>Home</a><span>›</span><b>${d[0]}</b></nav>
    <h1>${d[0]}</h1><p class="sx-lead">${d[1]}</p>
    ${d[2].map(([h, p]) => html`<section><h2>${h}</h2><p>${p}</p></section>`)}
    ${id === "fair-housing" ? html`<div class="sx-fair in"><${SxEho} s=${40} /><p><b>Equal Housing Opportunity</b></p></div>` : ""}
    ${id === "privacy" ? html`<button class="btn" onClick=${() => up(() => { sx().consentEdit = true; })}>Change cookie settings</button>` : ""}
  </div>`;
}
function SxNotFound({ what }) {
  return html`<div class="sx-page"><div class="sx-empty big"><h1>${what} isn't available</h1><p>It may have sold, been leased or moved. Here's where to look next.</p><div class="row" style="gap:8px;justify-content:center"><button class="btn pri" onClick=${() => go("site/buy")}>Homes for sale</button><button class="btn" onClick=${() => go("site/rent")}>Rentals</button></div></div></div>`;
}

// ---------- map (shared with seller.js) ----------
function MapSvg() {
  return html`<svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
    <rect width="100" height="100" fill="#E9ECE4" />
    <path d="M0 60 C 15 55, 25 70, 40 64 S 62 52, 75 56 S 92 62, 100 58 L100 66 C 90 70, 80 62, 70 64 S 50 74, 38 72 S 14 66, 0 70 Z" fill="#B9D3E3" />
    <path d="M0 18 L100 26 M0 40 L100 44 M0 84 L100 80 M12 0 L18 100 M34 0 L32 100 M52 0 L50 100 M68 0 L72 100 M86 0 L84 100" stroke="#fff" stroke-width="1.2" />
    <path d="M0 30 L100 12 M20 100 L60 0" stroke="#F7E3B5" stroke-width="1.6" />
    <rect x="36" y="20" width="10" height="8" fill="#CFE0C3" rx="1" /><rect x="58" y="74" width="12" height="9" fill="#CFE0C3" rx="1" /><rect x="4" y="76" width="9" height="12" fill="#CFE0C3" rx="1" />
  </svg>`;
}

// ---------- router ----------
function Site() {
  const seg = sxSeg(), path = seg.join("/");
  sx();
  let sub = seg[0] || "", id = seg[1], Page = SxHome, active = "", url = path;
  if (/^L\d+$/.test(sub)) { id = sub; sub = "home"; }
  if (sub === "buy" || sub === "search") { Page = SxBuy; active = "buy"; }
  else if (sub === "home") { Page = SxListing; active = "buy"; const l = L(id); url = l ? "homes/" + l.addr.toLowerCase().replace(/[^a-z0-9]+/g, "-") : path; }
  else if (sub === "saved") { Page = SxSaved; active = "saved"; }
  else if (sub === "sell") { Page = SxSell; active = "sell"; }
  else if (sub === "rent") { Page = SxRent; active = "rent"; }
  else if (sub === "unit") { Page = SxUnit; active = "rent"; }
  else if (sub === "apply") { Page = SxApply; active = "rent"; }
  else if (sub === "new-homes") { Page = SxNew; active = "new"; }
  else if (sub === "agents") { Page = SxAgents; active = "agents"; }
  else if (sub === "agent") { Page = SxAgent; active = "agents"; }
  else if (sub === "legal") { Page = SxLegal; }
  else if (sub) { Page = () => html`<${SxNotFound} what="That page" />`; }
  return html`<${SxFrame} active=${active} path=${url}><${Page} key=${path} id=${id} /></${SxFrame}>`;
}
