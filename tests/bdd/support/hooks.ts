/**
 * Hooks para BDD - Setup y Teardown
 * 
 * Este archivo contiene los hooks que se ejecutan antes y después
 * de cada escenario para configurar el entorno y limpiar el estado.
 * 
 * Principios aplicados:
 * - Setup consistente antes de cada escenario
 * - Cleanup automático después de cada escenario
 * - Logging para debugging
 * - Integración con Jest environment
 */

import { Before, After, BeforeAll, AfterAll } from '@cucumber/cucumber';
import { BDDWorld } from './world';

/**
 * SETUP GLOBAL - Antes de todas las pruebas
 */
BeforeAll(async function () {
  console.log('🌍 Iniciando suite de pruebas BDD');
  
  // Configurar variables de entorno para pruebas
  process.env.NODE_ENV = 'test';
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = 'test_clerk_key';
  process.env.CLERK_SECRET_KEY = 'test_clerk_secret';
  
  // Configurar timeout global para Jest
  jest.setTimeout(30000);
  
  console.log('✅ Configuración global de BDD completada');
});

/**
 * CLEANUP GLOBAL - Después de todas las pruebas
 */
AfterAll(async function () {
  console.log('🏁 Finalizando suite de pruebas BDD');
  
  // Cleanup global si es necesario
  // Por ejemplo, cerrar conexiones, limpiar archivos temporales, etc.
  
  console.log('✅ Cleanup global de BDD completado');
});

/**
 * SETUP POR ESCENARIO - Antes de cada escenario
 */
Before(function (this: BDDWorld, scenario) {
  const scenarioName = scenario.pickle.name;
  const featureName = scenario.pickle.uri?.split('/').pop()?.replace('.feature', '') || 'unknown';
  
  console.log(`\n🚀 Iniciando escenario: "${scenarioName}" en feature: "${featureName}"`);
  
  // Reset del estado del mundo
  this.reset();
  
  // Configurar logging específico del escenario
  this.log(`Escenario iniciado: ${scenarioName}`);
  
  // Configurar mocks por defecto
  this.mockManager.resetAllMocks();
  
  // Marcar tiempo de inicio para métricas
  this.testData.startTime = Date.now();
  
  console.log('✅ Setup del escenario completado');
});

/**
 * CLEANUP POR ESCENARIO - Después de cada escenario
 */
After(function (this: BDDWorld, scenario) {
  const scenarioName = scenario.pickle.name;
  const duration = this.testData.startTime ? Date.now() - this.testData.startTime : 0;
  
  console.log(`\n🏁 Finalizando escenario: "${scenarioName}" (${duration}ms)`);
  
  // Log del resultado del escenario
  if (scenario.result?.status === 'PASSED') {
    this.log(`✅ Escenario PASÓ: ${scenarioName}`);
    console.log('✅ Escenario completado exitosamente');
  } else if (scenario.result?.status === 'FAILED') {
    this.log(`❌ Escenario FALLÓ: ${scenarioName}`);
    console.log('❌ Escenario falló');
    
    // Log de información de debugging en caso de fallo
    this.log('Estado final del mundo:', {
      currentUser: this.currentUser,
      lastResponse: this.lastResponse,
      errors: this.errors,
      testDataCounts: {
        gastos: this.getTestData('gasto').length,
        ingresos: this.getTestData('ingreso').length,
        categorias: this.getTestData('categoria').length
      }
    });
  } else {
    this.log(`⚠️ Escenario estado: ${scenario.result?.status}: ${scenarioName}`);
    console.log(`⚠️ Escenario terminó con estado: ${scenario.result?.status}`);
  }
  
  // Cleanup del estado
  this.reset();
  
  // Cleanup de mocks
  this.mockManager.resetAllMocks();
  
  console.log('✅ Cleanup del escenario completado');
});

/**
 * HOOKS CONDICIONALES - Para escenarios específicos
 */

// Hook para escenarios que requieren usuario autenticado
Before('@authenticated', function (this: BDDWorld) {
  this.log('🔐 Configurando usuario autenticado para escenario tagged');
  this.setAuthenticatedUser();
});

// Hook para escenarios que requieren usuario no autenticado
Before('@unauthenticated', function (this: BDDWorld) {
  this.log('🚫 Configurando usuario no autenticado para escenario tagged');
  this.setUnauthenticatedUser();
});

// Hook para escenarios de performance
Before('@performance', function (this: BDDWorld) {
  this.log('⚡ Configurando métricas de performance');
  this.testData.performanceMetrics = {
    startTime: Date.now(),
    operations: []
  };
});

