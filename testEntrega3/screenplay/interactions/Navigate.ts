/**
 * Navigate - Interacción de Navegación
 * =====================================
 * 
 * Esta interacción representa acciones de navegación en la aplicación web.
 * Incluye navegar a URLs, recargar páginas, ir atrás/adelante, etc.
 * 
 * @example
 * ```typescript
 * await actor.attemptsTo(
 *   Navigate.to('/pages/dashboard')
 * );
 * ```
 */

import { Actor, Task } from '../Actor';
import { BrowseTheWeb } from '../abilities/BrowseTheWeb';

/**
 * Clase Navigate - Interacción para navegación web
 */
export class Navigate implements Task {
  /**
   * Constructor privado
   * 
   * @param url URL a la que navegar
   * @param options Opciones de navegación
   */
  private constructor(
    private url: string,
    private options?: Parameters<BrowseTheWeb['navigateTo']>[1]
  ) {}

  /**
   * Navega a una URL específica
   * 
   * @param url URL a la que navegar (puede ser relativa o absoluta)
   * @param options Opciones de navegación de Playwright
   * @returns Nueva instancia de Navigate
   * 
   * @example
   * ```typescript
   * // URL relativa
   * await actor.attemptsTo(
   *   Navigate.to('/pages/expenses')
   * );
   * 
   * // URL absoluta
   * await actor.attemptsTo(
   *   Navigate.to('http://localhost:3000/pages/dashboard')
   * );
   * 
   * // Con opciones
   * await actor.attemptsTo(
   *   Navigate.to('/pages/stats', { waitUntil: 'networkidle' })
   * );
   * ```
   */
  static to(url: string, options?: Parameters<BrowseTheWeb['navigateTo']>[1]): Navigate {
    return new Navigate(url, options);
  }

  /**
   * Navega a la página de inicio
   * 
   * @returns Nueva instancia de Navigate
   * 
   * @example
   * ```typescript
   * await actor.attemptsTo(
   *   Navigate.toHomePage()
   * );
   * ```
   */
  static toHomePage(): Navigate {
    return new Navigate('/');
  }

  /**
   * Navega a la página de login
   * 
   * @returns Nueva instancia de Navigate
   * 
   * @example
   * ```typescript
   * await actor.attemptsTo(
   *   Navigate.toLoginPage()
   * );
   * ```
   */
  static toLoginPage(): Navigate {
    return new Navigate('/pages/sign-in');
  }

  /**
   * Navega a la página de registro
   * 
   * @returns Nueva instancia de Navigate
   * 
   * @example
   * ```typescript
   * await actor.attemptsTo(
   *   Navigate.toSignUpPage()
   * );
   * ```
   */
  static toSignUpPage(): Navigate {
    return new Navigate('/pages/sign-up');
  }

  /**
   * Navega al dashboard
   * 
   * @returns Nueva instancia de Navigate
   * 
   * @example
   * ```typescript
   * await actor.attemptsTo(
   *   Navigate.toDashboard()
   * );
   * ```
   */
  static toDashboard(): Navigate {
    return new Navigate('/pages/dashboard');
  }

  /**
   * Navega a la página de gastos
   * 
   * @returns Nueva instancia de Navigate
   * 
   * @example
   * ```typescript
   * await actor.attemptsTo(
   *   Navigate.toExpensesPage()
   * );
   * ```
   */
  static toExpensesPage(): Navigate {
    return new Navigate('/pages/expenses');
  }

  /**
   * Navega a la página de ingresos
   * 
   * @returns Nueva instancia de Navigate
   * 
   * @example
   * ```typescript
   * await actor.attemptsTo(
   *   Navigate.toIncomePage()
   * );
   * ```
   */
  static toIncomePage(): Navigate {
    return new Navigate('/pages/income');
  }

  /**
   * Ejecuta la navegación
   * 
   * @param actor El actor que realiza la navegación
   * @returns Promise que se resuelve cuando la navegación se completa
   */
  async performAs(actor: Actor): Promise<void> {
    const browser = actor.abilityTo(BrowseTheWeb);
    await browser.navigateTo(this.url, this.options);
  }
}

/**
 * Clase Reload - Interacción para recargar la página
 */
export class Reload implements Task {
  private constructor(
    private options?: Parameters<BrowseTheWeb['reload']>[0]
  ) {}

  /**
   * Recarga la página actual
   * 
   * @param options Opciones de recarga
   * @returns Nueva instancia de Reload
   * 
   * @example
   * ```typescript
   * await actor.attemptsTo(
   *   Reload.page()
   * );
   * ```
   */
  static page(options?: Parameters<BrowseTheWeb['reload']>[0]): Reload {
    return new Reload(options);
  }

  /**
   * Ejecuta la recarga
   * 
   * @param actor El actor que realiza la recarga
   * @returns Promise que se resuelve cuando la recarga se completa
   */
  async performAs(actor: Actor): Promise<void> {
    const browser = actor.abilityTo(BrowseTheWeb);
    await browser.reload(this.options);
  }
}

/**
 * Clase GoBack - Interacción para ir atrás en el historial
 */
export class GoBack implements Task {
  /**
   * Va hacia atrás en el historial del navegador
   * 
   * @returns Nueva instancia de GoBack
   * 
   * @example
   * ```typescript
   * await actor.attemptsTo(
   *   GoBack.inBrowserHistory()
   * );
   * ```
   */
  static inBrowserHistory(): GoBack {
    return new GoBack();
  }

  /**
   * Ejecuta la navegación hacia atrás
   * 
   * @param actor El actor que realiza la acción
   * @returns Promise que se resuelve cuando la navegación se completa
   */
  async performAs(actor: Actor): Promise<void> {
    const browser = actor.abilityTo(BrowseTheWeb);
    await browser.goBack();
  }
}

