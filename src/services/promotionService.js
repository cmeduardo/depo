import { Promotion } from '../models/index.js';

export const fetchActivePromotions = async (codes = [], transaction) => {
  const where = { isActive: true };
  if (codes.length) {
    where.code = codes;
  }
  return Promotion.findAll({ where, transaction });
};

export const applyPromotions = async (items, promotionCodes = [], { transaction } = {}) => {
  if (!promotionCodes.length) return items;
  const promotions = await fetchActivePromotions(promotionCodes, transaction);
  return items.map((item) => {
    const promo = promotions.find((p) => p.criteria?.productIds?.includes?.(item.productId));
    if (!promo) return item;
    let discount = 0;
    if (promo.type === 'percentage') {
      discount = Number(item.unitPrice) * item.quantity * Number(promo.value) / 100;
    } else if (promo.type === 'fixed') {
      discount = Number(promo.value);
    }
    return {
      ...item,
      discountAmount: discount,
      appliedPromotionId: promo.id
    };
  });
};
