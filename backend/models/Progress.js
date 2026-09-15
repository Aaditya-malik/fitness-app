import { createDualModel } from './modelFactory.js';

const progressSchema = {
  userId: { type: String, required: true },
  weight: { type: Number, required: true }, // in kg
  calories: { type: Number, default: 0 },
  date: { type: String, default: () => new Date().toISOString().split('T')[0] },
  notes: { type: String, default: '' },
};

const Progress = createDualModel('Progress', progressSchema);
export default Progress;
