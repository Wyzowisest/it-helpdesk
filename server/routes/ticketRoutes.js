import express from 'express';
import Ticket from '../models/Ticket.js';
import protect, { requireRole } from '../middleware/authMiddleware.js';
import { demoTickets, isDemoDatabase, nextId } from '../utils/demoStore.js';

const router = express.Router();

router.use(protect);

const ticketLookup = (id) => {
  const lookup = [{ ticketNumber: id }];
  if (id.match(/^[a-f\d]{24}$/i)) lookup.push({ _id: id });
  return { $or: lookup };
};

router.get('/stats', async (req, res) => {
  if (isDemoDatabase()) {
    const tickets = req.user.role === 'user'
      ? demoTickets.filter((ticket) => ticket.createdBy?._id === req.user.id)
      : demoTickets;

    const byStatus = tickets.reduce((acc, ticket) => {
      acc[ticket.status] = (acc[ticket.status] || 0) + 1;
      return acc;
    }, {});

    const byPriority = tickets.reduce((acc, ticket) => {
      acc[ticket.priority] = (acc[ticket.priority] || 0) + 1;
      return acc;
    }, {});

    const byCategory = tickets.reduce((acc, ticket) => {
      acc[ticket.category] = (acc[ticket.category] || 0) + 1;
      return acc;
    }, {});

    return res.json({
      total: tickets.length,
      open: byStatus.Open || 0,
      inProgress: byStatus['In Progress'] || 0,
      resolved: byStatus.Resolved || 0,
      closed: byStatus.Closed || 0,
      byStatus,
      byPriority,
      byCategory
    });
  }

  const scope = req.user.role === 'user' ? { createdBy: req.user.id } : {};
  const tickets = await Ticket.find(scope);

  const byStatus = tickets.reduce((acc, ticket) => {
    acc[ticket.status] = (acc[ticket.status] || 0) + 1;
    return acc;
  }, {});

  const byPriority = tickets.reduce((acc, ticket) => {
    acc[ticket.priority] = (acc[ticket.priority] || 0) + 1;
    return acc;
  }, {});

  const byCategory = tickets.reduce((acc, ticket) => {
    acc[ticket.category] = (acc[ticket.category] || 0) + 1;
    return acc;
  }, {});

  res.json({
    total: tickets.length,
    open: byStatus.Open || 0,
    inProgress: byStatus['In Progress'] || 0,
    resolved: byStatus.Resolved || 0,
    closed: byStatus.Closed || 0,
    byStatus,
    byPriority,
    byCategory
  });
});

