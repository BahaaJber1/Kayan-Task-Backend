# Kayan Medical Clinic Management System - Backend

A comprehensive backend system for managing medical clinic operations, including patient visits, doctor appointments, and financial tracking.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Folder Structure](#folder-structure)
- [API Endpoints](#api-endpoints)
- [Future Enhancements](#future-enhancements)

## 🎯 Overview

This backend system provides a RESTful API for a medical clinic management platform. It supports three user roles (Patient, Doctor, Finance) with role-based access control, visit management, treatment tracking, and financial reporting.

## ✨ Features

### Authentication & Authorization

- passport.js local strategy for user authentication
- Role-based access control (Patient, Doctor, Finance)
- Secure password hashing with bcrypt
- Token-based session management

### Visit Management

- Patients can book visits with doctors
- Doctors can accept/complete visits
- Visit status tracking (pending, accepted, completed, cancelled)
- One active visit per doctor at a time
- Medical notes and patient notes support

### Treatment Management

- Multiple treatments per visit
- Treatment name and value tracking
- Automatic total amount calculation
- Treatment history for each visit

### Financial Tracking

- Finance role can view all visits and treatments
- Visit amount tracking
- Treatment cost breakdown
- Comprehensive financial reporting

### User Management

- User registration and authentication
- Profile management
- Role-based permissions
- Secure credential storage

## 🛠 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Authentication**: passport.js
- **Password Hashing**: bcrypt
- **Validation**: Zod
- **Environment Variables**: dotenv
- **CORS**: cors middleware
- **Express-Session**: express-session middleware

## 📦 Prerequisites

Before running this application, make sure you have:

- Node.js (v18 or higher)
- npm or yarn package manager
- PostgreSQL (v14 or higher)
- Git

## 🚀 Installation

### 1. Clone the repository

```bash
git clone https://github.com/BahaaJber1/Kayan-Task-Backend.git
cd backend
```

### 2. Install dependencies

Using npm:

```bash
npm install
```

Using yarn:

```bash
yarn install
```

## 🔐 Environment Variables

Create a `.env` file in the backend root directory with the following variables:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name

# JWT Configuration
SESSION_SECRET=your_super_secret_jwt_key_here
SALT_ROUNDS=your_bcrypt_salt_rounds_here

# CORS Configuration
FRONTEND_URL_DEV=http://localhost:5173
```

### Database Setup

1. Create a PostgreSQL database:

```sql
CREATE DATABASE your_db_name;
```

2. Run the database migrations/schema (create tables):

```sql
-- Users table
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(7) CHECK (role IN ('patient', 'doctor', 'finance')) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Visits table
CREATE TABLE visits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES users(id) NOT NULL,
  doctor_id uuid REFERENCES users(id) NOT NULL,
  date TIMESTAMP,
  time VARCHAR(10),
  patient_notes VARCHAR(500),
  medical_notes VARCHAR(500),
  status VARCHAR(15) CHECK (status IN ('completed', 'cancelled', 'pending', 'active')) DEFAULT 'pending',
  amount SMALLINT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Treatments table
CREATE TABLE treatments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id uuid REFERENCES visits(id) ON DELETE CASCADE,
  name VARCHAR(20) NOT NULL,
  value SMALLINT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🏃 Running the Application

### Development Mode

Using npm:

```bash
npm run dev
```

Using yarn:

```bash
yarn dev
```

The server will start on `http://localhost:3000` (or the port specified in your .env file).

## 📁 Folder Structure

```
backend/
├── src/
│   ├── config/
│   │   └── settings.js          # The .env variables configuration
│   │
│   ├── controllers/
│   │   ├── authentication.controller.js   # Authentication logic (login, register)
│   │   └── visits.controller.js # Visit management logic (CRUD operations)
│   │
│   ├── middlewares/
│   │   ├── authentication       # Authentication middleware
│   │   └── passport.js            # Passport's local strategy setup
│   │
│   ├── routes/
│   │   ├── authentication.routes.js       # Authentication routes (/login, /register)
│   │   └── visits.routes.js     # Visit management routes
│   │
│   ├── database/
│   │   ├── schema/                # Authentication validation schemas
│   │   │   └── .excalidraw         # Excalidraw diagram for database schema
│   │   └── sql/              # Servers as Models for database schema definition
│   │
│   ├── zod/                 # Zod validation schemas
│   │   ├── authentication/       # Authentication validation schemas
|   |   |   └── signin.schema.js
|   |   |   └── signup.schema.js
│   │   └── visits/            # Visit management validation schemas
│   │       └── bookVisit.schema.js
│   │       └── completeVisit.schema.js
│   │       └── getAllVisits.schema.js
│   │       └── acceptAndDeleteVisit.schema.js
│   └── server.js                 # Application entry point and Express server setup
```

### Folder Purpose Explanation

#### `/src/config/`

Contains configuration files for external services and connections:

- **database.js**: PostgreSQL connection pool setup and configuration

#### `/src/controllers/`

Business logic layer that processes requests and interacts with the database:

- **auth.controller.js**: Handles user authentication, registration, and token generation
- **visits.controller.js**: Manages all visit-related operations (book, accept, complete, cancel, retrieve)

#### `/src/middlewares/`

Reusable functions that process requests before reaching controllers:

- **auth.middleware.js**: Verifies JWT tokens and attaches user data to requests
- **errorHandler.js**: Catches and formats errors consistently across the application
- **roleCheck.js**: Validates user roles for protected routes

#### `/src/routes/`

Defines API endpoints and maps them to controllers:

- **auth.routes.js**: Public authentication endpoints
- **visits.routes.js**: Protected visit management endpoints with role-based access

#### `/src/schemas/`

Zod validation schemas for request data validation:

- **auth/**: Login and registration validation rules
- **visits/**: Visit operation validation rules (booking, completing, etc.)

#### `/src/index.js`

Application entry point that:

- Initializes Express server
- Configures middleware (CORS, body parser)
- Registers routes
- Starts the server

## 🔌 API Endpoints

### Authentication

```
POST   /api/v1/authentication/signup        # Register new user
POST   /api/v1/authentication/signin           # Login user
```

### Visits

```
POST   /api/v1/visits/book          # Book a visit (Patient only)
POST   /api/v1/visits/accept        # Accept a visit (Doctor only)
POST   /api/v1/visits/complete      # Complete a visit (Doctor only)
POST   /api/v1/visits/cancel        # Cancel a visit (Patient/Doctor)
GET    /api/v1/visits               # Get all visits (Role-based filtering)
```

### Request/Response Examples

#### Register User

```json
POST /api/v1/authentication/signup
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "role": "patient"
}
```

#### Book Visit

```json
POST /api/v1/visits/book
{
  "doctor": 2,
  "date": "2026-01-10",
  "time": "10:00",
  "notes": "Regular checkup"
}
```

#### Complete Visit

```json
POST /api/v1/visits/complete
{
  "visitId": 1,
  "medicalNotes": "Patient is healthy",
  "treatments": [
    { "name": "Consultation", "value": 50 },
    { "name": "Prescription", "value": 30 }
  ],
  "amount": 80
}
```

---

## Future Enhancements

- Implement rate limiting to prevent abuse of the API endpoints using `express-rate-limit`.
- create email verification functionality using `nodemailer` & `react-email`.

---

## Author

Developed by [BahaaJber](https://github.com/BahaaJber1).
