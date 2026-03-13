"use client";

import { FormEvent, useEffect, useState } from "react";
import { saveCandidate } from "@/lib/firestore";
import type { CandidateForm } from "@/lib/types";
import { auth } from "@/lib/firebase";
import { signInAnonymously } from "firebase/auth";

type Props = {
  value: CandidateForm;
  onChange: (form: CandidateForm) => void;
  onSubmitSuccess: () => void;
  ctaLabel?: string;
};

const fieldList: { key: keyof CandidateForm; label: string; type?: string }[] = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email", type: "email" },
  { key: "phone", label: "Phone", type: "tel" },
  { key: "education", label: "Education" },
  { key: "skills", label: "Skills" },
  { key: "experience", label: "Experience" },
  { key: "city", label: "City" },
  { key: "linkedin", label: "LinkedIn", type: "url" },
  { key: "portfolio", label: "Portfolio", type: "url" },
  { key: "notes", label: "Notes" },
];

export function ManualForm({
  value,
  onChange,
  onSubmitSuccess,
  ctaLabel = "Submit",
}: Props) {
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    // Sign in anonymously to satisfy Firestore security rules.
    signInAnonymously(auth).catch(() => undefined);
  }, []);

  const handleChange = (key: keyof CandidateForm, val: string) => {
    onChange({ ...value, [key]: val });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!value.name || !value.email) {
      setMessage("Name and email are required.");
      return;
    }

    try {
      setSubmitting(true);
      await saveCandidate(value);
      setMessage("Saved to Firestore.");
      onSubmitSuccess();
    } catch (err) {
      const detail =
        err instanceof Error && err.message === "timeout"
          ? "Request timed out. Check network/Firebase rules."
          : "Unable to save. Check Firebase config and try again.";
      setMessage(detail);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full space-y-4 rounded-2xl bg-white/80 p-5 shadow-lg ring-1 ring-slate-200 backdrop-blur sm:p-6"
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {fieldList.map(({ key, label, type }) => (
          <label key={key} className="flex flex-col gap-1 text-sm font-medium">
            <span className="text-slate-700">{label}</span>
            {key === "notes" ? (
              <textarea
                className="min-h-[96px] rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-inner focus:border-indigo-500 focus:outline-none"
                value={value[key]}
                onChange={(e) => handleChange(key, e.target.value)}
              />
            ) : (
              <input
                type={type ?? "text"}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-inner focus:border-indigo-500 focus:outline-none"
                value={value[key]}
                onChange={(e) => handleChange(key, e.target.value)}
              />
            )}
          </label>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {submitting ? "Saving..." : ctaLabel}
        </button>
        {message && <span className="text-sm text-slate-600">{message}</span>}
      </div>
    </form>
  );
}
