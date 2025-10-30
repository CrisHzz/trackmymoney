import { Given, When, Then, Before, After } from '@cucumber/cucumber';
import { SerenityBDDWorld } from '../support/serenity-world';
let mockData = {
  gastos: [] as any[],
  ingresos: [] as any[],
  categorias: [] as any[],
  currentUser: null as any,
  lastResponse: null as any
};
const performLogin = () => {
  mockData.currentUser = { id: 1, name: 'Serenity User', email: 'serenity@trackmymoney.com' };
  console.log('[Serenity] Usuario autenticado');
};
const performLogout = () => {
  mockData.currentUser = null;
  console.log('[Serenity] Usuario no autenticado');
};
const performCreateGasto = (monto: string, categoria: string) => {
  if (!mockData.currentUser) {
    mockData.lastResponse = { status: 401, error: 'No autenticado' };
    return;
  }
  const gasto = { id: Date.now(), monto, categoria, fecha: new Date().toISOString() };
  mockData.gastos.push(gasto);
  mockData.lastResponse = { status: 200, data: gasto };
  console.log('[Serenity] Gasto creado:', JSON.stringify({ monto, categoria }));
};
const performViewGastos = () => {
  if (!mockData.currentUser) {
    mockData.lastResponse = { status: 401, error: 'No autenticado' };
    return;
  }
  mockData.lastResponse = { status: 200, data: mockData.gastos };
  console.log('[Serenity] Gastos consultados:', mockData.gastos.length, 'elementos');
};
const performCreateIngreso = (monto: string, tipo: string) => {
  if (!mockData.currentUser) {
    mockData.lastResponse = { status: 401, error: 'No autenticado' };
    return;
  }
  const ingreso = { id: Date.now(), monto, tipo, fecha: new Date().toISOString() };
  mockData.ingresos.push(ingreso);
  mockData.lastResponse = { status: 200, data: ingreso };
  console.log('[Serenity] Ingreso creado:', JSON.stringify({ monto, tipo }));
};
const performViewIngresos = () => {
  if (!mockData.currentUser) {
    mockData.lastResponse = { status: 401, error: 'No autenticado' };
    return;
  }
  mockData.lastResponse = { status: 200, data: mockData.ingresos };
  console.log('[Serenity] Ingresos consultados:', mockData.ingresos.length, 'elementos');
};
const performCreateCategoria = (nombre: string) => {
  if (!mockData.currentUser) {
    mockData.lastResponse = { status: 401, error: 'No autenticado' };
    return;
  }
  const categoria = { id: Date.now(), nombre };
  mockData.categorias.push(categoria);
  mockData.lastResponse = { status: 200, data: categoria };
  console.log('[Serenity] Categoria creada:', JSON.stringify({ nombre }));
};
const performViewCategorias = () => {
  if (!mockData.currentUser) {
    mockData.lastResponse = { status: 401, error: 'No autenticado' };
    return;
  }
  mockData.lastResponse = { status: 200, data: mockData.categorias };
  console.log('[Serenity] Categorias consultadas:', mockData.categorias.length, 'elementos');
};
const wasSuccessful = (): boolean => {
  const result = mockData.lastResponse?.status === 200;
  return result;
};
const hasAuthError = (): boolean => {
  const result = mockData.lastResponse?.status === 401;
  return result;
};
const isEmpty = (): boolean => {
  const data = mockData.lastResponse?.data;
  const result = Array.isArray(data) && data.length === 0;
  return result;
};
const hasCount = (count: number): boolean => {
  const data = mockData.lastResponse?.data;
  const result = Array.isArray(data) && data.length === count;
  return result;
};
const hasMonto = (monto: string): boolean => {
  const result = mockData.lastResponse?.data?.monto === monto;
  return result;
};
const hasNombre = (nombre: string): boolean => {
  const result = mockData.lastResponse?.data?.nombre === nombre;
  return result;
};
Before(function (this: SerenityBDDWorld) {
  console.log('[Serenity] Iniciando escenario');
  mockData = {
    gastos: [],
    ingresos: [],
    categorias: [],
    currentUser: null,
    lastResponse: null
  };
  this.reset();
});
After(function (this: SerenityBDDWorld) {
  console.log('[Serenity] Finalizando escenario');
});
Given('que soy un usuario autenticado', async function (this: SerenityBDDWorld) {
  performLogin();
});
Given('que no estoy autenticado', async function (this: SerenityBDDWorld) {
  performLogout();
});
When('registro un gasto de {string} en {string}', async function (this: SerenityBDDWorld, monto: string, categoria: string) {
  performCreateGasto(monto, categoria);
});
When('consulto mis gastos', async function (this: SerenityBDDWorld) {
  performViewGastos();
});
When('registro un ingreso de {string} como {string}', async function (this: SerenityBDDWorld, monto: string, tipo: string) {
  performCreateIngreso(monto, tipo);
});
When('consulto mis ingresos', async function (this: SerenityBDDWorld) {
  performViewIngresos();
});
When('creo una categoría {string}', async function (this: SerenityBDDWorld, nombre: string) {
  performCreateCategoria(nombre);
});
When('consulto mis categorías', async function (this: SerenityBDDWorld) {
  performViewCategorias();
});
Then('el registro debe ser exitoso', async function (this: SerenityBDDWorld) {
  console.log('[Serenity] Verificando exito');
  if (!wasSuccessful()) {
    throw new Error('El registro no fue exitoso');
  }
});
Then('el elemento debe tener monto {string}', async function (this: SerenityBDDWorld, esperado: string) {
  console.log('[Serenity] Verificando monto:', JSON.stringify({ esperado }));
  if (!hasMonto(esperado)) {
    throw new Error(`El elemento no tiene el monto esperado: ${esperado}`);
  }
});
Then('el elemento debe tener nombre {string}', async function (this: SerenityBDDWorld, esperado: string) {
  console.log('[Serenity] Verificando nombre:', JSON.stringify({ esperado }));
  if (!hasNombre(esperado)) {
    throw new Error(`El elemento no tiene el nombre esperado: ${esperado}`);
  }
});
Then('debo ver una lista vacía', async function (this: SerenityBDDWorld) {
  console.log('[Serenity] Verificando lista vacia');
  if (!isEmpty()) {
    throw new Error('La lista no está vacía');
  }
});
Then('debo ver {int} elemento(s)', async function (this: SerenityBDDWorld, cantidad: number) {
  console.log('[Serenity] Verificando cantidad:', JSON.stringify({ esperada: cantidad }));
  if (!hasCount(cantidad)) {
    throw new Error(`La lista no tiene ${cantidad} elementos`);
  }
});
Then('debo recibir un error de autenticación', async function (this: SerenityBDDWorld) {
  console.log('[Serenity] Verificando error de autenticacion');
  if (!hasAuthError()) {
    throw new Error('No se recibió error de autenticación');
  }
});
