#!/bin/sh

(
    cd ../perl-lib
    back Defs.generated.pm
    cat Defs.generated.pm-1 \
    | sed 's/getDetailStake/getDetailVtruStaked/' \
    | sed 's/getDetailBsc.js/getDetailSevoXStaked.js/' \
    > Defs.generated.pm
    rm -f Defs.generated.pm-1
)

(
    cd ../next/lib
    back libDefs.generated.js
    cat libDefs.generated.js-1 \
    | sed 's/getDetailStake/getDetailVtruStaked/' \
    | sed 's/getDetailBsc.js/getDetailSevoXStaked.js/' \
    > libDefs.generated.js
    rm -f libDefs.generated.js-1
)
