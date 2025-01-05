// src/routes/enrollment.routes.ts
import { Router } from 'express';
import { EnrollmentController } from '../controllers/enrollment.controller';
import { authenticateJwt } from '../middlewares/authenticate';

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