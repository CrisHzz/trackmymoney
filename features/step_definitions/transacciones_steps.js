import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from 'chai';
import { formatDateForInput, formatDisplayDate, parseLocalDate } from './testUtils.js';

// Variables globales para almacenar el estado entre pasos
let ingresos = 0;
let gastos = 0;
let balance = 0;
let fechaFormateada = '';
let fechaEntrada = '';
let transacciones = [];
let estadisticas = {};

// Background steps
Given('que tengo una aplicación de gestión financiera funcionando', function () {
  // Simular que la aplicación está funcionando
  console.log('Aplicación de gestión financiera inicializada');
});

Given('que tengo acceso a las utilidades de fecha y cálculo', function () {
  // Verificar que las utilidades están disponibles
  expect(formatDateForInput).to.be.a('function');
  expect(formatDisplayDate).to.be.a('function');
  expect(parseLocalDate).to.be.a('function');
});

// Steps para el escenario de cálculo de balance
Given('que tengo ingresos por valor de {string} euros', function (monto) {
  ingresos = parseFloat(monto);
  console.log(`Ingresos configurados: ${ingresos} euros`);
});

Given('que tengo gastos por valor de {string} euros', function (monto) {
  gastos = parseFloat(monto);
  console.log(`Gastos configurados: ${gastos} euros`);
});

When('calculo el balance mensual', function () {
  balance = ingresos - gastos;
  console.log(`Balance calculado: ${balance} euros`);
});

Then('el resultado debe ser {string} euros', function (resultadoEsperado) {
  const resultado = parseFloat(resultadoEsperado);
  expect(balance).to.equal(resultado);
});

Then('el balance debe ser positivo', function () {
  expect(balance).to.be.greaterThan(0);
});

// Steps para el escenario de formateo de fecha
Given('que tengo una fecha en formato {string}', function (fecha) {
  fechaFormateada = fecha;
  console.log(`Fecha a formatear: ${fechaFormateada}`);
});

When('formateo la fecha para mostrar', function () {
  fechaFormateada = formatDisplayDate(fechaFormateada);
  console.log(`Fecha formateada: ${fechaFormateada}`);
});

Then('la fecha debe mostrarse como {string}', function (fechaEsperada) {
  expect(fechaFormateada).to.equal(fechaEsperada);
});

// Steps para el escenario de validación de formato de fecha
Given('que tengo una fecha actual', function () {
  fechaEntrada = formatDateForInput();
  console.log(`Fecha actual obtenida: ${fechaEntrada}`);
});

When('obtengo el formato de fecha para entrada', function () {
  // La fecha ya está en el formato correcto por el paso anterior
  console.log(`Formato de fecha para entrada: ${fechaEntrada}`);
});

Then('la fecha debe estar en formato {string}', function (formato) {
  // Verificar que la fecha sigue el formato YYYY-MM-DD
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  expect(fechaEntrada).to.match(regex);
});

Then('debe ser una fecha válida', function () {
  const fecha = parseLocalDate(fechaEntrada);
  expect(fecha).to.be.instanceOf(Date);
  expect(fecha.getTime()).to.not.be.NaN;
});

// Steps para el escenario de estadísticas de transacciones
Given('que tengo las siguientes transacciones:', function (dataTable) {
  transacciones = dataTable.hashes();
  console.log('Transacciones configuradas:', transacciones);
});

When('calculo las estadísticas totales', function () {
  let totalIngresos = 0;
  let totalGastos = 0;
  
  transacciones.forEach(transaccion => {
    const monto = parseFloat(transaccion.monto);
    if (transaccion.tipo === 'ingreso') {
      totalIngresos += monto;
    } else if (transaccion.tipo === 'gasto') {
      totalGastos += monto;
    }
  });
  
  estadisticas = {
    totalIngresos,
    totalGastos,
    balanceNeto: totalIngresos - totalGastos
  };
  
  console.log('Estadísticas calculadas:', estadisticas);
});

Then('el total de ingresos debe ser {string} euros', function (totalEsperado) {
  const total = parseFloat(totalEsperado);
  expect(estadisticas.totalIngresos).to.equal(total);
});

Then('el total de gastos debe ser {string} euros', function (totalEsperado) {
  const total = parseFloat(totalEsperado);
  expect(estadisticas.totalGastos).to.equal(total);
});

Then('el balance neto debe ser {string} euros', function (balanceEsperado) {
  const balance = parseFloat(balanceEsperado);
  expect(estadisticas.balanceNeto).to.equal(balance);
});
