# Depo Supermarket Backend

Backend modular para un supermercado utilizando Node.js, Express, Sequelize y PostgreSQL (Neon).

## Características principales

- Gestión integral de inventario con productos, proveedores, costos por proveedor, lotes y movimientos de stock.
- Flujo de ventas y checkout con órdenes, pagos, promociones, cálculo de impuestos/descuentos y actualización transaccional del inventario.
- Gestión de clientes y programa de lealtad con puntos, redenciones y campañas programadas.
- Reportes y analítica con consultas optimizadas, vistas materializadas y exportadores CSV/JSON.
- Seguridad con JWT, RBAC, auditoría de acciones e integraciones externas mediante webhooks.

## Estructura del proyecto

```
├── package.json
├── src
│   ├── app.js
│   ├── server.js
│   ├── config
│   │   └── env.js
│   ├── controllers
│   ├── database
│   │   └── sequelize.js
│   ├── integrations
│   ├── jobs
│   ├── middlewares
│   ├── models
│   ├── reporting
│   ├── routes
│   ├── services
│   └── utils
└── __tests__
```

## Modelos y esquema de base de datos

| Modelo | Tabla | Campos clave |
| --- | --- | --- |
| Product | products | id, sku, barcode, name, unitOfMeasure, defaultSalePrice, reorderLevel |
| Supplier | suppliers | id, name, email, phone, paymentTerms |
| ProductSupplier | product_suppliers | productId, supplierId, costPrice, leadTimeDays |
| InventoryLot | inventory_lots | productId, supplierId, lotNumber, quantity, costPerUnit, expirationDate |
| StockMovement | stock_movements | productId, inventoryLotId, type, quantity, reason |
| Order | orders | customerId, status, subtotal, taxTotal, discountTotal, total, placedAt |
| OrderDetail | order_details | orderId, productId, quantity, unitPrice, discount, tax |
| Payment | payments | orderId, method, amount, status, transactionReference |
| Promotion | promotions | code, type, value, criteria, startDate, endDate |
| Customer | customers | firstName, lastName, email, phone |
| LoyaltyAccount | loyalty_accounts | customerId, pointsBalance, tier |
| LoyaltyPointMovement | loyalty_point_movements | loyaltyAccountId, orderId, type, points |
| InventorySnapshot | inventory_snapshots | snapshotAt, productId, quantity |
| AuditLog | audit_logs | actorId, action, entity, entityId, metadata |
| User | users | email, passwordHash, role |

Relaciones destacadas:

- Productos y proveedores tienen relación muchos-a-muchos mediante `product_suppliers` para manejar múltiples costos y condiciones.
- Los lotes de inventario (`inventory_lots`) registran proveedor y precio unitario asociado.
- Movimientos de stock (`stock_movements`) registran entradas, salidas y ajustes por lote.
- Órdenes tienen múltiples detalles, pagos y movimientos de lealtad asociados.
- Las cuentas de lealtad se crean automáticamente para cada cliente registrado.

## Endpoints principales

| Módulo | Ruta | Descripción |
| --- | --- | --- |
| Auth | `POST /api/v1/auth/login` | Iniciar sesión JWT |
| Auth | `POST /api/v1/auth/register` | Crear usuario administrativo |
| Inventario | `GET /api/v1/inventory/products` | Listar productos con lotes y proveedores |
| Inventario | `POST /api/v1/inventory/products` | Crear producto |
| Inventario | `POST /api/v1/inventory/products/:productId/suppliers` | Asociar proveedor con precio |
| Inventario | `POST /api/v1/inventory/lots` | Crear lote de inventario |
| Inventario | `POST /api/v1/inventory/products/:productId/lots/:lotId/adjust` | Ajustar stock por lote |
| Inventario | `GET /api/v1/inventory/alerts/expiring` | Lotes próximos a vencer |
| Ventas | `POST /api/v1/orders` | Crear orden y checkout con pago |
| Ventas | `POST /api/v1/orders/:id/payments` | Registrar pago adicional |
| Ventas | `GET /api/v1/orders/:id/receipt` | Obtener comprobante |
| Clientes | `POST /api/v1/customers` | Registrar cliente y cuenta de lealtad |
| Clientes | `GET /api/v1/customers/:id/points` | Consultar saldo y movimientos |
| Reportes | `GET /api/v1/reports/sales` | Reporte de ventas diario (CSV/JSON) |
| Reportes | `GET /api/v1/reports/inventory` | Reporte de inventario |

