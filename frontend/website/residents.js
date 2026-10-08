// Residents & owners: the tenant portal (Hannah Cole, 3B Eastside Lofts), the owner portal (Brooks Holdings LLC)
// and the PM ops desk (technician today list, deposit disposition, compliance packs).
// Runs on the same store as the office: payments flip the rent roll, requests become tickets, owner approvals move tickets.
// Loaded before app.js; html, S, up, go, toast, usd, Shell, Ic, Av, PAv etc. are only used inside functions.

(window.EOS_EXT = window.EOS_EXT || []).push({
  pages: { tenant: RzTenant, owner: RzOwner, pmops: RzOps },
  modals: { rzDoc: RzDocModal, rzSign: RzSignModal, rzLetter: RzLetterModal, rzAdverse: RzAdverseModal },
  seed: rzSeed,
  nav: [
    { id: "pmops", label: "PM ops", icon: "M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4z", group: "office", mod: "rentals" },
    { id: "tenant", label: "Tenant portal", icon: "M15 7a4 4 0 1 1-3.9 4.9L3 20v-3h3v-3h3l1.1-1.1A4 4 0 0 1 15 7zM16 9h.01", group: "portal", mod: "rentals" },
    { id: "owner", label: "Owner portal", icon: "M4 20V10M10 20V4M16 20v-7M22 20H2", group: "portal", mod: "rentals" },
  ],
});

// ---------- icons (path strings, drawn with Ic) ----------
const RZI = {
  drop: "M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z",
  thermo: "M14 14.8V4a2 2 0 0 0-4 0v10.8a4 4 0 1 0 4 0z",
  appl: "M5 3h14v18H5zM5 8h14M9 5.5h.01M12 11a3 3 0 1 1 0 6 3 3 0 0 1 0-6z",
  bolt: "M13 2 4 14h7l-1 8 9-12h-7z",
  lock: "M6 11h12v10H6zM8 11V7a4 4 0 0 1 8 0v4",
  bug: "M8 9h8v7a4 4 0 0 1-8 0zM9 9a3 3 0 0 1 6 0M4 13h4M16 13h4M5 19l3-2M19 19l-3-2M5 7l3 2M19 7l-3 2",
  flame: "M12 22a7 7 0 0 0 7-7c0-4-3-6-4-9-1 3-3 4-3 4s-1-3 0-7C8 5 5 9 5 15a7 7 0 0 0 7 7z",
  dots: "M5 12h.01M12 12h.01M19 12h.01M4 4h16v16H4z",
  card: "M3 6h18v12H3zM3 10h18M7 15h3",
  bank: "M3 10 12 4l9 6M5 10v8M9 10v8M15 10v8M19 10v8M3 20h18",
  cash: "M3 7h18v10H3zM12 9.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z",
  doc: "M7 3h7l5 5v13H7zM14 3v5h5M10 13h6M10 17h6",
  shield: "M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6z",
  cal: "M4 6h16v15H4zM4 10h16M8 3v4M16 3v4",
  box: "M12 2 3 7v10l9 5 9-5V7zM3 7l9 5 9-5M12 12v10",
  wifi: "M2 8.8a15 15 0 0 1 20 0M5 12.5a10 10 0 0 1 14 0M8.5 16a5 5 0 0 1 7 0M12 20h.01",
  wifioff: "M2 8.8a15 15 0 0 1 20 0M5 12.5a10 10 0 0 1 14 0M8.5 16a5 5 0 0 1 7 0M12 20h.01M3 3l18 18",
  cam: "M4 7h3l2-3h6l2 3h3v13H4zM12 10a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7z",
  pin: "M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12zM12 11.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z",
  bell: "M6 16V11a6 6 0 0 1 12 0v5l2 2H4zM10 21h4",
  person: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0",
  scale: "M12 3v18M5 7h14M5 7l-3 7a3 3 0 0 0 6 0zM19 7l-3 7a3 3 0 0 0 6 0zM8 21h8",
};

// ---------- dates (demo "today" is Thu Oct 8, 2026) ----------
const RZ_TODAY = new Date(2026, 9, 8);
const rzFmt = (d) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
const rzFmtY = (d) => d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
const rzAdd = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
const rzDays = (a, b) => Math.round((b - a) / 864e5);
const rzISO = (d) => d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
const rzParse = (s) => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); };

// deposit-return rules by jurisdiction (research §11, §21; TX Property Code §92.103/.104/.107/.109)
const RZ_RULES = {
  TX: { name: "Texas", days: 30, cite: "Tex. Prop. Code §92.103", from: "after move-out, once the tenant gives a forwarding address in writing (§92.107)", receipts: 0, extra: "Itemized list of deductions required (§92.104). Withholding in bad faith costs $100 + 3× the amount withheld + attorney's fees (§92.109)." },
  CA: { name: "California", days: 21, cite: "Cal. Civ. Code §1950.5", from: "after the tenant moves out", receipts: 125, extra: "Receipts must be attached for any deduction over $125; your own labor must show the hours and hourly rate. Tenants must be offered a pre-move-out inspection in writing." },
  UK: { name: "England (deposit scheme)", days: 10, cite: "Housing Act 2004 · DPS / mydeposits / TDS", from: "after landlord and tenant agree the amount", receipts: 0, extra: "Disputes go to the scheme's free adjudication. A deposit that was never protected blocks possession under the Renters' Rights Act." },
};

// ---------- seed ----------
function rzSeed(d) {
  const u8 = d.units.find(u => u.id === "U8"); if (u8) u8.status = "Late"; // Hannah hasn't paid October yet
  d.tickets.push({ id: "M4", unit: "U6", title: "Water heater failing (12 years old, rust at the base)", by: null, when: "Tue", status: "Awaiting owner", priority: "High", ai: "", vendor: "Ace Plumbing quote · $1,840", quote: 1840, approval: "pending" });
  const p6 = d.people.find(p => p.id === "P6"); if (p6 && !p6.roles.includes("Resident")) p6.tags.push("Autopay off");
  d.rz = {
    tenant: "P6", unit: "U8", roommate: "Sofia Marin",
    ledger: [
      { d: "Sep 1", t: "September rent", amt: 1750 },
      { d: "Sep 1", t: "Water, sewer & trash (billed by unit size)", amt: 46 },
      { d: "Sep 2", t: "Payment · bank transfer", amt: -1796, pay: true },
      { d: "Oct 1", t: "October rent", amt: 1750 },
      { d: "Oct 1", t: "Water, sewer & trash (billed by unit size)", amt: 48 },
      { d: "Oct 4", t: "Late fee · lease §6, rent unpaid 2 full days after the 1st", amt: 75, fee: true },
    ],
    autopay: { on: false, day: 1, method: "Bank •• 4417" },
    split: null, plans: [], receipts: [],
    lease: { start: "May 1, 2026", end: "Apr 30, 2027", rent: 1750, deposit: 1750, term: "12 months" },
    renewal: null, moveout: null,
    insurance: { status: "missing", due: "Nov 1", carrier: "", policy: "", partner: false },
    notices: [
      { id: "N1", t: "Water off Wed Oct 14, 9–11 am", s: "Riser valve replacement on floors 3–4. Fill a pitcher the night before.", when: "Posted today", kind: "warn", read: false },
      { id: "N2", t: "Pest service Oct 21", s: "Quarterly treatment of hallways and units that opt in. Pets can stay in.", when: "Oct 5", kind: "", read: true },
      { id: "N3", t: "New parcel lockers in the lobby", s: "You'll get a code by text when something arrives.", when: "Sep 28", kind: "", read: true },
    ],
    packages: [
      { id: "K1", carrier: "Amazon", what: "Medium box", where: "Locker 14 · code 482 913", when: "Today 10:12 am", picked: false },
      { id: "K2", carrier: "UPS", what: "Envelope", where: "Front desk (Lena)", when: "Yesterday 4:40 pm", picked: false },
      { id: "K3", carrier: "FedEx", what: "Large box · 22 lb", where: "Package room", when: "Oct 3", picked: true },
    ],
    selfFixed: 0,
    // owner side (Brooks Holdings LLC, Eastside Lofts)
    owner: { person: "P1", limit: 500, approvals: [
      { id: "AP1", kind: "repair", ticket: "M4", t: "Replace water heater · 2C", s: "Ace Plumbing quote $1,840 (50-gal, 6-yr warranty, haul-away). Over your $500 approval limit.", amt: 1840, status: "pending" },
      { id: "AP2", kind: "renewal", unit: "U9", t: "Renewal for 3C · Lucas Reed", s: "Lease ends Nov 26. Market comps support $1,795 (+2%). Lucas has paid on time 14 of 14 months.", amt: 1795, status: "pending" },
    ], docs: [
      ["1099-MISC · 2025", "Rents paid to you by Harbor & Vine Realty: $214,880. Filed with the IRS Jan 30, 2026.", "Tax"],
      ["Management agreement", "8% of rent collected. Repairs over $500 need your approval, except emergencies. Signed Mar 3, 2023; renews yearly.", "Agreement"],
      ["September 2026 owner statement", "Net to owner $13,438 · paid Oct 10 by ACH.", "Statement"],
      ["Certificate of insurance · Eastside Lofts", "Liability $2M · property $3.4M · expires Mar 1, 2027.", "Insurance"],
      ["2027 operating budget (draft)", "Income $236,400 · operating expenses $62,100 · capital reserve $18,000.", "Budget"],
    ], payouts: [
      ["Oct 10", "September 2026", 13438, "Scheduled"], ["Sep 10", "August 2026", 13240, "Paid"], ["Aug 10", "July 2026", 14010, "Paid"],
      ["Jul 10", "June 2026", 14630, "Paid"], ["Jun 10", "May 2026", 12600, "Paid"], ["May 8", "April 2026", 14720, "Paid"],
    ], perms: [["Statements & payouts", true], ["Maintenance approvals over your limit", true], ["Work-order history and photos", true], ["Occupancy and leasing activity", true], ["Tenant phone numbers and emails", false], ["Screening reports", false]] },
    // PM ops
    online: true, queue: [], tech: {}, jobs: [
      { id: "J1", t: "Quarterly HVAC filter change", unit: "U10", win: "8:30–9:00 am", kind: "Preventive", steps: ["Shut off system at thermostat", "Swap 20×25×1 MERV 8 filter", "Write date on filter frame"] },
      { id: "J2", t: "Smoke & CO alarm test (vacant unit)", unit: "U3", win: "9:15–9:45 am", kind: "Turnover", steps: ["Test each alarm", "Replace 9V batteries", "Photo of each alarm"] },
    ],
    deposits: [
      { id: "DP1", unit: "U3", tenant: "Carla Diaz", deposit: 1690, moved: "2026-09-22", state: "TX", fwd: "2207 Manor Rd, Austin, TX 78722", status: "Draft", items: [
        { id: 1, t: "Carpet cleaning, pet stains in bedroom", amt: 180, receipt: true, on: true },
        { id: 2, t: "Replace broken living-room blind", amt: 64, receipt: true, on: true },
        { id: 3, t: "Patch and paint 3 large wall holes", hours: 3, rate: 45, receipt: false, on: true },
        { id: 4, t: "Repaint walls faded by sunlight", amt: 220, receipt: true, on: true, wear: true },
      ] },
    ],
    region: "US",
    applicants: [
      { id: "AA1", name: "Jamal Reyes", unit: "U3", income: 3.1, credit: 588, evict: false, decision: "Declined", reason: "Credit score 588 is below the 620 minimum for this property", score: 588, factors: ["Serious delinquency on a revolving account", "High balance-to-limit ratio", "Short credit history"], notice: null },
      { id: "AA2", name: "Tessa Nguyen", unit: "U3", income: 2.2, credit: 701, evict: false, decision: "Conditional", reason: "Income is 2.2× rent (minimum 2.5×): approved with an extra half-month deposit", score: 701, factors: ["Income below property criterion"], notice: null },
      { id: "AA3", name: "Daniel Okoro", unit: "U10", income: 3.4, credit: 742, evict: false, decision: "Approved", reason: "Meets all criteria", score: 742, factors: [], notice: null },
    ],
    adCopy: { flagged: true, text: "Sunny 1-bed loft, perfect for young professionals. Walk to Rainey and 6th." },
    uk: [
      { id: "UK1", addr: "Flat 2, 14 Clifton Rd, Bristol", tenant: "A. Okafor & J. Price", periodic: true, info: false, deposit: "DPS · registered", rtr: "2 of 2 checked", rtrDue: "", gas: "2026-10-30", eicr: "2029-04-11", epc: "C · 2031" },
      { id: "UK2", addr: "22 Ashley Hill, Bristol", tenant: "M. Kowalski", periodic: true, info: true, deposit: "Not protected", rtr: "Time-limited visa", rtrDue: "2026-11-02", gas: "2027-02-14", eicr: "2026-09-30", epc: "D · 2029" },
      { id: "UK3", addr: "Flat 5, Redcliffe Wharf, Bristol", tenant: "S. Hughes", periodic: true, info: true, deposit: "mydeposits · registered", rtr: "1 of 1 checked", rtrDue: "", gas: "2027-06-01", eicr: "2030-01-20", epc: "B · 2033" },
    ],
  };
}

// ---------- shared helpers ----------
const RZ = () => S.d.rz;
const rzUnit = (id) => S.d.units.find(u => u.id === (id || RZ().unit));
const rzBld = (u) => S.d.buildings.find(b => b.id === u.b);
const rzBal = () => Math.round(RZ().ledger.reduce((a, l) => a + l.amt, 0) * 100) / 100;
const rzT5 = () => S.d.threads.find(t => t.person === RZ().tenant);
const rzT2 = () => S.d.threads.find(t => t.person === RZ().owner.person);
function rzLog(text, ch) { const t = rzT5(); if (t) { t.msgs.push({ from: "them", text, at: "now", ts: Date.now(), ch: ch || "Tenant app" }); t.unread += 1; t.when = "now"; } }
function rzReply(text) { const t = rzT5(); if (t) t.msgs.push({ from: "me", text, at: "now", ts: Date.now(), ch: "Tenant app" }); }
function rzOwnerLog(text) { const t = rzT2(); if (t) { t.msgs.push({ from: "them", text, at: "now", ts: Date.now(), ch: "Owner portal" }); t.unread += 1; t.when = "now"; } }
// shared portal helpers live in seller.js (loaded first): slNotify, slRel, SlConfirm, SlErr, SlViewAs, slOfficeAct, slEsc
function rzNotify(who, text, route) { if (typeof slNotify === "function") slNotify(who, text, route); }
const rzIsTech = () => !!(S.role && S.role.id === "tech");
const rzTenantFirst = () => P(RZ().tenant).name.split(" ")[0];
const RzChip = ({ n, tone, s }) => html`<span class=${"rz-chip " + (tone || "")}><${Ic} n=${RZI[n] || n} s=${s || 18} /></span>`;
const rzOpenDoc = (title, body, meta) => up(s => { s.modal = { kind: "rzDoc", title, body, meta }; });

// ================= TENANT PORTAL =================
function RzFrame({ tab, children, owner }) {
  const z = RZ(), p = P(owner ? z.owner.person : z.tenant), u = rzUnit(), b = rzBld(u), leo = A("leo");
  const tabs = owner
    ? [["home", "Overview"], ["statement", "Statement"], ["approvals", "Approvals"], ["docs", "Documents"], ["payouts", "Distributions"]]
    : [["home", "Home"], ["pay", "Pay rent"], ["fix", "Maintenance"], ["lease", "Lease & docs"], ["messages", "Messages"], ["packages", "Packages"]];
  const root = owner ? "owner" : "tenant";
  const badge = owner ? z.owner.approvals.filter(a => a.status === "pending").length : z.notices.filter(n => !n.read).length + z.packages.filter(k => !k.picked).length;
  return html`<div class="site pt rz">
    <${SlViewAs} client=${owner ? "Brooks Holdings'" : p.name.split(" ")[0] + "'s"} pref=${owner ? "rentals" : "pmops/tech"} />
    <div class="sbar"><span>${owner ? "Owner portal" : "Resident portal"}</span><span class="u">${owner ? "owners" : "home"}.harborandvine.com${tab && tab !== "home" ? "/" + tab : ""}</span><span style="flex:1"></span>
      <span class="rz-auth" title="Sessions last 90 days on a trusted device; passkey or Face ID to come back in">● Signed in · this device stays signed in</span>
      ${isClient() ? html`<button onClick=${() => leavePortal(owner ? "rentals" : "pmops")}>${leaveLabel("")}</button>` : ""}</div>
    <div class="snav rz-nav"><span class="logo">Harbor & Vine</span><span class="pt-who">${owner ? "Brooks Holdings LLC · " + S.d.buildings.filter(x => x.ownerPerson === p.id).map(x => x.name).join(", ") : p.name + " · " + u.name + ", " + b.name}</span><span class="sp"></span>
      <button class="pt-agent" onClick=${() => go(owner ? "owner/approvals" : "tenant/messages")}><${Av} a=${leo} /><span><b>${leo.name}</b><small>${owner ? "Your property manager" : "Your property manager · replies in ~1 hr"}</small></span></button>${window.EosChrome ? html`<${EosChrome.Tools} />` : ""}</div>
    <nav class="pt-tabs">${tabs.map(([k, v]) => html`<button class=${tab === k ? "on" : ""} onClick=${() => go(root + "/" + k)}>${v}${badge && ((owner && k === "approvals") || (!owner && (k === "messages" || k === "packages") && (k === "messages" ? z.notices.some(n => !n.read) : z.packages.some(x => !x.picked)))) ? html`<i></i>` : ""}</button>`)}</nav>
    <div class="pt-body">${children}</div></div>`;
}

function RzTenant() {
  const v = { home: RzHome, pay: RzPay, fix: RzFix, lease: RzLease, messages: RzMessages, packages: RzPackages }[S.route.id || "home"] || RzHome;
  return html`<${v} />`;
}

