import { Product, Supplier, InventoryLot } from '../models/index.js';
import { adjustStock, createOrUpdateLot, getExpiringLots, getLowStockProducts, upsertProductSupplier } from '../services/inventoryService.js';

export const listProducts = async (req, res, next) => {
  try {
    const products = await Product.findAll({ include: ['inventoryLots', 'suppliers'] });
    res.json(products);
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    await product.update(req.body);
    res.json(product);
  } catch (error) {
    next(error);
  }
};

export const listSuppliers = async (req, res, next) => {
  try {
    const suppliers = await Supplier.findAll({ include: ['products'] });
    res.json(suppliers);
  } catch (error) {
    next(error);
  }
};

export const createSupplier = async (req, res, next) => {
  try {
    const supplier = await Supplier.create(req.body);
    res.status(201).json(supplier);
  } catch (error) {
    next(error);
  }
};

export const updateSupplier = async (req, res, next) => {
  try {
    const supplier = await Supplier.findByPk(req.params.id);
    if (!supplier) return res.status(404).json({ message: 'Supplier not found' });
    await supplier.update(req.body);
    res.json(supplier);
  } catch (error) {
    next(error);
  }
};

export const linkProductSupplier = async (req, res, next) => {
  try {
    const record = await upsertProductSupplier({ ...req.body, productId: req.params.productId });
    res.status(201).json(record);
  } catch (error) {
    next(error);
  }
};

export const createLot = async (req, res, next) => {
  try {
    const lot = await createOrUpdateLot(req.body);
    res.status(201).json(lot);
  } catch (error) {
    next(error);
  }
};

export const listLots = async (req, res, next) => {
  try {
    const lots = await InventoryLot.findAll({ include: [Product, Supplier] });
    res.json(lots);
  } catch (error) {
    next(error);
  }
};

export const adjustLotStock = async (req, res, next) => {
  try {
    const updated = await adjustStock({ ...req.body, productId: req.params.productId, inventoryLotId: req.params.lotId });
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

export const lowStockAlerts = async (req, res, next) => {
  try {
    const products = await getLowStockProducts();
    res.json(products);
  } catch (error) {
    next(error);
  }
};

export const expiringLots = async (req, res, next) => {
  try {
    const lots = await getExpiringLots();
    res.json(lots);
  } catch (error) {
    next(error);
  }
};
