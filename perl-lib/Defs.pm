package Defs;
use strict;
use warnings;
use Exporter 'import';
our @EXPORT_OK = qw(getScriptForType getDetailType getIsGrouperType getExplorerURL getRenderFunction getBrandingColor);

# Define script mapping
my %script_map = (
    'sections' => 'getSections.js',
    'bsc'      => 'getDetailSevoXStaked.js',
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

# Define grouppers type
my %group_type_map = (
    "VTRU Staked"  => 1,
    "SEVO-X Staked"=> 0,
);

# Define explorers mapping
my %explorers = (
    'BSC'  => "https://bscscan.com/address/",
    'ETH'  => "https://etherscan.io/address/",
    'VTRU' => "https://explorer.vitruveo.xyz/address/",
    'POL'  => "https://polygonscan.com/address/",
);

# Define network branding color
my %branding = (
    'BSC'  => "#F3BA2F",
    'ETH'  => "#627EEA",
    'VTRU' => "#8247E5",
    'POL'  => "#282A36"
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

# Retrieve detail type
sub getIsGrouperType {
    my ($detail) = @_;
    return exists $group_type_map{$detail} ? $group_type_map{$detail} : 0;
}

# Retrieve explorer URL
sub getExplorerURL {
    my ($network, $address, $label) = @_;
    $label ||= $address;
    return exists $explorers{$network} 
        ? "<a target=\"_blank\" href='$explorers{$network}$address'>$label</a>"
        : "";
}

# Retrieve render function for type
sub getRenderFunction {
    my ($type) = @_;
    return $render_map{$type} // die "Unknown render function for type: $type";
}

# Retrieve branding color for network
sub getBrandingColor {
    my ($network) = @_;
    return $branding{$network} // die "Unknown render function for network: $network";
}


1;
