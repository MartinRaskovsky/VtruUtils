#!/bin/sh

FILES="
../shared/constants.generated.js
../lib/TokenFactory.generated.js
../lib/libSections.generated.js
../perl-lib/Defs.generated.pm
../lib/libWeb3.generated.js
../perl-lib/SectionSummary.generated.pm
"

for a in $FILES
do
  b=`echo $a | sed 's/.generated//'`
  mv $b $b.bak
  mv $a $b
  ls -l $b
done

