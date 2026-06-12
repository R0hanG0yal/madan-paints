import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const JWT_SECRET = process.env.JWT_SECRET || 'mp_7xK9#pL2$mN4@rT6^wB8&yH1*jF3%vR5';
const isProduction = process.env.NODE_ENV === 'production';

// Cookie configuration for httpOnly JWT
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? 'strict' : 'lax',
  path: '/',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export function authenticateToken(req, res, next) {
  // Check Authorization header first (for non-browser clients)
  const authHeader = req.headers['authorization'];
  let token = authHeader && authHeader.split(' ')[1];
  
  // Fall back to httpOnly cookie for browser clients
  if (!token && req.cookies) {
    token = req.cookies.token;
  }
  
  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    // Don't leak specific error details
    return res.status(403).json({ message: 'Invalid or expired token. Please log in again.' });
  }
}

export function generateToken(user) {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      name: user.name,
      iat: Math.floor(Date.now() / 1000)
    },
    JWT_SECRET,
    { 
      expiresIn: '7d',
      algorithm: 'HS256'
    }
  );
}

// Set httpOnly cookie with JWT
export function setTokenCookie(res, token) {
  res.cookie('token', token, COOKIE_OPTIONS);
}

// Clear JWT cookie (for logout)
export function clearTokenCookie(res) {
  res.clearCookie('token', { path: '/' });
}

export { JWT_SECRET };
