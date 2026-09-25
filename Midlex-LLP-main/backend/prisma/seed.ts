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

  console.log({ lawyer1 });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
