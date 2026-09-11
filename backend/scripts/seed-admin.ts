import * as bcrypt from 'bcrypt';
import 'dotenv/config';
import mongoose from 'mongoose';
import { User, UserSchema } from '../src/users/schemas/user.schema';

async function seedAdmin() {
  const { MONGODB_URI, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

  if (!MONGODB_URI || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error(
      'Missing MONGODB_URI, ADMIN_EMAIL, or ADMIN_PASSWORD in .env',
    );
    process.exit(1);
  }

  await mongoose.connect(MONGODB_URI);
  const UserModel = mongoose.model(User.name, UserSchema);

  const existingAdmin = await UserModel.findOne({ role: 'admin' });
  if (existingAdmin) {
    console.log(`Admin already exists: ${existingAdmin.email}. Aborting.`);
    await mongoose.disconnect();
    return;
  }

  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);
  const admin = await UserModel.create({
    email: ADMIN_EMAIL.toLowerCase(),
    passwordHash,
    role: 'admin',
  });

  console.log(`Admin created: ${admin.email}`);
  await mongoose.disconnect();
}

seedAdmin().catch((err) => {
  console.error(err);
  process.exit(1);
});
