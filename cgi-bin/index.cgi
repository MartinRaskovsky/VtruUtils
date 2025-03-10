#!/usr/bin/perl
use strict;
use warnings;
use CGI;

use lib '../perl-lib';
use Dashboard qw(loadDashboard);
use Utils qw(debugLog logError printErrorResponse);
use LoginManagment qw(getSessionEmail deleteSession);

my $MODULE = "index.cgi";

debugLog($MODULE, "Entered");

my $cgi = CGI->new;
eval {
    my ($email, $session_id) = getSessionEmail();  # ✅ Ensure session is retrieved before printing the header

    if (!defined $email) {
        debugLog($MODULE, "Cookie with no DB entry, deleting cookie");
        deleteSession();
        $session_id = 0;
    }

    print $cgi->header('text/html');  # ✅ Print header after cookies are handled
    loadDashboard($email);

    if ($session_id) {
        debugLog($MODULE, "Active session");
        print <<'HTML';
        <script>
            window.onload = function () {
                closeAuthModal("loginModal");
                toggleLogoutButton(true);
            };
            sessionExists = true;
        </script>
HTML
    } else {
        debugLog($MODULE, "loginModal");
        print <<'HTML';
        <script>
            window.onload = function () {
                openAuthModal("loginModal");
            };
        </script>
HTML
    }
};

if ($@) {
    logError("index.cgi Error: $@");
    printErrorResponse($cgi, { success => 0, error => "Invalid Request format received" });
}

