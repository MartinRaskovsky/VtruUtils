DROP TABLE IF EXISTS users;
CREATE TABLE users (
    email VARCHAR(255) NOT NULL PRIMARY KEY,
    confirmation_code VARCHAR(6) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    session_id CHAR(64) NULL,
    keep_logged_in BOOLEAN DEFAULT FALSE
);
ALTER TABLE users ADD COLUMN keep_logged_in BOOLEAN DEFAULT FALSE;

DROP TABLE IF EXISTS vaults;
CREATE TABLE vaults (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    vault_address VARCHAR(42) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_vaults_email (email),
    INDEX idx_vaults_address (vault_address)
);

DROP TABLE IF EXISTS wallets;
CREATE TABLE wallets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    wallet_address VARCHAR(42) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_wallets_email (email),
    INDEX idx_wallets_address (wallet_address)
);

