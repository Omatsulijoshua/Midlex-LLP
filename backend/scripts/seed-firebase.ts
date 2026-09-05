import { cert, getApps, initializeApp, applicationDefault } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs';
import * as path from 'path';
import { randomUUID } from 'crypto';

function readServiceAccount() {
  const raw =
    process.env.FIREBASE_SERVICE_ACCOUNT_JSON ||
    (process.env.FIREBASE_SERVICE_ACCOUNT_BASE64
      ? Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, 'base64').toString('utf8')
      : '');

  if (!raw.trim()) return null;
  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed.private_key === 'string') {
      parsed.private_key = parsed.private_key.replace(/\\n/g, '\n');
    }
    return parsed;
  } catch {
    return null;
  }
}

async function upsertLocalUser(data: {
  email: string;
  name: string;
  password: string;
  role: 'ADMIN' | 'LAWYER' | 'CLIENT';
  phone?: string;
}) {
  const dbPath = path.join(process.cwd(), 'data', 'offline-db.json');
  const dir = path.dirname(dbPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  let db: Record<string, Record<string, any>> = {};
  if (fs.existsSync(dbPath)) {
    try {
      db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    } catch {
      db = {};
    }
  }

  if (!db.users) db.users = {};

  const existingKey = Object.keys(db.users).find(
    (k) => db.users[k].email === data.email,
  );

  const hashedPassword = await bcrypt.hash(data.password, 10);
  const now = new Date().toISOString();

  if (existingKey) {
    db.users[existingKey] = {
      ...db.users[existingKey],
      name: data.name,
      password: hashedPassword,
      role: data.role,
      phone: data.phone || null,
      updatedAt: now,
    };
    console.log(`Updated offline local ${data.role}: ${data.email}`);
  } else {
    const id = randomUUID();
    db.users[id] = {
      id,
      email: data.email,
      name: data.name,
      password: hashedPassword,
      role: data.role,
      phone: data.phone || null,
      createdAt: now,
      updatedAt: now,
    };
    console.log(`Created offline local ${data.role}: ${data.email}`);
  }

  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
}

async function upsertFirebaseUser(data: {
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
    console.log(`Updated Firebase ${data.role}: ${data.email}`);
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
  console.log(`Created Firebase ${data.role}: ${data.email}`);
  return ref.id;
}

async function main() {
  const serviceAccount = readServiceAccount();
  const hasFirebase = !!serviceAccount || !!process.env.FIRESTORE_EMULATOR_HOST || !!process.env.GOOGLE_APPLICATION_CREDENTIALS;

  if (hasFirebase) {
    try {
      if (!getApps().length) {
        initializeApp({
          credential: serviceAccount ? cert(serviceAccount) : applicationDefault(),
        });
      }

      await upsertFirebaseUser({
        email: 'midlexllp01@gmail.com',
        name: 'Super Admin',
        password: 'Admin@123',
        role: 'ADMIN',
      });
      await upsertFirebaseUser({
        email: 'lawyer1@midlex.com',
        name: 'Barr. Adebayo',
        password: 'admin123',
        role: 'LAWYER',
        phone: '08012345678',
      });
      return;
    } catch (err) {
      console.warn('[seed] Firebase connection failed, falling back to local seed...', err);
    }
  }

  console.log('[seed] Seeding to offline local database store...');
  await upsertLocalUser({
    email: 'midlexllp01@gmail.com',
    name: 'Super Admin',
    password: 'Admin@123',
    role: 'ADMIN',
  });
  await upsertLocalUser({
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
