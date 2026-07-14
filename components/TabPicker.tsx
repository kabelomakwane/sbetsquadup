"use client";

import { useState } from "react";

interface TabPickerProps {
  tabs: string[];
  defaultTab?: string;
  onChange?: (tab: string) => void;
}

export function TabPicker({ tabs, defaultTab, onChange }: TabPickerProps) {
  const [active, setActive] = useState(defaultTab ?? tabs[0]);

  function select(tab: string) {
    setActive(tab);
    onChange?.(tab);
  }

  return (
    <div className="inline-flex items-start rounded-3xl bg-brand-blue p-1">
      {tabs.map((tab) => (
        <button
          key={tab}
          type="button"
          onClick={() => select(tab)}
          className={`font-display flex items-center justify-center whitespace-nowrap rounded-[20px] px-6 py-2 text-base font-black italic transition-colors ${
            active === tab ? "bg-white text-brand-blue" : "text-white"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
