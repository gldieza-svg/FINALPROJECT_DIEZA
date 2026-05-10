const { Venue, Event } = require('../models');

// GET /venues
const getAllVenues = async (req, res, next) => {
  try {
    const venues = await Venue.findAll();
    res.status(200).json(venues);
  } catch (err) {
    next(err);
  }
};

// GET /venues/:id
const getVenueById = async (req, res, next) => {
  try {
    const venue = await Venue.findByPk(req.params.id, {
      include: [{ model: Event, as: 'events' }],
    });
    if (!venue) return res.status(404).json({ error: 'Venue not found' });
    res.status(200).json(venue);
  } catch (err) {
    next(err);
  }
};

// POST /venues
const createVenue = async (req, res, next) => {
  try {
    const { name, location, capacity, description } = req.body;
    if (!name || !location || !capacity) {
      return res.status(400).json({
        error: 'Validation failed',
        message: 'name, location, and capacity are required fields.',
      });
    }
    if (isNaN(capacity) || Number(capacity) <= 0) {
      return res.status(400).json({
        error: 'Validation failed',
        message: 'capacity must be a positive number.',
      });
    }
    const venue = await Venue.create({ name, location, capacity, description });
    res.status(201).json(venue);
  } catch (err) {
    next(err);
  }
};

// PUT /venues/:id
const updateVenue = async (req, res, next) => {
  try {
    const venue = await Venue.findByPk(req.params.id);
    if (!venue) return res.status(404).json({ error: 'Venue not found' });
    const { name, location, capacity, description } = req.body;
    if (capacity !== undefined && (isNaN(capacity) || Number(capacity) <= 0)) {
      return res.status(400).json({
        error: 'Validation failed',
        message: 'capacity must be a positive number.',
      });
    }
    await venue.update({ name, location, capacity, description });
    res.status(200).json(venue);
  } catch (err) {
    next(err);
  }
};

// DELETE /venues/:id
const deleteVenue = async (req, res, next) => {
  try {
    const venue = await Venue.findByPk(req.params.id);
    if (!venue) return res.status(404).json({ error: 'Venue not found' });
    await venue.destroy();
    res.status(200).json({ message: 'Venue deleted successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllVenues, getVenueById, createVenue, updateVenue, deleteVenue };
