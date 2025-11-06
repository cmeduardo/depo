import { Customer, LoyaltyAccount } from '../models/index.js';

export const registerCustomer = async (payload) => {
  const customer = await Customer.create(payload);
  await LoyaltyAccount.findOrCreate({ where: { customerId: customer.id } });
  return customer;
};

export const updateCustomerProfile = async (customerId, payload) => {
  const customer = await Customer.findByPk(customerId);
  if (!customer) throw new Error('Customer not found');
  return customer.update(payload);
};

export const getCustomerWithLoyalty = async (customerId) => {
  return Customer.findByPk(customerId, {
    include: [{ model: LoyaltyAccount, as: 'loyaltyAccount' }]
  });
};
