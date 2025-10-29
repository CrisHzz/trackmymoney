/**
 * Configuración de Cucumber para pruebas BDD
 */

module.exports = {
  default: {
    paths: ['tests/bdd/features/**/*.feature'],
    require: [
      'tests/bdd/support/jest-setup.ts',
      'tests/bdd/support/simple-world.ts',
      'tests/bdd/step-definitions/**/*.ts'
    ],
    requireModule: ['ts-node/register'],
    format: ['progress-bar'],
    parallel: 1
  }
};