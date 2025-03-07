package Cookies;

use strict;
use warnings;
use CGI::Cookie;

use lib "../perl-lib";
use Utils qw(debug_log2);

use Exporter 'import';
our @EXPORT_OK = qw(set_session_cookie get_session_cookie remove_session_cookie);

my $MODULE = 'Cookies';

# Set session_id cookie
sub set_session_cookie {
    my ($session_id) = @_;
    debug_log2($MODULE, "set_session_cookie($session_id)");
    
    my $cookie = CGI::Cookie->new(
        -name    => 'session_id',
        -value   => $session_id,
        -expires => '+1M',  # 1-month expiration
        -path    => '/',
        -httponly => 1,
        -secure   => 1,
    );
    
    print "Set-Cookie: $cookie\n";
}

# Get session_id cookie
sub get_session_cookie {
    debug_log2($MODULE, "get_session_cookie()");
    my %cookies = CGI::Cookie->fetch;
    my $session_id = $cookies{'session_id'} ? $cookies{'session_id'}->value : undef;
    return $session_id;
}

# Remove session_id cookie (logout)
sub remove_session_cookie {
    debug_log2($MODULE, "remove_session_cookie()");
    
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
#    debug_log2($MODULE, "set_confirmation_code_cookie($confirmation_code)");
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
#    debug_log2($MODULE, "get_confirmation_code_cookie()");
#    my %cookies = CGI::Cookie->fetch;
#    my $cookie = $cookies{'confirmation_code'} ? $cookies{'confirmation_code'}->value : undef;
#    return $cookie;
#}

1;
