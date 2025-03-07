#!/usr/bin/env perl
use strict;
use warnings;
use CGI;
use JSON;

use lib '../perl-lib';
use Conf;
use Defs qw(get_script_for_type get_render_function get_detail_type get_explorer_url);
use Logs qw(find_latest_log write_current_log compute_differences);
use Render qw(render_page);
use Execute qw(run_script);
use Dashboard qw(get_wallets_html);
use Utils qw(log_error process_wallets print_error_response);
use Cookies qw(get_session_cookie);
use DBUtils qw(get_user_by_session set_vault_and_wallets);

my $cgi = CGI->new;

# Get parameters
my $type     = $cgi->param('type')     || 'sections';
my $vault    = $cgi->param('vault')    || '';
my $wallets  = $cgi->param('wallets')  || '';
my $grouping = $cgi->param('grouping') || 'none';
my $format   = $cgi->param('format')   || 'html';

#log_error("Type: $type");
#log_error("Grouping: $grouping");

# Convert wallets to an array
my @wallets_list = process_wallets($wallets);

# Determine script based on type
my $script_name = get_script_for_type($type);
my $script_path = Conf::get('BIN_PATH') . "/$script_name";

#log_error("script_path: $script_path");

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
#    log_error("cmd[$i]: $cmd[$i]");
#}

# Execute the script
my ($output, $error) = run_script($script_path, @cmd);

if ($error) {
    log_error("Script ($script_name) error: $error");
}

# Parse JSON output
my $result;
eval { $result = decode_json($output) };
if ($@) {
    log_error("JSON Parsing Error: $@");
    print_error_response($cgi, { success => 0, error => "Invalid JSON format received" });
}

# Determine rendering function
my $body;
my $header = "$type";
my $render_function = get_render_function($type);
if ($type eq 'sections') {
    $vault = $result->{address};
    $wallets = $result->{wallets};
    #my $joined = join(" ", @{$result->{wallets} // []});  # Ensure wallets are formatted correctly, avoid warnings if undefined

    my $session_id = get_session_cookie();
    my $user = get_user_by_session($session_id);
    set_vault_and_wallets($user->{email}, $vault, $wallets);
    #$header = get_wallets_html($vault, $joined);

    # Compute differences if applicable
    my $previous_log = find_latest_log($vault);
    write_current_log($vault, $result, $previous_log);
    compute_differences($result, $previous_log) if $previous_log;
    $body = $render_function->($vault, $wallets, $result);
} else {
    $body = $render_function->($grouping, $result);
}

# Render and output final page
print $cgi->header(-type => 'text/html', -charset => 'UTF-8');
print render_page($header, $body, $type);

exit;

