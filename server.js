import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'
import connectDB from './config/database.js'

// Import routes
import authRoutes from './routes/auth.js'
import employeeRoutes from './routes/employees.js'
import applicationRoutes from './routes/applications.js'

// Load environment variables
dotenv.config()

// Create Express app
const app = express()

// Connect to MongoDB
connectDB()

// Security middleware
app.use(helmet())

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
})
app.use(limiter)

// CORS configuration
app.use(cors({
  origin: '*',
  credentials: false
}))

// Body parsing middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// API routes
app.use('/api/auth', authRoutes)
app.use('/api/employees', employeeRoutes)
app.use('/api/applications', applicationRoutes)

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Employee Management API is running',
    timestamp: new Date().toISOString()
  })
})

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    message: 'Route not found',
    path: req.originalUrl
  })
})

// Global error handler
app.use((error, req, res, next) => {
  console.error('Error:', error)
  
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Validation Error',
      errors: Object.values(error.errors).map(err => err.message)
    })
  }
  
  if (error.code === 11000) {
    return res.status(400).json({
      message: 'Duplicate field value',
      field: Object.keys(error.keyPattern)[0]
    })
  }
  
  res.status(500).json({
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  })
})

const PORT = process.env.PORT || 5001

app.listen(PORT, () => {
  console.log(`\\n🚀 Server running on port ${PORT}`)
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`)
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api`)
  console.log(`💾 Database: ${process.env.MONGODB_URI}`)
  console.log('\\n📋 Available endpoints:')
  console.log('   POST /api/auth/register - Register new user')
  console.log('   POST /api/auth/login - User login')
  console.log('   GET  /api/employees - Get all employees')
  console.log('   POST /api/employees - Create employee')
  console.log('   GET  /api/applications - Get all applications')
  console.log('   POST /api/applications - Submit job application')
  console.log('   GET  /api/health - Health check')
})