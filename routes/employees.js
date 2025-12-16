import express from 'express'
import { body } from 'express-validator'
import { authenticate, authorize } from '../middleware/auth.js'
import {
  getEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee
} from '../controllers/employeeController.js'

const router = express.Router()

// Validation rules
const employeeValidation = [
  body('name')
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ max: 100 })
    .withMessage('Name must not exceed 100 characters'),
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('phone')
    .notEmpty()
    .withMessage('Phone number is required'),
  body('position')
    .notEmpty()
    .withMessage('Position is required'),
  body('department')
    .isIn(['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations', 'Design', 'Product'])
    .withMessage('Invalid department'),
  body('salary')
    .optional()
    .isNumeric()
    .withMessage('Salary must be a number')
    .isFloat({ min: 0 })
    .withMessage('Salary must be positive')
]

// Routes
router.get('/', authenticate, getEmployees)
router.get('/:id', authenticate, getEmployee)
router.post('/', authenticate, authorize('admin', 'administrator', 'hr', 'manager'), employeeValidation, createEmployee)
router.put('/:id', authenticate, authorize('admin', 'administrator', 'hr', 'manager'), employeeValidation, updateEmployee)
router.delete('/:id', authenticate, authorize('admin', 'administrator', 'hr', 'manager'), deleteEmployee)

export default router