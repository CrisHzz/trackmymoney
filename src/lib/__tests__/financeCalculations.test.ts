/**
 * Pruebas unitarias para cálculos financieros
 * Basadas en la lógica extraída de StatsPage
 */

interface Transaction {
  id: number;
  monto: number;
  fecha: string;
  descripcion?: string;
  categoria?: {
    id: number;
    nombre: string;
  };
  tipo_ingreso?: string;
}

interface MonthlyData {
  month: string;
  ingresos: number;
  gastos: number;
  balance: number;
}

// Funciones extraídas para hacer pruebas unitarias
export const calcularTotalGastos = (gastos: Transaction[]): number => {
  if (!Array.isArray(gastos) || gastos.length === 0) return 0;
  return gastos.reduce((sum, gasto) => sum + Number(gasto.monto), 0);
};

export const calcularTotalIngresos = (ingresos: Transaction[]): number => {
  if (!Array.isArray(ingresos) || ingresos.length === 0) return 0;
  return ingresos.reduce((sum, ingreso) => sum + Number(ingreso.monto), 0);
};

export const calcularBalance = (ingresos: Transaction[], gastos: Transaction[]): number => {
  const totalIngresos = calcularTotalIngresos(ingresos);
  const totalGastos = calcularTotalGastos(gastos);
  return totalIngresos - totalGastos;
};

