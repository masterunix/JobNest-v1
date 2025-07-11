const mongoose = require('mongoose');
const Job = require('./models/Job');
const User = require('./models/User');
require('dotenv').config();

// Sample jobs data
const sampleJobs = [
  {
    title: 'Senior Full Stack Engineer',
    company: {
      name: 'TechCorp',
      industry: 'Technology',
      size: 'medium'
    },
    description: 'We are looking for a Senior Full Stack Engineer to join our growing team. You will be responsible for building scalable web applications using React, Node.js, and MongoDB. Experience with cloud platforms like AWS is a plus.',
    requirements: {
      skills: ['React', 'Node.js', 'MongoDB', 'AWS', 'TypeScript'],
      experience: 'senior',
      education: 'bachelor'
    },
    location: {
      type: 'hybrid',
      address: {
        city: 'San Francisco',
        state: 'CA',
        country: 'USA'
      }
    },
    salary: {
      min: 120000,
      max: 180000,
      currency: 'USD',
      period: 'yearly'
    },
    type: 'full-time',
    category: 'engineering',
    benefits: ['Health Insurance', '401k', 'Remote Work', 'Stock Options'],
    tags: ['react', 'nodejs', 'fullstack', 'senior']
  },
  {
    title: 'Product Manager',
    company: {
      name: 'StartupXYZ',
      industry: 'Technology',
      size: 'startup'
    },
    description: 'Join our product team and help shape the future of our platform. You will work closely with engineering, design, and marketing teams to define product strategy and roadmap.',
    requirements: {
      skills: ['Product Strategy', 'User Research', 'Analytics', 'SQL', 'Figma'],
      experience: 'mid',
      education: 'bachelor'
    },
    location: {
      type: 'remote',
      address: {
        city: 'Remote',
        country: 'USA'
      }
    },
    salary: {
      min: 100000,
      max: 150000,
      currency: 'USD',
      period: 'yearly'
    },
    type: 'full-time',
    category: 'technology',
    benefits: ['Health Insurance', 'Flexible Hours', 'Remote Work'],
    tags: ['product', 'strategy', 'remote', 'startup']
  },
  {
    title: 'Frontend Developer',
    company: {
      name: 'InnovateLab',
      industry: 'Technology',
      size: 'small'
    },
    description: 'Build beautiful, responsive user interfaces for our web applications. You will work with modern technologies like React, TypeScript, and CSS-in-JS to create exceptional user experiences.',
    requirements: {
      skills: ['React', 'TypeScript', 'CSS', 'UI/UX', 'JavaScript'],
      experience: 'mid',
      education: 'bachelor'
    },
    location: {
      type: 'onsite',
      address: {
        city: 'New York',
        state: 'NY',
        country: 'USA'
      }
    },
    salary: {
      min: 90000,
      max: 130000,
      currency: 'USD',
      period: 'yearly'
    },
    type: 'full-time',
    category: 'engineering',
    benefits: ['Health Insurance', 'Dental', 'Vision', 'Gym Membership'],
    tags: ['frontend', 'react', 'typescript', 'ui']
  },
  {
    title: 'UX Designer',
    company: {
      name: 'DesignStudio',
      industry: 'Design',
      size: 'medium'
    },
    description: 'Create intuitive and beautiful user experiences for our products. You will conduct user research, create wireframes, and collaborate with developers to bring designs to life.',
    requirements: {
      skills: ['Figma', 'Sketch', 'User Research', 'Prototyping', 'UI Design'],
      experience: 'mid',
      education: 'bachelor'
    },
    location: {
      type: 'hybrid',
      address: {
        city: 'Austin',
        state: 'TX',
        country: 'USA'
      }
    },
    salary: {
      min: 80000,
      max: 120000,
      currency: 'USD',
      period: 'yearly'
    },
    type: 'full-time',
    category: 'design',
    benefits: ['Health Insurance', 'Professional Development', 'Flexible Hours'],
    tags: ['ux', 'design', 'figma', 'research']
  },
  {
    title: 'Marketing Specialist',
    company: {
      name: 'GrowthCo',
      industry: 'Marketing',
      size: 'startup'
    },
    description: 'Drive growth through digital marketing campaigns. You will manage social media, email marketing, and paid advertising campaigns to increase brand awareness and customer acquisition.',
    requirements: {
      skills: ['Digital Marketing', 'Social Media', 'Google Ads', 'Analytics', 'Email Marketing'],
      experience: 'entry',
      education: 'bachelor'
    },
    location: {
      type: 'remote',
      address: {
        city: 'Remote',
        country: 'USA'
      }
    },
    salary: {
      min: 60000,
      max: 90000,
      currency: 'USD',
      period: 'yearly'
    },
    type: 'full-time',
    category: 'marketing',
    benefits: ['Health Insurance', 'Remote Work', 'Flexible Hours'],
    tags: ['marketing', 'digital', 'social', 'growth']
  }
];

async function seedJobs() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/jobnest', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Find or create a test employer
    let employer = await User.findOne({ role: 'employer' });
    if (!employer) {
      employer = new User({
        firstName: 'Test',
        lastName: 'Employer',
        email: 'employer@test.com',
        password: 'password123',
        role: 'employer',
        company: {
          name: 'Test Company',
          industry: 'Technology'
        }
      });
      await employer.save();
      console.log('✅ Created test employer');
    }

    // Create or update an admin user
    let admin = await User.findOne({ email: 'admin@jobnest.com' });
    if (!admin) {
      admin = new User({
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@jobnest.com',
        password: 'admin123',
        role: 'admin',
        isVerified: true
      });
      await admin.save();
      console.log('✅ Created admin user: admin@jobnest.com / admin123');
    } else {
      admin.role = 'admin';
      admin.password = 'admin123';
      admin.isVerified = true;
      await admin.save();
      console.log('✅ Updated admin user: admin@jobnest.com / admin123');
    }

    // Clear existing jobs
    await Job.deleteMany({});
    console.log('✅ Cleared existing jobs');

    // Add sample jobs
    const jobsWithEmployer = sampleJobs.map(job => ({
      ...job,
      employer: employer._id
    }));

    await Job.insertMany(jobsWithEmployer);
    console.log('✅ Added sample jobs');

    console.log('🎉 Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seed function
seedJobs(); 