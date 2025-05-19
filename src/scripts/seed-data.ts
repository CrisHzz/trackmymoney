import { createTransactionsIndex, addTransaction } from '../lib/elasticsearch';

async function seedData() {
  try {
    // Create the transactions index
    await createTransactionsIndex();

    // Sample transactions
    const transactions = [
      {
        amount: 1500,
        description: 'Salario mensual',
        category: 'Salario',
        type: 'income' as const,
        date: new Date('2025-05-18'),
        userId: 'user1'
      },
      {
        amount: 800,
        description: 'Alquiler',
        category: 'Vivienda',
        type: 'expense' as const,
        date: new Date('2025-05-18'),
        userId: 'user1'
      },
      {
        amount: 200,
        description: 'Supermercado',
        category: 'Alimentación',
        type: 'expense' as const,
        date: new Date('2025-05-18'),
        userId: 'user1'
      },
      {
        amount: 100,
        description: 'Gasolina',
        category: 'Transporte',
        type: 'expense' as const,
        date: new Date('2025-05-18'),
        userId: 'user1'
      },
      {
        amount: 300,
        description: 'Freelance',
        category: 'Trabajo extra',
        type: 'income' as const,
        date: new Date('2025-05-18'),
        userId: 'user1'
      }
    ];

    // Add transactions
    for (const transaction of transactions) {
      await addTransaction(transaction);
    }

    console.log('Sample data seeded successfully!');
  } catch (error) {
    console.error('Error seeding data:', error);
  }
}

seedData(); 