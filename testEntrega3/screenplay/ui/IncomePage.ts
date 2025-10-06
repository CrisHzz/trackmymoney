/**
 * IncomePage - Elementos de UI de la Página de Ingresos
 * =======================================================
 * 
 * Este archivo define todos los selectores y elementos de la página de
 * gestión de ingresos de TrackMyMoney.
 * 
 * Funcionalidades cubiertas:
 * - Formulario de creación de ingresos
 * - Lista de ingresos existentes
 * - Configuración de ingresos recurrentes
 * - Acciones sobre ingresos
 * 
 * @example
 * ```typescript
 * await actor.attemptsTo(
 *   Fill.field(IncomePage.amountInput).with('2500.00')
 * );
 * ```
 */

import { Page, Locator } from '@playwright/test';

/**
 * Clase IncomePage - Selectores de la página de ingresos
 */
export class IncomePage {
  constructor(private page: Page) {}

  /**
   * ==================
   * ELEMENTOS DEL FORMULARIO
   * ==================
   */

  /**
   * Título de la página "Gestión de Ingresos"
   */
  get pageTitle(): Locator {
    return this.page.getByRole('heading', { name: /Gestión de Ingresos|Ingresar Dinero/i });
  }

  /**
   * Campo de entrada para el monto del ingreso
   */
  get amountInput(): Locator {
    return this.page.getByPlaceholder(/Monto/i);
  }

  /**
   * Campo de entrada para la descripción del ingreso
   */
  get descriptionInput(): Locator {
    return this.page.getByPlaceholder(/Descripción/i);
  }

  /**
   * Selector de tipo de ingreso (Salario, Freelance, etc.)
   */
  get incomeTypeSelect(): Locator {
    return this.page.locator('select').filter({ hasText: /Salario|Freelance|tipo/i }).or(
      this.page.locator('select[name*="tipo"]')
    );
  }

  /**
   * Selector de categoría
   */
  get categorySelect(): Locator {
    return this.page.locator('select').filter({ hasText: /categoría/i });
  }

  /**
   * Campo de fecha
   */
  get dateInput(): Locator {
    return this.page.locator('input[type="date"]').first();
  }

  /**
   * Checkbox "Ingreso recurrente"
   */
  get recurrentCheckbox(): Locator {
    return this.page.locator('input[type="checkbox"]').filter({ has: this.page.locator('label:has-text("recurrente")') });
  }

  /**
   * Selector de frecuencia (Mensual, Quincenal, etc.)
   * Solo visible cuando el ingreso es recurrente
   */
  get frequencySelect(): Locator {
    return this.page.locator('select').filter({ hasText: /Mensual|Quincenal|frecuencia/i });
  }

  /**
   * Campo de fecha fin (para ingresos recurrentes)
   */
  get endDateInput(): Locator {
    return this.page.locator('input[type="date"]').last();
  }

  /**
   * Botón "Agregar Ingreso"
   */
  get addIncomeButton(): Locator {
    return this.page.getByRole('button', { name: /Agregar Ingreso|Ingresar/i });
  }

  /**
   * ==================
   * ELEMENTOS DE LA LISTA
   * ==================
   */

  /**
   * Título de la sección de lista "Mis Ingresos"
   */
  get incomesListTitle(): Locator {
    return this.page.getByRole('heading', { name: /Mis Ingresos/i });
  }

  /**
   * Contenedor de todos los ingresos
   */
  get incomesList(): Locator {
    return this.page.locator('.space-y-4 > div.bg-white\\/10');
  }

  /**
   * Primer ingreso en la lista
   */
  get firstIncome(): Locator {
    return this.incomesList.first();
  }

  /**
   * Último ingreso en la lista
   */
  get lastIncome(): Locator {
    return this.incomesList.last();
  }

  /**
   * Obtiene un ingreso específico por su descripción
   * 
   * @param description Descripción del ingreso
   * @returns Locator del ingreso
   */
  incomeByDescription(description: string): Locator {
    return this.page.locator('.bg-white\\/10', { hasText: description });
  }

  /**
   * Obtiene el monto de un ingreso específico
   * 
   * @param description Descripción del ingreso
   * @returns Locator del monto
   */
  incomeAmount(description: string): Locator {
    return this.incomeByDescription(description).locator('.text-green-400.font-bold, .text-emerald-400.font-bold');
  }

  /**
   * Botones de eliminar ingreso
   */
  get deleteButtons(): Locator {
    return this.page.locator('button[title="Eliminar ingreso"]');
  }

  /**
   * Botón de eliminar del primer ingreso
   */
  get firstIncomeDeleteButton(): Locator {
    return this.deleteButtons.first();
  }

  /**
   * Mensaje cuando no hay ingresos
   */
  get noIncomesMessage(): Locator {
    return this.page.getByText(/No tienes ingresos registrados/i);
  }

  /**
   * Badges de ingresos recurrentes
   */
  get recurrentBadges(): Locator {
    return this.page.locator('.bg-green-500\\/30, .bg-emerald-500\\/30').filter({ hasText: /recurrente/i });
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
    return this.page.locator('.bg-green-500\\/20, .bg-emerald-500\\/20');
  }

  /**
   * Título del resumen
   */
  get summaryTitle(): Locator {
    return this.summarySection.getByText(/Resumen/i);
  }

  /**
   * Total de ingresos
   */
  get totalIncome(): Locator {
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
    return this.page.getByText(/Cargando ingresos/i);
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
    return new IncomePage(page);
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
   * Obtiene el número total de ingresos en la lista
   */
  async getIncomesCount(): Promise<number> {
    try {
      await this.page.waitForSelector('.space-y-4', { timeout: 3000 });
      const count = await this.incomesList.count();
      return count;
    } catch {
      const noIncomesVisible = await this.noIncomesMessage.isVisible().catch(() => false);
      return noIncomesVisible ? 0 : -1;
    }
  }

  /**
   * Obtiene todas las descripciones de ingresos visibles
   */
  async getAllIncomeDescriptions(): Promise<string[]> {
    const descriptions: string[] = [];
    const count = await this.getIncomesCount();
    
    for (let i = 0; i < count; i++) {
      const income = this.incomesList.nth(i);
      const description = await income.locator('.text-white.font-medium').textContent();
      if (description) {
        descriptions.push(description.trim());
      }
    }
    
    return descriptions;
  }

  /**
   * Verifica si un ingreso específico está en la lista
   */
  async hasIncome(description: string): Promise<boolean> {
    const income = this.incomeByDescription(description);
    return await income.isVisible().catch(() => false);
  }
}

/**
 * Exportación de selectores estáticos
 */
export const IncomePageSelectors = {
  pageTitle: 'h1:has-text("Gestión de Ingresos")',
  amountInput: 'input[placeholder*="Monto"]',
  descriptionInput: 'input[placeholder*="Descripción"]',
  incomeTypeSelect: 'select',
  addButton: 'button:has-text("Agregar Ingreso")',
  incomesList: '.space-y-4 > div.bg-white\\/10',
  deleteButton: 'button[title="Eliminar ingreso"]',
} as const;

