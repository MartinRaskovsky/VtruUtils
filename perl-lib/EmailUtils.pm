package EmailUtils;

use strict;
use warnings;
use Exporter 'import';

use lib '../perl-lib';
use Conf;
use Utils qw(debug_log2 log_error);

our @EXPORT_OK = qw(send_email send_confirmation_email);

my $MODULE = "EmailUtils";

my $USE_EMAIL = 1;#Conf::get('USE_EMAIL');

sub send_email {
    my ($email, $subject, $body) = @_;
    debug_log2($MODULE, "send_email($email, $subject, $body)");

    if (!$USE_EMAIL) {
        debug_log2($MODULE, "Skipped");
        return 1;
    }

    my $sendmail = "/usr/sbin/sendmail -t";
    open(my $mail, "|-", $sendmail) or do {
        log_error("Cannot open sendmail: $!");
        return 0;
    };

    print $mail "To: $email\n";
    print $mail "From: noreply\@yourdomain.com\n";
    print $mail "Subject: $subject\n\n";
    print $mail "$body\n";

    close($mail);
    debug_log2($MODULE, "Email sent using sendmail.");
    return 1;
}


sub send_confirmation_email {
    my ($email, $code) = @_;
    my $subject = "Your confirmation code";
    my $body = "Your confirmation code is: $code";
    return send_email($email, $subject, $body);
}

1;