function RzDueCard({ compact }) {
  const z = RZ(), bal = rzBal(), u = rzUnit();
  const paid = bal <= 0;
  return html`<div class=${"rz-due " + (paid ? "ok" : "owe")}>
    <div class="rz-due-l">
      <div class="lbl">${paid ? "October" : "Balance due"}</div>
      ${paid ? html`<div class="rz-big"><span class="rz-tick">✓</span> Paid</div><div class="rz-sub">You're paid up through October. Next rent ${usd(u.rent)} on Nov 1.</div>`
        : html`<div class="rz-big num">${usd(bal, 2)}</div><div class="rz-sub">Rent was due Oct 1 · ${z.plans.some(p => p.status === "Approved") ? "on an approved payment plan" : "includes a $75 late fee"}</div>`}
      <div class="row" style="gap:6px;margin-top:10px;flex-wrap:wrap">
        <span class=${"pill " + (z.autopay.on ? "g" : "")}>${z.autopay.on ? "Autopay on · the " + rzOrd(z.autopay.day) + " · " + z.autopay.method : "Autopay off"}</span>
        ${z.split && z.split.status === "Requested" ? html`<span class="pill a">Waiting on ${z.roommate.split(" ")[0]}'s ${usd(z.split.share, 2)}</span>` : ""}
      </div>
    </div>
    ${!compact && html`<div class="rz-due-r">${paid ? html`<button class="btn" onClick=${() => go("tenant/pay")}>Payment options</button>` : html`<button class="btn pri big" onClick=${() => go("tenant/pay")}>Pay now</button><small>Bank transfer is free</small>`}</div>`}
  </div>`;
}

function RzLedger() {
  const z = RZ();
  const ch = z.ledger.filter(l => l.amt > 0).reduce((a, l) => a + l.amt, 0), pd = -z.ledger.filter(l => l.amt < 0).reduce((a, l) => a + l.amt, 0);
  return html`<div class="card"><div class="hd"><h3>Ledger</h3><span class="sp"></span><span class="muted" style="font-size:12px">Charges ${usd(ch, 2)} · Paid ${usd(pd, 2)}</span></div>
    <div class="rz-ledger">${z.ledger.slice().reverse().map(l => html`<div class=${"rz-ll" + (l.amt < 0 ? " pay" : "") + (l.fee ? " fee" : "")}><span class="muted num">${l.d}</span><span class="t">${l.t}</span><b class="num">${l.amt < 0 ? "−" + usd(-l.amt, 2) : usd(l.amt, 2)}</b></div>`)}
      <div class="rz-ll tot"><span></span><span class="t">Balance</span><b class="num">${usd(rzBal(), 2)}</b></div></div></div>`;
}

function RzHome() {
  const z = RZ(), p = P(z.tenant), u = rzUnit(), b = rzBld(u);
  const open = S.d.tickets.filter(t => (t.by === z.tenant || t.unit === z.unit) && t.status !== "Cancelled" && !(t.status === "Done" && t.confirmed));
  const banner = z.notices.find(n => n.kind === "warn" && !n.read);
  return html`<${RzFrame} tab="home">
    ${banner && html`<div class="rz-banner"><${RzChip} n="bell" tone="amber" /><div style="flex:1"><b>${banner.t}</b><div>${banner.s}</div></div><button class="btn sm" onClick=${() => up(() => { banner.read = true; })}>Got it</button></div>`}
    <div class="pt-hero"><div><div class="lbl">${b.name} · ${b.addr}</div><h1>${z.lang === "es" ? "Hola " + p.name.split(" ")[0] + ", bienvenida a casa." : "Hi " + p.name.split(" ")[0] + ", welcome home."}</h1></div>
      <div class="rz-unitpic" style=${"background-image:url(" + img(b.img) + ")"}><span>Unit ${u.name}</span></div></div>
    <div class="rz-cols">
      <div class="rz-stack">
        <${RzDueCard} />
        <${RzLedger} />
      </div>
      <div class="rz-stack">
        <div class="card"><div class="hd"><h3>Your lease</h3><span class="sp"></span><button class="btn sm ghost" onClick=${() => go("tenant/lease")}>Details →</button></div><div class="bd rz-kv">
          <div><span>Rent</span><b class="num">${usd(z.renewal ? z.renewal.rent : u.rent)}/mo</b></div><div><span>Term</span><b>${z.lease.start} – ${z.renewal ? z.renewal.end : z.lease.end}</b></div>
          <div><span>Deposit held</span><b class="num">${usd(z.lease.deposit)}</b></div><div><span>Renters insurance</span><b>${z.insurance.status === "missing" ? html`<span class="pill a">Needed by ${z.insurance.due}</span>` : html`<span class="pill g">On file</span>`}</b></div></div></div>
        ${!z.renewal && !z.moveout ? html`<div class="pt-next rz-offer"><div class="lbl">Early renewal offer</div><h2>Keep ${usd(u.rent)}/mo for 2027</h2><p>Renew by Nov 30 and your rent stays the same for 12 months. Or pick 6 or 18 months.</p><button class="btn pri" onClick=${() => go("tenant/lease")}>See renewal options →</button></div>`
          : z.renewal ? html`<div class="card"><div class="bd row"><${RzChip} n="check" tone="green" /><div><b>Renewed through ${z.renewal.end}</b><div class="muted" style="font-size:12.5px">${z.renewal.term} at ${usd(z.renewal.rent)}/mo · signed Oct 8</div></div></div></div>`
          : html`<div class="card"><div class="bd row"><${RzChip} n="cal" tone="blue" /><div><b>Moving out ${rzFmtY(rzParse(z.moveout.date))}</b><div class="muted" style="font-size:12.5px">Deposit back by ${rzFmt(rzAdd(rzParse(z.moveout.date), 30))} (Texas, 30 days)</div></div></div></div>`}
        <div class="card"><div class="hd"><h3>Requests</h3><span class="sp"></span><button class="btn sm" onClick=${() => go("tenant/fix")}>+ New request</button></div>
          <div class="feed">${open.length ? open.map(t => html`<button class="it rz-rowbtn" onClick=${() => go("tenant/fix")} aria-label=${"Track: " + t.title}><${RzChip} n="wrench" s=${15} /><div style="flex:1;text-align:left"><b style="font-size:13px">${t.title}</b><div class="muted" style="font-size:12px">${rzStatusLine(t)}</div></div></button>`) : html`<div class="sl-empty"><b>Nothing open</b><span class="muted">Something broken? Report it in a minute, with photos.</span></div>`}</div></div>
        <div class="card"><div class="hd"><h3>Notices</h3><span class="sp"></span><button class="btn sm ghost" onClick=${() => go("tenant/messages")}>All →</button></div>
          <div class="feed">${z.notices.slice(0, 3).map(n => html`<div class="it"><span class="dot" style=${n.read ? "background:var(--line-2)" : ""}></span><div style="flex:1"><b style="font-size:13px">${n.t}</b><div class="muted" style="font-size:12px">${n.s}</div></div><span class="muted" style="font-size:11.5px">${n.when}</span></div>`)}</div></div>
      </div>
    </div>
    <div class="rz-foot">Web and app work the same · you stay signed in on trusted devices · <button class="sl-link" onClick=${() => { up(() => { z.lang = z.lang === "es" ? "en" : "es"; }); toast(z.lang === "es" ? "Mensajes y avisos en español a partir de ahora" : "Back to English"); }}>${z.lang === "es" ? "English" : "Español"}</button></div>
  </${RzFrame}>`;
}
RZI.wrench = "M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4z";
RZI.check = "M5 12l5 5L20 7";

// ---------- pay ----------
const RZ_METHODS = [
  { k: "ach", n: "Bank transfer (ACH)", ic: "bank", fee: () => 0, label: "Free", note: "Bank •• 4417 · posts today, clears in 1–2 business days" },
  { k: "debit", n: "Debit card", ic: "card", fee: () => 2.95, label: "$2.95 flat", note: "Visa •• 0921 · instant" },
  { k: "card", n: "Credit card", ic: "card", fee: (a) => Math.round(a * 2.9) / 100, label: "2.9%", note: "Card processor's fee, not ours" },
  { k: "cash", n: "Cash at a store", ic: "cash", fee: () => 1.99, label: "$1.99", note: "Barcode for CVS, 7-Eleven, Walgreens · posts within 1 hour" },
];
function rzPost(a, label, who) {
  up(s => {
    const z = s.d.rz; z.ledger.push({ d: "Oct 8", t: "Payment · " + label + (who ? " · " + who : ""), amt: -a, pay: true, ts: Date.now() });
    if (rzBal() <= 0.004) rzUnit().status = "Paid";
    rzLog((who || P(z.tenant).name.split(" ")[0]) + " paid " + usd(a, 2) + " by " + label.toLowerCase() + " in the resident portal" + (rzBal() > 0 ? " · " + usd(rzBal(), 2) + " still open" : " · October settled"), "Portal payment");
  });
  const u = rzUnit();
  rzNotify("leo", (who || P(RZ().tenant).name) + " paid " + usd(a, 2) + " for " + u.name + " " + rzBld(u).name + (rzBal() > 0 ? " · " + usd(rzBal(), 2) + " still open" : " · paid in full"), "rentals");
}
function RzPay() {
  const z = RZ(), bal = rzBal(), u = rzUnit();
  const [amt, setAmt] = useState(bal > 0 ? bal.toFixed(2) : "0.00");
  const [m, setM] = useState("ach"), [split, setSplit] = useState(false), [share, setShare] = useState(50), [receipt, setReceipt] = useState(null);
  const [planOpen, setPlanOpen] = useState(false), [n, setN] = useState(2), [why, setWhy] = useState("My paycheck moved to the 15th this month.");
  const [stage, setStage] = useState("form"); // form → confirm → busy → receipt
  const meth = RZ_METHODS.find(x => x.k === m);
  const raw = String(amt).replace(/[$,\s]/g, "");
  const a = Math.round((+raw || 0) * 100) / 100, fee = meth.fee(a), mine = split ? Math.round(bal * share) / 100 : null;
  const err = raw === "" ? "Enter an amount" : !/^\d+(\.\d{0,2})?$/.test(raw) ? "Use numbers only, like 1873.00" : a <= 0 ? "Enter an amount above $0" : a > bal + 0.004 ? "That's more than you owe (" + usd(bal, 2) + ")" : a < bal - 0.004 && a < 500 ? "Partial payments at Eastside Lofts start at $500" : "";
  function setSplitOn(on) { setSplit(on); setStage("form"); setAmt(on ? (Math.round(bal * share) / 100).toFixed(2) : bal.toFixed(2)); }
  function pay() {
    if (err || stage === "busy") return;
    const lbl = meth.n.replace(" (ACH)", "");
    setStage("busy");
    setTimeout(() => {
      if (split) up(() => { z.split = { share: Math.round((bal - a) * 100) / 100, status: "Requested" }; });
      rzPost(a, lbl);
      up(() => { z.receipts.unshift({ a, fee, m: lbl, at: "Oct 8, " + new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }), ts: Date.now(), conf: "HV-" + (48210 + z.receipts.length) }); });
      setReceipt({ a, fee, m: lbl }); setStage("form");
      toast("Payment of " + usd(a, 2) + " posted to your ledger" + (split ? " · " + z.roommate.split(" ")[0] + " got a text for her share" : ""));
    }, 450);
  }
  function requestPlan() {
    const each = Math.round(bal / n * 100) / 100, dates = n === 2 ? ["Oct 15", "Oct 29"] : ["Oct 15", "Oct 22", "Oct 29"];
    up(() => { z.plans.push({ id: "PL" + (z.plans.length + 1), n, each, dates, why, total: bal, status: "Requested", ts: Date.now() }); rzLog("Payment plan request: " + n + " payments of " + usd(each, 2) + " (" + dates.join(", ") + "). " + why, "Tenant app"); });
    rzNotify("leo", P(z.tenant).name + " asked for a payment plan: " + n + " × " + usd(each, 2), "pmops/tech");
    setPlanOpen(false); toast("Plan request sent to Leo · you'll hear back today. No late fees pile up while it's reviewed.");
  }
  function toggleAutopay() {
    const was = z.autopay.on;
    const set = (on) => up(() => { z.autopay.on = on; const p6 = P(z.tenant); p6.tags = p6.tags.filter(t => !t.startsWith("Autopay")).concat(on ? ["Autopay on"] : ["Autopay off"]); });
    set(!was);
    toast(!was ? "Autopay on · free bank draft on the " + rzOrd(z.autopay.day) : "Autopay turned off", ["Undo", () => set(was)]);
  }
  const plan = z.plans[z.plans.length - 1];
  const rest = rzBal();
  return html`<${RzFrame} tab="pay">
    <div class="rz-cols">
      <div class="rz-stack">
        <${RzDueCard} compact />
        ${receipt ? html`<div class="card rz-receipt"><div class="bd"><div class="row"><${RzChip} n="check" tone="green" /><div style="flex:1"><b style="font-size:16px">Paid ${usd(receipt.a, 2)}</b><div class="muted">${receipt.m} · confirmation <span class="num">${z.receipts[0].conf}</span> · ${slRel(z.receipts[0].ts)}</div></div></div>
            <div class="sheet" style="margin-top:10px"><div class="ln"><span>Applied to your balance</span><span>${usd(receipt.a, 2)}</span></div><div class="ln"><span>Processing fee</span><span>${receipt.fee ? usd(receipt.fee, 2) : "Free"}</span></div><div class="ln tot"><span>Charged to you</span><span>${usd(receipt.a + receipt.fee, 2)}</span></div></div>
            <div class="rz-nextstep"><div class="lbl">Next</div>${rest > 0.004 ? html`<div>${z.split && z.split.status === "Requested" ? z.roommate.split(" ")[0] + " owes the other " + usd(rest, 2) + "; we texted her a link." : usd(rest, 2) + " is still open."}</div>` : html`<div>You're paid up. November rent of ${usd(u.rent)} is due Nov 1.</div>`}
              ${!z.autopay.on ? html`<div class="row" style="gap:8px;flex-wrap:wrap;margin-top:6px"><span class="muted" style="font-size:12.5px;flex:1;min-width:160px">Never think about it again: autopay is free by bank transfer.</span><button class="btn sm" onClick=${toggleAutopay}>Turn on autopay</button></div>` : ""}</div>
            <div class="row" style="margin-top:12px;flex-wrap:wrap"><button class="btn" onClick=${() => { setReceipt(null); setAmt(rzBal().toFixed(2)); setSplit(false); }}>${rest > 0.004 ? "Pay the rest" : "Done"}</button><button class="btn" onClick=${() => go("tenant/home")}>Back to home</button></div></div></div>`
        : bal <= 0 ? html`<div class="card"><div class="bd sl-empty"><span class="rz-chip green"><${Ic} n="check" s=${18} /></span><b>Nothing to pay right now</b><span class="muted">November rent of ${usd(u.rent)} is due Nov 1${z.autopay.on ? " and autopay will cover it" : ""}.</span></div></div>`
        : stage !== "form" ? html`<div class="card rz-confirm"><div class="hd"><h3>Confirm your payment</h3></div><div class="bd rz-form">
            <div class="sheet"><div class="ln"><span>Pay</span><b>${usd(a, 2)}</b></div><div class="ln"><span>From</span><span>${meth.n} · ${meth.note.split(" · ")[0]}</span></div><div class="ln"><span>Fee</span><span>${fee ? usd(fee, 2) : "Free"}</span></div>${split ? html`<div class="ln"><span>${z.roommate.split(" ")[0]}'s share</span><span>${usd(bal - a, 2)} · we text her</span></div>` : ""}<div class="ln tot"><span>Total charged</span><span>${usd(a + fee, 2)}</span></div></div>
            <div class="muted" style="font-size:12.5px">Payments post right away and can't be cancelled here. Leo can refund a mistake.</div>
            <div class="row" style="flex-wrap:wrap"><button class="btn" disabled=${stage === "busy"} onClick=${() => setStage("form")}>Edit</button><button class="btn pri big" disabled=${stage === "busy"} aria-busy=${stage === "busy"} onClick=${pay}>${stage === "busy" ? html`<span class="rz-spin" aria-hidden="true"></span> Processing…` : "Confirm & pay " + usd(a + fee, 2)}</button></div></div></div>`
        : html`<div class="card"><div class="hd"><h3>Make a payment</h3><span class="sp"></span><span class="pill g">Fees shown before you pay</span></div><div class="bd rz-form">
          <label class=${"field" + (err ? " sl-bad" : "")}><span>Amount</span><div class="rz-amt"><b>$</b><input inputmode="decimal" value=${amt} onInput=${e => setAmt(e.target.value)} onKeyDown=${e => { if (e.key === "Enter" && !err) setStage("confirm"); }} aria-label="Amount" aria-invalid=${!!err} aria-describedby="rz-amt-err" /></div><span id="rz-amt-err"><${SlErr} m=${err} /></span></label>
          <div class="row" style="gap:6px;flex-wrap:wrap">${[["Full balance", bal], ["Rent only", Math.min(bal, u.rent)], ["$500 now", 500]].filter(([, v]) => v <= bal + 0.004).map(([l, v]) => html`<button class=${"chip" + (Math.abs(a - v) < 0.01 ? " on" : "")} onClick=${() => { setSplit(false); setAmt(v.toFixed(2)); }}>${l}</button>`)}</div>
          <div class="muted" style="font-size:12px">Partial payments are allowed here (minimum $500). Whatever you pay posts to your ledger right away.</div>
          <div class="rz-split"><label class="row" style="gap:8px"><input type="checkbox" checked=${split} onChange=${e => setSplitOn(e.target.checked)} /><b>Split with ${z.roommate}</b></label>
            ${split && html`<div class="rz-splitrow"><span>You pay <b class="num">${share}%</b> · ${usd(mine, 2)}</span><input type="range" min="10" max="90" step="5" value=${share} onInput=${e => { const v = +e.target.value; setShare(v); setAmt((Math.round(bal * v) / 100).toFixed(2)); }} aria-label="Your share" /><span>${z.roommate.split(" ")[0]} gets a text for <b class="num">${usd(bal - mine, 2)}</b></span></div>`}</div>
          <div class="lbl" style="margin-top:4px">Pay with</div>
          <div class="rz-meths">${RZ_METHODS.map(x => html`<button class=${"rz-meth" + (m === x.k ? " on" : "")} onClick=${() => setM(x.k)} aria-pressed=${m === x.k}><${RzChip} n=${x.ic} s=${16} /><span class="tx"><b>${x.n}</b><small>${x.note}</small></span><span class=${"rz-fee" + (x.fee(a) === 0 ? " free" : "")}>${x.k === "card" && a > 0 ? "2.9% · " + usd(x.fee(a), 2) : x.label}</span></button>`)}</div>
          <div class="rz-total"><div class="sheet"><div class="ln"><span>Payment</span><span>${usd(a, 2)}</span></div><div class="ln"><span>${meth.n} fee</span><span>${fee ? usd(fee, 2) : "Free"}</span></div><div class="ln tot"><span>You'll be charged</span><span>${usd(a + fee, 2)}</span></div></div>
            ${fee ? html`<div class="muted" style="font-size:12px;margin-top:6px">Switch to bank transfer to save ${usd(fee, 2)}.</div>` : ""}</div>
          <button class="btn pri big" disabled=${!!err} title=${err} onClick=${() => setStage("confirm")}>Pay ${usd(a + fee, 2)}</button>
        </div></div>`}
      </div>
      <div class="rz-stack">
        ${z.split && html`<div class="card"><div class="hd"><h3>Roommate split</h3></div><div class="bd row"><${PAv} p=${{ ini: "SM" }} /><div style="flex:1"><b>${z.roommate}</b><div class="muted" style="font-size:12.5px">${z.split.status === "Paid" ? "Paid her share " + usd(z.split.share, 2) : "Owes " + usd(z.split.share, 2) + " · link sent by text"}</div></div>
          ${z.split.status === "Requested" && html`<button class="btn sm" onClick=${() => { rzPost(z.split.share, "Bank transfer", z.roommate); up(() => { z.split.status = "Paid"; }); setReceipt(null); toast(z.roommate.split(" ")[0] + " paid her share · October is settled"); }}>Demo: ${z.roommate.split(" ")[0]} pays</button>`}</div></div>`}
        <div class="card"><div class="hd"><h3>Autopay</h3><span class="sp"></span><span class=${"pill " + (z.autopay.on ? "g" : "")}>${z.autopay.on ? "On" : "Off"}</span></div><div class="bd rz-form">
          <div class="row" style="justify-content:space-between"><span>Pay the full balance on the</span><select class="rz-sel" aria-label="Autopay day" value=${z.autopay.day} onChange=${e => { up(() => { z.autopay.day = +e.target.value; }); toast("Autopay day set to the " + rzOrd(+e.target.value)); }}>${[1, 2, 3].map(d => html`<option value=${d}>${rzOrd(d)}</option>`)}</select></div>
          <div class="muted" style="font-size:12px">From ${z.autopay.method}, free. We text you 3 days before every draft, and you can skip a month.</div>
          <button class=${"btn " + (z.autopay.on ? "" : "pri")} onClick=${toggleAutopay}>${z.autopay.on ? "Turn off autopay" : "Turn on autopay"}</button></div></div>
        <div class="card"><div class="hd"><h3>Need more time?</h3></div><div class="bd rz-form">
          ${plan ? html`<div class="row"><${RzChip} n="cal" tone=${plan.status === "Approved" ? "green" : "amber"} /><div style="flex:1"><b>${plan.n} payments of ${usd(plan.each, 2)}</b><div class="muted" style="font-size:12.5px">${plan.dates.join(" · ")} · ${plan.status === "Approved" ? "approved by Leo, late fee waived" : "sent " + slRel(plan.ts) + " · waiting for Leo"}</div></div><span class=${"pill " + (plan.status === "Approved" ? "g" : "a")}>${plan.status}</span></div>
              ${plan.status === "Requested" ? html`<${SlConfirm} cls="btn sm ghost" label="Withdraw request" text="Withdraw your payment-plan request?" yes="Withdraw" onYes=${() => { up(() => { z.plans = z.plans.filter(x => x !== plan); rzLog("Withdrew my payment plan request.", "Tenant app"); }); toast("Request withdrawn"); }} />` : ""}`
          : planOpen ? html`<div class="seg">${[2, 3].map(k => html`<button class=${n === k ? "on" : ""} onClick=${() => setN(k)}>${k} payments</button>`)}</div>
              <div class="sheet">${(n === 2 ? ["Oct 15", "Oct 29"] : ["Oct 15", "Oct 22", "Oct 29"]).map(d => html`<div class="ln"><span>${d}</span><span>${usd(bal / n, 2)}</span></div>`)}</div>
              <label class="field"><span>Anything Leo should know? (optional)</span><textarea rows="2" maxlength="300" value=${why} onInput=${e => setWhy(e.target.value)}></textarea></label>
              <div class="row"><button class="btn" onClick=${() => setPlanOpen(false)}>Cancel</button><button class="btn pri" onClick=${requestPlan}>Send request</button></div>`
          : html`<div class="muted" style="font-size:13px">Split what you owe into 2 or 3 payments this month. Asking doesn't cost anything or affect your record.</div><button class="btn" onClick=${() => setPlanOpen(true)} disabled=${bal <= 0} title=${bal <= 0 ? "Nothing is owed right now" : ""}>Request a payment plan</button>`}
        </div></div>
        <div class="card"><div class="hd"><h3>Every fee, up front</h3></div><div class="bd sheet" style="font-size:13px">
          ${RZ_METHODS.map(x => html`<div class="ln"><span>${x.n}</span><span>${x.label}</span></div>`)}<div class="ln"><span>Late fee (after the 3rd)</span><span>$75 flat</span></div><div class="ln"><span>Admin or "convenience" fees</span><span>None</span></div></div></div>
      </div>
    </div></${RzFrame}>`;
}
const rzOrd = (d) => d + (d === 1 ? "st" : d === 2 ? "nd" : d === 3 ? "rd" : "th");

// ---------- maintenance ----------
const RZ_ISSUES = [
  { k: "leak", n: "Leak or water", ic: "drop", v: "Ace Plumbing", subs: [["Leak under a sink", "Turn the shut-off valve under the sink clockwise until it stops. Put a bowl under the pipe and dry the cabinet floor.", "Urgent"], ["Toilet running or clogged", "Lift the tank lid and press the flapper down. For a clog, use the plunger with a tight seal, 10–15 firm pushes.", "Normal"], ["Water dripping from the ceiling", "Move belongings, put a bucket under it and photograph the spot. If the ceiling sags, stay out of the room.", "Urgent"]] },
  { k: "ac", n: "Heating & AC", ic: "thermo", v: "Polar Air", subs: [["AC not cooling", "Set the thermostat to COOL, 3° below room temperature, and change its batteries. Check the breaker labelled HVAC in the hall closet.", "High"], ["No heat", "Set the thermostat to HEAT and wait 10 minutes. Make sure the furnace closet door is shut tight.", "High"], ["Unit making a loud noise", "Turn the system off at the thermostat for 30 minutes, then back on.", "Normal"]] },
  { k: "appl", n: "Appliance", ic: "appl", v: "HomeFix", subs: [["Dishwasher won't drain", "Twist out the filter at the bottom and rinse it. Run the garbage disposal for 10 seconds, then try again.", "Normal"], ["Fridge not cold", "Check the dial isn't on 0 and the vents inside aren't blocked. Keep the door shut for 2 hours.", "High"], ["Washer or dryer", "Clean the dryer lint screen and check the washer door clicks shut.", "Normal"]] },
  { k: "power", n: "Power & lights", ic: "bolt", v: "Bright Electric", subs: [["Outlet not working", "Press RESET on the GFCI outlet in the kitchen or bathroom. Then check the breaker panel in the hall closet.", "Normal"], ["Light flickering or out", "Try a new LED bulb (E26 base). If the switch is warm, stop and tell us.", "Normal"]] },
  { k: "lock", n: "Doors & locks", ic: "lock", v: "Keyline Locksmith", subs: [["Locked out", "Your door code works 24/7 from the app. If it doesn't, call the after-hours line: (512) 555-0100.", "Urgent"], ["Door won't latch", "Tighten the strike-plate screws on the frame with a Phillips screwdriver.", "Normal"]] },
  { k: "pest", n: "Pests", ic: "bug", v: "GreenShield Pest", subs: [["Ants or roaches", "Wipe counters and seal food. Our quarterly pest service is Oct 21; we can add your unit.", "Normal"], ["Mice or rats", "Seal food in hard containers and note where you've seen droppings.", "High"]] },
  { k: "gas", n: "Gas smell or fire", ic: "flame", emergency: true },
  { k: "other", n: "Something else", ic: "dots", v: "Ray Alvarez (in-house)", subs: [["Something else", "", "Normal"]] },
];
function rzStage(t) {
  if (t.status === "Done") return 4;
  if ((t.rz && t.rz.stage === "enroute") || t.status === "In progress") return 3;
  if (t.status === "Scheduled") return 2;
  if (t.status === "New") return 0;
  return 1;
}
function rzStatusLine(t) {
  if (t.status === "Done") return t.confirmed ? "Fixed · you confirmed" : "Marked fixed · please confirm";
  if (t.rz && t.rz.stage === "enroute") return t.rz.tech + " is on the way · ETA " + t.rz.eta;
  if (t.status === "In progress") return "Being worked on · " + (t.vendor || "");
  if (t.status === "Scheduled") return "Scheduled · " + t.vendor;
  if (t.status === "Awaiting owner" || t.status === "On hold") return "Reviewed · waiting on the owner's OK for the quote";
  return "Sent " + (t.ts ? slRel(t.ts) : t.when) + " · a person reviews within 1 hour (8 am–8 pm)";
}
function RzTimeline({ t }) {
  const st = rzStage(t), steps = ["Sent", "Reviewed", "Scheduled", "On the way", "Fixed"];
  return html`<div class="rz-tl">${steps.map((s, i) => html`<div class=${"rz-ts" + (i < st || (i === st && i === 4) ? " done" : i === st ? " now" : "")}><i>${i < st || (st === 4 && i === 4) ? "✓" : ""}</i><span>${s}</span></div>`)}</div>`;
}
function RzFix() {
  const z = RZ(), u = rzUnit();
  const [step, setStep] = useState("pick"), [cat, setCat] = useState(null), [sub, setSub] = useState(null);
  const [desc, setDesc] = useState(""), [photos, setPhotos] = useState([]), [entry, setEntry] = useState("Enter if I'm not home"), [win, setWin] = useState("Any time 8–5"), [pet, setPet] = useState(true), [petNote, setPetNote] = useState("Cat, Miso. She hides under the bed; please keep the front door shut.");
  const [skipAi, setSkipAi] = useState(false), [tried, setTried] = useState(false), [lastId, setLastId] = useState(null);
  const mine = S.d.tickets.filter(t => (t.by === z.tenant || t.unit === z.unit) && t.status !== "Cancelled").slice().reverse();
  const reset = () => { setStep("pick"); setCat(null); setSub(null); setDesc(""); setPhotos([]); setSkipAi(false); setTried(false); };
  const descReq = cat && cat.k === "other";
  const descErr = descReq && desc.trim().length < 10 ? "Tell us what's wrong in a sentence (10+ characters) so the right person comes" : desc.length > 500 ? "Keep it under 500 characters" : "";
  const petErr = pet && !petNote.trim() ? "Add a short note about your pet, or untick the box" : "";
  function onFiles(e) { const fs = Array.from(e.target.files || []); setPhotos(photos.concat(fs.map(f => ({ name: f.name, url: URL.createObjectURL(f) })))); }
  function submit() {
    const id = "M" + (Math.max(...S.d.tickets.map(t => +t.id.slice(1))) + 1), pr = sub[2];
    const ai = skipAi ? "" : "Likely: " + sub[0].toLowerCase() + ". Priority " + pr.toLowerCase() + (pr === "Urgent" ? " (water or access issue)" : "") + ". Suggest " + cat.v + ". Resident tried the quick fix first; it didn't work.";
    up(s => {
      s.d.tickets.push({ id, unit: z.unit, title: cat.k === "other" && desc ? desc.trim().slice(0, 60) + (desc.trim().length > 60 ? "…" : "") : sub[0] + (desc ? " · " + desc.slice(0, 48) + (desc.length > 48 ? "…" : "") : ""), by: z.tenant, when: "Just now", ts: Date.now(), status: "New", priority: pr, ai, vendor: null, photo: photos.length > 0,
        rz: { entry: entry + (entry === "Enter if I'm not home" ? " · " + win : ""), pet: pet ? petNote : "No pets", photos: photos.length, human: skipAi, desc } });
      rzLog("New request: " + sub[0] + ". " + (desc || "") + " · Entry: " + entry + (pet ? " · Pet: " + petNote : "") + (photos.length ? " · " + photos.length + " photo(s)" : "") + (skipAi ? " · asked for a person, not the assistant" : ""), "Tenant app");
    });
    rzNotify("leo", "New " + pr.toLowerCase() + " request from " + P(z.tenant).name + " (" + u.name + "): " + sub[0], "pmops/tech");
    setLastId(id); setStep("done"); toast("Request sent · Leo has it" + (pr === "Urgent" ? " and treats it as urgent" : ""), slOfficeAct("Open PM ops", () => go("pmops/tech"), "pmops"));
  }
  const stepper = ["Issue", "Quick fix", "Details", "Send"], si = { pick: 0, sub: 0, fix: 1, details: 2, review: 3, done: 4 }[step];
  return html`<${RzFrame} tab="fix">
    <div class="rz-cols">
      <div class="rz-stack">
        <div class="card"><div class="hd"><h3>${step === "done" ? "Request sent" : "What needs fixing?"}</h3><span class="sp"></span>
          <a class="btn sm" href="tel:+15125550100" onClick=${() => { up(() => rzLog("Asked to talk to a person about a repair", "Tenant app")); rzNotify("leo", P(z.tenant).name + " asked to talk to a person about a repair", "inbox"); toast("Calling the maintenance desk: (512) 555-0100 · Leo also got your callback request"); }}><${Ic} n="phone" s=${13} /> Talk to a person</a></div>
          <div class="bd">
          ${step !== "done" && html`<div class="stepper rz-stepper">${stepper.map((s, i) => html`<div class=${"st" + (i < si ? " done" : i === si ? " now" : "")}><i>${i < si ? "✓" : i + 1}</i>${s}</div>`)}</div>`}
          ${step === "pick" && html`<div class="rz-tiles">${RZ_ISSUES.map(c => html`<button class=${"rz-tile" + (c.emergency ? " em" : "")} onClick=${() => { setCat(c); if (c.emergency) setStep("emergency"); else if (c.subs.length === 1) { setSub(c.subs[0]); setStep("details"); } else setStep("sub"); }}><${RzChip} n=${c.ic} tone=${c.emergency ? "red" : ""} s=${22} /><b>${c.n}</b></button>`)}</div>`}
          ${step === "emergency" && html`<div class="rz-emerg"><${RzChip} n="flame" tone="red" s=${24} /><div><b>Leave the unit now, then call.</b><p>Don't flip switches or use your phone inside. From outside, call 911 and Texas Gas Service at 1-800-959-5325. Then call our 24/7 line at (512) 555-0100 — a person answers, always.</p><div class="row"><a class="btn pri" href="tel:911">Call 911</a><button class="btn" onClick=${reset}>Back</button></div></div></div>`}
          ${step === "sub" && html`<div class="rz-subs"><button class="btn sm ghost" onClick=${reset}>← ${cat.n}</button>${cat.subs.map(sb => html`<button class="rz-subbtn" onClick=${() => { setSub(sb); setStep(sb[1] ? "fix" : "details"); }}><${RzChip} n=${cat.ic} s=${16} /><span>${sb[0]}</span>${sb[2] === "Urgent" ? html`<span class="pill r">Urgent</span>` : ""}<span style="margin-left:auto">›</span></button>`)}</div>`}
          ${step === "fix" && html`<div class="rz-fixit"><div class="lbl">Try this first · it fixes about 1 in 5 of these</div><div class="rz-tip"><${RzChip} n=${cat.ic} tone="green" s=${22} /><p>${sub[1]}</p></div>
            <b>Did this fix it?</b><div class="row" style="flex-wrap:wrap"><button class="btn pri" onClick=${() => { up(() => { z.selfFixed++; }); toast("Great, no visit needed. We noted it in case it comes back."); reset(); }}>Yes, it's fixed</button><button class="btn" onClick=${() => setStep("details")}>No, still broken</button><button class="btn ghost" onClick=${() => setStep("details")}>Skip this step</button></div></div>`}
          ${step === "details" && html`<div class="rz-form">
            <div class="row"><${RzChip} n=${cat.ic} s=${16} /><b>${sub[0]}</b><button class="btn sm ghost" onClick=${reset}>Change</button></div>
            <label class=${"field" + (tried && descErr ? " sl-bad" : "")}><span>What's going on? ${descReq ? "(required)" : "(optional)"}</span><textarea rows="3" maxlength="600" placeholder="e.g. started last night, drips every few seconds" value=${desc} aria-invalid=${!!(tried && descErr)} onInput=${e => setDesc(e.target.value)}></textarea>${tried ? html`<${SlErr} m=${descErr} />` : ""}</label>
            <div class="field"><span>Photos or video</span><div class="rz-photos">${photos.map((p, i) => html`<span class="rz-ph-th"><img src=${p.url} alt=${p.name} /><button aria-label=${"Remove " + p.name} title="Remove" onClick=${() => setPhotos(photos.filter((x, k) => k !== i))}>✕</button></span>`)}<label class="rz-add"><${Ic} n=${RZI.cam} s=${20} /><small>Add</small><input type="file" accept="image/*,video/*" multiple onChange=${onFiles} aria-label="Add photos" /></label></div></div>
            <div class="field"><span>Can we come in if you're out?</span><div class="seg rz-seg">${["Enter if I'm not home", "Call me first", "Only when I'm home"].map(x => html`<button class=${entry === x ? "on" : ""} onClick=${() => setEntry(x)}>${x}</button>`)}</div></div>
            ${entry === "Enter if I'm not home" && html`<div class="row" style="gap:6px;flex-wrap:wrap">${["Any time 8–5", "Mornings", "Afternoons"].map(x => html`<button class=${"chip" + (win === x ? " on" : "")} onClick=${() => setWin(x)}>${x}</button>`)}</div>`}
            <label class="row" style="gap:8px"><input type="checkbox" checked=${pet} onChange=${e => setPet(e.target.checked)} /><span>There's a pet at home</span></label>
            ${pet && html`<label class=${"field" + (tried && petErr ? " sl-bad" : "")}><span>Note for the technician</span><input value=${petNote} maxlength="160" onInput=${e => setPetNote(e.target.value)} />${tried ? html`<${SlErr} m=${petErr} />` : ""}</label>`}
            <button class="btn pri" onClick=${() => { setTried(true); if (!descErr && !petErr) setStep("review"); }}>Continue</button></div>`}
          ${step === "review" && html`<div class="rz-form">
            <div class="sheet" style="font-size:13px"><div class="ln"><span>Issue</span><b>${sub[0]}</b></div><div class="ln"><span>Photos</span><span>${photos.length || "None"}</span></div><div class="ln"><span>Entry</span><span>${entry}</span></div><div class="ln"><span>Pet</span><span>${pet ? "Yes" : "No"}</span></div></div>
            <div class=${"ai rz-ai" + (skipAi ? " off" : "")}><div class="row"><span class="lbl">Assistant's read (optional)</span><span class="sp" style="flex:1"></span><label class="row" style="gap:6px;font-size:12.5px"><input type="checkbox" checked=${skipAi} onChange=${e => setSkipAi(e.target.checked)} />Skip the assistant, a person reviews it</label></div>
              ${skipAi ? html`<div style="margin-top:6px">No AI on this one. Leo or the on-call coordinator reads it within 1 hour and calls you if anything's unclear.</div>`
              : html`<div style="margin-top:6px">Sounds like <b>${sub[0].toLowerCase()}</b>. I'd mark it <b>${sub[2].toLowerCase()}</b> and suggest <b>${cat.v}</b>. A person still approves the dispatch.</div><div class="muted" style="font-size:11.5px;margin-top:4px">Why: matched your issue and the quick fix you tried. Logged with the request.</div>`}</div>
            <div class="row"><button class="btn" onClick=${() => setStep("details")}>Back</button><button class="btn pri" onClick=${submit}>Send request</button></div></div>`}
          ${step === "done" && html`<div class="rz-form"><div class="row"><${RzChip} n="check" tone="green" /><div><b>Leo has it.</b><div class="muted">${sub && sub[2] === "Urgent" ? "Urgent requests get a call back within 1 hour." : "A person reviews it within 1 hour (8 am–8 pm)."} You'll get a text at every step, and the technician's ETA on the day.</div></div></div>
            <div class="row" style="flex-wrap:wrap"><button class="btn pri" onClick=${() => { const el = document.getElementById("rz-req-" + lastId); el && el.scrollIntoView({ behavior: "smooth", block: "center" }); }}>Track this request</button><button class="btn" onClick=${reset}>Report something else</button><button class="btn ghost" onClick=${() => go("tenant/home")}>Back to home</button></div></div>`}
          </div></div>
      </div>
      <div class="rz-stack">
        <div class="card"><div class="hd"><h3>Your requests</h3><span class="sp"></span><span class="muted" style="font-size:12px">${mine.filter(t => !(t.status === "Done" && t.confirmed)).length} open</span></div>
          ${!mine.length ? html`<div class="sl-empty"><b>No requests yet</b><span class="muted">Anything you report shows up here with live status.</span></div>` : ""}
          ${mine.map(t => html`<div class=${"rz-req" + (t.id === lastId ? " rz-new" : "")} id=${"rz-req-" + t.id}><div class="row"><b style="flex:1">${t.title}</b>${t.priority === "Urgent" ? html`<span class="pill r">Urgent</span>` : ""}</div>
            <div class="muted" style="font-size:12.5px;margin:2px 0 8px">${rzStatusLine(t)}</div><${RzTimeline} t=${t} />
            ${t.rz && t.rz.stage === "enroute" && t.status !== "Done" ? html`<div class="rz-eta"><${Av} a=${{ ini: t.rz.tech.split(" ").map(w => w[0]).slice(0, 2).join(""), color: "#2F5F8F" }} /><div style="flex:1"><b>${t.rz.tech}</b><div class="muted" style="font-size:12px">Arriving about ${t.rz.eta} · ${t.rz.entry || ""}</div></div><span class="pill b">On the way</span></div>` : ""}
            ${t.status === "New" && t.by === z.tenant ? html`<div style="margin-top:8px"><${SlConfirm} cls="btn sm ghost" label="Cancel request" text="Cancel this request? Leo is told it's no longer needed." yes="Cancel request" danger onYes=${() => { up(() => { t.status = "Cancelled"; rzLog("Cancelled my request: " + t.title, "Tenant app"); }); rzNotify("leo", P(z.tenant).name + " cancelled: " + t.title, "pmops/tech"); toast("Request cancelled", ["Undo", () => up(() => { t.status = "New"; rzLog("Actually, I still need this: " + t.title, "Tenant app"); })]); }} /></div>` : ""}
            ${t.status === "Done" && !t.confirmed ? html`<div class="row" style="margin-top:8px;flex-wrap:wrap"><span style="font-size:13px">Is it really fixed?</span><button class="btn sm pri" onClick=${() => { up(() => { t.confirmed = true; rzLog("Confirmed fixed: " + t.title, "Tenant app"); }); toast("Thanks! Closed for good."); }}>Yes, fixed</button><button class="btn sm" onClick=${() => { up(() => { t.status = "New"; t.confirmed = false; t.rz = Object.assign({}, t.rz, { stage: "" }); t.when = "Reopened today"; rzLog("Not fixed yet: " + t.title + " · reopened by the resident", "Tenant app"); }); rzNotify("leo", P(z.tenant).name + " says it's not fixed: " + t.title, "pmops/tech"); toast("Reopened · Leo was notified"); }}>Not fixed</button></div>` : ""}
          </div>`)}</div>
        <div class="card"><div class="bd" style="font-size:12.5px;color:var(--ink-2)"><b>Emergencies, any hour:</b> (512) 555-0100. A person answers. No chatbot in the way.</div></div>
      </div>
    </div></${RzFrame}>`;
}

