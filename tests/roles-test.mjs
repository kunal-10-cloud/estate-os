import { chromium } from 'playwright-core';
const U = (process.env.EOS_URL || 'http://localhost:3000/index.html'), out = 'shots-roles';
const b = await chromium.launch({ channel: 'chrome', headless: true });
const errs = [];
for (const w of [1440, 400]) {
  const page = await (await b.newContext({ viewport: { width: w, height: 900 } })).newPage();
  page.on('pageerror', e => errs.push(w + ' ' + e.message)); page.on('console', m => { if (m.type() === 'error' && !/404/.test(m.text())) errs.push(w + ' ' + m.text()); });
  await page.goto(U); await page.waitForTimeout(1500); await page.screenshot({ path: `${out}/${w}-00-start.png`, fullPage: true });
  const n = await page.locator('.rs-card').count();
  for (let i = 0; i < n; i++) {
    await page.goto(U + '#/start'); await page.waitForTimeout(300);
    const card = page.locator('.rs-card').nth(i); const who = (await card.locator('b').first().textContent()).trim();
    await card.click(); await page.waitForTimeout(700);
    const nav = await page.locator('.side .nav span').allTextContents();
    const ow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    console.log(w, who.padEnd(22), location => 0, (await page.evaluate(() => location.hash)).padEnd(16), nav.join(' | '), ow > 1 ? 'OVERFLOW ' + ow : '');
    await page.screenshot({ path: `${out}/${w}-${String(i + 1).padStart(2, '0')}.png` });
    // back to picker from wherever
    const sw = page.getByRole('button', { name: /Switch persona/ }).first();
    if (await sw.count()) { await sw.click(); await page.waitForTimeout(300); if (!(await page.locator('.rs-hero').count())) errs.push('no picker after switch for ' + who); }
    else errs.push('no switch button for ' + who + ' @' + w);
  }
}
console.log(errs.length ? 'ERRS ' + JSON.stringify(errs) : 'OK');
await b.close();
