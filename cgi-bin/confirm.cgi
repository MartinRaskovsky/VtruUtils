#!/usr/bin/perl
use strict;
use warnings;
use CGI;
use Digest::SHA qw(sha256_hex);

use lib '../perl-lib';
use Utils qw (debug_log2);
use DBUtils qw(get_user_by_code update_session_id);
use Dashboard qw(get_main_wrapper);
use Cookies qw(set_session_cookie);

my $MODULE = "confirm.cgi";

debug_log2($MODULE, "Entered");

my $cgi = CGI->new;

sub invalidCode {
    my ($who, $confirmation_code) = @_;
    $confirmation_code = $confirmation_code || "";
    debug_log2($MODULE, "invalidCode($who, $confirmation_code)");
    my $message = "Invalid confirmation_code on $who \"$confirmation_code\"";
    print $message;
}

my $confirmation_code = $cgi->param('code');
if (!$confirmation_code || $confirmation_code !~ /^\d{6}$/) {
    print $cgi->header('text/html');
    invalidCode("entry", $confirmation_code);
    exit;
}

my $session_id = undef;
my $user = get_user_by_code($confirmation_code);
if ($user) {
    # Generate session_id
    $session_id = sha256_hex(time() . rand());
    set_session_cookie($session_id);    # before header
}
print $cgi->header('text/html');         # no prints before this line

if ($user) {
    debug_log2($MODULE, "session_id=$session_id");
    update_session_id($user->{email}, $session_id);
    print "<!--Success-->";
    print get_main_wrapper($user);
} else {
    invalidCode('exit', $confirmation_code);
}

    # If no confirmation_code, trigger login modal
    if ($user) {
        debug_log2($MODULE, "Active");
    } else {
        debug_log2($MODULE, "loginModald");
        print <<'HTML';
        <script>
            window.onload = function () {
                openAuthModal("loginModal");
            };
        </script>
HTML
    }

