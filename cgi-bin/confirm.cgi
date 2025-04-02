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
    <title>Confirm Login</title>
    <link rel="stylesheet" href="/public/variables.css">
    <link rel="stylesheet" href="/public/common.css">
     <link rel="stylesheet" href="/public/box.css">
</head>
<body>
    <h1>Vault & Wallet Details</h1>  <!-- ✅ Ensure the title is at the top -->
    <div class="box-container">  <!-- ✅ Use the common class -->
        <h2 style="color: white; text-align: center;">Enter Confirmation Code</h2>

HTML

if ($error_message) {
    print "<p style='color: red;'><b>$error_message</b></p>\n";
}

print <<HTML;
        <form action="confirm.cgi" method="GET">
            <input type="hidden" name="email" value="$email">
            
            <label for="code">Code:</label>
            <input type="tel" id="code" name="code" required pattern="[0-9]{6}" maxlength="6" inputmode="numeric">
            
            <button type="submit" id="confirmButton" disabled style="cursor: not-allowed; opacity: 0.5;">
            Confirm
            </button>
        </form>

        <a href="index.cgi" class="cancel-link">Cancel</a>
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

</body>
</html>
HTML

