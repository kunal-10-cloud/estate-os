import { chromium } from 'playwright-core';
import fs from 'fs';
const out = new URL('./shots-office-prod/', import.meta.url).pathname, U = (process.env.EOS_URL || 'http://localhost:3000/index.html');
fs.mkdirSync(out, { recursive: true });
const b = await chromium.launch({ channel: 'chrome', headless: true });
const errs = [], log = [];
let page, W, step = '';
async function mk(w) {
  const ctx = await b.newContext({ viewport: { width: w, height: 900 } });
  const p = await ctx.newPage(); W = w;
  p.on('pageerror', e => errs.push(w + ' [' + step + '] ' + e.message));
  p.on('console', m => { if (m.type() === 'error' && !/404|Failed to load resource/.test(m.text())) errs.push(w + ' [' + step + '] ' + m.text()); });
  return p;
}
const S = (fn, a) => page.evaluate(fn, a);
const wait = (ms = 250) => page.waitForTimeout(ms);
const assert = (c, m) => { if (!c) throw new Error('ASSERT ' + m); log.push('ok ' + W + ' ' + m); };
const shot = (n) => page.screenshot({ path: `${out}/${W}-${n}.png` });
const go = async (r) => { await S(r => go(r), r); await wait(350); };
const btn = (name, exact) => page.getByRole('button', { name, exact: !!exact }).first();
const click = async (name, exact) => { await btn(name, exact).click(); await wait(); };
async function overflow(tag) { const o = await S(() => Math.max(document.documentElement.scrollWidth - innerWidth, ...[...document.querySelectorAll('.main')].map(m => m.scrollWidth - m.clientWidth))); if (o > 1) errs.push(W + ' OVERFLOW ' + o + ' on ' + tag); }
async function signIn(name) {
  await page.goto(U + '#/start'); await wait(600);
  await page.locator('.rs-card', { hasText: name }).first().click(); await wait(700);
  const who = await S(() => me().name); assert(who.startsWith(name), 'signed in as ' + name);
}
async function visit(route, tag) { step = tag; await go(route); await overflow(tag); await shot(tag); }