// ---------- lease & documents ----------
function RzLease() {
  const z = RZ(), u = rzUnit();
  const [term, setTerm] = useState(12), [mo, setMo] = useState("2027-04-30"), [fwd, setFwd] = useState(""), [why, setWhy] = useState("Buying a home");
  const [ins, setIns] = useState("own"), [carrier, setCarrier] = useState("State Farm"), [pol, setPol] = useState(""), [file, setFile] = useState(""), [agree, setAgree] = useState(false);
  const [moStep, setMoStep] = useState("form"), [moTried, setMoTried] = useState(false), [insTried, setInsTried] = useState(false);
  const terms = [[6, u.rent + 70, "Aug 31, 2027"], [12, u.rent, "Apr 30, 2028"], [18, u.rent - 15, "Oct 31, 2028"]];
  const sel = terms.find(t => t[0] === term);
  const moD = rzParse(mo), rule = RZ_RULES.TX, noticeOk = rzDays(RZ_TODAY, moD) >= 30;
  const dateErr = !noticeOk ? "That's less than 30 days away. Pick " + rzFmtY(rzAdd(RZ_TODAY, 30)) + " or later, or message Leo about an early release." : rzDays(RZ_TODAY, moD) > 400 ? "Pick a date within the next 13 months" : "";
  const fwdErr = !fwd.trim() ? "We need a forwarding address to send your deposit" : !/\b\d{5}(-\d{4})?\b/.test(fwd) || fwd.trim().length < 12 ? "Include the street, city and 5-digit ZIP" : "";
  const polErr = !pol.trim() ? "Enter the policy number from your declarations page" : !/^[A-Za-z0-9-]{5,24}$/.test(pol.trim()) ? "Letters, numbers and dashes only (5–24)" : "";
  const carErr = !carrier.trim() ? "Who's the insurer?" : "";
  const fileErr = !file ? "Attach the declarations page" : "";
  const docs = [["Lease · Eastside Lofts 3B", "12 months, May 1, 2026 – Apr 30, 2027 · rent $1,750 due the 1st · late fee $75 after the 3rd · 30 days' written notice to move out."], ["Move-in inspection · Apr 30, 2026", "38 photos, room by room. Signed by you and Leo. Used to settle the deposit fairly at move-out."], ["Pet addendum · Miso (cat)", "One cat, no pet rent, $250 refundable pet deposit included in your deposit."], ["Texas tenant rights summary", "Repairs (§92.056), deposit return in 30 days (§92.103), late fees only after rent is 2 full days late (§92.019)."]];
  function moveOut() {
    if (dateErr || fwdErr) return;
    up(s => { z.moveout = { date: mo, fwd, why }; s.d.rz.deposits.push({ id: "DP" + (s.d.rz.deposits.length + 1), unit: z.unit, tenant: P(z.tenant).name, deposit: z.lease.deposit, moved: mo, state: "TX", fwd, status: "Upcoming", items: [] }); rzLog("Move-out notice: moving out " + rzFmtY(moD) + " (" + why + "). Forwarding address: " + fwd, "Tenant app"); });
    rzNotify("leo", P(z.tenant).name + " gave notice: moving out of " + u.name + " on " + rzFmtY(moD), "pmops/deposits");
    setMoStep("form");
    toast("Notice sent · Leo will offer a pre-move-out inspection");
  }
  return html`<${RzFrame} tab="lease">
    <div class="rz-cols">
      <div class="rz-stack">
        <div class="card"><div class="hd"><h3>Renew your lease</h3><span class="sp"></span>${z.renewal ? html`<span class="pill g">Signed</span>` : html`<span class="pill f">Offer until Nov 30</span>`}</div><div class="bd rz-form">
          ${z.renewal ? html`<div class="row"><${RzChip} n="check" tone="green" /><div><b>${z.renewal.term} at ${usd(z.renewal.rent)}/mo, through ${z.renewal.end}</b><div class="muted" style="font-size:12.5px">Signed Oct 8 · countersigned by Leo · in your documents</div></div></div>`
          : z.moveout ? html`<div class="muted">You've given notice, so renewal is closed. Changed your mind? Message Leo.</div>`
          : html`<div class="rz-terms">${terms.map(([m, r, end]) => html`<button class=${"rz-term" + (term === m ? " on" : "")} onClick=${() => setTerm(m)}><b>${m} months</b><span class="num">${usd(r)}/mo</span><small>to ${end}</small>${m === 12 ? html`<em>Same rent</em>` : ""}</button>`)}</div>
            <div class="muted" style="font-size:12.5px">No renewal fee. Your deposit carries over. Rent is the only number that changes.</div>
            <button class="btn pri" onClick=${() => up(s => { s.modal = { kind: "rzSign", term: sel[0], rent: sel[1], end: sel[2] }; })}>Review & e-sign</button>`}
        </div></div>
        <div class="card"><div class="hd"><h3>Renters insurance</h3><span class="sp"></span>${z.insurance.status === "missing" ? html`<span class="pill a">Needed by ${z.insurance.due}</span>` : html`<span class="pill g">On file</span>`}</div><div class="bd rz-form">
          ${z.insurance.status !== "missing" ? html`<div class="row"><${RzChip} n="shield" tone="green" /><div style="flex:1"><b>${z.insurance.carrier} · ${z.insurance.policy}</b><div class="muted" style="font-size:12.5px">${z.insurance.partner ? "Partner policy · $11.40/mo, billed by the insurer, cancel any time" : "Your own policy · verified Oct 8 · $100k liability ✓"}</div></div><button class="btn sm" onClick=${() => { const prev = z.insurance; up(() => { z.insurance = { status: "missing", due: "Nov 1", carrier: "", policy: "", partner: false }; }); setInsTried(false); toast("Upload the new policy below", ["Undo", () => up(() => { z.insurance = prev; })]); }}>Replace</button></div>`
          : html`<div class="muted" style="font-size:13px">Your lease asks for $100,000 of liability cover. Use any insurer you like. We'll never add a policy to your bill without your OK.</div>
            <div class="seg">${[["own", "Upload my own policy"], ["partner", "Get a partner quote"]].map(([k, l]) => html`<button class=${ins === k ? "on" : ""} onClick=${() => setIns(k)}>${l}</button>`)}</div>
            ${ins === "own" ? html`<div class="rz-form">
              <div class="row" style="gap:10px;flex-wrap:wrap"><label class=${"field" + (insTried && carErr ? " sl-bad" : "")} style="flex:1;min-width:140px"><span>Insurer</span><input value=${carrier} maxlength="60" onInput=${e => setCarrier(e.target.value)} /></label><label class=${"field" + (insTried && polErr ? " sl-bad" : "")} style="flex:1;min-width:140px"><span>Policy number</span><input value=${pol} maxlength="24" placeholder="e.g. 43-BX-9921" aria-invalid=${!!(insTried && polErr)} onInput=${e => setPol(e.target.value)} /></label></div>
              <label class=${"rz-drop" + (insTried && fileErr ? " sl-bad-in" : "")}><${Ic} n=${RZI.doc} s=${18} /><span>${file || "Declarations page (PDF or photo)"}</span><input type="file" accept=".pdf,image/*" onChange=${e => setFile((e.target.files[0] || {}).name || "")} aria-label="Upload policy" /></label>
              ${insTried && (carErr || polErr || fileErr) ? html`<${SlErr} m=${[carErr, polErr, fileErr].filter(Boolean).join(" · ")} />` : ""}
              <button class="btn pri" onClick=${() => { setInsTried(true); if (carErr || polErr || fileErr) return; up(() => { z.insurance = { status: "on", carrier: carrier.trim(), policy: pol.trim(), partner: false }; rzLog("Uploaded renters insurance: " + carrier + " " + pol, "Tenant app"); }); rzNotify("leo", P(z.tenant).name + " uploaded renters insurance (" + carrier.trim() + ")", "rentals"); toast("Policy on file · nothing added to your bill"); }}>Submit my policy</button></div>`
            : html`<div class="rz-form"><div class="sheet" style="font-size:13px"><div class="ln"><span>Liability</span><span>$100,000</span></div><div class="ln"><span>Your belongings</span><span>$15,000</span></div><div class="ln"><span>Deductible</span><span>$250</span></div><div class="ln tot"><span>Monthly</span><span>$11.40</span></div></div>
              <div class="muted" style="font-size:12px">From Harbor & Vine's insurance partner. Optional: your own policy works just as well. Harbor & Vine earns a small referral fee if you choose this.</div>
              <label class="row" style="gap:8px;font-size:13px"><input type="checkbox" checked=${agree} onChange=${e => setAgree(e.target.checked)} />I want this policy and agree to be billed $11.40/mo by the insurer</label>
              <button class="btn pri" disabled=${!agree} onClick=${() => { up(() => { z.insurance = { status: "on", carrier: "Partner policy", policy: "HVR-" + 77120, partner: true }; }); toast("Covered from today · billed by the insurer, not added to rent"); }}>Buy policy</button></div>`}`}
        </div></div>
        <div class="card"><div class="hd"><h3>Documents</h3></div><div class="feed">${docs.concat(z.renewal ? [["Lease renewal · signed Oct 8", z.renewal.term + " at " + usd(z.renewal.rent) + "/mo through " + z.renewal.end + "."]] : []).map(([t, b]) => html`<button class="it rz-rowbtn" onClick=${() => rzOpenDoc(t, b, "Eastside Lofts 3B")}><${RzChip} n="doc" s=${15} /><span style="flex:1;text-align:left"><b style="font-size:13px">${t}</b></span><span class="muted">View</span></button>`)}</div></div>
      </div>
      <div class="rz-stack">
        <div class="card"><div class="hd"><h3>Moving out?</h3></div><div class="bd rz-form">
          ${z.moveout ? html`<div class="rz-mo">${(() => { const md = rzParse(z.moveout.date); return [[RZ_TODAY, "Notice given", "Today, in writing", true], [rzAdd(md, -14), "Pre-move-out walkthrough", "Leo points out anything that could cost you, so you can fix it first", false], [md, "Move-out & keys", "Return 2 keys and 1 fob to the office", false], [rzAdd(md, 30), "Deposit back by", "Itemized list of any deductions, refund to " + z.moveout.fwd.split(",")[0], false]]; })().map(([d, t, s, ok]) => html`<div class=${"rz-moi" + (ok ? " ok" : "")}><span class="num">${rzFmt(d)}</span><i></i><div><b>${t}</b><small>${s}</small></div></div>`)}</div>
            <div class="rz-rule"><${RzChip} n="scale" s=${15} /><div><b>${rule.name}: ${rule.days} days</b> ${rule.from}. ${rule.cite}.</div></div>`
          : html`<div class="muted" style="font-size:13px">Your lease needs 30 days' written notice. This form is that notice.</div>
            ${moStep === "confirm" ? html`<div class="rz-confirm"><div class="lbl">Check your notice</div><div class="sheet" style="font-size:13px"><div class="ln"><span>Move-out date</span><b>${rzFmtY(moD)}</b></div><div class="ln"><span>Forwarding address</span><span>${fwd}</span></div><div class="ln"><span>Reason</span><span>${why}</span></div><div class="ln"><span>Deposit back by</span><span>${rzFmtY(rzAdd(moD, rule.days))}</span></div></div>
              <div class="muted" style="font-size:12.5px">This is your written notice under the lease. Once sent, renewal closes; changing your mind needs Leo's OK.</div>
              <div class="row" style="flex-wrap:wrap"><button class="btn" onClick=${() => setMoStep("form")}>Edit</button><button class="btn pri" onClick=${moveOut}>Send notice to move out</button></div></div>` : html`
            <label class=${"field" + (dateErr ? " sl-bad" : "")}><span>Move-out date</span><input type="date" value=${mo} min=${rzISO(RZ_TODAY)} aria-invalid=${!!dateErr} onInput=${e => e.target.value && setMo(e.target.value)} /><${SlErr} m=${dateErr} /></label>
            <label class=${"field" + (moTried && fwdErr ? " sl-bad" : "")}><span>Forwarding address (needed for your deposit)</span><input value=${fwd} maxlength="120" placeholder="Street, city, ZIP" aria-invalid=${!!(moTried && fwdErr)} onInput=${e => setFwd(e.target.value)} onBlur=${() => fwd && setMoTried(true)} />${moTried ? html`<${SlErr} m=${fwdErr} />` : ""}</label>
            <label class="field"><span>Reason (optional)</span><select value=${why} onChange=${e => setWhy(e.target.value)}>${["Buying a home", "Moving for work", "Need more space", "Cost", "Other"].map(x => html`<option>${x}</option>`)}</select></label>
            <div class="rz-depo"><div class="lbl">Your deposit, step by step</div>
              <div class="rz-mo">${[[moD, "You move out", ""], [rzAdd(moD, rule.days), "Deposit back by " + rzFmtY(rzAdd(moD, rule.days)), "Full " + usd(z.lease.deposit) + " minus itemized damage beyond normal wear"]].map(([d, t, s]) => html`<div class="rz-moi"><span class="num">${rzFmt(d)}</span><i></i><div><b>${t}</b><small>${s}</small></div></div>`)}</div>
              <div class="rz-rule"><${RzChip} n="scale" s=${15} /><div><b>Texas: ${rule.days} days</b> ${rule.from}. Elsewhere it differs: California ${RZ_RULES.CA.days} days, England ${RZ_RULES.UK.days} days after the amount is agreed.</div></div></div>
            <button class="btn pri" disabled=${!!dateErr} onClick=${() => { setMoTried(true); if (!dateErr && !fwdErr) setMoStep("confirm"); }}>Review notice</button>`}`}
        </div></div>
      </div>
    </div></${RzFrame}>`;
}
function RzSignModal({ m, close }) {
  const z = RZ(), p = P(z.tenant); const [signed, setSigned] = useState(false);
  slEsc(close);
  function done() {
    up(s => { z.renewal = { term: m.term + " months", rent: m.rent, end: m.end }; const u = rzUnit(); u.end = m.end.replace(/^(\w+) \d+, 20(\d\d)$/, "$1 $2"); if (u.status === "Renewal") u.status = "Paid"; rzLog("Signed a " + m.term + "-month renewal at " + usd(m.rent) + "/mo through " + m.end, "Tenant app"); s.d.activity.push([z.tenant, "Rentals", "Renewed 3B Eastside Lofts · " + m.term + " months at " + usd(m.rent), "Oct 8"]); s.modal = null; });
    rzNotify("leo", p.name + " signed a " + m.term + "-month renewal at " + usd(m.rent) + "/mo · countersign today", "rentals");
    toast("Renewal signed · Leo countersigns today and the new lease is in your documents");
  }
  return html`<div class="scrim" onClick=${e => { if (e.target.classList.contains("scrim")) close(); }}><div class="modal" role="dialog" aria-modal="true">
    <div class="hd"><h3>Lease renewal</h3><button class="btn sm ghost" aria-label="Close" title="Close (Esc)" onClick=${close}>✕</button></div>
    <div class="bd"><div class="doc"><h4>Renewal addendum · Eastside Lofts 3B</h4><div>${p.name} renews the lease at 1100 E 6th St, Unit 3B, Austin, TX for <b>${m.term} months</b>, starting May 1, 2027 and ending <b>${m.end}</b>.</div><div>Monthly rent: <b>${usd(m.rent)}</b>, due the 1st. All other terms of the current lease continue. No renewal fee.</div><div style="font-size:11.5px">Landlord: Brooks Holdings LLC, by Harbor & Vine Realty as managing agent.</div></div>
      <div class="sig">${signed ? html`<span class="ink">${p.name}</span>` : html`<span class="muted">Tap to sign</span>`}<button class="btn sm brass" onClick=${() => setSigned(true)}>${signed ? "Signed ✓" : "Sign here"}</button></div></div>
    <div class="ft"><button class="btn" onClick=${close}>Cancel</button><button class="btn pri" disabled=${!signed} onClick=${done}>Sign renewal</button></div></div></div>`;
}
function RzDocModal({ m, close }) {
  slEsc(close);
  const fname = m.title.replace(/[^\w]+/g, "-").replace(/^-|-$/g, "") + ".html";
  const body = "<!doctype html><meta charset=utf-8><title>" + m.title + "</title><body style='font-family:Georgia,serif;max-width:640px;margin:40px auto;color:#16201B'><p>Harbor & Vine Realty · " + (m.meta || "Document") + "</p><h1>" + m.title + "</h1><p>" + m.body + "</p></body>";
  return html`<div class="scrim" onClick=${e => { if (e.target.classList.contains("scrim")) close(); }}><div class="modal" role="dialog" aria-modal="true" aria-label=${m.title}>
    <div class="hd"><h3>${m.title}</h3><button class="btn sm ghost" aria-label="Close" title="Close (Esc)" onClick=${close}>✕</button></div>
    <div class="bd"><div class="doc"><h4>${m.meta || "Document"}</h4><div>${m.body}</div></div></div>
    <div class="ft"><button class="btn" onClick=${() => slDownload(fname, body, "text/html")}>Download</button><button class="btn pri" onClick=${close}>Close</button></div></div></div>`;
}

// ---------- messages & notices ----------
function RzMessages() {
  const z = RZ(), t = rzT5(), [d, setD] = useState(""), box = useRef(), leo = A("leo");
  slTick(30000);
  useEffect(() => { if (box.current) box.current.scrollTop = 9e9; });
  useEffect(() => { if (z.notices.some(n => !n.read)) setTimeout(() => up(() => z.notices.forEach(n => { n.read = true; })), 1500); }, []);
  function send() { if (!d.trim()) return; const txt = d.trim(); up(() => rzLog(txt, "Tenant app")); setD(""); rzNotify("leo", P(z.tenant).name + ": " + (txt.length > 70 ? txt.slice(0, 70) + "…" : txt), "inbox/" + t.id); setTimeout(() => up(() => rzReply("Thanks " + rzTenantFirst() + ", got it. I'll get back to you today. – " + leo.name.split(" ")[0])), 1200); }
  return html`<${RzFrame} tab="messages"><div class="rz-cols">
    <div class="card pt-chat rz-chat"><div class="hd"><h3>You and ${leo.name}</h3><span class="sp"></span><span class="muted" style="font-size:12px">Every message is kept here, with dates</span></div>
      <div class="msgs" ref=${box}>${t.msgs.map(m => html`<div class=${"msg " + (m.from === "them" ? "me" : "")}>${m.text}${m.photo ? html`<div class="ph"></div>` : ""}<small>${m.from === "them" ? "You" : m.from === "ai" ? "Assistant (reviewed by " + leo.name.split(" ")[0] + ")" : leo.name} · ${slMsgAt(m)}</small></div>`)}${!t.msgs.length ? html`<div class="empty">No messages yet.</div>` : ""}</div>
      <div class="composer"><textarea placeholder="Message Leo…" aria-label="Message Leo" maxlength="1000" value=${d} onInput=${e => setD(e.target.value)} onKeyDown=${e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}></textarea><div class="row"><span class="muted" style="font-size:12px">Disputing a charge? Say so here: it's tracked until it's resolved.</span><span style="flex:1"></span><button class="btn pri sm" disabled=${!d.trim()} onClick=${send}>Send</button></div></div></div>
    <div class="card"><div class="hd"><h3>Building notices</h3></div><div class="feed">${z.notices.map(n => html`<div class="it"><${RzChip} n=${n.kind === "warn" ? "bell" : "doc"} tone=${n.kind === "warn" ? "amber" : ""} s=${15} /><div style="flex:1"><b style="font-size:13px">${n.t}</b><div class="muted" style="font-size:12.5px">${n.s}</div></div><span class="muted" style="font-size:11.5px">${n.when}</span></div>`)}</div></div>
  </div></${RzFrame}>`;
}
function RzPackages() {
  const z = RZ(), waiting = z.packages.filter(k => !k.picked);
  const [open, setOpen] = useState(false), [f, setF] = useState({ carrier: "Wayfair", what: "", day: "Oct 12" }), [tried, setTried] = useState(false);
  const whatErr = f.what.trim().length < 3 ? "What's coming? e.g. sofa, 2 boxes" : "";
  function hold() {
    setTried(true); if (whatErr) return;
    const k = { id: "K" + (z.packages.length + 1), carrier: f.carrier, what: "Expected · " + f.what.trim(), where: "Front desk will hold it", when: "Arriving " + f.day, picked: false };
    up(() => { z.packages.unshift(k); rzLog("Heads-up for the front desk: " + f.carrier + " delivery (" + f.what.trim() + ") arriving " + f.day + ".", "Tenant app"); });
    setOpen(false); setTried(false); setF({ carrier: "Wayfair", what: "", day: "Oct 12" });
    toast("Front desk will hold your " + k.carrier + " delivery", ["Undo", () => up(() => { z.packages = z.packages.filter(x => x !== k); })]);
  }
  return html`<${RzFrame} tab="packages"><div class="rz-cols">
    <div class="card"><div class="hd"><h3>Packages</h3><span class="sp"></span><span class=${"pill " + (waiting.length ? "b" : "g")}>${waiting.length ? waiting.length + " waiting" : "All picked up"}</span></div>
      ${!z.packages.length ? html`<div class="sl-empty"><span class="rz-chip"><${Ic} n=${RZI.box} s=${18} /></span><b>No packages</b><span class="muted">When something arrives you'll get a text with the locker code.</span></div>` : ""}
      ${z.packages.length > 0 && !waiting.length ? html`<div class="rz-allclear"><${RzChip} n="check" tone="green" s=${15} /><span>Nothing waiting for you right now.</span></div>` : ""}
      <div class="feed">${z.packages.map(k => html`<div class=${"it rz-pkg" + (k.picked ? " done" : "")}><${RzChip} n="box" tone=${k.picked ? "" : "blue"} s=${16} /><div style="flex:1"><b style="font-size:13px">${k.carrier} · ${k.what}</b><div class="muted" style="font-size:12.5px">${k.where} · ${k.when}</div></div>${k.picked ? html`<span class="pill g">Picked up</span>` : html`<button class="btn sm pri" onClick=${() => { up(() => { k.picked = true; }); toast(k.carrier + " package marked picked up", ["Undo", () => up(() => { k.picked = false; })]); }}>Picked up</button>`}</div>`)}</div></div>
    <div class="card"><div class="hd"><h3>Expecting something big?</h3></div><div class="bd rz-form"><div class="muted" style="font-size:13px">Furniture or anything over 50 lb goes to the package room. Tell the front desk so they can hold it.</div>
      ${open ? html`<div class="row" style="gap:10px;flex-wrap:wrap"><label class="field" style="flex:1;min-width:120px"><span>Carrier</span><select value=${f.carrier} onChange=${e => setF({ ...f, carrier: e.target.value })}>${["Wayfair", "IKEA", "Amazon", "Costco", "UPS Freight", "Other"].map(x => html`<option>${x}</option>`)}</select></label><label class="field" style="flex:1;min-width:120px"><span>Arriving</span><select value=${f.day} onChange=${e => setF({ ...f, day: e.target.value })}>${["Oct 9", "Oct 10", "Oct 12", "Oct 13", "Oct 15"].map(x => html`<option>${x}</option>`)}</select></label></div>
        <label class=${"field" + (tried && whatErr ? " sl-bad" : "")}><span>What is it?</span><input value=${f.what} maxlength="80" placeholder="e.g. sofa, 2 boxes" onInput=${e => setF({ ...f, what: e.target.value })} onKeyDown=${e => { if (e.key === "Enter") hold(); }} />${tried ? html`<${SlErr} m=${whatErr} />` : ""}</label>
        <div class="row"><button class="btn" onClick=${() => { setOpen(false); setTried(false); }}>Cancel</button><button class="btn pri" onClick=${hold}>Ask the desk to hold it</button></div>`
      : html`<button class="btn" onClick=${() => setOpen(true)}>Tell the front desk</button>`}</div></div>
  </div></${RzFrame}>`;
}

// ================= OWNER PORTAL =================
const RZ_MONTHS = ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"];
function rzOwnerNums() {
  const units = S.d.units.filter(u => u.b === "B1");
  const occ = units.filter(u => u.tenant), collected = units.filter(u => u.status === "Paid" || u.status === "Renewal").reduce((a, u) => a + u.rent, 0);
  const approved = S.d.tickets.filter(t => t.approval === "approved").reduce((a, t) => a + (t.quote || 0), 0);
  const exp = 2140 + Math.round(collected * 0.08) + approved;
  const inc = [18900, 19100, 18750, 19400, 19650, 20100, 20400, 20400, 19950, 20380, 18750, collected];
  const ex = [5100, 5600, 4900, 6900, 5200, 5400, 7800, 5300, 5150, 6100, 5312, exp];
  return { units, occ, collected, exp, inc, ex, potential: occ.reduce((a, u) => a + u.rent, 0) };
}
function RzBars({ inc, ex }) {
  const [hv, setHv] = useState(null);
  const W = 620, H = 210, pad = 34, max = 22000, bw = 15, step = (W - pad - 8) / 12, y = v => H - 22 - (v / max) * (H - 40);
  return html`<div class="rz-chart"><div class="rz-legend"><span><i style="background:#1F7A55"></i>Income</span><span><i style="background:#C08A3A"></i>Expenses</span><span class="muted">Hover a month for details</span></div>
    <svg viewBox=${"0 0 " + W + " " + H} role="img" aria-label="Monthly income and expenses, Nov 2025 to Oct 2026">
      ${[0, 5000, 10000, 15000, 20000].map(v => html`<g><line x1=${pad} x2=${W} y1=${y(v)} y2=${y(v)} stroke="#ECE7DC" stroke-width="1" /><text x=${pad - 6} y=${y(v) + 3} text-anchor="end" font-size="9.5" fill="#8A918A">${v ? "$" + v / 1000 + "k" : "0"}</text></g>`)}
      ${inc.map((v, i) => { const x = pad + 6 + i * step; return html`<g>
        <rect x=${x} y=${y(v)} width=${bw} height=${H - 22 - y(v)} rx="3" fill="#1F7A55" opacity=${hv === null || hv === i ? 1 : .45} />
        <rect x=${x + bw + 2} y=${y(ex[i])} width=${bw} height=${H - 22 - y(ex[i])} rx="3" fill="#C08A3A" opacity=${hv === null || hv === i ? 1 : .45} />
        <text x=${x + bw + 1} y=${H - 7} text-anchor="middle" font-size="10" fill=${i === 11 ? "#16201B" : "#8A918A"} font-weight=${i === 11 ? 600 : 400}>${RZ_MONTHS[i]}</text>
        <rect x=${x - 4} y="0" width=${step} height=${H} fill="transparent" onMouseEnter=${() => setHv(i)} onMouseLeave=${() => setHv(null)} /></g>`; })}
      ${(() => { const i = 11, x = pad + 6 + i * step; return html`<text x=${x + bw / 2} y=${y(inc[i]) - 5} text-anchor="middle" font-size="9.5" fill="#16201B">${short(inc[i])}</text>`; })()}
    </svg>
    ${hv !== null && html`<div class="rz-tip2" style=${"left:" + Math.min(78, ((pad + 6 + hv * step) / W) * 100) + "%"}><b>${RZ_MONTHS[hv]} ${hv < 2 ? "2025" : "2026"}${hv === 11 ? " · to date" : ""}</b><div><i style="background:#1F7A55"></i>Income ${usd(inc[hv])}</div><div><i style="background:#C08A3A"></i>Expenses ${usd(ex[hv])}</div><div>NOI <b>${usd(inc[hv] - ex[hv])}</b></div></div>`}
  </div>`;
}
function RzOwner() {
  const v = { home: RzOwnerHome, statement: RzStatement, approvals: RzApprovals, docs: RzOwnerDocs, payouts: RzPayouts }[S.route.id || "home"] || RzOwnerHome;
  return html`<${v} />`;
}
function RzOwnerHome() {
  const z = RZ(), o = z.owner, n = rzOwnerNums(), pend = o.approvals.filter(a => a.status === "pending");
  const ytdInc = n.inc.slice(2).reduce((a, b) => a + b, 0), ytdEx = n.ex.slice(2).reduce((a, b) => a + b, 0);
  return html`<${RzFrame} tab="home" owner>
    <div class="pt-hero"><div><div class="lbl">Eastside Lofts · 1100 E 6th St · 12 units</div><h1>Good morning, Aisha & Daniel.</h1></div>
      ${(() => { const nx = o.payouts.find(x => x[3] === "Scheduled"); return nx ? html`<div class="pt-budget"><span>Next distribution · ${nx[0]}</span><b class="num">${usd(nx[2])}</b><small>to Brooks Holdings •• 2210</small></div>` : ""; })()}</div>
    ${pend.length ? html`<button class="rz-banner rz-bannerbtn" onClick=${() => go("owner/approvals")}><${RzChip} n="bell" tone="amber" /><div style="flex:1;text-align:left"><b>${pend.length} ${pend.length === 1 ? "decision needs" : "decisions need"} you</b><div>${pend.map(a => a.t).join(" · ")}</div></div><span class="btn sm pri">Review</span></button>` : ""}
    <div class="kpis rz-kpis">
      <div class="kpi"><span>Income · Oct to date</span><b class="num">${usd(n.collected)}</b><small class="muted">of ${usd(n.potential)} rent due</small></div>
      <div class="kpi"><span>Expenses · Oct</span><b class="num">${usd(n.exp)}</b><small class="muted">incl. 8% management</small></div>
      <div class="kpi"><span>NOI · year to date</span><b class="num">${usd(ytdInc - ytdEx)}</b><small class="muted">${Math.round((ytdInc - ytdEx) / ytdInc * 100)}% margin</small></div>
      <div class="kpi"><span>Occupancy</span><b class="num">${Math.round(n.occ.length / n.units.length * 100)}%</b><div class="rz-cells">${n.units.map(u => html`<i class=${u.tenant ? (u.status === "Late" ? "late" : "on") : ""} title=${u.name + " · " + (u.tenant || "Vacant") + (u.status === "Late" ? " · rent late" : "")}></i>`)}</div></div>
    </div>
    <div class="rz-cols">
      <div class="card"><div class="hd"><h3>Income and expenses · last 12 months</h3></div><div class="bd"><${RzBars} inc=${n.inc} ex=${n.ex} /></div></div>
      <div class="rz-stack">
        <div class="card"><div class="hd"><h3>This month</h3><span class="sp"></span><button class="btn sm ghost" onClick=${() => go("owner/statement")}>September statement →</button></div><div class="feed">
          ${[["rentals", "Rent roll", n.units.filter(u => u.status === "Late").length + " late · " + n.units.filter(u => !u.tenant).length + " vacant (listed, 4 applications on 1C)"],
            [RZI.wrench, "Maintenance", S.d.tickets.filter(t => S.d.units.find(u => u.id === t.unit && u.b === "B1") && t.status !== "Done" && t.status !== "Cancelled").length + " open work orders · you see every photo"],
            [RZI.cal, "Leases", "3C renews Nov 26 · 3B offered early renewal"]].map(([ic, t, s]) => html`<div class="it"><${RzChip} n=${ic} s=${15} /><div><b style="font-size:13px">${t}</b><div class="muted" style="font-size:12.5px">${s}</div></div></div>`)}</div></div>
        <div class="card"><div class="hd"><h3>What you see here</h3><span class="sp"></span><span class="muted" style="font-size:11.5px">Set per owner by Leo</span></div><div class="bd">
          ${o.perms.map(([t, on]) => html`<div class=${"chk" + (on ? " ok rz-perm" : "")}><i>${on ? "✓" : ""}</i><span>${t}</span></div>`)}
          <div class="muted" style="font-size:12px;margin-top:6px">Tenant contact details and screening reports stay with the manager (fair housing and privacy). Ask Leo if you need something switched on.</div>
          ${o.accessReq ? html`<div class="pill g" style="margin-top:8px">Asked ${slRel(o.accessReq)} · Leo replies within a day</div>` : html`<button class="btn sm" style="margin-top:8px" onClick=${() => { up(() => { o.accessReq = Date.now(); rzOwnerLog("Owner portal: asked Leo about turning on more modules (budget vs actual)."); }); rzNotify("leo", "Brooks Holdings asked for more owner-portal access (budget vs actual)", "inbox"); toast("Request sent to Leo"); }}>Ask for access</button>`}</div></div>
      </div>
    </div></${RzFrame}>`;
}
const RZ_STMT = {
  income: [["1A", "Ava Mitchell", 2150], ["1B", "Noah Kim", 1650], ["2A", "Liam Patel", 2200], ["2B", "Zoe Chen", 1700], ["2C", "Ethan Brown", 1720], ["3A", "Mia Lopez", 2250], ["3B", "Hannah Cole", 1750], ["3C", "Lucas Reed", 1760], ["4B", "Grace Hall", 1780], ["4C", "Owen Diaz", 1790]],
  exp: [["Management fee", "8% of rent collected", 1500, false], ["AC capacitor · 1B", "Polar Air · inv 4471", 185, true], ["Hallway light fixtures", "Bright Electric · inv 2209", 240, true], ["Turnover clean · 1C", "Sparkle Co · inv 118", 260, true], ["Common-area electric & water", "Austin Energy · Sep", 412, true], ["Landscaping", "Verde Yard · Sep", 180, true], ["Building insurance (monthly)", "Policy BX-22018", 610, false], ["Property tax escrow", "Travis County · 1/12", 1925, false]],
};
function RzStatement() {
  const inc = RZ_STMT.income.reduce((a, r) => a + r[2], 0), ex = RZ_STMT.exp.reduce((a, r) => a + r[2], 0), net = inc - ex;
  function download() {
    const rows = [["Section", "Item", "Detail", "Amount"], ...RZ_STMT.income.map(r => ["Income", "Unit " + r[0], r[1], r[2]]), ...RZ_STMT.exp.map(r => ["Expense", r[0], r[1], -r[2]]), ["Total", "Net to owner", "", net]];
    const csv = rows.map(r => r.map(c => '"' + String(c).replace(/"/g, '""') + '"').join(",")).join("\n");
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" })); a.download = "Eastside-Lofts-statement-2026-09.csv"; document.body.appendChild(a); a.click(); a.remove();
    toast("Statement downloaded (CSV) · the PDF is in Documents");
  }
  return html`<${RzFrame} tab="statement" owner>
    <div class="rz-stmt card">
      <div class="rz-stmt-hd"><div><div class="lbl">Owner statement</div><h2>September 2026</h2><div class="muted">Brooks Holdings LLC · Eastside Lofts, 1100 E 6th St, Austin TX</div></div>
        <div class="row" style="flex-wrap:wrap"><button class="btn" onClick=${download}><${Ic} n=${RZI.doc} s=${14} /> Download</button><button class="btn" onClick=${() => window.print()}>Print</button></div></div>
      <div class="rz-heads">
        <div><span>Rent collected</span><b class="num">${usd(inc)}</b><small>10 of 10 occupied units paid</small></div><div class="op">−</div>
        <div><span>Expenses</span><b class="num">${usd(ex)}</b><small>${RZ_STMT.exp.filter(e => e[3]).length} with receipts attached</small></div><div class="op">−</div>
        <div><span>Reserve top-up</span><b class="num">$0</b><small>Reserve holding at $2,000</small></div><div class="op">=</div>
        <div class="net"><span>Net to owner</span><b class="num">${usd(net)}</b><small>ACH Oct 10 to •• 2210</small></div></div>
      <div class="rz-sec"><h4>1 · Income by lease</h4><div class="rz-scroll"><table class="t"><thead><tr><th>Unit</th><th>Resident</th><th>Charged</th><th>Collected</th></tr></thead><tbody>${RZ_STMT.income.map(r => html`<tr><td><b>${r[0]}</b></td><td>${r[1]}</td><td class="num">${usd(r[2])}</td><td class="num">${usd(r[2])}</td></tr>`)}<tr><td><b>1C, 4A</b></td><td class="muted">Vacant · listed</td><td class="num">—</td><td class="num">—</td></tr></tbody></table></div></div>
      <div class="rz-sec"><h4>2 · Expenses</h4><div class="rz-scroll"><table class="t"><thead><tr><th>Item</th><th>Vendor / basis</th><th>Receipt</th><th style="text-align:right">Amount</th></tr></thead><tbody>${RZ_STMT.exp.map(r => html`<tr><td><b>${r[0]}</b></td><td class="muted">${r[1]}</td><td>${r[3] ? html`<button class="btn sm ghost" onClick=${() => rzOpenDoc(r[0], "Invoice from " + r[1] + " for " + usd(r[2]) + ". Approved by Leo Grant under your $500 limit; photos before and after are in the work order.", "Receipt")}>View</button>` : html`<span class="muted">—</span>`}</td><td class="num" style="text-align:right">−${usd(r[2])}</td></tr>`)}</tbody></table></div></div>
      <div class="rz-sec"><h4>3 · Payout</h4><div class="sheet"><div class="ln"><span>Opening balance</span><span>$2,000 (reserve)</span></div><div class="ln"><span>Net for September</span><span>${usd(net)}</span></div><div class="ln tot"><span>Distribution · ACH Oct 10</span><span>${usd(net)}</span></div></div></div>
      <div class="rz-sec muted" style="font-size:12.5px">Formula: net to owner = rent collected − management fee (8%) − expenses − reserve top-up. Every line links to its receipt or ledger entry. Prepared by Harbor & Vine Realty, managing agent.</div>
    </div></${RzFrame}>`;
}
function RzApprovals() {
  const z = RZ(), o = z.owner, leo = A("leo");
  const [ask, setAsk] = useState(null), [q, setQ] = useState(""), [limOpen, setLimOpen] = useState(false), [lim, setLim] = useState(750);
  function decide(a, ok) {
    up(s => {
      a.status = ok ? "approved" : "declined"; a.at = Date.now();
      if (a.kind === "repair") { const t = s.d.tickets.find(x => x.id === a.ticket); if (t) { t.approval = ok ? "approved" : "declined"; t.status = ok ? "Scheduled" : "On hold"; t.vendor = ok ? "Ace Plumbing · Fri 8–10 am (owner approved $1,840)" : "Owner declined quote · Leo to advise"; } }
      if (a.kind === "renewal") { const u = s.d.units.find(x => x.id === a.unit); if (u && ok) u.rzOffer = a.amt; }
      rzOwnerLog("Owner portal: " + (ok ? "approved" : "declined") + " · " + a.t + " (" + usd(a.amt) + ")");
      s.d.activity.push([o.person, "Rentals", (ok ? "Approved " : "Declined ") + a.t.toLowerCase(), "Oct 8"]);
    });
    rzNotify("leo", "Brooks Holdings " + (ok ? "approved" : "declined") + ": " + a.t + " (" + usd(a.amt) + (a.kind === "renewal" ? "/mo" : "") + ")", a.kind === "repair" ? "pmops/tech" : "rentals");
    toast(ok ? (a.kind === "repair" ? "Approved · Ace Plumbing booked Fri 8–10 am, the work order is updated" : "Approved · " + leo.name.split(" ")[0] + " sends Lucas the renewal at " + usd(a.amt) + "/mo") : "Declined · " + leo.name.split(" ")[0] + " will call you about options", slOfficeAct("Open in Rentals", () => go("rentals"), "rentals"));
  }
  function sendQ(a) {
    const txt = q.trim(); if (txt.length < 5) return;
    up(() => { rzOwnerLog("Owner portal question on " + a.t + ": " + txt); (a.qs = a.qs || []).push({ text: txt, at: Date.now() }); });
    rzNotify("leo", "Brooks Holdings asked about " + a.t + ": " + txt.slice(0, 60), "inbox");
    setAsk(null); setQ(""); toast("Question sent to " + leo.name.split(" ")[0] + " · the decision stays open until you choose");
  }
  const pend = o.approvals.filter(a => a.status === "pending");
  return html`<${RzFrame} tab="approvals" owner>
    <div class="rz-cols"><div class="rz-stack">
      ${!pend.length ? html`<div class="card"><div class="bd sl-empty"><span class="rz-chip green"><${Ic} n="check" s=${18} /></span><b>You're all caught up</b><span class="muted">New quotes over your ${usd(o.limit)} limit and renewals land here, and we text you.</span><button class="btn sm" onClick=${() => go("owner/home")}>Back to overview</button></div></div>` : ""}
      ${o.approvals.map(a => html`<div class="card rz-appr"><div class="bd"><div class="row" style="align-items:flex-start"><${RzChip} n=${a.kind === "repair" ? RZI.wrench : RZI.doc} tone=${a.status === "pending" ? "amber" : a.status === "approved" ? "green" : "red"} /><div style="flex:1;min-width:0"><b style="font-size:15px">${a.t}</b><div class="muted" style="font-size:13px;margin-top:2px">${a.s}</div></div><b class="num rz-amtbig">${usd(a.amt)}${a.kind === "renewal" ? "/mo" : ""}</b></div>
        ${a.kind === "repair" && html`<div class="rz-quote"><div class="rz-quote-ic" aria-hidden="true"><${Ic} n=${RZI.flame} s=${26} /><small>50 gal · gas</small></div><div class="sheet" style="flex:1;font-size:12.5px"><div class="ln"><span>50-gal gas water heater</span><span>$1,180</span></div><div class="ln"><span>Labor, permit & haul-away</span><span>$660</span></div><div class="ln tot"><span>Quote</span><span>$1,840</span></div></div></div><div class="muted" style="font-size:12px">${leo.name.split(" ")[0]}'s note: unit is 12 years old with rust at the base; repair isn't worth it. Second quote (HomeFix) was $2,150.</div>`}
        ${(a.qs || []).map(x => html`<div class="rz-q"><b>You asked</b> · ${slRel(x.at)}<div>${x.text}</div></div>`)}
        ${a.status === "pending" ? html`<div class="row" style="margin-top:12px;flex-wrap:wrap;gap:6px"><${SlConfirm} cls="btn pri" label="Approve" text=${a.kind === "repair" ? "Approve " + usd(a.amt) + "? Ace Plumbing is booked and paid from rents." : "Offer Lucas " + usd(a.amt) + "/mo for 12 months?"} yes=${a.kind === "repair" ? "Approve " + usd(a.amt) : "Approve renewal"} onYes=${() => decide(a, true)} /><${SlConfirm} cls="btn" label="Decline" danger text=${a.kind === "repair" ? "Decline the quote? The unit keeps the failing heater until you agree another option." : "Decline? Leo will call you before telling Lucas anything."} yes="Decline" onYes=${() => decide(a, false)} /><button class="btn ghost" onClick=${() => { setAsk(ask === a.id ? null : a.id); setQ(a.kind === "repair" ? "Can we get a third quote?" : ""); }}>Ask a question</button></div>
          ${ask === a.id ? html`<div class="rz-form" style="margin-top:10px"><label class=${"field" + (q.trim().length < 5 ? " sl-bad" : "")}><span>Your question for ${leo.name.split(" ")[0]}</span><textarea rows="2" maxlength="400" value=${q} onInput=${e => setQ(e.target.value)}></textarea>${q.trim().length < 5 ? html`<${SlErr} m="A few words, please (5+ characters)" />` : ""}</label><div class="row"><button class="btn" onClick=${() => setAsk(null)}>Cancel</button><button class="btn pri" disabled=${q.trim().length < 5} onClick=${() => sendQ(a)}>Send question</button></div></div>` : ""}`
        : html`<div class="row" style="margin-top:10px;flex-wrap:wrap"><span class=${"pill " + (a.status === "approved" ? "g" : "r")}>${a.status === "approved" ? "Approved" : "Declined"} ${a.at ? slRel(a.at) : "Oct 8"}</span><span class="muted" style="font-size:12.5px">${a.kind === "repair" ? "Work order " + a.ticket + " · " + (S.d.tickets.find(t => t.id === a.ticket) || {}).status : "Offer goes to the resident"}</span></div>`}
      </div></div>`)}
    </div>
    <div class="card"><div class="hd"><h3>Your approval rules</h3></div><div class="bd sheet" style="font-size:13px"><div class="ln"><span>Repairs needing your OK</span><span>Over ${usd(o.limit)}</span></div><div class="ln"><span>Emergencies (water, heat, safety)</span><span>Fixed first, you're told</span></div><div class="ln"><span>Renewals</span><span>Rent changes over 0%</span></div>
      ${o.limitReq ? html`<div class="pill a" style="margin-top:10px">Asked to change to ${usd(o.limitReq)} · ${leo.name.split(" ")[0]} updates your agreement</div>`
        : limOpen ? html`<div class="row" style="margin-top:10px;gap:8px;flex-wrap:wrap"><label class="field" style="flex:1;min-width:140px"><span>New limit</span><select value=${lim} onChange=${e => setLim(+e.target.value)}>${[250, 500, 750, 1000, 1500].filter(v => v !== o.limit).map(v => html`<option value=${v}>${usd(v)}</option>`)}</select></label><button class="btn" style="align-self:flex-end" onClick=${() => setLimOpen(false)}>Cancel</button><button class="btn pri" style="align-self:flex-end" onClick=${() => { up(() => { o.limitReq = lim; rzOwnerLog("Owner portal: asked to change the repair approval limit to " + usd(lim) + "."); }); rzNotify("leo", "Brooks Holdings asked to change their approval limit to " + usd(lim), "inbox"); setLimOpen(false); toast(leo.name.split(" ")[0] + " will update your management agreement"); }}>Send request</button></div>`
        : html`<button class="btn sm" style="margin-top:10px" onClick=${() => setLimOpen(true)}>Change my limit</button>`}</div></div></div>
  </${RzFrame}>`;
}
function RzOwnerDocs() {
  const o = RZ().owner;
  return html`<${RzFrame} tab="docs" owner><div class="card"><div class="hd"><h3>Documents</h3></div><div class="feed">${o.docs.map(([t, b, k]) => html`<button class="it rz-rowbtn" onClick=${() => rzOpenDoc(t, b, k)}><${RzChip} n="doc" s=${15} /><span style="flex:1;text-align:left"><b style="font-size:13px">${t}</b><div class="muted" style="font-size:12px">${b}</div></span><span class="pill">${k}</span></button>`)}</div></div></${RzFrame}>`;
}
function RzPayouts() {
  const o = RZ().owner, ytd = o.payouts.reduce((a, p) => a + p[2], 0);
  return html`<${RzFrame} tab="payouts" owner><div class="rz-cols">
    <div class="card"><div class="hd"><h3>Distributions</h3><span class="sp"></span><span class="muted num" style="font-size:12px">Last 6 months ${usd(ytd)}</span></div><div class="rz-scroll"><table class="t"><thead><tr><th>Paid</th><th>For</th><th>Method</th><th style="text-align:right">Amount</th><th></th></tr></thead><tbody>
      ${o.payouts.map(p => html`<tr><td class="num">${p[0]}</td><td>${p[1]}</td><td class="muted">ACH •• 2210</td><td class="num" style="text-align:right"><b>${usd(p[2])}</b></td><td><span class=${"pill " + (p[3] === "Paid" ? "g" : "b")}>${p[3]}</span></td></tr>`)}</tbody></table></div></div>
    <div class="card"><div class="hd"><h3>How payouts work</h3></div><div class="bd" style="font-size:13px;display:flex;flex-direction:column;gap:8px"><div>Rent collected − expenses − reserve, paid by ACH on the 10th. Held in a trust account until then, reconciled 3 ways every month.</div><div class="muted">Short month? You get a contribution request here first, never a surprise debit.</div></div></div>
  </div></${RzFrame}>`;
}

// ================= PM OPS (office) =================
function RzOps() {
  if (rzIsTech()) return html`<${RzRay} />`;
  const tab = S.route.id || "tech";
  const tabs = [["tech", "Technician today"], ["deposits", "Move-outs & deposits"], ["compliance", "Compliance"]];
  const body = { tech: RzTech, deposits: RzDeposits, compliance: RzCompliance }[tab] || RzTech;
  const hr = new Date().getHours(), greet = hr < 12 ? "Good morning" : hr < 18 ? "Good afternoon" : "Good evening";
  const newReq = S.d.tickets.filter(t => t.status === "New").length;
  return html`<${Shell} title="PM ops" sub=${(S.role ? greet + ", " + me().name.split(" ")[0] + " · " : "") + "Field work, deposits and the rule packs that keep you compliant"} actions=${html`${slCan("tenant") ? html`<button class="btn" onClick=${() => go("tenant")} title="See exactly what Hannah sees">View Hannah's portal →</button>` : ""}`}>
    <div class="page"><div class="tabs rz-tabs">${tabs.map(([k, l]) => html`<button class=${tab === k ? "on" : ""} onClick=${() => go("pmops/" + k)}>${l}${k === "tech" && newReq ? html`<i class="rz-ct">${newReq}</i>` : ""}</button>`)}</div><${body} /></div></${Shell}>`;
}
function rzJobs() {
  const z = RZ();
  const tk = S.d.tickets.filter(t => t.status === "Scheduled" || t.status === "In progress" || (t.status === "Done" && z.tech[t.id])).map(t => ({ id: t.id, t: t.title, unit: t.unit, win: /\d/.test((t.vendor || "").split("·")[1] || "") ? t.vendor.split("·")[1] : "Today", kind: t.priority === "Urgent" ? "Urgent" : "Work order", ticket: t, who: (t.vendor || "").split("·")[0].trim(), steps: ["Check in with resident or knock", "Photo before", "Fix & test", "Photo after"] }));
  return tk.concat(z.jobs.map(j => Object.assign({ who: "Ray Alvarez" }, j)));
}
const rzIsRays = (j) => /^Ray Alvarez/.test(j.who || "");
// "8:30–9:00 am" → { lbl: "8:30 am", min: 510 }; "today 2–4 pm" → { lbl: "2 pm", min: 840 }
function rzWin(win) {
  const m = String(win || "").match(/(\d{1,2})(?::(\d\d))?\s*(am|pm)?[^ap]*?(am|pm)/i);
  if (!m) return { lbl: "Today", min: 9999 };
  const ap = (m[3] || m[4]).toLowerCase(), h = +m[1] % 12 + (ap === "pm" ? 12 : 0);
  return { lbl: m[1] + (m[2] ? ":" + m[2] : "") + " " + ap, min: h * 60 + (+m[2] || 0) };
}
const rzJobSt = (id) => { const z = RZ(); return z.tech[id] || (z.tech[id] = { stage: "todo", photos: 0, checks: [] }); };
function rzAct(label, local, remote) {
  const z = RZ();
  up(() => { local(); if (z.online) remote(); else z.queue.push({ label, remote }); });
  toast(z.online ? label : label + " · saved on the phone, will sync when signal is back");
}
// job state machine shared by Leo's board and Ray's phone app; remote side-effects (and notifications) wait for signal
function rzGo(j) {
  const z = RZ(), s = rzJobSt(j.id), u = rzUnit(j.unit);
  rzAct("On the way to " + u.name + (u.tenant ? " · " + u.tenant.split(" ")[0] + " gets an ETA text" : ""), () => { s.stage = "enroute"; s.at = Date.now(); }, () => { if (j.ticket) { j.ticket.rz = Object.assign({}, j.ticket.rz, { stage: "enroute", eta: "10:20 am", tech: j.who && !rzIsRays(j) ? "Marco from " + j.who : "Ray Alvarez" }); if (j.ticket.by === z.tenant) { rzReply("Your technician is on the way · ETA 10:20 am."); rzNotify("tenant", "Your technician is on the way · ETA 10:20 am", "tenant/fix"); } } });
}
function rzArrive(j) { const s = rzJobSt(j.id), u = rzUnit(j.unit); rzAct("Checked in at " + u.name, () => { s.stage = "onsite"; s.at = Date.now(); }, () => { if (j.ticket) j.ticket.status = "In progress"; }); }
function rzComplete(j) {
  const z = RZ(), s = rzJobSt(j.id), u = rzUnit(j.unit), b = rzBld(u);
  rzAct("Job complete" + (j.ticket && j.ticket.by ? " · resident asked to confirm" : ""), () => { s.stage = "done"; s.at = Date.now(); }, () => {
    if (j.ticket) { j.ticket.status = "Done"; j.ticket.confirmed = false; if (j.ticket.by === z.tenant) { rzReply("Marked fixed: " + j.ticket.title + ". Please confirm in the app that it's really fixed."); rzNotify("tenant", "Ray marked your request fixed: " + j.ticket.title + ". Please confirm.", "tenant/fix"); } }
    rzNotify("leo", "Ray completed: " + j.t + " · " + b.name + " " + u.name + " (" + s.photos + " photo" + (s.photos === 1 ? "" : "s") + ")", "pmops/tech");
  });
}
function rzPhoto(j) { const s = rzJobSt(j.id); rzAct("Photo saved", () => { s.photos++; }, () => {}); }
function rzSyncToggle() { const z = RZ(), was = z.online, n = z.queue.length; up(() => { z.online = !z.online; if (z.online) { z.queue.forEach(q => q.remote()); z.queue = []; } }); toast(was ? "Offline · the app keeps working, changes queue on the phone" : "Back online · synced " + n + " change" + (n === 1 ? "" : "s")); }
const RzSync = () => { const z = RZ(); return html`<button class=${"rz-sync " + (z.online ? "on" : "off")} onClick=${rzSyncToggle} aria-label=${z.online ? "Online · tap to simulate losing signal" : "Offline · tap to reconnect"} title=${z.online ? "Simulate losing signal" : "Reconnect"}><${Ic} n=${z.online ? RZI.wifi : RZI.wifioff} s=${13} />${z.online ? (z.queue.length ? "Syncing" : "Synced") : z.queue.length + " queued"}</button>`; };
function RzTech() {
  const z = RZ(), all = rzJobs(), jobs = all.filter(rzIsRays).sort((a, b) => rzWin(a.win).min - rzWin(b.win).min), vend = all.filter(j => !rzIsRays(j)), unassigned = S.d.tickets.filter(t => t.status === "New");
  const st = rzJobSt;
  return html`<div class="rz-ops">
    <div class="rz-phone"><div class="rz-ph-top"><span class="num">9:41</span><span class="sp" style="flex:1"></span><${RzSync} /></div>
      <div class="rz-ph-hd"><${Av} a=${A("ray") || { ini: "RA", color: "#2F5F8F" }} /><div><b>Ray Alvarez</b><small>In-house technician · ${jobs.filter(j => st(j.id).stage !== "done").length} jobs left today · his phone, live</small></div></div>
      ${!z.online && html`<div class="rz-offline">No signal. Photos and updates are saved on this phone and upload by themselves when you're back online.</div>`}
      <div class="rz-jobs">${!jobs.length ? html`<div class="sl-empty" style="background:#fff;border-radius:12px"><b>No jobs today</b><span class="muted">Assign a request to Ray and it appears here.</span></div>` : ""}${jobs.map(j => { const s = st(j.id), u = rzUnit(j.unit), b = rzBld(u), done = s.stage === "done"; return html`<div class=${"rz-job " + s.stage}>
        <div class="row" style="align-items:flex-start"><div style="flex:1"><div class="row" style="gap:6px"><span class="num muted" style="font-size:11.5px">${rzWin(j.win).lbl}</span><span class=${"pill " + (j.kind === "Urgent" ? "r" : j.kind === "Work order" ? "b" : "")}>${j.kind}</span></div><b>${j.t}</b><div class="muted" style="font-size:12px">${b.name} ${u.name}${u.tenant ? " · " + u.tenant : " · vacant"}${j.who && !rzIsRays(j) ? " · " + j.who : ""}</div>
          ${j.ticket && j.ticket.rz && j.ticket.rz.entry ? html`<div class="rz-note">Entry: ${j.ticket.rz.entry}${j.ticket.rz.pet && j.ticket.rz.pet !== "No pets" ? " · Pet: " + j.ticket.rz.pet : ""}</div>` : ""}</div>
          <span class=${"pill " + (done ? "g" : s.stage === "todo" ? "" : "a")}>${{ todo: "To do", enroute: "On the way", onsite: "On site", done: "Done" }[s.stage]}</span></div>
        ${!done && html`<div class="rz-steps">${j.steps.map((x, i) => html`<button class=${"chk" + (s.checks.includes(i) ? " ok" : "")} onClick=${() => up(() => { s.checks = s.checks.includes(i) ? s.checks.filter(k => k !== i) : s.checks.concat(i); })}><i>${s.checks.includes(i) ? "✓" : ""}</i><span>${x}</span></button>`)}</div>`}
        ${!done && html`<div class="row rz-jobact">
          ${s.stage === "todo" && html`<button class="btn sm pri" onClick=${() => rzGo(j)}>On my way</button>`}
          ${s.stage === "enroute" && html`<button class="btn sm pri" onClick=${() => rzArrive(j)}>I'm here</button>`}
          <label class="btn sm rz-cam"><${Ic} n=${RZI.cam} s=${13} />Photo${s.photos ? " (" + s.photos + ")" : ""}<input type="file" accept="image/*" capture="environment" onChange=${() => rzPhoto(j)} aria-label=${"Add photo for " + j.t} /></label>
          ${s.stage === "onsite" && html`<button class="btn sm brass" disabled=${!s.photos} title=${s.photos ? "" : "Add an after photo first"} onClick=${() => rzComplete(j)}>Complete</button>`}
        </div>`}</div>`; })}</div>
    </div>
    <div class="rz-stack">
      <div class="card"><div class="hd"><h3>Unassigned requests</h3><span class="sp"></span><span class="muted" style="font-size:12px">From the tenant portal</span></div>
        ${unassigned.length ? html`<div class="feed">${unassigned.map(t => { const u = rzUnit(t.unit); return html`<div class="it"><${RzChip} n=${RZI.wrench} tone=${t.priority === "Urgent" ? "red" : ""} s=${15} /><div style="flex:1;min-width:0"><b style="font-size:13px">${t.title}</b><div class="muted" style="font-size:12px">${rzBld(u).name} ${u.name} · ${t.when}${t.rz && t.rz.human ? " · resident asked for a person" : ""}</div></div><button class="btn sm" onClick=${() => { up(() => { t.status = "Scheduled"; t.vendor = "Ray Alvarez (in-house) · today 2–4 pm"; if (t.by === z.tenant) rzReply("Ray from our team will come today between 2 and 4 pm."); }); rzNotify("ray", "New job: " + t.title + " · " + rzBld(u).name + " " + u.name + ", today 2–4 pm", "pmops/tech"); if (t.by === z.tenant) rzNotify("tenant", "Ray is booked for your request today, 2–4 pm", "tenant/fix"); toast("Assigned to Ray · on his phone now", ["Undo", () => up(() => { t.status = "New"; t.vendor = null; })]); }}>Assign to Ray</button></div>`; })}</div>` : html`<div class="sl-empty"><b>Everything is assigned</b><span class="muted">New requests from residents show up here first.</span></div>`}</div>
      <div class="card"><div class="hd"><h3>Vendor jobs</h3><span class="sp"></span><span class="muted" style="font-size:12px">Outside contractors · tracked from Rentals</span></div>
        ${vend.length ? html`<div class="feed">${vend.map(j => { const u = rzUnit(j.unit); return html`<button class="it rz-rowbtn" onClick=${() => go("rentals")}><${RzChip} n=${RZI.wrench} tone=${j.kind === "Urgent" ? "red" : "blue"} s=${15} /><div style="flex:1;min-width:0;text-align:left"><b style="font-size:13px">${j.t}</b><div class="muted" style="font-size:12px">${rzBld(u).name} ${u.name} · ${j.who}${/\d/.test(j.win) ? " · " + j.win.trim() : ""}</div></div><span class=${"pill " + (j.ticket.status === "Done" ? "g" : j.ticket.status === "In progress" ? "a" : "b")}>${j.ticket.status}</span></button>`; })}</div>` : html`<div class="sl-empty"><b>No vendor jobs today</b></div>`}</div>
      <div class="card"><div class="hd"><h3>Payment plans</h3></div>
        ${z.plans.length ? html`<div class="feed">${z.plans.map(p => html`<div class="it"><${PAv} p=${P(z.tenant)} /><div style="flex:1;min-width:0"><b style="font-size:13px">${P(z.tenant).name} · ${p.n} × ${usd(p.each, 2)}</b><div class="muted" style="font-size:12px">${p.dates.join(", ")} · "${p.why}"${p.ts ? " · " + slRel(p.ts) : ""}</div></div>${p.status === "Requested" ? html`<button class="btn sm pri" onClick=${() => { up(() => { p.status = "Approved"; const f = z.ledger.find(l => l.fee); if (f && !z.ledger.some(l => l.waive)) { z.ledger.push({ d: "Oct 8", t: "Late fee waived · payment plan approved", amt: -f.amt, waive: true }); } rzReply("Approved: " + p.n + " payments of " + usd(p.each, 2) + ". I waived the $75 late fee too."); }); rzNotify("tenant", "Leo approved your payment plan and waived the $75 late fee", "tenant/pay"); toast("Plan approved · late fee waived · " + P(z.tenant).name.split(" ")[0] + " notified"); }}>Approve & waive fee</button>` : html`<span class="pill g">Approved</span>`}</div>`)}</div>` : html`<div class="sl-empty"><b>No plan requests</b><span class="muted">Residents ask from the Pay screen.</span></div>`}</div>
      <div class="card"><div class="hd"><h3>Why the app works in a basement</h3></div><div class="bd" style="font-size:13px;color:var(--ink-2);display:flex;flex-direction:column;gap:6px"><div>Jobs, checklists and photos are stored on the phone first and sync in order when signal returns. Toggle the signal pill to try it.</div><div>Sessions don't expire mid-job; one login covers every company Ray works for.</div></div></div>
    </div></div>`;
}

// ================= RAY'S PHONE APP (technician persona) =================
function RzRay() {
  const z = RZ(), ray = A("ray") || { name: "Ray Alvarez", ini: "RA", color: "#5C6B3A" };
  const all = rzJobs().filter(rzIsRays).sort((a, b) => rzWin(a.win).min - rzWin(b.win).min);
  const [open, setOpen] = useState(null), [tab, setTab] = useState("today"), [justDone, setJustDone] = useState(null);
  const todo = all.filter(j => rzJobSt(j.id).stage !== "done"), done = all.filter(j => rzJobSt(j.id).stage === "done");
  const j = open && all.find(x => x.id === open);
  const list = tab === "today" ? todo : done;
  const hr = new Date().getHours(), greet = hr < 12 ? "Morning" : hr < 18 ? "Afternoon" : "Evening";
  const nextJob = todo[0];
  const body = justDone ? (() => { const dj = all.find(x => x.id === justDone); return html`<div class="rz-ray-ok"><span class="rz-ray-okc"><${Ic} n="check" s=${30} /></span><h2>Job done</h2><p>${dj ? dj.t : ""}${dj && dj.ticket && dj.ticket.by ? html`<br /><span class="muted">The resident was asked to confirm. Leo has your photos.</span>` : html`<br /><span class="muted">Logged with your photos for Leo.</span>`}</p>
      ${nextJob ? html`<div class="rz-ray-next"><div class="lbl">Up next · ${nextJob.win.trim()}</div><b>${nextJob.t}</b><span class="muted">${rzBld(rzUnit(nextJob.unit)).name} ${rzUnit(nextJob.unit).name}</span></div><button class="btn pri big" onClick=${() => { setJustDone(null); setOpen(nextJob.id); }}>Open next job</button>` : html`<div class="rz-ray-next"><b>That's everything for today.</b><span class="muted">New jobs from Leo appear here with a buzz.</span></div>`}
      <button class="btn big" onClick=${() => { setJustDone(null); setOpen(null); setTab("today"); }}>Back to today</button></div>`; })()
    : j ? (() => { const s = rzJobSt(j.id), u = rzUnit(j.unit), b = rzBld(u), tk = j.ticket, ph = (tk && tk.by && P(tk.by)) || null; return html`<div class="rz-ray-job">
      <button class="rz-ray-back" onClick=${() => setOpen(null)} aria-label="Back to job list">‹ Jobs</button>
      <div class="rz-ray-jhd"><div class="row" style="gap:6px;flex-wrap:wrap"><span class="num rz-ray-win">${j.win.trim()}</span><span class=${"pill " + (j.kind === "Urgent" ? "r" : j.kind === "Work order" ? "b" : "")}>${j.kind}</span><span class=${"pill " + (s.stage === "done" ? "g" : s.stage === "todo" ? "" : "a")}>${{ todo: "To do", enroute: "On the way", onsite: "On site", done: "Done" }[s.stage]}</span></div>
        <h2>${j.t}</h2><div class="muted">${b.name} · Unit ${u.name} · ${b.addr}</div></div>
      <div class="rz-ray-card">${u.tenant ? html`<div class="row"><${PAv} p=${{ ini: u.tenant.split(" ").map(w => w[0]).join("").slice(0, 2) }} /><div style="flex:1;min-width:0"><b>${u.tenant}</b><div class="muted" style="font-size:12px">Resident${ph ? " · " + ph.phone : ""}</div></div>${ph ? html`<a class="btn sm" href=${"tel:" + ph.phone.replace(/[^\d]/g, "")} aria-label=${"Call " + u.tenant}><${Ic} n="phone" s=${13} /> Call</a>` : ""}</div>` : html`<div class="muted">Vacant unit · lockbox code 2207 at the office door</div>`}
        ${tk && tk.rz && tk.rz.entry ? html`<div class="rz-note">Entry: ${tk.rz.entry}</div>` : ""}${tk && tk.rz && tk.rz.pet && tk.rz.pet !== "No pets" ? html`<div class="rz-note">Pet: ${tk.rz.pet}</div>` : ""}${tk && tk.rz && tk.rz.desc ? html`<div class="rz-note">"${tk.rz.desc}"</div>` : ""}</div>
      <div class="lbl">Checklist · ${s.checks.length}/${j.steps.length}</div>
      <div class="rz-steps">${j.steps.map((x, i) => html`<button class=${"chk" + (s.checks.includes(i) ? " ok" : "")} disabled=${s.stage === "done"} onClick=${() => up(() => { s.checks = s.checks.includes(i) ? s.checks.filter(k => k !== i) : s.checks.concat(i); })}><i>${s.checks.includes(i) ? "✓" : ""}</i><span>${x}</span></button>`)}</div>
      <div class="rz-ray-photos"><div class="lbl">Photos</div><div class="row" style="gap:8px;flex-wrap:wrap">${Array.from({ length: s.photos }).map((x, i) => html`<span class="rz-ray-th" aria-label=${"Photo " + (i + 1)}><${Ic} n=${RZI.cam} s=${16} /></span>`)}
        ${s.stage !== "done" ? html`<label class="rz-ray-add"><${Ic} n=${RZI.cam} s=${18} /><small>Add</small><input type="file" accept="image/*" capture="environment" onChange=${() => rzPhoto(j)} aria-label=${"Add photo for " + j.t} /></label>` : ""}</div></div>
      ${s.stage !== "done" ? html`<div class="rz-ray-cta">
        ${s.stage === "todo" ? html`<button class="btn pri big" onClick=${() => rzGo(j)}>On my way</button>` : s.stage === "enroute" ? html`<button class="btn pri big" onClick=${() => rzArrive(j)}>I'm here</button>`
          : html`<button class="btn brass big" disabled=${!s.photos} onClick=${() => { rzComplete(j); setJustDone(j.id); setOpen(null); }}>Complete job</button>${!s.photos ? html`<div class="muted" style="font-size:12px;text-align:center">Add an after photo to complete</div>` : ""}`}</div>` : html`<div class="sl-done"><span class="sl-chip"><${Ic} n="check" s=${14} /></span><div><b>Completed ${slRel(s.at)}</b><div class="muted" style="font-size:12px">${s.photos} photo${s.photos === 1 ? "" : "s"} uploaded${z.queue.length ? " when signal returns" : ""}</div></div></div>`}
    </div>`; })()
    : html`<div class="rz-ray-list">
      <div class="rz-ray-sum"><div><b class="num">${todo.length}</b><span>left today</span></div><div><b class="num">${done.length}</b><span>done</span></div><div><b class="num">${z.queue.length}</b><span>waiting to sync</span></div></div>
      ${!list.length ? html`<div class="sl-empty"><span class="rz-chip ${tab === "today" ? "green" : ""}"><${Ic} n=${tab === "today" ? "check" : RZI.wrench} s=${18} /></span><b>${tab === "today" ? "All done for today" : "Nothing finished yet"}</b><span class="muted">${tab === "today" ? "New jobs from Leo appear here." : "Jobs you complete land here."}</span></div>` : ""}
      ${list.map(x => { const s = rzJobSt(x.id), u = rzUnit(x.unit), b = rzBld(u); return html`<button class=${"rz-ray-it " + s.stage} onClick=${() => setOpen(x.id)}><span class="rz-ray-t num">${rzWin(x.win).lbl}</span><span style="flex:1;min-width:0;text-align:left"><b>${x.t}</b><small>${b.name} ${u.name}${u.tenant ? " · " + u.tenant : " · vacant"}</small></span><span class=${"pill " + (s.stage === "done" ? "g" : s.stage === "todo" ? (x.kind === "Urgent" ? "r" : "") : "a")}>${s.stage === "todo" ? (x.kind === "Urgent" ? "Urgent" : "To do") : { enroute: "On the way", onsite: "On site", done: "Done" }[s.stage]}</span><span class="rz-ray-chev" aria-hidden="true">›</span></button>`; })}
    </div>`;
  return html`<div class="rz-ray"><div class="rz-ray-ph" role="application" aria-label="Ray's job app">
    <div class="rz-ray-sb"><span class="num">9:41</span><span style="flex:1"></span><${RzSync} /></div>
    <header class="rz-ray-hd"><span class="av" style=${"background:" + ray.color}>${ray.ini}</span><div style="flex:1;min-width:0"><b>${greet}, ${ray.name.split(" ")[0]}</b><small>Harbor & Vine · Property maintenance</small></div>${window.EosChrome ? html`<span class="rz-ray-bell"><${EosChrome.Bell} /></span>` : ""}<button class="rz-ray-sw" onClick=${() => go("start")} aria-label="Switch persona" title="Switch persona">⇄</button></header>
    ${!z.online ? html`<div class="rz-offline">No signal. Keep working: updates and photos are saved here and upload by themselves.</div>` : ""}
    <main class="rz-ray-body">${body}</main>
    <nav class="rz-ray-tabs" aria-label="Sections">${[["today", "Today", todo.length], ["done", "Done", done.length]].map(([k, l, n]) => html`<button class=${tab === k && !j && !justDone ? "on" : ""} aria-current=${tab === k ? "page" : null} onClick=${() => { setTab(k); setOpen(null); setJustDone(null); }}><${Ic} n=${k === "today" ? RZI.cal : "check"} s=${18} /><span>${l}${n ? " · " + n : ""}</span></button>`)}</nav>
  </div></div>`;
}

