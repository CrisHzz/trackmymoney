/**
 * AuthBypass - Bypass de Autenticación para Pruebas
 * ==================================================
 * 
 * Esta tarea proporciona métodos alternativos para bypass de autenticación
 * en entornos de prueba, evitando el proceso completo de login.
 * 
 * IMPORTANTE: Solo usar en entorno de pruebas
 */

import { Actor, Task } from '../Actor';
import { BrowseTheWeb } from '../abilities/BrowseTheWeb';
import { Navigate } from '../interactions/Navigate';
import { Wait } from '../interactions/Wait';

/**
 * Clase AuthBypass - Bypass de autenticación para pruebas
 */
export class AuthBypass implements Task {
  private constructor() {}

  /**
   * Configura un estado de autenticación simulado
   * 
   * @returns Nueva instancia de AuthBypass
   */
  static setupAuthenticatedState(): AuthBypass {
    return new AuthBypass();
  }

  /**
   * Ejecuta el bypass de autenticación
   * 
   * @param actor El actor que realiza el bypass
   * @returns Promise que se resuelve cuando el bypass se completa
   */
  async performAs(actor: Actor): Promise<void> {
    const browser = actor.abilityTo(BrowseTheWeb);
    const page = browser.getPage();

    actor.log('🔓 Configurando bypass de autenticación...');

    try {
      // Navegar a la página principal primero
      await page.goto('http://localhost:3000/');
      
      // Esperar a que la página cargue
      await page.waitForLoadState('networkidle');

      // Método 1: Intentar configurar cookies/localStorage de Clerk
      await page.evaluate(() => {
        // Simular un token de sesión válido (esto es específico de Clerk)
        // En un entorno real, necesitarías un token válido
        const mockSessionToken = 'mock-session-token-for-testing';
        const mockUserId = 'test-user-id';
        
        // Configurar localStorage con datos de sesión 
        localStorage.setItem('clerk-session', mockSessionToken);
        localStorage.setItem('clerk-user-id', mockUserId);
        localStorage.setItem('clerk-authenticated', 'true');
        
        // También intentar con sessionStorage
        sessionStorage.setItem('clerk-session', mockSessionToken);
        sessionStorage.setItem('clerk-user-id', mockUserId);
      });

      // Método 2: Configurar cookies de sesión
      await page.context().addCookies([
        {
          name: '__session',
          value: 'mock-session-for-testing',
          domain: 'localhost',
          path: '/',
          httpOnly: false,
          secure: false,
          sameSite: 'Lax'
        },
        {
          name: 'clerk-session',
          value: 'mock-clerk-session',
          domain: 'localhost', 
          path: '/',
          httpOnly: false,
          secure: false,
          sameSite: 'Lax'
        }
      ]);

      actor.log('✅ Bypass de autenticación configurado');

      // Recargar la página para aplicar los cambios
      await page.reload({ waitUntil: 'networkidle' });
      
      await actor.attemptsTo(
        Wait.forTime(2000)
      );

      const currentUrl = page.url();
      actor.log(`📍 URL después del bypass: ${currentUrl}`);

    } catch (error) {
      actor.log(`❌ Error en bypass de autenticación: ${error.message}`);
      throw error;
    }
  }
}

/**
 * Clase DirectNavigation - Navegación directa sin autenticación
 */
export class DirectNavigation implements Task {
  private constructor(private targetUrl: string) {}

  /**
   * Navega directamente a una URL protegida
   * 
   * @param url URL de destino
   * @returns Nueva instancia de DirectNavigation
   */
  static toProtectedPage(url: string): DirectNavigation {
    return new DirectNavigation(url);
  }

  /**
   * Navega directamente a la página de gastos
   * 
   * @returns Nueva instancia de DirectNavigation
   */
  static toExpensesPage(): DirectNavigation {
    return new DirectNavigation('http://localhost:3000/pages/expenses');
  }

  /**
   * Navega directamente a la página de ingresos
   * 
   * @returns Nueva instancia de DirectNavigation
   */
  static toIncomePage(): DirectNavigation {
    return new DirectNavigation('http://localhost:3000/pages/income');
  }

  /**
   * Ejecuta la navegación directa
   * 
   * @param actor El actor que realiza la navegación
   * @returns Promise que se resuelve cuando la navegación se completa
   */
  async performAs(actor: Actor): Promise<void> {
    const browser = actor.abilityTo(BrowseTheWeb);
    const page = browser.getPage();

    actor.log(`🎯 Navegación directa a: ${this.targetUrl}`);

    try {
      // Intentar navegar directamente
      await page.goto(this.targetUrl, { 
        waitUntil: 'networkidle',
        timeout: 15000 
      });

      const finalUrl = page.url();
      actor.log(`📍 URL final: ${finalUrl}`);

      // Si nos redirigió a sign-in, la autenticación es requerida
      if (finalUrl.includes('/sign-in')) {
        actor.log('🔐 Redirección a login detectada - autenticación requerida');
        throw new Error('Navegación directa falló - se requiere autenticación');
      }

      actor.log('✅ Navegación directa exitosa');

    } catch (error) {
      actor.log(`❌ Error en navegación directa: ${error.message}`);
      throw error;
    }
  }
}
