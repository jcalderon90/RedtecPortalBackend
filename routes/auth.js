import express from 'express';
import * as authController from '../controllers/authController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', authController.login);
router.get('/me', auth, authController.me);

export default router;
