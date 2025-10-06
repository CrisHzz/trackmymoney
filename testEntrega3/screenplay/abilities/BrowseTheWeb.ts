/**
 * BrowseTheWeb - Habilidad de Navegación Web
 * ============================================
 * 
 * Esta habilidad permite al Actor interactuar con un navegador web
 * utilizando Playwright. Es la habilidad más fundamental para pruebas E2E.
 * 
 * Responsabilidades:
 * - Proporcionar acceso a la instancia de Page de Playwright
 * - Encapsular operaciones de navegación básicas
 * - Mantener el estado del navegador para el actor
 * 
 * Esta habilidad NO debe contener lógica de negocio específica de la aplicación.
 * Para eso, usa Tasks e Interactions.
 * 
 * @example
 * ```typescript
 * const usuario = Actor.named("Pedro")
 *   .whoCan(BrowseTheWeb.using(page));
 * 
 * // Luego, las Tasks pueden acceder a la página:
 * const browser = usuario.abilityTo(BrowseTheWeb);
 * const page = browser.getPage();
 * ```
 */

import { Page, Browser, BrowserContext } from '@playwright/test';
import { Ability } from '../Actor';

/**
 * Clase BrowseTheWeb - Habilidad para navegar en un navegador web
 */
export class BrowseTheWeb implements Ability {
  /**
   * Constructor privado - usar BrowseTheWeb.using() para crear instancias
   * 
   * @param page Instancia de Page de Playwright
   */
  private constructor(private page: Page) {}

  /**
   * Factory method para crear la habilidad con una página de Playwright
   * 
   * @param page Instancia de Page de Playwright
   * @returns Nueva instancia de BrowseTheWeb
   * 
   * @example
   * ```typescript
   * import { test } from '@playwright/test';
   * 
   * test('mi prueba', async ({ page }) => {
   *   const usuario = Actor.named("Usuario")
   *     .whoCan(BrowseTheWeb.using(page));
   * });
   * ```
   */
  static using(page: Page): BrowseTheWeb {
    return new BrowseTheWeb(page);
  }

  /**
   * Obtiene la instancia de Page de Playwright
   * 
   * Esta es la forma principal de acceder al navegador desde Tasks e Interactions
   * 
   * @returns Instancia de Page de Playwright
   * 
   * @example
   * ```typescript
   * const browser = actor.abilityTo(BrowseTheWeb);
   * const page = browser.getPage();
   * await page.goto('/dashboard');
   * ```
   */
  getPage(): Page {
    return this.page;
  }

  /**
   * Obtiene el contexto del navegador
   * 
   * Útil para operaciones avanzadas como manejo de cookies, localStorage, etc.
   * 
   * @returns BrowserContext de Playwright
   * 
   * @example
   * ```typescript
   * const browser = actor.abilityTo(BrowseTheWeb);
   * const context = browser.getContext();
   * await context.clearCookies();
   * ```
   */
  getContext(): BrowserContext {
    return this.page.context();
  }

  /**
   * Obtiene la instancia del navegador
   * 
   * @returns Browser de Playwright o null si no está disponible
   */
  getBrowser(): Browser | null {
    return this.page.context().browser();
  }

  /**
   * Navega a una URL específica
   * 
   * Método de conveniencia para navegación básica
   * 
   * @param url URL a la que navegar (puede ser relativa o absoluta)
   * @param options Opciones de navegación de Playwright
   * @returns Promise que se resuelve cuando la navegación se completa
   * 
   * @example
   * ```typescript
   * const browser = actor.abilityTo(BrowseTheWeb);
   * await browser.navigateTo('/login');
   * await browser.navigateTo('https://example.com');
   * ```
   */
  async navigateTo(url: string, options?: Parameters<Page['goto']>[1]): Promise<void> {
    await this.page.goto(url, options);
  }

  /**
   * Espera a que la página esté completamente cargada
   * 
   * @param state Estado de carga: 'load', 'domcontentloaded', 'networkidle'
   * @returns Promise que se resuelve cuando se alcanza el estado
   * 
   * @example
   * ```typescript
   * const browser = actor.abilityTo(BrowseTheWeb);
   * await browser.waitForPageLoad('networkidle');
   * ```
   */
  async waitForPageLoad(state: 'load' | 'domcontentloaded' | 'networkidle' = 'load'): Promise<void> {
    await this.page.waitForLoadState(state);
  }

