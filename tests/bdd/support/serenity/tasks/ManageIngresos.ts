import { Actor, Task } from '@serenity-js/core';
import { ManageTrackMyMoneyDataAbility } from '../abilities/ManageTrackMyMoneyData.js';
export class ManageIngresos {
  static create = (monto: string, tipo: string): Task =>
    Task.where(`#actor registra un ingreso de ${monto} como ${tipo}`,
      async (actor: Actor) => {
        const ability = ManageTrackMyMoneyDataAbility.as(actor);
        await ability.createIngreso(monto, tipo);
      }
    );
  static viewAll = (): Task =>
    Task.where(`#actor consulta todos los ingresos`,
      async (actor: Actor) => {
        const ability = ManageTrackMyMoneyDataAbility.as(actor);
        await ability.getIngresos();
      }
    );
}
