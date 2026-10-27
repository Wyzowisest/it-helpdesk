import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/authRoutes.js';
import ticketRoutes from './routes/ticketRoutes.js';
import knowledgeRoutes from './routes/knowledgeRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import assetRoutes from './routes/assetRoutes.js';
import catalogRoutes from './routes/catalogRoutes.js';
import requestRoutes from './routes/requestRoutes.js';
import problemRoutes from './routes/problemRoutes.js';
import changeRoutes from './routes/changeRoutes.js';
import automationRoutes from './routes/automationRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { isDemoDatabase } from './utils/demoStore.js';

const serverDirectory = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(serverDirectory, '.env') });

const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
const app = express();
const production = process.env.NODE_ENV === 'production';
if (!production && (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32)) {
  process.env.JWT_SECRET = 'local-development-only-secret-change-before-deploy-2026';
}
const allowedOrigins = (process.env.CLIENT_ORIGIN || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  throw new Error('JWT_SECRET must be configured with at least 32 characters.');
}

if (production && isDemoDatabase()) {
  throw new Error('MONGODB_URI is required in production; refusing to start with in-memory demo data.');
}

if (production && !allowedOrigins.length) {
  throw new Error('CLIENT_ORIGIN must contain the deployed frontend origin in production.');
}

app.use(cors({
  origin(origin, callback) {
    if (!origin || !production || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Origin is not allowed by CORS.'));
  }
}));
app.use(express.json());

app.get('/health', (req, res) => {
  const demoMode = isDemoDatabase();
  const databaseConnected = mongoose.connection.readyState === 1;
  const healthy = demoMode || databaseConnected;

  res.status(healthy ? 200 : 503).json({
    status: healthy ? 'ok' : 'unavailable',
    database: demoMode ? 'demo' : databaseConnected ? 'connected' : 'disconnected'
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/knowledge', knowledgeRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/catalog', catalogRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/problems', problemRoutes);
app.use('/api/changes', changeRoutes);
app.use('/api/automation', automationRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/users', userRoutes);

const startServer = async () => {
  if (isDemoDatabase()) {
    console.log('MongoDB not configured. Using demo in-memory auth store.');
  } else {
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 10000 });
    console.log('MongoDB connected');
  }

  app.get('/', (req, res) => {
    res.send('IT Help Desk API Running');
  });

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer().catch((error) => {
  console.error('Server startup failed:', error.message);
  process.exit(1);
});
