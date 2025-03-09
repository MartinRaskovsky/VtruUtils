#!/usr/bin/perl

use strict;
use warnings;

use lib './perl-lib';
use EmailUtils qw(sendEmail);

sendEmail('martinr6969@gmail.com', 'II Testing to gmail',   "This is a test to gmail.com");
sendEmail('mail@martinr.com',      'II Testing to martinr', "This is a test to martinr.com");
