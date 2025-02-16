#!/bin/sh

WALLETS=`../tests/showConfig.js | egrep WALLETS= | sed 's/WALLETS=//'`

getDetailStake.js	-f $WALLETS
getDetailVibe.js	-f $WALLETS
getDetailVortex.js	-f $WALLETS
getDetailSevoStake.js	-f $WALLETS
