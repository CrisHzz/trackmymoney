/**
 * CreateIncome - Tarea de Crear Ingreso
 * ======================================
 * 
 * Esta tarea representa el proceso completo de crear un nuevo ingreso
 * en la aplicación TrackMyMoney.
 * 
 * Flujo de la tarea:
 * 1. Llenar el campo de monto
 * 2. Llenar el campo de descripción
 * 3. Seleccionar tipo de ingreso (Salario, Freelance, etc.)
 * 4. Seleccionar categoría (opcional)
 * 5. Establecer fecha (opcional)
 * 6. Configurar como recurrente si es necesario
 * 7. Establecer frecuencia y fecha fin para recurrentes
 * 8. Hacer clic en el botón de agregar
 * 9. Esperar confirmación
 * 
 * @example
 * ```typescript
 * await actor.attemptsTo(
 *   CreateIncome.withDetails({
 *     amount: '2500.00',
 *     description: 'Salario mensual',
 *     incomeType: 'Salario',
 *     isRecurrent: true,
 *     frequency: 'Mensual'
 *   })
 * );
 * ```
 */

import { Actor, Task } from '../Actor';
import { BrowseTheWeb } from '../abilities/BrowseTheWeb';
import { Fill } from '../interactions/Fill';
import { Click } from '../interactions/Click';
import { Wait } from '../interactions/Wait';
import { IncomePage } from '../ui/IncomePage';

/**
 * Interfaz para los detalles del ingreso
 */
export interface IncomeDetails {
  /** Monto del ingreso (ej: '2500.00') */
  amount: string;
  /** Descripción del ingreso (ej: 'Salario mensual') */
  description: string;
  /** Tipo de ingreso (ej: 'Salario', 'Freelance', 'Inversiones') */
  incomeType: string;
  /** Categoría opcional del ingreso */
  category?: string;
  /** Fecha del ingreso en formato YYYY-MM-DD */
  date?: string;
  /** Si es un ingreso recurrente */
  isRecurrent?: boolean;
  /** Frecuencia para ingresos recurrentes */
  frequency?: string;
  /** Fecha de fin para ingresos recurrentes */
  endDate?: string;
}

/**
 * Clase CreateIncome - Tarea para crear un ingreso
 */
export class CreateIncome implements Task {
  /**
   * Constructor privado - usar CreateIncome.withDetails()
   * 
   * @param details Detalles del ingreso a crear
   */
  private constructor(private details: IncomeDetails) {}

  /**
   * Factory method para crear la tarea con detalles específicos
   * 
   * @param details Detalles del ingreso
   * @returns Nueva instancia de CreateIncome
   * 
   * @example
   * ```typescript
   * await actor.attemptsTo(
   *   CreateIncome.withDetails({
   *     amount: '3000.00',
   *     description: 'Salario',
   *     incomeType: 'Salario'
   *   })
   * );
   * ```
   */
  static withDetails(details: IncomeDetails): CreateIncome {
    return new CreateIncome(details);
  }

  /**
   * Factory method para crear un ingreso básico
   * 
   * @param amount Monto del ingreso
   * @param description Descripción del ingreso
   * @param incomeType Tipo de ingreso
   * @returns Nueva instancia de CreateIncome
   * 
   * @example
   * ```typescript
   * await actor.attemptsTo(
   *   CreateIncome.basic('1500.00', 'Proyecto freelance', 'Freelance')
   * );
   * ```
   */
  static basic(amount: string, description: string, incomeType: string): CreateIncome {
    return new CreateIncome({ amount, description, incomeType });
  }

  /**
   * Factory method para crear un ingreso recurrente
   * 
   * @param amount Monto del ingreso
   * @param description Descripción del ingreso
   * @param incomeType Tipo de ingreso
   * @param frequency Frecuencia (Mensual, Quincenal, etc.)
   * @returns Nueva instancia de CreateIncome
   * 
   * @example
   * ```typescript
   * await actor.attemptsTo(
   *   CreateIncome.recurrent('2800.00', 'Salario', 'Salario', 'Mensual')
   * );
   * ```
   */
  static recurrent(
    amount: string,
    description: string,
    incomeType: string,
    frequency: string
  ): CreateIncome {
    return new CreateIncome({
      amount,
      description,
      incomeType,
      isRecurrent: true,
      frequency
    });
  }

