/**
 * Login - Tarea de Autenticación
 * ===============================
 * 
 * Esta tarea maneja el proceso de login en la aplicación TrackMyMoney
 * utilizando Clerk como proveedor de autenticación.
 * 
 * @example
 * ```typescript
 * await actor.attemptsTo(
 *   Login.withCredentials('test@example.com', 'password123')
 * );
 * ```
 */

import { Actor, Task } from '../Actor';
import { BrowseTheWeb } from '../abilities/BrowseTheWeb';
import { Navigate } from '../interactions/Navigate';
import { Fill } from '../interactions/Fill';
import { Click } from '../interactions/Click';
import { Wait } from '../interactions/Wait';

/**
 * Clase Login - Tarea para autenticación de usuario
 */
export class Login implements Task {
  /**
   * Constructor privado
   * 
   * @param email Email del usuario
   * @param password Contraseña del usuario
   */
  private constructor(
    private email: string,
    private password: string
  ) {}

  /**
   * Realiza login con credenciales específicas
   * 
   * @param email Email del usuario
   * @param password Contraseña del usuario
   * @returns Nueva instancia de Login
   * 
   * @example
   * ```typescript
   * await actor.attemptsTo(
   *   Login.withCredentials('usuario@test.com', 'mipassword')
   * );
   * ```
   */
  static withCredentials(email: string, password: string): Login {
    return new Login(email, password);
  }

  /**
   * Realiza login con credenciales de prueba por defecto
   * 
   * @returns Nueva instancia de Login
   * 
   * @example
   * ```typescript
   * await actor.attemptsTo(
   *   Login.asTestUser()
   * );
   * ```
   */
  static asTestUser(): Login {
    // Credenciales de prueba - deberías configurar estas en variables de entorno
    const testEmail = process.env.TEST_USER_EMAIL || 'test@trackmymoney.com';
    const testPassword = process.env.TEST_USER_PASSWORD || 'TestPassword123!';
    
    return new Login(testEmail, testPassword);
  }

