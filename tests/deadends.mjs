// Dead-end hunt: on each persona's main screens, click every visible button once and record any that
// changes nothing (no DOM/state/route/modal/toast change) or throws. Destructive-looking buttons are skipped.
import { chromium } from 'playwright-core';
const U = (process.env.EOS_URL || 'http://localhost:3000/index.html');
const W = +(process.argv[2] || 1440);
const b = await chromium.launch({ channel: 'chrome', headless: true });
const plan = {
  'Website visitor': ['site', 'site/buy', 'site/home/L1', 'site/rent', 'site/new-homes', 'site/sell', 'site/agents'],
  'Jordan Lee': ['today', 'inbox', 'people', 'pipeline'],
  'Priya Shah': ['listingops', 'listings', 'listing/L1', 'deal/D2'],
  'Nina Patel': ['compliance', 'compliance/D1', 'commissions', 'trust'],
  'Grace Liu': ['commissions', 'commissions/disb', 'commissions/pay', 'trust', 'routing', 'backoffice'],
  'Leo Grant': ['today', 'rentals', 'pmops', 'pmops/tech'],
  'Ray Alvarez': ['pmops/tech'],
  'Rohan': ['today', 'projects', 'projects/holds'],
  'Elena Ruiz': ['portal', 'portal/budget', 'portal/find', 'portal/saved', 'portal/tours', 'portal/offer', 'portal/messages'],
  'Rachel & Tom Grant': ['seller/home', 'seller/pricing', 'seller/prep', 'seller/marketing', 'seller/showings', 'seller/offers', 'seller/messages'],
  'Hannah Cole': ['tenant', 'tenant/pay', 'tenant/fix', 'tenant/lease', 'tenant/packages', 'tenant/messages'],
  'Brooks Holdings': ['owner', 'owner/statement', 'owner/approvals', 'owner/payouts', 'owner/docs'],
  'Maya Ortiz': ['today', 'backoffice', 'bundle', 'settings/profile', 'projects'],
};
const DANGER = /delete|remove|sign out|decline|cancel|release|withdraw|disconnect|reject|archive|switch persona|log ?out|no-show|recall|dismiss|×|✕|close|mark all read|reset|give notice|move out|unassign|opt out|stop/i;
const dead = [], errs = [];
const page = await (await b.newContext({ viewport: { width: W, height: 900 }, acceptDownloads: true })).newPage();
page.on('pageerror', e => errs.push(e.message));
page.on('console', m => { if (m.type() === 'error' && !/404|Failed to load/.test(m.text())) errs.push(m.text()); });
page.on('dialog', d => d.dismiss());
await page.goto(U + '#/start'); await page.waitForTimeout(1200);
const sig = () => page.evaluate(() => {
  let h = 0; const s = document.body.innerHTML + location.hash + JSON.stringify(S.modal || '') + (S.toast ? S.toast.text : '') + JSON.stringify(S.ui || {});
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return h;
});
let total = 0;
for (const [who, routes] of Object.entries(plan)) {
  await page.evaluate(() => go('start')); await page.waitForTimeout(300);
  await page.locator('.rs-card', { hasText: who }).first().click(); await page.waitForTimeout(600);
  for (const r of routes) {
    await page.evaluate(r => go(r), r); await page.waitForTimeout(500);
    const labels = await page.evaluate(() => [...document.querySelectorAll('.main button, .site button, .rz-ray button, #app > div button')]
      .filter(b => b.offsetParent && !b.disabled && !b.closest('.side,.eos-tabbar,.sbar,.eos-tools,.eos-embed,.eos-dock,.toast,.scrim,.eos-pop'))
      .map((b, i) => { b.dataset.dh = String(i); return (b.getAttribute('aria-label') || b.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 50); }));
    const n = labels.length;
    for (let i = 0; i < n; i++) {
      const lab = labels[i];
      if (!lab || DANGER.test(lab)) continue;
      // return to the screen in its current state
      if ((await page.evaluate(() => location.hash)) !== '#/' + r) { await page.evaluate(r => go(r), r); await page.waitForTimeout(350); }
      await page.evaluate(() => { up(s => { s.modal = null; s.toast = null; s.ui.pop = null; }); });
      await page.keyboard.press('Escape'); await page.waitForTimeout(80);
      const loc = page.locator(`[data-dh="${i}"]`);
      if (!(await loc.count()) || !(await loc.isVisible().catch(() => false))) continue;
      const lab2 = ((await loc.getAttribute('aria-label')) || (await loc.innerText())).trim().replace(/\s+/g, ' ').slice(0, 50);
      if (DANGER.test(lab2)) continue;
      const e0 = errs.length, s0 = await sig();
      let dl = false; const onDl = () => { dl = true; }; page.once('download', onDl);
      try { await loc.click({ timeout: 2000 }); } catch (e) { continue; }
      await page.waitForTimeout(700); total++;
      const s1 = await sig();
      if (errs.length > e0) dead.push(`${who} #/${r} "${lab2}" THREW ${errs.slice(e0).join(' | ').slice(0, 160)}`);
      else if (s0 === s1 && !dl) dead.push(`${who} #/${r} "${lab2}" did nothing`);
      page.off('download', onDl);
      await page.evaluate(() => { document.querySelectorAll('[data-dh]').forEach(b => b.removeAttribute('data-dh')); });
      // re-tag (DOM may have changed)
      await page.evaluate(() => [...document.querySelectorAll('.main button, .site button, .rz-ray button, #app > div button')]
        .filter(b => b.offsetParent && !b.disabled && !b.closest('.side,.eos-tabbar,.sbar,.eos-tools,.eos-embed,.eos-dock,.toast,.scrim,.eos-pop'))
        .forEach((b, k) => { b.dataset.dh = String(k); }));
    }
  }
}
console.log('clicked', total);
console.log(dead.length ? 'DEAD\n' + dead.join('\n') : 'NO DEAD ENDS');
console.log('ERRS', JSON.stringify([...new Set(errs)].slice(0, 20)));
await b.close();
