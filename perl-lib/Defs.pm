package Defs;
use strict;
use warnings;
use Exporter 'import';
our @EXPORT_OK = qw(get_script_for_type get_detail_type get_explorer_url get_render_function );

# Define script mapping
my %script_map = (
    'sections' => 'getSections.js',
    'bsc'      => 'getDetailSevoStaked.js',
    'vibe'     => 'getDetailVibe.js',
    'vortex'   => 'getDetailVortex.js',
    'stake'    => 'getDetailVtruStaked.js'
);

# Define detail type mapping
my %detail_type_map = (
    "VTRU Staked"  => "stake",
    "VIBE"         => "vibe",
    "VORTEX"       => "vortex",
    "SEVO-X Staked"=> "bsc"
);

# Define explorers mapping
my %explorers = (
    'BSC'  => "https://bscscan.com/address/",
    'ETH'  => "https://etherscan.io/address/",
    'VTRU' => "https://explorer.vitruveo.xyz/address/"
);

# Define render function mapping
my %render_map = (
    'sections' => \&Render::render_sections_html,
    'stake'    => \&Render::render_vtru_staked,
    'bsc'      => \&Render::render_bsc_staked,
    'vibe'     => \&Render::render_vibe_details,
    'vortex'   => \&Render::render_vortex_details
);

# Retrieve script for type
sub get_script_for_type {
    my ($type) = @_;
    return $script_map{$type}  // die "Unknown script type: $type";
}

# Retrieve detail type
sub get_detail_type {
    my ($detail) = @_;
    return exists $detail_type_map{$detail} ? $detail_type_map{$detail} : "";
}

# Retrieve explorer URL
sub get_explorer_url {
    my ($type, $address) = @_;
    return exists $explorers{$type} ? "$explorers{$type}$address" : "";
}

# Retrieve render function for type
sub get_render_function {
    my ($type) = @_;
    return $render_map{$type} // die "Unknown render function for type: $type";
}

1;
