import mongoose from 'mongoose';

const assetSchema = new mongoose.Schema({
  assetTag: { type: String, required: true, unique: true, trim: true },
  name: { type: String, required: true, trim: true },
  type: { type: String, enum: ['Laptop', 'Desktop', 'Printer', 'Server', 'Network', 'Software', 'Other'], default: 'Other' },
  assignedTo: { type: String, default: 'Unassigned' },
  status: { type: String, enum: ['In use', 'Active', 'In stock', 'Under repair', 'Retired'], default: 'In stock' },
  location: String,
  purchasedAt: Date,
  warrantyUntil: Date
}, { timestamps: true });

export default mongoose.model('Asset', assetSchema);
