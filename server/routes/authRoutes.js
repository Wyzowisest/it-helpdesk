import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import mongoose from 'mongoose';
import User from '../models/User.js';
import protect, { requireRole } from '../middleware/authMiddleware.js';
import { demoUsers, isDemoDatabase } from '../utils/demoStore.js';
import {
  sendVerificationEmail,
  sendPasswordResetEmail
} from '../utils/emailService.js';

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

const isDatabaseReady = () => isDemoDatabase() || mongoose.connection.readyState === 1;

const databaseUnavailable = (res) => res.status(503).json({
  message: 'Database is not connected. Check your MongoDB connection string, Atlas network access, or switch to demo mode.'
});

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, department, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    if (!isDatabaseReady() && !isDemoDatabase()) return databaseUnavailable(res);

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
        role: 'user'
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
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      department,
      role: 'user',
      verificationToken,
      verificationTokenExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000)
    });

    try {
      await sendVerificationEmail(user, verificationToken);
    } catch (emailError) {
      console.error('Verification email failed:', emailError);
    }

    res.status(201).json({
      message: 'Registration successful. Check your email to verify your account.',
      token: createToken(user),
      user: publicUser(user)
    });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
});

router.post('/invite', protect, requireRole('admin'), async (req, res) => {
  try {
    const { name, email, password, department, role } = req.body;
    const normalizedEmail = email?.toLowerCase();

    if (!name || !normalizedEmail || !password) {
      return res.status(400).json({ message: 'Name, email, and temporary password are required' });
    }
    if (!['admin', 'staff', 'user'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    if (isDemoDatabase()) {
      if (demoUsers.some((user) => user.email === normalizedEmail)) {
        return res.status(409).json({ message: 'Email is already registered' });
      }
      const user = {
        _id: `demo-${Date.now()}`,
        name,
        email: normalizedEmail,
        password: await bcrypt.hash(password, 10),
        department: department || 'General',
        role,
        isActive: true
      };
      demoUsers.push(user);
      return res.status(201).json(publicUser(user));
    }

    if (await User.findOne({ email: normalizedEmail })) {
      return res.status(409).json({ message: 'Email is already registered' });
    }
    const user = await User.create({
      name,
      email: normalizedEmail,
      password: await bcrypt.hash(password, 12),
      department: department || 'General',
      role,
      emailVerified: true
    });
    return res.status(201).json(publicUser(user));
  } catch (error) {
    return res.status(500).json({ message: 'User invitation failed', error: error.message });
  }
});

router.get('/verify-email', async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ message: 'Verification token is required' });
    }

    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpiry: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired verification link' });
    }

    user.emailVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiry = undefined;
    await user.save();

    res.json({ message: 'Email verified successfully. You can now log in.' });
  } catch (error) {
    res.status(500).json({ message: 'Email verification failed', error: error.message });
  }
});

router.post('/forgot-password', async (req, res) => {
  try {
    if (!isDatabaseReady()) return databaseUnavailable(res);

    const response = { message: 'If that email exists, a reset link has been sent.' };

    if (isDemoDatabase()) {
      const demoUser = demoUsers.find((user) => user.email === req.body.email?.toLowerCase());

      if (!demoUser) {
        return res.json(response);
      }

      const token = crypto.randomBytes(32).toString('hex');
      demoUser.resetPasswordToken = token;
      demoUser.resetPasswordExpiry = new Date(Date.now() + 60 * 60 * 1000);

      await sendPasswordResetEmail(demoUser, token);
      return res.json(response);
    }

    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.json(response);
    }

    const token = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpiry = new Date(Date.now() + 60 * 60 * 1000);
    await user.save();

    await sendPasswordResetEmail(user, token);
    res.json(response);
  } catch (error) {
    res.status(500).json({ message: 'Password reset request failed', error: error.message });
  }
});

router.post('/reset-password', async (req, res) => {
  try {
    if (!isDatabaseReady()) return databaseUnavailable(res);

    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ message: 'Token and password are required' });
    }

    if (isDemoDatabase()) {
      const demoUser = demoUsers.find((user) => (
        user.resetPasswordToken === token &&
        user.resetPasswordExpiry &&
        user.resetPasswordExpiry > new Date()
      ));

      if (!demoUser) {
        return res.status(400).json({ message: 'Invalid or expired reset link' });
      }

      demoUser.password = await bcrypt.hash(password, 10);
      demoUser.resetPasswordToken = undefined;
      demoUser.resetPasswordExpiry = undefined;

      return res.json({ message: 'Password reset successful. You can now log in.' });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiry: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset link' });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;
    await user.save();

    res.json({ message: 'Password reset successful. You can now log in.' });
  } catch (error) {
    res.status(500).json({ message: 'Password reset failed', error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    if (!isDatabaseReady() && !isDemoDatabase()) return databaseUnavailable(res);

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
