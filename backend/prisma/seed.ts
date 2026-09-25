import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash('Admin@123', 10);
  const lawyerPassword = await bcrypt.hash('admin123', 10);

  // Create Admin
  const admin = await prisma.user.upsert({
    where: { email: 'midlexllp01@gmail.com' },
    update: {},
    create: {
      email: 'midlexllp01@gmail.com',
      name: 'Super Admin',
      password: adminPassword,
      role: Role.ADMIN,
    },
  });

  console.log({ admin });

  // Create some Lawyers
  const lawyer1 = await prisma.user.upsert({
    where: { email: 'lawyer1@midlex.com' },
    update: {},
    create: {
      email: 'lawyer1@midlex.com',
      name: 'Barr. Adebayo',
      password: lawyerPassword,
      role: Role.LAWYER,
      phone: '08012345678',
    },
  });

  const accountant = await prisma.user.upsert({
    where: { email: 'accountant@midlex.com' },
    update: {},
    create: {
      email: 'accountant@midlex.com',
      name: 'Chief Accountant (Finance)',
      password: await bcrypt.hash('accountant123', 10),
      role: Role.ADMIN,
      phone: '08098765432',
    },
  });

  const client = await prisma.user.upsert({
    where: { email: 'client@midlex.com' },
    update: {},
    create: {
      email: 'client@midlex.com',
      name: 'Demo Client (John Doe)',
      password: await bcrypt.hash('client123', 10),
      role: Role.CLIENT,
      phone: '08033334444',
    },
  });

  console.log({ admin, lawyer1, accountant, client });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
