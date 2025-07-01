# Project Overview

This project is an integrated platform for automated radiology image analysis, report generation, and user study management, combining deep learning models with web-based tools for education and clinical research.
Main Features:

🩺 Medical Image Analysis & Captioning:

Model Training & Inference: Leverages deep learning models like CheXNet, DenseNet, and MobileNet for analyzing chest X-rays.

Automated Captioning: Automatically generates descriptive captions for medical images.

Visual Explanations: Utilizes GradCAM to create heatmaps that highlight the areas of an image that are most important for a model's prediction.

👨‍💻 User Study Platform:

Interactive Frontend: A modern web application built with React and Vite allows users to view images, participate in quizzes, and provide feedback.

Robust Backend: A FastAPI-based backend provides RESTful APIs for user authentication, image serving, quiz management, and result storage.

Performance Tracking: Includes features for pre- and post-test quizzes with score tracking to evaluate user performance and model effectiveness.

🎯 Binary & Multiclass Classification:

Supports both binary (e.g., normal vs. abnormal) and multiclass (e.g., identifying multiple diseases) classification of radiological images.

📊 Data Management & Reporting:

Report Analysis: Includes scripts and tools for analyzing, aggregating, and correcting radiology reports.

Database Integration: Uses SQLAlchemy to interface with databases like PostgreSQL or MongoDB for storing user data, test results, and image metadata.

🐳 Containerization & Deployment:

Docker Support: The entire platform is containerized using Docker and Docker Compose, ensuring easy and consistent deployment across different environments.

📚 Comprehensive Documentation:

Includes detailed documentation on API models, case studies, and usage guides to facilitate understanding and extension of the project.

---

### Large Files that can't be uploaded here, can be found in this link
https://drive.google.com/drive/folders/1opqLgt0YY7vSOODSkib4d6XZE8RR-Neo?usp=sharing

