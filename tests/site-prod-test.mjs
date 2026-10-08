// Website + buyer portal production test: visitor → search → save → sign in → tour → portal; sell valuation; rent application; new-homes hold.
import { chromium } from 'playwright-core';
import fs from 'fs';
const U = (process.env.EOS_URL || 'http://localhost:3000/index.html');
const OUT = new URL('./shots-site-prod/', import.meta.url).pathname; fs.mkdirSync(OUT, { recursive: true });
const b = await chromium.launch({ channel: 'chrome', headless: true });
let fails = 0;
const ok = (c, m) => { if (!c) { fails++; console.log('  ✗ ' + m); } else console.log('  ✓ ' + m); };

async function run(w) {
  const h = w < 600 ? 860 : 900, tag = w + '';
  const errs = [];
  const mk = async () => { const ctx = await b.newContext({ viewport: { width: w, height: h } }); const page = await ctx.newPage(); page.on('pageerror', e => errs.push(e.message)); page.on('console', m => { if (m.type() === 'error' && !/404|favicon/.test(m.text())) errs.push(m.text()); }); return [ctx, page]; };
  let [ctx, page] = await mk();
  const shot = async (n, full = true) => page.screenshot({ path: `${OUT}${tag}-${n}.png`, fullPage: full });
  const btn = async (name, exact) => { const m = page.locator('.scrim .modal'); const root = (await m.count()) ? m.last() : page; return root.getByRole('button', { name, exact: !!exact }).first(); };
  const click = async (name, exact) => { await (await btn(name, exact)).click(); await page.waitForTimeout(250); };
  const ev = (f) => page.evaluate(f);
  const noHScroll = async (n) => { const o = await ev(() => document.documentElement.scrollWidth - document.documentElement.clientWidth); ok(o <= 1, n + ': no horizontal scroll (' + o + ')'); };
  let step = '';
  try {
    console.log('== ' + w + 'px');
    step = 'picker'; await page.goto(U + '#/start'); await page.waitForTimeout(1200);
    await page.locator('.rs-card', { hasText: 'Website visitor' }).click(); await page.waitForTimeout(600);
    ok(await page.locator('.sx-hero').isVisible(), 'visitor lands on the site home');
    ok(await page.locator('.sx-cookie').isVisible(), 'cookie banner shown');
    await shot('01-home');
    await click('Reject non-essential'); ok(!(await page.locator('.sx-cookie').count()), 'cookie banner dismissed');
    ok(await ev(() => JSON.parse(localStorage.getItem('hv-consent')).marketing === false), 'non-essential declined');
    await noHScroll('home');

    step = 'hero search'; await page.locator('.sx-q input').fill('pool'); await click(/^Search$/); await page.waitForTimeout(500);
    ok((await page.url()).includes('#/site/buy'), 'hero search → site/buy');
    const nPool = await page.locator('.sx-list .sx-lc').count(); ok(nPool >= 2, 'keyword "pool" results: ' + nPool);
    if (w < 860) await click(/^Filters/);
    await page.locator('label.sx-fsel', { hasText: 'Beds' }).locator('select').selectOption('4'); await page.waitForTimeout(450);
    const n4 = await page.locator('.sx-list .sx-lc').count(); ok(n4 >= 1 && n4 <= nPool, 'beds 4+ narrows results: ' + n4);
    await page.locator('.sx-sort select').selectOption('high'); await page.waitForTimeout(450);
    const prices = await page.locator('.sx-list .sx-lc .pr').allTextContents(); const nums = prices.map(p => +p.replace(/\D/g, ''));
    ok(nums.every((v, i) => !i || nums[i - 1] >= v), 'sort high→low');
    await page.locator('label.sx-fsel', { hasText: 'Max price' }).locator('select').selectOption('700000'); await page.waitForTimeout(450);
    ok(await page.locator('.sx-empty').isVisible(), 'empty state when nothing matches');
    await shot('02-empty');
    await click('Clear filters'); await page.waitForTimeout(450);
    const nAll = await page.locator('.sx-list .sx-lc').count(); ok(nAll >= 6, 'clear filters shows all for-sale homes: ' + nAll);
    if (w >= 1100) { await page.locator('.sx-map .pin').first().click(); ok(await page.locator('.sx-mapcard').isVisible(), 'map pin opens preview card'); }
    else { await click(/^Map$/); ok(await page.locator('.sx-map').isVisible(), 'mobile map toggle'); await shot('03-map', false); await click(/^List$/); }
    await shot('03-search');
    await noHScroll('search');

    step = 'save gated'; const firstAddr = (await page.locator('.sx-list .sx-lc .ad').first().textContent()).split(',')[0];
    await page.locator('.sx-list .sx-lc .heart').first().click(); await page.waitForTimeout(300);
    ok(await page.locator('.sx-modal').isVisible(), 'saving without an account opens sign-in');
    await click('Create account', true); ok(await page.locator('.sx-err').count() >= 2, 'create-account validates empty fields');
    await click('I have an account'); await click('Use the demo buyer account (Elena)'); await shot('04-signin');
    await click('Sign in', true); await page.waitForTimeout(700);
    ok(await ev(() => S.role && S.role.id === 'buyer'), 'signed in as Elena → buyer role');
    const savedIds = await ev(() => Object.keys(pj().saved).map(id => L(id).addr));
    ok(savedIds.includes(firstAddr), 'home saved to Elena\'s portal board: ' + firstAddr);
    ok(await page.locator('.sx-me').isVisible(), 'header shows signed-in user');

    step = 'save search'; await click('Save search'); await page.waitForTimeout(250); await click('Save search', true); await page.waitForTimeout(300);
    ok(await ev(() => S.d.savedSearches.some(x => x.pid === 'P4')), 'saved search stored for Elena');

    step = 'listing'; await page.locator('.sx-list .sx-lc').nth(1).click(); await page.waitForTimeout(600);
    ok((await page.url()).includes('#/site/home/'), 'card → listing detail');
    await page.locator('.sx-mosaic button').first().click(); await page.waitForTimeout(250); ok(await page.locator('.sx-gal').isVisible(), 'gallery opens');
    await page.keyboard.press('ArrowRight'); await page.keyboard.press('Escape'); await page.waitForTimeout(200); ok(!(await page.locator('.sx-gal').count()), 'Esc closes gallery');
    await shot('05-listing');
    await noHScroll('listing');

    step = 'tour'; await click('Request a tour'); await page.waitForTimeout(250);
    ok(await page.getByText('Touring agreement ·').isVisible(), 'touring agreement shown before tour');
    await click('Sign & continue'); ok(await page.locator('.sx-err').count() >= 2, 'agreement requires IABS + signature');
    await page.locator('.sx-modal .sx-ck input').first().check(); await page.locator('.sx-sigin').fill('Elena Ruiz'); await shot('06-agreement', false);
    await click('Sign & continue'); await click('Request tour', true); await page.waitForTimeout(800);
    ok(await page.getByText('Tour requested').first().isVisible(), 'tour confirmation');
    const tr = await ev(() => ({ st: S.d.siteTours.length, pt: pj().tours.length, src: pj().tours[0] && pj().tours[0].src, t1: S.d.threads.find(t => t.id === 'T1').msgs.some(m => /Requested a tour/.test(m.text)), deal: S.d.deals.find(d => d.person === 'P4').stage }));
    ok(tr.st === 1 && tr.pt === 1 && tr.src === 'site', 'tour stored on site + portal');
    ok(tr.t1, 'tour logged to Elena\'s inbox thread'); ok(tr.deal === 'Touring', 'deal moved to Touring');
    await shot('07-tour-done', false);
    await click('Continue in your portal'); await page.waitForTimeout(600);
    ok((await page.url()).includes('#/portal/tours'), 'continue → portal tours');
    ok(await page.getByText('Requested on the website').isVisible(), 'portal shows website tour');
    await shot('08-portal-tours');
    await page.locator('.pt-tabs button', { hasText: 'Saved' }).click(); await page.waitForTimeout(300);
    ok(await page.locator('.sv', { hasText: firstAddr }).count() === 1, 'site-saved home appears in portal Saved');
    ok(await page.getByText('Saved searches').isVisible(), 'portal shows saved searches');
    await shot('09-portal-saved');
    await page.locator('.pt-tabs button', { hasText: 'Find homes' }).click(); await page.waitForTimeout(300);
    await page.locator('.lc .heart:not(.on)').first().click(); await page.waitForTimeout(200);
    const portalSaved = await ev(() => Object.keys(pj().saved).length);
    await page.locator('.lc', { has: page.locator('.heart.on') }).first().getByRole('button', { name: 'Details' }).click(); await page.waitForTimeout(500);
    ok((await page.url()).includes('#/site/home/'), 'portal Details → site listing');
    ok(await page.locator('.sx-hdr .sx-saved i').textContent() == String(portalSaved), 'site saved count matches portal (' + portalSaved + ')');
    ok(await page.getByRole('button', { name: /Saved$/ }).filter({ hasText: '♥' }).first().isVisible(), 'portal-saved home shows as Saved on site');

    step = 'sign out'; await page.locator('.sx-me').click(); await page.getByRole('menuitem', { name: 'Sign out' }).click(); await page.waitForTimeout(250); await page.waitForTimeout(300);
    ok(await ev(() => S.role.id === 'visitor' && !sxUser()), 'signed out back to visitor');

    step = 'anon tour'; await page.goto(U + '#/site/home/L2'); await page.waitForTimeout(500);
    await click('Request a tour'); await click('Continue'); ok(await page.locator('.sx-err').count() >= 3, 'contact step validates');
    await page.getByLabel('Full name').fill('Chris Morgan'); await page.getByLabel('Email').fill('chris.morgan@example.com'); await page.getByLabel('Mobile').fill('5125550199');
    await click('Continue'); await page.locator('.sx-modal .sx-ck input').first().check(); await page.locator('.sx-sigin').fill('chris morgan');
    await click('Sign & continue'); await click('Request tour', true); await page.waitForTimeout(800);
    const cm = await ev(() => { const p = S.d.people.find(x => x.email === 'chris.morgan@example.com'); return p && { owner: p.owner, stage: p.stage, thread: !!S.d.threads.find(t => t.person === p.id), deal: S.d.deals.find(d => d.person === p.id) }; });
    ok(cm && cm.owner === 'jordan' && cm.stage === 'Touring', 'new lead for Jordan, stage Touring');
    ok(cm && cm.thread && cm.deal && cm.deal.agreement.touring, 'thread + deal with touring agreement');
    await click('Keep browsing');
    await page.locator('.sx-me').click(); await page.getByRole('menuitem', { name: 'Sign out' }).click(); await page.waitForTimeout(250);

    step = 'create account'; await page.goto(U + '#/site/buy'); await page.waitForTimeout(400);
    await page.locator('.sx-list .sx-lc .heart').nth(2).click(); await page.waitForTimeout(200);
    await page.getByLabel('Full name').fill('Dana Whitfield'); await page.getByLabel('Email').fill('dana.w@example.com'); await page.getByLabel('Password').fill('hunter2024'); await page.locator('.sx-modal .sx-ck input').first().check();
    await click('Create account', true); await page.waitForTimeout(700);
    const dw = await ev(() => { const p = S.d.people.find(x => x.email === 'dana.w@example.com'); return p && { src: p.source, saved: Object.keys(S.d.siteSaved[p.id] || {}).length }; });
    ok(dw && dw.src === 'Website · account' && dw.saved === 1, 'account created as lead and home saved');
    await page.goto(U + '#/site/saved'); await page.waitForTimeout(300); ok(await page.locator('.sx-lc').count() === 1, 'saved page lists the home'); await shot('10-saved');
    await page.locator('.sx-me').click(); await page.getByRole('menuitem', { name: 'Sign out' }).click(); await page.waitForTimeout(250);

    step = 'sell'; await page.goto(U + '#/site/sell'); await page.waitForTimeout(400);
    await click('Continue'); ok(await page.locator('.sx-err').count() === 1, 'address required');
    await page.getByLabel('Street address').fill('1204 Elm St'); await click('Continue');
    await page.getByLabel('Living area (sqft)').fill('2150'); await click('Renovated'); await click('Continue');
    await page.getByLabel('Full name').fill('Pat Lowell'); await page.getByLabel('Email').fill('pat.lowell@example.com'); await page.getByLabel('Mobile').fill('5125550177');
    await click('See my estimate'); await page.waitForTimeout(900);
    ok(await page.locator('.sx-val').isVisible(), 'valuation range shown');
    const val = await ev(() => { const v = S.d.valuations[0]; const p = P(v.pid); return { low: v.low, high: v.high, owner: p.owner, tags: p.tags }; });
    ok(val.low < val.high && val.owner === 'priya' && val.tags.includes('Seller'), 'seller lead for Priya: ' + val.low + '–' + val.high);
    await shot('11-valuation');
    await click('Book consultation'); await page.waitForTimeout(300);
    ok(await ev(() => !!S.d.valuations[0].consult), 'consultation booked'); await shot('12-consult-done', false);
    await page.locator('.sx-me').click(); await page.getByRole('menuitem', { name: 'Sign out' }).click(); await page.waitForTimeout(250);

    step = 'rent'; await page.goto(U + '#/site/rent'); await page.waitForTimeout(400);
    const nUnits = await page.locator('.sx-lc').count(); ok(nUnits === await ev(() => S.d.units.filter(u => u.status === 'Vacant' || !u.tenant).length), 'rent lists vacant units: ' + nUnits);
    await shot('13-rent');
    await page.locator('.sx-lc').first().click(); await page.waitForTimeout(400); ok(await page.getByText('Fees, up front').isVisible(), 'unit page shows fees up front'); await shot('14-unit');
    await click('Apply now'); await page.waitForTimeout(300);
    await page.getByLabel('Full name').fill('Riley Chen'); await page.getByLabel('Email').fill('riley.chen@example.com'); await page.getByLabel('Mobile').fill('5125550155'); await click('Continue');
    await click('Continue'); ok(await page.locator('.sx-err').count() >= 3, 'income step validates');
    await page.getByLabel('Employer').fill('Dell'); await page.getByLabel('Gross monthly income ($)').fill('6800'); await page.getByLabel('Current address').fill('22 Oak Ln, Austin TX'); await click('Continue');
    await page.locator('.sx-flow .sx-ck input').nth(0).check(); await page.locator('.sx-flow .sx-ck input').nth(1).check(); await page.locator('.sx-sigin').fill('Riley Chen'); await click('Continue');
    ok(await page.getByText('Application fee').first().isVisible(), 'fee shown before payment'); await shot('15-apply-fee');
    await page.getByLabel('Card number').fill('4242424242424242'); await page.getByLabel('Expiry').fill('12/29'); await page.getByLabel('Billing ZIP').fill('78702');
    await click(/^Pay \$55/); await page.waitForTimeout(900);
    const app = await ev(() => { const a = S.d.applications[0]; return a && { status: a.status, owner: P(a.pid).owner, th: !!S.d.threads.find(t => t.person === a.pid) }; });
    ok(app && app.status === 'Submitted' && app.owner === 'leo' && app.th, 'application visible to Leo (record + thread)');
    await shot('16-apply-done', false);
    await page.locator('.sx-me').click(); await page.getByRole('menuitem', { name: 'Sign out' }).click(); await page.waitForTimeout(250);

    step = 'new homes'; await page.goto(U + '#/site/new-homes'); await page.waitForTimeout(400); await shot('17-new-homes');
    const code = await page.locator('.sx-u.u-ok').first().locator('b').textContent();
    await page.locator('.sx-u.u-ok').first().click(); await page.waitForTimeout(200);
    await click(/Reserve with a \$2,500 hold/);
    await page.getByLabel('Full name').fill('Sam Ortega'); await page.getByLabel('Email').fill('sam.ortega@example.com'); await page.getByLabel('Mobile').fill('5125550133'); await click('Continue');
    await click('Continue'); ok(await page.locator('.sx-err').count() === 1, 'hold terms must be accepted');
    await page.locator('.sx-modal .sx-ck input').first().check(); await click('Continue');
    await page.getByLabel('Card number').fill('4242424242424242'); await page.getByLabel('Expiry').fill('12/29'); await page.getByLabel('Billing ZIP').fill('78723');
    await click('Pay $2,500 hold'); await page.waitForTimeout(900);
    const hold = await page.evaluate((c) => { const u = S.d.projUnits.find(x => x.code === c); return { st: u.status, cp: u.cp, by: u.hold && u.hold.by }; }, code);
    ok(hold.st === 'Held' && hold.cp === 'Website' && hold.by === 'Sam Ortega', 'unit ' + code + ' held from the website');
    await shot('18-hold-done', false); await click('Done', true);
    ok(await page.locator('.sx-u.u-hd', { hasText: code }).count() === 1, 'stacking plan shows the hold');
    await click('Register interest'); await click('Register interest', true); await page.waitForTimeout(600);
    ok(await ev(() => S.d.interests.length === 1), 'interest registered');

    step = 'agents'; await page.goto(U + '#/site/agents'); await page.waitForTimeout(300); await shot('19-agents');
    await page.locator('.sx-acard', { hasText: 'Jordan Lee' }).click(); await page.waitForTimeout(300);
    await page.getByLabel('Message').fill('Can we talk about Bee Cave this week?'); await click('Send message'); await page.waitForTimeout(600);
    ok(await page.getByText('Message sent').first().isVisible(), 'agent contact form sends'); await shot('20-agent');

    step = 'legal'; await page.goto(U + '#/site/legal/iabs'); await page.waitForTimeout(300);
    ok(await page.getByRole('heading', { name: 'Information About Brokerage Services' }).isVisible(), 'IABS page'); await shot('21-iabs');
    await page.locator('.sx-foot a', { hasText: 'Cookie settings' }).click(); await page.waitForTimeout(200); ok(await page.locator('.sx-cookie').isVisible(), 'cookie settings reopen from footer');
    await click('Reject non-essential');

    step = 'portal chooser'; await page.locator('.sx-me').click(); await page.getByRole('menuitem', { name: 'Sign out' }).click(); await page.waitForTimeout(250); await page.locator('.sx-signin').click(); await page.waitForTimeout(200); await shot('22-chooser', false);
    await page.locator('.sx-port', { hasText: 'Seller portal' }).click(); await page.waitForTimeout(600);
    ok((await page.url()).includes('#/seller'), 'sign in → seller portal');
    ok(await ev(() => S.role.id === 'seller'), 'seller role set');
    if (w < 860) { await page.goto(U + '#/site'); await page.waitForTimeout(300); await click('Open menu'); await shot('23-menu', false); ok(await page.locator('.sx-nav.open').isVisible(), 'mobile menu opens'); }
  } catch (e) { fails++; console.log('FAIL at ' + step + ': ' + e.message.split('\n')[0]); await shot('99-fail'); }
  ok(!errs.length, 'no console/page errors ' + (errs.length ? JSON.stringify(errs.slice(0, 4)) : ''));
  await ctx.close();
}
await run(1440);
await run(400);
await b.close();
console.log(fails ? 'FAILURES: ' + fails : 'ALL OK');
