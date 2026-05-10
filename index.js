require('dotenv').config();
const express = require('express');
const { sequelize } = require('./models');

const logger = require('./middleware/logger');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

const venueRoutes = require('./routes/venues');
const eventRoutes = require('./routes/events');
const attendeeRoutes = require('./routes/attendees');

const app = express();
const PORT = process.env.PORT || 3000;

// Body parsing
app.use(express.json());

// Logger middleware — logs every request
app.use(logger);

// Routes
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Event Booking API is running.' });
});

app.use('/venues', venueRoutes);
app.use('/events', eventRoutes);
app.use('/attendees', attendeeRoutes);

// 404 catch-all — must be after all routes
app.use(notFound);

// Global error handler — must have exactly 4 params and be last
app.use(errorHandler);

// Sync database and start server
sequelize.sync({ alter: true })
  .then(() => {
    console.log('Database synced successfully.');
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to the database:', err.message);
    process.exit(1);
  });
