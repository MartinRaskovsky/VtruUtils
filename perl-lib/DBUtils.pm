package DBUtils;

use strict;
use warnings;
use DBI;

use lib "../perl-lib";
use DBConnect qw(getDbh);
use Utils qw(debugLog logError);

use Exporter 'import';
our @EXPORT_OK = qw(
    getEmailFromCode getEmailFromSession putConfirmationCode putSessionId 
    getWallets putVaultAndWallets deleteVaultAndWallets
    getKeepLoggedIn updateKeepLoggedIn
    saveVaultSet getSetByName deleteVaultSet listVaultSets
);

my $MODULE = "DBUtils";

sub getKeepLoggedIn {
    my ($email) = @_;
    if (!defined $email) {
        debugLog($MODULE, "getKeepLoggedIn(undef)");
        return 0;
    }
    debugLog($MODULE, "getKeepLoggedIn($email)");

    my $dbh = getDbh();
    return unless $dbh;

    my $sth = $dbh->prepare("SELECT keep_logged_in FROM users WHERE email = ?");
    $sth->execute($email);
    
    my ($keep_logged_in) = $sth->fetchrow_array();
    $sth->finish;
    $dbh->disconnect;

    debugLog($MODULE, "keep_logged_in=$keep_logged_in for $email");
    return $keep_logged_in // 0;  # Default to 0 if not found
}

sub updateKeepLoggedIn {
    my ($email, $keep_logged_in) = @_;
    debugLog($MODULE, "updateKeepLoggedIn($email, keep_logged_in=$keep_logged_in)");

    my $dbh = getDbh();
    return unless $dbh;

    my $sth = $dbh->prepare("UPDATE users SET keep_logged_in = ? WHERE email = ?");
    $sth->execute($keep_logged_in, $email);
    
    $sth->finish;
    $dbh->disconnect;

    debugLog($MODULE, "Updated keep_logged_in=$keep_logged_in for $email");
}

sub getEmailFromCode {
    my ($code) = @_;
    if (!defined $code) {
        debugLog($MODULE, "getEmailFromCode(undef)");
        return undef;
    }
    debugLog($MODULE, "getEmailFromCode($code)");

    my $dbh = getDbh();
    return unless $dbh;
    
    my $sth = $dbh->prepare("SELECT email FROM users WHERE confirmation_code = ?");
    $sth->execute($code);
    my $hash = $sth->fetchrow_hashref;
    return unless $hash;
    my $email = $hash->{email};
    debugLog($MODULE, "getEmailFromCode=$email");
    return $email;
}

sub getEmailFromSession {
    my ($session_id) = @_;
    if (!defined $session_id) {
        debugLog($MODULE, "getEmailFromSession(undef)");
        return undef;
    }
    debugLog($MODULE, "getEmailFromSession($session_id)");

    my $dbh = getDbh();
    return unless $dbh;
    
    my $sth = $dbh->prepare("SELECT email FROM users WHERE session_id = ?");
    $sth->execute($session_id);
    my $hash = $sth->fetchrow_hashref;
    return unless $hash;
    my $email = $hash->{email};
    debugLog($MODULE, "getEmailFromSession=$email");
    return $email;
}

