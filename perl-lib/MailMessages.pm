package MailMessages;

use strict;
use warnings;
use Exporter 'import';

use lib '../perl-lib';
use EmailUtils qw(sendEmail);

our @EXPORT_OK = qw(sendConfirmationEmail);

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
    <li><b>Track all your Vitruveo tokens and coins across every wallet you own, ensuring complete visibility of your assets.</b></li>
    <li>Track your <b>Vortex tokens</b> on the BSC chain.</li>
    <li>Monitor your <b>Ethereum-based</b> assets in real time.</li>
  </ul>

  <p>Enter your confirmation code to access your VaWa account.</p>
  
  <p><i>Thank you for choosing VaWa!</i></p>

  <hr style="border: none; border-top: 1px solid #ccc; margin: 20px 0;">
  <p><b>Learn more about VaWa:</b> <a href="https://about.martinr.com/vawa" target="_blank">https://about.martinr.com/vawa</a></p>
  <p>For further information, questions, or suggestions, please contact: <a href="mailto:docmartinraskovsky\@gmail.com">docmartinraskovsky\@gmail.com</a></p>

</body>
</html>
END_HTML
    return sendEmail($email, $subject, $body);
}

1;

