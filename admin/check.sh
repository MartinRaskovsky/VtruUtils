#!/bin/sh

FILES="`cat files.txt`"

for a in $FILES
do
  b=`echo $a | sed 's/\.generated//'`
  echo "diff -w $a $b"
  diff -w $a $b
done

