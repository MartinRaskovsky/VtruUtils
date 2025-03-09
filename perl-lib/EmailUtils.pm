package EmailUtils;

use strict;
use warnings;
use Exporter 'import';

use lib '../perl-lib';
use Conf;
use Utils qw(debugLog logError);

our @EXPORT_OK = qw(sendEmail sendConfirmationEmail);

my $MODULE = "EmailUtils";

my $USE_EMAIL = Conf::get('USE_EMAIL') // 1;
my $FROM_EMAIL = Conf::get('FROM_EMAIL') || 'no-reply@vawa.com';

sub sendEmail {
    my ($email, $subject, $body) = @_;
    
    # Basic email validation to prevent injection
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

sub sendConfirmationEmail {
    my ($email, $code) = @_;
    my $subject = 'Your VaWa App Login Code';
    my $body =<<END_HTML;
<html>
<head>
  <title>VaWa App Login Code</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.5;">
  <h1 style="color: #4A90E2;">Doc's VaWa App - Vault & Wallet Details</h1>
  <p><strong>Your confirmation code:</strong></p>
  <p style="font-size: 20px; color: red;"><b>$code</b></p>
  
  <h2>What is VaWa?</h2>
  <p><b>VaWa is your multi-network, multi-wallet app.</b> It provides a seamless way to consolidate all your wallet information in one place.</p>

  <h2>Key Features:</h2>
  <ul>
    <li>View all details of your <b>Vitruveo Vault</b> and its associated wallets.</li>
    <li>Add multiple wallets to track them together.</li>
    <li>Quickly answer the common question: <i>"Where are my tokens?"</i></li>
    <li>Track your <b>Vortex tokens</b> on the BSC chain.</li>
    <li>Monitor your <b>Ethereum-based</b> assets in real time.</li>
  </ul>

  <p>Enter your confirmation code to access your VaWa account.</p>
  
  <p><i>Thank you for choosing VaWa!</i></p>
</body>
</html>
END_HTML
    return sendEmail($email, $subject, $body);
}

1;

