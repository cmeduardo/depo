import cron from 'node-cron';
import { Customer, LoyaltyAccount } from '../models/index.js';
import logger from '../utils/logger.js';

export const schedulePromotionalCampaigns = () => {
  return cron.schedule('0 9 * * MON', async () => {
    const customers = await Customer.findAll({ include: [{ model: LoyaltyAccount, as: 'loyaltyAccount' }] });
    customers.forEach((customer) => {
      logger.info('Send promotional campaign', {
        customerId: customer.id,
        email: customer.email,
        tier: customer.loyaltyAccount?.tier
      });
    });
  });
};
