/**
 * Fixtures de datos de prueba
 * Datos reutilizables para todas las pruebas
 * 
 * Principios aplicados:
 * - FIRST: Independent - Cada test usa datos aislados
 * - FIRST: Repeatable - Datos consistentes para cada ejecución
 */

// Usuarios de prueba
export const usuarios = {
  usuario1: {
    id: 1,
    nombre: 'Usuario Test 1',
    email: 'test1@example.com',
    moneda_preferida: 'USD',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  usuario2: {
    id: 2,
    nombre: 'Usuario Test 2',
    email: 'test2@example.com',
    moneda_preferida: 'EUR',
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02')
  }
};

// Categorías de prueba
export const categorias = {
  alimentacion: {
    id: 1,
    nombre: 'Alimentación',
    usuario_id: 1,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  transporte: {
    id: 2,
    nombre: 'Transporte',
    usuario_id: 1,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  entretenimiento: {
    id: 3,
    nombre: 'Entretenimiento',
    usuario_id: 1,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
};

// Gastos de prueba
export const gastos = {
  gasto1: {
    id: 1,
    usuario_id: 1,
    monto: 50.00,
    fecha: new Date('2024-01-15'),
    descripcion: 'Supermercado',
    categoria_id: 1,
    factura: true,
    metodo_pago: 'tarjeta',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    categoria: categorias.alimentacion
  },
  gasto2: {
    id: 2,
    usuario_id: 1,
    monto: 25.50,
    fecha: new Date('2024-01-16'),
    descripcion: 'Taxi',
    categoria_id: 2,
    factura: false,
    metodo_pago: 'efectivo',
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-16'),
    categoria: categorias.transporte
  },
  gastoGrande: {
    id: 3,
    usuario_id: 1,
    monto: 500.00,
    fecha: new Date('2024-01-20'),
    descripcion: 'Compra grande',
    categoria_id: 1,
    factura: true,
    metodo_pago: 'tarjeta',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
    categoria: categorias.alimentacion
  }
};

// Ingresos de prueba
export const ingresos = {
  ingreso1: {
    id: 1,
    usuario_id: 1,
    monto: 1000.00,
    fecha: new Date('2024-01-01'),
    descripcion: 'Salario mensual',
    fuente: 'Trabajo',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  ingreso2: {
    id: 2,
    usuario_id: 1,
    monto: 200.00,
    fecha: new Date('2024-01-10'),
    descripcion: 'Freelance',
    fuente: 'Proyecto adicional',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10')
  }
};

// Datos inválidos para pruebas de validación
export const datosInvalidos = {
  gastoSinMonto: {
    descripcion: 'Sin monto',
    categoria_id: 1,
    fecha: new Date('2024-01-15')
  },
  gastoMontoNegativo: {
    monto: -50,
    descripcion: 'Monto negativo',
    categoria_id: 1,
    fecha: new Date('2024-01-15')
  },
  gastoSinFecha: {
    monto: 50,
    descripcion: 'Sin fecha',
    categoria_id: 1
  },
  categoriaVacia: {
    nombre: ''
  },
  categoriaLarga: {
    nombre: 'A'.repeat(101)
  }
};

// Helper para crear datos de prueba personalizados
export const crearGasto = (overrides: Partial<typeof gastos.gasto1> = {}) => ({
  ...gastos.gasto1,
  ...overrides,
  id: Math.floor(Math.random() * 10000)
});

export const crearIngreso = (overrides: Partial<typeof ingresos.ingreso1> = {}) => ({
  ...ingresos.ingreso1,
  ...overrides,
  id: Math.floor(Math.random() * 10000)
});

export const crearCategoria = (overrides: Partial<typeof categorias.alimentacion> = {}) => ({
  ...categorias.alimentacion,
  ...overrides,
  id: Math.floor(Math.random() * 10000)
});

