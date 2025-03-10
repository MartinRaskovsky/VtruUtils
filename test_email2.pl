#!/usr/bin/perl

use strict;
use warnings;

use lib './perl-lib';
use EmailUtils qw(sendEmail);

sendEmail('martinr6969@gmail.com', '$FROM_EMAIL Testing to gmail',   "This is a test to gmail.com");
sendEmail('vawa2025@gmail.com',    '$FROM_EMAIL testing to vawa',    "This is a test to gmail.com");
sendEmail('mail@martinr.com',      '$FROM_EMAIL Testing to martinr', "This is a test to martinr.com");
