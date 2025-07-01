# Old NuMed Website

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

## Frontend Setup: `maleo_fe`

### 1. Change Directory to Frontend App

Navigate to the frontend application directory:
`cd numed-containerized-main/maleo_fe` 

### 2. Install NPM Packages

Install the required Node.js dependencies:

`npm install` 

### 3. Install Cross-Env

Install `cross-env` with legacy peer dependencies to manage environment variables:

`npm install cross-env --legacy-peer-deps` 

### 4. Update `package.json` for `npm start`

Modify the `start` script in `package.json` to ensure compatibility with OpenSSL:

`"start": "cross-env NODE_OPTIONS=--openssl-legacy-provider react-scripts start"` 

### 5. (macOS Only) Fix Permissions for Node Modules

For macOS users, fix permission issues for `node_modules`:

`sudo chmod -R 755 /path/to/your/node_modules/.bin/` 

- Example:
`sudo chmod -R 755 /Users/jeff2709/Downloads/WebsiteDoctor/numed-containerized-main/maleo_fe/node_modules/.bin/` 

### 6. Handle Sass Installation

-   Uninstall `node-sass`:
    
    `npm uninstall node-sass --legacy-peer-deps` 
    
-   Install `sass`:
    
    `npm install sass --legacy-peer-deps` 
    

### 7. Comment Out Lines in `todo.scss`

- Navigate to `maleo_fe/src/scss/component/todo.scss` and comment out lines 556-558 to avoid any build errors.

### 8. Start the React App
- Start the development server:
`npm start` 

## Additional Notes

-   **Version Compatibility**: Ensure that your Python, Node.js, and npm versions are compatible with the project requirements.
-   **Virtual Environment**: Always activate your Python virtual environment before working with the backend.
-   **Security**: Run `npm audit` and `npm audit fix` to resolve any potential package vulnerabilities.

## Running the AI App Locally

This documentation provides a step-by-step guide on how to run the following AI applications locally: `ct_app`, `cxr_app`, and `blood_app`. Follow the steps to install dependencies, configure the environment, and run the apps using FastAPI.

## 1. Change Directory to Desired App

Before starting, navigate to the directory of the application you'd like to run:

### CT App
`cd numed-containerized-main/ct_app`

### CXR App
`cd numed-containerized-main/cxr_app`

### CT App
- If you're connecting to a server, use:
`cd numed-containerized-main/blood_app || → connected to server` 

## 2. Install Dependencies
To install the required packages, download and install the dependencies listed in the `requirements_v1.txt` file. Before running the command, ensure to remove version numbers from the `requirements_v1.txt` to avoid compatibility issues:
	`pip install -r requirements_v1.txt`

## 3. Modify file paths
Ensure the correct file path is set for the app in the code. If required, change the paths (for example, `/app/app`) to the correct location in your environment.

### 4. Upgrade pip and Certifi
To avoid SSL certificate issues, ensure that certifi is up to date:
`pip install --upgrade pip certifi`

### 5. Update the settings,py
Modify the `settings.py` file as needed for your local environment (e.g., database configurations, API keys, etc.).

### 6. Run FastAPI Server on different ports
Each app should run on a different port to avoid conflicts. Use the following commands to start the FastAPI server for each app:
-   CXR App (Port 8080): 	`uvicorn v1.main:app ––port 8080`
-   CT App (Port 5000): `uvicorn v1.main:app ––port 5080`
    
Ensure to specify different ports when running multiple applications simultaneously.