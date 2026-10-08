// Customer portal: the buyer's whole journey in one place, from budget to keys.
// It runs on the same store as the office (S, up, go from app.js), so every step the buyer takes lands in the agent's deal file and inbox.
// Loaded before app.js; everything here is only called after app.js has defined S, html and the helpers.

const PJ_STAGES = [
  ["ready", "Get ready", "Budget, pre-approval and your agreement"],
  ["find", "Find homes", "Search, save and compare with Marco"],
  ["tour", "Tour", "See your favourites in person or on video"],
  ["offer", "Offer", "Build, sign and negotiate"],
  ["contract", "Under contract", "Inspection, appraisal and your loan"],
  ["close", "Closing", "Review costs, wire safely, get keys"],
  ["home", "Own it", "Your home's value and equity"],
];

function pj() {
  if (!S.pj) S.pj = {
    stage: 0, budget: { income: 290000, debts: 900, down: 230000, credit: "740+" }, preapproved: false, docs: { paystubs: false, w2: false, bank: false, id: false },
    agreement: false, saved: { L1: { by: "Elena", react: "love", note: "Love the light. Pool is a plus." }, L2: { by: "Marco", react: "", note: "Bigger yard than it looks" } }, compare: ["L1", "L2"], board: "shared",
    hidden: ["L5", "L7"], tours: [], offer: null, counter: null, accepted: false,
    tasks: null, inspection: { requested: [] }, wireVerified: false, wired: false, cdReviewed: false, walkthrough: false, signedClosing: false,
    loan: 1, feed: [["Today", "Sam saved a new match for you: 1806 Kinney Ave (coming soon)"]],
  };
  return S.pj;
}
const pjStage = () => PJ_STAGES[pj().stage][0];
function pjAdvance(to, note) {
  up(() => { const p = pj(); const i = PJ_STAGES.findIndex(s => s[0] === to); if (i > p.stage) p.stage = i; if (note) p.feed.unshift(["Just now", note]); });
}
function buyAbility(b) {
  const maxPay = (b.income / 12) * 0.36 - b.debts, r = 6.4 / 100 / 12, n = 360;
  const taxIns = 0.0215 / 12; // property tax + insurance per $ of price
  // price P: (P - down) * k + P * taxIns = maxPay
  const k = r / (1 - Math.pow(1 + r, -n));
  const price = (maxPay + b.down * k) / (k + taxIns);
  return { price: Math.round(price / 1000) * 1000, pay: Math.round(maxPay) };
}
const pjThread = () => S.d.threads.find(t => t.person === "P4");
function logToAgent(text) { const t = pjThread(); if (t) { t.msgs.push({ from: "them", text, at: "now", ch: "Portal" }); t.unread += 1; t.when = "now"; } }
function pjDeal() { return S.d.deals.find(d => d.person === "P4"); }
// the one purchase price: what was accepted (seller counter or offer), else the deal's price
function pjPrice() { const p = pj(); return p.accepted && p.counter ? p.counter.price : p.offer ? p.offer.price : ((pjDeal() || {}).price || 1142000); }
const pjEmd = () => Math.round(pjPrice() * (((pj().offer || {}).emd) || 1) / 100);
const pjLoan = () => Math.round(pjPrice() * (1 - (((pj().offer || {}).down) || 20) / 100));

// ---------- frame ----------
function PortalFrame({ children, tab }) {
  const p = pj(), agent = A("sam");
  const tabs = [["home", "Home"], ["budget", "Budget"], ["find", "Find homes"], ["saved", "Saved"], ["tours", "Tours"], ["offer", "Offer"], ["deal", "My purchase"], ["myhome", "My home"], ["messages", "Messages"]];
  return html`<div class="site pt pt-buyer">
    <div class="sbar"><span>Client portal</span><span class="u">my.harborandvine.com${tab && tab !== "home" ? "/" + tab : ""}</span><span style="flex:1"></span>
      <label class="pj-demo">Demo: jump to <select value=${p.stage} onChange=${e => pjJump(+e.target.value)}>${PJ_STAGES.map((s, i) => html`<option value=${i}>${s[1]}</option>`)}</select></label>
      <button onClick=${() => leavePortal("today")}>${leaveLabel("← Agent's office")}</button></div>
    <div class="snav"><a class="logo" href="#/site" title="harborandvine.com" onClick=${e => { e.preventDefault(); go("site"); }} style="text-decoration:none">Harbor & Vine</a><span class="pt-who">Elena & Marco Ruiz</span><span class="sp"></span>
      <button class="btn sm ghost pt-web" onClick=${() => go("site/buy")} title="Search every home on harborandvine.com">Search the website ↗</button>
      ${window.EosChrome ? html`<${EosChrome.Tools} />` : ""}
      <button class="pt-agent" onClick=${() => go("portal/messages")}><${Av} a=${agent} /><span><b>${agent.name}</b><small>Your agent · replies in ~5 min</small></span></button></div>
    <nav class="pt-tabs">${tabs.map(([k, v]) => html`<button class=${tab === k ? "on" : ""} onClick=${() => go("portal/" + k)}>${v}${k === "messages" && pjThread()?.msgs.some(m => m.from !== "them" && m.fresh) ? html`<i></i>` : ""}</button>`)}</nav>
    <div class="pt-body">${children}</div></div>`;
}
function pjJump(i) {
  up(() => {
    const p = pj(); p.stage = i;
    if (i >= 1) { p.preapproved = true; p.agreement = true; Object.keys(p.docs).forEach(k => p.docs[k] = true); }
    if (i >= 3 && !p.tours.length) p.tours.push({ l: "L1", when: "Sat 10 Oct, 1:00 pm", mode: "In person", done: true, rating: 5, note: "Kitchen is perfect. Check the roof age." });
    if (i >= 4) { p.offer = p.offer || { price: 1135000, emd: 1, down: 20, fin: "Conventional", option: 7, close: "Nov 14", conc: 0, cont: { inspection: true, appraisal: true, financing: true, sale: false }, esc: false }; p.counter = p.counter || { price: 1142000 }; p.accepted = true; p.loan = Math.max(p.loan, 2); }
    if (i >= 5) { p.wireVerified = true; p.wired = true; p.loan = 5; p.inspection.requested = ["Roof flashing"]; }
    if (i >= 6) { p.cdReviewed = p.walkthrough = p.signedClosing = true; }
  });
  go("portal/home");
}

// ---------- home: the journey ----------
function PortalHome() {
  const p = pj(), st = p.stage;
  const next = [
    { t: "Set your budget and get pre-approved", s: "3 minutes for an estimate, about a day for a pre-approval letter", go: "budget", cta: "Start" },
    { t: "Save homes and compare them with Marco", s: "Homes inside your budget are marked; Sam adds off-market finds", go: "find", cta: "Find homes" },
    { t: "Book a tour of 4 Willow Bend", s: "Saturday 1:00 pm is open with Sam", go: "tours", cta: "Book a tour" },
    { t: "Make an offer on 4 Willow Bend", s: "Offers are due Friday at 5 pm. Sam suggests $1,135k–$1,150k", go: "offer", cta: "Start my offer" },
    { t: "Upload your homeowners insurance binder", s: "Due Oct 20 · 3 of 11 tasks left this week", go: "deal", cta: "Open my purchase" },
    { t: "Review your closing costs and verify the wire", s: "Closing Nov 14 at Lone Star Title", go: "deal", cta: "Review" },
    { t: "Welcome home! Your equity is growing", s: "Track value, plan projects, refer a friend", go: "myhome", cta: "See my home" },
  ][st];
  const todo = [
    [["Estimate your budget", st > 0 || p.preapproved], ["Upload pre-approval documents", Object.values(p.docs).every(Boolean)], ["Sign your buyer agreement", p.agreement]],
    [["Save 3 homes you like", Object.keys(p.saved).length >= 3], ["Invite Marco to your board", true], ["Compare your favourites", p.compare.length >= 2]],
    [["Book a tour", p.tours.length > 0], ["Rate homes after touring", p.tours.some(t => t.rating)]],
    [["Choose your offer price", !!p.offer], ["Sign the offer", !!p.offer], ["Respond to the seller's counter", p.accepted]],
    pjTasks().filter(t => t.who === "You").slice(0, 4).map(t => [t.t, t.done]),
    [["Review the closing disclosure", p.cdReviewed], ["Verify wiring instructions by phone", p.wireVerified], ["Do the final walkthrough", p.walkthrough], ["Sign at closing", p.signedClosing]],
    [["Set up utilities", true], ["Add your home's projects", false], ["Refer a friend", false]],
  ][st];
  return html`<${PortalFrame} tab="home">
    <div class="pt-hero"><div><div class="lbl">Your home journey</div><h1>${st === 6 ? "Welcome home, Elena." : "Hi Elena, you're " + Math.round(st / 6 * 100) + "% of the way home."}</h1></div>
      ${p.preapproved ? html`<div class="pt-budget"><span>Pre-approved up to</span><b class="num">$1,200,000</b><small>Lone Star Lending · valid to Jan 6</small></div>` : ""}</div>
    <div class="track">${PJ_STAGES.map((s, i) => html`<div class=${"tk" + (i < st ? " done" : i === st ? " now" : "")}><i>${i < st ? "✓" : i + 1}</i><b>${s[1]}</b><span>${s[2]}</span></div>`)}</div>
    <div class="pt-grid">
      <div class="pt-next"><div class="lbl">Your next step</div><h2>${next.t}</h2><p>${next.s}</p><button class="btn pri" onClick=${() => go("portal/" + next.go)}>${next.cta} →</button></div>
      <div class="card"><div class="hd"><h3>To do</h3><span class="sp"></span><span class="muted">${todo.filter(t => t[1]).length}/${todo.length}</span></div><div class="bd">${todo.map(([t, d]) => html`<div class=${"chk" + (d ? " ok" : "")}><i>${d ? "✓" : ""}</i><span>${t}</span></div>`)}</div></div>
    </div>
    <div class="pt-grid">
      <div class="card"><div class="hd"><h3>Updates</h3></div><div class="feed">${p.feed.slice(0, 6).map(([w, t]) => html`<div class="it"><span class="dot"></span><div style="flex:1">${t}</div><span class="muted" style="font-size:12px">${w}</span></div>`)}</div></div>
      <div class="card"><div class="hd"><h3>Your team</h3></div><div class="feed">${[[A("sam"), "Your agent", "Text, call or message here"], [{ ini: "LS", color: "#2F5F8F" }, "Lone Star Lending", "Kim Alvarez · loan officer"], [{ ini: "LT", color: "#7A4E9C" }, "Lone Star Title", "Closing & escrow"], [{ ini: "TC", color: "#B8873B" }, "Harbor & Vine TC", "Keeps your dates on track"]].map(([a, n, s]) => html`<div class="it" style="align-items:center"><${Av} a=${a} /><div style="flex:1"><b style="font-size:13px">${n}</b><div class="muted" style="font-size:12px">${s}</div></div></div>`)}</div></div>
    </div></${PortalFrame}>`;
}

