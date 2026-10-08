import { chromium } from 'playwright-core';
const out = process.argv[2], U = (process.env.EOS_URL || 'http://localhost:3000/index.html');
const b = await chromium.launch({ channel: 'chrome', headless: true });
const page = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
const errs = []; page.on('pageerror', e => errs.push(e.message)); page.on('console', m => { if (m.type() === 'error' && !/404/.test(m.text())) errs.push(m.text()); });
const shot = n => page.screenshot({ path: `${out}/${n}.png`, fullPage: true });
const click = async (name, exact) => { await page.getByRole('button', { name, exact: !!exact }).first().click(); await page.waitForTimeout(250); };
let step = '';
try {
  step = 'home'; await page.goto(U + '#/portal'); await page.waitForTimeout(1500); await shot('01-home');
  step = 'budget'; await click(/^Start/); await page.waitForTimeout(300); await shot('02-budget');
  for (const t of ['Last 2 pay stubs', 'W-2s for 2024 and 2025', '2 months of bank statements', 'Photo ID']) await page.getByText(t).click();
  await click('Submit for pre-approval'); await click('Review & sign'); await click(/I'm ready/); await shot('03-find');
  step = 'save'; await page.locator('.lc .heart').nth(2).click(); await page.waitForTimeout(200);
  step = 'saved'; await page.locator('.pt-tabs button', { hasText: 'Saved' }).click(); await page.waitForTimeout(300); await shot('04-saved');
  step = 'tour'; await page.locator('.pt-tabs button', { hasText: 'Tours' }).click(); await click('+ Book a tour'); await click('Book tour', true); await click('Mark toured'); await page.locator('.star').nth(4).click(); await shot('05-tours');
  step = 'offer'; await click(/I want to make an offer/); await page.waitForTimeout(300); await shot('06-offer-price');
  await click('Continue'); await shot('07-offer-terms'); await click('Continue'); await click('Sign offer'); await click('Send offer'); await page.waitForTimeout(400);
  // the sellers counter in their own portal (no fake auto-counter): Elena's offer is in their comparison
  step = 'seller-counter'; await page.goto(U + '#/seller/offers'); await page.waitForTimeout(500);
  const ec = page.locator('.sl-of', { hasText: 'Elena' }); await ec.getByRole('button', { name: 'Counter' }).click(); await page.waitForTimeout(250);
  await page.locator('.modal input[type=range]').fill('1142000'); await page.locator('.modal .sig button').click(); await click('Send counter');
  await page.goto(U + '#/portal/offer'); await page.waitForTimeout(500); await shot('08-countered');
  step = 'accept'; await click(/Accept \$1,142,000/); await page.waitForTimeout(300);
  const acc = await page.evaluate(() => ({ d2: S.d.deals.find(d => d.id === 'D2'), st: SlApi.offers('L1').find(o => /Ruiz/.test(o.buyer)).status, l1: L('L1').status }));
  if (!(acc.d2.stage === 'Under contract' && acc.d2.price === 1142000 && acc.st === 'Accepted' && acc.l1 === 'Under contract')) throw new Error('counter acceptance not reflected on the seller side ' + JSON.stringify([acc.d2.stage, acc.d2.price, acc.st, acc.l1]));
  step = 'deal'; await page.locator('.pt-tabs button', { hasText: 'My purchase' }).click(); await page.waitForTimeout(300); await shot('09-deal');
  await page.getByRole('button', { name: 'Money & loan' }).click(); await click('I called and the details match'); await click("I've sent the wire"); await shot('10-money');
  await page.getByRole('button', { name: 'Inspection' }).click(); await click('Send repair request'); await shot('11-inspection');
  step = 'closing'; await page.getByRole('button', { name: 'Closing day' }).click(); await click('Demo: skip to closing week'); await page.locator('.pt-tabs button', { hasText: 'My purchase' }).click(); await page.getByRole('button', { name: 'Closing day' }).click(); await page.waitForTimeout(300);
  await click("I've reviewed it"); await page.getByText('Final walkthrough done').click(); await page.getByText(/Sign closing documents/).click(); await page.waitForTimeout(300); await shot('12-closing');
  step = 'myhome'; await page.locator('.pt-tabs button', { hasText: 'My home' }).click(); await page.waitForTimeout(300); await shot('13-myhome');
  step = 'messages'; await page.locator('.pt-tabs button', { hasText: 'Messages' }).click(); await page.waitForTimeout(300); await shot('14-messages');
  step = 'office'; await page.goto(U + '#/listing/L1'); await page.waitForTimeout(400); await click(/Compare (\d+ )?offers/); await shot('15-offers');
  await page.goto(U + '#/person/P4'); await page.waitForTimeout(400); await shot('16-office-person');
  console.log('OK');
} catch (e) { console.log('FAIL at ' + step + ': ' + e.message.split('\n')[0]); await shot('99-fail'); }
console.log('ERRS', JSON.stringify(errs)); await b.close();
