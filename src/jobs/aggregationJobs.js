import cron from 'node-cron';
import sequelize from '../database/sequelize.js';
import logger from '../utils/logger.js';

const createMaterializedViews = async () => {
  await sequelize.query('CREATE EXTENSION IF NOT EXISTS pgcrypto;');
  await sequelize.query(`CREATE TABLE IF NOT EXISTS inventory_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "snapshotAt" TIMESTAMP WITH TIME ZONE NOT NULL,
    "productId" UUID NOT NULL,
    quantity INTEGER NOT NULL
  );`);
  await sequelize.query(`CREATE MATERIALIZED VIEW IF NOT EXISTS mv_daily_sales AS
    SELECT DATE_TRUNC('day', "placedAt") AS day,
           SUM(total) AS total_sales,
           COUNT(*) AS orders
    FROM orders
    GROUP BY 1;
  `);
};

const refreshMaterializedViews = async () => {
  await sequelize.query('REFRESH MATERIALIZED VIEW CONCURRENTLY mv_daily_sales;');
};

const snapshotInventory = async () => {
  await sequelize.query(`INSERT INTO inventory_snapshots ("snapshotAt", "productId", quantity)
    SELECT NOW(), "productId", SUM(quantity)
    FROM inventory_lots
    GROUP BY "productId";`);
};

export const scheduleAggregationJobs = () => {
  return {
    init: cron.schedule('0 3 * * *', async () => {
      await createMaterializedViews();
      await refreshMaterializedViews();
      await snapshotInventory();
      logger.info('Aggregation jobs executed');
    }),
    weekly: cron.schedule('0 4 * * MON', async () => {
      await refreshMaterializedViews();
      logger.info('Weekly materialized view refresh completed');
    })
  };
};
