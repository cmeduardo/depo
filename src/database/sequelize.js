import { Sequelize } from 'sequelize';
import { databaseConfig } from '../config/env.js';

if (!databaseConfig.url) {
  throw new Error(
    'DATABASE_URL is not defined. Copy .env.example to .env and provide a valid Neon connection string.'
  );
}

const sequelize = new Sequelize(databaseConfig.url, {
  logging: databaseConfig.logging ? console.log : false,
  dialectOptions: databaseConfig.ssl
    ? { ssl: { require: true, rejectUnauthorized: false } }
    : {},
  pool: databaseConfig.pool
});

export default sequelize;
