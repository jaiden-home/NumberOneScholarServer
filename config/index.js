const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const config = {
  // Server configuration
  server: {
    port: process.env.PORT || 3000,
    nodeEnv: process.env.NODE_ENV || 'development'
  },
  
  // Database configuration
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'admin',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'example_db',
    pool: {
      size: process.env.DB_POOL_SIZE || 10,
      connectionTimeout: process.env.DB_CONNECTION_TIMEOUT || 30000
    }
  },
  
  // Log configuration
  log: {
    level: process.env.LOG_LEVEL || 'info'
  },
  
  // CORS configuration
  cors: {
    origin: process.env.CORS_ORIGIN || '*'
  }
};

module.exports = config;