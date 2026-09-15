import React, { useState, useEffect, useCallback } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { TrendingUp, Plus, Calendar, Scale, Flame, Trash2 } from 'lucide-react';
import { progressService } from '../services/api.js';
import { useFitness } from '../context/FitnessContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function ProgressCharts() {
  const { user } = useAuth();
  const { refreshDashboard, showToast } = useFitness();

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeChart, setActiveChart] = useState('weight'); // 'weight' or 'calories'

  // Log new progress entry
  const [weight, setWeight] = useState(user?.weight || '');
  const [calories, setCalories] = useState('');
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [submitting, setSubmitting] = useState(false);
  const [showLogModal, setShowLogModal] = useState(false);

  const fetchProgress = useCallback(async () => {
    setLoading(true);
    try {
      const data = await progressService.getProgress();
      setHistory(data);
    } catch (err) {
      console.error('Failed to load progress history:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  const handleAddProgress = async (e) => {
    e.preventDefault();
    if (!weight) return;
    setSubmitting(true);
    try {
      await progressService.addProgress({
        weight: Number(weight),
        calories: calories ? Number(calories) : 0,
        date,
        notes,
      });
      fetchProgress();
      refreshDashboard();
      setShowLogModal(false);
      setNotes('');
      showToast('Progress entry saved!');
    } catch (err) {
      showToast('Failed to save progress entry', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteEntry = async (id) => {
    try {
      await progressService.deleteProgress(id);
      fetchProgress();
      refreshDashboard();
      showToast('Entry removed');
    } catch (err) {
      showToast('Failed to remove entry', 'error');
    }
  };

  // Format data for Recharts
  const chartData = history.map((item) => {
    const d = new Date(item.date);
    const dayLabel = isNaN(d)
      ? item.date
      : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return {
      date: item.date,
      displayDate: dayLabel,
      weight: Number(item.weight),
      calories: Number(item.calories) || 0,
    };
  });

  return (
    <div className="space-y-6">
      {/* Header & Chart View Selector */}
      <div className="p-6 rounded-2xl bg-neutral-900/90 border border-neutral-800 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              Weight & Calorie Progress Trends
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Track longitudinal bodyweight changes and daily calorie burn/intake
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="p-1 bg-neutral-950 rounded-xl border border-neutral-800 flex">
              <button
                id="chart-tab-weight"
                onClick={() => setActiveChart('weight')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  activeChart === 'weight'
                    ? 'bg-emerald-500 text-neutral-950'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Weight (kg)
              </button>
              <button
                id="chart-tab-calories"
                onClick={() => setActiveChart('calories')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  activeChart === 'calories'
                    ? 'bg-emerald-500 text-neutral-950'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Calories (kcal)
              </button>
            </div>

            <button
              id="progress-log-btn"
              onClick={() => setShowLogModal(true)}
              className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 text-xs font-bold flex items-center gap-1.5 transition shadow-sm shadow-emerald-500/20"
            >
              <Plus className="w-4 h-4" />
              Log Entry
            </button>
          </div>
        </div>

        {/* Recharts Container */}
        <div className="h-64 sm:h-72 w-full pt-2">
          {loading ? (
            <div className="h-full flex items-center justify-center text-xs text-neutral-500">
              Loading analytics chart...
            </div>
          ) : chartData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-xs text-neutral-500">
              No entries logged yet. Click &quot;Log Entry&quot; to begin your timeline.
            </div>
          ) : activeChart === 'weight' ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
                <XAxis
                  dataKey="displayDate"
                  stroke="#737373"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#737373"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  domain={['dataMin - 1', 'dataMax + 1']}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#171717',
                    borderColor: '#262626',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: '#fff',
                  }}
                  formatter={(val) => [`${val} kg`, 'Weight']}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Area
                  type="monotone"
                  dataKey="weight"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#weightGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
                <XAxis
                  dataKey="displayDate"
                  stroke="#737373"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis stroke="#737373" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#171717',
                    borderColor: '#262626',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: '#fff',
                  }}
                  formatter={(val) => [`${val} kcal`, 'Calories']}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Bar dataKey="calories" fill="#10b981" radius={[6, 6, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* History Log Table / Cards */}
      <div className="p-6 rounded-2xl bg-neutral-900/90 border border-neutral-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">Recent Progress Entries</h3>
          <span className="text-xs text-neutral-400">{history.length} records</span>
        </div>

        <div className="space-y-2">
          {history.length === 0 ? (
            <p className="text-xs text-neutral-500 py-4 text-center">No entries recorded yet.</p>
          ) : (
            [...history].reverse().slice(0, 10).map((entry) => {
              const id = entry._id || entry.id;
              return (
                <div
                  key={id}
                  id={`progress-entry-${id}`}
                  className="p-3.5 rounded-xl bg-neutral-950/70 border border-neutral-800/80 hover:border-neutral-700 flex items-center justify-between gap-3 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                      <Scale className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm font-bold text-white">{entry.weight} kg</span>
                        {entry.calories > 0 && (
                          <span className="text-xs text-neutral-400">
                            • {entry.calories} kcal
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-neutral-400">
                        {entry.date} {entry.notes ? `— "${entry.notes}"` : ''}
                      </p>
                    </div>
                  </div>

                  <button
                    id={`delete-progress-${id}`}
                    onClick={() => handleDeleteEntry(id)}
                    className="p-2 rounded-lg text-neutral-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
                    title="Delete entry"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Log Progress Modal */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Scale className="w-4 h-4 text-emerald-400" />
                Log Weight & Calories
              </h3>
              <button
                onClick={() => setShowLogModal(false)}
                className="text-neutral-400 hover:text-white text-xs font-semibold"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleAddProgress} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Body Weight (kg)
                </label>
                <input
                  id="log-progress-weight"
                  type="number"
                  step="0.1"
                  required
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="e.g. 71.5"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm focus:outline-hidden focus:border-emerald-500 transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Calories (optional)
                  </label>
                  <input
                    id="log-progress-calories"
                    type="number"
                    value={calories}
                    onChange={(e) => setCalories(e.target.value)}
                    placeholder="e.g. 2250"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm focus:outline-hidden focus:border-emerald-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Date
                  </label>
                  <input
                    id="log-progress-date"
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm focus:outline-hidden focus:border-emerald-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Notes / Milestone
                </label>
                <input
                  id="log-progress-notes"
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Morning weigh-in, feeling energized"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm focus:outline-hidden focus:border-emerald-500 transition"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs flex items-center justify-center gap-2 transition disabled:opacity-50"
              >
                {submitting ? 'Recording...' : 'Record Progress Entry'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
