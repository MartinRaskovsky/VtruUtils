#!/bin/sh

for a in test*.js
do
  echo $a
  echo
  $a
  echo '==========================================================='
  echo
done

