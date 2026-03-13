"use client";

type Mode = "manual" | "ai";

type Props = {
  mode: Mode;
  onToggle: (mode: Mode) => void;
};

export function ModeToggle({ mode, onToggle }: Props) {
  const isAI = mode === "ai";
  return (
    <div className="flex w-full items-center justify-between gap-3 rounded-2xl bg-white/70 p-4 shadow-sm ring-1 ring-slate-200 backdrop-blur">
      <div>
        <p className="text-sm font-semibold text-slate-700">Mode</p>
        <p className="text-xs text-slate-500">
          Switch between manual form and AI chat assistant.
        </p>
      </div>
      <button
        onClick={() => onToggle(isAI ? "manual" : "ai")}
        className={`relative inline-flex h-10 w-[88px] items-center rounded-full px-1 transition-colors duration-300 ${
          isAI ? "bg-indigo-600" : "bg-slate-200"
        }`}
      >
        <span
          className={`inline-block h-8 w-8 transform rounded-full bg-white shadow transition-transform duration-300 ${
            isAI ? "translate-x-8" : "translate-x-0"
          }`}
        />
        <span className="absolute left-2 text-xs font-semibold text-slate-700">
          Manual
        </span>
        <span className="absolute right-2 text-xs font-semibold text-white">
          AI
        </span>
      </button>
    </div>
  );
}

export type { Mode };
