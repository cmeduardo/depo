import { DataTypes, Model } from 'sequelize';
import sequelize from '../database/sequelize.js';

class Customer extends Model {}

Customer.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      unique: true
    },
    phone: DataTypes.STRING,
    address: DataTypes.JSONB,
    marketingOptIn: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  },
  {
    sequelize,
    modelName: 'Customer',
    tableName: 'customers'
  }
);

export default Customer;
