# Phase-4-project

#  Startup Simulator

Welcome to **Startup Simulator** — a full-stack web application that allows users to simulate real-world startup management. Users can create fictional startups, invest in others, track investments, and explore funding goals.

---

##  Tech Stack

**Backend:**
- Python 3.8+
- Flask (with Blueprints)
- Flask-JWT-Extended for Authentication
- SQLAlchemy ORM
- Flask-Migrate for DB migrations
- SQLite (development)

**Frontend:**
- React (Create React App)
- Bootstrap for styling
- Form handling with controlled components
- Fetch API for client-server communication

**Others:**
- `pipenv` for Python dependency management
- `cors`, `bcrypt`, and Flask extensions for production-readiness

---

##  Project Structure

Startup-Simulator/
│
├── client/ # React frontend
│ ├── src/
│ │ ├── api.js # All frontend API interactions
│ │ ├── components/ # React components (Dashboard, Login, Home etc.)
│ │ ├── styles/ # CSS stylesheets
│ │ └── assets/ # Static images (e.g., background)
│
├── server/ # Flask backend
│ ├── auth/ # Auth routes
│ ├── startups/ # Startup routes
│ ├── investments/ # Investment routes
│ ├── users/ # User profile routes
│ ├── models.py # SQLAlchemy models
│ ├── extensions.py # db, migrate, bcrypt, etc.
│ ├── init.py # App factory
│ └── config.py # App config
│
├── migrations/ # Alembic DB migrations
├── Pipfile # Python dependencies
└── README.md




---

##  Features

- **JWT Authentication:** Secure login and registration system with token-based auth
- **Startup Management:** Users can create, edit, and delete their own startups
- **Investments:** Users can invest in other startups (excluding their own)
- **Live Funding Tracking:** Displays how much has been raised toward funding goals
- **Profile Avatars:** Optional profile picture upload during registration
- **Public Startup Gallery:** View all startups by other users
- **Dashboard:** Personalized interface for startup creators and investors

---

##  Getting Started

```bash
git clone https://github.com/salman254/Phase-4-project.git
cd startup-simulator 
```

### 1. Clone the Repository

Install Dependencies
###  pipenv install

Activate Shell
###  pipenv shell

Run the Flask Server
###  python run.py

By default it runs at http://localhost:5000/



###  Frontend setup

###  cd client

###  npm install

###  npm start

Opens at http://localhost:3000/


###  How It Works
Auth routes return JWTs stored in localStorage and sent via Authorization: Bearer <token>

Flask uses Blueprints to organize routes: auth/, startups/, investments/, users/

Frontend Dashboard.js dynamically loads all data on mount

React state is updated after every action to reflect DB changes immediately

 ###  Known Issues
Upload folder must exist (server/static/uploads/) or profile upload will fail

 Only image files are accepted in registration form
 Contributing
Pull requests and improvements are welcome! Just fork the repo and submit a PR.

 ###  License
This project is open source under the MIT License.

 ###  Author

Built with love by Ibrahim Mohamed — student @ Moringa School, Kenya 🇰🇪
Email: salmaanmohamed700@gmail.com

