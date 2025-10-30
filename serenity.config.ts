/**
 * Configuración REAL de Serenity BDD
 */

import { configure, Cast, Actor } from '@serenity-js/core';

class TrackMyMoneyCast implements Cast {
  prepare(actor: Actor): Actor {
    return actor;
  }
}

configure({
  crew: [
    '@serenity-js/console-reporter',
    [ '@serenity-js/serenity-bdd', {
      specDirectory: 'tests/bdd/features',
      outputDirectory: 'tests/bdd/reports/serenity'
    }]
  ],
  actors: new TrackMyMoneyCast()
});