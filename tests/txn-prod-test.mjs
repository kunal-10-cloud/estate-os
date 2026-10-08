// Production pass for txn.js: walks Compliance, Commissions, Trust & EMD and Lead routing as Nina (TC), Grace (accounting) and Maya (broker),
// signing in through the persona picker. One page = one shared store, so a deal going under contract elsewhere must flow through every queue.
import { chromium } from 'playwright-core';
import fs from 'fs';
const out = new URL('./shots-txn-prod/', import.meta.url).pathname, U = (process.env.EOS_URL || 'http://localhost:3000/index.html');
fs.mkdirSync(out, { recursive: true });
const b = await chromium.launch({ channel: 'chrome', headless: true });
const errs = [];
async function mk(w, h) {
  const p = await (await b.newContext({ viewport: { width: w, height: h } })).newPage();
  p.on('pageerror', e => errs.push(w + ' ' + p.url().split('#')[1] + ' ' + e.message));
  p.on('console', m => { if (m.type() === 'error' && !/404/.test(m.text())) errs.push(w + ' ' + m.text()); });
  return p;
}
const assert = (c, m) => { if (!c) throw new Error('ASSERT ' + m); };
let step = '', page;
const shot = (n, p = page) => p.screenshot({ path: `${out}/${n}.png`, fullPage: true });
const S = (fn, a) => page.evaluate(fn, a);
const btn = (name, exact, p = page) => p.getByRole('button', { name, exact: !!exact }).first();
const click = async (name, exact, p = page) => { await btn(name, exact, p).click(); await p.waitForTimeout(220); };
const hash = () => page.evaluate(() => location.hash);
async function signIn(name, p = page) {
  await p.goto(U + '#/start'); await p.waitForTimeout(500);
  await p.locator('.rs-card', { hasText: name }).first().click(); await p.waitForTimeout(600);
}
// spy on cross-persona notifications (wraps the shell's notify if present)
const spy = (p = page) => p.evaluate(() => { if (window.__spy) return; window.__spy = 1; window.__notes = []; const o = window.notify; window.notify = (x) => { window.__notes.push(x); try { o && o(x); } catch (e) {} }; });
const notes = () => S(() => window.__notes.slice());
async function noHScroll(p, label) {
  const sw = await p.evaluate(() => { const x = document.querySelector('.main'); return [document.documentElement.scrollWidth, innerWidth, x ? x.scrollWidth : 0, x ? x.clientWidth : 0]; });
  if (sw[0] > sw[1] + 1 || sw[2] > sw[3] + 1) errs.push('hscroll ' + label + ' ' + sw);
}

