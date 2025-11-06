import { DataTypes, Model } from 'sequelize';
import sequelize from '../database/sequelize.js';

class Promotion extends Model {}

Promotion.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: DataTypes.TEXT,
    type: {
      type: DataTypes.ENUM('percentage', 'fixed', 'bogo'),
      allowNull: false
    },
    value: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    criteria: DataTypes.JSONB,
    startDate: DataTypes.DATE,
    endDate: DataTypes.DATE,
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  },
  {
    sequelize,
    modelName: 'Promotion',
    tableName: 'promotions'
  }
);

export default Promotion;
