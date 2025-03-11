package Cookies;

use strict;
use warnings;
use CGI::Cookie;

use lib "../perl-lib";
use Conf;
use Utils qw(debugLog);

use Exporter 'import';
our @EXPORT_OK = qw(setSessionCookie getSessionCookie deleteSessionCookie);

my $MODULE = 'Cookies';

# ✅ Set session_id cookie with optional long expiration
sub setSessionCookie {
    my ($session_id, $keep_logged_in) = @_;
    if (!defined $session_id || !defined $keep_logged_in) { 
        $session_id = $session_id // '';
        $keep_logged_in = $keep_logged_in // '';
        return; 
    }
    debugLog($MODULE, "setSessionCookie($session_id, keep_logged_in=$keep_logged_in)");

    # ✅ Determine cookie expiration
    my $expires = $keep_logged_in ? 'Fri, 31 Dec 9999 23:59:59 GMT' : undef;  # Long-lasting or session-based

    my $cookie = CGI::Cookie->new(
        -name    => 'session_id',
        -value   => $session_id,
        -expires => $expires,
        -path    => '/',
        -secure   => Conf::get('COOKIE_SECURE'),
        -httponly => 1,
    );

    debugLog($MODULE, "Set-Cookie: $cookie");
    print "Set-Cookie: $cookie\n";
}

# ✅ Get session_id cookie
sub getSessionCookie {
    debugLog($MODULE, "getSessionCookie()");
    my %cookies = CGI::Cookie->fetch;
    my $session_id = $cookies{'session_id'} ? $cookies{'session_id'}->value : undef;
    if ($session_id) {
        debugLog($MODULE, "getSessionCookie=$session_id");
    } else {
        debugLog($MODULE, "session_id cookie not found");
    }
    return $session_id;
}

# ✅ Remove session_id cookie (logout)
sub deleteSessionCookie {
    debugLog($MODULE, "deleteSessionCookie()");
    
    my $cookie = CGI::Cookie->new(
        -name    => 'session_id',
        -value   => '',
        -expires => '-1d',  # Expire immediately
        -path    => '/',
    );

    print "Set-Cookie: $cookie\n";
}

1;

