#!/usr/bin/perl
use strict;
use warnings;
use CGI;

use lib '../perl-lib';
use Utils qw(debugLog trimSpaces);
use Dashboard qw(getMainWrapper);
use LoginManagment qw(createSession);

my $MODULE = "confirm.cgi";

debugLog($MODULE, "Entered");

my $cgi = CGI->new;
my $confirmation_code = trimSpaces(scalar $cgi->param('code'));

if (!$confirmation_code || $confirmation_code !~ /^\d{6}$/) {
    debugLog($MODULE, "Invalid confirmation code: $confirmation_code");
    print $cgi->header('text/html');
    print "Invalid confirmation code.";
    exit;
}

my ($email, $session_id) = createSession($confirmation_code);

print $cgi->header('text/html');         # no prints before this line

if ($email) {
    debugLog($MODULE, "session_id=$session_id");
    print "<!--Success-->";
    print getMainWrapper($email);
} else {
    debugLog($MODULE, "Invalid confirmation code");
    print "Invalid confirmation code.";
    print <<'HTML';
    <script>
        window.onload = function () {
            openAuthModal("loginModal");
        };
    </script>
HTML
}

