# Numed CaseStudy Website

## Basic Setup

### 1. Installations
- **Install Python**: [Download Python](https://www.python.org/downloads/)
- **Install VSCode**: [Download VSCode](https://code.visualstudio.com/download)
- **Install VSCode Extensions**:
  - Python
  - ESLint
  - Prettier
- **Install React**:
  - [Download Node.js (includes npm)](https://nodejs.org/)

### 2. Powershell Permission
- Check current execution policy: 
  ```powershell
  Get-ExecutionPolicy
- If needed, set up the policy to allow scripts
	```powershell
	Set-ExecutionPolicy RemoteSigned

### 3. Set SSL Permissions and Upgrade Setuptools
- Check current execution policy: 
  ```powershell
  pip install --upgrade pip setuptools wheel` 

## Backend: (maleo_be/backendapp)

### 1. Change directory to backend app
	cd numed-containerized-main/maleobe_backendapp
  
### 2. Modify requirements.txt

### 3. Create and activate virtual environment
-   Linux/macOS
    ```python
    python -m venv venv
    source venv/bin/activate
-   Window
     ```python
    .\venv\Scripts\activate
### 4. Install Dependencies
     ```python
    pip install -r requirements.txt
### 5. Install Whitenoise
     ```python
    pip install whitenoise
### 6. Run Migrations
     ```python
    python manage.py makemigrations
	python manage.py migrate
### 7. Run the server
     ```python
    python manage.py runserver
### 8. Create a superuser
     ```python
    python manage.py createsuperuser
### 9. Open a Django shell
     ```python
    python manage.py shell
### 10.  Update user permissions in Django shell
     ```python
    from account.models import CustomUser 
	a = CustomUser.objects.get(email='aripramuja@developer.tech') 
	a.is_superuser = True 
	a.save() 
	exit()

### 11.  Run the server again
     ```python
    python manage.py runserver

## Frontend Setup

### 1. Navigate to the Frontend Directory
     ```python
    cd frontend

### 2. Install Dependencies
- Run the following command to install all the required npm packages:
     ```python
    npm install
### 3.Start the Frontend Server
- Once the installation is complete, run the development server using:
     ```python
    npm run dev
Your frontend should now be accessible locally. The default address is likely http://localhost:3000, but this may vary depending on the configuration.

## Backend Setup

### 1. Navigate to the Backend Directory
     ```python
    cd backend
### 2. Create and Activate Python Virtual Environment
- Before installing dependencies, create and activate a virtual environment to isolate your project’s packages:
-   Linux/macOS
    ```python
    python -m venv venv
    source venv/bin/activate
-   Window
     ```python
    .\venv\Scripts\activate
### 3. Install Backend Dependencies
After activating the virtual environment, install the necessary Python packages by running:
     ```python
    pip install -r requirements.txt
    
### 4. Update database configuration
You’ll need to change the database settings for your local environment. Modify the following files: - **database.py**: Adjust database connection settings. - **.env**: Replace placeholders or localhost settings with your actual database credentials. Ensure your `.env` file contains the following configurations:
    
Ensure your .env file contains the following configurations:
     ```python

	DB_HOST=your_db_host
	DB_USER=your_db_user
	DB_PASSWORD=your_db_password
	DB_NAME=your_db_name

5. Run the backend server

Once the database settings are configured, run the backend server with FastAPI:
     ```python
     uvicorn main:app --reload

The backend will be accessible at http://127.0.0.1:8000.

6. Access the API documentation

FastAPI provides an interactive API documentation page. You can view all available API endpoints by navigating to:

http://127.0.0.1:8000/docs

#### Notes
---
-   Frontend: Ensure you have Node.js installed. The development server for the frontend runs on the default port 3000, but if this port is occupied, the system may assign a different one.
- Backend: Make sure that Python and all dependencies are correctly installed. Double-check the database connection in both database.py and .env.