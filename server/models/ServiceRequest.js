import mongoose from 'mongoose';

const serviceRequestSchema = new mongoose.Schema({
  requestNumber: { type: String, required: true, unique: true },
  title: { type: String, required: true, trim: true },
  requester: { type: String, required: true },
  department: String,
  catalogItem: { type: mongoose.Schema.Types.ObjectId, ref: 'ServiceCatalogItem' },
  status: { type: String, enum: ['Open', 'Pending', 'In Progress', 'Fulfilled', 'Rejected'], default: 'Open' },
  approvalStatus: { type: String, enum: ['Not Required', 'Awaiting', 'Approved', 'Rejected'], default: 'Not Required' },
  dueDate: Date
}, { timestamps: true });

export default mongoose.model('ServiceRequest', serviceRequestSchema);
