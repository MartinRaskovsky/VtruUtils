#!/bin/sh

WALLETS=`../tests/showConfig.js | egrep WALLETS= | sed 's/WALLETS=//'`

for script in getDetailStake getDetailVibe getDetailVortex getDetailSevoStake getSections
do
    echo "---------------------------------------------------"
    echo "$script.js -f \$WALLETS"
    echo "---------------------------------------------------"
    $script.js -f $WALLETS
    echo
done
