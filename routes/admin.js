import express from 'express';
import * as adminController from '../controllers/adminController.js';
import { auth, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes here require being an 'admin'
router.use(auth, authorize('admin'));

// Organizations
router.get('/organizations', adminController.getOrganizations);
router.post('/organizations', adminController.createOrganization);
router.put('/organizations/:id', adminController.updateOrganization);

// Users
router.get('/users', adminController.getUsers);
router.post('/users', adminController.createUser);
router.put('/users/:id', adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);

// Services
router.get('/services', adminController.getServices);
router.post('/services', adminController.createService);
router.put('/services/:id', adminController.updateService);
router.delete('/services/:id', adminController.deleteService);

export default router;
