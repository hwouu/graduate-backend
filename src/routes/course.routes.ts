// src/routes/course.routes.ts
import { Router } from 'express';
import { CourseController } from '../controllers/course.controller';
import { validateRequest } from '../middlewares/validate-request';
import { courseValidation } from '../validations/course.validation';
import { authenticateJwt } from '../middlewares/authenticate';
import { checkAdmin } from '../middlewares/check-admin';

/**
 * @swagger
 * tags:
 *   name: Courses
 *   description: 과목 관리 API
 */

/**
 * @swagger
 * /api/courses:
 *   post:
 *     summary: 새로운 과목 생성 (관리자 전용)
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [code, name, credits, courseType]
 *             properties:
 *               code:
 *                 type: string
 *                 description: 과목 코드
 *               name:
 *                 type: string
 *                 description: 과목명
 *               credits:
 *                 type: integer
 *                 description: 학점
 *               courseType:
 *                 type: string
 *                 enum: [MAJOR_REQUIRED, MAJOR_ELECTIVE, MAJOR_INTENSIVE, LIBERAL_REQUIRED, LIBERAL_ELECTIVE, GENERAL_ELECTIVE]
 *                 description: 과목 유형
 *               prerequisiteId:
 *                 type: string
 *                 format: uuid
 *                 description: 선수과목 ID
 *               semester:
 *                 type: string
 *                 description: 개설 학기
 *               isRequired:
 *                 type: boolean
 *                 description: 필수과목 여부
 *     responses:
 *       201:
 *         description: 과목 생성 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Course'
 *       400:
 *         description: 잘못된 요청
 *       401:
 *         description: 인증 필요
 *       403:
 *         description: 권한 없음
 *
 *   get:
 *     summary: 과목 목록 조회
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: courseType
 *         schema:
 *           type: string
 *           enum: [MAJOR_REQUIRED, MAJOR_ELECTIVE, MAJOR_INTENSIVE, LIBERAL_REQUIRED, LIBERAL_ELECTIVE, GENERAL_ELECTIVE]
 *         description: 과목 유형 필터
 *       - in: query
 *         name: semester
 *         schema:
 *           type: string
 *         description: 학기 필터 (예: 2023-1)
 *       - in: query
 *         name: isRequired
 *         schema:
 *           type: boolean
 *         description: 필수과목 여부 필터
 *     responses:
 *       200:
 *         description: 과목 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Course'
 *       401:
 *         description: 인증 필요
 */

/**
 * @swagger
 * /api/courses/{id}:
 *   get:
 *     summary: 특정 과목 조회
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: 과목 ID
 *     responses:
 *       200:
 *         description: 과목 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Course'
 *       404:
 *         description: 과목을 찾을 수 없음
 *
 *   put:
 *     summary: 과목 정보 수정 (관리자 전용)
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: 과목 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Course'
 *     responses:
 *       200:
 *         description: 과목 수정 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Course'
 *       403:
 *         description: 권한 없음
 *       404:
 *         description: 과목을 찾을 수 없음
 *
 *   delete:
 *     summary: 과목 삭제 (관리자 전용)
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: 과목 ID
 *     responses:
 *       204:
 *         description: 과목 삭제 성공
 *       403:
 *         description: 권한 없음
 *       404:
 *         description: 과목을 찾을 수 없음
 */

const router = Router();
const courseController = new CourseController();

// 과목 생성 (관리자 전용)
router.post('/', 
  authenticateJwt,
  checkAdmin,
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
  checkAdmin,
  validateRequest(courseValidation.update),
  courseController.updateCourse.bind(courseController)
);

// 과목 삭제 (관리자 전용)
router.delete('/:id',
  authenticateJwt,
  checkAdmin,
  courseController.deleteCourse.bind(courseController)
);

export default router;

