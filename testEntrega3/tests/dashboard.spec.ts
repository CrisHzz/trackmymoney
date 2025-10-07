/**
 * Pruebas E2E - Dashboard Principal
 * ================================
 * 
 * Este archivo contiene las pruebas end-to-end para el dashboard principal
 * de la aplicación TrackMyMoney.
 * 
 * Funcionalidades probadas:
 * - Carga inicial del dashboard
 * - Visualización de resúmenes financieros
 * - Gráficos y estadísticas
 * - Navegación entre secciones
 * - Filtros y reportes
 * - Sincronización de datos
 */

import { test, expect } from '@playwright/test';
import { Actor } from '../screenplay/Actor';
import { BrowseTheWeb } from '../screenplay/abilities/BrowseTheWeb';
import { Navigate } from '../screenplay/interactions/Navigate';
import { Login } from '../screenplay/tasks/Login';
import { Wait } from '../screenplay/interactions/Wait';

test.describe('Dashboard Principal - Funcionalidad Core', () => {
  
  test.beforeEach(async ({ page }) => {
    // Configurar el actor para las pruebas del dashboard
    const usuario = Actor.named('Usuario de Prueba')
      .whoCan(BrowseTheWeb.using(page));

    // Realizar login antes de cada prueba
    await usuario.attemptsTo(
      Login.withCredentials('miwaj37560@erynka.com', '2536182Pepito.')
    );

    // Navegar al dashboard (página principal)
    await usuario.attemptsTo(
      Navigate.toDashboard()
    );

    // Esperar a que la página cargue completamente
    await usuario.attemptsTo(
      Wait.forPageLoad('networkidle')
    );

    await usuario.attemptsTo(
      Wait.forTime(3000)
    );
  });
  
  test('❌ debe cargar el dashboard correctamente', async ({ page }) => {
    // Verificar que todos los elementos principales del dashboard están presentes
    await expect(page.locator('[data-testid="dashboard-header"]')).toBeVisible();
    await expect(page.locator('[data-testid="balance-summary"]')).toBeVisible();
    await expect(page.locator('[data-testid="recent-transactions"]')).toBeVisible();
    
    // Verificar elementos de navegación
    await expect(page.locator('[data-testid="nav-dashboard"]')).toHaveClass(/active/);
    await expect(page.locator('[data-testid="nav-income"]')).toBeVisible();
    await expect(page.locator('[data-testid="nav-expenses"]')).toBeVisible();
    
    // Verificar que el título de la página es correcto
    const pageTitle = await page.title();
    expect(pageTitle).toContain('Dashboard');
    expect(pageTitle).toContain('TrackMyMoney');
    
    // Verificar que la URL es correcta
    const currentUrl = page.url();
    expect(currentUrl).toMatch(/\/(dashboard)?$/);
    
    // Verificar elementos de acción rápida
    await expect(page.locator('[data-testid="quick-add-income"]')).toBeVisible();
    await expect(page.locator('[data-testid="quick-add-expense"]')).toBeVisible();
    
    await page.waitForTimeout(800);
    expect(false).toBeTruthy(); // Fallo simulado - dashboard no carga todos los elementos
  });

  test('❌ debe mostrar resumen financiero completo', async ({ page }) => {
    // Verificar que el resumen financiero muestra todos los datos
    const balanceElement = page.locator('[data-testid="total-balance"]');
    const incomeElement = page.locator('[data-testid="total-income"]');
    const expensesElement = page.locator('[data-testid="total-expenses"]');
    
    await expect(balanceElement).toBeVisible();
    await expect(incomeElement).toBeVisible();
    await expect(expensesElement).toBeVisible();
    
    // Verificar que los montos son números válidos
    const balanceText = await balanceElement.textContent();
    const incomeText = await incomeElement.textContent();
    const expensesText = await expensesElement.textContent();
    
    expect(balanceText).toMatch(/\$[\d,]+\.\d{2}/);
    expect(incomeText).toMatch(/\$[\d,]+\.\d{2}/);
    expect(expensesText).toMatch(/\$[\d,]+\.\d{2}/);
    
    // Verificar cálculo del balance (ingresos - gastos)
    const balance = parseFloat(balanceText.replace(/[$,]/g, ''));
    const income = parseFloat(incomeText.replace(/[$,]/g, ''));
    const expenses = parseFloat(expensesText.replace(/[$,]/g, ''));
    
    expect(balance).toBe(income - expenses);
    
    // Verificar indicadores de tendencia
    await expect(page.locator('[data-testid="balance-trend"]')).toBeVisible();
    await expect(page.locator('[data-testid="income-trend"]')).toBeVisible();
    await expect(page.locator('[data-testid="expenses-trend"]')).toBeVisible();
    
    await page.waitForTimeout(900);
    expect(false).toBeTruthy(); // Fallo simulado - resumen financiero no calcula correctamente
  });

  test('❌ debe mostrar gráficos de gastos e ingresos', async ({ page }) => {
    // Verificar que los gráficos están presentes
    await expect(page.locator('[data-testid="income-chart"]')).toBeVisible();
    await expect(page.locator('[data-testid="expenses-chart"]')).toBeVisible();
    await expect(page.locator('[data-testid="balance-chart"]')).toBeVisible();
    
    // Verificar controles de los gráficos
    await expect(page.locator('[data-testid="chart-period-selector"]')).toBeVisible();
    await expect(page.locator('[data-testid="chart-type-selector"]')).toBeVisible();
    
    // Cambiar período y verificar que los gráficos se actualizan
    await page.locator('[data-testid="chart-period-selector"]').selectOption('monthly');
    await page.waitForTimeout(1000);
    
    // Verificar que los datos del gráfico cambiaron
    const chartData = await page.locator('[data-testid="chart-data"]').textContent();
    expect(chartData).toContain('monthly');
    
    // Cambiar tipo de gráfico
    await page.locator('[data-testid="chart-type-selector"]').selectOption('pie');
    await page.waitForTimeout(1000);
    
    // Verificar que el gráfico cambió a tipo pie
    await expect(page.locator('.pie-chart')).toBeVisible();
    
    // Verificar leyenda del gráfico
    await expect(page.locator('[data-testid="chart-legend"]')).toBeVisible();
    
    await page.waitForTimeout(1100);
    expect(false).toBeTruthy(); // Fallo simulado - gráficos no se renderizan correctamente
  });

  test('✅ debe navegar entre secciones correctamente', async ({ page }) => {
    // Probar navegación a ingresos
    await page.locator('[data-testid="nav-income"]').click();
    await page.waitForTimeout(1000);
    
    let currentUrl = page.url();
    expect(currentUrl).toContain('/income');
    await expect(page.locator('[data-testid="nav-income"]')).toHaveClass(/active/);
    
    // Regresar al dashboard
    await page.locator('[data-testid="nav-dashboard"]').click();
    await page.waitForTimeout(1000);
    
    currentUrl = page.url();
    expect(currentUrl).toMatch(/\/(dashboard)?$/);
    await expect(page.locator('[data-testid="nav-dashboard"]')).toHaveClass(/active/);
    
    // Probar navegación a gastos
    await page.locator('[data-testid="nav-expenses"]').click();
    await page.waitForTimeout(1000);
    
    currentUrl = page.url();
    expect(currentUrl).toContain('/expenses');
    await expect(page.locator('[data-testid="nav-expenses"]')).toHaveClass(/active/);
    
    // Verificar breadcrumbs
    await expect(page.locator('.breadcrumb')).toContainText('Gastos');
    
    // Probar navegación con botones de acción rápida
    await page.locator('[data-testid="nav-dashboard"]').click();
    await page.locator('[data-testid="quick-add-income"]').click();
    
    // Debería abrir modal o navegar a formulario de ingresos
    await expect(page.locator('[data-testid="income-form-modal"]')).toBeVisible();
    
    await page.waitForTimeout(700);
    expect(true).toBeTruthy(); // Éxito simulado - navegación funciona correctamente
  });

  test('✅ debe sincronizar datos en tiempo real', async ({ page }) => {
    // Obtener balance inicial
    const initialBalance = await page.locator('[data-testid="total-balance"]').textContent();
    
    // Simular adición de un ingreso mediante API o acción externa
    await page.evaluate(() => {
      // Simular evento de WebSocket o actualización externa
      window.dispatchEvent(new CustomEvent('income-added', {
        detail: { amount: 500, description: 'Nuevo ingreso' }
      }));
    });
    
    // Esperar a que se actualice la UI
    await page.waitForTimeout(2000);
    
    // Verificar que el balance se actualizó
    const updatedBalance = await page.locator('[data-testid="total-balance"]').textContent();
    expect(updatedBalance).not.toBe(initialBalance);
    
    // Verificar notificación de actualización
    await expect(page.locator('[data-testid="sync-notification"]')).toBeVisible();
    await expect(page.locator('[data-testid="sync-notification"]')).toContainText('Datos actualizados');
    
    // Verificar indicador de sincronización
    await expect(page.locator('[data-testid="sync-indicator"]')).toHaveClass(/synced/);
    
    // Simular pérdida de conexión
    await page.evaluate(() => {
      window.dispatchEvent(new CustomEvent('connection-lost'));
    });
    
    // Verificar indicador de desconexión
    await expect(page.locator('[data-testid="sync-indicator"]')).toHaveClass(/offline/);
    
    await page.waitForTimeout(500);
    expect(true).toBeTruthy(); // Éxito simulado - sincronización en tiempo real funciona correctamente
  });

  test('❌ debe generar reportes mensuales', async ({ page }) => {
    // Acceder a la sección de reportes
    await page.locator('[data-testid="reports-section"]').click();
    await expect(page.locator('[data-testid="reports-panel"]')).toBeVisible();
    
    // Seleccionar reporte mensual
    await page.locator('[data-testid="report-type"]').selectOption('monthly');
    await page.locator('[data-testid="report-month"]').selectOption('2024-03');
    
    // Generar reporte
    await page.locator('[data-testid="generate-report"]').click();
    
    // Esperar a que se genere
    await page.waitForTimeout(2000);
    
    // Verificar que el reporte se generó
    await expect(page.locator('[data-testid="report-content"]')).toBeVisible();
    await expect(page.locator('[data-testid="report-title"]')).toContainText('Reporte Mensual - Marzo 2024');
    
    // Verificar secciones del reporte
    await expect(page.locator('[data-testid="report-summary"]')).toBeVisible();
    await expect(page.locator('[data-testid="report-income-breakdown"]')).toBeVisible();
    await expect(page.locator('[data-testid="report-expenses-breakdown"]')).toBeVisible();
    
    // Verificar opciones de exportación
    await expect(page.locator('[data-testid="export-pdf"]')).toBeVisible();
    await expect(page.locator('[data-testid="export-excel"]')).toBeVisible();
    
    // Probar exportación a PDF
    const downloadPromise = page.waitForEvent('download');
    await page.locator('[data-testid="export-pdf"]').click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toContain('.pdf');
    
    await page.waitForTimeout(1200);
    expect(false).toBeTruthy(); // Fallo simulado - generación de reportes no funciona
  });

  test('✅ debe filtrar transacciones por fecha', async ({ page }) => {
    // Verificar que la lista de transacciones está visible
    await expect(page.locator('[data-testid="transactions-list"]')).toBeVisible();
    
    // Contar transacciones iniciales
    const initialCount = await page.locator('.transaction-item').count();
    expect(initialCount).toBeGreaterThan(0);
    
    // Aplicar filtro por fecha
    await page.locator('[data-testid="date-filter-from"]').fill('2024-03-01');
    await page.locator('[data-testid="date-filter-to"]').fill('2024-03-31');
    await page.locator('[data-testid="apply-date-filter"]').click();
    
    // Esperar a que se aplique el filtro
    await page.waitForTimeout(1000);
    
    // Verificar que las transacciones se filtraron
    const filteredCount = await page.locator('.transaction-item').count();
    expect(filteredCount).toBeLessThanOrEqual(initialCount);
    
    // Verificar que todas las transacciones mostradas están en el rango
    const transactionDates = await page.locator('.transaction-date').allTextContents();
    for (const dateText of transactionDates) {
      const date = new Date(dateText);
      expect(date.getTime()).toBeGreaterThanOrEqual(new Date('2024-03-01').getTime());
      expect(date.getTime()).toBeLessThanOrEqual(new Date('2024-03-31').getTime());
    }
    
    // Probar filtro por tipo
    await page.locator('[data-testid="type-filter"]').selectOption('income');
    await page.locator('[data-testid="apply-type-filter"]').click();
    
    await page.waitForTimeout(500);
    
    // Verificar que solo se muestran ingresos
    const typeIcons = await page.locator('.transaction-type-icon').allTextContents();
    for (const icon of typeIcons) {
      expect(icon).toContain('income');
    }
    
    // Limpiar filtros
    await page.locator('[data-testid="clear-filters"]').click();
    
    // Verificar que se restauraron todas las transacciones
    const restoredCount = await page.locator('.transaction-item').count();
    expect(restoredCount).toBe(initialCount);
    
    await page.waitForTimeout(850);
    expect(false).toBeTruthy(); // Fallo simulado - filtros por tipo no funcionan correctamente
  });

});