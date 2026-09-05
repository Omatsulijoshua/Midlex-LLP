"use client";

import { Search } from "lucide-react";

type DashboardSearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  count?: number;
  countLabel?: string;
};

export default function DashboardSearchBar({
  value,
  onChange,
  placeholder,
  count,
  countLabel = "results",
}: DashboardSearchBarProps) {
  return (
    <div className="flex items-center justify-between gap-4 flex-wrap">
      <label className="relative w-full max-w-xl">
        <Search
          size={18}
          className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-2xl border border-gray-100 bg-white py-4 pl-12 pr-4 text-sm text-primary shadow-sm outline-none transition-all focus:border-secondary/30 focus:ring-2 focus:ring-secondary/10"
        />
      </label>
      {typeof count === "number" && (
        <p className="text-sm font-medium text-gray-500">
          {count} {countLabel}
        </p>
      )}
    </div>
  );
}
