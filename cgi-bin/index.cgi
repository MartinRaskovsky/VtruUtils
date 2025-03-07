#!/usr/bin/perl
use strict;
use warnings;
use CGI;
use DBI;

use lib '../perl-lib';
use DBUtils qw(get_user_by_session);
use Dashboard qw(load_dashboard);
use Utils qw(debug_log2 log_error print_error_response);
use Cookies qw(get_session_cookie);

my $MODULE = "index.cgi";

debug_log2($MODULE, "Entered");

my $cgi = CGI->new;
print $cgi->header('text/html');

# Read confirmation_code from cookies

eval {
    my $session_id = get_session_cookie();
    my $user = get_user_by_session($session_id);

    load_dashboard($user);

    # If no confirmation_code, trigger login modal
    if (!$user) {
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
    log_error("index.cgi Error: $@");
    print_error_response($cgi, { success => 0, error => "Invalid Request format received" });
}
