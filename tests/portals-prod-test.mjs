// Portals production pass: sign in through the persona picker as each client and staff persona, walk every flow,
// assert state + cross-persona notifications, and screenshot at 1440 and 400.
import { chromium } from 'playwright-core';
import fs from 'fs';
const out = new URL('./shots-portals-prod/', import.meta.url).pathname, U = (process.env.EOS_URL || 'http://localhost:3000/index.html');
fs.mkdirSync(out, { recursive: true });
const b = await chromium.launch({ channel: 'chrome', headless: true });
const errs = [], over = [];
const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64');
const file = (name) => ({ name, mimeType: 'image/png', buffer: png });
async function mk(w, h = 900) {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, acceptDownloads: true });
  const p = await ctx.newPage();
  p.on('pageerror', e => errs.push(w + ' pageerror ' + e.message));
  p.on('console', m => { if (m.type() === 'error' && !/404|favicon/.test(m.text())) errs.push(w + ' ' + m.text()); });
  await p.goto(U + '#/start'); await p.waitForTimeout(1200);
  // record notifications: wrap the shell's notify if present, else install a recorder
  await p.evaluate(() => { window.__n = []; const orig = window.notify; window.notify = (it) => { window.__n.push(it); if (orig) try { orig(it); } catch (e) {} }; });
  return p;
}
const assert = (c, m) => { if (!c) throw new Error('ASSERT ' + m); };
let step = '';
async function run(w) {
  const page = await mk(w);
  const W = (t = 250) => page.waitForTimeout(t);
  const shot = (n) => page.screenshot({ path: `${out}/${w}-${n}.png`, fullPage: true });
  const btn = async (name, exact) => { await page.getByRole('button', { name, exact: !!exact }).first().click(); await W(); };
  const S = (fn, a) => page.evaluate(fn, a);
  const nav = async (h) => { await S(h => { location.hash = h; }, h); await W(350); };
  const signIn = async (who) => { await nav('#/start'); await page.locator('.rs-card', { hasText: who }).first().click(); await W(600); };
  const notes = (who) => S(w => (window.__n || []).filter(n => n.who === w).map(n => n.text), who);
  const hscroll = async (label) => { const sw = await S(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth)); if (sw > w + 1) over.push(w + ' ' + label + ' ' + sw); };
  const undo = async () => { await page.locator('.toast button', { hasText: 'Undo' }).click(); await W(); };

  // ---------- Grants (seller client) ----------
  step = w + ' seller sign-in'; await signIn('Rachel & Tom Grant');
  assert((await S(() => location.hash)) === '#/seller/home', 'seller home');
  assert(await page.locator('.sl-viewas').count() === 0, 'no staff banner for client');
  assert(await page.locator('.sl-demo').count() === 0, 'no demo jump for client');
  assert(await page.getByRole('button', { name: /Switch persona/ }).count() > 0, 'switch persona exit');
  await shot('s01-home'); await hscroll('seller home');
  step = w + ' seller pricing';
  await page.locator('.pt-tabs button', { hasText: 'Pricing' }).click(); await W();
  await page.locator('.field', { hasText: 'Mortgage payoff' }).locator('input').fill('2000000'); await W();
  assert(await page.locator('.sl-err', { hasText: 'more than the sale price' }).isVisible(), 'payoff error');
  assert(await page.getByRole('button', { name: 'Save this scenario' }).isDisabled(), 'save disabled');
  await page.locator('.field', { hasText: 'Mortgage payoff' }).locator('input').fill('612000'); await W();
  await btn('Save this scenario');
  await btn('Suggest a different price'); await page.locator('.field', { hasText: 'Your price instead' }).locator('input').fill('1200000'); await W();
  assert(await page.locator('.sl-err', { hasText: 'reduction' }).isVisible(), 'alt price error');
  await page.locator('.field', { hasText: 'Your price instead' }).locator('input').fill('1135000'); await W();
  await shot('s02-pricing');
  await btn('Approve & sign'); assert(await page.locator('.sl-cf').isVisible(), 'inline confirm'); await shot('s03-confirm');
  await btn('Sign amendment');
  assert(await S(() => S.d.sl.prop.status === 'Approved' && S.d.slPrice.some(p => p.l === 'L1' && p.status === 'Pending')), 'price approved');
  assert((await notes('priya')).some(t => /price change/.test(t)), 'priya notified of price change');
  await btn('Withdraw'); await btn('Withdraw'); assert(await S(() => S.d.sl.prop.status === 'Awaiting you'), 'withdrawn');
  await btn('Approve & sign'); await btn('Sign amendment');
  step = w + ' seller disclosure';
  await page.locator('.pt-tabs button', { hasText: 'Prep' }).click(); await W();
  await btn('Something changed? Update it');
  await page.locator('.sl-secs button').nth(1).click(); await W();
  await page.locator('.sl-q').nth(0).getByRole('button', { name: 'Yes' }).click(); await W();
  assert(await page.locator('.sl-err', { hasText: 'explanation' }).first().isVisible(), 'disclosure note required');
  await page.locator('.sig').nth(0).getByRole('button').click(); await page.locator('.sig').nth(1).getByRole('button').click(); await W();
  assert(await page.getByRole('button', { name: /Explain 1/ }).isDisabled(), 'sign blocked with reason');
  await shot('s04-disclosure-error');
  await page.locator('.sl-qn input').first().fill('Roof leak at chimney flashing, repaired by Lone Star Roofing Mar 2024'); await W();
  await btn('Sign & share with buyers'); assert(await S(() => S.d.sl.disc.signed), 'disclosure re-signed');
  await page.locator('.sl-pi.Quote').first().getByRole('button', { name: 'Decline' }).click(); await W(); await undo();
  assert(await S(() => S.d.sl.prep.filter(p => p.status === 'Quote').length === 2), 'prep undo');
  step = w + ' seller showings';
  await page.locator('.pt-tabs button', { hasText: 'Showings' }).click(); await W();
  await page.locator('.sl-sh.Requested').first().getByRole('button', { name: 'Approve' }).click(); await W();
  await undo(); assert(await S(() => S.d.sl.showings.find(x => x.id === 'S2').status === 'Requested'), 'showing undo');
  await shot('s05-showings'); await hscroll('showings');
  step = w + ' seller marketing'; await page.locator('.pt-tabs button', { hasText: 'Marketing' }).click(); await W();
  const [dl] = await Promise.all([page.waitForEvent('download'), btn('Download report')]); assert(dl.suggestedFilename().endsWith('.html'), 'report download');
  step = w + ' seller offers'; await page.locator('.pt-tabs button', { hasText: 'Offers' }).click(); await W();
  const api = await S(() => window.SlApi.offers('L1')); assert(api.length >= 3 && api.every(o => o.net > 0 && typeof o.cont === 'string'), 'SlApi offers ' + api.length);
  await page.locator('.sl-of').nth(1).getByRole('button', { name: 'Decline' }).click(); await W();
  await page.locator('.sl-cf').getByRole('button', { name: 'Decline offer' }).click(); await W();
  assert(await S(() => S.d.sl.offers[1].status === 'Declined'), 'declined'); await undo();
  assert(await S(() => S.d.sl.offers[1].status === 'New'), 'decline undone');
  await page.locator('.sl-of').nth(1).getByRole('button', { name: 'Counter' }).click(); await W();
  await page.locator('.modal .field', { hasText: 'Option period' }).locator('input').fill('40'); await W();
  assert(await page.locator('.modal .sl-err').isVisible(), 'counter validation');
  await page.keyboard.press('Escape'); await W(); assert(await page.locator('.modal').count() === 0, 'Esc closes modal');
  await page.locator('.sl-of').nth(2).getByRole('button', { name: 'Accept' }).click(); await W();
  await page.locator('.modal .sig button').click(); await btn('Accept offer'); await W(400);
  assert(await S(() => S.d.deals.find(d => d.id === 'D2').stage === 'Under contract'), 'accepted');
  assert((await notes('priya')).some(t => /Offer accepted/.test(t)) && (await notes('nina')).some(t => /contract/.test(t)), 'priya + nina notified');
  assert(await page.locator('.toast button', { hasText: 'deal file' }).count() === 0, 'no office action for client');
  await shot('s06-accepted'); await hscroll('offers');
  step = w + ' seller messages'; await page.locator('.pt-tabs button', { hasText: 'Messages' }).click(); await W();
  await page.getByLabel('Message Priya').fill('Thank you!'); await page.getByLabel('Message Priya').press('Enter'); await W(300);
  assert(await S(() => S.d.threads.find(t => t.id === 'T3').msgs.some(m => m.text === 'Thank you!')), 'enter sends');
  await shot('s07-messages');
  for (const t of ['home', 'pricing', 'prep', 'marketing']) { await nav('#/seller/' + t); await hscroll('seller ' + t); }

  // ---------- Priya (listing agent) ----------
  step = w + ' priya'; await signIn('Priya Shah');
  assert((await S(() => location.hash)) === '#/listingops', 'priya home');
  assert(/Priya/.test(await page.locator('.top .sub').innerText()), 'greeting');
  const mineRows = await page.locator('.sl-board tbody tr').count();
  await btn('All listings'); const allRows = await page.locator('.sl-board tbody tr').count();
  assert(mineRows === 3 && allRows === 8, 'mine/all ' + mineRows + '/' + allRows);
  await btn('My listings'); await shot('p01-ops'); await hscroll('listingops');
  await page.locator('.sl-board tr', { hasText: 'Barton Hills' }).click(); await W();
  await btn("View the Grants' portal →");
  assert(/as Priya/.test(await page.locator('.sl-viewas').innerText()), 'view-as banner');
  await shot('p02-viewas');
  await page.locator('.sl-viewas button').click(); await W(); assert((await S(() => location.hash)) === '#/listingops', 'back to ops');

  // ---------- Hannah (tenant client) ----------
  step = w + ' hannah pay'; await signIn('Hannah Cole');
  assert(await page.locator('.sl-viewas').count() === 0, 'no banner for tenant');
  await shot('h01-home'); await hscroll('tenant home');
  await nav('#/tenant/pay');
  await page.locator('.rz-amt input').fill('abc'); await W(); assert(await page.locator('.sl-err', { hasText: 'numbers only' }).isVisible(), 'nan error');
  await page.locator('.rz-amt input').fill('200'); await W(); assert(await page.locator('.sl-err', { hasText: 'start at $500' }).isVisible(), 'min error');
  await page.locator('.chip', { hasText: 'Full balance' }).click(); await W();
  await page.getByRole('button', { name: /^Pay \$/ }).click(); await W();
  assert(await page.locator('.rz-confirm').isVisible(), 'pay confirm'); await shot('h02-confirm');
  await btn('Edit'); await page.getByRole('button', { name: /^Pay \$/ }).click(); await W();
  await btn(/Confirm & pay/); await W(800);
  assert(await S(() => S.d.units.find(u => u.id === 'U8').status === 'Paid'), 'paid');
  assert((await notes('leo')).some(t => /paid/.test(t)), 'leo notified of payment');
  await shot('h03-receipt');
  await btn('Turn on autopay'); await undo(); assert(await S(() => !S.d.rz.autopay.on), 'autopay undo');
  step = w + ' hannah fix'; await nav('#/tenant/fix');
  await page.locator('.rz-tile', { hasText: 'Something else' }).click(); await W();
  await btn('Continue'); assert(await page.locator('.sl-err', { hasText: '10+ characters' }).isVisible(), 'desc required');
  await page.getByPlaceholder(/started last night/).fill('Bathroom fan rattles loudly whenever it runs');
  await page.locator('.rz-add input').setInputFiles([file('fan.png')]); await W(300);
  await btn('Continue'); await btn('Send request'); await W(300);
  const tk = await S(() => S.d.tickets[S.d.tickets.length - 1]); assert(tk.status === 'New' && /fan/.test(tk.title), 'ticket created');
  assert((await notes('leo')).some(t => /request/.test(t)), 'leo notified of request');
  await shot('h04-fix-done'); await hscroll('fix');
  step = w + ' hannah lease'; await nav('#/tenant/lease');
  await page.locator('input[type=date]').fill('2027-01-31'); await page.getByPlaceholder('Street, city, ZIP').fill('88 Lakeline Blvd, Cedar Park'); await btn('Review notice');
  assert(await page.locator('.sl-err', { hasText: 'ZIP' }).isVisible(), 'zip error');
  await page.getByPlaceholder('Street, city, ZIP').fill('88 Lakeline Blvd, Cedar Park, TX 78613'); await btn('Review notice');
  await shot('h05-notice-confirm'); await btn('Send notice to move out');
  assert(await S(() => !!S.d.rz.moveout), 'moveout'); assert((await notes('leo')).some(t => /notice/.test(t)), 'leo notified of notice');
  await btn('Submit my policy'); assert(await page.locator('.sl-err', { hasText: 'policy number' }).isVisible(), 'insurance validation');
  step = w + ' hannah packages'; await nav('#/tenant/packages');
  await page.getByRole('button', { name: 'Picked up', exact: true }).first().click(); await W(); await undo();
  await btn('Tell the front desk'); await btn('Ask the desk to hold it'); assert(await page.locator('.sl-err').isVisible(), 'pkg validation');
  await page.getByPlaceholder('e.g. sofa, 2 boxes').fill('Desk, 1 box'); await btn('Ask the desk to hold it');
  await shot('h06-packages'); await hscroll('packages');
  for (const t of ['home', 'pay', 'lease', 'messages']) { await nav('#/tenant/' + t); await hscroll('tenant ' + t); }

  // ---------- Leo (property manager) ----------
  step = w + ' leo'; await signIn('Leo');
  await nav('#/pmops/tech'); assert(/Leo/.test(await page.locator('.top .sub').innerText()), 'leo greeting');
  await page.locator('.feed .it', { hasText: 'Bathroom fan' }).getByRole('button', { name: 'Assign to Ray' }).click(); await W();
  assert((await notes('ray')).some(t => /Bathroom fan/.test(t)), 'ray notified');
  await shot('l01-pmops'); await hscroll('pmops');
  await btn("View Hannah's portal →"); assert(/as Leo/.test(await page.locator('.sl-viewas').innerText()), 'leo view-as');
  await page.locator('.sl-viewas button').click(); await W(); assert(/pmops/.test(await S(() => location.hash)), 'back to pmops');

  // ---------- Ray (technician phone app) ----------
  step = w + ' ray'; await signIn('Ray Alvarez');
  assert(await page.locator('.rz-ray').count() === 1 && await page.locator('.side').count() === 0, 'ray phone app, no sidebar');
  const fw = await page.locator('.rz-ray-ph').boundingBox(); assert(fw.width <= 421, 'phone frame width ' + fw.width);
  const items = await page.locator('.rz-ray-it').allInnerTexts(); assert(items.some(t => /Bathroom fan/.test(t)) && !items.some(t => /AC not cooling|Dishwasher/.test(t)), 'only Ray jobs ' + items.join('|'));
  await shot('r01-list');
  await page.locator('.rz-ray-it', { hasText: 'Bathroom fan' }).click(); await W(); await shot('r02-job');
  await btn('On my way'); await btn("I'm here");
  assert(await page.getByRole('button', { name: 'Complete job' }).isDisabled(), 'complete needs photo');
  await page.locator('.rz-ray-add input').setInputFiles(file('after.png')); await W();
  await btn('Complete job'); await W(300);
  assert(await page.locator('.rz-ray-ok').isVisible(), 'job done screen'); await shot('r03-done');
  assert((await notes('tenant')).some(t => /fixed/.test(t)) && (await notes('leo')).some(t => /Ray completed/.test(t)), 'hannah + leo notified on completion');
  await btn('Back to today'); await page.locator('.rz-ray-tabs button', { hasText: 'Done' }).click(); await W(); await shot('r04-donetab');
  await hscroll('ray');

  // ---------- Brooks (owner client) ----------
  step = w + ' owner'; await signIn('Brooks Holdings');
  await nav('#/owner/approvals'); await shot('o01-approvals');
  await btn('Approve', true); await btn(/^Approve \$1,840/);
  assert(await S(() => S.d.tickets.find(t => t.id === 'M4').status === 'Scheduled'), 'owner approved repair');
  assert((await notes('leo')).some(t => /Brooks Holdings approved/.test(t)), 'leo notified of approval');
  await btn('Ask a question'); await page.locator('.rz-appr textarea').fill('Is 18 months OK?'); await btn('Send question');
  await btn('Approve', true); await btn('Approve renewal');
  assert(await page.getByText("You're all caught up").isVisible(), 'caught-up empty state');
  await shot('o02-approvals-done'); await hscroll('owner approvals');
  await nav('#/owner/docs'); await page.locator('.rz-rowbtn').first().click(); await W();
  const [d2] = await Promise.all([page.waitForEvent('download'), btn('Download', true)]); assert(d2.suggestedFilename().endsWith('.html'), 'doc download');
  await page.keyboard.press('Escape'); await W();
  for (const t of ['home', 'statement', 'payouts']) { await nav('#/owner/' + t); await hscroll('owner ' + t); }
  await page.getByRole('button', { name: /Switch persona/ }).first().click(); await W(); assert(await page.locator('.rs-hero').count() === 1, 'owner exits to picker');
  await page.context().close();
}
try { for (const w of [1440, 400]) await run(w); console.log('OK'); }
catch (e) { console.log('FAIL at ' + step + ': ' + e.message.split('\n')[0]); }
console.log('OVERFLOW', JSON.stringify(over));
console.log('ERRS', JSON.stringify(errs)); await b.close();
