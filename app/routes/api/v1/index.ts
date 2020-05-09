import {Router} from 'express';
import {resolve} from 'routes/__init__/helpers';
import {catchErrors} from 'routes/__init__/handlers';
import auth from 'routes/middlewares/auth.middleware';
import AuthenticationController from 'controllers/authentication.controller';

const router = Router();
const protectedRouter = Router();

router.use(protectedRouter);
protectedRouter.use(catchErrors(auth('admin')));


// Liat of accepted routes
router.get('/', (req, res) => res.json({ data: { message: '/api/v1' } }));

/**
 * Authentication Routes
 */
router.post('/login', resolve(AuthenticationController, 'login'));
router.post('/logout', resolve(AuthenticationController, 'logout'));
router.post('/register', resolve(AuthenticationController, 'register'));
protectedRouter.get('/user', resolve(AuthenticationController, 'user'));
protectedRouter.get('/refresh', resolve(AuthenticationController, 'refresh'));


export default router;
