import { DataTypes, Model } from 'sequelize';
import sequelize from '../database/sequelize.js';

class Supplier extends Model {}

Supplier.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    address: DataTypes.JSONB,
    paymentTerms: DataTypes.STRING,
    isPreferred: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  },
  {
    sequelize,
    modelName: 'Supplier',
    tableName: 'suppliers'
  }
);

export default Supplier;
