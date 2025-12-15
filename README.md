# Employee Management System - Backend API

A comprehensive MongoDB-based backend API for employee management with authentication, employee CRUD operations, and job application management.

## Features

- **Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control (Admin, HR, Employee)
  - Secure password hashing with bcrypt

- **Employee Management**
  - Complete CRUD operations
  - Search and filtering capabilities
  - Department-based organization
  - Salary management

- **Job Application System**
  - Public application submission
  - Application status tracking
  - HR review and management

- **Security Features**
  - Rate limiting
  - CORS protection
  - Input validation
  - Helmet security headers

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env` file with:
   ```
   PORT=5001
   MONGODB_URI=mongodb://localhost:27017/employee_management
   JWT_SECRET=your_jwt_secret_key_here
   NODE_ENV=development
   ```

3. **Start MongoDB:**
   Make sure MongoDB is running on your system

4. **Seed demo data:**
   ```bash
   npm run seed
   ```

5. **Start the server:**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## Demo Credentials

After running the seed script, use these credentials:

- **Admin:** username=`admin`, password=`admin123`
- **HR Manager:** username=`hr_manager`, password=`hr123`
- **Employee:** username=`employee1`, password=`emp123`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Employees (Protected Routes)
- `GET /api/employees` - Get all employees
- `GET /api/employees/:id` - Get employee by ID
- `POST /api/employees` - Create employee (Admin/HR only)
- `PUT /api/employees/:id` - Update employee (Admin/HR only)
- `DELETE /api/employees/:id` - Terminate employee (Admin/HR only)

### Applications
- `GET /api/applications` - Get all applications (Admin/HR only)
- `GET /api/applications/:id` - Get application by ID (Admin/HR only)
- `POST /api/applications` - Submit job application (Public)
- `PUT /api/applications/:id/status` - Update application status (Admin/HR only)

### Utility
- `GET /api/health` - Health check

## Database Schema

### User Schema
```javascript
{
  username: String (required, unique),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (admin/hr/employee),
  isActive: Boolean
}
```

### Employee Schema
```javascript
{
  name: String (required),
  email: String (required, unique),
  phone: String (required),
  position: String (required),
  department: String (required),
  salary: Number,
  hireDate: Date,
  status: String (active/inactive/terminated),
  address: Object,
  emergencyContact: Object
}
```

### Application Schema
```javascript
{
  fullName: String (required),
  email: String (required),
  phone: String (required),
  position: String (required),
  department: String (required),
  experience: String (required),
  education: String (required),
  skills: String,
  coverLetter: String,
  expectedSalary: Number,
  status: String (pending/reviewing/interviewed/accepted/rejected),
  appliedDate: Date,
  reviewedBy: ObjectId (User),
  reviewDate: Date,
  notes: String
}
```

## Frontend Integration

Update your frontend API configuration to point to this backend:

```javascript
// frontend/src/config/api.js
const API_BASE_URL = 'http://localhost:5001/api'
```

## Development

- **Linting:** Follow ESLint configuration
- **Testing:** Add tests in `/tests` directory
- **Logging:** Use console.log for development, implement proper logging for production

## Production Deployment

1. Set `NODE_ENV=production`
2. Use a secure JWT secret
3. Configure MongoDB Atlas or production database
4. Set up proper CORS origins
5. Implement proper logging
6. Add monitoring and health checks

## Security Considerations

- JWT tokens expire in 7 days
- Passwords are hashed with bcrypt
- Rate limiting prevents abuse
- Input validation on all endpoints
- Role-based access control
- CORS protection enabled

## Troubleshooting

**MongoDB Connection Issues:**
- Ensure MongoDB is running
- Check connection string in `.env`
- Verify network connectivity

**Authentication Issues:**
- Check JWT secret configuration
- Verify token format in requests
- Ensure user exists and is active

**Permission Issues:**
- Verify user role in database
- Check route authorization requirements
- Ensure proper JWT token is sent