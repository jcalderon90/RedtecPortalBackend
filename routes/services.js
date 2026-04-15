import express from 'express';
import * as serviceController from '../controllers/serviceController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Specific handlers that substitute n8n
router.get('/execute/facturas-sat', auth, serviceController.getFacturasSat);

// Generic route that proxies services based on serviceId
router.post('/execute/:serviceId', auth, serviceController.proxyService);
router.get('/execute/:serviceId', auth, serviceController.proxyService);

// Public execution for forms
router.post('/execute-public/:serviceId', serviceController.proxyService);

// Get authorized services for the current user's organization
router.get('/my-services', auth, serviceController.getUserServices);

// Get execution history for a service
router.get('/history/:serviceId', auth, serviceController.getHistory);

export default router;
