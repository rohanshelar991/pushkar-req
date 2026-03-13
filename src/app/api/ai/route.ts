import { NextRequest, NextResponse } from "next/server";
import type { ChatMessage } from "@/lib/types";

const fields = [
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

export async function POST(req: NextRequest) {
  const groqKey = process.env.GROQ_API_KEY;
  if (!groqKey) {
    return NextResponse.json(
      { error: "Missing GROQ_API_KEY" },
      { status: 500 }
    );
  }

  const body = (await req.json()) as { messages: ChatMessage[] };

  const systemPrompt = `You are an intake assistant extracting candidate profile fields.
Return ONLY JSON with keys ${fields.join(
    ", "
  )}. Use empty strings for unknown fields. Never add extra keys.`;

  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${groqKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        temperature: 0.4,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: systemPrompt },
          ...body.messages,
          {
            role: "assistant",
            content:
              "Provide the structured JSON now. Do not include explanations.",
          },
        ],
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      return NextResponse.json(
        { error: "Groq request failed", details: error },
        { status: 500 }
      );
    }

    const data = await res.json();
    const rawText =
      data?.choices?.[0]?.message?.content ??
      data?.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments ??
      "{}";

    const fenceStripped = rawText
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();
    const match = fenceStripped.match(/\{[\s\S]*\}/);
    const jsonString = match ? match[0] : fenceStripped;

    const parsed = JSON.parse(jsonString);
    const cleaned = Object.fromEntries(
      fields.map((key) => [key, parsed[key] ?? ""])
    );

    return NextResponse.json({ form: cleaned });
  } catch (error) {
    return NextResponse.json(
      { error: "Groq parse error", details: (error as Error).message },
      { status: 500 }
    );
  }
}
