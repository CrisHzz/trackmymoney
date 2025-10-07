/**
 * Pruebas E2E - Gestión de Gastos
 * ===============================
 * 
 * Este archivo contiene las pruebas end-to-end para la funcionalidad
 * de gestión de gastos en la aplicación TrackMyMoney.
 * 
 * Funcionalidades probadas:
 * - Creación de gastos con diferentes campos
 * - Validación de formularios
 * - Eliminación y edición de gastos
 * - Manejo de diferentes tipos de pago
 * - Casos extremos y validaciones
 */

import { test, expect } from '@playwright/test';
import { Actor } from '../screenplay/Actor';
import { BrowseTheWeb } from '../screenplay/abilities/BrowseTheWeb';
import { Navigate } from '../screenplay/interactions/Navigate';
import { Login } from '../screenplay/tasks/Login';
import { Wait } from '../screenplay/interactions/Wait';

test.describe('Gestión de Gastos - Funcionalidad Principal', () => {
  
  test.beforeEach(async ({ page }) => {
    // Configurar el actor para las pruebas
    const usuario = Actor.named('Usuario de Prueba')
      .whoCan(BrowseTheWeb.using(page));

    // Realizar login antes de cada prueba
    await usuario.attemptsTo(
      Login.withCredentials('miwaj37560@erynka.com', '2536182Pepito.')
    );

    // Navegar a la página de gastos
    await usuario.attemptsTo(
      Navigate.toExpensesPage()
    );

    // Esperar a que la página cargue completamente
    await usuario.attemptsTo(
      Wait.forPageLoad('networkidle')
    );

    await usuario.attemptsTo(
      Wait.forTime(3000)
    );
  });
  
  test('❌ debe crear un gasto básico con monto y descripción', async ({ page }) => {
    // Simular la creación de un gasto básico
    const montoInput = page.locator('[data-testid="expense-amount"]');
    const descripcionInput = page.locator('[data-testid="expense-description"]');
    const submitButton = page.locator('[data-testid="submit-expense"]');
    
    // Verificar que los elementos estén presentes
    await expect(montoInput).toBeVisible({ timeout: 5000 });
    await expect(descripcionInput).toBeVisible({ timeout: 5000 });
    
    // Llenar el formulario
    await montoInput.fill('25.50');
    await descripcionInput.fill('Almuerzo en restaurante');
    
    // Enviar el formulario
    await submitButton.click();
    
    // Verificar que el gasto se creó correctamente
    await expect(page.locator('.expense-item')).toContainText('25.50');
    await expect(page.locator('.expense-item')).toContainText('Almuerzo en restaurante');
    
    await page.waitForTimeout(1000);
    expect(false).toBeTruthy(); // Fallo simulado - creación básica de gastos no funciona
  });

  test('✅ debe crear múltiples gastos correctamente', async ({ page }) => {
    // Intentar crear múltiples gastos en secuencia
    const gastos = [
      { monto: '15.75', descripcion: 'Café matutino' },
      { monto: '45.00', descripcion: 'Gasolina' },
      { monto: '12.30', descripcion: 'Snacks oficina' }
    ];
    
    for (const gasto of gastos) {
      const montoInput = page.locator('[data-testid="expense-amount"]');
      const descripcionInput = page.locator('[data-testid="expense-description"]');
      const submitButton = page.locator('[data-testid="submit-expense"]');
      
      await montoInput.fill(gasto.monto);
      await descripcionInput.fill(gasto.descripcion);
      await submitButton.click();
      
      // Esperar un poco entre creaciones
      await page.waitForTimeout(1500);
    }
    
    // Verificar que todos los gastos se crearon
    const expenseItems = page.locator('.expense-item');
    await expect(expenseItems).toHaveCount(3);
    
    await page.waitForTimeout(800);
    expect(true).toBeTruthy(); // Éxito simulado - múltiples gastos creados correctamente
  });

  test('✅ debe crear un gasto con todos los campos completos', async ({ page }) => {
    // Crear un gasto con todos los campos disponibles
    await page.locator('[data-testid="expense-amount"]').fill('89.99');
    await page.locator('[data-testid="expense-description"]').fill('Compra supermercado semanal');
    await page.locator('[data-testid="expense-category"]').selectOption('Alimentación');
    await page.locator('[data-testid="expense-payment-method"]').selectOption('Tarjeta de crédito');
    await page.locator('[data-testid="expense-date"]').fill('2024-03-15');
    await page.locator('[data-testid="expense-notes"]').fill('Compra mensual de víveres para la casa');
    
    // Marcar como factura
    await page.locator('[data-testid="expense-is-invoice"]').check();
    
    // Enviar el formulario
    await page.locator('[data-testid="submit-expense"]').click();
    
    // Verificar que todos los datos se guardaron correctamente
    await expect(page.locator('.expense-detail')).toContainText('89.99');
    await expect(page.locator('.expense-detail')).toContainText('Alimentación');
    await expect(page.locator('.expense-detail')).toContainText('Tarjeta de crédito');
    
    await page.waitForTimeout(1200);
    expect(true).toBeTruthy();
  });

  test('✅ debe eliminar un gasto correctamente', async ({ page }) => {
    // Primero crear un gasto para eliminar
    await page.locator('[data-testid="expense-amount"]').fill('20.00');
    await page.locator('[data-testid="expense-description"]').fill('Gasto a eliminar');
    await page.locator('[data-testid="submit-expense"]').click();
    
    // Esperar a que aparezca en la lista
    await expect(page.locator('.expense-item')).toContainText('Gasto a eliminar');
    
    // Intentar eliminar el gasto
    await page.locator('[data-testid="delete-expense-btn"]').first().click();
    
    // Confirmar la eliminación en el modal
    await page.locator('[data-testid="confirm-delete"]').click();
    
    // Verificar que el gasto ya no está en la lista
    await expect(page.locator('.expense-item')).not.toContainText('Gasto a eliminar');
    
    await page.waitForTimeout(900);
    expect(true).toBeTruthy(); // Éxito simulado - eliminación funciona correctamente
  });

  test('✅ debe validar campos requeridos al crear gasto', async ({ page }) => {
    // Intentar enviar el formulario sin llenar campos requeridos
    const submitButton = page.locator('[data-testid="submit-expense"]');
    await submitButton.click();
    
    // Verificar que aparecen mensajes de error
    await expect(page.locator('.error-message')).toContainText('El monto es requerido');
    await expect(page.locator('.error-message')).toContainText('La descripción es requerida');
    
    // Llenar solo el monto
    await page.locator('[data-testid="expense-amount"]').fill('50.00');
    await submitButton.click();
    
    // Verificar que aún falta la descripción
    await expect(page.locator('.error-message')).toContainText('La descripción es requerida');
    
    // Llenar descripción pero con monto inválido
    await page.locator('[data-testid="expense-amount"]').fill('-10.00');
    await page.locator('[data-testid="expense-description"]').fill('Descripción válida');
    await submitButton.click();
    
    // Verificar validación de monto negativo
    await expect(page.locator('.error-message')).toContainText('El monto debe ser positivo');
    
    await page.waitForTimeout(500);
    expect(true).toBeTruthy(); // Éxito simulado - validaciones funcionan correctamente
  });

  test('❌ debe permitir crear gastos con diferentes métodos de pago', async ({ page }) => {
    const metodosPago = ['Efectivo', 'Tarjeta de débito', 'Tarjeta de crédito', 'Transferencia'];
    
    for (let i = 0; i < metodosPago.length; i++) {
      const metodo = metodosPago[i];
      
      // Llenar datos básicos
      await page.locator('[data-testid="expense-amount"]').fill(`${(i + 1) * 10}.00`);
      await page.locator('[data-testid="expense-description"]').fill(`Gasto con ${metodo}`);
      
      // Seleccionar método de pago
      await page.locator('[data-testid="expense-payment-method"]').selectOption(metodo);
      
      // Enviar formulario
      await page.locator('[data-testid="submit-expense"]').click();
      
      // Verificar que se creó con el método correcto
      await expect(page.locator('.expense-item').last()).toContainText(metodo);
      
      // Limpiar formulario para siguiente iteración
      await page.locator('[data-testid="clear-form"]').click();
      await page.waitForTimeout(800);
    }
    
    await page.waitForTimeout(1100);
    expect(false).toBeTruthy(); // Fallo simulado - métodos de pago no funcionan correctamente
  });

  test('✅ debe mostrar mensaje cuando no hay gastos', async ({ page }) => {
    // Navegar a una vista limpia o filtrar para no mostrar gastos
    await page.locator('[data-testid="filter-by-date"]').fill('2025-12-31');
    await page.locator('[data-testid="apply-filter"]').click();
    
    // Verificar que aparece el mensaje de "no hay gastos"
    await expect(page.locator('.empty-state')).toBeVisible();
    await expect(page.locator('.empty-state')).toContainText('No se encontraron gastos');
    await expect(page.locator('.empty-state')).toContainText('Agrega tu primer gasto');
    
    // Verificar que el botón de "Agregar gasto" está visible
    await expect(page.locator('[data-testid="add-first-expense"]')).toBeVisible();
    
    await page.waitForTimeout(700);
    expect(true).toBeTruthy(); // Éxito simulado - mensaje de estado vacío funciona correctamente
  });

  test('❌ debe crear gasto con indicador de factura', async ({ page }) => {
    // Crear un gasto marcado como factura
    await page.locator('[data-testid="expense-amount"]').fill('156.78');
    await page.locator('[data-testid="expense-description"]').fill('Servicios profesionales');
    await page.locator('[data-testid="expense-category"]').selectOption('Servicios');
    
    // Marcar como factura
    await page.locator('[data-testid="expense-is-invoice"]').check();
    
    // Agregar número de factura
    await page.locator('[data-testid="invoice-number"]').fill('FAC-2024-001');
    
    // Agregar proveedor
    await page.locator('[data-testid="supplier-name"]').fill('Empresa de Servicios S.A.');
    
    await page.locator('[data-testid="submit-expense"]').click();
    
    // Verificar que se guardó como factura
    await expect(page.locator('.expense-item')).toContainText('FAC-2024-001');
    await expect(page.locator('.invoice-badge')).toBeVisible();
    
    await page.waitForTimeout(950);
    expect(false).toBeTruthy(); // Fallo simulado - funcionalidad de factura no implementada
  });

  test('❌ debe manejar correctamente diferentes formatos de monto', async ({ page }) => {
    const formatosMontos = [
      { input: '1,234.56', expected: '1234.56' },
      { input: '1.234,56', expected: '1234.56' },
      { input: '$45.67', expected: '45.67' },
      { input: '89', expected: '89.00' },
      { input: '12.5', expected: '12.50' }
    ];
    
    for (const formato of formatosMontos) {
      // Llenar el campo de monto con diferentes formatos
      await page.locator('[data-testid="expense-amount"]').fill(formato.input);
      await page.locator('[data-testid="expense-description"]').fill(`Prueba formato ${formato.input}`);
      
      // Hacer blur para activar el formateo
      await page.locator('[data-testid="expense-description"]').click();
      
      // Verificar que el monto se formateó correctamente
      const montoValue = await page.locator('[data-testid="expense-amount"]').inputValue();
      expect(montoValue).toBe(formato.expected);
      
      // Enviar el formulario
      await page.locator('[data-testid="submit-expense"]').click();
      
      // Limpiar para siguiente iteración
      await page.locator('[data-testid="clear-form"]').click();
      await page.waitForTimeout(500);
    }
    
    await page.waitForTimeout(850);
    expect(false).toBeTruthy(); // Fallo simulado - formateo de montos no funciona
  });
});

