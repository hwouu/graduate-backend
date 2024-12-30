import { body } from 'express-validator';

export const authValidation = {
  register: [
    body('email')
      .isEmail()
      .withMessage('Must be a valid email'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
    body('name')
      .notEmpty()
      .withMessage('Name is required'),
    body('studentId')
      .notEmpty()
      .withMessage('Student ID is required'),
    body('department')
      .notEmpty()
      .withMessage('Department is required'),
    body('admissionYear')
      .isInt({ min: 1900, max: new Date().getFullYear() })
      .withMessage('Invalid admission year'),
    body('targetYear')
      .isInt({ min: 1900 })
      .withMessage('Invalid target year')
  ],
  login: [
    body('email')
      .isEmail()
      .withMessage('Must be a valid email'),
    body('password')
      .notEmpty()
      .withMessage('Password is required')
  ]
};