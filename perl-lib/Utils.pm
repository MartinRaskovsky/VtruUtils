package Utils;
use strict;
use warnings;
use Exporter 'import';
use JSON;

use lib "../perl-lib";
use Conf;

our @EXPORT_OK = qw(logError debugLog explorerURL trimSpaces getLabel truncateAddress printErrorResponse processWallets decorateUnclaimed );

sub logError {
    my ($message) = @_;
    Conf::log_message("ERROR: " . $message);
}

sub debugLog {
    my ($module, $message) = @_;
    Conf::log_message("DEBUG: " . $module . ":\t" . $message);
}

sub trimSpaces {
    my ($str) = @_;
    return undef unless defined $str;
    $str =~ s/^\s+|\s+$//g;
    return $str;
}

sub explorerURL {
    my ($type, $address, $label) = @_;
    $label ||= $address;

    my %explorers = (
        'BSC'  => "https://bscscan.com/address/",
        'ETH'  => "https://etherscan.io/address/",
        'VTRU' => "https://explorer.vitruveo.xyz/address/"
    );

    return exists $explorers{$type} 
        ? "<a target=\"_blank\" href='$explorers{$type}$address'>$label</a>"
        : "";
}

sub decorateUnclaimed {
    my ($value) = @_;

    return "" if !$value || $value eq "0.00";

    return "<span class='unclaimed'>$value</span>";
}

sub getLabel {
    my ($type, $grouping, $data) = @_;
    return $data if $grouping ne 'none';
    return $data if $grouping eq 'none' && $data eq 'Total';
    return explorerURL($type, $data, truncateAddress($data));
}

sub truncateAddress {
    my ($address) = @_;
    return substr($address, 0, 6) . "..." . substr($address, -4);
}

sub printErrorResponse {
    my ($cgi, $error_response) = @_;
    print $cgi->header('application/json');
    print encode_json($error_response);
    exit;
}

sub processWallets {
    my ($wallets) = @_;
    return split /\s+/, $wallets;
}

1;

