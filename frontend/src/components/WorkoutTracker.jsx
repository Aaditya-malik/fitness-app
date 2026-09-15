import React, { useState, useEffect, useCallback } from 'react';
import {
  Dumbbell,
  CheckCircle,
  Circle,
  Plus,
  Trash2,
  Sparkles,
  Flame,
  Target,
  RefreshCw,
} from 'lucide-react';
import { workoutService } from '../services/api.js';
import { useFitness } from '../context/FitnessContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function WorkoutTracker() {
  const { user, updateUserProfile } = useAuth();
  const { refreshDashboard, showToast } = useFitness();

  const [selectedGoal, setSelectedGoal] = useState(user?.goal || 'Muscle Gain');
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [sets, setSets] = useState(3);
  const [reps, setReps] = useState(10);
  const [targetMuscle, setTargetMuscle] = useState('Chest');
  const [submitting, setSubmitting] = useState(false);

  const fetchWorkouts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await workoutService.getWorkouts({ goal: selectedGoal });
      setWorkouts(data);
    } catch (err) {
      console.error('Failed to load workouts:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedGoal]);

  useEffect(() => {
    fetchWorkouts();
  }, [fetchWorkouts]);

  const handleGoalChange = async (goal) => {
    setSelectedGoal(goal);
    try {
      await updateUserProfile({ goal });
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggle = async (id) => {
    try {
      const updated = await workoutService.toggleWorkout(id);
      setWorkouts((prev) =>
        prev.map((w) => (w._id === id || w.id === id ? updated : w))
      );
      refreshDashboard();
      if (updated.completed) {
        showToast('Exercise marked completed! +115 kcal burned');
      }
    } catch (err) {
      showToast('Error updating exercise status', 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      await workoutService.deleteWorkout(id);
      setWorkouts((prev) => prev.filter((w) => w._id !== id && w.id !== id));
      refreshDashboard();
      showToast('Exercise removed');
    } catch (err) {
      showToast('Error removing exercise', 'error');
    }
  };

  const handleAddWorkout = async (e) => {
    e.preventDefault();
    if (!name || !targetMuscle) return;
    setSubmitting(true);
    try {
      const created = await workoutService.createWorkout({
        name,
        sets: Number(sets),
        reps: Number(reps),
        targetMuscle,
        goal: selectedGoal,
      });
      setWorkouts((prev) => [created, ...prev]);
      setName('');
      setShowAddModal(false);
      refreshDashboard();
      showToast('Exercise added successfully!');
    } catch (err) {
      showToast('Error adding exercise', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLoadPresets = async () => {
    try {
      const res = await workoutService.loadPresets(selectedGoal);
      fetchWorkouts();
      refreshDashboard();
      showToast(`Loaded routines for ${selectedGoal}`);
    } catch (err) {
      showToast('Failed to load routines', 'error');
    }
  };

  const completedCount = workouts.filter((w) => w.completed).length;
  const progressPercent = workouts.length > 0 ? (completedCount / workouts.length) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Goal Selector & Header */}
      <div className="p-6 rounded-2xl bg-neutral-900/90 border border-neutral-800 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Dumbbell className="w-5 h-5 text-emerald-400" />
              Workout & Training Routine
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Select your primary fitness focus and track completed sets
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="workout-load-presets-btn"
              onClick={handleLoadPresets}
              className="px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700/80 border border-neutral-700 text-neutral-200 text-xs font-semibold flex items-center gap-1.5 transition"
              title="Add recommended exercises for this goal"
            >
              <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
              Load Routines
            </button>

            <button
              id="workout-add-exercise-btn"
              onClick={() => setShowAddModal(true)}
              className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 text-xs font-bold flex items-center gap-1.5 transition shadow-sm shadow-emerald-500/20"
            >
              <Plus className="w-4 h-4" />
              Add Exercise
            </button>
          </div>
        </div>

        {/* Goal Tabs */}
        <div className="grid grid-cols-3 gap-2 p-1.5 bg-neutral-950 rounded-xl border border-neutral-800">
          {['Weight Loss', 'Muscle Gain', 'Strength'].map((goal) => {
            const isSelected = selectedGoal === goal;
            return (
              <button
                key={goal}
                id={`goal-tab-${goal.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => handleGoalChange(goal)}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all text-center ${
                  isSelected
                    ? 'bg-emerald-500 text-neutral-950 shadow-sm shadow-emerald-500/20'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50'
                }`}
              >
                {goal}
              </button>
            );
          })}
        </div>

        {/* Routine Summary */}
        <div className="mt-4 pt-4 border-t border-neutral-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-neutral-300 font-medium">
            <Target className="w-4 h-4 text-emerald-400" />
            <span>
              Target: <strong className="text-white">{selectedGoal}</strong>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-neutral-400">
              Completed: <strong className="text-emerald-400">{completedCount}</strong> / {workouts.length}
            </span>
            <div className="w-24 h-2 bg-neutral-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Exercise List */}
      <div className="space-y-3">
        {loading ? (
          <div className="p-8 text-center text-xs text-neutral-500">Loading workouts...</div>
        ) : workouts.length === 0 ? (
          <div className="p-8 rounded-2xl bg-neutral-900/60 border border-neutral-800 text-center space-y-3">
            <Dumbbell className="w-8 h-8 text-neutral-600 mx-auto" />
            <p className="text-sm font-semibold text-neutral-300">No exercises found for {selectedGoal}</p>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto">
              Click &quot;Load Routines&quot; to populate standard {selectedGoal} exercises or add your own custom movement.
            </p>
            <button
              onClick={handleLoadPresets}
              className="px-4 py-2 rounded-xl bg-emerald-500 text-neutral-950 font-bold text-xs hover:bg-emerald-400 transition"
            >
              Populate Preset Exercises
            </button>
          </div>
        ) : (
          workouts.map((w) => {
            const id = w._id || w.id;
            return (
              <div
                key={id}
                id={`exercise-item-${id}`}
                className={`p-4 rounded-xl border transition-all duration-150 flex items-center justify-between gap-4 ${
                  w.completed
                    ? 'bg-neutral-900/40 border-neutral-800/60 text-neutral-400 opacity-80'
                    : 'bg-neutral-900/90 border-neutral-800 hover:border-neutral-700'
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <button
                    id={`toggle-workout-${id}`}
                    onClick={() => handleToggle(id)}
                    className="shrink-0 transition hover:scale-105"
                    title={w.completed ? 'Mark incomplete' : 'Mark complete'}
                  >
                    {w.completed ? (
                      <CheckCircle className="w-5 h-5 text-emerald-400 fill-emerald-500/20" />
                    ) : (
                      <Circle className="w-5 h-5 text-neutral-500 hover:text-emerald-400" />
                    )}
                  </button>

                  <div className="min-w-0">
                    <h4
                      className={`text-sm font-bold truncate ${
                        w.completed ? 'line-through text-neutral-400' : 'text-white'
                      }`}
                    >
                      {w.name}
                    </h4>
                    <div className="flex items-center gap-3 text-xs text-neutral-400 mt-0.5">
                      <span className="font-semibold text-emerald-400/90">
                        {w.sets} sets × {w.reps} reps
                      </span>
                      <span>•</span>
                      <span className="truncate">{w.targetMuscle}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="hidden sm:inline-block text-[11px] px-2 py-0.5 rounded-md bg-neutral-800 text-neutral-400 font-medium">
                    {w.targetMuscle}
                  </span>
                  <button
                    id={`delete-workout-${id}`}
                    onClick={() => handleDelete(id)}
                    className="p-2 rounded-lg text-neutral-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
                    title="Delete exercise"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Exercise Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-400" />
                Add New Exercise
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-neutral-400 hover:text-white text-xs font-semibold"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleAddWorkout} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Exercise Name
                </label>
                <input
                  id="add-exercise-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Incline Dumbbell Press"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm focus:outline-hidden focus:border-emerald-500 transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Sets
                  </label>
                  <input
                    id="add-exercise-sets"
                    type="number"
                    min="1"
                    max="20"
                    value={sets}
                    onChange={(e) => setSets(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm focus:outline-hidden focus:border-emerald-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Reps
                  </label>
                  <input
                    id="add-exercise-reps"
                    type="number"
                    min="1"
                    max="100"
                    value={reps}
                    onChange={(e) => setReps(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm focus:outline-hidden focus:border-emerald-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Target Muscle Group
                </label>
                <input
                  id="add-exercise-muscle"
                  type="text"
                  required
                  value={targetMuscle}
                  onChange={(e) => setTargetMuscle(e.target.value)}
                  placeholder="e.g. Chest, Quads, Back, Delts, Core"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm focus:outline-hidden focus:border-emerald-500 transition"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs flex items-center justify-center gap-2 transition disabled:opacity-50"
              >
                {submitting ? 'Saving...' : 'Add Exercise to Routine'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