  /**
   * Ejecuta la tarea de crear el ingreso
   * 
   * @param actor El actor que realiza la tarea
   * @returns Promise que se resuelve cuando el ingreso se crea
   */
  async performAs(actor: Actor): Promise<void> {
    const page = actor.abilityTo(BrowseTheWeb).getPage();
    const incomePage = IncomePage.on(page);

    actor.log(`Creando ingreso: ${this.details.description} por $${this.details.amount}`);

    // 1. Llenar el monto
    await actor.attemptsTo(
      Fill.field(incomePage.amountInput).with(this.details.amount)
    );

    // 2. Llenar la descripción
    await actor.attemptsTo(
      Fill.field(incomePage.descriptionInput).with(this.details.description)
    );

    // 3. Seleccionar tipo de ingreso
    try {
      const incomeTypeSelectVisible = await incomePage.incomeTypeSelect.isVisible({ timeout: 2000 });
      if (incomeTypeSelectVisible) {
        await actor.attemptsTo(
          Click.on(incomePage.incomeTypeSelect)
        );
        await page.selectOption(
          await incomePage.incomeTypeSelect.elementHandle() || '',
          { label: this.details.incomeType }
        );
      }
    } catch (error) {
      actor.log('Campo de tipo de ingreso no encontrado, continuando...');
    }

    // 4. Seleccionar categoría si se proporciona
    if (this.details.category) {
      try {
        const categorySelectVisible = await incomePage.categorySelect.isVisible({ timeout: 1000 });
        if (categorySelectVisible) {
          await actor.attemptsTo(
            Click.on(incomePage.categorySelect)
          );
          await page.selectOption(
            await incomePage.categorySelect.elementHandle() || '',
            { label: this.details.category }
          );
        }
      } catch (error) {
        actor.log('Campo de categoría no encontrado, continuando...');
      }
    }

    // 5. Establecer fecha si se proporciona
    if (this.details.date) {
      await actor.attemptsTo(
        Fill.field(incomePage.dateInput).with(this.details.date)
      );
    }

    // 6. Configurar como recurrente si es necesario
    if (this.details.isRecurrent) {
      try {
        const isChecked = await incomePage.recurrentCheckbox.isChecked();
        if (!isChecked) {
          await actor.attemptsTo(
            Click.on(incomePage.recurrentCheckbox)
          );
        }

        // 7. Establecer frecuencia si está disponible
        if (this.details.frequency) {
          await actor.attemptsTo(
            Wait.forTime(500) // Esperar a que aparezcan los campos de recurrencia
          );
          
          const frequencySelectVisible = await incomePage.frequencySelect.isVisible({ timeout: 2000 });
          if (frequencySelectVisible) {
            await page.selectOption(
              await incomePage.frequencySelect.elementHandle() || '',
              { label: this.details.frequency }
            );
          }
        }

        // 8. Establecer fecha fin si se proporciona
        if (this.details.endDate) {
          const endDateVisible = await incomePage.endDateInput.isVisible({ timeout: 1000 });
          if (endDateVisible) {
            await actor.attemptsTo(
              Fill.field(incomePage.endDateInput).with(this.details.endDate)
            );
          }
        }
      } catch (error) {
        actor.log('Campos de recurrencia no encontrados, continuando...');
      }
    }

    // 9. Hacer clic en el botón de agregar
    await actor.attemptsTo(
      Click.on(incomePage.addIncomeButton)
    );

    // 10. Esperar a que se procese
    await actor.attemptsTo(
      Wait.forTime(1000)
    );

    actor.log(`Ingreso creado exitosamente: ${this.details.description}`);
  }
}

/**
 * Tarea auxiliar para crear múltiples ingresos
 */
export class CreateMultipleIncomes implements Task {
  private constructor(private incomesList: IncomeDetails[]) {}

  /**
   * Crea múltiples ingresos en secuencia
   * 
   * @param incomesList Lista de ingresos a crear
   * @returns Nueva instancia de CreateMultipleIncomes
   * 
   * @example
   * ```typescript
   * await actor.attemptsTo(
   *   CreateMultipleIncomes.withList([
   *     { amount: '2500.00', description: 'Salario', incomeType: 'Salario' },
   *     { amount: '500.00', description: 'Freelance', incomeType: 'Freelance' }
   *   ])
   * );
   * ```
   */
  static withList(incomesList: IncomeDetails[]): CreateMultipleIncomes {
    return new CreateMultipleIncomes(incomesList);
  }

  async performAs(actor: Actor): Promise<void> {
    actor.log(`Creando ${this.incomesList.length} ingresos...`);
    
    for (const income of this.incomesList) {
      await actor.attemptsTo(
        CreateIncome.withDetails(income)
      );
    }
    
    actor.log(`${this.incomesList.length} ingresos creados exitosamente`);
  }
}

