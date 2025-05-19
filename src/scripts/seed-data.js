const { Client } = require('@elastic/elasticsearch');

const elasticsearchUrl = process.env.ELASTICSEARCH_URL || 'http://localhost:9200';
const client = new Client({ 
  node: elasticsearchUrl,
  apiVersion: '8.12.1'
});

async function createTransactionsIndex() {
  try {
    const exists = await client.indices.exists({ index: 'transactions' });
    if (!exists) {
      await client.indices.create({
        index: 'transactions',
        mappings: {
          properties: {
            amount: { type: 'float' },
            description: { type: 'text' },
            category: { type: 'keyword' },
            type: { type: 'keyword' },
            date: { type: 'date' },
            userId: { type: 'keyword' }
          }
        }
      });
      console.log('Transactions index created successfully');
    }
  } catch (error) {
    console.error('Error creating transactions index:', error);
    throw error;
  }
}

async function addTransaction(transaction) {
  try {
    const response = await client.index({
      index: 'transactions',
      document: transaction
    });
    return response;
  } catch (error) {
    console.error('Error adding transaction:', error);
    throw error;
  }
}

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
        type: 'income',
        date: new Date('2025-05-18'),
        userId: 'user1'
      },
      {
        amount: 800,
        description: 'Alquiler',
        category: 'Vivienda',
        type: 'expense',
        date: new Date('2025-05-18'),
        userId: 'user1'
      },
      {
        amount: 200,
        description: 'Supermercado',
        category: 'Alimentación',
        type: 'expense',
        date: new Date('2025-05-18'),
        userId: 'user1'
      },
      {
        amount: 100,
        description: 'Gasolina',
        category: 'Transporte',
        type: 'expense',
        date: new Date('2025-05-18'),
        userId: 'user1'
      },
      {
        amount: 300,
        description: 'Freelance',
        category: 'Trabajo extra',
        type: 'income',
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