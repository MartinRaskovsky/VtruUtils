#!/usr/bin/perl
use strict;
use warnings;
use CGI;
use Digest::SHA qw(sha256_hex);

use lib '../perl-lib';
use DBUtils qw(putConfirmationCode updateKeepLoggedIn);
use MailMessages qw(sendConfirmationEmail);
use Utils qw(logError debugLog trimSpaces);

my $MODULE = "login.cgi";
debugLog($MODULE, "Entered");

# ✅ Print environment variables to debug server configuration
#debugLog($MODULE, "Environment Variables:");
#foreach my $key (sort keys %ENV) {
#    debugLog($MODULE, "$key => $ENV{$key}");
#}

my $cgi = CGI->new;
print $cgi->header('text/html');

my $email = trimSpaces(scalar $cgi->param('email'));
my $keep_logged_in = $cgi->param('keepLoggedIn') // "0";

if (!$email || $email !~ /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/) {
    logError("Invalid email address \"$email\"");
    print "<p>Invalid email address \"$email\"</p>";
    exit;
}

my $code = int(rand(900000)) + 100000;
putConfirmationCode($email, $code);
updateKeepLoggedIn($email, $keep_logged_in);
sendConfirmationEmail($email, $code);

# ✅ Redirect to the confirmation page
print "<meta http-equiv='refresh' content='0; url=confirm.cgi?email=$email'>";
