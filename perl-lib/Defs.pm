package Defs;
use strict;
use warnings;
use Exporter 'import';
our @EXPORT_OK = qw(getScriptForType getDetailType isChain getIsGrouperType getExplorerURL getRenderFunction getChainMarker getNetworkChain);

# ==== GENERATED PERL DEFS START ====
# Define script mapping
my %script_map = (
    'stake' => 'getDetailVtruStaked.js',
    'bsc' => 'getDetailSevoXStaked.js',
    'vibe' => 'getDetailVibe.js',
    'vortex' => 'getDetailVortex.js',
    'sections' => 'getSections.js',
);

# Define detail type mapping
my %detail_type_map = (
    "VTRU Staked" => "stake",
    "SEVO-X Staked" => "bsc",
    "VIBE" => "vibe",
    "VORTEX" => "vortex",
);

# Define grouppers type
my %group_type_map = (
    "VTRU Staked" => 1,
    "SEVO-X Staked" => 1,
);

# Define explorers mapping
my %explorers = (
    'VTRU' => "https://explorer.vitruveo.xyz/address/",
    'ETH' => "https://etherscan.io/address/",
    'BSC' => "https://bscscan.com/address/",
    'POL' => "https://polygonscan.com/address/",
    'SOL' => "https://explorer.solana.com/address/",
    'TEZ' => "https://tzkt.io/",
    'ARB' => "https://arbiscan.io/address/",
    'OPT' => "https://optimistic.etherscan.io/address/",
    'BASE' => "https://basescan.org/address/",
    'AVAX' => "https://snowtrace.io/address/",
);

my @chains = (
    "EVM",
    "SOL",
    "TEZ"
);

my %net_to_chain = (
    'VTRU' => "EVM",
    'ETH' => "EVM",
    'BSC' => "EVM",
    'POL' => "EVM",
    'ARB' => "EVM",
    'OPT' => "EVM",
    'BASE' => "EVM",
    'AVAX' => "EVM",
    'SOL' => "SOL",
    'TEZ' => "TEZ",
);

# Define network branding color
my %branding = (
    'BSC' => {
        color => "#F3BA2F",
        icon  => "bsc.png",
        emoji => '🟡',
    },
    'ETH' => {
        color => "#627EEA",
        icon  => "eth.png",
        emoji => '💠',
    },
    'VTRU' => {
        color => "#8247E5",
        icon  => "vtru.png",
        emoji => '🟣',
    },
    'POL' => {
        color => "#282A36",
        icon  => "pol.png",
        emoji => '🔗',
    },
    'SOL' => {
        color => "#9945FF",
        icon  => "sol.png",
        emoji => '🌿',
    },
    'TEZ' => {
        color => "#2C7DF7",
        icon  => "tez.png",
        emoji => '🔷',
    },
    'ARB' => {
        color => "#28A0F0",
        icon  => "arb.png",
        emoji => '🧊',
    },
    'OPT' => {
        color => "#FF0420",
        icon  => "opt.png",
        emoji => '🚀',
    },
    'BASE' => {
        color => "#0052FF",
        icon  => "base.png",
        emoji => '🌀',
    },
    'AVAX' => {
        color => "#E84142",
        icon  => "avax.png",
        emoji => '⛰️',
    },
);
# ==== GENERATED PERL DEFS END ====

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

# These groupping defs are needed also in constants.js
# Retrieve detail type
sub getIsGrouperType {
    my ($detail) = @_;
    return exists $group_type_map{$detail} ? $group_type_map{$detail} : 0;
}

my %wanted = map { uc($_) => 1 } @chains;
sub isChain {
    my ($chain) = @_;
    return $wanted{uc($chain)} // 0;
}

sub getNetworkChain {
    my ($net) = @_;
    return exists $net_to_chain{$net} ? $net_to_chain{$net} : "EVM";
}

# Retrieve explorer URL
sub getExplorerURL {
    my ($network, $address, $label) = @_;
    if (!defined $network) { return ''; }
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

sub getChainMarker {
    my ($chainId, $prefer) = @_;
    if (!defined $chainId) { return ''; }
    $prefer ||= 'icon';  # default to icon if available

    my $entry = $branding{$chainId};
    return '' unless $entry;

    if ($prefer eq 'icon' && $entry->{icon}) {
        return qq{
            <img src="/icons/$entry->{icon}" alt="$chainId" width="16" height="16" 
                 style="display:inline-block;vertical-align:middle;">

        };
    }
    elsif ($prefer eq 'emoji' && $entry->{emoji}) {
        return qq{
            <span style="font-size:16px;">$entry->{emoji}</span>
        };
    }
    elsif ($entry->{color}) {
        return qq{
            <div style="width: 16px; height: 16px; background-color: $entry->{color}; 
                        border-radius: 50%; display: inline-block;"></div>
        };
    }

    return ''; # fallback empty if all else fails
}


1;
