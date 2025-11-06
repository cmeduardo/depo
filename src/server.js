import app from './app.js';
import { appConfig } from './config/env.js';
import { sequelize } from './models/index.js';
import logger from './utils/logger.js';

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    app.listen(appConfig.port, () => {
      logger.info(`Server listening on port ${appConfig.port}`);
    });
  } catch (error) {
    logger.error('Failed to start server', error);
    process.exit(1);
  }
};

start();
