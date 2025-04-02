#!/usr/bin/env perl

use strict;
use warnings;
use CGI;
use JSON;
use lib '../perl-lib';

use DBUtils qw(getEmailFromSession getSetByName);
use Utils qw(debugLog logError);
use CGI::Carp qw(fatalsToBrowser);

my $MODULE = "loadset.cgi";
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
    my ($vault, $wallets_ref) = getSetByName($email, $name);

    unless (defined $vault || @$wallets_ref) {
        print encode_json({ success => \0, message => "Set not found" });
        return;
    }

    print encode_json({
        success => \1,
        vault   => $vault,
        wallets => $wallets_ref,
        name    => $name
    });
};

if ($@) {
    logError("loadset.cgi error: $@");
    print encode_json({ success => \0, message => "Server error" });
}

