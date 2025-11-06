import { AuditLog } from '../models/index.js';

export const audit = (action, entityResolver) => async (req, res, next) => {
  const originalJson = res.json.bind(res);
  res.json = async (body) => {
    try {
      const entityData = typeof entityResolver === 'function' ? entityResolver(req, body) : {};
      await AuditLog.create({
        actorId: req.user?.id,
        actorType: 'user',
        action,
        entity: entityData.entity,
        entityId: entityData.entityId,
        metadata: {
          path: req.path,
          method: req.method,
          requestBody: req.body,
          response: body
        }
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Audit log error', error);
    }
    return originalJson(body);
  };
  return next();
};
