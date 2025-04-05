#!/bin/sh

cd ../shared
back constants.generated.js
cat constants.generated.js-1 \
| sed 's/VTRU on Ethereum/VTRU on ETH/' \
| sed 's/VTRU on BNB Chain/VTRU on BSC/' \
> constants.generated.js
rm -f constants.generated.js-1
