import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'techzone',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
};

// Nếu có socket, sử dụng socket thay vì host/port
if (process.env.DB_SOCKET) {
  dbConfig.socketPath = process.env.DB_SOCKET;
  delete dbConfig.host;
  delete dbConfig.port;
}

// Tạo connection pool
const pool = mysql.createPool(dbConfig);

// Test connection
export const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✓ MySQL Database connected successfully');
    connection.release();
    return true;
  } catch (error) {
    console.error('✗ MySQL Connection Error:', error.message);
    return false;
  }
};

// Execute query helper
export const query = async (sql, params) => {
  try {
    const [results] = await pool.execute(sql, params);
    return results;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

// Transaction helper
export const transaction = async (callback) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

export default pool;
