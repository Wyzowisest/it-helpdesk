import express from 'express';
import AutomationRule from '../models/AutomationRule.js';
import protect, { requireRole } from '../middleware/authMiddleware.js';
import { demoAutomationRules, isDemoDatabase, nextId } from '../utils/demoStore.js';

const router = express.Router();

router.use(protect, requireRole('admin', 'staff'));

router.get('/', async (req, res) => {
  if (isDemoDatabase()) return res.json(demoAutomationRules);
  res.json(await AutomationRule.find().sort({ createdAt: -1 }));
});

router.post('/', async (req, res) => {
  if (isDemoDatabase()) {
    const rule = { _id: nextId('rule'), active: true, executions: 0, ...req.body };
    demoAutomationRules.unshift(rule);
    return res.status(201).json(rule);
  }

  res.status(201).json(await AutomationRule.create(req.body));
});

router.patch('/:id/toggle', async (req, res) => {
  if (isDemoDatabase()) {
    const rule = demoAutomationRules.find((item) => item._id === req.params.id);
    if (!rule) return res.status(404).json({ message: 'Automation rule not found' });
    rule.active = !rule.active;
    return res.json(rule);
  }

  const rule = await AutomationRule.findById(req.params.id);
  if (!rule) return res.status(404).json({ message: 'Automation rule not found' });
  rule.active = !rule.active;
  await rule.save();
  res.json(rule);
});

export default router;
