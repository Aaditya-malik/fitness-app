import { createDualModel } from './modelFactory.js';

const foodSchema = {
  userId: { type: String, required: true },
  name: { type: String, required: true },
  calories: { type: Number, required: true },
  protein: { type: Number, default: 0 },
  carbs: { type: Number, default: 0 },
  fats: { type: Number, default: 0 },
  mealType: { 
    type: String, 
    enum: ['Breakfast', 'Lunch', 'Dinner', 'Snack'], 
    default: 'Breakfast' 
  },
  date: { type: String, default: () => new Date().toISOString().split('T')[0] },
};

const Food = createDualModel('Food', foodSchema);
export default Food;
