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

## Backend Setup

1. Create env file:
   - `copy backend/.env.example backend/.env`
2. Install dependencies:
   - `cd backend`
   - `python -m venv venv`
   - `venv\\Scripts\\activate` (Windows) or `source venv/bin/activate` (Linux)
   - `pip install -r requirements.txt`
3. Run migrations and server:
   - `python manage.py makemigrations`
   - `python manage.py migrate`
   - `python manage.py createsuperuser`
   - `python manage.py runserver`

## Frontend Setup

1. Configure env:
   - `copy frontend/.env.example frontend/.env`
2. Install and run:
   - `cd frontend`
   - `npm install`
   - `npm run dev`

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
