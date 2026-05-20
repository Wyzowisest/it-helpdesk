import mongoose from 'mongoose';

const problemSchema = new mongoose.Schema({
  problemNumber: { type: String, required: true, unique: true },
  title: { type: String, required: true, trim: true },
  rootCauseStatus: { type: String, default: 'Under investigation' },
  linkedIncidents: { type: Number, default: 0 },
  priority: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'Medium' },
  status: { type: String, enum: ['Open', 'In Progress', 'Known Error', 'Resolved', 'Closed'], default: 'Open' },
  owner: String
}, { timestamps: true });

export default mongoose.model('Problem', problemSchema);
