package EmailUtils;

use strict;
use warnings;
use Exporter 'import';

use lib '../perl-lib';
use Conf;
use Utils qw(debugLog logError);

our @EXPORT_OK = qw(sendEmail sendConfirmationEmail);

my $MODULE = "EmailUtils";

my $USE_EMAIL = 1;#Conf::get('USE_EMAIL');

sub sendEmail {
    my ($email, $subject, $body) = @_;
    debugLog($MODULE, "sendEmail($email, $subject, $body)");

    if (!$USE_EMAIL) {
        debugLog($MODULE, "Skipped");
        return 1;
    }

    my $sendmail = "/usr/sbin/sendmail -t";
    open(my $mail, "|-", $sendmail) or do {
        logError("Cannot open sendmail: $!");
        return 0;
    };

    print $mail "To: $email\n";
    print $mail "From: noreply\@yourdomain.com\n";
    print $mail "Subject: $subject\n\n";
    print $mail "$body\n";

    close($mail);
    debugLog($MODULE, "Email sent using sendmail.");
    return 1;
}


sub sendConfirmationEmail {
    my ($email, $code) = @_;
    my $subject = "Your confirmation code";
    my $body = "Your confirmation code is: $code";
    return sendEmail($email, $subject, $body);
}

1;
