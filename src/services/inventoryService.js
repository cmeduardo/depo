import { Op } from 'sequelize';
import { InventoryLot, Product, ProductSupplier, StockMovement } from '../models/index.js';
import { neonConfig } from '../config/env.js';

export const createOrUpdateLot = async (payload) => {
  const lot = await InventoryLot.create(payload);
  await StockMovement.create({
    productId: lot.productId,
    inventoryLotId: lot.id,
    type: 'in',
    quantity: lot.quantity,
    reason: 'lot-received'
  });
  return lot;
};

export const adjustStock = async ({ productId, inventoryLotId, quantity, type, reason, transaction }) => {
  const lot = await InventoryLot.findByPk(inventoryLotId, { transaction });
  if (!lot) {
    throw new Error('Inventory lot not found');
  }
  let newQuantity = lot.quantity;
  if (type === 'out' || type === 'reservation') {
    if (lot.quantity < quantity) {
      throw new Error('Insufficient stock in lot');
    }
    newQuantity -= quantity;
  } else if (type === 'in') {
    newQuantity += quantity;
  } else if (type === 'adjustment') {
    newQuantity = quantity;
  }
  lot.quantity = newQuantity;
  await lot.save({ transaction });
  await StockMovement.create({
    productId,
    inventoryLotId,
    type,
    quantity,
    reason
  }, { transaction });
  return lot;
};

export const replenishProduct = async ({ productId, supplierId, quantity, costPerUnit, lotNumber, expirationDate }) => {
  return createOrUpdateLot({
    productId,
    supplierId,
    quantity,
    lotNumber,
    costPerUnit,
    receivedAt: new Date(),
    expirationDate
  });
};

export const getLowStockProducts = async () => {
  const products = await Product.findAll({
    include: [{
      model: InventoryLot,
      as: 'inventoryLots'
    }]
  });
  return products.filter((product) => {
    const total = product.inventoryLots.reduce((sum, lot) => sum + lot.quantity, 0);
    return total <= product.reorderLevel;
  });
};

export const getExpiringLots = async () => {
  const threshold = new Date();
  threshold.setDate(threshold.getDate() + neonConfig.alertWindowDays);
  return InventoryLot.findAll({
    where: {
      expirationDate: {
        [Op.lte]: threshold
      },
      status: {
        [Op.not]: 'expired'
      }
    },
    include: [Product]
  });
};

export const upsertProductSupplier = async ({ productId, supplierId, costPrice, leadTimeDays, minOrderQuantity }) => {
  const [record] = await ProductSupplier.upsert({
    productId,
    supplierId,
    costPrice,
    leadTimeDays,
    minOrderQuantity
  });
  return record;
};
