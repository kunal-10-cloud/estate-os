import { chromium } from 'playwright-core';
const U = (process.env.EOS_URL || 'http://localhost:3000/index.html'), out = 'shots-shell-prod';
const b = await chromium.launch({ channel: 'chrome', headless: true });
const errs = [], fails = [];
const ok = (c, msg) => { if (!c) fails.push(msg); };
for (const w of [1440, 400]) {
  const page = await (await b.newContext({ viewport: { width: w, height: 900 } })).newPage();
  page.on('pageerror', e => errs.push(w + ' ' + e.message)); page.on('console', m => { if (m.type() === 'error' && !/404/.test(m.text())) errs.push(w + ' ' + m.text()); });
  const W = (ms = 250) => page.waitForTimeout(ms);
  const shot = (n, full) => page.screenshot({ path: `${out}/${w}-${n}.png`, fullPage: !!full });
  const hash = () => page.evaluate(() => location.hash);
  const hs = async (tag) => { const o = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth); ok(o <= 1, `${w} hscroll ${o} on ${tag}`); };
  const seat = async (name) => { await page.goto(U + '#/start'); await W(300); await page.locator('.rs-card', { hasText: name }).first().click(); await W(500); };
  let step = '';
  try {
    step = 'picker'; await page.goto(U + '#/start'); await W(1200); await shot('00-start', true);
    ok(await page.locator('.rs-public', { hasText: 'Website visitor' }).count() === 1, 'public visitor card');
    step = 'maya'; await seat('Maya Ortiz'); ok((await hash()) === '#/today', 'maya home'); ok((await page.title()).startsWith('Today'), 'title today');
    await hs('today'); await shot('01-today');
    // ---- command palette
    step = 'palette'; await page.keyboard.press('ControlOrMeta+k'); await W(200);
    ok(await page.locator('.eos-pal').isVisible(), 'palette opens on cmd-k');
    await page.keyboard.type('brooks'); await W(150); await shot('02-palette');
    const n = await page.locator('.eos-pi').count(); ok(n >= 2, 'palette results for brooks ' + n);
    await page.keyboard.press('ArrowDown'); await page.keyboard.press('Enter'); await W(400);
    const h1 = await hash(); ok(h1 !== '#/today', 'palette enter navigated: ' + h1);
    await page.keyboard.press('ControlOrMeta+k'); await W(200); ok(await page.locator('.eos-pg-h', { hasText: 'Recent' }).count() === 1, 'recent shows');
    await page.keyboard.type('3B'); await W(150); ok(await page.locator('.eos-pi', { hasText: '3B' }).count() >= 1, 'unit search 3B');
    await page.keyboard.press('Escape'); await W(150); ok(await page.locator('.eos-pal').count() === 0, 'esc closes palette');
    await page.keyboard.press('ControlOrMeta+k'); await W(150); await page.keyboard.type('zzqx'); await W(150); ok(await page.locator('.eos-pal-empty').count() === 1, 'palette empty state'); await page.keyboard.press('Escape');
    if (w === 1440) { await page.locator('.eos-tools .eos-search').click(); await W(150); ok(await page.locator('.eos-pal').count() === 1, 'search box opens palette'); await page.locator('.eos-pal-scrim').click({ position: { x: 10, y: 10 } }); await W(150); ok(await page.locator('.eos-pal').count() === 0, 'scrim click closes palette'); }
    // ---- notifications
    step = 'notifs'; await page.goto(U + '#/today'); await W(400);
    const badge = async () => +(await page.locator('.eos-tools .eos-badge').textContent().catch(() => '0')) || 0;
    const b0 = await badge(); ok(b0 > 0, 'maya has unread ' + b0);
    await page.evaluate(() => notify({ who: 'maya', text: 'Shell test ping', route: 'deal/D2' })); await W(150);
    ok(await badge() === b0 + 1, 'notify bumps badge');
    await page.evaluate(() => notify({ who: 'jordan', text: 'not for maya', route: 'inbox' })); await W(100); ok(await badge() === b0 + 1, 'notify filtered by persona');
    await page.locator('.eos-tools .eos-bell').click(); await W(200); await shot('03-notifs');
    await page.locator('.eos-ni', { hasText: 'Shell test ping' }).click(); await W(400);
    ok((await hash()) === '#/deal/D2', 'notif click navigates'); ok(await badge() === b0, 'notif marked read');
    await page.locator('.eos-tools .eos-bell').click(); await W(150); await page.getByRole('button', { name: 'Mark all read' }).click(); await W(150);
    ok(await badge() === 0, 'mark all read'); await page.keyboard.press('Escape'); await W(100); ok(await page.locator('.eos-notif').count() === 0, 'esc closes notif panel');
    // ---- profile menu + settings
    step = 'profile'; await page.locator('.eos-tools .eos-avbtn').click(); await W(150); await shot('04-profile-menu');
    await page.getByRole('menuitem', { name: 'Settings' }).click(); await W(500); ok((await hash()) === '#/settings/profile', 'settings route');
    const email = page.locator('.eos-form input[type=email]'); await email.fill('maya@'); await page.getByRole('button', { name: 'Save changes' }).click(); await W(150);
    ok(await page.locator('.eos-err').count() >= 1, 'profile validation'); await shot('05-settings-profile-err');
    await email.fill('maya.ortiz@harborandvine.com'); await page.getByRole('button', { name: 'Save changes' }).click(); await W(700);
    ok(await page.locator('.toast', { hasText: 'Profile saved' }).count() === 1, 'profile saved toast');
    step = 'settings-notif'; await page.locator('.eos-set-nav button', { hasText: 'Notifications' }).click(); await W(400);
    const sw = page.locator('.eos-ntable .eos-sw').nth(2); const before = await sw.getAttribute('aria-checked'); await sw.click(); await W(100);
    ok((await sw.getAttribute('aria-checked')) !== before, 'pref toggle'); await shot('06-settings-notif', true);
    step = 'settings-integ'; await page.locator('.eos-set-nav button', { hasText: 'Integrations' }).click(); await W(400);
    await page.getByRole('switch', { name: 'Disconnect QuickBooks Online' }).click(); await W(250);
    ok(await page.locator('.eos-confirm').count() === 1, 'confirm modal');
    const inModal = await page.evaluate(() => !!document.activeElement.closest('.scrim')); ok(inModal, 'modal autofocus');
    for (let i = 0; i < 6; i++) await page.keyboard.press('Tab');
    ok(await page.evaluate(() => !!document.activeElement.closest('.scrim')), 'focus trapped in modal');
    await page.keyboard.press('Escape'); await W(150); ok(await page.locator('.eos-confirm').count() === 0, 'esc closes modal');
    await page.getByRole('switch', { name: 'Disconnect QuickBooks Online' }).click(); await W(200);
    await page.locator('.eos-confirm .scrim, .scrim').first().click({ position: { x: 5, y: 5 } }); await W(150); ok(await page.locator('.eos-confirm').count() === 0, 'scrim closes modal');
    await page.getByRole('switch', { name: 'Disconnect QuickBooks Online' }).click(); await W(200); await page.getByRole('button', { name: 'Disconnect', exact: true }).click(); await W(200);
    ok(await page.getByRole('switch', { name: 'Connect QuickBooks Online' }).count() === 1, 'qbo disconnected');
    await page.locator('.toast .eos-undo').click(); await W(200); ok(await page.getByRole('switch', { name: 'Disconnect QuickBooks Online' }).count() === 1, 'undo reconnects');
    await page.getByRole('switch', { name: 'Connect Google Workspace' }).click(); await W(200); ok(await page.locator('.pill', { hasText: 'Connecting' }).count() === 1, 'connecting state'); await W(800);
    ok(await page.getByRole('switch', { name: 'Disconnect Google Workspace' }).count() === 1, 'gcal connected'); await shot('07-settings-integ', true);
    step = 'settings-team'; await page.locator('.eos-set-nav button', { hasText: 'Team' }).click(); await W(400); await shot('08-settings-team', true);
    ok(await page.locator('.eos-matrix tbody tr').count() === 8, 'matrix rows');
    step = 'settings-brand'; await page.locator('.eos-set-nav button', { hasText: 'Branding' }).click(); await W(400);
    const bn = page.locator('.eos-form input').first(); await bn.fill(''); await page.getByRole('button', { name: 'Save branding' }).click(); await W(100); ok(await page.locator('.eos-err').count() === 1, 'brand validation');
    await bn.fill('Harbor & Vine Homes'); await page.locator('.eos-swc').nth(1).click(); await page.getByRole('button', { name: 'Save branding' }).click(); await W(200);
    ok(await page.locator('.side .brand small', { hasText: 'Harbor & Vine Homes' }).count() === 1, 'brand name applied'); await shot('09-settings-brand', true);
    await page.locator('.toast .eos-undo').click(); await W(150); ok(await page.locator('.side .brand small', { hasText: 'Harbor & Vine Realty' }).count() === 1, 'brand undo');
    step = 'settings-audit'; await page.locator('.eos-set-nav button', { hasText: 'Audit' }).click(); await W(400);
    ok(await page.locator('.eos-set-body table.t tbody tr').count() > 5, 'audit rows'); await shot('10-settings-audit', true);
    // ---- 404 + back/forward
    step = '404'; await page.goto(U + '#/inbox'); await W(400); await page.goto(U + '#/no-such-page'); await W(300);
    ok(await page.locator('.eos-state', { hasText: '404' }).count() === 1, '404 page'); ok((await page.title()).startsWith('Page not found'), '404 title'); await shot('11-404');
    await page.getByRole('button', { name: 'Go back' }).click(); await W(300); ok((await hash()) === '#/inbox', '404 go back');
    await page.goto(U + '#/people'); await W(300); await page.goBack(); await W(300); ok((await hash()) === '#/inbox', 'browser back'); await page.goForward(); await W(300); ok((await hash()) === '#/people', 'browser forward');
    // ---- skeleton on heavy page change
    step = 'skeleton'; await page.goto(U + '#/today'); await W(400);
    if (w === 1440) { await page.evaluate(() => { window.__sk = 0; new MutationObserver(() => { if (document.querySelector('.eos-sk')) window.__sk++; }).observe(document.body, { subtree: true, childList: true }); }); await page.locator('.side .nav', { hasText: 'Deals' }).click(); await W(50); ok(await page.evaluate(() => window.__sk) > 0, 'skeleton shows');
      await page.evaluate(() => { window.__sk = 0; }); await page.locator('.side .nav', { hasText: 'Website' }).click(); await W(300); ok(await page.evaluate(() => window.__sk) === 0, 'no skeleton on light page'); await page.goto(U + '#/pipeline'); await W(400); await W(400); ok(await page.locator('.eos-sk').count() === 0, 'skeleton clears'); }
    // ---- mobile chrome
    if (w === 400) {
      step = 'mobile'; await page.goto(U + '#/today'); await W(400); await hs('today mobile');
      ok(await page.locator('.eos-tabbar').isVisible(), 'tab bar visible'); ok(!(await page.locator('.side').isVisible()), 'drawer hidden');
      await page.getByRole('button', { name: 'Open menu' }).click(); await W(350); ok(await page.locator('.side .nav', { hasText: 'Back office' }).isVisible(), 'drawer opens'); await shot('12-drawer');
      await page.keyboard.press('Escape'); await W(350); ok(!(await page.locator('.side').isVisible()), 'esc closes drawer');
      await page.locator('.eos-tabbar button', { hasText: 'Inbox' }).click(); await W(400); ok((await hash()) === '#/inbox', 'tabbar nav');
      await page.locator('.eos-tabbar button', { hasText: 'More' }).click(); await W(350); await page.locator('.side .nav', { hasText: 'Settings' }).click(); await W(450); ok((await hash()).startsWith('#/settings'), 'drawer nav to settings'); await hs('settings mobile'); await shot('13-settings-mobile', true);
      await page.goto(U + '#/settings/team'); await W(400); await hs('team mobile'); await shot('13b-team-mobile', true);
      await page.locator('.eos-tools .eos-bell').click(); await W(200); await shot('14-notif-mobile'); await page.keyboard.press('Escape');
      for (const r of ['pipeline', 'people', 'deal/D1', 'settings/integrations', 'settings/audit']) { await page.goto(U + '#/' + r); await W(400); await hs(r); }
    }
    // ---- access denied + request access -> Maya approves
    step = 'denied'; await seat('Ray Alvarez'); ok((await hash()) === '#/pmops/tech', 'ray home');
    await page.goto(U + '#/today'); await W(400); ok(await page.locator('.eos-state', { hasText: "You don't have access" }).count() === 1, 'access denied page'); ok((await page.title()).startsWith('No access'), 'denied title'); await shot('15-denied');
    await page.getByRole('button', { name: 'Request access' }).click(); await W(200); ok(await page.getByRole('button', { name: 'Requested ✓' }).count() === 1, 'request sent');
    await seat('Maya Ortiz'); ok(await badge() >= 1, 'maya notified');
    await page.locator('.eos-tools .eos-bell').click(); await W(150); await page.locator('.eos-ni', { hasText: 'asked for access to Today' }).click(); await W(500);
    ok((await hash()) === '#/settings/team', 'request notif → team');
    await page.locator('.feed .it', { hasText: 'Ray Alvarez' }).getByRole('button', { name: 'Approve' }).click(); await W(200);
    await seat('Ray Alvarez'); await page.goto(U + '#/today'); await W(500); ok(await page.locator('.eos-state').count() === 0, 'ray can open today after approval');
    await page.goto(U + '#/backoffice'); await W(400);
    await page.getByRole('button', { name: 'Switch persona' }).first().click(); await W(300); ok((await hash()) === '#/start', 'denied → switch persona');
    // ---- client dock
    step = 'client'; await seat('Hannah Cole'); await W(300); ok(await page.locator('.eos-embed .eos-bell').isVisible(), 'client tools embedded in portal top bar'); ok(!(await page.locator('.eos-dock').isVisible()), 'dock hidden when portal embeds tools'); await page.locator('.eos-embed .eos-bell').click(); await W(200); await shot('16-client-notifs');
    ok(await page.locator('.eos-ni').count() >= 2, 'tenant notifications'); await page.keyboard.press('Escape');
    await page.goto(U + '#/today'); await W(300); ok(await page.locator('.eos-state', { hasText: "You don't have access" }).count() === 1, 'client denied office'); await shot('17-client-denied');
    // ---- guided tour
    step = 'tour'; await page.goto(U + '#/start'); await W(300); await page.getByRole('button', { name: /Watch the full story/ }).click(); await W(600);
    const want = ['#/site/L1', '#/inbox', '#/portal/offer', '#/seller/offers', '#/compliance', '#/commissions', '#/portal/myhome'];
    for (let i = 0; i < want.length; i++) {
      const hh = await hash(); ok(hh === want[i], `tour step ${i + 1} at ${hh} want ${want[i]}`);
      ok(await page.locator('.eos-tour').count() === 1, 'tour card ' + i);
      ok(await page.locator('.eos-state').count() === 0, 'tour step not denied/404 ' + i);
      await W(300); await shot('18-tour-' + (i + 1)); await hs('tour ' + i + ' ' + hh);
      if (i === 2) { await page.getByRole('button', { name: '← Previous step' }).click(); await W(500); ok((await hash()) === want[1], 'tour back'); await page.getByRole('button', { name: 'Next step →' }).click(); await W(500); }
      if (i < want.length - 1) { await page.getByRole('button', { name: 'Next step →' }).click(); await W(600); }
    }
    await page.getByRole('button', { name: 'Finish tour ✓' }).click(); await W(400); ok((await hash()) === '#/start', 'tour finish → start'); ok(await page.locator('.eos-tour').count() === 0, 'tour closed');
    // exit mid-way
    await page.getByRole('button', { name: /Watch the full story/ }).click(); await W(500); await page.getByRole('button', { name: 'Next step →' }).click(); await W(500);
    await page.getByRole('button', { name: 'Exit tour' }).click(); await W(300); ok((await hash()) === '#/start', 'tour exit');
    // ---- sign out
    step = 'signout'; await seat('Jordan Lee'); await page.locator('.eos-tools .eos-avbtn').click(); await W(150); await page.getByRole('menuitem', { name: 'Sign out' }).click(); await W(300);
    ok((await hash()) === '#/start', 'sign out → start'); ok(await page.evaluate(() => localStorage.getItem('eos-role')) === null, 'role cleared');
  } catch (e) { fails.push(w + ' THREW at ' + step + ': ' + e.message.split('\n')[0]); await shot('99-fail'); }
}
console.log(fails.length ? 'FAILS\n' + fails.join('\n') : 'ALL OK'); console.log('ERRS', JSON.stringify(errs));
await b.close();
