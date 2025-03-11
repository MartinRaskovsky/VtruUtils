#!/usr/bin/perl
package LoginManagment;

use strict;
use warnings;
use Digest::SHA qw(sha256_hex);

use lib "../perl-lib";
use Cookies qw(setSessionCookie getSessionCookie deleteSessionCookie);
use DBUtils qw(getEmailFromSession getEmailFromCode putSessionId);
use Utils qw(debugLog);

our @EXPORT_OK = qw(createSession getSessionEmail deleteSession);
use Exporter 'import';

my $MODULE = "LoginMngment";

# Creates a session upon successful confirmation
sub createSession {
    my ($confirmation_code) = @_;
    return unless ($confirmation_code && $confirmation_code =~ /^\d{6}$/);

    my $email = getEmailFromCode($confirmation_code);
    return unless $email;

    my $session_id = sha256_hex(time() . rand());
    setSessionCookie($session_id);
    putSessionId($email, $session_id);

    debugLog($MODULE, "createSession=($email, $session_id)");
    return ($email, $session_id);
}

# Retrieves the logged-in email from the session cookie
sub getSessionEmail {
    my $session_id = getSessionCookie();
    return unless $session_id;
    
    my $email = getEmailFromSession($session_id);
    debugLog($MODULE, "getSessionEmail=($email, $session_id)");
    return ($email, $session_id);
}

# Deletes the session (logout)
sub deleteSession {
    debugLog($MODULE, "deleteSession");
    deleteSessionCookie();
}

1;

