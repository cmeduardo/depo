import { LoyaltyAccount, LoyaltyPointMovement } from '../models/index.js';
import { loyaltyConfig } from '../config/env.js';

export const ensureAccount = async (customerId, transaction) => {
  const [account] = await LoyaltyAccount.findOrCreate({
    where: { customerId },
    defaults: { customerId },
    transaction
  });
  return account;
};

export const rewardPoints = async ({ orderId, customerId, amount, transaction }) => {
  if (!customerId) {
    return { earned: 0 };
  }
  const account = await ensureAccount(customerId, transaction);
  const earned = Math.floor(Number(amount) * loyaltyConfig.earnRate);
  account.pointsBalance += earned;
  account.lastActivityAt = new Date();
  await account.save({ transaction });
  await LoyaltyPointMovement.create({
    loyaltyAccountId: account.id,
    orderId,
    type: 'earn',
    points: earned,
    reason: 'order'
  }, { transaction });
  return { account, earned };
};

export const redeemPoints = async ({ orderId, customerId, points, transaction }) => {
  if (!customerId || !points) {
    return { redeemed: 0 };
  }
  const account = await ensureAccount(customerId, transaction);
  if (account.pointsBalance < points) {
    throw new Error('Insufficient loyalty points');
  }
  account.pointsBalance -= points;
  account.lastActivityAt = new Date();
  await account.save({ transaction });
  await LoyaltyPointMovement.create({
    loyaltyAccountId: account.id,
    orderId,
    type: 'redeem',
    points,
    reason: 'order'
  }, { transaction });
  return { account, redeemed: points };
};
