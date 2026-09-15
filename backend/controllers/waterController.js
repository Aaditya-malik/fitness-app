import Water from '../models/Water.js';

export const getWater = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { date } = req.query;
    const today = date || new Date().toISOString().split('T')[0];

    const record = await Water.findOne({ userId, date: today });
    const currentAmount = record ? record.amount : 0;

    res.json({
      amount: currentAmount,
      date: today,
      goal: req.user.waterGoal || 2500,
    });
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving water log', error: err.message });
  }
};

export const updateWater = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { delta, amount, date } = req.body;
    const today = date || new Date().toISOString().split('T')[0];

    let record = await Water.findOne({ userId, date: today });
    let newAmount = 0;

    if (amount !== undefined) {
      newAmount = Math.max(0, Number(amount));
    } else if (delta !== undefined) {
      const existing = record ? record.amount : 0;
      newAmount = Math.max(0, existing + Number(delta));
    }

    if (record) {
      record = await Water.findByIdAndUpdate(
        record._id || record.id,
        { amount: newAmount },
        { new: true }
      );
    } else {
      record = await Water.create({
        userId,
        amount: newAmount,
        date: today,
      });
    }

    res.json({
      amount: record.amount,
      date: today,
      goal: req.user.waterGoal || 2500,
    });
  } catch (err) {
    res.status(500).json({ message: 'Error updating water log', error: err.message });
  }
};

export const resetWater = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { date } = req.body;
    const today = date || new Date().toISOString().split('T')[0];

    let record = await Water.findOne({ userId, date: today });
    if (record) {
      await Water.findByIdAndUpdate(record._id || record.id, { amount: 0 }, { new: true });
    }

    res.json({ amount: 0, date: today, goal: req.user.waterGoal || 2500 });
  } catch (err) {
    res.status(500).json({ message: 'Error resetting water log', error: err.message });
  }
};
