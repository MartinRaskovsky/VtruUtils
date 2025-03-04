package Render;
use strict;
use warnings;
use JSON;

use lib '.';
use Defs qw ( get_detail_type );
use Utils qw( log_error getLabel explorerURL decorate_unclaimed truncateAddress);

use Exporter 'import';
our @EXPORT_OK = qw(render_page render_sections_html render_details_html);

sub render_page {
    my ($body_content, $type) = @_; 
    
    if ($type eq 'sections') {
        # ✅ Full page rendering
        return <<"END_HTML";
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Query Results</title>
    <link rel="stylesheet" href="/public/styles.css">
</head>
<body>
$body_content
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
    my ($section, $diff, $value) = @_;
    if ($diff eq "") { $diff = "&nbsp;" }
    my $html = <<END_HTML;
        <tr class='total-row'>
            <td><strong>Total $section</strong></td>
            <td class='diff-cell'>$diff</td>
            <td class='balance-cell decimal-align'>$value</td>
        </tr>
END_HTML
    return $html;
}

sub generateTotal {
    my ($result, $index) = @_;
    my $diff_totals = "diff_totals";
    my $section = $result->{sectionTitles}[$index];
    my $total_key = $result->{totalKeys}[$index];
    return generateTotalRow($section, $result->{$diff_totals}[$index], $result->{$total_key});
}

sub generateTotals {
    my ($result) = @_;
    my $html = "";
    for my $index (0 .. $#{$result->{sectionTitles}}) {
        $html .= generateTotal($result, $index);
    }
    return $html;
}

sub render_sections_html {
    my ($vault, $wallets, $result) = @_;
    my $name = $result->{name};
    my $count = 1 + $#{$result->{wallets}};
    my $plural = ($count == 1) ? "" : "es";
    my $title = "$name<br>Analysed $count address$plural";

    my $html = <<END_HTML;
    <h2>$title</h2><div class='table-container'>
    <table class='stake-table'>
    <thead><tr><th>WALLET</th><th>CHANGE</th><th>BALANCE</th></tr></thead><tbody>
END_HTML

    for my $index (0 .. $#{$result->{sectionTitles}}) {
        my $section = $result->{sectionTitles}[$index];
        my $total_key = $result->{totalKeys}[$index];
        my $section_key = $result->{sectionKeys}[$index];
        my $controls = "";

        if ($section eq "VTRU Staked") {
            $controls = <<"END_HTML";
            <span class="group-label">Grouped by:</span>
            <label class="radio-label"><input type="radio" name="grouping" value="none" checked> None</label>
            <label class="radio-label"><input type="radio" name="grouping" value="day"> Day</label>
            <label class="radio-label"><input type="radio" name="grouping" value="month"> Month</label>
            <label class="radio-label"><input type="radio" name="grouping" value="year"> Year</label>
END_HTML
        }

        $html .= "<tr class='section-header'><td colspan='3'>$section</td></tr>";

        for my $wallet_index (0 .. $#{$result->{wallets}}) {
            my $wallet = $result->{wallets}[$wallet_index];
            my $balance = $result->{$section_key}[$wallet_index] || "0.00";
            my $diff_section = "diff_$section_key"; 
            my $diff_display = $result->{$diff_section}[$wallet_index] // '';
            my $address = explorerURL('VTRU', $wallet, truncateAddress($wallet));
            if (lc($vault) eq $wallet) {
                $address = "<strong>$address</strong>";
            }
            $html .= generateBalanceRow($address, $diff_display, $balance);
        }

        $html .= generateTotal($result, $index);

        my $type = get_detail_type($section);
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
                  <button onclick="parent.openModal('$type', $group, '$vault', '$wallets_str')" class="stake-btn">
                    View $section Details
                  </button>
                  $controls
                </div>
              </td>
            </tr>
END_HTML
        }
        $html .= "<tr class='spacer-row'><td colspan='3'></td></tr>";
    }
    
    my $totals = generateTotals($result);
    $html .=<<END_HTML;
    <tr class="section-header"><td colspan="3">Summary</td></tr>
    $totals
    </tbody></table></div>
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

sub render_vtru_staked {
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
        $html .= "<td>$row->{amount}</td>";
        $html .= "<td>$row->{reward}</td>";
        $html .= "<td>$row->{totalStaked}</td>";
        $html .= "<td>$row->{availableToUnstake}</td>";
        $html .= "<td>$row->{estimatedMaturity}</td>";
        $html .= "</tr>";
    }

    $html .= "</tbody></table></div>";

    return $html;
}

# 🔹 Additional Details Rendering Functions
sub render_vibe_details {
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
        $html .= "<td class='decimal-align'>" . decorate_unclaimed($unclaimed) . "</td>";
        $html .= "</tr>";
    }

    $html .= "</tbody></table></div>";

    return $html;
}

sub render_bsc_staked {
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
        $html .= "<td>$row->{locked}</td>";
        $html .= "<td>$row->{unlocked}</td>";
        $html .= "</tr>";
    }

    $html .= "</tbody></table>";
    return $html;
}

sub render_vortex_details {
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

