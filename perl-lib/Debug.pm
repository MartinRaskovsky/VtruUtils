package Debug;

use strict;
use warnings;
use Exporter 'import';
use Scalar::Util qw(reftype);

our @EXPORT_OK = qw(getType);

sub getType {
    my ($var) = @_;

    return "Undefined"       if !defined $var;
    return "Array Reference" if reftype($var) && reftype($var) eq 'ARRAY';
    return "Hash Reference"  if reftype($var) && reftype($var) eq 'HASH';
    return "Code Reference"  if reftype($var) && reftype($var) eq 'CODE';
    return "Scalar Reference" if reftype($var) && reftype($var) eq 'SCALAR';
    return "Scalar (string)" if !reftype($var);  # If it's not a reference, assume scalar

    return "Unknown Type";
}

1;

