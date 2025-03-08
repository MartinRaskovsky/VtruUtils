package Defs;
use strict;
use warnings;
use Exporter 'import';
our @EXPORT_OK = qw(getScriptForType getDetailType getExplorerURL getRenderFunction );

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
    'sections' => \&Render::renderSections,
    'stake'    => \&Render::renderVtruStaked,
    'bsc'      => \&Render::renderBscStaked,
    'vibe'     => \&Render::renderVibeDetails,
    'vortex'   => \&Render::renderVortexDetails
);

# Retrieve script for type
sub getScriptForType {
    my ($type) = @_;
    return $script_map{$type}  // die "Unknown script type: $type";
}

# Retrieve detail type
sub getDetailType {
    my ($detail) = @_;
    return exists $detail_type_map{$detail} ? $detail_type_map{$detail} : "";
}

# Retrieve explorer URL
sub getExplorerURL {
    my ($type, $address) = @_;
    return exists $explorers{$type} ? "$explorers{$type}$address" : "";
}

# Retrieve render function for type
sub getRenderFunction {
    my ($type) = @_;
    return $render_map{$type} // die "Unknown render function for type: $type";
}

1;
