#!/usr/bin/perl
use strict;
use warnings;
use CGI;

use lib '../perl-lib';
use Utils qw(debugLog trimSpaces);
use Dashboard qw(loadDashboard);
use LoginManagment qw(createSession);
use DBUtils qw(getKeepLoggedIn);
use Cookies qw(setSessionCookie);

my $MODULE = "confirm.cgi";
debugLog($MODULE, "Entered");

my $cgi = CGI->new;
my $email = trimSpaces(scalar $cgi->param('email'));
my $confirmation_code = trimSpaces(scalar $cgi->param('code'));
my $error_message = "";

if ($confirmation_code) {
    if ($confirmation_code !~ /^\d{6}$/) {
        $error_message = "Invalid confirmation code format.";
    } else {
        my ($email_verified, $session_id) = createSession($confirmation_code);

        if ($email_verified) {
            my $keep_logged_in = getKeepLoggedIn($email_verified) // 0;
            setSessionCookie($session_id, $keep_logged_in);

            debugLog($MODULE, "Login successful. Redirecting to dashboard.");
            print $cgi->header('text/html');
            print "<!--Success-->\n";
            loadDashboard($email_verified);
            exit;
        } else {
            $error_message = "Invalid confirmation code. Please try again.";
        }
    }
}

debugLog($MODULE, "No confirmation code yet, requesting it.");
print $cgi->header('text/html');

print <<HTML;
<!DOCTYPE html>
<html>
    <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirm Login</title>
    <link rel="stylesheet" href="/public/variables.css">
    <link rel="stylesheet" href="/public/styles.css">
    <link rel="stylesheet" href="/public/common.css">
    <link rel="stylesheet" href="/public/box.css">
    <link rel="stylesheet" href="/public/version.css">
    <style>
        \@media (max-width: 480px) {
            .box-container {
                width: 100%;
                max-width: 320px;
                padding: 16px;
            }

            #main-wrapper {
                width: 91%;
            }
        }
    </style>
</head>
<body class="dashboard-page" id="dashboard-page">

    <div id="main-wrapper">
        <div class="logo-container">
            <img src="/images/logo.png" alt="VaWa Logo" class="vawa-logo">
            <span class="version-text"></span>
        </div>
        <div id="header">
            <button id="backBtn" class="header-btn" onclick="restoreForm()">Back</button>
            <h1>Vault & Wallet Details</h1>
            <button id="logoutBtn" class="header-btn" onclick="logout()">Log Out</button>
        </div>   
    <div class="box-container">  <!-- ✅ Use the common class -->
        <h2 style="color: white; text-align: center;">Enter Confirmation Code</h2>

HTML

if ($error_message) {
    print "<p style='color: red;'><b>$error_message</b></p>\n";
}

print <<HTML;
        <form action="/cgi-bin/confirm.cgi" method="POST">
            <input type="hidden" name="email" value="$email">
            
            <label for="code">Code:</label>
            <input type="tel" id="code" name="code" required pattern="[0-9]{6}" maxlength="6" inputmode="numeric">
            
            <button type="submit" id="confirmButton" disabled style="cursor: not-allowed; opacity: 0.5;">
            Confirm
            </button>
        </form>

        <a href="/cgi-bin/index.cgi" class="cancel-link">Cancel</a>
    </div>

    <script>
        document.addEventListener("DOMContentLoaded", function () {
            const codeInput = document.getElementById("code");
            const confirmButton = document.getElementById("confirmButton");

            function validateCode() {
                let codeValue = codeInput.value.trim();
                let isValid = /^\\d{6}\$/.test(codeValue);  // ✅ Must be exactly 6 digits

                confirmButton.disabled = !isValid;  // Enable button only if valid
                confirmButton.style.cursor = isValid ? "pointer" : "not-allowed"; 
                confirmButton.style.opacity = isValid ? "1" : "0.5";  // Greyed out when disabled
            }

            codeInput.addEventListener("input", function () {
                this.value = this.value.replace(/\\D/g, "");  // ✅ Remove non-numeric characters
                validateCode();
            });

            // Ensure button is disabled on page load
            validateCode();
        });
    </script>
     <script src="/public/scripts.js"></script> 
    </div>
</body>
</html>
HTML

