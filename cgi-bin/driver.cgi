#!/usr/bin/env perl
use strict;
use warnings;
use CGI;
use JSON;

use lib '../perl-lib';
use Conf;
use Defs qw(getScriptForType getRenderFunction getDetailType getExplorerURL);
use Logs qw(getSignature findLatestLog writeCurrentLog computeDifferences);
use Render qw(renderPage);
use Execute qw(run_script);
use Dashboard qw(getWalletsHtml);
use Utils qw(logError trimSpaces processWallets printErrorResponse);
use Cookies qw(getSessionCookie);
use DBUtils qw( getEmailFromSession putVaultAndWallets);

my $cgi = CGI->new;

# Get parameters
my $type     = $cgi->param('type')     // 'sections';
my $vault    = trimSpaces(scalar $cgi->param('vault'))  // '';
my $wallets  = trimSpaces(scalar $cgi->param('wallets'))  // '';
my $grouping = $cgi->param('grouping') // 'none';
my $format   = $cgi->param('format')   // 'html';

#logError("Type: $type");
#logError("Grouping: $grouping");

# Convert wallets to an array
my @wallets_list = processWallets($wallets);

# Determine script based on type
my $script_name = getScriptForType($type);
my $script_path = Conf::get('BIN_PATH') . "/$script_name";

#logError("script_path: $script_path");

# Construct command
my @cmd = ($vault ? ('-v', $vault) : ());

my ($i,$N);
$N = @wallets_list;
for ($i=0; $i<$N; $i++) {
    push @cmd, $wallets_list[$i];
}

if ($type ne "sections" && $grouping && $grouping ne "none") {
    push @cmd, ('-g', $grouping) if $grouping;
}

#$N = @cmd;
#for ($i=0; $i<$N; $i++) {
#    logError("cmd[$i]: $cmd[$i]");
#}

# Execute the script
my ($output, $error) = run_script($script_path, @cmd);

if ($error) {
    logError("Script ($script_name) error: $error");
}

# Parse JSON output
my $result;
eval { $result = decode_json($output) };
if ($@) {
    logError("JSON Parsing Error: $@");
    printErrorResponse($cgi, { success => 0, error => "Invalid JSON format received" });
}

# Determine rendering function
my $body;
my $header = "";
my $render_function = getRenderFunction($type);
if ($type eq 'sections') {
    $vault = $result->{address};
    $wallets = $result->{wallets};
    #my $joined = join(" ", @{$result->{wallets} // []});  # Ensure wallets are formatted correctly, avoid warnings if undefined

    my $session_id = getSessionCookie();
    my $email = getEmailFromSession($session_id);
    putVaultAndWallets($email, $vault, $wallets);
    #$header = getWalletsHtml($vault, $joined);

    # Compute differences if applicable
    my $signature = getSignature($email, $vault, $wallets);
    my $previous_log = findLatestLog($signature);
    writeCurrentLog($signature, $result, $previous_log);
    computeDifferences($result, $previous_log) if $previous_log;
    $body = $render_function->($vault, $wallets, $result);
} else {
    $body = $render_function->($grouping, $result);
}

# Render and output final page
print $cgi->header(-type => 'text/html', -charset => 'UTF-8');
print renderPage($header, $body, $type);

exit;

