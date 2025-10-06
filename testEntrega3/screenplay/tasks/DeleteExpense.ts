/**
 * DeleteExpense - Tarea de Eliminar Gasto
 * ========================================
 * 
 * Esta tarea representa el proceso de eliminar un gasto existente
 * de la lista de gastos en TrackMyMoney.
 * 
 * Flujo de la tarea:
 * 1. Localizar el gasto a eliminar
 * 2. Hacer clic en el botón de eliminar
 * 3. Confirmar la eliminación (si es necesario)
 * 4. Esperar a que el gasto desaparezca de la lista
 * 
 * @example
 * ```typescript
 * await actor.attemptsTo(
 *   DeleteExpense.byDescription('Compra de supermercado')
 * );
 * ```
 */

import { Actor, Task } from '../Actor';
import { BrowseTheWeb } from '../abilities/BrowseTheWeb';
import { Click } from '../interactions/Click';
import { Wait } from '../interactions/Wait';
import { ExpensePage } from '../ui/ExpensePage';

/**
 * Clase DeleteExpense - Tarea para eliminar gastos
 */
export class DeleteExpense implements Task {
  /**
   * Constructor privado
   * 
   * @param description Descripción del gasto a eliminar, o 'first' para el primero
   */
  private constructor(private description: string | 'first') {}

  /**
   * Elimina un gasto por su descripción
   * 
   * @param description Descripción del gasto a eliminar
   * @returns Nueva instancia de DeleteExpense
   * 
   * @example
   * ```typescript
   * await actor.attemptsTo(
   *   DeleteExpense.byDescription('Cena en restaurante')
   * );
   * ```
   */
  static byDescription(description: string): DeleteExpense {
    return new DeleteExpense(description);
  }

  /**
   * Elimina el primer gasto de la lista
   * 
   * @returns Nueva instancia de DeleteExpense
   * 
   * @example
   * ```typescript
   * await actor.attemptsTo(
   *   DeleteExpense.theFirstOne()
   * );
   * ```
   */
  static theFirstOne(): DeleteExpense {
    return new DeleteExpense('first');
  }

  /**
   * Ejecuta la tarea de eliminar el gasto
   * 
   * @param actor El actor que realiza la tarea
   * @returns Promise que se resuelve cuando el gasto se elimina
   */
  async performAs(actor: Actor): Promise<void> {
    const page = actor.abilityTo(BrowseTheWeb).getPage();
    const expensePage = ExpensePage.on(page);

    if (this.description === 'first') {
      actor.log('Eliminando el primer gasto de la lista...');
      
      // Hacer clic en el botón de eliminar del primer gasto
      await actor.attemptsTo(
        Click.on(expensePage.firstExpenseDeleteButton)
      );
    } else {
      actor.log(`Eliminando gasto: ${this.description}`);
      
      // Localizar el gasto específico por descripción
      const expense = expensePage.expenseByDescription(this.description);
      
      // Esperar a que el gasto sea visible
      await actor.attemptsTo(
        Wait.forElement(expense).toBeVisible()
      );
      
      // Hacer clic en el botón de eliminar dentro de ese gasto
      const deleteButton = expense.locator('button[title="Eliminar gasto"]');
      await actor.attemptsTo(
        Click.on(deleteButton)
      );
    }

    // Esperar a que se procese la eliminación
    await actor.attemptsTo(
      Wait.forTime(1500) // Espera para que se procese y actualice la lista
    );

    actor.log('Gasto eliminado exitosamente');
  }
}

/**
 * Tarea auxiliar para eliminar todos los gastos
 */
export class DeleteAllExpenses implements Task {
  /**
   * Elimina todos los gastos de la lista
   * 
   * @returns Nueva instancia de DeleteAllExpenses
   * 
   * @example
   * ```typescript
   * await actor.attemptsTo(
   *   DeleteAllExpenses.fromList()
   * );
   * ```
   */
  static fromList(): DeleteAllExpenses {
    return new DeleteAllExpenses();
  }

  async performAs(actor: Actor): Promise<void> {
    const page = actor.abilityTo(BrowseTheWeb).getPage();
    const expensePage = ExpensePage.on(page);

    actor.log('Eliminando todos los gastos...');

    let count = await expensePage.getExpensesCount();
    let deleted = 0;

    while (count > 0) {
      // Eliminar el primer gasto de la lista
      await actor.attemptsTo(
        DeleteExpense.theFirstOne()
      );
      
      deleted++;
      
      // Actualizar el contador
      count = await expensePage.getExpensesCount();
      
      // Pequeña espera para evitar condiciones de carrera
      await actor.attemptsTo(
        Wait.forTime(500)
      );
    }

    actor.log(`${deleted} gastos eliminados exitosamente`);
  }
}

