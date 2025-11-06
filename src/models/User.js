import { DataTypes, Model } from 'sequelize';
import sequelize from '../database/sequelize.js';

class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false
    },
    fullName: DataTypes.STRING,
    role: {
      type: DataTypes.ENUM('admin', 'manager', 'cashier', 'viewer'),
      defaultValue: 'viewer'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users'
  }
);

export default User;
