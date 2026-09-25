import { cert, getApps, initializeApp, applicationDefault } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import * as bcrypt from 'bcrypt';

function readServiceAccount() {
  const raw =
    process.env.FIREBASE_SERVICE_ACCOUNT_JSON ||
    (process.env.FIREBASE_SERVICE_ACCOUNT_BASE64
      ? Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, 'base64').toString('utf8')
      : '');

  if (!raw.trim()) return null;
  const parsed = JSON.parse(raw);
  if (typeof parsed.private_key === 'string') {
    parsed.private_key = parsed.private_key.replace(/\\n/g, '\n');
  }
  return parsed;
}

async function upsertUser(data: {
  email: string;
  name: string;
  password: string;
  role: 'ADMIN' | 'LAWYER' | 'CLIENT';
  phone?: string;
}) {
  const db = getFirestore();
  let authUser;
  try {
    authUser = await getAuth().getUserByEmail(data.email);
    await getAuth().updateUser(authUser.uid, {
      password: data.password,
      displayName: data.name,
    });
  } catch {
    authUser = await getAuth().createUser({
      email: data.email,
      password: data.password,
      displayName: data.name,
    });
  }

  const existing = await db
    .collection('users')
    .where('email', '==', data.email)
    .limit(1)
    .get();

  if (!existing.empty) {
    const doc = existing.docs[0];
    await doc.ref.update({
      name: data.name,
      password: await bcrypt.hash(data.password, 10),
      role: data.role,
      phone: data.phone || null,
      updatedAt: Timestamp.now(),
    });
    console.log(`Updated ${data.role}: ${data.email}`);
    return doc.id;
  }

  const ref = db.collection('users').doc(authUser.uid);
  const now = Timestamp.now();
  await ref.set({
    id: ref.id,
    firebaseUid: authUser.uid,
    email: data.email,
    name: data.name,
    password: await bcrypt.hash(data.password, 10),
    role: data.role,
    phone: data.phone || null,
    createdAt: now,
    updatedAt: now,
  });
  console.log(`Created ${data.role}: ${data.email}`);
  return ref.id;
}

async function main() {
  if (!getApps().length) {
    const serviceAccount = readServiceAccount();
    initializeApp({
      credential: serviceAccount ? cert(serviceAccount) : applicationDefault(),
    });
  }

  await upsertUser({
    email: 'midlexllp01@gmail.com',
    name: 'Super Admin',
    password: 'Admin@123',
    role: 'ADMIN',
  });
  await upsertUser({
    email: 'lawyer1@midlex.com',
    name: 'Barr. Adebayo',
    password: 'admin123',
    role: 'LAWYER',
    phone: '08012345678',
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
