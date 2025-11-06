export const calculateLineTotals = ({ unitPrice, quantity, taxRate = 0, discountRate = 0, discountAmount = 0 }) => {
  const base = Number(unitPrice) * quantity;
  const discount = discountAmount || base * Number(discountRate);
  const taxable = base - discount;
  const tax = taxable * Number(taxRate);
  const total = taxable + tax;
  return {
    base,
    discount,
    tax,
    total
  };
};

export const calculateOrderTotals = ({
  items,
  orderDiscount = 0,
  taxRate = 0
}) => {
  let subtotal = 0;
  let discountTotal = Number(orderDiscount);
  let taxTotal = 0;

  const enrichedItems = items.map((item) => {
    const line = calculateLineTotals(item);
    subtotal += line.base;
    discountTotal += line.discount - Number(item.discountAmount || 0);
    taxTotal += line.tax;
    return { ...item, ...line };
  });

  const total = subtotal - discountTotal + taxTotal;
  return {
    items: enrichedItems,
    subtotal,
    discountTotal,
    taxTotal,
    total
  };
};
