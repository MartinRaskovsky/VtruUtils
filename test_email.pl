#!/usr/bin/perl

use strict;
use warnings;

my $FROM_EMAIL = 'vawa2025@gmail.com';

sub sendEmail {
    my ($email, $subject, $body) = @_;

    my $sendmail = "/usr/sbin/sendmail -v -t";
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

my $FROM = $FROM_EMAIL;
$FROM =~ s/@/\@/;

sendEmail('martinr6969@gmail.com', "$FROM Testing to gmail",   'This is a test to martinr6969@gmail.com');
sendEmail('vawa2025@gmail.com',    "$FROM testing to vawa",    'This is a test to vawa2025@gmail.com');
sendEmail('mail@martinr.com',      "$FROM Testing to martinr", 'This is a test to mail@martinr.com');
