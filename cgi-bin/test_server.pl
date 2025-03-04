#!/usr/bin/env perl
use strict;
use warnings;
use HTTP::Server::Simple::CGI;
use base qw(HTTP::Server::Simple::CGI);
use File::Basename qw(dirname);
use Cwd qw(abs_path);
use Socket;
use Sys::Hostname;

# Define the root folder for static files (styles, scripts)
my $web_root = dirname(abs_path($0)) . "/../public";

# Get the local network IP (Wi-Fi or Ethernet)
sub get_local_ip {
    my $ip;
    my @interfaces = ("en0", "en1", "eth0");  # Common interfaces (Wi-Fi, Ethernet)
    foreach my $iface (@interfaces) {
        $ip = `ipconfig getifaddr $iface` if $^O eq 'darwin';  # macOS
        $ip = `hostname -I | awk '{print \$1}'` if $^O eq 'linux';  # Linux
        chomp $ip;
        last if $ip;
    }
    return $ip || "127.0.0.1";  # Fallback if not found
}

# Override the default banner message
sub print_banner {
    my $self = shift;
    my $local_ip = get_local_ip();
    print "✅ Server is running! Access it at: http://$local_ip:8080/\n";
}

sub handle_request {
    my ($self, $cgi) = @_;
    my $path = $cgi->path_info();

    # Fix: Remove "/public/" prefix when serving static files
    $path =~ s{^/public/}{};

    # Serve static files (CSS, JS, HTML)
    if (-f "$web_root/$path") {
        my $content_type = get_content_type($path);
        
        # Ensure correct HTTP response
        print "HTTP/1.1 200 OK\r\n";
        print "Content-Type: $content_type\r\n\r\n";

        open my $fh, '<', "$web_root/$path" or return;
        print while <$fh>;
        close $fh;
        return;
    }

    # Handle CGI script execution correctly (without adding an extra Content-Type)
    if ($path =~ /\.cgi$/ && -x "." . $path) {
        # Open a pipe to execute the CGI script and capture output
        my $output = `."$path" 2>&1`;

        # Ensure CGI script correctly handles headers
        if ($output =~ /^Content-Type:/m) {
            print "HTTP/1.1 200 OK\r\n";  # Send HTTP response status only
            print $output;  # CGI script handles headers itself
        } else {
            print "HTTP/1.1 500 Internal Server Error\r\n";
            print "Content-Type: text/html\r\n\r\n";
            print "<font color='red'>Error: CGI script did not return a valid HTTP response.</font>\n";
        }
        return;
    }

    # If nothing matches, return a 404 error
    print "HTTP/1.1 404 Not Found\r\n";
    print "Content-Type: text/plain\r\n\r\n";
    print "Error: File or script not found.\n";
}

sub get_content_type {
    my ($file) = @_;
    return "text/css" if $file =~ /\.css$/;
    return "application/javascript" if $file =~ /\.js$/;
    return "text/html" if $file =~ /\.html$/;
    return "image/png" if $file =~ /\.png$/;
    return "image/jpeg" if $file =~ /\.(jpg|jpeg)$/;
    return "text/plain";
}

#$server = __PACKAGE__->new(inet_aton("0.0.0.0"), 8080);
#my $server = __PACKAGE__->new('192.168.68.119', 8080);
#my $server = __PACKAGE__->new('0.0.0.0', 8080);
#my $server = __PACKAGE__->new(8080);

# Start the server
my $server = __PACKAGE__->new(8080);
$server->run();
