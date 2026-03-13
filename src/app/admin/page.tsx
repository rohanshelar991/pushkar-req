"use client";

import { useEffect, useState } from "react";
import { fetchCandidates, type StoredCandidate } from "@/lib/firestore";
import { Timestamp } from "firebase/firestore";

function formatDate(value?: Timestamp) {
  if (!value) return "—";
  const date = value.toDate();
  return date.toLocaleString();
}

export default function AdminPage() {
  const [rows, setRows] = useState<StoredCandidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchCandidates();
        setRows(data);
      } catch (err) {
        const msg =
          err instanceof Error
            ? err.message
            : "Unable to load submissions. Check Firestore rules and config.";
        setError(msg);
      }
      setLoading(false);
    };
    load();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4">
        <header className="flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
            Admin
          </p>
          <h1 className="text-3xl font-semibold text-slate-900">
            Firestore submissions
          </h1>
          <p className="text-sm text-slate-600">
            Latest entries first. Showing name, email, phone, education, skills,
            and timestamp.
          </p>
          {error && (
            <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
              {error}
            </p>
          )}
        </header>

        <div className="overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-slate-200">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Education</th>
                  <th className="px-4 py-3">Skills</th>
                  <th className="px-4 py-3">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, idx) => (
                  <tr
                    key={`${row.email}-${idx}`}
                    className="border-t border-slate-100 hover:bg-indigo-50/40"
                  >
                    <td className="px-4 py-3 font-semibold text-slate-800">
                      {row.name || "—"}
                    </td>
                    <td className="px-4 py-3 text-slate-700">{row.email}</td>
                    <td className="px-4 py-3 text-slate-700">{row.phone}</td>
                    <td className="px-4 py-3 text-slate-700">
                      {row.education}
                    </td>
                    <td className="px-4 py-3 text-slate-700">{row.skills}</td>
                    <td className="px-4 py-3 text-slate-600">
                      {formatDate(row.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {rows.length === 0 && !loading && (
              <div className="px-4 py-6 text-center text-sm text-slate-500">
                No entries yet.
              </div>
            )}
          </div>
          {loading && (
            <div className="px-4 py-3 text-sm text-slate-500">Loading…</div>
          )}
        </div>
      </div>
    </main>
  );
}
