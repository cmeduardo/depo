import { DataTypes, Model } from 'sequelize';
import sequelize from '../database/sequelize.js';

class InventorySnapshot extends Model {}

InventorySnapshot.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    snapshotAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    productId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'InventorySnapshot',
    tableName: 'inventory_snapshots'
  }
);

export default InventorySnapshot;
