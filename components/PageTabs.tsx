"use client";

import { useState } from "react";

const tabs = [
  { id: "main", label: "Главная" },
  { id: "reviews", label: "Отзывы" },
  { id: "about", label: "О нас" },
];

interface PageTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function PageTabs({ activeTab, onTabChange }: PageTabsProps) {
  return (
    <div className="border-b border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`py-3 text-sm font-medium border-b-2 transition-all ${
                activeTab === tab.id
                  ? "text-accent border-accent"
                  : "text-gray-500 border-transparent hover:text-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
