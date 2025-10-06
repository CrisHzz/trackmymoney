/**
 * Pruebas E2E - Gestión de Ingresos
 * ===================================
 * 
 * Este archivo contiene las pruebas End-to-End para la funcionalidad
 * de gestión de ingresos en TrackMyMoney utilizando el patrón Screenplay.
 * 
 * Escenarios cubiertos:
 * 1. Crear un ingreso básico
 * 2. Crear múltiples ingresos
 * 3. Crear ingreso con tipo específico
 * 4. Crear ingreso recurrente
 * 5. Verificar diferentes tipos de ingreso
 * 6. Validar campos requeridos
 * 7. Verificar listado de ingresos
 * 
 * @see https://playwright.dev/docs/test-assertions
 */

import { test, expect } from '@playwright/test';
import { Actor } from '../screenplay/Actor';
import { BrowseTheWeb } from '../screenplay/abilities/BrowseTheWeb';
import { Navigate } from '../screenplay/interactions/Navigate';
import { CreateIncome, CreateMultipleIncomes } from '../screenplay/tasks/CreateIncome';
import { PageQuestions } from '../screenplay/questions/PageQuestions';
import { Wait } from '../screenplay/interactions/Wait';
import { Fill } from '../screenplay/interactions/Fill';
import { Click } from '../screenplay/interactions/Click';
import { IncomePage } from '../screenplay/ui/IncomePage';

/**
 * Suite principal: Gestión de Ingresos
 */
