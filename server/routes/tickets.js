const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const roleGuard = require('../middleware/roleGuard');

const {
  createTicket,
  getTickets,
  getTicketById,
  updateTicket,
  deleteTicket,
  getAnalytics,
  getTicketsWithLocation
} = require('../controllers/ticketController');

// Static routes FIRST
router.post('/',   protect, createTicket);
router.get('/',    protect, getTickets);
router.get('/analytics/summary', protect, roleGuard('admin', 'agent'), getAnalytics);
router.get('/map/locations', protect, roleGuard('admin', 'agent'), getTicketsWithLocation);

// Dynamic :id routes AFTER
router.get('/:id', protect, getTicketById);
router.put('/:id', protect, roleGuard('agent', 'admin'), updateTicket);
router.delete('/:id', protect, roleGuard('admin'), deleteTicket);

module.exports = router;