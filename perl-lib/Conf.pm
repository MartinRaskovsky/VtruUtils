package Conf;
use strict;
use warnings;
use File::Basename;
use File::Spec;
use Cwd 'abs_path';

use Utils qw ( log_error );

my $IS_APACHE = 0;

my $init_done = 0;
my %config;

sub init {
    if ($init_done) { return; }
    $init_done = 1;

    # Define fixed .env location relative to src/
    my $base_dir = dirname(dirname(abs_path(__FILE__)));  # Get src/ directory
    my $env_file = File::Spec->catfile($base_dir, 'data', '.env');

    # Load .env file if available
    if (-f $env_file) {
        open my $fh, '<', $env_file or die "Could not open $env_file: $!";
        while (<$fh>) {
            chomp;
            next if /^#/ || /^\s*$/;  # Skip comments and empty lines
            if (/^(\w+)=(.+)$/) {
                $config{$1} = $2;
            }
        }
        close $fh;
    } else {
        log_error("Failed to find .env file in $base_dir/data");
    }

    if ($IS_APACHE) {
        $config{NODE_PATH} = '/opt/cpanel/ea-nodejs16/bin/node';
        $config{BIN_PATH} = "$base_dir/bin";
        $config{LOG_FILE} = "$base_dir/logs/cgi-debug.log";
    } else {
        $config{NODE_PATH} = '/usr/local/bin/node'; 
        $config{BIN_PATH} = "$base_dir/bin";
        $config{LOG_FILE} = "$base_dir/logs/cgi-debug.log"; 
    }
}

# Method to retrieve configuration values
sub get {
    my ($key) = @_;
    
    init();

    return $config{$key};
}

1;
