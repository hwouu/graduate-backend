// src/routes/course.routes.ts
import { Router } from 'express';
import { CourseController } from '../controllers/course.controller';
import { validateRequest } from '../middlewares/validate-request';
import { courseValidation } from '../validations/course.validation';
import { authenticateJwt } from '../middlewares/authenticate';
import { checkAdmin } from '../middlewares/check-admin';


const router = Router();
const courseController = new CourseController();

// 과목 생성 (관리자 전용)
router.post('/', 
  authenticateJwt,
  checkAdmin,  // 추가
  validateRequest(courseValidation.create),
  courseController.createCourse.bind(courseController)
);

// 과목 목록 조회
router.get('/',
  authenticateJwt,
  courseController.getCourses.bind(courseController)
);

// 특정 과목 조회
router.get('/:id',
  authenticateJwt,
  courseController.getCourseById.bind(courseController)
);

// 과목 정보 수정 (관리자 전용)
router.put('/:id',
  authenticateJwt,
  checkAdmin,  // 추가
  validateRequest(courseValidation.update),
  courseController.updateCourse.bind(courseController)
);

// 과목 삭제 (관리자 전용)
router.delete('/:id',
  authenticateJwt,
  checkAdmin,  // 추가
  courseController.deleteCourse.bind(courseController)
);


export default router;