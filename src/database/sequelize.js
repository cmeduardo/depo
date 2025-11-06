import { Sequelize } from 'sequelize';
import { databaseConfig } from '../config/env.js';

const sequelize = new Sequelize(databaseConfig.url, {
  logging: databaseConfig.logging ? console.log : false,
  dialectOptions: databaseConfig.ssl
    ? { ssl: { require: true, rejectUnauthorized: false } }
    : {},
  pool: databaseConfig.pool
});

export default sequelize;
