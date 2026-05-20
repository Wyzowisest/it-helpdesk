import express from 'express';
import Asset from '../models/Asset.js';
import protect, { requireRole } from '../middleware/authMiddleware.js';
import { demoAssets, isDemoDatabase, nextId } from '../utils/demoStore.js';

const router = express.Router();

router.use(protect);

router.get('/', async (req, res) => {
  const { search = '', type, status } = req.query;

  if (isDemoDatabase()) {
    let assets = [...demoAssets];
    if (type) assets = assets.filter((asset) => asset.type === type);
    if (status) assets = assets.filter((asset) => asset.status === status);
    if (search) {
      const needle = search.toLowerCase();
      assets = assets.filter((asset) => [asset.assetTag, asset.name, asset.assignedTo].some((value) => value.toLowerCase().includes(needle)));
    }
    return res.json(assets);
  }

  const query = {};
  if (type) query.type = type;
  if (status) query.status = status;
  if (search) query.$or = [{ assetTag: { $regex: search, $options: 'i' } }, { name: { $regex: search, $options: 'i' } }, { assignedTo: { $regex: search, $options: 'i' } }];

  res.json(await Asset.find(query).sort({ createdAt: -1 }));
});

router.post('/', requireRole('admin', 'staff'), async (req, res) => {
  if (isDemoDatabase()) {
    const asset = { _id: nextId('asset'), ...req.body };
    demoAssets.unshift(asset);
    return res.status(201).json(asset);
  }

  res.status(201).json(await Asset.create(req.body));
});

export default router;