try {
  // ======================= 1440 · full flows =======================
  page = await mk(1440);
  // ---------- Maya ----------
  await signIn('Maya'); await visit('today', 'maya-today');
  assert(await page.locator('.hello h2', { hasText: 'Maya' }).count() === 1, 'Maya greeting');
  assert(await page.locator('.of-card:has(h3:text-is("Approvals"))').count() === 1, 'Maya sees approvals');
  await page.locator('.of-card:has(h3:text-is("Approvals"))').locator('.of-row').first().click(); await wait();
  assert(/listing\/L8|backoffice|deal\//.test(await S(() => location.hash)), 'approval row opens record');

  // Inbox: consent enforced on Olivia (opted out of SMS)
  await visit('inbox/T6', 'maya-inbox-olivia');
  assert(await S(() => S.d.threads.find(t => t.id === 'T6').unread) === 0, 'opening thread clears unread');
  await page.locator('.of-composer select[aria-label="Send as"]').selectOption('SMS'); await wait();
  assert(await page.locator('.of-block').count() === 1, 'opted-out SMS shows block');
  assert(await page.locator('.of-composer textarea').isDisabled(), 'composer disabled for opted-out channel');
  await shot('maya-inbox-blocked');
  await page.locator('.of-block').getByRole('button', { name: 'Reply by email' }).click(); await wait();
  await click('Draft with AI'); await wait(800);
  assert(await page.locator('.of-aid', { hasText: 'AI draft' }).count() === 1, 'AI draft shown');
  assert((await page.locator('.of-composer textarea').inputValue()).length > 20, 'AI draft editable in composer');
  await shot('maya-inbox-aidraft');
  const n6 = await S(() => S.d.threads.find(t => t.id === 'T6').msgs.length);
  await page.locator('.of-composer textarea').press('End'); await page.locator('.of-composer textarea').type(' Thanks!'); await page.locator('.of-composer textarea').press('Enter'); await wait();
  assert(await S(() => S.d.threads.find(t => t.id === 'T6').msgs.length) === n6 + 1, 'Enter sends edited message');
  assert(await S(() => S.d.threads.find(t => t.id === 'T6').msgs.slice(-1)[0].ch) === 'Email', 'sent by email');
  // template + assign + snooze + filters
  await page.locator('.of-composer select[aria-label="Insert template"]').selectOption('Check-in'); await wait();
  assert((await page.locator('.of-composer textarea').inputValue()).includes('Olivia'), 'template merges first name');
  await page.locator('.of-acts').getByRole('button', { name: /Priya|Assign/ }).first().click(); await wait();
  await page.locator('.of-pop').getByRole('menuitem', { name: /Jordan Lee/ }).click(); await wait();
  assert(await S(() => S.d.threads.find(t => t.id === 'T6').assignee) === 'jordan', 'assign conversation');
  await page.getByRole('button', { name: 'Snooze' }).click(); await wait();
  await page.locator('.of-pop').getByRole('menuitem', { name: 'Tomorrow 8 am' }).click(); await wait();
  assert(await S(() => S.d.threads.find(t => t.id === 'T6').snooze) === 'Tomorrow 8 am', 'snooze');
  await page.getByRole('tab', { name: /Snoozed/ }).click(); await wait();
  assert(await page.locator('.of-list .th', { hasText: 'Olivia' }).count() === 1, 'snoozed tab lists thread');
  await page.getByRole('tab', { name: /^All/ }).click(); await page.locator('.of-list select').selectOption('WhatsApp'); await wait();
  assert(await page.locator('.of-list .th').count() >= 1 && await page.locator('.of-list .th', { hasText: 'Elena' }).count() === 0, 'channel filter');
  await shot('maya-inbox-filter');

  // People: search, smart list, bulk tag, add person with validation + duplicate
  await visit('people', 'maya-people');
  await page.getByRole('tab', { name: /Hot leads/ }).click(); await wait();
  const hot = await page.locator('.of-ptable tbody tr').count(); assert(hot >= 3, 'hot leads list ' + hot);
  await page.getByRole('tab', { name: /Everyone/ }).click(); await page.getByLabel('Search people').fill('webb'); await wait();
  assert(await page.locator('.of-ptable tbody tr').count() === 1, 'search people');
  await page.getByLabel('Search people').fill(''); await wait();
  await page.getByLabel('Select Marcus Webb').check(); await page.getByLabel('Select Kenji Watanabe').check(); await wait();
  await page.getByLabel('Tag to add').fill('Spring 2027'); await page.locator('.of-bulk').getByRole('button', { name: 'Tag' }).click(); await wait();
  assert(await S(() => P('P3').tags.includes('Spring 2027') && P('P5').tags.includes('Spring 2027')), 'bulk tag');
  await page.locator('.of-bulk select').selectOption('priya'); await wait();
  assert(await S(() => P('P3').owner === 'priya'), 'bulk assign');
  await shot('maya-people-bulk');
  await click('Add person'); await page.locator('.of-modal').getByRole('button', { name: 'Save person' }).click(); await wait();
  assert(await page.locator('.of-modal .of-err').count() >= 1, 'person form validates');
  await shot('maya-person-invalid');
  await page.locator('.of-modal input').first().fill('Marcus Webb'); await page.locator('.of-modal input[inputmode=tel]').fill('(512) 555-0117'); await wait();
  assert(await page.locator('.of-dupe').count() === 1, 'duplicate detected');
  await page.locator('.of-modal').getByRole('button', { name: 'Save person' }).click(); await wait();
  assert(await page.locator('.of-modal').getByRole('button', { name: 'Create anyway' }).count() === 1, 'dupe requires confirmation');
  await shot('maya-person-dupe');
  await page.locator('.of-modal input').first().fill('Chris & Dana Morgan'); await page.locator('.of-modal input[inputmode=tel]').fill('(512) 555-0199'); await page.locator('.of-modal input[type=email]').fill('morgans@example.com'); await wait();
  const np = await S(() => S.d.people.length);
  await page.locator('.of-modal').getByRole('button', { name: /Save person|Create anyway/ }).click(); await wait(500);
  assert(await S(() => S.d.people.length) === np + 1, 'person created');
  assert((await S(() => location.hash)).startsWith('#/person/'), 'lands on new person');
  // Person: task, note, tag
  await visit('person/P3', 'maya-person');
  await page.getByRole('tab', { name: /Tasks/ }).click(); await wait();
  await page.getByLabel('New task').fill('Send school ratings'); await page.getByLabel('New task').press('Enter'); await wait();
  assert(await S(() => S.d.of.tasks.some(t => t.t === 'Send school ratings' && t.person === 'P3')), 'task added');
  await page.getByRole('checkbox', { name: 'Complete: Send school ratings' }).click(); await wait();
  assert(await S(() => S.d.of.tasks.find(t => t.t === 'Send school ratings').done), 'task completed');
  await page.getByRole('tab', { name: /Notes/ }).click(); await page.getByLabel('New note').fill('Prefers afternoon tours.'); await click('Save note');
  assert(await S(() => S.d.of.notes.some(n => n.text === 'Prefers afternoon tours.')), 'note saved');
  await page.getByLabel('Add tag').fill('Schools'); await page.getByLabel('Add tag').press('Enter'); await wait();
  assert(await S(() => P('P3').tags.includes('Schools')), 'tag added');
  await page.getByRole('tab', { name: 'Timeline' }).click(); await wait(); await shot('maya-person-timeline');

  // Pipeline: move buttons, drag, new deal
  await visit('pipeline', 'maya-pipeline');
  await page.getByRole('button', { name: 'Move to Offer' }).first().click(); await wait();
  log.push('moved: ' + await S(() => S.d.deals.filter(d => d.stage === 'Offer').map(d => d.id).join(',')));
  const d3 = page.locator('.of-dc', { hasText: '3402 Govalle' });
  await d3.dragTo(page.locator('.of-board .col', { hasText: 'Under contract' }).first()); await wait(500);
  assert(await S(() => S.d.deals.find(d => d.id === 'D3').stage) === 'Under contract', 'drag D3 to Under contract');
  // buyer without agreement is blocked
  await page.locator('.of-dc', { hasText: 'Ruiz' }).getByRole('button', { name: 'Move to Touring' }).click(); await wait();
  assert(await S(() => S.d.deals.find(d => d.id === 'D5').stage) === 'New lead', 'no-agreement buyer cannot move to touring');
  await shot('maya-pipeline-moved');
  await click('New deal'); await page.locator('.of-modal').getByRole('button', { name: 'Create deal' }).click(); await wait();
  assert(await page.locator('.of-modal .of-err').count() >= 2, 'deal form validates');
  await page.locator('.of-modal select').nth(0).selectOption('P3'); await page.locator('.of-modal select').nth(1).selectOption('L3'); await page.getByLabel(/Buyer agreement already signed/).check(); await wait();
  const nd = await S(() => S.d.deals.length);
  await page.locator('.of-modal').getByRole('button', { name: 'Create deal' }).click(); await wait(500);
  assert(await S(() => S.d.deals.length) === nd + 1, 'deal created');
  await shot('maya-deal-new');

  // Deal D1: dates, docs, sign, pay
  await visit('deal/D1', 'maya-deal');
  assert(await page.locator('.of-cd').count() === 1, 'deadline countdown');
  await page.getByLabel('Date name').fill('Survey due'); await page.getByLabel('Date', { exact: true }).fill('2026-10-20'); await click('Add date');
  assert(await S(() => S.d.deals.find(d => d.id === 'D1').dates.some(x => x[0] === 'Survey due' && x[1] === 'Oct 20')), 'date added');
  await click('Draft & send for signature'); await wait();
  for (const s of await page.locator('.of-modal .sig button').all()) { await s.click(); await wait(100); }
  await page.locator('.of-modal').getByRole('button', { name: 'Complete & send' }).click(); await wait();
  assert(await S(() => S.d.deals.find(d => d.id === 'D1').docs.find(x => /Amendment/.test(x[0]))[1]) === 'Signed', 'amendment signed');
  await page.getByRole('tab', { name: 'Documents & e-sign' }).click(); await wait();
  await page.locator('input[type=file]').first().setInputFiles({ name: 'Survey_515_Ridgeview.pdf', mimeType: 'application/pdf', buffer: Buffer.from('%PDF-1.4') }); await wait();
  assert(await S(() => S.d.deals.find(d => d.id === 'D1').docs.some(x => x[0] === 'Survey_515_Ridgeview')), 'doc uploaded');
  await page.locator('tr', { hasText: 'Survey_515_Ridgeview' }).getByRole('button', { name: 'Request e-sign' }).click(); await wait();
  await page.getByRole('button', { name: 'Send to their phones' }).click(); await page.locator('.of-modal').getByRole('button', { name: 'Send for e-sign' }).click(); await wait();
  assert(/Sent/.test(await S(() => S.d.deals.find(d => d.id === 'D1').docs.find(x => x[0] === 'Survey_515_Ridgeview')[1])), 'sent for e-sign');
  await shot('maya-deal-docs');
  await page.getByRole('tab', { name: 'Pay & commission' }).click(); await wait(); await shot('maya-deal-pay');
  const net = await page.locator('.sheet .ln.tot span').last().textContent();
  const exp = await S(() => usd(ofComm(S.d.deals.find(d => d.id === 'D1')).net));
  assert(net.trim() === exp, 'pay tab matches commission source ' + net);

  // Listing: edit validation, save, AI copy, offers, status
  await visit('listing/L1', 'maya-listing');
  await click('Edit'); await page.locator('.of-fgrid input').first().fill('12'); await page.locator('.card', { hasText: 'Details' }).getByRole('button', { name: 'Save' }).click(); await wait();
  assert(await page.locator('.of-fgrid .of-err').count() === 1, 'listing price validation');
  await page.locator('.of-fgrid input').first().fill('1139000'); await page.locator('.card', { hasText: 'Details' }).getByRole('button', { name: 'Save' }).click(); await wait();
  assert(await S(() => L('L1').price) === 1139000, 'listing price saved');
  await click(/Write with AI/); await wait(800);
  await page.getByLabel('Listing description').fill('Family-friendly home with a master suite.'); await wait();
  assert(await page.locator('.of-warn', { hasText: 'Fair-housing' }).count() === 1, 'fair-housing flags');
  await shot('maya-listing-fh');
  await page.locator('.of-flag').first().getByRole('button').click(); await wait(); await page.locator('.of-flag').first().getByRole('button').click(); await wait();
  await click('Publish'); assert(await S(() => L('L1').descLive), 'description published');
  await click(/Compare offers/); await wait();
  assert(await page.locator('.of-otable').count() === 1, 'offers modal');
  await shot('maya-offers');
  await page.locator('.of-modal').getByRole('button', { name: 'Ask for highest & best' }).click(); await wait();
  assert(await S(() => !!S.d.of.hb.L1), 'highest & best recorded');
  await page.keyboard.press('Escape'); await wait();
  assert(await page.locator('.of-modal').count() === 0, 'Esc closes modal');
  await page.getByLabel('Listing status').selectOption('Withdrawn'); await wait();
  await page.locator('.modal').getByRole('button', { name: 'Cancel' }).click(); await wait();
  assert(await S(() => L('L1').status) === 'Active', 'withdraw cancel keeps status');
  await visit('listings', 'maya-listings');
  await page.getByLabel('Status').selectOption('Coming soon'); await wait();
  assert(await page.locator('.of-lcard').count() === 1, 'listing status filter');
  await click('New listing'); await page.locator('.of-modal').getByRole('button', { name: 'Create listing' }).click(); await wait();
  assert(await page.locator('.of-modal .of-err').count() >= 3, 'listing form validates');
  await page.keyboard.press('Escape'); await wait();

  // Back office + bundle
  await visit('backoffice', 'maya-backoffice');
  const ab = page.getByRole('button', { name: 'Approve CDA' });
  if (await ab.count()) { await ab.first().click(); await wait(); assert(await S(() => Object.keys(S.cda || {}).length) >= 1, 'CDA approved'); }
  else log.push('backoffice uses TxApi: ' + await page.locator('table.t tbody tr').count() + ' rows');
  await visit('bundle', 'maya-bundle');
  await page.locator('.mod', { hasText: 'Projects' }).click(); await wait();
  assert(await S(() => !PERSONAS[S.persona].mods.includes('projects')), 'module toggled off');
  await page.locator('.mod', { hasText: 'Projects' }).click(); await wait();

  // ---------- Jordan ----------
  await signIn('Jordan'); await visit('today', 'jordan-today');
  assert(await page.locator('.of-card:has(h3:text-is("Hot leads"))').count() === 1, 'Jordan hot leads');
  assert(await page.locator('.of-card:has(h3:text-is("Tours"))').count() === 1, 'Jordan tours');
  await page.getByRole('button', { name: 'Mark toured' }).first().click(); await wait();
  assert(await S(() => S.d.of.tours.find(t => t.id === 'TR1').status) === 'Done', 'tour marked done');
  await visit('pipeline', 'jordan-pipeline');
  const jd = await S(() => [...document.querySelectorAll('.of-dc .av')].map(a => a.textContent));
  assert(jd.length && jd.every(x => x === 'JL'), 'pipeline defaults to mine');
  await page.getByRole('button', { name: 'All deals' }).click(); await wait();
  assert(await page.locator('.of-dc').count() > jd.length, 'all toggle shows more');
  await visit('inbox', 'jordan-inbox');
  assert(await page.getByRole('tab', { name: /Mine/ }).getAttribute('aria-selected') === 'true', 'Jordan inbox defaults to mine');
  await go('inbox/T1'); await page.locator('.of-ctx').getByRole('button', { name: 'Send buyer agreement' }).click(); await wait();
  await page.locator('.modal .sig button').click(); await page.locator('.modal').getByRole('button', { name: 'Send & confirm' }).click(); await wait();
  assert(await S(() => S.d.deals.find(d => d.id === 'D5').agreement.signed), 'agreement signs D5');
  await visit('person/P3', 'jordan-person');

  // ---------- Priya ----------
  await signIn('Priya'); await visit('today', 'priya-today');
  assert(await page.locator('.of-card:has(h3:text-is("My listings"))').count() === 1, 'Priya listings card');
  assert(await page.locator('.of-card:has(h3:text-is("Showings"))').count() === 1, 'Priya showings card');
  await visit('listings', 'priya-listings');
  assert(await S(() => [...document.querySelectorAll('.of-lcard .av')].every(a => a.textContent === 'PS')), 'Priya listings default mine');
  await visit('listing/L4', 'priya-listing');

  // ---------- Leo ----------
  await signIn('Leo'); await visit('today', 'leo-today');
  assert(await page.locator('.of-card:has(h3:text-is("Work orders"))').count() === 1, 'Leo work orders');
  await page.locator('.of-card:has(h3:text-is("Work orders"))').locator('.of-row', { hasText: 'Kitchen sink' }).click(); await wait(500);
  assert((await S(() => location.hash)) === '#/rentals/M1', 'card links to ticket');
  await shot('leo-ticket');
  await page.locator('.of-panel').getByRole('button', { name: 'Assign vendor' }).click(); await wait();
  assert(await page.locator('.of-vend.on', { hasText: 'Ace Plumbing' }).count() === 1, 'AI-suggested plumbing vendor preselected');
  assert(await page.locator('.of-vend', { hasText: 'Polar Air' }).count() === 0, 'HVAC vendor not offered for a leak');
  await shot('leo-vendor');
  const t5 = await S(() => S.d.threads.find(t => t.id === 'T5').msgs.length);
  await page.locator('.of-modal').getByRole('button', { name: /Dispatch/ }).click(); await wait();
  assert(await S(() => S.d.tickets.find(t => t.id === 'M1').status) === 'Scheduled', 'ticket scheduled');
  assert(await S(() => S.d.threads.find(t => t.id === 'T5').msgs.length) === t5 + 1, 'tenant notified');
  await page.locator('.of-panel').getByRole('button', { name: 'Start work' }).click(); await wait();
  await page.locator('.of-panel').getByRole('button', { name: 'Mark done' }).click(); await wait();
  assert(await page.locator('.of-panel .of-err').count() === 1, 'cost required');
  await page.getByLabel('Final cost').fill('185'); await page.locator('.of-panel').getByRole('button', { name: 'Mark done' }).click(); await wait();
  assert(await S(() => S.d.tickets.find(t => t.id === 'M1').status) === 'Done', 'ticket done');
  await page.locator('.of-tabs button', { hasText: 'Renewals' }).click(); await wait(); await shot('leo-renewals');
  const sendBtn = page.locator('tr', { hasText: 'Zoe Chen' }).getByRole('button', { name: 'Send offer' });
  await page.locator('tr', { hasText: 'Zoe Chen' }).locator('input').fill('5000'); await sendBtn.click(); await wait();
  assert(await page.locator('tr', { hasText: 'Zoe Chen' }).locator('.of-err').count() === 1, 'renewal rent validation');
  await page.locator('tr', { hasText: 'Zoe Chen' }).locator('input').fill('1750'); await sendBtn.click(); await wait();
  assert(await S(() => S.d.units.find(u => u.id === 'U5').renewal.status) === 'Sent', 'renewal sent');
  await page.locator('.of-tabs button', { hasText: 'Rent roll' }).click(); await page.locator('.u', { hasText: 'Hannah' }).click(); await wait();
  await page.locator('.of-panel').getByRole('button', { name: 'Record ACH payment' }).click(); await wait();
  assert(await S(() => S.d.units.find(u => u.id === 'U8').status) === 'Paid', 'rent recorded');
  await shot('leo-rentroll');
  await page.locator('.of-tabs button', { hasText: 'Applications' }).click(); await wait(); await shot('leo-apps');

  // ---------- Rohan ----------
  await signIn('Rohan'); await visit('today', 'rohan-today');
  assert(await page.locator('.of-card:has(h3:text-is("Holds expiring"))').count() === 1, 'Rohan holds');
  assert(await page.locator('.of-timer').count() >= 1, 'live hold timers');
  await go('inbox/T8'); await page.locator('.of-ctx').getByRole('button', { name: 'Open unit 603' }).click(); await wait(500);
  await shot('rohan-unit');
  await page.locator('.of-panel').getByRole('button', { name: 'Book this unit' }).click(); await wait();
  await page.locator('.of-modal').getByRole('button', { name: /& book/ }).click(); await wait();
  assert(await page.locator('.of-modal .of-err', { hasText: 'KYC' }).count() + await page.locator('.of-modal .of-err', { hasText: 'ID and address' }).count() >= 1, 'KYC required');
  await page.getByRole('button', { name: 'Down payment · 3% off' }).click(); await page.locator('.of-modal input[type=checkbox]').check(); await shot('rohan-book');
  await page.locator('.of-modal').getByRole('button', { name: /& book/ }).click(); await wait();
  assert(await S(() => S.d.projUnits.find(u => u.code === '603').status) === 'Booked', 'unit booked');
  assert(await S(() => P('P7').stage) === 'Booked' && await S(() => S.d.projUnits.find(u => u.code === '603').buyer) === 'P7', 'booking linked to Nairs');
  // hold on another available unit
  const av = await S(() => S.d.projUnits.find(u => u.status === 'Available').code);
  await page.locator('.pu', { hasText: av }).first().click(); await wait();
  await page.locator('.of-panel').getByRole('button', { name: 'Hold' }).click(); await page.getByRole('button', { name: '24 hours' }).click(); await page.locator('.of-modal').getByRole('button', { name: /Hold for/ }).click(); await wait();
  assert(await S(c => S.d.projUnits.find(u => u.code === c).status, av) === 'Held', 'unit held');
  assert(await page.locator('.of-holdbar').count() === 1, 'hold timer shown');
  await page.getByRole('tab', { name: /Brokers/ }).click(); await wait(); await shot('rohan-brokers');
  assert(await page.locator('tr', { hasText: 'Meera Nair' }).getByRole('button', { name: 'Approve' }).isDisabled(), 'conflicting registration cannot be approved');
  await page.locator('tr', { hasText: 'Ravi Iyer' }).getByRole('button', { name: 'Approve' }).click(); await wait();
  assert(await S(() => S.d.of.cpRegs.find(r => r.id === 'R1').status) === 'Approved', 'registration approved');
  await page.getByRole('tab', { name: 'Launch queue' }).click(); await wait();
  await page.locator('.of-qrow', { hasText: 'Hana Suzuki' }).getByRole('button', { name: 'No-show' }).click(); await click('Call next');
  assert(await S(() => S.d.of.queue.find(q => q.token === 'A-014').status) === 'Called', 'call next');
  await shot('rohan-queue');
  await page.getByRole('tab', { name: 'Collections' }).click(); await wait();
  await page.getByRole('button', { name: 'Send', exact: true }).first().click(); await wait();
  await page.getByRole('button', { name: 'Record payment' }).first().click(); await wait();
  await shot('rohan-collections');
  // ---------- website data shows up in office views ----------
  step = 'website-data';
  await S(() => up(s => {
    s.d.applications = s.d.applications || []; s.d.siteTours = s.d.siteTours || []; s.d.valuations = s.d.valuations || []; s.d.interests = s.d.interests || []; s.d.holds = s.d.holds || [];
    s.d.applications.push({ id: 'APP-9001', pid: 'P4', unit: 'U3', b: 'B1', name: 'Elena Ruiz', ratio: 2.9, fee: 45, status: 'Submitted', at: 'Oct 8', consent: true, moveIn: 'Nov 1' });
    s.d.siteTours.push({ id: 'ST9', pid: 'P3', l: 'L3', when: 'Sat Oct 10 · 11:00 am', mode: 'person', agent: 'jordan', status: 'Requested', at: 'Oct 8' });
    s.d.valuations.push({ id: 'V9', pid: 'P8', addr: '1806 Kinney Ave', area: 'Zilker', low: 1250000, mid: 1310000, high: 1370000, at: 'Oct 8', consult: null });
    const u = s.d.projUnits.find(x => x.status === 'Available'); u.status = 'Held'; u.cp = 'Website'; u.hold = { by: 'Marcus Webb', pid: 'P3', until: 'Sun Oct 11, 5:00 pm', amount: 2500 }; s.d.holds.push({ id: 'H9', code: u.code, pid: 'P3', amount: 2500, until: 'Sun Oct 11, 5:00 pm', status: 'Active' });
    s.d.interests.push({ id: 'I9', pid: 'P1', type: '2 BR', code: '', when: 'Next 3 months', budget: '$900K', at: 'Oct 8' });
  }));
  await signIn('Jordan'); await visit('today', 'web-jordan-today');
  assert(await page.locator('.of-card:has(h3:text-is("From the website"))').count() === 1, 'website leads on Today');
  await page.locator('.of-row', { hasText: '77 Rainey' }).getByRole('button', { name: 'Confirm' }).first().click(); await wait();
  assert(await S(() => S.d.siteTours.find(t => t.id === 'ST9').status) === 'Confirmed', 'website tour confirmed');
  await visit('person/P3', 'web-person'); assert(await page.locator('.of-card:has(h3:text-is("From the website"))').count() === 1, 'website activity on person');
  await signIn('Leo'); await visit('rentals/applications', 'web-apps');
  await page.locator('tr', { hasText: 'APP-9001' }).getByRole('button', { name: 'Start review' }).click(); await wait();
  assert(await page.locator('tr', { hasText: 'APP-9001' }).getByRole('button', { name: 'Adverse-action notice' }).count() === 0, 'no adverse action on pending app');
  await page.locator('tr', { hasText: 'APP-9001' }).getByRole('button', { name: 'Decline' }).click(); await wait();
  assert(await page.locator('tr', { hasText: 'APP-9001' }).locator('.of-err').count() === 1, 'decline needs reason');
  await page.locator('tr', { hasText: 'APP-9001' }).getByRole('button', { name: 'Approve' }).click(); await wait();
  assert(await S(() => S.d.applications.find(a => a.id === 'APP-9001').status) === 'Approved', 'website application approved');
  await shot('web-apps-done');
  await signIn('Rohan'); await visit('projects/holds', 'web-holds');
  assert(await page.locator('.of-row', { hasText: 'Marcus Webb · Website' }).count() >= 1, 'website hold listed with timer');
  assert(await page.locator('.of-card:has(h3:text-is("Registered interest · website"))').count() === 1, 'interests listed');
  await b.contexts()[0].close();

  // ======================= 400 · every persona, every screen =======================
  page = await mk(400);
  const plan = { Maya: ['today', 'inbox', 'people', 'person/P1', 'pipeline', 'deal/D1', 'listings', 'listing/L1', 'rentals', 'projects', 'backoffice', 'bundle'], Jordan: ['today', 'inbox', 'people', 'pipeline', 'deal/D4'], Priya: ['today', 'listings', 'listing/L1', 'pipeline'], Leo: ['today', 'rentals', 'rentals/M1', 'rentals/renewals'], Rohan: ['today', 'projects', 'projects/partners', 'projects/queue', 'projects/collections'] };
  for (const [who, routes] of Object.entries(plan)) {
    await signIn(who);
    for (const r of routes) await visit(r, who.toLowerCase() + '-' + r.replace('/', '_'));
  }
  // phone inbox: list -> conversation -> back
  await signIn('Maya'); step = 'phone-inbox'; await go('inbox');
  assert(await page.locator('.of-list').count() === 1 && await page.locator('.of-conv').count() === 0, 'phone inbox shows list first');
  await page.locator('.of-list .th').first().click(); await wait();
  assert(await page.locator('.of-conv').count() === 1 && await page.locator('.of-list').count() === 0, 'phone opens conversation');
  await shot('phone-conv');
  await page.getByRole('button', { name: 'Contact details' }).click(); await wait(); await shot('phone-conv-details');
  await page.getByRole('button', { name: 'Back to conversations' }).click(); await wait();
  assert(await page.locator('.of-list').count() === 1, 'phone back to list');
  step = 'phone-pipeline'; await go('pipeline');
  await page.getByRole('tab', { name: /Under contract/ }).click(); await wait();
  assert(await page.locator('.of-dc').count() >= 1, 'phone pipeline stage tabs');
  await shot('phone-pipeline-uc');
  step = 'phone-modal'; await go('people'); await click('Add person'); await shot('phone-add-person'); await page.keyboard.press('Escape'); await wait();
} catch (e) { errs.push('FAIL @' + W + ' [' + step + '] ' + e.message.split('\n')[0]); }
console.log(log.length + ' checks passed');
console.log(errs.length ? 'ERRS\n' + errs.join('\n') : 'OK');
await b.close();
