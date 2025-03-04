#!/usr/bin/env perl
use strict;
use warnings;
use HTTP::Server::Simple::CGI;
use base qw(HTTP::Server::Simple::CGI);
use File::Basename qw(dirname);
use Cwd qw(abs_path);

# Define the root folder for static files (styles, scripts)
my $web_root = dirname(abs_path($0)) . "/../public";

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

my $server = __PACKAGE__->new(8080);
$server->run();

