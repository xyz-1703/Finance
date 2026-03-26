#!/bin/bash

echo "🚀 Starting deployment..."

# Go to project root
cd ~/Finance

# Activate virtual environment
source venv/bin/activate

# Pull latest code
git pull origin main

# Install dependencies (if any)
pip install -r backend/requirements.txt

# Run migrations
cd backend
python manage.py migrate

# Collect static files
python manage.py collectstatic --noinput

# Go back
cd ..

# Restart apps
pm2 restart all

# Reload nginx
sudo systemctl reload nginx

echo "✅ Deployment complete!"