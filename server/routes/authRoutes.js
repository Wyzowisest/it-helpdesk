import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import protect, { requireRole } from '../middleware/authMiddleware.js';
import { demoUsers, isDemoDatabase } from '../utils/demoStore.js';

const router = express.Router();

const createToken = (user) => jwt.sign(
  {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role
  },
  process.env.JWT_SECRET,
  { expiresIn: '7d' }
);

const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  department: user.department
});

const isValidDemoPassword = async (user, password) => (
  password === 'password123' || await bcrypt.compare(password, user.password)
);

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, department, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    if (isDemoDatabase()) {
      const existingDemoUser = demoUsers.find((user) => user.email === email.toLowerCase());

      if (existingDemoUser) {
        return res.status(409).json({ message: 'Email is already registered' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const demoUser = {
        _id: `demo-${Date.now()}`,
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        department: department || 'General',
        role: ['admin', 'staff', 'user'].includes(role) ? role : 'user'
      };

      demoUsers.push(demoUser);

      return res.status(201).json({
        token: createToken(demoUser),
        user: publicUser(demoUser)
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email is already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      department,
      role: ['admin', 'staff', 'user'].includes(role) ? role : 'user'
    });

    res.status(201).json({
      token: createToken(user),
      user: publicUser(user)
    });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (isDemoDatabase()) {
      const demoUser = demoUsers.find((user) => user.email === email.toLowerCase());

      if (!demoUser || !(await isValidDemoPassword(demoUser, password))) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      return res.json({
        token: createToken(demoUser),
        user: publicUser(demoUser)
      });
    }

    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      token: createToken(user),
      user: publicUser(user)
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

router.get('/me', protect, async (req, res) => {
  if (isDemoDatabase()) {
    const user = demoUsers.find((demoUser) => demoUser._id === req.user.id);
    return res.json(user ? publicUser(user) : null);
  }

  const user = await User.findById(req.user.id).select('-password');
  res.json(user);
});

router.get('/staff', protect, requireRole('admin', 'staff'), async (req, res) => {
  if (isDemoDatabase()) {
    const staff = demoUsers
      .filter((user) => ['admin', 'staff'].includes(user.role))
      .map(publicUser)
      .sort((a, b) => a.name.localeCompare(b.name));

    return res.json(staff);
  }

  const staff = await User.find({ role: { $in: ['admin', 'staff'] }, isActive: true })
    .select('name email role department')
    .sort({ name: 1 });

  res.json(staff);
});

export default router;
