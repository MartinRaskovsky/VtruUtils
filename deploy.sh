#!/bin/bash

# Define Paths
LOCAL_SRC="/home/martin/www/web3/src"
SERVER_ROOT="/home/martin/about.martinr.com"
CGI_BIN="$SERVER_ROOT/cgi-bin"
PUBLIC_HTML="$SERVER_ROOT/public_html"
PROJECT_ROOT="/home/martin/www/web3/VtruUtils"

echo "🔄 Syncing files from $LOCAL_SRC to Apache server..."

# Ensure required directories exist
echo "📁 Ensuring required directories exist..."
mkdir -p "$CGI_BIN"
mkdir -p "$PUBLIC_HTML"
mkdir -p "$PROJECT_ROOT/data"

# Sync Public Files (HTML, CSS, JS)
echo "📂 Syncing public files..."
rsync -av --delete "$LOCAL_SRC/public/" "$PUBLIC_HTML/"

# Sync CGI Scripts (Perl & JS backend)
echo "📂 Syncing CGI scripts..."
rsync -av --delete "$LOCAL_SRC/cgi-bin/" "$CGI_BIN/"

# Ensure correct execution permissions for CGI scripts
echo "🔧 Setting executable permissions for CGI scripts..."
chmod +x "$CGI_BIN"/*.cgi
chmod +x "$CGI_BIN/bin"/*.js

# Symlink lib/ & bin/ instead of copying (so updates in src/ are reflected)
echo "🔗 Creating symbolic links for bin/ and lib/..."
ln -sfn "$LOCAL_SRC/bin" "$CGI_BIN/bin"
ln -sfn "$LOCAL_SRC/lib" "$CGI_BIN/lib"

# Set correct permissions for Apache
echo "🔑 Setting permissions for Apache..."
chown -R martin:www-data "$SERVER_ROOT"
chmod -R 755 "$SERVER_ROOT"

# Adjust .env path in JavaScript configuration
echo "🛠️ Updating .env path in libConfig.js..."
sed -i "s|path.resolve(__dirname, \"../data/.env\")|path.resolve(__dirname, \"$PROJECT_ROOT/data/.env\")|" "$PROJECT_ROOT/lib/libConfig.js"

# Ensure correct Apache paths in HTML
echo "🌐 Adjusting Apache paths in HTML files..."
sed -i "s|action=\"driver.cgi\"|action=\"/cgi-bin/driver.cgi\"|g" "$PROJECT_ROOT/public/index.html"
sed -i "s|fetch(\"driver.cgi\"|fetch(\"/cgi-bin/driver.cgi\"|g" "$PROJECT_ROOT/public/index.html"

# Ensure `driver.cgi` is executable
chmod +x "$CGI_BIN/driver.cgi"

# Restart Apache to apply changes
echo "🔄 Restarting Apache..."
sudo systemctl restart httpd

echo "✅ Deployment completed successfully."
