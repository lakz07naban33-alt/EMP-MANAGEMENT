import { validationResult } from 'express-validator'
import Employee from '../models/Employee.js'

export const getEmployees = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      department, 
      status = 'active',
      search 
    } = req.query

    const query = { status }
    
    if (department) {
      query.department = department
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { position: { $regex: search, $options: 'i' } }
      ]
    }

    const employees = await Employee.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 })

    const total = await Employee.countDocuments(query)

    res.json({
      employees,
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

export const getEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id)
    
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' })
    }

    res.json(employee)
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    })
  }
}

export const createEmployee = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      })
    }

    const existingEmployee = await Employee.findOne({ email: req.body.email })
    if (existingEmployee) {
      return res.status(400).json({ 
        message: 'Employee with this email already exists' 
      })
    }

    const employee = new Employee(req.body)
    await employee.save()

    res.status(201).json({
      message: 'Employee created successfully',
      employee
    })
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    })
  }
}

export const updateEmployee = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      })
    }

    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' })
    }

    res.json({
      message: 'Employee updated successfully',
      employee
    })
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    })
  }
}

export const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      { status: 'terminated' },
      { new: true }
    )

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' })
    }

    res.json({
      message: 'Employee terminated successfully',
      employee
    })
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    })
  }
}