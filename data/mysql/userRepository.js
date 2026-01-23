const db = require('./db');

class UserRepository {
  async findAll() {
    const sql = 'SELECT id, name, email, created_at FROM users';
    return db.query(sql);
  }

  async findById(id) {
    const sql = 'SELECT id, name, email, created_at FROM users WHERE id = ?';
    const users = await db.query(sql, [id]);
    return users[0] || null;
  }

  async findByEmail(email) {
    const sql = 'SELECT id, name, email, created_at FROM users WHERE email = ?';
    const users = await db.query(sql, [email]);
    return users[0] || null;
  }

  async create(userData) {
    const sql = 'INSERT INTO users (name, email, password, created_at) VALUES (?, ?, ?, NOW())';
    const result = await db.execute(sql, [userData.name, userData.email, userData.password]);
    return this.findById(result.insertId);
  }

  async update(id, updates) {
    // Build update query dynamically
    const fields = [];
    const values = [];

    if (updates.name) {
      fields.push('name = ?');
      values.push(updates.name);
    }

    if (updates.email) {
      fields.push('email = ?');
      values.push(updates.email);
    }

    if (updates.password) {
      fields.push('password = ?');
      values.push(updates.password);
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    values.push(id);
    const sql = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
    await db.execute(sql, values);
    return this.findById(id);
  }

  async delete(id) {
    const sql = 'DELETE FROM users WHERE id = ?';
    const result = await db.execute(sql, [id]);
    return result.affectedRows;
  }
}

module.exports = new UserRepository();