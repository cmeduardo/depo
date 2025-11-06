import { LoyaltyAccount, LoyaltyPointMovement } from '../models/index.js';
import { getCustomerWithLoyalty, registerCustomer, updateCustomerProfile } from '../services/customerService.js';

export const registerCustomerHandler = async (req, res, next) => {
  try {
    const customer = await registerCustomer(req.body);
    res.status(201).json(customer);
  } catch (error) {
    next(error);
  }
};

export const updateCustomerHandler = async (req, res, next) => {
  try {
    const customer = await updateCustomerProfile(req.params.id, req.body);
    res.json(customer);
  } catch (error) {
    next(error);
  }
};

export const getCustomerHandler = async (req, res, next) => {
  try {
    const customer = await getCustomerWithLoyalty(req.params.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    res.json(customer);
  } catch (error) {
    next(error);
  }
};

export const getCustomerPoints = async (req, res, next) => {
  try {
    const account = await LoyaltyAccount.findOne({
      where: { customerId: req.params.id },
      include: [{ model: LoyaltyPointMovement, as: 'movements' }]
    });
    if (!account) return res.status(404).json({ message: 'Account not found' });
    res.json(account);
  } catch (error) {
    next(error);
  }
};