After('@performance', function (this: BDDWorld, scenario) {
  if (this.testData.performanceMetrics) {
    const totalTime = Date.now() - this.testData.performanceMetrics.startTime;
    this.log('📊 Métricas de performance:', {
      totalTime: `${totalTime}ms`,
      operations: this.testData.performanceMetrics.operations.length,
      averageOperationTime: this.testData.performanceMetrics.operations.length > 0 
        ? `${totalTime / this.testData.performanceMetrics.operations.length}ms`
        : 'N/A'
    });
    
    // Verificar que el tiempo total sea aceptable (para mocks debería ser muy rápido)
    if (totalTime > 5000) { // 5 segundos
      console.warn(`⚠️ Escenario de performance tardó ${totalTime}ms - puede ser demasiado lento`);
    }
  }
});

// Hook para escenarios que requieren datos específicos
Before('@with-test-data', function (this: BDDWorld) {
  this.log('📊 Configurando datos de prueba específicos');
  
  // Configurar datos de prueba comunes
  const categoriasPorDefecto = [
    { id: 1, nombre: 'Alimentación', usuario_id: 1, activa: true, fecha_creacion: new Date().toISOString() },
    { id: 2, nombre: 'Transporte', usuario_id: 1, activa: true, fecha_creacion: new Date().toISOString() },
    { id: 3, nombre: 'Entretenimiento', usuario_id: 1, activa: true, fecha_creacion: new Date().toISOString() }
  ];
  
  categoriasPorDefecto.forEach(categoria => this.storeTestData('categoria', categoria));
  this.mockManager.setupExistingCategories(categoriasPorDefecto);
});

// Hook para escenarios de integración
Before('@integration', function (this: BDDWorld) {
  this.log('🔗 Configurando escenario de integración');
  
  // Configurar timeout más largo para escenarios de integración
  jest.setTimeout(60000);
  
  // Configurar logging más detallado
  this.testData.detailedLogging = true;
});

After('@integration', function (this: BDDWorld) {
  this.log('🔗 Finalizando escenario de integración');
  
  // Restaurar timeout normal
  jest.setTimeout(30000);
  
  // Verificar integridad de datos después de escenarios de integración
  const gastos = this.getTestData('gasto');
  const ingresos = this.getTestData('ingreso');
  const categorias = this.getTestData('categoria');
  
  this.log('📊 Estado final de integración:', {
    gastos: gastos.length,
    ingresos: ingresos.length,
    categorias: categorias.length,
    errores: this.errors.length
  });
});

/**
 * HOOKS DE ERROR HANDLING
 */

// Hook para capturar errores no manejados
Before(function (this: BDDWorld) {
  // Configurar captura de errores no manejados
  this.testData.unhandledErrors = [];
  
  const originalConsoleError = console.error;
  console.error = (...args) => {
    if (this.testData.unhandledErrors) {
      this.testData.unhandledErrors.push(args.join(' '));
    }
    originalConsoleError.apply(console, args);
  };
});

After(function (this: BDDWorld) {
  // Verificar si hubo errores no manejados
  if (this.testData.unhandledErrors && this.testData.unhandledErrors.length > 0) {
    this.log('⚠️ Errores no manejados detectados:', this.testData.unhandledErrors);
  }
  
  // Restaurar console.error original
  // (En un entorno real, esto se haría de manera más robusta)
});

/**
 * HOOKS DE DEBUGGING
 */

// Hook para escenarios de debugging
Before('@debug', function (this: BDDWorld) {
  this.log('🐛 Modo debugging activado');
  this.testData.debugMode = true;
});

After('@debug', function (this: BDDWorld, scenario) {
  if (this.testData.debugMode) {
    this.log('🐛 Información de debugging:', {
      scenario: scenario.pickle.name,
      finalState: {
        user: this.currentUser,
        lastResponse: this.lastResponse,
        testData: this.testData,
        errors: this.errors
      }
    });
  }
});

/**
 * UTILIDADES PARA HOOKS
 */

// Función helper para logging de hooks
function logHook(hookName: string, scenarioName: string, additionalInfo?: any) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] 🪝 ${hookName}: ${scenarioName}`, additionalInfo || '');
}

// Función helper para verificar estado del sistema
function verifySystemState(world: BDDWorld): boolean {
  try {
    // Verificaciones básicas del estado del sistema
    const hasValidUser = world.currentUser !== undefined; // null es válido para usuarios no autenticados
    const hasValidMockManager = world.mockManager !== undefined;
    const hasValidApiClient = world.apiClient !== undefined;
    const hasValidDataBuilder = world.dataBuilder !== undefined;
    
    return hasValidUser && hasValidMockManager && hasValidApiClient && hasValidDataBuilder;
  } catch (error) {
    console.error('❌ Error verificando estado del sistema:', error);
    return false;
  }
}

// Exportar utilidades para uso en otros archivos si es necesario
export { logHook, verifySystemState };