# Ascendia

Ascendia is a modern EdTech web app built with Next.js, Tailwind CSS, Firebase Authentication, and Cloud Firestore.

Live site: https://ascendia-five.vercel.app/

## Tech Stack

- Next.js (App Router)
- React
- Tailwind CSS
- Firebase Authentication
- Cloud Firestore

## Local Development

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000 in your browser.

## Firebase Setup

1. Create a Firebase project and register a web app.
2. Enable the `Email/Password` and `Google` sign-in providers in Firebase Authentication.
3. Copy your Firebase web config values into `.env.local`.
4. Ensure Firestore is enabled. The app creates a `users` profile document automatically on first sign-in.

## Scripts

- `npm run dev` - start the development server
- `npm run build` - create a production build
- `npm run start` - run the production server
- `npm run lint` - run ESLint
