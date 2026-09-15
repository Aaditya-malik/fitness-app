import React, { useState, useEffect, useCallback } from 'react';
import { Droplets, Plus, Minus, RotateCcw, Award, Sparkles } from 'lucide-react';
import { waterService } from '../services/api.js';
import { useFitness } from '../context/FitnessContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function WaterTracker() {
  const { user } = useAuth();
  const { refreshDashboard, showToast } = useFitness();

  const [amount, setAmount] = useState(0);
  const [goal, setGoal] = useState(user?.waterGoal || 2500);
  const [loading, setLoading] = useState(true);

  const fetchWater = useCallback(async () => {
    setLoading(true);
    try {
      const data = await waterService.getWater();
      setAmount(data.amount || 0);
      setGoal(data.goal || 2500);
    } catch (err) {
      console.error('Error fetching water:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWater();
  }, [fetchWater]);

  const handleUpdate = async (delta) => {
    try {
      const data = await waterService.updateWater({ delta });
      setAmount(data.amount);
      refreshDashboard();
      if (delta > 0) {
        showToast(`Added ${delta} ml of water!`);
      } else {
        showToast(`Subtracted ${Math.abs(delta)} ml`);
      }
    } catch (err) {
      showToast('Error updating water', 'error');
    }
  };

  const handleReset = async () => {
    try {
      await waterService.resetWater();
      setAmount(0);
      refreshDashboard();
      showToast('Water tracker reset for today');
    } catch (err) {
      showToast('Error resetting water', 'error');
    }
  };

  const percentage = Math.min(100, Math.round((amount / goal) * 100));
  const remaining = Math.max(0, goal - amount);

  return (
    <div className="p-6 rounded-2xl bg-neutral-900/90 border border-neutral-800 shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Droplets className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Daily Hydration Tracker</h2>
            <p className="text-xs text-neutral-400">Hydration boosts recovery, metabolism & focus</p>
          </div>
        </div>

        <button
          id="water-reset-btn"
          onClick={handleReset}
          className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700/60 text-neutral-400 hover:text-rose-400 transition"
          title="Reset today's water"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Visual Water Fill Card */}
      <div className="p-6 rounded-2xl bg-neutral-950 border border-neutral-800 flex flex-col items-center justify-center relative overflow-hidden">
        {/* Ambient bottom glow */}
        <div
          className="absolute bottom-0 left-0 right-0 bg-cyan-500/15 transition-all duration-700 ease-out"
          style={{ height: `${percentage}%` }}
        />

        <div className="relative z-10 text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-900/80 border border-neutral-800 text-xs font-semibold text-cyan-400">
            <Droplets className="w-3.5 h-3.5" />
            {percentage}% Achieved
          </div>

          <div className="flex items-baseline justify-center gap-2">
            <span className="text-5xl font-black text-white tracking-tight">{amount}</span>
            <span className="text-lg font-medium text-neutral-400">/ {goal} ml</span>
          </div>

          <p className="text-xs text-neutral-400">
            {remaining > 0 ? (
              <span>{remaining} ml remaining to hit your target</span>
            ) : (
              <span className="text-emerald-400 font-semibold flex items-center justify-center gap-1">
                <Award className="w-4 h-4" /> Daily hydration goal reached!
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Quick Add / Remove Controls */}
      <div className="space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
          Quick Log
        </span>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            id="water-add-250"
            onClick={() => handleUpdate(250)}
            className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-cyan-500/50 hover:bg-neutral-800/50 transition text-center group"
          >
            <div className="flex items-center justify-center gap-1 text-cyan-400 font-bold text-sm group-hover:scale-105 transition">
              <Plus className="w-3.5 h-3.5" />
              <span>250 ml</span>
            </div>
            <span className="text-[10px] text-neutral-400 mt-1 block">Glass / Cup</span>
          </button>

          <button
            id="water-add-500"
            onClick={() => handleUpdate(500)}
            className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-cyan-500/50 hover:bg-neutral-800/50 transition text-center group"
          >
            <div className="flex items-center justify-center gap-1 text-cyan-400 font-bold text-sm group-hover:scale-105 transition">
              <Plus className="w-3.5 h-3.5" />
              <span>500 ml</span>
            </div>
            <span className="text-[10px] text-neutral-400 mt-1 block">Water Bottle</span>
          </button>

          <button
            id="water-add-1000"
            onClick={() => handleUpdate(1000)}
            className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-cyan-500/50 hover:bg-neutral-800/50 transition text-center group"
          >
            <div className="flex items-center justify-center gap-1 text-cyan-400 font-bold text-sm group-hover:scale-105 transition">
              <Plus className="w-3.5 h-3.5" />
              <span>1000 ml</span>
            </div>
            <span className="text-[10px] text-neutral-400 mt-1 block">Hydro Jug</span>
          </button>

          <button
            id="water-sub-250"
            onClick={() => handleUpdate(-250)}
            className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-rose-500/50 hover:bg-neutral-800/50 transition text-center group"
          >
            <div className="flex items-center justify-center gap-1 text-rose-400 font-bold text-sm group-hover:scale-105 transition">
              <Minus className="w-3.5 h-3.5" />
              <span>250 ml</span>
            </div>
            <span className="text-[10px] text-neutral-400 mt-1 block">Undo Cup</span>
          </button>
        </div>
      </div>
    </div>
  );
}
