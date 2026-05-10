const { Event, Venue, Attendee } = require('../models');

// GET /events
const getAllEvents = async (req, res, next) => {
  try {
    const events = await Event.findAll({
      include: [{ model: Venue, as: 'venue' }],
    });
    res.status(200).json(events);
  } catch (err) {
    next(err);
  }
};

// GET /events/:id
const getEventById = async (req, res, next) => {
  try {
    const event = await Event.findByPk(req.params.id, {
      include: [
        { model: Venue, as: 'venue' },
        { model: Attendee, as: 'attendees', through: { attributes: [] } },
      ],
    });
    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.status(200).json(event);
  } catch (err) {
    next(err);
  }
};

// POST /events
const createEvent = async (req, res, next) => {
  try {
    const { title, description, date, time, price, venueId } = req.body;

    if (!title || !date || !time || !venueId) {
      return res.status(400).json({
        error: 'Validation failed',
        message: 'title, date, time, and venueId are required fields.',
      });
    }

    const venue = await Venue.findByPk(venueId);
    if (!venue) {
      return res.status(400).json({
        error: 'Validation failed',
        message: `Venue with id ${venueId} does not exist.`,
      });
    }

    const event = await Event.create({ title, description, date, time, price: price || 0, venueId });
    const created = await Event.findByPk(event.id, { include: [{ model: Venue, as: 'venue' }] });
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
};

// PUT /events/:id
const updateEvent = async (req, res, next) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });

    const { title, description, date, time, price, venueId } = req.body;

    if (venueId) {
      const venue = await Venue.findByPk(venueId);
      if (!venue) {
        return res.status(400).json({
          error: 'Validation failed',
          message: `Venue with id ${venueId} does not exist.`,
        });
      }
    }

    await event.update({ title, description, date, time, price, venueId });
    const updated = await Event.findByPk(event.id, { include: [{ model: Venue, as: 'venue' }] });
    res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
};

// DELETE /events/:id
const deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });
    await event.destroy();
    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (err) {
    next(err);
  }
};

// POST /events/:id/register — register an attendee to an event
const registerAttendee = async (req, res, next) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });

    const { attendeeId } = req.body;
    if (!attendeeId) {
      return res.status(400).json({
        error: 'Validation failed',
        message: 'attendeeId is required.',
      });
    }

    const attendee = await Attendee.findByPk(attendeeId);
    if (!attendee) return res.status(404).json({ error: 'Attendee not found' });

    const already = await event.hasAttendee(attendee);
    if (already) {
      return res.status(400).json({ error: 'Attendee is already registered for this event.' });
    }

    await event.addAttendee(attendee);
    res.status(201).json({ message: 'Attendee registered successfully', eventId: event.id, attendeeId: attendee.id });
  } catch (err) {
    next(err);
  }
};

// DELETE /events/:id/unregister — remove an attendee from an event
const unregisterAttendee = async (req, res, next) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });

    const { attendeeId } = req.body;
    if (!attendeeId) {
      return res.status(400).json({
        error: 'Validation failed',
        message: 'attendeeId is required.',
      });
    }

    const attendee = await Attendee.findByPk(attendeeId);
    if (!attendee) return res.status(404).json({ error: 'Attendee not found' });

    const registered = await event.hasAttendee(attendee);
    if (!registered) {
      return res.status(400).json({ error: 'Attendee is not registered for this event.' });
    }

    await event.removeAttendee(attendee);
    res.status(200).json({ message: 'Attendee unregistered successfully' });
  } catch (err) {
    next(err);
  }
};

// GET /events/:id/attendees — list attendees for an event
const listEventAttendees = async (req, res, next) => {
  try {
    const event = await Event.findByPk(req.params.id, {
      include: [{ model: Attendee, as: 'attendees', through: { attributes: [] } }],
    });
    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.status(200).json(event.attendees);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  registerAttendee,
  unregisterAttendee,
  listEventAttendees,
};
