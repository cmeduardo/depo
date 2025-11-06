import { DataTypes, Model } from 'sequelize';
import sequelize from '../database/sequelize.js';

class OrderDetail extends Model {}

OrderDetail.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    orderId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    productId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    unitPrice: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    discount: {
      type: DataTypes.DECIMAL,
      defaultValue: 0
    },
    tax: {
      type: DataTypes.DECIMAL,
      defaultValue: 0
    },
    appliedPromotionId: {
      type: DataTypes.UUID,
      allowNull: true
    }
  },
  {
    sequelize,
    modelName: 'OrderDetail',
    tableName: 'order_details'
  }
);

export default OrderDetail;
