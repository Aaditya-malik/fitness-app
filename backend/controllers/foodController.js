import Food from '../models/Food.js';

export const getFoods = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { date } = req.query;
    const today = date || new Date().toISOString().split('T')[0];

    const foods = await Food.find({ userId, date: today });
    
    // Calculate macro totals
    const totals = foods.reduce((acc, f) => {
      acc.calories += Number(f.calories || 0);
      acc.protein += Number(f.protein || 0);
      acc.carbs += Number(f.carbs || 0);
      acc.fats += Number(f.fats || 0);
      return acc;
    }, { calories: 0, protein: 0, carbs: 0, fats: 0 });

    res.json({ foods, totals, date: today });
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving food logs', error: err.message });
  }
};

export const addFood = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { name, calories, protein, carbs, fats, mealType, date } = req.body;

    if (!name || calories === undefined || calories === null) {
      return res.status(400).json({ message: 'Food name and calories are required' });
    }

    const food = await Food.create({
      userId,
      name,
      calories: Number(calories),
      protein: protein ? Number(protein) : 0,
      carbs: carbs ? Number(carbs) : 0,
      fats: fats ? Number(fats) : 0,
      mealType: mealType || 'Breakfast',
      date: date || new Date().toISOString().split('T')[0],
    });

    res.status(201).json(food);
  } catch (err) {
    res.status(500).json({ message: 'Error adding food log', error: err.message });
  }
};

export const deleteFood = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { id } = req.params;

    const food = await Food.findById(id);
    if (!food || food.userId !== userId) {
      return res.status(404).json({ message: 'Food item not found' });
    }

    await Food.findByIdAndDelete(id);
    res.json({ message: 'Food deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting food item', error: err.message });
  }
};