export const agruparPorCategoria = (transacciones: Transaction[]): { name: string; value: number }[] => {
  if (!Array.isArray(transacciones) || transacciones.length === 0) return [];
  
  const categoryTotals = transacciones.reduce((acc, transaccion) => {
    const category = transaccion.categoria?.nombre || transaccion.tipo_ingreso || 'Sin categoría';
    acc[category] = (acc[category] || 0) + Number(transaccion.monto);
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(categoryTotals).map(([name, value]) => ({
    name,
    value: Number(value.toFixed(2))
  }));
};

export const calcularDatosMensuales = (gastos: Transaction[], ingresos: Transaction[], year: number = new Date().getFullYear()): MonthlyData[] => {
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  const data: MonthlyData[] = [];

  months.forEach((month, index) => {
    const monthGastos = Array.isArray(gastos) ? gastos
      .filter(g => {
        const fecha = new Date(g.fecha);
        return fecha.getMonth() === index && fecha.getFullYear() === year;
      })
      .reduce((sum, g) => sum + Number(g.monto), 0) : 0;
    
    const monthIngresos = Array.isArray(ingresos) ? ingresos
      .filter(i => {
        const fecha = new Date(i.fecha);
        return fecha.getMonth() === index && fecha.getFullYear() === year;
      })
      .reduce((sum, i) => sum + Number(i.monto), 0) : 0;

    data.push({
      month,
      ingresos: Number(monthIngresos.toFixed(2)),
      gastos: Number(monthGastos.toFixed(2)),
      balance: Number((monthIngresos - monthGastos).toFixed(2))
    });
  });

  return data;
};

describe('Cálculos Financieros - Pruebas de Caja Blanca', () => {
  
  describe('calcularTotalGastos', () => {
    test('debe calcular total correctamente con gastos válidos', () => {
      const gastos = [
        { id: 1, monto: 100.50, fecha: '2024-01-15', categoria: { id: 1, nombre: 'Comida' } },
        { id: 2, monto: 50.25, fecha: '2024-01-16', categoria: { id: 2, nombre: 'Transporte' } },
        { id: 3, monto: 25.00, fecha: '2024-01-17', categoria: { id: 1, nombre: 'Comida' } }
      ];

      const total = calcularTotalGastos(gastos);
      expect(total).toBe(175.75);
    });

    test('debe devolver 0 para array vacío', () => {
      const total = calcularTotalGastos([]);
      expect(total).toBe(0);
    });

    test('debe devolver 0 para array no válido', () => {
      const total = calcularTotalGastos(null as any);
      expect(total).toBe(0);
    });

    test('debe manejar montos como strings', () => {
      const gastos = [
        { id: 1, monto: '100.50' as any, fecha: '2024-01-15' },
        { id: 2, monto: '50.25' as any, fecha: '2024-01-16' }
      ];

      const total = calcularTotalGastos(gastos);
      expect(total).toBe(150.75);
    });

    test('debe manejar montos negativos', () => {
      const gastos = [
        { id: 1, monto: -50.00, fecha: '2024-01-15' },
        { id: 2, monto: 100.00, fecha: '2024-01-16' }
      ];

      const total = calcularTotalGastos(gastos);
      expect(total).toBe(50.00);
    });

    test('debe manejar montos con decimales precisos', () => {
      const gastos = [
        { id: 1, monto: 33.333, fecha: '2024-01-15' },
        { id: 2, monto: 66.667, fecha: '2024-01-16' }
      ];

      const total = calcularTotalGastos(gastos);
      expect(total).toBeCloseTo(100, 2);
    });

    test('debe manejar montos cero', () => {
      const gastos = [
        { id: 1, monto: 0, fecha: '2024-01-15' },
        { id: 2, monto: 100.00, fecha: '2024-01-16' }
      ];

      const total = calcularTotalGastos(gastos);
      expect(total).toBe(100.00);
    });
  });

  describe('calcularTotalIngresos', () => {
    test('debe calcular total correctamente con ingresos válidos', () => {
      const ingresos = [
        { id: 1, monto: 2500.00, fecha: '2024-01-01', tipo_ingreso: 'Salario' },
        { id: 2, monto: 500.00, fecha: '2024-01-15', tipo_ingreso: 'Freelance' }
      ];

      const total = calcularTotalIngresos(ingresos);
      expect(total).toBe(3000.00);
    });

    test('debe devolver 0 para array vacío', () => {
      const total = calcularTotalIngresos([]);
      expect(total).toBe(0);
    });

    test('debe manejar ingresos con decimales', () => {
      const ingresos = [
        { id: 1, monto: 1234.56, fecha: '2024-01-01', tipo_ingreso: 'Salario' },
        { id: 2, monto: 765.44, fecha: '2024-01-15', tipo_ingreso: 'Freelance' }
      ];

      const total = calcularTotalIngresos(ingresos);
      expect(total).toBe(2000.00);
    });
  });

  describe('calcularBalance', () => {
    test('debe calcular balance positivo correctamente', () => {
      const ingresos = [
        { id: 1, monto: 3000.00, fecha: '2024-01-01', tipo_ingreso: 'Salario' }
      ];
      const gastos = [
        { id: 1, monto: 1500.00, fecha: '2024-01-15' }
      ];

      const balance = calcularBalance(ingresos, gastos);
      expect(balance).toBe(1500.00);
    });

    test('debe calcular balance negativo correctamente', () => {
      const ingresos = [
        { id: 1, monto: 1000.00, fecha: '2024-01-01', tipo_ingreso: 'Salario' }
      ];
      const gastos = [
        { id: 1, monto: 1500.00, fecha: '2024-01-15' }
      ];

      const balance = calcularBalance(ingresos, gastos);
      expect(balance).toBe(-500.00);
    });

    test('debe calcular balance cero correctamente', () => {
      const ingresos = [
        { id: 1, monto: 1000.00, fecha: '2024-01-01', tipo_ingreso: 'Salario' }
      ];
      const gastos = [
        { id: 1, monto: 1000.00, fecha: '2024-01-15' }
      ];

      const balance = calcularBalance(ingresos, gastos);
      expect(balance).toBe(0);
    });

    test('debe manejar arrays vacíos', () => {
      const balance = calcularBalance([], []);
      expect(balance).toBe(0);
    });

    test('debe manejar solo ingresos', () => {
      const ingresos = [
        { id: 1, monto: 1000.00, fecha: '2024-01-01', tipo_ingreso: 'Salario' }
      ];

      const balance = calcularBalance(ingresos, []);
      expect(balance).toBe(1000.00);
    });

    test('debe manejar solo gastos', () => {
      const gastos = [
        { id: 1, monto: 500.00, fecha: '2024-01-15' }
      ];

      const balance = calcularBalance([], gastos);
      expect(balance).toBe(-500.00);
    });
  });

  describe('agruparPorCategoria', () => {
    test('debe agrupar gastos por categoría correctamente', () => {
      const gastos = [
        { id: 1, monto: 100.00, fecha: '2024-01-15', categoria: { id: 1, nombre: 'Comida' } },
        { id: 2, monto: 50.00, fecha: '2024-01-16', categoria: { id: 1, nombre: 'Comida' } },
        { id: 3, monto: 200.00, fecha: '2024-01-17', categoria: { id: 2, nombre: 'Transporte' } }
      ];

      const agrupado = agruparPorCategoria(gastos);

      expect(agrupado).toHaveLength(2);
      expect(agrupado).toContainEqual({ name: 'Comida', value: 150.00 });
      expect(agrupado).toContainEqual({ name: 'Transporte', value: 200.00 });
    });

    test('debe agrupar ingresos por tipo_ingreso', () => {
      const ingresos = [
        { id: 1, monto: 2500.00, fecha: '2024-01-01', tipo_ingreso: 'Salario' },
        { id: 2, monto: 500.00, fecha: '2024-01-15', tipo_ingreso: 'Freelance' },
        { id: 3, monto: 1000.00, fecha: '2024-01-30', tipo_ingreso: 'Salario' }
      ];

      const agrupado = agruparPorCategoria(ingresos);

      expect(agrupado).toHaveLength(2);
      expect(agrupado).toContainEqual({ name: 'Salario', value: 3500.00 });
      expect(agrupado).toContainEqual({ name: 'Freelance', value: 500.00 });
    });

    test('debe manejar transacciones sin categoría', () => {
      const transacciones = [
        { id: 1, monto: 100.00, fecha: '2024-01-15' },
        { id: 2, monto: 200.00, fecha: '2024-01-16', categoria: { id: 1, nombre: 'Comida' } }
      ];

      const agrupado = agruparPorCategoria(transacciones);

      expect(agrupado).toHaveLength(2);
      expect(agrupado).toContainEqual({ name: 'Sin categoría', value: 100.00 });
      expect(agrupado).toContainEqual({ name: 'Comida', value: 200.00 });
    });

    test('debe devolver array vacío para entrada vacía', () => {
      const agrupado = agruparPorCategoria([]);
      expect(agrupado).toEqual([]);
    });

    test('debe redondear valores a 2 decimales', () => {
      const transacciones = [
        { id: 1, monto: 33.333, fecha: '2024-01-15', categoria: { id: 1, nombre: 'Test' } },
        { id: 2, monto: 66.667, fecha: '2024-01-16', categoria: { id: 1, nombre: 'Test' } }
      ];

      const agrupado = agruparPorCategoria(transacciones);

      expect(agrupado).toHaveLength(1);
      expect(agrupado[0].value).toBe(100.00);
    });
  });

  describe('calcularDatosMensuales', () => {
    test('debe calcular datos mensuales correctamente', () => {
      const gastos = [
        { id: 1, monto: 100.00, fecha: '2024-01-15' },
        { id: 2, monto: 200.00, fecha: '2024-02-15' }
      ];
      const ingresos = [
        { id: 1, monto: 1000.00, fecha: '2024-01-01', tipo_ingreso: 'Salario' },
        { id: 2, monto: 1200.00, fecha: '2024-02-01', tipo_ingreso: 'Salario' }
      ];

      const datos = calcularDatosMensuales(gastos, ingresos, 2024);

      expect(datos).toHaveLength(12);
      expect(datos[0]).toEqual({ month: 'Ene', ingresos: 1000.00, gastos: 100.00, balance: 900.00 });
      expect(datos[1]).toEqual({ month: 'Feb', ingresos: 1200.00, gastos: 200.00, balance: 1000.00 });
      expect(datos[2]).toEqual({ month: 'Mar', ingresos: 0, gastos: 0, balance: 0 });
    });

    test('debe filtrar por año específico', () => {
      const gastos = [
        { id: 1, monto: 100.00, fecha: '2023-01-15' }, // Año anterior
        { id: 2, monto: 200.00, fecha: '2024-01-15' }  // Año actual
      ];
      const ingresos = [
        { id: 1, monto: 1000.00, fecha: '2023-01-01', tipo_ingreso: 'Salario' },
        { id: 2, monto: 1200.00, fecha: '2024-01-01', tipo_ingreso: 'Salario' }
      ];

      const datos = calcularDatosMensuales(gastos, ingresos, 2024);

      expect(datos[0]).toEqual({ month: 'Ene', ingresos: 1200.00, gastos: 200.00, balance: 1000.00 });
    });

    test('debe manejar fechas inválidas', () => {
      const gastos = [
        { id: 1, monto: 100.00, fecha: 'fecha-invalida' }
      ];
      const ingresos = [
        { id: 1, monto: 1000.00, fecha: 'fecha-invalida', tipo_ingreso: 'Salario' }
      ];

      const datos = calcularDatosMensuales(gastos, ingresos, 2024);

      // Las fechas inválidas no deberían afectar el cálculo
      expect(datos[0]).toEqual({ month: 'Ene', ingresos: 0, gastos: 0, balance: 0 });
    });

    test('debe usar año actual por defecto', () => {
      const currentYear = new Date().getFullYear();
      const gastos = [
        { id: 1, monto: 100.00, fecha: `${currentYear}-01-15` }
      ];
      const ingresos = [
        { id: 1, monto: 1000.00, fecha: `${currentYear}-01-01`, tipo_ingreso: 'Salario' }
      ];

      const datos = calcularDatosMensuales(gastos, ingresos);

      expect(datos[0]).toEqual({ month: 'Ene', ingresos: 1000.00, gastos: 100.00, balance: 900.00 });
    });

    test('debe manejar arrays no válidos', () => {
      const datos = calcularDatosMensuales(null as any, undefined as any, 2024);

      expect(datos).toHaveLength(12);
      expect(datos[0]).toEqual({ month: 'Ene', ingresos: 0, gastos: 0, balance: 0 });
    });
  });

  describe('Casos límite y rendimiento', () => {
    test('debe manejar grandes volúmenes de transacciones', () => {
      const start = performance.now();
      
      const largeDataset = Array.from({ length: 10000 }, (_, i) => ({
        id: i,
        monto: Math.random() * 1000,
        fecha: '2024-01-15',
        categoria: { id: 1, nombre: 'Test' }
      }));

      const total = calcularTotalGastos(largeDataset);
      
      const end = performance.now();
      
      expect(typeof total).toBe('number');
      expect(total).toBeGreaterThan(0);
      expect(end - start).toBeLessThan(100); // Menos de 100ms
    });

    test('debe manejar valores monetarios extremos', () => {
      const transacciones = [
        { id: 1, monto: Number.MAX_SAFE_INTEGER / 10000, fecha: '2024-01-15' },
        { id: 2, monto: 0.01, fecha: '2024-01-16' }
      ];

      const total = calcularTotalGastos(transacciones);
      expect(total).toBeGreaterThan(0);
      expect(Number.isFinite(total)).toBe(true);
    });

    test('debe ser consistente con múltiples cálculos', () => {
      const transacciones = [
        { id: 1, monto: 100.00, fecha: '2024-01-15' },
        { id: 2, monto: 200.00, fecha: '2024-01-16' }
      ];

      const total1 = calcularTotalGastos(transacciones);
      const total2 = calcularTotalGastos(transacciones);
      const total3 = calcularTotalGastos(transacciones);

      expect(total1).toBe(total2);
      expect(total2).toBe(total3);
      expect(total1).toBe(300.00);
    });
  });
}); 