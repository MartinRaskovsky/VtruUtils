package Conf;
use strict;
use warnings;
use File::Basename;
use File::Spec;
use File::Path qw(make_path);
use Cwd 'abs_path';

my %config = (
    IS_APACHE => 0,
    USE_EMAIL => 1,
);

my $init_done = 0;
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
        log_message("ERROR: Failed to find .env file in $base_dir/data");
    }

    if ($config{IS_APACHE}) {
        $config{NODE_PATH} = '/opt/cpanel/ea-nodejs16/bin/node';
        $config{BIN_PATH} = "$base_dir/bin";
        $config{LOG_FILE} = "$base_dir/logs/vawa.log";
        $config{COOKIE_SECURE} = 1;
    } else {
        $config{NODE_PATH} = '/usr/local/bin/node'; 
        $config{BIN_PATH} = "$base_dir/bin";
        $config{LOG_FILE} = "$base_dir/logs/vawa.log"; 
        $config{COOKIE_SECURE} = 0;
    }

    $config{FROM_EMAIL} = 'vawa2025@gmail.com';
}

# Method to retrieve configuration values
sub get {
    my ($key) = @_;
    
    init();

    return $config{$key};
}

sub log_message {
    my ($message) = @_;
    my $log_file = get('LOG_FILE');

    # Ensure the directory exists
    my $log_dir = dirname($log_file);
    unless (-d $log_dir) {
        make_path($log_dir) or warn "Could not create log directory $log_dir: $!";
    }
    
    open my $fh, '>>', $log_file or warn "Could not open $log_file: $!";
    print $fh scalar(localtime) . " - $message\n";
    close $fh;
}

1;
