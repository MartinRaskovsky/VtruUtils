#!/usr/bin/perl
use strict;
use warnings;
use CGI;

use lib "../perl-lib";
use Cookies qw(remove_session_cookie);

my $MODULE = "logout";

my $cgi = CGI->new;

# ✅ Remove session cookie before sending headers
remove_session_cookie();

# ✅ Now send headers
print $cgi->header('text/html');

# ✅ Redirect or show logout message
print "<script>window.location.href = '/index.html';</script>";

