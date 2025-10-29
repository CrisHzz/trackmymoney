/**
 * Step Definitions para Gestión de Gastos
 * 
 * Este archivo contiene todos los steps específicos para
 * las operaciones CRUD de gastos y sus validaciones.
 * 
 * Principios aplicados:
 * - Steps específicos y reutilizables
 * - Validaciones exhaustivas
 * - Integración con APIClient
 * - Manejo de casos edge
 */

import { Given, When, Then } from '@cucumber/cucumber';
// Usar expect de Jest
import expect from 'expect';
import { BDDWorld } from '../support/world';
import { GastoInput } from '../support/api-client';

/**
 * STEPS PARA CREAR GASTOS
 */

When('creo un gasto con monto {string} y descripción {string}', async function (this: BDDWorld, monto: string, descripcion: string) {
  this.log('📝 Creando gasto básico:', { monto, descripcion });
  
  const gastoData: GastoInput = {
    monto: parseFloat(monto),
    fecha: '2024-01-15',
    descripcion: descripcion
  };
  
  const response = await this.apiClient.gastos.create(gastoData);
  this.setLastResponse(response);
});

When('creo un gasto con monto {string} y categoría ID {string}', async function (this: BDDWorld, monto: string, categoriaId: string) {
  this.log('📝 Creando gasto con categoría:', { monto, categoriaId });
  
  const gastoData: GastoInput = {
    monto: parseFloat(monto),
    fecha: '2024-01-15',
    descripcion: 'Gasto con categoría',
    categoria_id: parseInt(categoriaId)
  };
  
  const response = await this.apiClient.gastos.create(gastoData);
  this.setLastResponse(response);
});

When('creo un gasto con los siguientes datos:', async function (this: BDDWorld, dataTable) {
  this.log('📝 Creando gasto con datos de tabla');
  
  const data = dataTable.rowsHash();
  const gastoData: GastoInput = {
    monto: parseFloat(data.monto),
    fecha: data.fecha || '2024-01-15',
    descripcion: data.descripcion,
    factura: data.factura === 'true',
    metodo_pago: data.metodo_pago,
    categoria_id: data.categoria_id ? parseInt(data.categoria_id) : undefined
  };
  
  const response = await this.apiClient.gastos.create(gastoData);
  this.setLastResponse(response);
});

When('creo un gasto con monto {string} y fecha {string}', async function (this: BDDWorld, monto: string, fecha: string) {
  this.log('📝 Creando gasto con fecha específica:', { monto, fecha });
  
  const gastoData: GastoInput = {
    monto: parseFloat(monto),
    fecha: fecha,
    descripcion: 'Gasto con fecha específica'
  };
  
  const response = await this.apiClient.gastos.create(gastoData);
  this.setLastResponse(response);
});

When('creo un gasto con monto {string} sin descripción', async function (this: BDDWorld, monto: string) {
  this.log('📝 Creando gasto sin descripción:', { monto });
  
  const gastoData: GastoInput = {
    monto: parseFloat(monto),
    fecha: '2024-01-15'
    // descripción omitida intencionalmente
  };
  
  const response = await this.apiClient.gastos.create(gastoData);
  this.setLastResponse(response);
});

/**
 * STEPS PARA INTENTAR CREAR GASTOS (con errores esperados)
 */

When('intento crear un gasto sin monto', async function (this: BDDWorld) {
  this.log('📝 Intentando crear gasto sin monto');
  
  const gastoData = this.dataBuilder.buildInvalidData('gasto', 'sin_monto');
  const response = await this.apiClient.gastos.create(gastoData as GastoInput);
  this.setLastResponse(response);
});

When('intento crear un gasto sin fecha', async function (this: BDDWorld) {
  this.log('📝 Intentando crear gasto sin fecha');
  
  const gastoData = this.dataBuilder.buildInvalidData('gasto', 'sin_fecha');
  const response = await this.apiClient.gastos.create(gastoData as GastoInput);
  this.setLastResponse(response);
});

When('intento crear un gasto con monto {string}', async function (this: BDDWorld, monto: string) {
  this.log('📝 Intentando crear gasto con monto específico:', monto);
  
  const gastoData: GastoInput = {
    monto: parseFloat(monto),
    fecha: '2024-01-15',
    descripcion: 'Gasto de prueba'
  };
  
  const response = await this.apiClient.gastos.create(gastoData);
  this.setLastResponse(response);
});

When('intento crear un gasto con monto {string} y categoría ID {string}', async function (this: BDDWorld, monto: string, categoriaId: string) {
  this.log('📝 Intentando crear gasto con categoría específica:', { monto, categoriaId });
  
  const gastoData: GastoInput = {
    monto: parseFloat(monto),
    fecha: '2024-01-15',
    descripcion: 'Gasto con categoría',
    categoria_id: parseInt(categoriaId)
  };
  
  const response = await this.apiClient.gastos.create(gastoData);
  this.setLastResponse(response);
});

