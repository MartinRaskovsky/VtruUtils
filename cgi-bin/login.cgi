#!/usr/bin/perl
use strict;
use warnings;
use CGI;
use CGI::Cookie;
use Digest::SHA qw(sha256_hex);
use lib '../perl-lib';
use DBConnect qw(get_dbh);
use EmailUtils qw(send_confirmation_email);
use Utils qw(log_error debug_log);

my $cgi = CGI->new;
print $cgi->header('text/html');
debug_log("login.cgi entered");

my $email = $cgi->param('email');
if (!$email || $email !~ /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/) {
    $email = $email // "";
    log_error("Invalid email address \"$email\"");
    print "Invalid email address \"$email\"\n";
    exit;
}

# Get database handle
my $dbh = get_dbh();
if (!$dbh) {
    print "<h3 style='color:red;'>Database connection error. Please try again later.</h3>";
    exit;
}

# Generate a new 6-digit confirmation code
my $code = int(rand(900000)) + 100000;  # Ensures a 6-digit number

debug_log("INSERT INTO users ($email, $code)");
# Store it in the database
my $sth = $dbh->prepare("INSERT INTO users (email, confirmation_code) VALUES (?, ?) ON DUPLICATE KEY UPDATE confirmation_code = ?");
$sth->execute($email, $code, $code);
debug_log("INSERTed");

# Send the email
send_confirmation_email($email, $code);
debug_log("email sent ($email, $code)");

print "<h2>Check your email for the confirmation code.</h2>";
print "<script>setTimeout(() => { openModal('codeModal'); }, 2000);</script>";

