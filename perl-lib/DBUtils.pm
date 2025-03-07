package DBUtils;

use strict;
use warnings;
use DBI;

use lib "../perl-lib";
use DBConnect qw(get_dbh);
use Utils qw(debug_log2 log_error);

use Exporter 'import';
our @EXPORT_OK = qw(get_user_by_code store_confirmation_code update_session_id get_wallets get_user_by_session set_vault_and_wallets get_vault_and_wallets delete_vault_and_wallets);

my $MODULE = "DBUtils";

sub get_user_by_code {
    my ($code) = @_;
    if (!defined $code) {
        debug_log2($MODULE, "get_user_by_code(undef)");
        return undef;
    }
    debug_log2($MODULE, "get_user_by_code($code)");

    my $dbh = get_dbh();
    return unless $dbh;
    
    my $sth = $dbh->prepare("SELECT email FROM users WHERE confirmation_code = ?");
    $sth->execute($code);
    return $sth->fetchrow_hashref;
}

sub get_user_by_session {
    my ($session_id) = @_;
    if (!defined $session_id) {
        debug_log2($MODULE, "get_user_by_session(undef)");
        return undef;
    }
    debug_log2($MODULE, "get_user_by_session($session_id)");

    my $dbh = get_dbh();
    return unless $dbh;
    
    my $sth = $dbh->prepare("SELECT email FROM users WHERE session_id = ?");
    $sth->execute($session_id);
    return $sth->fetchrow_hashref;
}

sub set_vault_and_wallets {
    my ($email, $vault, $wallets_ref) = @_;
    if (!defined $email) {
        debug_log2($MODULE, "set_vault_and_wallets(undef)");
        return;
    }
    debug_log2($MODULE, "set_vault_and_wallets($email, $vault)");
    
    my $dbh = get_dbh();
    return unless $dbh;
    
    eval {
        my $sth_vault = $dbh->prepare("INSERT INTO vaults (email, vault_address) VALUES (?, ?) 
                                       ON DUPLICATE KEY UPDATE vault_address = ?");
        $sth_vault->execute($email, $vault, $vault);
        
        my $sth_delete_wallets = $dbh->prepare("DELETE FROM wallets WHERE email = ?");
        $sth_delete_wallets->execute($email);
        
        my $sth_wallet = $dbh->prepare("INSERT INTO wallets (email, wallet_address) VALUES (?, ?)");
        foreach my $wallet (@$wallets_ref) {
            $sth_wallet->execute($email, $wallet);
        }
        
        $dbh->commit();
        debug_log2($MODULE, "Vault and wallets updated successfully for $email");
    };
    
    if ($@) {
        log_error("DB Error in set_vault_and_wallets: $@");
        $dbh->rollback();
    }
}

sub get_vault_and_wallets {
    my ($email) = @_;
    debug_log2($MODULE, "get_vault_and_wallets($email)");
    
    my $dbh = get_dbh();
    return unless $dbh;
    
    my $sth_vault = $dbh->prepare("SELECT vault_address FROM vaults WHERE email = ?");
    $sth_vault->execute($email);
    my ($vault) = $sth_vault->fetchrow_array();
    return unless $vault;
    
    my $sth_wallets = $dbh->prepare("SELECT wallet_address FROM wallets WHERE email = ?");
    $sth_wallets->execute($email);
    my @wallets;
    while (my ($wallet) = $sth_wallets->fetchrow_array()) {
        push @wallets, $wallet;
    }
    
    debug_log2($MODULE, "Vault: $vault, Wallets: @wallets");
    return ($vault, \@wallets);
}

sub delete_vault_and_wallets {
    my ($email) = @_;
    debug_log2($MODULE, "delete_vault_and_wallets($email)");
    
    my $dbh = get_dbh();
    return unless $dbh;
    
    eval {
        my $sth = $dbh->prepare("DELETE FROM vaults WHERE email = ?");
        $sth->execute($email);
        
        $dbh->commit();
        debug_log2($MODULE, "Vault and wallets deleted for $email");
    };
    
    if ($@) {
        log_error("DB Error in delete_vault_and_wallets: $@");
        $dbh->rollback();
    }
}

sub get_wallets {
    my ($user) = @_;
    my $email = $user? $user->{email}: "";
    debug_log2($MODULE, "get_wallets($email)");
    if (!$user) { return (0, 0); }
    #my ($vault) = '0x9e6e23761499590d5026c608124467c3587336c8';
    #my ($wallets) = '0x9970c734daf5949125794b971f5872fd87ecafaf 0xd07d220d7e43eca35973760f8951c79deebe0dcc';
    my ($vault, $wallets) = get_vault_and_wallets($email);
    my $wallets_str = join(" ", @$wallets);
    debug_log2($MODULE, "get_wallets=($vault, $wallets_str)");
    return ($vault, $wallets_str);
}

sub store_confirmation_code {
    my ($email, $code) = @_;
    debug_log2($MODULE, "store_confirmation_code($email, $code) ");
    my $dbh = get_dbh();
    return unless $dbh;
    
    debug_log2($MODULE, "INSERT INTO users ($email, $code)");
    my $sth = $dbh->prepare("INSERT INTO users (email, confirmation_code) VALUES (?, ?) ON DUPLICATE KEY UPDATE confirmation_code = ?");
    $sth->execute($email, $code, $code);
    debug_log2($MODULE, "Confirmation code stored in DB");
}

sub update_session_id {
    my ($email, $session_id) = @_;
    debug_log2($MODULE, "update_session_id($email, $session_id)");
    my $dbh = get_dbh();
    return unless $dbh;
    
    my $sth = $dbh->prepare("UPDATE users SET session_id = ? WHERE email = ?");
    debug_log2($MODULE, "Storing session_id for $email");
    $sth->execute($session_id, $email);
    debug_log2($MODULE, "session_id stored successfully");
}

1;

