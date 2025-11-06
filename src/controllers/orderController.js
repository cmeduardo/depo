import { Order, OrderDetail, Payment } from '../models/index.js';
import { createOrder, registerPayment } from '../services/orderService.js';

export const createOrderHandler = async (req, res, next) => {
  try {
    const { order, totals } = await createOrder(req.body);
    res.status(201).json({ order, totals });
  } catch (error) {
    next(error);
  }
};

export const listOrders = async (req, res, next) => {
  try {
    const orders = await Order.findAll({ include: ['items', 'payments', 'loyaltyMovements'] });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

export const getOrder = async (req, res, next) => {
  try {
    const order = await Order.findByPk(req.params.id, { include: ['items', 'payments'] });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (error) {
    next(error);
  }
};

export const registerPaymentHandler = async (req, res, next) => {
  try {
    const result = await registerPayment({ orderId: req.params.id, payment: req.body });
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getReceipt = async (req, res, next) => {
  try {
    const order = await Order.findByPk(req.params.id, { include: [{ model: OrderDetail, as: 'items' }, { model: Payment, as: 'payments' }] });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json({
      order,
      payments: order.payments,
      items: order.items
    });
  } catch (error) {
    next(error);
  }
};
