import express from 'express';
import Problem from '../models/Problem.js';
import protect, { requireRole } from '../middleware/authMiddleware.js';
import { demoProblems, isDemoDatabase, nextId } from '../utils/demoStore.js';

const router = express.Router();

router.use(protect);

router.get('/', async (req, res) => {
  if (isDemoDatabase()) return res.json(demoProblems);
  res.json(await Problem.find().sort({ createdAt: -1 }));
});

router.post('/', requireRole('admin', 'staff'), async (req, res) => {
  if (isDemoDatabase()) {
    const problem = { _id: nextId('prb'), problemNumber: `PRB-${String(demoProblems.length + 16).padStart(4, '0')}`, status: 'Open', ...req.body };
    demoProblems.unshift(problem);
    return res.status(201).json(problem);
  }

  const count = await Problem.countDocuments();
  res.status(201).json(await Problem.create({ ...req.body, problemNumber: `PRB-${String(count + 1).padStart(4, '0')}` }));
});

export default router;
