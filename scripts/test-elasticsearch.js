const { Client } = require('@elastic/elasticsearch');
const { indexTransaction, searchTransactions, getTransactionStats, deleteTransaction } = require('../src/lib/transactions');

const elasticsearchUrl = process.env.ELASTICSEARCH_URL || 'http://localhost:9200';

async function main() {
  try {
    console.log('Probando funcionalidad de Elasticsearch...');

    // 1. Crear algunas transacciones de prueba
    const testTransactions = [
      {
        id: 1,
        monto: 1000,
        descripcion: 'Salario',
        fecha: new Date().toISOString(),
        tipo: 'ingreso',
        categoria: { id: 1, nombre: 'Salario' },
        usuario_id: 1,
        tipo_ingreso: 'Mensual',
        recurrente: true,
        frecuencia: 'Mensual'
      },
      {
        id: 2,
        monto: 500,
        descripcion: 'Compras',
        fecha: new Date().toISOString(),
        tipo: 'gasto',
        categoria: { id: 2, nombre: 'Compras' },
        usuario_id: 1,
        metodo_pago: 'Tarjeta',
        factura: true
      }
    ];

    console.log('\n1. Indexando transacciones de prueba...');
    for (const transaction of testTransactions) {
      await indexTransaction(transaction);
      console.log(`Transacción indexada: ${transaction.descripcion}`);
    }

    // 2. Buscar transacciones
    console.log('\n2. Buscando todas las transacciones...');
    const allTransactions = await searchTransactions(1);
    console.log('Transacciones encontradas:', allTransactions);

    // 3. Buscar solo ingresos
    console.log('\n3. Buscando solo ingresos...');
    const incomeTransactions = await searchTransactions(1, 'ingreso');
    console.log('Ingresos encontrados:', incomeTransactions);

    // 4. Obtener estadísticas
    console.log('\n4. Obteniendo estadísticas...');
    const stats = await getTransactionStats(1);
    console.log('Estadísticas:', stats);

    // 5. Eliminar una transacción
    console.log('\n5. Eliminando una transacción...');
    await deleteTransaction(1, 'ingreso');
    console.log('Transacción eliminada');

    // 6. Verificar que se eliminó
    console.log('\n6. Verificando transacciones después de eliminar...');
    const remainingTransactions = await searchTransactions(1);
    console.log('Transacciones restantes:', remainingTransactions);

    console.log('\nPrueba completada exitosamente');
  } catch (error) {
    console.error('Error durante la prueba:', error);
    process.exit(1);
  }
}

main(); 