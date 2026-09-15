import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Workout from '../models/Workout.js';
import Food from '../models/Food.js';
import Water from '../models/Water.js';
import Progress from '../models/Progress.js';

const JWT_SECRET = process.env.JWT_SECRET || 'fittrack_super_secret_jwt_key_2026';

const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: '30d' });
};

// Seed sample starter data for new users to immediately see rich charts & workouts
const seedUserData = async (userId) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    // Seed Workouts
    const workouts = [
      { userId, name: 'Barbell Bench Press', sets: 4, reps: 8, targetMuscle: 'Chest', goal: 'Muscle Gain', completed: true, date: today },
      { userId, name: 'Incline Dumbbell Press', sets: 3, reps: 10, targetMuscle: 'Chest & Shoulders', goal: 'Muscle Gain', completed: true, date: today },
      { userId, name: 'Tricep Rope Pushdown', sets: 3, reps: 12, targetMuscle: 'Triceps', goal: 'Muscle Gain', completed: false, date: today },
      { userId, name: 'Hanging Leg Raises', sets: 3, reps: 15, targetMuscle: 'Core', goal: 'Muscle Gain', completed: false, date: today },
    ];
    for (const w of workouts) {
      await Workout.create(w);
    }

    // Seed Food for today
    const foods = [
      { userId, name: 'Oatmeal with Blueberries & Whey', calories: 450, protein: 32, carbs: 55, fats: 8, mealType: 'Breakfast', date: today },
      { userId, name: 'Grilled Chicken Breast & Quinoa', calories: 620, protein: 48, carbs: 60, fats: 14, mealType: 'Lunch', date: today },
      { userId, name: 'Greek Yogurt & Almonds', calories: 250, protein: 20, carbs: 12, fats: 10, mealType: 'Snack', date: today },
    ];
    for (const f of foods) {
      await Food.create(f);
    }

    // Seed Water for today (e.g. 1500ml logged so far)
    await Water.create({ userId, amount: 1750, date: today });

    // Seed 7 days of progress for rich charts
    const dayOffsets = [6, 5, 4, 3, 2, 1, 0];
    const weightBase = 72.5;
    for (let i = 0; i < dayOffsets.length; i++) {
      const d = new Date();
      d.setDate(d.getDate() - dayOffsets[i]);
      const dateStr = d.toISOString().split('T')[0];
      const weight = Number((weightBase - (i * 0.2) + (Math.sin(i) * 0.15)).toFixed(1));
      const calories = 2100 + Math.floor(Math.sin(i) * 150);
      await Progress.create({
        userId,
        weight,
        calories,
        date: dateStr,
        notes: i === 6 ? 'Feeling strong, hit new PR on bench' : 'Consistent clean nutrition',
      });
    }
  } catch (err) {
    console.error('Error seeding starter data:', err);
  }
};

export const register = async (req, res) => {
  try {
    const { name, email, password, height, weight, goal } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email and password' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      height: height ? Number(height) : 175,
      weight: weight ? Number(weight) : 70,
      goal: goal || 'Muscle Gain',
      calorieGoal: 2200,
      waterGoal: 2500,
      stepsGoal: 10000,
      caloriesBurnedGoal: 500,
    });

    const token = generateToken(newUser._id || newUser.id);
    
    // Seed initial data so dashboard looks vibrant immediately
    await seedUserData(newUser._id || newUser.id);

    const userResponse = { ...newUser };
    delete userResponse.password;

    res.status(201).json({
      message: 'Account created successfully',
      token,
      user: userResponse,
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Server error during registration', error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user._id || user.id);
    const userResponse = { ...user };
    delete userResponse.password;

    res.json({
      message: 'Login successful',
      token,
      user: userResponse,
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login', error: err.message });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id || req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const userResponse = { ...user };
    delete userResponse.password;
    res.json(userResponse);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving user profile', error: err.message });
  }
};

export const demoLogin = async (req, res) => {
  try {
    const demoEmail = 'demo@fittrack.ai';
    let user = await User.findOne({ email: demoEmail });

    if (!user) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('DemoUser123!', salt);
      user = await User.create({
        name: 'Alex Rivera',
        email: demoEmail,
        password: hashedPassword,
        height: 178,
        weight: 73,
        goal: 'Muscle Gain',
        calorieGoal: 2350,
        waterGoal: 2800,
        stepsGoal: 10000,
        caloriesBurnedGoal: 550,
      });
      await seedUserData(user._id || user.id);
    }

    const token = generateToken(user._id || user.id);
    const userResponse = { ...user };
    delete userResponse.password;

    res.json({
      message: 'Demo login successful',
      token,
      user: userResponse,
    });
  } catch (err) {
    console.error('Demo login error:', err);
    res.status(500).json({ message: 'Server error during demo login', error: err.message });
  }
};
