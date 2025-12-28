# Sports Stats Tracker

A modern web application to track NBA, NHL, NFL, and MLB player statistics. It features a StatMuse-inspired dark UI, automatic stat scraping from Wikipedia, and full player management capabilities.

![StatMuse Design Preview](https://i.imgur.com/your-preview-image.png)

## Tech Stack

-   **Frontend**: React, Material UI (@mui/material), Inter Font.
-   **Backend**: Python, FastAPI, SQLAlchemy, Pydantic.
-   **Database**: SQLite (Development), PostgreSQL (Recommended for Production).
-   **Scraping**: BeautifulSoup4, Requests.

## Features

-   **Multi-League Support**: Track stats specific to each sport (e.g., PPG for NBA, Goals for NHL).
-   **Auto-Fill Stats**: Automatically fetch player stats from Wikipedia using the built-in scraper.
-   **Modern Design**: Dark mode, high-contrast UI inspired by StatMuse.
-   **CRUD**: Create, Read, Update, and Delete players.

---

## Local Setup

### Prerequisites
-   Python 3.8+
-   Node.js 14+

### 1. Backend Setup
```bash
cd backend
# Create virtual environment (optional but recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the server
uvicorn main:app --reload --port 8000
```
The API will be available at `http://localhost:8000`.

### 2. Frontend Setup
```bash
cd frontend
# Install dependencies
npm install

# Run the app
npm start
```
The app will open at `http://localhost:3000`.

### 3. Docker Setup (Easy Run)
If you have Docker installed, you can run the entire stack with one command:

```bash
docker-compose up --build
```
-   **Frontend**: `http://localhost:3000`
-   **Backend**: `http://localhost:8000`

---

## Deployment Guide

To publish this site, we recommend deploying the Frontend and Backend separately.

### 1. Deploy Backend (e.g., Render, Railway)

The backend is ready for deployment with the included `Procfile`.

1.  Push this repository to **GitHub**.
2.  Sign up for **Render** (render.com) or **Railway** (railway.app).
3.  **New Web Service** -> Connect your GitHub repo.
4.  **Root Directory**: Set to `backend`.
5.  **Build Command**: `pip install -r requirements.txt`
6.  **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT` (or let it detect the Procfile).
7.  **Environment Variables**:
    -   (Optional) `DATABASE_URL`: Connection string for a PostgreSQL database.
    -   *Note*: By default, it uses SQLite (`sports_stats.db`). On most free tier hosting, this file will be reset every time the server restarts. For persistent data, set up a PostgreSQL database.

### 2. Deploy Frontend (e.g., Vercel, Netlify)

1.  Sign up for **Vercel** (vercel.com).
2.  **Add New Project** -> Import the same GitHub repo.
3.  **Root Directory**: Set to `frontend`.
4.  **Build Settings**: Vercel usually detects Create React App automatically (`npm run build`).
5.  **Environment Variables**:
    -   The frontend currently points to `http://localhost:8000` in `src/App.js`.
    -   **Important**: You must update the `fetch` URLs in `App.js` to point to your *deployed backend URL* (e.g., `https://your-backend.onrender.com`).
    -   *Best Practice*: Replace hardcoded URLs in `App.js` with `process.env.REACT_APP_API_URL` and set that variable in Vercel.

### 3. Finalizing
Once both are deployed, update the Frontend configuration to talk to the live Backend, and you're live!
