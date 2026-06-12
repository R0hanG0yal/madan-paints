// Run this script to create an admin user
// Usage: node seed-admin.js <email>
// If no email provided, defaults to admin@madanpaints.com

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storePath = path.join(__dirname, 'store.json');
const email = process.argv[2] || 'admin@madanpaints.com';
const password = process.argv[3] || 'admin123';

// Load existing store
let store = { users: [], cartItems: [], orders: [] };
try {
  if (fs.existsSync(storePath)) {
    store = JSON.parse(fs.readFileSync(storePath, 'utf-8'));
  }
} catch (err) {
  console.log('No existing store found, creating new one');
}

// Check if admin already exists
const existingAdmin = store.users.find(u => u.email === email);
if (existingAdmin) {
  // Update existing user to be admin
  existingAdmin.isAdmin = true;
  fs.writeFileSync(storePath, JSON.stringify(store, null, 2));
  console.log(`✅ User ${email} has been promoted to admin!`);
  console.log(`   Password: ${password}`);
  process.exit(0);
}

// Create admin user
const adminUser = {
  id: crypto.randomUUID(),
  name: 'Admin',
  email: email,
  password: bcrypt.hashSync(password, 10),
  phone: '9999999999',
  address: '',
  isAdmin: true,
  createdAt: new Date().toISOString()
};

store.users.push(adminUser);
fs.writeFileSync(storePath, JSON.stringify(store, null, 2));

console.log('✅ Admin user created successfully!');
console.log(`   Email: ${email}`);
console.log(`   Password: ${password}`);
console.log('   Login at http://localhost:5173/login');
console.log('   Then visit http://localhost:5173/admin');
