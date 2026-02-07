const http = require('http');
const { Server } = require('socket.io');

const app = require('./app');
const { sequelize } = require('./models');
const { initializeSocket } = require('./services/socketService');
const { startReminderJob } = require('./services/reminderService');

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

// Make io accessible in routes
app.set('io', io);

// Initialize Socket.io
initializeSocket(io);

// Start server
const PORT = process.env.SERVER_PORT || 3001;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established.');

    await sequelize.sync({ alter: true });
    console.log('Database synchronized.');

    // Start reminder cron job
    startReminderJob(io);

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = { app, server };
