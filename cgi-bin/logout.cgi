#!/usr/bin/perl
use strict;
use warnings;
use CGI;
use CGI::Cookie;

my $cgi = CGI->new;
print $cgi->header(
    -type => 'text/html',
    -cookie => CGI::Cookie->new(-name => 'session_token', -value => '', -expires => '-1d', -path => '/')
);

print "<script>window.location.href = '/index.html';</script>";

