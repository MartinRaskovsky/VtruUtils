package Render;
use strict;
use warnings;
use JSON;

use lib '.';
use Defs qw ( getDetailType getIsGrouperType getExplorerURL getBrandingColor);
use Utils qw( debugLog logError getLabel decorateUnclaimed truncateAddress);
use SectionSummary qw(getSectionSummary);

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
    my $brand = "";
    if ($brandColor ne "") {
       $brand = "<div style='width: 12px; height: 12px; background-color: $brandColor; border-radius: 50%; display: inline-block; margin-right: 8px;'></div>";
    }
    $diff = $diff // "";
    if ($diff eq "") { $diff = "&nbsp;" }

    my $label = "";
    if ($section eq "") {
        $label = "Total";
    } else {
        $label = "<a href='#$section'>$section</a>";
    }
    
    my $html = <<END_HTML;
        <tr class='total-row'>
            <td>$brand<strong>$label</strong></td>
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

#sub generateTotals {
#    my ($result) = @_;
#    my $html = "";
#
#    # Build a mapping from title to index
#    my %title_to_index = map { $result->{sectionTitles}[$_] => $_ } 0 .. $#{$result->{sectionTitles}};
#
#    #for my $index (0 .. $#{$result->{sectionTitles}}) {
#     # Sort titles alphabetically and process by their original index
#    for my $title (sort keys %title_to_index) {
#        my $index = $title_to_index{$title};
#        $html .= generateTotal($result, $index, 1);
#    }
#    return $html;
#}

sub generateTotals {
    my ($result) = @_;
    my $html = '';

    my $sectionSummary = getSectionSummary();

    # Map title (e.g., 'VTRU', 'VIBE') => index
    my %title_to_index = map { $result->{sectionTitles}[$_] => $_ } 0 .. $#{$result->{sectionTitles}};

    foreach my $section (@$sectionSummary) {
        my $section_html = '';

        foreach my $title (@{ $section->{sections} }) {
            next unless exists $title_to_index{$title};
            my $index = $title_to_index{$title};
            $section_html .= generateTotal($result, $index, 1);
        }

        if ($section_html ne '') {
            my $ref = $section->{name};
            $html .= "<tr class='summary-section'><td colspan='3'><a href='#$ref'>$ref</a></td></tr>\n";
            $html .= $section_html;
        }
    }

    return $html;
}

use lib 'src/perl-lib';
use SectionSummary qw(getSectionSummary);

# Generates section header row
sub generateSectionHeader {
    my ($title, $brandColor) = @_;
    return <<"END_HTML";
<tr class='section-header' id="$title">
  <td colspan='2'>$title</td>
  <td style="text-align: right;">
    <div style="width: 16px; height: 16px; background-color: $brandColor; border-radius: 50%; display: inline-block;"></div>
  </td>
</tr>
END_HTML
}

# Adds an empty spacer row between subsections
sub generateSubsectionSpacer {
    return "<tr class='spacer-row'><td colspan='3'></td></tr>";
}

# Generates the header row for each subsection
sub generateSubsectionTableHeader {
    my ($title, $brandColor) = @_;
    return <<"END_HTML";
<tr class='section-header' id="$title">
  <td colspan='2'>$title</td>
  <td style="text-align: right;">
    <div style="width: 16px; height: 16px; background-color: $brandColor; border-radius: 50%; display: inline-block;"></div>
  </td>
</tr>
END_HTML
}

# Generates all wallet rows for a given subsection
sub generateWalletRows {
    my ($vault, $wallets, $result, $section_key, $networkKey) = @_;
    my $rows = '';

    for my $wallet_index (0 .. $#{$result->{wallets}}) {
        my $wallet = $result->{wallets}[$wallet_index];
        my $balance = $result->{$section_key}[$wallet_index] || "0.00";

        my $diff_section = "diff_$section_key"; 
        my $diff_display = $result->{$diff_section}[$wallet_index] // '';
        my $address = getExplorerURL($networkKey, $wallet, truncateAddress($wallet));
        $address = (lc($vault) eq $wallet) ? "<strong>$address</strong>" : $address;
        $rows .= generateBalanceRow($address, $diff_display, $balance);
    }

    return $rows;
}

# Generates total row, group toggle, and detail button if applicable
sub generateSubsectionFooter {
    my ($vault, $wallets, $result, $title, $section_index) = @_;
    my $footer_html = '';

    # Add Total Row
    $footer_html .= generateTotal($result, $section_index, 0);

    # Add Group Toggle if applicable
    my $type = getDetailType($title);
    my $isGroupper = getIsGrouperType($title);
    if ($isGroupper) {
        $footer_html .= <<"END_HTML";
        <tr class='total-row'>
          <td colspan='3'>
            <div class="group-container">
              <span class="group-label">Grouped by:</span>
              <div class="radio-group">
                <label class="radio-label"><input type="radio" name="grouping" value="none" checked> None</label>
                <label class="radio-label"><input type="radio" name="grouping" value="day"> Day</label>
                <label class="radio-label"><input type="radio" name="grouping" value="month"> Month</label>
                <label class="radio-label"><input type="radio" name="grouping" value="year"> Year</label>
              </div>
            </div>
          </td>
        </tr>
END_HTML
    }

    # Add Details Button if applicable
    if ($type ne "") {
        my $wallets_str = join(" ", @$wallets);
        my $group = "'none'";
        if ($isGroupper) {
            $group = "document.querySelector('input[name=grouping]:checked')?.value";
        }
        $footer_html .= <<"END_HTML";
        <tr class='total-row'>
          <td colspan='3'>
            <div class="stake-btn-container">
              <button onclick="openModal('$type', $group, '$vault', '$wallets_str')" class="stake-btn">
                View $title Details
              </button>
            </div>
          </td>
        </tr>
END_HTML
    }

    return $footer_html;
}

