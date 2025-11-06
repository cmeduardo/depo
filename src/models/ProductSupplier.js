import { DataTypes, Model } from 'sequelize';
import sequelize from '../database/sequelize.js';

class ProductSupplier extends Model {}

ProductSupplier.init(
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
    costPrice: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    leadTimeDays: DataTypes.INTEGER,
    minOrderQuantity: DataTypes.INTEGER
  },
  {
    sequelize,
    modelName: 'ProductSupplier',
    tableName: 'product_suppliers',
    indexes: [
      {
        unique: true,
        fields: ['productId', 'supplierId']
      }
    ]
  }
);

export default ProductSupplier;
