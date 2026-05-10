const sequelize = require('../config/database');
const Venue = require('./Venue');
const Event = require('./Event');
const Attendee = require('./Attendee');

// One-to-Many: Venue has many Events; Event belongs to one Venue
Venue.hasMany(Event, { foreignKey: 'venueId', as: 'events' });
Event.belongsTo(Venue, { foreignKey: 'venueId', as: 'venue' });

// Many-to-Many: Attendees register for many Events; Events have many Attendees
// Junction table: registrations
Event.belongsToMany(Attendee, {
  through: 'registrations',
  foreignKey: 'eventId',
  otherKey: 'attendeeId',
  as: 'attendees',
});
Attendee.belongsToMany(Event, {
  through: 'registrations',
  foreignKey: 'attendeeId',
  otherKey: 'eventId',
  as: 'events',
});

module.exports = { sequelize, Venue, Event, Attendee };
