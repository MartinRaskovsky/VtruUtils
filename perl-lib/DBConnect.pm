package DBConnect;

use strict;
use warnings;
use DBI;
use Exporter 'import';

use lib '../perl-lib';  # Ensure Utils is included
use Utils qw(debug_log2); # Use debug_log for logging

our @EXPORT_OK = qw(get_dbh);

my $MODULE = "DBConnect";

# Database configuration (Consider moving these to a config file)
my $DB_NAME = "martin_web3";
my $DB_HOST = "localhost";
my $DB_USER = "martin_web3";
my $DB_PASS = "Martin_3Web";

# Get database handle
sub get_dbh {
    debug_log2($MODULE, "get_dbh()");
    my $dsn = "DBI:mysql:database=$DB_NAME;host=$DB_HOST";
    debug_log2($MODULE, "DSN=$dsn");
    my $dbh = DBI->connect($dsn, $DB_USER, $DB_PASS, { RaiseError => 1, AutoCommit => 1 });
    if (!defined $dbh) {
        debug_log2($MODULE, "Failed to connect to $dsn)");
        return undef;
    }
    debug_log2($MODULE, "DBH=$dbh");
   
    if (!$dbh) {
        my $error_msg = "Database connection failed: $DBI::errstr";
        debug_log2($MODULE, $error_msg);
        return undef;           # Allow caller to handle the error
    }
    return $dbh;
}

1;  # End of module

