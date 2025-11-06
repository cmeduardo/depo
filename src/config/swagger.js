import { appConfig } from './env.js';

const swaggerDocument = {
  openapi: '3.0.1',
  info: {
    title: 'Depo Supermarket API',
    version: '1.0.0',
    description:
      'REST API for supermarket operations including inventory, sales, loyalty, reporting, and integrations. All secured endpoints require a JWT bearer token unless noted otherwise.'
  },
  servers: [
    {
      url: appConfig.apiPrefix,
      description: `${appConfig.env} base path`
    }
  ],
  tags: [
    { name: 'Auth', description: 'Authentication and user provisioning' },
    { name: 'Inventory', description: 'Product catalog, suppliers, and stock management' },
    { name: 'Orders', description: 'Checkout flow, payments, and receipts' },
    { name: 'Customers', description: 'Customer profiles and loyalty accounts' },
    { name: 'Reports', description: 'Operational and analytical reports' }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    },
    schemas: {
      ErrorResponse: {
        type: 'object',
        properties: {
          message: { type: 'string' }
        }
      },
      LoginRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string', format: 'password' }
        }
      },
      LoginResponse: {
        type: 'object',
        properties: {
          token: { type: 'string', description: 'JWT access token' },
          user: { $ref: '#/components/schemas/User' }
        }
      },
      RegisterUserRequest: {
        type: 'object',
        required: ['email', 'password', 'role'],
        properties: {
          name: { type: 'string' },
          email: { type: 'string', format: 'email' },
          password: { type: 'string', format: 'password' },
          role: {
            type: 'string',
            enum: ['admin', 'manager', 'cashier', 'auditor']
          }
        }
      },
      User: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string' },
          email: { type: 'string', format: 'email' },
          role: { type: 'string' }
        }
      },
      Product: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          sku: { type: 'string' },
          barcode: { type: 'string' },
          name: { type: 'string' },
          description: { type: 'string' },
          category: { type: 'string' },
          unitOfMeasure: { type: 'string' },
          defaultSalePrice: { type: 'number', format: 'double' },
          reorderLevel: { type: 'integer' },
          isActive: { type: 'boolean' },
          inventoryLots: {
            type: 'array',
            items: { $ref: '#/components/schemas/InventoryLot' }
          },
          suppliers: {
            type: 'array',
            items: { $ref: '#/components/schemas/Supplier' }
          }
        }
      },
      ProductInput: {
        type: 'object',
        required: ['sku', 'name', 'defaultSalePrice'],
        properties: {
          sku: { type: 'string' },
          barcode: { type: 'string' },
          name: { type: 'string' },
          description: { type: 'string' },
          category: { type: 'string' },
          unitOfMeasure: { type: 'string', example: 'unit' },
          defaultSalePrice: { type: 'number', format: 'double' },
          reorderLevel: { type: 'integer', example: 10 },
          isActive: { type: 'boolean', default: true }
        }
      },
      Supplier: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string' },
          taxId: { type: 'string' },
          contactName: { type: 'string' },
          contactEmail: { type: 'string', format: 'email' },
          contactPhone: { type: 'string' },
          address: { type: 'string' },
          isPreferred: { type: 'boolean' }
        }
      },
      SupplierInput: {
        type: 'object',
        required: ['name'],
        properties: {
          name: { type: 'string' },
          taxId: { type: 'string' },
          contactName: { type: 'string' },
          contactEmail: { type: 'string', format: 'email' },
          contactPhone: { type: 'string' },
          address: { type: 'string' },
          isPreferred: { type: 'boolean' }
        }
      },
      ProductSupplierLink: {
        type: 'object',
        required: ['supplierId', 'price'],
        properties: {
          supplierId: { type: 'string', format: 'uuid' },
          price: { type: 'number', format: 'double' },
          leadTimeDays: { type: 'integer', example: 3 },
          preferred: { type: 'boolean', default: false }
        }
      },
      InventoryLot: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          productId: { type: 'string', format: 'uuid' },
          supplierId: { type: 'string', format: 'uuid' },
          quantity: { type: 'integer' },
          cost: { type: 'number', format: 'double' },
          receivedAt: { type: 'string', format: 'date-time' },
          expiresAt: { type: 'string', format: 'date-time' }
        }
      },
      InventoryLotInput: {
        type: 'object',
        required: ['productId', 'quantity', 'cost'],
        properties: {
          id: { type: 'string', format: 'uuid', description: 'Provide to update an existing lot' },
          productId: { type: 'string', format: 'uuid' },
          supplierId: { type: 'string', format: 'uuid' },
          quantity: { type: 'integer' },
          cost: { type: 'number', format: 'double' },
          receivedAt: { type: 'string', format: 'date-time' },
          expiresAt: { type: 'string', format: 'date-time' }
        }
      },
      StockAdjustmentRequest: {
        type: 'object',
        required: ['type', 'quantity'],
        properties: {
          type: {
            type: 'string',
            enum: ['increment', 'decrement', 'count']
          },
          quantity: { type: 'integer' },
          reason: { type: 'string' }
        }
      },
      OrderItemInput: {
        type: 'object',
        required: ['productId', 'quantity', 'unitPrice'],
        properties: {
          productId: { type: 'string', format: 'uuid' },
          inventoryLotId: { type: 'string', format: 'uuid' },
          quantity: { type: 'integer' },
          unitPrice: { type: 'number', format: 'double' },
          discount: { type: 'number', format: 'double', example: 0 }
        }
      },
      OrderInput: {
        type: 'object',
        required: ['items'],
        properties: {
          customerId: { type: 'string', format: 'uuid' },
          items: {
            type: 'array',
            minItems: 1,
            items: { $ref: '#/components/schemas/OrderItemInput' }
          },
          promotions: {
            type: 'array',
            items: { type: 'string', format: 'uuid' }
          },
          paymentIntentId: { type: 'string' },
          metadata: { type: 'object' }
        }
      },
      Order: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          customerId: { type: 'string', format: 'uuid' },
          status: { type: 'string', enum: ['pending', 'paid', 'cancelled'] },
          subtotal: { type: 'number', format: 'double' },
          taxAmount: { type: 'number', format: 'double' },
          discountAmount: { type: 'number', format: 'double' },
          total: { type: 'number', format: 'double' },
          items: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                productId: { type: 'string', format: 'uuid' },
                quantity: { type: 'integer' },
                unitPrice: { type: 'number', format: 'double' },
                discount: { type: 'number', format: 'double' }
              }
            }
          },
          payments: {
            type: 'array',
            items: { $ref: '#/components/schemas/Payment' }
          },
          createdAt: { type: 'string', format: 'date-time' }
        }
      },
      PaymentInput: {
        type: 'object',
        required: ['amount', 'method'],
        properties: {
          amount: { type: 'number', format: 'double' },
          method: { type: 'string', enum: ['cash', 'card', 'wallet'] },
          reference: { type: 'string' },
          metadata: { type: 'object' }
        }
      },
      Payment: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          amount: { type: 'number', format: 'double' },
          method: { type: 'string' },
          status: { type: 'string' },
          processedAt: { type: 'string', format: 'date-time' }
        }
      },
      CustomerInput: {
        type: 'object',
        required: ['firstName', 'lastName'],
        properties: {
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          email: { type: 'string', format: 'email' },
          phone: { type: 'string' },
          birthDate: { type: 'string', format: 'date' },
          marketingOptIn: { type: 'boolean' }
        }
      },
      CustomerUpdateInput: {
        allOf: [
          { $ref: '#/components/schemas/CustomerInput' }
        ]
      },
      Customer: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          email: { type: 'string', format: 'email' },
          phone: { type: 'string' },
          birthDate: { type: 'string', format: 'date' },
          loyaltyAccount: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid' },
              pointsBalance: { type: 'integer' },
              tier: { type: 'string' }
            }
          },
          createdAt: { type: 'string', format: 'date-time' }
        }
      },
      LoyaltyBalance: {
        type: 'object',
        properties: {
          customerId: { type: 'string', format: 'uuid' },
          pointsBalance: { type: 'integer' },
          lifetimePoints: { type: 'integer' },
          expiringPoints: { type: 'integer' }
        }
      },
      SalesReport: {
        type: 'object',
        properties: {
          range: { type: 'string', example: '2024-01-01/2024-01-31' },
          totals: {
            type: 'object',
            properties: {
              revenue: { type: 'number', format: 'double' },
              tax: { type: 'number', format: 'double' },
              discounts: { type: 'number', format: 'double' }
            }
          },
          topProducts: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                productId: { type: 'string', format: 'uuid' },
                name: { type: 'string' },
                quantity: { type: 'integer' },
                revenue: { type: 'number', format: 'double' }
              }
            }
          }
        }
      },
      InventoryReport: {
        type: 'object',
        properties: {
          generatedAt: { type: 'string', format: 'date-time' },
          lowStockProducts: {
            type: 'array',
            items: { $ref: '#/components/schemas/Product' }
          },
          expiringLots: {
            type: 'array',
            items: { $ref: '#/components/schemas/InventoryLot' }
          }
        }
      },
      CustomerBehaviorReport: {
        type: 'object',
        properties: {
          segment: { type: 'string' },
          totalCustomers: { type: 'integer' },
          averageBasket: { type: 'number', format: 'double' },
          churnRisk: { type: 'number', format: 'double' }
        }
      },
      Receipt: {
        type: 'object',
        properties: {
          order: { $ref: '#/components/schemas/Order' },
          payments: {
            type: 'array',
            items: { $ref: '#/components/schemas/Payment' }
          },
          totals: {
            type: 'object',
            properties: {
              subtotal: { type: 'number', format: 'double' },
              tax: { type: 'number', format: 'double' },
              discounts: { type: 'number', format: 'double' },
              total: { type: 'number', format: 'double' }
            }
          }
        }
      }
    }
  },
  paths: {
    '/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Authenticate user and obtain a JWT',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/LoginRequest' }
            }
          }
        },
        responses: {
          200: {
            description: 'Successful authentication',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/LoginResponse' }
              }
            }
          },
          401: {
            description: 'Invalid credentials',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          }
        }
      }
    },
    '/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Register a new user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/RegisterUserRequest' }
            }
          }
        },
        responses: {
          201: {
            description: 'User created',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/User' }
              }
            }
          }
        }
      }
    },
    '/inventory/products': {
      get: {
        tags: ['Inventory'],
        summary: 'List all products with suppliers and lots',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Collection of products',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Product' }
                }
              }
            }
          }
        }
      },
      post: {
        tags: ['Inventory'],
        summary: 'Create a new product',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ProductInput' }
            }
          }
        },
        responses: {
          201: {
            description: 'Product created',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Product' }
              }
            }
          }
        }
      }
    },
    '/inventory/products/{id}': {
      put: {
        tags: ['Inventory'],
        summary: 'Update product data',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ProductInput' }
            }
          }
        },
        responses: {
          200: {
            description: 'Updated product',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Product' }
              }
            }
          },
          404: {
            description: 'Product not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          }
        }
      }
    },
    '/inventory/products/{productId}/suppliers': {
      post: {
        tags: ['Inventory'],
        summary: 'Link a supplier pricing record to a product',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'productId',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ProductSupplierLink' }
            }
          }
        },
        responses: {
          201: {
            description: 'Supplier linked to product',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ProductSupplierLink' }
              }
            }
          }
        }
      }
    },
    '/inventory/suppliers': {
      get: {
        tags: ['Inventory'],
        summary: 'List suppliers and their products',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Collection of suppliers',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Supplier' }
                }
              }
            }
          }
        }
      },
      post: {
        tags: ['Inventory'],
        summary: 'Create a supplier',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/SupplierInput' }
            }
          }
        },
        responses: {
          201: {
            description: 'Supplier created',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Supplier' }
              }
            }
          }
        }
      }
    },
    '/inventory/suppliers/{id}': {
      put: {
        tags: ['Inventory'],
        summary: 'Update supplier information',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/SupplierInput' }
            }
          }
        },
        responses: {
          200: {
            description: 'Updated supplier',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Supplier' }
              }
            }
          },
          404: {
            description: 'Supplier not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          }
        }
      }
    },
    '/inventory/lots': {
      get: {
        tags: ['Inventory'],
        summary: 'List inventory lots',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Collection of lots',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/InventoryLot' }
                }
              }
            }
          }
        }
      },
      post: {
        tags: ['Inventory'],
        summary: 'Create or update an inventory lot',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/InventoryLotInput' }
            }
          }
        },
        responses: {
          201: {
            description: 'Lot created or updated',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/InventoryLot' }
              }
            }
          }
        }
      }
    },
    '/inventory/products/{productId}/lots/{lotId}/adjust': {
      post: {
        tags: ['Inventory'],
        summary: 'Adjust inventory for a specific lot',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'productId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
          { name: 'lotId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/StockAdjustmentRequest' }
            }
          }
        },
        responses: {
          200: {
            description: 'Adjustment applied',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/InventoryLot' }
              }
            }
          }
        }
      }
    },
    '/inventory/alerts/low-stock': {
      get: {
        tags: ['Inventory'],
        summary: 'List products that are below the reorder level',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Low stock products',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Product' }
                }
              }
            }
          }
        }
      }
    },
    '/inventory/alerts/expiring': {
      get: {
        tags: ['Inventory'],
        summary: 'List lots that are about to expire',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Expiring lots',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/InventoryLot' }
                }
              }
            }
          }
        }
      }
    },
    '/orders': {
      get: {
        tags: ['Orders'],
        summary: 'List orders',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Collection of orders',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Order' }
                }
              }
            }
          }
        }
      },
      post: {
        tags: ['Orders'],
        summary: 'Create an order and perform checkout calculations',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/OrderInput' }
            }
          }
        },
        responses: {
          201: {
            description: 'Order created',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Order' }
              }
            }
          }
        }
      }
    },
    '/orders/{id}': {
      get: {
        tags: ['Orders'],
        summary: 'Retrieve order details',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }
        ],
        responses: {
          200: {
            description: 'Order detail',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Order' }
              }
            }
          },
          404: {
            description: 'Order not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          }
        }
      }
    },
    '/orders/{id}/payments': {
      post: {
        tags: ['Orders'],
        summary: 'Register a payment for an order',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/PaymentInput' }
            }
          }
        },
        responses: {
          201: {
            description: 'Payment recorded',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Payment' }
              }
            }
          }
        }
      }
    },
    '/orders/{id}/receipt': {
      get: {
        tags: ['Orders'],
        summary: 'Generate a printable receipt for an order',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }
        ],
        responses: {
          200: {
            description: 'Receipt data',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Receipt' }
              }
            }
          }
        }
      }
    },
    '/customers': {
      post: {
        tags: ['Customers'],
        summary: 'Register a new customer and loyalty account',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CustomerInput' }
            }
          }
        },
        responses: {
          201: {
            description: 'Customer registered',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Customer' }
              }
            }
          }
        }
      }
    },
    '/customers/{id}': {
      get: {
        tags: ['Customers'],
        summary: 'Retrieve customer profile',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }
        ],
        responses: {
          200: {
            description: 'Customer detail',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Customer' }
              }
            }
          },
          404: {
            description: 'Customer not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          }
        }
      },
      put: {
        tags: ['Customers'],
        summary: 'Update customer profile data',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CustomerUpdateInput' }
            }
          }
        },
        responses: {
          200: {
            description: 'Customer updated',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Customer' }
              }
            }
          }
        }
      }
    },
    '/customers/{id}/points': {
      get: {
        tags: ['Customers'],
        summary: 'Get loyalty balance for a customer',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }
        ],
        responses: {
          200: {
            description: 'Loyalty balance',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/LoyaltyBalance' }
              }
            }
          }
        }
      }
    },
    '/reports/sales': {
      get: {
        tags: ['Reports'],
        summary: 'Sales performance report',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Sales report dataset',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SalesReport' }
              }
            }
          }
        }
      }
    },
    '/reports/inventory': {
      get: {
        tags: ['Reports'],
        summary: 'Inventory health report',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Inventory metrics',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/InventoryReport' }
              }
            }
          }
        }
      }
    },
    '/reports/customers': {
      get: {
        tags: ['Reports'],
        summary: 'Customer behavior analytics',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Customer analytics',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/CustomerBehaviorReport' }
                }
              }
            }
          }
        }
      }
    }
  }
};

export default swaggerDocument;
