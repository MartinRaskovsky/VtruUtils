#!/usr/bin/perl
use strict;
use warnings;
use CGI;
use Digest::SHA qw(sha256_hex);

use lib '../perl-lib';
use DBUtils qw(store_confirmation_code);
use EmailUtils qw(send_confirmation_email);
use Utils qw(log_error debug_log2);

my $MODULE = "login.cgi";

my $cgi = CGI->new;
print $cgi->header('text/html');
debug_log2($MODULE, "Entered");

my $email = $cgi->param('email');
if (!$email || $email !~ /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/) {
    $email = $email // "";
    log_error("Invalid email address \"$email\"");
    print "Invalid email address \"$email\"\n";
    exit;
}

my $code = int(rand(900000)) + 100000;  # Ensures a 6-digit number
store_confirmation_code($email, $code);
send_confirmation_email($email, $code);

print "<h2>Check your email for the confirmation code.</h2>";
print "<script>setTimeout(() => { openModal('codeModal'); }, 2000);</script>";

