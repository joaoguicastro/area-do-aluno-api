// prisma/seed.ts
import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'redeinfinitycursos@gmail.com';
  const senhaPura = '160405Jg@';

  const senhaHash = await bcrypt.hash(senhaPura, 10);

  const funcionario = await prisma.funcionario.upsert({
    where: { email },
    update: {
      nome: 'Master',
      senhaHash,
      role: Role.MASTER,
    },
    create: {
      nome: 'Master',
      email,
      senhaHash,
      role: Role.MASTER,
    },
  });

  console.log(`✅ MASTER criado/atualizado: ${funcionario.email}`);
}

main()
  .catch((e) => {
    console.error('❌ Seed falhou:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
