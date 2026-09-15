import { createDualModel } from './modelFactory.js';

const workoutSchema = {
  userId: { type: String, required: true },
  name: { type: String, required: true },
  sets: { type: Number, default: 3 },
  reps: { type: Number, default: 10 },
  targetMuscle: { type: String, required: true },
  goal: { 
    type: String, 
    enum: ['Weight Loss', 'Muscle Gain', 'Strength'], 
    default: 'Muscle Gain' 
  },
  completed: { type: Boolean, default: false },
  date: { type: String, default: () => new Date().toISOString().split('T')[0] },
};

const Workout = createDualModel('Workout', workoutSchema);
export default Workout;
