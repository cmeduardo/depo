import { Router } from 'express';
import inventoryRoutes from './inventoryRoutes.js';
import orderRoutes from './orderRoutes.js';
import customerRoutes from './customerRoutes.js';
import reportRoutes from './reportRoutes.js';
import authRoutes from './authRoutes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/orders', orderRoutes);
router.use('/customers', customerRoutes);
router.use('/reports', reportRoutes);

export default router;
