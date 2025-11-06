import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth.js';
import {
  createOrderHandler,
  listOrders,
  getOrder,
  registerPaymentHandler,
  getReceipt
} from '../controllers/orderController.js';

const router = Router();

router.use(authenticate);

router.post('/', authorize(['admin', 'manager', 'cashier']), createOrderHandler);
router.get('/', authorize(['admin', 'manager']), listOrders);
router.get('/:id', authorize(['admin', 'manager', 'cashier']), getOrder);
router.post('/:id/payments', authorize(['admin', 'manager', 'cashier']), registerPaymentHandler);
router.get('/:id/receipt', authorize(['admin', 'manager', 'cashier']), getReceipt);

export default router;
