/**
 * Wait - Interacción de Espera
 * =============================
 * 
 * Esta interacción representa diferentes tipos de esperas en las pruebas.
 * Las esperas son cruciales para manejar elementos dinámicos y asíncronos.
 * 
 * Tipos de espera:
 * - Espera por visibilidad de elementos
 * - Espera por tiempo específico
 * - Espera por condiciones personalizadas
 * - Espera por estado de la página
 * 
 * @example
 * ```typescript
 * await actor.attemptsTo(
 *   Wait.forElement(DashboardPage.welcomeMessage).toBeVisible()
 * );
 * ```
 */

import { Locator } from '@playwright/test';
import { Actor, Task } from '../Actor';
import { BrowseTheWeb } from '../abilities/BrowseTheWeb';

/**
 * Clase Wait - Interacción para esperas
 */
export class Wait implements Task {
  private waitType: 'element' | 'time' | 'pageLoad' | 'condition' = 'time';
  private target?: Locator | string;
  private duration: number = 0;
  private state: 'visible' | 'hidden' | 'attached' | 'detached' = 'visible';
  private condition?: () => Promise<boolean>;
  private loadState: 'load' | 'domcontentloaded' | 'networkidle' = 'load';

  private constructor() {}

  /**
   * Espera a que un elemento cumpla una condición
   * 
   * @param target Locator del elemento o selector CSS
   * @returns Nueva instancia de Wait
   * 
   * @example
   * ```typescript
   * await actor.attemptsTo(
   *   Wait.forElement(LoginPage.successMessage).toBeVisible()
   * );
   * ```
   */
  static forElement(target: Locator | string): Wait {
    const wait = new Wait();
    wait.waitType = 'element';
    wait.target = target;
    return wait;
  }

  /**
   * Espera por un tiempo específico en milisegundos
   * 
   * ⚠️ ADVERTENCIA: Usar esperas de tiempo fijo es generalmente una mala práctica.
   * Prefiere Wait.forElement() cuando sea posible.
   * 
   * @param milliseconds Tiempo a esperar en milisegundos
   * @returns Nueva instancia de Wait
   * 
   * @example
   * ```typescript
   * await actor.attemptsTo(
   *   Wait.forTime(1000) // Espera 1 segundo
   * );
   * ```
   */
  static forTime(milliseconds: number): Wait {
    const wait = new Wait();
    wait.waitType = 'time';
    wait.duration = milliseconds;
    return wait;
  }

  /**
   * Espera a que la página cargue completamente
   * 
   * @param state Estado de carga a esperar
   * @returns Nueva instancia de Wait
   * 
   * @example
   * ```typescript
   * await actor.attemptsTo(
   *   Wait.forPageLoad('networkidle')
   * );
   * ```
   */
  static forPageLoad(state: 'load' | 'domcontentloaded' | 'networkidle' = 'load'): Wait {
    const wait = new Wait();
    wait.waitType = 'pageLoad';
    wait.loadState = state;
    return wait;
  }

  /**
   * Espera a que una condición personalizada se cumpla
   * 
   * @param condition Función que retorna una Promise<boolean>
   * @param timeout Tiempo máximo de espera en milisegundos
   * @returns Nueva instancia de Wait
   * 
   * @example
   * ```typescript
   * await actor.attemptsTo(
   *   Wait.until(async () => {
   *     const expenses = await actor.asks(ExpenseList.count());
   *     return expenses > 0;
   *   }, 5000)
   * );
   * ```
   */
  static until(condition: () => Promise<boolean>, timeout: number = 5000): Wait {
    const wait = new Wait();
    wait.waitType = 'condition';
    wait.condition = condition;
    wait.duration = timeout;
    return wait;
  }

  /**
   * Especifica que se debe esperar a que el elemento sea visible
   * 
   * @returns La misma instancia para encadenamiento
   * 
   * @example
   * ```typescript
   * await actor.attemptsTo(
   *   Wait.forElement(DashboardPage.menu).toBeVisible()
   * );
   * ```
   */
  toBeVisible(): this {
    this.state = 'visible';
    return this;
  }

  /**
   * Especifica que se debe esperar a que el elemento esté oculto
   * 
   * @returns La misma instancia para encadenamiento
   * 
   * @example
   * ```typescript
   * await actor.attemptsTo(
   *   Wait.forElement(LoginPage.loadingSpinner).toBeHidden()
   * );
   * ```
   */
  toBeHidden(): this {
    this.state = 'hidden';
    return this;
  }

  /**
   * Especifica que se debe esperar a que el elemento esté en el DOM
   * 
   * @returns La misma instancia para encadenamiento
   * 
   * @example
   * ```typescript
   * await actor.attemptsTo(
   *   Wait.forElement(ExpensePage.expensesList).toBeAttached()
   * );
   * ```
   */
  toBeAttached(): this {
    this.state = 'attached';
    return this;
  }

  /**
   * Especifica que se debe esperar a que el elemento no esté en el DOM
   * 
   * @returns La misma instancia para encadenamiento
   * 
   * @example
   * ```typescript
   * await actor.attemptsTo(
   *   Wait.forElement(ExpensePage.deletedExpense).toBeDetached()
   * );
   * ```
   */
  toBeDetached(): this {
    this.state = 'detached';
    return this;
  }

  /**
   * Ejecuta la espera configurada
   * 
   * @param actor El actor que realiza la espera
   * @returns Promise que se resuelve cuando la espera se completa
   */
  async performAs(actor: Actor): Promise<void> {
    const browser = actor.abilityTo(BrowseTheWeb);
    const page = browser.getPage();

    switch (this.waitType) {
      case 'element':
        if (!this.target) {
          throw new Error('No se especificó un elemento para esperar');
        }
        const locator = typeof this.target === 'string' 
          ? page.locator(this.target) 
          : this.target;
        
        await locator.waitFor({ state: this.state });
        break;

      case 'time':
        await page.waitForTimeout(this.duration);
        break;

      case 'pageLoad':
        await browser.waitForPageLoad(this.loadState);
        break;

      case 'condition':
        if (!this.condition) {
          throw new Error('No se especificó una condición para esperar');
        }
        const startTime = Date.now();
        while (Date.now() - startTime < this.duration) {
          if (await this.condition()) {
            return;
          }
          await page.waitForTimeout(100); // Check cada 100ms
        }
        throw new Error(`La condición no se cumplió en ${this.duration}ms`);
    }
  }
}

/**
 * Clase WaitForTimeout - Espera simple por tiempo
 * 
 * Forma abreviada para esperas de tiempo
 */
export class WaitForTimeout implements Task {
  private constructor(private milliseconds: number) {}

  /**
   * Espera por un tiempo específico
   * 
   * @param milliseconds Tiempo a esperar en milisegundos
   * @returns Nueva instancia de WaitForTimeout
   * 
   * @example
   * ```typescript
   * await actor.attemptsTo(
   *   WaitForTimeout.of(2000)
   * );
   * ```
   */
  static of(milliseconds: number): WaitForTimeout {
    return new WaitForTimeout(milliseconds);
  }

  async performAs(actor: Actor): Promise<void> {
    const browser = actor.abilityTo(BrowseTheWeb);
    const page = browser.getPage();
    await page.waitForTimeout(this.milliseconds);
  }
}

