import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seed en cours...');

  try {
    // Supprimer les données existantes dans l'ordre des dépendances
    console.log('🗑️  Suppression des investissements...');
    await prisma.investissement.deleteMany({});
    
    console.log('🗑️  Suppression des parcelles...');
    await prisma.parcelle.deleteMany({});
    
    console.log('🗑️  Suppression des utilisateurs...');
    await prisma.user.deleteMany({});

    console.log('✅ Données supprimées');

    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash('password123', 10);

    // 1. Créer les utilisateurs
    console.log('👤 Création des utilisateurs...');
    
    const admin = await prisma.user.create({
      data: {
        email: 'admin@9m2.com',
        password: hashedPassword,
        nom: 'Admin',
        prenom: 'Système',
        role: 'ADMIN',
        telephone: '+221 77 123 45 67',
      },
    });

    const investisseur = await prisma.user.create({
      data: {
        email: 'investisseur@9m2.com',
        password: hashedPassword,
        nom: 'Diop',
        prenom: 'Amadou',
        role: 'INVESTISSEUR',
        telephone: '+221 77 234 56 78',
      },
    });

    const agriculteur = await prisma.user.create({
      data: {
        email: 'agriculteur@9m2.com',
        password: hashedPassword,
        nom: 'Ndiaye',
        prenom: 'Fatou',
        role: 'AGRICULTEUR',
        telephone: '+221 77 345 67 89',
      },
    });

    console.log('✅ Utilisateurs créés');

    // 2. Créer des parcelles
    console.log('🌾 Création des parcelles...');
    
    const parcelle1 = await prisma.parcelle.create({
      data: {
        nom: 'Parcelle Nord - Tomates',
        superficie: 500,
        localisation: 'Thiès, Sénégal',
        typeculture: 'Tomates',
        description: 'Parcelle fertile idéale pour la culture de tomates. Système d\'irrigation moderne.',
        prix_m2: 5000,
        statut: 'DISPONIBLE',
        images: [
          'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=800',
          'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800',
        ],
        agriculteurId: agriculteur.id,
      },
    });

    const parcelle2 = await prisma.parcelle.create({
      data: {
        nom: 'Parcelle Sud - Oignons',
        superficie: 300,
        localisation: 'Kaolack, Sénégal',
        typeculture: 'Oignons',
        description: 'Terre riche en nutriments, parfaite pour les oignons. Proche d\'une source d\'eau.',
        prix_m2: 4500,
        statut: 'DISPONIBLE',
        images: [
          'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800',
        ],
        agriculteurId: agriculteur.id,
      },
    });

    const parcelle3 = await prisma.parcelle.create({
      data: {
        nom: 'Parcelle Est - Maïs',
        superficie: 1000,
        localisation: 'Saint-Louis, Sénégal',
        typeculture: 'Maïs',
        description: 'Grande parcelle adaptée à la culture intensive du maïs. Sol argileux.',
        prix_m2: 3500,
        statut: 'PARTIELLEMENT_VENDUE',
        images: [
          'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800',
          'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800',
        ],
        agriculteurId: agriculteur.id,
      },
    });

    console.log('✅ Parcelles créées');

    // 3. Créer des investissements
    console.log('💰 Création des investissements...');
    
    await prisma.investissement.create({
      data: {
        superficie: 100,
        montant_total: 350000,
        statut: 'ACTIF',
        date_debut: new Date('2024-01-15'),
        date_fin: new Date('2024-07-15'),
        investisseurId: investisseur.id,
        parcelleId: parcelle3.id,
      },
    });

    console.log('✅ Investissements créés');

    console.log('\n🎉 Seed terminé avec succès !');
    console.log('\n📋 Identifiants de connexion:');
    console.log('   👤 Admin: admin@9m2.com / password123');
    console.log('   👤 Investisseur: investisseur@9m2.com / password123');
    console.log('   👤 Agriculteur: agriculteur@9m2.com / password123');
    console.log('\n📊 Données créées:');
    console.log('   • 3 utilisateurs');
    console.log('   • 3 parcelles');
    console.log('   • 1 investissement');

  } catch (error) {
    console.error('❌ Erreur détaillée:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('❌ Erreur:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
