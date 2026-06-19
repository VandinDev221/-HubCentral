import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@hubcentral.com' },
    update: {},
    create: {
      email: 'admin@hubcentral.com',
      password: hashedPassword,
      role: 'admin',
    },
  });

  const productCount = await prisma.product.count();
  if (productCount === 0) {
    await prisma.product.createMany({
      data: [
        { name: 'PDV', price: 199.9, type: 'PDV' },
        { name: 'Site Institucional', price: 149.9, type: 'SITE_INSTITUCIONAL' },
        { name: 'Loja Online', price: 299.9, type: 'LOJA_ONLINE' },
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
