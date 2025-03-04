package Logs;
use strict;
use warnings;
use Exporter 'import';
use JSON;
use File::Path qw(make_path);
use File::Spec;
use Time::HiRes qw(gettimeofday);

use lib '.';
use Utils qw( log_error );

our @EXPORT_OK = qw(find_latest_log write_current_log compute_differences);

my $log_dir = "../public/data";
make_path($log_dir) unless -d $log_dir;

use Time::HiRes qw(gettimeofday);

sub get_iso_timestamp {
    my ($sec, $msec) = gettimeofday(); # Get current time with microsecond precision
    my ($year, $mon, $mday, $hour, $min, $full_sec) = (localtime($sec))[5,4,3,2,1,0];
    
    $msec = int($msec / 1000);  # Convert microseconds to milliseconds
    $year += 1900;
    $mon += 1;

    return sprintf("%04d-%02d-%02dT%02d-%02d-%02d-%03dZ", $year, $mon, $mday, $hour, $min, $full_sec, $msec);
}


sub canonical_json_unused {
    my ($data) = @_;
    return JSON->new->canonical(1)->utf8->encode($data);
}       
    
sub sorted_json {
    my ($data) = @_;
    return encode_json(_sort_recursive($data)); 
}       
    
sub _sort_recursive {
    my ($item) = @_;
    
    if (ref $item eq 'HASH') {
        return { map { $_ => _sort_recursive($item->{$_}) } sort keys %$item };
    } elsif (ref $item eq 'ARRAY') {
        return [ map { _sort_recursive($_) } @$item ]; 
    } else {
        return $item;
    }
}

sub find_latest_log {
    my ($vault) = @_;
    opendir(my $dh, $log_dir) or return;
    my @files = grep { /^${vault}_\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}-\d{3}Z\.json$/ } readdir($dh);
    closedir($dh);

    return unless @files;
    @files = sort { $b cmp $a } @files;
    
    my $latest_file = "$log_dir/$files[0]";
    open my $fh, '<', $latest_file or return;
    my $json = do { local $/; <$fh> };
    close $fh;
    
    return decode_json($json);
}

sub write_current_log {
    my ($vault,$new_data,$old_data) = @_;

    my $new_json = canonical_json_unused($new_data);  # Sorts and encodes new JSON
        
    if ($old_data) {
        my $old_json = canonical_json_unused($old_data);  # Sorts and encodes old JSON
    
        # Skip writing if identical
        return if $new_json eq $old_json;
    }

    my $timestamp = get_iso_timestamp();
    my $file_path = "$log_dir/${vault}_${timestamp}.json";
    
    open my $fh, '>', $file_path or return;
    print $fh encode_json($new_data);
    close $fh;
}

sub getDifference {
    my ($current_val, $previous_val) = @_;
    if (!defined $previous_val || !defined $current_val || ($current_val eq $previous_val)) { return ""; }
    
    $current_val =~ s/,//g;
    $previous_val =~ s/,//g;
    my $diff = $current_val - $previous_val;

    my $color = ($diff > 0) ? "diff-cell increase" : ($diff < 0 ? "diff-cell decrease" : "");
    my $diff_display = ($diff == 0) ? "" : sprintf("<span class='%s'>(%+.2f)</span>", $color, $diff);

    return $diff_display;
}

sub compute_differences {
    my ($current, $previous) = @_;
    for my $section (@{$current->{sectionKeys}}) {
        next unless exists $previous->{$section};

        # Define parallel section name for differences
        my $diff_section = "diff_$section";

        for my $i (0 .. $#{$current->{$section}}) {
            my $current_val = $current->{$section}[$i];
            my $previous_val = $previous->{$section}[$i];

            # Store balance difference in parallel structure
            $current->{$diff_section}[$i] = getDifference($current_val, $previous_val);
        }
    }

    my $diff_totals = "diff_totals";
    for my $index (0 .. $#{$current->{sectionTitles}}) {
        my $total_key = $current->{totalKeys}[$index];
        my $current_val = $current->{$total_key};
        my $previous_val = $previous->{$total_key};
        $current->{$diff_totals}[$index] = getDifference($current_val, $previous_val);
    }
}

1;

