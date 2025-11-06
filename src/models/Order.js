import { DataTypes, Model } from 'sequelize';
import sequelize from '../database/sequelize.js';

class Order extends Model {}

Order.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    customerId: {
      type: DataTypes.UUID,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('draft', 'pending', 'paid', 'cancelled', 'refunded'),
      defaultValue: 'pending'
    },
    subtotal: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    taxTotal: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    discountTotal: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    total: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    loyaltyPointsEarned: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    loyaltyPointsRedeemed: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    paymentStatus: {
      type: DataTypes.ENUM('unpaid', 'partial', 'paid', 'refunded'),
      defaultValue: 'unpaid'
    },
    placedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  },
  {
    sequelize,
    modelName: 'Order',
    tableName: 'orders'
  }
);

export default Order;
