#!/usr/bin/env bash
set -euo pipefail

sudo apt update
sudo apt install -y python3-pip python3-venv nginx postgresql postgresql-contrib nodejs npm rsync

sudo mkdir -p /opt/stock-market-app
sudo mkdir -p /var/www/stock-market

echo "System packages installed. Copy service/nginx files and enable services next."
