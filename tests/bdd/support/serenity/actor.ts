import { Actor, Cast } from '@serenity-js/core';
import { ManageTrackMyMoneyData } from './abilities/ManageTrackMyMoneyData.js';
export class TrackMyMoneyCast implements Cast {
  prepare(actor: Actor): Actor {
    return actor.whoCan(
      ManageTrackMyMoneyData.usingMockAPI()
    );
  }
}
export const actors = () => new TrackMyMoneyCast();
