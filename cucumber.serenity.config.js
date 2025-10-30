/**
 * Configuración REAL de Cucumber con Serenity BDD
 */

module.exports = {
  default: {
    paths: ['tests/bdd/features/0*.feature'],
    require: [
      'serenity.config.ts',
      'tests/bdd/support/serenity-world.ts',
      'tests/bdd/step-definitions/serenity.steps.ts'
    ],
    requireModule: ['ts-node/register'],
    format: [
      'progress-bar',
      'summary',
      'json:tests/bdd/reports/serenity-cucumber-report.json',
      'html:tests/bdd/reports/serenity-cucumber-report.html'
    ],
    parallel: 1,
    retry: 0
  }
};