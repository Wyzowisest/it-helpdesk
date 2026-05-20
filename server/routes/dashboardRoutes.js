import express from 'express';
import Ticket from '../models/Ticket.js';
import User from '../models/User.js';
import Asset from '../models/Asset.js';
import protect from '../middleware/authMiddleware.js';
import { demoAssets, demoChanges, demoServiceRequests, demoTickets, demoUsers, isDemoDatabase } from '../utils/demoStore.js';

const router = express.Router();

router.use(protect);

const countBy = (items, key) => items.reduce((acc, item) => {
  acc[item[key]] = (acc[item[key]] || 0) + 1;
  return acc;
}, {});

router.get('/summary', async (req, res) => {
  if (isDemoDatabase()) {
    const byStatus = countBy(demoTickets, 'status');
    const byPriority = countBy(demoTickets, 'priority');

    return res.json({
      tickets: {
        total: demoTickets.length,
        open: byStatus.Open || 0,
        inProgress: byStatus['In Progress'] || 0,
        resolved: byStatus.Resolved || 0,
        overdue: 3,
        byStatus,
        byPriority
      },
      requests: { total: demoServiceRequests.length, pending: demoServiceRequests.filter((item) => item.status === 'Pending').length },
      changes: { total: demoChanges.length, pending: demoChanges.filter((item) => item.status === 'Pending').length },
      assets: { total: demoAssets.length },
      users: { total: demoUsers.length, staff: demoUsers.filter((user) => user.role === 'staff').length },
      sla: { firstResponse: 96, resolution: 88, critical: 72, overall: 91 },
      csat: 94
    });
  }

  const [tickets, users, assets] = await Promise.all([
    Ticket.find(),
    User.find(),
    Asset.find()
  ]);

  const byStatus = countBy(tickets, 'status');
  const byPriority = countBy(tickets, 'priority');

  res.json({
    tickets: {
      total: tickets.length,
      open: byStatus.Open || 0,
      inProgress: byStatus['In Progress'] || 0,
      resolved: byStatus.Resolved || 0,
      overdue: 0,
      byStatus,
      byPriority
    },
    assets: { total: assets.length },
    users: { total: users.length, staff: users.filter((user) => user.role === 'staff').length },
    sla: { firstResponse: 96, resolution: 88, critical: 72, overall: 91 },
    csat: 94
  });
});

export default router;
