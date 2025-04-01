#!/usr/bin/env perl

use strict;
use warnings;
use CGI;
use JSON;
use lib '../perl-lib';

use DBUtils qw(getEmailFromSession deleteVaultSet);
use Utils qw(debugLog logError);
use CGI::Carp qw(fatalsToBrowser);

my $MODULE = "deleteset.cgi";
debugLog($MODULE, "Entered");

my $cgi = CGI->new;
print $cgi->header('application/json');

# Get session from cookie
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

my $name = $cgi->param('name') || '';

unless ($name) {
    print encode_json({ success => \0, message => "Missing set name" });
    exit;
}

eval {
    my $ok = deleteVaultSet($email, $name);
    debugLog($MODULE, "deleteVaultSet=$ok");

    if ($ok) {
        print encode_json({ success => \1 });
    } else {
        print encode_json({ success => \0, message => "Set not found or could not be deleted" });
    }
};

if ($@) {
    logError("deleteset.cgi error: $@");
    print encode_json({ success => \0, message => "Server error" });
}

