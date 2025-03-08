package Execute;
use strict;
use warnings;
use Exporter 'import';
use IPC::Open3;
use Symbol 'gensym';
use JSON;

use lib ".";
use Utils qw( log_error debug_log2 );

my $MODULE = "Execute";

our @EXPORT_OK = qw(run_script);

sub run_script {
    my ($script_path, @args) = @_;
    debug_log2($MODULE, "run_script($script_path, @args)");

    my @cmd = (Conf::get('NODE_PATH'), $script_path, @args);

    my $stdout = gensym;
    my $stderr = gensym;
    my $pid = open3(gensym, $stdout, $stderr, @cmd);
    if ($@) {
        debug_log2($MODULE, "Open3 failed: $@");
        log_error("Open3 failed: $@");
        return ("", "Failed to execute node script: $@");
    }

    waitpid($pid, 0);
    
    my $output = do { local $/; <$stdout> };
    my $error  = do { local $/; <$stderr> };
    
    return ($output, $error);
}

1;

