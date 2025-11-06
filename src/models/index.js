import sequelize from '../database/sequelize.js';
import Product from './Product.js';
import Supplier from './Supplier.js';
import ProductSupplier from './ProductSupplier.js';
import InventoryLot from './InventoryLot.js';
import StockMovement from './StockMovement.js';
import Order from './Order.js';
import OrderDetail from './OrderDetail.js';
import Payment from './Payment.js';
import Promotion from './Promotion.js';
import Customer from './Customer.js';
import LoyaltyAccount from './LoyaltyAccount.js';
import LoyaltyPointMovement from './LoyaltyPointMovement.js';
import AuditLog from './AuditLog.js';
import User from './User.js';
import InventorySnapshot from './InventorySnapshot.js';

// Product <-> Supplier many-to-many with pricing per supplier
Product.belongsToMany(Supplier, {
  through: ProductSupplier,
  foreignKey: 'productId',
  as: 'suppliers'
});
Supplier.belongsToMany(Product, {
  through: ProductSupplier,
  foreignKey: 'supplierId',
  as: 'products'
});
ProductSupplier.belongsTo(Product, { foreignKey: 'productId' });
ProductSupplier.belongsTo(Supplier, { foreignKey: 'supplierId' });

InventoryLot.belongsTo(Product, { foreignKey: 'productId' });
InventoryLot.belongsTo(Supplier, { foreignKey: 'supplierId' });
Product.hasMany(InventoryLot, { foreignKey: 'productId', as: 'inventoryLots' });
Supplier.hasMany(InventoryLot, { foreignKey: 'supplierId', as: 'inventoryLots' });

InventorySnapshot.belongsTo(Product, { foreignKey: 'productId' });
Product.hasMany(InventorySnapshot, { foreignKey: 'productId', as: 'inventorySnapshots' });

StockMovement.belongsTo(Product, { foreignKey: 'productId' });
StockMovement.belongsTo(InventoryLot, { foreignKey: 'inventoryLotId' });
Product.hasMany(StockMovement, { foreignKey: 'productId', as: 'stockMovements' });

Order.belongsTo(Customer, { foreignKey: 'customerId' });
Customer.hasMany(Order, { foreignKey: 'customerId', as: 'orders' });

OrderDetail.belongsTo(Order, { foreignKey: 'orderId' });
OrderDetail.belongsTo(Product, { foreignKey: 'productId' });
Order.hasMany(OrderDetail, { foreignKey: 'orderId', as: 'items' });
Product.hasMany(OrderDetail, { foreignKey: 'productId', as: 'orderDetails' });

Payment.belongsTo(Order, { foreignKey: 'orderId' });
Order.hasMany(Payment, { foreignKey: 'orderId', as: 'payments' });

Promotion.hasMany(OrderDetail, { foreignKey: 'appliedPromotionId', as: 'lineItems' });
OrderDetail.belongsTo(Promotion, { foreignKey: 'appliedPromotionId', as: 'promotion' });

LoyaltyAccount.belongsTo(Customer, { foreignKey: 'customerId' });
Customer.hasOne(LoyaltyAccount, { foreignKey: 'customerId', as: 'loyaltyAccount' });

LoyaltyPointMovement.belongsTo(LoyaltyAccount, { foreignKey: 'loyaltyAccountId' });
LoyaltyAccount.hasMany(LoyaltyPointMovement, {
  foreignKey: 'loyaltyAccountId',
  as: 'movements'
});

LoyaltyPointMovement.belongsTo(Order, { foreignKey: 'orderId' });
Order.hasMany(LoyaltyPointMovement, { foreignKey: 'orderId', as: 'loyaltyMovements' });

AuditLog.belongsTo(User, { foreignKey: 'actorId', as: 'actor' });

export {
  sequelize,
  Product,
  Supplier,
  ProductSupplier,
  InventoryLot,
  StockMovement,
  Order,
  OrderDetail,
  Payment,
  Promotion,
  Customer,
  LoyaltyAccount,
  LoyaltyPointMovement,
  AuditLog,
  User,
  InventorySnapshot
};
