import express from 'express';
import ServiceCatalogItem from '../models/ServiceCatalogItem.js';
import protect, { requireRole } from '../middleware/authMiddleware.js';
import { demoCatalogItems, isDemoDatabase, nextId } from '../utils/demoStore.js';

const router = express.Router();

router.use(protect);

router.get('/', async (req, res) => {
  const { category, search = '' } = req.query;

  if (isDemoDatabase()) {
    let items = demoCatalogItems.filter((item) => item.active);
    if (category) items = items.filter((item) => item.category === category);
    if (search) items = items.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()));
    return res.json(items);
  }

  const query = { active: true };
  if (category) query.category = category;
  if (search) query.name = { $regex: search, $options: 'i' };
  res.json(await ServiceCatalogItem.find(query).sort({ category: 1, name: 1 }));
});

router.post('/', requireRole('admin', 'staff'), async (req, res) => {
  if (isDemoDatabase()) {
    const item = { _id: nextId('catalog'), active: true, ...req.body };
    demoCatalogItems.unshift(item);
    return res.status(201).json(item);
  }

  res.status(201).json(await ServiceCatalogItem.create(req.body));
});

export default router;
