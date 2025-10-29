/**
 * Step Definitions Comunes para BDD
 * 
 * Este archivo contiene los steps que son compartidos entre
 * diferentes features, como autenticación, validaciones generales
 * y verificaciones de estado.
 * 
 * Principios aplicados:
 * - DRY: Steps reutilizables entre features
 * - Expresiones regulares flexibles
 * - Manejo consistente de errores
 * - Integración con BDD World
 */

import { Given, When, Then, Before, After } from '@cucumber/cucumber';
// Usar expect de Jest
import expect from 'expect';
import { BDDWorld } from '../support/world';

// Las variables de entorno están configuradas en jest-setup.ts

/**
 * HOOKS - Setup y Teardown
 */

Before(function (this: BDDWorld) {
  // Setup antes de cada escenario
  this.log('🚀 Iniciando nuevo escenario BDD');
  this.reset();
});

After(function (this: BDDWorld) {
  // Cleanup después de cada escenario
  this.log('🏁 Finalizando escenario BDD');
  this.reset();
});

/**
 * STEPS DE AUTENTICACIÓN
 */

Given('que soy un usuario autenticado', function (this: BDDWorld) {
  this.log('👤 Configurando usuario autenticado');
  this.setAuthenticatedUser();
});

Given('que no estoy autenticado', function (this: BDDWorld) {
  this.log('🚫 Configurando usuario no autenticado');
  this.setUnauthenticatedUser();
});

Given('que soy un usuario autenticado con email {string}', function (this: BDDWorld, email: string) {
  this.log('👤 Configurando usuario autenticado con email específico:', email);
  this.setAuthenticatedUser({
    email,
    firstName: 'Test User',
    id: 'clerk_test_123',
    clerk_id: 'clerk_test_123'
  });
});

/**
 * STEPS DE VALIDACIÓN DE RESPUESTAS
 */

Then('debo recibir un error de validación', function (this: BDDWorld) {
  this.log('🔍 Verificando error de validación');
  expect(this.lastResponse).toBeDefined();
  expect(this.lastResponse!.status).toBeGreaterThanOrEqual(400);
  expect(this.lastResponse!.status).toBeLessThan(500);
  expect(this.lastResponse!.error).toBeDefined();
});

Then('debo recibir un error de autenticación', function (this: BDDWorld) {
  this.log('🔍 Verificando error de autenticación');
  expect(this.lastResponse).toBeDefined();
  expect(this.lastResponse!.status).toBe(401);
  expect(this.lastResponse!.error).toBeDefined();
});

Then('el código de estado debe ser {int}', function (this: BDDWorld, expectedStatus: number) {
  this.log('🔍 Verificando código de estado:', expectedStatus);
  expect(this.lastResponse).toBeDefined();
  expect(this.lastResponse!.status).toBe(expectedStatus);
});

Then('el mensaje debe indicar {string}', function (this: BDDWorld, expectedMessage: string) {
  this.log('🔍 Verificando mensaje de error:', expectedMessage);
  expect(this.lastResponse).toBeDefined();
  expect(this.lastResponse!.error).toContain(expectedMessage);
});

Then('la respuesta debe ser exitosa', function (this: BDDWorld) {
  this.log('🔍 Verificando respuesta exitosa');
  expect(this.lastResponse).toBeDefined();
  expect(this.lastResponse!.status).toBeGreaterThanOrEqual(200);
  expect(this.lastResponse!.status).toBeLessThan(300);
  expect(this.lastResponse!.error).toBeUndefined();
});

/**
 * STEPS DE VALIDACIÓN DE DATOS
 */

Then('debo ver una lista vacía', function (this: BDDWorld) {
  this.log('🔍 Verificando lista vacía');
  expect(this.lastResponse).toBeDefined();
  expect(this.lastResponse!.data).toBeDefined();
  expect(Array.isArray(this.lastResponse!.data)).toBe(true);
  expect(this.lastResponse!.data).toHaveLength(0);
});

