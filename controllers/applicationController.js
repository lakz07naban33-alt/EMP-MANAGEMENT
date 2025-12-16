import { validationResult } from 'express-validator'
import Application from '../models/Application.js'

export const getApplications = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      status, 
      department,
      search 
    } = req.query

    const query = {}
    
    if (status) {
      query.status = status
    }
    
    if (department) {
      query.department = department
    }
    
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { position: { $regex: search, $options: 'i' } }
      ]
    }

    const applications = await Application.find(query)
      .populate('reviewedBy', 'username email')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ appliedDate: -1 })

    const total = await Application.countDocuments(query)

    res.json({
      applications,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    })
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    })
  }
}

export const getApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('reviewedBy', 'username email')
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found' })
    }

    res.json(application)
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    })
  }
}

export const createApplication = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      })
    }

    const application = new Application(req.body)
    await application.save()

    res.status(201).json({
      message: 'Application submitted successfully',
      application
    })
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    })
  }
}

export const updateApplicationStatus = async (req, res) => {
  try {
    const { status, notes } = req.body
    
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { 
        status, 
        notes,
        reviewedBy: req.user._id,
        reviewDate: new Date()
      },
      { new: true, runValidators: true }
    ).populate('reviewedBy', 'username email')

    if (!application) {
      return res.status(404).json({ message: 'Application not found' })
    }

    res.json({
      message: 'Application status updated successfully',
      application
    })
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    })
  }
}