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

my $cgi = CGI->new;
print $cgi->header('text/html');
debugLog($MODULE, "Entered");

my $email = trimSpaces(scalar $cgi->param('email'));
my $keep_logged_in = $cgi->param('keepLoggedIn') // "0";  # Default to "0" (not kept logged in)

# ✅ Validate email format
if (!$email || $email !~ /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/) {
    $email = $email // "";
    logError("Invalid email address \"$email\"");
    print "Invalid email address \"$email\"\n";
    exit;
}

# ✅ Store confirmation code
my $code = int(rand(900000)) + 100000;  # Ensures a 6-digit number
putConfirmationCode($email, $code);

# ✅ Store "keep me logged in" preference in the database
updateKeepLoggedIn($email, $keep_logged_in);

# ✅ Send confirmation email
sendConfirmationEmail($email, $code);

# ✅ Notify the user
print "<h2>Check your email for the confirmation code.</h2>";
print "<script>setTimeout(() => { openModal('codeModal'); }, 2000);</script>";

