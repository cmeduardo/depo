import { calculateLineTotals, calculateOrderTotals } from '../src/utils/pricing.js';

describe('pricing utils', () => {
  test('calculateLineTotals applies tax and discount', () => {
    const result = calculateLineTotals({ unitPrice: 10, quantity: 2, taxRate: 0.1, discountRate: 0.2 });
    expect(result.base).toBe(20);
    expect(result.discount).toBeCloseTo(4);
    expect(result.tax).toBeCloseTo(1.6);
    expect(result.total).toBeCloseTo(17.6);
  });

  test('calculateOrderTotals aggregates lines', () => {
    const { subtotal, discountTotal, taxTotal, total } = calculateOrderTotals({
      items: [
        { unitPrice: 10, quantity: 1, taxRate: 0.1, discountRate: 0.1 },
        { unitPrice: 5, quantity: 2, taxRate: 0.05, discountAmount: 1 }
      ],
      orderDiscount: 2
    });
    expect(subtotal).toBe(20);
    expect(discountTotal).toBeGreaterThan(0);
    expect(taxTotal).toBeGreaterThan(0);
    expect(total).toBeLessThan(subtotal);
  });
});
