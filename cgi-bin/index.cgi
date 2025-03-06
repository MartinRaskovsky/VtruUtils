#!/usr/bin/perl
use strict;
use warnings;
use CGI;
use CGI::Cookie;
use DBI;
use lib '../perl-lib';
use DBConnect qw(get_dbh);
use Utils qw(debug_log log_error print_error_response);

debug_log('index.cgi entered');

my $cgi = CGI->new;
print $cgi->header('text/html');


# Read confirmation_code from cookies

eval {
    my %cookies = CGI::Cookie->fetch;

    debug_log('Getting confirmation_code');
    my $confirmation_code = $cookies{'confirmation_code'} ? $cookies{'confirmation_code'}->value : '';

    debug_log("confirmation_code=\"$confirmation_code\" for session.");

    # Connect to MySQL
    my $dbh = get_dbh();
    my $sth = $dbh->prepare("SELECT email FROM users WHERE confirmation_code = ?");
    $sth->execute($confirmation_code);
    my $user = $sth->fetchrow_hashref;

    # Load dashboard.html
    open my $fh, '<', '../public/dashboard.html' or die "Cannot open dashboard.html: $!";
    my $dashboard = do { local $/; <$fh> };
    close $fh;

    print $dashboard;

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

