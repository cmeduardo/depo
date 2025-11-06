import dotenv from 'dotenv';

const envFiles = [`.env.${process.env.NODE_ENV}`, '.env.local', '.env'];

envFiles.forEach((file) => dotenv.config({ path: file, override: false }));

export const appConfig = {
  env: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 4000,
  apiPrefix: process.env.API_PREFIX || '/api/v1'
};

export const databaseConfig = {
  url: process.env.DATABASE_URL,
  logging: process.env.DB_LOGGING === 'true',
  ssl: process.env.DB_SSL !== 'false',
  pool: {
    max: Number(process.env.DB_POOL_MAX || 10),
    min: Number(process.env.DB_POOL_MIN || 0),
    acquire: Number(process.env.DB_POOL_ACQUIRE || 20000),
    idle: Number(process.env.DB_POOL_IDLE || 10000)
  }
};

export const authConfig = {
  jwtSecret: process.env.JWT_SECRET || 'development-secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1h',
  oauthProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      redirectUri: process.env.GOOGLE_REDIRECT_URI
    }
  }
};

export const neonConfig = {
  alertWindowDays: Number(process.env.NEON_ALERT_WINDOW_DAYS || 5)
};

export const loyaltyConfig = {
  earnRate: Number(process.env.LOYALTY_EARN_RATE || 1),
  redeemRate: Number(process.env.LOYALTY_REDEEM_RATE || 100)
};

export default { appConfig, databaseConfig, authConfig, neonConfig, loyaltyConfig };
