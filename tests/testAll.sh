#!/bin/sh

for a in test*.js
do
  echo $a
  echo
  $a
  echo '==========================================================='
  echo
done > testAll.txt 2>&1

TESTS=`ls test*.js | wc -l | sed 's/ *//'`
RUNOK=`cat testAll.txt | grep 'All [A-Za-z0-9]* tests passed successfully!' | wc -l | sed 's/ *//'`

echo "$TESTS tests and $RUNOK run OK"

