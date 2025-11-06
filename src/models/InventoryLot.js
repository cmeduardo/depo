import { DataTypes, Model } from 'sequelize';
import sequelize from '../database/sequelize.js';

class InventoryLot extends Model {}

InventoryLot.init(
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
    supplierId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    lotNumber: {
      type: DataTypes.STRING,
      allowNull: false
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    reservedQuantity: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    costPerUnit: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    receivedAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    expirationDate: DataTypes.DATE,
    status: {
      type: DataTypes.ENUM('available', 'reserved', 'sold', 'expired', 'quarantined'),
      defaultValue: 'available'
    }
  },
  {
    sequelize,
    modelName: 'InventoryLot',
    tableName: 'inventory_lots'
  }
);

export default InventoryLot;
