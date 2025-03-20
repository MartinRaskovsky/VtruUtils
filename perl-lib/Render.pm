package Render;
use strict;
use warnings;
use JSON;

use lib '.';
use Defs qw ( getDetailType getExplorerURL getBrandingColor);
use Utils qw( debugLog logError getLabel decorateUnclaimed truncateAddress);

use Exporter 'import';
our @EXPORT_OK = qw(renderPage renderSections );

my $MODULE = "Render";

sub renderPage {
    my ($header, $body_content, $type) = @_;
    debugLog($MODULE, "renderPage(..., $type)");
    
    if ($type eq 'sections') {
        my $modal =<<END_HTML;
            <div id="modal" class="modal" style="display:none;">
                <div class="modal-content">
                    <h3>Loading...</h3>
                    <button onclick="closeModal()" class="stake-btn">Close</button>
                </div>
            </div>
END_HTML
        # ✅ Full page rendering
        return <<"END_HTML";
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Query Results</title>
    <link rel="stylesheet" href="/public/styles.css">
    <script src="/public/scripts.js" defer></script>  <!-- Ensures scripts run after DOM loads -->
</head>
<body class="rendered-page" id="rendered-page">
    <div id="main-wrapper">
        <div id="header">
            <button id="backBtn" class="header-btn" onclick="restoreForm()">Back</button>
            <h1>Vault & Wallet Details</h1>
            <button id="logoutBtn" class="header-btn" onclick="logout()">Log Out</button>
        </div>        

        <div id="content">
            <!-- DRIVER.CGI GENERATED CONTENT STARTS HERE -->
$header
$modal
$body_content
            <!-- DRIVER.CGI GENERATED CONTENT ENDS HERE -->
        </div>
    </div>

    <script>
    function openModal(type, grouping, vault, wallets) {
        let modal = document.getElementById("modal");
        let modalContent = modal.querySelector(".modal-content");

        if (!modal || !modalContent) { 
            console.log("Missing modal or modal-content");
            return; 
        }

        modalContent.innerHTML = "<h3>Loading...</h3>";

        let params = new URLSearchParams({ type, grouping, vault, wallets });
        fetch("driver.cgi?" + params.toString())
            .then(response => response.text())
            .then(html => {
                modalContent.innerHTML = html;
                modal.classList.add("active");
                modal.style.display = "block";
            })
            .catch(error => {
                modalContent.innerHTML = "<h3>Error loading content</h3>";
                modal.classList.add("active");
                modal.style.display = "block";
            });
    }

    function closeModal() {
        let modal = document.getElementById("modal");
        if (!modal) return;
        modal.style.display = "none";
        modal.classList.remove("active");  // Hide modal
    }

</script>


    <script src="/public/scripts.js"></script> 
</body>
</html>
END_HTML
    } else {
        # ✅ Modal content rendering (No full HTML, just direct content)
        return $body_content;  # ✅ DO NOT RETURN EXTRA HTML WRAPPERS
    }
}

sub generateBalanceRow {
    my ($address, $diff, $balance) = @_;
    if ($balance eq "0.00" || $balance eq "0") { return ""; }
    if ($diff eq "") { $diff = "&nbsp;" }
    my $html = <<END_HTML;
        <tr class='section-row'>
            <td class='wallet-cell'>$address</td>
            <td class='diff-cell'>$diff</td>
            <td class='balance-cell decimal-align'>$balance</td>
        </tr>
END_HTML
    return $html;
}

sub generateTotalRow {
    my ($section, $brandColor, $diff, $value) = @_;
    my $title = ($section eq "")? "Total" : "";
    my $brand = "";
    if ($brandColor ne "") {
       $brand = "<div style='width: 12px; height: 12px; background-color: $brandColor; border-radius: 50%; display: inline-block; margin-right: 8px;'></div>";
    }
    $diff = $diff // "";
    if ($diff eq "") { $diff = "&nbsp;" }
    
    my $html = <<END_HTML;
        <tr class='total-row'>
            <td>$brand<strong>$title$section</strong></td>
            <td class='diff-cell'>$diff</td>
            <td class='balance-cell decimal-align'>$value</td>
        </tr>
END_HTML
    return $html;
}

sub generateTotal {
    my ($result, $index, $branded) = @_;
    my $diff_totals = "diff_totals";
    my $section = $branded ? $result->{sectionTitles}[$index]: "";
    my $total_key = $result->{totalKeys}[$index];
    my $networkKey  = $result->{networkKeys}[$index];
    my $brandColor  = $branded ? getBrandingColor($networkKey): "";
    return generateTotalRow($section, $brandColor, $result->{$diff_totals}[$index], $result->{$total_key});
}

