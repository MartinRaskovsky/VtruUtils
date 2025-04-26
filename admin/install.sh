#!/bin/sh

FILES="`cat files.txt`"

for a in $FILES
do
  b=`echo $a | sed 's/\.generated//'`
  mv $b $b.bak
  mv $a $b
  ls -l $b
done

