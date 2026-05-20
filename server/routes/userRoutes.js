import express from 'express';
import User from '../models/User.js';
import protect, { requireRole } from '../middleware/authMiddleware.js';
import { demoUsers, isDemoDatabase } from '../utils/demoStore.js';

const router = express.Router();

router.use(protect, requireRole('admin'));

router.get('/', async (req, res) => {
  if (isDemoDatabase()) {
    return res.json(demoUsers.map(({ password, ...user }) => user));
  }

  res.json(await User.find().select('-password').sort({ name: 1 }));
});

router.patch('/:id/role', async (req, res) => {
  const { role } = req.body;
  if (!['admin', 'staff', 'user'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role' });
  }

  if (isDemoDatabase()) {
    const user = demoUsers.find((item) => item._id === req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.role = role;
    const { password, ...safeUser } = user;
    return res.json(safeUser);
  }

  res.json(await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password'));
});

export default router;
