#!/bin/sh

MYVAULT=`./showConfig.js | egrep VAULT_ADDRESS | sed 's/VAULT_ADDRESS=//'`

../bin/getVaultDetails.js $MYVAULT
