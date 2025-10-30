/**
 * Serenity BDD World - Configuración simplificada para Serenity
 */

import { setWorldConstructor } from '@cucumber/cucumber';

export class SerenityBDDWorld {
  public testData: any = {};
  public lastResponse: any = null;
  public currentUser: any = null;

  constructor() {
    console.log('🌍 Serenity BDD World inicializado');
  }

  public reset(): void {
    this.testData = {};
    this.lastResponse = null;
    this.currentUser = null;
  }

  public logMessage(message: string, data?: any): void {
    console.log(`🧪 [Serenity BDD] ${message}`, data ? JSON.stringify(data, null, 2) : '');
  }

  public log(message: string, data?: any): void {
    this.logMessage(message, data);
  }

  public setAuthenticatedUser(userData?: any): void {
    this.currentUser = {
      id: 'serenity_test_123',
      email: 'serenity@example.com',
      firstName: 'Serenity User',
      ...userData
    };
    this.log('👤 Usuario autenticado configurado (Serenity):', this.currentUser.email);
  }

  public setUnauthenticatedUser(): void {
    this.currentUser = null;
    this.log('🚫 Usuario no autenticado configurado (Serenity)');
  }

  public setLastResponse(response: any): void {
    this.lastResponse = response;
  }

  public wasLastRequestSuccessful(): boolean {
    if (!this.lastResponse) return false;
    return this.lastResponse.status >= 200 && this.lastResponse.status < 300;
  }

  public getLastError(): string | undefined {
    return this.lastResponse?.error;
  }

  public storeTestData(type: string, data: any): void {
    if (!this.testData[type]) {
      this.testData[type] = [];
    }
    this.testData[type].push(data);
  }

  public getTestData(type: string): any[] {
    return this.testData[type] || [];
  }
}

setWorldConstructor(SerenityBDDWorld);