function RzDeposits() {
  const z = RZ(), [sel, setSel] = useState(z.deposits[0].id), d = z.deposits.find(x => x.id === sel) || z.deposits[0];
  const rule = RZ_RULES[d.state], moved = rzParse(d.moved), deadline = rzAdd(moved, rule.days), left = rzDays(RZ_TODAY, deadline), elapsed = rzDays(moved, RZ_TODAY);
  const amt = (it) => it.hours ? it.hours * it.rate : it.amt;
  const live = d.items.filter(i => i.on && !i.wear), ded = live.reduce((a, i) => a + amt(i), 0), refund = Math.max(0, d.deposit - ded);
  const flags = [];
  d.items.filter(i => i.on && i.wear).forEach(i => flags.push(["r", "“" + i.t + "” is normal wear and tear and can't be deducted. It's excluded from the total."]));
  if (rule.receipts) d.items.filter(i => i.on && !i.wear && amt(i) > rule.receipts && !i.receipt).forEach(i => flags.push(["a", "“" + i.t + "” is over $" + rule.receipts + " with no receipt attached. Attach one before sending."]));
  if (d.state === "TX" && !d.fwd) flags.push(["a", "No forwarding address yet. The 30-day clock starts once the tenant gives one in writing (§92.107)."]);
  const [nt, setNt] = useState(""), [na, setNa] = useState("");
  const pct = elapsed < 0 ? 0 : Math.min(1, elapsed / rule.days);
  return html`<div class="rz-ops">
    <div class="rz-stack">
      <div class="card"><div class="hd"><h3>Move-outs</h3></div><div class="feed">${z.deposits.map(x => { const r = RZ_RULES[x.state], dl = rzAdd(rzParse(x.moved), r.days), l = rzDays(RZ_TODAY, dl); return html`<button class=${"it rz-rowbtn" + (x.id === d.id ? " sel" : "")} onClick=${() => setSel(x.id)}><${PAv} p=${{ ini: x.tenant.split(" ").map(w => w[0]).join("").slice(0, 2) }} /><div style="flex:1;text-align:left"><b style="font-size:13px">${x.tenant}</b><div class="muted" style="font-size:12px">${rzBld(rzUnit(x.unit)).name} ${rzUnit(x.unit).name} · ${x.status === "Upcoming" ? "moves out " : "moved out "}${rzFmt(rzParse(x.moved))}</div></div><span class=${"pill " + (x.status === "Sent" ? "g" : l <= 7 ? "r" : l <= 16 ? "a" : "")}>${x.status === "Sent" ? "Sent" : l + " days left"}</span></button>`; })}</div></div>
      <div class="card rz-clock"><div class="bd row" style="align-items:center;gap:16px">
        <svg width="96" height="96" viewBox="0 0 96 96" aria-hidden="true"><circle cx="48" cy="48" r="40" fill="none" stroke="#EFEBE1" stroke-width="9" /><circle cx="48" cy="48" r="40" fill="none" stroke=${left <= 7 ? "#C0442E" : left <= 16 ? "#B7791F" : "#2E6B52"} stroke-width="9" stroke-linecap="round" stroke-dasharray=${2 * Math.PI * 40} stroke-dashoffset=${2 * Math.PI * 40 * (1 - pct)} transform="rotate(-90 48 48)" /><text x="48" y="47" text-anchor="middle" font-size="24" font-family="Fraunces, serif" fill="#16201B">${d.status === "Sent" ? "✓" : Math.max(left, 0)}</text><text x="48" y="64" text-anchor="middle" font-size="10" fill="#8A918A">${d.status === "Sent" ? "sent" : "days left"}</text></svg>
        <div style="flex:1"><div class="lbl">Statutory deadline</div><b style="font:500 20px var(--f-display)">${rzFmtY(deadline)}</b><div class="muted" style="font-size:12.5px">${rule.days} days ${rule.from} · ${rule.cite}</div>
          <label class="field" style="margin-top:8px"><span>Rule pack</span><select value=${d.state} onChange=${e => up(() => { d.state = e.target.value; })}>${Object.entries(RZ_RULES).map(([k, r]) => html`<option value=${k}>${r.name} · ${r.days} days</option>`)}</select></label></div></div>
        <div class="bd" style="padding-top:0;font-size:12.5px;color:var(--ink-2)">${rule.extra}</div></div>
    </div>
    <div class="card"><div class="hd"><h3>Deposit disposition · ${d.tenant}</h3><span class="sp"></span><span class=${"pill " + (d.status === "Sent" ? "g" : d.status === "Upcoming" ? "b" : "a")}>${d.status}</span></div><div class="bd rz-form">
      <div class="sheet" style="font-size:13px"><div class="ln"><span>Deposit held (trust account)</span><b>${usd(d.deposit)}</b></div><div class="ln"><span>Forwarding address</span><span>${d.fwd || "—"}</span></div></div>
      <div class="rz-scroll"><table class="t rz-ded"><thead><tr><th></th><th>Deduction</th><th>Basis</th><th>Receipt</th><th style="text-align:right">Amount</th></tr></thead><tbody>
        ${d.items.map(i => html`<tr class=${i.wear ? "wear" : ""}><td><input type="checkbox" checked=${i.on} disabled=${d.status === "Sent"} onChange=${e => up(() => { i.on = e.target.checked; })} aria-label=${"Include " + i.t} /></td><td><b>${i.t}</b>${i.wear ? html`<div><span class="pill r">Normal wear · not deductible</span></div>` : ""}</td><td class="muted num">${i.hours ? i.hours + " h × " + usd(i.rate) + "/h (own staff)" : "Invoice"}</td>
          <td><button class=${"pill " + (i.receipt ? "g" : "")} disabled=${d.status === "Sent"} onClick=${() => up(() => { i.receipt = !i.receipt; })}>${i.receipt ? "Attached" : "Attach"}</button></td><td class="num" style="text-align:right">${i.on && !i.wear ? "−" + usd(amt(i)) : html`<s class="muted">${usd(amt(i))}</s>`}</td></tr>`)}
        ${d.status !== "Sent" && html`<tr><td></td><td><input class="rz-in" placeholder="Add a deduction" value=${nt} onInput=${e => setNt(e.target.value)} /></td><td class="muted">Invoice</td><td></td><td style="text-align:right"><div class="row" style="justify-content:flex-end;gap:6px"><input class=${"rz-in num" + (na && !(+na > 0 && +na <= d.deposit) ? " sl-bad-in" : "")} style="width:80px" placeholder="$" inputmode="decimal" aria-label="Deduction amount" value=${na} onInput=${e => setNa(e.target.value.replace(/[^\d.]/g, ""))} /><button class="btn sm" disabled=${!nt.trim() || !(+na > 0 && +na <= d.deposit)} onClick=${() => { const it = { id: Date.now(), t: nt.trim(), amt: Math.round(+na * 100) / 100, receipt: false, on: true }; up(() => { d.items.push(it); }); setNt(""); setNa(""); toast("Deduction added", ["Undo", () => up(() => { d.items = d.items.filter(x => x !== it); })]); }}>Add</button></div>${na && !(+na > 0 && +na <= d.deposit) ? html`<${SlErr} m=${"Between $1 and " + usd(d.deposit)} />` : ""}</td></tr>`}
      </tbody></table></div>
      ${flags.map(([k, t]) => html`<div class=${"rz-flag " + k}>${t}</div>`)}
      <div class="sheet"><div class="ln"><span>Deductions</span><span>−${usd(ded)}</span></div><div class="ln tot"><span>Refund to ${d.tenant.split(" ")[0]}</span><span>${usd(refund)}</span></div></div>
      <div class="row" style="flex-wrap:wrap"><button class="btn pri" disabled=${d.status === "Upcoming"} onClick=${() => up(s => { s.modal = { kind: "rzLetter", dep: d.id }; })}>${d.status === "Sent" ? "View letter" : "Preview itemized letter"}</button>${d.status === "Upcoming" ? html`<span class="muted" style="font-size:12.5px">Opens after the move-out inspection.</span>` : ""}</div>
    </div></div></div>`;
}
function RzLetterModal({ m, close }) {
  const z = RZ(), d = z.deposits.find(x => x.id === m.dep), rule = RZ_RULES[d.state], u = rzUnit(d.unit), b = rzBld(u);
  slEsc(close);
  const amt = (it) => it.hours ? it.hours * it.rate : it.amt, items = d.items.filter(i => i.on && !i.wear), ded = items.reduce((a, i) => a + amt(i), 0);
  function send() {
    up(s => { d.status = "Sent"; s.d.activity.push(["P1", "Rentals", "Deposit returned to " + d.tenant + " · " + usd(d.deposit - ded) + " refunded, " + usd(ded) + " itemized", "Oct 8"]); s.modal = null; });
    toast("Letter emailed and mailed · " + usd(d.deposit - ded) + " refund sent by ACH from the trust account");
  }
  return html`<div class="scrim" onClick=${e => { if (e.target.classList.contains("scrim")) close(); }}><div class="modal" role="dialog" aria-modal="true" style="width:min(640px,100%)">
    <div class="hd"><h3>Itemized deposit letter</h3><button class="btn sm ghost" aria-label="Close" title="Close (Esc)" onClick=${close}>✕</button></div>
    <div class="bd"><div class="doc rz-letter"><div class="row" style="justify-content:space-between"><b>Harbor & Vine Realty</b><span>October 8, 2026</span></div>
      <div>${d.tenant}<br />${d.fwd}</div>
      <h4>Security deposit accounting · ${b.addr}, Unit ${u.name}</h4>
      <div>You moved out on ${rzFmtY(rzParse(d.moved))}. Your deposit was ${usd(d.deposit)}. As required by ${rule.cite}, here is every deduction, with receipts attached.</div>
      <table class="t"><tbody>${items.map(i => html`<tr><td>${i.t}${i.hours ? " (" + i.hours + " h at " + usd(i.rate) + "/h)" : ""}</td><td class="num" style="text-align:right">${usd(amt(i))}</td></tr>`)}<tr><td><b>Total deductions</b></td><td class="num" style="text-align:right"><b>${usd(ded)}</b></td></tr><tr><td><b>Refund enclosed (ACH)</b></td><td class="num" style="text-align:right"><b>${usd(d.deposit - ded)}</b></td></tr></tbody></table>
      <div style="font-size:11.5px">Normal wear and tear was not charged. Questions or disagreement: reply to this letter or message us in the portal within 30 days and we'll review it with you.</div></div></div>
    <div class="ft"><button class="btn" onClick=${close}>${d.status === "Sent" ? "Close" : "Back to worksheet"}</button>${d.status !== "Sent" && html`<button class="btn pri" onClick=${send}>Send letter & refund</button>`}</div></div></div>`;
}

