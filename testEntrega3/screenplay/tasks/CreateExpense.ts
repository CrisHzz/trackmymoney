/**
 * CreateExpense - Tarea de Crear Gasto
 * =====================================
 * 
 * Esta tarea representa el proceso completo de crear un nuevo gasto
 * en la aplicación TrackMyMoney.
 * 
 * Las Tasks son acciones de alto nivel que combinan múltiples Interactions
 * para completar un objetivo de negocio específico.
 * 
 * Flujo de la tarea:
 * 1. Llenar el campo de monto
 * 2. Llenar el campo de descripción
 * 3. Seleccionar categoría (opcional)
 * 4. Seleccionar método de pago (opcional)
 * 5. Establecer fecha (opcional)
 * 6. Marcar factura si es necesario
 * 7. Hacer clic en el botón de agregar
 * 8. Esperar confirmación
 * 
 * @example
 * ```typescript
 * await actor.attemptsTo(
 *   CreateExpense.withDetails({
 *     amount: '150.50',
 *     description: 'Compra de supermercado',
 *     category: 'Alimentación',
 *     paymentMethod: 'Tarjeta de Crédito'
 *   })
 * );
 * ```
 */

import { Actor, Task } from '../Actor';
import { BrowseTheWeb } from '../abilities/BrowseTheWeb';
import { Fill } from '../interactions/Fill';
import { Click } from '../interactions/Click';
import { Wait } from '../interactions/Wait';
import { ExpensePage } from '../ui/ExpensePage';

/**
 * Interfaz para los detalles del gasto
 */
export interface ExpenseDetails {
  /** Monto del gasto (ej: '150.50') */
  amount: string;
  /** Descripción del gasto (ej: 'Compra de supermercado') */
  description: string;
  /** Categoría opcional del gasto */
  category?: string;
  /** Método de pago opcional */
  paymentMethod?: string;
  /** Fecha del gasto en formato YYYY-MM-DD */
  date?: string;
  /** Si requiere factura */
  requiresInvoice?: boolean;
}

/**
 * Clase CreateExpense - Tarea para crear un gasto
 */
export class CreateExpense implements Task {
  /**
   * Constructor privado - usar CreateExpense.withDetails()
   * 
   * @param details Detalles del gasto a crear
   */
  private constructor(private details: ExpenseDetails) {}

  /**
   * Factory method para crear la tarea con detalles específicos
   * 
   * @param details Detalles del gasto
   * @returns Nueva instancia de CreateExpense
   * 
   * @example
   * ```typescript
   * await actor.attemptsTo(
   *   CreateExpense.withDetails({
   *     amount: '75.00',
   *     description: 'Cena en restaurante',
   *     paymentMethod: 'Efectivo'
   *   })
   * );
   * ```
   */
  static withDetails(details: ExpenseDetails): CreateExpense {
    return new CreateExpense(details);
  }

  /**
   * Factory method para crear un gasto básico (solo monto y descripción)
   * 
   * @param amount Monto del gasto
   * @param description Descripción del gasto
   * @returns Nueva instancia de CreateExpense
   * 
   * @example
   * ```typescript
   * await actor.attemptsTo(
   *   CreateExpense.basic('100.00', 'Gasolina')
   * );
   * ```
   */
  static basic(amount: string, description: string): CreateExpense {
    return new CreateExpense({ amount, description });
  }

  /**
   * Ejecuta la tarea de crear el gasto
   * 
   * @param actor El actor que realiza la tarea
   * @returns Promise que se resuelve cuando el gasto se crea
   */
  async performAs(actor: Actor): Promise<void> {
    const page = actor.abilityTo(BrowseTheWeb).getPage();
    const expensePage = ExpensePage.on(page);

    actor.log(`Creando gasto: ${this.details.description} por $${this.details.amount}`);

    // 1. Llenar el monto
    await actor.attemptsTo(
      Fill.field(expensePage.amountInput).with(this.details.amount)
    );

    // 2. Llenar la descripción
    await actor.attemptsTo(
      Fill.field(expensePage.descriptionInput).with(this.details.description)
    );

    // 3. Seleccionar categoría si se proporciona
    if (this.details.category) {
      await actor.attemptsTo(
        Click.on(expensePage.categorySelect)
      );
      await page.selectOption(
        await expensePage.categorySelect.elementHandle() || '',
        { label: this.details.category }
      );
    }

    // 4. Seleccionar método de pago si se proporciona
    if (this.details.paymentMethod) {
      await actor.attemptsTo(
        Click.on(expensePage.paymentMethodSelect)
      );
      await page.selectOption(
        await expensePage.paymentMethodSelect.elementHandle() || '',
        { label: this.details.paymentMethod }
      );
    }

    // 5. Establecer fecha si se proporciona
    if (this.details.date) {
      await actor.attemptsTo(
        Fill.field(expensePage.dateInput).with(this.details.date)
      );
    }

    // 6. Marcar checkbox de factura si es necesario
    if (this.details.requiresInvoice) {
      const isChecked = await expensePage.requiresInvoiceCheckbox.isChecked();
      if (!isChecked) {
        await actor.attemptsTo(
          Click.on(expensePage.requiresInvoiceCheckbox)
        );
      }
    }

    // 7. Hacer clic en el botón de agregar
    await actor.attemptsTo(
      Click.on(expensePage.addExpenseButton)
    );

    // 8. Esperar a que se procese (puede haber un mensaje de toast)
    await actor.attemptsTo(
      Wait.forTime(1000) // Pequeña espera para que se procese el gasto
    );

    actor.log(`Gasto creado exitosamente: ${this.details.description}`);
  }
}

/**
 * Tarea auxiliar para crear múltiples gastos
 */
export class CreateMultipleExpenses implements Task {
  private constructor(private expensesList: ExpenseDetails[]) {}

  /**
   * Crea múltiples gastos en secuencia
   * 
   * @param expensesList Lista de gastos a crear
   * @returns Nueva instancia de CreateMultipleExpenses
   * 
   * @example
   * ```typescript
   * await actor.attemptsTo(
   *   CreateMultipleExpenses.withList([
   *     { amount: '50.00', description: 'Almuerzo' },
   *     { amount: '30.00', description: 'Transporte' },
   *     { amount: '120.00', description: 'Compras' }
   *   ])
   * );
   * ```
   */
  static withList(expensesList: ExpenseDetails[]): CreateMultipleExpenses {
    return new CreateMultipleExpenses(expensesList);
  }

  async performAs(actor: Actor): Promise<void> {
    actor.log(`Creando ${this.expensesList.length} gastos...`);
    
    for (const expense of this.expensesList) {
      await actor.attemptsTo(
        CreateExpense.withDetails(expense)
      );
    }
    
    actor.log(`${this.expensesList.length} gastos creados exitosamente`);
  }
}

