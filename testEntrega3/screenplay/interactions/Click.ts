/**
 * Click - Interacción de Clic
 * ============================
 * 
 * Esta interacción representa la acción de hacer clic en un elemento de la UI.
 * Es una de las interacciones más básicas y comunes en pruebas E2E.
 * 
 * Las Interacciones son acciones de bajo nivel que interactúan directamente
 * con elementos de la UI. Se combinan para formar Tasks de alto nivel.
 * 
 * @example
 * ```typescript
 * await actor.attemptsTo(
 *   Click.on(LoginPage.submitButton)
 * );
 * ```
 */

import { Locator } from '@playwright/test';
import { Actor, Task } from '../Actor';
import { BrowseTheWeb } from '../abilities/BrowseTheWeb';

/**
 * Clase Click - Interacción para hacer clic en elementos
 */
export class Click implements Task {
  /**
   * Constructor privado - usar Click.on() para crear instancias
   * 
   * @param target Locator del elemento o selector CSS
   * @param options Opciones de clic de Playwright
   */
  private constructor(
    private target: Locator | string,
    private options?: Parameters<Locator['click']>[0]
  ) {}

  /**
   * Factory method para crear una interacción de clic
   * 
   * @param target Locator del elemento o selector CSS a hacer clic
   * @param options Opciones adicionales para el clic
   * @returns Nueva instancia de Click
   * 
   * @example
   * ```typescript
   * // Con Locator
   * await actor.attemptsTo(
   *   Click.on(LoginPage.submitButton)
   * );
   * 
   * // Con selector CSS
   * await actor.attemptsTo(
   *   Click.on('button[type="submit"]')
   * );
   * 
   * // Con opciones
   * await actor.attemptsTo(
   *   Click.on(LoginPage.submitButton, { force: true })
   * );
   * ```
   */
  static on(
    target: Locator | string,
    options?: Parameters<Locator['click']>[0]
  ): Click {
    return new Click(target, options);
  }

  /**
   * Hace doble clic en un elemento
   * 
   * @param target Locator del elemento o selector CSS
   * @param options Opciones adicionales para el doble clic
   * @returns Nueva instancia de Click configurada para doble clic
   * 
   * @example
   * ```typescript
   * await actor.attemptsTo(
   *   Click.twice(ExpensePage.expenseItem)
   * );
   * ```
   */
  static twice(
    target: Locator | string,
    options?: Parameters<Locator['dblclick']>[0]
  ): DoubleClick {
    return new DoubleClick(target, options);
  }

  /**
   * Hace clic derecho en un elemento
   * 
   * @param target Locator del elemento o selector CSS
   * @param options Opciones adicionales para el clic derecho
   * @returns Nueva instancia configurada para clic derecho
   * 
   * @example
   * ```typescript
   * await actor.attemptsTo(
   *   Click.rightOn(ExpensePage.expenseItem)
   * );
   * ```
   */
  static rightOn(
    target: Locator | string,
    options?: Parameters<Locator['click']>[0]
  ): Click {
    return new Click(target, { ...options, button: 'right' });
  }

  /**
   * Ejecuta la interacción de clic
   * 
   * @param actor El actor que realiza la interacción
   * @returns Promise que se resuelve cuando el clic se completa
   */
  async performAs(actor: Actor): Promise<void> {
    const page = actor.abilityTo(BrowseTheWeb).getPage();
    const locator = typeof this.target === 'string' 
      ? page.locator(this.target) 
      : this.target;
    
    await locator.click(this.options);
  }
}

/**
 * Clase DoubleClick - Interacción para doble clic
 */
export class DoubleClick implements Task {
  constructor(
    private target: Locator | string,
    private options?: Parameters<Locator['dblclick']>[0]
  ) {}

  async performAs(actor: Actor): Promise<void> {
    const page = actor.abilityTo(BrowseTheWeb).getPage();
    const locator = typeof this.target === 'string' 
      ? page.locator(this.target) 
      : this.target;
    
    await locator.dblclick(this.options);
  }
}

