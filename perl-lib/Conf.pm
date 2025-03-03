package Conf;
use strict;
use warnings;
use File::Basename;
use File::Spec;
use Cwd 'abs_path';

# Configuration storage
my %config;

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
}

# Dynamically determine paths
$config{NODE_PATH} = `which node` // '/usr/local/bin/node';
chomp $config{NODE_PATH};

# Determine BIN_PATH based on environment
if ($ENV{APACHE_RUN_USER}) {  
    # Running under Apache (Web Server)
    $config{BIN_PATH} = '/home/martin/www/cgi-bin/bin';
} else {
    # Local development
    $config{BIN_PATH} = "$base_dir/bin";
}

# Define log file path
if ($ENV{LOG_FILE}) {
    $config{LOG_FILE} = $ENV{LOG_FILE};  # Use environment variable if set
} elsif (-w "/var/log/apache2/") {  
    $config{LOG_FILE} = "/var/log/apache2/cgi-debug.log";  # Web server (if writable)
} else {
    $config{LOG_FILE} = "$base_dir/logs/cgi-debug.log";  # Local development
}

# Method to retrieve configuration values
sub get {
    my ($key) = @_;
    return $config{$key};
}

1;
