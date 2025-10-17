import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// College Schema
const collegeSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  code: { type: String, required: true, unique: true },
  location: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const College = mongoose.model('College', collegeSchema);

const seedColleges = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/cdsc', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('Connected to MongoDB');

    // Check if colleges already exist
    const existingColleges = await College.countDocuments();
    if (existingColleges > 0) {
      console.log('Colleges already exist, skipping seed');
      process.exit(0);
    }

    const colleges = [
      { name: 'Massachusetts Institute of Technology', code: 'MIT', location: 'Cambridge, MA' },
      { name: 'Stanford University', code: 'STANFORD', location: 'Stanford, CA' },
      { name: 'Harvard University', code: 'HARVARD', location: 'Cambridge, MA' },
      { name: 'California Institute of Technology', code: 'CALTECH', location: 'Pasadena, CA' },
      { name: 'University of California, Berkeley', code: 'UC_BERKELEY', location: 'Berkeley, CA' },
      { name: 'Carnegie Mellon University', code: 'CMU', location: 'Pittsburgh, PA' },
      { name: 'University of Washington', code: 'UW', location: 'Seattle, WA' },
      { name: 'Georgia Institute of Technology', code: 'GATECH', location: 'Atlanta, GA' },
      { name: 'University of Illinois Urbana-Champaign', code: 'UIUC', location: 'Urbana, IL' },
      { name: 'University of Texas at Austin', code: 'UT_AUSTIN', location: 'Austin, TX' }
    ];

    await College.insertMany(colleges);
    console.log('Colleges seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding colleges:', error);
    process.exit(1);
  }
};

seedColleges();