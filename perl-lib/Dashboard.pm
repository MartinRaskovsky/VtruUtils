package Dashboard;

use strict;
use warnings;

use lib "../perl-lib";
use DBUtils qw(get_wallets);
use Utils qw(debug_log2);

use Exporter 'import';
our @EXPORT_OK = qw(load_dashboard get_wallets_html get_main_wrapper);

my $MODULE = "Dashboard";

sub get_wallets_html {
    my ($vault, $wallets) = @_;
    $vault = $vault // 0;
    $wallets = $wallets // 0;
    debug_log2($MODULE, "get_wallets_html($vault, $wallets)");
    my $html =<<END_HTML;
        <label for="vaultAddress">Vault:</label>
        <input type="text" id="vaultAddress" name="vault" placeholder="Enter Vault Address" value="$vault">
                
        <label for="walletAddresses">Wallets (extra wallets not in Vault):</label>
        <textarea id="walletAddresses" name="wallets" rows="5" placeholder="Enter Wallet Addresses, one per line">$wallets</textarea>
                  
        <button type="submit">Get Details</button>
END_HTML
    debug_log2($MODULE, "get_wallets_html=$html");
    return $html;
}

sub get_main_wrapper {
    my ($user) = @_;
    my $email = $user? $user->{email}: "";
    debug_log2($MODULE, "get_main_wrapper($email)");
    if (!$user) {return "";}
    my ($vault, $wallets) = get_wallets($user);
    return get_wallets_html($vault, $wallets);
}

sub load_dashboard {
    my ($user) = @_;
    my $email = $user? $user->{email}: "";
    debug_log2($MODULE, "load_dashboard($email)");

    my $wrapper = get_main_wrapper($user);

    open my $fh, '<', '../public/dashboard.html' or do {
        debug_log2($MODULE, "Failed to open dashboard.html");
        print "<h3 style='color:red;'>Error: Unable to load dashboard.</h3>";
        return;
    };

    my $inside_block = 0;  # Tracks if we are inside the <!--main-input--> block

    while (my $line = <$fh>) {
        if ($line =~ /^<!--main-input-BEGIN-->/) {
            debug_log2($MODULE, "FOUND: <!--main-input-BEGIN-->");
            $inside_block = 1;
            print $wrapper . "\n";  # Insert the replacement content
        }
        elsif ($line =~ /^<!--main-input-END-->/) {
            debug_log2($MODULE, "FOUND: <!--main-input-END-->");
            $inside_block = 0;
            next;  # Skip this line, as it's part of the block
        }
        elsif (!$inside_block) {
            print $line;  # Print lines that are outside the block
        }
    }

    close $fh;

}


1;
