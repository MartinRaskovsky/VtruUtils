package Logs;
use strict;
use warnings;
use Exporter 'import';
use JSON;
use File::Path qw(make_path);
use File::Spec;
use Time::HiRes qw(gettimeofday);

use lib '.';
use Utils qw( logError debugLog);

use Debug qw(getType);

our @EXPORT_OK = qw(getSignature findLatestLog writeCurrentLog computeDifferences);

my $MODULE = "Logs   ";

my $log_dir = "../public/data";
make_path($log_dir) unless -d $log_dir;

use Time::HiRes qw(gettimeofday);

sub getSignature {
    my ($email, $vault, $wallets) = @_;
    debugLog($MODULE, "getSignature($email, $vault, ...)");

    my $signature = '';

    # Process email (remove '@' and invalid filename characters)
    if (defined $email && $email ne '') {
        my $pattern = $email;
        $pattern =~ s/@//g;   # Remove '@'
        $pattern =~ s/[^a-zA-Z0-9_.-]//g;  # Remove invalid filename characters
        $signature .= $pattern;
    }

    # Append Vault if defined
    if (defined $vault && $vault ne '') {
        debugLog($MODULE, "using vault: $vault");
        $vault =~ s/[^a-zA-Z0-9]//g;  # Remove non-alphanumeric characters
        $signature .= "_$vault";
    }

    # If no vault is available, use wallets
    elsif (defined $wallets && ref($wallets) eq 'ARRAY' && @$wallets > 0) {
        my $N = scalar(@$wallets);

        # Determine segment length based on the number of wallets
        my $segment_length = ($N == 1) ? 10 : ($N <= 3) ? 6 : ($N <= 5) ? 4 : 3;
        
        debugLog($MODULE, "Using $N wallets, segment length: $segment_length");

        foreach my $wallet (@$wallets) {
            my $copy = $wallet;
            $copy =~ s/^0x//;  # Remove '0x' prefix
            $copy =~ s/[^a-zA-Z0-9]//g;  # Remove non-alphanumeric characters

            if (length($copy) >= $segment_length * 2) {
                my $short_wallet = substr($copy, 0, $segment_length) . "_" . substr($copy, -$segment_length);
                $signature .= "_$short_wallet";
            } else {
                $signature .= "_$copy";  # If wallet is too short, use as is
            }
        }
    }

    # Ensure signature length remains within Linux filename limits (255 characters)
    $signature = substr($signature, 0, 200);  # Leave space for timestamp & extension

    debugLog($MODULE, "Final signature: $signature");
    return $signature;
}

sub getISOTimeStamp {
    my ($sec, $msec) = gettimeofday(); # Get current time with microsecond precision
    my ($year, $mon, $mday, $hour, $min, $full_sec) = (localtime($sec))[5,4,3,2,1,0];
    
    $msec = int($msec / 1000);  # Convert microseconds to milliseconds
    $year += 1900;
    $mon += 1;

    return sprintf("%04d-%02d-%02dT%02d-%02d-%02d-%03dZ", $year, $mon, $mday, $hour, $min, $full_sec, $msec);
}


sub Canonical_JSONUnused {
    my ($data) = @_;
    return JSON->new->canonical(1)->utf8->encode($data);
}       
    
sub sortedJSON {
    my ($data) = @_;
    return encode_json(innerSort($data)); 
}       
    
sub innerSort {
    my ($item) = @_;
    
    if (ref $item eq 'HASH') {
        return { map { $_ => innerSort($item->{$_}) } sort keys %$item };
    } elsif (ref $item eq 'ARRAY') {
        return [ map { innerSort($_) } @$item ]; 
    } else {
        return $item;
    }
}

sub findLatestLog {
    my ($signature) = @_;
    debugLog($MODULE, "findLatestLog($signature)");
    opendir(my $dh, $log_dir) or return;
    my @files = grep { /^${signature}_\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}-\d{3}Z\.json$/ } readdir($dh);
    closedir($dh);

    return unless @files;
    @files = sort { $b cmp $a } @files;
    
    my $latest_file = "$log_dir/$files[0]";
    open my $fh, '<', $latest_file or return;
    my $json = do { local $/; <$fh> };
    close $fh;
    
    return decode_json($json);
}

sub writeCurrentLog {
    my ($signature,$new_data,$old_data) = @_;
    debugLog($MODULE, "writeCurrentLog($signature)");

    my $new_json = Canonical_JSONUnused($new_data);  # Sorts and encodes new JSON
        
    if ($old_data) {
        my $old_json = Canonical_JSONUnused($old_data);  # Sorts and encodes old JSON
    
        # Skip writing if identical
        return if $new_json eq $old_json;
    }

    my $timestamp = getISOTimeStamp();
    my $file_path = "$log_dir/${signature}_${timestamp}.json";
    
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

sub computeChainDifferences {
    my ($chain, $current, $previous) = @_;
    debugLog($MODULE, "computeChainDifferences($chain)");
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

sub computeDifferences {
    my ($current, $previous) = @_;
    debugLog($MODULE, "computeDifferences()");
    computeChainDifferences('evm', $current->{evm}, $previous->{evm});
    computeChainDifferences('sol', $current->{sol}, $previous->{sol});
    computeChainDifferences('tez', $current->{tez}, $previous->{tez});
}

1;

