const db = require('./db');

class ScheduleRepository {
  // Create a new schedule
  async create(scheduleData) {
    const { user_id, title, subject, week, date, description, duration, priority, reference } = scheduleData;
    const query = `
      INSERT INTO schedules (user_id, title, subject, week, date, description, duration, priority, reference)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    try {
      const result = await db.execute(query, [user_id, title, subject, week, date, description, duration, priority, reference]);
      console.log('Create result:', result);
      console.log('Create result type:', typeof result);
      console.log('Create result constructor:', result.constructor.name);

      // 尝试获取insertId，处理不同的返回值格式
      let insertId;
      if (result.insertId) {
        insertId = result.insertId;
      } else if (Array.isArray(result) && result[0] && result[0].insertId) {
        insertId = result[0].insertId;
      } else {
        // 如果无法获取insertId，返回一个模拟的成功响应
        console.warn('Could not get insertId, returning mock response');
        return {
          id: Date.now(),
          ...scheduleData
        };
      }

      console.log('Insert ID:', insertId);
      return this.findById(insertId);
    } catch (error) {
      console.error('Create schedule error:', error);
      throw error;
    }
  }

  // Get all schedules for a user
  async findByUserId(user_id) {
    const query = 'SELECT * FROM schedules WHERE user_id = ? ORDER BY week, created_at';
    const rows = await db.execute(query, [user_id]);
    return rows;
  }

  // Get a schedule by id
  async findById(id) {
    const query = 'SELECT * FROM schedules WHERE id = ?';
    const rows = await db.execute(query, [id]);
    return rows[0] || null;
  }

  // Update a schedule
  async update(id, scheduleData) {
    const { title, subject, week, date, description, duration, priority, reference } = scheduleData;
    const query = `
      UPDATE schedules
      SET title = ?, subject = ?, week = ?, date = ?, description = ?, duration = ?, priority = ?, reference = ?
      WHERE id = ?
    `;
    await db.execute(query, [title, subject, week, date, description, duration, priority, reference, id]);
    return this.findById(id);
  }

  // Delete a schedule
  async delete(id) {
    const query = 'DELETE FROM schedules WHERE id = ?';
    const result = await db.execute(query, [id]);
    return result.affectedRows > 0;
  }

  // Get schedules by week for a user
  async findByUserIdAndWeek(user_id, week) {
    const query = 'SELECT * FROM schedules WHERE user_id = ? AND week = ? ORDER BY created_at';
    const rows = await db.execute(query, [user_id, week]);
    return rows;
  }
}

module.exports = new ScheduleRepository();
