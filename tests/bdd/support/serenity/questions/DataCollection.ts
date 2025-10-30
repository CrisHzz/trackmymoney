import { Actor, Question } from '@serenity-js/core';
import { ManageTrackMyMoneyDataAbility } from '../abilities/ManageTrackMyMoneyData.js';
export class DataCollection {
  static isEmpty = (): Question<boolean> =>
    Question.about(`la colección está vacía`, (actor: Actor) => {
      const ability = ManageTrackMyMoneyDataAbility.as(actor);
      const response = ability.getLastResponse();
      const data = response?.data;
      return Array.isArray(data) && data.length === 0;
    });
  static hasCount = (expectedCount: number): Question<boolean> =>
    Question.about(`la colección tiene ${expectedCount} elementos`, (actor: Actor) => {
      const ability = ManageTrackMyMoneyDataAbility.as(actor);
      const response = ability.getLastResponse();
      const data = response?.data;
      return Array.isArray(data) && data.length === expectedCount;
    });
  static count = (): Question<number> =>
    Question.about(`el número de elementos en la colección`, (actor: Actor) => {
      const ability = ManageTrackMyMoneyDataAbility.as(actor);
      const response = ability.getLastResponse();
      const data = response?.data;
      return Array.isArray(data) ? data.length : 0;
    });
}
