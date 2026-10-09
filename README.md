# Pranab Singh — Developer Portfolio

A personal portfolio website built to showcase my projects, technical skills, certifications, and learning journey. It features a responsive frontend, a FastAPI backend, a contact form, and a protected admin dashboard for managing contact messages.

## Overview

This project combines frontend development with backend API development to create a portfolio website with persistent contact-message storage and JWT-based admin authentication.

## Features

* **Personal Portfolio** — Introduction, about section, technical skills, and contact information.
* **Projects Showcase** — Displays projects with category filters.
* **Certificates & Achievements** — Supports certificate images and PDF documents.
* **Contact Form** — Accepts visitor messages through the backend API.
* **Database Integration** — Stores contact messages using SQLite and SQLAlchemy.
* **Admin Authentication** — Login protected by password hashing and JWT tokens.
* **Admin Dashboard** — View stored contact messages and their details.
* **Responsive Design** — Layout adapts to desktop, tablet, and mobile screens.
* **Glassmorphism UI** — Scenic background, translucent panels, and a purple accent palette.

## Tech Stack

| Area               | Technologies          |
| ------------------ | --------------------- |
| Frontend           | HTML, CSS, JavaScript |
| Backend            | Python, FastAPI       |
| Database           | SQLite, SQLAlchemy    |
| Authentication     | JWT, password hashing |
| API Documentation  | Swagger UI / OpenAPI  |
| Development Server | Uvicorn               |
| Version Control    | Git, GitHub           |

## Project Structure

```text
dev-portfolio/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── database.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   └── security.py
│   ├── .env
│   ├── .gitignore
│   ├── requirements.txt
│   └── portfolio.db
│
├── frontend/
│   ├── index.html
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── main.js
│   ├── admin/
│   │   ├── login.html
│   │   ├── login.js
│   │   ├── dashboard.html
│   │   └── dashboard.js
│   └── assets/
│       ├── images/
│       └── certificates/
│
└── README.md
```

*The structure above reflects the main project files; additional files may exist in your local project.*

## Getting Started

### Prerequisites

* Python 3.10 or later
* pip
* Git
* A modern web browser

### 1. Clone the Repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd dev-portfolio
```

Replace the placeholder with your actual GitHub repository URL.

### 2. Set Up the Backend

Open a terminal in the project directory:

```powershell
cd backend
python -m venv .venv
```

Activate the virtual environment on Windows:

```powershell
.\.venv\Scripts\Activate.ps1
```

Install dependencies:

```powershell
pip install -r requirements.txt
```

### 3. Configure Environment Variables

Create a `.env` file inside `backend/` and configure the required settings:

```env
ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD=your_strong_admin_password
SECRET_KEY=your_long_random_secret_key
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

Use your own strong credentials and a securely generated secret key. Never commit `.env` to GitHub.

### 4. Start the Backend Server

From the `backend/` directory, run:

```powershell
python -m uvicorn app.main:app --reload
```

The backend API will be available at:

* API: http://127.0.0.1:8000
* Interactive API documentation: http://127.0.0.1:8000/docs
* Health check: http://127.0.0.1:8000/api/health

### 5. Start the Frontend

Open a second terminal:

```powershell
cd frontend
py -m http.server 5500
```

Open the portfolio:

http://127.0.0.1:5500

Admin login:

http://127.0.0.1:5500/admin/login.html

The frontend and backend must both be running for the contact form and admin dashboard to work.

## API Endpoints

| Method | Endpoint              | Purpose                               |
| ------ | --------------------- | ------------------------------------- |
| GET    | `/`                   | Root endpoint                         |
| GET    | `/api/health`         | Health check                          |
| POST   | `/api/contact`        | Submit a contact message              |
| POST   | `/api/admin/login`    | Authenticate an administrator         |
| GET    | `/api/admin/me`       | Get the authenticated administrator   |
| GET    | `/api/admin/messages` | Retrieve contact messages (protected) |

Protected endpoints require a valid bearer token.

## Security Notes

* Store credentials and the JWT secret in environment variables.
* Keep `.env`, virtual environments, and local database files out of version control unless there is a specific reason to include them.
* Use password hashing rather than storing plaintext passwords.
* Protect administrative endpoints with authentication.
* For production deployment, use HTTPS and review cookie/session handling, CORS configuration, secret management, and database backups.
* The current development setup uses a local SQLite database and Uvicorn's reload mode; production requires suitable deployment configuration.

## Future Improvements

* Deploy the frontend and backend.
* Add live project demo and repository links.
* Improve the admin dashboard with search and filtering.
* Add automated tests for API endpoints.
* Configure production-grade authentication and hosting.
* Add portfolio screenshots and a live demo link.

## Author

**Pranab Singh**

B.Tech Information Technology Student | Python | SQL | FastAPI | Data Analytics | Machine Learning

* GitHub: https://github.com/shubham17-web
* LinkedIn: https://www.linkedin.com/in/pranab-singh-nsec/
* Email: [pnbsingh@gmail.com](mailto:pnbsingh@gmail.com)

---

If you find this project interesting, feel free to explore the repository and connect with me.
