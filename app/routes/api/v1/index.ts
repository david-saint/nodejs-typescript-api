import {Router} from 'express';
import {resolve} from 'routes/__init__/helpers';
import {catchErrors} from 'routes/__init__/handlers';
import auth from 'routes/middlewares/auth.middleware';
import AuthenticationController from 'controllers/authentication.controller';

const router = Router();

// Liat of accepted routes
router.get('/', (req, res) => res.json({ data: { message: '/api/v1' } }));

/**
 * Authentication Routes
 */
router.post('/login', resolve(AuthenticationController, 'login'));
router.post('/logout', resolve(AuthenticationController, 'logout'));
router.get('/refresh', resolve(AuthenticationController, 'refresh'));
router.post('/register', resolve(AuthenticationController, 'register'));

/**
 * Protected routes
 */
const protectedRouter = Router();
protectedRouter.use(catchErrors(auth('admin')));

protectedRouter.get('/user', resolve(AuthenticationController, 'user'));





router.use(protectedRouter);

export default router;
