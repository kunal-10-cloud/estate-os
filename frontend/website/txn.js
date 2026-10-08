// Transactions & back office for Estate OS: broker compliance review, commissions (plans, CDA, disbursements, paystubs),
// trust accounting (earnest money, three-way reconciliation, exports, 1099s) and lead routing.
// One deal record runs through all of it: the buyer agreement on S.d.deals[i] caps the CDA, the CDA feeds disbursement,
// disbursement writes paystubs and cap progress, and EMD lives on the same deal id. Loaded before app.js.

(window.EOS_EXT = window.EOS_EXT || []).push({
  pages: { compliance: TxCompliance, commissions: TxCommissions, trust: TxTrust, routing: TxRouting },
  modals: { txIntake: TxIntakeModal, txWire: TxWireModal },
  seed: txSeed,
  nav: [
    { id: "compliance", label: "Compliance", icon: "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6zM9 12l2 2 4-4", group: "office", mod: "pipeline" },
    { id: "commissions", label: "Commissions", icon: "M12 2v20M17 6.5c-.8-1.5-2.6-2.5-5-2.5-3 0-5 1.5-5 3.8 0 5 10 2.6 10 7.6 0 2.3-2.2 4-5 4-2.6 0-4.5-1.1-5.3-2.8", group: "office", mod: "backoffice" },
    { id: "trust", label: "Trust & EMD", icon: "M3 10l9-6 9 6M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 21h18", group: "office", mod: "backoffice" },
    { id: "routing", label: "Lead routing", icon: "M4 6h5l6 12h5M4 18h5l2-4M15 6h5M18 3l3 3-3 3M18 15l3 3-3 3", group: "office", mod: "people" },
  ],
});

const TX_I = {
  shield: "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z",
  doc: "M7 3h7l5 5v13H7zM14 3v5h5M10 13h6M10 17h6",
  up: "M12 16V4M7 9l5-5 5 5M4 20h16",
  x: "M6 6l12 12M18 6 6 18",
  alert: "M12 3 2 20h20zM12 10v4M12 17h.01",
  info: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 11v5M12 8h.01",
  lock: "M6 11h12v10H6zM8 11V7a4 4 0 0 1 8 0v4",
  bank: "M3 10l9-6 9 6M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 21h18",
  coin: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM15 9.5c-.5-1-1.6-1.5-3-1.5-1.7 0-3 .8-3 2s1.3 1.7 3 2 3 .8 3 2-1.3 2-3 2c-1.4 0-2.6-.6-3-1.6M12 6.5v11",
  bolt: "M13 2 4 14h7l-1 8 9-12h-7z",
  clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2",
  user: "M20 21a8 8 0 0 0-16 0M12 13a5 5 0 1 0 0-10 5 5 0 0 0 0 10",
  pond: "M3 15c2 0 2-1.5 4.5-1.5S9.5 15 12 15s2.5-1.5 4.5-1.5S19 15 21 15M3 19c2 0 2-1.5 4.5-1.5S9.5 19 12 19s2.5-1.5 4.5-1.5S19 19 21 19M8 10a4 4 0 0 1 8 0",
  sparkle: "M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z",
  phone: "M22 16.9v3a2 2 0 0 1-2.2 2A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z",
  send: "M22 2 11 13M22 2l-7 20-4-9-9-4z",
  up2: "M18 15l-6-6-6 6", dn: "M6 9l6 6 6-6",
  plus: "M12 5v14M5 12h14",
  trash: "M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3",
  file: "M14 3H7v18h10V6zM14 3v3h3",
  export: "M12 3v12M7 8l5-5 5 5M5 14v6h14v-6",
  star: "M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z",
};
// Esc closes our modals; Enter is handled per form
function txEsc(close) { useEffect(() => { const k = (e) => { if (e.key === "Escape") close(); }; addEventListener("keydown", k); return () => removeEventListener("keydown", k); }, []); }
const TxIc = ({ n, s }) => html`<${Ic} n=${TX_I[n] || n} s=${s || 16} />`;
const TX_TODAY = "Oct 8";
const TX_DISB = ["Incomplete", "Ready", "Approved", "Paid", "Processed"];
const TX_DISB_HINT = { Incomplete: "Needs a compliant file and a CDA sent to title", Ready: "Waiting for broker approval", Approved: "Waiting for funds from title", Paid: "Funds in · pay the agents", Processed: "Agents paid · paystubs issued" };

// ---------- helpers ----------
const txDeal = (id) => S.d.deals.find(d => d.id === id);
const txPcts = (s) => (String(s || "").match(/[\d.]+(?=\s*%)/g) || []).map(Number);
const txR = (n) => Math.round(n * 100) / 100;
function txIni(name) { return name.split(/\s|&/).filter(Boolean).map(w => w[0]).slice(0, 2).join("").toUpperCase(); }
// the most a CDA may ask for on this side, from the signed agreement on the same deal record
function txLimit(d) {
  if (!d.agreement || !d.agreement.signed) return null;
  const p = txPcts(d.agreement.comp);
  if (d.kind === "Listing") { const tot = p[0] || d.comp, off = p[1] != null ? p[1] : 0; return { pct: txR(tot - off), doc: "Listing agreement", text: d.agreement.comp, on: d.agreement.on }; }
  return { pct: p[0] || d.comp, doc: "Buyer agreement", text: d.agreement.comp, on: d.agreement.on };
}
function txCda(d) {
  const t = S.d.tx;
  if (!t.cda[d.id]) t.cda[d.id] = { seller: txDefaultPct(d), buyer: 0, referral: false, title: "Lone Star Title · Dana Pruitt", mode: "closing", status: "Draft" };
  return t.cda[d.id];
}
const txCdaPct = (c) => txR((+c.seller || 0) + (+c.buyer || 0));
function txCdaOver(d) { const c = S.d.tx.cda[d.id], lim = txLimit(d); if (!c || !lim) return 0; return Math.max(0, txR(txCdaPct(c) - lim.pct)); }
// agents without a plan on file (e.g. a newly added seat) get the house plan so the math never breaks
const txPlan = (a) => S.d.tx.plans[a] || (S.d.tx.plans[a] = { name: "Growth · sliding to cap", split: 70, cap: 20000, paid: 0, carry: 0, postFee: 285, postPct: 15, tiers: [[0, 70], [10000, 80]], anniv: "Jan 1" });

// commission math for one deal; returns payee lines and the company dollar that counts toward the cap
function txCalc(d, pctOverride) {
  const c = S.d.tx.cda[d.id] || { seller: txDefaultPct(d), buyer: 0, referral: false };
  const pct = pctOverride != null ? pctOverride : txCdaPct(c);
  const gross = d.price * pct / 100, pl = txPlan(d.agent), lines = [];
  lines.push(["Gross commission (" + pct + "%)", gross, "From title", "g"]);
  let net = gross;
  if (c.referral) { const r = gross * .25; net -= r; lines.push(["Referral fee 25% · Keller Williams Lakeway (pre-split)", -r, "Outside brokerage", "n"]); }
  let co = 0, capNote = "", postCap = 0;
  if (pl.split >= 100) { co = 0; capNote = "Broker-owner plan · 100%"; }
  else {
    const left = Math.max(0, pl.cap - pl.paid);
    const want = net * (100 - txSplitNow(pl)) / 100;
    if (left <= 0) { postCap = Math.min(pl.postFee, net * pl.postPct / 100); capNote = "Capped · post-cap fee"; }
    else if (want >= left) { co = left; capNote = "Caps on this deal · " + usd(left) + " to the company, the rest is " + A(d.agent).name.split(" ")[0] + "'s"; }
    else { co = want; capNote = txSplitNow(pl) + "/" + (100 - txSplitNow(pl)) + " · " + usd(left - want) + " left to cap after this deal"; }
  }
  if (co) lines.push(["Harbor & Vine company dollar", -co, "Brokerage", "n"]);
  if (postCap) lines.push(["Post-cap transaction fee", -postCap, "Brokerage", "n"]);
  let agent = net - co - postCap;
  S.d.tx.fees.filter(f => f.on && (!f.who || f.who === d.agent)).forEach(f => { const amt = f.kind === "%" ? agent * f.amt / 100 : f.amt; agent -= amt; lines.push([f.name, -amt, f.to, "n"]); });
  if (pl.team) { const tl = agent * pl.team.pct / 100; agent -= tl; lines.push(["Team split " + pl.team.pct + "% · " + A(pl.team.lead).name, -tl, pl.team.name, "n"]); }
  lines.push([A(d.agent).name + " takes home", agent, "ACH to agent", "t"]);
  return { pct, gross, net, co: co + postCap, agent, lines, capNote, team: pl.team ? { lead: pl.team.lead, amt: lines.find(l => l[0].startsWith("Team split"))[1] * -1 } : null };
}
function txSplitNow(pl) { let s = pl.split; (pl.tiers || []).forEach(t => { if (pl.paid >= t[0]) s = t[1]; }); return s; }

// ---------- who is signed in, what they may do, and the shared audit trail ----------
const txMe = () => (typeof me === "function" ? me() : A("maya"));
const txWhoId = () => (S.role && S.role.who) || "maya";
const txFirst = (id) => (A(id) ? A(id).name.split(" ")[0] : id);
// a route is reachable for this seat (staff with a nav list only see their own screens)
const TX_NAV_OF = { deal: "pipeline", person: "people", listing: "listings" };
const txCan = (route) => { const pg = String(route).split("/")[0]; return !S.role || !S.role.nav || S.role.nav.includes(TX_NAV_OF[pg] || pg); };
// money approvals: broker-owner or accounting; compliance sign-off: broker-owner or TC
const txMayApprove = () => ["maya", "grace"].includes(txWhoId());
const txMayReview = () => ["maya", "nina"].includes(txWhoId());
const TX_NO_APPROVE = "Only Maya (broker) or Grace (accounting) can approve or pay out";
function txNotify(who, text, route) { if (!who || who === txWhoId()) return; try { window.notify && window.notify({ who, text, route, at: Date.now(), from: txWhoId() }); } catch (e) {} }
function txAudit(area, what, amt, ref) { const t = S.d.tx; (t.audit = t.audit || []).unshift({ ts: Date.now(), who: txWhoId(), area, what, amt: amt == null ? null : amt, ref: ref || null }); }
function txAgo(x) { if (typeof x !== "number") return x; const s = Math.max(0, (Date.now() - x) / 1000); return s < 45 ? "just now" : s < 3600 ? Math.round(s / 60) + "m ago" : Math.round(s / 3600) + "h ago"; }
function txHello(rest) { const n = txFirst(txWhoId()); return (S.role ? "Good morning, " + n + " · " : "") + rest; }
// the % this deal pays when no CDA exists yet: deal comp, else what the signed agreement allows, else the house default
function txDefaultPct(d) { return d.comp || (txLimit(d) || {}).pct || 2.5; }
const TX_LIVE = (d) => d && (d.stage === "Under contract" || d.stage === "Closed");

// compliance review record per deal (created lazily so deals created later get one too)
function txRev(d) {
  const t = S.d.tx; if (!t.rev[d.id]) t.rev[d.id] = txMakeRev(d); return txSyncRev(d, t.rev[d.id]);
}
// a deal can go under contract anywhere (seller accepts in the seller portal, buyer accepts a counter, agent moves the stage):
// the review file picks up the executed contract and an earnest-money check the next time anyone looks at it
function txSyncRev(d, r) {
  if (TX_LIVE(d) && !r.docs.some(x => /Residential Contract/.test(x.n))) {
    const l = L(d.listing), e = txEmdFor(d), via = d.kind === "Listing" ? "seller portal / listing agent" : "buyer side";
    const F = (sev, t, x, snip, fix) => ({ id: Math.random().toString(36).slice(2, 8), sev, t, x, snip, fix, done: false });
    const fs = [F("Info", "Executed contract received · " + usd(d.price), "Sales price and closing date (" + d.close + ") match the deal record.", txSnip(1, "3. SALES PRICE", ["A. Cash portion of Sales Price payable by Buyer", "B. Sum of all financing described ...", "C. Sales Price (Sum of A and B): " + usd(d.price)], 2, usd(d.price) + " ✓", true))];
    if (e && e.status !== "Received" && e.status !== "Released") fs.push(Object.assign(F("Warning", "Earnest money receipt not attached", "¶5 asks for " + usd(e.amt) + " within 3 days of the effective date; nothing received yet.", txSnip(3, "5. EARNEST MONEY", ["Within 3 days after the Effective Date, Buyer", "must deliver earnest money of " + usd(e.amt), "to the escrow agent named in this contract."], 1, usd(e.amt) + " · receipt?", false), "Check the trust ledger"), { emd: e.id }));
    r.docs.push({ n: "One to Four Family Residential Contract", st: "Pending", pages: 11, by: A(d.agent).name, at: TX_TODAY, f: fs, fresh: true });
    if (r.status === "Compliant") r.status = "Pending review";
    r.fresh = true; r.log.unshift(["Estate OS", "Contract executed on " + l.addr + " (" + via + ") · file opened for review", TX_TODAY]);
  }
  // EMD findings clear themselves the moment the money lands in the ledger
  r.docs.forEach(x => x.f.forEach(f => { if (f.emd && !f.done) { const e = S.d.tx.emd.find(y => y.id === f.emd); if (e && (e.status === "Received" || e.status === "Released")) { f.done = true; f.auto = "Receipt matched in the EMD ledger"; } } }));
  return r;
}
function txSnip(pg, head, lines, hl, mark, ok) { return { pg, head, lines, hl, mark, ok: !!ok }; }
function txMakeRev(d) {
  const l = L(d.listing), p = P(d.person), ag = A(d.agent).name;
  const F = (sev, t, x, snip, fix) => ({ id: Math.random().toString(36).slice(2, 8), sev, t, x, snip, fix, done: false });
  const closed = d.stage === "Closed";
  const docs = [];
  const ba = { n: d.kind === "Listing" ? "Listing agreement" : "Buyer representation agreement", st: d.agreement.signed ? (closed ? "Accepted" : "Pending") : "Missing", pages: 4, by: ag, at: d.agreement.on || "—", f: [] };
  if (d.agreement.signed) ba.f.push(F("Info", "Compensation read: " + d.agreement.comp, "Carried onto the deal record and used as the ceiling for the CDA.", txSnip(2, "3. BROKER COMPENSATION", ["A. Client will pay Broker the amount", "specified below, less any amount Broker", "receives from the seller or seller's agent:", d.agreement.comp, "B. Broker may not receive more than the", "amount agreed in Paragraph 3A."], 3, "Compensation · " + (txPcts(d.agreement.comp)[0] || d.comp) + "%", true)));
  else ba.f.push(F("Blocker", "No signed buyer agreement on file", "Texas requires a written buyer agreement before touring. Tours for " + p.short + " are blocked until it's signed.", txSnip(1, "BUYER REPRESENTATION AGREEMENT", ["Client: " + p.name, "Broker: Harbor & Vine Realty", "Term: ______", "Compensation: ______", "Client signature: ________________"], 4, "Unsigned", false), "Send agreement to " + p.short));
  docs.push(ba);
  if (d.id === "D1") {
    docs.push({ n: "One to Four Family Residential Contract", st: "Pending", pages: 11, by: ag, at: "Sep 28", f: [
      F("Blocker", "Missing buyer initials on page 4", "Paragraph 6.A (title policy) has the seller's initials but the Brooks' initials box is empty.", txSnip(4, "6. TITLE POLICY AND SURVEY", ["A. TITLE POLICY: Seller shall furnish to Buyer", "at Seller's expense an owner policy of title", "insurance in the amount of the Sales Price...", "Initialed for identification by Buyer ____ and Seller MO", "B. COMMITMENT: Within 20 days after the Title"], 3, "Buyer initials missing", false), "Request initials from the Brooks"),
      F("Warning", "Closing date doesn't match the title commitment", "Contract ¶9 says Nov 6; Lone Star Title's commitment says Nov 5.", txSnip(7, "9. CLOSING", ["A. The closing of the sale will be on or before", "November 6, 2026, or within 7 days after", "objections made under Paragraph 6D have been", "cured or waived, whichever date is later."], 1, "Nov 6 ≠ title Nov 5", false), "Ask title to correct to Nov 6"),
      F("Info", "Third Party Financing Addendum referenced in ¶4 · uploaded", "Matched to the addendum filed Sep 28.", txSnip(2, "4. FINANCING", ["The portion of Sales Price not payable in cash", "will be paid as follows: (Check applicable boxes)", "☒ Third Party Financing Addendum", "☐ Loan Assumption Addendum"], 2, "Addendum on file ✓", true)),
    ] });
    docs.push({ n: "Seller's disclosure notice", st: "Pending", pages: 5, by: ag, at: "Sep 24", f: [F("Info", "Signed by both sellers and both buyers", "Receipt acknowledged Sep 24.", txSnip(5, "SIGNATURES", ["Signature of Seller   Date", "Signature of Buyer   Date", "The undersigned purchaser hereby acknowledges", "receipt of the foregoing notice."], 1, "4 of 4 signatures", true))] });
    docs.push({ n: "Wire fraud advisory", st: "Missing", pages: 1, by: ag, at: "—", f: [F("Warning", "Brokerage-required disclosure not uploaded", "Every buyer file needs the signed wire fraud advisory before EMD or closing funds move.", txSnip(1, "WIRE FRAUD ADVISORY", ["Never wire funds based on emailed instructions.", "Call your title company at a number you", "already know before sending any money."], 0, "Not in file", false), "Send for e-signature")] });
  } else if (d.id === "D3") {
    docs.push({ n: "One to Four Family Residential Contract", st: "Pending", pages: 11, by: ag, at: "Oct 6", f: [
      F("Warning", "Earnest money receipt not attached", "¶5 says $6,050 to Harbor & Vine trust within 3 days; no receipt on the file yet.", txSnip(3, "5. EARNEST MONEY AND TERMINATION OPTION", ["A. DELIVERY OF EARNEST MONEY AND OPTION FEE:", "Within 3 days after the Effective Date, Buyer", "must deliver to Harbor & Vine Realty Trust", "earnest money of $6,050 ...", ], 3, "$6,050 · receipt?", false), "Check the trust ledger"),
      F("Info", "Sales price matches the offer: $605,000", "Same as the deal record.", txSnip(1, "3. SALES PRICE", ["A. Cash portion of Sales Price payable by Buyer", "B. Sum of all financing described ...", "C. Sales Price (Sum of A and B): $605,000"], 2, "$605,000 ✓", true)),
    ] });
  } else if (d.id === "D4") {
    docs.push({ n: "Showing log · 2210 Barton Hills Dr", st: "Pending", pages: 1, by: ag, at: "Oct 7", f: [F("Warning", "Offer draft asks the seller for 2.5%, agreement says 2.25%", "Anything above 2.25% must be credited to Marcus at closing, or the agreement amended first.", txSnip(1, "OFFER NOTES · DRAFT", ["Buyer requests Seller pay Buyer's broker", "2.5% of the Sales Price at closing.", "Agreement on file: 2.25% (signed Oct 6)"], 1, "2.5% > 2.25%", false), "Fix the offer to 2.25%")] });
  } else if (d.id === "D2" || d.id === "D6") {
    docs.push({ n: "Seller's disclosure", st: "Pending", pages: 5, by: ag, at: "Oct 3", f: [F("Info", "All sections answered · signed", "No 'unknown' answers on material items.", txSnip(2, "SECTION 2", ["Are you (Seller) aware of any of the following", "conditions? Roof leaks: N   Foundation: N", "Previous flooding: N"], 1, "Complete ✓", true))] });
  }
  if (closed && !docs.some(x => /Residential Contract/.test(x.n))) docs.push({ n: "One to Four Family Residential Contract", st: "Accepted", pages: 11, by: ag, at: d.close, f: [{ id: "c0", sev: "Info", t: "Executed contract · " + usd(d.price), x: "Closed " + d.close + ".", snip: txSnip(1, "3. SALES PRICE", ["C. Sales Price (Sum of A and B): " + usd(d.price)], 0, usd(d.price) + " ✓", true), done: true }] });
  if (closed) docs.forEach(x => { x.st = "Accepted"; x.f.forEach(f => { f.done = true; }); });
  return { docs, status: closed ? "Compliant" : "Pending review", log: closed ? [["Maya Ortiz", "Marked compliant", d.close]] : [], sub: closed ? d.close : (d.agreement.on || TX_TODAY) };
}
// docs list with the live CDA check added (comp is read from the same deal, so a fix in the CDA builder clears it here)
const txDocs = (d) => txRev(d).docs;
function txFindings(d) {
  const docs = txDocs(d), out = [];
  docs.forEach(x => x.f.forEach(f => { if (!f.done) out.push(f); }));
  const over = txCdaOver(d);
  if (over) out.push(txCdaFinding(d, over));
  return out;
}
function txCdaFinding(d, over) {
  const c = S.d.tx.cda[d.id], lim = txLimit(d);
  return { id: "cda", sev: "Blocker", live: true, t: "CDA asks for " + txCdaPct(c) + "%, " + lim.doc.toLowerCase() + " allows " + lim.pct + "%", x: "That's " + usd(d.price * over / 100) + " more than " + P(d.person).short + " agreed to. Title won't be told to pay it until the CDA is fixed.", snip: txSnip(1, "COMMISSION DISBURSEMENT AUTHORIZATION · DRAFT", ["Paid by seller per contract: " + c.seller + "%", "Paid by buyer at closing: " + c.buyer + "%", "Total to Harbor & Vine: " + txCdaPct(c) + "%", lim.doc + " (" + lim.on + "): " + lim.pct + "%"], 2, txCdaPct(c) + "% > " + lim.pct + "%", false), fix: "Fix in the CDA builder" };
}

