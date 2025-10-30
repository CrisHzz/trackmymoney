import { Actor, Question } from '@serenity-js/core';
import { ManageTrackMyMoneyDataAbility } from '../abilities/ManageTrackMyMoneyData.js';
export class APIResponse {
  static wasSuccessful = (): Question<boolean> =>
    Question.about(`la última respuesta fue exitosa`, (actor: Actor) => {
      const ability = ManageTrackMyMoneyDataAbility.as(actor);
      return ability.wasLastRequestSuccessful();
    });
  static status = (): Question<number> =>
    Question.about(`el status de la última respuesta`, (actor: Actor) => {
      const ability = ManageTrackMyMoneyDataAbility.as(actor);
      const response = ability.getLastResponse();
      return response?.status || 0;
    });
  static data = (): Question<any> =>
    Question.about(`los datos de la última respuesta`, (actor: Actor) => {
      const ability = ManageTrackMyMoneyDataAbility.as(actor);
      const response = ability.getLastResponse();
      return response?.data;
    });
  static error = (): Question<string | undefined> =>
    Question.about(`el error de la última respuesta`, (actor: Actor) => {
      const ability = ManageTrackMyMoneyDataAbility.as(actor);
      const response = ability.getLastResponse();
      return response?.error;
    });
  static hasAuthenticationError = (): Question<boolean> =>
    Question.about(`la respuesta tiene error de autenticación`, (actor: Actor) => {
      const ability = ManageTrackMyMoneyDataAbility.as(actor);
      const response = ability.getLastResponse();
      return response?.status === 401;
    });
}
