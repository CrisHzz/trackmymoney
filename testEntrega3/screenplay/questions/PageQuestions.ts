/**
 * PageQuestions - Preguntas sobre el Estado de las Páginas
 * =========================================================
 * 
 * Este archivo contiene preguntas generales sobre el estado de las páginas,
 * navegación, autenticación y elementos comunes.
 * 
 * @example
 * ```typescript
 * const url = await actor.asks(PageQuestions.currentUrl());
 * expect(url).toContain('/dashboard');
 * 
 * const isOnDashboard = await actor.asks(PageQuestions.isDashboardVisible());
 * expect(isOnDashboard).toBeTruthy();
 * ```
 */

import { Actor, Question } from '../Actor';
import { BrowseTheWeb } from '../abilities/BrowseTheWeb';
import { DashboardPage } from '../ui/DashboardPage';
import { ExpensePage } from '../ui/ExpensePage';
import { IncomePage } from '../ui/IncomePage';
import { HomePage } from '../ui/HomePage';

/**
 * Pregunta: ¿Cuál es la URL actual?
 */
export class CurrentUrl implements Question<string> {
  /**
   * Obtiene la URL actual de la página
   * 
   * @returns Nueva instancia de CurrentUrl
   * 
   * @example
   * ```typescript
   * const url = await actor.asks(PageQuestions.currentUrl());
   * expect(url).toContain('/pages/expenses');
   * ```
   */
  static ask(): CurrentUrl {
    return new CurrentUrl();
  }

  async answeredBy(actor: Actor): Promise<string> {
    const browser = actor.abilityTo(BrowseTheWeb);
    const url = browser.getCurrentUrl();
    actor.log(`URL actual: ${url}`);
    return url;
  }
}

/**
 * Pregunta: ¿Cuál es el título de la página?
 */
export class PageTitle implements Question<string> {
  /**
   * Obtiene el título de la página actual
   * 
   * @returns Nueva instancia de PageTitle
   * 
   * @example
   * ```typescript
   * const title = await actor.asks(PageQuestions.pageTitle());
   * expect(title).toContain('TrackMyMoney');
   * ```
   */
  static ask(): PageTitle {
    return new PageTitle();
  }

  async answeredBy(actor: Actor): Promise<string> {
    const browser = actor.abilityTo(BrowseTheWeb);
    const title = await browser.getPageTitle();
    actor.log(`Título de página: ${title}`);
    return title;
  }
}

/**
 * Pregunta: ¿El dashboard es visible?
 */
export class IsDashboardVisible implements Question<boolean> {
  /**
   * Verifica si el dashboard está visible
   * 
   * @returns Nueva instancia de IsDashboardVisible
   * 
   * @example
   * ```typescript
   * const isVisible = await actor.asks(PageQuestions.isDashboardVisible());
   * expect(isVisible).toBeTruthy();
   * ```
   */
  static ask(): IsDashboardVisible {
    return new IsDashboardVisible();
  }

  async answeredBy(actor: Actor): Promise<boolean> {
    const page = actor.abilityTo(BrowseTheWeb).getPage();
    const dashboardPage = DashboardPage.on(page);
    
    const isVisible = await dashboardPage.isUserLoggedIn();
    actor.log(`¿Dashboard visible? ${isVisible}`);
    return isVisible;
  }
}

/**
 * Pregunta: ¿La página de gastos está cargada?
 */
export class IsExpensePageLoaded implements Question<boolean> {
  /**
   * Verifica si la página de gastos está cargada
   * 
   * @returns Nueva instancia de IsExpensePageLoaded
   * 
   * @example
   * ```typescript
   * const isLoaded = await actor.asks(PageQuestions.isExpensePageLoaded());
   * expect(isLoaded).toBeTruthy();
   * ```
   */
  static ask(): IsExpensePageLoaded {
    return new IsExpensePageLoaded();
  }

  async answeredBy(actor: Actor): Promise<boolean> {
    const page = actor.abilityTo(BrowseTheWeb).getPage();
    const expensePage = ExpensePage.on(page);
    
    const isLoaded = await expensePage.isLoaded();
    actor.log(`¿Página de gastos cargada? ${isLoaded}`);
    return isLoaded;
  }
}

/**
 * Pregunta: ¿La página de ingresos está cargada?
 */
export class IsIncomePageLoaded implements Question<boolean> {
  /**
   * Verifica si la página de ingresos está cargada
   * 
   * @returns Nueva instancia de IsIncomePageLoaded
   * 
   * @example
   * ```typescript
   * const isLoaded = await actor.asks(PageQuestions.isIncomePageLoaded());
   * expect(isLoaded).toBeTruthy();
   * ```
   */
  static ask(): IsIncomePageLoaded {
    return new IsIncomePageLoaded();
  }

