'use client';

import React from 'react';

export default function StatsCard({ title, value, subtitle, icon: Icon, color = 'blue', trend }) {
  const colorStyles = {
    blue: {
      bg: 'bg-blue-50 text-blue-600 border-blue-100',
      glow: 'group-hover:border-blue-300',
    },
    emerald: {
      bg: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      glow: 'group-hover:border-emerald-300',
    },
    amber: {
      bg: 'bg-amber-50 text-amber-600 border-amber-100',
      glow: 'group-hover:border-amber-300',
    },
    purple: {
      bg: 'bg-purple-50 text-purple-600 border-purple-100',
      glow: 'group-hover:border-purple-300',
    },
    rose: {
      bg: 'bg-rose-50 text-rose-600 border-rose-100',
      glow: 'group-hover:border-rose-300',
    },
  }[color] || {
    bg: 'bg-slate-50 text-slate-600 border-slate-100',
    glow: 'group-hover:border-slate-300',
  };

  return (
    <div
      className={`group relative bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-all duration-200 ${colorStyles.glow}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{title}</p>
          <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2 tracking-tight">
            {value}
          </h3>
          {subtitle && (
            <p className="text-xs text-slate-500 mt-1 font-normal flex items-center gap-1">
              {subtitle}
            </p>
          )}
        </div>
        {Icon && (
          <div className={`p-3 rounded-xl border ${colorStyles.bg} transition-transform group-hover:scale-105`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {trend && (
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-500">{trend.label}</span>
          <span
            className={`font-semibold ${
              trend.positive ? 'text-emerald-600' : 'text-slate-700'
            }`}
          >
            {trend.value}
          </span>
        </div>
      )}
    </div>
  );
}

