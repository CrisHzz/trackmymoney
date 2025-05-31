const { Client } = require('@elastic/elasticsearch');
const { createTransactionsIndex } = require('../src/lib/elasticsearch');

const elasticsearchUrl = process.env.ELASTICSEARCH_URL || 'http://localhost:9200';

async function main() {
  try {
    console.log('Iniciando Elasticsearch...');
    console.log('URL:', elasticsearchUrl);

    // Crear el índice de transacciones
    await createTransactionsIndex();
    console.log('Índice de transacciones creado exitosamente');

    console.log('Elasticsearch está listo para usar');
  } catch (error) {
    console.error('Error al iniciar Elasticsearch:', error);
    process.exit(1);
  }
}

main(); 