router.get('/', async (req, res) => {
  const { search = '', status, priority, category } = req.query;

  if (isDemoDatabase()) {
    let tickets = req.user.role === 'user'
      ? demoTickets.filter((ticket) => ticket.createdBy?._id === req.user.id)
      : [...demoTickets];

    if (status) tickets = tickets.filter((ticket) => ticket.status === status);
    if (priority) tickets = tickets.filter((ticket) => ticket.priority === priority);
    if (category) tickets = tickets.filter((ticket) => ticket.category === category);
    if (search) {
      const needle = search.toLowerCase();
      tickets = tickets.filter((ticket) => ticket.title.toLowerCase().includes(needle) || ticket.description.toLowerCase().includes(needle));
    }

    return res.json(tickets);
  }

  const query = {};

  if (req.user.role === 'user') {
    query.createdBy = req.user.id;
  }

  if (status) query.status = status;
  if (priority) query.priority = priority;
  if (category) query.category = category;
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  const tickets = await Ticket.find(query)
    .populate('createdBy', 'name email department')
    .populate('assignedTo', 'name email role')
    .populate('comments.author', 'name role')
    .sort({ createdAt: -1 });

  res.json(tickets);
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  if (isDemoDatabase()) {
    const ticket = demoTickets.find((item) => item._id === id || item.ticketNumber === id);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
    if (req.user.role === 'user' && ticket.createdBy?._id !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    return res.json(ticket);
  }

  const ticket = await Ticket.findOne(ticketLookup(id))
    .populate('createdBy', 'name email department')
    .populate('assignedTo', 'name email role')
    .populate('comments.author', 'name role');

  if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
  if (req.user.role === 'user' && ticket.createdBy?._id?.toString() !== req.user.id) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  res.json(ticket);
});

router.get('/:id/messages', async (req, res) => {
  const { id } = req.params;

  if (isDemoDatabase()) {
    const ticket = demoTickets.find((item) => item._id === id || item.ticketNumber === id);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
    if (req.user.role === 'user' && ticket.createdBy?._id !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    return res.json(ticket.comments || []);
  }

  const ticket = await Ticket.findOne(ticketLookup(id))
    .populate('comments.author', 'name email role');

  if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
  if (req.user.role === 'user' && ticket.createdBy?.toString() !== req.user.id) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  res.json(ticket.comments);
});

router.post('/', async (req, res) => {
  try {
    const { title, description, category, priority } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }

    if (isDemoDatabase()) {
      const ticket = {
        _id: nextId('ticket'),
        ticketNumber: `INC-${2800 + demoTickets.length + 1}`,
        type: 'Incident',
        title,
        description,
        category: category || 'Other',
        priority: priority || 'Medium',
        status: 'Open',
        createdBy: req.user,
        assignedTo: null,
        comments: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      demoTickets.unshift(ticket);
      return res.status(201).json(ticket);
    }

    const ticketCount = await Ticket.countDocuments();
    const ticket = await Ticket.create({
      ticketNumber: `INC-${2800 + ticketCount + 1}`,
      type: 'Incident',
      title,
      description,
      category,
      priority,
      createdBy: req.user.id
    });

    const populatedTicket = await ticket.populate('createdBy', 'name email department');
    res.status(201).json(populatedTicket);
  } catch (error) {
    res.status(500).json({ message: 'Ticket creation failed', error: error.message });
  }
});

router.patch('/:id', requireRole('admin', 'staff'), async (req, res) => {
  try {
    const { status, priority, assignedTo } = req.body;
    const update = {};

    if (status) {
      update.status = status;
      if (status === 'Resolved') update.resolvedAt = new Date();
      if (status === 'Closed') update.closedAt = new Date();
    }
    if (priority) update.priority = priority;
    if (assignedTo !== undefined) {
      update.assignedTo = assignedTo || null;
      if (assignedTo && !status) update.status = 'Assigned';
    }

    if (isDemoDatabase()) {
      const ticket = demoTickets.find((item) => item._id === req.params.id);
      if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
      Object.assign(ticket, update, { updatedAt: new Date().toISOString() });
      return res.json(ticket);
    }

    const ticket = await Ticket.findByIdAndUpdate(req.params.id, update, { new: true })
      .populate('createdBy', 'name email department')
      .populate('assignedTo', 'name email role')
      .populate('comments.author', 'name role');

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: 'Ticket update failed', error: error.message });
  }
});

const addTicketComment = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ message: 'Comment message is required' });
    }

    if (isDemoDatabase()) {
      const ticket = demoTickets.find((item) => item._id === req.params.id || item.ticketNumber === req.params.id);
      if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
      if (req.user.role === 'user' && ticket.createdBy?._id !== req.user.id) {
        return res.status(403).json({ message: 'Forbidden' });
      }

      const comment = {
        _id: nextId('comment'),
        message,
        author: req.user,
        authorRole: req.user.role,
        createdAt: new Date().toISOString()
      };
      ticket.comments.push(comment);
      ticket.updatedAt = new Date().toISOString();
      return res.status(201).json(comment);
    }

    const ticket = await Ticket.findOne(ticketLookup(req.params.id));
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    if (req.user.role === 'user' && ticket.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    ticket.comments.push({
      message,
      author: req.user.id,
      authorRole: req.user.role
    });

    await ticket.save();
    await ticket.populate('comments.author', 'name role');

    res.status(201).json(ticket.comments[ticket.comments.length - 1]);
  } catch (error) {
    res.status(500).json({ message: 'Comment failed', error: error.message });
  }
};

router.post('/:id/comments', addTicketComment);

router.post('/:id/messages', async (req, res) => {
  req.body.message = req.body.message || req.body.body;

  if (req.body.type === 'internal_note') {
    req.body.message = `[Internal note] ${req.body.message}`;
  }

  return addTicketComment(req, res);
});

export default router;
