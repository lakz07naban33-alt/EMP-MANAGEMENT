import mongoose from 'mongoose'

const applicationSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  position: {
    type: String,
    required: true,
    trim: true
  },
  department: {
    type: String,
    required: true,
    enum: ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations', 'Design', 'Product']
  },
  experience: {
    type: String,
    required: true,
    trim: true
  },
  education: {
    type: String,
    required: true,
    trim: true
  },
  skills: {
    type: String,
    trim: true
  },
  coverLetter: {
    type: String,
    trim: true
  },
  expectedSalary: {
    type: Number,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'reviewing', 'interviewed', 'accepted', 'rejected'],
    default: 'pending'
  },
  appliedDate: {
    type: Date,
    default: Date.now
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewDate: {
    type: Date
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
})

applicationSchema.index({ email: 1 })
applicationSchema.index({ status: 1 })
applicationSchema.index({ department: 1 })
applicationSchema.index({ appliedDate: -1 })

export default mongoose.model('Application', applicationSchema)