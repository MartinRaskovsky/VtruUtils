package EmailUtils;

use strict;
use warnings;
use Exporter 'import';

use lib '../perl-lib';
use Conf;
use Utils qw(debugLog logError);

our @EXPORT_OK = qw(sendEmail);

my $MODULE = "EmailUtils";

my $USE_EMAIL = Conf::get('USE_EMAIL') // 1;
my $FROM_EMAIL = Conf::get('FROM_EMAIL') || 'no-reply@vawa.com';

sub sendEmail {
    my ($email, $subject, $body) = @_;

    # Validate email format to prevent injection attacks
    if ($email !~ /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/) {
        logError("$MODULE: Invalid email format: $email");
        return 0;
    }

    debugLog($MODULE, "sendEmail($email, $subject)");

    if (!$USE_EMAIL) {
        debugLog($MODULE, "Email sending is disabled via config.");
        return 1;
    }

    my $sendmail = "/usr/sbin/sendmail -t";
    open(my $mail, "|-", $sendmail) or do {
        logError("$MODULE: Cannot open sendmail: $!");
        return 0;
    };

    print $mail "To: $email\n";
    print $mail "From: $FROM_EMAIL\n";
    print $mail "Subject: $subject\n";
    print $mail "MIME-Version: 1.0\n";
    print $mail "Content-Type: text/html; charset=UTF-8\n\n";
    print $mail "$body\n";

    close($mail) or logError("$MODULE: Sendmail process failed: $!");

    debugLog($MODULE, "Email sent to $email.");
    return 1;
}

1;
