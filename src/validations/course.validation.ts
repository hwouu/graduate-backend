// src/validations/course.validation.ts
import { body } from 'express-validator';

export const courseValidation = {
  create: [
    body('code').notEmpty().withMessage('과목 코드는 필수입니다'),
    body('name').notEmpty().withMessage('과목명은 필수입니다'),
    body('credits').isInt({ min: 1 }).withMessage('학점은 1 이상이어야 합니다'),
    body('courseType').isIn([
      'MAJOR_REQUIRED', 'MAJOR_ELECTIVE', 'MAJOR_INTENSIVE',
      'LIBERAL_REQUIRED', 'LIBERAL_ELECTIVE', 'GENERAL_ELECTIVE'
    ]).withMessage('유효하지 않은 과목 유형입니다'),
    body('isRequired').isBoolean().withMessage('필수 과목 여부는 boolean이어야 합니다')
  ],
  update: [
    body('code').optional().notEmpty().withMessage('과목 코드는 비워둘 수 없습니다'),
    body('name').optional().notEmpty().withMessage('과목명은 비워둘 수 없습니다'),
    body('credits').optional().isInt({ min: 1 }).withMessage('학점은 1 이상이어야 합니다'),
    body('courseType').optional().isIn([
      'MAJOR_REQUIRED', 'MAJOR_ELECTIVE', 'MAJOR_INTENSIVE',
      'LIBERAL_REQUIRED', 'LIBERAL_ELECTIVE', 'GENERAL_ELECTIVE'
    ]).withMessage('유효하지 않은 과목 유형입니다'),
    body('isRequired').optional().isBoolean().withMessage('필수 과목 여부는 boolean이어야 합니다')
  ]
};