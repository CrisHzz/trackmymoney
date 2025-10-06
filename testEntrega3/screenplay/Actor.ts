/**
 * Actor - Patrón Screenplay
 * ==========================
 * 
 * La clase Actor representa a un usuario del sistema que realiza acciones
 * en la aplicación. Es el núcleo del patrón Screenplay.
 * 
 * Principios del Patrón Screenplay:
 * - Los actores tienen HABILIDADES (Abilities) que les permiten interactuar
 * - Los actores realizan TAREAS (Tasks) de alto nivel
 * - Los actores verifican información haciendo PREGUNTAS (Questions)
 * - Los actores NO interactúan directamente con elementos de UI
 * 
 * Ejemplo de uso:
 * ```typescript
 * const usuario = Actor.named("Juan")
 *   .whoCan(BrowseTheWeb.using(page));
 * 
 * await usuario.attemptsTo(
 *   Login.withCredentials("user@example.com", "password")
 * );
 * 
 * await usuario.asks(
 *   IsUserLoggedIn.successfully()
 * );
 * ```
 * 
 * @see https://www.infoq.com/articles/Beyond-Page-Objects-Test-Automation-Serenity-Screenplay/
 */

import { Page } from '@playwright/test';

/**
 * Interfaz para las habilidades (Abilities) que puede tener un Actor
 */
export interface Ability {
  /**
   * Método que permite usar la habilidad
   * @returns La instancia de la habilidad para encadenamiento
   */
  as<T>(this: T): T;
}

/**
 * Interfaz para las tareas (Tasks) que puede realizar un Actor
 */
export interface Task {
  /**
   * Método que ejecuta la tarea
   * @param actor El actor que realiza la tarea
   * @returns Promise que se resuelve cuando la tarea se completa
   */
  performAs(actor: Actor): Promise<void>;
}

/**
 * Interfaz para las preguntas (Questions) que puede hacer un Actor
 */
export interface Question<T> {
  /**
   * Método que responde la pregunta
   * @param actor El actor que hace la pregunta
   * @returns Promise con la respuesta
   */
  answeredBy(actor: Actor): Promise<T>;
}

/**
 * Clase Actor - Representa a un usuario que interactúa con el sistema
 */
export class Actor {
  private abilities: Map<string, Ability> = new Map();
  
  /**
   * Constructor privado - usar Actor.named() para crear instancias
   * @param name Nombre descriptivo del actor (ej: "Usuario Administrador")
   */
  private constructor(private name: string) {}

  /**
   * Factory method para crear un nuevo actor con un nombre
   * 
   * @param name Nombre descriptivo del actor
   * @returns Nueva instancia de Actor
   * 
   * @example
   * ```typescript
   * const usuario = Actor.named("Juan Pérez");
   * ```
   */
  static named(name: string): Actor {
    return new Actor(name);
  }

  /**
   * Asigna una habilidad al actor
   * 
   * @param abilities Una o más habilidades que el actor puede usar
   * @returns El mismo actor para encadenamiento fluido
   * 
   * @example
   * ```typescript
   * const usuario = Actor.named("María")
   *   .whoCan(
   *     BrowseTheWeb.using(page),
   *     MakeAPIRequests.using(context)
   *   );
   * ```
   */
  whoCan(...abilities: Ability[]): Actor {
    abilities.forEach(ability => {
      const abilityName = ability.constructor.name;
      this.abilities.set(abilityName, ability);
    });
    return this;
  }

  /**
   * Ejecuta una o más tareas en secuencia
   * 
   * @param tasks Una o más tareas a realizar
   * @returns Promise que se resuelve cuando todas las tareas se completan
   * 
   * @example
   * ```typescript
   * await usuario.attemptsTo(
   *   Navigate.toLoginPage(),
   *   Login.withCredentials("user@test.com", "pass123"),
   *   Verify.dashboardIsVisible()
   * );
   * ```
   */
  async attemptsTo(...tasks: Task[]): Promise<void> {
    for (const task of tasks) {
      await task.performAs(this);
    }
  }

  /**
   * Hace una pregunta y obtiene la respuesta
   * 
   * @param question La pregunta a responder
   * @returns Promise con la respuesta
   * 
   * @example
   * ```typescript
   * const isLoggedIn = await usuario.asks(
   *   IsUserLoggedIn.successfully()
   * );
   * expect(isLoggedIn).toBe(true);
   * ```
   */
  async asks<T>(question: Question<T>): Promise<T> {
    return question.answeredBy(this);
  }

  /**
   * Obtiene una habilidad específica del actor
   * 
   * @param abilityType El tipo (clase) de la habilidad
   * @returns La instancia de la habilidad
   * @throws Error si el actor no tiene esa habilidad
   * 
   * @example
   * ```typescript
   * const browseAbility = usuario.abilityTo(BrowseTheWeb);
   * const page = browseAbility.getPage();
   * ```
   */
  abilityTo<T extends Ability>(abilityType: new (...args: any[]) => T): T {
    const abilityName = abilityType.name;
    const ability = this.abilities.get(abilityName);
    
    if (!ability) {
      throw new Error(
        `${this.name} no tiene la habilidad "${abilityName}". ` +
        `Usa .whoCan(${abilityName}.using(...)) para agregarla.`
      );
    }
    
    return ability as T;
  }

  /**
   * Obtiene el nombre del actor
   * 
   * @returns El nombre del actor
   * 
   * @example
   * ```typescript
   * console.log(`El actor ${usuario.getName()} está realizando una acción`);
   * ```
   */
  getName(): string {
    return this.name;
  }

  /**
   * Verifica si el actor tiene una habilidad específica
   * 
   * @param abilityType El tipo (clase) de la habilidad
   * @returns true si el actor tiene la habilidad, false en caso contrario
   * 
   * @example
   * ```typescript
   * if (usuario.hasAbility(BrowseTheWeb)) {
   *   // El actor puede navegar en el navegador
   * }
   * ```
   */
  hasAbility<T extends Ability>(abilityType: new (...args: any[]) => T): boolean {
    return this.abilities.has(abilityType.name);
  }

  /**
   * Método de utilidad para logging y debugging
   * 
   * @param message Mensaje a mostrar
   * 
   * @example
   * ```typescript
   * usuario.log("Iniciando prueba de login");
   * ```
   */
  log(message: string): void {
    console.log(`[${this.name}] ${message}`);
  }
}

/**
 * Exportaciones de tipos útiles
 */
export type { Ability, Task, Question };

