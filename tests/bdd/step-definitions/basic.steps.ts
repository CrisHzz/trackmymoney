/**
 * Step Definitions Básicos para probar la configuración BDD
 * 
 * Este archivo contiene steps básicos para verificar que
 * la configuración de Cucumber + Serenity funciona correctamente.
 */

import { Given, When, Then } from '@cucumber/cucumber';
// Usar expect de Jest
import expect from 'expect';
import { SimpleBDDWorld } from '../support/simple-world';

// Steps básicos para probar la configuración
Given('que el sistema BDD está configurado', function (this: SimpleBDDWorld) {
  this.logMessage('✅ Sistema BDD configurado correctamente');
  expect(this).toBeDefined();
});

When('ejecuto una prueba básica', function (this: SimpleBDDWorld) {
  this.logMessage('🧪 Ejecutando prueba básica');
  this.testData.basicTestExecuted = true;
});

Then('la prueba debe pasar exitosamente', function (this: SimpleBDDWorld) {
  this.logMessage('✅ Verificando que la prueba básica pasó');
  expect(this.testData.basicTestExecuted).toBe(true);
});