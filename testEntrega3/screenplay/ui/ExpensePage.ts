/**
 * ExpensePage - Elementos de UI de la Página de Gastos
 * ======================================================
 * 
 * Este archivo define todos los selectores y elementos de la página de
 * gestión de gastos de TrackMyMoney.
 * 
 * Funcionalidades cubiertas:
 * - Formulario de creación de gastos
 * - Lista de gastos existentes
 * - Acciones sobre gastos (editar, eliminar)
 * - Resumen y estadísticas
 * 
 * @example
 * ```typescript
 * await actor.attemptsTo(
 *   Fill.field(ExpensePage.amountInput).with('150.50')
 * );
 * ```
 */

import { Page, Locator } from '@playwright/test';

/**
 * Clase ExpensePage - Selectores de la página de gastos
 */
export class ExpensePage {
  constructor(private page: Page) {}

  /**
   * ==================
   * ELEMENTOS DEL FORMULARIO
   * ==================
   */

  /**
   * Título de la página "Gestión de Gastos"
   */
  get pageTitle(): Locator {
    return this.page.getByRole('heading', { name: /Gestión de Gastos/i });
  }

  /**
   * Campo de entrada para el monto del gasto
   */
  get amountInput(): Locator {
    return this.page.getByPlaceholder(/Monto/i);
  }

  /**
   * Campo de entrada para la descripción del gasto
   */
  get descriptionInput(): Locator {
    return this.page.getByPlaceholder(/Descripción/i);
  }

  /**
   * Selector de categoría
   */
  get categorySelect(): Locator {
    return this.page.locator('select').filter({ hasText: /categoría/i });
  }

  /**
   * Selector de método de pago
   */
  get paymentMethodSelect(): Locator {
    return this.page.locator('select').filter({ hasText: /Efectivo|Tarjeta/i });
  }

  /**
   * Campo de fecha
   */
  get dateInput(): Locator {
    return this.page.locator('input[type="date"]');
  }

  /**
   * Checkbox "Requiere factura"
   */
  get requiresInvoiceCheckbox(): Locator {
    return this.page.locator('input[type="checkbox"]#factura');
  }

  /**
   * Label del checkbox de factura
   */
  get requiresInvoiceLabel(): Locator {
    return this.page.getByText(/Requiere factura/i);
  }

  /**
   * Botón "Agregar Gasto"
   */
  get addExpenseButton(): Locator {
    return this.page.getByRole('button', { name: /Agregar Gasto/i });
  }

  /**
   * ==================
   * ELEMENTOS DE LA LISTA
   * ==================
   */

  /**
   * Título de la sección de lista "Mis Gastos"
   */
  get expensesListTitle(): Locator {
    return this.page.getByRole('heading', { name: /Mis Gastos/i });
  }

  /**
   * Contenedor de todos los gastos
   */
  get expensesList(): Locator {
    return this.page.locator('.space-y-4 > div.bg-white\\/10');
  }

  /**
   * Primer gasto en la lista
   */
  get firstExpense(): Locator {
    return this.expensesList.first();
  }

  /**
   * Último gasto en la lista
   */
  get lastExpense(): Locator {
    return this.expensesList.last();
  }

  /**
   * Obtiene un gasto específico por su descripción
   * 
   * @param description Descripción del gasto
   * @returns Locator del gasto
   */
  expenseByDescription(description: string): Locator {
    return this.page.locator('.bg-white\\/10', { hasText: description });
  }

  /**
   * Obtiene el monto de un gasto específico
   * 
   * @param description Descripción del gasto
   * @returns Locator del monto
   */
  expenseAmount(description: string): Locator {
    return this.expenseByDescription(description).locator('.text-red-400.font-bold');
  }

  /**
   * Botones de eliminar gasto
   */
  get deleteButtons(): Locator {
    return this.page.locator('button[title="Eliminar gasto"]');
  }

  /**
   * Botón de eliminar del primer gasto
   */
  get firstExpenseDeleteButton(): Locator {
    return this.deleteButtons.first();
  }

  /**
   * Mensaje cuando no hay gastos
   */
  get noExpensesMessage(): Locator {
    return this.page.getByText(/No tienes gastos registrados/i);
  }

  /**
   * ==================
   * ELEMENTOS DE RESUMEN
   * ==================
   */

  /**
   * Sección de resumen financiero
   */
  get summarySection(): Locator {
    return this.page.locator('.bg-red-500\\/20');
  }

  /**
   * Título del resumen
   */
  get summaryTitle(): Locator {
    return this.summarySection.getByText(/Resumen/i);
  }

  /**
   * Total gastado
   */
  get totalSpent(): Locator {
    return this.summarySection.locator('.text-2xl.font-bold');
  }

  /**
   * ==================
   * ELEMENTOS DE NAVEGACIÓN
   * ==================
   */

  /**
   * Spinner de carga
   */
  get loadingSpinner(): Locator {
    return this.page.locator('.animate-spin');
  }

  /**
   * Mensaje de carga
   */
  get loadingMessage(): Locator {
    return this.page.getByText(/Cargando gastos/i);
  }

  /**
   * ==================
   * MÉTODOS AUXILIARES
   * ==================
   */

  /**
   * Método estático para obtener elementos sin instancia
   */
  static on(page: Page) {
    return new ExpensePage(page);
  }

  /**
   * Verifica si la página está cargada
   */
  async isLoaded(): Promise<boolean> {
    try {
      await this.pageTitle.waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Obtiene el número total de gastos en la lista
   */
  async getExpensesCount(): Promise<number> {
    try {
      // Esperar a que la lista esté visible o que aparezca el mensaje de "sin gastos"
      await this.page.waitForSelector('.space-y-4', { timeout: 3000 });
      
      const count = await this.expensesList.count();
      return count;
    } catch {
      // Si no se encuentra la lista, probablemente no hay gastos
      const noExpensesVisible = await this.noExpensesMessage.isVisible().catch(() => false);
      return noExpensesVisible ? 0 : -1;
    }
  }

  /**
   * Obtiene todas las descripciones de gastos visibles
   */
  async getAllExpenseDescriptions(): Promise<string[]> {
    const descriptions: string[] = [];
    const count = await this.getExpensesCount();
    
    for (let i = 0; i < count; i++) {
      const expense = this.expensesList.nth(i);
      const description = await expense.locator('.text-white.font-medium').textContent();
      if (description) {
        descriptions.push(description.trim());
      }
    }
    
    return descriptions;
  }

  /**
   * Verifica si un gasto específico está en la lista
   */
  async hasExpense(description: string): Promise<boolean> {
    const expense = this.expenseByDescription(description);
    return await expense.isVisible().catch(() => false);
  }
}

/**
 * Exportación de selectores estáticos
 */
export const ExpensePageSelectors = {
  pageTitle: 'h1:has-text("Gestión de Gastos")',
  amountInput: 'input[placeholder*="Monto"]',
  descriptionInput: 'input[placeholder*="Descripción"]',
  categorySelect: 'select',
  addButton: 'button:has-text("Agregar Gasto")',
  expensesList: '.space-y-4 > div.bg-white\\/10',
  deleteButton: 'button[title="Eliminar gasto"]',
} as const;

