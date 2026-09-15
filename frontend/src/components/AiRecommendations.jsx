import React, { useState } from 'react';
import {
  Sparkles,
  Dumbbell,
  Apple,
  Moon,
  Zap,
  Target,
  ChevronRight,
  ShieldCheck,
  Award,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useFitness } from '../context/FitnessContext.jsx';

export default function AiRecommendations() {
  const { user } = useAuth();
  const { dashboardData } = useFitness();

  const height = user?.height || 175;
  const weight = user?.weight || 70;
  const goal = user?.goal || 'Muscle Gain';

  const heightInM = height / 100;
  const bmi = Number((weight / (heightInM * heightInM)).toFixed(1));

  // Intelligent rule-based engine
  const getAiPlan = () => {
    let workoutPlan = '';
    let dietPlan = '';
    let recoveryPlan = '';
    let targetCalories = 2200;
    let proteinTarget = Math.round(weight * 1.8);
    let waterTarget = Math.round(weight * 35); // 35ml per kg

    if (goal === 'Weight Loss') {
      targetCalories = Math.round(weight * 26);
      workoutPlan =
        'Perform 3 strength resistance sessions weekly mixed with 2 sessions of 20-30 min Zone-2 cardio or HIIT. Keep rest between sets around 45–60 seconds to elevate caloric expenditure.';
      dietPlan = `Target a moderate caloric deficit of ~${targetCalories} kcal/day. Prioritize high satiety foods: ${proteinTarget}g protein daily (chicken, tofu, eggs) and cruciferous greens to protect lean muscle mass.`;
      recoveryPlan =
        'Maintain 7.5–8 hours of uninterrupted sleep. Ensure 1–2 full active recovery days with 8,000–10,000 gentle steps. Drink at least 2.8L of water to curb false hunger.';
    } else if (goal === 'Muscle Gain') {
      targetCalories = Math.round(weight * 33);
      proteinTarget = Math.round(weight * 2.0);
      workoutPlan =
        'Focus on hypertrophy-driven compound movements (squat, bench press, deadlifts, pull-ups) in the 8–12 rep range with 3–4 sets. Employ progressive overload by increasing weight or reps weekly.';
      dietPlan = `Enter a clean caloric surplus of ~${targetCalories} kcal/day. Consume ${proteinTarget}g protein daily and ensure plenty of complex carbohydrates (rice, oats, sweet potatoes) around workout windows.`;
      recoveryPlan =
        'Allow 48 hours before training the same muscle group again. Prioritize post-workout protein synthesis with a 30g protein shake or whole-food meal within 90 minutes.';
    } else {
      // Strength
      targetCalories = Math.round(weight * 30);
      proteinTarget = Math.round(weight * 1.9);
      workoutPlan =
        'Train heavily in the 3–6 rep range with 80–88% of 1RM across big barbell lifts. Take extended 2–3 minute rest intervals to fully restore central nervous system ATP reserves.';
      dietPlan = `Eat at maintenance or slight surplus (~${targetCalories} kcal). Consume ${proteinTarget}g protein daily, ensure adequate electrolyte balance (sodium, magnesium, potassium), and 4–5g creatine monohydrate daily.`;
      recoveryPlan =
        'Prioritize joint health, dynamic mobility warm-ups, and contrast showers or magnesium supplementation before bed for CNS restoration.';
    }

    // BMI specific adjustments
    let bmiAdvice = '';
    if (bmi < 18.5) {
      bmiAdvice =
        'Notice: Your current BMI is in the lower range (<18.5). We recommend emphasizing nutrient-dense calorie additions (nut butters, avocados, whole milk) and moderating excessive cardiovascular sessions.';
    } else if (bmi >= 25 && bmi < 30) {
      bmiAdvice =
        'Notice: Your BMI is slightly elevated (25–29.9). Combining high-protein intake with daily non-exercise activity (NEAT, 9k+ steps) will accelerate body recomposition effectively.';
    } else if (bmi >= 30) {
      bmiAdvice =
        'Notice: Your BMI is in the upper bracket (≥30). Focus on joint-friendly low impact training like swimming, brisk incline walking, or rowing, paired with consistent hydration.';
    } else {
      bmiAdvice =
        'Your BMI (18.5–24.9) indicates a well-balanced body mass ratio. Your current baseline provides an ideal springboard for progressive fitness adaptations.';
    }

    return {
      workoutPlan,
      dietPlan,
      recoveryPlan,
      bmiAdvice,
      targetCalories,
      proteinTarget,
      waterTarget,
    };
  };

  const plan = getAiPlan();

  return (
    <div className="space-y-6">
      {/* AI Engine Hero Card */}
      <div className="p-6 rounded-2xl bg-neutral-900/90 border border-neutral-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                FitTrack AI Smart Insights
              </h2>
              <p className="text-xs text-neutral-400">
                Tailored for <strong className="text-white">{user?.name}</strong> •{' '}
                {weight} kg • BMI {bmi} • Goal: <span className="text-emerald-400 font-semibold">{goal}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              Rule-Based Intelligence
            </span>
          </div>
        </div>

        {/* BMI context message */}
        <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800/90 text-xs text-neutral-300 flex items-start gap-2.5">
          <Target className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <span>{plan.bmiAdvice}</span>
        </div>

        {/* Quick Targets Bar */}
        <div className="grid grid-cols-3 gap-3 pt-2">
          <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-center">
            <span className="text-[10px] uppercase font-bold text-neutral-400">Target Calories</span>
            <p className="text-lg font-extrabold text-emerald-400">{plan.targetCalories} kcal</p>
          </div>
          <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-center">
            <span className="text-[10px] uppercase font-bold text-neutral-400">Daily Protein</span>
            <p className="text-lg font-extrabold text-white">{plan.proteinTarget} g</p>
          </div>
          <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-center">
            <span className="text-[10px] uppercase font-bold text-neutral-400">Recommended Water</span>
            <p className="text-lg font-extrabold text-cyan-400">{plan.waterTarget} ml</p>
          </div>
        </div>
      </div>

      {/* 3 Pillar Cards: Workout, Diet, Recovery */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Workout Strategy */}
        <div className="p-5 rounded-2xl bg-neutral-900/90 border border-neutral-800 hover:border-neutral-700 transition space-y-3">
          <div className="flex items-center gap-2.5 text-emerald-400">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <Dumbbell className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white">Workout Strategy</h3>
          </div>
          <p className="text-xs text-neutral-300 leading-relaxed">{plan.workoutPlan}</p>
          <div className="pt-2 border-t border-neutral-800/80 text-[11px] text-neutral-400 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
            <span>Optimal frequency: 4–5 days / week</span>
          </div>
        </div>

        {/* Diet & Nutrition Strategy */}
        <div className="p-5 rounded-2xl bg-neutral-900/90 border border-neutral-800 hover:border-neutral-700 transition space-y-3">
          <div className="flex items-center gap-2.5 text-cyan-400">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
              <Apple className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white">Diet & Nutrition</h3>
          </div>
          <p className="text-xs text-neutral-300 leading-relaxed">{plan.dietPlan}</p>
          <div className="pt-2 border-t border-neutral-800/80 text-[11px] text-neutral-400 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>Timing: 30g protein within 2h post-workout</span>
          </div>
        </div>

        {/* Sleep & Recovery Strategy */}
        <div className="p-5 rounded-2xl bg-neutral-900/90 border border-neutral-800 hover:border-neutral-700 transition space-y-3">
          <div className="flex items-center gap-2.5 text-purple-400">
            <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20">
              <Moon className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white">Sleep & Recovery</h3>
          </div>
          <p className="text-xs text-neutral-300 leading-relaxed">{plan.recoveryPlan}</p>
          <div className="pt-2 border-t border-neutral-800/80 text-[11px] text-neutral-400 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-purple-400" />
            <span>Target: 7–8 hours high-quality REM sleep</span>
          </div>
        </div>
      </div>
    </div>
  );
}
