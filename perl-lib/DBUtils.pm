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
    getWallets putVaultAndWallets getVaultAndWallets deleteVaultAndWallets
    getKeepLoggedIn updateKeepLoggedIn
);

my $MODULE = "DBUtils";

sub getKeepLoggedIn {
    my ($email) = @_;
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

sub getVaultAndWallets {
    my ($email) = @_;
    debugLog($MODULE, "getVaultAndWallets($email)");
    
    my $dbh = getDbh();
    return unless $dbh;
    
    my $sth_vault = $dbh->prepare("SELECT vault_address FROM vaults WHERE email = ?");
    $sth_vault->execute($email);
    my ($vault) = $sth_vault->fetchrow_array();
    $vault = $vault // '';
    
    my $sth_wallets = $dbh->prepare("SELECT wallet_address FROM wallets WHERE email = ?");
    $sth_wallets->execute($email);
    my @wallets;
    while (my ($wallet) = $sth_wallets->fetchrow_array()) {
        push @wallets, $wallet;
    }
    
    my $N;
    $N = @wallets;
    debugLog($MODULE, "getVaultAndWallets=($vault, wallets: $N)");
    return ($vault, \@wallets);
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
    my ($vault, $wallets) = getVaultAndWallets($email);
    if (!defined $vault) { return (0, 0); }
    my $wallets_str = join(" ", @$wallets);
    debugLog($MODULE, "getWallets=($vault,...)");
    return ($vault, $wallets_str);
}

sub putConfirmationCode {
    my ($email, $code) = @_;
    debugLog($MODULE, "putConfirmationCode($email, $code) ");
    my $dbh = getDbh();
    return unless $dbh;
    
    debugLog($MODULE, "INSERT INTO users ($email, $code)");
    my $sth = $dbh->prepare("INSERT INTO users (email, confirmation_code) VALUES (?, ?) ON DUPLICATE KEY UPDATE confirmation_code = ?");
    $sth->execute($email, $code, $code);
    debugLog($MODULE, "Confirmation code stored in DB");
}

sub putSessionId {
    my ($email, $session_id) = @_;
    debugLog($MODULE, "putSessionId($email, $session_id)");
    my $dbh = getDbh();
    return unless $dbh;
    
    my $sth = $dbh->prepare("UPDATE users SET session_id = ? WHERE email = ?");
    debugLog($MODULE, "Storing session_id for $email");
    $sth->execute($session_id, $email);
    debugLog($MODULE, "session_id stored successfully");
}

1;

