# Barcode Project

A full-stack application for scanning the barcode and return management for ecommerce, built with Django REST Framework backend and React frontend.

## Project Structure

```
project-barcode/
|---backend/
    |---returnmanage               # Django REST API
    |   |---backend/            # Django project settings
    |   |---returns/            # Returns app
    |   |---media/              # Media files storage
    |   |---venv/               # Virtual environment
|---frontend/               # React(Vite) application
    |--- src/
    |   |--- assests         # Assets
    │   |--- components/     # React components
    │   |--- services/       # API services
    |
    |--- public/             # Static assets
```

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

3. **Setting Up Environment**

   ```bash
   change filename of .env.example to .env
   ```

4. **Start development server:**

   ```bash
   npm run dev
   ```

   **The React app will be available at `http://localhost:5173/`**

5. **For Admin Dashboard Page**
   **Use this Credentials In login Page:**
   ```bash
   username: admin
   password: ald123456
   ```

## Database

The project uses SQLite by default for development.

## Media Files

Media files are stored in `backend/media/` directory

## Screenshots

### Login And Register Page:

**Login Page**
![Login And Register Page](https://github.com/apurba-striker/Assignment-RequestExchange/blob/main/images/LoginPage.png)

**Register Page**
![Login And Register Page](https://github.com/apurba-striker/Assignment-RequestExchange/blob/main/images/RegisterPage.png)

### User Dashboard

**FirstTime Login**
![User Dashboard](https://github.com/apurba-striker/Assignment-RequestExchange/blob/main/images/UserDashboardFirstTimeLogin.png)

**After Adding Return Request**
![User Dashboard](https://github.com/apurba-striker/Assignment-RequestExchange/blob/main/images/AddedTheRequest.png)

### Creating A Request

![Creating A Request](https://github.com/apurba-striker/Assignment-RequestExchange/blob/main/images/CreatingReturnRequest.png)

**After Clicking On the Scan Barcode with Camera**
![Creating A Request](https://github.com/apurba-striker/Assignment-RequestExchange/blob/main/images/ScannertheBarcode.png)

**Uploading Files**
![Creating A Request](https://github.com/apurba-striker/Assignment-RequestExchange/blob/main/images/AddingSupportFiles.png)

### Admin Dashboard

![Admin Dashboard](https://github.com/apurba-striker/Assignment-RequestExchange/blob/main/images/AdminDashboard.png)

**Searching With User Names**
![Admin Dashboard](https://github.com/apurba-striker/Assignment-RequestExchange/blob/main/images/SearchwithName-Admin.png)

**Searching With Barcode**
![Admin Dashboard](https://github.com/apurba-striker/Assignment-RequestExchange/blob/main/images/SearchwithBarcode-admin.png)
