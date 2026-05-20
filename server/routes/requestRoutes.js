import express from 'express';
import ServiceRequest from '../models/ServiceRequest.js';
import protect from '../middleware/authMiddleware.js';
import { demoServiceRequests, isDemoDatabase, nextId } from '../utils/demoStore.js';

const router = express.Router();

router.use(protect);

router.get('/', async (req, res) => {
  if (isDemoDatabase()) return res.json(demoServiceRequests);
  res.json(await ServiceRequest.find().populate('catalogItem').sort({ createdAt: -1 }));
});

router.post('/', async (req, res) => {
  if (isDemoDatabase()) {
    const request = {
      _id: nextId('sr'),
      requestNumber: `SR-${String(demoServiceRequests.length + 193).padStart(4, '0')}`,
      requester: req.user.name,
      status: 'Open',
      approvalStatus: 'Awaiting',
      createdAt: new Date().toISOString(),
      ...req.body
    };
    demoServiceRequests.unshift(request);
    return res.status(201).json(request);
  }

  const count = await ServiceRequest.countDocuments();
  res.status(201).json(await ServiceRequest.create({
    ...req.body,
    requester: req.body.requester || req.user.name,
    requestNumber: `SR-${String(count + 1).padStart(4, '0')}`
  }));
});

export default router;
