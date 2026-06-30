const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: [
        process.env.FRONTEND_URL,
        process.env.ADMIN_URL,
        'http://localhost:3000',
        'https://thoritechnicalshop.com',
      ].filter(Boolean),
      credentials: true
    }
  });

  // Middleware: Authenticate Socket Connection
  io.use((socket, next) => {
    const token = socket.handshake.auth.token || socket.handshake.headers.token;

    if (!token) {
      return next(new Error('Authentication error: Token missing'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded;
      next();
    } catch (err) {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.user.id;
    console.log(`🔌 User Connected: ${userId} (Socket: ${socket.id})`);

    // Join a personal room named after the userId for private messaging
    socket.join(userId);

    // Broadcast online status to all connected users
    socket.broadcast.emit('user_online', { userId });

    // ─── Typing Indicators ─────────────────────────────────
    socket.on('typing', ({ to }) => {
      if (to) {
        io.to(to).emit('typing', { from: userId });
      }
    });

    socket.on('stop_typing', ({ to }) => {
      if (to) {
        io.to(to).emit('stop_typing', { from: userId });
      }
    });

    // ─── Message Read Receipt ──────────────────────────────
    socket.on('mark_read', ({ from }) => {
      if (from) {
        io.to(from).emit('messagesRead', { byUserId: userId });
      }
    });

    // ─── Disconnect ────────────────────────────────────────
    socket.on('disconnect', () => {
      console.log(`❌ User Disconnected: ${userId}`);
      socket.broadcast.emit('user_offline', { userId });
    });
  });

  return io;
};

const getIo = () => {
  if (!io) {
    console.warn('⚠️ Socket.io not initialized! Using mock socket interface.');
    return {
      to: () => ({
        emit: () => { }
      })
    };
  }
  return io;
};

module.exports = { initSocket, getIo };
