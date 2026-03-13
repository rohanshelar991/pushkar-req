# Netlify deploy checklist

1) Repo ready
   - Commit your code and push to GitHub/GitLab/Bitbucket.

2) Environment variables (Netlify UI → Site settings → Build & deploy → Environment)
```
GROQ_API_KEY=
XAI_API_KEY=
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

3) Netlify site setup
   - “Add new site” → “Import from Git”.
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Framework: Next.js (Netlify auto-detects; `netlify.toml` is included).

4) Firestore rules (recommended for prod)
```
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

5) Verify after deploy
   - Form submits and shows success.
   - `/admin` lists new entries.
   - AI chat fills the form (ensure GROQ_API_KEY has access).
