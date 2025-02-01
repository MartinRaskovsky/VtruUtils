#!/bin/sh

MYVAULT=`./showConfig.js | egrep VAULT_ADDRESS | sed 's/VAULT_ADDRESS=//'`
echo $MYVAULT

../bin/getVaultDetails.js $MYVAULT
