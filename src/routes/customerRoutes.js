import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth.js';
import {
  registerCustomerHandler,
  updateCustomerHandler,
  getCustomerHandler,
  getCustomerPoints
} from '../controllers/customerController.js';

const router = Router();

router.use(authenticate);

router.post('/', authorize(['admin', 'manager', 'cashier']), registerCustomerHandler);
router.put('/:id', authorize(['admin', 'manager', 'cashier']), updateCustomerHandler);
router.get('/:id', authorize(['admin', 'manager', 'cashier']), getCustomerHandler);
router.get('/:id/points', authorize(['admin', 'manager', 'cashier']), getCustomerPoints);

export default router;