/**
 * STEPS PARA CONSULTAR GASTOS
 */

When('consulto mi lista de gastos', async function (this: BDDWorld) {
  this.log('📋 Consultando lista de gastos');
  
  const response = await this.apiClient.gastos.list();
  this.setLastResponse(response);
});

When('intento consultar mi lista de gastos', async function (this: BDDWorld) {
  this.log('📋 Intentando consultar lista de gastos');
  
  const response = await this.apiClient.gastos.list();
  this.setLastResponse(response);
});

When('consulto mis gastos', async function (this: BDDWorld) {
  this.log('📋 Consultando gastos');
  
  const response = await this.apiClient.gastos.list();
  this.setLastResponse(response);
});

/**
 * STEPS PARA CONFIGURAR DATOS DE GASTOS
 */

Given('que tengo los siguientes gastos registrados:', async function (this: BDDWorld, dataTable) {
  this.log('📝 Configurando gastos existentes');
  
  const gastosData = dataTable.hashes().map((row: any) => ({
    id: Math.floor(Math.random() * 1000),
    monto: parseFloat(row.monto),
    descripcion: row.descripcion,
    fecha: row.fecha,
    usuario_id: 1,
    categoria_id: null,
    factura: false,
    metodo_pago: null
  }));
  
  // Almacenar en test data
  gastosData.forEach((gasto: any) => this.storeTestData('gasto', gasto));
  
  // Configurar mocks
  this.mockManager.setupExistingGastos(gastosData);
});

Given('que no tengo gastos registrados', function (this: BDDWorld) {
  this.log('📝 Configurando sin gastos registrados');
  this.mockManager.setupExistingGastos([]);
});

/**
 * STEPS PARA VERIFICACIONES DE GASTOS
 */

Then('el gasto debe guardarse correctamente', function (this: BDDWorld) {
  this.log('🔍 Verificando que el gasto se guardó correctamente');
  
  expect(this.lastResponse).toBeDefined();
  expect(this.lastResponse!.status).toBe(200);
  expect(this.lastResponse!.data).toBeDefined();
  expect(this.lastResponse!.data.id).toBeDefined();
  expect(this.lastResponse!.data.monto).toBeDefined();
  expect(this.lastResponse!.error).toBeUndefined();
});

Then('debe aparecer en mi lista de gastos', async function (this: BDDWorld) {
  this.log('🔍 Verificando que el gasto aparece en la lista');
  
  // Consultar la lista de gastos
  const response = await this.apiClient.gastos.list();
  
  expect(response.status).toBe(200);
  expect(Array.isArray(response.data)).toBe(true);
  expect(response.data.length).toBeGreaterThan(0);
  
  // Verificar que el último gasto creado está en la lista
  if (this.testData.lastCreatedId) {
    const gastoEncontrado = response.data.find((gasto: any) => gasto.id === this.testData.lastCreatedId);
    expect(gastoEncontrado).toBeDefined();
  }
});

Then('debe contener todos los campos especificados', function (this: BDDWorld) {
  this.log('🔍 Verificando que el gasto contiene todos los campos');
  
  expect(this.lastResponse).toBeDefined();
  expect(this.lastResponse!.data).toBeDefined();
  
  const gasto = this.lastResponse!.data;
  expect(gasto.monto).toBeDefined();
  expect(gasto.fecha).toBeDefined();
  expect(gasto.descripcion).toBeDefined();
  expect(gasto.factura).toBeDefined();
  expect(gasto.metodo_pago).toBeDefined();
});

Then('el gasto no debe guardarse', function (this: BDDWorld) {
  this.log('🔍 Verificando que el gasto NO se guardó');
  
  expect(this.lastResponse).toBeDefined();
  expect(this.lastResponse!.status).toBeGreaterThanOrEqual(400);
  expect(this.lastResponse!.error).toBeDefined();
});

Then('el monto debe ser {string}', function (this: BDDWorld, expectedMonto: string) {
  this.log('🔍 Verificando monto del gasto:', expectedMonto);
  
  expect(this.lastResponse).toBeDefined();
  expect(this.lastResponse!.data).toBeDefined();
  expect(this.lastResponse!.data.monto.toString()).toBe(expectedMonto);
});

Then('la fecha debe ser {string}', function (this: BDDWorld, expectedFecha: string) {
  this.log('🔍 Verificando fecha del gasto:', expectedFecha);
  
  expect(this.lastResponse).toBeDefined();
  expect(this.lastResponse!.data).toBeDefined();
  
  // Normalizar fechas para comparación
  const actualFecha = new Date(this.lastResponse!.data.fecha).toISOString().split('T')[0];
  expect(actualFecha).toBe(expectedFecha);
});

