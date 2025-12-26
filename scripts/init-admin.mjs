import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Error: MONGODB_URI not found in environment variables');
  console.error('Please set MONGODB_URI in your .env.local file');
  process.exit(1);
}

const AdminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);

async function initAdmin() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✓ Connected to MongoDB');
    
    const username = process.argv[2] || 'admin';
    const password = process.argv[3] || 'admin123';

    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      console.log('⚠ Admin already exists!');
      console.log(`Username: ${username}`);
      console.log('If you want to change the password, delete the admin first.');
      process.exit(0);
    }

    console.log('Creating admin user...');
    const passwordHash = await bcrypt.hash(password, 10);
    await Admin.create({ username, passwordHash });

    console.log('✓ Admin created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Username: ${username}`);
    console.log(`Password: ${password}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n⚠ IMPORTANT: Change the default password after first login!');
    process.exit(0);
  } catch (error) {
    console.error('✗ Error creating admin:', error.message);
    if (error.code === 11000) {
      console.error('Username already exists. Please choose a different username.');
    }
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
}

initAdmin();

