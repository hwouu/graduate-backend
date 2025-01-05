// src/routes/credit.routes.ts
import { Router } from 'express';
import { CreditController } from '../controllers/credit.controller';
import { authenticateJwt } from '../middlewares/authenticate';

/**
 * @swagger
 * tags:
 *   name: Credits
 *   description: 학점 관리 및 졸업요건 확인 API
 */

/**
 * @swagger
 * /api/credits/summary/{userId}:
 *   get:
 *     summary: 사용자의 이수학점 현황 조회
 *     tags: [Credits]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: 사용자 ID
 *     responses:
 *       200:
 *         description: 이수학점 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalCredits:
 *                   type: integer
 *                   description: 총 이수학점
 *                 majorRequired:
 *                   type: integer
 *                   description: 전공필수 이수학점
 *                 majorElective:
 *                   type: integer
 *                   description: 전공선택 이수학점
 *                 liberalRequired:
 *                   type: integer
 *                   description: 교양필수 이수학점
 *                 liberalElective:
 *                   type: integer
 *                   description: 교양선택 이수학점
 *       401:
 *         description: 인증 필요
 *       403:
 *         description: 다른 사용자의 정보 조회 불가
 */

/**
 * @swagger
 * /api/credits/graduation-status/{userId}:
 *   get:
 *     summary: 사용자의 졸업요건 충족 상태 조회
 *     tags: [Credits]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: 사용자 ID
 *     responses:
 *       200:
 *         description: 졸업요건 상태 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isGraduationPossible:
 *                   type: boolean
 *                   description: 졸업 가능 여부
 *                 totalCreditsStatus:
 *                   type: object
 *                   properties:
 *                     required:
 *                       type: integer
 *                     current:
 *                       type: integer
 *                     isSatisfied:
 *                       type: boolean
 *                 majorRequiredStatus:
 *                   type: object
 *                   properties:
 *                     required:
 *                       type: integer
 *                     current:
 *                       type: integer
 *                     isSatisfied:
 *                       type: boolean
 *                 requiredCourses:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       courseId:
 *                         type: string
 *                         format: uuid
 *                       courseName:
 *                         type: string
 *                       isCompleted:
 *                         type: boolean
 *       401:
 *         description: 인증 필요
 *       403:
 *         description: 다른 사용자의 정보 조회 불가
 */

const router = Router();
const creditController = new CreditController();

router.get('/summary/:userId', 
  authenticateJwt, 
  creditController.getCreditsSummary.bind(creditController)
);

router.get('/graduation-status/:userId', 
  authenticateJwt, 
  creditController.getGraduationStatus.bind(creditController)
);

export default router;