sub generateTotals {
    my ($result) = @_;
    my $html = "";
    for my $index (0 .. $#{$result->{sectionTitles}}) {
        $html .= generateTotal($result, $index, 1);
    }
    return $html;
}

sub renderSections {
    my ($vault, $wallets, $result) = @_;
    my $name = $result->{name} // "";
    my $count = 1 + $#{$result->{wallets}};
    my $plural = ($count == 1) ? "" : "es";
    my $title = "$name<br>Analysed $count address$plural";

    # Count total sections to determine split point
    my $total_sections = scalar @{$result->{sectionTitles}};
    my $half = int(($total_sections + 1) / 2); # Ensure even distribution
    # Start table container
my $html = <<END_HTML;
    <h2 class='table-title'>$title</h2><div class='table-container'>
END_HTML

    my $table_open = 0;

    for my $index (0 .. $#{$result->{sectionTitles}}) {
        # Open new table if needed
        if ($index == 0 || $index == $half) {
            $html .= "<table class='stake-table'>
            <thead><tr><th>WALLET</th><th>CHANGE</th><th>BALANCE</th></tr></thead>
            <tbody>";
            $table_open = 1;
        }

        my $section     = $result->{sectionTitles}[$index];
        my $total_key   = $result->{totalKeys}[$index];
        my $section_key = $result->{sectionKeys}[$index];
        my $networkKey  = $result->{networkKeys}[$index];
        my $brandColor  = getBrandingColor($networkKey);
        my $controls = "";

        if ($section eq "VTRU Staked") {
            $controls = <<"END_HTML";
      <div class="group-container">
        <span class="group-label">Grouped by:</span>
        <div class="radio-group">
          <label class="radio-label"><input type="radio" name="grouping" value="none" checked> None</label>
          <label class="radio-label"><input type="radio" name="grouping" value="day"> Day</label>
          <label class="radio-label"><input type="radio" name="grouping" value="month"> Month</label>
          <label class="radio-label"><input type="radio" name="grouping" value="year"> Year</label>
        </div>
      </div>
END_HTML
        }

        $html .=<<END_HTML;
<tr class='section-header'>
  <td colspan='2'>$section</td>
  <td style="text-align: right;">
    <div style="width: 16px; height: 16px; background-color: $brandColor; border-radius: 50%; display: inline-block;"></div>
  </td>
</tr>
END_HTML


        for my $wallet_index (0 .. $#{$result->{wallets}}) {
            my $wallet = $result->{wallets}[$wallet_index];
            my $balance = $result->{$section_key}[$wallet_index] || "0.00";
            my $diff_section = "diff_$section_key"; 
            my $diff_display = $result->{$diff_section}[$wallet_index] // '';
            my $address = getExplorerURL($networkKey, $wallet, truncateAddress($wallet));
            if (lc($vault) eq $wallet) {
                $address = "<strong>$address</strong>";
            }
            $html .= generateBalanceRow($address, $diff_display, $balance);
        }

        $html .= generateTotal($result, $index, 0);

        my $type = getDetailType($section);
        if ($type ne "") {

            my $wallets_str = join(" ", @$wallets);
            my $group = "'none'";
            if ($type eq "stake") {
                $group = "document.querySelector('input[name=grouping]:checked')?.value";
            }
            $html .= <<END_HTML;
            <tr class='total-row'>
              <td colspan='3'>
                <div class='stake-controls'>
$controls
              </div>
              <div class="stake-btn-container">
                  <button onclick="openModal('$type', $group, '$vault', '$wallets_str')" class="stake-btn">
                    View $section Details
                  </button>
                </div>
              </td>
            </tr>
END_HTML
        }

        $html .= "<tr class='spacer-row'><td colspan='3'></td></tr>";

         # Close table at half and end
        if ($index == $half - 1 || $index == $#{$result->{sectionTitles}}) {
            $html .= "</tbody></table>";
            $table_open = 0; 
        }
    }

       # Close container
    $html .= "</div>";


   # Add Summary table at the end
    my $totals = generateTotals($result);
    $html .=<<END_HTML;
    <p><center><table class="summary-table">
    <thead><tr><th>SUMMARY</th><th>CHANGE</th><th>TOTAL</th></tr></thead>
    <!--tr class="section-header"><td colspan="3">Summary</td></tr-->
    <tbody>
    $totals
    </tbody></table></center>
END_HTML

    return $html;
}

