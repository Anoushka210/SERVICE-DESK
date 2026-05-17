const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const Message = require('./models/Message');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const ticketRoutes = require('./routes/tickets');
const messageRoutes = require('./routes/messages');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: '*' }
});

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/messages', messageRoutes);

// Socket.io
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join a ticket-specific chat room
  socket.on('joinRoom', (ticketId) => {
    socket.join(ticketId);
    console.log(`Socket ${socket.id} joined room ${ticketId}`);
  });

  // Handle incoming message
  socket.on('sendMessage', async ({ ticketId, text, senderId, senderName, senderRole }) => {
    try {
      // Save to MongoDB
      const message = await Message.create({
        ticketId,
        sender: senderId,
        text
      });

      // Broadcast to everyone in the room
      io.to(ticketId).emit('receiveMessage', {
        _id: message._id,
        text,
        sender: { _id: senderId, name: senderName, role: senderRole },
        createdAt: message.createdAt
      });
    } catch (err) {
      console.error('Message save error:', err.message);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

const PORT = process.env.PORT || 5002;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));