import mongoose from 'mongoose'
import dotenv from 'dotenv'
import User from './models/User.js'
import connectDB from './config/database.js'

dotenv.config()

const testLogin = async () => {
  try {
    await connectDB()
    
    // Find the HR manager user
    const user = await User.findOne({ username: 'hr_manager' })
    
    if (!user) {
      console.log('❌ HR manager user not found')
      return
    }
    
    console.log('✅ HR manager user found:', {
      username: user.username,
      email: user.email,
      role: user.role,
      isActive: user.isActive
    })
    
    // Test password
    const isMatch = await user.comparePassword('hrmanager123')
    console.log('🔐 Password test result:', isMatch)
    
    if (!isMatch) {
      console.log('❌ Password does not match')
    } else {
      console.log('✅ Password matches!')
    }
    
    process.exit(0)
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

testLogin()