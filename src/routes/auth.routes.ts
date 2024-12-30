import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validateRequest } from '../middlewares/validate-request';
import { authValidation } from '../validations/auth.validation';

const router = Router();
const authController = new AuthController();

router.post('/register', validateRequest(authValidation.register), authController.register.bind(authController));
router.post('/login', validateRequest(authValidation.login), authController.login.bind(authController));

export default router;