try {
  page = await mk(1440, 1000);
  await page.goto(U); await page.waitForTimeout(1200); await spy();

  // ================= NINA (TC) =================
  step = 'nina-land'; await signIn('Nina Patel');
  assert(await hash() === '#/compliance', 'Nina lands on compliance, got ' + await hash());
  assert(/Good morning, Nina/.test(await page.locator('.top .sub').textContent()), 'Nina greeting');
  await shot('n01-landing');

  step = 'derive'; // the sellers accept an offer in their portal: exactly what seller.js does to the deal
  await S(() => up(s => { const d = s.d.deals.find(x => x.id === 'D2'); d.stage = 'Under contract'; d.price = 1142000; d.close = 'Nov 14'; }));
  await page.waitForTimeout(250);
  assert(await page.locator('.tx-qi', { hasText: '4 Willow Bend' }).first().locator('.tx-new').count() === 1, 'D2 shows as New contract in queue');
  assert(await S(() => S.d.tx.rev.D2.docs.some(d => /Residential Contract/.test(d.n))), 'D2 review picked up the contract');
  assert(await S(() => S.d.tx.emd.some(e => e.deal === 'D2' && e.status === 'Expected' && e.holder === 'title')), 'D2 EMD derived');
  assert(await S(() => S.d.tx.disb.some(r => r.deal === 'D2' && r.status === 'Incomplete')), 'D2 in disbursement pipeline');
  const api0 = await S(() => [TxApi.commission('D2'), TxApi.emd('D2'), TxApi.commission('D5'), TxApi.commission('nope')]);
  assert(api0[0] && api0[0].status === 'Incomplete' && api0[0].gross > 0 && Math.abs(api0[0].gross - api0[0].brokerage - api0[0].fees.reduce((a, f) => a + f[1], 0) - api0[0].net) < 0.02, 'TxApi.commission adds up');
  assert(api0[1] && api0[1].amount > 0 && api0[1].status === 'Expected', 'TxApi.emd');
  assert(api0[2] && api0[2].status === 'Estimate' && api0[3] === null, 'TxApi estimate / null');

  step = 'nina-review'; await page.locator('.tx-qi', { hasText: '4 Willow Bend' }).first().click(); await page.waitForTimeout(300);
  assert(await hash() === '#/compliance/D2', 'opened D2');
  const cdoc = page.locator('.tx-doc', { hasText: 'Residential Contract' }).first();
  if (!(await cdoc.evaluate(n => n.classList.contains('on')))) { await cdoc.locator('.tx-dh').click(); await page.waitForTimeout(150); }
  await page.locator('.tx-doc.on').getByRole('button', { name: 'Reject with note' }).click();
  await page.locator('.tx-doc.on textarea').fill(''); await click(/^Send back to Priya/);
  assert(await page.locator('.tx-doc.on .tx-err').count() === 1, 'inline error on empty note'); await shot('n02-reject-error');
  await page.locator('.tx-doc.on textarea').fill('Initial the option-fee paragraph on page 3, please.'); await click(/^Send back to Priya/);
  assert(await S(() => S.d.tx.rev.D2.status === 'Changes requested'), 'D2 changes requested');
  assert((await notes()).some(n => n.who === 'priya' && /sent back/.test(n.text) && n.route === 'deal/D2'), 'Priya notified of rejection');
  for (let i = 0; i < 3; i++) {
    const head = page.locator('.tx-doc').filter({ has: page.locator('.pill', { hasText: /Needs review|Rejected/ }) }).first();
    if (!(await head.count())) break;
    if (!(await head.evaluate(n => n.classList.contains('on')))) { await head.locator('.tx-dh').click(); await page.waitForTimeout(120); }
    await page.locator('.tx-doc.on').getByRole('button', { name: 'Approve', exact: true }).click(); await page.waitForTimeout(150);
  }
  assert(await S(() => S.d.tx.rev.D2.docs.every(d => d.st === 'Accepted')), 'all D2 docs accepted');
  await click('Mark file compliant');
  assert(await page.locator('.tx-done', { hasText: 'File compliant' }).count() === 1, 'success panel'); await shot('n03-compliant');
  assert((await notes()).some(n => n.who === 'priya' && /compliant/.test(n.text)), 'Priya told file compliant');
  assert((await notes()).some(n => n.who === 'maya' && /compliant/.test(n.text)), 'Maya told Nina signed off');
  await click('Build CDA →');
  assert(await hash() === '#/commissions/cda', 'to CDA');

  step = 'nina-cda'; assert(await page.locator('.tx-cda select').inputValue() === 'D2', 'CDA preselects D2');
  const sellerIn = page.locator('.tx-cda input[type=number]').first();
  await sellerIn.fill('-1'); await page.waitForTimeout(120);
  assert(/negative/.test(await page.locator('.tx-cda .tx-err').first().textContent()), 'negative error');
  assert(await btn('Send to title for signature').isDisabled(), 'send blocked by invalid');
  await sellerIn.fill('12'); await page.waitForTimeout(120); assert(/10%/.test(await page.locator('.tx-cda .tx-err').first().textContent()), '>10 error');
  await sellerIn.fill(''); await page.waitForTimeout(120); assert(/percentage/.test(await page.locator('.tx-cda .tx-err').first().textContent()), 'empty error');
  await shot('n04-cda-invalid');
  await sellerIn.fill('2.75'); await page.waitForTimeout(120);
  assert(await page.locator('.tx-block', { hasText: "Can't send this CDA" }).count() === 1, 'over-agreement blocker for listing side');
  await click(/^Cap at 2.5%/);
  const titleIn = page.locator('.tx-cda label.field', { hasText: 'Title / escrow' }).locator('input');
  const t0 = await titleIn.inputValue(); await titleIn.fill(''); await page.waitForTimeout(100);
  assert(await page.locator('.tx-cda .tx-err', { hasText: 'title or escrow' }).count() === 1, 'title required'); await titleIn.fill(t0); await page.waitForTimeout(100);
  await click('Send to title for signature'); await page.waitForTimeout(1800);
  assert(await S(() => S.d.tx.cda.D2.status === 'Signed'), 'D2 CDA signed');
  assert((await notes()).some(n => n.who === 'grace' && /CDA signed/.test(n.text)), 'Grace notified of CDA');
  assert(await page.locator('.tx-done', { hasText: 'Signed by' }).count() === 1, 'CDA success banner'); await shot('n05-cda-signed');

  step = 'nina-disb'; await page.goto(U + '#/commissions/disb'); await page.waitForTimeout(300);
  assert(await page.locator('.tx-bar', { hasText: 'Only Maya' }).count() === 1, 'Nina sees why she cannot approve');
  assert(await btn(/^Approve/).isDisabled(), 'Nina approve disabled');
  assert(await S(() => S.d.tx.disb.find(r => r.deal === 'D2').status === 'Ready'), 'D2 Ready'); await shot('n06-disb-as-nina');

  step = 'nina-emd'; await page.goto(U + '#/trust/emd'); await page.waitForTimeout(300);
  await page.locator('tr', { hasText: '4 Willow Bend' }).getByRole('button', { name: 'Confirm with title' }).click(); await page.waitForTimeout(1500);
  assert(await S(() => S.d.tx.emd.find(e => e.deal === 'D2').status === 'Received'), 'D2 EMD confirmed');
  assert(await S(() => S.d.tx.rev.D2.docs.flatMap(d => d.f).filter(f => f.emd).every(f => f.done)), 'EMD finding auto-cleared');
  await page.getByRole('tab', { name: /^All/ }).first().click(); await page.waitForTimeout(150); await shot('n07-emd');

  // ================= GRACE (accounting) =================
  step = 'grace-land'; await signIn('Grace Liu');
  assert(await hash() === '#/commissions', 'Grace lands on commissions, got ' + await hash());
  assert(/Good morning, Grace/.test(await page.locator('.top .sub').textContent()), 'Grace greeting');
  assert(await page.locator('.tx-segs button.on', { hasText: 'Needs action' }).count() === 1, 'Grace defaults to Needs action');
  await shot('g01-landing');
  const row = page.locator('.tx-dt tbody tr', { hasText: '4 Willow Bend' });
  await row.locator('input[type=checkbox]').check(); await click(/^Approve/);
  assert(await S(() => S.d.tx.disb.find(r => r.deal === 'D2').status === 'Approved'), 'approved');
  await row.locator('input[type=checkbox]').check(); await click(/^Confirm funds in/);
  await row.locator('input[type=checkbox]').check(); await click(/^Pay agents/);
  assert(await page.locator('.tx-confirm').count() === 1, 'confirm bar'); await shot('g02-confirm-pay');
  await click('Cancel', true); assert(await S(() => S.d.tx.disb.find(r => r.deal === 'D2').status === 'Paid'), 'cancel keeps it');
  await row.locator('input[type=checkbox]').check(); await click(/^Pay agents/); await click('Confirm payout', true);
  assert(await S(() => S.d.tx.disb.find(r => r.deal === 'D2').status === 'Processed'), 'D2 processed');
  assert(await page.locator('.tx-done', { hasText: 'Paid 1 payout' }).count() === 1, 'pay success panel'); await shot('g03-paid');
  assert((await notes()).some(n => n.who === 'priya' && /was paid/.test(n.text)), 'Priya notified of payout');
  const api1 = await S(() => TxApi.commission('D2'));
  assert(api1.status === 'Processed', 'API sees processed');
  await click('Recall payout'); assert(await S(() => S.d.tx.disb.find(r => r.deal === 'D2').status === 'Paid' && !S.d.tx.stubs.some(s => s.deal === 'D2')), 'recall undoes payout + stub');
  await page.getByRole('tab', { name: /^All/ }).first().click(); await page.waitForTimeout(150); await page.locator('.tx-dt tbody tr', { hasText: '4 Willow Bend' }).locator('input[type=checkbox]').check(); await click(/^Pay agents/); await click('Confirm payout', true);
  const shownPaid = await page.locator('.tx-dt tbody tr', { hasText: '4 Willow Bend' }).locator('td.num').nth(2).textContent();
  const api2 = await S(() => TxApi.commission('D2'));
  assert(shownPaid.replace(/[$,]/g, '') == Math.round(api2.net + (api2.team ? api2.team.amt : 0)), 'API net == table paid out (' + shownPaid + ' vs ' + api2.net + ')');
  // Nudge Nina for a file Grace can't open
  const inc = page.locator('.tx-dt tbody tr', { hasText: '77 Rainey' });
  if (await inc.count()) { await inc.getByRole('button', { name: 'Nudge Nina' }).click(); await page.waitForTimeout(150); assert((await notes()).some(n => n.who === 'nina'), 'Nina nudged'); }
  else { const d1 = page.locator('.tx-dt tbody tr', { hasText: '515 Ridgeview' }); if (await d1.getByRole('button', { name: 'Nudge Nina' }).count()) { await d1.getByRole('button', { name: 'Nudge Nina' }).click(); assert((await notes()).some(n => n.who === 'nina'), 'Nina nudged'); } }
  await click('Audit trail', true); await page.waitForTimeout(200);
  assert(await page.locator('.tx-au', { hasText: '4 Willow Bend' }).count() >= 4, 'audit entries for D2 money actions'); await shot('g04-audit');
  await page.goto(U + '#/commissions/pay'); await page.waitForTimeout(300); await page.locator('.tx-agt', { hasText: 'Priya Shah' }).click(); await page.waitForTimeout(150);
  assert(await page.locator('.tx-stub', { hasText: '4 Willow Bend' }).count() === 1, 'paystub for Priya'); await shot('g05-paystub');
  await page.goto(U + '#/commissions/plans'); await page.waitForTimeout(250);
  const carry = page.locator('.tx-plan', { hasText: 'Sam Carter' }).locator('.tx-carry input');
  await carry.fill('-5'); await page.waitForTimeout(100); assert(await page.locator('.tx-plan', { hasText: 'Sam Carter' }).locator('.tx-err').count() === 1, 'carry-in validation');
  await carry.fill('0'); await carry.press('Enter');

  step = 'grace-recon'; await page.goto(U + '#/trust/recon'); await page.waitForTimeout(300);
  await click('Add reconciling item'); await click('Add item', true);
  assert(await page.locator('.tx-radd .tx-err').count() === 2, 'recon item errors'); await shot('g06-recon-errors');
  await page.locator('.tx-radd input').first().fill('Outstanding check #1190 · vendor refund'); await page.locator('.tx-radd input[type=number]').fill('-120'); await click('Add item', true);
  assert(await S(() => S.d.tx.recon.items.some(i => i.custom)), 'custom item added');
  await page.getByRole('button', { name: /^Remove Outstanding check #1190/ }).click(); await page.waitForTimeout(150);
  assert(await S(() => !S.d.tx.recon.items.some(i => i.custom)), 'custom item removed');
  for (const n of ['Match to statement', 'Match to statement', 'Reimburse $25', 'Reverse duplicate']) { await page.locator('.tx-ri:not(.done)').getByRole('button', { name: n }).first().click(); await page.waitForTimeout(120); }
  await click('Sign as preparer');
  assert(await S(() => S.d.tx.recon.prepBy === 'Grace Liu'), 'Grace prepared');
  assert(await btn('Broker sign-off').isDisabled(), 'Grace cannot broker-sign');
  assert((await notes()).some(n => n.who === 'maya' && /reconciliation/.test(n.text)), 'Maya notified to sign'); await shot('g07-recon-prepared');

  step = 'grace-routing'; await page.goto(U + '#/routing'); await page.waitForTimeout(300);
  assert(/Good morning, Grace/.test(await page.locator('.top .sub').textContent()), 'routing greeting');
  const r1 = page.locator('.tx-rule').nth(0); await r1.getByRole('button', { name: 'Edit' }).click(); await page.waitForTimeout(120);
  const v1 = page.locator('.tx-re .tx-cond').first().locator('input'); await v1.fill('abc'); await page.waitForTimeout(100);
  assert(await page.locator('.tx-re .tx-err', { hasText: 'dollar amount' }).count() === 1, 'price cond validation');
  assert(await page.locator('.tx-re').getByRole('button', { name: 'Save rule' }).isDisabled(), 'save disabled');
  assert(await page.locator('.tx-rule').nth(0).locator('.tx-sev', { hasText: 'Needs fixing' }).count() === 1, 'rule flagged'); await shot('g08-rule-error');
  await v1.fill('1500000'); await page.waitForTimeout(100); await page.locator('.tx-re').getByRole('button', { name: 'Save rule' }).click();
  const nm = page.locator('.tx-sim label.field', { hasText: 'Name' }).locator('input'); await nm.fill(''); await click('Simulate a lead', true);
  assert(await page.locator('.tx-sim .tx-err').count() === 1, 'lead name error');
  await nm.fill('Chris Alvarez'); await click('Simulate a lead', true);
  assert(await S(() => S.d.people.some(p => p.name === 'Chris Alvarez' && p.owner === 'sam')), 'routed to Sam');
  assert((await notes()).some(n => n.who === 'sam' && /New lead: Chris Alvarez/.test(n.text) && /^inbox\//.test(n.route)), 'Sam notified of lead'); await shot('g09-routed');
  await page.locator('.tx-rule').nth(2).getByRole('button', { name: 'Edit' }).click(); await click('Delete rule'); await click('Keep', true);
  assert(await S(() => S.d.tx.routing.rules.length === 5), 'kept on cancel');

  // ================= MAYA (broker) =================
  step = 'maya'; await signIn('Maya Ortiz');
  await page.goto(U + '#/trust/recon'); await page.waitForTimeout(300);
  await click('Broker sign-off'); assert(await S(() => !!S.d.tx.recon.signed.broker), 'Maya filed');
  assert(await page.locator('.tx-done', { hasText: 'is filed' }).count() === 1, 'filed success panel'); await shot('m01-recon-filed');
  // buyer accepts a counter in the buyer portal on the same listing: one deposit, not two
  await S(() => up(s => { const d = s.d.deals.find(x => x.id === 'D5'); d.stage = 'Under contract'; d.price = 1142000; }));
  await page.goto(U + '#/trust/emd'); await page.waitForTimeout(300);
  assert(await S(() => S.d.tx.emd.filter(e => { const d = S.d.deals.find(x => x.id === e.deal); return d && d.listing === 'L1'; }).length === 1), 'no duplicate EMD for double-sided L1');
  assert(await S(() => TxApi.emd('D5').amount === TxApi.emd('D2').amount), 'both sides read the same EMD');
  await page.goto(U + '#/compliance'); await page.waitForTimeout(300);
  assert(await page.locator('.tx-qi', { hasText: 'Ruiz' }).count() >= 1, 'D5 in queue');
  await click('New deal from contract'); await page.keyboard.press('Escape'); await page.waitForTimeout(150);
  assert(await S(() => !S.modal), 'Esc closes intake');
  await page.goto(U + '#/commissions/disb'); await page.waitForTimeout(300);
  await page.locator('.tx-dt tbody tr', { hasText: '4 Willow Bend' }).first().click(); await page.waitForTimeout(150); await shot('m02-disb');
  await page.goto(U + '#/deal/D2'); await page.waitForTimeout(300); await shot('m03-deal-D2');
  await page.goto(U + '#/trust/audit'); await page.waitForTimeout(300); await shot('m04-trust-audit');
  for (const r of ['today', 'backoffice', 'pipeline', 'inbox']) { await page.goto(U + '#/' + r); await page.waitForTimeout(200); }
  console.log('notifications captured:', (await notes()).length);

  // ================= 400px =================
  step = 'mobile';
  for (const who of ['Nina Patel', 'Grace Liu', 'Maya Ortiz']) {
    const m = await mk(400, 900); await m.goto(U); await m.waitForTimeout(800); await signIn(who, m);
    const routes = who === 'Nina Patel' ? ['compliance', 'compliance/D1', 'commissions/cda', 'trust/emd'] : who === 'Grace Liu' ? ['commissions', 'commissions/audit', 'trust/recon', 'routing'] : ['commissions/disb', 'commissions/plans', 'commissions/pay', 'trust', 'trust/export', 'trust/1099', 'trust/audit'];
    for (const r of routes) { await m.goto(U + '#/' + r); await m.waitForTimeout(350); await noHScroll(m, who + ' ' + r); await shot('w-' + who.split(' ')[0] + '-' + r.replace('/', '-'), m); }
    if (who === 'Grace Liu') {
      await m.goto(U + '#/commissions/disb'); await m.waitForTimeout(300); await m.locator('.tx-segs button', { hasText: 'All' }).click();
      const cb = m.locator('.tx-dt tbody tr', { hasText: '1207 Shoal' }).locator('input[type=checkbox]'); await cb.check(); await m.getByRole('button', { name: /^Approve/ }).click(); await m.waitForTimeout(150);
      await cb.check(); await m.getByRole('button', { name: /^Confirm funds/ }).click(); await m.waitForTimeout(150); await cb.check(); await m.getByRole('button', { name: /^Pay agents/ }).click(); await m.waitForTimeout(150);
      await shot('w-Grace-confirm', m); await noHScroll(m, 'grace confirm'); await m.getByRole('button', { name: 'Confirm payout' }).click(); await m.waitForTimeout(200); await shot('w-Grace-paid', m); await noHScroll(m, 'grace paid');
    }
    if (who === 'Nina Patel') { await m.goto(U + '#/compliance/D3'); await m.waitForTimeout(300); await m.locator('.tx-doc.on').getByRole('button', { name: 'Reject with note' }).click(); await m.locator('.tx-doc.on textarea').fill('x'); await m.getByRole('button', { name: /^Send back to/ }).click(); await m.waitForTimeout(150); await shot('w-Nina-reject-err', m); }
  }
  console.log('OK');
} catch (e) { console.log('FAIL at ' + step + ': ' + e.message.split('\n')[0]); await shot('99-fail'); }
console.log('ERRS', JSON.stringify(errs)); await b.close();
