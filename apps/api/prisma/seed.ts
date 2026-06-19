import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@hubcentral.com' },
    update: { emailVerified: true },
    create: {
      email: 'admin@hubcentral.com',
      password: hashedPassword,
      role: 'admin',
      emailVerified: true,
      authProvider: 'local',
      name: 'Administrador',
    },
  });

  const productCount = await prisma.product.count({ where: { userId: admin.id } });
  if (productCount === 0) {
    await prisma.product.createMany({
      data: [
        { userId: admin.id, name: 'PDV', price: 199.9, type: 'PDV' },
        { userId: admin.id, name: 'Site Institucional', price: 149.9, type: 'SITE_INSTITUCIONAL' },
        { userId: admin.id, name: 'Loja Online', price: 299.9, type: 'LOJA_ONLINE' },
      ],
    });
  }

  console.log('Seed criado:', { admin: admin.email });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