  /**
   * Ejecuta el proceso de login
   * 
   * @param actor El actor que realiza el login
   * @returns Promise que se resuelve cuando el login se completa
   */
  async performAs(actor: Actor): Promise<void> {
    const browser = actor.abilityTo(BrowseTheWeb);
    const page = browser.getPage();

    actor.log(`🔐 Iniciando login con email: ${this.email}`);

    try {
      // Navegar a la página de login
      await actor.attemptsTo(
        Navigate.toLoginPage()
      );

      // Esperar a que la página de login cargue completamente
      await page.waitForLoadState('networkidle', { timeout: 10000 });
      
      // Verificar que estamos en la página de login
      const currentUrl = page.url();
      actor.log(`📍 URL actual después de navegar: ${currentUrl}`);
      
      if (!currentUrl.includes('/sign-in')) {
        throw new Error(`No se pudo navegar a la página de login. URL actual: ${currentUrl}`);
      }

      // Esperar a que Clerk cargue completamente
      await page.waitForTimeout(5000);
      
      actor.log('📝 Buscando campos de login...');

      // Clerk a veces usa selectores muy específicos, vamos a ser más amplios
      // Buscar cualquier input visible que pueda ser email
      const allInputs = await page.locator('input:visible').all();
      actor.log(`🔍 Encontrados ${allInputs.length} inputs visibles`);

      if (allInputs.length < 2) {
        throw new Error(`Solo se encontraron ${allInputs.length} inputs visibles. Se necesitan al menos 2 (email y password)`);
      }

      // Asumir que el primer input es email y el segundo es password
      const emailField = allInputs[0];
      const passwordField = allInputs[1];

      actor.log('📧 Llenando campo de email...');
      await emailField.fill(this.email);
      await page.waitForTimeout(2000);

      actor.log('🔒 Llenando campo de contraseña...');
      await passwordField.fill(this.password);
      await page.waitForTimeout(2000);

      actor.log('🔘 Buscando botón de submit...');

      // Buscar botones visibles
      const allButtons = await page.locator('button:visible').all();
      actor.log(`🔍 Encontrados ${allButtons.length} botones visibles`);

      if (allButtons.length === 0) {
        throw new Error('No se encontraron botones visibles para hacer submit');
      }

      // Buscar el botón que más probablemente sea el de submit
      let submitButton = null;
      
      for (const button of allButtons) {
        const text = await button.textContent().catch(() => '');
        const type = await button.getAttribute('type').catch(() => '');
        
        actor.log(`🔘 Botón encontrado: "${text?.trim()}" (type: ${type})`);
        
        if (type === 'submit' || 
            text?.toLowerCase().includes('continuar') ||
            text?.toLowerCase().includes('continue') ||
            text?.toLowerCase().includes('entrar') ||
            text?.toLowerCase().includes('login')) {
          submitButton = button;
          break;
        }
      }

      // Si no encontramos un botón específico, usar el primero
      if (!submitButton && allButtons.length > 0) {
        submitButton = allButtons[0];
        actor.log('⚠️ Usando el primer botón disponible');
      }

      if (!submitButton) {
        throw new Error('No se pudo identificar un botón de submit');
      }

      actor.log('🔘 Haciendo clic en botón de login...');
      await submitButton.click();

      actor.log('⏳ Esperando que el login se procese...');

      // Esperar a que el login se complete - puede redirigir a dashboard o a la página solicitada
      await page.waitForFunction(
        () => !window.location.href.includes('/sign-in'),
        { timeout: 30000 }
      );

      // Verificar que el login fue exitoso
      const finalUrl = page.url();
      actor.log(`✅ Login exitoso! Redirigido a: ${finalUrl}`);

      // Esperar más tiempo para que la aplicación se estabilice completamente
      await page.waitForTimeout(5000);

    } catch (error) {
      const currentUrl = page.url();
      const pageContent = await page.content().catch(() => 'No se pudo obtener contenido');
      
      actor.log(`❌ Error durante login: ${error.message}`);
      actor.log(`📍 URL al fallar: ${currentUrl}`);
      
      // Intentar capturar mensaje de error específico
      const errorMessages = await page.locator('[role="alert"], .error, .text-red-500, .text-red-600').allTextContents().catch(() => []);
      if (errorMessages.length > 0) {
        actor.log(`🚨 Errores encontrados: ${errorMessages.join(', ')}`);
      }

      throw new Error(`Login falló: ${error.message}. URL: ${currentUrl}`);
    }
  }
}

/**
 * Clase Logout - Tarea para cerrar sesión
 */
export class Logout implements Task {
  /**
   * Cierra la sesión del usuario actual
   * 
   * @returns Nueva instancia de Logout
   * 
   * @example
   * ```typescript
   * await actor.attemptsTo(
   *   Logout.fromApplication()
   * );
   * ```
   */
  static fromApplication(): Logout {
    return new Logout();
  }

  /**
   * Ejecuta el proceso de logout
   * 
   * @param actor El actor que realiza el logout
   * @returns Promise que se resuelve cuando el logout se completa
   */
  async performAs(actor: Actor): Promise<void> {
    const browser = actor.abilityTo(BrowseTheWeb);
    const page = browser.getPage();

    actor.log('Cerrando sesión...');

    // Buscar el botón de logout (puede estar en un menú de usuario)
    const logoutButton = page.getByRole('button', { name: /cerrar sesión|logout|salir/i });
    
    if (await logoutButton.isVisible()) {
      await actor.attemptsTo(
        Click.on(logoutButton)
      );
    } else {
      // Si no hay botón visible, navegar directamente a sign-in
      await actor.attemptsTo(
        Navigate.toLoginPage()
      );
    }

    await actor.attemptsTo(
      Wait.forTime(2000)
    );

    actor.log('Sesión cerrada exitosamente');
  }
}
