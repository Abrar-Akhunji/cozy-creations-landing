#!/bin/bash

# Crochet Shop Development Launch Script
# Installs dependencies and runs the integrated storefront.

echo "============================================="
echo "🧶 Launching Crochet Shop Development Suite..."
echo "============================================="

# Function to check if npm or bun is available
if command -v bun &> /dev/null
# If bun is available, use bun for rapid install
then
    INSTALL_CMD="bun install"
    DEV_CMD="bun run dev"
    echo "⚡ Detected Bun package manager. Running with Bun..."
else
    INSTALL_CMD="npm install"
    DEV_CMD="npm run dev"
    echo "📦 Running with NPM..."
fi

# Install & run root frontend and admin panel
echo ""
echo "👉 Setting up Client Frontend..."
$INSTALL_CMD

echo ""
echo "👉 Setting up Admin Panel..."
(cd admin-panel && $INSTALL_CMD)

# Launch dev server
echo ""
echo "🚀 Booting up dev servers..."
echo "---------------------------------------------"
echo "Client website: http://localhost:8080"
echo "Admin panel: http://localhost:5174"
echo "---------------------------------------------"

# Run both in parallel and wait
$DEV_CMD &
(cd admin-panel && npm run dev) &

wait
