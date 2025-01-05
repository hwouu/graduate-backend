// src/routes/credit.routes.ts
import { Router } from 'express';
import { CreditController } from '../controllers/credit.controller';
import { authenticateJwt } from '../middlewares/authenticate';

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