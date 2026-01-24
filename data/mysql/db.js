const mysql = require('mysql2/promise');
const config = require('../../config');

class Database {
  constructor() {
    this.pool = null;
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }

  async initialize() {
    try {
      this.pool = mysql.createPool({
        host: config.database.host,
        port: config.database.port,
        user: config.database.user,
        password: config.database.password,
        database: config.database.database,
        waitForConnections: true,
        connectionLimit: config.database.pool.size,
        queueLimit: 0,
        connectTimeout: config.database.connectionTimeout
      });

      // Test connection
      const connection = await this.pool.getConnection();
      console.log('Database connected successfully');
      connection.release();
      this.isConnected = true;
      this.reconnectAttempts = 0; // Reset reconnect attempts on success
    } catch (error) {
      console.error('Database connection error:', error);
      this.isConnected = false;
      
      // Attempt to reconnect after delay with limit
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        this.reconnectAttempts++;
        console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
        setTimeout(() => this.initialize(), 5000);
      } else {
        console.error('Max reconnect attempts reached. Stopping reconnection attempts.');
      }
    }
  }

  async getConnection() {
    if (!this.isConnected || !this.pool) {
      await this.initialize();
      
      // If still not connected after initialization, throw error
      if (!this.isConnected || !this.pool) {
        throw new Error('Database connection is not available');
      }
    }
    return this.pool.getConnection();
  }

  async query(sql, params) {
    let connection;
    try {
      connection = await this.getConnection();
      const [results] = await connection.query(sql, params);
      return results;
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }

  async execute(sql, params) {
    let connection;
    try {
      connection = await this.getConnection();
      const [results] = await connection.execute(sql, params);
      return results;
    } catch (error) {
      console.error('Database execute error:', error);
      throw error;
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }

  async close() {
    if (this.pool) {
      await this.pool.end();
      this.isConnected = false;
      console.log('Database connection pool closed');
    }
  }
}

// Export singleton instance
const db = new Database();
module.exports = db;