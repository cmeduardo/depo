import { DataTypes, Model } from 'sequelize';
import sequelize from '../database/sequelize.js';

class AuditLog extends Model {}

AuditLog.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    actorId: DataTypes.UUID,
    actorType: DataTypes.STRING,
    action: {
      type: DataTypes.STRING,
      allowNull: false
    },
    entity: DataTypes.STRING,
    entityId: DataTypes.UUID,
    metadata: DataTypes.JSONB
  },
  {
    sequelize,
    modelName: 'AuditLog',
    tableName: 'audit_logs'
  }
);

export default AuditLog;
