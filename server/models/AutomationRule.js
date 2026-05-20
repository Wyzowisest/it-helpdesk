import mongoose from 'mongoose';

const automationRuleSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: String,
  trigger: { type: String, required: true },
  conditions: [{ type: String }],
  actions: [{ type: String }],
  active: { type: Boolean, default: true },
  executions: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('AutomationRule', automationRuleSchema);
