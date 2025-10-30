import { Actor, Task } from '@serenity-js/core';
import { ManageTrackMyMoneyDataAbility } from '../abilities/ManageTrackMyMoneyData.js';
export class ManageCategorias {
  static create = (nombre: string): Task =>
    Task.where(`#actor crea una categoría "${nombre}"`,
      async (actor: Actor) => {
        const ability = ManageTrackMyMoneyDataAbility.as(actor);
        await ability.createCategoria(nombre);
      }
    );
  static viewAll = (): Task =>
    Task.where(`#actor consulta todas las categorías`,
      async (actor: Actor) => {
        const ability = ManageTrackMyMoneyDataAbility.as(actor);
        await ability.getCategorias();
      }
    );
}
