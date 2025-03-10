#!/usr/bin/env perl
use strict;
use warnings;
use CGI;
use JSON;

use lib '../perl-lib';
use Conf;
use Defs qw(getScriptForType getRenderFunction );
use Logs qw(getSignature findLatestLog writeCurrentLog computeDifferences);
use Render qw(renderPage);
use Execute qw(run_script);
use Dashboard qw(getWalletsHtml);
use Utils qw(debugLog logError trimSpaces processWallets printErrorResponse);
use LoginManagment qw(getSessionEmail);

my $MODULE = "driver.cgi";

my $cgi = CGI->new;
my $type     = $cgi->param('type')     // 'sections';
my $vault    = trimSpaces(scalar $cgi->param('vault'))  // '';
my $wallets  = trimSpaces(scalar $cgi->param('wallets'))  // '';
my $grouping = $cgi->param('grouping') // 'none';
my $format   = $cgi->param('format')   // 'html';

my @wallets_list = processWallets($wallets);
my $script_name = getScriptForType($type);
my $script_path = Conf::get('BIN_PATH') . "/$script_name";

my @cmd = ($vault ? ('-v', $vault) : ());

my ($i,$N);
$N = @wallets_list;
for ($i=0; $i<$N; $i++) {
    #debugLog("wallet[$i]", $wallets_list[$i]);
    push @cmd, $wallets_list[$i];
}

if ($type ne "sections" && $grouping && $grouping ne "none") {
    push @cmd, ('-g', $grouping);
}

#$N = @cmd;
#for ($i=0; $i<$N; $i++) {
#    debugLog($MODULE, "cmd[$i]: $cmd[$i]");
#}

my ($output, $error) = run_script($script_path, @cmd);

if ($error) {
    logError("Script ($script_name) error: $error");
}

my $result;
eval { $result = decode_json($output) };
if ($@) {
    logError("JSON Parsing Error: $@");
    printErrorResponse($cgi, { success => 0, error => "Invalid JSON format received" });
    exit;
}

my $body;
my $header = "";
my $render_function = getRenderFunction($type);

my ($email, $session_id) = getSessionEmail();

if ($type eq 'sections') {
    $vault = $result->{address};
    $wallets = $result->{wallets};

    if ($email) {
        putVaultAndWallets($email, $vault, $wallets);
    }

    my $signature = getSignature($email, $vault, $wallets);
    my $previous_log = findLatestLog($signature);
    writeCurrentLog($signature, $result, $previous_log);
    computeDifferences($result, $previous_log) if $previous_log;
    $body = $render_function->($vault, $wallets, $result);
} else {
    $body = $render_function->($grouping, $result);
}

print $cgi->header(-type => 'text/html', -charset => 'UTF-8');
print renderPage($header, $body, $type);

exit;

