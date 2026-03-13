"use client";

import { useMemo, useState } from "react";
import { ModeToggle, type Mode } from "@/components/ModeToggle";
import { ManualForm } from "@/components/ManualForm";
import { ChatAssistant } from "@/components/ChatAssistant";
import type { CandidateForm } from "@/lib/types";

const emptyForm: CandidateForm = {
  name: "",
  email: "",
  phone: "",
  education: "",
  skills: "",
  experience: "",
  city: "",
  linkedin: "",
  portfolio: "",
  notes: "",
};

export default function Home() {
  const [mode, setMode] = useState<Mode>("manual");
  const [formData, setFormData] = useState<CandidateForm>(emptyForm);
  const [showFormAfterChat, setShowFormAfterChat] = useState(false);

  const filledCount = useMemo(
    () => Object.values(formData).filter((v) => v).length,
    [formData]
  );

  const handleReset = () => {
    setFormData(emptyForm);
    setShowFormAfterChat(false);
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-3 py-10 sm:px-4 lg:px-8">
      <div className="flex w-full max-w-6xl flex-col gap-6 lg:max-w-7xl">
        <header className="flex flex-col gap-4 rounded-3xl bg-white/80 p-6 shadow-lg ring-1 ring-slate-200 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
              Next.js + Firebase + Gemini
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">
              AI-assisted candidate intake
            </h1>
            <p className="text-sm text-slate-600">
              Toggle between manual entry and a conversational AI that fills the
              10-field form for you. All submissions go to Firestore with
              timestamps.
            </p>
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-600">
            <div className="flex items-center gap-2 rounded-2xl bg-indigo-50 px-4 py-2 text-indigo-700">
              <span className="text-xs font-semibold">Fields</span>
              <span className="rounded-full bg-white px-3 py-1 font-bold shadow">
                {filledCount}/10
              </span>
            </div>
            <button
              onClick={handleReset}
              className="hidden rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-indigo-200 hover:text-indigo-700 sm:inline-flex"
            >
              Reset
            </button>
            <a
              href="/admin"
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-md transition hover:bg-indigo-700"
            >
              Admin
            </a>
          </div>
        </header>

        <ModeToggle mode={mode} onToggle={(m) => setMode(m)} />

        {mode === "manual" && (
          <ManualForm
            value={formData}
            onChange={setFormData}
            onSubmitSuccess={handleReset}
          />
        )}

        {mode === "ai" && (
          <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-2">
            <ChatAssistant
              form={formData}
              onFormUpdate={(data) => setFormData((prev) => ({ ...prev, ...data }))}
              onComplete={() => setShowFormAfterChat(true)}
            />
            <div className="space-y-3">
              <p className="text-sm font-semibold text-slate-700">
                Live form preview
              </p>
              {showFormAfterChat ? (
                <ManualForm
                  value={formData}
                  onChange={setFormData}
                  onSubmitSuccess={handleReset}
                  ctaLabel="Submit from Chat"
                />
              ) : (
                <div className="flex h-full min-h-[420px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white/70 p-6 text-center text-sm text-slate-500 shadow-inner">
                  <p className="font-semibold text-slate-700">
                    The chatbot will populate the form.
                  </p>
                  <p className="max-w-sm text-xs text-slate-500">
                    Answer the questions on the left. We’ll reveal the editable
                    form once all fields are captured.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
