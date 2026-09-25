import { Injectable } from '@nestjs/common';
import { cert, getApps, initializeApp, applicationDefault } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
import { randomUUID } from 'crypto';

type ModelName =
  | 'user'
  | 'case'
  | 'document'
  | 'message'
  | 'payment'
  | 'paymentAccount'
  | 'passwordReset'
  | 'notification'
  | 'courtDate'
  | 'inquiry';

type QueryArgs = {
  where?: any;
  data?: any;
  include?: any;
  select?: any;
  orderBy?: Record<string, 'asc' | 'desc'>;
  take?: number;
  by?: string[];
};

const COLLECTIONS: Record<ModelName, string> = {
  user: 'users',
  case: 'cases',
  document: 'documents',
  message: 'messages',
  payment: 'payments',
  paymentAccount: 'paymentAccounts',
  passwordReset: 'passwordResets',
  notification: 'notifications',
  courtDate: 'courtDates',
  inquiry: 'inquiries',
};

@Injectable()
export class PrismaService {
  private db = getFirestore(this.app);
  private bucketName = process.env.FIREBASE_STORAGE_BUCKET;

  user = this.model('user');
  case = this.model('case');
  document = this.model('document');
  message = this.model('message');
  payment = this.model('payment');
  paymentAccount = this.model('paymentAccount');
  passwordReset = this.model('passwordReset');
  notification = this.model('notification');
  courtDate = this.model('courtDate');
  inquiry = this.model('inquiry');

  get storageBucket() {
    if (!this.bucketName) return null;
    return getStorage(this.app).bucket(this.bucketName);
  }

  private get app() {
    if (getApps().length) return getApps()[0]!;

    const serviceAccount = this.readServiceAccount();
    return initializeApp({
      credential: serviceAccount ? cert(serviceAccount) : applicationDefault(),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    });
  }

  private readServiceAccount() {
    const raw =
      process.env.FIREBASE_SERVICE_ACCOUNT_JSON ||
      (process.env.FIREBASE_SERVICE_ACCOUNT_BASE64
        ? Buffer.from(
            process.env.FIREBASE_SERVICE_ACCOUNT_BASE64,
            'base64',
          ).toString('utf8')
        : '');

    if (!raw.trim()) {
      console.warn(
        '[firebase] No service account env found. Falling back to application default credentials.',
      );
      return null;
    }

    try {
      const parsed = JSON.parse(raw);
      if (typeof parsed.private_key === 'string') {
        parsed.private_key = parsed.private_key.replace(/\\n/g, '\n');
      }
      return parsed;
    } catch (err) {
      console.error(
        '[firebase] Invalid service account JSON/base64. Falling back to application default credentials.',
        err,
      );
      return null;
    }
  }

  private model(name: ModelName) {
    return {
      create: (args: QueryArgs) => this.create(name, args),
      findUnique: (args: QueryArgs) => this.findUnique(name, args),
      findMany: (args: QueryArgs = {}) => this.findMany(name, args),
      update: (args: QueryArgs) => this.update(name, args),
      delete: (args: QueryArgs) => this.delete(name, args),
      count: (args: QueryArgs = {}) => this.count(name, args),
      groupBy: (args: QueryArgs) => this.groupBy(name, args),
    };
  }

  private col(name: ModelName) {
    return this.db.collection(COLLECTIONS[name]);
  }

  private async create(name: ModelName, args: QueryArgs) {
    const now = new Date();
    const id = args.data?.id || randomUUID();
    const data = this.clean({
      ...args.data,
      id,
      createdAt: args.data?.createdAt || now,
      updatedAt:
        name === 'document' || name === 'message'
          ? args.data?.updatedAt
          : args.data?.updatedAt || now,
    });

    if (name === 'user') {
      const existing = await this.findMany('user', {
        where: { email: data.email },
        take: 1,
      });
      if (existing.length) {
        const err: any = new Error('Email already in use');
        err.code = 'P2002';
        throw err;
      }
    }

    await this.col(name).doc(id).set(this.toFirestore(data));
    return this.withRelations(name, data, args.include, args.select);
  }

