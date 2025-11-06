import { DataTypes, Model } from 'sequelize';
import sequelize from '../database/sequelize.js';

class Product extends Model {}

Product.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    sku: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    barcode: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: DataTypes.TEXT,
    category: DataTypes.STRING,
    unitOfMeasure: {
      type: DataTypes.STRING,
      defaultValue: 'unit'
    },
    defaultSalePrice: {
      type: DataTypes.DECIMAL,
      defaultValue: 0
    },
    reorderLevel: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  },
  {
    sequelize,
    modelName: 'Product',
    tableName: 'products'
  }
);

export default Product;
