import React from 'react';
import {
  Scale,
  Activity,
  Flame,
  Droplets,
  Footprints,
  TrendingUp,
  Sparkles,
  ArrowUpRight,
  Dumbbell,
  Utensils,
  Plus,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import StatCard from '../components/StatCard.jsx';
import BmiCalculator from '../components/BmiCalculator.jsx';
import { useFitness } from '../context/FitnessContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function DashboardPage() {
  const { user } = useAuth();
  const { dashboardData, loadingDashboard, setActiveTab } = useFitness();

  const today = dashboardData?.today || {
    caloriesConsumed: 0,
    waterIntake: 0,
    waterGoal: 2500,
    steps: 7850,
    stepsGoal: 10000,
    caloriesBurned: 450,
    caloriesBurnedGoal: 500,
    workoutTotal: 4,
    workoutCompleted: 2,
  };

  const bmi = dashboardData?.bmi || {
    value: 23.1,
    category: 'Normal weight',
    color: 'text-emerald-400',
  };

  const weeklyData = dashboardData?.weeklyProgress || [];

  const calorieGoal = user?.calorieGoal || 2200;
  const calPercent = Math.min(100, Math.round((today.caloriesConsumed / calorieGoal) * 100));
  const waterPercent = Math.min(100, Math.round((today.waterIntake / (today.waterGoal || 2500)) * 100));
  const stepsPercent = Math.min(100, Math.round((today.steps / (today.stepsGoal || 10000)) * 100));
  const burnPercent = Math.min(100, Math.round((today.caloriesBurned / (today.caloriesBurnedGoal || 500)) * 100));

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="p-6 rounded-2xl bg-neutral-900/90 border border-neutral-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Welcome Back
            </span>
            <span className="text-neutral-600">•</span>
            <span className="text-xs text-neutral-400">{user?.goal || 'Muscle Gain'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Hello, {user?.name || 'Athlete'} 👋
          </h2>
          <p className="text-xs text-neutral-400 max-w-xl">
            You are on track today. Log your nutrition, hit your water goal, and conquer your training.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto">
          <button
            id="dash-quick-workout-btn"
            onClick={() => setActiveTab('workout')}
            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs flex items-center justify-center gap-2 transition shadow-sm shadow-emerald-500/20"
          >
            <Dumbbell className="w-4 h-4" />
            Start Workout
          </button>
          <button
            id="dash-quick-food-btn"
            onClick={() => setActiveTab('nutrition')}
            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-750 text-white font-semibold text-xs flex items-center justify-center gap-2 border border-neutral-700 transition"
          >
            <Utensils className="w-4 h-4" />
            Log Meal
          </button>
        </div>
      </div>

      {/* Main Metrics 6-Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* 1. Weight */}
        <StatCard
          id="stat-card-weight"
          title="Weight"
          value={user?.weight || 70}
          unit="kg"
          subtitle={`Height: ${user?.height || 175} cm`}
          icon={Scale}
          color="emerald"
          onClick={() => setActiveTab('progress')}
        />

        {/* 2. BMI */}
        <StatCard
          id="stat-card-bmi"
          title="BMI"
          value={bmi.value}
          unit=""
          subtitle={bmi.category}
          icon={Activity}
          color={bmi.category === 'Normal weight' ? 'emerald' : 'amber'}
          onClick={() => setActiveTab('progress')}
        />

        {/* 3. Daily Calorie Goal */}
        <StatCard
          id="stat-card-calories"
          title="Calories"
          value={today.caloriesConsumed}
          unit="kcal"
          subtitle={`Goal: ${calorieGoal} kcal`}
          icon={Flame}
          progress={calPercent}
          color="amber"
          onClick={() => setActiveTab('nutrition')}
        />

        {/* 4. Water Intake */}
        <StatCard
          id="stat-card-water"
          title="Water"
          value={today.waterIntake}
          unit="ml"
          subtitle={`Goal: ${today.waterGoal || 2500} ml`}
          icon={Droplets}
          progress={waterPercent}
          color="blue"
          onClick={() => setActiveTab('water')}
        />

        {/* 5. Steps */}
        <StatCard
          id="stat-card-steps"
          title="Steps"
          value={today.steps.toLocaleString()}
          unit="steps"
          subtitle={`Goal: ${(today.stepsGoal || 10000).toLocaleString()}`}
          icon={Footprints}
          progress={stepsPercent}
          color="emerald"
        />

        {/* 6. Calories Burned */}
        <StatCard
          id="stat-card-burned"
          title="Burned"
          value={today.caloriesBurned}
          unit="kcal"
          subtitle={`Target: ${today.caloriesBurnedGoal || 500} kcal`}
          icon={Flame}
          progress={burnPercent}
          color="rose"
        />
      </div>

      {/* Center Row: Weekly Chart & BMI Tool */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Progress Chart */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-neutral-900/90 border border-neutral-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                Weekly Weight Trend
              </h3>
              <p className="text-xs text-neutral-400">Recorded weight timeline over the last 7 days</p>
            </div>
            <button
              onClick={() => setActiveTab('progress')}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
            >
              Full Analytics <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-56 w-full pt-2">
            {weeklyData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-neutral-500">
                No weekly logs found yet.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="dashWeightGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
                  <XAxis
                    dataKey="day"
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
                    domain={['dataMin - 0.5', 'dataMax + 0.5']}
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
                  />
                  <Area
                    type="monotone"
                    dataKey="weight"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#dashWeightGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Compact BMI Calculator Box */}
        <div>
          <BmiCalculator compact={true} />
        </div>
      </div>
    </div>
  );
}
