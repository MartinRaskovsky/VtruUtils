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

    # Step 1: Process email (remove '@' and invalid filename characters)
    if (defined $email && $email ne '') {
        my $pattern = $email;
        $pattern =~ s/@//g;
        $pattern =~ s/[^a-zA-Z0-9_.-]//g;
        $signature .= $pattern;
    }

    # Step 2: Build unified address list
    my @addresses;
    push @addresses, $vault if defined $vault && $vault ne '';
    push @addresses, @$wallets if defined $wallets && ref($wallets) eq 'ARRAY';

    # Step 3: Sort addresses
    @addresses = sort map {
        my $clean = $_;
        $clean =~ s/^0x//;
        $clean =~ s/[^a-zA-Z0-9]//g;
        $clean;
    } @addresses;

    # Step 4: Determine segment length
    my $N = scalar(@addresses);
    my $segment_length = ($N == 1) ? 10 : ($N <= 3) ? 6 : ($N <= 5) ? 4 : 3;

    # Step 5: Append each address in short form
    foreach my $addr (@addresses) {
        if (length($addr) >= $segment_length * 2) {
            my $short = substr($addr, 0, $segment_length) . "_" . substr($addr, -$segment_length);
            $signature .= "_$short";
        } else {
            $signature .= "_$addr";
        }
    }

    # Step 6: Truncate to fit Linux filename limits
    $signature = substr($signature, 0, 200);

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
    my ($signature, $new_data, $old_data) = @_;
    debugLog($MODULE, "writeCurrentLog($signature)");

    my $json_writer = JSON->new->canonical(1)->pretty(1)->utf8;

    my $new_json = $json_writer->encode(innerSort($new_data));  # Sorted and pretty

    if ($old_data) {
        my $old_json = $json_writer->encode(innerSort($old_data));
        return if $new_json eq $old_json;
    }

    my $timestamp = getISOTimeStamp();
    my $file_path = "$log_dir/${signature}_${timestamp}.json";

    open my $fh, '>', $file_path or return;
    print $fh $new_json;
    close $fh;
}

sub getDifference {
    my ($current_val, $previous_val) = @_;
    if (!defined $previous_val || !defined $current_val || ($current_val eq $previous_val)) { return ""; }
    
    if ($current_val  eq "0 (unavailable)") { return ""; }
    if ($previous_val eq "0 (unavailable)") { return ""; }
    
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

    # Step 1: Build wallet → index map for previous
    my %prev_wallet_index;
    my @prev_wallets = @{$previous->{wallets} || []};
    for my $i (0 .. $#prev_wallets) {
        $prev_wallet_index{ lc $prev_wallets[$i] } = $i;
    }

    for my $section (@{$current->{sectionKeys}}) {
        next unless exists $previous->{$section};
        my $diff_section = "diff_$section";

        for my $i (0 .. $#{$current->{$section}}) {
            my $wallet = lc $current->{wallets}[$i];
            my $current_val = $current->{$section}[$i];
            my $previous_val = "";

            # Lookup matching wallet index in previous data
            if (exists $prev_wallet_index{$wallet}) {
                my $prev_index = $prev_wallet_index{$wallet};
                $previous_val = $previous->{$section}[$prev_index];
            }

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

