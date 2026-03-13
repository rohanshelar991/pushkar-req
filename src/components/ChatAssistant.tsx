"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import type { CandidateForm, ChatMessage } from "@/lib/types";

const defaultMessages: ChatMessage[] = [
  {
    role: "assistant",
    content:
      "Hi! I can fill the form for you. I'll ask 10 quick questions. Ready?",
  },
];

const fieldOrder: (keyof CandidateForm)[] = [
  "name",
  "email",
  "phone",
  "education",
  "skills",
  "experience",
  "city",
  "linkedin",
  "portfolio",
  "notes",
];

type Props = {
  onFormUpdate: (data: Partial<CandidateForm>) => void;
  form: CandidateForm;
  onComplete: () => void;
};

export function ChatAssistant({ onFormUpdate, form, onComplete }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>(defaultMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const unansweredField = useMemo(
    () => fieldOrder.find((key) => !form[key]),
    [form]
  );

  const currentPrompt =
    unansweredField ??
    (fieldOrder.every((key) => form[key]) ? null : fieldOrder[0]);

  useEffect(() => {
    if (messages.length === 1) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Let's start with your name." },
      ]);
    }
  }, [messages.length]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages]);

  useEffect(() => {
    if (!currentPrompt) {
      onComplete();
    }
  }, [currentPrompt, onComplete]);

  const sendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const nextMessages: ChatMessage[] = [
      ...messages,
      { role: "user", content: input.trim() },
      {
        role: "assistant",
        content: `Processing that...${currentPrompt ? "" : " wrapping up."}`,
      },
    ];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });
      const data = await res.json();
      if (data?.form) {
        onFormUpdate(data.form);
        const nextMissing = fieldOrder.find(
          (key) => !(data.form as CandidateForm)[key]
        );
        const followUp = nextMissing
          ? `Got it. Can you share your ${nextMissing}?`
          : "All fields captured. Review the form below.";
        setMessages((prev) => [
          ...prev.slice(0, prev.length - 1),
          { role: "assistant", content: followUp },
        ]);
      } else if (data?.error) {
        const detail =
          typeof data.details === "string"
            ? data.details
            : "Please retry or switch to manual mode.";
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: `Model error: ${detail}` },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Something went wrong while talking to the AI. Please retry or switch to manual mode.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-white/80 p-4 shadow-lg ring-1 ring-slate-200 backdrop-blur sm:p-5">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <p className="text-sm font-semibold text-indigo-700">AI Chatbot</p>
          <p className="text-xs text-slate-500">
            Chat to auto-fill the form. You can edit afterwards.
          </p>
        </div>
        {loading && (
          <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
            Thinking…
          </span>
        )}
      </div>

      <div
        ref={scrollRef}
        className="h-[320px] w-full space-y-3 overflow-y-auto rounded-xl bg-slate-50 px-3 py-3"
      >
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${
              msg.role === "assistant" ? "justify-start" : "justify-end"
            }`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${
                msg.role === "assistant"
                  ? "bg-white text-slate-800 shadow ring-1 ring-slate-200"
                  : "bg-indigo-600 text-white shadow-lg"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
      </div>

      {currentPrompt && (
        <div className="rounded-xl border border-dashed border-indigo-200 bg-indigo-50/60 px-4 py-2 text-xs text-indigo-800">
          Next: {currentPrompt}
        </div>
      )}

      <form onSubmit={sendMessage} className="flex items-center gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your answer..."
          className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-indigo-700 disabled:bg-slate-300"
        >
          Send
        </button>
      </form>
    </div>
  );
}