// ---------- seed ----------
function txSeed(d) {
  // review records are built lazily on first view (txRev) because they read people/agents through app.js helpers
  const t = d.tx = { rev: {}, cda: {} };
  t.cda = {
    D1: { seller: 2.5, buyer: 0.25, referral: false, title: "Lone Star Title · Dana Pruitt", mode: "closing", status: "Draft", why: "Jordan added a 0.25% buyer-paid admin fee" },
    D7: { seller: 3, buyer: 0, referral: false, title: "Heritage Title · Westlake", mode: "remaining", status: "Signed" },
    D8: { seller: 2.5, buyer: 0, referral: true, title: "Lone Star Title · Dana Pruitt", mode: "closing", status: "Signed" },
  };
  t.plans = {
    maya: { name: "Broker-owner", split: 100, cap: 0, paid: 0, postFee: 0, postPct: 0, tiers: [], anniv: "Jan 1" },
    jordan: { name: "Growth · sliding to cap", split: 70, cap: 20000, paid: 14200, carry: 3100, postFee: 285, postPct: 15, tiers: [[0, 70], [10000, 80]], anniv: "Mar 1" },
    priya: { name: "Growth · sliding to cap", split: 70, cap: 20000, paid: 9800, carry: 0, postFee: 285, postPct: 15, tiers: [[0, 70], [10000, 80]], anniv: "Jan 1" },
    sam: { name: "Team · Eastside Team", split: 70, cap: 20000, paid: 6100, carry: 0, postFee: 285, postPct: 15, tiers: [[0, 70], [10000, 80]], anniv: "Jun 15", team: { name: "Eastside Team", lead: "jordan", pct: 35 } },
  };
  t.fees = [
    { id: "tf", name: "Transaction fee", amt: 395, kind: "$", to: "Brokerage", on: true, note: "Every closed side" },
    { id: "eo", name: "E&O insurance", amt: 45, kind: "$", to: "Brokerage (pass-through)", on: true, note: "Per transaction" },
    { id: "tc", name: "Transaction coordinator", amt: 350, kind: "$", to: "Casey Ng, TC", on: false, note: "If a TC worked the file" },
    { id: "mk", name: "Marketing co-op", amt: 1, kind: "%", to: "Brokerage", on: false, note: "Optional, % of agent share" },
  ];
  t.disb = [
    { id: "H1", deal: null, addr: "1207 Shoal Creek Blvd", agent: "jordan", price: 780000, pct: 2.5, close: "Sep 30", status: "Ready" },
    { id: "H2", deal: null, addr: "48 Pemberton Pl", agent: "priya", price: 1420000, pct: 2.5, close: "Oct 2", status: "Ready" },
    { id: "XD7", deal: "D7", status: "Approved" },
    { id: "XD8", deal: "D8", status: "Processed", paidOn: "Sep 2" },
    { id: "XD1", deal: "D1", status: "Incomplete" },
  ];
  t.stubs = [
    { agent: "jordan", on: "Feb 14", addr: "611 Bluebonnet Ln", gross: 16250, net: 10930 }, { agent: "jordan", on: "Apr 3", addr: "2804 Hemphill Park", gross: 21400, net: 14540 },
    { agent: "jordan", on: "Jun 21", addr: "903 W 9th St #4", gross: 12100, net: 8030 }, { agent: "jordan", on: "Sep 2", addr: "120 Ranch Gate Rd", gross: 26000, net: 13200, deal: "D8" },
    { agent: "priya", on: "Mar 9", addr: "3 Rob Roy Ct", gross: 31500, net: 21610 }, { agent: "priya", on: "Jul 18", addr: "1511 Ethridge Ave", gross: 22800, net: 15520 },
    { agent: "sam", on: "May 30", addr: "4501 Duval St", gross: 14400, net: 6280 }, { agent: "sam", on: "Aug 12", addr: "1919 E 12th St", gross: 13100, net: 5720 },
    { agent: "maya", on: "Apr 25", addr: "18 Westlake Dr", gross: 48900, net: 48900 },
  ];
  t.w9 = { maya: "EIN ••-•••4410", jordan: "SSN •••-••-2231", priya: "SSN •••-••-8710", sam: null };
  t.emd = [
    { id: "E1", deal: "D1", amt: 17650, method: "Wire", holder: "title", status: "Received", on: "Sep 30", note: "Lone Star Title escrow · receipt on file" },
    { id: "E2", deal: "D3", amt: 6050, method: "Wire", holder: "trust", status: "Verify", on: "Oct 7", note: "Wire posted Oct 7 · needs fraud check before it's credited" },
    { id: "E3", deal: "D4", amt: 9000, method: "ACH", holder: "trust", status: "Expected", on: "—", note: "Offer drafting on 2210 Barton Hills" },
    { id: "E4", deal: "D8", amt: 10400, method: "ACH", holder: "trust", status: "Released", on: "Aug 27", note: "Released to Lone Star Title at closing" },
  ];
  t.recon = {
    month: "September 2026", bank: 51665, book: 55400, signed: { prep: null, broker: null },
    ledgers: [["Eastside Lofts · security deposits (10 tenants)", 19600, "rentals"], ["Govalle Row · security deposits (5 tenants)", 14900, "rentals"], ["EMD · 48 Pemberton Pl (Hale buyers)", 14200, "H2"], ["Owner reserve · Brooks Holdings LLC", 5000, "P1"]],
    items: [
      { id: "dit", side: "bank", amt: 5000, t: "Deposit in transit · Brooks Holdings owner reserve", s: "Booked Sep 30, on the Oct 1 bank statement", act: "Match to statement" },
      { id: "oc", side: "bank", amt: -2990, t: "Outstanding check #1184 · Row D deposit refund (move-out)", s: "Issued Sep 28, not yet cashed", act: "Match to statement" },
      { id: "fee", side: "bank", amt: 25, t: "Bank service fee charged to the trust account", s: "Trust funds can't pay bank fees: reimburse from operating", act: "Reimburse $25" },
      { id: "dup", side: "book", amt: -1700, t: "Duplicate posting · Unit 2B deposit (Zoe Chen) entered twice", s: "Sep 3 and Sep 4, same amount and payer", act: "Reverse duplicate" },
    ],
    done: {}, history: [["July 2026", "Grace Liu", "Maya Ortiz", "Aug 9"], ["August 2026", "Grace Liu", "Maya Ortiz", "Sep 8"]],
  };
  // every money movement lands here (who, what, how much, which deal); seeded with the last few weeks
  t.audit = [
    { ts: "Oct 7", who: "grace", area: "trust", what: "Wire posted to trust · held for callback verification", amt: 6050, ref: "D3" },
    { ts: "Sep 30", who: "nina", area: "trust", what: "EMD receipt filed · held at Lone Star Title escrow", amt: 17650, ref: "D1" },
    { ts: "Sep 19", who: "maya", area: "commissions", what: "CDA signed by Heritage Title · 3%", amt: 71700, ref: "D7" },
    { ts: "Sep 8", who: "maya", area: "trust", what: "August reconciliation filed (prepared by Grace Liu)", amt: null, ref: null },
    { ts: "Sep 2", who: "grace", area: "commissions", what: "Paid Jordan Lee via ACH · paystub issued", amt: 13200, ref: "D8" },
    { ts: "Aug 27", who: "grace", area: "trust", what: "EMD released to Lone Star Title at closing", amt: 10400, ref: "D8" },
  ];
  t.exported = null;
  t.routing = {
    avail: { maya: true, jordan: true, priya: true, sam: true, leo: true },
    rules: [
      { id: "R1", name: "Luxury · $1.5M and up", on: true, match: "all", conds: [["price", ">=", "1500000"], ["intent", "=", "Buy"]], dist: "claim", agents: ["maya", "priya"], claim: 5, hours: false, fallback: "maya" },
      { id: "R2", name: "Zillow & portals", on: true, match: "any", conds: [["source", "=", "Zillow"], ["source", "=", "Realtor.com"]], dist: "weighted", agents: ["jordan", "sam", "priya"], w: { jordan: 3, sam: 2, priya: 1 }, hours: true, from: 8, to: 21 },
      { id: "R3", name: "Rentals enquiries", on: true, match: "all", conds: [["intent", "=", "Rent"]], dist: "agent", agents: ["leo"], hours: false },
      { id: "R4", name: "Open-house sign-ins", on: true, match: "any", conds: [["source", "=", "Open house"]], dist: "pond", agents: [], hours: false },
      { id: "RC", name: "Everyone else", on: true, catchAll: true, match: "all", conds: [], dist: "rr", agents: ["jordan", "sam", "priya"], hours: true, from: 8, to: 21 },
    ],
    counts: { R2: { jordan: 2, sam: 1, priya: 1 }, RC: { jordan: 1, sam: 1, priya: 0 } },
    idle: { on: true, mins: 15, to: "next" },
    pond: [], log: [], watch: [],
  };
}

// ---------- shared bits ----------
const TxSev = ({ s }) => html`<span class=${"tx-sev " + s}>${s === "Blocker" ? "● " : s === "Warning" ? "▲ " : "i "}${s}</span>`;
const TxChip = ({ n, tone }) => html`<span class=${"tx-chip " + (tone || "")}><${TxIc} n=${n} s=${15} /></span>`;
function TxPdf({ snip, total }) {
  if (!snip) return html`<div class="tx-pdf empty muted">Pick a finding to see where it came from.</div>`;
  return html`<div class="tx-pdf"><div class="tx-pg">
    <div class="tx-pgh">${snip.head}</div>
    <div class="tx-ln f" style="width:92%"></div><div class="tx-ln f" style="width:78%"></div>
    ${snip.lines.map((ln, i) => html`<div class=${"tx-ln t" + (i === snip.hl ? (snip.ok ? " ok" : " bad") : "")}>${ln}${i === snip.hl && html`<em>${snip.ok ? "✓ " : "! "}${snip.mark}</em>`}</div>`)}
    <div class="tx-ln f" style="width:88%"></div><div class="tx-ln f" style="width:64%"></div><div class="tx-ln f" style="width:81%"></div>
    <div class="tx-pgf"><span>TXR-1601 · Harbor & Vine Realty</span><span>Page ${snip.pg}${total ? " of " + total : ""}</span></div>
  </div></div>`;
}
const txThread = (personId) => S.d.threads.find(t => t.person === personId);
function txSay(personId, from, text, ch) {
  const t = txThread(personId); if (!t) return;
  t.msgs.push({ from, text, at: "Now", ch: ch || t.channel }); t.when = "now";
  if (from === "them") t.unread += 1;
}

// ================= A) COMPLIANCE =================
function TxCompliance() {
  const [flt, setFlt] = useState("Open");
  txEmdRows(); txDisbRows();
  // contracts first (they have deadlines), then offers, then early-stage files; blockers float up inside each group
  const ORD = { "Under contract": 0, Offer: 1, Closed: 2, Touring: 3, "New lead": 4 };
  const all = S.d.deals.slice().sort((a, b) => (ORD[a.stage] ?? 5) - (ORD[b.stage] ?? 5) || txFindings(b).filter(f => f.sev === "Blocker").length - txFindings(a).filter(f => f.sev === "Blocker").length);
  const queue = all.filter(d => flt === "All" || (flt === "Open" ? txRev(d).status !== "Compliant" : txRev(d).status === "Compliant"));
  const d = txDeal(S.route.id) || queue[0] || all[0];
  const openN = all.filter(x => txRev(x).status !== "Compliant").length;
  const blockers = all.reduce((a, x) => a + txFindings(x).filter(f => f.sev === "Blocker").length, 0);
  const fresh = all.filter(x => txRev(x).fresh).length;
  return html`<${Shell} title="Compliance" sub=${txHello(openN ? openN + " file" + (openN > 1 ? "s" : "") + " to review" + (blockers ? ", " + blockers + " blocker" + (blockers > 1 ? "s" : "") : "") + (fresh ? " · " + fresh + " new contract" + (fresh > 1 ? "s" : "") : "") : "Every file is compliant")}
    actions=${html`<div class="tx-act">${txCan("commissions") && html`<button class="btn" onClick=${() => go("commissions/cda")}>CDA builder</button>`}<button class="btn pri" onClick=${() => up(s => { s.modal = { kind: "txIntake" }; })}><${TxIc} n="up" /> New deal from contract</button></div>`}>
    <div class="page tx-page">
      <div class="tx-kpis">
        <div><${TxChip} n="shield" /><span>Files to review</span><b>${openN}</b></div>
        <div><${TxChip} n="alert" tone="r" /><span>Open blockers</span><b>${blockers}</b></div>
        <div><${TxChip} n="sparkle" tone="br" /><span>Docs audited by AI</span><b>${all.reduce((a, x) => a + txDocs(x).length, 0)}</b></div>
        <div><${TxChip} n="clock" tone="b" /><span>Median review time</span><b>4h 12m</b></div>
      </div>
      <div class="tx-cmp">
        <div class="card tx-q">
          <div class="hd"><h3>Queue</h3><span class="sp"></span>${["Open", "Compliant", "All"].map(k => html`<button class=${"tx-seg" + (flt === k ? " on" : "")} onClick=${() => setFlt(k)}>${k}</button>`)}</div>
          ${queue.length ? queue.map(x => { const l = L(x.listing), fs = txFindings(x), r = txRev(x), b = fs.filter(f => f.sev === "Blocker").length, w = fs.filter(f => f.sev === "Warning").length; return html`
            <button class=${"tx-qi" + (x.id === d.id ? " on" : "")} onClick=${() => go("compliance/" + x.id)}>
              <span class="tx-th" style=${"background-image:url(" + img(l.img) + ")"}></span>
              <span class="tx-qm"><b>${l.addr}</b><small>${P(x.person).short} · ${x.kind} · ${x.stage}</small>${r.fresh && html`<em class="tx-new">New contract</em>`}
                <span class="row" style="gap:5px;margin-top:4px">${b ? html`<span class="tx-sev Blocker">${b} blocker${b > 1 ? "s" : ""}</span>` : ""}${w ? html`<span class="tx-sev Warning">${w} warning${w > 1 ? "s" : ""}</span>` : ""}${!b && !w ? html`<span class=${"pill " + (r.status === "Compliant" ? "g" : r.status === "Changes requested" ? "r" : "f")}>${r.status === "Compliant" ? "Compliant" : r.status === "Changes requested" ? "With agent" : "Clean · ready"}</span>` : ""}</span></span>
              <${Av} a=${A(x.agent)} /></button>`; }) : html`<div class="tx-empty"><${TxChip} n="shield" tone="g" /><b>${flt === "Open" ? "Queue clear" : "Nothing here yet"}</b><span class="muted">${flt === "Open" ? "Every file is compliant. New contracts land here the moment they're signed." : "Files you mark compliant show up here."}</span>${flt !== "All" && html`<button class="btn sm" onClick=${() => setFlt("All")}>Show all files</button>`}</div>`}
        </div>
        <${TxFile} d=${d} key=${d.id} />
      </div>
    </div></${Shell}>`;
}

