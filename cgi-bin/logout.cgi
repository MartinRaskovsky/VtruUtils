#!/usr/bin/perl
use strict;
use warnings;
use CGI;

use lib "../perl-lib";
use Utils qw(debugLog);
use LoginManagment qw(deleteSession);

my $MODULE = "logout.cgi";

debugLog($MODULE, "Entered");

my $cgi = CGI->new;

deleteSession();  # ✅ Ensure session is deleted before printing the header

#print $cgi->header('text/html');  # ✅ Header printed after session cleanup
print "Content-Type: text/html\n";
print "Cache-Control: no-store, no-cache, must-revalidate, max-age=0\n";
print "Pragma: no-cache\n";
print "Expires: 0\n";
print "Location: index.html?nocache=" . time() . "\n\n";  # ✅ Force a fresh load

#print "<script>window.location.href = '/index.html';</script>";

