import { Router } from 'express';
import { signUpController, verifyTokenController } from '../controllers/auth.controller.js';

const authRouter = Router();

authRouter.post('/signup', signUpController);
authRouter.post('/verify-email/:token', verifyTokenController)

export default authRouter;