import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seed: Création des utilisateurs...');

  // Supprimer les utilisateurs existants
  await prisma.user.deleteMany();
  console.log('🗑️  Anciens utilisateurs supprimés');

  // Hash des mots de passe
  const hashedAdminPassword = await bcrypt.hash('admin123', 10);
  const hashedInvestisseurPassword = await bcrypt.hash('invest123', 10);
  const hashedPaysanPassword = await bcrypt.hash('paysan123', 10);

  // Créer Admin
  const admin = await prisma.user.create({
    data: {
      email: 'admin@9m2.com',
      password: hashedAdminPassword,
      firstName: 'Admin',
      lastName: '9M²',
      role: 'ADMIN', // Utiliser la valeur en string directement
    },
  });
  console.log('✅ Admin créé:', admin.email, '- Role:', admin.role);

  // Créer Investisseur
  const investisseur = await prisma.user.create({
    data: {
      email: 'investisseur@9m2.com',
      password: hashedInvestisseurPassword,
      firstName: 'Jean',
      lastName: 'Dupont',
      role: 'INVESTISSEUR', // Valeur en string
    },
  });
  console.log('✅ Investisseur créé:', investisseur.email, '- Role:', investisseur.role);

  // Créer Paysan
  const paysan = await prisma.user.create({
    data: {
      email: 'paysan@9m2.com',
      password: hashedPaysanPassword,
      firstName: 'Pierre',
      lastName: 'Martin',
      role: 'PAYSAN', // Valeur en string
    },
  });
  console.log('✅ Paysan créé:', paysan.email, '- Role:', paysan.role);

  console.log('🎉 Seed terminé avec succès !');
  console.log('\n📋 Identifiants de connexion:');
  console.log('   Admin: admin@9m2.com / admin123');
  console.log('   Investisseur: investisseur@9m2.com / invest123');
  console.log('   Paysan: paysan@9m2.com / paysan123');
}

main()
  .catch((e) => {
    console.error('❌ Erreur:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
