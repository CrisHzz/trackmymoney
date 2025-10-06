/**
 * DashboardPage - Elementos de UI del Dashboard
 * ==============================================
 * 
 * Este archivo define todos los selectores y elementos del dashboard
 * principal de TrackMyMoney.
 * 
 * El dashboard es el punto central de navegación y muestra:
 * - Resumen financiero
 * - Acceso rápido a funcionalidades
 * - Estadísticas y gráficos
 * 
 * @example
 * ```typescript
 * await actor.attemptsTo(
 *   Click.on(DashboardPage.addExpenseButton)
 * );
 * ```
 */

import { Page, Locator } from '@playwright/test';

/**
 * Clase DashboardPage - Selectores del dashboard
 */
export class DashboardPage {
  constructor(private page: Page) {}

  /**
   * ==================
   * ELEMENTOS PRINCIPALES
   * ==================
   */

  /**
   * Título del dashboard
   */
  get title(): Locator {
    return this.page.getByRole('heading', { name: /Dashboard/i });
  }

  /**
   * Mensaje de bienvenida
   */
  get welcomeMessage(): Locator {
    return this.page.getByText(/Bienvenido a tu panel de control/i);
  }

  /**
   * Botón "Ingresar Dinero"
   */
  get addIncomeButton(): Locator {
    return this.page.getByRole('button', { name: /Ingresar Dinero/i });
  }

  /**
   * Botón "Registrar Gasto"
   */
  get addExpenseButton(): Locator {
    return this.page.getByRole('button', { name: /Registrar Gasto/i });
  }

  /**
   * Descripción del dashboard
   */
  get description(): Locator {
    return this.page.getByText(/ver un resumen de tus finanzas/i);
  }

  /**
   * ==================
   * ELEMENTOS DE NAVEGACIÓN
   * ==================
   */

  /**
   * Link o botón hacia estadísticas
   */
  get statsLink(): Locator {
    return this.page.getByRole('link', { name: /Estadísticas|Stats/i });
  }

  /**
   * Link o botón hacia proyecciones
   */
  get projectionsLink(): Locator {
    return this.page.getByRole('link', { name: /Proyecciones/i });
  }

  /**
   * ==================
   * ELEMENTOS DE RESUMEN
   * ==================
   */

  /**
   * Tarjetas de resumen financiero (si existen)
   */
  get summaryCards(): Locator {
    return this.page.locator('.bg-white\\/10.backdrop-blur-md');
  }

  /**
   * Balance total (si existe en el dashboard)
   */
  get totalBalance(): Locator {
    return this.page.locator('.text-3xl.font-bold').first();
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
    return new DashboardPage(page);
  }

  /**
   * Verifica si el dashboard está cargado
   */
  async isLoaded(): Promise<boolean> {
    try {
      await this.title.waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Verifica si el usuario está autenticado (dashboard visible)
   */
  async isUserLoggedIn(): Promise<boolean> {
    return await this.isLoaded();
  }
}

/**
 * Exportación de selectores estáticos
 */
export const DashboardPageSelectors = {
  title: 'h1:has-text("Dashboard")',
  addIncomeButton: 'button:has-text("Ingresar Dinero")',
  addExpenseButton: 'button:has-text("Registrar Gasto")',
  welcomeMessage: 'text=/Bienvenido/',
} as const;

