import express from 'express';
import Ticket from '../models/Ticket.js';
import User from '../models/User.js';
import protect, { requireRole } from '../middleware/authMiddleware.js';
import { demoTickets, isDemoDatabase } from '../utils/demoStore.js';

const router = express.Router();

router.use(protect, requireRole('admin', 'staff'));

const countBy = (items, key) => items.reduce((acc, item) => {
  acc[item[key]] = (acc[item[key]] || 0) + 1;
  return acc;
}, {});

router.get('/service-desk', async (req, res) => {
  const tickets = isDemoDatabase()
    ? demoTickets
    : await Ticket.find().populate('assignedTo', 'name');
  const agents = isDemoDatabase()
    ? []
    : await User.find({ role: { $in: ['admin', 'staff'] } }).select('name');
  const resolvedTickets = tickets.filter((ticket) => ['Resolved', 'Closed'].includes(ticket.status));
  const agentPerformance = agents.map((agent) => {
    const assigned = tickets.filter((ticket) => ticket.assignedTo?._id?.toString() === agent._id.toString());
    const resolved = assigned.filter((ticket) => ['Resolved', 'Closed'].includes(ticket.status));
    return {
      agent: agent.name,
      assigned: assigned.length,
      resolved: resolved.length,
      csat: 0,
      slaMet: assigned.length ? Math.round((resolved.length / assigned.length) * 100) : 0
    };
  });

  res.json({
    totalTickets: tickets.length,
    resolutionRate: tickets.length ? Math.round((resolvedTickets.length / tickets.length) * 100) : 0,
    averageResolutionTime: '0h',
    csat: 0,
    byCategory: countBy(tickets, 'category'),
    byStatus: countBy(tickets, 'status'),
    byPriority: countBy(tickets, 'priority'),
    agentPerformance
  });
});

export default router;
