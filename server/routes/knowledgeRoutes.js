import express from 'express';
import KnowledgeArticle from '../models/KnowledgeArticle.js';
import protect, { requireRole } from '../middleware/authMiddleware.js';
import { demoKnowledgeArticles, isDemoDatabase, nextId } from '../utils/demoStore.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const { search = '', category } = req.query;

  if (isDemoDatabase()) {
    let articles = demoKnowledgeArticles.filter((article) => article.published);
    if (category) articles = articles.filter((article) => article.category === category);
    if (search) {
      const needle = search.toLowerCase();
      articles = articles.filter((article) => (
        article.title.toLowerCase().includes(needle) ||
        article.content.toLowerCase().includes(needle) ||
        article.tags.some((tag) => tag.toLowerCase().includes(needle))
      ));
    }
    return res.json(articles);
  }

  const query = { published: true };

  if (category) query.category = category;
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { content: { $regex: search, $options: 'i' } },
      { tags: { $regex: search, $options: 'i' } }
    ];
  }

  const articles = await KnowledgeArticle.find(query)
    .populate('createdBy', 'name role')
    .sort({ updatedAt: -1 });

  res.json(articles);
});

router.post('/', protect, requireRole('admin', 'staff'), async (req, res) => {
  if (isDemoDatabase()) {
    const article = {
      _id: nextId('kb'),
      published: true,
      createdBy: req.user,
      views: 0,
      rating: 0,
      ...req.body
    };
    demoKnowledgeArticles.unshift(article);
    return res.status(201).json(article);
  }

  const article = await KnowledgeArticle.create({
    ...req.body,
    createdBy: req.user.id
  });

  res.status(201).json(article);
});

export default router;