Then('la descripción debe ser nula', function (this: BDDWorld) {
  this.log('🔍 Verificando que la descripción es nula');
  
  expect(this.lastResponse).toBeDefined();
  expect(this.lastResponse!.data).toBeDefined();
  expect(this.lastResponse!.data.descripcion).toBeNull();
});

Then('debe estar asociado con la categoría {string}', function (this: BDDWorld, nombreCategoria: string) {
  this.log('🔍 Verificando asociación con categoría:', nombreCategoria);
  
  expect(this.lastResponse).toBeDefined();
  expect(this.lastResponse!.data).toBeDefined();
  expect(this.lastResponse!.data.categoria).toBeDefined();
  expect(this.lastResponse!.data.categoria.nombre).toBe(nombreCategoria);
});

Then('debo ver {int} gastos', function (this: BDDWorld, expectedCount: number) {
  this.log('🔍 Verificando cantidad de gastos:', expectedCount);
  
  expect(this.lastResponse).toBeDefined();
  expect(Array.isArray(this.lastResponse!.data)).toBe(true);
  expect(this.lastResponse!.data).toHaveLength(expectedCount);
});

Then('debo ver el gasto con la categoría {string} correcta', function (this: BDDWorld, nombreCategoria: string) {
  this.log('🔍 Verificando gasto con categoría en lista:', nombreCategoria);
  
  expect(this.lastResponse).toBeDefined();
  expect(Array.isArray(this.lastResponse!.data)).toBe(true);
  
  const gastoConCategoria = this.lastResponse!.data.find((gasto: any) => 
    gasto.categoria && gasto.categoria.nombre === nombreCategoria
  );
  
  expect(gastoConCategoria).toBeDefined();
});

Then('el total de gastos debe reflejar {string}', function (this: BDDWorld, expectedTotal: string) {
  this.log('🔍 Verificando total de gastos:', expectedTotal);
  
  expect(this.lastResponse).toBeDefined();
  expect(Array.isArray(this.lastResponse!.data)).toBe(true);
  
  const total = this.lastResponse!.data.reduce((sum: number, gasto: any) => sum + parseFloat(gasto.monto), 0);
  expect(total.toString()).toBe(expectedTotal);
});

/**
 * STEPS PARA MÚLTIPLES GASTOS
 */

When('creo múltiples gastos:', async function (this: BDDWorld, dataTable) {
  this.log('📝 Creando múltiples gastos');
  
  const gastosData = dataTable.hashes();
  
  for (const gastoRow of gastosData) {
    const gastoData: GastoInput = {
      monto: parseFloat(gastoRow.monto),
      fecha: gastoRow.fecha || '2024-01-15',
      descripcion: gastoRow.descripcion
    };
    
    const response = await this.apiClient.gastos.create(gastoData);
    expect(response.status).toBe(200);
  }
  
  // La última respuesta será la del último gasto creado
  this.log('✅ Múltiples gastos creados exitosamente');
});

When('creo un gasto con monto {string} y descripción {string}', async function (this: BDDWorld, monto: string, descripcion: string) {
  this.log('📝 Creando gasto individual:', { monto, descripcion });
  
  const gastoData: GastoInput = {
    monto: parseFloat(monto),
    fecha: '2024-01-15',
    descripcion: descripcion
  };
  
  const response = await this.apiClient.gastos.create(gastoData);
  this.setLastResponse(response);
});

When('registro los siguientes gastos:', async function (this: BDDWorld, dataTable) {
  this.log('📝 Registrando múltiples gastos con categorías');
  
  const gastosData = dataTable.hashes();
  let allSuccessful = true;
  
  for (const gastoRow of gastosData) {
    // Buscar la categoría por nombre
    const categorias = this.getTestData('categoria');
    const categoria = categorias.find((cat: any) => cat.nombre === gastoRow.categoria);
    
    const gastoData: GastoInput = {
      monto: parseFloat(gastoRow.monto),
      fecha: '2024-01-15',
      descripcion: gastoRow.descripcion,
      categoria_id: categoria ? categoria.id : undefined
    };
    
    const response = await this.apiClient.gastos.create(gastoData);
    if (response.status !== 200) {
      allSuccessful = false;
    }
  }
  
  // Configurar respuesta final
  this.setLastResponse({
    status: allSuccessful ? 200 : 400,
    data: allSuccessful ? { success: true } : null,
    error: allSuccessful ? undefined : 'Algunos gastos fallaron'
  });
});

Then('todos los gastos deben guardarse correctamente', function (this: BDDWorld) {
  this.log('🔍 Verificando que todos los gastos se guardaron');
  
  expect(this.wasLastRequestSuccessful()).toBe(true);
  
  const gastos = this.getTestData('gasto');
  expect(gastos.length).toBeGreaterThan(0);
  
  gastos.forEach(gasto => {
    expect(gasto.id).toBeDefined();
    expect(gasto.monto).toBeDefined();
  });
});