function rzRag(dateStr) { if (!dateStr) return ["g", "OK"]; const l = rzDays(RZ_TODAY, rzParse(dateStr)); return l < 0 ? ["r", "Expired " + rzFmt(rzParse(dateStr))] : l <= 30 ? ["a", "Due " + rzFmt(rzParse(dateStr)) + " · " + l + "d"] : ["g", rzFmt(rzParse(dateStr)) + " '" + dateStr.slice(2, 4)]; }
function RzCompliance() {
  const z = RZ();
  return html`<div class="rz-form">
    <div class="row" style="flex-wrap:wrap"><div class="seg" style="min-width:260px">${[["US", "US · Texas pack"], ["UK", "UK · England pack"]].map(([k, l]) => html`<button class=${z.region === k ? "on" : ""} onClick=${() => up(() => { z.region = k; })}>${l}</button>`)}</div><span class="muted" style="font-size:12.5px">Rule packs turn the law into tasks, notices and timers on your real records.</span></div>
    ${z.region === "US" ? html`<${RzUS} />` : html`<${RzUK} />`}</div>`;
}
function RzUS() {
  const z = RZ();
  return html`<div class="rz-stack">
    <div class="rz-stack">
      <div class="card"><div class="hd"><h3>Screening decisions · Eastside Lofts</h3><span class="sp"></span><span class="pill">Same criteria for everyone</span></div>
        <div class="bd" style="font-size:12.5px;color:var(--ink-2)">Income ≥ 2.5× rent · credit ≥ 620 (or a guarantor) · no evictions in 5 years · criminal history reviewed individually, never a blanket ban · applications reviewed in the order received.</div>
        <div class="rz-scroll"><table class="t"><thead><tr><th>Applicant</th><th>Unit</th><th>Income</th><th>Credit</th><th>Decision</th><th></th></tr></thead><tbody>
          ${z.applicants.map(a => html`<tr><td style="min-width:220px"><b>${a.name}</b><div class="muted" style="font-size:12px">${a.reason}</div></td><td>${rzUnit(a.unit).name}</td><td class="num">${a.income}×</td><td class="num">${a.credit}</td><td><span class=${"pill " + (a.decision === "Approved" ? "g" : a.decision === "Declined" ? "r" : "a")}>${a.decision}</span></td>
            <td>${a.decision === "Approved" ? "" : a.notice ? html`<span class="pill g">Notice sent ${a.notice}</span>` : html`<button class="btn sm pri" onClick=${() => up(s => { s.modal = { kind: "rzAdverse", app: a.id }; })}>Adverse action notice</button>`}</td></tr>`)}</tbody></table></div>
        <div class="bd muted" style="font-size:12px">FCRA: any denial, higher deposit or co-signer that relied on a consumer report needs a notice. The generator fills it from the report.</div></div>
    </div>
    <div class="grid2 rz-g2">
      <div class="card"><div class="hd"><h3>Fair housing check · listing copy</h3></div><div class="bd rz-form">
        <div class="doc" style="font-size:13px">${z.adCopy.text}</div>
        ${z.adCopy.flagged ? html`<div class="rz-flag a">“perfect for young professionals” can read as a preference based on age or familial status. Describe the home, not the people.</div><button class="btn sm pri" onClick=${() => { up(() => { z.adCopy = { flagged: false, text: "Sunny 1-bed loft with 12-ft ceilings and in-unit laundry. Walk to Rainey and 6th." }; }); toast("Listing updated on the site, Zillow Rentals and Apartments.com"); }}>Use suggested wording</button>` : html`<span class="pill g">No issues found</span>`}</div></div>
      <div class="card"><div class="hd"><h3>Texas checklist</h3></div><div class="bd">${[["Late fees only after rent is 2 full days late (§92.019)", true], ["Late fee within 10% of rent for 5+ unit buildings", true], ["Deposit returned within 30 days with itemized list (§92.103)", true], ["Repair requests answered in a reasonable time (§92.056)", true], ["Security devices rekeyed within 7 days of turnover (§92.156)", false]].map(([t, ok]) => html`<div class=${"chk" + (ok ? " ok rz-perm" : "")}><i>${ok ? "✓" : ""}</i><span>${t}</span></div>`)}
        <button class="btn sm" style="margin-top:6px" onClick=${() => { up(() => { z.jobs.push({ id: "J" + (z.jobs.length + 1), t: "Rekey front door (turnover)", unit: "U3", win: "1:00–1:30 pm", kind: "Turnover", steps: ["Rekey cylinder", "Test 2 new keys", "Log key numbers"] }); }); toast("Rekey of 1C added to Ray's today list"); }}>Schedule rekey for 1C</button></div></div>
    </div></div>`;
}
function RzAdverseModal({ m, close }) {
  const z = RZ(), a = z.applicants.find(x => x.id === m.app), cond = a.decision === "Conditional";
  slEsc(close);
  function send() { up(s => { a.notice = "Oct 8"; s.modal = null; }); toast("Notice emailed to " + a.name.split(" ")[0] + " and logged to the application"); }
  return html`<div class="scrim" onClick=${e => { if (e.target.classList.contains("scrim")) close(); }}><div class="modal" role="dialog" aria-modal="true" style="width:min(640px,100%)">
    <div class="hd"><h3>Adverse action notice</h3><button class="btn sm ghost" aria-label="Close" title="Close (Esc)" onClick=${close}>✕</button></div>
    <div class="bd"><div class="doc rz-letter"><div class="row" style="justify-content:space-between"><b>Harbor & Vine Realty</b><span>October 8, 2026</span></div>
      <div>Dear ${a.name},</div>
      <div>Thank you for applying for 1100 E 6th St, Unit ${rzUnit(a.unit).name}. ${cond ? "We can approve your application on the condition of an additional deposit of $845." : "We are unable to approve your application."} This decision was based in whole or in part on information in a consumer report from:</div>
      <div><b>TransUnion Rental Screening Solutions</b><br />P.O. Box 800, Woodlyn, PA 19094 · (800) 230-9376 · transunion.com/rental</div>
      <div>The reporting agency did not make this decision and cannot explain why it was made. You have the right to a free copy of your report from the agency if you ask within 60 days, and the right to dispute the accuracy or completeness of anything in it.</div>
      ${a.score ? html`<div><b>Your credit score:</b> ${a.score} (range 300–850), from TransUnion on Oct 6, 2026. Key factors: ${a.factors.join("; ")}.</div>` : ""}
      <div style="font-size:11.5px">Reason under our written criteria: ${a.reason}. The same criteria apply to every applicant.</div></div></div>
    <div class="ft"><button class="btn" onClick=${close}>Cancel</button><button class="btn pri" onClick=${send}>Send notice</button></div></div></div>`;
}
function RzUK() {
  const z = RZ();
  const cell = (k, label, act) => html`<td><div class="rz-rag"><span class=${"rz-dot " + k}></span>${label}</div>${act && k !== "g" ? html`<button class="btn sm" style="margin-top:4px" onClick=${act[1]}>${act[0]}</button>` : ""}</td>`;
  const red = z.uk.reduce((a, p) => a + [!p.info, p.deposit === "Not protected", rzRag(p.gas)[0] !== "g", rzRag(p.eicr)[0] !== "g", !!p.rtrDue].filter(Boolean).length, 0);
  return html`<div class="rz-stack">
    <div class="card"><div class="hd"><h3>Lettings compliance · Harbor & Vine Lettings, Bristol (demo branch)</h3><span class="sp"></span><span class=${"pill " + (red ? "a" : "g")}>${red ? red + " actions" : "All clear"}</span></div>
      <div class="bd" style="font-size:12.5px;color:var(--ink-2)">Renters' Rights Act: since 1 May 2026 every tenancy is an assured periodic tenancy, Section 21 is gone, and existing tenants must get the government information sheet. Deposits must be protected within 30 days, with prescribed information.</div>
      <div class="rz-scroll"><table class="t rz-uk"><thead><tr><th>Property</th><th>Periodic tenancy</th><th>Deposit</th><th>Right to Rent</th><th>Gas safety</th><th>EICR</th><th>EPC</th></tr></thead><tbody>
        ${z.uk.map(p => { const g = rzRag(p.gas), e = rzRag(p.eicr); return html`<tr><td><b>${p.addr}</b><div class="muted" style="font-size:12px">${p.tenant}</div></td>
          ${cell(p.info ? "g" : "a", p.info ? "Periodic · info sheet served" : "Periodic · info sheet not served", ["Serve info sheet", () => { up(() => { p.info = true; }); toast("Information sheet served by email with proof of delivery"); }])}
          ${cell(p.deposit === "Not protected" ? "r" : "g", p.deposit, ["Protect with DPS", () => { up(() => { p.deposit = "DPS · registered today"; }); toast("Deposit registered with DPS · prescribed information sent"); }])}
          ${cell(p.rtrDue ? "a" : "g", p.rtrDue ? p.rtr + " · recheck by " + rzFmt(rzParse(p.rtrDue)) : p.rtr, ["Book recheck", () => { up(() => { p.rtrDue = ""; p.rtr = "Rechecked · share code verified"; }); toast("Right to Rent follow-up done via share code"); }])}
          ${cell(g[0], g[1], ["Book engineer", () => { up(() => { p.gas = "2027-10-20"; }); toast("Gas Safe engineer booked Oct 20 · tenant gets the certificate within 28 days"); }])}
          ${cell(e[0], e[1], ["Book electrician", () => { up(() => { p.eicr = "2031-10-15"; }); toast("EICR booked Oct 15 · valid 5 years"); }])}
          <td><div class="rz-rag"><span class="rz-dot g"></span>${p.epc}</div></td></tr>`; })}</tbody></table></div></div>
    <div class="grid2 rz-g2"><div class="card"><div class="hd"><h3>Built into the workflow</h3></div><div class="bd" style="font-size:13px;display:flex;flex-direction:column;gap:6px"><div>Rent increases only by Section 13 notice, once a year. Offers above the advertised rent are blocked. Pet requests are logged with a decision and a reason.</div></div></div>
      <div class="card"><div class="hd"><h3>Possession grounds tracker</h3></div><div class="bd" style="font-size:13px">No open cases. Arrears grounds unlock only at 3 months' arrears, with 4 weeks' notice, and only if the deposit is protected.</div></div></div>
  </div>`;
}