// ---------- budget & pre-approval ----------
function PortalBudget() {
  const p = pj(), b = p.budget, ba = buyAbility(b);
  const set = (k, v) => up(() => { b[k] = v; });
  const docs = [["paystubs", "Last 2 pay stubs"], ["w2", "W-2s for 2024 and 2025"], ["bank", "2 months of bank statements"], ["id", "Photo ID"]];
  const allDocs = Object.values(p.docs).every(Boolean);
  return html`<${PortalFrame} tab="budget"><div class="pt-cols">
    <div class="card"><div class="hd"><h3>What can you afford?</h3></div><div class="bd" style="display:flex;flex-direction:column;gap:14px">
      <div class="ba"><div class="lbl">Your target price</div><b class="num">${usd(ba.price)}</b><div class="ba-bar"><i style=${"left:" + Math.min(96, ba.price / 1600000 * 100) + "%"}></i></div><div class="row muted" style="justify-content:space-between;font-size:12px"><span>$0</span><span>$1.6M</span></div>
        <div class="muted" style="font-size:12.5px">Monthly payment about ${usd(ba.pay)} (36% of income, minus debts) · 30-yr fixed 6.40%</div></div>
      <label class="field"><span>Household income (yearly) · ${usd(b.income)}</span><input type="range" min="60000" max="500000" step="5000" value=${b.income} onInput=${e => set("income", +e.target.value)} /></label>
      <label class="field"><span>Monthly debts (car, cards, loans) · ${usd(b.debts)}</span><input type="range" min="0" max="5000" step="50" value=${b.debts} onInput=${e => set("debts", +e.target.value)} /></label>
      <label class="field"><span>Down payment savings · ${usd(b.down)}</span><input type="range" min="0" max="600000" step="5000" value=${b.down} onInput=${e => set("down", +e.target.value)} /></label>
      <div class="field"><span>Credit score</span><div class="seg">${["620–679", "680–739", "740+"].map(c => html`<button class=${b.credit === c ? "on" : ""} onClick=${() => set("credit", c)}>${c}</button>`)}</div></div>
      <div class="muted" style="font-size:12px">Down-payment help: you may qualify for 2 Austin programs. Sam can explain them.</div>
    </div></div>
    <div style="display:flex;flex-direction:column;gap:16px">
      <div class="card"><div class="hd"><h3>Get pre-approved</h3><span class="sp"></span>${p.preapproved ? html`<span class="pill g">Approved</span>` : html`<span class="pill">Lone Star Lending</span>`}</div><div class="bd" style="display:flex;flex-direction:column;gap:8px">
        ${p.preapproved ? html`<div class="pa-letter"><div class="lbl">Pre-approval letter</div><b class="num">$1,200,000</b><div class="muted" style="font-size:12.5px">Conventional · 20% down · valid to Jan 6, 2027</div><button class="btn sm" onClick=${() => up(s => { s.modal = { kind: "ptLetter" }; })}>View letter</button></div>`
          : html`${docs.map(([k, t]) => html`<button class=${"chk" + (p.docs[k] ? " ok" : "")} onClick=${() => up(() => { p.docs[k] = true; })}><i>${p.docs[k] ? "✓" : ""}</i><span style="flex:1;text-decoration:none">${t}</span><span class="muted" style="font-size:12px">${p.docs[k] ? "Uploaded" : "Upload"}</span></button>`)}
            <div class="muted" style="font-size:12px">Files are encrypted and shared only with your lender. Or connect your bank to skip statements.</div>
            <button class="btn pri" disabled=${!allDocs} onClick=${() => { up(() => { p.preapproved = true; p.feed.unshift(["Just now", "Pre-approved up to $1,200,000 by Lone Star Lending"]); }); toast("Pre-approved up to $1,200,000 · Sam has been notified", p.agreement ? ["Find homes", () => go("portal/find")] : null); logToAgent("Elena was pre-approved up to $1,200,000 (Lone Star Lending)."); }}>Submit for pre-approval</button>`}
      </div></div>
      <div class="card"><div class="hd"><h3>Your buyer agreement</h3><span class="sp"></span>${p.agreement ? html`<span class="pill g">Signed</span>` : ""}</div><div class="bd" style="display:flex;flex-direction:column;gap:8px;font-size:13px">
        <div>Texas requires an agreement before touring. You set how Sam is paid: <b>2.5%</b>, paid from the seller's offer first. Cancel any time with 7 days' notice.</div>
        ${p.agreement ? html`<div class="muted">Signed Oct 8 · stored in your documents</div>` : html`<button class="btn brass" style="align-self:flex-start" onClick=${() => { up(() => { p.agreement = true; const d = pjDeal(); if (d) { d.agreement = { signed: true, on: "Oct 8", comp: "2.5%", term: "90 days" }; } }); toast("Agreement signed · in your documents and Sam's deal file"); logToAgent("Signed the buyer representation agreement (2.5%, 90 days)."); }}>Review & sign</button>`}
      </div></div>
      ${p.preapproved && p.agreement && p.stage === 0 ? html`<button class="btn pri big" onClick=${() => { pjAdvance("find", "You're ready to shop. Homes inside your budget are marked."); go("portal/find"); }}>I'm ready: start finding homes →</button>` : ""}
    </div></div></${PortalFrame}>`;
}

// ---------- find & saved ----------
function PortalFind() {
  const p = pj(), lim = p.preapproved ? 1200000 : buyAbility(p.budget).price;
  const [beds, setBeds] = useState(3);
  const list = S.d.listings.filter(l => l.beds >= beds && l.status !== "Under contract" && l.status !== "Sold" && !(p.hidden || []).includes(l.id));
  const ss = (S.d.savedSearches || []).find(x => x.pid === "P4" && x.f && x.f.beds === beds && !x.f.q && x.f.max === lim);
  function saveSearch() {
    if (ss) return toast("You already saved this search", ["See it", () => go("portal/saved")]);
    up(s => { s.d.savedSearches = s.d.savedSearches || []; s.d.savedSearches.push({ id: "SS" + (s.d.savedSearches.length + 1), pid: "P4", name: beds + "+ beds up to " + short(lim), f: { q: "", min: 0, max: lim, beds, baths: 0, type: "Any", area: "Any", status: "sale", sort: "new" }, freq: "Instantly", ch: ["Text"], matches: list.filter(l => l.price <= lim).length, at: "Oct 8" }); p.feed.unshift(["Just now", "Saved search: " + beds + "+ beds up to " + short(lim)]); });
    logToAgent("Saved a search: " + beds + "+ beds up to " + short(lim) + ".");
    toast("Search saved · new matches by text the same day", ["See saved searches", () => go("portal/saved")]);
  }
  return html`<${PortalFrame} tab="find">
    <div class="row" style="gap:8px;flex-wrap:wrap;margin-bottom:14px"><b style="font-size:16px;margin-right:6px">Homes for you in Austin</b>${[2, 3, 4].map(b => html`<button class=${"chip" + (beds === b ? " on" : "")} onClick=${() => setBeds(b)}>${b}+ beds</button>`)}<span class="pill f">Within budget: up to ${short(lim)}</span><span style="flex:1"></span><button class="btn sm" onClick=${saveSearch}>${ss ? "✓ Search saved" : "Save this search"}</button></div>
    ${!list.length ? html`<div class="empty card" style="padding:40px">No homes with ${beds}+ beds right now. Try fewer bedrooms, or save this search and Sam will text you new matches.<div style="margin-top:12px"><button class="btn" onClick=${() => setBeds(2)}>Show 2+ beds</button></div></div>` : ""}
    <div class="lcards pt-cards">${list.map(l => { const sv = p.saved[l.id], m = monthly(l.price, 20, 6.4, l.tax, l.hoa); return html`<div class="lc">
      <div class="im" style=${"background-image:url(" + img(l.img) + ")"}><span class="tg">${l.price <= lim ? "Within budget" : "Over budget"}</span>
        <button class=${"heart" + (sv ? " on" : "")} aria-label="Save" onClick=${() => { up(() => { if (sv) delete p.saved[l.id]; else p.saved[l.id] = { by: "Elena", react: "", note: "" }; }); toast(sv ? "Removed from your board" : "Saved to your shared board with Marco", sv ? null : ["View saved", () => go("portal/saved")]); }}>♥</button></div>
      <div class="bd"><div class="pr num">${usd(l.price)}</div><div class="sp2"><b>${l.beds}</b> bd · <b>${l.baths}</b> ba · <b>${l.sqft.toLocaleString()}</b> sqft</div><div class="ad">${l.addr}, ${l.area}</div><div class="mo">Est. ${usd(m.total)}/mo</div>
        <div class="row" style="margin-top:8px;gap:6px"><button class="btn sm" onClick=${() => go("site/home/" + l.id)}>Details</button><button class="btn sm pri" onClick=${() => bookTour(l.id)}>Tour</button></div></div></div>`; })}</div>
  </${PortalFrame}>`;
}
function PortalSaved() {
  const p = pj(), ids = Object.keys(p.saved);
  const cmp = p.compare.filter(id => ids.includes(id)).map(L);
  const toggleCmp = (id) => up(() => { const i = p.compare.indexOf(id); i >= 0 ? p.compare.splice(i, 1) : p.compare.length < 4 && p.compare.push(id); });
  const react = (id, r) => { up(() => { p.saved[id].react = p.saved[id].react === r ? "" : r; }); if (r === "pass" && p.saved[id].react === "pass") toast("Marked as a pass", ["Hide it", () => up(() => { delete p.saved[id]; p.hidden = [...(p.hidden || []), id]; })]); };
  const searches = (S.d.savedSearches || []).filter(x => x.pid === "P4");
  const rows = [["Price", l => usd(l.price)], ["Monthly (est.)", l => usd(monthly(l.price, 20, 6.4, l.tax, l.hoa).total)], ["Beds / baths", l => l.beds + " / " + l.baths], ["Size", l => l.sqft.toLocaleString() + " sqft"], ["Price per sqft", l => usd(l.price / l.sqft)], ["Lot", l => l.lot], ["Built", l => l.year], ["HOA", l => l.hoa ? "$" + l.hoa + "/mo" : "None"], ["Days on market", l => l.dom], ["Commute to downtown", l => ({ L1: "14 min", L2: "12 min", L3: "4 min", L4: "9 min", L5: "22 min", L6: "11 min", L8: "28 min" }[l.id] || "—")], ["Elementary school", l => ({ L1: "Casis · 9/10", L2: "Barton Hills · 8/10", L4: "Zilker · 8/10", L5: "Forest Trail · 10/10", L6: "Govalle · 6/10", L8: "Bee Cave · 9/10", L3: "Mathews · 8/10" }[l.id] || "—")]];
  return html`<${PortalFrame} tab="saved">
    <div class="row" style="gap:8px;margin-bottom:14px"><button class=${"chip" + (p.board === "shared" ? " on" : "")} onClick=${() => up(() => { p.board = "shared"; })}>Shared with Marco & Sam · ${ids.length}</button><button class=${"chip" + (p.board === "hidden" ? " on" : "")} onClick=${() => up(() => { p.board = "hidden"; })}>Hidden · ${(p.hidden || []).length}</button><span style="flex:1"></span><span class="muted" style="font-size:12.5px">Pick up to 4 to compare</span></div>
    ${p.board === "hidden" ? ((p.hidden || []).length ? html`<div class="sv-list">${p.hidden.map(id => { const l = L(id); return html`<div class="sv"><img src=${img(l.img)} alt="" /><div class="sv-b"><b class="num">${usd(l.price)}</b><div class="muted" style="font-size:12.5px">${l.addr} · ${l.beds} bd · ${l.baths} ba</div><div class="muted" style="font-size:12px">Hidden · Sam won't suggest homes like this</div><div class="row" style="margin-top:6px"><button class="btn sm" onClick=${() => { up(() => { p.hidden = p.hidden.filter(x => x !== id); }); toast("Unhidden · " + l.addr + " is back in your search"); }}>Unhide</button></div></div></div>`; })}</div>` : html`<div class="empty card">Nothing hidden. Tap “Pass” on a saved home to hide it from your search.</div>`) : !ids.length ? html`<div class="empty card" style="padding:40px">No saved homes yet. Tap ♥ on any home, here or on harborandvine.com, and it shows up for you, Marco and Sam.<div class="row" style="gap:8px;justify-content:center;margin-top:12px"><button class="btn pri" onClick=${() => go("portal/find")}>Find homes</button><button class="btn" onClick=${() => go("site/buy")}>Search the website</button></div></div>` : html`
    <div class="sv-list">${ids.map(id => { const l = L(id), s = p.saved[id]; return html`<div class="sv">
      <img src=${img(l.img)} alt="" /><div class="sv-b"><div class="row" style="justify-content:space-between"><b class="num">${usd(l.price)}</b><label class="row" style="gap:6px;font-size:12.5px"><input type="checkbox" checked=${p.compare.includes(id)} onChange=${() => toggleCmp(id)} />Compare</label></div>
        <div class="muted" style="font-size:12.5px">${l.addr} · ${l.beds} bd · ${l.baths} ba</div>
        <div class="row" style="gap:6px;margin-top:6px">${[["love", "♥ Love"], ["maybe", "Maybe"], ["pass", "Pass"]].map(([k, t]) => html`<button class=${"rx" + (s.react === k ? " on " + k : "")} onClick=${() => react(id, k)}>${t}</button>`)}<span class="muted" style="font-size:11.5px;margin-left:auto">Saved by ${s.by}</span></div>
        <input class="sv-note" placeholder="Add a note for Marco and Sam" value=${s.note} onInput=${e => { s.note = e.target.value; }} /></div></div>`; })}</div>
    ${cmp.length >= 2 ? html`<div class="card" style="margin-top:18px;overflow-x:auto"><table class="t cmp"><thead><tr><th></th>${cmp.map(l => html`<th><img src=${img(l.img)} alt="" /><div>${l.addr}</div></th>`)}</tr></thead><tbody>${rows.map(([k, f]) => html`<tr><td class="muted">${k}</td>${cmp.map(l => html`<td class="num">${f(l)}</td>`)}</tr>`)}</tbody></table></div>` : ids.length ? html`<div class="muted" style="margin-top:14px;font-size:12.5px">Tick “Compare” on 2 or more homes to see them side by side.</div>` : ""}`}
    <div class="card" style="margin-top:18px"><div class="hd"><h3>Saved searches</h3><span class="sp"></span><span class="muted" style="font-size:12px">Shared with harborandvine.com</span></div>
      ${searches.length ? searches.map(x => html`<div class="it row" style="padding:10px 16px;border-top:1px solid #ECEAE4;gap:10px;flex-wrap:wrap"><div style="flex:1;min-width:180px"><b>${x.name}</b><div class="muted" style="font-size:12px">${x.freq} · ${(x.ch || ["Email"]).join(" & ")} · saved ${x.at}</div></div><button class="btn sm" onClick=${() => { if (typeof sx === "function") { const st = sx(); st.f = { ...st.f, ...x.f }; } go("site/buy"); }}>See matches</button><button class="btn sm ghost" onClick=${() => { up(s => { s.d.savedSearches = s.d.savedSearches.filter(y => y !== x); }); toast("Saved search deleted"); }}>Delete</button></div>`)
        : html`<div class="empty" style="padding:16px">No saved searches yet. Save one from Find homes or the website and new matches arrive the same day.</div>`}</div>
  </${PortalFrame}>`;
}

// ---------- tours ----------
function bookTour(lid) {
  const p = pj();
  if (!p.agreement) { toast("Sign your buyer agreement first: it takes a minute", ["Sign it", () => go("portal/budget")]); return; }
  up(s => { s.modal = { kind: "ptour", lid }; });
}
function PTourModal({ m, close }) {
  const l = L(m.lid), re = m.idx != null ? pj().tours[m.idx] : null, [day, setDay] = useState(1), [slot, setSlot] = useState("1:00 pm"), [mode, setMode] = useState(re ? re.mode : "In person");
  useEffect(() => { const k = e => { if (e.key === "Escape") close(); }; addEventListener("keydown", k); return () => removeEventListener("keydown", k); }, []);
  const days = [["Fri", 9], ["Sat", 10], ["Sun", 11], ["Mon", 12]];
  function book() {
    const when = days[day][0] + " " + days[day][1] + " Oct, " + slot;
    if (re) { up(s => { const old = re.when; re.when = when; re.mode = mode; pj().feed.unshift(["Just now", "Tour moved: " + l.addr + " · " + when]); s.modal = null; logToAgent("Rescheduled the tour of " + l.addr + " from " + old + " to " + when + "."); }); toast("Tour moved to " + when + " · Sam is notified"); return; }
    up(s => { const p = pj(); p.tours.push({ l: l.id, when, mode }); p.feed.unshift(["Just now", "Tour booked: " + l.addr + " · " + when]); if (p.stage < 2) p.stage = 2; s.modal = null; const d = pjDeal(); if (d) d.stage = "Touring"; });
    logToAgent("Booked a tour of " + l.addr + " · " + when + " (" + mode + ")");
    toast("Tour booked · it's on Sam's calendar and yours", ["See my tours", () => go("portal/tours")]);
  }
  return html`<div class="scrim" onClick=${e => { if (e.target.classList.contains("scrim")) close(); }}><div class="modal" role="dialog" aria-modal="true"><div class="hd"><h3>${re ? "Reschedule" : "Tour"} ${l.addr}</h3><button class="btn sm ghost" aria-label="Close" title="Close (Esc)" onClick=${close}>✕</button></div>
    <div class="bd"><div class="seg">${["In person", "Video chat"].map(x => html`<button class=${mode === x ? "on" : ""} onClick=${() => setMode(x)}>${x}</button>`)}</div>
      <div class="days">${days.map(([d, n], i) => html`<button class=${day === i ? "on" : ""} onClick=${() => setDay(i)}>${d}<b>${n}</b>Oct</button>`)}</div>
      <div class="slots">${["10:30 am", "1:00 pm", "3:30 pm", "5:00 pm"].map(x => html`<button class=${slot === x ? "on" : ""} onClick=${() => setSlot(x)}>${x}</button>`)}</div>
      <div class="muted" style="font-size:12.5px">Free · cancel or reschedule any time · Sam meets you there</div></div>
    <div class="ft"><button class="btn" onClick=${close}>Cancel</button><button class="btn pri" onClick=${book}>${re ? "Move tour" : "Book tour"}</button></div></div></div>`;
}
function PortalTours() {
  const p = pj();
  return html`<${PortalFrame} tab="tours"><div class="pt-cols">
    <div class="card"><div class="hd"><h3>Your tours</h3><span class="sp"></span><button class="btn sm pri" onClick=${() => bookTour("L1")}>+ Book a tour</button></div>
      ${p.tours.length ? p.tours.map((t, i) => { const l = L(t.l); return html`<div class="tour"><img src=${img(l.img)} alt="" /><div style="flex:1"><div class="row" style="gap:8px;flex-wrap:wrap"><b>${l.addr}</b>${t.src === "site" && !t.done ? html`<span class="pill a">Requested on the website</span>` : ""}</div><div class="muted" style="font-size:12.5px">${t.when} · ${t.mode} · with Sam</div>
          ${t.done ? html`<div class="row" style="gap:4px;margin-top:6px">${[1, 2, 3, 4, 5].map(n => html`<button class=${"star" + (n <= (t.rating || 0) ? " on" : "")} onClick=${() => up(() => { t.rating = n; })}>★</button>`)}</div><input class="sv-note" placeholder="Notes for Marco and Sam" value=${t.note || ""} onInput=${e => { t.note = e.target.value; }} />`
            : html`<div class="row" style="gap:6px;margin-top:8px"><button class="btn sm" onClick=${() => up(() => { t.done = true; })}>Mark toured</button><button class="btn sm ghost" onClick=${() => up(s => { s.modal = { kind: "ptour", lid: t.l, idx: i }; })}>Reschedule</button><button class="btn sm ghost" onClick=${() => { up(() => { p.tours.splice(i, 1); p.feed.unshift(["Just now", "Cancelled the tour of " + l.addr]); }); logToAgent("Cancelled the tour of " + l.addr + " (" + t.when + ")."); toast("Tour cancelled · Sam is notified", ["Book another", () => bookTour(t.l)]); }}>Cancel</button></div>`}</div></div>`; })
        : html`<div class="empty">No tours yet. Book one from any home you like.<div style="margin-top:10px"><button class="btn sm" onClick=${() => go("portal/find")}>Find homes</button></div></div>`}
    </div>
    <div class="card"><div class="hd"><h3>Before you go</h3></div><div class="bd" style="display:flex;flex-direction:column;gap:8px;font-size:13px">
      ${["Bring your pre-approval letter (it's in your documents)", "Check the drive at rush hour: Sam sends live commute times", "Ask about the roof, HVAC age and utility bills", "Rate each home right after: your notes go to Sam and Marco"].map(t => html`<div class="row" style="align-items:flex-start"><span class="dot"></span><span>${t}</span></div>`)}
      ${p.tours.some(t => t.done) && p.stage < 3 ? html`<button class="btn pri" style="margin-top:8px" onClick=${() => { pjAdvance("offer", "Ready to make an offer on 4 Willow Bend"); go("portal/offer"); }}>I want to make an offer →</button>` : ""}
    </div></div></div></${PortalFrame}>`;
}

// ---------- offer ----------
function PortalOffer() {
  const p = pj(), l = L("L1");
  const [step, setStep] = useState(p.offer ? 3 : 0);
  const [o, setO] = useState(p.offer || { price: 1135000, emd: 1, down: 20, fin: "Conventional", option: 7, close: "Nov 14", conc: 0, cont: { inspection: true, appraisal: true, financing: true, sale: false }, esc: false, escMax: 1160000 });
  const [signed, setSigned] = useState(false);
  const set = (k, v) => setO({ ...o, [k]: v });
  const emd = o.price * o.emd / 100, down = o.price * o.down / 100, cc = o.price * 0.021;
  const oErr = {
    down: o.fin === "Cash" ? (o.down !== 100 ? "Cash offers are 100% down" : "") : !(o.down >= (o.fin === "FHA" ? 3.5 : o.fin === "VA" ? 0 : 3) && o.down <= 100) ? "Enter " + (o.fin === "FHA" ? "3.5" : o.fin === "VA" ? "0" : "3") + "–100%" : "",
    emd: !(o.emd >= 0.5 && o.emd <= 10) ? "Usually 0.5–10% of the price" : "",
    option: !(o.option >= 0 && o.option <= 21 && Number.isInteger(+o.option)) ? "Whole days, 0–21" : "",
    conc: !(o.conc >= 0 && o.conc <= o.price * 0.06) ? "Between $0 and 6% of the price" : "",
  };
  const bad = step === 1 && Object.values(oErr).some(Boolean);
  const E = (k) => oErr[k] ? html`<em style="color:var(--red);font-size:12px;font-style:normal">${oErr[k]}</em>` : "";
  const comps = [["1702 Hartford Rd", 1162000, "Sold Sep 12", 2410], ["3 Pecos Bend", 1118000, "Sold Aug 30", 2290], ["21 Bowman Ave", 1145000, "Pending", 2350]];
  function submit() {
    up(s => { p.offer = o; p.feed.unshift(["Just now", "Offer sent: " + usd(o.price) + " on 4 Willow Bend"]); const d = pjDeal(); if (d) { d.stage = "Offer"; d.price = o.price; }
      s.d.offers = s.d.offers || []; s.d.offers.push({ l: "L1", buyer: "Elena & Marco Ruiz", agent: "Sam Carter (Harbor & Vine)", price: o.price, fin: o.fin + " · " + o.down + "% down", emd, close: o.close, cont: Object.entries(o.cont).filter(x => x[1]).map(x => x[0]).join(", "), conc: o.conc, esc: o.esc ? usd(o.escMax) : "—", pre: "Pre-approved $1.2M" }); });
    logToAgent("Signed and sent an offer: " + usd(o.price) + ", " + o.fin + ", close " + o.close + ".");
    const la = l.agent;
    if (window.notify) { notify({ who: "seller", text: "New offer from Elena & Marco Ruiz on " + l.addr + ": " + usd(o.price) + " · compare it with the others", route: "seller/offers", at: Date.now() });
      notify({ who: la, text: "New offer on " + l.addr + ": Elena & Marco Ruiz at " + usd(o.price) + " (" + o.fin + ")", route: "deal/D2", at: Date.now() });
      notify({ who: "sam", text: "Elena signed her offer on " + l.addr + ": " + usd(o.price), route: "deal/" + ((pjDeal() || {}).id || ""), at: Date.now() }); }
    toast("Offer signed and sent to the listing agent · you'll be notified when the sellers respond");
  }
  if (p.offer) return html`<${PortalFrame} tab="offer"><div class="pt-cols">
    <div class="card"><div class="hd"><h3>Your offer on ${l.addr}</h3><span class="sp"></span>${p.accepted ? html`<span class="pill g">Accepted</span>` : p.counter ? html`<span class="pill a">Countered</span>` : html`<span class="pill b">Sent · waiting</span>`}</div><div class="bd">
      <div class="negs">${[["You offered", usd(p.offer.price), "Oct 9"], p.counter && !p.counter.direct && ["Sellers countered", usd(p.counter.price), "Oct 10"], p.accepted && [p.counter && p.counter.direct ? "Sellers accepted" : "You accepted", usd(p.counter.price), "Oct 10"]].filter(Boolean).map(([a, b, c], i) => html`<div class=${"ng" + (i % 2 ? " them" : "")}><span class="muted" style="font-size:12px">${c}</span><b>${a}</b><span class="num">${b}</span></div>`)}</div>
      ${p.counter && !p.accepted ? html`<div class="ai" style="margin-top:14px"><div class="lbl">Counteroffer</div><p style="margin:6px 0 10px">${p.counter.note}</p><div class="muted" style="font-size:12.5px;margin-bottom:10px">Sam's take: that's ${usd(p.counter.price - p.offer.price)} more, about ${usd(Math.round(monthly(p.counter.price - p.offer.price) || (p.counter.price - p.offer.price) * 0.0057))}/month. ${p.counter.option ? "The " + p.counter.option + "-day option period is normal here." : ""}</div>
        <div class="row"><button class="btn pri" onClick=${() => { const cp = p.counter.price, viaSeller = !!(window.SlApi && SlApi.buyerAccepts && SlApi.buyerAccepts(cp)); up(s => { p.accepted = true; p.stage = Math.max(p.stage, 4); p.loan = Math.max(p.loan || 0, 2); p.feed.unshift(["Just now", "You're under contract on 4 Willow Bend!"]); const d = pjDeal(); if (d) { d.stage = "Under contract"; d.price = cp; d.close = p.counter.close || "Nov 14"; d.progress = .3; } if (!viaSeller) { const dl = s.d.deals.find(x => x.id === "D2"); if (dl) { dl.stage = "Under contract"; dl.price = cp; } } }); logToAgent("Accepted the counter at " + usd(cp) + ". Under contract!"); toast("Under contract! Your closing plan is ready", ["Open my purchase", () => go("portal/deal")]); }}>Accept ${usd(p.counter.price)}</button><button class="btn" onClick=${() => up(() => { p.counterDraft = p.counterDraft || 1138000; })}>Counter</button><button class="btn ghost" onClick=${() => { logToAgent("Not sure about the counter at " + usd(p.counter.price) + ". Can we talk before we respond?"); toast("Sam will call you before anything is sent", ["Message Sam", () => go("portal/messages")]); }}>Decline</button></div>
        ${p.counterDraft && !p.counterSent ? html`<div class="row" style="gap:8px;margin-top:12px;flex-wrap:wrap;align-items:flex-end"><label class="field" style="flex:1;min-width:180px"><span>Your counter · ${usd(p.counterDraft)}</span><input type="range" min=${p.offer.price} max=${p.counter.price} step="1000" value=${p.counterDraft} onInput=${e => up(() => { p.counterDraft = +e.target.value; })} /></label><button class="btn pri" onClick=${() => { up(() => { p.counterSent = p.counterDraft; p.feed.unshift(["Just now", "You countered at " + usd(p.counterDraft)]); }); logToAgent("Please counter at " + usd(p.counterDraft) + ", other terms as the sellers proposed."); toast("Counter sent to Sam to review and send", ["Message Sam", () => go("portal/messages")]); }}>Send counter to Sam</button></div>` : ""}
        ${p.counterSent ? html`<div class="muted" style="margin-top:10px;font-size:12.5px">You asked Sam to counter at ${usd(p.counterSent)}. The sellers' ${usd(p.counter.price)} is still open until Sam sends it.</div>` : ""}</div>` : ""}
      ${!p.counter ? html`<div class="muted" style="margin-top:12px">The listing agent has your offer. Offers are reviewed Friday at 5 pm.</div>` : ""}
      ${p.accepted ? html`<button class="btn pri" style="margin-top:14px" onClick=${() => go("portal/deal")}>Open my purchase →</button>` : ""}
    </div></div>
    <div class="card"><div class="hd"><h3>Terms</h3></div><div class="bd sheet">${[["Price", usd(p.counter && p.accepted ? p.counter.price : p.offer.price)], ["Financing", p.offer.fin + " · " + p.offer.down + "% down"], ["Earnest money", usd(p.offer.price * p.offer.emd / 100)], ["Option period", ((p.counter && p.counter.option) || p.offer.option) + " days"], ["Closing", p.offer.close], ["Contingencies", Object.entries(p.offer.cont).filter(x => x[1]).map(x => x[0]).join(", ")], ["Seller concessions", usd(p.offer.conc)]].map(([a, b]) => html`<div class="ln"><span>${a}</span><span>${b}</span></div>`)}</div></div>
  </div></${PortalFrame}>`;
  const steps = ["Price", "Terms", "Review & sign"];
  return html`<${PortalFrame} tab="offer"><div class="pt-cols">
    <div class="card"><div class="hd"><h3>Offer on ${l.addr}</h3><span class="sp"></span><span class="muted">List price ${usd(l.price)}</span></div><div class="bd">
      <div class="stepper">${steps.map((s, i) => html`<div class=${"st" + (i < step ? " done" : i === step ? " now" : "")}><i>${i < step ? "✓" : i + 1}</i>${s}</div>`)}</div>
      ${step === 0 && html`<div style="display:flex;flex-direction:column;gap:12px">
        <label class="field"><span>Your offer · ${usd(o.price)} (${((o.price / l.price - 1) * 100).toFixed(1)}% vs list)</span><input type="range" min="1080000" max="1200000" step="1000" value=${o.price} onInput=${e => set("price", +e.target.value)} /></label>
        <div class="lbl">Recent sales nearby</div>
        ${comps.map(([a, pr, s, sq]) => html`<div class="row" style="justify-content:space-between;font-size:13px;padding:4px 0;border-bottom:1px dashed var(--line)"><span>${a}</span><span class="muted">${s} · ${sq} sqft</span><b class="num">${usd(pr)}</b></div>`)}
        <div class="ai"><div class="lbl">Sam's suggestion</div><div style="margin-top:4px">Homes like this sold for $1.12M–$1.16M; 2 other offers are expected. Strongest range: <b>$1,135k–$1,150k</b>, or add an escalation clause.</div></div></div>`}
      ${step === 1 && html`<div style="display:flex;flex-direction:column;gap:12px">
        <div class="row"><label class="field" style="flex:1"><span>Financing</span><select onChange=${e => set("fin", e.target.value)}>${["Conventional", "FHA", "VA", "Cash"].map(x => html`<option value=${x} selected=${o.fin === x}>${x}</option>`)}</select></label><label class="field" style="flex:1"><span>Down payment %</span><input type="number" value=${o.down} onInput=${e => set("down", +e.target.value)} />${E("down")}</label></div>
        <div class="row"><label class="field" style="flex:1"><span>Earnest money %</span><input type="number" step="0.5" value=${o.emd} onInput=${e => set("emd", +e.target.value)} />${E("emd")}</label><label class="field" style="flex:1"><span>Option period (days)</span><input type="number" value=${o.option} onInput=${e => set("option", +e.target.value)} />${E("option")}</label><label class="field" style="flex:1"><span>Closing date</span><select onChange=${e => set("close", e.target.value)}>${["Nov 7", "Nov 14", "Nov 21"].map(x => html`<option value=${x} selected=${o.close === x}>${x}</option>`)}</select></label></div>
        <div class="lbl">Contingencies</div>
        <div class="row" style="flex-wrap:wrap;gap:6px">${[["inspection", "Inspection"], ["appraisal", "Appraisal"], ["financing", "Financing"], ["sale", "Sale of my home"]].map(([k, t]) => html`<button class=${"chip" + (o.cont[k] ? " on" : "")} onClick=${() => set("cont", { ...o.cont, [k]: !o.cont[k] })}>${o.cont[k] ? "✓ " : ""}${t}</button>`)}</div>
        <div class="row"><label class="field" style="flex:1"><span>Ask the seller to pay (closing costs)</span><input type="number" step="1000" value=${o.conc} onInput=${e => set("conc", +e.target.value)} />${E("conc")}</label>
          <label class="field" style="flex:1"><span>Escalation clause</span><select value=${o.esc ? "yes" : "no"} onChange=${e => set("esc", e.target.value === "yes")}><option value="no">No</option><option value="yes">Yes: beat other offers by $2,500 up to ${usd(o.escMax)}</option></select></label></div></div>`}
      ${step === 2 && html`<div style="display:flex;flex-direction:column;gap:12px">
        <div class="sheet">${[["Offer price", usd(o.price)], ["Down payment (" + o.down + "%)", usd(down)], ["Loan amount", usd(o.price - down)], ["Est. closing costs", usd(cc)], ["Seller pays toward costs", "−" + usd(o.conc)]].map(([a, b]) => html`<div class="ln"><span>${a}</span><span>${b}</span></div>`)}<div class="ln tot"><span>Cash to close (est.)</span><span>${usd(down + cc - o.conc)}</span></div></div>
        <div class="muted" style="font-size:12.5px">Earnest money of ${usd(emd)} is due within 3 days of acceptance, wired to Lone Star Title. It counts toward your cash to close.</div>
        <div class="sig">${signed ? html`<span class="ink">Elena Ruiz</span>` : html`<span class="muted">Elena Ruiz · Marco signs by text</span>`}<button class="btn sm brass" onClick=${() => setSigned(true)}>${signed ? "Signed ✓" : "Sign offer"}</button></div></div>`}
      <div class="row" style="margin-top:16px;justify-content:space-between"><button class="btn" disabled=${step === 0} onClick=${() => setStep(step - 1)}>Back</button>${step < 2 ? html`<button class="btn pri" disabled=${bad} title=${bad ? "Fix the highlighted terms first" : ""} onClick=${() => setStep(step + 1)}>Continue</button>` : html`<button class="btn pri" disabled=${!signed} onClick=${submit}>Send offer</button>`}</div>
    </div></div>
    <div class="card" style="overflow:hidden;align-self:start"><img src=${img(l.img)} alt="" style="width:100%;aspect-ratio:3/2;object-fit:cover;display:block" /><div class="bd"><b>${l.addr}</b><div class="muted">${l.beds} bd · ${l.baths} ba · ${l.sqft.toLocaleString()} sqft · listed by Priya Shah</div><div class="muted" style="font-size:12.5px;margin-top:6px">Offers due Fri, Oct 10, 5 pm · 2 other offers expected</div></div></div>
  </div></${PortalFrame}>`;
}

// ---------- under contract → closing ----------
function pjTasks() {
  const p = pj();
  return [
    { t: "Wire earnest money (" + usd(pjEmd()) + ")", who: "You", due: "Oct 13", done: p.wired, act: "wire" },
    { t: "Book the home inspection", who: "You", due: "Oct 13", done: p.stage >= 5 || p.inspection.booked, act: "inspect" },
    { t: "Send repair requests", who: "You", due: "Oct 15", done: p.inspection.requested.length > 0, act: "repairs" },
    { t: "Upload homeowners insurance binder", who: "You", due: "Oct 20", done: p.stage >= 5 || !!p.ins, act: "ins" },
    { t: "Review HOA and seller disclosures", who: "You", due: "Oct 15", done: p.stage >= 5 || !!p.disc, act: "disc" },
    { t: "Order appraisal", who: "Lender", due: "Oct 16", done: p.loan >= 3 },
    { t: "Title commitment", who: "Title", due: "Oct 22", done: p.stage >= 5 },
    { t: "Repair amendment signed", who: "Agent", due: "Oct 16", done: p.inspection.requested.length > 0 && p.stage >= 5 },
    { t: "Clear to close", who: "Lender", due: "Nov 10", done: p.loan >= 5 },
    { t: "Closing disclosure delivered", who: "Lender", due: "Nov 11", done: p.stage >= 5 },
    { t: "Final walkthrough", who: "You", due: "Nov 13", done: p.walkthrough },
  ];
}
function PortalDeal() {
  const p = pj();
  const [tab, setTab] = useState(p.stage >= 5 ? "closing" : "plan");
  if (p.stage < 4) return html`<${PortalFrame} tab="deal"><div class="empty" style="padding:60px">Once your offer is accepted, your whole closing plan appears here: dates, tasks for everyone, documents, your loan and the money.<div style="margin-top:14px"><button class="btn pri" onClick=${() => go("portal/offer")}>Go to my offer</button></div></div></${PortalFrame}>`;
  const ms = [["Under contract", "Oct 10", true], ["Option period ends", "Oct 15", p.inspection.requested.length > 0 || p.stage >= 5], ["Appraisal", "Oct 16", p.loan >= 3], ["Loan approval", "Oct 30", p.loan >= 4], ["Clear to close", "Nov 10", p.loan >= 5], ["Closing", "Nov 14", p.stage >= 6]];
  const tasks = pjTasks(), loanSteps = ["Application", "Processing", "Appraisal", "Underwriting", "Clear to close"];
  const act = (a) => {
    if (a === "wire") return setTab("money");
    if (a === "inspect") { up(() => { p.inspection.booked = true; }); toast("Inspection booked with Lone Star Inspections · Mon Oct 12, 9 am"); return; }
    if (a === "repairs") return setTab("inspection");
    if (a === "ins") { up(() => { p.ins = true; }); toast("Insurance binder uploaded · shared with your lender and title"); return; }
    if (a === "disc") { up(() => { p.disc = true; }); toast("Marked as reviewed · Sam has a copy of your questions"); }
  };
  return html`<${PortalFrame} tab="deal">
    <div class="pt-dealhd"><img src=${img("h-lakeway")} alt="" /><div><div class="lbl">My purchase</div><h2>4 Willow Bend</h2><div class="muted">${usd(pjPrice())} · closing Fri, Nov 14 at Lone Star Title</div></div><span class="sp" style="flex:1"></span><div style="text-align:right"><div class="lbl">Days to closing</div><b style="font:500 32px var(--f-display)">${p.stage >= 6 ? "Closed" : p.stage >= 5 ? "4" : "35"}</b></div></div>
    <div class="ms">${ms.map(([t, d, ok], i) => html`<div class=${"m" + (ok ? " ok" : ms.findIndex(x => !x[2]) === i ? " now" : "")}><i>${ok ? "✓" : ""}</i><b>${t}</b><span>${d}</span></div>`)}</div>
    <div class="tabs" style="margin:18px 0 16px">${[["plan", "Tasks"], ["inspection", "Inspection"], ["money", "Money & loan"], ["docs", "Documents"], ["closing", "Closing day"]].map(([k, v]) => html`<button class=${tab === k ? "on" : ""} onClick=${() => setTab(k)}>${v}</button>`)}</div>
    ${tab === "plan" && html`<div class="card"><table class="t"><thead><tr><th>Task</th><th>Who</th><th>Due</th><th></th></tr></thead><tbody>${tasks.map(t => html`<tr><td>${t.done ? html`<span class="muted" style="text-decoration:line-through">${t.t}</span>` : html`<b>${t.t}</b>`}</td><td><span class=${"pill" + (t.who === "You" ? " f" : "")}>${t.who}</span></td><td class="muted num">${t.due}</td><td style="text-align:right">${t.done ? html`<span class="pill g">Done</span>` : t.act ? html`<button class="btn sm pri" onClick=${() => act(t.act)}>Do it</button>` : html`<span class="muted" style="font-size:12px">In progress</span>`}</td></tr>`)}</tbody></table></div>`}
    ${tab === "inspection" && html`<${Inspection} />`}
    ${tab === "money" && html`<div class="pt-cols">
      <div class="card"><div class="hd"><h3>Earnest money · ${usd(pjEmd())}</h3><span class="sp"></span>${p.wired ? html`<span class="pill g">Received by title</span>` : ""}</div><div class="bd" style="display:flex;flex-direction:column;gap:10px;font-size:13px">
        <div class="warn"><b>Wire fraud check.</b> We'll never email or text you changes to wiring instructions. Call Lone Star Title on the number below, which we verified, before you send money.</div>
        <div class="row" style="justify-content:space-between"><span class="muted">Title company</span><b>Lone Star Title · (512) 555-0100 ✓ verified</b></div>
        <div class="row" style="justify-content:space-between"><span class="muted">Account</span><b>•••• 4471 · Frost Bank</b></div>
        ${!p.wireVerified ? html`<button class="btn" onClick=${() => up(() => { p.wireVerified = true; })}>I called and the details match</button>` : !p.wired ? html`<button class="btn pri" onClick=${() => { up(() => { p.wired = true; p.feed.unshift(["Just now", "Lone Star Title received your earnest money"]); try { const e = typeof txEmdFor === "function" && S.d.tx ? txEmdFor(pjDeal()) : null; if (e && e.status !== "Received") { e.status = "Received"; e.method = "Wire"; e.on = typeof TX_TODAY !== "undefined" ? TX_TODAY : "Oct 8"; e.note = "Wire from Elena Ruiz · Lone Star Title confirmed receipt"; e.amt = pjEmd(); } } catch (x) {} }); window.notify && notify({ who: "nina", text: usd(pjEmd()) + " earnest money received for 4 Willow Bend · Lone Star Title confirmed", route: "trust/emd", at: Date.now() }); toast("Wire sent · title confirms receipt in the app"); }}>I've sent the wire</button>` : html`<div class="steps2">${["You sent " + usd(pjEmd()), "Title received it", "Held in escrow until closing"].map(t => html`<div><i>✓</i>${t}</div>`)}</div>`}
      </div></div>
      <div class="card"><div class="hd"><h3>Your loan · Lone Star Lending</h3></div><div class="bd">
        <div class="loan">${loanSteps.map((s, i) => html`<div class=${i < p.loan ? "ok" : i === p.loan ? "now" : ""}><i>${i < p.loan ? "✓" : i + 1}</i>${s}</div>`)}</div>
        <div class="muted" style="font-size:12.5px;margin:10px 0">${p.loan < 5 ? "Kim needs: 1 updated bank statement." : "You're clear to close."}</div>
        ${p.loan < 5 ? html`<button class="btn sm" onClick=${() => up(() => { p.loan = Math.min(5, p.loan + 1); })}>Upload what Kim needs</button>` : ""}
        <div class="sheet" style="margin-top:12px">${[["Loan amount", usd(pjLoan())], ["Rate (locked to Nov 20)", "6.375%"], ["Monthly payment (P&I)", usd(5700)]].map(([a, b]) => html`<div class="ln"><span>${a}</span><span>${b}</span></div>`)}</div></div></div></div>`}
    ${tab === "docs" && html`<div class="card"><table class="t"><thead><tr><th>Document</th><th>From</th><th>Status</th></tr></thead><tbody>${[["Buyer representation agreement", "You", "Signed"], ["Purchase contract", "You & sellers", "Signed"], ["Seller's disclosure notice", "Sellers", p.disc || p.stage >= 5 ? "Reviewed" : "Please review"], ["HOA documents", "HOA", "No HOA"], ["Inspection report", "Inspector", p.inspection.booked || p.stage >= 5 ? "Received" : "Pending"], ["Homeowners insurance binder", "You", p.ins || p.stage >= 5 ? "Uploaded" : "Upload needed"], ["Appraisal", "Lender", p.loan >= 3 ? "Received · $1,150,000" : "Pending"], ["Closing disclosure", "Lender", p.stage >= 5 ? (p.cdReviewed ? "Reviewed" : "Please review") : "Coming Nov 11"]].map(([a, b, c]) => html`<tr><td>${a}</td><td class="muted">${b}</td><td><span class=${"pill " + (/Signed|Reviewed|Uploaded|Received/.test(c) ? "g" : /Please|needed/.test(c) ? "a" : "")}>${c}</span></td></tr>`)}</tbody></table></div>`}
    ${tab === "closing" && html`<${Closing} />`}
  </${PortalFrame}>`;
}
function Inspection() {
  const p = pj();
  const items = [["Roof flashing at chimney lifted", "Repair", 850], ["AC condenser 9 years old, working", "Note", 0], ["GFCI missing in 2 bathrooms", "Repair", 240], ["Minor drywall crack, hallway", "Cosmetic", 0], ["Water heater pan missing", "Repair", 180]];
  const [pick, setPick] = useState(p.inspection.requested.length ? p.inspection.requested : ["Roof flashing at chimney lifted", "GFCI missing in 2 bathrooms"]);
  const sent = p.inspection.requested.length > 0;
  return html`<div class="pt-cols"><div class="card"><div class="hd"><h3>Inspection report · Mon Oct 12</h3><span class="sp"></span><span class="pill">17 pages</span></div><div class="bd">
    ${items.map(([t, k, c]) => html`<label class="row" style="padding:8px 0;border-bottom:1px dashed var(--line);gap:10px"><input type="checkbox" disabled=${sent || k !== "Repair"} checked=${pick.includes(t)} onChange=${() => setPick(pick.includes(t) ? pick.filter(x => x !== t) : [...pick, t])} /><span style="flex:1">${t}</span><span class=${"pill " + (k === "Repair" ? "a" : "")}>${k}</span><span class="muted num" style="width:70px;text-align:right">${c ? usd(c) : ""}</span></label>`)}</div></div>
    <div class="card"><div class="hd"><h3>Ask the sellers</h3></div><div class="bd" style="display:flex;flex-direction:column;gap:10px;font-size:13px">
      <div>${pick.length} repairs selected · about ${usd(items.filter(i => pick.includes(i[0])).reduce((a, i) => a + i[2], 0))}</div>
      <div class="muted">Sam turns this into a repair amendment; you'll both sign on your phones. You can ask for a credit instead of repairs.</div>
      ${sent ? html`<span class="pill g" style="align-self:flex-start">Sent to the sellers · Oct 13</span>` : html`<button class="btn pri" onClick=${() => { up(() => { p.inspection.requested = pick; p.feed.unshift(["Just now", "Repair request sent to the sellers"]); }); logToAgent("Sent repair requests: " + pick.join("; ")); toast("Repair request sent · Sam drafts the amendment"); }}>Send repair request</button>`}</div></div></div>`;
}
function Closing() {
  const p = pj();
  if (p.stage < 5) return html`<div class="empty">Closing details appear once you're clear to close (Nov 10).<div style="margin-top:12px"><button class="btn" onClick=${() => pjJump(5)}>Demo: skip to closing week</button></div></div>`;
  const cd = [["Purchase price", pjPrice()], ["Loan amount", -pjLoan()], ["Earnest money already paid", -pjEmd()], ["Lender fees", 4210], ["Title & escrow", 6620], ["Prepaid taxes & insurance", 7480], ["Seller credit (repairs)", -1270]];
  const cash = cd.reduce((a, x) => a + x[1], 0);
  return html`<div class="pt-cols">
    <div class="card"><div class="hd"><h3>Closing disclosure</h3><span class="sp"></span>${p.cdReviewed ? html`<span class="pill g">Reviewed</span>` : html`<span class="pill a">Please review</span>`}</div><div class="bd sheet">
      ${cd.map(([a, b]) => html`<div class=${"ln" + (b < 0 ? " neg" : "")}><span>${a}</span><span>${b < 0 ? "−" : ""}${usd(Math.abs(b))}</span></div>`)}
      <div class="ln tot"><span>Cash to close</span><span>${usd(cash)}</span></div>
      <div class="muted" style="font-size:12px;margin:8px 0">$1,840 less than your offer estimate, thanks to the seller credit.</div>
      ${!p.cdReviewed ? html`<button class="btn pri" onClick=${() => up(() => { p.cdReviewed = true; })}>I've reviewed it</button>` : ""}</div></div>
    <div style="display:flex;flex-direction:column;gap:16px">
      <div class="card"><div class="hd"><h3>Closing day · Fri, Nov 14</h3></div><div class="bd" style="display:flex;flex-direction:column;gap:8px;font-size:13px">
        <div class="row"><span class="muted" style="width:90px">Where</span>Lone Star Title, 600 Congress Ave · 10:00 am</div>
        <div class="row"><span class="muted" style="width:90px">Bring</span>Photo ID for you and Marco</div>
        <button class=${"chk" + (p.walkthrough ? " ok" : "")} onClick=${() => up(() => { p.walkthrough = true; })}><i>${p.walkthrough ? "✓" : ""}</i><span>Final walkthrough done (Thu, Nov 13, 5 pm)</span></button>
        <button class=${"chk" + (p.signedClosing ? " ok" : "")} disabled=${!p.cdReviewed || !p.walkthrough} onClick=${() => { up(s => { p.signedClosing = true; p.stage = 6; p.feed.unshift(["Nov 14", "You got the keys to 4 Willow Bend!"]); const d = pjDeal(); if (d) { d.stage = "Closed"; d.close = "Nov 14"; d.progress = 1; } const ld = s.d.deals.find(x => x.kind === "Listing" && x.listing === "L1" && x.stage === "Under contract"); if (ld) { ld.stage = "Closed"; ld.close = "Nov 14"; ld.progress = 1; } const hl = L("L1"); if (hl) { hl.status = "Sold"; hl.tag = "Sold · " + usd(pjPrice()); } const pe = P("P4"); pe.stage = "Homeowner"; if (!pe.roles.includes("Homeowner")) pe.roles.push("Homeowner"); }); logToAgent("Closed on 4 Willow Bend. We have the keys!"); if (window.notify) { const n = (who, text, route) => notify({ who, text, route, at: Date.now() }); n("sam", "Closed: 4 Willow Bend · Elena & Marco Ruiz got the keys", "deal/" + ((pjDeal() || {}).id || "")); n("priya", "4 Willow Bend closed at " + usd(pjPrice()) + " · switch the MLS to Sold", "deal/D2"); n("seller", "Closed! 4 Willow Bend sold for " + usd(pjPrice()) + " · your proceeds are wired today", "seller/home"); n("grace", "4 Willow Bend closed and funded · release any held commissions", "commissions/disb"); } toast("Congratulations, you own 4 Willow Bend! 🔑", ["See my home", () => go("portal/myhome")]); }}><i>${p.signedClosing ? "✓" : ""}</i><span>Sign closing documents & get your keys</span></button></div></div>
      <div class="card"><div class="hd"><h3>Moving checklist</h3></div><div class="bd" style="font-size:13px;display:flex;flex-direction:column;gap:6px">${["Transfer electricity (Austin Energy)", "Set up water & trash", "Book internet install", "Forward your mail", "Change the locks"].map((t, i) => html`<div class=${"chk" + (i < 2 ? " ok" : "")}><i>${i < 2 ? "✓" : ""}</i><span>${t}</span></div>`)}</div></div>
    </div></div>`;
}

// ---------- own it ----------
function PortalMyHome() {
  const p = pj();
  if (p.stage < 6) return html`<${PortalFrame} tab="myhome"><div class="empty" style="padding:60px">After closing, this becomes your home's dashboard: its value, your equity, projects and documents, for as long as you own it.</div></${PortalFrame}>`;
  const bought = pjPrice(), val = Math.round(bought * 1.0403 / 1000) * 1000, owe = Math.round(pjLoan() * 0.9954), pts = [1, 1.007, 1.0139, 1.0184, 1.0254, 1.0333, 1.0403].map(f => bought * f / 1000);
  const [sell, setSell] = useState(val);
  return html`<${PortalFrame} tab="myhome"><div class="pt-cols">
    <div class="card"><div class="hd"><h3>4 Willow Bend · estimated value</h3></div><div class="bd">
      <b style="font:500 40px var(--f-display)" class="num">${usd(val)}</b><div class="muted">+${usd(val - bought)} since you bought · updated monthly</div>
      <svg viewBox="0 0 300 90" preserveAspectRatio="none" style="width:100%;height:110px;margin-top:10px">${(() => { const xs = pts.map((v, i) => [i * 50, 80 - (v - 1130) * 1.1]); return html`<path d=${"M" + xs.map(x => x.join(",")).join(" L")} fill="none" stroke="#2E6B52" stroke-width="2.5" /><path d=${"M" + xs.map(x => x.join(",")).join(" L") + " L300,90 L0,90Z"} fill="#2E6B52" opacity=".08" />`; })()}</svg>
      <div class="row muted" style="justify-content:space-between;font-size:11.5px"><span>Nov '26</span><span>May '27</span></div></div></div>
    <div style="display:flex;flex-direction:column;gap:16px">
      <div class="card"><div class="hd"><h3>Your equity</h3></div><div class="bd sheet">${[["Estimated value", usd(val)], ["Mortgage balance", "−" + usd(owe)]].map(([a, b]) => html`<div class="ln"><span>${a}</span><span>${b}</span></div>`)}<div class="ln tot"><span>Equity</span><span>${usd(val - owe)}</span></div></div></div>
      <div class="card"><div class="hd"><h3>If you sold</h3></div><div class="bd"><label class="field"><span>Sale price · ${usd(sell)}</span><input type="range" min=${Math.round(bought * 0.92 / 5000) * 5000} max=${Math.round(bought * 1.14 / 5000) * 5000} step="5000" value=${sell} onInput=${e => setSell(+e.target.value)} /></label><div class="sheet" style="margin-top:8px"><div class="ln tot"><span>You'd walk away with</span><span>${usd(sell - owe - sell * 0.07)}</span></div></div></div></div>
      <div class="ai"><div class="lbl">Sam</div><div style="margin:4px 0 8px">Rates dropped to 5.9%. Refinancing could save you about $310/month.</div><div class="row"><button class="btn sm pri" onClick=${() => { logToAgent("I'd like to check a refinance at 5.9%."); toast("Kim at Lone Star Lending will call you today"); }}>Check my refinance</button><button class="btn sm" onClick=${() => { try { navigator.clipboard && navigator.clipboard.writeText("https://harborandvine.com/r/elena").catch(() => {}); } catch (e) {} toast("Referral link copied · Sam thanks you!"); }}>Refer a friend</button></div></div>
    </div></div></${PortalFrame}>`;
}

// ---------- messages ----------
function PortalMessages() {
  const t = pjThread(), [d, setD] = useState("");
  const box = useRef();
  useEffect(() => { if (box.current) box.current.scrollTop = 9e9; });
  return html`<${PortalFrame} tab="messages"><div class="card pt-chat">
    <div class="hd"><h3>You, Marco, Sam, Kim (lender) and Lone Star Title</h3><span class="sp"></span><span class="muted" style="font-size:12px">Also on SMS and WhatsApp: every reply lands here</span></div>
    <div class="msgs" ref=${box}>${t.msgs.map(m => html`<div class=${"msg " + (m.from === "them" ? "me" : "ai")}>${m.text}<small>${m.from === "them" ? "You" : m.from === "ai" ? "Sam's assistant" : "Sam Carter"} · ${m.at}</small></div>`)}</div>
    <div class="composer"><textarea placeholder="Message your team…" value=${d} onInput=${e => setD(e.target.value)}></textarea><div class="row"><span style="flex:1"></span><button class="btn pri sm" disabled=${!d.trim()} onClick=${() => { logToAgent(d.trim()); setD(""); up(); setTimeout(() => up(() => { t.msgs.push({ from: "me", text: "Got it, Elena! I'll take care of it today.", at: "now", ch: "Portal" }); }), 1200); }}>Send</button></div></div>
  </div></${PortalFrame}>`;
}

function Portal() {
  pj();
  const v = { home: PortalHome, budget: PortalBudget, find: PortalFind, saved: PortalSaved, tours: PortalTours, offer: PortalOffer, deal: PortalDeal, myhome: PortalMyHome, messages: PortalMessages }[S.route.id || "home"] || PortalHome;
  return html`<${v} />`;
}

// pre-approval letter viewer (opened from Budget)
(window.EOS_EXT = window.EOS_EXT || []).push({ modals: { ptLetter: ({ close }) => html`<div class="scrim" onClick=${e => { if (e.target.classList.contains("scrim")) close(); }}><div class="modal" role="dialog" aria-modal="true"><div class="hd"><h3>Pre-approval letter</h3><button class="btn sm ghost" aria-label="Close" onClick=${close}>✕</button></div>
  <div class="bd"><div class="doc"><h4>Lone Star Lending · Pre-approval</h4><div>Borrowers: <b>Elena Ruiz and Marco Ruiz</b></div><div>Approved amount: <b class="num">$1,200,000</b> · Conventional · 20% down · 30-year fixed</div><div>Valid through Jan 6, 2027, subject to appraisal, title and no material change in income or credit.</div><div style="font-size:11.5px">Kim Alvarez, Loan officer · NMLS #1234567 · Equal Housing Lender</div></div>
    <div class="muted" style="font-size:12.5px">Sam attaches this letter to every offer you make, sized to the offer price so sellers don't see your full budget.</div></div>
  <div class="ft"><button class="btn" onClick=${close}>Close</button><button class="btn pri" onClick=${() => { close(); go("portal/find"); }}>Find homes in budget</button></div></div></div>` } });
