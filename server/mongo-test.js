import mongoose from 'mongoose';

console.log('Testing MongoDB connection...');

mongoose.connect('mongodb://localhost:27017/cdsc', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ MongoDB connected successfully!');
  process.exit(0);
}).catch((error) => {
  console.error('❌ MongoDB connection failed:', error.message);
  console.log('\n🔧 Troubleshooting steps:');
  console.log('1. Make sure MongoDB is installed');
  console.log('2. Start MongoDB service: net start MongoDB (as admin)');
  console.log('3. Or install MongoDB Community Server from: https://www.mongodb.com/try/download/community');
  process.exit(1);
});