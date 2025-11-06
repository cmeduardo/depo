import sequelize from '../database/sequelize.js';

export const salesSummary = async ({ from, to }) => {
  const [results] = await sequelize.query(
    `SELECT DATE_TRUNC('day', "placedAt") AS day, SUM(total) AS total_sales, COUNT(*) AS order_count
     FROM orders
     WHERE "placedAt" BETWEEN :from AND :to
     GROUP BY 1
     ORDER BY 1`,
    {
      replacements: { from, to }
    }
  );
  return results;
};

export const inventorySnapshot = async () => {
  const [results] = await sequelize.query(
    `SELECT p.id, p.name, SUM(l.quantity) AS quantity
     FROM products p
     LEFT JOIN inventory_lots l ON l."productId" = p.id
     GROUP BY p.id, p.name`
  );
  return results;
};

export const customerBehavior = async ({ from, to }) => {
  const [results] = await sequelize.query(
    `SELECT c.id, c.email, COUNT(o.id) AS orders, SUM(o.total) AS total_spent
     FROM customers c
     LEFT JOIN orders o ON o."customerId" = c.id AND o."placedAt" BETWEEN :from AND :to
     GROUP BY c.id, c.email`,
    { replacements: { from, to } }
  );
  return results;
};