test.describe('Gestión de Ingresos - TrackMyMoney', () => {
  
  /**
   * Setup: Navegar a la página de ingresos antes de cada prueba
   */
  test.beforeEach(async ({ page }) => {
    const usuario = Actor.named('Usuario de Prueba')
      .whoCan(BrowseTheWeb.using(page));

    await usuario.attemptsTo(
      Navigate.toIncomePage()
    );

    await usuario.attemptsTo(
      Wait.forPageLoad('networkidle')
    );
  });

  /**
   * Escenario 1: Crear un ingreso básico exitosamente
   * 
   * Given el usuario está en la página de ingresos
   * When el usuario crea un ingreso con los datos básicos
   * Then el ingreso debe aparecer en la lista
   */
  test('debe crear un ingreso básico con monto y descripción', async ({ page }) => {
    const usuario = Actor.named('Usuario de Prueba')
      .whoCan(BrowseTheWeb.using(page));

    const incomePage = IncomePage.on(page);

    // Obtener el número inicial de ingresos
    const ingresosIniciales = await incomePage.getIncomesCount();
    usuario.log(`Ingresos iniciales: ${ingresosIniciales}`);

    // Crear un nuevo ingreso
    await usuario.attemptsTo(
      CreateIncome.basic('2500.00', 'Salario mensual', 'Salario')
    );

    // Esperar a que se actualice la lista
    await usuario.attemptsTo(
      Wait.forTime(2000)
    );

    // Verificar que el ingreso fue creado
    const ingresosFinal = await incomePage.getIncomesCount();
    usuario.log(`Ingresos finales: ${ingresosFinal}`);

    // El número de ingresos debe haber aumentado
    if (ingresosIniciales >= 0) {
      expect(ingresosFinal).toBeGreaterThan(ingresosIniciales);
    }

    // Verificar que el ingreso está visible
    const esVisible = await incomePage.hasIncome('Salario mensual');
    expect(esVisible).toBeTruthy();
  });

  /**
   * Escenario 2: Crear múltiples ingresos en secuencia
   * 
   * Given el usuario está en la página de ingresos
   * When el usuario crea varios ingresos seguidos
   * Then todos los ingresos deben aparecer en la lista
   */
  test('debe crear múltiples ingresos correctamente', async ({ page }) => {
    const usuario = Actor.named('Usuario de Prueba')
      .whoCan(BrowseTheWeb.using(page));

    const incomePage = IncomePage.on(page);
    const ingresosIniciales = await incomePage.getIncomesCount();

    // Crear múltiples ingresos
    await usuario.attemptsTo(
      CreateMultipleIncomes.withList([
        { amount: '3000.00', description: 'Salario principal', incomeType: 'Salario' },
        { amount: '500.00', description: 'Proyecto freelance', incomeType: 'Freelance' },
        { amount: '200.00', description: 'Venta de artículos', incomeType: 'Otro' }
      ])
    );

    await usuario.attemptsTo(
      Wait.forTime(3000)
    );

    // Verificar que los ingresos fueron creados
    const ingresosFinal = await incomePage.getIncomesCount();
    
    if (ingresosIniciales >= 0) {
      expect(ingresosFinal).toBeGreaterThanOrEqual(ingresosIniciales + 3);
    }

    // Verificar que están visibles
    expect(await incomePage.hasIncome('Salario principal')).toBeTruthy();
    expect(await incomePage.hasIncome('Proyecto freelance')).toBeTruthy();
    expect(await incomePage.hasIncome('Venta de artículos')).toBeTruthy();
  });

  /**
   * Escenario 3: Crear ingreso con fecha específica
   * 
   * Given el usuario está en la página de ingresos
   * When el usuario crea un ingreso con una fecha específica
   * Then el ingreso debe crearse correctamente
   */
  test('debe crear ingreso con fecha específica', async ({ page }) => {
    const usuario = Actor.named('Usuario de Prueba')
      .whoCan(BrowseTheWeb.using(page));

    await usuario.attemptsTo(
      CreateIncome.withDetails({
        amount: '1800.00',
        description: 'Pago de contrato',
        incomeType: 'Freelance',
        date: '2025-01-15'
      })
    );

    await usuario.attemptsTo(
      Wait.forTime(2000)
    );

    const incomePage = IncomePage.on(page);
    const esVisible = await incomePage.hasIncome('Pago de contrato');
    expect(esVisible).toBeTruthy();
  });

  /**
   * Escenario 4: Crear ingreso recurrente
   * 
   * Given el usuario está en la página de ingresos
   * When el usuario crea un ingreso marcándolo como recurrente
   * Then el ingreso debe crearse con la configuración de recurrencia
   */
  test('debe crear ingreso recurrente con frecuencia', async ({ page }) => {
    const usuario = Actor.named('Usuario de Prueba')
      .whoCan(BrowseTheWeb.using(page));

    await usuario.attemptsTo(
      CreateIncome.recurrent(
        '2800.00',
        'Salario recurrente',
        'Salario',
        'Mensual'
      )
    );

    await usuario.attemptsTo(
      Wait.forTime(2000)
    );

    const incomePage = IncomePage.on(page);
    const esVisible = await incomePage.hasIncome('Salario recurrente');
    expect(esVisible).toBeTruthy();
  });

  /**
   * Escenario 5: Validar campos requeridos
   * 
   * Given el usuario está en la página de ingresos
   * When el usuario intenta crear un ingreso sin datos requeridos
   * Then debe mostrar error o no permitir la creación
   */
  test('debe validar campos requeridos al crear ingreso', async ({ page }) => {
    const usuario = Actor.named('Usuario de Prueba')
      .whoCan(BrowseTheWeb.using(page));

    const incomePage = IncomePage.on(page);
    const ingresosIniciales = await incomePage.getIncomesCount();

    // Intentar crear ingreso solo con monto (sin descripción ni tipo)
    await usuario.attemptsTo(
      Fill.field(incomePage.amountInput).with('1000.00')
    );

    await usuario.attemptsTo(
      Click.on(incomePage.addIncomeButton)
    );

    await usuario.attemptsTo(
      Wait.forTime(1000)
    );

    // El número de ingresos no debe cambiar
    const ingresosFinal = await incomePage.getIncomesCount();
    if (ingresosIniciales >= 0) {
      expect(ingresosFinal).toBe(ingresosIniciales);
    }
  });

  /**
   * Escenario 6: Crear ingresos con diferentes tipos
   * 
   * Given el usuario está en la página de ingresos
   * When el usuario crea ingresos de diferentes tipos
   * Then todos deben crearse correctamente
   */
  test('debe permitir crear ingresos de diferentes tipos', async ({ page }) => {
    const usuario = Actor.named('Usuario de Prueba')
      .whoCan(BrowseTheWeb.using(page));

    const tiposIngreso = [
      { amount: '3000.00', description: 'Ingreso tipo Salario', incomeType: 'Salario' },
      { amount: '800.00', description: 'Ingreso tipo Freelance', incomeType: 'Freelance' },
      { amount: '150.00', description: 'Ingreso tipo Inversión', incomeType: 'Inversiones' }
    ];

    for (const ingreso of tiposIngreso) {
      await usuario.attemptsTo(
        CreateIncome.withDetails(ingreso)
      );
      await usuario.attemptsTo(Wait.forTime(1500));
    }

    await usuario.attemptsTo(
      Wait.forTime(2000)
    );

    // Verificar que todos se crearon
    const incomePage = IncomePage.on(page);
    for (const ingreso of tiposIngreso) {
      const esVisible = await incomePage.hasIncome(ingreso.description);
      expect(esVisible).toBeTruthy();
    }
  });

  /**
   * Escenario 7: Verificar que la página se carga correctamente
   * 
   * Given el usuario navega a la página de ingresos
   * Then debe ver el formulario de ingresos y los elementos principales
   */
  test('debe cargar la página de ingresos con todos los elementos', async ({ page }) => {
    const usuario = Actor.named('Usuario de Prueba')
      .whoCan(BrowseTheWeb.using(page));

    // Verificar que la página está cargada
    const estaCargada = await usuario.asks(
      PageQuestions.isIncomePageLoaded()
    );
    expect(estaCargada).toBeTruthy();

    // Verificar que los elementos del formulario están presentes
    const incomePage = IncomePage.on(page);
    
    expect(await incomePage.amountInput.isVisible()).toBeTruthy();
    expect(await incomePage.descriptionInput.isVisible()).toBeTruthy();
    expect(await incomePage.addIncomeButton.isVisible()).toBeTruthy();
  });

  /**
   * Escenario 8: Crear ingreso con monto decimal
   * 
   * Given el usuario está en la página de ingresos
   * When el usuario crea un ingreso con decimales
   * Then debe crearse correctamente con el formato adecuado
   */
  test('debe manejar correctamente montos con decimales', async ({ page }) => {
    const usuario = Actor.named('Usuario de Prueba')
      .whoCan(BrowseTheWeb.using(page));

    const ingresosConDecimales = [
      { amount: '2500.50', description: 'Ingreso con 50 centavos', incomeType: 'Salario' },
      { amount: '1999.99', description: 'Ingreso con 99 centavos', incomeType: 'Freelance' },
      { amount: '500.05', description: 'Ingreso con 5 centavos', incomeType: 'Otro' }
    ];

    for (const ingreso of ingresosConDecimales) {
      await usuario.attemptsTo(
        CreateIncome.withDetails(ingreso)
      );
      await usuario.attemptsTo(Wait.forTime(1000));
    }

    await usuario.attemptsTo(
      Wait.forTime(2000)
    );

    // Verificar que todos se crearon
    const descriptions = await IncomePage.on(page).getAllIncomeDescriptions();
    
    for (const ingreso of ingresosConDecimales) {
      expect(descriptions).toContain(ingreso.description);
    }
  });

  /**
   * Escenario 9: Verificar URL de la página
   * 
   * Given el usuario está en la página de ingresos
   * Then la URL debe contener "/income"
   */
  test('debe tener la URL correcta de ingresos', async ({ page }) => {
    const usuario = Actor.named('Usuario de Prueba')
      .whoCan(BrowseTheWeb.using(page));

    const url = await usuario.asks(PageQuestions.currentUrl());
    expect(url).toContain('/income');
  });
});

