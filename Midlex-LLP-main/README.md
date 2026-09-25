# Midlex LLP

Law firm website and dashboard.

## Vercel + Firebase deployment

This project now uses Vercel for the frontend and Firebase services for backend data/files:

- Firestore stores users, cases, documents, messages, payments, payment accounts, court dates, and inquiries.
- Firebase Storage is used first for document/payment-proof uploads when `FIREBASE_STORAGE_BUCKET` is configured.
- Firebase rules are locked down because the NestJS backend uses Firebase Admin SDK.
- Vercel hosts the Next.js frontend from `frontend`.

The frontend is a Next.js app and the backend is a NestJS Node API. Because the app has server-rendered dynamic routes and secure backend logic, the realistic low-cost deployment is:

- Firebase/Google Cloud project on Blaze with budget alerts.
- Firestore + Storage free quotas for normal small-client usage.
- Backend on Cloud Run using `backend/Dockerfile`.
- Frontend on Vercel.

Firebase Spark can host static sites for free, but this app is not fully static. Vercel is a better fit for the frontend.

See `DEPLOYMENT.md` for the full deployment checklist.

## Environment files

Copy the examples and fill them in:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

For Cloud Run, use `FIREBASE_SERVICE_ACCOUNT_BASE64` instead of raw JSON when possible.

## Seed Firebase

From `backend`:

```bash
npm run seed:firebase
```

Default seed users:

- `midlexllp01@gmail.com` / `Admin@123`
- `lawyer1@midlex.com` / `admin123`

Change these passwords before giving the app to a client.

## Verify locally

```bash
cd backend
npm install
npm run build
npm run start:dev
```

```bash
cd frontend
npm install
npm run build
npm run dev
```
