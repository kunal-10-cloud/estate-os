// End-to-end journey: ONE page, ONE store, no reloads. Personas switch through the account menu → persona picker,
// like a live demo. Every hand-off asserts that the right persona got the right notification and that the numbers agree.
// Usage: node journey.mjs [width]   (default runs 1440 full journey, then a 400px journey of the key screens)
import { chromium } from 'playwright-core';
import fs from 'fs';
const U = (process.env.EOS_URL || 'http://localhost:3000/index.html');
const OUT = new URL('./shots-journey/', import.meta.url).pathname; fs.mkdirSync(OUT, { recursive: true });
const b = await chromium.launch({ channel: 'chrome', headless: true });
const fails = [], errs = [], passed = [];

async function journey(w) {
  const ctx = await b.newContext({ viewport: { width: w, height: w < 600 ? 860 : 900 } });
  const page = await ctx.newPage();
  let step = 'boot', loads = 0;
  page.on('pageerror', e => errs.push(`${w} [${step}] pageerror ${e.message}`));
  page.on('console', m => { if (m.type() === 'error' && !/404|favicon|Failed to load resource/.test(m.text())) errs.push(`${w} [${step}] ${m.text()}`); });
  page.on('load', () => { loads++; });
  const W = (ms = 250) => page.waitForTimeout(ms);
  const ok = (c, m) => { (c ? passed : fails).push(`${w} [${step}] ${m}`); if (!c) console.log('  ✗ ' + w + ' ' + m); };
  const S = (fn, a) => page.evaluate(fn, a);
  const hash = () => S(() => location.hash);
  let n = 0; const shot = (name, full = false) => page.screenshot({ path: `${OUT}${w}-${String(++n).padStart(2, '0')}-${name}.png`, fullPage: full });
  const modal = () => page.locator('.scrim .modal').last();
  const inModal = async () => (await page.locator('.scrim .modal').count()) > 0;
  const btn = async (name, exact) => ((await inModal()) ? modal() : page).getByRole('button', { name, exact: !!exact }).first();
  const click = async (name, exact) => { await (await btn(name, exact)).click(); await W(); };
  const hs = async (tag) => { const o = await S(() => Math.max(document.documentElement.scrollWidth - innerWidth, ...[...document.querySelectorAll('.main')].map(m => m.scrollWidth - m.clientWidth))); ok(o <= 1, `no horizontal scroll on ${tag} (${o})`); };
  const vis = (sel) => page.locator(sel).locator('visible=true').first();
  // the persona switch a presenter would use: account menu → Switch persona → pick the card
  async function seat(name) {
    const av = vis('.eos-avbtn');
    if (await av.count()) { await av.click(); await W(150); await page.getByRole('menuitem', { name: 'Switch persona' }).click(); await W(350); }
    else { await S(() => go('start')); await W(300); }
    ok(await page.locator('.rs-hero').count() === 1, 'persona picker reached for ' + name);
    await page.locator('.rs-card', { hasText: name }).first().click(); await W(700);
  }
  // open this persona's bell, find a notification, optionally follow it
  async function notif(re, follow) {
    const bell = vis('.eos-bell'); ok(await bell.count() === 1, 'bell visible');
    await bell.click(); await W(200);
    const items = await page.locator('.eos-ni').allInnerTexts();
    const hit = items.find(t => re.test(t));
    ok(!!hit, `notification ${re} (got: ${items.slice(0, 4).map(t => t.split('\n')[0]).join(' | ')})`);
    if (hit && follow) { await page.locator('.eos-ni', { hasText: re }).first().click(); await W(500); }
    else { await page.keyboard.press('Escape'); await W(150); if (await page.locator('.eos-notif').count()) { await bell.click(); await W(100); } }
    return hit;
  }
  const money = (s) => +String(s).replace(/[^\d.-]/g, '');

  try {
    // ============ 1. Visitor: search → 4 Willow Bend → request a tour (touring agreement) ============
    step = 'visitor'; await page.goto(U + '#/start'); await W(1200);
    await page.locator('.rs-card', { hasText: 'Website visitor' }).click(); await W(700);
    if (await page.locator('.sx-cookie').count()) await click('Accept all').catch(() => click('Reject non-essential'));
    await shot('site-home');
    await page.locator('.sx-q input').fill('Willow'); await click(/^Search$/); await W(500);
    ok((await hash()).startsWith('#/site/buy'), 'hero search → results');
    const res = await page.locator('.sx-list .sx-lc').allInnerTexts(); ok(res.length >= 1 && res.some(t => /4 Willow Bend/.test(t)), 'search finds 4 Willow Bend (' + res.length + ' results)');
    await page.locator('.sx-list .sx-lc', { hasText: '4 Willow Bend' }).first().click(); await W(600);
    ok(/#\/site\/home\/L1/.test(await hash()), 'listing detail opens');
    const sitePrice = money(await page.locator('.pr.num').first().textContent().catch(() => '0'));
    ok(sitePrice === 1149000, 'site price = list price (' + sitePrice + ')');
    await shot('site-listing');
    await click('Request a tour');
    await page.getByLabel('Full name').fill('Jamie Rivera'); await page.getByLabel('Email').fill('jamie.rivera@example.com'); await page.getByLabel('Mobile').fill('5125550164');
    await click('Continue');
    ok(await page.getByText('Touring agreement ·').isVisible(), 'touring agreement before tour');
    await page.locator('.sx-modal .sx-ck input').first().check(); await page.locator('.sx-sigin').fill('Jamie Rivera');
    await shot('tour-agreement');
    await click('Sign & continue'); await click('Request tour', true); await W(900);
    ok(await page.getByText('Tour requested').first().isVisible(), 'tour confirmation');
    const jr = await S(() => { const p = S.d.people.find(x => x.email === 'jamie.rivera@example.com'); const t = p && S.d.threads.find(t => t.person === p.id); return p && { id: p.id, owner: p.owner, tid: t && t.id, deal: S.d.deals.find(d => d.person === p.id) }; });
    ok(jr && jr.owner === 'jordan' && jr.tid && jr.deal && jr.deal.agreement.touring, 'lead routed to Jordan with thread + touring agreement');
    await click('Keep browsing');

    // ============ 2. Jordan: notification → inbox thread → reply ============
    step = 'jordan'; await seat('Jordan Lee');
    ok((await hash()) === '#/today', 'Jordan lands on Today');
    await notif(/Jamie Rivera requested a tour of 4 Willow Bend/, true);
    ok((await hash()) === '#/inbox/' + jr.tid, 'notification opens the thread (' + await hash() + ')');
    ok(await page.locator('.of-conv, .main').getByText(/Requested a tour of 4 Willow Bend/).first().isVisible(), 'thread shows the tour request');
    const box = page.getByRole('textbox', { name: 'Message' }); await box.fill('Hi Jamie, Saturday works. See you at 4 Willow Bend!'); await box.press('Enter'); await W(400);
    ok(await S(t => S.d.threads.find(x => x.id === t).msgs.some(m => m.from === 'me' && /See you at 4 Willow Bend/.test(m.text)), jr.tid), 'Jordan reply logged on the thread');
    await shot('jordan-inbox');
    await hs('jordan inbox');

    // ============ 3. Elena: budget/pre-approval → saved homes match the site → offer ============
    step = 'elena'; await seat('Elena Ruiz');
    ok((await hash()).startsWith('#/portal'), 'Elena lands in the buyer portal');
    await page.locator('.pt-tabs button', { hasText: 'Budget' }).click(); await W(300);
    await click(/^Start/).catch(() => {});
    for (const t of ['Last 2 pay stubs', 'W-2s for 2024 and 2025', '2 months of bank statements', 'Photo ID']) { const el = page.getByText(t).first(); if (await el.count()) await el.click(); }
    await click('Submit for pre-approval'); await click('Review & sign'); await click(/I'm ready/);
    ok(await S(() => pj().preapproved), 'pre-approved');
    await shot('elena-budget');
    await page.locator('.pt-tabs button', { hasText: 'Saved' }).click(); await W(300);
    const portalSaved = await page.locator('.sv').count(), storeSaved = await S(() => Object.keys(pj().saved).length);
    ok(portalSaved === storeSaved, `portal Saved shows every saved home (${portalSaved}/${storeSaved})`);
    await S(() => go('site/buy')); await W(500);
    const siteCount = await page.locator('.sx-hdr .sx-saved i').textContent().catch(() => '');
    ok(+siteCount === storeSaved, `site header saved count matches the portal (${siteCount} vs ${storeSaved})`);
    ok(await page.locator('.sx-list .sx-lc .heart.on').count() >= 1, 'saved hearts on the site match');
    await S(() => go('portal/offer')); await W(400);
    await click('Continue'); await click('Continue'); await click('Sign offer'); await click('Send offer'); await W(600);
    const offer = await S(() => pj().offer.price);
    ok(offer > 0, 'offer sent ' + offer);
    await shot('elena-offer-sent');
    await W(2800);
    ok(await page.locator('.pill', { hasText: 'Sent · waiting' }).count() === 1, 'offer waits for the sellers (no fake auto-counter)');

    // ============ 4. Grants: see Elena's offer, sign "offers presented", accept ============
    step = 'grants'; await seat('Rachel & Tom Grant');
    await notif(/Elena.*offer|offer.*Elena/i, true);
    ok((await hash()) === '#/seller/offers', 'offer notification → seller offers');
    const card = page.locator('.sl-of', { hasText: 'Elena' });
    ok(await card.count() === 1, "Elena's offer is in the comparison");
    ok(money(await card.locator('.sl-op b').textContent()) === offer, 'seller sees the same offer price');
    await page.locator('.sig').filter({ hasText: 'Rachel Grant' }).getByRole('button', { name: 'Sign' }).click();
    await page.locator('.sig').filter({ hasText: 'Tom Grant' }).getByRole('button', { name: 'Sign' }).click();
    await click('Confirm & sign'); ok(await S(() => !!S.d.sl.presented), 'offers-presented affirmation signed');
    await card.getByRole('button', { name: 'Accept' }).click(); await W();
    await modal().locator('.sig button').click(); await click('Accept offer'); await W(400);
    const st = await S(() => ({ d2: S.d.deals.find(d => d.id === 'D2'), d5: S.d.deals.find(d => d.person === 'P4' && d.listing === 'L1'), l1: L('L1').status, acc: pj().accepted }));
    ok(st.d2.stage === 'Under contract' && st.d2.price === offer, 'listing deal D2 under contract at the offer price');
    ok(st.d5 && st.d5.stage === 'Under contract' && st.acc, "Elena's purchase is under contract too");
    ok(st.l1 === 'Under contract', 'listing status → Under contract');
    await shot('grants-accepted', true);

    // ============ 5. Priya, Nina, Grace ============
    step = 'priya'; await seat('Priya Shah');
    await notif(/Offer accepted on 4 Willow Bend/, true);
    ok((await hash()) === '#/deal/D2', 'Priya lands on the deal');
    ok(await page.locator('.main .pill', { hasText: 'Under contract' }).first().isVisible(), 'deal shows Under contract');
    await shot('priya-deal');

    step = 'nina'; await seat('Nina Patel');
    ok((await hash()) === '#/compliance', 'Nina lands on Compliance');
    await notif(/New contract to open: 4 Willow Bend/);
    await page.locator('.tx-qi', { hasText: '4 Willow Bend' }).first().click(); await W(300);
    ok((await hash()) === '#/compliance/D2', 'opens D2 review');
    for (let i = 0; i < 6; i++) {
      const head = page.locator('.tx-doc').filter({ has: page.locator('.pill', { hasText: /Needs review|Rejected|Missing/ }) }).first();
      if (!(await head.count())) break;
      if (!(await head.evaluate(n => n.classList.contains('on')))) { await head.locator('.tx-dh').click(); await W(120); }
      const ap = page.locator('.tx-doc.on').getByRole('button', { name: 'Approve', exact: true });
      if (!(await ap.count())) break; await ap.click(); await W(150);
    }
    await click('Mark file compliant');
    ok(await S(() => S.d.tx.rev.D2.status === 'Compliant'), 'D2 compliant');
    await shot('nina-compliant');

    step = 'grace'; await seat('Grace Liu');
    await notif(/compliant|CDA|4 Willow Bend/i);
    await S(() => go('commissions/cda')); await W(400);
    await page.locator('.tx-cda select').first().selectOption('D2'); await W(200);
    const pct = page.locator('.tx-cda input[type=number]').first(); if (await page.locator('.tx-block', { hasText: "Can't send" }).count()) await click(/^Cap at/);
    await click('Send to title for signature'); await W(1900);
    ok(await S(() => S.d.tx.cda.D2 && S.d.tx.cda.D2.status === 'Signed'), 'CDA signed by title');
    await S(() => go('commissions/disb')); await W(400);
    const row = page.locator('.tx-dt tbody tr', { hasText: '4 Willow Bend' });
    const tick = async () => { const c = row.locator('input[type=checkbox]'); if (!(await c.isChecked())) await c.check(); };
    await tick(); await click(/^Approve/); await tick(); await click(/^Confirm funds in/); await tick(); await click(/^Pay agents/); await click('Confirm payout', true); await W(300);
    ok(await S(() => S.d.tx.disb.find(r => r.deal === 'D2').status === 'Processed'), 'payout processed');
    await S(() => go('commissions/pay')); await W(400); await page.locator('.tx-agt', { hasText: 'Priya Shah' }).click(); await W(200);
    const stub = page.locator('.tx-stub', { hasText: '4 Willow Bend' }); ok(await stub.count() === 1, 'paystub for Priya');
    await stub.click(); await W(200);
    const stubNet = money(await stub.locator('b.num').textContent());
    await shot('grace-paystub');
    await S(() => go('deal/D2')); await W(400);
    await page.getByRole('tab', { name: 'Pay & commission' }).click(); await W(200);
    const dealNet = money(await page.locator('.ln.tot', { hasText: 'takes home' }).locator('span').last().textContent());
    ok(dealNet === stubNet, `Deal "Pay & commission" = paystub (${dealNet} vs ${stubNet})`);
    await shot('grace-deal-money');

    // ============ 6. Elena closes → homeowner ============
    step = 'elena-close'; await seat('Elena Ruiz');
    await notif(/accepted|under contract/i);
    await page.locator('.pt-tabs button', { hasText: 'My purchase' }).click(); await W(300);
    ok(await page.locator('.empty', { hasText: 'Once your offer is accepted' }).count() === 0, 'My purchase opens (under contract)');
    const dealPrice = await S(() => pjDeal().price); ok(dealPrice === offer, 'purchase price = accepted offer');
    await page.getByRole('button', { name: 'Money & loan' }).click(); await click('I called and the details match'); await click("I've sent the wire");
    const emd = await S(() => [TxApi.emd('D2'), Math.round(pjPrice() * pj().offer.emd / 100)]);
    ok(emd[0] && emd[0].status === 'Received' && emd[0].amount === emd[1], 'earnest money wire shows Received in the back office (' + JSON.stringify(emd) + ')');
    await page.getByRole('button', { name: 'Closing day' }).click(); await click('Demo: skip to closing week');
    await page.locator('.pt-tabs button', { hasText: 'My purchase' }).click(); await page.getByRole('button', { name: 'Closing day' }).click(); await W(300);
    await click("I've reviewed it"); await page.getByText('Final walkthrough done').click(); await page.getByText(/Sign closing documents/).click(); await W(500);
    await shot('elena-closing');
    await page.locator('.pt-tabs button', { hasText: 'My home' }).click(); await W(400);
    ok(await page.locator('.empty').count() === 0 || !(await page.locator('.empty').first().isVisible()), 'My home is populated');
    const cl = await S(() => ({ d2: S.d.deals.find(d => d.id === 'D2').stage, d5: pjDeal().stage, roles: P('P4').roles, l1: L('L1').status }));
    ok(cl.d2 === 'Closed' && cl.d5 === 'Closed', 'deals closed after closing (' + cl.d2 + '/' + cl.d5 + ')');
    ok(cl.roles.includes('Homeowner'), 'Elena is now a Homeowner on her record');
    ok(cl.l1 === 'Sold', '4 Willow Bend shows Sold (' + cl.l1 + ')');
    await shot('elena-myhome');
    // click every My home action that isn't destructive: they must do something
    await hs('my home');

    // ============ 7. Rentals: visitor applies → Leo approves ============
    step = 'rent-apply'; await seat('Website visitor');
    await S(() => go('site/rent')); await W(500);
    const unitTxt = await page.locator('.sx-lc').first().innerText();
    await page.locator('.sx-lc').first().click(); await W(400);
    await click('Apply now'); await W(300);
    await page.getByLabel('Full name').fill('Riley Chen'); await page.getByLabel('Email').fill('riley.chen@example.com'); await page.getByLabel('Mobile').fill('5125550155'); await click('Continue');
    await page.getByLabel('Employer').fill('Dell'); await page.getByLabel('Gross monthly income ($)').fill('6800'); await page.getByLabel('Current address').fill('22 Oak Ln, Austin TX'); await click('Continue');
    await page.locator('.sx-flow .sx-ck input').nth(0).check(); await page.locator('.sx-flow .sx-ck input').nth(1).check(); await page.locator('.sx-sigin').fill('Riley Chen'); await click('Continue');
    await page.getByLabel('Card number').fill('4242424242424242'); await page.getByLabel('Expiry').fill('12/29'); await page.getByLabel('Billing ZIP').fill('78702');
    await click(/^Pay \$/); await W(900);
    const app = await S(() => S.d.applications[S.d.applications.length - 1]);
    ok(app && app.status === 'Submitted', 'application submitted ' + (app && app.id));
    await shot('rent-applied');
    if (await page.locator('.sx-me').count()) { await page.locator('.sx-me').click(); await page.getByRole('menuitem', { name: 'Sign out' }).click(); await W(250); }

    step = 'leo-approve'; await seat('Leo Grant');
    await notif(new RegExp('New rental application ' + app.id), true);
    await S(() => go('rentals/applications')); await W(400);
    const ar = page.locator('tr', { hasText: app.id });
    await ar.getByRole('button', { name: 'Start review' }).click(); await W();
    await ar.getByRole('button', { name: 'Approve' }).click(); await W();
    await ar.getByRole('button', { name: 'Send lease' }).click(); await W();
    const ap2 = await S(id => { const a = S.d.applications.find(x => x.id === id); const u = S.d.units.find(x => x.id === a.unit); return { st: a.status, lease: a.leaseSent, u }; }, app.id);
    ok(ap2.st === 'Approved' && ap2.lease, 'application approved + lease sent');
    await shot('leo-apps');

    // ============ 8. Hannah pays rent (rent roll updates) and requests a repair ============
    step = 'hannah'; const before = await S(() => { const all = S.d.units; return { got: all.filter(x => x.status === 'Paid' || x.status === 'Renewal').reduce((a, x) => a + x.rent, 0), u8: S.d.units.find(u => u.id === 'U8').status }; });
    await seat('Hannah Cole');
    await S(() => go('tenant/pay')); await W(400);
    await page.locator('.chip', { hasText: 'Full balance' }).click(); await W();
    await page.getByRole('button', { name: /^Pay \$/ }).click(); await W(); await click(/Confirm & pay/); await W(900);
    ok(await S(() => S.d.units.find(u => u.id === 'U8').status === 'Paid'), 'U8 paid (was ' + before.u8 + ')');
    await S(() => go('tenant/fix')); await W(400);
    await page.locator('.rz-tile', { hasText: 'Something else' }).click(); await W();
    await page.getByPlaceholder(/started last night/).fill('Bathroom fan rattles loudly whenever it runs');
    await click('Continue'); await click('Send request'); await W(400);
    const tk = await S(() => S.d.tickets[S.d.tickets.length - 1]); ok(/fan/.test(tk.title) && tk.status === 'New', 'repair ticket ' + tk.id);
    await shot('hannah-fix');

    step = 'leo-assign'; await seat('Leo Grant');
    await notif(/paid/);
    await notif(/request from Hannah Cole/);
    await S(() => go('rentals')); await W(400);
    const collected = money(await page.locator('.kpi', { hasText: 'Collected' }).locator('b').textContent());
    const after = await S(() => S.d.units.filter(x => x.status === 'Paid' || x.status === 'Renewal').reduce((a, x) => a + x.rent, 0));
    ok(collected === after, `rent roll "Collected" = store (${collected} vs ${after}, before ${before.got})`);
    await S(() => go('pmops/tech')); await W(400);
    await page.locator('.feed .it', { hasText: 'Bathroom fan' }).getByRole('button', { name: 'Assign to Ray' }).click(); await W();
    await shot('leo-assign');

    step = 'ray'; await seat('Ray Alvarez');
    await notif(/Bathroom fan/);
    await page.locator('.rz-ray-it', { hasText: 'Bathroom fan' }).click(); await W();
    await click('On my way'); await click("I'm here");
    const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64');
    await page.locator('.rz-ray-add input').setInputFiles({ name: 'after.png', mimeType: 'image/png', buffer: png }); await W();
    await click('Complete job'); await W(300);
    ok(await page.locator('.rz-ray-ok').isVisible(), 'Ray job done');
    ok(await S(id => S.d.tickets.find(t => t.id === id).status === 'Done', tk.id), 'ticket Done');
    await shot('ray-done');

    step = 'brooks'; await seat('Brooks Holdings');
    await notif(/Approval needed/);
    await S(() => go('owner/approvals')); await W(400);
    await click('Approve', true); await click(/^Approve \$/);
    ok(await S(() => S.d.tickets.find(t => t.id === 'M4').status === 'Scheduled'), 'over-limit repair approved → scheduled');
    await shot('brooks-approved');
    step = 'leo-after'; await seat('Leo Grant');
    await notif(/Brooks Holdings approved/); await notif(/Ray completed/);

    // ============ 9. New homes: visitor holds a Linden unit → Rohan books it ============
    step = 'hold'; await seat('Website visitor');
    await S(() => go('site/new-homes')); await W(500);
    const code = (await page.locator('.sx-u.u-ok').first().locator('b').textContent()).trim();
    await page.locator('.sx-u.u-ok').first().click(); await W(200);
    await click(/Reserve with a \$2,500 hold/);
    await page.getByLabel('Full name').fill('Sam Ortega'); await page.getByLabel('Email').fill('sam.ortega@example.com'); await page.getByLabel('Mobile').fill('5125550133'); await click('Continue');
    await page.locator('.sx-modal .sx-ck input').first().check(); await click('Continue');
    await page.getByLabel('Card number').fill('4242424242424242'); await page.getByLabel('Expiry').fill('12/29'); await page.getByLabel('Billing ZIP').fill('78723');
    await click('Pay $2,500 hold'); await W(900);
    ok(await S(c => S.d.projUnits.find(u => u.code === c).status === 'Held', code), 'unit ' + code + ' held');
    await shot('visitor-hold'); await click('Done', true);

    step = 'rohan'; await seat('Rohan');
    await notif(new RegExp('Website hold on ' + code), true);
    await S(c => go('projects/' + c), code); await W(500);
    await page.locator('.of-panel').getByRole('button', { name: 'Collect token & book' }).click(); await W();
    ok(await page.locator('.of-modal input').first().inputValue().catch(() => '') !== '' || await page.locator('.of-modal', { hasText: 'Sam Ortega' }).count() === 1, 'booking modal is for the hold buyer');
    await page.screenshot({ path: OUT + w + '-book-modal.png' });
    const kyc = page.locator('.of-modal input[type=checkbox]'); for (let i = 0; i < await kyc.count(); i++) await kyc.nth(i).check();
    await page.locator('.of-modal').getByRole('button', { name: /& book/ }).click(); await W(400);
    const bk = await S(c => { const u = S.d.projUnits.find(x => x.code === c); return { st: u.status, buyer: u.buyer && P(u.buyer) && P(u.buyer).name }; }, code);
    ok(bk.st === 'Booked', 'Rohan booked ' + code + ' for ' + bk.buyer);
    ok(bk.buyer === 'Sam Ortega', 'booking is for the website hold buyer');
    await shot('rohan-booked');
    step = 'grace-linden'; await seat('Grace Liu'); await notif(new RegExp('Booking on The Linden ' + code));
    ok(loads === 1, 'one continuous session (no reloads: ' + loads + ')');
  } catch (e) { fails.push(`${w} THREW at ${step}: ${e.message.split('\n')[0]}`); console.log('THREW at ' + step + ': ' + e.message.split('\n')[0]); await shot('99-fail', true); }
  await ctx.close();
}

// 400px: the key screens of the same story, checked for clipping/overflow and the client dock over modals
async function narrow() {
  const w = 400, ctx = await b.newContext({ viewport: { width: w, height: 860 } }), page = await ctx.newPage();
  let step = 'n400';
  page.on('pageerror', e => errs.push(`400 [${step}] pageerror ${e.message}`));
  page.on('console', m => { if (m.type() === 'error' && !/404|favicon|Failed to load resource/.test(m.text())) errs.push(`400 [${step}] ${m.text()}`); });
  const W = (ms = 300) => page.waitForTimeout(ms), S = (fn, a) => page.evaluate(fn, a);
  const ok = (c, m) => { (c ? passed : fails).push(`400 [${step}] ${m}`); if (!c) console.log('  ✗ 400 ' + m); };
  const hs = async (tag) => { const o = await S(() => Math.max(document.documentElement.scrollWidth - innerWidth, ...[...document.querySelectorAll('.main')].map(m => m.scrollWidth - m.clientWidth))); ok(o <= 1, `no horizontal scroll on ${tag} (${o})`); };
  const seat = async (name) => { await S(() => go('start')); await W(); await page.locator('.rs-card', { hasText: name }).first().click(); await W(600); };
  const shot = (n) => page.screenshot({ path: `${OUT}400-${n}.png`, fullPage: true });
  const dockOverModal = async (tag) => { const r = await S(() => { const d = document.querySelector('.eos-dock'); return !!(d && d.offsetParent && document.querySelector('.scrim')); }); ok(!r, 'client dock hidden while a modal is open: ' + tag); };
  const toolsTidy = async (tag) => { const r = await S(() => { const e = document.querySelector('.eos-embed'); if (!e || !e.offsetParent) return { ok: true }; const b = e.getBoundingClientRect(); return { ok: b.right <= innerWidth + 0.5 && b.left >= -0.5 && b.height < 60, r: [b.left, b.right, b.height] }; }); ok(r.ok, 'portal top-bar tools fit at 400: ' + tag + ' ' + JSON.stringify(r.r || '')); };
  try {
    await page.goto(U + '#/start'); await W(1200); await shot('start'); await hs('picker');
    step = 'visitor'; await seat('Website visitor'); await hs('site'); await shot('site'); await toolsTidy('site');
    await S(() => go('site/home/L1')); await W(); await hs('listing'); await page.getByRole('button', { name: 'Request a tour' }).first().click(); await W(); await dockOverModal('tour'); await shot('tour-modal'); await page.keyboard.press('Escape'); await W();
    step = 'elena'; await seat('Elena Ruiz'); for (const t of ['', 'budget', 'saved', 'offer', 'deal', 'myhome']) { await S(t => go('portal' + (t ? '/' + t : '')), t); await W(); await hs('portal/' + t); } await shot('portal'); await toolsTidy('portal');
    step = 'grants'; await seat('Rachel & Tom Grant'); await S(() => go('seller/offers')); await W(); await hs('seller offers'); await toolsTidy('seller'); await shot('seller-offers');
    await page.locator('.sl-of').first().getByRole('button', { name: 'Accept' }).click(); await W(); await dockOverModal('accept'); await shot('seller-accept-modal');
    const ft = await S(() => { const f = document.querySelector('.scrim .modal .ft'); if (!f) return null; const r = f.getBoundingClientRect(); return r.bottom <= innerHeight + 1; }); ok(ft !== false, 'modal footer visible at 400');
    await page.keyboard.press('Escape'); await W();
    step = 'hannah'; await seat('Hannah Cole'); for (const t of ['', 'pay', 'fix', 'lease']) { await S(t => go('tenant' + (t ? '/' + t : '')), t); await W(); await hs('tenant/' + t); } await toolsTidy('tenant'); await shot('tenant');
    step = 'brooks'; await seat('Brooks Holdings'); await S(() => go('owner/approvals')); await W(); await hs('owner'); await toolsTidy('owner'); await shot('owner');
    step = 'staff'; for (const [who, routes] of [['Jordan Lee', ['today', 'inbox', 'pipeline']], ['Priya Shah', ['listingops', 'deal/D2']], ['Nina Patel', ['compliance', 'compliance/D2']], ['Grace Liu', ['commissions', 'commissions/disb', 'commissions/pay']], ['Leo Grant', ['today', 'rentals', 'pmops/tech']], ['Ray Alvarez', ['pmops/tech']], ['Rohan', ['projects', 'projects/holds']]]) {
      await seat(who); for (const r of routes) { await S(r => go(r), r); await W(400); await hs(who + ' ' + r); await shot(who.split(' ')[0] + '-' + r.replace(/\//g, '_')); }
    }
  } catch (e) { fails.push(`400 THREW at ${step}: ${e.message.split('\n')[0]}`); await shot('99-fail'); }
  await ctx.close();
}

const only = process.argv[2];
if (!only || only === '1440') await journey(1440);
if (!only || only === '400') { await journey(400); await narrow(); }
await b.close();
console.log(`${passed.length} checks passed`);
console.log(fails.length ? 'FAILS\n' + fails.join('\n') : 'ALL OK');
console.log('ERRS', JSON.stringify(errs));
