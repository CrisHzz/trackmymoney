import { Actor, Question } from '@serenity-js/core';
import { ManageTrackMyMoneyDataAbility } from '../abilities/ManageTrackMyMoneyData.js';
export class DataItem {
  static hasMonto = (expectedMonto: string): Question<boolean> =>
    Question.about(`el elemento tiene monto ${expectedMonto}`, (actor: Actor) => {
      const ability = ManageTrackMyMoneyDataAbility.as(actor);
      const response = ability.getLastResponse();
      const data = response?.data;
      return data?.monto === expectedMonto;
    });
  static hasNombre = (expectedNombre: string): Question<boolean> =>
    Question.about(`el elemento tiene nombre ${expectedNombre}`, (actor: Actor) => {
      const ability = ManageTrackMyMoneyDataAbility.as(actor);
      const response = ability.getLastResponse();
      const data = response?.data;
      return data?.nombre === expectedNombre;
    });
  static monto = (): Question<string> =>
    Question.about(`el monto del elemento`, (actor: Actor) => {
      const ability = ManageTrackMyMoneyDataAbility.as(actor);
      const response = ability.getLastResponse();
      const data = response?.data;
      return data?.monto || '';
    });
  static nombre = (): Question<string> =>
    Question.about(`el nombre del elemento`, (actor: Actor) => {
      const ability = ManageTrackMyMoneyDataAbility.as(actor);
      const response = ability.getLastResponse();
      const data = response?.data;
      return data?.nombre || '';
    });
}
