import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth.js';
import { customerReport, inventoryReport, salesReport } from '../controllers/reportController.js';

const router = Router();

router.use(authenticate, authorize(['admin', 'manager']));

router.get('/sales', salesReport);
router.get('/inventory', inventoryReport);
router.get('/customers', customerReport);

export default router;
