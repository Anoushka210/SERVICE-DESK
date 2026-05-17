const Message = require('../models/Message');

// Get all messages for a ticket
exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ ticketId: req.params.ticketId })
      .populate('sender', 'name role')
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};