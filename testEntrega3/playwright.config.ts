/**
 * Configuración de Playwright para Pruebas E2E con Patrón Screenplay
 * ===================================================================
 * 
 * Este archivo configura Playwright para ejecutar pruebas End-to-End
 * siguiendo el patrón Screenplay en la aplicación TrackMyMoney.
 * 
 * Características principales:
 * - Pruebas en múltiples navegadores (Chromium, Firefox, WebKit)
 * - Screenshots y videos en caso de fallo
 * - Reportes HTML detallados
 * - Reintentos automáticos en caso de fallos
 * - Ejecución paralela de pruebas
 * 
 * @see https://playwright.dev/docs/test-configuration
 */

import { defineConfig, devices } from '@playwright/test';

/**
 * Variables de entorno para la configuración
 */
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const CI = !!process.env.CI;

export default defineConfig({
  /**
   * Directorio donde se encuentran las pruebas E2E
   */
  testDir: './tests',

  /**
   * Timeout global para cada prueba (30 segundos)
   * Esto incluye el tiempo de setup, ejecución y teardown
   */
  timeout: 30 * 1000,

  /**
   * Timeout para cada assertion individual (5 segundos)
   */
  expect: {
    timeout: 5000
  },

  /**
   * Configuración de reportes y comportamiento de pruebas
   */
  
  // Ejecutar pruebas en archivos paralelos
  fullyParallel: true,
  
  // Evitar que un solo fallo detenga toda la suite
  forbidOnly: CI,
  
  // Reintentar pruebas fallidas automáticamente
  // En CI: 2 reintentos, en local: 0 reintentos
  retries: CI ? 2 : 0,
  
  // Número de workers paralelos
  // En CI: 1 worker, en local: usar la mitad de los CPUs disponibles
  workers: CI ? 1 : undefined,

  /**
   * Configuración de reportes
   * - HTML: Reporte interactivo con capturas y videos
   * - List: Reporte en consola durante la ejecución
   */
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['list'],
    ['json', { outputFile: 'test-results.json' }]
  ],

  /**
   * Configuración compartida para todos los proyectos
   */
  use: {
    // URL base de la aplicación
    baseURL: BASE_URL,

    // Capturar trace solo en el primer reintento
    trace: 'on-first-retry',

    // Capturar screenshot solo cuando falla
    screenshot: 'only-on-failure',

    // Grabar video solo cuando falla
    video: 'retain-on-failure',

    // Timeout para acciones individuales (10 segundos)
    actionTimeout: 10 * 1000,

    // Timeout para navegación (15 segundos)
    navigationTimeout: 15 * 1000,

    // Configuración de viewport
    viewport: { width: 1280, height: 720 },

    // Ignorar errores de HTTPS en desarrollo
    ignoreHTTPSErrors: true,

    // Configuración de permisos
    permissions: ['clipboard-read', 'clipboard-write'],
  },

  /**
   * Proyectos de prueba: diferentes navegadores y dispositivos
   */
  projects: [
    /**
     * Desktop Browsers
     */
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        // Configuración específica para Chrome
        launchOptions: {
          args: ['--disable-web-security'], // Para desarrollo con CORS
        }
      },
    },

    {
      name: 'firefox',
      use: { 
        ...devices['Desktop Firefox'] 
      },
    },

    {
      name: 'webkit',
      use: { 
        ...devices['Desktop Safari'] 
      },
    },

    /**
     * Mobile Browsers (comentados por defecto para velocidad)
     * Descomenta para probar en dispositivos móviles
     */
    // {
    //   name: 'Mobile Chrome',
    //   use: { 
    //     ...devices['Pixel 5'] 
    //   },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { 
    //     ...devices['iPhone 12'] 
    //   },
    // },

    /**
     * Branded Browsers (comentados por defecto)
     * Descomenta para probar en navegadores específicos
     */
    // {
    //   name: 'Microsoft Edge',
    //   use: { 
    //     ...devices['Desktop Edge'], 
    //     channel: 'msedge' 
    //   },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { 
    //     ...devices['Desktop Chrome'], 
    //     channel: 'chrome' 
    //   },
    // },
  ],

  /**
   * Servidor de desarrollo
   * Inicia la aplicación automáticamente antes de las pruebas
   * (Comentado para evitar conflictos si ya está corriendo)
   */
  // webServer: {
  //   command: 'npm run dev',
  //   url: BASE_URL,
  //   reuseExistingServer: !CI,
  //   timeout: 120 * 1000,
  // },

  /**
   * Directorio de salida para resultados de pruebas
   */
  outputDir: 'test-results/',

  /**
   * Configuración de paralelismo
   * Cada test file puede ejecutarse en paralelo, pero los tests
   * dentro del mismo archivo se ejecutan secuencialmente
   */
  fullyParallel: true,

  /**
   * Global Setup y Teardown
   * (Opcional: descomenta si necesitas setup/teardown global)
   */
  // globalSetup: require.resolve('./global-setup'),
  // globalTeardown: require.resolve('./global-teardown'),
});

