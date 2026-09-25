# Deployment Guide: Vercel + Firebase

This setup keeps hosting simple and low-cost:

- Vercel runs the Next.js frontend from `frontend`.
- Cloud Run runs the NestJS backend from `backend/Dockerfile`.
- Firebase Auth, Firestore, and Storage hold app users, data, and uploads.

## 1. Firebase project

Create a Firebase project and enable:

- Authentication: Email/Password provider
- Firestore Database
- Storage

Set Firestore and Storage rules from this repo:

```bash
firebase deploy --only firestore:rules,storage
```

Create a Firebase service account key:

1. Open Firebase project settings.
2. Go to Service accounts.
3. Generate a new private key.
4. Base64 encode the downloaded JSON for Cloud Run:

```powershell
[Convert]::ToBase64String([IO.File]::ReadAllBytes("firebase-service-account.json"))
```

Keep this value private.

## 2. Backend on Cloud Run

Deploy `backend` as a Cloud Run service using the included Dockerfile.

Required Cloud Run environment variables:

```env
PORT=8080
HOST=0.0.0.0
FRONTEND_URL=https://your-vercel-domain.vercel.app
BACKEND_URL=https://your-cloud-run-backend-url.run.app
JWT_SECRET=replace-this-with-a-long-random-secret
FIREBASE_SERVICE_ACCOUNT_BASE64=base64-service-account-json
FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
OPAY_PUBLIC_KEY=your-opay-public-key
OPAY_PRIVATE_KEY=your-opay-private-key
OPAY_MERCHANT_ID=your-opay-merchant-id
OPAY_COUNTRY=NG
OPAY_SANDBOX=true
```

Optional fallback variables:

```env
CLOUDINARY_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

After deploy, copy the Cloud Run service URL. It will look like:

```text
https://midlex-backend-xxxxx.run.app
```

Seed the first admin/lawyer against Firebase:

```bash
cd backend
npm install
npm run seed:firebase
```

Default seeded accounts:

- `midlexllp01@gmail.com` / `Admin@123`
- `lawyer1@midlex.com` / `admin123`

Change these before handing the app to the client.

## 3. Frontend on Vercel

In Vercel:

1. Import this Git repo.
2. Set Root Directory to `frontend`.
3. Use the default Next.js framework settings.
4. Add environment variables:

```env
NEXT_PUBLIC_API_URL=https://your-cloud-run-backend-url.run.app
NEXT_PUBLIC_SITE_URL=https://your-vercel-domain.vercel.app
```

Deploy the frontend.

After Vercel gives you the final domain, update Cloud Run `FRONTEND_URL` to match it exactly, then redeploy/restart the backend.

## 4. Cost guardrails

To keep this close to free:

- Add a Google Cloud billing budget alert for the Firebase project.
- Set Cloud Run minimum instances to `0`.
- Keep Firestore in native mode and avoid unnecessary polling.
- Keep uploaded files reasonably small.
- Do not make Storage publicly writable. This repo's rules keep writes backend-only.

## 5. Local development

Backend:

```bash
cd backend
npm install
npm run start:dev
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Local frontend env:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```
