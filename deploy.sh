#!/bin/bash

# Define Paths
LOCAL_SRC="/home/martin/www/web3/src"
SERVER_ROOT="/home/martin/about.martinr.com"
CGI_BIN="$SERVER_ROOT/cgi-bin"
PUBLIC_HTML="$SERVER_ROOT/public_html"
PROJECT_ROOT="$LOCAL_SRC"  # Fixed path

# Detect correct web server group (www-data or apache)
WEB_GROUP=$(getent group www-data >/dev/null && echo www-data || echo apache)

echo "🔄 Syncing files from $LOCAL_SRC to Apache server..."

# Ensure required directories exist before syncing
echo "📁 Ensuring required directories exist..."
mkdir -p "$CGI_BIN"
mkdir -p "$PUBLIC_HTML"
mkdir -p "$PROJECT_ROOT/data"
mkdir -p "$PROJECT_ROOT/logs"

# Sync Public Files
if [ -d "$LOCAL_SRC/public" ]; then
    echo "📂 Syncing public files..."
    rsync -av "$LOCAL_SRC/public/" "$PUBLIC_HTML/"
else
    echo "⚠️ Warning: Skipping public file sync (directory not found)"
fi

# Sync CGI Scripts
if [ -d "$LOCAL_SRC/cgi-bin" ]; then
    echo "📂 Syncing CGI scripts..."
    rsync -av "$LOCAL_SRC/cgi-bin/" "$CGI_BIN/"
else
    echo "⚠️ Warning: Skipping CGI script sync (directory not found)"
fi

# Ensure correct execution permissions for CGI scripts
echo "🔧 Setting executable permissions for CGI scripts..."
find "$CGI_BIN" -type f -name "*.cgi" -exec chmod +x {} \;

# Symlink bin/ & lib/ instead of copying
echo "🔗 Creating symbolic links for bin/ and lib/..."
ln -sfn "$LOCAL_SRC/bin" "$CGI_BIN/bin"
ln -sfn "$LOCAL_SRC/lib" "$CGI_BIN/lib"

# Set correct permissions for Apache
echo "🔑 Setting permissions for Apache..."
# Detect Apache's group dynamically
WEB_GROUP=$(ps aux | grep '[a]pache\|[h]ttpd' | awk '{print $1}' | head -n1)

# Fallback if detection fails (assume default group)
if [ -z "$WEB_GROUP" ]; then
    WEB_GROUP="www-data"  # Default for Debian/Ubuntu
fi

echo "Detected Apache group: $WEB_GROUP"

# Set correct permissions for Apache, but skip files we can't modify
echo "🔑 Setting permissions for Apache..."
find "$CGI_BIN" "$PUBLIC_HTML" -exec chown martin:$WEB_GROUP {} \; 2>/dev/null
find "$CGI_BIN" "$PUBLIC_HTML" -exec chmod 755 {} \; 2>/dev/null
chmod 600 $PROJECT_ROOT/perl-lib/DBConnect.pm

# Adjust .env path in JavaScript configuration
if [ -f "$PROJECT_ROOT/lib/libConfig.js" ]; then
    echo "🛠️ Updating .env path in libConfig.js..."
    sed -i "s|path.resolve(__dirname, \"../data/.env\")|path.resolve(__dirname, \"$PROJECT_ROOT/data/.env\")|" "$PROJECT_ROOT/lib/libConfig.js"
else
    echo "⚠️ Warning: libConfig.js not found, skipping update"
fi

# Ensure correct Apache paths in HTML
if [ -f "$PROJECT_ROOT/public/index.html" ]; then
    echo "🌐 Adjusting Apache paths in HTML files..."

    # Modify action attributes in forms
    sed -i 's|action="driver.cgi"|action="/cgi-bin/driver.cgi"|g' "$PROJECT_ROOT/public/dashboard.html"

    # Modify fetch() calls for CGI scripts
    sed -i 's|fetch("login.cgi?|fetch("/cgi-bin/login.cgi?|g' "$PROJECT_ROOT/public/dashboard.html"
    sed -i 's|fetch("confirm.cgi?|fetch("/cgi-bin/confirm.cgi?|g' "$PROJECT_ROOT/public/dashboard.html"
    sed -i 's|fetch("driver.cgi?|fetch("/cgi-bin/driver.cgi?|g' "$PROJECT_ROOT/public/dashboard.html"

    # Modify redirection in JavaScript
    sed -i 's|window.location.href="index.cgi"|window.location.href="/cgi-bin/index.cgi"|g' "$PROJECT_ROOT/public/index.html"
else
    echo "⚠️ Warning: index.html not found, skipping update"
fi

# Configure the Perl configuration
if [ -f "$PROJECT_ROOT/perl-lib/Conf.pm" ]; then
    echo "🌐 Adjusting Perl configuration for Apache..."
    sed -i "s|\$IS_APACHE => 0;|\$IS_APACHE => 1;|g" "$PROJECT_ROOT/perl-lib/Conf.pm"
else
    echo "⚠️ Warning: Conf.pm not found, skipping update"
fi

echo "✅ Deployment completed successfully."

