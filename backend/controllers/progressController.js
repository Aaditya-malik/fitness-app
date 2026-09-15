import Progress from '../models/Progress.js';
import User from '../models/User.js';

export const getProgress = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const progressList = await Progress.find({ userId });
    
    // Sort chronologically by date
    const sorted = [...progressList].sort((a, b) => new Date(a.date) - new Date(b.date));

    res.json(sorted);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving progress data', error: err.message });
  }
};

export const addProgress = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { weight, calories, date, notes } = req.body;

    if (!weight) {
      return res.status(400).json({ message: 'Weight is required' });
    }

    const entryDate = date || new Date().toISOString().split('T')[0];

    // Check if entry already exists for this date; if so, update it
    const existing = await Progress.findOne({ userId, date: entryDate });
    let entry;
    if (existing) {
      entry = await Progress.findByIdAndUpdate(
        existing._id || existing.id,
        {
          weight: Number(weight),
          calories: calories ? Number(calories) : existing.calories,
          notes: notes !== undefined ? notes : existing.notes,
        },
        { new: true }
      );
    } else {
      entry = await Progress.create({
        userId,
        weight: Number(weight),
        calories: calories ? Number(calories) : 0,
        date: entryDate,
        notes: notes || '',
      });
    }

    // Also update current weight on User model
    await User.findByIdAndUpdate(userId, { weight: Number(weight) });

    res.status(201).json(entry);
  } catch (err) {
    res.status(500).json({ message: 'Error recording progress entry', error: err.message });
  }
};

export const deleteProgress = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { id } = req.params;

    const entry = await Progress.findById(id);
    if (!entry || entry.userId !== userId) {
      return res.status(404).json({ message: 'Progress entry not found' });
    }

    await Progress.findByIdAndDelete(id);
    res.json({ message: 'Progress entry removed' });
  } catch (err) {
    res.status(500).json({ message: 'Error removing progress entry', error: err.message });
  }
};
