// Import express-validator for validation
import { body, validationResult } from 'express-validator';

// Validation middleware
const registrationValidation = [
  body('username').trim().notEmpty().withMessage('Username is required').isLength({ min: 5 }).withMessage('Username must be at least 5 characters'),
  body('email').isEmail().withMessage('Invalid email').normalizeEmail(),
  body('mobileNumber')
    .matches(/^[0-9]{10}$/)
    .withMessage('Mobile number must be exactly 10 digits and contain only digits')
    .notEmpty()
    .withMessage('Mobile number is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

export { registrationValidation };
