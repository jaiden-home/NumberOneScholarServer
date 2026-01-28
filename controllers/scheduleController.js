const scheduleService = require('../services/scheduleService');

class ScheduleController {
  // Create a new schedule
  async createSchedule(req, res, next) {
    try {
      // 临时解决方案：如果req.user不存在，使用默认用户ID 1
      const user_id = req.user?.id || 1;
      const scheduleData = req.body;
      const schedule = await scheduleService.createSchedule(user_id, scheduleData);
      res.status(201).json({ success: true, data: schedule });
    } catch (error) {
      next(error);
    }
  }

  // Get all schedules for the current user
  async getUserSchedules(req, res, next) {
    try {
      // 临时解决方案：如果req.user不存在，使用默认用户ID 1
      const user_id = req.user?.id || 1;
      const schedules = await scheduleService.getUserSchedules(user_id);
      res.status(200).json({ success: true, data: schedules });
    } catch (error) {
      next(error);
    }
  }

  // Get a schedule by id
  async getScheduleById(req, res, next) {
    try {
      const { id } = req.params;
      const schedule = await scheduleService.getScheduleById(id);
      // 临时解决方案：如果req.user不存在，跳过所有权验证
      if (req.user && schedule.user_id !== req.user.id) {
        return res.status(403).json({ success: false, message: 'Unauthorized' });
      }
      res.status(200).json({ success: true, data: schedule });
    } catch (error) {
      next(error);
    }
  }

  // Update a schedule
  async updateSchedule(req, res, next) {
    try {
      const { id } = req.params;
      // 临时解决方案：如果req.user不存在，使用默认用户ID 1
      const user_id = req.user?.id || 1;
      const scheduleData = req.body;
      const schedule = await scheduleService.updateSchedule(id, user_id, scheduleData);
      res.status(200).json({ success: true, data: schedule });
    } catch (error) {
      next(error);
    }
  }

  // Delete a schedule
  async deleteSchedule(req, res, next) {
    try {
      const { id } = req.params;
      // 临时解决方案：如果req.user不存在，使用默认用户ID 1
      const user_id = req.user?.id || 1;
      await scheduleService.deleteSchedule(id, user_id);
      res.status(200).json({ success: true, message: 'Schedule deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  // Get schedules by week for the current user
  async getUserSchedulesByWeek(req, res, next) {
    try {
      // 临时解决方案：如果req.user不存在，使用默认用户ID 1
      const user_id = req.user?.id || 1;
      const { week } = req.params;
      const schedules = await scheduleService.getUserSchedulesByWeek(user_id, week);
      res.status(200).json({ success: true, data: schedules });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ScheduleController();
