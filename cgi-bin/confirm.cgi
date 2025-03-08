#!/usr/bin/perl
use strict;
use warnings;
use CGI;
use Digest::SHA qw(sha256_hex);

use lib '../perl-lib';
use Utils qw (debugLog trimSpaces);
use DBUtils qw( getEmailFromCode putSessionId);
use Dashboard qw(getMainWrapper);
use Cookies qw(setSessionCookie);

my $MODULE = "confirm.cgi";

debugLog($MODULE, "Entered");

my $cgi = CGI->new;

sub invalidCode {
    my ($who, $confirmation_code) = @_;
    $confirmation_code = $confirmation_code // "";
    debugLog($MODULE, "invalidCode($who, $confirmation_code)");
    my $message = "Invalid confirmation_code on $who \"$confirmation_code\"";
    print $message;
}

my $confirmation_code = trimSpaces(scalar $cgi->param('code'));
if (!$confirmation_code || $confirmation_code !~ /^\d{6}$/) {
    print $cgi->header('text/html');
    invalidCode("entry", $confirmation_code);
    exit;
}

my $session_id = undef;
my $email = getEmailFromCode($confirmation_code);
if ($email) {
    # Generate session_id
    $session_id = sha256_hex(time() . rand());
    setSessionCookie($session_id);    # before header
}

print $cgi->header('text/html');         # no prints before this line

if ($email) {
    debugLog($MODULE, "session_id=$session_id");
    putSessionId($email, $session_id);
    print "<!--Success-->";
    print getMainWrapper($email);
} else {
    invalidCode('exit', $confirmation_code);
}

    # If no confirmation_code, trigger login modal
    if ($email) {
        debugLog($MODULE, "Active");
    } else {
        debugLog($MODULE, "loginModald");
        print <<'HTML';
        <script>
            window.onload = function () {
                openAuthModal("loginModal");
            };
        </script>
HTML
    }

