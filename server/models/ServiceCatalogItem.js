import mongoose from 'mongoose';

const serviceCatalogItemSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  sla: { type: String, default: '1 business day' },
  approvalRequired: { type: Boolean, default: false },
  active: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('ServiceCatalogItem', serviceCatalogItemSchema);
