import { DataTypes, Model } from 'sequelize';
import sequelize from '../database/sequelize.js';

class StockMovement extends Model {}

StockMovement.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    productId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    inventoryLotId: {
      type: DataTypes.UUID,
      allowNull: true
    },
    type: {
      type: DataTypes.ENUM('in', 'out', 'adjustment', 'reservation'),
      allowNull: false
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    reason: DataTypes.STRING,
    reference: DataTypes.STRING,
    metadata: DataTypes.JSONB
  },
  {
    sequelize,
    modelName: 'StockMovement',
    tableName: 'stock_movements'
  }
);

export default StockMovement;
