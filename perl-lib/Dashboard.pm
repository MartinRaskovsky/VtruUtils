package Dashboard;

use strict;
use warnings;

use lib "../perl-lib";
use DBUtils qw(getWallets);
use Utils qw(debugLog);

use Exporter 'import';
our @EXPORT_OK = qw(loadDashboard getMainWrapper);

my $MODULE = "Dashboard";

sub getWalletsHtml {
    my ($set_name, $vault, $wallets) = @_;
    if (!defined $vault   || $vault   eq "0") { $vault = '' ; }
    if (!defined $wallets || $wallets eq "0") { $wallets = '' ; }
    if (!defined $set_name || $set_name eq "0") { $set_name = '' ; }
    my $state = ($vault ne "" || $wallets ne '')? "" : "disabled"; # assumes if given they are valid
    debugLog($MODULE, "getWalletsHtml(state=$state; vault=$vault)");
    my $html =<<END_HTML;
        <div id="currentSetName" style="font-weight: bold; margin-bottom: 10px;">$set_name</div>
    
        <label for="vaultAddress">Vault:</label>
        <input type="text" id="vaultAddress" name="vault" placeholder="Enter Vault Address" oninput="window.validateForm()" value="$vault">
    
        <label for="walletAddresses">Wallets (extra wallets not in Vault):</label>
        <textarea id="walletAddresses" name="wallets" rows="5" cols="50" placeholder="Enter Wallet Addresses, one per line" oninput="window.validateForm()">$wallets</textarea>
    
        <!-- 🔒 Hidden field for the set name -->
        <input type="hidden" name="set_name" id="setNameHidden">
    
        <div class="button-row" style="display: flex; justify-content: center; gap: 10px; margin-top: 20px;">
        <button type="button" id="nameWalletsBtn" $state>Names</button>
        <button type="button" id="loadSetBtn">Load</button>
        <button type="button" id="saveSetsBtn" $state>Save</button>
        </div>
    
        <button type="submit" id="getDetailsBtn" $state>Get Details</button>
END_HTML
    #debugLog($MODULE, "getWalletsHtml=$html");
    return $html;
}

sub getMainWrapper {
    my ($email) = @_;
    $email = $email // "";
    debugLog($MODULE, "getMainWrapper($email)");
    if ($email eq "") {return "";}
    my ($set_name, $vault, $wallets) = getWallets($email);
    return getWalletsHtml($set_name, $vault, $wallets);
}

sub loadDashboard {
    my ($email) = @_;
    $email = $email // "";
    debugLog($MODULE, "loadDashboard($email)");

    my $wrapper = getMainWrapper($email);

    open my $fh, '<', '../public/dashboard.html' or do {
        debugLog($MODULE, "Failed to open dashboard.html");
        print "<h3 style='color:red;'>Error: Unable to load dashboard.</h3>";
        return;
    };

    my $inside_block = 0;  # Tracks if we are inside the <!--main-input--> block

    while (my $line = <$fh>) {
        if ($line =~ /^<!--main-input-BEGIN-->/) {
            $inside_block = 1;
            print $wrapper . "\n";  # Insert the replacement content
        }
        elsif ($line =~ /^<!--main-input-END-->/) {
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