## Servicios y lógica clave

- `inventoryService` maneja recepciones, ajustes y alertas de inventario.
- `orderService` procesa órdenes, aplica promociones, integra pasarela de pago y descuenta inventario en transacciones atómicas.
- `loyaltyService` acredita/redime puntos durante checkout.
- `reportService` ejecuta consultas SQL optimizadas y aprovecha vistas materializadas en Neon.
- `paymentGateway` permite intercambiar adaptadores de pasarela (mock por defecto).
- `webhooks` publica eventos hacia proveedores y POS externos.

## Tareas programadas

- `scheduleExpirationNotifier`: notifica diariamente lotes próximos a caducar consultando Neon.
- `schedulePromotionalCampaigns`: genera campañas personalizadas cada lunes a partir del perfil de lealtad.
- `scheduleAggregationJobs`: crea/actualiza vistas materializadas y snapshots históricos diarios/semanales.
- Ejecutar `npm run jobs` para iniciar los schedulers en un proceso separado.

## Configuración

Variables de entorno sugeridas (`.env`):

```
NODE_ENV=development
PORT=4000
API_PREFIX=/api/v1
DATABASE_URL=postgres://usuario:password@host.neon.tech/db?sslmode=require
DB_LOGGING=false
DB_SSL=true
JWT_SECRET=cambia-esto
JWT_EXPIRES_IN=2h
PAYMENT_GATEWAY_URL=
NEON_ALERT_WINDOW_DAYS=5
LOYALTY_EARN_RATE=0.05
LOYALTY_REDEEM_RATE=100
```

### Conexión a Neon

1. Crear base en [Neon](https://neon.tech) y obtener la cadena `postgres://` con SSL habilitado.
2. Asignar la cadena a `DATABASE_URL`.
3. Neon requiere SSL, por lo que `DB_SSL` debe permanecer en `true` (por defecto).
4. Habilitar la extensión `pgcrypto` (o `uuid-ossp`) para soportar generación de UUIDs en tareas de agregación.

### Scripts npm relevantes

- `npm run dev`: Inicia servidor con nodemon.
- `npm start`: Inicia servidor en producción.
- `npm test`: Ejecuta pruebas unitarias con Jest.
- `npm run lint`: Ejecuta ESLint con configuración Standard.
- `npm run db:migrate`: Ejecuta migraciones con `sequelize-cli`.
- `npm run db:seed`: Ejecuta seeds de datos.
- `npm run jobs`: Lanza los cron jobs de forma independiente.

## Migraciones iniciales

Usar `sequelize-cli` para generar las tablas (los modelos definen el esquema). Ejemplo:

```
npx sequelize-cli model:generate --name Product --attributes sku:string,barcode:string,name:string,description:text,category:string,unitOfMeasure:string,defaultSalePrice:decimal,reorderLevel:integer,isActive:boolean
```

Repetir para cada modelo o construir migraciones personalizadas para crear vistas materializadas y la tabla `inventory_snapshots`.

## Pruebas

Ejecutar:

```
npm test
```

Incluye pruebas unitarias básicas para los cálculos de precios y descuentos.

## Auditoría y seguridad

- Middleware `authenticate` valida JWT y carga el usuario.
- Middleware `authorize` controla acceso por roles (`admin`, `manager`, `cashier`, `viewer`).
- Middleware `audit` registra acciones en la tabla `audit_logs` con esquema append-only.

## Integraciones externas

- `integrations/paymentGateway` permite conectar con una pasarela real (definir `PAYMENT_GATEWAY_URL`).
- `integrations/webhooks` provee utilidades para notificar proveedores o POS.

## Notas adicionales

- Para ambientes de prueba se puede usar una base Neon rama `branch` dedicada.
- `sequelize.sync()` se usa para desarrollo; en producción usar migraciones.
- Ajustar índices y políticas RBAC a nivel de base según necesidades regulatorias.
