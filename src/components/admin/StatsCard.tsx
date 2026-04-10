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
          <p className="text-sm" style={{ color: "#6b7280" }}>
            {title}
          </p>
          <p className="text-2xl font-bold" style={{ color: "#0a0a0a" }}>
            {value}
          </p>
          {change && trend && (
            <div className="flex items-center gap-1">
              {trend === "up" ? (
                <svg
                  className="w-4 h-4"
                  style={{ color: "#16a34a" }}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                </svg>
              ) : (
                <svg
                  className="w-4 h-4"
                  style={{ color: "#dc2626" }}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              )}
              <span
                className="text-sm font-medium"
                style={{ color: trend === "up" ? "#16a34a" : "#dc2626" }}
              >
                {change}
              </span>
            </div>
          )}
        </div>
        <div
          className="p-3 rounded-lg flex-shrink-0"
          style={{ backgroundColor: "rgba(212, 134, 11, 0.1)", color: "#d4860b" }}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
