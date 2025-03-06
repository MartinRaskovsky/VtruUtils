#!/usr/bin/perl
use strict;
use warnings;
use CGI;
use CGI::Cookie;
use Digest::SHA qw(sha256_hex);

use lib '../perl-lib';
use Utils qw (debug_log);
use DBConnect qw(get_dbh);

my $cgi = CGI->new;
print $cgi->header('text/html');
debug_log("confirm.cgi entered");

sub invalidCode {
    my ($who, $confirmation_code) = @_;
    $confirmation_code = $confirmation_code || "";
    my $message = "Invalid confirmation_code on $who \"$confirmation_code\"";
    debug_log($message);
    print $message;
}

my $confirmation_code = $cgi->param('code');
if (!$confirmation_code || $confirmation_code !~ /^\d{6}$/) {
    invalidCode("entry", $confirmation_code);
    exit;
}

# Get database handle
my $dbh = get_dbh();

# Verify confirmation confirmation_code
my $sth = $dbh->prepare("SELECT email FROM users WHERE confirmation_code = ?");
$sth->execute($confirmation_code);
my $user = $sth->fetchrow_hashref;
debug_log("got $user->{email} for $confirmation_code") if $user;

if ($user) {
    # Generate session_id
    my $session_id = sha256_hex(time() . rand());
    debug_log("session_id = $session_id");

    # Store session_id in a cookie
    my $cookie = CGI::Cookie->new(
        -name    => 'session_id',
        -value   => $session_id,
        -expires => '+1M'  # Cookie lasts one month
    );
    debug_log("cookie=$cookie");
    
    # Store session_id in the database
    eval {
        my $sth_update = $dbh->prepare("UPDATE users SET session_id = ? WHERE email = ?");
        debug_log("Storing session_id in DB for $user->{email}");
        $sth_update->execute($session_id, $user->{email});
        $dbh->commit();
        debug_log("session_id stored in DB");

        # No need to validate immediately after storing the session_id in DB
        # my $sth = $dbh->prepare("SELECT email FROM users WHERE session_id = ?");
        # $sth->execute($session_id);
        # my $user = $sth->fetchrow_hashref;
        # if (!$user) { ... } # this validation happens on future requests
        #debug_log("Session verified for user $user->{email}");
    };
    if ($@) {
        debug_log("CGI Script Error: $@");
    }


    print "Success";
} else {
    invalidCode('exit', $confirmation_code);
}

  # Load dashboard.html
    open my $fh, '<', '../public/dashboard.html' or die "Cannot open dashboard.html: $!";
    my $dashboard = do { local $/; <$fh> };
    close $fh;

    debug_log("responding with dashboard");
    print $dashboard;

    # If no confirmation_code, trigger login modal
    if ($user) {
        debug_log("no modal");
        #print <<'HTML';
        #<script>
        #    window.onload = function () {
        #        closeAuthModal("loginModal");
        #    };
        #</script>
#HTML
    } else {
        debug_log("loginModald");
        print <<'HTML';
        <script>
            window.onload = function () {
                openAuthModal("loginModal");
            };
        </script>
HTML
    }

