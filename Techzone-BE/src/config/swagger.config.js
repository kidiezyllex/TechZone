import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Techzone API Documentation',
      version: '1.0.0',
      description: 'API documentation cho hệ thống quản lý bán hàng Techzone (Laptop & Linh kiện máy tính)',
      contact: {
        name: 'Techzone Team',
        email: 'support@techzone.vn'
      }
    },
    servers: [
      {
        url: 'http://localhost:8000',
        description: 'Development server'
      },
      {
        url: process.env.API_URL || 'https://api.techzone.vn',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT Authorization header using the Bearer scheme'
        }
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            statusCode: { type: 'number' }
          }
        },
        User: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            email: { type: 'string' },
            full_name: { type: 'string' },
            phone: { type: 'string' },
            role: { type: 'string' },
            is_active: { type: 'boolean' },
            created_at: { type: 'string', format: 'date-time' }
          }
        },
        Product: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            name: { type: 'string' },
            sku: { type: 'string' },
            price: { type: 'number' },
            discount_percentage: { type: 'number' },
            description: { type: 'string' },
            category_id: { type: 'number' },
            brand_id: { type: 'number' },
            is_active: { type: 'boolean' },
            sold_count: { type: 'number' },
            total_stock: { type: 'number' }
          }
        },
        Order: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            user_id: { type: 'number' },
            store_id: { type: 'number' },
            total_amount: { type: 'number' },
            status: { type: 'string' },
            payment_method: { type: 'string' },
            created_at: { type: 'string', format: 'date-time' }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./src/routes/**/*.js']
};

export const specs = swaggerJsdoc(options);
