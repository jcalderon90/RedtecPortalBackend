import express from 'express';
import * as serviceController from '../controllers/serviceController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Logging middleware for debugging (Solo para desarrollo/debug)
router.use('/execute/:serviceId', (req, res, next) => {
    console.log(`[DEBUG] Request for service: ${req.params.serviceId} | Method: ${req.method} | Path: ${req.path}`);
    next();
});

// 1. Handlers específicos (DEBEN IR PRIMERO)
router.get('/execute/facturas-sat', auth, (req, res, next) => {
    console.log('[DEBUG] Matched specific route: /execute/facturas-sat');
    serviceController.getFacturasSat(req, res, next);
});

// 2. Rutas genéricas
router.post('/execute/:serviceId', auth, serviceController.proxyService);
router.get('/execute/:serviceId', auth, serviceController.proxyService);

// Public execution for forms
router.post('/execute-public/:serviceId', serviceController.proxyService);

// Get authorized services for the current user's organization
router.get('/my-services', auth, serviceController.getUserServices);

// Get execution history for a service
router.get('/history/:serviceId', auth, serviceController.getHistory);

export default router;
