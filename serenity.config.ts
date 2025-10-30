/**
 * Configuración simplificada de Serenity BDD
 */

import { configure } from '@serenity-js/core';

configure({
  crew: [
    '@serenity-js/console-reporter',
    [ '@serenity-js/serenity-bdd', {
      specDirectory: 'tests/bdd/features',
      outputDirectory: 'tests/bdd/reports/serenity'
    }]
  ]
});