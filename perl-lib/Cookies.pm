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

# Set session_id cookie
sub setSessionCookie {
    my ($session_id) = @_;
    debugLog($MODULE, "setSessionCookie($session_id)");
    
    my $cookie = CGI::Cookie->new(
        -name    => 'session_id',
        -value   => $session_id,
        -expires => '+1M',  # 1-month expiration
        -path    => '/',
        -secure   => Conf::get('COOKIE_SECURE'),
        -httponly => 1,
    );
    
    debugLog($MODULE, "Set-Cookie: $cookie)");
    print "Set-Cookie: $cookie\n";
}

# Get session_id cookie
sub getSessionCookie {
    debugLog($MODULE, "getSessionCookie()");
    my %cookies = CGI::Cookie->fetch;
    my $session_id = $cookies{'session_id'} ? $cookies{'session_id'}->value : undef;
    if ($session_id) {
        debugLog($MODULE, "getSessionCookie=$session_id");
    } else {
        debugLog($MODULE, "session_id cookie not found");
        #debugLog($MODULE, "current cookies:");
        #foreach my $key (keys %cookies) {
        #    my $value = $cookies{$key};
        #    debugLog($MODULE, "\t$key => $value");
        #}
    }
    return $session_id;
}

# Remove session_id cookie (logout)
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
