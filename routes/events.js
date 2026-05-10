const express = require('express');
const router = express.Router();
const {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  registerAttendee,
  unregisterAttendee,
  listEventAttendees,
} = require('../controllers/eventController');

router.get('/', getAllEvents);
router.get('/:id', getEventById);
router.post('/', createEvent);
router.put('/:id', updateEvent);
router.delete('/:id', deleteEvent);

// Relationship endpoints
router.post('/:id/register', registerAttendee);
router.delete('/:id/unregister', unregisterAttendee);
router.get('/:id/attendees', listEventAttendees);

module.exports = router;
