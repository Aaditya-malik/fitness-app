import React, { useState, useEffect, useCallback } from 'react';
import { Utensils, Plus, Trash2, PieChart, Flame, ChevronRight } from 'lucide-react';
import { foodService } from '../services/api.js';
import { useFitness } from '../context/FitnessContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function NutritionTracker() {
  const { user } = useAuth();
  const { refreshDashboard, showToast } = useFitness();

  const [foods, setFoods] = useState([]);
  const [totals, setTotals] = useState({ calories: 0, protein: 0, carbs: 0, fats: 0 });
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // Add food form
  const [name, setName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fats, setFats] = useState('');
  const [mealType, setMealType] = useState('Breakfast');
  const [submitting, setSubmitting] = useState(false);

  const fetchFoods = useCallback(async () => {
    setLoading(true);
    try {
      const data = await foodService.getFoods();
      setFoods(data.foods || []);
      setTotals(data.totals || { calories: 0, protein: 0, carbs: 0, fats: 0 });
    } catch (err) {
      console.error('Error fetching food logs:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFoods();
  }, [fetchFoods]);

  const handleAddFood = async (e) => {
    e.preventDefault();
    if (!name || !calories) return;
    setSubmitting(true);
    try {
      const newFood = await foodService.addFood({
        name,
        calories: Number(calories),
        protein: protein ? Number(protein) : 0,
        carbs: carbs ? Number(carbs) : 0,
        fats: fats ? Number(fats) : 0,
        mealType,
      });
      setFoods((prev) => [newFood, ...prev]);
      setTotals((prev) => ({
        calories: prev.calories + Number(calories),
        protein: prev.protein + (protein ? Number(protein) : 0),
        carbs: prev.carbs + (carbs ? Number(carbs) : 0),
        fats: prev.fats + (fats ? Number(fats) : 0),
      }));
      setName('');
      setCalories('');
      setProtein('');
      setCarbs('');
      setFats('');
      setShowAddModal(false);
      refreshDashboard();
      showToast('Meal logged successfully!');
    } catch (err) {
      showToast('Failed to log meal', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteFood = async (id) => {
    try {
      await foodService.deleteFood(id);
      fetchFoods();
      refreshDashboard();
      showToast('Food entry deleted');
    } catch (err) {
      showToast('Failed to delete food entry', 'error');
    }
  };

  const calorieGoal = user?.calorieGoal || 2200;
  const calPercent = Math.min(100, Math.round((totals.calories / calorieGoal) * 100));

  return (
    <div className="space-y-6">
      {/* Daily Calories & Macros Overview Card */}
      <div className="p-6 rounded-2xl bg-neutral-900/90 border border-neutral-800 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Utensils className="w-5 h-5 text-emerald-400" />
              Daily Nutrition & Macro Balance
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Keep your calories and macronutrients on target for {user?.goal || 'fitness'}
            </p>
          </div>

          <button
            id="nutrition-add-food-btn"
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 text-xs font-bold flex items-center gap-1.5 transition shadow-sm shadow-emerald-500/20"
          >
            <Plus className="w-4 h-4" />
            Log Meal / Food
          </button>
        </div>

        {/* Calorie Bar */}
        <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2">
          <div className="flex justify-between items-baseline">
            <span className="text-xs font-bold text-neutral-300 flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-emerald-400" />
              Total Calories Consumed
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-extrabold text-white">{totals.calories}</span>
              <span className="text-xs text-neutral-400">/ {calorieGoal} kcal</span>
            </div>
          </div>

          <div className="w-full h-2.5 bg-neutral-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${calPercent}%` }}
            />
          </div>

          <div className="flex justify-between text-[11px] text-neutral-400">
            <span>{Math.max(0, calorieGoal - totals.calories)} kcal remaining</span>
            <span>{calPercent}% of daily budget</span>
          </div>
        </div>

        {/* 3 Macro Metrics */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
              Protein
            </span>
            <p className="text-xl font-extrabold text-white mt-0.5">{totals.protein}g</p>
            <span className="text-[10px] text-neutral-400">{Math.round(totals.protein * 4)} kcal</span>
          </div>

          <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
              Carbs
            </span>
            <p className="text-xl font-extrabold text-white mt-0.5">{totals.carbs}g</p>
            <span className="text-[10px] text-neutral-400">{Math.round(totals.carbs * 4)} kcal</span>
          </div>

          <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
              Fats
            </span>
            <p className="text-xl font-extrabold text-white mt-0.5">{totals.fats}g</p>
            <span className="text-[10px] text-neutral-400">{Math.round(totals.fats * 9)} kcal</span>
          </div>
        </div>
      </div>

      {/* Meals Logged List */}
      <div className="p-6 rounded-2xl bg-neutral-900/90 border border-neutral-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">Today&apos;s Food Log</h3>
          <span className="text-xs text-neutral-400">{foods.length} items logged</span>
        </div>

        {loading ? (
          <div className="py-6 text-center text-xs text-neutral-500">Loading meals...</div>
        ) : foods.length === 0 ? (
          <div className="py-8 text-center text-neutral-500 text-xs">
            No foods logged yet today. Click &quot;Log Meal / Food&quot; above.
          </div>
        ) : (
          <div className="space-y-2.5">
            {foods.map((item) => {
              const id = item._id || item.id;
              return (
                <div
                  key={id}
                  id={`food-item-${id}`}
                  className="p-3.5 rounded-xl bg-neutral-950/70 border border-neutral-800/80 hover:border-neutral-700 flex items-center justify-between gap-3 transition"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-800 text-emerald-400 font-semibold uppercase">
                        {item.mealType}
                      </span>
                      <h4 className="text-sm font-semibold text-white truncate">{item.name}</h4>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-neutral-400 mt-1">
                      <span className="text-emerald-400 font-bold">{item.calories} kcal</span>
                      <span>•</span>
                      <span>P: {item.protein}g</span>
                      <span>•</span>
                      <span>C: {item.carbs}g</span>
                      <span>•</span>
                      <span>F: {item.fats}g</span>
                    </div>
                  </div>

                  <button
                    id={`delete-food-${id}`}
                    onClick={() => handleDeleteFood(id)}
                    className="p-2 rounded-lg text-neutral-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
                    title="Delete food entry"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Food Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-400" />
                Log Food / Meal
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-neutral-400 hover:text-white text-xs font-semibold"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleAddFood} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Food Name
                </label>
                <input
                  id="add-food-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Grilled Chicken Breast, Avocado Toast"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm focus:outline-hidden focus:border-emerald-500 transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Calories (kcal)
                  </label>
                  <input
                    id="add-food-calories"
                    type="number"
                    required
                    min="0"
                    value={calories}
                    onChange={(e) => setCalories(e.target.value)}
                    placeholder="e.g. 350"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm focus:outline-hidden focus:border-emerald-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Meal Category
                  </label>
                  <select
                    id="add-food-meal-type"
                    value={mealType}
                    onChange={(e) => setMealType(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm focus:outline-hidden focus:border-emerald-500 transition"
                  >
                    <option value="Breakfast">Breakfast</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Dinner">Dinner</option>
                    <option value="Snack">Snack</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-400 mb-1">
                    Protein (g)
                  </label>
                  <input
                    id="add-food-protein"
                    type="number"
                    min="0"
                    value={protein}
                    onChange={(e) => setProtein(e.target.value)}
                    placeholder="0"
                    className="w-full px-2.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:outline-hidden focus:border-emerald-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-400 mb-1">
                    Carbs (g)
                  </label>
                  <input
                    id="add-food-carbs"
                    type="number"
                    min="0"
                    value={carbs}
                    onChange={(e) => setCarbs(e.target.value)}
                    placeholder="0"
                    className="w-full px-2.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:outline-hidden focus:border-emerald-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-400 mb-1">
                    Fats (g)
                  </label>
                  <input
                    id="add-food-fats"
                    type="number"
                    min="0"
                    value={fats}
                    onChange={(e) => setFats(e.target.value)}
                    placeholder="0"
                    className="w-full px-2.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:outline-hidden focus:border-emerald-500 transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs flex items-center justify-center gap-2 transition disabled:opacity-50"
              >
                {submitting ? 'Logging...' : 'Save Meal to Diary'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
