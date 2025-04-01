#!/usr/bin/env perl

use strict;
use warnings;
use CGI;
use JSON;
use lib '../perl-lib';

use DBUtils qw(getEmailFromSession listVaultSets);
use Utils qw(debugLog logError);
use CGI::Carp qw(fatalsToBrowser);

my $MODULE = "listsets.cgi";
debugLog($MODULE, "Entered");

my $cgi = CGI->new;
print $cgi->header('application/json');

# Extract session from cookie
my $cookie = $ENV{'HTTP_COOKIE'} || '';
my ($session_id) = $cookie =~ /session_id=([a-f0-9]{64})/;

unless ($session_id) {
    print encode_json({ sets => [] });
    exit;
}

my $email = getEmailFromSession($session_id);

unless ($email) {
    print encode_json({ sets => [] });
    exit;
}

eval {
    my @sets = listVaultSets($email);
    print encode_json({ sets => \@sets });
};

if ($@) {
    logError("listsets.cgi error: $@");
    print encode_json({ sets => [] });
}

