#!/usr/bin/perl
use strict;
use warnings;
use CGI;

use lib "../perl-lib";
use Cookies qw(deleteDessionCookie);

my $MODULE = "logout";

my $cgi = CGI->new;

# ✅ Remove session cookie before sending headers
deleteDessionCookie();

# ✅ Now send headers
print $cgi->header('text/html');

# ✅ Redirect or show logout message
print "<script>window.location.href = '/index.html';</script>";

