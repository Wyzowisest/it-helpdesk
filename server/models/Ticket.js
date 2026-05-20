import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  authorRole: {
    type: String,
    enum: ['admin', 'staff', 'user'],
    required: true
  }
}, { timestamps: true });

const ticketSchema = new mongoose.Schema({
  ticketNumber: {
    type: String,
    unique: true,
    sparse: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['Incident', 'Request'],
    default: 'Incident'
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    enum: ['Hardware', 'Software', 'Network', 'Email', 'Account Access', 'Other'],
    default: 'Other'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium'
  },
  status: {
    type: String,
    enum: ['Open', 'Assigned', 'In Progress', 'Resolved', 'Closed'],
    default: 'Open'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  sla: {
    firstResponseMet: Boolean,
    resolutionDue: String,
    target: String
  },
  comments: [commentSchema],
  attachments: [{
    filename: String,
    path: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  resolvedAt: Date,
  closedAt: Date
}, { timestamps: true });

export default mongoose.model('Ticket', ticketSchema);