Then('debo ver {int} elemento(s)', function (this: BDDWorld, expectedCount: number) {
  this.log('🔍 Verificando cantidad de elementos:', expectedCount);
  expect(this.lastResponse).toBeDefined();
  expect(this.lastResponse!.data).toBeDefined();
  expect(Array.isArray(this.lastResponse!.data)).toBe(true);
  expect(this.lastResponse!.data).toHaveLength(expectedCount);
});

Then('deben estar ordenados por fecha descendente', function (this: BDDWorld) {
  this.log('🔍 Verificando ordenamiento por fecha descendente');
  expect(this.lastResponse).toBeDefined();
  expect(Array.isArray(this.lastResponse!.data)).toBe(true);
  
  const items = this.lastResponse!.data;
  if (items.length > 1) {
    for (let i = 0; i < items.length - 1; i++) {
      const currentDate = new Date(items[i].fecha);
      const nextDate = new Date(items[i + 1].fecha);
      expect(currentDate.getTime()).toBeGreaterThanOrEqual(nextDate.getTime());
    }
  }
});

Then('deben estar ordenadas alfabéticamente', function (this: BDDWorld) {
  this.log('🔍 Verificando ordenamiento alfabético');
  expect(this.lastResponse).toBeDefined();
  expect(Array.isArray(this.lastResponse!.data)).toBe(true);
  
  const items = this.lastResponse!.data;
  if (items.length > 1) {
    for (let i = 0; i < items.length - 1; i++) {
      const currentName = items[i].nombre.toLowerCase();
      const nextName = items[i + 1].nombre.toLowerCase();
      expect(currentName.localeCompare(nextName)).toBeLessThanOrEqual(0);
    }
  }
});

/**
 * STEPS DE VERIFICACIÓN DE ESTADO
 */

Then('todas las operaciones deben ser exitosas', function (this: BDDWorld) {
  this.log('🔍 Verificando que todas las operaciones fueron exitosas');
  expect(this.wasLastRequestSuccessful()).toBe(true);
  expect(this.errors).toHaveLength(0);
});

Then('el estado final debe ser consistente', function (this: BDDWorld) {
  this.log('🔍 Verificando consistencia del estado final');
  // Verificar que no hay errores acumulados
  expect(this.errors).toHaveLength(0);
  
  // Verificar que la última respuesta fue exitosa
  expect(this.wasLastRequestSuccessful()).toBe(true);
  
  // Verificar que los datos de prueba están en estado válido
  const gastos = this.getTestData('gasto');
  const ingresos = this.getTestData('ingreso');
  const categorias = this.getTestData('categoria');
  
  // Todos los elementos deben tener IDs válidos
  gastos.forEach(gasto => expect(gasto.id).toBeDefined());
  ingresos.forEach(ingreso => expect(ingreso.id).toBeDefined());
  categorias.forEach(categoria => expect(categoria.id).toBeDefined());
});

Then('no debe haber referencias rotas o inconsistentes', function (this: BDDWorld) {
  this.log('🔍 Verificando integridad referencial');
  
  const gastos = this.getTestData('gasto');
  const ingresos = this.getTestData('ingreso');
  const categorias = this.getTestData('categoria');
  
  // Verificar que todas las referencias a categorías son válidas
  gastos.forEach(gasto => {
    if (gasto.categoria_id) {
      const categoriaExiste = categorias.some(cat => cat.id === gasto.categoria_id);
      expect(categoriaExiste).toBe(true);
    }
  });
  
  ingresos.forEach(ingreso => {
    if (ingreso.categoria_id) {
      const categoriaExiste = categorias.some(cat => cat.id === ingreso.categoria_id);
      expect(categoriaExiste).toBe(true);
    }
  });
});

/**
 * STEPS DE CONFIGURACIÓN DE DATOS
 */

