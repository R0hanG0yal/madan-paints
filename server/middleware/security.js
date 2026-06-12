// Security middleware — input sanitization and validation

// Strip potentially dangerous characters from strings
export function sanitizeInput(str) {
  if (typeof str !== 'string') return str;
  return str
    .replace(/[<>]/g, '')           // Remove < and > to prevent HTML/script injection
    .replace(/javascript:/gi, '')   // Remove javascript: protocol
    .replace(/on\w+=/gi, '')        // Remove event handlers (onclick=, onload=, etc.)
    .trim();
}

// Sanitize all string fields in an object
export function sanitizeObject(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  const sanitized = { ...obj };
  for (const key of Object.keys(sanitized)) {
    if (typeof sanitized[key] === 'string') {
      sanitized[key] = sanitizeInput(sanitized[key]);
    } else if (sanitized[key] && typeof sanitized[key] === 'object') {
      sanitized[key] = sanitizeObject(sanitized[key]);
    }
  }
  return sanitized;
}

// Middleware to sanitize all incoming request body fields
export function sanitizeRequestBody(req, res, next) {
  if (req.body) {
    req.body = sanitizeObject(req.body);
  }
  next();
}

// Validate email format
export function isValidEmail(email) {
  if (typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

// Validate password strength (min 6 chars, at least 1 letter and 1 number)
export function isValidPassword(password) {
  if (typeof password !== 'string') return false;
  if (password.length < 6 || password.length > 128) return false;
  return /[a-zA-Z]/.test(password) && /[0-9]/.test(password);
}

// Validate name (2-50 chars, letters and spaces only)
export function isValidName(name) {
  if (typeof name !== 'string') return false;
  return name.length >= 2 && name.length <= 50 && /^[a-zA-Z\s'-]+$/.test(name);
}

// Validate phone number (10 digits, optional +91 prefix)
export function isValidPhone(phone) {
  if (!phone || typeof phone !== 'string') return true; // optional field
  return /^(\+91)?[6-9]\d{9}$/.test(phone.replace(/\s/g, ''));
}

// Validate product price
export function isValidPrice(price) {
  const num = Number(price);
  return !isNaN(num) && num > 0 && num < 1000000;
}

// Middleware to ensure consistent error responses
export function errorHandler(err, req, res, next) {
  console.error('Security error:', err.message);
  // Don't leak stack traces in production
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error'
  });
}
