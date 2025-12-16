import mongoose from 'mongoose'
import dotenv from 'dotenv'
import User from '../models/User.js'
import Employee from '../models/Employee.js'
import Application from '../models/Application.js'
import connectDB from '../config/database.js'

dotenv.config()

const seedData = async () => {
  try {
    await connectDB()
    
    // Clear existing data
    await User.deleteMany({})
    await Employee.deleteMany({})
    await Application.deleteMany({})
    
    console.log('Existing data cleared')

    // Create demo users
    const users = [
      {
        username: 'admin',
        email: 'admin@company.com',
        password: 'admin123',
        role: 'admin'
      },
      {
        username: 'hr_manager',
        email: 'hr@company.com',
        password: 'hrmanager123',
        role: 'hr'
      },
      {
        username: 'employee1',
        email: 'john.doe@company.com',
        password: 'employee123',
        role: 'employee'
      }
    ]

    const createdUsers = []
    for (const userData of users) {
      const user = new User(userData)
      await user.save()
      createdUsers.push(user)
    }
    console.log('Demo users created')

    // Create demo employees
    const employees = [
      {
        name: 'John Doe',
        email: 'john.doe@company.com',
        phone: '+1 (555) 123-4567',
        position: 'Senior Software Engineer',
        department: 'Engineering',
        salary: 95000,
        hireDate: new Date('2022-01-15'),
        address: {
          street: '123 Main St',
          city: 'San Francisco',
          state: 'CA',
          zipCode: '94105',
          country: 'USA'
        },
        emergencyContact: {
          name: 'Jane Doe',
          relationship: 'Spouse',
          phone: '+1 (555) 123-4568'
        }
      },
      {
        name: 'Sarah Johnson',
        email: 'sarah.johnson@company.com',
        phone: '+1 (555) 234-5678',
        position: 'Marketing Manager',
        department: 'Marketing',
        salary: 75000,
        hireDate: new Date('2021-08-20'),
        address: {
          street: '456 Oak Ave',
          city: 'Los Angeles',
          state: 'CA',
          zipCode: '90210',
          country: 'USA'
        }
      },
      {
        name: 'Michael Chen',
        email: 'michael.chen@company.com',
        phone: '+1 (555) 345-6789',
        position: 'Product Designer',
        department: 'Design',
        salary: 80000,
        hireDate: new Date('2023-03-10'),
        address: {
          street: '789 Pine St',
          city: 'Seattle',
          state: 'WA',
          zipCode: '98101',
          country: 'USA'
        }
      },
      {
        name: 'Emily Rodriguez',
        email: 'emily.rodriguez@company.com',
        phone: '+1 (555) 456-7890',
        position: 'Sales Representative',
        department: 'Sales',
        salary: 65000,
        hireDate: new Date('2022-11-05'),
        address: {
          street: '321 Elm St',
          city: 'Austin',
          state: 'TX',
          zipCode: '73301',
          country: 'USA'
        }
      },
      {
        name: 'David Wilson',
        email: 'david.wilson@company.com',
        phone: '+1 (555) 567-8901',
        position: 'HR Specialist',
        department: 'HR',
        salary: 60000,
        hireDate: new Date('2021-06-15'),
        address: {
          street: '654 Maple Ave',
          city: 'Denver',
          state: 'CO',
          zipCode: '80202',
          country: 'USA'
        }
      }
    ]

    await Employee.insertMany(employees)
    console.log('Demo employees created')

    // Create demo applications
    const applications = [
      {
        fullName: 'Alice Thompson',
        email: 'alice.thompson@email.com',
        phone: '+1 (555) 678-9012',
        address: '987 Cedar St, Portland, OR 97201',
        position: 'Frontend Developer',
        department: 'Engineering',
        experience: '3 years in React and JavaScript development',
        education: 'Bachelor of Science in Computer Science',
        skills: 'React, JavaScript, TypeScript, CSS, HTML, Git',
        coverLetter: 'I am excited to apply for the Frontend Developer position. With 3 years of experience in React development, I believe I can contribute significantly to your team.',
        expectedSalary: 70000,
        status: 'pending'
      },
      {
        fullName: 'Robert Martinez',
        email: 'robert.martinez@email.com',
        phone: '+1 (555) 789-0123',
        address: '147 Birch Ln, Miami, FL 33101',
        position: 'Digital Marketing Specialist',
        department: 'Marketing',
        experience: '2 years in digital marketing and social media',
        education: 'Bachelor of Arts in Marketing',
        skills: 'SEO, SEM, Social Media Marketing, Google Analytics, Content Creation',
        coverLetter: 'I am passionate about digital marketing and would love to bring my skills to your marketing team.',
        expectedSalary: 55000,
        status: 'reviewing',
        reviewedBy: createdUsers[1]._id,
        reviewDate: new Date(),
        notes: 'Strong portfolio, scheduling interview'
      },
      {
        fullName: 'Lisa Chang',
        email: 'lisa.chang@email.com',
        phone: '+1 (555) 890-1234',
        address: '258 Spruce St, Boston, MA 02101',
        position: 'UX Designer',
        department: 'Design',
        experience: '4 years in UX/UI design',
        education: 'Master of Fine Arts in Design',
        skills: 'Figma, Sketch, Adobe Creative Suite, User Research, Prototyping',
        coverLetter: 'With 4 years of UX design experience, I am excited about the opportunity to create user-centered designs for your products.',
        expectedSalary: 75000,
        status: 'interviewed'
      }
    ]

    await Application.insertMany(applications)
    console.log('Demo applications created')

    console.log('\\n=== DEMO DATA SEEDED SUCCESSFULLY ===')
    console.log('\\nDemo Login Credentials:')
    console.log('Admin: username=admin, password=admin123')
    console.log('HR Manager: username=hr_manager, password=hrmanager123')
    console.log('Employee: username=employee1, password=employee123')
    console.log('\\nDemo employees and applications have been created.')
    
    process.exit(0)
  } catch (error) {
    console.error('Error seeding data:', error)
    process.exit(1)
  }
}

seedData()