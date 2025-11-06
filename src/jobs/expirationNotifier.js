import cron from 'node-cron';
import { getExpiringLots } from '../services/inventoryService.js';
import logger from '../utils/logger.js';

export const scheduleExpirationNotifier = () => {
  return cron.schedule('0 7 * * *', async () => {
    const lots = await getExpiringLots();
    lots.forEach((lot) => {
      logger.warn('Inventory lot expiring soon', {
        productId: lot.productId,
        lotNumber: lot.lotNumber,
        expires: lot.expirationDate
      });
    });
  });
};
