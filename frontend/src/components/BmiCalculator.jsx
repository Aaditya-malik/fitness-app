import React, { useState } from 'react';
import { Scale, ArrowRight, CheckCircle2, Info } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useFitness } from '../context/FitnessContext.jsx';

export default function BmiCalculator({ compact = false }) {
  const { user, updateUserProfile } = useAuth();
  const { refreshDashboard, showToast } = useFitness();

  const [height, setHeight] = useState(user?.height || 175);
  const [weight, setWeight] = useState(user?.weight || 70);
  const [saving, setSaving] = useState(false);

  const calculateBmiDetails = (h, w) => {
    const hM = Number(h) / 100;
    const wKg = Number(w);
    if (!hM || hM <= 0 || !wKg || wKg <= 0) return { bmi: 0, category: 'N/A', color: 'text-neutral-400' };

    const bmi = Number((wKg / (hM * hM)).toFixed(1));
    let category = 'Normal weight';
    let color = 'text-emerald-400';
    let bgColor = 'bg-emerald-500/10 border-emerald-500/30';
    let tip = 'Your BMI is within the healthy recommended range. Keep up your nutrition and routine!';

    if (bmi < 18.5) {
      category = 'Underweight';
      color = 'text-amber-400';
      bgColor = 'bg-amber-500/10 border-amber-500/30';
      tip = 'Consider a slight caloric surplus with nutrient-dense protein and resistance training.';
    } else if (bmi >= 18.5 && bmi < 24.9) {
      category = 'Normal weight';
      color = 'text-emerald-400';
      bgColor = 'bg-emerald-500/10 border-emerald-500/30';
      tip = 'Optimal metabolic balance. Focus on progressive overload and body recomposition.';
    } else if (bmi >= 25 && bmi < 29.9) {
      category = 'Overweight';
      color = 'text-amber-400';
      bgColor = 'bg-amber-500/10 border-amber-500/30';
      tip = 'Aim for a moderate 300-500 kcal deficit with regular cardiovascular and strength activity.';
    } else {
      category = 'Obese';
      color = 'text-rose-400';
      bgColor = 'bg-rose-500/10 border-rose-500/30';
      tip = 'Prioritize consistent low-impact movement, high fiber intake, and structured caloric deficits.';
    }

    return { bmi, category, color, bgColor, tip };
  };

  const bmiDetails = calculateBmiDetails(height, weight);

  const handleSaveToProfile = async () => {
    setSaving(true);
    try {
      await updateUserProfile({
        height: Number(height),
        weight: Number(weight),
      });
      await refreshDashboard();
      showToast('Profile height & weight updated successfully!');
    } catch (err) {
      showToast('Failed to save profile changes.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 rounded-2xl bg-neutral-900/90 border border-neutral-800 shadow-sm space-y-5">
      <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Scale className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">BMI Calculator</h3>
            <p className="text-xs text-neutral-400">Calculate Body Mass Index & Category</p>
          </div>
        </div>
        <span className={`text-xs px-2.5 py-1 rounded-full border font-semibold ${bmiDetails.bgColor} ${bmiDetails.color}`}>
          {bmiDetails.category}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
            Height (cm)
          </label>
          <input
            id="bmi-height-input"
            type="number"
            min="100"
            max="250"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white font-medium focus:outline-hidden focus:border-emerald-500 transition text-sm"
            placeholder="e.g. 175"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
            Weight (kg)
          </label>
          <input
            id="bmi-weight-input"
            type="number"
            min="30"
            max="250"
            step="0.1"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white font-medium focus:outline-hidden focus:border-emerald-500 transition text-sm"
            placeholder="e.g. 70"
          />
        </div>
      </div>

      {/* Result Display Box */}
      <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-baseline gap-2">
          <span className="text-xs uppercase font-bold text-neutral-400">Calculated BMI:</span>
          <span className={`text-3xl font-extrabold ${bmiDetails.color}`}>
            {bmiDetails.bmi || '--'}
          </span>
          <span className="text-xs font-semibold text-neutral-300">
            ({bmiDetails.category})
          </span>
        </div>

        <button
          id="bmi-save-profile-btn"
          onClick={handleSaveToProfile}
          disabled={saving}
          className="w-full sm:w-auto px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-sm shadow-emerald-500/20 disabled:opacity-50"
        >
          {saving ? (
            'Saving...'
          ) : (
            <>
              <CheckCircle2 className="w-3.5 h-3.5" />
              Save to Profile
            </>
          )}
        </button>
      </div>

      {/* Visual BMI Scale Bar */}
      <div className="space-y-1.5 pt-1">
        <div className="h-2 w-full rounded-full bg-neutral-800 overflow-hidden flex">
          <div className="w-1/4 bg-amber-400/80" title="Underweight (<18.5)" />
          <div className="w-1/4 bg-emerald-500" title="Normal (18.5 - 24.9)" />
          <div className="w-1/4 bg-amber-500" title="Overweight (25 - 29.9)" />
          <div className="w-1/4 bg-rose-500" title="Obese (≥30)" />
        </div>
        <div className="flex justify-between text-[10px] text-neutral-400 font-medium">
          <span>&lt;18.5 Under</span>
          <span>18.5-24.9 Normal</span>
          <span>25-29.9 Over</span>
          <span>&ge;30 Obese</span>
        </div>
      </div>

      {!compact && (
        <div className="p-3 rounded-xl bg-neutral-800/30 border border-neutral-800 text-xs text-neutral-400 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <span>{bmiDetails.tip}</span>
        </div>
      )}
    </div>
  );
}
