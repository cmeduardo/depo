import { DataTypes, Model } from 'sequelize';
import sequelize from '../database/sequelize.js';

class LoyaltyPointMovement extends Model {}

LoyaltyPointMovement.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    loyaltyAccountId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    orderId: {
      type: DataTypes.UUID,
      allowNull: true
    },
    type: {
      type: DataTypes.ENUM('earn', 'redeem', 'adjust'),
      allowNull: false
    },
    points: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    reason: DataTypes.STRING
  },
  {
    sequelize,
    modelName: 'LoyaltyPointMovement',
    tableName: 'loyalty_point_movements'
  }
);

export default LoyaltyPointMovement;