  /**
   * Toma una captura de pantalla
   * 
   * Útil para debugging y evidencia visual de pruebas
   * 
   * @param options Opciones de screenshot de Playwright
   * @returns Promise con el buffer de la imagen
   * 
   * @example
   * ```typescript
   * const browser = actor.abilityTo(BrowseTheWeb);
   * await browser.takeScreenshot({ 
   *   path: 'screenshot.png',
   *   fullPage: true 
   * });
   * ```
   */
  async takeScreenshot(options?: Parameters<Page['screenshot']>[0]): Promise<Buffer> {
    return await this.page.screenshot(options);
  }

  /**
   * Obtiene el título de la página actual
   * 
   * @returns Promise con el título de la página
   * 
   * @example
   * ```typescript
   * const browser = actor.abilityTo(BrowseTheWeb);
   * const title = await browser.getPageTitle();
   * expect(title).toContain('Dashboard');
   * ```
   */
  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Obtiene la URL actual de la página
   * 
   * @returns URL actual
   * 
   * @example
   * ```typescript
   * const browser = actor.abilityTo(BrowseTheWeb);
   * const url = browser.getCurrentUrl();
   * expect(url).toContain('/dashboard');
   * ```
   */
  getCurrentUrl(): string {
    return this.page.url();
  }

  /**
   * Ejecuta JavaScript en el contexto de la página
   * 
   * Útil para operaciones avanzadas o acceso a APIs del navegador
   * 
   * @param script Script de JavaScript a ejecutar
   * @param args Argumentos para el script
   * @returns Promise con el resultado de la ejecución
   * 
   * @example
   * ```typescript
   * const browser = actor.abilityTo(BrowseTheWeb);
   * const result = await browser.executeScript(() => {
   *   return window.localStorage.getItem('token');
   * });
   * ```
   */
  async executeScript<R, A extends any[]>(
    script: ((...args: A) => R) | string,
    ...args: A
  ): Promise<R> {
    return await this.page.evaluate(script, ...args);
  }

  /**
   * Limpia el localStorage del navegador
   * 
   * Útil para limpiar el estado entre pruebas
   * 
   * @example
   * ```typescript
   * const browser = actor.abilityTo(BrowseTheWeb);
   * await browser.clearLocalStorage();
   * ```
   */
  async clearLocalStorage(): Promise<void> {
    await this.page.evaluate(() => localStorage.clear());
  }

  /**
   * Limpia las cookies del navegador
   * 
   * @example
   * ```typescript
   * const browser = actor.abilityTo(BrowseTheWeb);
   * await browser.clearCookies();
   * ```
   */
  async clearCookies(): Promise<void> {
    await this.page.context().clearCookies();
  }

  /**
   * Recarga la página actual
   * 
   * @param options Opciones de recarga
   * @returns Promise que se resuelve cuando la recarga se completa
   * 
   * @example
   * ```typescript
   * const browser = actor.abilityTo(BrowseTheWeb);
   * await browser.reload();
   * ```
   */
  async reload(options?: Parameters<Page['reload']>[0]): Promise<void> {
    await this.page.reload(options);
  }

  /**
   * Navega hacia atrás en el historial del navegador
   * 
   * @example
   * ```typescript
   * const browser = actor.abilityTo(BrowseTheWeb);
   * await browser.goBack();
   * ```
   */
  async goBack(): Promise<void> {
    await this.page.goBack();
  }

  /**
   * Navega hacia adelante en el historial del navegador
   * 
   * @example
   * ```typescript
   * const browser = actor.abilityTo(BrowseTheWeb);
   * await browser.goForward();
   * ```
   */
  async goForward(): Promise<void> {
    await this.page.goForward();
  }

  /**
   * Implementación del método as() de la interfaz Ability
   * Permite usar la habilidad de forma fluida
   * 
   * @returns La instancia actual para encadenamiento
   */
  as<T>(this: T): T {
    return this;
  }
}

