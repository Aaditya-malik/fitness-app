import React, { useState } from 'react';
import { Activity, Sparkles, ArrowRight, Lock, Mail, User, ShieldCheck, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export default function AuthPage() {
  const { login, register, demoLogin, authError, setAuthError } = useAuth();

  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [height, setHeight] = useState('175');
  const [weight, setWeight] = useState('70');
  const [goal, setGoal] = useState('Muscle Gain');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register({
          name,
          email,
          password,
          height: Number(height),
          weight: Number(weight),
          goal,
        });
      }
    } catch (err) {
      // Handled in context
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async () => {
    setLoading(true);
    try {
      await demoLogin();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Ambient background decoration */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-emerald-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto shadow-md shadow-emerald-500/20">
            <Activity className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            FitTrack <span className="text-emerald-400">AI</span>
          </h1>
          <p className="text-xs text-neutral-400">
            Precision Fitness, Nutrition, and Smart AI Recommendations
          </p>
        </div>

        {/* Auth Card */}
        <div className="p-7 rounded-3xl bg-neutral-900/90 border border-neutral-800 shadow-xl backdrop-blur-md space-y-5">
          {/* Tab Selector */}
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-neutral-950 rounded-2xl border border-neutral-800">
            <button
              id="auth-tab-login"
              type="button"
              onClick={() => {
                setIsLogin(true);
                setAuthError(null);
              }}
              className={`py-2 text-xs font-bold rounded-xl transition ${
                isLogin
                  ? 'bg-emerald-500 text-neutral-950 shadow-sm shadow-emerald-500/20'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              id="auth-tab-register"
              type="button"
              onClick={() => {
                setIsLogin(false);
                setAuthError(null);
              }}
              className={`py-2 text-xs font-bold rounded-xl transition ${
                !isLogin
                  ? 'bg-emerald-500 text-neutral-950 shadow-sm shadow-emerald-500/20'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Register
            </button>
          </div>

          {/* Error Message */}
          {authError && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium">
              {authError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
                  <input
                    id="register-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Hunter"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm focus:outline-hidden focus:border-emerald-500 transition"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
                <input
                  id="auth-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@example.com"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm focus:outline-hidden focus:border-emerald-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
                <input
                  id="auth-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm focus:outline-hidden focus:border-emerald-500 transition"
                />
              </div>
            </div>

            {!isLogin && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                      Height (cm)
                    </label>
                    <input
                      id="register-height"
                      type="number"
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
                      id="register-weight"
                      type="number"
                      step="0.1"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm focus:outline-hidden focus:border-emerald-500 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Primary Goal
                  </label>
                  <select
                    id="register-goal"
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm focus:outline-hidden focus:border-emerald-500 transition"
                  >
                    <option value="Weight Loss">Weight Loss</option>
                    <option value="Muscle Gain">Muscle Gain</option>
                    <option value="Strength">Strength</option>
                  </select>
                </div>
              </>
            )}

            <button
              id="auth-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs flex items-center justify-center gap-2 transition shadow-sm shadow-emerald-500/20 disabled:opacity-50 mt-2"
            >
              {loading ? (
                'Processing...'
              ) : isLogin ? (
                <>
                  <span>Sign In to FitTrack</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  <span>Create FitTrack Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center justify-center my-2">
            <div className="border-t border-neutral-800 w-full" />
            <span className="bg-neutral-900 px-3 text-[11px] uppercase tracking-wider text-neutral-500 font-bold shrink-0">
              Or Explore Fast
            </span>
          </div>

          {/* Instant Demo Account Button */}
          <button
            id="auth-demo-btn"
            type="button"
            onClick={handleDemo}
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-neutral-950 hover:bg-neutral-800/80 border border-neutral-800 text-neutral-200 hover:text-white font-semibold text-xs flex items-center justify-center gap-2 transition disabled:opacity-50"
          >
            <Zap className="w-4 h-4 text-emerald-400" />
            <span>Instant Demo Account (1-Click)</span>
          </button>
        </div>

        {/* Security / Quality Note */}
        <div className="flex items-center justify-center gap-2 text-[11px] text-neutral-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>JWT Secure Authentication & bcrypt Password Hashing</span>
        </div>
      </div>
    </div>
  );
}
