"use client";

import React from "react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: string;
  trend?: "up" | "down";
}

export default function StatsCard({ title, value, icon, change, trend }: StatsCardProps) {
  return (
    <div className="bg-white rounded-xl p-6 border border-steel-light/10">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-3">
          <p className="text-sm text-steel-light">
            {title}
          </p>
          <p className="text-2xl font-bold text-ink">
            {value}
          </p>
          {change && trend && (
            <div className="flex items-center gap-1">
              {trend === "up" ? (
                <svg
                  className="w-4 h-4 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                </svg>
              ) : (
                <svg
                  className="w-4 h-4 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              )}
              <span
                className={`text-sm font-medium ${trend === "up" ? "text-green-600" : "text-red-600"}`}
              >
                {change}
              </span>
            </div>
          )}
        </div>
        <div
          className="p-3 rounded-lg flex-shrink-0 bg-amber/10 text-amber"
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
