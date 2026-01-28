const express = require('express');
const scheduleController = require('../controllers/scheduleController');
const router = express.Router();

// Create a new schedule
router.post('/', scheduleController.createSchedule);

// Get all schedules for the current user
router.get('/', scheduleController.getUserSchedules);

// Get a schedule by id
router.get('/:id', scheduleController.getScheduleById);

// Update a schedule
router.put('/:id', scheduleController.updateSchedule);

// Delete a schedule
router.delete('/:id', scheduleController.deleteSchedule);

// Get schedules by week for the current user
router.get('/week/:week', scheduleController.getUserSchedulesByWeek);

module.exports = router;
