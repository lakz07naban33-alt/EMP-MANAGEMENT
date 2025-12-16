import express from 'express'
import { body } from 'express-validator'
import { authenticate, authorize } from '../middleware/auth.js'
import {
  getApplications,
  getApplication,
  createApplication,
  updateApplicationStatus
} from '../controllers/applicationController.js'

const router = express.Router()

// Validation rules
const applicationValidation = [
  body('fullName')
    .notEmpty()
    .withMessage('Full name is required')
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
  body('experience')
    .notEmpty()
    .withMessage('Experience is required'),
  body('education')
    .notEmpty()
    .withMessage('Education is required'),
  body('expectedSalary')
    .optional()
    .isNumeric()
    .withMessage('Expected salary must be a number')
    .isFloat({ min: 0 })
    .withMessage('Expected salary must be positive')
]

const statusUpdateValidation = [
  body('status')
    .isIn(['pending', 'reviewing', 'interviewed', 'accepted', 'rejected'])
    .withMessage('Invalid status')
]

// Routes
router.get('/', authenticate, authorize('admin', 'administrator', 'hr', 'manager'), getApplications)
router.get('/:id', authenticate, authorize('admin', 'administrator', 'hr', 'manager'), getApplication)
router.post('/', applicationValidation, createApplication) // Public route for job applications
router.put('/:id/status', authenticate, authorize('admin', 'administrator', 'hr', 'manager'), statusUpdateValidation, updateApplicationStatus)

export default router