/**
 * Suite adicional: Casos extremos de ingresos
 */
test.describe('Gestión de Ingresos - Casos Extremos', () => {
  
  test.beforeEach(async ({ page }) => {
    const usuario = Actor.named('Usuario de Prueba')
      .whoCan(BrowseTheWeb.using(page));

    await usuario.attemptsTo(
      Navigate.toIncomePage()
    );

    await usuario.attemptsTo(
      Wait.forPageLoad('networkidle')
    );
  });

  /**
   * Caso extremo: Crear ingreso con monto muy grande
   */
  test('debe manejar montos grandes correctamente', async ({ page }) => {
    const usuario = Actor.named('Usuario de Prueba')
      .whoCan(BrowseTheWeb.using(page));

    await usuario.attemptsTo(
      CreateIncome.basic('99999.99', 'Ingreso con monto grande', 'Salario')
    );

    await usuario.attemptsTo(
      Wait.forTime(2000)
    );

    const incomePage = IncomePage.on(page);
    const esVisible = await incomePage.hasIncome('Ingreso con monto grande');
    expect(esVisible).toBeTruthy();
  });

  /**
   * Caso extremo: Crear ingreso con descripción larga
   */
  test('debe manejar descripciones largas correctamente', async ({ page }) => {
    const usuario = Actor.named('Usuario de Prueba')
      .whoCan(BrowseTheWeb.using(page));

    const descripcionLarga = 'Este es un ingreso con una descripción muy larga para probar el manejo de textos extensos en la aplicación de gestión financiera';

    await usuario.attemptsTo(
      CreateIncome.basic('1500.00', descripcionLarga, 'Freelance')
    );

    await usuario.attemptsTo(
      Wait.forTime(2000)
    );

    const descriptions = await IncomePage.on(page).getAllIncomeDescriptions();
    const contieneDescripcion = descriptions.some(desc => 
      desc.includes('descripción muy larga')
    );
    
    expect(contieneDescripcion).toBeTruthy();
  });
});

