import sequelize from '../database/sequelize.js';
import { InventoryLot, Order, OrderDetail, Payment, Product, StockMovement } from '../models/index.js';
import { calculateOrderTotals } from '../utils/pricing.js';
import { applyPromotions } from './promotionService.js';
import { processPayment } from '../integrations/paymentGateway.js';
import { redeemPoints, rewardPoints } from './loyaltyService.js';

export const createOrder = async ({ customerId, items, promotions = [], orderDiscount = 0, taxRate = 0, payment }) => {
  return sequelize.transaction(async (transaction) => {
    const dbItems = await Promise.all(items.map(async (item) => {
      const product = await Product.findByPk(item.productId, { transaction });
      if (!product) throw new Error('Product not found');
      return { ...item, unitPrice: item.unitPrice || product.defaultSalePrice || 0 };
    }));

    const promotedItems = await applyPromotions(dbItems, promotions, { transaction });
    const totals = calculateOrderTotals({ items: promotedItems, orderDiscount, taxRate });

    const order = await Order.create({
      customerId,
      status: 'pending',
      subtotal: totals.subtotal,
      taxTotal: totals.taxTotal,
      discountTotal: totals.discountTotal,
      total: totals.total
    }, { transaction });

    await Promise.all(totals.items.map(async (item) => {
      await OrderDetail.create({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        discount: item.discount,
        tax: item.tax,
        appliedPromotionId: item.appliedPromotionId
      }, { transaction });

      if (item.inventoryLotId) {
        await StockMovement.create({
          productId: item.productId,
          inventoryLotId: item.inventoryLotId,
          type: 'out',
          quantity: item.quantity,
          reason: 'order-fulfillment'
        }, { transaction });
        const lot = await InventoryLot.findByPk(item.inventoryLotId, { transaction });
        lot.quantity -= item.quantity;
        await lot.save({ transaction });
      }
    }));

    let loyalty;
    if (payment?.redeemPoints) {
      loyalty = await redeemPoints({ orderId: order.id, customerId, points: payment.redeemPoints, transaction });
      order.loyaltyPointsRedeemed = loyalty.redeemed;
    }
    loyalty = await rewardPoints({ orderId: order.id, customerId, amount: totals.total, transaction });
    order.loyaltyPointsEarned = loyalty.earned;
    await order.save({ transaction });

    if (payment) {
      const paymentResult = await processPayment({ ...payment, orderId: order.id, amount: totals.total }, transaction);
      await Payment.create({
        orderId: order.id,
        method: payment.method,
        amount: paymentResult.amount,
        status: paymentResult.status,
        transactionReference: paymentResult.reference,
        processedAt: new Date(),
        metadata: paymentResult.metadata
      }, { transaction });
      order.paymentStatus = paymentResult.status === 'captured' ? 'paid' : 'pending';
      order.status = paymentResult.status === 'captured' ? 'paid' : 'pending';
      await order.save({ transaction });
    }

    return { order, totals };
  });
};

export const registerPayment = async ({ orderId, payment }) => {
  return sequelize.transaction(async (transaction) => {
    const order = await Order.findByPk(orderId, { transaction });
    if (!order) throw new Error('Order not found');
    const paymentResult = await processPayment({ ...payment, orderId, amount: payment.amount }, transaction);
    await Payment.create({
      orderId,
      method: payment.method,
      amount: paymentResult.amount,
      status: paymentResult.status,
      transactionReference: paymentResult.reference,
      processedAt: new Date(),
      metadata: paymentResult.metadata
    }, { transaction });

    if (paymentResult.status === 'captured') {
      order.paymentStatus = 'paid';
      order.status = 'paid';
      await order.save({ transaction });
    }
    return paymentResult;
  });
};
