const scheduleRepository = require('../data/mysql/scheduleRepository');

class ScheduleService {
  // Create a new schedule
  async createSchedule(user_id, scheduleData) {
    return await scheduleRepository.create({ ...scheduleData, user_id });
  }

  // Get all schedules for a user
  async getUserSchedules(user_id) {
    return await scheduleRepository.findByUserId(user_id);
  }

  // Get a schedule by id
  async getScheduleById(id) {
    const schedule = await scheduleRepository.findById(id);
    if (!schedule) {
      throw new Error('Schedule not found');
    }
    return schedule;
  }

  // Update a schedule
  async updateSchedule(id, user_id, scheduleData) {
    const schedule = await this.getScheduleById(id);
    if (schedule.user_id !== user_id) {
      throw new Error('Unauthorized to update this schedule');
    }
    return await scheduleRepository.update(id, scheduleData);
  }

  // Delete a schedule
  async deleteSchedule(id, user_id) {
    const schedule = await this.getScheduleById(id);
    if (schedule.user_id !== user_id) {
      throw new Error('Unauthorized to delete this schedule');
    }
    return await scheduleRepository.delete(id);
  }

  // Get schedules by week for a user
  async getUserSchedulesByWeek(user_id, week) {
    return await scheduleRepository.findByUserIdAndWeek(user_id, week);
  }
}

module.exports = new ScheduleService();
