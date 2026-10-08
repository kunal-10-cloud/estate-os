import { chromium } from 'playwright-core';
const out = process.argv[2], U = (process.env.EOS_URL || 'http://localhost:3000/index.html');
const b = await chromium.launch({ channel: 'chrome', headless: true });
const page = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
const errs = []; page.on('pageerror', e => errs.push(e.message)); page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
const shot = n => page.screenshot({ path: `${out}/${n}.png` });
let step = '';
try {
  step = 'today'; await page.goto(U + '#/today'); await page.waitForTimeout(1500); await shot('01-today');
  step = 'site'; await page.goto(U + '#/site'); await page.waitForTimeout(800); await shot('02-site');
  step = 'listing'; await page.locator('.lc').first().click(); await page.waitForTimeout(700); await shot('03-listing');
  step = 'tour'; await page.getByRole('button', { name: 'Request a tour' }).click(); await page.waitForTimeout(300);
  // site.js tour flow: contact → touring agreement (IABS + typed signature) → confirm
  const M = page.locator('.scrim .modal');
  await page.getByLabel('Full name').fill('Chris & Dana Morgan'); await page.getByLabel('Email').fill('morgans@example.com'); await page.getByLabel('Mobile').fill('5125550199');
  await M.getByRole('button', { name: 'Continue' }).click(); await M.locator('.sx-ck input').first().check(); await page.locator('.sx-sigin').fill('Chris & Dana Morgan');
  await M.getByRole('button', { name: 'Sign & continue' }).click(); await M.getByRole('button', { name: 'Request tour', exact: true }).click(); await page.waitForTimeout(800); await shot('04-booked');
  step = 'inbox'; const tid = await page.evaluate(() => S.d.threads.find(t => P(t.person).email === 'morgans@example.com').id); await M.getByRole('button', { name: 'Keep browsing' }).click(); await page.goto(U + '#/inbox/' + tid); await page.waitForTimeout(500); await shot('05-inbox-new');
  step = 'brooks'; await page.goto(U + '#/inbox/T2'); await page.waitForTimeout(400); await page.getByRole('button', { name: 'Draft with AI' }).click(); await page.getByRole('button', { name: 'Send', exact: true }).click(); await page.waitForTimeout(300); await shot('06-inbox-sent');
  step = 'deal'; await page.goto(U + '#/deal/D1'); await page.waitForTimeout(500); await shot('07-deal');
  step = 'sign'; await page.getByRole('button', { name: 'Draft & send for signature' }).click(); await page.locator('.sig button').nth(0).click(); await page.locator('.sig button').nth(1).click(); await page.getByRole('button', { name: 'Complete & send' }).click(); await page.waitForTimeout(300);
  step = 'close'; await page.getByRole('button', { name: /Move to Closed/ }).click(); await page.waitForTimeout(300); await shot('08-closed');
  step = 'pipeline'; await page.goto(U + '#/pipeline'); await page.waitForTimeout(400); await shot('09-pipeline');
  step = 'person'; await page.goto(U + '#/person/P1'); await page.waitForTimeout(400); await shot('10-person');
  step = 'listingmgr'; await page.goto(U + '#/listing/L1'); await page.waitForTimeout(400); await page.getByRole('button', { name: 'Write with AI' }).click(); await shot('11-netsheet');
  step = 'rentals'; await page.goto(U + '#/rentals'); await page.waitForTimeout(400); await shot('12-rentals'); await page.getByRole('button', { name: 'Dispatch Ace' }).click(); await page.waitForTimeout(200);
  step = 'projects'; await page.goto(U + '#/projects'); await page.waitForTimeout(400); await page.getByRole('button', { name: 'Book for Nair family' }).click(); await page.waitForTimeout(200); await shot('13-projects');
  step = 'backoffice'; await page.goto(U + '#/backoffice'); await page.waitForTimeout(400); await shot('14-backoffice');
  step = 'bundle'; await page.goto(U + '#/bundle'); await page.waitForTimeout(300); await page.locator('#persona').selectOption('pm'); await page.waitForTimeout(300); await shot('15-bundle-pm');
  console.log('OK');
} catch (e) { console.log('FAIL at ' + step + ': ' + e.message.split('\n')[0]); await shot('99-fail'); }
console.log('ERRS', JSON.stringify(errs)); await b.close();
