#!/usr/bin/perl

use strict;
use warnings;

use lib './perl-lib';
use EmailUtils qw(sendEmail);
use Conf;

my $FROM_EMAIL = Conf::get('FROM_EMAIL');

$FROM_EMAIL =~ s/@/\@/;

sendEmail('martinr6969@gmail.com', "$FROM_EMAIL Testing to gmail",   'This is a test to martinr6969@gmail.com');
sendEmail('vawa2025@gmail.com',    "$FROM_EMAIL testing to vawa",    'This is a test to vawa2025@gmail.com');
sendEmail('mail@martinr.com',      "$FROM_EMAIL Testing to martinr", 'This is a test to mail@martinr.com');
