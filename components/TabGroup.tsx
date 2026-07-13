"use client";

import { useState } from "react";

interface TabGroupProps {
  tabs: string[];
  defaultTab?: string;
  onChange?: (tab: string) => void;
}

export function TabGroup({ tabs, defaultTab, onChange }: TabGroupProps) {
  const [active, setActive] = useState(defaultTab ?? tabs[0]);

  function select(tab: string) {
    setActive(tab);
    onChange?.(tab);
  }

  return (
    <div className="inline-flex rounded-pill bg-white/10 p-1">
      {tabs.map((tab) => (
        <button
          key={tab}
          type="button"
          onClick={() => select(tab)}
          className={`font-button rounded-pill px-5 py-2 text-sm uppercase italic transition-colors ${
            active === tab ? "bg-white text-brand-blue" : "text-white"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