sub putVaultAndWallets {
    my ($email, $vault, $wallets) = @_;
    if (!defined $email) {
        debugLog($MODULE, "putVaultAndWallets(undef)");
        return;
    }
    my ($N);
    $N = $wallets ? @$wallets : 0;
    debugLog($MODULE, "putVaultAndWallets($email, $vault, wallets: $N)");
    
    my $dbh = getDbh();
    return unless $dbh;
    
    eval {

        if ($vault) {
            # 1️⃣ Insert or update the vault
            my $sth_vault = $dbh->prepare("INSERT INTO vaults (email, vault_address) 
                                        VALUES (?, ?) ON DUPLICATE KEY UPDATE vault_address = ?");
            $sth_vault->execute($email, $vault, $vault);
            debugLog($MODULE, "INSERT INTO vaults ($email, $vault)");
        } else {
             my $sth_vault = $dbh->prepare("DELETE FROM vaults WHERE email = ?");
            $sth_vault->execute($email);       
        }
        
        # 2️⃣ DELETE all old wallets for this email
        my $sth_delete_wallets = $dbh->prepare("DELETE FROM wallets WHERE email = ?");
        #debugLog($MODULE, "DELETE FROM wallets WHERE email = $email");
        $sth_delete_wallets->execute($email);
        
        # 3️⃣ INSERT IGNORE to add only new wallets, preventing duplicates
        my $sth_wallet = $dbh->prepare("INSERT INTO wallets (email, wallet_address) VALUES (?, ?)");
        foreach my $wallet (@$wallets) {
            #debugLog($MODULE, "INSERT INTO wallets (email, wallet_address) VALUES ($email, $wallet)");
            $sth_wallet->execute($email, $wallet);
        }
        
        #$dbh->commit();
        debugLog($MODULE, "Vault and wallets updated successfully for $email");
    };

    if ($@) {
        logError("DB Error in putVaultAndWallets: $@");
        $dbh->rollback();
    }
}

# This function retrieves the current set from the current table.
sub getCurrentSet {
    my ($email) = @_;
    debugLog($MODULE, "getCurrentSet($email)");

    my $dbh = getDbh();
    return unless $dbh;

    # Fetch the current set's vault and wallet information
    my $sth = $dbh->prepare("SELECT set_name, vault_address, wallet_addresses
                             FROM current WHERE email = ?");
    $sth->execute($email);
    my ($set_name, $vault, $wallet_addresses) = $sth->fetchrow_array();

    # Default to empty string if vault or wallet_addresses are NULL
    $vault = $vault // '';  # If vault is NULL, default to empty string
    $wallet_addresses = $wallet_addresses // '';  # If wallet_addresses is NULL, default to empty string

    # Split wallet addresses into an array, default to empty array if no wallets
    my @wallets = $wallet_addresses ? split(",", $wallet_addresses) : ();

    debugLog($MODULE, "getCurrentSet=($set_name, $vault, wallets: " . scalar(@wallets) . ")");
    return ($set_name, $vault, \@wallets);  # Return the set name, vault, and wallet addresses
}


sub deleteVaultAndWallets {
    my ($email) = @_;
    debugLog($MODULE, "deleteVaultAndWallets($email)");
    
    my $dbh = getDbh();
    return unless $dbh;
    
    eval {
        my $sth = $dbh->prepare("DELETE FROM vaults WHERE email = ?");
        $sth->execute($email);
        
        #$dbh->commit();
        debugLog($MODULE, "Vault and wallets deleted for $email");
    };
    
    if ($@) {
        logError("DB Error in deleteVaultAndWallets: $@");
        $dbh->rollback();
    }
}

sub getWallets {
    my ($email) = @_;
    $email = $email // "";
    debugLog($MODULE, "getWallets($email)");
    if ($email eq "") { return (0, 0); }
    my ($set_name, $vault, $wallets) = getCurrentSet($email);
    if (!defined $vault) { return (0, 0); }
    my $wallets_str = join(" ", @$wallets);
    debugLog($MODULE, "getWallets=($set_name, $vault, ...)");
    return ($set_name, $vault, $wallets_str);
}

sub putConfirmationCode {
    my ($email, $code) = @_;
    debugLog($MODULE, "putConfirmationCode($email, $code) ");
    my $dbh = getDbh();
    return unless $dbh;
    
    my $sth = $dbh->prepare("INSERT INTO users (email, confirmation_code) VALUES (?, ?) ON DUPLICATE KEY UPDATE confirmation_code = ?");
    $sth->execute($email, $code, $code);
}

sub putSessionId {
    my ($email, $session_id) = @_;
    debugLog($MODULE, "putSessionId($email, $session_id)");
    my $dbh = getDbh();
    return unless $dbh;
    
    my $sth = $dbh->prepare("UPDATE users SET session_id = ? WHERE email = ?");
    $sth->execute($session_id, $email);
}

# 1 Insert the set into the sets table.
# 2 Update the current table to reflect the new "current" set.
sub saveVaultSet {
    my ($email, $set_name, $vault, $wallets) = @_;
    debugLog($MODULE, "saveVaultSet($email, $set_name, $vault)");
    return unless $email && $set_name && $wallets;

    my $wallet_str = join(",", @$wallets);  # Comma-separated list of wallet addresses
    my $dbh = getDbh();
    return unless $dbh;

    # 1️⃣ Save the set to the `sets` table (this saves all sets, including current ones)
    my $sth_set = $dbh->prepare("INSERT INTO sets (email, set_name, vault_address, wallet_addresses)
                                VALUES (?, ?, ?, ?)
                                ON DUPLICATE KEY UPDATE vault_address = VALUES(vault_address), wallet_addresses = VALUES(wallet_addresses)");
    $sth_set->execute($email, $set_name, $vault, $wallet_str);
    $sth_set->finish;

    # 2️⃣ Update the `current` table to set the new set as the current set
    my $sth_current = $dbh->prepare("REPLACE INTO current (email, set_name, vault_address, wallet_addresses)
                                     VALUES (?, ?, ?, ?)");
    $sth_current->execute($email, $set_name, $vault, $wallet_str);
    $sth_current->finish;

    $dbh->disconnect;
}

# Retrieve a set from the sets table based on both the email and set_name.
sub getSetByName {
    my ($email, $set_name) = @_;
    debugLog($MODULE, "getSetByName($email, $set_name)");

    my $dbh = getDbh();
    return unless $dbh;

    # Fetch the set's vault address and wallet addresses by email and set_name
    my $sth = $dbh->prepare("SELECT vault_address, wallet_addresses
                             FROM sets WHERE email = ? AND set_name = ?");
    $sth->execute($email, $set_name);

    my ($vault, $wallet_addresses) = $sth->fetchrow_array();

    # Return default values if the vault or wallet_addresses are NULL
    $vault = $vault // '';  # Default to empty string if vault is NULL
    $wallet_addresses = $wallet_addresses // '';  # Default to empty string if wallet_addresses is NULL

    # Split wallet addresses into an array, default to an empty array if there are no wallets
    my @wallets = $wallet_addresses ? split(",", $wallet_addresses) : ();

    return ($vault, \@wallets);  # Return the vault and wallet addresses
}

# Delete a saved vault/wallet set by set_name
sub deleteVaultSet {
    my ($email, $set_name) = @_;
    return unless $email && $set_name;

    my $dbh = getDbh();
    return unless $dbh;

    my $sth = $dbh->prepare(q{
        DELETE FROM sets
        WHERE email = ? AND set_name = ?
    });
    $sth->execute($email, $set_name);
    $sth->finish;
    $dbh->disconnect;

    return 1;  # Success
}

# List all set names for a user
sub listVaultSets {
    my ($email) = @_;
    return unless $email;

    my $dbh = getDbh();
    return unless $dbh;

    my $sth = $dbh->prepare(q{
        SELECT set_name FROM sets WHERE email = ? ORDER BY created_at DESC
    });
    $sth->execute($email);
    my @names;
    while (my ($set_name) = $sth->fetchrow_array()) {
        push @names, $set_name;
    }
    $sth->finish;
    $dbh->disconnect;

    return @names;
}

# This function retrieves all sets from the sets table for a user.
sub getAllSets {
    my ($email) = @_;
    debugLog($MODULE, "getAllSets($email)");

    my $dbh = getDbh();
    return unless $dbh;

    # Fetch all sets for the user
    my $sth = $dbh->prepare("SELECT set_name, vault_address, wallet_addresses
                             FROM sets WHERE email = ?");
    $sth->execute($email);
    
    my @sets;
    while (my ($set_name, $vault, $wallet_addresses) = $sth->fetchrow_array()) {
        my @wallets = split(",", $wallet_addresses // '');  # Split into wallet addresses
        push @sets, { set_name => $set_name, vault => $vault, wallets => \@wallets };
    }

    debugLog($MODULE, "getAllSets=(@sets)");
    return @sets;  # Return an array of sets
}

1;

