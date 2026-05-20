import express from 'express';
import Ticket from '../models/Ticket.js';
import protect, { requireRole } from '../middleware/authMiddleware.js';
import { demoTickets, isDemoDatabase } from '../utils/demoStore.js';

const router = express.Router();

router.use(protect, requireRole('admin', 'staff'));

const countBy = (items, key) => items.reduce((acc, item) => {
  acc[item[key]] = (acc[item[key]] || 0) + 1;
  return acc;
}, {});

router.get('/service-desk', async (req, res) => {
  const tickets = isDemoDatabase() ? demoTickets : await Ticket.find();

  res.json({
    totalTickets: tickets.length,
    resolutionRate: 91,
    averageResolutionTime: '4.1h',
    csat: 94,
    byCategory: countBy(tickets, 'category'),
    byStatus: countBy(tickets, 'status'),
    byPriority: countBy(tickets, 'priority'),
    agentPerformance: [
      { agent: 'Sarah K.', assigned: 48, resolved: 44, csat: 97, slaMet: 95 },
      { agent: 'Michael O.', assigned: 61, resolved: 55, csat: 92, slaMet: 88 },
      { agent: 'Amaka A.', assigned: 52, resolved: 49, csat: 95, slaMet: 93 }
    ]
  });
});

export default router;
