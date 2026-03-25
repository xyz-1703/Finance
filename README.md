# Production-Grade Stock Market Platform

Full-stack stock market web app scaffold with Django, PostgreSQL, React, ML models, and GitHub Actions CI/CD.

## Stack

- Backend: Django + DRF + SimpleJWT + django-allauth
- Database: PostgreSQL
- Frontend: React + Vite
- Security: Google OAuth token login, JWT, Telegram OTP, MPIN
- ML: KMeans clustering, Linear Regression, ARIMA, MLflow tracking
- Deployment: Ubuntu VM, Gunicorn, Nginx
- CI/CD: GitHub Actions

## Project Structure

- backend/
- frontend/
- ml/
- scripts/
- deploy_scripts/
- .github/workflows/

## Local Development

### Prerequisites
- Python 3.12+
- Node.js 20+
- PostgreSQL 14+

### Backend Setup

1. **Install PostgreSQL** (if not already installed):
   - Windows: https://www.postgresql.org/download/windows/
   - macOS: `brew install postgresql`
   - Linux: `sudo apt install postgresql postgresql-contrib`

2. **Create database**:
   ```sql
   createdb stockapp
   createuser postgres -P  # Set password when prompted
   psql stockapp
   ALTER ROLE postgres WITH SUPERUSER;
   \q
   ```

3. **Configure backend environment**:
   ```bash
   cd backend
   copy .env.example .env  # Windows
   # or
   cp .env.example .env    # macOS/Linux
   ```
   
   Edit `backend/.env` and set PostgreSQL credentials:
   ```
   DJANGO_DEBUG=True
   POSTGRES_DB=stockapp
   POSTGRES_USER=postgres
   POSTGRES_PASSWORD=<your_password>
   POSTGRES_HOST=localhost
   POSTGRES_PORT=5432
   ```

4. **Install Python dependencies**:
   ```bash
   python -m venv venv
   venv\Scripts\activate      # Windows
   # or
   source venv/bin/activate   # macOS/Linux
   pip install -r requirements.txt
   ```

5. **Run Django setup**:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   python manage.py createsuperuser  # Create admin account
   python manage.py runserver        # Runs on http://localhost:8000
   ```

### Frontend Setup

1. **Configure frontend environment**:
   ```bash
   cd frontend
   copy .env.example .env  # Windows
   # or
   cp .env.example .env    # macOS/Linux
   ```

2. **Install and run**:
   ```bash
   npm install
   npm run dev              # Runs on http://localhost:5173
   ```

### Running Both Services (Local Development)

**Terminal 1 - Backend:**
```bash
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
python manage.py runserver
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Visit `http://localhost:5173` to access the app. Backend API is at `http://localhost:8000/api`.

### Celery Timely Market Refresh (yfinance)

Celery prefetches watchlist data on a schedule so market rows are ready without blocking page loads.

1. Start Redis (default broker):
   - Docker: `docker run -p 6379:6379 redis:7`

2. Start Celery worker (new terminal):
   ```bash
   cd backend
   venv\Scripts\activate
   celery -A config worker -l info -P solo
   ```

3. Start Celery beat scheduler (new terminal):
   ```bash
   cd backend
   venv\Scripts\activate
   celery -A config beat -l info
   ```

4. Configure cadence and snapshot volume in `backend/.env`:
   - `CELERY_INSIGHTS_REFRESH_SECONDS` (default `60`)
   - `WATCHLIST_CELERY_SNAPSHOT_LIMIT` (default `120`)
   - `WATCHLIST_PRICE_SNAPSHOT_LIMIT` (default `0` for fast API responses)

## API Highlights

- Auth: `/api/auth/google/`, `/api/auth/token/refresh/`, `/api/auth/profile/`
- OTP: `/api/auth/otp/request/`, `/api/auth/otp/verify/`
- MPIN: `/api/auth/mpin/set/`, `/api/auth/mpin/verify/`
- Stocks: `/api/stocks/stocks/`, `/api/stocks/prices/`, `/api/stocks/fundamentals/`
- Portfolio: `/api/portfolio/portfolios/`, `/api/portfolio/holdings/`
- Trading: `/api/trading/execute/`, `/api/trading/transactions/`
- ML: `/api/ml/cluster/run/`, `/api/ml/prediction/run/`
- Admin: `/api/admin/health/` (staff only)

## OAuth Notes

- Backend expects Google ID token on `/api/auth/google/`.
- Set `GOOGLE_OAUTH_CLIENT_ID` in `backend/.env`.
- You can use Google Identity Services in frontend to obtain `id_token` and send it to backend.

## Telegram OTP Notes

- User must have `telegram_username` and `telegram_chat_id` linked.
- OTP expires in 10 minutes.
- Max 5 verification attempts.
- Request rate limiting by user and hour.

## CI/CD

Workflow at `.github/workflows/ci-cd.yml`:
- Trigger: push to `main`
- Backend: install deps, migrate, run tests
- Frontend: install deps, build
- Deploy: SSH to VM, pull latest code, migrate, restart Gunicorn/PM2, reload Nginx

Required GitHub secrets:
- `VM_HOST`
- `VM_USER`
- `VM_SSH_KEY`

## Deployment

- Nginx config: `scripts/nginx.conf`
- Gunicorn service template: `deploy_scripts/gunicorn.service`
- Deploy helper: `scripts/deploy.sh`
