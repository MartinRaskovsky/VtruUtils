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
use Utils qw(debug_log process_wallets print_error_response);

# Logs debug information to a file
sub debug_error {
    my ($message) = @_;
    my $log_file = Conf::get('LOG_FILE');

    open my $fh, '>>', $log_file or warn "Could not open log file: $!";
    print $fh scalar(localtime) . " - DEBUG: $message\n";
    close $fh;
}

my $cgi = CGI->new;

# Get parameters
my $type     = $cgi->param('type')     || 'sections';
my $vault    = $cgi->param('vault')    || '';
my $wallets  = $cgi->param('wallets')  || '';
my $grouping = $cgi->param('grouping') || 'none';
my $format   = $cgi->param('format')   || 'html';

#debug_log("Type: $type");
#debug_log("Grouping: $grouping");

# Convert wallets to an array
my @wallets_list = process_wallets($wallets);

# Determine script based on type
my $script_name = get_script_for_type($type);
my $script_path = Conf::get('BIN_PATH') . "/$script_name";

#debug_log("script_path: $script_path");

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
#    debug_log("cmd[$i]: $cmd[$i]");
#}

# Execute the script
my ($output, $error) = run_script($script_path, @cmd);

if ($error) {
    debug_error("Script error: $error");
}

# Parse JSON output
my $result;
eval { $result = decode_json($output) };
if ($@) {
    debug_error("JSON Parsing Error: $@");
    print_error_response($cgi, { success => 0, error => "Invalid JSON format received" });
}

# Determine rendering function
my $body;
my $render_function = get_render_function($type);
if ($type eq 'sections') {
    $vault = $result->{address};
    $wallets = $result->{wallets}; 
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
print render_page($body, $type);

exit;

