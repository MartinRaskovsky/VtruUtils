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
  <style>
    body {
        font-family: Arial, sans-serif;
        line-height: 1.5;
    }
    h1, h2, h3 {
        color: #4B0082;
    }
    .code-box {
        font-size: 20px;
        color: red;
        font-weight: bold;
    }
  </style>
</head>
<body>
  <h1>VaWa App Login Code</h1>
  <p><strong>Your confirmation code:</strong></p>
  <p class="code-box">$code</p>

  <h2>What is VaWa?</h2>
  <p><b>VaWa</b> (Vault and Wallet Tracker) is a multi-network, multi-wallet tool that provides a unified view of your assets, eliminating the need to check multiple blockchain explorers individually.</p>

  <h2>Key Features</h2>
  <ul>
    <li>View details of your Vitruveo Vault and linked wallets.</li>
    <li>Track all your Vitruveo tokens and coins across multiple wallets in a single dashboard.</li>
    <li>Find out exactly <i>Where are my tokens?</i> without checking multiple explorers.</li>
    <li>Discover hidden or forgotten tokens and coins.</li>
    <li>Monitor SEVO-X on BSC alongside your Vitruveo holdings.</li>
    <li>Supports multiple networks:
      <ul>
        <li><b>Native Coins</b>: VTRU, ETH, BNB, and POL.</li>
        <li><b>VTRU Bridged</b>: VTRU on BSC and ETH.</li>
        <li><b>USDC</b>: Tracked across VTRU, ETH, BSC, and POL networks.</li>
        <li><b>Staked</b>: VTRU Staked and SEVO-X Staked on BSC.</li>
        <li><b>Vitruveo Coins & Tokens</b>: VERSE, VIBE, VORTEX, VTRO, VUSD, and wVTRU.</li>
        <li><b>Sabong</b>: SEVO and SEVO-X tokens.</li>
        <li><b>Vitruveo Exchange</b>: V3DEX and VITDEX.</li>
      </ul>
    </li>
  </ul>

  <h2>How to Use Your Login Code</h2>
  <p>To access your VaWa account, enter the confirmation code provided above. This code is valid for a limited time and should not be shared with anyone.</p>

  <h2>Security Notes</h2>
  <ul>
    <li>VaWa will never ask for your private keys or passwords.</li>
    <li>Always make sure you are using the official VaWa website.</li>
    <li>If you did not request this login code, please ignore this email.</li>
  </ul>

  <p>For more information, visit: <a href="https://about.martinr.com/vawa_notes.html" target="_blank">VaWa Notes</a></p>
  <p>Need help? Contact us at <a href="mailto:vawa2025\@gmail.com">vawa2025\@gmail.com</a></p>

  <p><i>Thank you for choosing VaWa!</i></p>

</body>
</html>
END_HTML

    return sendEmail($email, $subject, $body);
}

1;
