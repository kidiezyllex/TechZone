import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import swaggerUi from 'swagger-ui-express';
import dotenv from 'dotenv';
import { testConnection } from './config/database.config.js';
import { errorHandler, notFound } from './middleware/errorHandler.middleware.js';
import { specs } from './config/swagger.config.js';
import authRoutes from './routes/auth.routes.js';
import productRoutes from './routes/product.routes.js';
import categoryRoutes from './routes/category.routes.js';
import cartRoutes from './routes/cart.routes.js';
import orderRoutes from './routes/order.routes.js';
import inventoryRoutes from './routes/inventory.routes.js';
import userRoutes from './routes/user.routes.js';
import storeRoutes from './routes/store.routes.js';
import statsRoutes from './routes/stats.routes.js';
import customerRoutes from './routes/customer.routes.js';
dotenv.config();
const app = express();

app.use(helmet());

app.use(cors({
  origin: true,
  credentials: true,
  optionsSuccessStatus: 200
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(compression());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.set('trust proxy', 1);

app.get('/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Techzone API đang hoạt động',
    timestamp: new Date().toISOString()
  });
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  swaggerOptions: {
    url: '/swagger.json'
  }
}));

app.get('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(specs);
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/users', userRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/customers', customerRoutes);

app.use(notFound);

app.use(errorHandler);

const PORT = parseInt(process.env.PORT || '8000');

const startServer = async () => {
  try {
    const dbConnected = await testConnection();
    
    if (!dbConnected) {
      console.error('⚠️  Warning: Cannot connect to MySQL database');
      console.log('💡 Run ./start-mysql.sh to start MySQL server');
    }
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🌟 Techzone API Server đang chạy`);
      console.log(`📍 URL: http://localhost:${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`⏰ Started at: ${new Date().toLocaleString('vi-VN')}`);
    });
  } catch (error) {
    console.error('❌ Cannot start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
