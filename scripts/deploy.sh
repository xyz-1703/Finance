#!/usr/bin/env bash
set -euo pipefail

APP_DIR="${APP_DIR:-/opt/stock-market-app}"
BACKEND_DIR="$APP_DIR/backend"
FRONTEND_DIR="$APP_DIR/frontend"

cd "$APP_DIR"
git pull origin main

cd "$BACKEND_DIR"
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate --noinput
python manage.py collectstatic --noinput
sudo systemctl restart gunicorn

cd "$FRONTEND_DIR"
npm ci
npm run build
sudo rsync -a dist/ /var/www/stock-market/
sudo systemctl reload nginx

echo "Deployment completed successfully."
