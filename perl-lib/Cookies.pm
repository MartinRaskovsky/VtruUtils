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

# Set confirmation_code cookie
#sub set_confirmation_code_cookie {
#    my ($confirmation_code) = @_;
#    debugLog($MODULE, "set_confirmation_code_cookie($confirmation_code)");
#    
#    my $cookie = CGI::Cookie->new(
#        -name    => 'confirmation_code',
#        -value   => $confirmation_code,
#        -expires => '+1h',  # 1-hour expiration
#        -path    => '/',
#        -httponly => 1,
#        -secure   => 1,
#    );
#    
#    print "Set-Cookie: $cookie\n";
#}

# Get confirmation_code cookie
#sub get_confirmation_code_cookie {
#    debugLog($MODULE, "get_confirmation_code_cookie()");
#    my %cookies = CGI::Cookie->fetch;
#    my $cookie = $cookies{'confirmation_code'} ? $cookies{'confirmation_code'}->value : undef;
#    return $cookie;
#}

1;
