/**
 * Configuración de Serenity BDD para reportes avanzados
 * 
 * Esta configuración define cómo Serenity genera reportes HTML
 * y maneja los artifacts de las pruebas BDD.
 */

import { configure } from '@serenity-js/core';

configure({
  // Configuración del crew (reporters y listeners)
  crew: [
    // Reporter de consola para feedback inmediato
    '@serenity-js/console-reporter',
    
    // Reporter principal de Serenity BDD
    [
      '@serenity-js/serenity-bdd',
      {
        specDirectory: 'tests/bdd/features'
      }
    ],
    
    // Archivador de artifacts (screenshots, logs, etc.)
    [
      '@serenity-js/core:ArtifactArchiver',
      {
        outputDirectory: 'tests/bdd/reports'
      }
    ]
  ],
  
  // Configuración de caching
  cacheDir: 'tests/bdd/.cache',
  
  // Configuración de artifacts
  outputDirectory: 'tests/bdd/reports',
  
  // Configuración de screenshots
  takeScreenshotsOf: 'failures',
  
  // Configuración de logging
  verbose: true
});