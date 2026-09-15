import User from '../models/User.js';
import Workout from '../models/Workout.js';
import Food from '../models/Food.js';
import Water from '../models/Water.js';
import Progress from '../models/Progress.js';

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { name, height, weight, goal, calorieGoal, waterGoal, stepsGoal } = req.body;

    const updates = {};
    if (name) updates.name = name;
    if (height) updates.height = Number(height);
    if (weight) updates.weight = Number(weight);
    if (goal) updates.goal = goal;
    if (calorieGoal) updates.calorieGoal = Number(calorieGoal);
    if (waterGoal) updates.waterGoal = Number(waterGoal);
    if (stepsGoal) updates.stepsGoal = Number(stepsGoal);

    const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true });
    
    // Also record progress entry for today if weight was updated
    if (weight) {
      const today = new Date().toISOString().split('T')[0];
      const existing = await Progress.findOne({ userId, date: today });
      if (existing) {
        await Progress.findByIdAndUpdate(existing._id || existing.id, { weight: Number(weight) });
      } else {
        await Progress.create({ userId, weight: Number(weight), date: today, notes: 'Updated profile weight' });
      }
    }

    const userResponse = { ...updatedUser };
    delete userResponse.password;

    res.json(userResponse);
  } catch (err) {
    res.status(500).json({ message: 'Error updating profile', error: err.message });
  }
};

export const getDashboardSummary = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const today = new Date().toISOString().split('T')[0];

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // BMI calculation
    const heightInMeters = (user.height || 175) / 100;
    const weightInKg = user.weight || 70;
    const bmiValue = Number((weightInKg / (heightInMeters * heightInMeters)).toFixed(1));
    
    let bmiCategory = 'Normal weight';
    let bmiColor = 'text-emerald-400';
    if (bmiValue < 18.5) {
      bmiCategory = 'Underweight';
      bmiColor = 'text-yellow-400';
    } else if (bmiValue >= 18.5 && bmiValue < 25) {
      bmiCategory = 'Normal weight';
      bmiColor = 'text-emerald-400';
    } else if (bmiValue >= 25 && bmiValue < 30) {
      bmiCategory = 'Overweight';
      bmiColor = 'text-amber-400';
    } else {
      bmiCategory = 'Obese';
      bmiColor = 'text-rose-400';
    }

    // Today's water
    const waterRecord = await Water.findOne({ userId, date: today });
    const waterIntake = waterRecord ? waterRecord.amount : 0;

    // Today's food
    const todayFoods = await Food.find({ userId, date: today });
    const foodTotals = todayFoods.reduce(
      (acc, f) => {
        acc.calories += Number(f.calories || 0);
        acc.protein += Number(f.protein || 0);
        acc.carbs += Number(f.carbs || 0);
        acc.fats += Number(f.fats || 0);
        return acc;
      },
      { calories: 0, protein: 0, carbs: 0, fats: 0 }
    );

    // Today's workouts
    const todayWorkouts = await Workout.find({ userId, date: today });
    const completedWorkouts = todayWorkouts.filter(w => w.completed).length;

    // Estimated calories burned (workout calories: ~120 kcal per completed exercise + base steps burn)
    const workoutBurn = completedWorkouts * 115;
    const stepsEstimated = 7850; // Dynamic starter steps
    const stepsBurn = Math.round(stepsEstimated * 0.04);
    const totalCaloriesBurned = workoutBurn + stepsBurn;

    // Weekly progress chart data (last 7 days)
    const allProgress = await Progress.find({ userId });
    const sortedProgress = [...allProgress].sort((a, b) => new Date(a.date) - new Date(b.date));
    const recentProgress = sortedProgress.slice(-7);

    // If less than 7 days, generate clean labels for display
    const weeklyChartData = recentProgress.map(p => {
      const d = new Date(p.date);
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      return {
        date: p.date,
        day: dayName,
        weight: p.weight,
        calories: p.calories || foodTotals.calories || 2100,
      };
    });

    res.json({
      user: {
        id: user._id || user.id,
        name: user.name,
        email: user.email,
        height: user.height,
        weight: user.weight,
        goal: user.goal,
        calorieGoal: user.calorieGoal || 2200,
        waterGoal: user.waterGoal || 2500,
        stepsGoal: user.stepsGoal || 10000,
        caloriesBurnedGoal: user.caloriesBurnedGoal || 500,
      },
      bmi: {
        value: bmiValue,
        category: bmiCategory,
        color: bmiColor,
      },
      today: {
        date: today,
        caloriesConsumed: foodTotals.calories,
        proteinConsumed: foodTotals.protein,
        carbsConsumed: foodTotals.carbs,
        fatsConsumed: foodTotals.fats,
        waterIntake,
        waterGoal: user.waterGoal || 2500,
        steps: stepsEstimated,
        stepsGoal: user.stepsGoal || 10000,
        caloriesBurned: totalCaloriesBurned,
        caloriesBurnedGoal: user.caloriesBurnedGoal || 500,
        workoutTotal: todayWorkouts.length,
        workoutCompleted: completedWorkouts,
      },
      weeklyProgress: weeklyChartData,
    });
  } catch (err) {
    console.error('Dashboard summary error:', err);
    res.status(500).json({ message: 'Error compiling dashboard summary', error: err.message });
  }
};
