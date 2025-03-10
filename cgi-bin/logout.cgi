#!/usr/bin/perl
use strict;
use warnings;
use CGI;

use lib "../perl-lib";
use LoginManagment qw(deleteSession);

my $MODULE = "logout.cgi";
my $cgi = CGI->new;

deleteSession();  # ✅ Ensure session is deleted before printing the header

print $cgi->header('text/html');  # ✅ Header printed after session cleanup
print "<script>window.location.href = '/index.html';</script>";

