/**
 * Fill - Interacción de Llenado de Campos
 * =========================================
 * 
 * Esta interacción representa la acción de llenar un campo de texto
 * con un valor específico.
 * 
 * Características:
 * - Limpia el campo antes de escribir (por defecto)
 * - Simula escritura natural con delays opcionales
 * - Soporta campos de texto, textarea, contenteditable, etc.
 * 
 * @example
 * ```typescript
 * await actor.attemptsTo(
 *   Fill.field(LoginPage.emailInput).with('user@example.com')
 * );
 * ```
 */

import { Locator } from '@playwright/test';
import { Actor, Task } from '../Actor';
import { BrowseTheWeb } from '../abilities/BrowseTheWeb';

/**
 * Clase Fill - Interacción para llenar campos de texto
 */
export class Fill implements Task {
  private value: string = '';
  private options?: Parameters<Locator['fill']>[1];

  /**
   * Constructor privado - usar Fill.field() para crear instancias
   * 
   * @param target Locator del campo o selector CSS
   */
  private constructor(private target: Locator | string) {}

  /**
   * Factory method para iniciar la interacción de llenado
   * 
   * @param target Locator del campo o selector CSS
   * @returns Nueva instancia de Fill
   * 
   * @example
   * ```typescript
   * await actor.attemptsTo(
   *   Fill.field(LoginPage.emailInput).with('user@example.com')
   * );
   * ```
   */
  static field(target: Locator | string): Fill {
    return new Fill(target);
  }

  /**
   * Alias más legible de field()
   * 
   * @param target Locator del campo o selector CSS
   * @returns Nueva instancia de Fill
   * 
   * @example
   * ```typescript
   * await actor.attemptsTo(
   *   Fill.in(ExpensePage.amountInput).with('150.50')
   * );
   * ```
   */
  static in(target: Locator | string): Fill {
    return new Fill(target);
  }

  /**
   * Especifica el valor a escribir en el campo
   * 
   * @param value Valor a escribir
   * @param options Opciones adicionales de Playwright
   * @returns La misma instancia para encadenamiento
   * 
   * @example
   * ```typescript
   * await actor.attemptsTo(
   *   Fill.field(LoginPage.passwordInput)
   *     .with('SecurePassword123', { force: true })
   * );
   * ```
   */
  with(value: string, options?: Parameters<Locator['fill']>[1]): this {
    this.value = value;
    this.options = options;
    return this;
  }

  /**
   * Ejecuta la interacción de llenado
   * 
   * @param actor El actor que realiza la interacción
   * @returns Promise que se resuelve cuando el llenado se completa
   */
  async performAs(actor: Actor): Promise<void> {
    const page = actor.abilityTo(BrowseTheWeb).getPage();
    const locator = typeof this.target === 'string' 
      ? page.locator(this.target) 
      : this.target;
    
    await locator.fill(this.value, this.options);
  }
}

/**
 * Clase Type - Interacción para escribir texto caracter por caracter
 * 
 * Similar a Fill, pero simula escritura natural con delays entre caracteres.
 * Útil para campos con validación en tiempo real o autocompletado.
 */
export class Type implements Task {
  private text: string = '';
  private options?: Parameters<Locator['type']>[1];

  private constructor(private target: Locator | string) {}

  /**
   * Factory method para iniciar la interacción de escritura
   * 
   * @param target Locator del campo o selector CSS
   * @returns Nueva instancia de Type
   * 
   * @example
   * ```typescript
   * await actor.attemptsTo(
   *   Type.in(SearchPage.searchInput).theText('gastos mensuales')
   * );
   * ```
   */
  static in(target: Locator | string): Type {
    return new Type(target);
  }

  /**
   * Especifica el texto a escribir caracter por caracter
   * 
   * @param text Texto a escribir
   * @param options Opciones adicionales (incluyendo delay entre caracteres)
   * @returns La misma instancia para encadenamiento
   * 
   * @example
   * ```typescript
   * await actor.attemptsTo(
   *   Type.in(SearchPage.searchInput)
   *     .theText('gastos', { delay: 100 }) // 100ms entre caracteres
   * );
   * ```
   */
  theText(text: string, options?: Parameters<Locator['type']>[1]): this {
    this.text = text;
    this.options = options;
    return this;
  }

  /**
   * Ejecuta la interacción de escritura
   * 
   * @param actor El actor que realiza la interacción
   * @returns Promise que se resuelve cuando la escritura se completa
   */
  async performAs(actor: Actor): Promise<void> {
    const page = actor.abilityTo(BrowseTheWeb).getPage();
    const locator = typeof this.target === 'string' 
      ? page.locator(this.target) 
      : this.target;
    
    // Primero limpiamos el campo
    await locator.clear();
    // Luego escribimos el texto
    await locator.type(this.text, this.options);
  }
}

/**
 * Clase Clear - Interacción para limpiar campos de texto
 */
export class Clear implements Task {
  private constructor(private target: Locator | string) {}

  /**
   * Factory method para limpiar un campo
   * 
   * @param target Locator del campo o selector CSS
   * @returns Nueva instancia de Clear
   * 
   * @example
   * ```typescript
   * await actor.attemptsTo(
   *   Clear.field(ExpensePage.descriptionInput)
   * );
   * ```
   */
  static field(target: Locator | string): Clear {
    return new Clear(target);
  }

  /**
   * Ejecuta la interacción de limpieza
   * 
   * @param actor El actor que realiza la interacción
   * @returns Promise que se resuelve cuando la limpieza se completa
   */
  async performAs(actor: Actor): Promise<void> {
    const page = actor.abilityTo(BrowseTheWeb).getPage();
    const locator = typeof this.target === 'string' 
      ? page.locator(this.target) 
      : this.target;
    
    await locator.clear();
  }
}

