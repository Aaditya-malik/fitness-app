import Workout from '../models/Workout.js';

const PRESET_EXERCISES = {
  'Weight Loss': [
    { name: 'HIIT Kettlebell Swings', sets: 4, reps: 20, targetMuscle: 'Full Body' },
    { name: 'Jump Rope Intervals', sets: 4, reps: 60, targetMuscle: 'Cardio / Calves' },
    { name: 'Dumbbell Thrusters', sets: 3, reps: 15, targetMuscle: 'Legs & Shoulders' },
    { name: 'Mountain Climbers', sets: 3, reps: 30, targetMuscle: 'Core & Endurance' },
    { name: 'Rowing Machine Sprints', sets: 4, reps: 500, targetMuscle: 'Back & Cardio' },
  ],
  'Muscle Gain': [
    { name: 'Barbell Bench Press', sets: 4, reps: 8, targetMuscle: 'Chest' },
    { name: 'Barbell Back Squat', sets: 4, reps: 8, targetMuscle: 'Quadriceps & Glutes' },
    { name: 'Bent-Over Barbell Row', sets: 4, reps: 10, targetMuscle: 'Lats & Upper Back' },
    { name: 'Standing Overhead Press', sets: 3, reps: 8, targetMuscle: 'Deltoids' },
    { name: 'Romanian Deadlift', sets: 3, reps: 10, targetMuscle: 'Hamstrings' },
  ],
  'Strength': [
    { name: 'Conventional Deadlift', sets: 5, reps: 5, targetMuscle: 'Posterior Chain' },
    { name: 'Low Bar Squat', sets: 5, reps: 5, targetMuscle: 'Lower Body & Core' },
    { name: 'Heavy Bench Press', sets: 5, reps: 5, targetMuscle: 'Chest & Triceps' },
    { name: 'Weighted Pull-Ups', sets: 4, reps: 6, targetMuscle: 'Back & Biceps' },
    { name: 'Strict Military Press', sets: 4, reps: 6, targetMuscle: 'Shoulders & Core' },
  ]
};

export const getWorkouts = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { date, goal } = req.query;
    const filter = { userId };
    if (date) filter.date = date;
    if (goal) filter.goal = goal;

    let workouts = await Workout.find(filter);
    // If no workouts found for this specific date and user has a goal, provide preset options
    if (workouts.length === 0 && !date) {
      workouts = await Workout.find({ userId });
    }
    res.json(workouts);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving workouts', error: err.message });
  }
};

export const createWorkout = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { name, sets, reps, targetMuscle, goal, date } = req.body;

    if (!name || !targetMuscle) {
      return res.status(400).json({ message: 'Exercise name and target muscle are required' });
    }

    const workout = await Workout.create({
      userId,
      name,
      sets: sets ? Number(sets) : 3,
      reps: reps ? Number(reps) : 10,
      targetMuscle,
      goal: goal || req.user.goal || 'Muscle Gain',
      completed: false,
      date: date || new Date().toISOString().split('T')[0],
    });

    res.status(201).json(workout);
  } catch (err) {
    res.status(500).json({ message: 'Error creating workout', error: err.message });
  }
};

export const toggleWorkout = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { id } = req.params;

    const workout = await Workout.findById(id);
    if (!workout || workout.userId !== userId) {
      return res.status(404).json({ message: 'Workout not found' });
    }

    const updated = await Workout.findByIdAndUpdate(
      id,
      { completed: !workout.completed },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Error updating workout', error: err.message });
  }
};

export const deleteWorkout = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { id } = req.params;

    const workout = await Workout.findById(id);
    if (!workout || workout.userId !== userId) {
      return res.status(404).json({ message: 'Workout not found' });
    }

    await Workout.findByIdAndDelete(id);
    res.json({ message: 'Workout deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting workout', error: err.message });
  }
};

export const loadPresetGoalWorkouts = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { goal } = req.body;
    const targetGoal = goal || req.user.goal || 'Muscle Gain';
    const presets = PRESET_EXERCISES[targetGoal] || PRESET_EXERCISES['Muscle Gain'];
    const today = new Date().toISOString().split('T')[0];

    const createdList = [];
    for (const item of presets) {
      const created = await Workout.create({
        userId,
        name: item.name,
        sets: item.sets,
        reps: item.reps,
        targetMuscle: item.targetMuscle,
        goal: targetGoal,
        completed: false,
        date: today,
      });
      createdList.push(created);
    }

    res.status(201).json({
      message: `Loaded ${createdList.length} routines for ${targetGoal}`,
      workouts: createdList
    });
  } catch (err) {
    res.status(500).json({ message: 'Error loading preset routines', error: err.message });
  }
};
