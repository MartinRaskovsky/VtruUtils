package EmailUtils;

use strict;
use warnings;
use Exporter 'import';

use lib '../perl-lib';
use Conf;
use Utils qw(debug_log2 log_error);

our @EXPORT_OK = qw(send_email send_confirmation_email);

my $MODULE = "EmailUtils";

my $USE_EMAIL = Conf::get('USE_EMAIL');

my $SMTPS_AVAILABLE = 0;

if ($USE_EMAIL) {
    eval {
        require MIME::Lite;
        require Net::SMTPS;
        Net::SMTPS->import();
        $SMTPS_AVAILABLE = 1;
    };
    
    if ($@) {
        log_error("Net::SMTPS not available: $@");
    } else {
        debug_log("Net::SMTPS successfully loaded.");
    }
}

sub send_email {
    my ($email, $subject, $body) = @_;
    debug_log2($MODULE, "send_email($email, $subject, $body)");

    if (!$USE_EMAIL) {
        debug_log2($MODULE, "Skipped");
        return 1;
    }

    if (!$SMTPS_AVAILABLE) {
        log_error("Cannot send email: Net::SMTPS module not available.");
        return 0;
    }

    my $smtp_host = get('SMTP_HOST');
    my $smtp_user = get('SMTP_USER');
    my $smtp_pass = get('SMTP_PASS');

    eval {
        my $mailer = Net::SMTPS->new($smtp_host, Port => 587, doSSL => 'starttls');
        $mailer->auth($smtp_user, $smtp_pass);
        $mailer->mail($smtp_user);
        $mailer->to($email);
        $mailer->data();
        $mailer->datasend("To: $email\n");
        $mailer->datasend("From: $smtp_user\n");
        $mailer->datasend("Subject: $subject\n\n");
        $mailer->datasend("$body\n");
        $mailer->dataend();
        $mailer->quit;
        debug_log2($MODULE, "Success");
    };
    
    if ($@) {
        log_error("Failed to send email to $email: $@");
        return 0;
    }

    return 1;
}

sub send_confirmation_email {
    my ($email, $code) = @_;
    my $subject = "Your confirmation code";
    my $body = "Your confirmation code is: $code";
    return send_email($email, $subject, $body);
}

1;
