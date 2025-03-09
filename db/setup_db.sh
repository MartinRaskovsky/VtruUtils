#!/bin/bash

# Database credentials
DB_USER="martin_web3"
DB_NAME="martin_web3"

BASE=$(dirname "$0")
PASSWORD_FILE="$BASE/../data/.mysql_password"  # Secure password file
SQL_FILE="$BASE/tables.sql"  # Ensure the correct path

# Check if the password file exists
if [[ ! -f "$PASSWORD_FILE" ]]; then
    echo "❌ ERROR: Password file '$PASSWORD_FILE' not found."
    echo "ℹ️  Please create this file and store your MySQL password inside it."
    echo "   Example: echo 'your_mysql_password' > $PASSWORD_FILE"
    echo "   Then make it readable only by you: chmod 600 $PASSWORD_FILE"
    exit 1
fi

# Read the password securely
DB_PASS=$(<"$PASSWORD_FILE")

# Prevent empty password usage
if [[ -z "$DB_PASS" ]]; then
    echo "❌ ERROR: Password file '$PASSWORD_FILE' is empty."
    echo "ℹ️  Please add your MySQL password inside the file."
    exit 1
fi

# Ensure the SQL file exists
if [[ ! -f "$SQL_FILE" ]]; then
    echo "❌ ERROR: SQL file '$SQL_FILE' not found."
    echo "ℹ️  Ensure the 'tables.sql' file is in the same directory as this script."
    echo "   Or specify the correct path in setup_db.sh"
    exit 1
fi

# Execute MySQL commands non-interactively
mysql -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" < "$SQL_FILE"

# Check if MySQL executed successfully
if [[ $? -eq 0 ]]; then
    echo "✅ Database tables created successfully."
else
    echo "❌ ERROR: Failed to create database tables. Check your MySQL credentials and permissions."
fi

