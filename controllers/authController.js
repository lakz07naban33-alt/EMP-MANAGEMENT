import jwt from 'jsonwebtoken'
import { validationResult } from 'express-validator'
import User from '../models/User.js'

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

export const register = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      })
    }

    const { username, email, password, role } = req.body

    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    })
    
    if (existingUser) {
      return res.status(400).json({ 
        message: 'User with this email or username already exists' 
      })
    }

    const user = new User({
      username,
      email,
      password,
      role: role || 'employee'
    })

    await user.save()

    const token = generateToken(user._id)

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    })
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    })
  }
}

export const login = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      })
    }

    const { username, password } = req.body

    const user = await User.findOne({ 
      $or: [{ email: username }, { username }] 
    })

    if (!user || !user.isActive) {
      return res.status(401).json({ 
        message: 'Invalid credentials or account inactive' 
      })
    }

    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({ 
        message: 'Invalid credentials' 
      })
    }

    const token = generateToken(user._id)

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    })
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    })
  }
}