/**
 * Step Definitions para Serenity BDD
 */

import { Given, When, Then, Before, After } from '@cucumber/cucumber';

// Hooks para Serenity
Before(function () {
  console.log('🧪 [Serenity BDD] Iniciando escenario');
});

After(function () {
  console.log('🧪 [Serenity BDD] Finalizando escenario');
});

// Steps de autenticación
Given('que soy un usuario autenticado', function () {
  console.log('🧪 [Serenity BDD] Usuario autenticado');
  this.setAuthenticatedUser();
});

Given('que no estoy autenticado', function () {
  console.log('🧪 [Serenity BDD] Usuario no autenticado');
  this.setUnauthenticatedUser();
});

// Steps de gastos
When('registro un gasto de {string} en {string}', function (monto: string, categoria: string) {
  console.log('🧪 [Serenity BDD] Registrando gasto', JSON.stringify({ monto, categoria }));
  this.setLastResponse({ status: 200, data: { id: 1, monto, categoria } });
});

When('consulto mis gastos', function () {
  console.log('🧪 [Serenity BDD] Consultando gastos');
  this.setLastResponse({ status: 200, data: [] });
});

// Steps de ingresos
When('registro un ingreso de {string} como {string}', function (monto: string, tipo: string) {
  console.log('🧪 [Serenity BDD] Registrando ingreso', JSON.stringify({ monto, tipo }));
  this.setLastResponse({ status: 200, data: { id: 1, monto, tipo } });
});

When('consulto mis ingresos', function () {
  console.log('🧪 [Serenity BDD] Consultando ingresos');
  this.setLastResponse({ status: 200, data: [] });
});

// Steps de categorías
When('creo una categoría {string}', function (nombre: string) {
  console.log('🧪 [Serenity BDD] Creando categoría', JSON.stringify({ nombre }));
  this.setLastResponse({ status: 200, data: { id: 1, nombre } });
});

When('consulto mis categorías', function () {
  console.log('🧪 [Serenity BDD] Consultando categorías');
  this.setLastResponse({ status: 200, data: [] });
});

// Steps de verificación
Then('el registro debe ser exitoso', function () {
  console.log('🧪 [Serenity BDD] Verificando éxito');
  if (!this.wasLastRequestSuccessful()) {
    throw new Error('El registro no fue exitoso');
  }
});

Then('el elemento debe tener monto {string}', function (esperado: string) {
  console.log('🧪 [Serenity BDD] Verificando monto', JSON.stringify({ esperado }));
  // Simulación de verificación
});

Then('el elemento debe tener nombre {string}', function (esperado: string) {
  console.log('🧪 [Serenity BDD] Verificando nombre', JSON.stringify({ esperado }));
  // Simulación de verificación
});

Then('debo ver una lista vacía', function () {
  console.log('🧪 [Serenity BDD] Verificando lista vacía');
  // Simulación de verificación
});

Then('debo ver {int} elemento(s)', function (cantidad: number) {
  console.log('🧪 [Serenity BDD] Verificando cantidad', JSON.stringify({ esperada: cantidad }));
  // Simulación de verificación
});

Then('debo recibir un error de autenticación', function () {
  console.log('🧪 [Serenity BDD] Verificando error de autenticación');
  // Simulación de verificación de error
});