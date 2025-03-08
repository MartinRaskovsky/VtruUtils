#!/usr/bin/perl
use strict;
use warnings;
use CGI;
use Digest::SHA qw(sha256_hex);

use lib '../perl-lib';
use DBUtils qw(putConfirmationCode);
use EmailUtils qw( sendConfirmationEmail);
use Utils qw(logError debugLog trimSpaces);

my $MODULE = "login.cgi";

my $cgi = CGI->new;
print $cgi->header('text/html');
debugLog($MODULE, "Entered");

my $email = trimSpaces(scalar $cgi->param('email'));
if (!$email || $email !~ /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/) {
    $email = $email // "";
    logError("Invalid email address \"$email\"");
    print "Invalid email address \"$email\"\n";
    exit;
}

my $code = int(rand(900000)) + 100000;  # Ensures a 6-digit number
putConfirmationCode($email, $code);
sendConfirmationEmail($email, $code);

print "<h2>Check your email for the confirmation code.</h2>";
print "<script>setTimeout(() => { openModal('codeModal'); }, 2000);</script>";

