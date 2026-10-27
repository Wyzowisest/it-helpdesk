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

router.delete('/:id', async (req, res) => {
  if (isDemoDatabase()) {
    const userIndex = demoUsers.findIndex((item) => item._id === req.params.id);
    if (userIndex === -1) return res.status(404).json({ message: 'User not found' });

    const target = demoUsers[userIndex];
    if (target._id === req.user.id) {
      return res.status(400).json({ message: 'You cannot delete your own account' });
    }
    if (target.role === 'admin' && target.isActive !== false && demoUsers.filter((item) => item.role === 'admin' && item.isActive !== false).length <= 1) {
      return res.status(400).json({ message: 'The last active administrator cannot be deleted' });
    }

    demoUsers.splice(userIndex, 1);
    return res.json({ message: 'User deleted successfully' });
  }

  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }

  const target = await User.findById(req.params.id);
  if (!target) return res.status(404).json({ message: 'User not found' });
  if (target._id.toString() === req.user.id) {
    return res.status(400).json({ message: 'You cannot delete your own account' });
  }
  if (target.role === 'admin' && target.isActive && await User.countDocuments({ role: 'admin', isActive: true }) <= 1) {
    return res.status(400).json({ message: 'The last active administrator cannot be deleted' });
  }

  await target.deleteOne();
  res.json({ message: 'User deleted successfully' });
});

export default router;
