import React from 'react';

export default function StatCard({
  id,
  title,
  value,
  unit,
  subtitle,
  icon: Icon,
  trend,
  progress,
  color = 'emerald',
  onClick,
}) {
  const colorMap = {
    emerald: {
      iconBg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
      bar: 'bg-emerald-500',
    },
    blue: {
      iconBg: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400',
      bar: 'bg-cyan-500',
    },
    amber: {
      iconBg: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
      bar: 'bg-amber-500',
    },
    rose: {
      iconBg: 'bg-rose-500/10 border-rose-500/20 text-rose-400',
      bar: 'bg-rose-500',
    },
  };

  const scheme = colorMap[color] || colorMap.emerald;

  return (
    <div
      id={id}
      onClick={onClick}
      className={`p-5 rounded-2xl bg-neutral-900/90 border border-neutral-800 hover:border-neutral-700 transition-all duration-200 shadow-sm ${
        onClick ? 'cursor-pointer hover:bg-neutral-800/40' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
          {title}
        </span>
        {Icon && (
          <div className={`p-2 rounded-xl border ${scheme.iconBg}`}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-1.5 mb-2">
        <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          {value}
        </span>
        {unit && <span className="text-sm font-medium text-neutral-400">{unit}</span>}
      </div>

      {subtitle && (
        <p className="text-xs text-neutral-400 mb-3 truncate">{subtitle}</p>
      )}

      {typeof progress === 'number' && (
        <div className="space-y-1">
          <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
            <div
              className={`h-full ${scheme.bar} rounded-full transition-all duration-500`}
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[11px] text-neutral-400">
            <span>Progress</span>
            <span className="font-semibold text-neutral-300">{Math.round(progress)}%</span>
          </div>
        </div>
      )}

      {trend && (
        <div className="text-[11px] font-medium text-emerald-400 flex items-center gap-1 mt-2">
          {trend}
        </div>
      )}
    </div>
  );
}
