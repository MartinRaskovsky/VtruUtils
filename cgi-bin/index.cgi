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
    <link rel="stylesheet" href="/public/styles.css">
    <link rel="stylesheet" href="/public/common.css">
    <link rel="stylesheet" href="/public/box.css">
    <link rel="stylesheet" href="/public/version.css">
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
        <div class="box-container"> 
            <h2 style="color: white; text-align: center;">Login</h2>
            <form action="login.cgi" method="GET">
                <label for="email">Email:</label>
                <input type="email" id="email" name="email" placeholder="Enter your email" required>

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
    </div>
</body>
</html>
HTML
    }
};

if ($@) {
    logError("index.cgi Error: $@");
    printErrorResponse($cgi, { success => 0, error => "Invalid Request format received" });
}

