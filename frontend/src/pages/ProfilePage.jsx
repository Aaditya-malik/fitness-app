import React, { useState } from 'react';
import { User, Save, CheckCircle2, ShieldCheck, Mail, Target, Award } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useFitness } from '../context/FitnessContext.jsx';

export default function ProfilePage() {
  const { user, updateUserProfile } = useAuth();
  const { refreshDashboard, showToast } = useFitness();

  const [name, setName] = useState(user?.name || '');
  const [height, setHeight] = useState(user?.height || 175);
  const [weight, setWeight] = useState(user?.weight || 70);
  const [goal, setGoal] = useState(user?.goal || 'Muscle Gain');
  const [calorieGoal, setCalorieGoal] = useState(user?.calorieGoal || 2200);
  const [waterGoal, setWaterGoal] = useState(user?.waterGoal || 2500);
  const [stepsGoal, setStepsGoal] = useState(user?.stepsGoal || 10000);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateUserProfile({
        name,
        height: Number(height),
        weight: Number(weight),
        goal,
        calorieGoal: Number(calorieGoal),
        waterGoal: Number(waterGoal),
        stepsGoal: Number(stepsGoal),
      });
      await refreshDashboard();
      showToast('Profile and fitness goals updated successfully!');
    } catch (err) {
      showToast('Failed to update profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Profile Overview Card */}
      <div className="p-6 rounded-2xl bg-neutral-900/90 border border-neutral-800 shadow-sm flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-extrabold text-2xl shadow-sm shadow-emerald-500/20">
          {name ? name.charAt(0).toUpperCase() : 'U'}
        </div>
        <div>
          <h2 className="text-xl font-black text-white">{name || 'Athlete'}</h2>
          <p className="text-xs text-neutral-400 flex items-center gap-1.5 mt-0.5">
            <Mail className="w-3.5 h-3.5 text-neutral-500" />
            {user?.email}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[11px] px-2.5 py-0.5 rounded-md font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {goal}
            </span>
            <span className="text-[11px] text-neutral-400">
              {weight} kg • {height} cm
            </span>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <div className="p-6 rounded-2xl bg-neutral-900/90 border border-neutral-800 shadow-sm space-y-5">
        <div className="border-b border-neutral-800 pb-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Target className="w-4 h-4 text-emerald-400" />
            Edit Fitness Parameters & Goals
          </h3>
          <p className="text-xs text-neutral-400 mt-0.5">
            These targets synchronize across your dashboard metrics and AI recommendation models.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              Full Name
            </label>
            <input
              id="profile-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm focus:outline-hidden focus:border-emerald-500 transition"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Height (cm)
              </label>
              <input
                id="profile-height"
                type="number"
                min="100"
                max="250"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm focus:outline-hidden focus:border-emerald-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Weight (kg)
              </label>
              <input
                id="profile-weight"
                type="number"
                min="30"
                max="250"
                step="0.1"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm focus:outline-hidden focus:border-emerald-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              Primary Fitness Goal
            </label>
            <select
              id="profile-goal"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm focus:outline-hidden focus:border-emerald-500 transition"
            >
              <option value="Weight Loss">Weight Loss</option>
              <option value="Muscle Gain">Muscle Gain</option>
              <option value="Strength">Strength</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-neutral-800">
            <div>
              <label className="block text-xs font-semibold text-neutral-400 mb-1">
                Calorie Target (kcal)
              </label>
              <input
                id="profile-calorie-goal"
                type="number"
                value={calorieGoal}
                onChange={(e) => setCalorieGoal(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:outline-hidden focus:border-emerald-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-400 mb-1">
                Water Target (ml)
              </label>
              <input
                id="profile-water-goal"
                type="number"
                value={waterGoal}
                onChange={(e) => setWaterGoal(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:outline-hidden focus:border-emerald-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-400 mb-1">
                Daily Steps Target
              </label>
              <input
                id="profile-steps-goal"
                type="number"
                value={stepsGoal}
                onChange={(e) => setStepsGoal(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:outline-hidden focus:border-emerald-500 transition"
              />
            </div>
          </div>

          <button
            id="profile-save-btn"
            type="submit"
            disabled={saving}
            className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs flex items-center justify-center gap-2 transition shadow-sm shadow-emerald-500/20 disabled:opacity-50 mt-4"
          >
            {saving ? (
              'Saving Updates...'
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Profile & Goals
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
