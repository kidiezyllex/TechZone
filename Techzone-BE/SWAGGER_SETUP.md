Thực hiện Setup Swagger Documentation theo hướng dẫn dưới đây

## 🚀 Cài đặt Dependencies

```bash
npm install swagger-jsdoc swagger-ui-express
```

## ⚙️ Cấu hình Swagger

### 1. File cấu hình chính (`src/config/swagger.js`)

```javascript
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

// Swagger configuration options
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Student Info BE API',
      version: '1.0.0',
      description: 'API documentation for Student Info BE',
      contact: {
        name: 'API Support',
        email: 'support@example.com',
      },
    },
    servers: [
      {
        url: '/api',
        description: 'API Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  // Paths to the API docs
  apis: [
    './src/routes/*.js',
    './src/models/*.js',
    './src/controllers/*.js',
  ],
};

// Initialize swagger-jsdoc
const specs = swaggerJsdoc(options);

/**
 * Set up Swagger UI
 * @param app Express application
 */
export const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Student Info BE API Documentation',
  }));

  app.get('/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(specs);
  });

  console.log('Swagger documentation initialized at /api-docs');
};

export default setupSwagger;
```

### 2. Khởi tạo trong main app (`src/routes.ts`)

```typescript
import { setupSwagger } from "./config/swagger.js";

export async function registerRoutes(app: Express): Promise<Server> {
  try {
    // ... other setup code
    
    // Setup Swagger documentation
    setupSwagger(app);
    
    // ... rest of the code
  } catch (error) {
    console.error("Error registering routes:", error);
    throw error;
  }
}
```

## 📝 Viết API Documentation

### 1. Cú pháp cơ bản trong Routes

```javascript
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                     user:
 *                       type: object
 *       401:
 *         description: Invalid credentials
 *       400:
 *         description: Bad request
 */
router.post('/login', authRateLimit, login);
```

### 2. API với Authentication

```javascript
/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/', authenticate, isAdmin, getUsers);
```

### 3. Định nghĩa Schema Models

```javascript
/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         _id:
 *           type: string
 *           description: User ID
 *         name:
 *           type: string
 *           description: User name
 *         email:
 *           type: string
 *           format: email
 *           description: User email
 *         role:
 *           type: string
 *           enum: [student, coordinator, admin]
 *           description: User role
 *         department:
 *           $ref: '#/components/schemas/Department'
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     
 *     Department:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         code:
 *           type: string
 *         description:
 *           type: string
 */
```

### 4. API với Query Parameters

```javascript
/**
 * @swagger
 * /events:
 *   get:
 *     summary: Get upcoming events
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: department
 *         schema:
 *           type: string
 *         description: Filter by department ID
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of events to return
 *     responses:
 *       200:
 *         description: Events retrieved successfully
 */
router.get('/', authenticate, getEvents);
```

## 🎨 Customization

### 1. Custom CSS cho Swagger UI

```javascript
export const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
    explorer: true,
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info .title { color: #3b82f6; }
      .swagger-ui .scheme-container { background: #f8fafc; }
    `,
    customSiteTitle: 'Student Info BE API Documentation',
    customfavIcon: '/favicon.ico',
  }));
};
```

### 2. Multiple Environments

```javascript
const getSwaggerOptions = (env = 'development') => {
  const baseOptions = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Student Info BE API',
        version: '1.0.0',
        description: `API documentation for Student Info BE - ${env}`,
      },
      servers: [
        {
          url: env === 'production' ? 'https://api.studentinfo.com/api' : '/api',
          description: `${env} server`,
        },
      ],
    },
    apis: ['./src/routes/*.js'],
  };
  
  return baseOptions;
};
```

## 🚀 Chạy và Truy cập

### 1. Start server
```bash
npm run dev
```

### 2. Truy cập Swagger UI
- **Swagger UI**: `http://localhost:5000/api-docs`
- **JSON Spec**: `http://localhost:5000/swagger.json`

## 📋 Best Practices

### 1. Tổ chức Tags
```javascript
/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Authentication endpoints
 *   - name: Users
 *     description: User management
 *   - name: Events
 *     description: Event management
 */
```

### 2. Error Responses chuẩn
```javascript
/**
 * @swagger
 * components:
 *   responses:
 *     UnauthorizedError:
 *       description: Access token is missing or invalid
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: "Unauthorized"
 *     
 *     ValidationError:
 *       description: Validation error
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *               errors:
 *                 type: array
 *                 items:
 *                   type: object
 */
```

### 3. Reusable Components
```javascript
/**
 * @swagger
 * components:
 *   parameters:
 *     IdParam:
 *       in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: string
 *       description: Resource ID
 *   
 *   responses:
 *     SuccessResponse:
 *       description: Success
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *               data:
 *                 type: object
 */
```

## 🔧 Troubleshooting

### 1. Swagger không load được
- Kiểm tra đường dẫn trong `apis` array
- Đảm bảo file routes có extension `.js`
- Check console log để xem có lỗi gì không

### 2. Authentication không hoạt động
- Đảm bảo đã setup `securitySchemes` đúng cách
- Check middleware authentication
- Test với Postman trước khi test trên Swagger

### 3. Schema không hiển thị
- Đảm bảo đã định nghĩa schema trong `components`
- Check reference `$ref` có đúng không
- Validate JSON schema syntax

## ✅ Checklist Setup

- [ ] Cài đặt dependencies
- [ ] Tạo file config swagger
- [ ] Khởi tạo trong main app
- [ ] Viết documentation cho các routes
- [ ] Định nghĩa schemas/models
- [ ] Test truy cập `/api-docs`
- [ ] Customize UI nếu cần
- [ ] Deploy và test trên production

## 📚 Tài liệu tham khảo

- [Swagger OpenAPI Specification](https://swagger.io/specification/)
- [swagger-jsdoc Documentation](https://github.com/Surnet/swagger-jsdoc)
- [swagger-ui-express Documentation](https://github.com/scottie1984/swagger-ui-express)

---

Với setup này, bạn sẽ có một API documentation hoàn chỉnh và professional cho project Student Info Backend! 🎉
