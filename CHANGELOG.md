# Changelog

All notable changes to the TaskMaster App project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Project restructuring with separate backend and frontend folders
- Comprehensive README.md documentation with accurate frontend details
- MIT License file
- CHANGELOG.md for tracking project changes
- Updated documentation to reflect existing React/Vite frontend

### Changed
- Moved all backend code to `/backend` directory
- Updated .gitignore to handle monorepo structure
- Improved project organization and documentation

## [1.0.0] - 2024-01-XX

### Added
- Initial project setup with MERN stack
- User authentication system with JWT
- Task management CRUD operations
- User profile management
- Email verification system
- Password reset functionality
- File upload with Cloudinary integration
- Email notifications with Nodemailer
- RESTful API architecture
- MongoDB database integration
- Express.js backend server
- bcrypt password hashing
- Express validation middleware
- CORS configuration
- Cookie parser middleware
- EJS templating engine
- OTP generation for email verification

### Features
- **Authentication**
  - User registration with email verification
  - Secure login with JWT tokens
  - Password reset via email
  - Session management

- **Task Management**
  - Create, read, update, delete tasks
  - Task categorization and status tracking
  - Task history and analytics
  - User-specific task management

- **User Profile**
  - Profile creation and updates
  - Avatar upload functionality
  - User preferences management

- **Security**
  - Password encryption with bcrypt
  - JWT-based authentication
  - Input validation and sanitization
  - Secure file upload handling

### Technical Details
- **Backend Technologies**
  - Node.js runtime environment
  - Express.js web framework
  - MongoDB database with Mongoose ODM
  - JWT for authentication
  - bcrypt for password hashing
  - Nodemailer for email services
  - Cloudinary for image storage
  - Multer for file uploads
  - Express-validator for input validation
  - CORS for cross-origin requests
  - Cookie-parser for cookie handling
  - EJS for server-side templating
  - OTP-generator for verification codes

- **Frontend Technologies**
  - React 19 for modern UI development
  - Vite for fast build tooling and development server
  - React Router DOM for client-side routing
  - Bootstrap & React Bootstrap for responsive UI components
  - Chart.js & React Chart.js 2 for data visualization
  - @dnd-kit for drag and drop functionality
  - Axios for HTTP client and API communication
  - React Google reCAPTCHA for security integration

- **Project Structure**
  - MVC architecture pattern
  - Modular route organization
  - Middleware-based request processing
  - Service layer for external integrations
  - Model-based data management

### Dependencies
- bcrypt: ^6.0.0
- cloudinary: ^2.7.0
- cookie-parser: ^1.4.7
- cors: ^2.8.5
- dotenv: ^16.5.0
- ejs: ^3.1.10
- express: ^5.1.0
- express-validator: ^7.2.1
- jsonwebtoken: ^9.0.2
- mongoose: ^8.15.0
- multer: ^2.0.2
- nodemailer: ^7.0.3
- nodemon: ^3.1.10
- otp-generator: ^4.0.1

### Frontend Dependencies
- @dnd-kit/core: ^6.3.1
- @dnd-kit/modifiers: ^9.0.0
- @dnd-kit/sortable: ^10.0.0
- @dnd-kit/utilities: ^3.2.2
- axios: ^1.10.0
- bootstrap: ^5.3.8
- chart.js: ^4.5.1
- react: ^19.1.0
- react-bootstrap: ^2.10.10
- react-bootstrap-icons: ^1.11.6
- react-chartjs-2: ^5.3.0
- react-dom: ^19.1.0
- react-google-recaptcha: ^3.1.0
- react-router-dom: ^7.6.3

## [0.1.0] - 2024-01-XX

### Added
- Initial project conception
- Basic project structure planning
- Technology stack selection
- Development environment setup

---

## Legend

- **Added** for new features
- **Changed** for changes in existing functionality
- **Deprecated** for soon-to-be removed features
- **Removed** for now removed features
- **Fixed** for any bug fixes
- **Security** in case of vulnerabilities
