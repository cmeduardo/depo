import { DataTypes, Model } from 'sequelize';
import sequelize from '../database/sequelize.js';

class LoyaltyAccount extends Model {}

LoyaltyAccount.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    customerId: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true
    },
    pointsBalance: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    tier: {
      type: DataTypes.STRING,
      defaultValue: 'standard'
    },
    lastActivityAt: DataTypes.DATE
  },
  {
    sequelize,
    modelName: 'LoyaltyAccount',
    tableName: 'loyalty_accounts'
  }
);

export default LoyaltyAccount;
