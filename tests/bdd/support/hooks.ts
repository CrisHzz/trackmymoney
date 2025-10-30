import { Before, After, BeforeAll, AfterAll } from '@cucumber/cucumber';
import { BDDWorld } from './world';
BeforeAll(async function () {
  process.env.NODE_ENV = 'test';
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = 'test_clerk_key';
  process.env.CLERK_SECRET_KEY = 'test_clerk_secret';
  jest.setTimeout(30000);
});
AfterAll(async function () {
});
Before(function (this: BDDWorld, scenario) {
  this.reset();
  this.mockManager.resetAllMocks();
  this.testData.startTime = Date.now();
});
After(function (this: BDDWorld, scenario) {
  this.reset();
  this.mockManager.resetAllMocks();
});
Before('@authenticated', function (this: BDDWorld) {
  this.setAuthenticatedUser();
});
Before('@unauthenticated', function (this: BDDWorld) {
  this.setUnauthenticatedUser();
});
Before('@performance', function (this: BDDWorld) {
  this.testData.performanceMetrics = {
    startTime: Date.now(),
    operations: []
  };
});
After('@performance', function (this: BDDWorld, scenario) {
  if (this.testData.performanceMetrics) {
    const totalTime = Date.now() - this.testData.performanceMetrics.startTime;
    if (totalTime > 5000) {
      console.warn(`Performance scenario took ${totalTime}ms - may be too slow`);
    }
  }
});
Before('@with-test-data', function (this: BDDWorld) {
  const categoriasPorDefecto = [
    { id: 1, nombre: 'Alimentación', usuario_id: 1, activa: true, fecha_creacion: new Date().toISOString() },
    { id: 2, nombre: 'Transporte', usuario_id: 1, activa: true, fecha_creacion: new Date().toISOString() },
    { id: 3, nombre: 'Entretenimiento', usuario_id: 1, activa: true, fecha_creacion: new Date().toISOString() }
  ];
  categoriasPorDefecto.forEach(categoria => this.storeTestData('categoria', categoria));
  this.mockManager.setupExistingCategories(categoriasPorDefecto);
});
Before('@integration', function (this: BDDWorld) {
  jest.setTimeout(60000);
  this.testData.detailedLogging = true;
});
After('@integration', function (this: BDDWorld) {
  jest.setTimeout(30000);
});
Before('@debug', function (this: BDDWorld) {
  this.testData.debugMode = true;
});
After('@debug', function (this: BDDWorld, scenario) {
});
function logHook(hookName: string, scenarioName: string, additionalInfo?: any) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${hookName}: ${scenarioName}`, additionalInfo || '');
}
function verifySystemState(world: BDDWorld): boolean {
  try {
    const hasValidUser = world.currentUser !== undefined;
    const hasValidMockManager = world.mockManager !== undefined;
    const hasValidApiClient = world.apiClient !== undefined;
    const hasValidDataBuilder = world.dataBuilder !== undefined;
    return hasValidUser && hasValidMockManager && hasValidApiClient && hasValidDataBuilder;
  } catch (error) {
    console.error('Error verificando estado del sistema:', error);
    return false;
  }
}
export { logHook, verifySystemState };