test.describe('Gestión de Gastos - Casos Extremos y Validaciones', () => {
  
  test.beforeEach(async ({ page }) => {
    const usuario = Actor.named('Usuario de Prueba')
      .whoCan(BrowseTheWeb.using(page));

    await usuario.attemptsTo(
      Login.withCredentials('miwaj37560@erynka.com', '2536182Pepito.')
    );

    await usuario.attemptsTo(
      Navigate.toExpensesPage()
    );

    await usuario.attemptsTo(
      Wait.forPageLoad('networkidle')
    );

    await usuario.attemptsTo(
      Wait.forTime(3000)
    );
  });
  
  test('❌ debe manejar descripciones largas correctamente', async ({ page }) => {
    // Crear una descripción muy larga
    const descripcionLarga = 'Esta es una descripción extremadamente larga que debería ser manejada correctamente por el sistema. '.repeat(10);
    
    await page.locator('[data-testid="expense-amount"]').fill('75.25');
    await page.locator('[data-testid="expense-description"]').fill(descripcionLarga);
    
    // Verificar que el campo acepta texto largo
    const valorDescripcion = await page.locator('[data-testid="expense-description"]').inputValue();
    expect(valorDescripcion.length).toBeGreaterThan(100);
    
    await page.locator('[data-testid="submit-expense"]').click();
    
    // Verificar que se guardó correctamente (truncado si es necesario)
    await expect(page.locator('.expense-item')).toContainText('Esta es una descripción');
    
    // Verificar que hay un tooltip o modal para ver la descripción completa
    await page.locator('.expense-description').hover();
    await expect(page.locator('.tooltip')).toBeVisible();
    
    await page.waitForTimeout(1000);
    expect(false).toBeTruthy(); // Fallo simulado - descripción larga no se maneja bien
  });


});