sub closeModal {
    my $type = @_;
    my $html =<<END_HTML;
    <span class="close" onclick="closeModal('$type')">x</span>
END_HTML
    return $html;
}

sub renderVtruStaked {
    my ($grouping, $data) = @_;
    my $type = "stake";
    my ($title) = ($grouping eq 'none') ? 'Wallet' : '#Stakes';
    my $close = closeModal($type);
    my $html =<<END_HTML;
    $close
    <h2>VTRU Staked Details</h2><div class='scrollable'>
    <table class='stake-table'>
    <thead><tr><th>$title</th><th>Amount</th><th>Reward</th><th>Locked</th><th>Available</th><th>Maturity</th></tr></thead><tbody>
END_HTML

    foreach my $row (@$data) {
        my ($label) = getLabel('VTRU', $grouping, $row->{wallet});
        $html .= "<tr>";
        $html .= "<td>$label</td>";
        $html .= "<td class='decimal-align'>$row->{amount}</td>";
        $html .= "<td class='decimal-align'>$row->{reward}</td>";
        $html .= "<td class='decimal-align'>$row->{totalStaked}</td>";
        $html .= "<td>$row->{availableToUnstake}</td>";
        $html .= "<td>$row->{estimatedMaturity}</td>";
        $html .= "</tr>";
    }

    $html .= "</tbody></table></div>";

    return $html;
}

# 🔹 Additional Details Rendering Functions
sub renderVibeDetails {
    my ($grouping, $data) = @_;
    my $type = "vibe";
    my $close = closeModal($type);
    my $html =<<END_HTML;
    $close
    <h2>Vibe Details</h2>
    <div class='scrollable'><table class='stake-table'>
    <thead><tr><th>Wallet</th><th>#Tokens</th><th>Balance</th><th>Claimed</th><th>Unclaimed</th></tr></thead><tbody>
END_HTML

    foreach my $row (@$data) {
        my $wallet    = $row->{wallet} // "";
        my $noTokens  = $row->{noTokens} // "0.00";
        my $balance   = $row->{balance} // "0.00";
        my $claimed   = $row->{claimed} // "0.00";
        my $unclaimed = $row->{unclaimed} // "0.00";
        my ($label)   = getLabel('VTRU', $grouping, $wallet);

        $html .= "<tr>";
        $html .= "<td class='wallet-cell'>$label</td>";
        $html .= "<td class='decimal-align'>$noTokens</td>";
        $html .= "<td class='decimal-align'>$balance</td>";
        $html .= "<td class='decimal-align'>$claimed</td>";
        $html .= "<td class='decimal-align'>" . decorateUnclaimed($unclaimed) . "</td>";
        $html .= "</tr>";
    }

    $html .= "</tbody></table></div>";

    return $html;
}

sub renderBscStaked {
    my ($grouping, $data) = @_;
    my $type = "bsc";
    my $close = closeModal($type);
    my $html =<<END_HTML;
    $close
    <h2>SEVO-X Staked Details</h2><table class='stake-table'>
    <thead><tr><th>Wallet</th><th>Date</th><th>Locked</th><th>Unlocked</th></tr></thead><tbody>
END_HTML

    foreach my $row (@$data) {
        my ($label) = getLabel('BSC', $grouping, $row->{wallet});
        $html .= "<tr>";
        $html .= "<td>$label</td>";
        $html .= "<td>$row->{date}</td>";
        $html .= "<td class='decimal-align'>$row->{locked}</td>";
        $html .= "<td class='decimal-align'>$row->{unlocked}</td>";
        $html .= "</tr>";
    }

    $html .= "</tbody></table>";
    return $html;
}

sub renderVortexDetails {
   my ($grouping, $data) = @_;
    my $type = "vortex";
    my $close = closeModal($type);
    my $html =<<END_HTML;
    $close
    <h2>Vortex Details</h2><div class='scrollable'>
    <table class='stake-table'>
    <thead><tr><th>Wallet</th><th>Rarity</th><th>Count</th></tr></thead><tbody>
END_HTML

    foreach my $row (@$data) {
        my ($label) = getLabel('VTRU', $grouping, $row->{wallet});
        $html .= "<tr>";
        $html .= "<td class='wallet-cell'>$label</td>";
        $html .= "<td class='decimal-align'>$row->{kind}</td>";
        $html .= "<td class='decimal-align'>$row->{count}</td>";
        $html .= "</tr>";
    }

    $html .= "</tbody></table></div>";
    return $html;
}


1;

