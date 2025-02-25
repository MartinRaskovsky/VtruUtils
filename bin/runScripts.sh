#!/bin/sh

WALLETS=`../tests/showConfig.js | egrep WALLETS= | sed 's/WALLETS=//'`
VAULT_ADDRESS=`../tests/showConfig.js | egrep VAULT_ADDRESS= | sed 's/VAULT_ADDRESS=//'`

for script in \
    getBalanceVtruHeld getBalanceVtruStaked getBalanceVerse getBalanceVibe getBalanceVortex \
    getBalanceEth getBalanceBnb \
    getBalanceSevoStaked \
    getDetailVtruStaked getDetailVibe getDetailVortex getDetailSevoStaked getSections
do
    GROUP=""
    if test $script = "getDetailVtruStaked"
    then
	GROUP="-g month"
    fi
    echo "---------------------------------------------------"
    echo "$script.js -f -v \$VAULT_ADDRESS \$WALLETS \$GROUP"
    echo "---------------------------------------------------"
    eval $script.js -f -v $VAULT_ADDRESS $WALLETS $GROUP
    echo
done
