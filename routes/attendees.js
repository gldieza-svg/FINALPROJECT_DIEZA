const express = require('express');
const router = express.Router();
const {
  getAllAttendees,
  getAttendeeById,
  createAttendee,
  updateAttendee,
  deleteAttendee,
} = require('../controllers/attendeeController');

router.get('/', getAllAttendees);
router.get('/:id', getAttendeeById);
router.post('/', createAttendee);
router.put('/:id', updateAttendee);
router.delete('/:id', deleteAttendee);

module.exports = router;
