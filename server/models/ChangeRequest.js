import mongoose from 'mongoose';

const changeRequestSchema = new mongoose.Schema({
  changeNumber: { type: String, required: true, unique: true },
  title: { type: String, required: true, trim: true },
  type: { type: String, enum: ['Standard', 'Normal', 'Emergency'], default: 'Standard' },
  risk: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Low' },
  status: { type: String, enum: ['Pending', 'Approved', 'Scheduled', 'Completed', 'Failed', 'Rejected'], default: 'Pending' },
  requester: String,
  scheduledAt: Date
}, { timestamps: true });

export default mongoose.model('ChangeRequest', changeRequestSchema);
