package Execute;
use strict;
use warnings;
use Exporter 'import';
use IPC::Open3;
use Symbol 'gensym';
use JSON;
our @EXPORT_OK = qw(run_script);

sub run_script {
    my ($script_path, @args) = @_;
    my @cmd = ('node', $script_path, @args);

    my $stdout = gensym;
    my $stderr = gensym;
    my $pid = open3(gensym, $stdout, $stderr, @cmd);
    waitpid($pid, 0);
    
    my $output = do { local $/; <$stdout> };
    my $error  = do { local $/; <$stderr> };
    
    return ($output, $error);
}

1;

