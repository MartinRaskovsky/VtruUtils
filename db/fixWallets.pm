#!/usr/bin/env perl
use strict;
use warnings;
use DBI;

use lib "../perl-lib";
use DBConnect qw(getDbh);

my $dbh = getDbh();

my $select = $dbh->prepare("SELECT wallet_address, name FROM names");
my $delete = $dbh->prepare("DELETE FROM names");
my $insert = $dbh->prepare("INSERT INTO names (wallet_address, name) VALUES (?, ?)");

$select->execute();

my %normalized;
while (my ($wallet, $name) = $select->fetchrow_array()) {
    my $lc_wallet = lc($wallet);
    $normalized{$lc_wallet} = $name;  # last one wins
}

# Clear table and insert cleaned values
$dbh->begin_work;
$delete->execute();

foreach my $wallet (keys %normalized) {
    $insert->execute($wallet, $normalized{$wallet});
}
$dbh->commit;

print "✅ Normalization complete. " . scalar(keys %normalized) . " wallet names updated.\n";

