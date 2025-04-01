#!/usr/bin/env perl

use strict;
use warnings;
use CGI;
use JSON;
use lib '../perl-lib';

use DBUtils qw(getEmailFromSession saveVaultSet);
use Utils qw(debugLog logError);
use CGI::Carp qw(fatalsToBrowser);

my $MODULE = "savesets.cgi";
debugLog($MODULE, "Entered");

my $cgi = CGI->new;
print $cgi->header('application/json');

# Extract session_id from cookie
my $cookie = $ENV{'HTTP_COOKIE'} || '';
my ($session_id) = $cookie =~ /session_id=([a-f0-9]{64})/;

unless ($session_id) {
    print encode_json({ success => \0, message => "Missing session" });
    exit;
}

my $email = getEmailFromSession($session_id);

unless ($email) {
    print encode_json({ success => \0, message => "Invalid session" });
    exit;
}

my $name   = $cgi->param('name')   || '';
my $vault  = $cgi->param('vault')  || '';
my $wallets_raw = $cgi->param('wallets') || '';
my @wallets = grep { $_ ne '' } split(/\s+/, $wallets_raw);

if (!$name || scalar(@wallets) == 0 && !$vault) {
    print encode_json({ success => \0, message => "Missing name or addresses" });
    exit;
}

eval {
    saveVaultSet($email, $name, $vault, \@wallets);
    print encode_json({ success => \1 });
};

if ($@) {
    logError("savesets.cgi failed: $@");
    print encode_json({ success => \0, message => "Database error" });
}

