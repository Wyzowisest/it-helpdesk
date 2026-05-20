import express from 'express';
import ChangeRequest from '../models/ChangeRequest.js';
import protect, { requireRole } from '../middleware/authMiddleware.js';
import { demoChanges, isDemoDatabase, nextId } from '../utils/demoStore.js';

const router = express.Router();

router.use(protect);

router.get('/', async (req, res) => {
  if (isDemoDatabase()) return res.json(demoChanges);
  res.json(await ChangeRequest.find().sort({ scheduledAt: 1 }));
});

router.post('/', requireRole('admin', 'staff'), async (req, res) => {
  if (isDemoDatabase()) {
    const change = { _id: nextId('chg'), changeNumber: `CHG-${String(demoChanges.length + 42).padStart(4, '0')}`, status: 'Pending', ...req.body };
    demoChanges.unshift(change);
    return res.status(201).json(change);
  }

  const count = await ChangeRequest.countDocuments();
  res.status(201).json(await ChangeRequest.create({ ...req.body, changeNumber: `CHG-${String(count + 1).padStart(4, '0')}` }));
});

router.patch('/:id/approve', requireRole('admin'), async (req, res) => {
  if (isDemoDatabase()) {
    const change = demoChanges.find((item) => item._id === req.params.id);
    if (!change) return res.status(404).json({ message: 'Change request not found' });
    change.status = 'Approved';
    return res.json(change);
  }

  res.json(await ChangeRequest.findByIdAndUpdate(req.params.id, { status: 'Approved' }, { new: true }));
});

export default router;
