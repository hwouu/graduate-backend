// src/routes/enrollment.routes.ts
import { Router } from 'express';
import { EnrollmentController } from '../controllers/enrollment.controller';
import { authenticateJwt } from '../middlewares/authenticate';

/**
 * @swagger
 * tags:
 *   name: Enrollments
 *   description: 수강신청 관리 API
 */

/**
 * @swagger
 * /api/enrollments:
 *   post:
 *     summary: 새로운 수강신청 생성
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [courseId, semester]
 *             properties:
 *               courseId:
 *                 type: string
 *                 format: uuid
 *                 description: 과목 ID
 *               semester:
 *                 type: string
 *                 description: 수강 학기 (예: 2023-1)
 *               grade:
 *                 type: string
 *                 description: 성적
 *     responses:
 *       201:
 *         description: 수강신청 생성 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Enrollment'
 *       400:
 *         description: 이미 수강신청된 과목
 *       401:
 *         description: 인증 필요
 *
 *   get:
 *     summary: 수강신청 목록 조회
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: semester
 *         schema:
 *           type: string
 *         description: 학기 필터 (예: 2023-1)
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PLANNED, ENROLLED, COMPLETED, RETAKING]
 *         description: 수강신청 상태 필터
 *     responses:
 *       200:
 *         description: 수강신청 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Enrollment'
 *       401:
 *         description: 인증 필요
 */

/**
 * @swagger
 * /api/enrollments/{id}:
 *   put:
 *     summary: 수강신청 정보 수정
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: 수강신청 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               grade:
 *                 type: string
 *                 description: 성적
 *               status:
 *                 type: string
 *                 enum: [PLANNED, ENROLLED, COMPLETED, RETAKING]
 *                 description: 수강신청 상태
 *     responses:
 *       200:
 *         description: 수강신청 정보 수정 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Enrollment'
 *       401:
 *         description: 인증 필요
 *       404:
 *         description: 수강신청 정보를 찾을 수 없음
 *
 *   delete:
 *     summary: 수강신청 삭제
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: 수강신청 ID
 *     responses:
 *       200:
 *         description: 수강신청 삭제 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         description: 인증 필요
 *       404:
 *         description: 수강신청 정보를 찾을 수 없음
 */

const router = Router();
const enrollmentController = new EnrollmentController();

router.post('/', 
  authenticateJwt, 
  enrollmentController.createEnrollment.bind(enrollmentController)
);

router.get('/', 
  authenticateJwt, 
  enrollmentController.getEnrollments.bind(enrollmentController)
);

router.put('/:id', 
  authenticateJwt, 
  enrollmentController.updateEnrollment.bind(enrollmentController)
);

router.delete('/:id', 
  authenticateJwt, 
  enrollmentController.deleteEnrollment.bind(enrollmentController)
);

export default router;