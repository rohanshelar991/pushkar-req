# AI Toggle Form (Next.js + Firebase + Gemini)

Modern App Router build that lets users fill a 10-field form manually or via an AI chatbot, persisting submissions in Firebase Firestore and exposing an `/admin` dashboard.

## Quick start
1. Install deps: `npm install`
2. Copy `.env.example` to `.env.local` and fill Firebase + Gemini keys.
3. Run dev server: `npm run dev` then open http://localhost:3000

## Environment variables
```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
GEMINI_API_KEY=
```

## Features
- Toggle between **Manual** form and **AI Chatbot** (Gemini 1.5 Flash) that asks questions, extracts JSON, and auto-fills the form.
- Firestore writes with server timestamps; success messaging for users.
- Admin dashboard at `/admin` listing latest submissions with key fields.
- Tailwind CSS v4 styling with expressive typography and gradients.

## Structure
- `src/app/page.tsx` — main UI with toggle, manual form, chat flow.
- `src/app/admin/page.tsx` — admin table view of Firestore entries.
- `src/app/api/ai/route.ts` — server route proxying to Gemini, returning structured JSON.
- `src/lib/firebase.ts` — Firebase app + Firestore init.
- `src/lib/firestore.ts` — helper functions to save/fetch submissions.
- `src/components/*` — UI components for toggle, manual form, chatbot.

## Firebase
Create a Web app in your Firebase project, enable Firestore, and plug the config values into `.env.local`. Ensure Firestore rules allow reads/writes for your use case (for demos you can start in test mode).

## Gemini
Set `GEMINI_API_KEY` to your Gemini API key. The server route keeps the key off the client; the chat component calls `/api/ai` with the conversation transcript and receives structured fields.

## Admin page
Navigate to `/admin` while logged in (no auth added for brevity). Table is client-side and orders by `createdAt` descending.
