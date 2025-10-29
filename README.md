# TaskMaster App

A comprehensive task management application built with the MERN stack, featuring secure user authentication, task management, and productivity tracking.

## 🚀 Features

- **User Authentication & Security**
  - Secure user registration and login
  - JWT-based authentication
  - Password encryption with bcrypt
  - Email verification with OTP
  - Password reset functionality

- **Task Management**
  - Create, read, update, and delete tasks
  - Task categorization and prioritization
  - Task status tracking
  - Task history and analytics
  - Drag and drop task reordering

- **User Profile Management**
  - Profile creation and updates
  - Avatar upload with Cloudinary integration
  - User preferences and settings

- **Additional Features**
  - Email notifications with Nodemailer
  - Responsive design
  - RESTful API architecture
  - MongoDB database integration

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **Nodemailer** - Email service
- **Cloudinary** - Image storage
- **Multer** - File upload handling

### Frontend
- Coming soon...

## 📁 Project Structure

```
taskmaster-app/
├── backend/                 # Backend application
│   ├── config/             # Database configuration
│   ├── controller/         # Route controllers
│   │   ├── Tasks/         # Task-related controllers
│   │   ├── userController.js
│   │   └── userProfileController.js
│   ├── middleware/         # Custom middleware
│   │   ├── Tasks/         # Task validation middleware
│   │   ├── authMiddleware.js
│   │   └── validateUserProfile.js
│   ├── model/             # Database models
│   │   ├── Task/          # Task model
│   │   ├── User.js
│   │   ├── UserProfile.js
│   │   └── ...
│   ├── routes/            # API routes
│   ├── service/          # External services
│   ├── views/            # EJS templates
│   ├── server.js         # Main server file
│   └── package.json      # Backend dependencies
├── frontend/             # Frontend application (coming soon)
├── .gitignore           # Git ignore rules
├── LICENSE              # MIT License
├── CHANGELOG.md         # Project changelog
└── README.md           # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/riyanqadiir/taskmaster-app.git
   cd taskmaster-app
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Create .env file in backend directory
   cp .env.example .env
   ```
   
   Configure the following environment variables:
   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/taskmaster
   JWT_SECRET=your_jwt_secret_key
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_password
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_key
   CLOUDINARY_API_SECRET=your_cloudinary_secret
   ```

4. **Start the backend server**
   ```bash
   npm start
   ```

The backend will be running on `http://localhost:3000`

### API Endpoints

#### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/verify-email` - Email verification
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Password reset

#### Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create new task
- `GET /api/tasks/:id` - Get specific task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

#### User Profile
- `GET /api/profile` - Get user profile
- `POST /api/profile` - Create user profile
- `PUT /api/profile` - Update user profile

## 🔧 Development

### Running in Development Mode

```bash
cd backend
npm run start  # Uses nodemon for auto-restart
```

### Database Seeding

```bash
cd backend
npm run seed
```

## 📝 API Documentation

For detailed API documentation, please refer to the individual route files in the `routes/` directory.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **ask-tracker** - *Initial work* - [riyanqadiir](https://github.com/riyanqadiir)

## 🙏 Acknowledgments

- Express.js community
- MongoDB team
- All contributors and testers

## 📞 Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Contact the development team

---

**Note**: This project is currently in active development. The frontend is coming soon!