  private async findUnique(name: ModelName, args: QueryArgs) {
    const where = args.where || {};
    let found: any = null;

    if (where.id) {
      const snap = await this.col(name).doc(where.id).get();
      found = snap.exists ? this.fromDoc(snap) : null;
    } else {
      const rows = await this.findMany(name, { where, take: 1 });
      found = rows[0] || null;
    }

    if (!found) return null;
    return this.withRelations(name, found, args.include, args.select);
  }

  private async findMany(name: ModelName, args: QueryArgs = {}) {
    const snap = await this.col(name).get();
    let rows = snap.docs.map((doc) => this.fromDoc(doc));

    if (args.where) {
      rows = rows.filter((row) => this.matchesWhere(row, args.where));
    }

    if (args.orderBy) {
      const [[key, dir]] = Object.entries(args.orderBy);
      rows.sort((a, b) => this.compare(a[key], b[key], dir));
    }

    if (typeof args.take === 'number') rows = rows.slice(0, args.take);

    return Promise.all(
      rows.map((row) => this.withRelations(name, row, args.include, args.select)),
    );
  }

  private async update(name: ModelName, args: QueryArgs) {
    const existing = await this.findUnique(name, { where: args.where });
    if (!existing) throw new Error(`${name} not found`);

    const data = this.clean({
      ...existing,
      ...args.data,
      updatedAt:
        name === 'document' || name === 'message'
          ? existing.updatedAt
          : new Date(),
    });
    await this.col(name).doc(existing.id).set(this.toFirestore(data), {
      merge: true,
    });
    return this.withRelations(name, data, args.include, args.select);
  }

  private async delete(name: ModelName, args: QueryArgs) {
    const existing = await this.findUnique(name, { where: args.where });
    if (!existing) throw new Error(`${name} not found`);
    await this.col(name).doc(existing.id).delete();
    return existing;
  }

  private async count(name: ModelName, args: QueryArgs = {}) {
    return (await this.findMany(name, { where: args.where })).length;
  }

  private async groupBy(name: ModelName, args: QueryArgs) {
    const rows = await this.findMany(name, { where: args.where });
    const keys = args.by || [];
    const seen = new Map<string, any>();
    for (const row of rows) {
      const grouped = Object.fromEntries(keys.map((key) => [key, row[key]]));
      seen.set(JSON.stringify(grouped), grouped);
    }
    return [...seen.values()];
  }

  private async withRelations(
    name: ModelName,
    row: any,
    include?: any,
    select?: any,
  ) {
    let out = { ...row };

    if (include) {
      if (name === 'case') out = await this.includeCase(out, include);
      if (name === 'document' && include.uploadedBy) {
        out.uploadedBy = await this.findUnique('user', {
          where: { id: out.uploadedById },
          select: include.uploadedBy.select,
        });
      }
      if (name === 'message' && include.sender) {
        out.sender = await this.findUnique('user', {
          where: { id: out.senderId },
          select: include.sender.select,
        });
      }
      if (name === 'payment') out = await this.includePayment(out, include);
      if (name === 'courtDate' && include.case) {
        out.case = await this.findUnique('case', {
          where: { id: out.caseId },
          select: include.case.select,
        });
      }
      if (name === 'user' && include._count) {
        out._count = {
          casesAsLawyer: await this.count('case', {
            where: { lawyerId: out.id },
          }),
        };
      }
    }

    return this.applySelect(out, select);
  }

