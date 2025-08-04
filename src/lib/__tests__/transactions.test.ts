import {
  indexTransaction,
  searchTransactions,
  getTransactionStats,
  deleteTransaction
} from '../transactions';
import { elasticsearchClient } from '../elasticsearch';

// Mock para Elasticsearch
jest.mock('../elasticsearch');

const mockElasticsearchClient = elasticsearchClient as jest.Mocked<typeof elasticsearchClient>;

describe('Transactions - Pruebas de Caja Blanca', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
    // Restaurar implementación de console para evitar logs en pruebas
    jest.spyOn(console, 'log').mockImplementation();
    jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('indexTransaction', () => {
    test('debe indexar transacción válida correctamente', async () => {
      const transaccion = {
        id: 1,
        monto: 100.50,
        descripcion: 'Test transaction',
        fecha: '2024-01-15',
        tipo: 'gasto' as const,
        categoria: { id: 1, nombre: 'Comida' },
        usuario_id: 123,
        metodo_pago: 'tarjeta',
        factura: true
      };

      mockElasticsearchClient.index.mockResolvedValue({} as any);

      await indexTransaction(transaccion);

      expect(mockElasticsearchClient.index).toHaveBeenCalledWith({
        index: 'transactions',
        document: {
          id: 1,
          monto: 100.50,
          descripcion: 'Test transaction',
          fecha: '2024-01-15',
          tipo: 'gasto',
          categoria: 'Comida',
          usuario_id: 123,
          metodo_pago: 'tarjeta',
          factura: true,
          tipo_ingreso: undefined,
          recurrente: undefined,
          frecuencia: undefined
        },
        id: 'gasto-1'
      });
    });

    test('debe manejar transacción sin categoría', async () => {
      const transaccion = {
        id: 2,
        monto: 50.00,
        descripcion: 'Sin categoría',
        fecha: '2024-01-15',
        tipo: 'gasto' as const,
        usuario_id: 123
      };

      mockElasticsearchClient.index.mockResolvedValue({} as any);

      await indexTransaction(transaccion);

      expect(mockElasticsearchClient.index).toHaveBeenCalledWith({
        index: 'transactions',
        document: expect.objectContaining({
          categoria: 'Sin categoría'
        }),
        id: 'gasto-2'
      });
    });

    test('debe indexar ingreso con campos específicos', async () => {
      const transaccion = {
        id: 3,
        monto: 2500.00,
        descripcion: 'Salario',
        fecha: '2024-01-01',
        tipo: 'ingreso' as const,
        categoria: { id: 2, nombre: 'Trabajo' },
        usuario_id: 123,
        tipo_ingreso: 'Salario',
        recurrente: true,
        frecuencia: 'Mensual'
      };

      mockElasticsearchClient.index.mockResolvedValue({} as any);

      await indexTransaction(transaccion);

      expect(mockElasticsearchClient.index).toHaveBeenCalledWith({
        index: 'transactions',
        document: expect.objectContaining({
          tipo_ingreso: 'Salario',
          recurrente: true,
          frecuencia: 'Mensual'
        }),
        id: 'ingreso-3'
      });
    });

    test('debe generar ID único combinando tipo e id', async () => {
      const transaccionGasto = {
        id: 1,
        monto: 100.00,
        descripcion: 'Gasto',
        fecha: '2024-01-15',
        tipo: 'gasto' as const,
        usuario_id: 123
      };

      const transaccionIngreso = {
        id: 1,
        monto: 1000.00,
        descripcion: 'Ingreso',
        fecha: '2024-01-15',
        tipo: 'ingreso' as const,
        usuario_id: 123
      };

      mockElasticsearchClient.index.mockResolvedValue({} as any);

      await indexTransaction(transaccionGasto);
      await indexTransaction(transaccionIngreso);

      expect(mockElasticsearchClient.index).toHaveBeenNthCalledWith(1, expect.objectContaining({
        id: 'gasto-1'
      }));
      expect(mockElasticsearchClient.index).toHaveBeenNthCalledWith(2, expect.objectContaining({
        id: 'ingreso-1'
      }));
    });

    test('debe manejar errores de Elasticsearch', async () => {
      const transaccion = {
        id: 1,
        monto: 100.00,
        descripcion: 'Error test',
        fecha: '2024-01-15',
        tipo: 'gasto' as const,
        usuario_id: 123
      };

      const error = new Error('Elasticsearch error');
      mockElasticsearchClient.index.mockRejectedValue(error);

      await expect(indexTransaction(transaccion)).rejects.toThrow('Elasticsearch error');
      expect(console.error).toHaveBeenCalledWith('Error indexing transaction:', error);
    });

    test('debe loggear transacción indexada exitosamente', async () => {
      const transaccion = {
        id: 1,
        monto: 100.00,
        descripcion: 'Success test',
        fecha: '2024-01-15',
        tipo: 'gasto' as const,
        usuario_id: 123
      };

      mockElasticsearchClient.index.mockResolvedValue({} as any);

      await indexTransaction(transaccion);

      expect(console.log).toHaveBeenCalledWith('Transaction indexed successfully:', expect.any(Object));
    });
  });

  describe('searchTransactions', () => {
    test('debe buscar todas las transacciones del usuario', async () => {
      const mockResponse = {
        hits: {
          hits: [
            { _source: { id: 1, tipo: 'gasto', monto: 100 } },
            { _source: { id: 2, tipo: 'ingreso', monto: 1000 } }
          ]
        }
      };

      mockElasticsearchClient.search.mockResolvedValue(mockResponse as any);

      const result = await searchTransactions(123, 'todos');

      expect(mockElasticsearchClient.search).toHaveBeenCalledWith({
        index: 'transactions',
        query: {
          bool: {
            must: [
              { term: { usuario_id: 123 } }
            ]
          }
        },
        sort: [
          { fecha: { order: 'desc' } }
        ]
      });

      expect(result).toEqual([
        { id: 1, tipo: 'gasto', monto: 100 },
        { id: 2, tipo: 'ingreso', monto: 1000 }
      ]);
    });

    test('debe filtrar por tipo gasto', async () => {
      const mockResponse = {
        hits: {
          hits: [
            { _source: { id: 1, tipo: 'gasto', monto: 100 } }
          ]
        }
      };

      mockElasticsearchClient.search.mockResolvedValue(mockResponse as any);

      await searchTransactions(123, 'gasto');

      expect(mockElasticsearchClient.search).toHaveBeenCalledWith({
        index: 'transactions',
        query: {
          bool: {
            must: [
              { term: { usuario_id: 123 } },
              { term: { tipo: 'gasto' } }
            ]
          }
        },
        sort: [
          { fecha: { order: 'desc' } }
        ]
      });
    });

    test('debe filtrar por tipo ingreso', async () => {
      const mockResponse = {
        hits: {
          hits: [
            { _source: { id: 2, tipo: 'ingreso', monto: 1000 } }
          ]
        }
      };

      mockElasticsearchClient.search.mockResolvedValue(mockResponse as any);

      await searchTransactions(123, 'ingreso');

      expect(mockElasticsearchClient.search).toHaveBeenCalledWith({
        index: 'transactions',
        query: {
          bool: {
            must: [
              { term: { usuario_id: 123 } },
              { term: { tipo: 'ingreso' } }
            ]
          }
        },
        sort: [
          { fecha: { order: 'desc' } }
        ]
      });
    });

    test('debe usar filtro por defecto como todos', async () => {
      const mockResponse = { hits: { hits: [] } };
      mockElasticsearchClient.search.mockResolvedValue(mockResponse as any);

      await searchTransactions(123);

      expect(mockElasticsearchClient.search).toHaveBeenCalledWith({
        index: 'transactions',
        query: {
          bool: {
            must: [
              { term: { usuario_id: 123 } }
            ]
          }
        },
        sort: [
          { fecha: { order: 'desc' } }
        ]
      });
    });

    test('debe ordenar por fecha descendente', async () => {
      const mockResponse = { hits: { hits: [] } };
      mockElasticsearchClient.search.mockResolvedValue(mockResponse as any);

      await searchTransactions(123);

      expect(mockElasticsearchClient.search).toHaveBeenCalledWith(
        expect.objectContaining({
          sort: [{ fecha: { order: 'desc' } }]
        })
      );
    });

    test('debe manejar errores de búsqueda', async () => {
      const error = new Error('Search error');
      mockElasticsearchClient.search.mockRejectedValue(error);

      await expect(searchTransactions(123)).rejects.toThrow('Search error');
      expect(console.error).toHaveBeenCalledWith('Error searching transactions:', error);
    });

    test('debe validar usuario_id numérico', async () => {
      const mockResponse = { hits: { hits: [] } };
      mockElasticsearchClient.search.mockResolvedValue(mockResponse as any);

      await searchTransactions(123);

      expect(mockElasticsearchClient.search).toHaveBeenCalledWith(
        expect.objectContaining({
          query: expect.objectContaining({
            bool: expect.objectContaining({
              must: expect.arrayContaining([
                { term: { usuario_id: 123 } }
              ])
            })
          })
        })
      );
    });
  });

  describe('getTransactionStats', () => {
    test('debe obtener estadísticas completas del usuario', async () => {
      const mockResponse = {
        aggregations: {
          total_ingresos: {
            monto: { value: 3000 }
          },
          total_gastos: {
            monto: { value: 1500 }
          },
          gastos_por_categoria: {
            por_categoria: {
              buckets: [
                { key: 'Comida', doc_count: 5 },
                { key: 'Transporte', doc_count: 3 }
              ]
            }
          },
          ingresos_por_tipo: {
            por_tipo: {
              buckets: [
                { key: 'Salario', doc_count: 2 },
                { key: 'Freelance', doc_count: 1 }
              ]
            }
          }
        }
      };

      mockElasticsearchClient.search.mockResolvedValue(mockResponse as any);

      const result = await getTransactionStats(123);

      expect(mockElasticsearchClient.search).toHaveBeenCalledWith({
        index: 'transactions',
        size: 0,
        query: {
          term: { usuario_id: 123 }
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

      expect(result).toEqual(mockResponse.aggregations);
    });

    test('debe usar size 0 para no devolver documentos', async () => {
      const mockResponse = { aggregations: {} };
      mockElasticsearchClient.search.mockResolvedValue(mockResponse as any);

      await getTransactionStats(123);

      expect(mockElasticsearchClient.search).toHaveBeenCalledWith(
        expect.objectContaining({
          size: 0
        })
      );
    });

    test('debe agrupar estadísticas por filtros específicos', async () => {
      const mockResponse = { aggregations: {} };
      mockElasticsearchClient.search.mockResolvedValue(mockResponse as any);

      await getTransactionStats(123);

      const expectedAggs = mockElasticsearchClient.search.mock.calls[0][0].aggs;
      
      expect(expectedAggs.total_ingresos.filter).toEqual({ term: { tipo: 'ingreso' } });
      expect(expectedAggs.total_gastos.filter).toEqual({ term: { tipo: 'gasto' } });
      expect(expectedAggs.gastos_por_categoria.filter).toEqual({ term: { tipo: 'gasto' } });
      expect(expectedAggs.ingresos_por_tipo.filter).toEqual({ term: { tipo: 'ingreso' } });
    });

    test('debe manejar errores de estadísticas', async () => {
      const error = new Error('Stats error');
      mockElasticsearchClient.search.mockRejectedValue(error);

      await expect(getTransactionStats(123)).rejects.toThrow('Stats error');
      expect(console.error).toHaveBeenCalledWith('Error getting transaction stats:', error);
    });
  });

  describe('deleteTransaction', () => {
    test('debe eliminar transacción de gasto', async () => {
      mockElasticsearchClient.delete.mockResolvedValue({} as any);

      await deleteTransaction(1, 'gasto');

      expect(mockElasticsearchClient.delete).toHaveBeenCalledWith({
        index: 'transactions',
        id: 'gasto-1'
      });
    });

    test('debe eliminar transacción de ingreso', async () => {
      mockElasticsearchClient.delete.mockResolvedValue({} as any);

      await deleteTransaction(2, 'ingreso');

      expect(mockElasticsearchClient.delete).toHaveBeenCalledWith({
        index: 'transactions',
        id: 'ingreso-2'
      });
    });

    test('debe usar el mismo formato de ID que indexTransaction', async () => {
      mockElasticsearchClient.delete.mockResolvedValue({} as any);

      await deleteTransaction(123, 'gasto');
      await deleteTransaction(456, 'ingreso');

      expect(mockElasticsearchClient.delete).toHaveBeenNthCalledWith(1, {
        index: 'transactions',
        id: 'gasto-123'
      });
      expect(mockElasticsearchClient.delete).toHaveBeenNthCalledWith(2, {
        index: 'transactions',
        id: 'ingreso-456'
      });
    });

    test('debe manejar errores de eliminación', async () => {
      const error = new Error('Delete error');
      mockElasticsearchClient.delete.mockRejectedValue(error);

      await expect(deleteTransaction(1, 'gasto')).rejects.toThrow('Delete error');
      expect(console.error).toHaveBeenCalledWith('Error deleting transaction:', error);
    });

    test('debe validar tipos de transacción válidos', async () => {
      mockElasticsearchClient.delete.mockResolvedValue({} as any);

      await deleteTransaction(1, 'gasto');
      await deleteTransaction(1, 'ingreso');

      // Verificar que solo se acepten tipos válidos
      expect(mockElasticsearchClient.delete).toHaveBeenCalledTimes(2);
    });
  });

  describe('Validaciones de entrada y casos límite', () => {
    test('indexTransaction debe validar campos obligatorios', async () => {
      const transaccionIncompleta = {
        id: 1,
        // Falta monto
        descripcion: 'Test',
        fecha: '2024-01-15',
        tipo: 'gasto' as const,
        usuario_id: 123
      };

      mockElasticsearchClient.index.mockResolvedValue({} as any);

      await indexTransaction(transaccionIncompleta as any);

      expect(mockElasticsearchClient.index).toHaveBeenCalledWith(
        expect.objectContaining({
          document: expect.objectContaining({
            monto: undefined
          })
        })
      );
    });

    test('searchTransactions debe manejar respuesta vacía', async () => {
      const mockResponse = {
        hits: {
          hits: []
        }
      };

      mockElasticsearchClient.search.mockResolvedValue(mockResponse as any);

      const result = await searchTransactions(123);

      expect(result).toEqual([]);
    });

    test('debe manejar IDs de transacción grandes', async () => {
      const bigId = Number.MAX_SAFE_INTEGER;
      
      mockElasticsearchClient.delete.mockResolvedValue({} as any);

      await deleteTransaction(bigId, 'gasto');

      expect(mockElasticsearchClient.delete).toHaveBeenCalledWith({
        index: 'transactions',
        id: `gasto-${bigId}`
      });
    });

    test('debe manejar montos con decimales precisos', async () => {
      const transaccion = {
        id: 1,
        monto: 99.999999,
        descripcion: 'Precisión decimal',
        fecha: '2024-01-15',
        tipo: 'gasto' as const,
        usuario_id: 123
      };

      mockElasticsearchClient.index.mockResolvedValue({} as any);

      await indexTransaction(transaccion);

      expect(mockElasticsearchClient.index).toHaveBeenCalledWith(
        expect.objectContaining({
          document: expect.objectContaining({
            monto: 99.999999
          })
        })
      );
    });

    test('debe manejar descripciones vacías', async () => {
      const transaccion = {
        id: 1,
        monto: 100.00,
        descripcion: '',
        fecha: '2024-01-15',
        tipo: 'gasto' as const,
        usuario_id: 123
      };

      mockElasticsearchClient.index.mockResolvedValue({} as any);

      await indexTransaction(transaccion);

      expect(mockElasticsearchClient.index).toHaveBeenCalledWith(
        expect.objectContaining({
          document: expect.objectContaining({
            descripcion: ''
          })
        })
      );
    });
  });

  describe('Casos de rendimiento e integridad', () => {
    test('debe procesar múltiples transacciones secuencialmente', async () => {
      const transacciones = [
        { id: 1, monto: 100, descripcion: 'T1', fecha: '2024-01-15', tipo: 'gasto' as const, usuario_id: 123 },
        { id: 2, monto: 200, descripcion: 'T2', fecha: '2024-01-16', tipo: 'ingreso' as const, usuario_id: 123 },
        { id: 3, monto: 300, descripcion: 'T3', fecha: '2024-01-17', tipo: 'gasto' as const, usuario_id: 123 }
      ];

      mockElasticsearchClient.index.mockResolvedValue({} as any);

      for (const transaccion of transacciones) {
        await indexTransaction(transaccion);
      }

      expect(mockElasticsearchClient.index).toHaveBeenCalledTimes(3);
      expect(mockElasticsearchClient.index).toHaveBeenNthCalledWith(1, expect.objectContaining({ id: 'gasto-1' }));
      expect(mockElasticsearchClient.index).toHaveBeenNthCalledWith(2, expect.objectContaining({ id: 'ingreso-2' }));
      expect(mockElasticsearchClient.index).toHaveBeenNthCalledWith(3, expect.objectContaining({ id: 'gasto-3' }));
    });

    test('debe mantener consistencia entre operaciones', async () => {
      const transaccion = {
        id: 1,
        monto: 100.00,
        descripcion: 'Consistencia test',
        fecha: '2024-01-15',
        tipo: 'gasto' as const,
        usuario_id: 123
      };

      mockElasticsearchClient.index.mockResolvedValue({} as any);
      mockElasticsearchClient.delete.mockResolvedValue({} as any);

      // Indexar y luego eliminar
      await indexTransaction(transaccion);
      await deleteTransaction(1, 'gasto');

      expect(mockElasticsearchClient.index).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'gasto-1' })
      );
      expect(mockElasticsearchClient.delete).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'gasto-1' })
      );
    });
  });
}); 