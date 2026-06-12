import { Router } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import rateLimit from 'express-rate-limit';
import { authenticateToken, generateToken, setTokenCookie, clearTokenCookie } from '../middleware/auth.js';
import { findUserByEmail, findUserById, createUser, updateUser } from '../data/db.js';
import { isValidEmail, isValidPassword, isValidName, isValidPhone, sanitizeInput } from '../middleware/security.js';

const router = Router();

// Stricter rate limiter for auth routes (prevents brute force)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 attempts per window
  message: { message: 'Too many login attempts. Please try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});
router.use(authLimiter);

// Sign Up
router.post('/signup', (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }

    // Sanitize and validate name
    const sanitizedName = sanitizeInput(name);
    if (!isValidName(sanitizedName)) {
      return res.status(400).json({ message: 'Name must be 2-50 characters and contain only letters and spaces' });
    }

    // Validate email
    const sanitizedEmail = sanitizeInput(email).toLowerCase().trim();
    if (!isValidEmail(sanitizedEmail)) {
      return res.status(400).json({ message: 'Please provide a valid email address' });
    }

    // Validate password strength
    if (!isValidPassword(password)) {
      return res.status(400).json({ message: 'Password must be at least 6 characters with at least 1 letter and 1 number' });
    }

    // Validate phone (optional)
    if (phone && !isValidPhone(phone)) {
      return res.status(400).json({ message: 'Please provide a valid Indian phone number' });
    }

    const existing = findUserByEmail(sanitizedEmail);
    if (existing) {
      return res.status(409).json({ message: 'An account with this email already exists' });
    }

    const id = crypto.randomUUID();
    const hashedPassword = bcrypt.hashSync(password, 10);

    createUser({
      id,
      name: sanitizedName,
      email: sanitizedEmail,
      password: hashedPassword,
      phone: phone || '',
      address: '',
      createdAt: new Date().toISOString()
    });

    const token = generateToken({ id, email: sanitizedEmail, name: sanitizedName });
    
    // Set httpOnly cookie (browser clients) and return user info (no token in body)
    setTokenCookie(res, token);
    res.status(201).json({
      message: 'Account created successfully',
      user: { id, name: sanitizedName, email: sanitizedEmail, phone: phone || '' }
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Server error during signup' });
  }
});

// Login
router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Use generic error message to avoid leaking whether email exists
    const sanitizedEmail = sanitizeInput(email).toLowerCase().trim();

    const user = findUserByEmail(sanitizedEmail);
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken({ id: user.id, email: user.email, name: user.name });
    
    // Set httpOnly cookie (browser clients) and return user info (no token in body)
    setTokenCookie(res, token);
    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        address: user.address || ''
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Logout — clear the httpOnly cookie
router.post('/logout', (req, res) => {
  clearTokenCookie(res);
  res.json({ message: 'Logged out successfully' });
});

// Get current user profile (from cookie or Authorization header)
router.get('/me', authenticateToken, (req, res) => {
  try {
    const user = findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const { password, ...safeUser } = user;
    res.json({ user: safeUser });
  } catch (err) {
    console.error('Profile error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update profile
router.put('/me', authenticateToken, (req, res) => {
  try {
    const { name, phone, address } = req.body;
    const updates = {};
    if (name !== undefined) updates.name = name;
    if (phone !== undefined) updates.phone = phone;
    if (address !== undefined) updates.address = address;

    const user = updateUser(req.user.id, updates);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const { password, ...safeUser } = user;
    res.json({ message: 'Profile updated', user: safeUser });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
