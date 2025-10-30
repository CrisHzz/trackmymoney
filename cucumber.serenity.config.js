/**
 * Configuración de Cucumber con reportes HTML mejorados
 * (Serenity deshabilitado por incompatibilidad de versiones)
 */

module.exports = {
  default: {
    paths: ['tests/bdd/features/0*.feature'],
    require: [
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
    formatOptions: {
      html: {
        theme: 'bootstrap'
      }
    },
    parallel: 1,
    retry: 0
  }
};