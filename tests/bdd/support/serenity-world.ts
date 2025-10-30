import { setWorldConstructor } from '@cucumber/cucumber';
import { actorCalled } from '@serenity-js/core';
export class SerenityBDDWorld {
  public actor: any;
  constructor() {
    this.actor = actorCalled('Usuario de TrackMyMoney');
  }
  public reset(): void {
  }
  public log(message: string, data?: any): void {
    console.log(`[Serenity Actor] ${message}`, data ? JSON.stringify(data, null, 2) : '');
  }
}
setWorldConstructor(SerenityBDDWorld);
