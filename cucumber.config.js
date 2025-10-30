/**
 * Configuración simplificada de Cucumber para pruebas BDD
 * Compatible con npx cucumber-js y npm run test:bdd
 */

module.exports = {
  default: {
    paths: ['tests/bdd/features/0*.feature'],
    require: [
      'tests/bdd/support/simple-world.ts',
      'tests/bdd/step-definitions/simple.steps.ts'
    ],
    requireModule: ['ts-node/register'],
    format: [
      'progress-bar', 
      'summary',
      'json:tests/bdd/reports/cucumber-report.json',
      'html:tests/bdd/reports/cucumber-report.html'
    ],
    parallel: 1,
    retry: 0
  }
};