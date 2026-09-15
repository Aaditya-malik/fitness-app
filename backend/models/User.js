import { createDualModel } from './modelFactory.js';

const userSchema = {
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  height: { type: Number, default: 175 }, // in cm
  weight: { type: Number, default: 70 }, // in kg
  goal: { 
    type: String, 
    enum: ['Weight Loss', 'Muscle Gain', 'Strength'], 
    default: 'Muscle Gain' 
  },
  calorieGoal: { type: Number, default: 2200 },
  waterGoal: { type: Number, default: 2500 }, // in ml
  stepsGoal: { type: Number, default: 10000 },
  caloriesBurnedGoal: { type: Number, default: 500 },
};

const User = createDualModel('User', userSchema);
export default User;