function TxFile({ d }) {
  const r = txRev(d), docs = r.docs, l = L(d.listing), p = P(d.person);
  if (d.agreement.signed && docs[0].st === "Missing") { docs[0].st = "Pending"; docs[0].f.forEach(f => { f.done = true; }); }
  const findings = txFindings(d);
  const top = findings.find(f => f.sev === "Blocker" && !f.live) || findings.find(f => f.sev === "Warning" && !f.live) || findings[0] || {};
  const [open, setOpen] = useState(() => Math.max(0, docs.findIndex(x => x.f.includes(top))));
  const [sel, setSel] = useState(() => top.id);
  const [rej, setRej] = useState(null);
  const [note, setNote] = useState("");
  const all = docs.flatMap(x => x.f).concat(findings.filter(f => f.live));
  const selF = all.find(f => f.id === sel) || findings[0] || all[0];
  const selDoc = docs.find(x => x.f.includes(selF));
  const cda = S.d.tx.cda[d.id];
  const openBlock = findings.some(f => f.sev === "Blocker");
  const allAcc = docs.every(x => x.st === "Accepted");
  const why = r.status === "Compliant" ? "" : openBlock ? "Clear the blockers first" : !allAcc ? docs.filter(x => x.st !== "Accepted").length + " document(s) still need a decision" : "";
  const [noteErr, setNoteErr] = useState("");
  const [done, setDone] = useState(false);
  const who = txMe().name, agentFirst = txFirst(d.agent);
  const log = (what) => r.log.unshift([who, what, Date.now()]);
  if (r.fresh) r.fresh = false;
  function fix(doc, f) {
    if (f.live) { S.d.tx.cdaSel = d.id; go("commissions/cda"); return; }
    if (/agreement to/.test(f.fix)) { openAgreement(p, d.listing, d); return; }
    if (/trust ledger/.test(f.fix)) { go(txCan("trust") ? "trust/emd" : "deal/" + d.id); return; }
    if (/offer to 2.25/.test(f.fix)) { up(() => { f.done = true; log("Offer draft corrected to 2.25% (matches agreement)"); }); toast("Offer draft updated to 2.25% · matches Marcus's agreement"); return; }
    up(() => { f.pending = true; });
    if (/initials/.test(f.fix)) txSay(d.person, "me", "Quick one before the broker signs off: page 4 of the contract needs your initials (¶6.A). I've sent a 10-second e-sign link.");
    toast(f.fix.replace(/^Request|^Send|^Ask/, m => ({ Request: "Requested", Send: "Sent", Ask: "Asked" })[m]) + " · we'll update the file when it's back");
    setTimeout(() => { up(() => { f.pending = false; f.done = true; if (doc.st === "Missing") doc.st = "Pending"; log("Resolved: " + f.t); if (/initials/.test(f.fix)) txSay(d.person, "them", "Done, initialed page 4 ✍️"); }); toast("Back in the file: " + f.t.replace(/^Missing |not uploaded$/, "").trim() + " ✓"); }, 1400);
  }
  function accept(doc) { const prev = doc.st; up(() => { doc.st = "Accepted"; doc.note = ""; log("Accepted " + doc.n); }); toast("Accepted · " + doc.n, ["Undo", () => up(() => { doc.st = prev; log("Undid approval: " + doc.n); })]); const nx = docs.findIndex(x => x.st !== "Accepted"); if (nx >= 0) setOpen(nx); }
  function reject(doc) {
    if (note.trim().length < 8) { setNoteErr(note.trim() ? "A few more words, so " + agentFirst + " knows exactly what to fix" : "Add a note so " + agentFirst + " knows what to fix"); return; }
    up(() => { doc.st = "Rejected"; doc.note = note; r.status = "Changes requested"; log("Sent back " + doc.n + ": " + note); S.d.activity.push([d.person, "Compliance", who + " requested changes: " + doc.n, TX_TODAY]); });
    txNotify(d.agent, who.split(" ")[0] + " sent back " + doc.n + " on " + l.addr + ": " + note.split("\n")[0].replace(/^• /, ""), "deal/" + d.id);
    setRej(null); setNote(""); setNoteErr(""); toast("Sent back to " + A(d.agent).name + " · they've been notified");
  }
  function upload(doc, e) { const f = e.target.files && e.target.files[0]; up(() => { doc.st = "Pending"; doc.file = f ? f.name : "upload.pdf"; doc.at = TX_TODAY; doc.f.forEach(x => { x.done = true; }); doc.f.push({ id: "u" + Date.now(), sev: "Info", t: "Uploaded " + (f ? f.name : "file") + " · signatures found 2/2", x: "AI checked every signature block.", snip: txSnip(1, doc.n.toUpperCase(), ["Buyer signature: Aisha Brooks", "Buyer signature: Daniel Brooks", "Date: Oct 8, 2026"], 0, "Signed", true), done: true }); log("Uploaded " + doc.n); }); toast("Uploaded and audited · " + doc.n); }
  function compliant() {
    up(() => { r.status = "Compliant"; log("Marked file compliant"); S.d.activity.push([d.person, "Compliance", "File marked compliant by " + who, TX_TODAY]); });
    txNotify(d.agent, "Your file on " + l.addr + " is compliant · commission can be disbursed once the CDA is signed", "deal/" + d.id);
    if (txWhoId() !== "maya") txNotify("maya", who.split(" ")[0] + " marked " + l.addr + " compliant", "compliance/" + d.id);
    txNotify("grace", l.addr + " is compliant · ready for the CDA", "commissions/cda");
    setDone(true); toast("File compliant · " + l.addr);
  }
  function reopen() { up(() => { r.status = "Pending review"; log("Reopened file"); }); setDone(false); toast("File reopened for review"); }
  const canReview = txMayReview();
  const stPill = (st) => html`<span class=${"pill " + ({ Accepted: "g", Rejected: "r", Missing: "r", Pending: "a" }[st] || "")}>${st === "Pending" ? "Needs review" : st}</span>`;
  return html`<div class="tx-file">
    <div class="card tx-fh">
      <div class="tx-fhi" style=${"background-image:url(" + img(l.img) + ")"}></div>
      <div class="tx-fhb">
        <div class="row" style="flex-wrap:wrap;gap:6px">${stagePill(d.stage)}<span class=${"pill " + (r.status === "Compliant" ? "g" : r.status === "Changes requested" ? "r" : "a")}>${r.status}</span>${d.fromIntake && html`<span class="pill br">Created from ${d.fromIntake}</span>`}</div>
        <h2>${l.addr}</h2>
        <div class="row muted" style="font-size:12.5px;flex-wrap:wrap;gap:6px"><${PAv} p=${p} /><span>${p.name}</span><span>·</span><${Av} a=${A(d.agent)} /><span>${A(d.agent).name}</span><span>·</span><span class="num">${usd(d.price)}</span></div>
        <div class="tx-act" style="margin-top:4px">
          <button class="btn pri" disabled=${!!why || r.status === "Compliant" || !canReview} title=${!canReview ? "Maya or Nina signs off files" : why} onClick=${compliant}><${TxIc} n="shield" /> ${r.status === "Compliant" ? "Compliant ✓" : "Mark file compliant"}</button>
          ${txCan("deal") && html`<button class="btn" onClick=${() => go("deal/" + d.id)}>Open deal file →</button>`}
        </div>
        ${why && html`<div class="muted" style="font-size:12px"><${TxIc} n="lock" s=${12} /> ${why}. Commission can't be disbursed until the file is compliant.</div>`}
        ${r.status === "Changes requested" && html`<div class="muted" style="font-size:12px"><${TxIc} n="send" s=${12} /> With ${A(d.agent).name} for changes · you'll see it here again when they re-upload.</div>`}
      </div>
    </div>
    ${r.status === "Compliant" && (done || TX_LIVE(d)) && html`<div class="tx-done" role="status"><${TxChip} n="shield" tone="g" /><div><b>${done ? "File compliant." : "This file is compliant."}</b> ${txLimit(d) ? "Next: send the CDA to title so " + agentFirst + " can be paid." : "Next: get the agreement signed before a CDA can be built."}<div class="muted" style="font-size:12px">${A(d.agent).name} has been notified. Logged in the review history.</div></div>
      <div class="tx-act">${txCan("commissions") && txLimit(d) && html`<button class="btn sm pri" onClick=${() => { S.d.tx.cdaSel = d.id; go("commissions/cda"); }}>${(S.d.tx.cda[d.id] || {}).status === "Signed" ? "View CDA" : "Build CDA"} →</button>`}${canReview && done && html`<button class="btn sm ghost" onClick=${reopen}>Undo</button>`}</div></div>`}
    <div class="tx-fb">
      <div class="card tx-docs">
        <div class="hd"><h3>Documents & AI audit</h3><span class="sp"></span><span class="muted" style="font-size:12px">${docs.filter(x => x.st === "Accepted").length}/${docs.length} accepted</span></div>
        ${docs.map((doc, i) => { const fs = doc.f.filter(f => !f.done), on = open === i; return html`<div class=${"tx-doc" + (on ? " on" : "")}>
          <button class="tx-dh" onClick=${() => { setOpen(on ? -1 : i); setRej(null); if (!on && doc.f[0]) setSel((fs[0] || doc.f[0]).id); }}>
            <${TxChip} n="doc" tone=${doc.st === "Accepted" ? "g" : doc.st === "Missing" || doc.st === "Rejected" ? "r" : ""} />
            <span class="tx-dm"><b>${doc.n}</b><small>${doc.st === "Missing" ? "Required · not uploaded" : doc.pages + " pages · " + doc.by + " · " + doc.at}</small></span>
            <span class="tx-dots">${fs.map(f => html`<i class=${f.sev}></i>`)}</span>${stPill(doc.st)}</button>
          ${on && html`<div class="tx-db">
            ${doc.f.map(f => html`<div class=${"tx-f" + (f.done ? " done" : "") + (selF === f ? " sel" : "")} onClick=${() => setSel(f.id)}>
              <div class="row" style="gap:8px;flex-wrap:wrap"><${TxSev} s=${f.done ? "Info" : f.sev} /><b>${f.t}</b>${f.done && f.sev !== "Info" ? html`<span class="pill g">${f.auto ? "Matched" : "Resolved"}</span>` : ""}</div>
              <div class="muted" style="font-size:12.5px">${f.x}</div>
              <div class="row" style="gap:6px;flex-wrap:wrap"><button class="btn sm ghost" onClick=${e => { e.stopPropagation(); setSel(f.id); }}>View source · p.${f.snip.pg}</button>
                ${!f.done && f.fix && html`<button class="btn sm" disabled=${f.pending} onClick=${e => { e.stopPropagation(); fix(doc, f); }}>${f.pending ? "Waiting…" : f.fix}</button>`}</div></div>`)}
            ${doc.note && html`<div class="tx-note"><b>Broker note:</b> ${doc.note}</div>`}
            ${rej === i ? html`<div class="field"><span>What needs fixing? (goes to ${A(d.agent).name})</span><textarea rows="3" value=${note} aria-invalid=${!!noteErr} class=${noteErr ? "tx-bad-in" : ""} onInput=${e => { setNote(e.target.value); setNoteErr(""); }} onKeyDown=${e => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) reject(doc); if (e.key === "Escape") setRej(null); }}></textarea>
                ${noteErr && html`<div class="tx-err" role="alert">${noteErr}</div>`}
                <div class="tx-act"><button class="btn sm" onClick=${() => { setRej(null); setNoteErr(""); }}>Cancel</button><button class="btn sm pri" onClick=${() => reject(doc)}>Send back to ${agentFirst}</button></div></div>`
              : html`<div class="tx-act">
                ${doc.st === "Missing" ? html`<label class="btn sm"><${TxIc} n="up" s=${13} /> Upload PDF<input type="file" accept="application/pdf,.pdf" class="tx-file-in" onChange=${e => upload(doc, e)} /></label>`
                  : html`<button class="btn sm pri" disabled=${doc.st === "Accepted" || fs.some(f => f.sev === "Blocker") || !canReview} title=${!canReview ? "Maya or Nina reviews documents" : fs.some(f => f.sev === "Blocker") ? "Resolve blockers first" : ""} onClick=${() => accept(doc)}>${doc.st === "Accepted" ? "Accepted ✓" : "Approve"}</button>`}
                ${doc.st !== "Missing" && doc.st !== "Accepted" && canReview && html`<button class="btn sm" onClick=${() => { setRej(i); setNoteErr(""); setNote(fs.length ? fs.map(f => "• " + f.t).join("\n") : ""); }}>Reject with note</button>`}
                ${fs.some(f => f.sev === "Blocker") && doc.st !== "Accepted" && html`<span class="muted" style="font-size:11.5px">Approve unlocks once the blockers are resolved</span>`}
                ${doc.st === "Accepted" && html`<button class="btn sm ghost" onClick=${() => { up(() => { doc.st = "Pending"; log("Revoked approval: " + doc.n); }); }}>Revoke approval</button>`}
              </div>`}
          </div>`}
        </div>`; })}
        ${cda && html`<div class="tx-doc"><div class="tx-dh static">
          <${TxChip} n="coin" tone=${txCdaOver(d) ? "r" : "g"} /><span class="tx-dm"><b>Commission Disbursement Authorization</b><small>${cda.status} · ${txCdaPct(cda)}% · checked live against the ${(txLimit(d) || { doc: "agreement" }).doc.toLowerCase()}</small></span>
          ${txCdaOver(d) ? html`<button class="btn sm" onClick=${() => setSel("cda")}>View</button><span class="tx-sev Blocker">Blocker</span>` : html`<span class="pill g">Within agreement</span>`}</div>
          ${txCdaOver(d) && sel === "cda" && html`<div class="tx-db"><div class="tx-f sel"><div class="row" style="gap:8px;flex-wrap:wrap"><${TxSev} s="Blocker" /><b>${findings.find(f => f.live).t}</b></div><div class="muted" style="font-size:12.5px">${findings.find(f => f.live).x}</div><div><button class="btn sm pri" onClick=${() => fix(null, findings.find(f => f.live))}>Fix in the CDA builder →</button></div></div></div>`}
        </div>`}
      </div>
      <div class="tx-src">
        <div class="lbl muted tx-cap"><${TxIc} n="sparkle" s=${13} /> Source · ${selF ? (selF.live ? "CDA draft" : (selDoc || docs[0]).n) : "—"}</div>
        <${TxPdf} snip=${selF && selF.snip} total=${selF && !selF.live && selDoc ? selDoc.pages : 1} />
        <div class="card"><div class="hd"><h3>Review history</h3></div><div class="bd tx-log">
          ${r.log.length ? r.log.map(x => html`<div><i></i><span><b>${x[0]}</b> ${x[1]}</span><small>${txAgo(x[2])}</small></div>`) : html`<div class="muted" style="font-size:12.5px">Submitted ${r.sub} by ${A(d.agent).name}. No decisions yet.</div>`}
        </div></div>
      </div>
    </div>
  </div>`;
}

// ---------- create a transaction from a contract PDF ----------
const TX_INTAKE = [
  ["addr", "Property", "77 Rainey St #1402, Austin TX 78701", 0.99, txSnip(1, "2. PROPERTY", ["A. LAND: Unit 1402, The Shore Condominiums,", "Addition, City of Austin, Travis County, Texas,", "known as 77 Rainey St #1402, Austin TX 78701"], 2, "Address", true)],
  ["buyer", "Buyer", "Marcus Webb", 0.98, txSnip(1, "1. PARTIES", ["The parties to this contract are", "Rainey Holdings LLC (Seller) and", "Marcus Webb (Buyer)."], 2, "Buyer", true)],
  ["seller", "Seller", "Rainey Holdings LLC", 0.97, txSnip(1, "1. PARTIES", ["The parties to this contract are", "Rainey Holdings LLC (Seller) and", "Marcus Webb (Buyer)."], 1, "Seller", true)],
  ["price", "Sales price", "672000", 0.99, txSnip(1, "3. SALES PRICE", ["A. Cash portion of Sales Price payable by Buyer: $134,400", "B. Sum of all financing described: $537,600", "C. Sales Price (Sum of A and B): $672,000"], 2, "$672,000", true)],
  ["emd", "Earnest money", "6720", 0.96, txSnip(2, "5. EARNEST MONEY", ["Buyer must deliver to Harbor & Vine Realty Trust", "earnest money of $6,720 and an Option Fee of", "$250 within 3 days after the Effective Date."], 1, "$6,720", true)],
  ["option", "Option period ends", "Oct 15", 0.93, txSnip(2, "5.B TERMINATION OPTION", ["For nominal consideration... Buyer has the", "unrestricted right to terminate this contract", "within 7 days after the Effective Date (Oct 8)."], 2, "7 days → Oct 15", true)],
  ["fin", "Financing deadline", "Oct 30", 0.71, txSnip(1, "THIRD PARTY FINANCING ADDENDUM", ["2. BUYER APPROVAL: This contract is subject to", "Buyer obtaining Buyer Approval within", "22 days after the Effective Date (handwritten)"], 2, "22 days? · handwritten", false)],
  ["close", "Closing date", "Nov 13", 0.98, txSnip(7, "9. CLOSING", ["A. The closing of the sale will be on or before", "November 13, 2026, or within 7 days after", "objections ... have been cured or waived."], 1, "Nov 13", true)],
  ["title", "Title company", "Independence Title · Rainey St", 0.95, txSnip(2, "6. TITLE POLICY", ["Seller shall furnish ... an owner policy of title", "insurance issued by Independence Title", "(Title Company) in the amount of the Sales Price"], 1, "Title company", true)],
];
function TxIntakeModal({ m, close }) {
  const [step, setStep] = useState("pick");
  const [fname, setFname] = useState("");
  const [vals, setVals] = useState(() => Object.fromEntries(TX_INTAKE.map(f => [f[0], f[2]])));
  const [edited, setEdited] = useState({});
  const [sel, setSel] = useState("fin");
  txEsc(close);
  const ba = (S.d.deals.find(x => x.person === "P3" && x.agreement.signed) || {}).agreement;
  function pick(name) { setFname(name); setStep("read"); setTimeout(() => setStep("review"), 1300); }
  function create() {
    let n = S.d.deals.length + 1; while (txDeal("D" + n)) n++;
    const id = "D" + n, price = +String(vals.price).replace(/[^\d.]/g, "") || 672000, emd = +String(vals.emd).replace(/[^\d.]/g, "") || 6720;
    up(s => {
      const deal = { id, kind: "Buyer", person: "P3", listing: "L3", stage: "Under contract", price, agent: "jordan", comp: 2.25, close: vals.close, progress: 0.25, fromIntake: fname,
        agreement: Object.assign({ signed: true, on: "Oct 6", comp: "2.25%", term: "90 days" }, ba || {}),
        dates: [["Effective date", "Oct 8", true], ["Option period ends", vals.option, false], ["Financing deadline", vals.fin, false], ["Closing", vals.close, false]],
        checklist: [["Buyer agreement signed", true], ["Executed contract", true], ["Earnest money receipt", false], ["Option fee receipt", false], ["Inspection report", false], ["Appraisal", false], ["Title commitment", false], ["Closing disclosure", false]],
        docs: [["Buyer representation agreement", "Signed"], ["One to Four Family Residential Contract", "Signed"], ["Third Party Financing Addendum", "Signed"]] };
      deal.progress = 2 / 8;
      s.d.deals.push(deal);
      const l = L("L3"); l.status = "Under contract"; P("P3").stage = "Under contract";
      s.d.activity.push(["P3", "Deals", "Contract on 77 Rainey St #1402 · " + usd(price) + " · created from " + fname, TX_TODAY]);
      s.d.tx.emd.push({ id: "E" + (s.d.tx.emd.length + 1), deal: id, amt: emd, method: "ACH", holder: "trust", status: "Expected", on: "due Oct 11", note: "From the contract ¶5 · due within 3 days" });
      s.d.tx.disb.push({ id: "X" + id, deal: id, status: "Incomplete" });
      const r = txMakeRev(deal);
      r.docs.push({ n: "One to Four Family Residential Contract", st: "Pending", pages: 11, by: "Jordan Lee", at: TX_TODAY, file: fname, f: [
        { id: "i1", sev: "Info", t: "9 fields extracted with sources · deal created", x: "Every field links back to the page it came from.", snip: TX_INTAKE[3][4], done: false },
        { id: "i2", sev: edited.fin ? "Info" : "Warning", t: edited.fin ? "Financing deadline confirmed by you: " + vals.fin : "Financing deadline is handwritten (" + vals.fin + ")", x: edited.fin ? "Manually set, so date cascades won't overwrite it." : "Read with 71% confidence. Confirm with the lender's addendum.", snip: TX_INTAKE[6][4], fix: edited.fin ? null : "Confirm with lender", done: false },
        { id: "i3", sev: "Warning", t: "Earnest money " + usd(emd) + " due by Oct 11", x: "Request it through the secure ACH link in Trust & EMD.", snip: TX_INTAKE[4][4], fix: "Check the trust ledger", done: false },
      ] });
      s.d.tx.rev[id] = r;
    });
    txAudit("trust", "EMD expected from contract ¶5 · " + L("L3").addr, emd, id);
    txNotify("jordan", "New deal from contract: 77 Rainey St #1402 · " + usd(price) + " · compliance review opened", "deal/" + id);
    close();
    toast("Deal created from " + fname + " · same record as Marcus's buyer agreement", ["Open deal", () => go("deal/" + id)]);
    go("compliance/" + id);
  }
  const f = TX_INTAKE.find(x => x[0] === sel);
  return html`<div class="scrim" onClick=${e => e.target === e.currentTarget && close()}><div class="modal tx-wide" role="dialog" aria-label="New deal from contract">
    <div class="hd"><h3>New deal from a contract</h3><button class="btn ghost sm" aria-label="Close" onClick=${close}><${TxIc} n="x" /></button></div>
    ${step === "pick" && html`<div class="bd">
      <label class="tx-drop"><${TxChip} n="up" tone="br" /><b>Choose the executed contract (PDF)</b><span class="muted">We read every page, pull the parties, money and dates, and show you exactly where each one came from.</span>
        <input type="file" accept="application/pdf,.pdf" class="tx-file-in" onChange=${e => { const x = e.target.files && e.target.files[0]; if (x) pick(x.name); }} /><span class="btn pri sm">Choose PDF</span></label>
      <button class="btn ghost sm" style="align-self:center" onClick=${() => pick("Webb_77Rainey_TREC-20-18.pdf")}>No file handy? Use the sample contract</button>
    </div>`}
    ${step === "read" && html`<div class="bd tx-reading"><div class="tx-spin"></div><b>Reading ${fname}</b><span class="muted">11 pages · TREC One to Four Family Residential Contract · finding parties, money, dates…</span></div>`}
    ${step === "review" && html`<div class="bd tx-intake">
      <div class="tx-ifs">
        <div class="tx-match"><${TxChip} n="user" tone="g" /><span><b>Matched Marcus Webb</b> · existing buyer${ba ? ", agreement signed " + ba.on + " · " + ba.comp : ""}. Listing 77 Rainey St #1402 (L3). One record, nothing re-keyed.</span></div>
        ${TX_INTAKE.map(x => html`<div class=${"tx-if" + (sel === x[0] ? " on" : "") + (x[3] < .8 && !edited[x[0]] ? " low" : "")} onClick=${() => setSel(x[0])}>
          <span class="tx-ifl">${x[1]}<small>${edited[x[0]] ? "edited by you · cascades skip it" : "p." + x[4].pg + " · " + Math.round(x[3] * 100) + "%"}</small></span>
          <input value=${x[0] === "price" || x[0] === "emd" ? (edited[x[0]] ? vals[x[0]] : usd(+vals[x[0]])) : vals[x[0]]} onFocus=${() => setSel(x[0])} onInput=${e => { const v = e.target.value; setVals(o => ({ ...o, [x[0]]: v })); setEdited(o => ({ ...o, [x[0]]: true })); }} /></div>`)}
      </div>
      <div class="tx-src"><div class="lbl muted tx-cap"><${TxIc} n="sparkle" s=${13} /> ${f[1]} · from ${fname}</div><${TxPdf} snip=${f[4]} total=${11} /></div>
    </div>`}
    <div class="ft">${step === "review" ? html`<span class="muted" style="font-size:12px;margin-right:auto">AI run · $1.00 of your $40 monthly cap</span><button class="btn" onClick=${close}>Cancel</button><button class="btn pri" onClick=${create}>Create deal</button>` : html`<button class="btn" onClick=${close}>Cancel</button>`}</div>
  </div></div>`;
}

// ================= B) COMMISSIONS =================
function TxRing({ v, size, label, sub, tone }) {
  const R = 40, C = 2 * Math.PI * R, p = Math.max(0, Math.min(1, v));
  return html`<div class="tx-ring" style=${"width:" + (size || 108) + "px"}><svg viewBox="0 0 100 100"><circle cx="50" cy="50" r=${R} fill="none" stroke="#EFEBE1" stroke-width="9" /><circle cx="50" cy="50" r=${R} fill="none" stroke=${tone || "#2E6B52"} stroke-width="9" stroke-linecap="round" stroke-dasharray=${C} stroke-dashoffset=${C * (1 - p)} transform="rotate(-90 50 50)" /></svg><div><b>${label}</b><small>${sub}</small></div></div>`;
}
function txRowDeal(row) { return row.deal ? txDeal(row.deal) : { id: row.id, price: row.price, comp: row.pct, agent: row.agent, listing: null, person: null, kind: "Buyer", agreement: { signed: true, comp: row.pct + "%" } }; }
function txRowAddr(row) { const d = row.deal && txDeal(row.deal); return d ? L(d.listing).addr : row.addr; }
// the pipeline is derived from the deals at render time: anything under contract or closed anywhere in the app shows up here
function txDisbRows() {
  const t = S.d.tx;
  S.d.deals.forEach(d => { if (TX_LIVE(d) && !t.disb.some(r => r.deal === d.id)) t.disb.push({ id: "X" + d.id, deal: d.id, status: "Incomplete", auto: true }); });
  t.disb.forEach(r => { if (r.status === "Processed" && !r.snap) { r.snap = txCalc(txRowDeal(r)); const st = t.stubs.find(s => s.deal === r.deal); if (st) { st.net = Math.round(r.snap.agent); st.gross = Math.round(r.snap.gross); st.lines = r.snap.lines; } } });
  t.disb.forEach(r => { if (r.status !== "Incomplete" || !r.deal) return; const d = txDeal(r.deal), c = d && t.cda[d.id]; if (c && (c.status === "Sent" || c.status === "Signed") && txRev(d).status === "Compliant" && !txCdaOver(d)) r.status = "Ready"; });
  // a deal that falls out of contract drops off, unless money already moved on it
  return t.disb.filter(r => !r.deal || (txDeal(r.deal) && (TX_LIVE(txDeal(r.deal)) || r.status !== "Incomplete")));
}
// one earnest-money line per contract; created the first time anyone looks once the deal is under contract
function txEmdFor(d) {
  const t = S.d.tx; if (!d) return null;
  const own = t.emd.find(x => x.deal === d.id); if (own) return own;
  // both sides in-house (our buyer on our listing): one deposit, one ledger line
  const twin = t.emd.find(x => { const o = txDeal(x.deal); return o && o.id !== d.id && o.listing === d.listing && TX_LIVE(o); });
  if (twin) return twin;
  if (!TX_LIVE(d)) return null;
  let amt = 0;
  try { const o = ((window.SlApi && window.SlApi.offers(d.listing)) || []).find(x => /accept/i.test(x.status || "")); if (o) amt = +o.emd || 0; } catch (e) {}
  if (!amt) { const o = (S.d.offers || []).filter(x => x.l === d.listing).pop(); if (o) amt = +o.emd || 0; }
  if (!amt) amt = Math.round(d.price * 0.01 / 50) * 50;
  let n = t.emd.length + 1; while (t.emd.some(x => x.id === "E" + n)) n++;
  const closed = d.stage === "Closed", title = ((t.cda[d.id] || {}).title || "Lone Star Title · Dana Pruitt").split(" · ")[0];
  const e = { id: "E" + n, deal: d.id, amt, method: "ACH", holder: d.kind === "Listing" ? "title" : "trust", titleCo: title, status: closed ? "Released" : "Expected", on: closed ? d.close : "due in 3 days", note: closed ? "Released to title at closing" : "From the executed contract ¶5 · added when the deal went under contract", auto: true };
  t.emd.push(e); return e;
}
function txEmdRows() { S.d.deals.forEach(d => { if (TX_LIVE(d)) txEmdFor(d); }); return S.d.tx.emd; }
const txHolder = (e) => e.holder === "trust" ? "H&V trust" : (e.titleCo || "Lone Star Title");

// ---------- cross-file API: one source of truth for each deal's commission and earnest money ----------
window.TxApi = {
  commission(dealId) {
    const d = txDeal(dealId); if (!d || !d.agent || !A(d.agent)) return null;
    const row = txDisbRows().find(r => r.deal === dealId), c = (row && row.snap) || txCalc(d), pl = txPlan(d.agent);
    const capped = pl.split >= 100 ? false : !!(pl.cap && (pl.paid >= pl.cap || /^Caps on/.test(c.capNote)));
    const status = row ? row.status : TX_LIVE(d) ? "Incomplete" : "Estimate";
    return {
      gross: txR(c.gross), pct: c.pct, splitPct: pl.split >= 100 || (pl.cap && pl.paid >= pl.cap) ? 100 : txSplitNow(pl),
      brokerage: txR(c.co), fees: c.lines.filter(l => l[3] === "n" && !/company dollar|Post-cap/.test(l[0])).map(l => [l[0], txR(-l[1])]),
      net: txR(c.agent), status, hint: status === "Estimate" ? "Estimate until the deal is under contract" : status === "Incomplete" && row ? txWhyIncomplete(row) : TX_DISB_HINT[status],
      capped, capNote: c.capNote, plan: pl.name, lines: c.lines.map(l => l.slice()), team: c.team, cda: (S.d.tx.cda[dealId] || {}).status || null,
      compliance: txRev(d).status, paidOn: row && row.paidOn || null, route: "commissions/disb",
    };
  },
  emd(dealId) {
    const e = txEmdFor(txDeal(dealId)); if (!e) return null;
    return { amount: e.amt, status: e.status, method: e.method, holder: txHolder(e), on: e.on, verified: !!e.verified, route: "trust/emd" };
  },
};
function txWhyIncomplete(row) {
  const d = txDeal(row.deal); if (!d) return "";
  const out = []; if (txRev(d).status !== "Compliant") out.push("file not compliant"); const c = S.d.tx.cda[d.id];
  if (!c) out.push("no CDA yet"); else if (txCdaOver(d)) out.push("CDA exceeds agreement"); else if (c.status === "Draft") out.push("CDA not sent to title");
  return out.join(" · ");
}

function TxCommissions() {
  const tabs = [["disb", "Disbursements"], ["cda", "CDA builder"], ["plans", "Plans & fees"], ["pay", "Paystubs"], ["audit", "Audit trail"]];
  const tab = tabs.some(x => x[0] === S.route.id) ? S.route.id : "disb";
  const rows = txDisbRows(); txEmdRows();
  const ytd = S.d.tx.stubs.reduce((a, s) => a + s.net, 0);
  const need = rows.filter(r => r.status === "Ready" || r.status === "Approved" || r.status === "Paid").length;
  return html`<${Shell} title="Commissions" sub=${S.role ? txHello(need ? need + " payout" + (need > 1 ? "s" : "") + " waiting on a step" : "No payouts waiting") : "Plans, CDAs, disbursement and paystubs: all from the same deal record"}
    actions=${html`<div class="tx-act">${txCan("trust") && html`<button class="btn" onClick=${() => go("trust")}>Trust & EMD</button>`}${txCan("backoffice") && html`<button class="btn" onClick=${() => go("backoffice")}>Back office overview</button>`}</div>`}>
    <div class="page tx-page">
      <div class="tx-kpis">
        <div><${TxChip} n="coin" tone="br" /><span>Awaiting approval</span><b>${rows.filter(r => r.status === "Ready").length}</b></div>
        <div><${TxChip} n="bank" tone="b" /><span>Funds to confirm</span><b>${rows.filter(r => r.status === "Approved").length}</b></div>
        <div><${TxChip} n="send" tone="g" /><span>Ready to pay agents</span><b>${rows.filter(r => r.status === "Paid").length}</b></div>
        <div><${TxChip} n="star" /><span>Paid to agents YTD</span><b class="num">${short(ytd)}</b></div>
      </div>
      <div class="tabs tx-tabs">${tabs.map(([k, v]) => html`<button class=${tab === k ? "on" : ""} onClick=${() => go("commissions/" + k)}>${v}</button>`)}</div>
      ${tab === "disb" && html`<${TxDisb} rows=${rows} />`}
      ${tab === "cda" && html`<${TxCdaBuilder} />`}
      ${tab === "plans" && html`<${TxPlans} />`}
      ${tab === "pay" && html`<${TxPay} />`}
      ${tab === "audit" && html`<${TxAudit} area="commissions" />`}
    </div></${Shell}>`;
}

function TxSteps({ st }) {
  const i = TX_DISB.indexOf(st);
  return html`<div class="tx-steps">${TX_DISB.map((s, k) => html`<span class=${k < i ? "ok" : k === i ? "now" : ""} title=${s}><i></i><small>${s}</small></span>`)}</div>`;
}
// a processed payout is frozen: later plan changes or cap progress never rewrite what was paid
const txC = (row) => row.snap || txCalc(txRowDeal(row));
const txPayout = (row) => { const c = txC(row); return c.agent + (c.team ? c.team.amt : 0); };
function txProcess(row) {
  const d = txRowDeal(row), c = txCalc(d), pl = txPlan(d.agent), addr = txRowAddr(row);
  row.snap = c;
  row.status = "Processed"; row.paidOn = TX_TODAY;
  S.d.tx.stubs.push({ agent: d.agent, on: TX_TODAY, addr, gross: Math.round(c.gross), net: Math.round(c.agent), deal: row.deal || null, row: row.id, lines: c.lines.map(l => l.slice()) });
  if (c.team) S.d.tx.stubs.push({ agent: c.team.lead, on: TX_TODAY, addr: addr + " (team override)", gross: Math.round(c.team.amt), net: Math.round(c.team.amt), deal: row.deal || null, row: row.id });
  if (pl.cap) pl.paid = Math.min(pl.cap, pl.paid + c.co);
  txAudit("commissions", "Paid " + A(d.agent).name + " via next-day ACH · paystub issued · " + addr, Math.round(c.agent), row.deal || row.id);
  if (c.team) txAudit("commissions", "Team override to " + A(c.team.lead).name + " · " + addr, Math.round(c.team.amt), row.deal || row.id);
  txNotify(d.agent, "Your commission on " + addr + " was paid: " + usd(c.agent) + " by next-day ACH · paystub in your app", row.deal ? "deal/" + row.deal : "today");
}
// recall an ACH payout: the stub disappears and cap progress rolls back by exactly what this deal added
function txUnprocess(r) {
  const d = txRowDeal(r), pl = txPlan(d.agent), amt = r.snap ? Math.round(r.snap.agent) : 0;
  r.status = "Paid"; if (pl.cap && r.snap) pl.paid = Math.max(0, pl.paid - r.snap.co); r.snap = null; r.paidOn = null;
  S.d.tx.stubs = S.d.tx.stubs.filter(s => s.row !== r.id);
  txAudit("commissions", "ACH recalled · payout reversed for " + A(d.agent).name + " · " + txRowAddr(r), -amt, r.deal || r.id);
}
const TX_FLT = { act: ["Needs action", r => r.status === "Ready" || r.status === "Approved" || r.status === "Paid"], inc: ["Incomplete", r => r.status === "Incomplete"], done: ["Paid out", r => r.status === "Processed"], all: ["All", () => true] };
function TxDisb({ rows }) {
  const [flt, setFlt] = useState(txWhoId() === "grace" ? "act" : "all");
  const [sel, setSel] = useState({});
  const [focus, setFocus] = useState(null);
  const [confirm, setConfirm] = useState(false);
  const [result, setResult] = useState(null);
  const [revert, setRevert] = useState(null);
  const may = txMayApprove();
  const shown = rows.filter(TX_FLT[flt][1]);
  const pick = Object.keys(sel).filter(k => sel[k]).map(k => shown.find(r => r.id === k)).filter(Boolean);
  const nOf = (st) => pick.filter(r => r.status === st);
  const payList = nOf("Paid"), payTotal = payList.reduce((a, r) => a + txPayout(r), 0);
  function batch(from, to, label) {
    const list = nOf(from); if (!list.length) return;
    up(() => list.forEach(r => {
      r.status = to;
      if (to === "Approved") { if (r.deal) { S.cda = S.cda || {}; S.cda[r.deal] = 1; } txAudit("commissions", "Disbursement approved · CDA locked · " + txRowAddr(r), Math.round(txC(r).gross), r.deal || r.id); }
      if (to === "Paid") txAudit("commissions", "Funds received from title into operating · " + txRowAddr(r), Math.round(txC(r).gross), r.deal || r.id);
    }));
    if (to === "Approved") txNotify("grace", txFirst(txWhoId()) + " approved " + list.length + " disbursement" + (list.length > 1 ? "s" : "") + " · confirm funds when title wires", "commissions/disb");
    setSel({}); setResult(null);
    toast(label(list.length), ["Undo", () => up(() => list.forEach(r => { r.status = from; if (to === "Approved" && r.deal && S.cda) delete S.cda[r.deal]; txAudit("commissions", "Undid: " + to.toLowerCase() + " · " + txRowAddr(r), null, r.deal || r.id); }))]);
  }
  function pay() {
    const list = payList.slice(), capped = []; let total = 0;
    up(() => list.forEach(r => { const pl = txPlan(txRowDeal(r).agent), before = pl.paid; txProcess(r); total += txPayout(r); if (pl.cap && before < pl.cap && pl.paid >= pl.cap) capped.push(A(txRowDeal(r).agent).name); }));
    setSel({}); setConfirm(false);
    setResult({ n: list.length, total, ids: list.map(r => r.id), capped, who: [...new Set(list.map(r => txFirst(txRowDeal(r).agent)))] });
    toast("Paid " + list.length + " via next-day ACH · paystubs issued" + (capped.length ? " · 🎉 " + capped.join(", ") + " just capped!" : ""), ["Paystubs", () => go("commissions/pay")]);
  }
  function undoPay() { const ids = result.ids; up(() => S.d.tx.disb.forEach(r => { if (ids.includes(r.id) && r.status === "Processed") txUnprocess(r); })); setResult(null); toast("Payout recalled · " + ids.length + " ACH transfer" + (ids.length > 1 ? "s" : "") + " cancelled before submission"); }
  function resolve(r, d) {
    if (txRev(d).status !== "Compliant") {
      if (txCan("compliance")) { go("compliance/" + r.deal); return; }
      txNotify("nina", txFirst(txWhoId()) + " is waiting on the compliance review for " + txRowAddr(r) + " so " + txFirst(d.agent) + " can be paid", "compliance/" + r.deal);
      toast("Nudged Nina · she'll see it at the top of her review queue"); return;
    }
    S.d.tx.cdaSel = r.deal; go("commissions/cda");
  }
  const f = focus && rows.find(r => r.id === focus);
  return html`<div class="tx-disb">
    ${result && html`<div class="tx-done" role="status"><${TxChip} n="send" tone="g" /><div><b>Paid ${result.n} payout${result.n > 1 ? "s" : ""} · <span class="num">${usd(result.total)}</span></b> by next-day ACH from Frost ••1180.${result.capped.length ? " 🎉 " + result.capped.join(", ") + " just capped." : ""}<div class="muted" style="font-size:12px">${result.who.join(", ")} notified · paystubs issued · logged in the audit trail. You can recall until the 5 pm ACH cut-off.</div></div>
      <div class="tx-act"><button class="btn sm pri" onClick=${() => go("commissions/pay")}>View paystubs →</button>${txCan("trust") && html`<button class="btn sm" onClick=${() => go("trust/export")}>Export to books</button>`}<button class="btn sm ghost" onClick=${undoPay}>Recall payout</button></div></div>`}
    <div class="card">
      <div class="hd tx-bh"><h3>Disbursement pipeline</h3><span class="sp"></span>
        <div class="tx-segs sm" role="tablist" aria-label="Filter payouts">${Object.entries(TX_FLT).map(([k, v]) => html`<button role="tab" aria-selected=${flt === k} class=${flt === k ? "on" : ""} onClick=${() => { setFlt(k); setSel({}); setConfirm(false); }}>${v[0]} <span class="num tx-ct">${rows.filter(v[1]).length}</span></button>`)}</div>
      </div>
      <div class="tx-bar">
        <span class="muted" style="font-size:12px">${pick.length ? pick.length + " selected" : may ? "Tick rows to move them a step" : TX_NO_APPROVE}</span><span class="sp"></span>
        <button class="btn sm" disabled=${!nOf("Ready").length || !may} title=${may ? "" : TX_NO_APPROVE} onClick=${() => batch("Ready", "Approved", n => "Approved " + n + " disbursement" + (n > 1 ? "s" : "") + " · CDAs locked")}>Approve ${nOf("Ready").length || ""}</button>
        <button class="btn sm" disabled=${!nOf("Approved").length || !may} title=${may ? "" : TX_NO_APPROVE} onClick=${() => batch("Approved", "Paid", n => "Confirmed funds from title on " + n)}>Confirm funds in ${nOf("Approved").length || ""}</button>
        <button class="btn sm pri" disabled=${!payList.length || !may} title=${may ? "" : TX_NO_APPROVE} onClick=${() => setConfirm(true)}>Pay agents · ACH ${payList.length || ""}</button>
      </div>
      ${confirm && payList.length > 0 && html`<div class="tx-confirm" role="alertdialog" aria-label="Confirm payout"><${TxIc} n="bank" /><div style="flex:1;min-width:200px"><b>Pay ${payList.length} payout${payList.length > 1 ? "s" : ""} · <span class="num">${usd(payTotal)}</span></b> by next-day ACH from operating (Frost ••1180)?<div class="muted" style="font-size:12px">${payList.map(r => txFirst(txRowDeal(r).agent) + " " + usd(txPayout(r))).join(" · ")}</div></div>
        <div class="tx-act"><button class="btn sm" onClick=${() => setConfirm(false)}>Cancel</button><button class="btn sm pri" onClick=${pay}>Confirm payout</button></div></div>`}
      ${shown.length ? html`<div class="tx-scroll"><table class="t tx-dt"><thead><tr><th></th><th>Deal</th><th>Agent</th><th>Status</th><th>Expected</th><th>Received</th><th>Paid out</th><th></th></tr></thead><tbody>
        ${shown.map(r => { const d = txRowDeal(r), c = txC(r), idx = TX_DISB.indexOf(r.status), why = r.status === "Incomplete" ? txWhyIncomplete(r) : ""; return html`<tr class=${"click" + (focus === r.id ? " tx-on" : "")} onClick=${() => setFocus(focus === r.id ? null : r.id)}>
          <td onClick=${e => e.stopPropagation()}><input type="checkbox" aria-label=${"Select " + txRowAddr(r)} disabled=${r.status === "Incomplete" || r.status === "Processed"} title=${r.status === "Incomplete" ? "Not ready: " + why : ""} checked=${!!sel[r.id]} onChange=${e => { const v = e.target.checked; setSel(o => ({ ...o, [r.id]: v })); setConfirm(false); }} /></td>
          <td><b>${txRowAddr(r)}</b>${r.auto && r.status === "Incomplete" && html` <span class="tx-new">New</span>`}<div class="muted" style="font-size:12px">${r.deal ? d.kind + " · " + (d.stage === "Closed" ? "closed " + d.close : "closing " + d.close) : "Archived file · closed " + r.close}</div></td>
          <td><div class="row" style="gap:6px"><${Av} a=${A(d.agent)} /><span>${txFirst(d.agent)}</span></div></td>
          <td><${TxSteps} st=${r.status} /><div class="muted tx-why">${why || TX_DISB_HINT[r.status]}${r.paidOn && r.status === "Processed" ? " · " + r.paidOn : ""}</div></td>
          <td class="num">${usd(c.gross)}</td><td class="num">${idx >= 3 ? usd(c.gross) : html`<span class="muted">—</span>`}</td><td class="num">${idx >= 4 ? usd(c.agent + (c.team ? c.team.amt : 0)) : html`<span class="muted">—</span>`}</td>
          <td style="text-align:right" onClick=${e => e.stopPropagation()}>${r.status === "Incomplete" && r.deal ? html`<button class="btn sm" onClick=${() => resolve(r, d)}>${txRev(d).status !== "Compliant" && !txCan("compliance") ? "Nudge Nina" : "Resolve →"}</button>`
            : r.status === "Processed" && may ? (revert === r.id ? html`<div class="tx-act" style="justify-content:flex-end"><span class="muted" style="font-size:11.5px">Recall ${usd(txPayout(r))}?</span><button class="btn sm" onClick=${() => setRevert(null)}>Keep</button><button class="btn sm tx-dangr" onClick=${() => { up(() => txUnprocess(r)); setRevert(null); toast("Payout reverted · ACH recalled"); }}>Recall</button></div>` : html`<button class="btn sm ghost" onClick=${() => setRevert(r.id)}>Revert</button>`) : ""}</td></tr>`; })}
      </tbody></table></div>` : html`<div class="tx-empty"><${TxChip} n=${flt === "act" ? "check" : "coin"} tone="g" /><b>${flt === "act" ? "Nothing waiting on you" : flt === "done" ? "No payouts yet" : "Nothing incomplete"}</b><span class="muted">${flt === "act" ? "Payouts appear here when a file is compliant and title has signed the CDA." : flt === "done" ? "Paid commissions show here with their paystubs." : "Every contract has a compliant file and a CDA at title."}</span><button class="btn sm" onClick=${() => setFlt("all")}>Show all ${rows.length}</button></div>`}
    </div>
    ${f && html`<${TxBreakdown} row=${f} />`}
  </div>`;
}
function TxBreakdown({ row }) {
  const c = txC(row);
  return html`<div class="card"><div class="hd"><h3>${txRowAddr(row)} · who gets paid</h3><span class="sp"></span>${row.deal && txCan("deal") && html`<button class="btn sm" onClick=${() => go("deal/" + row.deal)}>Open deal →</button>`}</div>
    <div class="bd sheet">${c.lines.map(l => html`<div class=${"ln" + (l[3] === "n" ? " neg" : l[3] === "t" ? " tot" : "")}><span>${l[0]}<small class="muted"> · ${l[2]}</small></span><span>${l[1] < 0 ? "−" + usd(-l[1]) : usd(l[1])}</span></div>`)}
      <div class="muted" style="font-size:12px;margin-top:8px">${c.capNote}${row.snap ? " · frozen at payout" : " · live estimate"}</div></div></div>`;
}

const txPctErr = (v) => v === "" || v == null || isNaN(+v) ? "Enter a percentage" : +v < 0 ? "Can't be negative" : +v > 10 ? "Over 10%: check the decimal point" : "";
function TxCdaBuilder() {
  const opts = S.d.deals.filter(d => d.agreement && d.agreement.signed);
  const pre = S.d.tx.cdaSel && txDeal(S.d.tx.cdaSel) && txDeal(S.d.tx.cdaSel).agreement.signed ? S.d.tx.cdaSel : null;
  const [id, setId] = useState(pre || (opts.find(x => x.id === "D1") || opts.find(x => TX_LIVE(x)) || opts[0] || {}).id);
  if (!opts.length) return html`<div class="card tx-empty"><${TxChip} n="lock" /><b>No signed agreements yet</b><span class="muted">A CDA can only ask for what the client agreed to. Get a buyer or listing agreement signed first.</span></div>`;
  const d = txDeal(id), lim = txLimit(d), c = txCda(d), calc = txCalc(d), over = txCdaOver(d), rev = txRev(d);
  const tot = txCdaPct(c), maxPct = Math.max(lim.pct, tot, 0.1) * 1.25;
  const locked = c.status !== "Draft";
  const row = S.d.tx.disb.find(r => r.deal === d.id), paidish = row && ["Approved", "Paid", "Processed"].includes(row.status);
  const set = (k, v) => up(() => { c[k] = v; });
  const errS = txPctErr(c.seller), errB = txPctErr(c.buyer), errT = String(c.title || "").trim() ? "" : "Name the title or escrow company";
  const invalid = errS || errB || errT;
  const who = txMe().name, tco = String(c.title || "title").split(" · ")[0];
  const blockSend = invalid ? "Fix the highlighted fields first" : over ? "Blocked: the CDA asks for more than the signed agreement" : rev.status !== "Compliant" ? "File isn't compliant yet: broker review comes first" : "";
  function send() {
    if (blockSend) return;
    up(() => { c.status = "Sent"; d.docs = d.docs || []; if (!d.docs.some(x => x[0].startsWith("Commission Disbursement"))) d.docs.push(["Commission Disbursement Authorization", "Sent"]); else d.docs.find(x => x[0].startsWith("Commission Disbursement"))[1] = "Sent"; rev.log.unshift([who, "Sent CDA to " + tco + " (" + tot + "%)", Date.now()]); txAudit("commissions", "CDA sent to " + tco + " · " + tot + "% · " + L(d.listing).addr, Math.round(calc.gross), d.id); });
    toast("CDA sent to " + tco + " for signature");
    setTimeout(() => {
      up(() => { c.status = "Signed"; const x = d.docs.find(x => x[0].startsWith("Commission Disbursement")); if (x) x[1] = "Signed"; txAudit("commissions", "CDA signed by " + tco + " · " + L(d.listing).addr, Math.round(txCalc(d).gross), d.id); });
      txNotify("grace", "CDA signed by " + tco + " on " + L(d.listing).addr + " · " + txFirst(d.agent) + "'s payout is ready to approve", "commissions/disb");
      toast(tco + " signed the CDA · disbursement is ready to approve", txCan("commissions") ? ["Disbursements", () => go("commissions/disb")] : null);
    }, 1500);
  }
  function voidCda() { up(() => { c.status = "Draft"; const x = (d.docs || []).find(x => x[0].startsWith("Commission Disbursement")); if (x) x[1] = "Voided"; if (row && row.status === "Ready") row.status = "Incomplete"; rev.log.unshift([who, "Voided CDA at " + tco + " to redraft", Date.now()]); txAudit("commissions", "CDA voided at " + tco + " for redraft · " + L(d.listing).addr, null, d.id); }); toast("CDA voided · " + tco + " notified · edit and resend"); }
  const fld = (k, label, err) => html`<label class="field"><span>${label}</span><input type="number" inputmode="decimal" step="0.05" min="0" max="10" disabled=${locked} aria-invalid=${!!err} class=${err ? "tx-bad-in" : ""} value=${c[k]} onInput=${e => set(k, e.target.value === "" ? "" : +e.target.value)} onKeyDown=${e => { if (e.key === "Enter") send(); }} />${err && html`<span class="tx-err" role="alert">${err}</span>`}</label>`;
  return html`<div class="tx-cda">
    <div class="tx-cdal">
      <div class="card"><div class="bd" style="display:flex;flex-direction:column;gap:12px">
        <label class="field"><span>Deal</span><select value=${id} onChange=${e => { S.d.tx.cdaSel = e.target.value; setId(e.target.value); }}>${opts.map(x => { const cc = S.d.tx.cda[x.id]; return html`<option value=${x.id}>${L(x.listing).addr} · ${P(x.person).short} (${x.kind}${cc ? " · CDA " + cc.status.toLowerCase() : ""})</option>`; })}</select></label>
        <div class="tx-ag"><${TxChip} n="lock" tone="f" /><div><b>${lim.doc} · signed ${lim.on}</b><div class="muted" style="font-size:12.5px">“${lim.text}”</div><div style="margin-top:4px">Most this CDA can ask for: <b class="num">${lim.pct}% · ${usd(d.price * lim.pct / 100)}</b></div></div></div>
        <div class="tx-2">
          ${fld("seller", "Paid by seller (per contract) %", errS)}
          ${fld("buyer", "Paid by " + (d.kind === "Listing" ? "other sources" : "buyer at closing") + " %", errB)}
        </div>
        ${c.why && c.buyer > 0 && html`<div class="muted" style="font-size:12px">Note on draft: ${c.why}.</div>`}
        <div class="tx-meter">
          <div class="tx-mbar"><i class=${over ? "over" : ""} style=${"width:" + Math.min(100, tot / maxPct * 100) + "%"}></i><b style=${"left:" + lim.pct / maxPct * 100 + "%"}><span>Agreement ${lim.pct}%</span></b></div>
          <div class="row" style="justify-content:space-between;font-size:12.5px;flex-wrap:wrap;gap:4px"><span>All sources: <b class="num">${tot}% · ${usd(d.price * tot / 100)}</b></span><span class=${over ? "tx-red" : "tx-green"}>${over ? "Over by " + usd(d.price * over / 100) : "Within agreement ✓"}</span></div>
        </div>
        ${over ? html`<div class="tx-block"><${TxIc} n="alert" /><div><b>Can't send this CDA.</b> It totals ${tot}% from all sources, but ${P(d.person).short} signed for ${lim.pct}%. Lower it, or amend the agreement with the client first.
          <div style="margin-top:8px"><button class="btn sm pri" onClick=${() => { up(() => { const need = over; const fromBuyer = Math.min(+c.buyer || 0, need); c.buyer = txR((+c.buyer || 0) - fromBuyer); c.seller = txR((+c.seller || 0) - (need - fromBuyer)); txAudit("commissions", "CDA capped at " + lim.pct + "% to match the " + lim.doc.toLowerCase() + " · " + L(d.listing).addr, -Math.round(d.price * over / 100), d.id); }); toast("Capped at " + lim.pct + "% · matches " + P(d.person).short + "'s agreement"); }}>Cap at ${lim.pct}%</button></div></div></div>` : ""}
        <label class="field"><span>Title / escrow</span><input value=${c.title} disabled=${locked} aria-invalid=${!!errT} class=${errT ? "tx-bad-in" : ""} onInput=${e => set("title", e.target.value)} />${errT && html`<span class="tx-err" role="alert">${errT}</span>`}</label>
        <div class="field"><span>How title pays</span><div class="tx-segs">${[["closing", "Pay agents at closing"], ["remaining", "Pay brokerage, we disburse"]].map(([k, v]) => html`<button class=${c.mode === k ? "on" : ""} disabled=${locked} onClick=${() => set("mode", k)}>${v}</button>`)}</div></div>
        <label class="row" style="font-size:13px;gap:8px"><input type="checkbox" checked=${c.referral} disabled=${locked} onChange=${e => set("referral", e.target.checked)} /> Outside referral fee 25% (pre-split)</label>
      </div></div>
    </div>
    <div class="card tx-cdadoc">
      ${c.status === "Signed" && html`<div class="tx-done in"><${TxChip} n="check" tone="g" /><div><b>Signed by ${tco}.</b> ${row && row.status !== "Incomplete" ? "Disbursement is " + row.status.toLowerCase() + "." : "Disbursement unlocks once the file is compliant."}<div class="muted" style="font-size:12px">Grace has been notified · logged in the audit trail.</div></div><div class="tx-act"><button class="btn sm pri" onClick=${() => go("commissions/disb")}>Disbursements →</button></div></div>`}
      <div class="tx-cdah"><div><small class="muted">COMMISSION DISBURSEMENT AUTHORIZATION</small><h3>${L(d.listing).addr}</h3><div class="muted" style="font-size:12.5px">To ${c.title || "—"} · Sales price ${usd(d.price)} · closing ${d.close}</div></div><span class=${"pill " + (c.status === "Signed" ? "g" : c.status === "Sent" ? "b" : "a")}>${c.status}</span></div>
      <div class="bd sheet">${calc.lines.map(l => html`<div class=${"ln" + (l[3] === "n" ? " neg" : l[3] === "t" ? " tot" : "")}><span>${l[0]}<small class="muted"> · ${l[2]}</small></span><span>${l[1] < 0 ? "−" + usd(-l[1]) : usd(l[1])}</span></div>`)}
        <div class="tx-capn"><${TxIc} n="star" s=${13} /> ${calc.capNote}</div>
        <div class="tx-sigs"><div><i>Maya Ortiz</i><small>Designated broker</small></div><div><i>${c.status === "Signed" ? c.title.split(" · ")[1] || "Escrow officer" : ""}</i><small>Escrow officer</small></div></div>
      </div>
      <div class="ft tx-ft">${blockSend && !locked && html`<span class="muted tx-why" style="margin-right:auto"><${TxIc} n="lock" s=${12} /> ${blockSend}</span>`}
        ${rev.status !== "Compliant" && txCan("compliance") && html`<button class="btn" onClick=${() => go("compliance/" + d.id)}>Open review</button>`}
        ${locked ? (!paidish && html`<button class="btn" onClick=${voidCda}>Void & redraft</button>`) : html`<button class="btn" disabled=${!!invalid} onClick=${() => { up(() => rev.log.unshift([who, "Saved CDA draft (" + tot + "%)", Date.now()])); toast("Draft saved · " + L(d.listing).addr); }}>Save draft</button>`}
        <button class="btn pri" disabled=${!!blockSend || locked} onClick=${send}>${locked ? (c.status === "Signed" ? "Signed by title ✓" : "Sent · awaiting title") : "Send to title for signature"}</button></div>
    </div>
  </div>`;
}

const TX_PLANS = { "Growth · sliding to cap": { split: 70, cap: 20000, tiers: [[0, 70], [10000, 80]], postFee: 285, postPct: 15 }, "Flat 85/15 · $16k cap": { split: 85, cap: 16000, tiers: [[0, 85]], postFee: 285, postPct: 15 }, "100% · $495 per deal": { split: 100, cap: 0, tiers: [], postFee: 0, postPct: 0 } };
// carry-in and fee amounts validate inline and only commit a valid number (so the CDA math never sees garbage)
function TxCarry({ pl, ag }) {
  const [v, setV] = useState(String(pl.carry || 0)), n = +v;
  const err = v === "" || isNaN(n) ? "Enter an amount" : n < 0 ? "Can't be negative" : n > pl.cap ? "More than the " + usd(pl.cap) + " cap" : "";
  function commit() { if (err || n === (pl.carry || 0)) return; const was = pl.carry || 0; up(() => { pl.paid = Math.max(0, Math.min(pl.cap, pl.paid - was + n)); pl.carry = n; txAudit("commissions", "Cap carry-in for " + ag.name + " set to " + usd(n) + " (was " + usd(was) + ")", n - was, null); }); toast("Carry-in saved · " + ag.name + " now at " + usd(pl.paid) + " toward cap"); }
  return html`<label class="field tx-carry"><span>Cap carry-in (paid before joining / prior system)</span><input type="number" step="100" min="0" aria-invalid=${!!err} class=${err ? "tx-bad-in" : ""} value=${v} onInput=${e => { setV(e.target.value); const x = +e.target.value; if (e.target.value !== "" && !isNaN(x) && x >= 0 && x <= pl.cap) up(() => { pl.paid = Math.max(0, Math.min(pl.cap, pl.paid - (pl.carry || 0) + x)); pl.carry = x; }); }} onBlur=${commit} onKeyDown=${e => e.key === "Enter" && commit()} />${err && html`<span class="tx-err" role="alert">${err}</span>`}</label>`;
}
function TxFeeAmt({ f }) {
  const [v, setV] = useState(String(f.amt)), n = +v;
  const err = v === "" || isNaN(n) ? "Required" : n < 0 ? "Can't be negative" : f.kind === "%" && n > 100 ? "Max 100%" : f.kind === "$" && n > 5000 ? "Over $5,000?" : "";
  return html`<div><div class="row" style="gap:4px">${f.kind === "$" ? "$" : ""}<input class=${"tx-num" + (err ? " tx-bad-in" : "")} type="number" min="0" aria-label=${f.name + " amount"} aria-invalid=${!!err} value=${v} onInput=${e => { setV(e.target.value); const x = +e.target.value; if (e.target.value !== "" && !isNaN(x) && x >= 0 && !(f.kind === "%" && x > 100) && !(f.kind === "$" && x > 5000)) up(() => { f.amt = x; }); }} onBlur=${() => { if (!err) txAudit("commissions", f.name + " set to " + (f.kind === "$" ? usd(n) : n + "%"), null, null); }} />${f.kind === "%" ? "%" : ""}</div>${err && html`<span class="tx-err" role="alert">${err}</span>`}</div>`;
}
function TxPlans() {
  return html`<div class="tx-plans">
    <div class="tx-pg2">${["jordan", "priya", "sam", "maya"].map(a => { const pl = txPlan(a), ag = A(a), now = txSplitNow(pl), capped = pl.cap && pl.paid >= pl.cap, nextT = (pl.tiers || []).find(t => t[0] > pl.paid); return html`<div class="card tx-plan">
      <div class="hd"><${Av} a=${ag} /><div><h3>${ag.name}</h3><div class="muted" style="font-size:12px">${ag.role} · anniversary ${pl.anniv}</div></div></div>
      <div class="bd">
        <div class="row" style="gap:14px;align-items:center">
          ${pl.cap ? html`<${TxRing} v=${pl.paid / pl.cap} label=${capped ? "Capped" : Math.round(pl.paid / pl.cap * 100) + "%"} sub=${short(pl.paid) + " / " + short(pl.cap)} tone=${capped ? "#B8873B" : "#2E6B52"} />` : html`<${TxRing} v=${1} label="100%" sub="no cap" tone="#B8873B" />`}
          <div style="flex:1;min-width:0;display:flex;flex-direction:column;gap:6px;font-size:12.5px">
            <label class="field"><span>Plan</span><select value=${pl.team ? "team" : pl.split >= 100 ? (a === "maya" ? "owner" : "100% · $495 per deal") : pl.name} disabled=${a === "maya"} onChange=${e => { const k = e.target.value; const tp = TX_PLANS[k]; if (!tp) return; const prev = JSON.parse(JSON.stringify(pl)); up(() => { Object.assign(pl, tp, { name: k }); delete pl.team; txAudit("commissions", ag.name + " moved to plan " + k + " (was " + prev.name + ")", null, null); }); txNotify(a, "Your commission plan changed to " + k + " · applies from your next deal", "today"); toast(ag.name + " moved to " + k + " · next deal recalculates", ["Undo", () => up(() => { Object.keys(pl).forEach(x => delete pl[x]); Object.assign(pl, prev); txAudit("commissions", "Undid plan change for " + ag.name, null, null); })]); }}>
              ${a === "maya" && html`<option value="owner">Broker-owner · 100%</option>`}${pl.team && html`<option value="team">Team · ${pl.team.name}</option>`}${Object.keys(TX_PLANS).map(k => html`<option value=${k}>${k}</option>`)}</select></label>
            ${pl.cap ? html`<div><b>${capped ? "100% · post-cap fee " + usd(pl.postFee) + " or " + pl.postPct + "%, whichever is less" : now + "/" + (100 - now) + " now"}</b></div><div class="muted">${capped ? "Capped for this anniversary year" : nextT ? usd(nextT[0] - pl.paid) + " company dollar to " + nextT[1] + "/" + (100 - nextT[1]) : usd(pl.cap - pl.paid) + " to cap"}</div>` : html`<div class="muted">Keeps 100% of every deal</div>`}
          </div>
        </div>
        ${pl.cap ? html`<div class="tx-tiers">${(pl.tiers.length ? pl.tiers : [[0, pl.split]]).map((t, i, arr) => { const end = arr[i + 1] ? arr[i + 1][0] : pl.cap, w = (end - t[0]) / pl.cap * 82; return html`<div style=${"width:" + w + "%"} class=${pl.paid >= end ? "ok" : pl.paid >= t[0] ? "now" : ""}><span>${t[1]}/${100 - t[1]}</span><small>${short(t[0])}–${short(end)}</small></div>`; })}<div style="width:18%" class=${capped ? "now" : ""}><span>100%</span><small>capped</small></div><i style=${"left:" + Math.min(82, pl.paid / pl.cap * 82) + "%"}></i></div>` : ""}
        ${pl.team && html`<div class="tx-teamb"><${TxIc} n="user" s=${14} /> ${pl.team.name}: ${pl.team.pct}% of ${ag.name.split(" ")[0]}'s share goes to team lead ${A(pl.team.lead).name}</div>`}
        ${pl.cap ? html`<${TxCarry} pl=${pl} ag=${ag} />` : ""}
      </div></div>`; })}</div>
    <div class="card"><div class="hd"><h3>Fee catalog</h3><span class="sp"></span><span class="muted" style="font-size:12px">Post-split, deducted from the agent's share on every CDA</span></div>
      <div class="tx-scroll"><table class="t"><thead><tr><th>On</th><th>Fee</th><th>Amount</th><th>Paid to</th><th>When</th></tr></thead><tbody>
        ${S.d.tx.fees.map(f => html`<tr><td><button role="switch" aria-checked=${f.on} aria-label=${f.name} class=${"tx-sw" + (f.on ? " on" : "")} onClick=${() => { up(() => { f.on = !f.on; txAudit("commissions", f.name + (f.on ? " switched on" : " switched off") + " for new CDAs", f.on ? f.amt : -f.amt, null); }); toast(f.name + (f.on ? " added to" : " removed from") + " new CDAs", ["Undo", () => up(() => { f.on = !f.on; })]); }}><i></i></button></td>
          <td><b>${f.name}</b></td><td><${TxFeeAmt} f=${f} /></td><td>${f.to}</td><td class="muted">${f.note}</td></tr>`)}
      </tbody></table></div></div>
  </div>`;
}

function TxPay() {
  const [ag, setAg] = useState(["jordan", "priya", "sam", "maya"].includes(txWhoId()) ? txWhoId() : "jordan");
  const stubs = S.d.tx.stubs.filter(s => s.agent === ag);
  const [pick, setPick] = useState(null);
  const st = stubs[pick == null ? stubs.length - 1 : pick];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"], by = months.map(m => stubs.filter(s => s.on.startsWith(m)).reduce((a, s) => a + s.net, 0)), mx = Math.max(...by, 1);
  const pl = txPlan(ag), ytd = stubs.reduce((a, s) => a + s.net, 0);
  const d = st && st.deal && txDeal(st.deal);
  const lines = st ? (st.lines || [["Gross commission", st.gross, "From title", "g"], ["Referral, split & fees", -(st.gross - st.net), "Per plan", "n"], ["Net pay", st.net, "ACH", "t"]]) : [];
  return html`<div class="tx-pay">
    <div class="tx-agents">${["jordan", "priya", "sam", "maya"].map(a => html`<button class=${"tx-agt" + (ag === a ? " on" : "")} onClick=${() => { setAg(a); setPick(null); }}><${Av} a=${A(a)} /><span><b>${A(a).name}</b><small>${S.d.tx.stubs.filter(s => s.agent === a).length} paystubs</small></span></button>`)}</div>
    <div class="tx-payg">
      <div class="card"><div class="hd"><h3>Earnings 2026</h3><span class="sp"></span><b class="num">${usd(ytd)}</b></div><div class="bd">
        <svg viewBox="0 0 340 150" class="tx-chart" role="img" aria-label="Net pay by month">${by.map((v, i) => { const h = v / mx * 108; return html`<g><rect x=${8 + i * 33} y=${120 - h} width="22" height=${Math.max(h, v ? 3 : 1.5)} rx="4" fill=${v ? (i === 9 ? "#B8873B" : "#2E6B52") : "#E3DDD0"} />${v ? html`<text x=${19 + i * 33} y=${114 - h} text-anchor="middle" class="tx-cv">${Math.round(v / 1000)}k</text>` : ""}<text x=${19 + i * 33} y="138" text-anchor="middle" class="tx-cl">${months[i]}</text></g>`; })}</svg>
        ${pl.cap ? html`<div class="row" style="gap:10px;font-size:12.5px"><span class="muted" style="width:90px">Cap progress</span><div class="bar" style="flex:1"><i style=${"width:" + Math.min(100, pl.paid / pl.cap * 100) + "%"}></i></div><span class="num">${usd(pl.paid)} / ${usd(pl.cap)}</span></div>` : html`<div class="muted" style="font-size:12.5px">Broker-owner · no cap</div>`}
        <div class="tx-stubs">${stubs.slice().reverse().map((s, ri) => { const i = stubs.length - 1 - ri; return html`<button class=${"tx-stub" + (st === s ? " on" : "")} onClick=${() => setPick(i)}><span class="tx-sd"><b>${s.on.split(" ")[1]}</b><small>${s.on.split(" ")[0]}</small></span><span style="flex:1;min-width:0"><b>${s.addr}</b><small class="muted">Gross ${usd(s.gross)}</small></span><b class="num">${usd(s.net)}</b></button>`; })}</div>
      </div></div>
      ${st ? html`<div class="card tx-stubd"><div class="tx-cdah"><div><small class="muted">PAYSTUB · HARBOR & VINE REALTY</small><h3>${A(ag).name}</h3><div class="muted" style="font-size:12.5px">${st.addr} · paid ${st.on} · ACH to ••••4821</div></div><span class="pill g">Paid</span></div>
        <div class="bd sheet">${lines.map(l => html`<div class=${"ln" + (l[3] === "n" ? " neg" : l[3] === "t" ? " tot" : "")}><span>${l[0]}</span><span>${l[1] < 0 ? "−" + usd(-l[1]) : usd(l[1])}</span></div>`)}
          <div class="tx-ytd"><span>YTD net <b class="num">${usd(ytd)}</b></span><span>${pl.cap ? html`Paid toward cap <b class="num">${usd(pl.paid)}</b>` : "No cap"}</span></div></div>
        <div class="ft">${d && txCan("deal") && html`<button class="btn" onClick=${() => go("deal/" + d.id)}>Open deal →</button>`}<button class="btn pri" onClick=${() => { txAudit("commissions", "Paystub PDF sent to " + A(ag).name + " · " + st.addr, st.net, st.deal || null); txNotify(ag, "Paystub for " + st.addr + " (" + usd(st.net) + ") is in your agent app", "today"); toast("Paystub PDF sent to " + A(ag).name + " · also in their agent app"); }}>Send PDF</button></div></div>` : html`<div class="card tx-empty"><${TxChip} n="file" /><b>No paystubs yet for ${txFirst(ag)}</b><span class="muted">Paystubs are issued automatically when a payout is processed.</span><button class="btn sm" onClick=${() => go("commissions/disb")}>Go to disbursements</button></div>`}
    </div>
  </div>`;
}

// ================= C) TRUST & EMD =================
const TX_EMD_PILL = { Expected: "", Requested: "b", Verify: "r", Held: "r", Received: "g", Released: "f" };
function txEmdLabel(e) { const d = txDeal(e.deal); return d ? { addr: L(d.listing).addr, who: P(d.person).name, d } : { addr: e.deal, who: "", d: null }; }
function txRecon() {
  const r = S.d.tx.recon, sum = (side) => r.items.filter(i => i.side === side && r.done[i.id]).reduce((a, i) => a + i.amt, 0);
  const bank = r.bank + sum("bank"), book = r.book + sum("book"), led = r.ledgers.reduce((a, l) => a + l[1], 0);
  return { bank, book, led, d1: txR(bank - book), d2: txR(book - led) };
}
function TxTrust() {
  const tabs = [["emd", "Earnest money"], ["recon", "Three-way reconciliation"], ["export", "Accounting export"], ["1099", "1099s"], ["audit", "Audit trail"]];
  const tab = tabs.some(x => x[0] === S.route.id) ? S.route.id : "emd";
  txDisbRows(); txEmdRows();
  const t = S.d.tx, inTrust = t.emd.filter(e => e.holder === "trust" && e.status === "Received").reduce((a, e) => a + e.amt, 0), rc = txRecon();
  const toDo = t.emd.filter(e => e.status === "Verify" || e.status === "Expected").length;
  return html`<${Shell} title="Trust & EMD" sub=${S.role ? txHello(toDo ? toDo + " deposit" + (toDo > 1 ? "s" : "") + " to chase or verify" : "Every deposit is accounted for") : "Earnest money, trust ledgers and the monthly reconciliation, on the same deals"}
    actions=${html`<div class="tx-act">${txCan("commissions") && html`<button class="btn" onClick=${() => go("commissions")}>Commissions</button>`}<button class="btn pri" onClick=${() => go("trust/recon")}>Reconcile ${t.recon.month.split(" ")[0]}</button></div>`}>
    <div class="page tx-page">
      <div class="tx-kpis">
        <div><${TxChip} n="bank" tone="f" /><span>Trust · Frost Bank ••2207</span><b class="num">${usd(rc.bank)}</b></div>
        <div><${TxChip} n="coin" tone="br" /><span>EMD held in trust</span><b class="num">${usd(inTrust)}</b></div>
        <div><${TxChip} n="alert" tone="r" /><span>Wires to verify</span><b>${t.emd.filter(e => e.status === "Verify").length}</b></div>
        <div><${TxChip} n="shield" tone=${t.recon.signed.broker ? "g" : "b"} /><span>${t.recon.month.split(" ")[0]} reconciliation</span><b>${t.recon.signed.broker ? "Filed" : rc.d1 === 0 && rc.d2 === 0 ? "Balanced" : "Open"}</b></div>
      </div>
      <div class="tabs tx-tabs">${tabs.map(([k, v]) => html`<button class=${tab === k ? "on" : ""} onClick=${() => go("trust/" + k)}>${v}</button>`)}</div>
      ${tab === "emd" && html`<${TxEmd} />`}
      ${tab === "recon" && html`<${TxReconPage} />`}
      ${tab === "export" && html`<${TxExport} />`}
      ${tab === "1099" && html`<${Tx1099} />`}
      ${tab === "audit" && html`<${TxAudit} area="trust" />`}
    </div></${Shell}>`;
}
function TxEmd() {
  const t = S.d.tx;
  const [flt, setFlt] = useState("open");
  const [rel, setRel] = useState(null);
  const credit = (e, d) => { S.d.deals.forEach(x => { if (x.id === e.deal || (d && x.listing === d.listing && TX_LIVE(x))) txRev(x); }); if (d) { const c = (d.checklist || []).find(x => /Earnest money/.test(x[0])); if (c) { c[1] = true; if (d.checklist.length) d.progress = d.checklist.filter(x => x[1]).length / d.checklist.length; } } };
  function request(e) {
    const { d } = txEmdLabel(e), p = d && P(d.person);
    up(() => { e.status = "Requested"; e.on = "sent " + TX_TODAY; txAudit("trust", "Secure ACH request sent to " + (p ? p.name : "buyer") + " · " + txEmdLabel(e).addr, e.amt, e.deal); });
    if (p) txSay(p.id, "me", "Here's your secure link to send the " + usd(e.amt) + " earnest money by bank transfer (ACH). It connects to your bank directly, so there are no wire instructions to fake. Never trust emailed wire instructions.");
    toast("Secure ACH request sent to " + (p ? p.name : "the buyer"));
    setTimeout(() => {
      up(() => { e.status = "Received"; e.method = "ACH"; e.verified = true; e.on = TX_TODAY; e.note = "ACH from verified account · Chase ••" + (3000 + e.amt % 997); credit(e, d); if (p) txSay(p.id, "them", "Done! Sent the earnest money from our Chase account 👍", "SMS"); txAudit("trust", "EMD received by verified ACH · credited to " + (p ? p.short : "") + " trust ledger", e.amt, e.deal); });
      if (d) txNotify(d.agent, usd(e.amt) + " earnest money received for " + L(d.listing).addr, "deal/" + d.id);
      toast(usd(e.amt) + " received by verified ACH · credited to " + (p ? p.short : "") + "'s trust ledger", txCan("inbox") && p && txThread(p.id) ? ["Open inbox", () => go("inbox/" + txThread(p.id).id)] : null);
    }, 1700);
  }
  // seller-side deposits sit with title: we only confirm the receipt
  function confirmTitle(e) {
    const { d } = txEmdLabel(e);
    up(() => { e.status = "Requested"; e.on = "asked " + TX_TODAY; });
    toast("Asked " + txHolder(e) + " to confirm the deposit");
    setTimeout(() => { up(() => { e.status = "Received"; e.on = TX_TODAY; e.note = txHolder(e) + " confirmed receipt · escrow letter in the file"; credit(e, d); txAudit("trust", "EMD receipt confirmed by " + txHolder(e) + " · " + txEmdLabel(e).addr, e.amt, e.deal); }); if (d) txNotify(d.agent, txHolder(e) + " confirmed the " + usd(e.amt) + " deposit on " + L(d.listing).addr, "deal/" + d.id); toast(txHolder(e) + " confirmed " + usd(e.amt) + " · receipt filed to the deal"); }, 1200);
  }
  function release(e) {
    const x = txEmdLabel(e), prev = { status: e.status, note: e.note, on: e.on };
    up(() => { e.status = "Released"; e.note = "Released to title " + TX_TODAY; e.on = TX_TODAY; txAudit("trust", "EMD released from trust to title · " + x.addr, -e.amt, e.deal); });
    setRel(null);
    toast(usd(e.amt) + " released to title · trust ledger updated", ["Undo", () => up(() => { Object.assign(e, prev); txAudit("trust", "Undid release · " + x.addr + " back in trust", e.amt, e.deal); })]);
  }
  const rows = t.emd.filter(e => flt === "all" || (flt === "open" ? !["Received", "Released"].includes(e.status) || (e.status === "Received" && e.holder === "trust") : e.status === "Released"));
  const led = t.emd.filter(e => e.holder === "trust" && (e.status === "Received"));
  return html`<div class="tx-emd">
    <div class="card"><div class="hd tx-bh"><h3>Earnest money ledger</h3><span class="sp"></span>
      <div class="tx-segs sm" role="tablist" aria-label="Filter deposits">${[["open", "Open"], ["done", "Released"], ["all", "All"]].map(([k, v]) => html`<button role="tab" aria-selected=${flt === k} class=${flt === k ? "on" : ""} onClick=${() => setFlt(k)}>${v}</button>`)}</div></div>
      ${rows.length ? html`<div class="tx-scroll"><table class="t tx-et"><thead><tr><th>Deal</th><th>Amount</th><th>Method</th><th>Held by</th><th>Status</th><th></th></tr></thead><tbody>
      ${rows.map(e => { const x = txEmdLabel(e); return html`<tr>
        <td><button class="tx-link" onClick=${() => x.d && (txCan("deal") ? go("deal/" + x.d.id) : txCan("compliance") ? go("compliance/" + x.d.id) : null)}><b>${x.addr}</b></button>${e.auto && e.status === "Expected" && html` <span class="tx-new">New contract</span>`}<div class="muted" style="font-size:12px">${x.who} · ${e.note}</div></td>
        <td class="num"><b>${usd(e.amt)}</b></td>
        <td>${e.method === "ACH" ? html`<span class="pill g">ACH${e.verified || e.status === "Released" ? " · verified" : ""}</span>` : html`<span class="pill a">Wire</span>`}</td>
        <td>${txHolder(e)}</td>
        <td><span class=${"pill " + TX_EMD_PILL[e.status]}>${e.status === "Verify" ? "Verify wire" : e.status}</span><div class="muted" style="font-size:11.5px;margin-top:3px">${e.on}</div></td>
        <td style="text-align:right">${e.status === "Expected" ? (e.holder === "title" ? html`<button class="btn sm pri" onClick=${() => confirmTitle(e)}>Confirm with title</button>` : html`<button class="btn sm pri" onClick=${() => request(e)}>Request via ACH</button>`)
          : e.status === "Verify" || e.status === "Held" ? html`<button class="btn sm brass" onClick=${() => up(s => { s.modal = { kind: "txWire", id: e.id }; })}>Verify wire</button>`
          : e.status === "Received" && e.holder === "trust" ? (rel === e.id ? html`<div class="tx-act" style="justify-content:flex-end"><span class="muted" style="font-size:11.5px">Wire ${usd(e.amt)} to ${(S.d.tx.cda[e.deal] || {}).title ? S.d.tx.cda[e.deal].title.split(" · ")[0] : "title"}?</span><button class="btn sm" onClick=${() => setRel(null)}>Cancel</button><button class="btn sm pri" onClick=${() => release(e)}>Release</button></div>`
            : html`<div class="tx-act" style="justify-content:flex-end"><button class="btn sm" onClick=${() => { txAudit("trust", "EMD receipt emailed to " + x.who, e.amt, e.deal); toast("Receipt for " + usd(e.amt) + " emailed to " + x.who + " and saved to the deal"); }}>Receipt</button><button class="btn sm" disabled=${!txMayApprove()} title=${txMayApprove() ? "" : TX_NO_APPROVE} onClick=${() => setRel(e.id)}>Release to title</button></div>`)
          : html`<span class="muted" style="font-size:12px">${e.status === "Requested" ? "Waiting on " + (e.holder === "title" ? "title" : "buyer") + "…" : "Receipt on file"}</span>`}</td></tr>`; })}
      </tbody></table></div>` : html`<div class="tx-empty"><${TxChip} n="coin" tone="g" /><b>${flt === "open" ? "No deposits to chase" : "Nothing released yet"}</b><span class="muted">${flt === "open" ? "When a deal goes under contract, its earnest money shows up here automatically." : "Deposits move here once they're released to title at closing."}</span><button class="btn sm" onClick=${() => setFlt("all")}>Show all ${t.emd.length}</button></div>`}</div>
    <div class="tx-g2">
      <div class="card"><div class="hd"><h3>Client trust ledgers · EMD</h3></div><div class="bd">
        ${led.length ? led.map(e => { const x = txEmdLabel(e); return html`<div class="tx-lr"><span>${x.who || x.addr}<small class="muted">${x.addr}</small></span><b class="num">${usd(e.amt)}</b></div>`; }) : html`<div class="muted">No earnest money in trust right now.</div>`}
        ${S.d.tx.recon.ledgers.filter(l => l[2] === "rentals").map(l => html`<div class="tx-lr"><span>${l[0].split(" · ")[0]}<small class="muted">${l[0].split(" · ")[1]}</small></span><b class="num">${usd(l[1])}</b></div>`)}
      </div></div>
      <div class="card tx-wf"><div class="hd"><${TxChip} n="shield" tone="r" /><h3>Wire fraud guard</h3></div><div class="bd" style="font-size:13px;display:flex;flex-direction:column;gap:8px">
        <div>ACH from a bank-verified account is the default. Wires are held until someone calls the buyer at the number on file and checks the account.</div>
        <div class="tx-alert"><${TxIc} n="alert" s=${14} /><span>Oct 6 · lookalike domain <b>harborandvine-realty.co</b> emailed wire instructions to a buyer. Blocked and reported.</span></div>
      </div></div>
    </div>
  </div>`;
}
function TxWireModal({ m, close }) {
  const e = S.d.tx.emd.find(x => x.id === m.id), x = txEmdLabel(e), p = x.d && P(x.d.person);
  const checks = [["call", "Called " + (p ? p.short : "the buyer") + " at the number on file " + (p ? p.phone : "") + " (not one from an email)"], ["src", "Buyer confirms the instructions came from the Estate OS portal, not email"], ["acct", "Sender account name matches the buyer · Wells Fargo ••8812"], ["amt", "Amount " + usd(e.amt) + " matches contract ¶5"]];
  const [ok, setOk] = useState({});
  txEsc(close);
  const all = checks.every(c => ok[c[0]]);
  function verify() { if (!all) return; up(() => { e.status = "Received"; e.verified = true; e.on = TX_TODAY; e.note = "Wire verified by callback · credited to trust"; if (x.d) { const c = (x.d.checklist || []).find(c => /Earnest/.test(c[0])); if (c) c[1] = true; txRev(x.d); } txAudit("trust", "Wire verified by callback (" + checks.length + "/" + checks.length + " checks) · credited to trust · " + x.addr, e.amt, e.deal); }); if (x.d) txNotify(x.d.agent, "Wire of " + usd(e.amt) + " verified and credited to trust for " + x.addr, "deal/" + x.d.id); close(); toast("Wire verified · " + usd(e.amt) + " credited to " + (p ? p.short : "") + "'s trust ledger"); }
  function hold() { up(() => { e.status = "Held"; e.note = "Held · reported to Frost Bank fraud desk"; txAudit("trust", "Wire held · reported to Frost Bank fraud desk · " + x.addr, e.amt, e.deal); }); if (x.d) txNotify(x.d.agent, "Wire on " + x.addr + " is on hold pending fraud review · don't share new instructions with the buyer", "deal/" + x.d.id); close(); toast("Wire held and reported to the bank's fraud desk"); }
  return html`<div class="scrim" onClick=${ev => ev.target === ev.currentTarget && close()}><div class="modal" role="dialog" aria-label="Verify wire">
    <div class="hd"><h3>Verify incoming wire · ${usd(e.amt)}</h3><button class="btn ghost sm" aria-label="Close" onClick=${close}><${TxIc} n="x" /></button></div>
    <div class="bd">
      <div class="tx-ag"><${TxChip} n="bank" tone="f" /><div><b>${x.addr}</b><div class="muted" style="font-size:12.5px">${x.who} · into Harbor & Vine Trust, Frost Bank ••2207 · posted ${e.on}</div></div></div>
      ${checks.map(c => html`<button class=${"chk" + (ok[c[0]] ? " ok" : "")} aria-pressed=${!!ok[c[0]]} onClick=${() => setOk(o => ({ ...o, [c[0]]: !o[c[0]] }))}><i>${ok[c[0]] ? "✓" : ""}</i><span>${c[1]}</span></button>`)}
      <div class="muted" style="font-size:12px">${Object.values(ok).filter(Boolean).length} of ${checks.length} checks done${all ? " · ready to credit" : " · all four are required before money is credited"}</div>
      ${p && html`<button class="btn sm" style="align-self:flex-start" onClick=${() => { setOk(o => ({ ...o, call: true })); toast("Calling " + p.name + " · " + p.phone + " (logged to their timeline)"); }}><${TxIc} n="phone" s=${13} /> Call ${p.phone}</button>`}
    </div>
    <div class="ft"><button class="btn" onClick=${close}>Cancel</button><button class="btn" onClick=${hold}>Hold & report</button><button class="btn pri" disabled=${!all} title=${all ? "" : "Complete all four checks"} onClick=${verify}>Verify & credit trust</button></div>
  </div></div>`;
}
function TxReconAdd({ r, onDone }) {
  const [f, setF] = useState({ t: "", side: "bank", amt: "" });
  const [tried, setTried] = useState(false);
  const n = +f.amt;
  const err = { t: f.t.trim().length < 4 ? "Describe the item (e.g. “Outstanding check #1190”)" : "", amt: f.amt === "" || isNaN(n) ? "Enter an amount (negative for checks or reversals)" : n === 0 ? "Amount can't be zero" : Math.abs(n) > 1e6 ? "That's more than the whole account" : "" };
  const bad = err.t || err.amt;
  function add() {
    setTried(true); if (bad) return;
    up(() => { r.items.push({ id: "c" + Date.now(), side: f.side, amt: txR(n), t: f.t.trim(), s: "Added by " + txMe().name + " · " + TX_TODAY, act: "Clear", custom: true }); txAudit("trust", "Reconciling item added (" + f.side + " side): " + f.t.trim(), txR(n), null); });
    toast("Item added · clear it once it matches the statement"); onDone();
  }
  return html`<div class="tx-radd" onKeyDown=${e => { if (e.key === "Enter") add(); if (e.key === "Escape") onDone(); }}>
    <label class="field"><span>Description</span><input value=${f.t} autoFocus aria-invalid=${tried && !!err.t} class=${tried && err.t ? "tx-bad-in" : ""} onInput=${e => setF({ ...f, t: e.target.value })} />${tried && err.t && html`<span class="tx-err" role="alert">${err.t}</span>`}</label>
    <div class="tx-2"><label class="field"><span>Side</span><select value=${f.side} onChange=${e => setF({ ...f, side: e.target.value })}><option value="bank">Bank side</option><option value="book">Book side</option></select></label>
      <label class="field"><span>Amount ($)</span><input type="number" step="0.01" inputmode="decimal" value=${f.amt} aria-invalid=${tried && !!err.amt} class=${tried && err.amt ? "tx-bad-in" : ""} onInput=${e => setF({ ...f, amt: e.target.value })} />${tried && err.amt && html`<span class="tx-err" role="alert">${err.amt}</span>`}</label></div>
    <div class="tx-act" style="justify-content:flex-end"><button class="btn sm" onClick=${onDone}>Cancel</button><button class="btn sm pri" onClick=${add}>Add item</button></div>
  </div>`;
}
function TxReconPage() {
  const r = S.d.tx.recon, rc = txRecon(), zero = rc.d1 === 0 && rc.d2 === 0;
  const [adding, setAdding] = useState(false);
  const meN = txMe().name, isBroker = txWhoId() === "maya";
  const node = (x, y, lab, v) => html`<g><circle cx=${x} cy=${y} r="34" fill="#fff" stroke="#D3CBBA" stroke-width="1.5" /><text x=${x} y=${y - 4} text-anchor="middle" class="tx-nl">${lab}</text><text x=${x} y=${y + 12} text-anchor="middle" class="tx-nv">${short(v)}</text></g>`;
  const edge = (x1, y1, x2, y2, dv) => html`<g><line x1=${x1} y1=${y1} x2=${x2} y2=${y2} stroke=${dv === 0 ? "#2E7D4F" : "#C0442E"} stroke-width="2.5" stroke-dasharray=${dv === 0 ? "" : "5 4"} /><rect x=${(x1 + x2) / 2 - 38} y=${(y1 + y2) / 2 - 11} width="76" height="22" rx="11" fill=${dv === 0 ? "#E0F0E5" : "#F9E2DC"} /><text x=${(x1 + x2) / 2} y=${(y1 + y2) / 2 + 4} text-anchor="middle" class=${"tx-ev" + (dv === 0 ? " ok" : "")}>${dv === 0 ? "$0.00" : (dv > 0 ? "+" : "−") + usd(Math.abs(dv), 2)}</text></g>`;
  function toggle(i) { const was = !!r.done[i.id]; up(() => { if (was) delete r.done[i.id]; else r.done[i.id] = TX_TODAY; txAudit("trust", (was ? "Un-cleared: " : "Cleared: ") + i.t, was ? -i.amt : i.amt, null); }); }
  function signPrep() { up(() => { r.signed.prep = TX_TODAY; r.prepBy = meN; txAudit("trust", r.month + " reconciliation signed by preparer " + meN + " · $0.00 difference", null, null); }); if (!isBroker) txNotify("maya", meN.split(" ")[0] + " signed the " + r.month + " trust reconciliation · ready for your broker sign-off", "trust/recon"); toast("Signed as preparer" + (isBroker ? "" : " · sent to Maya for broker sign-off")); }
  function signBroker() { up(() => { r.signed.broker = TX_TODAY; r.history.push([r.month, r.prepBy || meN, "Maya Ortiz", TX_TODAY]); txAudit("trust", r.month + " reconciliation filed · package saved for TREC audit", null, null); }); if (r.prepBy && r.prepBy !== "Maya Ortiz") txNotify("grace", r.month + " reconciliation filed by Maya", "trust/recon"); toast(r.month + " reconciliation filed · package saved for TREC audit"); }
  return html`<div class="tx-recon">
    <div class="card tx-tri"><div class="hd"><h3>${r.month} · three-way</h3><span class="sp"></span>${zero ? html`<span class="pill g">Reconciled · $0.00</span>` : html`<span class="pill r">Out of balance</span>`}</div><div class="bd">
      <svg viewBox="0 0 320 220" class="tx-trisvg" role="img" aria-label="Bank, book and client ledgers">
        ${edge(70, 60, 250, 60, rc.d1)}${edge(250, 60, 160, 180, rc.d2)}${edge(70, 60, 160, 180, txR(rc.bank - rc.led))}
        ${node(70, 60, "Bank", rc.bank)}${node(250, 60, "Book", rc.book)}${node(160, 180, "Ledgers", rc.led)}
      </svg>
      <div class="sheet tx-rs">
        <div class="ln"><span>Bank statement · Sep 30</span><span>${usd(r.bank, 2)}</span></div>
        <div class="ln"><span>Adjusted bank balance</span><span>${usd(rc.bank, 2)}</span></div>
        <div class="ln"><span>Book balance (trust cash)</span><span>${usd(rc.book, 2)}</span></div>
        <div class="ln"><span>Client ledgers total</span><span>${usd(rc.led, 2)}</span></div>
        <div class=${"ln tot" + (rc.d1 === 0 ? " tx-ok" : " tx-bad")}><span>Bank vs book</span><span>${usd(Math.abs(rc.d1), 2)}</span></div><div class=${"ln" + (rc.d2 === 0 ? " tx-ok" : " tx-bad")} style="font-weight:700;font-size:16px"><span>Book vs client ledgers</span><span>${usd(Math.abs(rc.d2), 2)}</span></div>
      </div></div></div>
    <div class="tx-rcol">
      ${r.signed.broker && html`<div class="tx-done" role="status"><${TxChip} n="shield" tone="g" /><div><b>${r.month} is filed.</b> Prepared by ${r.prepBy || "Grace Liu"}, signed by Maya Ortiz on ${r.signed.broker}. The package is saved for a TREC audit.<div class="muted" style="font-size:12px">Next: export the month's journal to the books.</div></div><div class="tx-act"><button class="btn sm pri" onClick=${() => go("trust/export")}>Accounting export →</button></div></div>`}
      <div class="card"><div class="hd"><h3>Reconciling items</h3><span class="sp"></span><span class="muted" style="font-size:12px">${r.items.filter(i => r.done[i.id]).length}/${r.items.length} cleared</span></div>
        ${r.items.map(i => html`<div class=${"tx-ri" + (r.done[i.id] ? " done" : "")}><${TxChip} n=${i.side === "bank" ? "bank" : "doc"} tone=${r.done[i.id] ? "g" : i.id === "fee" || i.id === "dup" ? "r" : ""} />
          <span class="tx-dm"><b>${i.t}</b><small>${i.s} · ${i.side === "bank" ? "bank side" : "book side"}</small></span><b class="num">${i.amt > 0 ? "+" : "−"}${usd(Math.abs(i.amt), 2)}</b>
          <div class="tx-act"><button class=${"btn sm" + (r.done[i.id] ? " ghost" : "")} disabled=${!!r.signed.prep} title=${r.signed.prep ? "Signed: items are locked" : ""} onClick=${() => toggle(i)}>${r.done[i.id] ? "Undo" : i.act}</button>
          ${i.custom && !r.done[i.id] && !r.signed.prep && html`<button class="btn sm ghost" aria-label=${"Remove " + i.t} title="Remove item" onClick=${() => { up(() => { r.items.splice(r.items.indexOf(i), 1); txAudit("trust", "Reconciling item removed: " + i.t, null, null); }); toast("Item removed", ["Undo", () => up(() => r.items.push(i))]); }}><${TxIc} n="trash" s=${13} /></button>`}</div></div>`)}
        ${!r.signed.prep && (adding ? html`<${TxReconAdd} r=${r} onDone=${() => setAdding(false)} />` : html`<div class="bd" style="padding-top:8px"><button class="btn sm ghost" onClick=${() => setAdding(true)}><${TxIc} n="plus" s=${13} /> Add reconciling item</button></div>`)}
      </div>
      <div class="card"><div class="hd"><h3>Client ledgers · ${r.month}</h3></div><div class="bd">${r.ledgers.map(l => html`<div class="tx-lr"><span>${l[0]}</span><b class="num">${usd(l[1])}</b></div>`)}</div></div>
      <div class="card"><div class="hd"><h3>Sign-off</h3></div><div class="bd tx-sign">
        ${!zero && html`<div class="tx-block"><${TxIc} n="lock" /><div>Both differences must be <b>$0.00</b> before anyone can sign. Clear the items above.</div></div>`}
        <div class="row" style="flex-wrap:wrap;gap:8px"><${Av} a=${r.signed.prep ? (Object.values(S.d.agents).find(a => a.name === r.prepBy) || txMe()) : txMe()} /><span style="flex:1;min-width:120px"><b>${r.signed.prep ? r.prepBy : meN}</b> · preparer<div class="muted" style="font-size:12px">${r.signed.prep ? "Signed " + r.signed.prep : "Not signed"}</div></span>
          <button class="btn sm" disabled=${!zero || !!r.signed.prep} title=${!zero ? "Balance to $0.00 first" : ""} onClick=${signPrep}>${r.signed.prep ? "Signed ✓" : "Sign as preparer"}</button>
          ${r.signed.prep && !r.signed.broker && html`<button class="btn sm ghost" onClick=${() => { up(() => { r.signed.prep = null; txAudit("trust", "Preparer signature withdrawn · items unlocked", null, null); }); toast("Signature withdrawn · items unlocked"); }}>Withdraw</button>`}</div>
        <div class="row" style="flex-wrap:wrap;gap:8px"><${Av} a=${A("maya")} /><span style="flex:1;min-width:120px"><b>Maya Ortiz</b> · designated broker<div class="muted" style="font-size:12px">${r.signed.broker ? "Signed " + r.signed.broker : r.signed.prep ? (isBroker ? "Ready for your signature" : "Notified · waiting on Maya") : "Waiting on preparer"}</div></span>
          <button class="btn sm pri" disabled=${!r.signed.prep || !!r.signed.broker || !isBroker} title=${!isBroker ? "Only the designated broker signs" : ""} onClick=${signBroker}>${r.signed.broker ? "Filed ✓" : "Broker sign-off"}</button></div>
        <div class="tx-hist">${r.history.map(h => html`<div><${TxIc} n="check" s=${13} /><span>${h[0]}</span><small class="muted">${h[1]} · ${h[2]} · ${h[3]}</small></div>`)}</div>
      </div></div>
    </div>
  </div>`;
}
function txJournal(to) {
  const qb = to === "qbo", acc = qb ? { tb: "1020 Trust Bank – Frost ••2207", tl: "2300 Trust Liability – Earnest Money", ob: "1000 Operating – Frost ••1180", inc: "4000 Commission Income", exp: "5000 Agent Commission Expense" } : { tb: "091 Trust Account", tl: "820 EMD Held in Trust", ob: "090 Business Account", inc: "200 Sales – Commissions", exp: "310 Agent Payouts" };
  const out = [];
  S.d.tx.emd.filter(e => e.status === "Received" && e.holder === "trust").forEach(e => { const x = txEmdLabel(e); out.push([e.on, acc.tb, e.amt, 0, "EMD · " + x.addr, e.deal]); out.push([e.on, acc.tl, 0, e.amt, "EMD · " + x.who, e.deal]); });
  S.d.tx.disb.filter(r => r.status === "Paid" || r.status === "Processed").forEach(r => { const d = txRowDeal(r), c = txC(r), a = txRowAddr(r); out.push([r.paidOn || TX_TODAY, acc.ob, c.gross, 0, "Commission · " + a, r.deal || r.id]); out.push([r.paidOn || TX_TODAY, acc.inc, 0, c.gross, "Commission · " + a, r.deal || r.id]); if (r.status === "Processed") { const pay = c.agent + (c.team ? c.team.amt : 0); out.push([r.paidOn, acc.exp, pay, 0, "Agent payout · " + A(d.agent).name, r.deal || r.id]); out.push([r.paidOn, acc.ob, 0, pay, "ACH payout", r.deal || r.id]); } });
  return out;
}
function TxExport() {
  const [to, setTo] = useState("qbo");
  const j = txJournal(to), ex = S.d.tx.exported;
  return html`<div class="card"><div class="hd tx-bh"><h3>Journal preview</h3><span class="sp"></span>
    <div class="tx-segs sm">${[["qbo", "QuickBooks Online"], ["xero", "Xero"]].map(([k, v]) => html`<button class=${to === k ? "on" : ""} onClick=${() => setTo(k)}>${v}</button>`)}</div>
    <button class="btn sm pri" disabled=${!j.length} onClick=${() => { up(s => { s.d.tx.exported = { to, n: j.length, at: TX_TODAY + " · 11:04 am" }; txAudit("trust", "Exported " + j.length + " journal lines to " + (to === "qbo" ? "QuickBooks Online" : "Xero"), j.reduce((a, l) => a + l[2], 0), null); }); toast("Exported " + j.length + " lines to " + (to === "qbo" ? "QuickBooks Online" : "Xero") + " · payment IDs synced back to each deal"); }}>Export ${j.length} lines</button></div>
    ${ex && html`<div class="tx-exd"><${TxIc} n="check" s=${14} /> Last export: ${ex.n} lines to ${ex.to === "qbo" ? "QuickBooks Online" : "Xero"} · ${ex.at}. Two-way: matched bank lines flow back into the reconciliation.</div>`}
    <div class="tx-scroll"><table class="t"><thead><tr><th>Date</th><th>Account</th><th>Debit</th><th>Credit</th><th>Memo</th><th>${to === "qbo" ? "Class" : "Tracking"}</th></tr></thead><tbody>
      ${!j.length && html`<tr><td colspan="6"><div class="tx-empty"><b>Nothing to export yet</b><span class="muted">Received deposits and paid commissions become journal lines here.</span></div></td></tr>`}
      ${j.map(l => html`<tr><td class="num">${l[0]}</td><td>${l[1]}</td><td class="num">${l[2] ? usd(l[2], 2) : ""}</td><td class="num">${l[3] ? usd(l[3], 2) : ""}</td><td class="muted">${l[4]}</td><td><span class="pill">${l[5]}</span></td></tr>`)}
    </tbody></table></div></div>`;
}
function Tx1099() {
  const t = S.d.tx, rows = ["maya", "jordan", "priya", "sam"].map(a => ({ a, paid: t.stubs.filter(s => s.agent === a).reduce((x, s) => x + s.net, 0) }));
  const missing = rows.filter(r => !t.w9[r.a]);
  return html`<div class="card"><div class="hd tx-bh"><h3>1099-NEC · tax year 2026</h3><span class="sp"></span>
    <button class="btn sm pri" disabled=${missing.length > 0} title=${missing.length ? "Collect every W-9 first" : ""} onClick=${() => { const n = rows.filter(r => r.paid >= 600).length; up(() => { t.n1099 = n; txAudit("trust", n + " 1099-NEC drafts generated for tax year 2026", rows.reduce((a, r) => a + (r.paid >= 600 ? r.paid : 0), 0), null); }); toast(n + " 1099-NEC drafts ready · e-file by Jan 31"); }}>Generate drafts</button></div>
    ${t.n1099 && html`<div class="tx-exd"><${TxIc} n="check" s=${14} /> ${t.n1099} drafts ready for review · e-file opens Jan 2 and closes Jan 31. Each agent gets a copy in their app.</div>`}
    <div class="tx-scroll"><table class="t"><thead><tr><th>Agent</th><th>TIN on file</th><th>Paid YTD (box 1)</th><th>Form</th><th></th></tr></thead><tbody>
      ${rows.map(r => html`<tr><td><div class="row" style="gap:8px"><${Av} a=${A(r.a)} />${A(r.a).name}</div></td>
        <td>${t.w9[r.a] ? html`<span class="num">${t.w9[r.a]}</span>` : t.w9[r.a] === false ? html`<span class="pill b">W-9 requested</span>` : html`<span class="pill r">Missing W-9</span>`}</td>
        <td class="num"><b>${usd(r.paid)}</b></td><td>${r.paid >= 600 ? "1099-NEC" : "Under $600"}</td>
        <td style="text-align:right">${!t.w9[r.a] && t.w9[r.a] !== false ? html`<button class="btn sm" onClick=${() => { up(() => { t.w9[r.a] = false; }); txNotify(r.a, "Please complete your W-9 so Harbor & Vine can issue your 1099", "today"); toast("W-9 request sent to " + A(r.a).name + "'s agent app"); setTimeout(() => { up(() => { t.w9[r.a] = "SSN •••-••-5530"; }); toast(A(r.a).name + " completed the W-9"); }, 1400); }}>Request W-9</button>` : html`<button class="btn sm ghost" onClick=${() => go("commissions/pay")}>Paystubs</button>`}</td></tr>`)}
    </tbody></table></div></div>`;
}

// ---------- audit trail: every money action, who did it, when, on which deal ----------
function TxAudit({ area }) {
  const [who, setWho] = useState("all");
  const all = (S.d.tx.audit || []).filter(x => x.area === area);
  const people = [...new Set(all.map(x => x.who))];
  const rows = all.filter(x => who === "all" || x.who === who);
  return html`<div class="card"><div class="hd tx-bh"><h3>Audit trail · ${area === "trust" ? "trust & EMD" : "commissions"}</h3><span class="sp"></span>
    <label class="tx-inl"><span class="muted">By</span><select aria-label="Filter by person" value=${who} onChange=${e => setWho(e.target.value)}><option value="all">Everyone</option>${people.map(a => html`<option value=${a}>${A(a) ? A(a).name : a}</option>`)}</select></label>
    <button class="btn sm" disabled=${!rows.length} onClick=${() => { txAudit(area, "Audit trail exported (" + rows.length + " entries, CSV)", null, null); up(); toast("Audit trail CSV ready · " + rows.length + " entries · saved to Documents › Compliance"); }}>Export CSV</button></div>
    ${rows.length ? html`<div class="tx-audit">${rows.map(x => { const d = x.ref && txDeal(x.ref), a = A(x.who); return html`<div class="tx-au">
      ${a ? html`<${Av} a=${a} />` : html`<span class="av" style="background:#5B6B62">EO</span>`}
      <span class="tx-aum"><b>${a ? a.name : "Estate OS"}</b> ${x.what}${d && html` <button class="tx-link tx-ref" onClick=${() => go(txCan("deal") ? "deal/" + d.id : txCan("compliance") ? "compliance/" + d.id : "commissions/disb")}>${d.id} · ${L(d.listing).addr}</button>`}<small class="muted">${txAgo(x.ts)}</small></span>
      ${x.amt != null ? html`<b class=${"num tx-aua" + (x.amt < 0 ? " neg" : "")}>${x.amt < 0 ? "−" : ""}${usd(Math.abs(x.amt))}</b>` : html`<span></span>`}</div>`; })}</div>`
      : html`<div class="tx-empty"><b>No entries yet</b><span class="muted">Every approval, payout, deposit and release is recorded here automatically.</span></div>`}
  </div>`;
}

// ================= D) LEAD ROUTING =================
const TX_FIELDS = { source: "Source", intent: "Intent", price: "Price", area: "Area" };
const TX_SOURCES = ["Website", "Zillow", "Realtor.com", "Facebook ad", "Instagram ad", "Open house", "Referral", "Rentals site"];
const TX_DIST = { rr: "Round robin", weighted: "Weighted round robin", claim: "First to claim", agent: "Straight to an agent", pond: "Pond (shared pool)" };
const TX_SAMPLES = [
  { name: "Chris Alvarez", source: "Zillow", intent: "Buy", price: 640000, area: "East Austin", time: "day", msg: "Saw 3402 Govalle on Zillow. Is it still available? We're pre-approved." },
  { name: "Victoria Lang", source: "Website", intent: "Buy", price: 1850000, area: "Westlake", time: "day", msg: "Looking for 5 bed in Westlake, Eanes ISD, around $1.8–2M. Can we see 9 Laurel Ridge?" },
  { name: "Sofia Martins", source: "Rentals site", intent: "Rent", price: 2400, area: "East Austin", time: "day", msg: "Is the 1-bed at Eastside Lofts still open for November 1?" },
  { name: "Ben Okafor", source: "Facebook ad", intent: "Buy", price: 480000, area: "Mueller", time: "night", msg: "First-time buyer, saw your ad about the Linden. What's the smallest unit?" },
  { name: "Grace & Will Tan", source: "Open house", intent: "Buy", price: 900000, area: "Barton Hills", time: "day", msg: "Signed in at 2210 Barton Hills on Sunday. Loved it, what are the HOA rules?" },
];
const txRt = () => S.d.tx.routing;
function txCondOk(c, lead) {
  const [f, op, v] = c, lv = lead[f];
  if (f === "price") { const a = +lv, b = +String(v).replace(/[$,]/g, ""); return op === ">=" ? a >= b : op === "<=" ? a <= b : op === "=" ? a === b : a !== b; }
  const s = String(lv || "").toLowerCase(), t = String(v || "").toLowerCase();
  return op === "=" ? s === t : op === "≠" ? s !== t : s.includes(t);
}
const txCondText = (c) => TX_FIELDS[c[0]].toLowerCase() + " " + c[1] + " " + (c[0] === "price" ? usd(+c[2]) : c[2]);
function txRuleText(r) {
  const who = r.dist === "pond" ? "Harbor Pond" : r.agents.map(a => A(a).name.split(" ")[0]).join(", ") || "nobody";
  const head = r.catchAll ? "Every lead no other rule caught" : "If " + (r.conds.length > 1 ? (r.match === "all" ? "all" : "any") + " of: " : "") + r.conds.map(txCondText).join(r.match === "all" ? " and " : " or ");
  const tail = r.dist === "weighted" ? "weighted " + r.agents.map(a => A(a).name.split(" ")[0] + " " + (r.w[a] || 1)).join(" / ") : r.dist === "claim" ? "first to claim (" + who + ") in " + r.claim + " min, else " + A(r.fallback).name.split(" ")[0] : r.dist === "rr" ? "round robin (" + who + ")" : r.dist === "agent" ? who : "Harbor Pond";
  return head + " → " + tail + (r.hours ? " · " + txHr(r.from) + "–" + txHr(r.to) + ", after hours to the pond" : "");
}
// a rule with a blank or nonsensical condition never routes anyone: it's skipped and flagged until fixed
function txRuleErrs(r) {
  const e = { name: !r.catchAll && !String(r.name || "").trim() ? "Give the rule a name" : "", conds: [], agents: "" };
  if (!r.catchAll) r.conds.forEach((c, i) => { const v = String(c[2] == null ? "" : c[2]).trim(); e.conds[i] = !v ? "Enter a value" : c[0] === "price" && (isNaN(+v.replace(/[$,]/g, "")) || +v.replace(/[$,]/g, "") <= 0) ? "Enter a dollar amount, e.g. 750000" : ""; });
  if (r.dist !== "pond" && !r.agents.length) e.agents = "Pick at least one agent";
  if (r.dist === "claim" && r.agents.length < 2) e.agents = "A claim race needs two or more agents";
  e.any = !!(e.name || e.agents || e.conds.some(Boolean));
  return e;
}
const txHr = (h) => (h % 12 || 12) + (h < 12 || h === 24 ? " am" : " pm");
function txRoute(lead) {
  const rt = txRt(), trace = [];
  const hour = lead.time === "night" ? 22.6 : 10.9;
  for (const r of rt.rules) {
    if (!r.on) { trace.push({ r, ok: false, why: "Rule is off" }); continue; }
    if (txRuleErrs(r).any) { trace.push({ r, ok: false, why: "Rule has errors · skipped until fixed" }); continue; }
    const res = r.conds.map(c => [c, txCondOk(c, lead)]);
    const ok = r.catchAll || (r.match === "all" ? res.every(x => x[1]) : res.some(x => x[1]));
    if (!ok) { trace.push({ r, ok: false, why: res.map(x => txCondText(x[0]) + (x[1] ? " ✓" : " ✗")).join(" · ") }); continue; }
    if (r.hours && (hour < r.from || hour >= r.to)) { trace.push({ r, ok: true, why: "Matched, but it's " + (lead.time === "night" ? "10:36 pm" : "") + ", outside " + txHr(r.from) + "–" + txHr(r.to) }); return { trace, to: "pond", rule: r, how: "After hours: AI assistant replied, lead parked in Harbor Pond for the morning" }; }
    const av = r.agents.filter(a => rt.avail[a]);
    const cnt = rt.counts[r.id] = rt.counts[r.id] || {};
    if (r.dist === "pond") { trace.push({ r, ok: true, why: res.map(x => txCondText(x[0]) + " ✓").join(" · ") }); return { trace, to: "pond", rule: r, how: "Sent to Harbor Pond · all members notified" }; }
    if (!av.length) { trace.push({ r, ok: true, why: "Matched, but every agent in it is unavailable · falling through" }); continue; }
    trace.push({ r, ok: true, why: r.catchAll ? "Catch-all: nothing above matched" : res.map(x => txCondText(x[0]) + (x[1] ? " ✓" : " ✗")).join(" · ") });
    if (r.dist === "claim") return { trace, to: "claim", rule: r, offer: av, how: "Offered to " + av.map(a => A(a).name.split(" ")[0]).join(" & ") + " · first to tap claims it" };
    let pick, how;
    if (r.dist === "agent") { pick = av[0]; how = "Rule sends it straight to " + A(pick).name; }
    else if (r.dist === "weighted") { pick = av.slice().sort((a, b) => ((cnt[a] || 0) / (r.w[a] || 1)) - ((cnt[b] || 0) / (r.w[b] || 1)) || (r.w[b] || 1) - (r.w[a] || 1))[0]; how = "Weighted round robin · " + av.map(a => A(a).name.split(" ")[0] + " " + (cnt[a] || 0) + "/" + (r.w[a] || 1)).join(", ") + " → " + A(pick).name.split(" ")[0] + " is hungriest"; }
    else { pick = av.slice().sort((a, b) => (cnt[a] || 0) - (cnt[b] || 0))[0]; how = "Round robin · " + A(pick).name.split(" ")[0] + " is next up (" + (cnt[pick] || 0) + " this cycle)"; }
    return { trace, to: pick, rule: r, how };
  }
  return { trace, to: "pond", how: "No rule matched" };
}
function txMakeLead(lead, owner, tags) {
  const s = S.d;
  let n = s.people.length + 1; while (P("P" + n)) n++;
  let tn = s.threads.length + 1; while (s.threads.some(t => t.id === "T" + tn)) tn++;
  const pid = "P" + n, tid = "T" + tn, last = lead.name.split(/\s/).filter(Boolean).pop();
  const role = lead.intent === "Rent" ? "Tenant" : lead.intent === "Sell" ? "Seller" : "Buyer";
  s.people.push({ id: pid, name: lead.name, short: last, ini: txIni(lead.name), phone: "(512) 555-0" + (100 + n * 7 % 99), email: lead.name.split(/\s/)[0].toLowerCase() + "@example.com", owner, source: lead.source + " · routed", stage: "New lead", tags: [role, lead.area].concat(tags || []), roles: [role], score: 55 + (n * 13) % 35, last: "now",
    consent: { SMS: lead.source === "Facebook ad" || lead.source === "Instagram ad" ? "unknown" : "in", WhatsApp: "unknown", Email: "in", note: "Inbound inquiry via " + lead.source + " · one-to-one consent captured on the form · " + TX_TODAY } });
  const ch = { Zillow: "Zillow", "Realtor.com": "Realtor.com", "Rentals site": "Rentals site", Website: "Website", "Open house": "SMS", Referral: "Email" }[lead.source] || "SMS";
  s.threads.unshift({ id: tid, person: pid, channel: ch, unread: 1, when: "now", subject: lead.area + " · " + (lead.intent === "Rent" ? usd(lead.price) + "/mo" : short(+lead.price)), msgs: [{ from: "them", text: lead.msg, at: "now", ch }] });
  s.activity.push([pid, "Routing", "New lead from " + lead.source, TX_TODAY]);
  return { pid, tid };
}
function txAssign(pid, tid, agent, why, ruleId) {
  const rt = txRt(), p = P(pid), t = S.d.threads.find(x => x.id === tid);
  p.owner = agent; p.tags = p.tags.filter(x => x !== "Pond" && x !== "Claim pending");
  if (ruleId) { rt.counts[ruleId] = rt.counts[ruleId] || {}; rt.counts[ruleId][agent] = (rt.counts[ruleId][agent] || 0) + 1; }
  if (t) t.msgs.push({ from: "ai", text: "Hi " + p.name.split(" ")[0] + ", thanks for reaching out! " + A(agent).name + " will text you within a few minutes.", at: "now", ch: t.channel, note: "Auto-reply on assignment · routed to " + A(agent).name });
  rt.log.unshift({ name: p.name, pid, tid, to: agent, why, at: "10:5" + (rt.log.length % 10) + " am" });
  rt.watch.unshift({ pid, tid, agent, mins: 0, contacted: false, rule: ruleId || null });
  txNotify(agent, "New lead: " + p.name + " (" + p.source.replace(" · routed", "") + ") · " + why.split(" · ")[0] + ". Reach out within " + rt.idle.mins + " min", "inbox/" + tid);
}
function TxRouting() {
  const rt = txRt();
  const [lead, setLead] = useState(TX_SAMPLES[0]);
  const [si, setSi] = useState(0);
  const [res, setRes] = useState(null);
  const [edit, setEdit] = useState(null);
  const [, tick] = useState(0);
  const [tried, setTried] = useState(false);
  const [delAsk, setDelAsk] = useState(null);
  const lerr = { name: !lead.name.trim() ? "Give the lead a name" : "", price: !(+lead.price > 0) ? (lead.intent === "Rent" ? "Enter the monthly rent" : "Enter a price") : "", area: !String(lead.area || "").trim() ? "Enter an area or neighbourhood" : "" };
  const lbad = lerr.name || lerr.price || lerr.area;
  useEffect(() => { if (!rt.pending) return; const iv = setInterval(() => { if (rt.pending && Date.now() >= rt.pending.ends) { const pd = rt.pending; rt.pending = null; up(() => txAssign(pd.pid, pd.tid, pd.rule.fallback, "Nobody claimed in " + pd.rule.claim + " min → fallback " + A(pd.rule.fallback).name, pd.rule.id)); toast("Claim timed out · went to " + A(pd.rule.fallback).name); } else tick(x => x + 1); }, 500); return () => clearInterval(iv); }, [rt.pending]);
  function simulate() {
    setTried(true); if (lbad) return;
    if (rt.pending) { toast("Finish the open claim first"); return; }
    const r = txRoute(lead);
    up(() => {
      const owner = r.to === "pond" ? "maya" : r.to === "claim" ? r.rule.fallback : r.to;
      const { pid, tid } = txMakeLead(lead, owner, r.to === "pond" ? ["Pond"] : r.to === "claim" ? ["Claim pending"] : []);
      r.pid = pid; r.tid = tid;
      if (r.to === "pond") { rt.pond.unshift({ pid, tid, why: r.how }); const t = S.d.threads.find(x => x.id === tid); t.msgs.push({ from: "ai", text: "Thanks " + lead.name.split(" ")[0] + "! " + (lead.time === "night" ? "Our team is offline for the night; someone will reach out first thing tomorrow. " : "") + "Want me to set up a showing in the meantime?", at: "now", ch: t.channel, note: "AI assistant · lead is in Harbor Pond" }); rt.log.unshift({ name: lead.name, pid, tid, to: "pond", why: r.how, at: "now" }); }
      else if (r.to === "claim") rt.pending = { pid, tid, rule: r.rule, offer: r.offer, ends: Date.now() + r.rule.claim * 60 * 1000 / 30, total: r.rule.claim * 60 };
      else txAssign(pid, tid, r.to, r.how, r.rule.id);
      if (r.to === "pond") txNotify("maya", lead.name + " landed in Harbor Pond · " + r.how, "routing");
      if (r.to === "claim") r.offer.forEach(a => txNotify(a, "Lead up for grabs (" + lead.source + ", " + short(+lead.price) + ") · first to claim gets it", "routing"));
    });
    setRes(r); setTried(false);
    toast(lead.name + (r.to === "pond" ? " → Harbor Pond" : r.to === "claim" ? " offered to " + r.offer.length + " agents" : " → " + A(r.to).name), txCan("inbox") ? ["Open in inbox", () => go("inbox/" + r.tid)] : txCan("people") ? ["Open person", () => go("person/" + r.pid)] : null);
    const n = (si + 1) % TX_SAMPLES.length; setSi(n); setLead(TX_SAMPLES[n]);
  }
  function claim(a) { const pd = rt.pending; if (!pd) return; up(() => { rt.pending = null; txAssign(pd.pid, pd.tid, a, A(a).name + " claimed it first", pd.rule.id); }); toast(A(a).name + " claimed " + P(pd.pid).name); }
  function addRule() { const id = "R" + Date.now() % 100000; up(() => { rt.rules.splice(rt.rules.length - 1, 0, { id, name: "New rule", on: true, match: "all", conds: [["source", "=", "Website"]], dist: "rr", agents: ["jordan", "sam"], w: {}, claim: 5, fallback: "maya", hours: false, from: 8, to: 21 }); }); setEdit(id); }
  function move(i, dir) { up(() => { const r = rt.rules.splice(i, 1)[0]; rt.rules.splice(i + dir, 0, r); }); }
  function fastForward() {
    const idle = rt.watch.filter(w => !w.contacted && w.mins < rt.idle.mins);
    if (!rt.idle.on) { toast("Idle-lead reassignment is off"); return; }
    up(() => { rt.watch.forEach(w => { if (w.contacted || w.mins >= rt.idle.mins) return; w.mins = rt.idle.mins; const p = P(w.pid); if (!p) return;
      const rule = rt.rules.find(r => r.id === w.rule), cands = (rule && rule.dist !== "pond" ? rule.agents : ["jordan", "sam", "priya"]).filter(a => a !== w.agent && rt.avail[a]);
      if (rt.idle.to === "pond" || !cands.length) { rt.pond.unshift({ pid: w.pid, tid: w.tid, why: "Idle " + rt.idle.mins + " min with " + A(w.agent).name }); p.owner = "maya"; p.tags.push("Pond"); w.moved = "Harbor Pond"; }
      else { const next = cands.sort((a, b) => ((rt.counts.RC || {})[a] || 0) - ((rt.counts.RC || {})[b] || 0))[0] || "maya"; p.owner = next; w.moved = A(next).name; w.agent = next; }
      rt.log.unshift({ name: p.name, pid: w.pid, tid: w.tid, to: w.moved === "Harbor Pond" ? "pond" : p.owner, why: "No call, text or email in " + rt.idle.mins + " min → reassigned", at: "+" + rt.idle.mins + "m" }); }); });
    toast(idle.length ? idle.length + " idle lead" + (idle.length > 1 ? "s" : "") + " reassigned" : "Nobody idle: every lead was contacted in time");
  }
  const pd = rt.pending, left = pd ? Math.max(0, Math.ceil((pd.ends - Date.now()) / 1000 * 30)) : 0;
  const ag5 = ["maya", "jordan", "priya", "sam", "leo"];
  const broken = rt.rules.filter(r => txRuleErrs(r).any).length;
  return html`<${Shell} title="Lead routing" sub=${(S.role ? txHello("") : "") + "Who gets each new lead, and why: rules run top to bottom, first match wins"}
    actions=${html`<div class="tx-act">${txCan("people") && html`<button class="btn" onClick=${() => go("people")}>People</button>`}<button class="btn pri" onClick=${addRule}><${TxIc} n="plus" /> Add rule</button></div>`}>
    <div class="page tx-page">
      <div class="card tx-avail"><div class="hd"><h3>Who's taking leads</h3><span class="sp"></span><span class="muted" style="font-size:12px">Pausing someone skips them in every rule</span></div><div class="bd">
        ${ag5.map(a => { const n = S.d.people.filter(p => p.owner === a && p.stage === "New lead").length; return html`<div class=${"tx-av" + (rt.avail[a] ? "" : " off")}><${Av} a=${A(a)} /><span><b>${A(a).name.split(" ")[0]}</b><small>${n} new lead${n === 1 ? "" : "s"}</small></span><button role="switch" aria-checked=${rt.avail[a]} aria-label=${"Available: " + A(a).name} class=${"tx-sw" + (rt.avail[a] ? " on" : "")} onClick=${() => { up(() => { rt.avail[a] = !rt.avail[a]; }); toast(A(a).name + (rt.avail[a] ? " is taking leads" : " is paused")); }}><i></i></button></div>`; })}
      </div></div>
      ${broken > 0 && html`<div class="tx-block"><${TxIc} n="alert" /><div><b>${broken} rule${broken > 1 ? "s have" : " has"} errors</b> and ${broken > 1 ? "are" : "is"} being skipped. Leads fall through to the next rule until it's fixed.</div></div>`}
      <div class="tx-rt">
        <div class="tx-rules">
          ${rt.rules.map((r, i) => html`<div class=${"card tx-rule" + (r.on ? "" : " off") + (r.catchAll ? " ca" : "") + (res && res.rule === r ? " hit" : "")}>
            <div class="tx-rh"><span class="tx-ord">${r.catchAll ? html`<${TxIc} n="lock" s=${13} />` : i + 1}</span>
              <div class="tx-rm"><b>${r.name || "Untitled rule"}${txRuleErrs(r).any ? html` <span class="tx-sev Blocker">Needs fixing</span>` : ""}</b><small>${txRuleText(r)}</small></div>
              <div class="tx-act tx-rctl">${!r.catchAll && html`<button class="btn sm ghost" aria-label="Move up" disabled=${i === 0} onClick=${() => move(i, -1)}><${TxIc} n="up2" s=${13} /></button><button class="btn sm ghost" aria-label="Move down" disabled=${i >= rt.rules.length - 2} onClick=${() => move(i, 1)}><${TxIc} n="dn" s=${13} /></button>`}
                <button role="switch" aria-checked=${r.on} aria-label=${"Rule on: " + r.name} class=${"tx-sw" + (r.on ? " on" : "")} disabled=${r.catchAll} onClick=${() => up(() => { r.on = !r.on; })}><i></i></button>
                <button class="btn sm" disabled=${edit === r.id && txRuleErrs(r).any} title=${edit === r.id && txRuleErrs(r).any ? "Fix the highlighted fields first" : ""} onClick=${() => setEdit(edit === r.id ? null : r.id)}>${edit === r.id ? "Done" : "Edit"}</button></div></div>
            ${edit === r.id && html`<${TxRuleEdit} r=${r} close=${() => setEdit(null)} ask=${delAsk === r.id} setAsk=${v => setDelAsk(v ? r.id : null)} />`}
          </div>`)}
          <div class="card tx-idle"><div class="hd"><${TxChip} n="clock" tone="br" /><h3>Idle-lead reassignment</h3><span class="sp"></span><button role="switch" aria-checked=${rt.idle.on} aria-label="Idle reassignment" class=${"tx-sw" + (rt.idle.on ? " on" : "")} onClick=${() => up(() => { rt.idle.on = !rt.idle.on; })}><i></i></button></div>
            <div class="bd" style="display:flex;flex-direction:column;gap:10px">
              <div class="tx-sent">If the assigned agent hasn't called, texted or emailed within
                <select aria-label="Minutes" value=${rt.idle.mins} onChange=${e => up(() => { rt.idle.mins = +e.target.value; })}>${[5, 10, 15, 30, 60].map(m => html`<option value=${m}>${m} minutes</option>`)}</select>,
                move it to <select aria-label="Reassign to" value=${rt.idle.to} onChange=${e => up(() => { rt.idle.to = e.target.value; })}><option value="next">the next agent in rotation</option><option value="pond">Harbor Pond</option></select>. Automated messages don't count. Working hours only.</div>
              ${rt.watch.length ? html`<div class="tx-watch">${rt.watch.slice(0, 5).map(w => { const p = P(w.pid); return p && html`<div class=${w.contacted ? "ok" : w.moved ? "mv" : ""}><span class="av" style="background:#5B6B62">${p.ini}</span><span style="flex:1;min-width:0"><b>${p.name}</b><small class="muted">${w.contacted ? "Contacted by " + A(w.agent).name.split(" ")[0] + " ✓" : w.moved ? "Reassigned to " + w.moved : A(w.agent).name.split(" ")[0] + " · " + w.mins + " of " + rt.idle.mins + " min"}</small></span>${!w.contacted && !w.moved && html`<button class="btn sm" onClick=${() => { up(() => { w.contacted = true; const t = S.d.threads.find(x => x.id === w.tid); if (t) t.msgs.push({ from: "me", text: "Hi " + p.name.split(" ")[0] + ", it's " + A(w.agent).name.split(" ")[0] + " from Harbor & Vine. Just tried calling; when's good to chat?", at: "now", ch: "SMS" }); }); toast("Call logged · " + p.name + " stays with " + A(w.agent).name); }}>Log a call</button>`}</div>`; })}</div>
                <button class="btn sm" style="align-self:flex-start" onClick=${fastForward}><${TxIc} n="clock" s=${13} /> Fast-forward ${rt.idle.mins} min</button>` : html`<div class="muted" style="font-size:12.5px">Simulate a lead to watch the speed-to-lead timer.</div>`}
            </div></div>
        </div>
        <div class="tx-simc">
          <div class="card tx-sim"><div class="hd"><${TxChip} n="bolt" tone="br" /><h3>Simulate a lead</h3><span class="sp"></span><button class="btn sm ghost" onClick=${() => { const n = (si + 1) % TX_SAMPLES.length; setSi(n); setLead(TX_SAMPLES[n]); }}>Another</button></div>
            <div class="bd" style="display:flex;flex-direction:column;gap:10px">
              <label class="field"><span>Name</span><input value=${lead.name} aria-invalid=${tried && !!lerr.name} class=${tried && lerr.name ? "tx-bad-in" : ""} onInput=${e => setLead({ ...lead, name: e.target.value })} onKeyDown=${e => e.key === "Enter" && simulate()} />${tried && lerr.name && html`<span class="tx-err" role="alert">${lerr.name}</span>`}</label>
              <div class="tx-2"><label class="field"><span>Source</span><select value=${lead.source} onChange=${e => setLead({ ...lead, source: e.target.value })}>${TX_SOURCES.map(s => html`<option value=${s}>${s}</option>`)}</select></label>
                <label class="field"><span>Intent</span><select value=${lead.intent} onChange=${e => setLead({ ...lead, intent: e.target.value })}>${["Buy", "Sell", "Rent"].map(s => html`<option value=${s}>${s}</option>`)}</select></label></div>
              <div class="tx-2"><label class="field"><span>${lead.intent === "Rent" ? "Rent / mo" : "Price"}</span><input type="number" min="0" value=${lead.price} aria-invalid=${tried && !!lerr.price} class=${tried && lerr.price ? "tx-bad-in" : ""} onInput=${e => setLead({ ...lead, price: e.target.value === "" ? "" : +e.target.value })} />${tried && lerr.price && html`<span class="tx-err" role="alert">${lerr.price}</span>`}</label>
                <label class="field"><span>Area</span><input value=${lead.area} aria-invalid=${tried && !!lerr.area} class=${tried && lerr.area ? "tx-bad-in" : ""} onInput=${e => setLead({ ...lead, area: e.target.value })} />${tried && lerr.area && html`<span class="tx-err" role="alert">${lerr.area}</span>`}</label></div>
              <div class="tx-segs">${[["day", "Now · 10:52 am"], ["night", "Tonight · 10:36 pm"]].map(([k, v]) => html`<button class=${lead.time === k ? "on" : ""} onClick=${() => setLead({ ...lead, time: k })}>${v}</button>`)}</div>
              <button class="btn pri" onClick=${simulate}><${TxIc} n="bolt" /> Simulate a lead</button>
            </div></div>
          ${pd && html`<div class="card tx-claim"><div class="hd"><h3>Claim open · ${P(pd.pid).name}</h3><span class="sp"></span><span class="num tx-tm">${Math.floor(left / 60)}:${String(left % 60).padStart(2, "0")}</span></div><div class="bd">
            <div class="bar"><i style=${"width:" + left / pd.total * 100 + "%;background:var(--brass)"}></i></div>
            <div class="muted" style="font-size:12px;margin:8px 0">Pushed to ${pd.offer.map(a => A(a).name.split(" ")[0]).join(" & ")} · name and source hidden until claimed · falls back to ${A(pd.rule.fallback).name}</div>
            <div class="tx-act">${pd.offer.map(a => html`<button class="btn sm" onClick=${() => claim(a)}><${Av} a=${A(a)} /> ${A(a).name.split(" ")[0]} claims</button>`)}</div></div></div>`}
          ${res && html`<div class="card tx-whyc"><div class="hd"><h3>Why ${res.to === "pond" ? "Harbor Pond" : res.to === "claim" ? "a claim race" : A(res.to).name}?</h3><span class="sp"></span><button class="btn sm" onClick=${() => go("person/" + res.pid)}>Person →</button></div><div class="bd tx-trace">
            ${res.trace.map(x => html`<div class=${x.ok ? "ok" : ""}><i>${x.ok ? "✓" : "✗"}</i><span><b>${x.r.name}</b><small>${x.why}</small></span></div>`)}
            <div class="tx-out"><${TxIc} n="arrow" s=${14} /> ${res.how}</div></div></div>`}
          <div class="card"><div class="hd"><${TxChip} n="pond" tone="b" /><h3>Harbor Pond</h3><span class="sp"></span><span class="muted" style="font-size:12px">Pond lead: Maya</span></div><div class="bd tx-pond">
            ${rt.pond.length ? rt.pond.map(x => { const p = P(x.pid); return p && html`<div><span class="av" style="background:#5B6B62">${p.ini}</span><span style="flex:1;min-width:0"><b>${p.name}</b><small class="muted">${x.why}</small></span>
              <select aria-label="Claim as" onChange=${e => { const a = e.target.value; if (!a) return; up(() => { rt.pond.splice(rt.pond.indexOf(x), 1); txAssign(x.pid, x.tid, a, "Claimed from Harbor Pond"); }); toast(A(a).name + " claimed " + p.name + " from the pond"); }}><option value="">Claim as…</option>${["jordan", "priya", "sam"].map(a => html`<option value=${a}>${A(a).name}</option>`)}</select></div>`; }) : html`<div class="muted" style="font-size:12.5px">Empty. Open-house sign-ins and after-hours leads land here.</div>`}
          </div></div>
          <div class="card"><div class="hd"><h3>Routing log</h3></div><div class="bd tx-log">
            ${rt.log.length ? rt.log.slice(0, 8).map(x => html`<div><i></i><span><button class="tx-link" onClick=${() => go("inbox/" + x.tid)}><b>${x.name}</b></button> → ${x.to === "pond" ? "Harbor Pond" : A(x.to).name}<small class="muted" style="display:block">${x.why}</small></span><small>${x.at}</small></div>`) : html`<div class="muted" style="font-size:12.5px">No leads routed yet today.</div>`}
          </div></div>
        </div>
      </div>
    </div></${Shell}>`;
}
function TxRuleEdit({ r, close, ask, setAsk }) {
  const set = (fn) => up(() => fn(r));
  const er = txRuleErrs(r);
  function del() { const rs = S.d.tx.routing.rules, i = rs.indexOf(r); up(() => { rs.splice(i, 1); }); setAsk(false); toast("Rule deleted · leads fall through to the next rule", ["Undo", () => up(() => { rs.splice(i, 0, r); })]); }
  return html`<div class="tx-re">
    ${!r.catchAll && html`<label class="field"><span>Rule name</span><input value=${r.name} aria-invalid=${!!er.name} class=${er.name ? "tx-bad-in" : ""} onInput=${e => set(x => { x.name = e.target.value; })} />${er.name && html`<span class="tx-err" role="alert">${er.name}</span>`}</label>`}
    ${r.catchAll ? html`<div class="tx-ca"><${TxIc} n="lock" s=${14} /> The catch-all can't be deleted or given conditions, so no lead is ever left unassigned. You can change who it goes to.</div>` : html`
      <div class="row" style="gap:8px;flex-wrap:wrap;font-size:13px">Match <div class="tx-segs sm">${[["all", "All"], ["any", "Any"]].map(([k, v]) => html`<button class=${r.match === k ? "on" : ""} onClick=${() => set(x => { x.match = k; })}>${v}</button>`)}</div> of these conditions</div>
      ${r.conds.map((c, i) => html`<div class="tx-cond">
        <select aria-label="Field" value=${c[0]} onChange=${e => set(() => { c[0] = e.target.value; c[1] = c[0] === "price" ? ">=" : "="; c[2] = c[0] === "source" ? "Website" : c[0] === "intent" ? "Buy" : ""; })}>${Object.entries(TX_FIELDS).map(([k, v]) => html`<option value=${k}>${v}</option>`)}</select>
        <select aria-label="Operator" value=${c[1]} onChange=${e => set(() => { c[1] = e.target.value; })}>${(c[0] === "price" ? [">=", "<=", "=", "≠"] : ["=", "≠", "contains"]).map(o => html`<option value=${o}>${o}</option>`)}</select>
        ${c[0] === "source" ? html`<select aria-label="Value" value=${c[2]} onChange=${e => set(() => { c[2] = e.target.value; })}>${TX_SOURCES.map(s => html`<option value=${s}>${s}</option>`)}</select>` : c[0] === "intent" ? html`<select aria-label="Value" value=${c[2]} onChange=${e => set(() => { c[2] = e.target.value; })}>${["Buy", "Sell", "Rent"].map(s => html`<option value=${s}>${s}</option>`)}</select>` : html`<input aria-label="Value" inputmode=${c[0] === "price" ? "numeric" : "text"} placeholder=${c[0] === "price" ? "750000" : "e.g. Zilker"} aria-invalid=${!!er.conds[i]} class=${er.conds[i] ? "tx-bad-in" : ""} value=${c[2]} onInput=${e => set(() => { c[2] = e.target.value; })} />`}
        <button class="btn sm ghost" aria-label="Remove condition" title=${r.conds.length < 2 ? "A rule needs at least one condition" : "Remove condition"} disabled=${r.conds.length < 2} onClick=${() => set(x => { x.conds.splice(i, 1); })}><${TxIc} n="x" s=${13} /></button>
        ${er.conds[i] && html`<span class="tx-err tx-cerr" role="alert">${er.conds[i]}</span>`}</div>`)}
      <button class="btn sm ghost" style="align-self:flex-start" onClick=${() => set(x => { x.conds.push(["area", "contains", "Zilker"]); })}><${TxIc} n="plus" s=${13} /> Condition</button>`}
    <div class="tx-2"><label class="field"><span>Then</span><select value=${r.dist} onChange=${e => set(x => { x.dist = e.target.value; if (x.dist === "agent") x.agents = x.agents.slice(0, 1); if (x.dist === "weighted") x.w = x.w || {}; if (x.dist === "claim") { x.claim = x.claim || 5; x.fallback = x.fallback || "maya"; } })}>${Object.entries(TX_DIST).filter(([k]) => !(r.catchAll && (k === "pond" || k === "claim"))).map(([k, v]) => html`<option value=${k}>${v}</option>`)}</select></label>
      ${r.dist === "claim" && html`<label class="field"><span>Claim timer · ${r.claim} min (max 30)</span><input type="range" min="1" max="30" value=${r.claim} onInput=${e => set(x => { x.claim = +e.target.value; })} /></label>`}</div>
    ${r.dist !== "pond" && html`<div class="tx-agp">${["maya", "jordan", "priya", "sam", "leo"].map(a => { const on = r.agents.includes(a); return html`<div class=${"tx-agc" + (on ? " on" : "")}><button onClick=${() => set(x => { if (x.dist === "agent") x.agents = [a]; else if (on) { if (x.agents.length > 1) x.agents = x.agents.filter(y => y !== a); } else x.agents = x.agents.concat(a); })}><${Av} a=${A(a)} />${A(a).name.split(" ")[0]}</button>${on && r.dist === "weighted" && html`<input type="number" min="1" max="9" aria-label=${"Weight " + A(a).name} value=${r.w[a] || 1} onInput=${e => set(x => { x.w[a] = Math.min(9, Math.max(1, +e.target.value || 1)); })} />`}</div>`; })}</div>
    ${er.agents && html`<span class="tx-err" role="alert">${er.agents}</span>`}`}
    ${r.dist === "claim" && html`<label class="field"><span>If nobody claims in time</span><select value=${r.fallback} onChange=${e => set(x => { x.fallback = e.target.value; })}>${["maya", "jordan", "priya", "sam"].map(a => html`<option value=${a}>${A(a).name}</option>`)}</select></label>`}
    <div class="row" style="gap:8px;flex-wrap:wrap;font-size:13px"><button role="switch" aria-checked=${!!r.hours} aria-label="Working hours" class=${"tx-sw" + (r.hours ? " on" : "")} onClick=${() => set(x => { x.hours = !x.hours; x.from = x.from || 8; x.to = x.to || 21; })}><i></i></button> Working hours only
      ${r.hours && html`<select aria-label="From" value=${r.from} onChange=${e => set(x => { x.from = +e.target.value; })}>${[6, 7, 8, 9, 10].map(h => html`<option value=${h}>${txHr(h)}</option>`)}</select> to <select aria-label="To" value=${r.to} onChange=${e => set(x => { x.to = +e.target.value; })}>${[17, 18, 19, 20, 21, 22].map(h => html`<option value=${h}>${txHr(h)}</option>`)}</select><span class="muted">· after hours → Harbor Pond + AI reply</span>`}</div>
    <div class="tx-act" style="justify-content:space-between">${r.catchAll ? html`<span class="muted" style="font-size:12px"><${TxIc} n="lock" s=${12} /> Can't be deleted</span>` : (ask ? html`<div class="tx-act"><span class="muted" style="font-size:12px">Delete “${r.name || "this rule"}”?</span><button class="btn sm" onClick=${() => setAsk(false)}>Keep</button><button class="btn sm tx-dangr" onClick=${del}>Delete</button></div>` : html`<button class="btn sm ghost tx-red" onClick=${() => setAsk(true)}><${TxIc} n="trash" s=${13} /> Delete rule</button>`)}<button class="btn sm pri" disabled=${er.any} title=${er.any ? "Fix the highlighted fields first" : ""} onClick=${() => { close(); toast("Rule saved · rotation restarted"); }}>Save rule</button></div>
  </div>`;
}