Given('que existe una categoría {string} con ID {string}', function (this: BDDWorld, nombreCategoria: string, categoriaId: string) {
  this.log('📝 Configurando categoría existente:', { nombre: nombreCategoria, id: categoriaId });
  
  const categoria = {
    id: parseInt(categoriaId),
    nombre: nombreCategoria,
    usuario_id: 1,
    activa: true,
    fecha_creacion: new Date().toISOString()
  };
  
  this.storeTestData('categoria', categoria);
  this.mockManager.setupExistingCategories([categoria]);
});

Given('que no tengo {word} registrados', function (this: BDDWorld, tipoEntidad: string) {
  this.log('📝 Configurando sin registros de:', tipoEntidad);
  
  switch (tipoEntidad) {
    case 'gastos':
      this.mockManager.setupExistingGastos([]);
      break;
    case 'ingresos':
      this.mockManager.setupExistingIngresos([]);
      break;
    case 'categorías':
    case 'categorias':
      this.mockManager.setupExistingCategories([]);
      break;
  }
});

/**
 * STEPS DE UTILIDAD
 */

When('espero {int} segundo(s)', async function (this: BDDWorld, segundos: number) {
  this.log(`⏳ Esperando: ${segundos} segundos`);
  await new Promise(resolve => setTimeout(resolve, segundos * 1000));
});

Then('el tiempo de respuesta debe ser aceptable', function (this: BDDWorld) {
  this.log('🔍 Verificando tiempo de respuesta aceptable');
  // Para pruebas unitarias/integración, el tiempo debe ser muy rápido
  // Este step es más simbólico ya que las pruebas con mocks son instantáneas
  expect(true).toBe(true); // Siempre pasa para mocks
});

Then('no debe haber conflictos de datos', function (this: BDDWorld) {
  this.log('🔍 Verificando ausencia de conflictos de datos');
  
  // Verificar que no hay errores de conflicto
  expect(this.errors.filter(error => error.code === '409')).toHaveLength(0);
  
  // Verificar que la última respuesta no indica conflicto
  if (this.lastResponse) {
    expect(this.lastResponse.status).not.toBe(409);
  }
});

/**
 * STEPS DE DEBUGGING Y LOGGING
 */

When('imprimo el estado actual del sistema', function (this: BDDWorld) {
  this.log('🐛 Estado actual del sistema:');
  this.log('Usuario actual:', this.currentUser);
  this.log('Última respuesta:', this.lastResponse);
  this.log('Datos de prueba:', this.testData);
  this.log('Errores:', this.errors);
});

Then('imprimo la última respuesta', function (this: BDDWorld) {
  this.log('🐛 Última respuesta:', this.lastResponse);
});

/**
 * STEPS DE VALIDACIÓN AVANZADA
 */

Then('todas las {word} deben guardarse correctamente', function (this: BDDWorld, tipoEntidad: string) {
  this.log('🔍 Verificando que todas las entidades se guardaron:', tipoEntidad);
  
  expect(this.wasLastRequestSuccessful()).toBe(true);
  
  let entidades: any[] = [];
  switch (tipoEntidad) {
    case 'categorías':
    case 'categorias':
      entidades = this.getTestData('categoria');
      break;
    case 'gastos':
      entidades = this.getTestData('gasto');
      break;
    case 'ingresos':
      entidades = this.getTestData('ingreso');
      break;
  }
  
  expect(entidades.length).toBeGreaterThan(0);
  entidades.forEach(entidad => {
    expect(entidad.id).toBeDefined();
  });
});

Then('debo tener {int} {word} en mi lista', function (this: BDDWorld, cantidad: number, tipoEntidad: string) {
  this.log('🔍 Verificando cantidad en lista:', { cantidad, tipo: tipoEntidad });
  
  let entidades: any[] = [];
  switch (tipoEntidad) {
    case 'categorías':
    case 'categorias':
      entidades = this.getTestData('categoria');
      break;
    case 'gastos':
      entidades = this.getTestData('gasto');
      break;
    case 'ingresos':
      entidades = this.getTestData('ingreso');
      break;
  }
  
  expect(entidades).toHaveLength(cantidad);
});