#!/usr/bin/env perl

use strict;
use warnings;
use JSON;

use lib "../perl-lib";

use DBUtils qw(getEmailFromSession saveVaultSet saveWalletNames saveCurrentSet loadWalletNameCache getWalletName);
use Utils qw(debugLog printJSONError printJSONResult);
use CGI::Carp qw(fatalsToBrowser);

my $MODULE = "namesdb.cgi";
debugLog($MODULE, "Entered");

# Extract session_id from cookie
my $cookie = $ENV{'HTTP_COOKIE'} || '';
my ($session_id) = $cookie =~ /session_id=([a-f0-9]{64})/;

unless ($session_id) {
    printJSONError("Missing session");
    exit;
}

my $email = getEmailFromSession($session_id);
unless ($email) {
    printJSONError("Invalid session");
    exit;
}

# Read raw JSON from STDIN
my $raw_json = do { local $/; <STDIN> };

my $decoded = eval { decode_json($raw_json) };
if ($@ || ref($decoded) ne 'HASH') {
    printJSONError("Invalid JSON input");
    exit;
}

# Extract common fields
my $action  = $decoded->{action}  // '';
my $name    = $decoded->{name}    // '';
my $vault   = $decoded->{vault}   // '';
my $wallets = $decoded->{wallets};
$wallets = [] unless ref($wallets) eq 'ARRAY';

debugLog($MODULE, "action=$action");

# ✅ Action: Save Set only
if ($action eq 'set') {
    if (!$name || (!$vault && @$wallets == 0)) {
        printJSONError("Missing name or addresses");
        exit;
    }

    eval {
        saveVaultSet($email, $name, $vault, $wallets);
        printJSONResult("Set saved");
    };
    if ($@) {
        printJSONError("Save failed: $@");
    }
    exit;
}

# ✅ Action: Save Names only (no saving set here)
elsif ($action eq 'names') {
    my $name_map = $decoded->{wallet_names};
    unless ($name_map && ref($name_map) eq 'HASH') {
        printJSONError("Missing or invalid wallet_names");
        exit;
    }

    # Normalize wallet keys to lowercase
    %$name_map = map { lc($_) => $name_map->{$_} } keys %$name_map;

    # Validate no duplicate names (case-insensitive)
    my %seen;
    for my $n (values %$name_map) {
        next unless defined $n && $n ne '';
        my $norm = lc($n);
        if ($seen{$norm}++) {
            printJSONError("Duplicate names are not allowed.");
            exit;
        }
    }

    eval {
        saveWalletNames(%$name_map);
        printJSONResult("Wallet names saved");
    };
    if ($@) {
        printJSONError("Save failed: $@");
    }
    exit;
}

# ✅ NEW Action: Load (names) + Save current set
elsif ($action eq 'load') {
    if (!$name || (!$vault && @$wallets == 0)) {
        printJSONError("Missing name or addresses");
        exit;
    }

    my %result;

    eval {
        saveCurrentSet($email, $name, $vault, $wallets);
        loadWalletNameCache();

        for my $w (@$wallets) {
            $result{$w} = getWalletName($w);
        }

        printJSONResult(\%result);
    };
    if ($@) {
        printJSONError("Load failed: $@");
    }
    exit;
}

# ❌ Fallback
else {
    printJSONError("Invalid action: must be 'set', 'names', or 'load'");
    exit;
}

