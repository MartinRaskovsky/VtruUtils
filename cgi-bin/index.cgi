#!/usr/bin/perl
use strict;
use warnings;
use CGI;

use lib '../perl-lib';
use Dashboard qw(loadDashboard);
use Utils qw(debugLog logError printErrorResponse);
use LoginManagment qw(getSessionEmail deleteSession);

my $MODULE = "index.cgi";

debugLog($MODULE, "Entered");

my $cgi = CGI->new;
eval {
    my ($email, $session_id) = getSessionEmail();

    if (!defined $email) {
        debugLog($MODULE, "Cookie with no DB entry, deleting cookie");
        deleteSession();
        $session_id = 0;
    }

    #print $cgi->header('text/html');
    print "Content-Type: text/html\n";
    print "Cache-Control: no-store, no-cache, must-revalidate, max-age=0\n";
    print "Pragma: no-cache\n";
    print "Expires: 0\n\n";

    if ($session_id) {
        debugLog($MODULE, "Active session");
        loadDashboard($email);
    } else {
        debugLog($MODULE, "No active session. Showing login page.");
        print <<'HTML';
<html>
    <head>
        <title>Login</title>
        <link rel="stylesheet" href="/public/variables.css">
        <link rel="stylesheet" href="/public/common.css">
    </head>
    <body>
        <h1>Vault & Wallet Details</h1>  <!-- ✅ Title properly positioned -->
        <div class="box-container">  <!-- ✅ Use the common class -->
            <h2 style="color: white; text-align: center;">Login</h2>
            <form action="login.cgi" method="GET">
                <label for="email">Email:</label>
                <input type="email" id="email" name="email" required>

                <div class="checkbox-container">
                    <input type="checkbox" name="keepLoggedIn" value="1">
                    <label for="keepLoggedIn">Keep me logged in</label>
                </div>

                <button type="submit" id="loginButton" disabled>Login</button>
            </form>

            <script>
                const emailInput = document.getElementById("email");
                const loginButton = document.getElementById("loginButton");

                function validateEmail() {
                    let emailValue = emailInput.value.trim();
                    let isValid = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(emailValue); // ✅ Email format validation

                    loginButton.disabled = !isValid; // Enable if valid
                    loginButton.style.cursor = isValid ? "pointer" : "not-allowed"; 
                    loginButton.style.opacity = isValid ? "1" : "0.5"; // Greyed out when disabled
                }

                emailInput.addEventListener("input", validateEmail);

                // Ensure button is disabled on page load
                validateEmail();
            </script>
        </div>
        <script src="/public/scripts.js"></script> 

    </body>
</html>
HTML
    }
};

if ($@) {
    logError("index.cgi Error: $@");
    printErrorResponse($cgi, { success => 0, error => "Invalid Request format received" });
}

