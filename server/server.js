import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

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

dotenv.config();

const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
const app = express();

app.use(cors());
app.use(express.json());

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

if (isDemoDatabase()) {
  console.log('MongoDB not configured. Using demo in-memory auth store.');
} else {
  mongoose.connect(mongoUri)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));
}

app.get('/', (req, res) => {
  res.send('IT Help Desk API Running');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
