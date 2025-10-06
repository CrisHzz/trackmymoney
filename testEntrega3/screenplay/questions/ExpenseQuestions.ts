/**
 * ExpenseQuestions - Preguntas sobre Gastos
 * ==========================================
 * 
 * Este archivo contiene preguntas (Questions) que los actores pueden hacer
 * sobre el estado de los gastos en la aplicación.
 * 
 * Las Questions son queries que extraen información de la UI
 * y retornan valores que pueden ser verificados en assertions.
 * 
 * @example
 * ```typescript
 * const count = await actor.asks(ExpenseQuestions.count());
 * expect(count).toBe(5);
 * 
 * const isVisible = await actor.asks(ExpenseQuestions.isVisible('Compra'));
 * expect(isVisible).toBeTruthy();
 * ```
 */

import { Actor, Question } from '../Actor';
import { BrowseTheWeb } from '../abilities/BrowseTheWeb';
import { ExpensePage } from '../ui/ExpensePage';

/**
 * Pregunta: ¿Cuántos gastos hay en la lista?
 */
export class ExpenseCount implements Question<number> {
  /**
   * Obtiene el número de gastos en la lista
   * 
   * @returns Nueva instancia de ExpenseCount
   * 
   * @example
   * ```typescript
   * const count = await actor.asks(ExpenseQuestions.count());
   * expect(count).toBeGreaterThan(0);
   * ```
   */
  static ask(): ExpenseCount {
    return new ExpenseCount();
  }

  async answeredBy(actor: Actor): Promise<number> {
    const page = actor.abilityTo(BrowseTheWeb).getPage();
    const expensePage = ExpensePage.on(page);
    
    const count = await expensePage.getExpensesCount();
    actor.log(`Número de gastos encontrados: ${count}`);
    return count;
  }
}

/**
 * Pregunta: ¿Es visible un gasto específico?
 */
export class IsExpenseVisible implements Question<boolean> {
  private constructor(private description: string) {}

  /**
   * Verifica si un gasto con cierta descripción es visible
   * 
   * @param description Descripción del gasto a buscar
   * @returns Nueva instancia de IsExpenseVisible
   * 
   * @example
   * ```typescript
   * const isVisible = await actor.asks(
   *   ExpenseQuestions.isVisible('Compra de supermercado')
   * );
   * expect(isVisible).toBeTruthy();
   * ```
   */
  static withDescription(description: string): IsExpenseVisible {
    return new IsExpenseVisible(description);
  }

  async answeredBy(actor: Actor): Promise<boolean> {
    const page = actor.abilityTo(BrowseTheWeb).getPage();
    const expensePage = ExpensePage.on(page);
    
    const isVisible = await expensePage.hasExpense(this.description);
    actor.log(`¿Gasto '${this.description}' visible? ${isVisible}`);
    return isVisible;
  }
}

/**
 * Pregunta: ¿Cuál es el monto total gastado?
 */
export class TotalExpensesAmount implements Question<number> {
  /**
   * Obtiene el monto total de todos los gastos
   * 
   * @returns Nueva instancia de TotalExpensesAmount
   * 
   * @example
   * ```typescript
   * const total = await actor.asks(ExpenseQuestions.totalAmount());
   * expect(total).toBeGreaterThan(0);
   * ```
   */
  static ask(): TotalExpensesAmount {
    return new TotalExpensesAmount();
  }

  async answeredBy(actor: Actor): Promise<number> {
    const page = actor.abilityTo(BrowseTheWeb).getPage();
    const expensePage = ExpensePage.on(page);
    
    try {
      const totalText = await expensePage.totalSpent.textContent();
      
      if (!totalText) return 0;
      
      // Extraer el número del texto "Total gastado: $150.50"
      const match = totalText.match(/\$?([\d,]+\.?\d*)/);
      if (match) {
        const amount = parseFloat(match[1].replace(',', ''));
        actor.log(`Monto total gastado: $${amount}`);
        return amount;
      }
    } catch (error) {
      actor.log('No se pudo obtener el monto total');
    }
    
    return 0;
  }
}

/**
 * Pregunta: ¿Está visible el mensaje de "no hay gastos"?
 */
export class NoExpensesMessageVisible implements Question<boolean> {
  /**
   * Verifica si el mensaje de "no hay gastos" es visible
   * 
   * @returns Nueva instancia de NoExpensesMessageVisible
   * 
   * @example
   * ```typescript
   * const noExpenses = await actor.asks(ExpenseQuestions.noExpensesMessageVisible());
   * expect(noExpenses).toBeFalsy();
   * ```
   */
  static ask(): NoExpensesMessageVisible {
    return new NoExpensesMessageVisible();
  }

  async answeredBy(actor: Actor): Promise<boolean> {
    const page = actor.abilityTo(BrowseTheWeb).getPage();
    const expensePage = ExpensePage.on(page);
    
    try {
      const isVisible = await expensePage.noExpensesMessage.isVisible({ timeout: 2000 });
      actor.log(`¿Mensaje de 'sin gastos' visible? ${isVisible}`);
      return isVisible;
    } catch {
      return false;
    }
  }
}

/**
 * Pregunta: ¿Cuáles son todas las descripciones de gastos?
 */
export class AllExpenseDescriptions implements Question<string[]> {
  /**
   * Obtiene todas las descripciones de gastos visibles
   * 
   * @returns Nueva instancia de AllExpenseDescriptions
   * 
   * @example
   * ```typescript
   * const descriptions = await actor.asks(ExpenseQuestions.allDescriptions());
   * expect(descriptions).toContain('Compra de supermercado');
   * ```
   */
  static ask(): AllExpenseDescriptions {
    return new AllExpenseDescriptions();
  }

  async answeredBy(actor: Actor): Promise<string[]> {
    const page = actor.abilityTo(BrowseTheWeb).getPage();
    const expensePage = ExpensePage.on(page);
    
    const descriptions = await expensePage.getAllExpenseDescriptions();
    actor.log(`Descripciones de gastos: ${descriptions.join(', ')}`);
    return descriptions;
  }
}

/**
 * Clase contenedora con todas las preguntas sobre gastos
 */
export class ExpenseQuestions {
  /**
   * ¿Cuántos gastos hay?
   */
  static count = () => ExpenseCount.ask();

  /**
   * ¿Es visible un gasto específico?
   */
  static isVisible = (description: string) => IsExpenseVisible.withDescription(description);

  /**
   * ¿Cuál es el monto total gastado?
   */
  static totalAmount = () => TotalExpensesAmount.ask();

  /**
   * ¿Está visible el mensaje de "no hay gastos"?
   */
  static noExpensesMessageVisible = () => NoExpensesMessageVisible.ask();

  /**
   * ¿Cuáles son todas las descripciones?
   */
  static allDescriptions = () => AllExpenseDescriptions.ask();
}

