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

## 3. Deploying 3 Separate Applications to Different Domains (Vercel)

Each portal (`frontend`, `admin`, `lawyers`) can be imported into Vercel as a separate project and pointed to its own domain/subdomain.

### App 1: Public Website & Client Portal (`frontend/`)
1. In Vercel, click **Add New** > **Project** and select repository `Omatsulijoshua/Midlex-LLP`.
2. Name project: `midlex-frontend` (or `midlex-client`).
3. Set **Root Directory** to `frontend`.
4. Environment Variables:
   ```env
   NEXT_PUBLIC_API_URL=https://midlex-backend.onrender.com
   NEXT_PUBLIC_SITE_URL=https://midlexlawfirms.vercel.app
   ```
5. Assign Domain (e.g. `midlexlawfirms.vercel.app` or `client.midlex.com`).

---

### App 2: Admin & Super Admin Portal (`admin/`)
1. In Vercel, click **Add New** > **Project** and select repository `Omatsulijoshua/Midlex-LLP`.
2. Name project: `midlex-admin`.
3. Set **Root Directory** to `admin`.
4. Environment Variables:
   ```env
   NEXT_PUBLIC_API_URL=https://midlex-backend.onrender.com
   NEXT_PUBLIC_SITE_URL=https://midlex-admin.vercel.app
   ```
5. Assign Domain (e.g. `midlex-admin.vercel.app` or `admin.midlex.com`).

---

### App 3: Lawyer & Counsel Portal (`lawyers/`)
1. In Vercel, click **Add New** > **Project** and select repository `Omatsulijoshua/Midlex-LLP`.
2. Name project: `midlex-lawyers`.
3. Set **Root Directory** to `lawyers`.
4. Environment Variables:
   ```env
   NEXT_PUBLIC_API_URL=https://midlex-backend.onrender.com
   NEXT_PUBLIC_SITE_URL=https://midlex-lawyers.vercel.app
   ```
5. Assign Domain (e.g. `midlex-lawyers.vercel.app` or `lawyers.midlex.com`).

---

## 4. Local Development

Start all 4 servers locally with `start-offline.bat`:
- **Backend API**: `http://localhost:3001`
- **Public & Client Portal**: `http://localhost:3000`
- **Admin Portal**: `http://localhost:3002`
- **Lawyer Portal**: `http://localhost:3003`