## Generates one table per subsection
sub generateTableForSubsections {
    my ($vault, $wallets, $result, $subsections, $title_to_index) = @_;
    my $table_html = "";

    foreach my $title (@$subsections) {
        next unless exists $title_to_index->{$title};  # Skip if title not found
        my $section_index = $title_to_index->{$title};
        my $section_key = $result->{sectionKeys}[$section_index];
        my $networkKey  = $result->{networkKeys}[$section_index];
        my $brandColor  = getBrandingColor($networkKey);

        # Ensure we have valid data
        next unless defined $section_key;

        # Generate the table for this subsection
        my $sub_html = "<table class='section-table'>
        <tbody>";

        # Add section header
        $sub_html .= generateSubsectionTableHeader($title, $brandColor);

        # Generate wallet rows
        my $walletRows = generateWalletRows($vault, $wallets, $result, $section_key, $networkKey);
        $sub_html .= $walletRows if $walletRows ne "";

        # Add subsection footer (totals, buttons)
        $sub_html .= generateSubsectionFooter($vault, $wallets, $result, $title, $section_index);
        
        $sub_html .= "</tbody></table>";

        # Append this section's table to the final output
        $table_html .= $sub_html;
    }

    return $table_html;
}


# Counts only non-zero balance rows per subsection, plus title, totals, buttons
sub countSubsectionRows {
    my ($result, $subsections, $title_to_index) = @_;
    my %row_counts;
    my $total_rows = 0;

    foreach my $title (@$subsections) {
        next unless exists $title_to_index->{$title};
        my $section_index = $title_to_index->{$title};
        my $section_key = $result->{sectionKeys}[$section_index];

        # Start with 1 row for section title
        my $row_count = 1;

        # Count only non-zero balance rows
        if (exists $result->{$section_key}) {
            foreach my $balance (@{$result->{$section_key}}) {
                next if $balance eq "0.00" || $balance eq "0";
                $row_count++;
            }
        } else {
            debugLog($MODULE, "Missing section key: $section_key");
        }

        # Add 1 row for total row
        $row_count++;

        my $type = getDetailType($title);
        # Check if section has a group toggle
        if ($type eq "stake") {
            $row_count += 2;  # Group toggle counts as 2 rows
        }

        # Check if section has a button
        if ($type ne "") {
            $row_count += 2;  # Buttons count as 2 rows
        }

        $row_counts{$title} = $row_count;
        $total_rows += $row_count;
    }

    return (\%row_counts, $total_rows);
}

# Splits subsections into two groups, balancing by row count
sub splitSubsectionsByRowCount {
    my ($subsections_ref, $row_counts, $total_rows) = @_;
    my @subsections = @$subsections_ref;  # ✅ Correctly dereferencing the array reference
    my @left_subsections;
    my @right_subsections;
    my $top_index = 0;
    my $bottom_index = $#subsections;
    my $left_count = 0;
    my $right_count = 0;

    while ($top_index <= $bottom_index) {
        # Allocate from the top to the left
        if ($left_count <= $right_count) {
            my $title = $subsections[$top_index++];
            push @left_subsections, $title;
            $left_count += $row_counts->{$title};
        } else {
            my $title = $subsections[$bottom_index--];
            push @right_subsections, $title;
            $right_count += $row_counts->{$title};
        }
    }

    return (\@left_subsections, \@right_subsections);
}

# Generates a section with multiple tables, balancing by row count
sub generateSectionTables {
    my ($vault, $wallets, $result, $section, $title_to_index) = @_;

    my @subsections = @{ $section->{sections} };

    # Get row counts and split subsections into two columns
    my ($row_counts, $total_rows) = countSubsectionRows($result, \@subsections, $title_to_index);
    my ($left_subsections, $right_subsections) = splitSubsectionsByRowCount(\@subsections, $row_counts, $total_rows);

    # Generate tables for each column
    my $left_tables  = generateTableForSubsections($vault, $wallets, $result, $left_subsections, $title_to_index);
    my $right_tables = generateTableForSubsections($vault, $wallets, $result, $right_subsections, $title_to_index);

    my $ref = $section->{name};
    return <<"END_HTML";
    <div class='section-title' id='$ref'>$ref</div>
    <div class='section-container'>
        <div class='section-column'>$left_tables</div>
        <div class='section-column'>$right_tables</div>
    </div>
END_HTML
}

# Main function rendering sections
sub renderSections {
    my ($vault, $wallets, $result) = @_;
    my $name = $result->{name} // "";
    my $count = 1 + $#{$result->{wallets}};
    my $plural = ($count == 1) ? "" : "es";
    my $title = "$name<br>Analysed $count address$plural";

    my $sectionSummary = getSectionSummary();

    # Create a lookup from section title to index
    my %title_to_index = map { $result->{sectionTitles}[$_] => $_ } 0 .. $#{$result->{sectionTitles}};

    my $html = <<END_HTML;
<h2 class='table-title'>$title</h2>
<div class='section-title'>Summary</div>
END_HTML

    # Generate the summary table
    my $totals = generateTotals($result);
    $html .=<<END_HTML;
    <p><center><table class="summary-table">
    <!--thead><tr><th>SUMMARY</th><th>CHANGE</th><th>TOTAL</th></tr></thead-->
    <tbody>
    $totals
    </tbody></table></center>
END_HTML

    # Container for section tables
    $html .= "<div class='table-container'>";

    # Loop through ordered sections, generating paired tables
    foreach my $section (@$sectionSummary) {
        $html .= generateSectionTables($vault, $wallets, $result, $section, \%title_to_index);
    }

    # Close container
    $html .= "</div>";

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

