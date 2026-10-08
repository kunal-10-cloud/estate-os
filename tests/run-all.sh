#!/usr/bin/env bash
# Runs every suite against EOS_URL (default http://localhost:3000/index.html). Start the app first: cd frontend && yarn start
cd "$(dirname "$0")"; mkdir -p qa-out shots-portal-qa
T=${*:-"roles-test eos seller-test residents-test txn-test txn-prod-test shell-prod-test site-prod-test portals-prod-test office-prod-test portal journey"}
fail=0
for t in $T; do
  if [ "$t" = portal ]; then node portal.mjs shots-portal-qa; else node "$t.mjs"; fi > "qa-out/$t.log" 2>&1
  if grep -qE "^(OK|ALL OK)" "qa-out/$t.log"; then echo "PASS  $t"; else echo "FAIL  $t  (see tests/qa-out/$t.log)"; fail=1; fi
done
exit $fail
