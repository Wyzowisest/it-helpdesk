import dotenv from 'dotenv';
import mongoose from 'mongoose';

import Asset from '../models/Asset.js';
import AutomationRule from '../models/AutomationRule.js';
import ChangeRequest from '../models/ChangeRequest.js';
import KnowledgeArticle from '../models/KnowledgeArticle.js';
import Problem from '../models/Problem.js';
import ServiceCatalogItem from '../models/ServiceCatalogItem.js';
import ServiceRequest from '../models/ServiceRequest.js';
import Ticket from '../models/Ticket.js';
import User from '../models/User.js';
import {
  demoAssets,
  demoAutomationRules,
  demoCatalogItems,
  demoChanges,
  demoKnowledgeArticles,
  demoProblems,
  demoServiceRequests,
  demoTickets,
  demoUsers
} from '../utils/demoStore.js';

dotenv.config();

const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;

if (!mongoUri || mongoUri === 'your_mongodb_connection_string') {
  console.error('Set MONGODB_URI or MONGO_URI in .env before seeding.');
  process.exit(1);
}

const withoutDemoId = ({ _id, ...data }) => data;

const upsertBy = async (Model, filter, data) => (
  Model.findOneAndUpdate(filter, { $set: withoutDemoId(data) }, { new: true, upsert: true, setDefaultsOnInsert: true })
);

try {
  await mongoose.connect(mongoUri);

  const usersByDemoId = new Map();
  const usersByEmail = new Map();

  for (const demoUser of demoUsers) {
    const user = await upsertBy(User, { email: demoUser.email }, {
      name: demoUser.name,
      email: demoUser.email,
      password: demoUser.password,
      department: demoUser.department,
      role: demoUser.role,
      isActive: demoUser.isActive
    });

    usersByDemoId.set(demoUser._id, user);
    usersByEmail.set(demoUser.email, user);
  }

  for (const item of demoCatalogItems) {
    await upsertBy(ServiceCatalogItem, { name: item.name }, item);
  }

  for (const item of demoAssets) {
    await upsertBy(Asset, { assetTag: item.assetTag }, item);
  }

  for (const item of demoProblems) {
    await upsertBy(Problem, { problemNumber: item.problemNumber }, item);
  }

  for (const item of demoChanges) {
    await upsertBy(ChangeRequest, { changeNumber: item.changeNumber }, item);
  }

  for (const item of demoServiceRequests) {
    await upsertBy(ServiceRequest, { requestNumber: item.requestNumber }, item);
  }

  for (const item of demoAutomationRules) {
    await upsertBy(AutomationRule, { name: item.name }, item);
  }

  const defaultAuthor = usersByEmail.get('sarah.k@company.com') || usersByEmail.get('itdirector@company.com');
  for (const article of demoKnowledgeArticles) {
    const createdBy = usersByDemoId.get(article.createdBy?._id) || defaultAuthor;
    await upsertBy(KnowledgeArticle, { title: article.title }, {
      title: article.title,
      category: article.category,
      content: article.content,
      tags: article.tags,
      views: article.views,
      rating: article.rating,
      published: article.published,
      createdBy: createdBy._id
    });
  }

  for (const item of demoTickets) {
    const createdBy = usersByDemoId.get(item.createdBy?._id) || usersByEmail.get('john.adeyemi@company.com');
    const assignedTo = usersByDemoId.get(item.assignedTo?._id) || null;
    const comments = (item.comments || []).map((comment) => {
      const author = usersByDemoId.get(comment.author?._id) || createdBy;
      return {
        message: comment.message,
        author: author._id,
        authorRole: comment.authorRole,
        createdAt: comment.createdAt,
        updatedAt: comment.createdAt
      };
    });

    await upsertBy(Ticket, { ticketNumber: item.ticketNumber }, {
      ticketNumber: item.ticketNumber,
      type: item.type,
      title: item.title,
      description: item.description,
      category: item.category,
      priority: item.priority,
      status: item.status,
      createdBy: createdBy._id,
      assignedTo: assignedTo?._id || null,
      sla: item.sla,
      comments,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      resolvedAt: item.resolvedAt
    });
  }

  console.log('MongoDB seed complete.');
  console.log('Login: itdirector@company.com / password123');
} catch (error) {
  console.error('MongoDB seed failed:', error);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
