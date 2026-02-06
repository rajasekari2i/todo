const jwt = require('jsonwebtoken');

const connectedUsers = new Map();

const initializeSocket = (io) => {
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error('Authentication required'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.userId;
      next();
    } catch (error) {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.userId;
    console.log(`User ${userId} connected`);

    // Store socket connection
    if (!connectedUsers.has(userId)) {
      connectedUsers.set(userId, new Set());
    }
    connectedUsers.get(userId).add(socket.id);

    // Join user's personal room
    socket.join(`user:${userId}`);

    socket.on('disconnect', () => {
      console.log(`User ${userId} disconnected`);
      const userSockets = connectedUsers.get(userId);
      if (userSockets) {
        userSockets.delete(socket.id);
        if (userSockets.size === 0) {
          connectedUsers.delete(userId);
        }
      }
    });
  });
};

const sendNotificationToUser = (io, userId, notification) => {
  io.to(`user:${userId}`).emit('notification', notification);
};

const isUserConnected = (userId) => {
  return connectedUsers.has(userId) && connectedUsers.get(userId).size > 0;
};

module.exports = {
  initializeSocket,
  sendNotificationToUser,
  isUserConnected
};
