import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth.js';
import {
  listProducts,
  createProduct,
  updateProduct,
  listSuppliers,
  createSupplier,
  updateSupplier,
  linkProductSupplier,
  createLot,
  listLots,
  adjustLotStock,
  lowStockAlerts,
  expiringLots
} from '../controllers/inventoryController.js';

const router = Router();

router.use(authenticate);

router.get('/products', authorize(['admin', 'manager', 'cashier']), listProducts);
router.post('/products', authorize(['admin', 'manager']), createProduct);
router.put('/products/:id', authorize(['admin', 'manager']), updateProduct);
router.post('/products/:productId/suppliers', authorize(['admin', 'manager']), linkProductSupplier);

router.get('/suppliers', authorize(['admin', 'manager']), listSuppliers);
router.post('/suppliers', authorize(['admin', 'manager']), createSupplier);
router.put('/suppliers/:id', authorize(['admin', 'manager']), updateSupplier);

router.post('/lots', authorize(['admin', 'manager']), createLot);
router.get('/lots', authorize(['admin', 'manager']), listLots);
router.post('/products/:productId/lots/:lotId/adjust', authorize(['admin', 'manager']), adjustLotStock);

router.get('/alerts/low-stock', authorize(['admin', 'manager']), lowStockAlerts);
router.get('/alerts/expiring', authorize(['admin', 'manager']), expiringLots);

export default router;
