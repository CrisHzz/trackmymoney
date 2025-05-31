import { elasticsearchClient } from './elasticsearch';

const TRANSACTIONS_INDEX = 'transactions';

// Función para indexar una transacción
export async function indexTransaction(transaction: {
  id: number;
  monto: number;
  descripcion: string;
  fecha: string;
  tipo: 'ingreso' | 'gasto';
  categoria?: {
    id: number;
    nombre: string;
  };
  usuario_id: number;
  metodo_pago?: string;
  factura?: boolean;
  tipo_ingreso?: string;
  recurrente?: boolean;
  frecuencia?: string;
}) {
  try {
    const document = {
      id: transaction.id,
      monto: transaction.monto,
      descripcion: transaction.descripcion,
      fecha: transaction.fecha,
      tipo: transaction.tipo,
      categoria: transaction.categoria?.nombre || 'Sin categoría',
      usuario_id: transaction.usuario_id,
      metodo_pago: transaction.metodo_pago,
      factura: transaction.factura,
      tipo_ingreso: transaction.tipo_ingreso,
      recurrente: transaction.recurrente,
      frecuencia: transaction.frecuencia
    };

    await elasticsearchClient.index({
      index: TRANSACTIONS_INDEX,
      document,
      id: `${transaction.tipo}-${transaction.id}` // ID único para cada transacción
    });

    console.log('Transaction indexed successfully:', document);
  } catch (error) {
    console.error('Error indexing transaction:', error);
    throw error;
  }
}

// Función para buscar transacciones
export async function searchTransactions(userId: number, filter?: 'todos' | 'ingreso' | 'gasto') {
  try {
    const query: any = {
      bool: {
        must: [
          { term: { usuario_id: userId } }
        ]
      }
    };

    if (filter && filter !== 'todos') {
      query.bool.must.push({ term: { tipo: filter } });
    }

    const response = await elasticsearchClient.search({
      index: TRANSACTIONS_INDEX,
      query,
      sort: [
        { fecha: { order: 'desc' } }
      ]
    });

    return response.hits.hits.map(hit => hit._source);
  } catch (error) {
    console.error('Error searching transactions:', error);
    throw error;
  }
}

// Función para obtener estadísticas de transacciones
export async function getTransactionStats(userId: number) {
  try {
    const response = await elasticsearchClient.search({
      index: TRANSACTIONS_INDEX,
      size: 0,
      query: {
        term: { usuario_id: userId }
      },
      aggs: {
        total_ingresos: {
          filter: { term: { tipo: 'ingreso' } },
          aggs: {
            monto: { sum: { field: 'monto' } }
          }
        },
        total_gastos: {
          filter: { term: { tipo: 'gasto' } },
          aggs: {
            monto: { sum: { field: 'monto' } }
          }
        },
        gastos_por_categoria: {
          filter: { term: { tipo: 'gasto' } },
          aggs: {
            por_categoria: {
              terms: { field: 'categoria' }
            }
          }
        },
        ingresos_por_tipo: {
          filter: { term: { tipo: 'ingreso' } },
          aggs: {
            por_tipo: {
              terms: { field: 'tipo_ingreso' }
            }
          }
        }
      }
    });

    return response.aggregations;
  } catch (error) {
    console.error('Error getting transaction stats:', error);
    throw error;
  }
}

// Función para eliminar una transacción
export async function deleteTransaction(id: number, tipo: 'ingreso' | 'gasto') {
  try {
    await elasticsearchClient.delete({
      index: TRANSACTIONS_INDEX,
      id: `${tipo}-${id}`
    });
    console.log('Transaction deleted successfully:', id);
  } catch (error) {
    console.error('Error deleting transaction:', error);
    throw error;
  }
} 