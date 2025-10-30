import { Actor, Task } from '@serenity-js/core';
import { ManageTrackMyMoneyDataAbility } from '../abilities/ManageTrackMyMoneyData.js';
export class ManageGastos {
  static create = (monto: string, categoria: string): Task =>
    Task.where(`#actor registra un gasto de ${monto} en ${categoria}`,
      async (actor: Actor) => {
        const ability = ManageTrackMyMoneyDataAbility.as(actor);
        await ability.createGasto(monto, categoria);
      }
    );
  static viewAll = (): Task =>
    Task.where(`#actor consulta todos los gastos`,
      async (actor: Actor) => {
        const ability = ManageTrackMyMoneyDataAbility.as(actor);
        await ability.getGastos();
      }
    );
}
