import express from 'express';
import * as serviceController from '../controllers/serviceController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Generic route that proxies services based on serviceId
router.post('/execute/:serviceId', auth, serviceController.proxyService);
router.get('/execute/:serviceId', auth, serviceController.proxyService);

// Public execution for forms
router.post('/execute-public/:serviceId', serviceController.proxyService);

// Get authorized services for the current user's organization
router.get('/my-services', auth, serviceController.getUserServices);

export default router;
