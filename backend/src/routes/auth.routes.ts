import { Router } from 'express';
import authMiddleware from '../middleware/auth.middleware';
import { 
    signUpController,
    verifyTokenController,
    loginController,
    logoutController,
    verifyAccessTokenController,
    refreshTokenController
} from '../controllers/auth.controller';
import { rateLimiter } from '../middleware/rateLimiter';

const authRouter = Router();

authRouter.post('/signup', signUpController);
authRouter.post('/verify-email/:token', verifyTokenController);
authRouter.post('/login', rateLimiter({ windowInSeconds: 60, maxRequests: 10 }), loginController);
authRouter.get('/verify-token', authMiddleware, verifyAccessTokenController);
authRouter.post('/refresh-token', refreshTokenController);
authRouter.post('/logout', authMiddleware, logoutController);

export default authRouter;