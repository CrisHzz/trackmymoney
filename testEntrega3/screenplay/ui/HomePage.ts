/**
 * HomePage - Elementos de UI de la Página de Inicio
 * ==================================================
 * 
 * Este archivo define todos los selectores y elementos de la página de inicio
 * de TrackMyMoney. Siguiendo el patrón Screenplay, estos elementos se usan
 * en Interactions y Tasks, no directamente en las pruebas.
 * 
 * Los selectores están organizados por área funcional y utilizan
 * data-testid cuando está disponible, o selectores CSS robustos.
 * 
 * @example
 * ```typescript
 * await actor.attemptsTo(
 *   Click.on(HomePage.loginButton)
 * );
 * ```
 */

import { Page, Locator } from '@playwright/test';

/**
 * Clase HomePage - Selectores de la página de inicio
 */
export class HomePage {
  /**
   * Constructor
   * 
   * @param page Instancia de Page de Playwright
   */
  constructor(private page: Page) {}

  /**
   * Título principal de la aplicación "Track My Money"
   */
  get title(): Locator {
    return this.page.getByRole('heading', { name: /Track My Money/i });
  }

  /**
   * Descripción de bienvenida
   */
  get welcomeDescription(): Locator {
    return this.page.getByText(/El espacio donde le tendrás rastreo a tu dinero/i);
  }

  /**
   * Botón "Iniciar Sesión"
   */
  get loginButton(): Locator {
    return this.page.getByRole('button', { name: /Iniciar Sesión/i });
  }

  /**
   * Botón "Registrarse"
   */
  get signUpButton(): Locator {
    return this.page.getByRole('button', { name: /Registrarse/i });
  }

  /**
   * Link "¿Aún no tienes cuenta? ¡Crea una ya mismo!"
   */
  get createAccountLink(): Locator {
    return this.page.getByRole('link', { name: /Aún no tienes cuenta/i });
  }

  /**
   * Fecha actual mostrada en la página
   */
  get currentDate(): Locator {
    return this.page.locator('text=/\\w+, \\d+ de \\w+ de \\d{4}/');
  }

  /**
   * Contenedor principal de la página
   */
  get mainContainer(): Locator {
    return this.page.locator('.min-h-screen');
  }

  /**
   * Iconos de características (Ahorra más, Ayuda de IA)
   */
  get features(): Locator {
    return this.page.locator('.flex.items-center.gap-2.bg-white\\/10');
  }

  /**
   * Método estático para obtener elementos sin instancia
   * Útil para uso directo en Tasks
   */
  static on(page: Page) {
    return new HomePage(page);
  }

  /**
   * Verifica si la página está cargada completamente
   */
  async isLoaded(): Promise<boolean> {
    try {
      await this.title.waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }
}

/**
 * Exportación de selectores estáticos para uso directo
 */
export const HomePageSelectors = {
  title: 'h1:has-text("Track My Money")',
  loginButton: 'button:has-text("Iniciar Sesión")',
  signUpButton: 'button:has-text("Registrarse")',
  createAccountLink: 'a:has-text("Aún no tienes cuenta")',
} as const;

