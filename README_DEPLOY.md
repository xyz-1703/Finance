# Deployment Guide - Stock Portfolio

This application is now "industry-ready" with a full Docker orchestration setup. 

## Prerequisites
- Docker and Docker Compose installed on your server/local machine.
- A `.env` file in the root directory (copy from `backend/.env` and update values).

## Deployment Steps

1. **Clone the repository** (if not already done).
2. **Setup environment variables**:
   Create a `.env` file in the root directory with the following (update with your actual values):
   ```env
   DJANGO_SECRET_KEY=your-production-secret-key
   DJANGO_DEBUG=False
   POSTGRES_DB=stock_portfolio
   POSTGRES_USER=postgres
   POSTGRES_PASSWORD=your-secure-password
   TELEGRAM_BOT_TOKEN=your-bot-token
   ```
3. **Build and start the containers**:
   ```bash
   docker-compose up --build -d
   ```
4. **Run migrations (one-time)**:
   ```bash
   docker-compose exec backend python manage.py migrate
   ```
5. **Collect static files**:
   ```bash
   docker-compose exec backend python manage.py collectstatic --noinput
   ```
6. **Create a superuser**:
   ```bash
   docker-compose exec backend python manage.py createsuperuser
   ```

## Services Overview
- **Frontend**: Accessible on port 80 (standard HTTP).
- **Backend API**: Internal service on port 8000, proxied by Nginx.
- **Celery Worker**: Handles background price updates every 30 seconds.
- **Celery Beat**: Schedules the periodic tasks.
- **Postgres**: Persistent database for users, portfolios, and stock data.
- **Redis**: Message broker for Celery tasks.

## Maintenance
- **Logs**: `docker-compose logs -f [service_name]`
- **Stopping**: `docker-compose down`
- **Restarting**: `docker-compose restart`