  private async includeCase(row: any, include: any) {
    const out = { ...row };
    if (include.client) {
      out.client = await this.findUnique('user', {
        where: { id: out.clientId },
        select: include.client.select,
      });
    }
    if (include.lawyer) {
      out.lawyer = out.lawyerId
        ? await this.findUnique('user', {
            where: { id: out.lawyerId },
            select: include.lawyer.select,
          })
        : null;
    }
    if (include.documents) {
      out.documents = await this.findMany('document', {
        where: { caseId: out.id },
      });
    }
    if (include.messages) {
      out.messages = await this.findMany('message', {
        where: { caseId: out.id },
        include: include.messages.include,
        orderBy: { createdAt: 'asc' },
      });
    }
    if (include.courtDates) {
      out.courtDates = await this.findMany('courtDate', {
        where: { caseId: out.id },
        orderBy: { date: 'asc' },
      });
    }
    return out;
  }

  private async includePayment(row: any, include: any) {
    const out = { ...row };
    if (include.case) {
      out.case = await this.findUnique('case', {
        where: { id: out.caseId },
        select: include.case.select,
      });
    }
    if (include.client) {
      out.client = await this.findUnique('user', {
        where: { id: out.clientId },
        select: include.client.select,
      });
    }
    if (include.account) {
      out.account = out.accountId
        ? await this.findUnique('paymentAccount', {
            where: { id: out.accountId },
            select: include.account.select,
          })
        : null;
    }
    if (include.verifiedBy) {
      out.verifiedBy = out.verifiedById
        ? await this.findUnique('user', {
            where: { id: out.verifiedById },
            select: include.verifiedBy.select,
          })
        : null;
    }
    return out;
  }

  private matchesWhere(row: any, where: any): boolean {
    return Object.entries(where).every(([key, expected]) => {
      if (key === 'case') return this.matchesCaseRelation(row, expected);
      return this.matchesValue(row[key], expected);
    });
  }

  private matchesCaseRelation(row: any, where: any) {
    if (!where || !Object.keys(where).length) return true;
    return false;
  }

  private matchesValue(value: any, expected: any): boolean {
    if (expected === null) return value === null || value === undefined;
    if (
      typeof expected !== 'object' ||
      expected instanceof Date ||
      Array.isArray(expected)
    ) {
      return value === expected;
    }

    if (expected.notIn) return !expected.notIn.includes(value);
    if (expected.gte !== undefined && this.asTime(value) < this.asTime(expected.gte)) {
      return false;
    }
    if (expected.lte !== undefined && this.asTime(value) > this.asTime(expected.lte)) {
      return false;
    }
    if (expected.lt !== undefined && this.asTime(value) >= this.asTime(expected.lt)) {
      return false;
    }
    return true;
  }

  private compare(a: any, b: any, dir: 'asc' | 'desc') {
    const av = this.asTime(a);
    const bv = this.asTime(b);
    if (av === bv) return 0;
    return (av > bv ? 1 : -1) * (dir === 'asc' ? 1 : -1);
  }

  private asTime(value: any) {
    if (value instanceof Date) return value.getTime();
    if (value?.toDate) return value.toDate().getTime();
    return value ?? 0;
  }

  private applySelect(row: any, select?: any) {
    if (!select) return row;
    const selected: any = {};
    for (const [key, enabled] of Object.entries(select)) {
      if (enabled === true) selected[key] = row[key];
    }
    return selected;
  }

  private clean(data: any) {
    return Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined),
    );
  }

  private toFirestore(data: any) {
    return Object.fromEntries(
      Object.entries(data).map(([key, value]) => [
        key,
        value instanceof Date ? Timestamp.fromDate(value) : value,
      ]),
    );
  }

  private fromDoc(doc: FirebaseFirestore.DocumentSnapshot) {
    const data = doc.data() || {};
    return this.fromFirestore({ id: doc.id, ...data });
  }

  private fromFirestore(data: any): any {
    if (data?.toDate) return data.toDate();
    if (Array.isArray(data)) return data.map((item) => this.fromFirestore(item));
    if (data && typeof data === 'object') {
      return Object.fromEntries(
        Object.entries(data).map(([key, value]) => [
          key,
          this.fromFirestore(value),
        ]),
      );
    }
    return data;
  }
}
