import { DataTypes, Model } from 'sequelize';
import sequelize from '../database/sequelize.js';

class Payment extends Model {}

Payment.init(
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
    method: {
      type: DataTypes.STRING,
      allowNull: false
    },
    amount: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pending', 'authorized', 'captured', 'failed', 'refunded'),
      defaultValue: 'pending'
    },
    transactionReference: DataTypes.STRING,
    processedAt: DataTypes.DATE,
    metadata: DataTypes.JSONB
  },
  {
    sequelize,
    modelName: 'Payment',
    tableName: 'payments'
  }
);

export default Payment;
