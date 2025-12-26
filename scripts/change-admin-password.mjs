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

async function changePassword() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✓ Connected to MongoDB');
    
    const arg1 = process.argv[2];
    const arg2 = process.argv[3];

    // Determine if first arg is username or password
    let username, newPassword;
    if (arg2) {
      // Two arguments: username and password
      username = arg1;
      newPassword = arg2;
    } else if (arg1) {
      // One argument: treat as password, find first admin
      username = null;
      newPassword = arg1;
    } else {
      console.error('✗ Error: New password is required');
      console.error('Usage: node scripts/change-admin-password.mjs [username] <new-password>');
      console.error('Example: node scripts/change-admin-password.mjs admin MyNewPassword123');
      console.error('Or: node scripts/change-admin-password.mjs MyNewPassword123 (will find first admin)');
      process.exit(1);
    }

    // If only one argument provided, treat it as password and find first admin
    let admin;
    if (!username) {
      admin = await Admin.findOne();
      if (!admin) {
        console.error('✗ Error: No admin user found in database!');
        process.exit(1);
      }
      console.log(`Found admin user: ${admin.username}`);
    } else {
      admin = await Admin.findOne({ username });
      if (!admin) {
        console.error(`✗ Error: Admin user "${username}" not found!`);
        process.exit(1);
      }
      console.log(`Found admin user: ${username}`);
    }

    console.log('Updating password...');
    
    const passwordHash = await bcrypt.hash(newPassword, 10);
    admin.passwordHash = passwordHash;
    await admin.save();

    console.log('✓ Password updated successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Username: ${admin.username}`);
    console.log(`New Password: ${newPassword}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    process.exit(0);
  } catch (error) {
    console.error('✗ Error changing password:', error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
}

changePassword();

