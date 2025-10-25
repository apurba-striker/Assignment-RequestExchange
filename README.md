# Barcode Project

A full-stack application for barcode scanning and return management, built with Django REST Framework backend and React frontend.

## Project Structure

```
project-barcode/
├── backend/                 # Django REST API
│   ├── backend/            # Django project settings
│   ├── returns/            # Returns app
│   ├── media/              # Media files storage
│   └── venv/                 # Virtual environment
└── frontend/               # React application
    ├── src/
    │   ├── components/     # React components
    │   └── services/       # API services
    └── public/             # Static assets
```

## Features

- **Barcode Scanning**: Scan barcodes using device camera
- **Return Management**: Create and manage product returns
- **Admin Dashboard**: Administrative interface for managing returns
- **Media Upload**: Support for images and videos
- **RESTful API**: Django REST Framework backend
- **Modern UI**: React frontend with responsive design

## Prerequisites

- Python 3.8+
- Node.js 16+
- npm or yarn
- Virtual environment (venv)

## Backend Setup (Django)

1. **Navigate to backend directory:**

   ```bash
   cd backend
   ```

2. **Setting up a virtual environment**

   ```bash
   python -m venv venv
   ```

3. **Activate virtual environment:**

   ```bash
   # Windows
   venv\Scripts\activate

   # macOS/Linux
   source venv/bin/activate
   ```

4. **Install dependencies:**

   ```bash
   pip install -r requirements.txt
   ```

5. **Navigate to Backend Folder For Running Server**

   ```bash
   cd backend
   ```

6. **Run migrations:**

   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

7. **Create superuser (optional):**

   ```bash
   python manage.py createsuperuser
   ```

   (Already Created SuperUser(Admin) **Username:admin** **Password:ald123456**)

8. **Start development server:**
   ```bash
   python manage.py runserver
   ```

The API will be available at `http://localhost:8000/`

## Frontend Setup (React)

1. **Navigate to frontend directory:**

   ```bash
   cd frontend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

The React app will be available at `http://localhost:5173/`

## Database

The project uses SQLite by default for development. For production, consider using PostgreSQL or MySQL.

## Media Files

Media files are stored in the `backend/media/` directory and organized by date.
