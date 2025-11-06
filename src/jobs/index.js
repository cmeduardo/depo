import sequelize from '../database/sequelize.js';
import { scheduleExpirationNotifier } from './expirationNotifier.js';
import { schedulePromotionalCampaigns } from './promotionalCampaignScheduler.js';
import { scheduleAggregationJobs } from './aggregationJobs.js';
import logger from '../utils/logger.js';

(async () => {
  try {
    await sequelize.authenticate();
    logger.info('Database connection established for job runner');
    scheduleExpirationNotifier();
    schedulePromotionalCampaigns();
    scheduleAggregationJobs();
  } catch (error) {
    logger.error('Job runner failed to start', error);
    process.exit(1);
  }
})();
