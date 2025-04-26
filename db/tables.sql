CREATE TABLE users (
    email VARCHAR(255) NOT NULL PRIMARY KEY,
    confirmation_code VARCHAR(6) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    session_id CHAR(64) NULL,
    keep_logged_in BOOLEAN DEFAULT FALSE
);

CREATE TABLE current (
    email VARCHAR(255) NOT NULL,
    set_name VARCHAR(100) NOT NULL,  -- Name of the current set
    vault_address VARCHAR(42) NOT NULL,  -- Address of the current vault
    wallet_addresses TEXT NOT NULL,  -- Comma-separated wallet addresses
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (email),  -- One current set per user
    FOREIGN KEY (email) REFERENCES users(email)
);

CREATE TABLE sets (
    email VARCHAR(255) NOT NULL,
    set_name VARCHAR(100) NOT NULL,  -- Name of the set
    vault_address VARCHAR(42) NOT NULL,  -- Address of the vault for the set
    wallet_addresses TEXT NOT NULL,  -- Comma-separated wallet addresses for the set
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (email, set_name),  -- Each user can have multiple sets
    FOREIGN KEY (email) REFERENCES users(email)
);

CREATE TABLE names (
    wallet_address VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) UNIQUE COLLATE utf8mb4_unicode_ci
);

DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS names;

// BELOW HERE THEY ARE ALL OBSOLETE TO BE DEKETED AFTER TRANSITION

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
ALTER TABLE vaults ADD COLUMN current_set_name VARCHAR(100) DEFAULT NULL;

DROP TABLE IF EXISTS wallets;
CREATE TABLE wallets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    wallet_address VARCHAR(64) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_wallets_email (email),
    INDEX idx_wallets_address (wallet_address)
);

DROP TABLE IF EXISTS vault_sets;
CREATE TABLE vault_sets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    vault_address VARCHAR(42) DEFAULT '',
    wallet_addresses TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_user_set (email, name),
    INDEX idx_email (email)
);
