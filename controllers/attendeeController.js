const { Attendee, Event } = require('../models');

// GET /attendees
const getAllAttendees = async (req, res, next) => {
  try {
    const attendees = await Attendee.findAll();
    res.status(200).json(attendees);
  } catch (err) {
    next(err);
  }
};

// GET /attendees/:id
const getAttendeeById = async (req, res, next) => {
  try {
    const attendee = await Attendee.findByPk(req.params.id, {
      include: [{ model: Event, as: 'events', through: { attributes: [] } }],
    });
    if (!attendee) return res.status(404).json({ error: 'Attendee not found' });
    res.status(200).json(attendee);
  } catch (err) {
    next(err);
  }
};

// POST /attendees
const createAttendee = async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        error: 'Validation failed',
        message: 'name and email are required fields.',
      });
    }

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: 'Validation failed',
        message: 'email must be a valid email address.',
      });
    }

    const attendee = await Attendee.create({ name, email, phone });
    res.status(201).json(attendee);
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        error: 'Validation failed',
        message: 'An attendee with this email already exists.',
      });
    }
    next(err);
  }
};

// PUT /attendees/:id
const updateAttendee = async (req, res, next) => {
  try {
    const attendee = await Attendee.findByPk(req.params.id);
    if (!attendee) return res.status(404).json({ error: 'Attendee not found' });

    const { name, email, phone } = req.body;

    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          error: 'Validation failed',
          message: 'email must be a valid email address.',
        });
      }
    }

    await attendee.update({ name, email, phone });
    res.status(200).json(attendee);
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        error: 'Validation failed',
        message: 'An attendee with this email already exists.',
      });
    }
    next(err);
  }
};

// DELETE /attendees/:id
const deleteAttendee = async (req, res, next) => {
  try {
    const attendee = await Attendee.findByPk(req.params.id);
    if (!attendee) return res.status(404).json({ error: 'Attendee not found' });
    await attendee.destroy();
    res.status(200).json({ message: 'Attendee deleted successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllAttendees, getAttendeeById, createAttendee, updateAttendee, deleteAttendee };
