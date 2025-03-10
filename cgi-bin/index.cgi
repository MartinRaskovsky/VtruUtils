#!/usr/bin/perl
use strict;
use warnings;
use CGI;
use DBI;

use lib '../perl-lib';
use DBUtils qw(getEmailFromSession);
use Dashboard qw(loadDashboard);
use Utils qw(debugLog logError printErrorResponse);
use Cookies qw(getSessionCookie deleteSessionCookie);

my $MODULE = "index.cgi";

debugLog($MODULE, "Entered");

my $cgi = CGI->new;

# Read confirmation_code from cookies

eval {
    my $session_id = getSessionCookie();
    my $email = getEmailFromSession($session_id);

    if (!defined $email) {
        debugLog($MODULE, "Cookie with no DB entry, deleteing cookie");
        deleteSessionCookie(); # before content header;
        $session_id = 0;
    }

    print $cgi->header('text/html'); # after deleting cookie

    loadDashboard($email);

    # If no confirmation_code, trigger login modal
    if ($session_id) {
        debugLog($MODULE, "Active");
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
