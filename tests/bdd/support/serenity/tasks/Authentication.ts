import { Actor, Task } from '@serenity-js/core';
import { ManageTrackMyMoneyDataAbility } from '../abilities/ManageTrackMyMoneyData.js';
export class Authentication {
  static login = (userData?: any): Task =>
    Task.where(`#actor se autentica en TrackMyMoney`,
      (actor: Actor) => {
        const ability = ManageTrackMyMoneyDataAbility.as(actor);
        ability.authenticateUser(userData);
      }
    );
  static logout = (): Task =>
    Task.where(`#actor cierra sesión`,
      (actor: Actor) => {
        const ability = ManageTrackMyMoneyDataAbility.as(actor);
        ability.unauthenticateUser();
      }
    );
}
