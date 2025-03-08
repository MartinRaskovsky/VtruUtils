package DBConnect;

use strict;
use warnings;
use DBI;
use Exporter 'import';

use lib '../perl-lib';
use Utils qw(debugLog);

our @EXPORT_OK = qw(getDbh);

my $MODULE = "DBConnect";

# Database configuration (Consider moving these to a config file)
my $DB_NAME = "martin_web3";
my $DB_HOST = "localhost";
my $DB_USER = "martin_web3";
my $DB_PASS = "Martin_3Web";

# Get database handle
sub getDbh {
    my $dsn = "DBI:mysql:database=$DB_NAME;host=$DB_HOST";
    my $dbh = DBI->connect($dsn, $DB_USER, $DB_PASS, { RaiseError => 1, AutoCommit => 1 });

    if (!defined $dbh) {
        debugLog($MODULE, "Failed to connect to $dsn)");
        return undef;
    }

    if (!$dbh) {
        my $error_msg = "Database connection failed: $DBI::errstr";
        debugLog($MODULE, $error_msg);
        return undef;
    }
    return $dbh;
}

1;  # End of module