  async answeredBy(actor: Actor): Promise<boolean> {
    const page = actor.abilityTo(BrowseTheWeb).getPage();
    const incomePage = IncomePage.on(page);
    
    const isLoaded = await incomePage.isLoaded();
    actor.log(`¿Página de ingresos cargada? ${isLoaded}`);
    return isLoaded;
  }
}

/**
 * Pregunta: ¿La página de inicio está cargada?
 */
export class IsHomePageLoaded implements Question<boolean> {
  /**
   * Verifica si la página de inicio está cargada
   * 
   * @returns Nueva instancia de IsHomePageLoaded
   * 
   * @example
   * ```typescript
   * const isLoaded = await actor.asks(PageQuestions.isHomePageLoaded());
   * expect(isLoaded).toBeTruthy();
   * ```
   */
  static ask(): IsHomePageLoaded {
    return new IsHomePageLoaded();
  }

  async answeredBy(actor: Actor): Promise<boolean> {
    const page = actor.abilityTo(BrowseTheWeb).getPage();
    const homePage = HomePage.on(page);
    
    const isLoaded = await homePage.isLoaded();
    actor.log(`¿Página de inicio cargada? ${isLoaded}`);
    return isLoaded;
  }
}

/**
 * Pregunta: ¿Es visible un elemento específico?
 */
export class IsElementVisible implements Question<boolean> {
  private constructor(private selector: string) {}

  /**
   * Verifica si un elemento con cierto selector es visible
   * 
   * @param selector Selector CSS del elemento
   * @returns Nueva instancia de IsElementVisible
   * 
   * @example
   * ```typescript
   * const isVisible = await actor.asks(
   *   PageQuestions.isElementVisible('button:has-text("Agregar")')
   * );
   * ```
   */
  static withSelector(selector: string): IsElementVisible {
    return new IsElementVisible(selector);
  }

  async answeredBy(actor: Actor): Promise<boolean> {
    const page = actor.abilityTo(BrowseTheWeb).getPage();
    
    try {
      const element = page.locator(this.selector);
      const isVisible = await element.isVisible({ timeout: 2000 });
      actor.log(`¿Elemento '${this.selector}' visible? ${isVisible}`);
      return isVisible;
    } catch {
      return false;
    }
  }
}

/**
 * Pregunta: ¿Contiene texto la página?
 */
export class PageContainsText implements Question<boolean> {
  private constructor(private text: string) {}

  /**
   * Verifica si la página contiene cierto texto
   * 
   * @param text Texto a buscar
   * @returns Nueva instancia de PageContainsText
   * 
   * @example
   * ```typescript
   * const contains = await actor.asks(
   *   PageQuestions.containsText('Gasto creado exitosamente')
   * );
   * ```
   */
  static ask(text: string): PageContainsText {
    return new PageContainsText(text);
  }

  async answeredBy(actor: Actor): Promise<boolean> {
    const page = actor.abilityTo(BrowseTheWeb).getPage();
    
    try {
      const element = page.getByText(this.text);
      const isVisible = await element.isVisible({ timeout: 2000 });
      actor.log(`¿Página contiene texto '${this.text}'? ${isVisible}`);
      return isVisible;
    } catch {
      return false;
    }
  }
}

/**
 * Clase contenedora con todas las preguntas generales sobre páginas
 */
export class PageQuestions {
  /**
   * ¿Cuál es la URL actual?
   */
  static currentUrl = () => CurrentUrl.ask();

  /**
   * ¿Cuál es el título de la página?
   */
  static pageTitle = () => PageTitle.ask();

  /**
   * ¿El dashboard es visible?
   */
  static isDashboardVisible = () => IsDashboardVisible.ask();

  /**
   * ¿La página de gastos está cargada?
   */
  static isExpensePageLoaded = () => IsExpensePageLoaded.ask();

  /**
   * ¿La página de ingresos está cargada?
   */
  static isIncomePageLoaded = () => IsIncomePageLoaded.ask();

  /**
   * ¿La página de inicio está cargada?
   */
  static isHomePageLoaded = () => IsHomePageLoaded.ask();

  /**
   * ¿Es visible un elemento?
   */
  static isElementVisible = (selector: string) => IsElementVisible.withSelector(selector);

  /**
   * ¿Contiene texto la página?
   */
  static containsText = (text: string) => PageContainsText.ask(text);
}

