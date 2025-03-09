#!/usr/bin/perl

use strict;
use warnings;

my $FROM_EMAIL = 'mail@martinr.com';

sub sendEmail {
    my ($email, $subject, $body) = @_;

    my $sendmail = "/usr/sbin/sendmail -t";
    open(my $mail, "|-", $sendmail) or do {
        print STDERR "Cannot open sendmail: $!";
        return 0;
    };

    print $mail "To: $email\n";
    print $mail "From: $FROM_EMAIL\n";
    print $mail "Subject: $subject\n";
    print $mail "MIME-Version: 1.0\n";
    print $mail "Content-Type: text/html; charset=UTF-8\n\n";
    print $mail "$body\n";

    close($mail) or print STDERR "Sendmail process failed: $!";


    print "test sent to: $email\n";

    return 1;
}

sendEmail('martinr6969@gmail.com', 'Testing to gmail',   "This is a test to gmail.com");
sendEmail('mail@martinr.com',      'Testing to martinr', "This is a test to martinr.com");
