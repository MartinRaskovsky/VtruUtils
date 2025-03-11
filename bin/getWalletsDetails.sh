#!/bin/sh

getSections.js `cat ../../myVaultAndWallets.txt` > x.json
jsonWallet2Csv.js -f x 

rm -f x.json
ls -l x.csv
