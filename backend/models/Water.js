import { createDualModel } from './modelFactory.js';

const waterSchema = {
  userId: { type: String, required: true },
  amount: { type: Number, required: true }, // in ml
  date: { type: String, default: () => new Date().toISOString().split('T')[0] },
};

const Water = createDualModel('Water', waterSchema);
export default Water;
